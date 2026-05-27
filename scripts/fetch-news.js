#!/usr/bin/env node
/**
 * fetch-news.js — standalone news aggregator.
 *
 * Pulls items from several RSS feeds grouped into three categories
 * (security/CVE, virtualization/cloud, linux/system), merges all sources of a
 * category into one list (deduped by link, newest first), and overwrites
 * `src/data/news.json`. Runs locally (`npm run fetch-news`) and in CI
 * (.github/workflows/update-news.yml).
 *
 * Resilient by design:
 *  - a single failing feed is skipped, the others still aggregate;
 *  - if every source in a category fails, the previously stored items for that
 *    category are kept instead of wiping the tab.
 */
import Parser from 'rss-parser'
import { writeFile, readFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../src/data/news.json')

// Tab order in the dashboard. Each key must match a tab in src/pages/Dashboard.jsx.
const CATEGORIES = ['cve', 'ai', 'virtualization']

// Reputable sources per category. Add/remove freely; just keep `category` as
// one of CATEGORIES above. Multiple entries with the same category are merged.
const SOURCES = [
  // ---- CVE ----
  { category: 'cve', name: 'cvefeed.io', url: 'https://cvefeed.io/rssfeed/latest.xml', limit: 50 },

  // ---- AI ----
  { category: 'ai', name: 'Google AI Blog', url: 'https://blog.google/technology/ai/rss/', limit: 20 },
  { category: 'ai', name: 'AWS Machine Learning Blog', url: 'https://aws.amazon.com/blogs/machine-learning/feed/', limit: 20 },
  { category: 'ai', name: 'MarkTechPost', url: 'https://www.marktechpost.com/feed/', limit: 20 },
  { category: 'ai', name: "Simon Willison's Weblog", url: 'https://simonwillison.net/atom/entries/', limit: 20 },

  // ---- Virtualization ----
  { category: 'virtualization', name: 'Virtualization HowTo', url: 'https://www.virtualizationhowto.com/feed/', limit: 30 },

]

const CAT_LIMIT = SOURCES.reduce((acc, src) => {
  acc[src.category] = (acc[src.category] || 0) + (src.limit || 10)
  return acc
}, {})

const parser = new Parser({
  timeout: 20000,
  headers: {
    // A browser-like UA reduces 403s from feeds that block unknown bots.
    'User-Agent':
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
  },
})

const SNIPPET_MAX_CHARS = 280
const TITLE_MAX_CHARS   = 200

/** Parse CVE score, severity level, and description from cvefeed.io HTML description. */
function parseCVEFields(raw) {
  const text = String(raw || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ')

  // Primary pattern: "Severity : 9.8 | CRITICAL"
  let sevMatch = text.match(/Severity\s*:\s*([\d.]+)\s*\|\s*([A-Za-z]+)/i)
  // Fallback: "CVSS: 7.5 HIGH" or "CVSS: 7.5 (HIGH)"
  if (!sevMatch) sevMatch = text.match(/CVSS(?:\s+Score)?\s*:?\s*([\d.]+)\s*[\(|,\s]+([A-Za-z]+)/i)

  let cveScore    = sevMatch ? parseFloat(sevMatch[1]) : null
  let cveSeverity = sevMatch ? sevMatch[2].toUpperCase() : null

  // If regex found a score but no level, derive from CVSS thresholds
  if (!cveSeverity && cveScore != null) {
    if (cveScore >= 9.0)      cveSeverity = 'CRITICAL'
    else if (cveScore >= 7.0) cveSeverity = 'HIGH'
    else if (cveScore >= 4.0) cveSeverity = 'MEDIUM'
    else                      cveSeverity = 'LOW'
  }

  if (!sevMatch) console.log('[DEBUG parseCVE] no match, sample:', text.slice(0, 300))

  const descMatch = text.match(/Description\s*:\s*(.+?)\s*Severity\s*:/is)
  const snippet = descMatch ? descMatch[1].trim() : ''
  return { cveScore, cveSeverity: cveSeverity || 'NA', contentSnippet: clean(snippet) }
}

/** Strip HTML/whitespace and clamp length. */
function clean(value, max = SNIPPET_MAX_CHARS) {
  return String(value || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

/** Fetch one feed and normalise its top items. */
async function fetchFeed(src) {
  const feed = await parser.parseURL(src.url)
  return (feed.items || []).slice(0, src.limit || 10).map((item) => {
    const base = {
      title: clean(item.title, TITLE_MAX_CHARS) || 'Untitled',
      link: item.link || '#',
      source: src.name,
      isoDate: item.isoDate || item.pubDate || null,
      contentSnippet: clean(item.contentSnippet || item.summary || item.content),
    }
    if (src.category === 'cve') {
      const cveFields = parseCVEFields(item.content || item.contentSnippet || '')
      return Object.assign(base, cveFields)
    }
    return base
  })
}

/** Dedupe by link, sort newest first, cap length. */
function mergeItems(items, limit) {
  const seen = new Set()
  const unique = []
  for (const it of items) {
    const key = it.link && it.link !== '#' ? it.link : `${it.source}:${it.title}`
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(it)
  }
  unique.sort((a, b) => {
    if (!a.isoDate) return 1
    if (!b.isoDate) return -1
    return new Date(b.isoDate) - new Date(a.isoDate)
  })
  return unique.slice(0, limit)
}

async function loadPrevious() {
  try {
    return JSON.parse(await readFile(OUT, 'utf8'))
  } catch {
    return { feeds: {} }
  }
}

async function main() {
  const previous = await loadPrevious()
  const collected = Object.fromEntries(CATEGORIES.map((c) => [c, []]))

  // Fetch every source; merge per category as we go.
  await Promise.all(
    SOURCES.map(async (src) => {
      try {
        const items = await fetchFeed(src)
        collected[src.category].push(...items)
        console.log(`  ✓ [${src.category}] ${src.name}: ${items.length} items`)
      } catch (err) {
        console.error(`  ✗ [${src.category}] ${src.name} failed: ${err.message}`)
      }
    }),
  )

  const feeds = {}
  for (const cat of CATEGORIES) {
    const merged = mergeItems(collected[cat], CAT_LIMIT[cat] ?? 10)
    // If a whole category failed, keep what we had rather than emptying the tab.
    feeds[cat] = merged.length ? merged : previous.feeds?.[cat] || []
    console.log(`→ ${cat}: ${feeds[cat].length} items`)
  }

  const output = { updatedAt: new Date().toISOString(), generator: 'rss', feeds }

  await mkdir(dirname(OUT), { recursive: true })
  await writeFile(OUT, JSON.stringify(output, null, 2) + '\n', 'utf8')
  console.log(`✓ wrote ${OUT}`)
}

main()
  // rss-parser can leave keep-alive HTTP sockets open, which stops Node from
  // exiting on its own and makes the CI step hang. Force a clean exit.
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
