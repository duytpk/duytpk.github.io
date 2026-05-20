#!/usr/bin/env node
/**
 * fetch-news.js — standalone news aggregator.
 *
 * Pulls items from a few RSS feeds (security/CVE, virtualization/cloud,
 * linux/system), normalizes them into a stable shape, and overwrites
 * `src/data/news.json`. Designed to run locally (`npm run fetch-news`) and in
 * CI (.github/workflows/update-news.yml).
 *
 * Resilient by design: a single failing feed keeps the previously stored items
 * for that category instead of aborting the whole run.
 */
import Parser from 'rss-parser'
import { writeFile, readFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../src/data/news.json')

// Sample sources — swap these for your preferred feeds at any time.
const SOURCES = [
  // Vulnerabilities / CVE / security
  { category: 'cve', name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews' },
  // Virtualization & Cloud (Docker / containers)
  { category: 'cloud', name: 'Docker Blog', url: 'https://www.docker.com/blog/feed/' },
  // System / Kernel / Linux
  { category: 'system', name: 'Phoronix', url: 'https://www.phoronix.com/rss.php' },
]

const MAX_ITEMS = 8

const parser = new Parser({
  timeout: 20000,
  headers: { 'User-Agent': 'DevSecOpsHub/1.0 (+https://duytpk.me)' },
})

/** Strip HTML/whitespace and clamp length. */
function clean(value, max = 280) {
  return String(value || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

async function fetchFeed(src) {
  const feed = await parser.parseURL(src.url)
  return (feed.items || []).slice(0, MAX_ITEMS).map((item) => ({
    title: clean(item.title, 200) || 'Untitled',
    link: item.link || '#',
    source: src.name,
    isoDate: item.isoDate || item.pubDate || new Date().toISOString(),
    contentSnippet: clean(item.contentSnippet || item.summary || item.content),
  }))
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
  const feeds = {}

  for (const src of SOURCES) {
    try {
      console.log(`→ [${src.category}] fetching ${src.url}`)
      feeds[src.category] = await fetchFeed(src)
      console.log(`  ✓ ${feeds[src.category].length} items`)
    } catch (err) {
      console.error(`  ✗ failed (${err.message}); keeping previous items`)
      feeds[src.category] = previous.feeds?.[src.category] || []
    }
  }

  const output = {
    updatedAt: new Date().toISOString(),
    generator: 'rss',
    feeds,
  }

  await mkdir(dirname(OUT), { recursive: true })
  await writeFile(OUT, JSON.stringify(output, null, 2) + '\n', 'utf8')
  console.log(`✓ wrote ${OUT}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
