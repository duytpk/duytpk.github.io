/* ── CVE / News Dashboard ─────────────────────────────────────────────────── */

var TABS = [
  { key: 'cve',    label: 'CVE_FEED',    tag: 'CVE',   activeClass: 'text-secondary border-secondary' },
  { key: 'cloud',  label: 'CLOUD_FEED',  tag: 'CLOUD', activeClass: 'text-primary   border-primary'   },
  { key: 'system', label: 'SYS_KERNEL',  tag: 'SYS',   activeClass: 'text-primary   border-primary'   },
];

var INACTIVE_TAB_CLASS = 'text-on-surface-variant border-transparent hover:text-primary hover:border-primary/40';

/* Seed data — rendered if /news.json fetch fails (e.g. file:// protocol). */
var SEED = {"updatedAt":"2026-05-20T14:41:22.179Z","generator":"seed","feeds":{"cve":[{"title":"Webworm Deploys EchoCreep and GraphWorm Backdoors Using Discord and MS Graph API","link":"https://thehackernews.com/2026/05/webworm-deploys-echocreep-and-graphworm.html","source":"The Hacker News","isoDate":"2026-05-20T12:51:43.000Z","contentSnippet":"Cybersecurity researchers have flagged fresh activity from a China-aligned threat actor known as Webworm in 2025, deploying custom backdoors that employ Discord and Microsoft Graph API for command-and-control communications."},{"title":"Agent AI is Coming. Are You Ready?","link":"https://thehackernews.com/2026/05/agent-ai-is-coming-are-you-ready.html","source":"The Hacker News","isoDate":"2026-05-20T11:58:00.000Z","contentSnippet":"New Industry Data Just Released Suggests Not. \"Identity dark matter\" now overshadows the visible elements 57% vs. 43%."},{"title":"GitHub Breached — Employee Device Hack Led to Exfiltration of 3,800+ Internal Repos","link":"https://thehackernews.com/2026/05/github-investigating-teampcp-claimed.html","source":"The Hacker News","isoDate":"2026-05-20T11:38:43.000Z","contentSnippet":"GitHub said it is investigating unauthorized access to its internal repositories after the threat actor TeamPCP listed the platform's source code for sale on a cybercrime forum."}],"cloud":[{"title":"Trust at every layer: How sealed images extend OS integrity from boot to runtime","link":"https://www.redhat.com/en/blog/how-sealed-images-red-hat-enterprise-linux-extend-os-integrity-boot-runtime","source":"Red Hat Blog","isoDate":"2026-05-20T00:00:00.000Z","contentSnippet":"Consider a medical device running Linux in a hospital, an ATM on a street corner, or a gateway device at the edge of a manufacturing network."},{"title":"Meet Gordon: Docker's AI Agent For Your Entire Container Workflow","link":"https://www.docker.com/blog/meet-gordon-dockers-ai-agent-for-your-entire-container-workflow/","source":"Docker Blog","isoDate":"2026-05-19T19:08:04.000Z","contentSnippet":"Gordon understands your environment, proposes fixes, and takes action across your entire Docker workflow. Now generally available."},{"title":"Red Hat Enterprise Linux 10.2 and 9.8 are here","link":"https://www.redhat.com/en/blog/rhel-102-and-98-intelligent-evolution-enterprise-linux","source":"Red Hat Blog","isoDate":"2026-05-20T00:00:00.000Z","contentSnippet":"RHEL 10.2 and 9.8 evolve the OS from a foundation to a powerful engine for critical applications, security, and innovation."}],"system":[{"title":"[$] What is to be done about MGLRU?","link":"https://lwn.net/Articles/1072866/","source":"LWN.net","isoDate":"2026-05-20T13:14:51.000Z","contentSnippet":"The addition of the multi-generational LRU (MGLRU) was meant to provide a better reclaim implementation. Discussions are ongoing."},{"title":"Security updates for Wednesday","link":"https://lwn.net/Articles/1073713/","source":"LWN.net","isoDate":"2026-05-20T13:04:17.000Z","contentSnippet":"Security updates have been issued by AlmaLinux, Debian, Fedora, and others covering kernel, libpng, nginx, ruby, and more."},{"title":"[$] The tenth OpenPGP email summit","link":"https://lwn.net/Articles/1072870/","source":"LWN.net","isoDate":"2026-05-20T11:00:15.000Z","contentSnippet":"The OpenPGP Email Summit is an annual meeting for those who work on encrypted email. The tenth installment took place in March 2026."}]}};

/* ── State ──────────────────────────────────────────────────────────────────── */
var newsData   = null;
var currentTab = 'cve';

/* ── Helpers ────────────────────────────────────────────────────────────────── */
function fmtDate(iso) {
  try { return new Date(iso).toISOString().slice(0, 16).replace('T', ' ') + ' UTC'; }
  catch (_) { return iso || '—'; }
}

function timeAgo(iso) {
  try {
    var diff = Date.now() - new Date(iso).getTime();
    var h = Math.floor(diff / 3600000);
    if (h < 1)  return 'JUST NOW';
    if (h < 24) return h + 'H AGO';
    var d = Math.floor(h / 24);
    if (d < 7)  return d + 'D AGO';
    return Math.floor(d / 7) + 'W AGO';
  } catch (_) { return '—'; }
}

function esc(str) {
  return String(str || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function setStatus(msg) {
  var el = document.getElementById('status-line');
  if (el) el.textContent = msg;
}

function setLastUpdateTime(iso) {
  var el = document.getElementById('last-update-time');
  if (el) el.textContent = fmtDate(iso);
}

function setSyncState(loading) {
  var sb = document.getElementById('sync-btn');
  var rb = document.getElementById('refresh-btn');
  if (sb) sb.textContent = loading ? 'SYNCING...' : 'FORCE_SYNC';
  if (rb) { rb.style.opacity = loading ? '0.4' : '1'; rb.disabled = loading; }
}

/* ── Fetch ──────────────────────────────────────────────────────────────────── */
function loadNews() {
  setSyncState(true);
  setStatus('Synchronising feeds…');

  fetch('news.json?t=' + Date.now(), { cache: 'no-store' })
    .then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function(json) {
      newsData = json;
      setStatus(json.generator === 'seed' ? 'Seed data loaded' : 'Live RSS data · auto-refresh: 5m');
      setLastUpdateTime(json.updatedAt);
      setSyncState(false);
      renderCards();
    })
    .catch(function() {
      if (!newsData) { newsData = SEED; }
      setStatus('Offline — showing cached / seed data');
      setLastUpdateTime(newsData.updatedAt);
      setSyncState(false);
      renderCards();
    });
}

/* ── Card render ────────────────────────────────────────────────────────────── */
function cardTagHtml(tabKey, source) {
  /* CVE tab → error-container badge; others → primary badge */
  if (tabKey === 'cve') {
    return '<span class="bg-error-container text-error border border-error/30 px-2 py-1 text-label-caps font-label-caps">[CVE]</span>';
  }
  return '<span class="bg-primary/10 text-primary border border-primary/30 px-2 py-1 text-label-caps font-label-caps">[' + esc(tabKey.toUpperCase()) + ']</span>';
}

function renderTabCounts() {
  var feeds = (newsData && newsData.feeds) || {};
  TABS.forEach(function(t) {
    var el = document.getElementById('tab-count-' + t.key);
    if (el) el.textContent = '[' + (feeds[t.key] || []).length + ']';
  });
}

function renderCards() {
  var grid = document.getElementById('news-grid');
  if (!grid) return;
  renderTabCounts();

  var feeds = (newsData && newsData.feeds) || {};
  var items = feeds[currentTab] || [];

  if (items.length === 0) {
    grid.innerHTML = '<p class="font-body-md text-on-tertiary-container col-span-full py-16 text-center">// NO SIGNAL — feed is empty.</p>';
    return;
  }

  grid.innerHTML = items.map(function(item, i) {
    var delay = i * 35;
    return [
      '<div class="relative bg-surface-container-low border border-outline-variant p-6',
      ' hover:border-primary-fixed-dim transition-all group flex flex-col h-full neon-border-glow',
      '" style="animation: cardIn 0.3s ease both; animation-delay:' + delay + 'ms">',

      /* bracket corner */
      '<div class="bracket-corner text-primary absolute -top-px -left-px w-4 h-4"></div>',

      /* tag + time */
      '<div class="flex justify-between items-start mb-4">',
        cardTagHtml(currentTab, item.source),
        '<span class="text-label-caps text-on-tertiary-container">' + timeAgo(item.isoDate) + '</span>',
      '</div>',

      /* source */
      '<div class="text-label-caps text-on-tertiary-container mb-2">SOURCE: ' + esc(item.source).toUpperCase() + '</div>',

      /* title */
      '<h3 class="font-headline-md text-headline-md text-primary-fixed-dim neon-text-glow mb-4 leading-tight">',
        esc(item.title),
      '</h3>',

      /* snippet */
      '<p class="font-body-md text-on-surface-variant flex-grow mb-6 line-clamp-3">',
        esc(item.contentSnippet || '—'),
      '</p>',

      /* footer */
      '<div class="pt-4 border-t border-outline-variant flex justify-between items-center mt-auto">',
        '<div class="text-label-caps text-on-tertiary-container">[STATUS: ACTIVE]</div>',
        '<a href="' + esc(item.link) + '" target="_blank" rel="noreferrer"',
        '   class="flex items-center gap-2 text-secondary font-label-caps hover:translate-x-2 transition-transform">',
          'ACCESS_FEED',
          '<span class="material-symbols-outlined text-sm">arrow_forward</span>',
        '</a>',
      '</div>',
      '</div>',
    ].join('');
  }).join('');

  /* Glitch hover effect on titles */
  var glitchChars = '!@#$%^&*()_+{}[]|;:,.<>?';
  grid.querySelectorAll('h3').forEach(function(h3) {
    var original = h3.innerText;
    h3.addEventListener('mouseenter', function() {
      var iter = 0;
      var id = setInterval(function() {
        h3.innerText = original.split('').map(function(ch, idx) {
          if (idx < iter) return original[idx];
          return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }).join('');
        if (iter >= original.length) { clearInterval(id); h3.innerText = original; }
        iter += 1/3;
      }, 30);
    });
  });
}

/* ── Tab switching ──────────────────────────────────────────────────────────── */
function switchTab(key) {
  if (key === currentTab) return;
  currentTab = key;

  document.querySelectorAll('.tab-btn[data-tab]').forEach(function(btn) {
    var isActive = btn.dataset.tab === key;
    var tab = TABS.find(function(t) { return t.key === btn.dataset.tab; });

    /* Remove all dynamic classes first */
    btn.className = 'tab-btn px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest border-b-2 transition-all duration-150 -mb-px ';

    if (isActive) {
      btn.className += tab.activeClass;
    } else {
      btn.className += INACTIVE_TAB_CLASS;
    }
  });

  renderCards();
}

/* ── Init ───────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  /* Tab buttons */
  document.querySelectorAll('.tab-btn[data-tab]').forEach(function(btn) {
    btn.addEventListener('click', function() { switchTab(btn.dataset.tab); });
  });

  /* Sync / refresh buttons */
  var syncBtn    = document.getElementById('sync-btn');
  var refreshBtn = document.getElementById('refresh-btn');
  if (syncBtn)    syncBtn.addEventListener('click',    loadNews);
  if (refreshBtn) refreshBtn.addEventListener('click', loadNews);

  /* Inject card-in keyframe once */
  var style = document.createElement('style');
  style.textContent = '@keyframes cardIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }';
  document.head.appendChild(style);

  loadNews();
  setInterval(loadNews, 5 * 60 * 1000);
});
