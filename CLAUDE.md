# CLAUDE.md

Guidance for working in this repository.

## Project

**Neon Protocol DevSecOps Hub** — a cyberpunk/hacker-aesthetic static multi-page site with two pages:

1. **CVE Dashboard** (`index.html`) — tech-news aggregator with tabs **CVE** and **AI**.
   Fetches `news.json` at runtime, auto-refreshes every 5 min.
2. **Learning Roadmap** (`roadmap.html`) — Linux / Terraform / Kubernetes node-based
   progress flow. Node states (COMPLETED/IN_PROGRESS/LOCKED) are derived from task
   checkboxes saved in `localStorage`.

Deployed to **GitHub Pages** (Actions source) on the custom domain **duytpk.me**.

> **The site is zero-dependency static HTML.** No npm, no build step, no node_modules
> needed to run it. Open `index.html` in a browser, or serve with `python3 -m http.server`.

---

## Stack

| Concern    | Choice                                                          |
| ---------- | --------------------------------------------------------------- |
| Pages      | Plain HTML5 (`index.html`, `roadmap.html`, `404.html`)         |
| Styles     | **Tailwind CSS CDN** + `assets/cyber-neon.css` (custom)        |
| Logic      | Vanilla JS, IIFE-wrapped (`assets/index.js`, `assets/roadmap.js`, etc.) |
| Icons      | Google Material Symbols (CDN `<link>`)                         |
| Fonts      | **Sora** (headings) + **JetBrains Mono** (labels/data) via Google Fonts CDN |
| Automation | Node script + `rss-parser`                                     |
| CI/CD      | GitHub Actions → GitHub Pages (no build step)                  |

---

## File layout

```
(repo root)
  index.html            # CVE Dashboard — full shell + card grid
  roadmap.html          # Learning Roadmap — node flow + summary widgets
  404.html              # Not Found page
  news.json             # Served at /news.json; synced from src/data/news.json by workflow

assets/
  cyber-neon.css        # Custom CSS: :root variables, scanline, glow, scrollbar, animations
  tailwind-config.js    # Shared Tailwind theme — loaded by each HTML page via <script>
  app.js                # Common shell: live UTC clock, nav highlight, scramble effect
  topbar.js             # Injects shared top navigation bar
  footer.js             # Injects shared footer
  index.js              # CVE dashboard: fetch news.json, render cards, tab switch, sort/filter
  roadmap.js            # Roadmap: localStorage state, node render, progress, reset modal

public/
  favicon.svg
  CNAME                 # duytpk.me
  sounds/               # (legacy, unused by static site)

src/                    # Legacy React source — kept for reference, NOT used by the static site
  data/
    news.json           # Authoritative feed; workflow writes here first
  ...                   # All other React components / hooks

scripts/
  fetch-news.js         # RSS aggregator → overwrites src/data/news.json

.github/workflows/
  deploy.yml            # Assembles _site/ from static files → deploys to Pages
  update-news.yml       # Hourly: fetch-news → commit both src/data/news.json AND root news.json
```

---

## Design system — Neon Protocol

Design tokens live in `assets/tailwind-config.js` (shared across all HTML pages via `<script src="assets/tailwind-config.js">`), loaded before the Tailwind CDN `<script>`.

### Color tokens (Tailwind class names)

| Token                     | Hex       | Usage                              |
| ------------------------- | --------- | ---------------------------------- |
| `primary`                 | `#e1fdff` | Main text on dark, nav links       |
| `primary-fixed-dim`       | `#00dbe7` | Neon cyan accent, glow             |
| `secondary`               | `#ffabf3` | Active nav, magenta accent         |
| `surface-container-lowest`| `#0e0e10` | Body background                    |
| `surface-container-low`   | `#1c1b1d` | Card backgrounds                   |
| `surface-container`       | `#201f21` | Panel fills                        |
| `outline-variant`         | `#3a494b` | Borders, dividers                  |
| `on-tertiary-container`   | `#605f64` | Muted labels, metadata             |
| `error`                   | `#ffb4ab` | Error states, reset button         |

### CSS custom properties (in `cyber-neon.css :root`)

Use these instead of hardcoding hex/rgba values anywhere in custom CSS:

```
--neon-cyan, --neon-magenta
--neon-cyan-90/50/30/20/12   (rgba variants)
--neon-magenta-90/55/45/20   (rgba variants)
--surface-dark, --outline
```

### Typography

- **Headings/brand**: `font-display-lg` / `font-headline-lg` / `font-headline-md` → Sora
- **Body/labels/data**: `font-body-md` / `font-label-caps` → JetBrains Mono
- All caps labels use `tracking-widest` and `uppercase`.

### Card classes

| Class        | Use case     | Border behavior                                        |
| ------------ | ------------ | ------------------------------------------------------ |
| `.card-glow` | CVE cards    | No forced border — Tailwind severity class controls it |
| `.card-neon` | AI/feed cards| Cyan border default (`--neon-cyan`), magenta on hover  |

Do NOT use `.card-neon` on CVE cards — it would override severity-based border colors.

### Glow helpers

- `.glow-cyan` — cyan box-shadow + `border-color: var(--neon-cyan) !important` (roadmap COMPLETED)
- `.glow-magenta` — magenta box-shadow + `border-color: var(--neon-magenta) !important` (roadmap IN_PROGRESS)
- `.neon-text-cyan` / `.neon-text-magenta` / `.neon-text-glow` — text-shadow glows
- `.animate-glitch` — continuous glitch animation; `.hover-glitch` — on hover only
- **Scanline**: `<div class="scanline-overlay"></div>` as first child of `<body>`

### Component patterns

- **Active nav**: `bg-secondary/10 text-secondary border-l-4 border-secondary`
- **Removed CSS classes** — do not re-add unless actively needed:
  `.neon-text-glow-magenta`, `.active-nav-glow`, `.bracket-corner`, `.node-connector`, `.node-connector--dashed`

---

## How data flows

- `news.json` at the **repo root** is what the browser fetches (`fetch('news.json')`).
- `scripts/fetch-news.js` writes to `src/data/news.json`.
- `update-news.yml` copies `src/data/news.json → news.json` (root) before committing.
- `deploy.yml` also runs `cp src/data/news.json _site/news.json` when assembling the site.
- To change RSS sources, edit the `SOURCES` array in `scripts/fetch-news.js`. Each entry
  needs `{ category, name, url, limit }`. Categories: `cve` | `ai`.
- The fetch script forces `process.exit(0)` at the end — keep this; `rss-parser` leaves
  keep-alive sockets open which would hang CI.

### CVE feed specifics

- The `cve` category uses a **single source**: `https://cvefeed.io/rssfeed/latest.xml` with `limit: 50`.
- CVE items carry two extra fields beyond the standard schema:
  - `cveScore` — CVSS score as a float (e.g. `9.8`), or `null` if not yet scored.
  - `cveSeverity` — severity string: `CRITICAL` / `HIGH` / `MEDIUM` / `LOW` / `NA`.
- `parseCVEFields()` in `fetch-news.js` uses a primary regex + fallback pattern + CVSS threshold
  derivation to extract these fields. If none match, it logs a debug sample to stdout so CI can
  diagnose format changes from cvefeed.io.
- Items without a publish date get `isoDate: null` and sort to the bottom (not the top).

### CVE severity coloring (browser)

`severityMeta(level)` in `assets/index.js` returns `{ text, border, bg }` Tailwind classes:

| Severity | text              | border                  |
| -------- | ----------------- | ----------------------- |
| CRITICAL | `text-error`      | `border-error/50`       |
| HIGH     | `text-orange-400` | `border-orange-400/50`  |
| MEDIUM   | `text-yellow-400` | `border-yellow-400/50`  |
| LOW      | `text-green-400`  | `border-green-400/50`   |
| NA       | `text-on-tertiary-container` | `border-outline-variant` |

CRITICAL/HIGH cards render with the colored border via `.card-glow` (which does NOT force
border-color, allowing Tailwind utility classes to take effect). MEDIUM/LOW/NA use `border-outline-variant`.

---

## Automation / deploy

- `update-news.yml` runs hourly (`0 * * * *`): `npm run fetch-news` → if `src/data/news.json`
  changed, copy to root `news.json`, commit both, push → `gh workflow run deploy.yml`.
- `deploy.yml` (no npm build): assembles `_site/` by:
  - `cp *.html _site/` (glob — automatically includes any new HTML pages at repo root)
  - `cp -r assets _site/`
  - `cp src/data/news.json _site/news.json`
  - `cp -r public _site/`
  - uploads `_site/` as Pages artifact → deploys.
- One-time setup: **Settings → Pages → Source = GitHub Actions**. Custom domain via
  `public/CNAME`. No extra secrets needed.

---

## Roadmap logic

Tasks are stored in `localStorage` under key `devsecops-hub:roadmap:v1` as a flat
`{ taskId: boolean }` object. Task IDs are defined inline in `assets/roadmap.js`
in the `ROADMAP` array — **do not rename them** or saved progress will be lost.

`loadDone()` validates the parsed value is a plain object (not array, not null) before
using it — this guards against corrupted or migrated localStorage data.

Node states are derived at render time:

- **COMPLETED**: all tasks in track done → cyan glow (`glow-cyan`)
- **IN_PROGRESS**: some tasks done → magenta glow (`glow-magenta`) + progress bar
- **LOCKED**: no tasks done → grayscale + opacity-40

---

## Git workflow

The hourly `update-news.yml` workflow pushes a `chore(news): hourly auto-update` commit
directly to `origin/main`. This frequently causes the local branch to **diverge** from remote.

**Fix (do not use `git pull` — it creates an unnecessary merge commit):**
```bash
git rebase origin/main
```

---

## Code patterns & constraints

- **IIFE wrappers** — every page-specific JS file wraps all code in `(function () { ... }())`.
  Do not add new globals. `window.esc` (HTML-escape helper from `app.js`) is the only
  intentional global shared across files.

- **setInterval must be stored and cleared.** Any `setInterval` call must assign its return
  value to a variable and clear it on `beforeunload`. See `assets/index.js` for the pattern.

- **localStorage writes must be wrapped in try/catch.** Private-mode browsers can throw on
  `setItem`. `loadDone()` and `saveDone()` in `assets/roadmap.js` already handle this.

- **Event delegation for checkboxes.** `assets/roadmap.js` attaches a single `change` listener
  on `#roadmap-container` instead of one per checkbox. Do not add per-checkbox listeners in
  `renderRoadmap()` — use the delegated handler.

- **`bar.querySelector` instead of `document.getElementById`** for elements created inside
  `renderSortBar()` / `renderFilterBar()`. Scoped queries are safer when attaching event
  listeners to freshly-injected HTML.

- **Named constants for magic numbers.** In `assets/index.js`: `MS_HOUR`, `MS_DAY`, `MS_WEEK`,
  `REFRESH_MS`, `CARD_DELAY_MS`. In `assets/roadmap.js`: `MAX_ACTIVITY`, `PULSE_MS`,
  `TIME_START/END`, `CLS_LABEL_SM`. Use these; do not inline raw numbers.

- **Shared card helpers.** In `assets/index.js`, `_cardBody(item)` and `_cardFooter(item)` are
  private helpers (inside the IIFE) shared between `renderCVECard()` and `renderFeedCard()`.
  Keep the separator — CVE cards use `.card-glow`, feed cards use `.card-neon`.

- **Tab ARIA state must stay in sync.** `index.html` sets initial `aria-selected` on each
  `role="tab"` button; `switchTab()` in `assets/index.js` updates it on every switch.
  If you add tabs, wire both places.

- **CSS `!important` rationale.** `.glow-cyan` and `.glow-magenta` need `!important` on
  `border-color` to override Tailwind's border utilities (equal specificity, same cascade
  layer). `.card-neon` does NOT need `!important` because it relies on cascade order
  (`cyber-neon.css` loads after Tailwind CDN). Never add `!important` without this justification.

---

## Design decisions

- **`<head>` sections are intentionally duplicated** across `index.html`, `roadmap.html`,
  `404.html`. A shared partial would require a build step — not worth it for only 3 pages.
  If the number of pages grows significantly, revisit with a simple Node assembly script.

- **No decorative line elements** flanking headings (`<span class="w-8 h-px ...">`).
  Keep headers as plain text, no side decorations.

- **Footer links (SYS_LOGS, API_DOCS, STATUS_PAGE) are intentionally non-functional** —
  rendered as `<span class="opacity-40">`, not `<a href="#">`. Do not add hrefs back until
  real destinations exist.

- **CVE cards use `.card-glow` not `.card-neon`.** This is intentional: `.card-neon` forces
  a cyan border-color which would override the severity-based border on CRITICAL/HIGH items.
  `.card-glow` provides the same glow and hover effects without touching border-color.

- **`deploy.yml` uses `cp *.html _site/`** — glob pattern, not per-file copies. Adding a new
  HTML page at the repo root requires no workflow changes.

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
