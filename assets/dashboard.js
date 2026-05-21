/* ── CVE / News Dashboard ─────────────────────────────────────────────────── */

var TABS = [
  { key: 'cve',    label: 'CVE_FEED',   icon: 'security', activeClass: 'text-secondary border-secondary' },
  { key: 'cloud',  label: 'CLOUD_FEED', icon: 'cloud',    activeClass: 'text-primary   border-primary'   },
  { key: 'system', label: 'SYS_KERNEL', icon: 'terminal', activeClass: 'text-primary   border-primary'   },
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
  setStatus(' Synchronising feeds…');

  fetch('news.json?t=' + Date.now(), { cache: 'no-store' })
    .then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function(json) {
      newsData = json;
      setStatus(json.generator === 'seed' ? ' Seed data loaded' : ' Live RSS data · auto-refresh: 5m');
      setLastUpdateTime(json.updatedAt);
      setSyncState(false);
      renderCards();
    })
    .catch(function() {
      if (!newsData) { newsData = SEED; }
      setStatus(' Offline — showing cached / seed data');
      setLastUpdateTime(newsData.updatedAt);
      setSyncState(false);
      renderCards();
    });
}

/* ── Card render ────────────────────────────────────────────────────────────── */

/* Tab meta: badge label, icon, card style */
var TAB_META = {
  cve:    { badge: 'LIVE_THREAT', status: 'ACTIVE_THREAT', icon: 'security',  cardClass: 'glow-magenta border-secondary shadow-[0_0_20px_rgba(255,0,255,0.2)]',  textClass: 'text-secondary',  accentClass: 'neon-text-magenta' },
  cloud:  { badge: 'CLOUD_OPS',  status: 'STABLE',        icon: 'cloud',      cardClass: 'glow-cyan border-primary-container',                                      textClass: 'text-primary',    accentClass: 'neon-text-cyan'    },
  system: { badge: 'SYS_UPDATE', status: 'SYS_ACTIVE',    icon: 'terminal',   cardClass: 'glow-cyan border-primary-container',                                      textClass: 'text-primary',    accentClass: 'neon-text-cyan'    },
};

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
  var meta  = TAB_META[currentTab] || TAB_META.cloud;

  if (items.length === 0) {
    grid.innerHTML = '<p class="font-body-md text-on-tertiary-container col-span-full py-16 text-center">// NO SIGNAL — feed is empty.</p>';
    return;
  }

  grid.innerHTML = items.map(function(item, i) {
    var delay = i * 60;
    /* First card in CVE tab gets special "exploited" treatment */
    var cardMeta = meta;
    var isFeatured = (currentTab === 'cve' && i === 0);
    if (isFeatured) {
      cardMeta = Object.assign({}, meta, {
        badge: 'CRITICAL',
        status: 'UNPATCHED',
      });
    }

    return [
      '<article class="flex flex-col bg-surface-container border border-outline-variant ' + cardMeta.cardClass + '',
      ' group hover:bg-surface-container-high transition-all duration-300 relative"',
      ' style="animation: cardIn 0.35s ease both; animation-delay:' + delay + 'ms">',

      /* Animated ping indicator on featured CVE card */
      isFeatured
        ? '<div class="absolute top-0 right-0 p-2"><div class="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></div></div>'
        : '',

      /* Header row: source label + icon + badge */
      '<div class="p-5 border-b border-outline-variant/40">',
        '<div class="font-label-caps text-[10px] ' + cardMeta.textClass + ' tracking-widest opacity-80 mb-2">' +
          '[' + esc(currentTab.toUpperCase()) + '_FEED] // ' + esc((item.source || '').toUpperCase()) +
        '</div>',
        '<div class="flex justify-between items-center">',
          '<span class="material-symbols-outlined ' + cardMeta.textClass + ' text-2xl" style="font-variation-settings:\'FILL\' 1;">' + cardMeta.icon + '</span>',
          '<span class="px-2 py-0.5 bg-current/10 text-[9px] font-label-caps border border-current/30 ' + cardMeta.textClass + '">' + cardMeta.badge + '</span>',
        '</div>',
      '</div>',

      /* Body: title + snippet */
      '<div class="p-5 flex-grow">',
        '<h3 class="font-headline-md text-[17px] mb-3 ' + cardMeta.textClass + ' ' + cardMeta.accentClass + ' leading-tight">',
          esc(item.title),
        '</h3>',
        '<p class="font-body-md text-sm text-on-surface-variant leading-relaxed opacity-90 line-clamp-3">',
          esc(item.contentSnippet || '—'),
        '</p>',
      '</div>',

      /* Footer: link + metadata */
      '<div class="p-5 pt-0 mt-auto">',
        '<a href="' + esc(item.link) + '" target="_blank" rel="noreferrer"',
        '   class="inline-flex items-center gap-2 text-[11px] font-label-caps ' + cardMeta.textClass + ' border border-current/20 bg-current/5 px-4 py-2 hover:bg-current/20 transition-all w-full justify-center group/btn">',
          'ACCESS_FEED',
          '<span class="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>',
        '</a>',
        '<div class="mt-3 flex justify-between items-center text-[9px] font-label-caps text-on-surface-variant/60 uppercase">',
          '<span>' + timeAgo(item.isoDate) + '</span>',
          '<span>[STATUS: ' + cardMeta.status + ']</span>',
        '</div>',
      '</div>',

      '</article>',
    ].join('');
  }).join('');

  /* Glitch hover effect on card titles */
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

  /* Pulse magenta cards for atmosphere */
  grid.querySelectorAll('.glow-magenta').forEach(function(node) {
    setInterval(function() {
      node.classList.toggle('shadow-[0_0_30px_rgba(255,0,255,0.4)]');
    }, 1500);
  });
}

/* ── Tab switching ──────────────────────────────────────────────────────────── */
function switchTab(key) {
  if (key === currentTab) return;
  currentTab = key;

  document.querySelectorAll('.tab-btn[data-tab]').forEach(function(btn) {
    var isActive = btn.dataset.tab === key;
    var tab = TABS.find(function(t) { return t.key === btn.dataset.tab; });
    btn.className = 'tab-btn px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest border-b-2 transition-all duration-150 -mb-px ';
    btn.className += isActive ? tab.activeClass : INACTIVE_TAB_CLASS;
  });

  renderCards();
}

/* ── Init ───────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.tab-btn[data-tab]').forEach(function(btn) {
    btn.addEventListener('click', function() { switchTab(btn.dataset.tab); });
  });

  var syncBtn    = document.getElementById('sync-btn');
  var refreshBtn = document.getElementById('refresh-btn');
  if (syncBtn)    syncBtn.addEventListener('click',    loadNews);
  if (refreshBtn) refreshBtn.addEventListener('click', loadNews);

  loadNews();
  setInterval(loadNews, 5 * 60 * 1000);
});