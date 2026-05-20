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
const CATEGORIES = ['cve', 'cloud', 'system']

// Reputable sources per category. Add/remove freely; just keep `category` as
// one of CATEGORIES above. Multiple entries with the same category are merged.
const SOURCES = [
  // ---- Vulnerabilities / CVE / security ----
  { category: 'cve', name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews' },
  { category: 'cve', name: 'Krebs on Security', url: 'https://krebsonsecurity.com/feed/' },
  { category: 'cve', name: 'SANS Internet Storm Center', url: 'https://isc.sans.edu/rssfeed.xml' },
  { category: 'cve', name: 'Dark Reading', url: 'https://www.darkreading.com/rss.xml' },

  // ---- Virtualization & Cloud ----
  { category: 'cloud', name: 'Docker Blog', url: 'https://www.docker.com/blog/feed/' },
  { category: 'cloud', name: 'Kubernetes Blog', url: 'https://kubernetes.io/feed.xml' },
  { category: 'cloud', name: 'AWS News', url: 'https://aws.amazon.com/blogs/aws/feed/' },
  { category: 'cloud', name: 'Red Hat Blog', url: 'https://www.redhat.com/en/rss/blog' },

  // ---- System / Kernel / Linux ----
  { category: 'system', name: 'LWN.net', url: 'https://lwn.net/headlines/newrss' },
  { category: 'system', name: "It's FOSS", url: 'https://itsfoss.com/feed/' },
  { category: 'system', name: 'kernel.org', url: 'https://www.kernel.org/feeds/kdist.xml' },
]

const PER_SOURCE = 6 // items taken from each feed
const PER_CATEGORY = 15 // items kept per tab after merging

const parser = new Parser({
  timeout: 20000,
  headers: {
    // A browser-like UA reduces 403s from feeds that block unknown bots.
    'User-Agent':
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
  },
})

/** Strip HTML/whitespace and clamp length. */
function clean(value, max = 280) {
  return String(value || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

/** Fetch one feed and normalise its top items. */
async function fetchFeed(src) {
  const feed = await parser.parseURL(src.url)
  return (feed.items || []).slice(0, PER_SOURCE).map((item) => ({
    title: clean(item.title, 200) || 'Untitled',
    link: item.link || '#', // per-article URL — used by the clickable title
    source: src.name,
    isoDate: item.isoDate || item.pubDate || new Date().toISOString(),
    contentSnippet: clean(item.contentSnippet || item.summary || item.content),
  }))
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
  unique.sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate))
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
    const merged = mergeItems(collected[cat], PER_CATEGORY)
    // If a whole category failed, keep what we had rather than emptying the tab.
    feeds[cat] = merged.length ? merged : previous.feeds?.[cat] || []
    console.log(`→ ${cat}: ${feeds[cat].length} items`)
  }

  const output = { updatedAt: new Date().toISOString(), generator: 'rss', feeds }

  await mkdir(dirname(OUT), { recursive: true })
  await writeFile(OUT, JSON.stringify(output, null, 2) + '\n', 'utf8')
  console.log(`✓ wrote ${OUT}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
