import { readFileSync, copyFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
  let root = process.cwd()
  let outDir = 'dist'
  const newsSrc = () => resolve(root, 'src/data/news.json')

  return {
    name: 'devsecops-news-and-spa',
    configResolved(config) {
      root = config.root
      outDir = config.build.outDir
    },
    configureServer(server) {
      server.middlewares.use('/news.json', (_req, res) => {
        try {
          const data = readFileSync(newsSrc(), 'utf8')
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.setHeader('Cache-Control', 'no-store')
          res.end(data)
        } catch {
          res.statusCode = 404
          res.end('{"error":"news.json not found"}')
        }
      })
    },
    // writeBundle runs after the output files have been written to disk, so the
    // output dir and index.html are guaranteed to exist here.
    writeBundle(outputOptions) {
      const dir = outputOptions.dir || resolve(root, outDir)
      mkdirSync(dir, { recursive: true })

      const src = newsSrc()
      if (existsSync(src)) {
        copyFileSync(src, resolve(dir, 'news.json'))
      }

      const indexHtml = resolve(dir, 'index.html')
      if (existsSync(indexHtml)) {
        copyFileSync(indexHtml, resolve(dir, '404.html'))
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
