# CLAUDE.md

Guidance for working in this repository.

## Project

**Neon Protocol DevSecOps Hub** — a cyberpunk/hacker-aesthetic static multi-page site with two pages:

1. **CVE Dashboard** (`index.html`) — tech-news aggregator with tabs **CVE_FEED**,
   **CLOUD_FEED**, **SYS_KERNEL**. Fetches `news.json` at runtime, auto-refreshes every 5 min.
2. **Learning Roadmap** (`roadmap.html`) — Linux / Terraform / Kubernetes node-based
   progress flow. Node states (COMPLETED/IN_PROGRESS/LOCKED) are derived from task
   checkboxes saved in `localStorage`.

Deployed to **GitHub Pages** (Actions source) on the custom domain **duytpk.me**.

> **The site is zero-dependency static HTML.** No npm, no build step, no node_modules
> needed to run it. Open `index.html` in a browser, or serve with `python3 -m http.server`.

---

## Stack

| Concern    | Choice                                              |
| ---------- | --------------------------------------------------- |
| Pages      | Plain HTML5 (`index.html`, `roadmap.html`, `404.html`) |
| Styles     | **Tailwind CSS CDN** + `assets/cyber-neon.css` (custom) |
| Logic      | Vanilla JS (`assets/app.js`, `assets/dashboard.js`, `assets/roadmap-page.js`) |
| Icons      | Google Material Symbols (CDN `<link>`)              |
| Fonts      | **Sora** (headings) + **JetBrains Mono** (labels/data) via Google Fonts CDN |
| Automation | Node script + `rss-parser`                          |
| CI/CD      | GitHub Actions → GitHub Pages (no build step)       |

---

## File layout

```
(repo root)
  index.html            # CVE Dashboard — full shell + card grid
  roadmap.html          # Learning Roadmap — node flow + summary widgets
  404.html              # Not Found page
  news.json             # Served at /news.json; synced from src/data/news.json by workflow

assets/
  cyber-neon.css        # Minimal custom CSS: scanline, bracket-corner, glow, scrollbar
  app.js                # Common shell: live UTC clock, nav highlight, scramble effect
  dashboard.js          # CVE dashboard: fetch news.json, render cards, tab switch, auto-refresh
  roadmap-page.js       # Roadmap: localStorage state, node render, progress, reset modal

public/
  favicon.svg
  CNAME                 # duytpk.me
  sounds/               # (legacy, unused by static site)

src/                    # Legacy React source — kept for reference, NOT used by the static site
  data/
    news.json           # Authoritative feed; workflow writes here first
    roadmap.js          # Roadmap data (ported inline into roadmap-page.js)
  ...                   # All other React components / hooks

scripts/
  fetch-news.js         # RSS aggregator → overwrites src/data/news.json

.github/workflows/
  deploy.yml            # Assembles _site/ from static files → deploys to Pages
  update-news.yml       # Hourly: fetch-news → commit both src/data/news.json AND root news.json
```

---

## Design system — Neon Protocol

Design tokens live in the **Tailwind config block** at the top of each HTML file (no separate config file). Reference: `stitch_hacker_news_dashboard/neon_protocol/DESIGN.md`.

### Color tokens (Tailwind class names)
| Token | Hex | Usage |
|---|---|---|
| `surface-container-lowest` | `#0e0e10` | Body background |
| `surface-container-low` | `#1c1b1d` | SideNav, card backgrounds |
| `surface-container` | `#201f21` | Panel fills |
| `primary` | `#e1fdff` | Main text on dark, nav links |
| `primary-fixed-dim` | `#00dbe7` | Neon cyan accent, glow |
| `secondary` | `#ffabf3` | Active nav, magenta accent, FORCE_SYNC border |
| `outline-variant` | `#3a494b` | Borders, dividers |
| `on-tertiary-container` | `#605f64` | Muted labels, metadata |
| `error` | `#ffb4ab` | Error states, reset button |

### Typography
- **Headings/brand**: `font-display-lg` / `font-headline-lg` / `font-headline-md` → Sora
- **Body/labels/data**: `font-body-md` / `font-label-caps` → JetBrains Mono
- All caps labels use `tracking-widest` and `uppercase`.

### Component patterns
- **Cards**: `bg-surface-container-low border border-outline-variant p-6 hover:border-primary-fixed-dim` + `.bracket-corner` decoration div in top-left corner.
- **Active nav**: `bg-secondary/10 text-secondary border-l-4 border-secondary`
- **Glow**: `.glow-cyan` (cyan box-shadow) / `.glow-magenta` (magenta box-shadow) / `.neon-text-glow` (text-shadow)
- **Scanline**: `<div class="scanline-overlay"></div>` as first child of `<body>`

---

## How data flows

- `news.json` at the **repo root** is what the browser fetches (`fetch('news.json')`).
- `scripts/fetch-news.js` writes to `src/data/news.json`.
- `update-news.yml` copies `src/data/news.json → news.json` (root) before committing.
- `deploy.yml` also runs `cp src/data/news.json _site/news.json` when assembling the site.
- To change RSS sources, edit the `SOURCES` array in `scripts/fetch-news.js`. Each
  entry's `category` must be `cve` / `cloud` / `system`.
- The fetch script forces `process.exit(0)` at the end — keep this; `rss-parser` leaves
  keep-alive sockets open which would hang CI.

---

## Automation / deploy

- `update-news.yml` runs hourly (`0 * * * *`): `npm run fetch-news` → if `src/data/news.json`
  changed, copy to root `news.json`, commit both, push → `gh workflow run deploy.yml`.
- `deploy.yml` (no npm build): assembles `_site/` by copying static files (`index.html`,
  `roadmap.html`, `404.html`, `assets/`, `src/data/news.json → news.json`, `public/`) →
  uploads `_site/` as Pages artifact → deploys.
- One-time setup: **Settings → Pages → Source = GitHub Actions**. Custom domain via
  `public/CNAME`. No extra secrets needed.

---

## Roadmap logic

Tasks are stored in `localStorage` under key `devsecops-hub:roadmap:v1` as a flat
`{ taskId: boolean }` object. Task IDs are defined inline in `assets/roadmap-page.js`
in the `ROADMAP` array — **do not rename them** or saved progress will be lost.

Node states are derived at render time:
- **COMPLETED**: all tasks in track done → cyan glow (`glow-cyan`)
- **IN_PROGRESS**: some tasks done → magenta glow (`glow-magenta`) + progress bar
- **LOCKED**: no tasks done → grayscale + opacity-50

---

## Legacy React source (`src/`)

The `src/` directory, `package.json`, `vite.config.js`, etc. are kept for reference
but are **not used** by the current static site or deploy pipeline. The `scripts/`
folder (RSS aggregator) still requires Node 20+ and is run by CI only.

To run the RSS aggregator locally:
```bash
npm install
npm run fetch-news    # writes src/data/news.json; copy to root manually for local testing
cp src/data/news.json news.json
```
