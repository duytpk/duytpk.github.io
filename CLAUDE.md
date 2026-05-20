# CLAUDE.md

Guidance for working in this repository.

## Project

**Personal DevSecOps Hub** — a sci-fi / cyberpunk single-page app with two sections:

1. **News Dashboard** (`/`) — tech-news aggregator with tabs **Vulnerabilities/CVE**,
   **Virtualization & Cloud**, **System/Kernel**. Reads `src/data/news.json`,
   refetches it client-side every 5 min, shows a "Last updated" time.
2. **Learning Roadmap** (`/roadmap`) — Linux / Terraform / Kubernetes task tracks
   with checkboxes whose state is saved in `localStorage`.

Deployed to **GitHub Pages** (Actions source) on the custom domain **duytpk.me**.

## Stack

| Concern   | Choice                                                    |
| --------- | --------------------------------------------------------- |
| Build     | Vite 6                                                    |
| UI        | React **18** + `@arwes/react` (sci-fi UI primitives)      |
| Routing   | `react-router-dom` v6, `BrowserRouter`                    |
| Automation| Node script + `rss-parser`                                |
| CI/CD     | GitHub Actions → GitHub Pages                             |

> **React is pinned to 18.x** because `@arwes/react@1.0.0-next.25020502` declares
> React 18 as a peer dependency. React 19 causes an `ERESOLVE` install failure.

## Commands

Requires Node 20+.

```bash
npm install        # install deps
npm run dev        # dev server (http://localhost:5173)
npm run build      # production build -> dist/
npm run preview    # preview the production build
npm run lint       # eslint
npm run fetch-news # run the RSS aggregator -> src/data/news.json
```

## Layout

```
src/
  main.jsx               # entry: BrowserRouter
  App.jsx                # AnimatorGeneralProvider + BleepsProvider + routes
  arwesConfig.js         # animator durations + bleep (sound) settings
  index.css / app.css    # theme tokens (index) + layout/components (app)
  components/
    AppShell.jsx         # header, nav, status line, Background, footer, <Outlet/>
    Background.jsx       # Arwes GridLines + Dots + MovingLines (fixed full-screen)
    Panel.jsx            # FrameCorners/Octagon/Nefrex/Underline panel wrapper
    Scramble.jsx         # decipher/"typewriter" Text
    ConfirmModal.jsx     # themed confirm popup (used by Roadmap reset)
  pages/
    Dashboard.jsx        # news tabs + auto-refresh
    Roadmap.jsx          # tracks + localStorage progress + reset modal
    NotFound.jsx
  hooks/
    useNews.js           # fetch /news.json + interval refresh (seed fallback)
    useLocalStorageState.js
  data/
    news.json            # generated feed (also served at /news.json)
    roadmap.js           # roadmap tracks + tasks (ids are localStorage keys)
public/                  # sounds/, favicon.svg, CNAME, .nojekyll
scripts/fetch-news.js    # standalone RSS aggregator
.github/workflows/
  deploy.yml             # build + deploy to Pages (push main / dispatch)
  update-news.yml        # hourly cron: refresh news.json + dispatch deploy
```

## How data flows

- `news.json` is the single source of truth for the dashboard. A small Vite
  plugin in `vite.config.js` serves it at `/news.json` (dev: middleware reads
  `src/data/news.json` fresh each request; build: copies it into `dist/` and also
  emits `404.html` for SPA deep-link routing).
- `scripts/fetch-news.js` pulls multiple RSS feeds per category, merges + dedupes
  (by link) + sorts newest-first, and overwrites `src/data/news.json`.
  - To change feeds, edit the `SOURCES` array. Each entry's `category` **must** be
    one of `cve` / `cloud` / `system` (these map to the Dashboard tabs in
    `src/pages/Dashboard.jsx`).
  - The script forces `process.exit(0)` at the end — `rss-parser` leaves keep-alive
    sockets open, which otherwise hangs the CI step. Keep that.

## Automation / deploy

- `update-news.yml` runs hourly (cron `0 * * * *`): `fetch-news` → commit `news.json`
  if changed → `gh workflow run deploy.yml` (the default `GITHUB_TOKEN` push does
  not itself trigger other workflows, hence the explicit dispatch).
- `deploy.yml` runs on push to `main` (and dispatch): `npm ci` → `npm run build` →
  upload + deploy to Pages.
- One-time setup: **Settings → Pages → Source = GitHub Actions**. Custom domain via
  `public/CNAME` (`duytpk.me`). No extra secrets needed.
- After a deploy, GitHub Pages caches `index.html` (`max-age=600`); hard-refresh
  (Ctrl+Shift+R) to see changes immediately. Asset files are content-hashed.

## @arwes/react notes (this pinned version)

- Frame components are named **without** the `SVG` infix: `FrameCorners`,
  `FrameOctagon`, `FrameNefrex`, `FrameUnderline`, `FrameLines`, `FrameKranox`.
- Frame colours are set via CSS custom properties on the frame element:
  `--arwes-frames-bg-color`, `--arwes-frames-line-color`, `*-filter`
  (see the `.frame--*` classes in `index.css`).
- `Text` (via `Scramble`) needs an active `Animator` ancestor to animate; it uses
  `manager="decipher"` and `hideOnExited={false}` so content is never hidden.
- Bleeps: `BleepsProvider` config uses `bleeps={{ name: { sources:[{src,type}], category } }}`;
  sounds live in `public/sounds/*.wav`. Playback only starts after a user gesture.

### Known limitation
The Arwes **canvas backgrounds** (`GridLines`/`Dots`/`MovingLines`) render
incorrectly on displays with `devicePixelRatio != 1` (e.g. Windows 125% scaling):
the grid can leave an unpainted band. This is a library bug. If full, dpr-proof
coverage is ever required, draw the grid with CSS instead of the Arwes canvas.

## Conventions

- Keep React on 18.x. Don't add a competing CSS background grid alongside the Arwes
  canvas grid (causes a visible double grid).
- Don't hand-edit `src/data/news.json`; it is regenerated by the workflow.
- Roadmap task `id`s in `src/data/roadmap.js` are localStorage keys — renaming them
  drops saved user progress.
