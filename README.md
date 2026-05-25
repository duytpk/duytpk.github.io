# Neon Protocol DevSecOps Hub

A personal cyberpunk/hacker-aesthetic static site deployed at **[duytpk.me](https://duytpk.me)** with two pages:

- **CVE Dashboard** — real-time security news aggregator (CVE feed + AI tech feed), auto-refreshes every 5 minutes.
- **Learning Roadmap** — Linux / Terraform / Kubernetes progress tracker with persistent checkbox state.

> **Zero-dependency static HTML.** No npm, no build step, no node_modules needed to run it locally.
> Open `index.html` in a browser, or `python3 -m http.server` from the repo root.

---

## Tech stack

| Concern    | Choice                                                          |
| ---------- | --------------------------------------------------------------- |
| Pages      | Plain HTML5 (`index.html`, `roadmap.html`, `404.html`)         |
| Styles     | Tailwind CSS CDN + `assets/cyber-neon.css`                     |
| Logic      | Vanilla JS (IIFE-wrapped, no bundler)                           |
| Icons      | Google Material Symbols (CDN)                                   |
| Fonts      | Sora (headings) + JetBrains Mono (labels/data) via Google Fonts |
| Feed sync  | Node 20 + `rss-parser` (CI only, not shipped to browser)       |
| CI/CD      | GitHub Actions → GitHub Pages (no build step)                  |
| Domain     | `duytpk.me` via `public/CNAME`                                 |

---

## File layout

```
(repo root)
  index.html            # CVE Dashboard page
  roadmap.html          # Learning Roadmap page
  404.html              # Not Found page
  news.json             # Live feed served at /news.json; updated hourly by CI

assets/
  cyber-neon.css        # Custom CSS: CSS variables, scanline, glow, scrollbar, animations
  tailwind-config.js    # Shared Tailwind theme (colors, fonts, spacing) — loaded by each HTML
  app.js                # Shared: UTC clock, nav highlight, glitch scramble
  topbar.js             # Shared: injects top navigation bar
  footer.js             # Shared: injects footer
  index.js              # CVE Dashboard logic: fetch, render cards, tab switch, sort/filter
  roadmap.js            # Roadmap logic: localStorage state, node render, progress, modal

public/
  favicon.svg
  CNAME                 # duytpk.me
  sounds/               # (legacy, unused)

src/
  data/
    news.json           # Authoritative feed source; CI writes here first, then copies to root
  ...                   # Legacy React source — not used by the static site

scripts/
  fetch-news.js         # RSS aggregator → overwrites src/data/news.json

.github/workflows/
  deploy.yml            # Assembles _site/ → deploys to GitHub Pages
  update-news.yml       # Hourly: fetch RSS → commit → trigger deploy
```

---

## How data flows

```
scripts/fetch-news.js
  └─ writes src/data/news.json
       └─ update-news.yml copies → root news.json → commits & pushes
            └─ triggers deploy.yml
                  └─ cp src/data/news.json _site/news.json → deployed

Browser: fetch('news.json') every 5 min
```

- To add/remove RSS sources, edit the `SOURCES` array in `scripts/fetch-news.js`.
  Each entry needs `{ category, name, url, limit }`. Categories: `cve` | `ai`.
- CVE items have two extra fields: `cveScore` (float or `null`) and `cveSeverity`
  (`CRITICAL` / `HIGH` / `MEDIUM` / `LOW` / `NA`), extracted by `parseCVEFields()`.
- Items without a publish date get `isoDate: null` and sort to the bottom of the feed.

---

## Design system — Neon Protocol

### Color tokens (Tailwind + CSS custom properties)

| CSS variable / Tailwind token | Hex       | Usage                              |
| ----------------------------- | --------- | ---------------------------------- |
| `--neon-cyan` / `primary`     | `#e1fdff` | Main text, nav links, glow         |
| `--neon-magenta` / `secondary`| `#ffabf3` | Active nav, hover accents, magenta |
| `surface-container-lowest`    | `#0e0e10` | Body background                    |
| `surface-container-low`       | `#1c1b1d` | Card backgrounds                   |
| `surface-container`           | `#201f21` | Panel fills                        |
| `outline-variant` / `--outline`| `#3a494b`| Borders, dividers                  |
| `on-tertiary-container`       | `#605f64` | Muted labels, metadata             |
| `error`                       | `#ffb4ab` | Error states, reset button         |

CSS custom properties (defined in `cyber-neon.css :root`) cover neon colors and their
alpha variants (`--neon-cyan-50`, `--neon-magenta-45`, etc.) — use these in custom CSS
instead of hardcoding hex values.

### Typography

- **Headings/brand**: `font-display-lg` / `font-headline-md` → Sora
- **Labels/data**: `font-body-md` / `font-label-caps` → JetBrains Mono (monospace)
- All-caps labels use `tracking-widest uppercase`.

### Card classes

| Class        | Use case                  | Border behavior                     |
| ------------ | ------------------------- | ----------------------------------- |
| `.card-glow` | CVE cards                 | No forced border — Tailwind severity class controls it |
| `.card-neon` | AI/feed cards             | Cyan border default, magenta on hover |

### Glow helpers

- `.glow-cyan` — cyan box-shadow + forced cyan border (roadmap COMPLETED nodes)
- `.glow-magenta` — magenta box-shadow + forced magenta border (roadmap IN_PROGRESS nodes)
- `.neon-text-cyan` / `.neon-text-magenta` — text-shadow glows
- `.animate-glitch` / `.hover-glitch` — glitch keyframe animation

---

## CVE severity coloring

`severityMeta(level)` in `assets/index.js` returns Tailwind classes per severity:

| Severity   | Text class         | Border class            |
| ---------- | ------------------ | ----------------------- |
| CRITICAL   | `text-error`       | `border-error/50`       |
| HIGH       | `text-orange-400`  | `border-orange-400/50`  |
| MEDIUM     | `text-yellow-400`  | `border-yellow-400/50`  |
| LOW        | `text-green-400`   | `border-green-400/50`   |
| NA         | `text-on-tertiary-container` | `border-outline-variant` |

CRITICAL/HIGH cards render with the colored border; MEDIUM/LOW/NA use `border-outline-variant`.

---

## Roadmap

Tasks are stored in `localStorage` under key `devsecops-hub:roadmap:v1` as
`{ taskId: boolean }`. Task IDs are defined in `assets/roadmap.js` in the `ROADMAP`
array — **do not rename them** or saved progress will be lost.

Node states (derived at render time):

- **COMPLETED** — all tasks done → cyan glow (`glow-cyan`)
- **IN_PROGRESS** — some tasks done → magenta glow (`glow-magenta`) + progress bar
- **LOCKED** — no tasks done → grayscale + reduced opacity

---

## Code patterns

**IIFE wrappers** — every page-specific JS file wraps all code in `(function () { ... }())` to
avoid polluting `window`. `window.esc` (from `app.js`) is the only intentional global.

**setInterval** — must be stored and cleared on `beforeunload`. See `assets/index.js`.

**localStorage writes** — always wrapped in `try/catch` (`saveDone()` in `roadmap.js`).
`loadDone()` also validates the parsed value is a plain object before using it.

**Event delegation** — roadmap checkboxes use a single `change` listener on
`#roadmap-container` instead of one listener per checkbox.

**CVE parsing fallback chain** — `parseCVEFields()` in `fetch-news.js` tries three
patterns to extract CVSS severity; if all fail it derives severity from the numeric
score using CVSS thresholds, and logs a debug sample to stdout so CI can diagnose format
changes.

**Tab ARIA state** — `index.html` sets initial `aria-selected` on each `role="tab"` button;
`switchTab()` in `assets/index.js` updates it on every switch. Wire both places when adding tabs.

---

## Local dev

No build step needed for the front-end:

```bash
# Just open in browser (or serve locally):
python3 -m http.server
# → http://localhost:8000
```

To refresh the news feed locally:

```bash
npm install                    # one-time: installs rss-parser
npm run fetch-news             # writes src/data/news.json
cp src/data/news.json news.json
```

---

## CI/CD

### `update-news.yml` (hourly)

1. `npm run fetch-news` — fetches all RSS sources, writes `src/data/news.json`
2. If file changed: `cp src/data/news.json news.json` → commit both → push
3. Dispatches `deploy.yml`

### `deploy.yml` (on push to main or manual dispatch)

1. Assembles `_site/`:
   - `cp *.html _site/` (all HTML pages at root, automatically includes new pages)
   - `cp -r assets _site/`
   - `cp src/data/news.json _site/news.json`
   - `cp -r public _site/`
2. Uploads `_site/` as Pages artifact → deploys

One-time setup: **Settings → Pages → Source = GitHub Actions**. No extra secrets needed.

---

## Git workflow

The hourly workflow pushes directly to `main`, causing frequent divergence.

```bash
# Do NOT use git pull (creates merge commits)
git rebase origin/main
```

---

## Design decisions

- **`<head>` duplicated across HTML files** — intentional; a shared partial requires a
  build step not worth adding for 3 pages.
- **Footer links non-functional** — rendered as `<span class="opacity-40">`, no `href`.
  Do not add hrefs until real destinations exist.
- **No `!important` on `.card-neon`** — `cyber-neon.css` loads after Tailwind CDN, so
  cascade order alone wins. `.glow-cyan` and `.glow-magenta` keep `!important` because
  they need to override inline Tailwind border utilities on dynamically-classed nodes.
- **Removed CSS classes** (do not re-add unless needed): `.neon-text-glow-magenta`,
  `.active-nav-glow`, `.bracket-corner`, `.node-connector`, `.node-connector--dashed`
