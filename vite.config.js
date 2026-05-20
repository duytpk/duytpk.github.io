import { fileURLToPath } from 'node:url'
import { readFileSync, copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const NEWS_SRC = fileURLToPath(new URL('./src/data/news.json', import.meta.url))

/**
 * Serves `src/data/news.json` at the site root as `/news.json`.
 *
 * - In dev: a middleware reads the file fresh from disk on every request (with
 *   no-cache headers), so editing or regenerating the data is reflected live
 *   without restarting the dev server.
 * - In build: the file is copied into the output dir as `news.json`, plus a
 *   `404.html` fallback is emitted so client-side (BrowserRouter) deep links
 *   resolve on GitHub Pages.
 */
function newsAndSpaPlugin() {
  let outDir = 'dist'
  return {
    name: 'devsecops-news-and-spa',
    configResolved(config) {
      outDir = config.build.outDir
    },
    configureServer(server) {
      server.middlewares.use('/news.json', (_req, res) => {
        try {
          const data = readFileSync(NEWS_SRC, 'utf8')
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.setHeader('Cache-Control', 'no-store')
          res.end(data)
        } catch {
          res.statusCode = 404
          res.end('{"error":"news.json not found"}')
        }
      })
    },
    closeBundle() {
      const root = resolve(process.cwd(), outDir)
      if (existsSync(NEWS_SRC)) {
        copyFileSync(NEWS_SRC, resolve(root, 'news.json'))
      }
      const indexHtml = resolve(root, 'index.html')
      if (existsSync(indexHtml)) {
        copyFileSync(indexHtml, resolve(root, '404.html'))
      }
    },
  }
}

// Custom domain (duytpk.me) is served from the site root, so base = '/'.
// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), newsAndSpaPlugin()],
})
