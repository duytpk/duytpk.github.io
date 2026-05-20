# Personal DevSecOps Hub

A personal learning + tech-news hub with a **sci-fi / cyberpunk lab-terminal**
aesthetic, built with **Vite + React + [@arwes/react](https://arwes.dev)** and
deployed to GitHub Pages (custom domain: **duytpk.me**).

## Features

- **News Dashboard** (`/`) — glowing Arwes frames split into tabs:
  _Vulnerabilities / CVE_, _Virtualization & Cloud_, _System / Kernel_. Data is
  loaded from `src/data/news.json`, refetched client-side every 5 minutes, and
  shows a **Last updated** timestamp.
- **Learning Roadmap** (`/roadmap`) — timeline of tasks for **Linux**,
  **Terraform** and **Kubernetes** with checkboxes whose completion state is
  saved in **localStorage**.
- Cyberpunk styling: neon glow frames, animated grid background, decipher
  "typewriter" text, CRT scanlines and click **bleep** sounds (Arwes Bleeps).
- **Automated hourly news updates** via GitHub Actions + `rss-parser`.

## Tech stack

| Concern    | Choice                                            |
| ---------- | ------------------------------------------------- |
| Build      | Vite 6                                            |
| UI         | React 18 + `@arwes/react` (sci-fi UI primitives)  |
| Routing    | `react-router-dom` v6 (`BrowserRouter`)           |
| Automation | Node script + `rss-parser`                        |
| CI/CD      | GitHub Actions → GitHub Pages                     |

> React is pinned to **18.x** because `@arwes/react` declares React 18 as a peer
> dependency.

## Local development

Requires Node.js 20+.

```bash
npm install        # install dependencies (creates node_modules)
npm run dev        # start the dev server (http://localhost:5173)
npm run build      # production build into dist/
npm run preview    # preview the production build
npm run fetch-news # run the RSS aggregator -> src/data/news.json
```

## Project structure

```
src/
  arwesConfig.js          # Arwes animation timings + bleep sound settings
  App.jsx                 # providers + routes
  components/
    AppShell.jsx          # header, nav, status line, background, footer
    Background.jsx        # animated Arwes grid background
    Panel.jsx             # glowing FrameSVG panel
    Scramble.jsx          # decipher/typewriter text
  pages/
    Dashboard.jsx         # news dashboard with tabs + auto-refresh
    Roadmap.jsx           # learning roadmap with localStorage progress
    NotFound.jsx
  hooks/
    useNews.js            # fetch + interval refresh of news.json
    useLocalStorageState.js
  data/
    news.json             # generated news feed (also served at /news.json)
    roadmap.js            # roadmap tracks + tasks
public/
  sounds/                 # click / type / assemble bleeps (wav)
  CNAME, .nojekyll
scripts/
  fetch-news.js           # standalone RSS aggregator
.github/workflows/
  deploy.yml              # build + deploy to GitHub Pages
  update-news.yml         # hourly cron: refresh news.json + trigger deploy
```

`news.json` lives in `src/data/`. A small Vite plugin (`vite.config.js`) serves
it at `/news.json` during dev (read fresh from disk on every request) and copies
it into the build output for production, so the dashboard can refetch it
client-side without a rebuild.

## Automation — how the hourly update works

`.github/workflows/update-news.yml` runs **every hour** (cron `0 * * * *`):

1. `npm run fetch-news` pulls the latest items from the configured RSS feeds and
   overwrites `src/data/news.json`.
2. If the file changed, it is committed and pushed by `github-actions[bot]`.
3. The workflow then dispatches `deploy.yml` to rebuild and redeploy the site.

Edit the `SOURCES` array in [`scripts/fetch-news.js`](scripts/fetch-news.js) to
change the feeds. The defaults are samples:

- **CVE / security** — The Hacker News
- **Virtualization & Cloud** — Docker Blog
- **System / Kernel** — Phoronix

## One-time GitHub setup

1. Push this repo to `github.com/duytpk/duytpk.github.io`.
2. In **Settings → Pages**, set **Source = GitHub Actions**.
3. Keep the custom domain `duytpk.me` (the `CNAME` file is included in the
   build via `public/CNAME`).
4. `deploy.yml` and `update-news.yml` use the built-in `GITHUB_TOKEN`; no extra
   secrets are required.
