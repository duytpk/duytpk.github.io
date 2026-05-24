/* ── CVE / News Dashboard ─────────────────────────────────────────────────── */

var TABS = [
  {
    key: 'cve', label: 'CVE', icon: 'security',
    activeClass:  'text-secondary border-secondary hover-glitch',
    badge: 'LIVE THREAT', status: 'ACTIVE THREAT',
    textClass:   'text-primary',
    accentClass: 'neon-text-cyan',
  },
  {
    key: 'ai', label: 'AI', icon: 'smart_toy',
    activeClass:  'text-secondary border-secondary hover-glitch',
    badge: 'AI UPDATE', status: 'STABLE',
    textClass:   'text-primary',
    accentClass: 'neon-text-cyan',
  },
  {
    key: 'system', label: 'SYSTEM KERNEL', icon: 'terminal',
    activeClass:  'text-secondary border-secondary hover-glitch',
    badge: 'SYSTEM UPDATE', status: 'SYSTEM ACTIVE',
    textClass:   'text-primary',
    accentClass: 'neon-text-cyan',
  },
];

var INACTIVE_TAB = 'text-primary border-transparent hover:border-primary/40 hover-glitch';

/* Seed data — rendered if /news.json fetch fails (e.g. file:// protocol). */
var SEED = {"updatedAt":"2026-05-20T14:41:22.179Z","generator":"seed","feeds":{"cve":[{"title":"CVE-2025-29927 - Next.js Middleware Authorization Bypass via x-middleware-subrequest Header","link":"https://cvefeed.io/vuln/detail/CVE-2025-29927","source":"cvefeed.io","isoDate":"2025-03-22T10:00:00.000Z","contentSnippet":"A critical vulnerability in Next.js allows attackers to bypass middleware-based authorization checks by manipulating the x-middleware-subrequest header, potentially granting unauthorized access to protected routes.","cveScore":9.1,"cveSeverity":"CRITICAL"},{"title":"CVE-2024-3400 - PAN-OS GlobalProtect Gateway Command Injection","link":"https://cvefeed.io/vuln/detail/CVE-2024-3400","source":"cvefeed.io","isoDate":"2024-04-12T00:00:00.000Z","contentSnippet":"A command injection vulnerability in the GlobalProtect feature of Palo Alto Networks PAN-OS allows an unauthenticated attacker to execute arbitrary code with root privileges on the firewall.","cveScore":10.0,"cveSeverity":"CRITICAL"},{"title":"CVE-2024-6387 - OpenSSH regreSSHion Remote Code Execution via Signal Handler Race Condition","link":"https://cvefeed.io/vuln/detail/CVE-2024-6387","source":"cvefeed.io","isoDate":"2024-07-01T00:00:00.000Z","contentSnippet":"A race condition in the OpenSSH server (sshd) on glibc-based Linux systems allows an unauthenticated attacker to achieve remote code execution as root. Affects default configurations of sshd.","cveScore":8.1,"cveSeverity":"HIGH"}],"ai":[{"title":"Gemini 2.5 Pro Preview: Our most intelligent model","link":"https://blog.google/technology/ai/gemini-2-5-pro-preview/","source":"Google AI Blog","isoDate":"2026-05-14T00:00:00.000Z","contentSnippet":"Gemini 2.5 Pro Preview delivers state-of-the-art performance on coding, math, and science benchmarks, with a 1M token context window."},{"title":"Amazon Bedrock now supports cross-region inference","link":"https://aws.amazon.com/blogs/machine-learning/amazon-bedrock-cross-region-inference/","source":"AWS Machine Learning Blog","isoDate":"2026-05-13T00:00:00.000Z","contentSnippet":"Cross-region inference lets you route model requests to the AWS region with available capacity, improving resilience and throughput."},{"title":"Llama 3 is now available in Amazon SageMaker JumpStart","link":"https://aws.amazon.com/blogs/machine-learning/llama-3-sagemaker-jumpstart/","source":"AWS Machine Learning Blog","isoDate":"2026-05-12T00:00:00.000Z","contentSnippet":"Meta's Llama 3 models are now available for one-click deployment via SageMaker JumpStart, enabling fine-tuning and inference at scale."}],"system":[{"title":"[$] What is to be done about MGLRU?","link":"https://lwn.net/Articles/1072866/","source":"LWN.net","isoDate":"2026-05-20T13:14:51.000Z","contentSnippet":"The addition of the multi-generational LRU (MGLRU) was meant to provide a better reclaim implementation. Discussions are ongoing."},{"title":"Security updates for Wednesday","link":"https://lwn.net/Articles/1073713/","source":"LWN.net","isoDate":"2026-05-20T13:04:17.000Z","contentSnippet":"Security updates have been issued by AlmaLinux, Debian, Fedora, and others covering kernel, libpng, nginx, ruby, and more."},{"title":"[$] The tenth OpenPGP email summit","link":"https://lwn.net/Articles/1072870/","source":"LWN.net","isoDate":"2026-05-20T11:00:15.000Z","contentSnippet":"The OpenPGP Email Summit is an annual meeting for those who work on encrypted email. The tenth installment took place in March 2026."}]}};

/* ── State ──────────────────────────────────────────────────────────────────── */
var newsData   = null;
var currentTab = 'cve';
var cveSortBy  = 'date'; // 'date' | 'score' | 'severity'

var SEV_RANK = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1, NA: 0 };

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
  if (sb) sb.textContent = loading ? 'SYNCING...' : 'Force sync';
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
      setStatus(json.generator === 'seed' ? 'Seed data loaded' : 'Live RSS data');
      setLastUpdateTime(json.updatedAt);
      setSyncState(false);
      renderCards();
    })
    .catch(function() {
      if (!newsData) newsData = SEED;
      setStatus(' Offline — showing cached / seed data');
      setLastUpdateTime(newsData.updatedAt);
      setSyncState(false);
      renderCards();
    });
}

/* ── CVE severity helpers ───────────────────────────────────────────────────── */
function severityMeta(level) {
  switch ((level || '').toUpperCase()) {
    case 'CRITICAL': return { text: 'text-error',      border: 'border-error/50',        bg: 'bg-error/10' };
    case 'HIGH':     return { text: 'text-orange-400', border: 'border-orange-400/50',   bg: 'bg-orange-400/10' };
    case 'MEDIUM':   return { text: 'text-yellow-400', border: 'border-yellow-400/50',   bg: 'bg-yellow-400/10' };
    case 'LOW':      return { text: 'text-green-400',  border: 'border-green-400/50',    bg: 'bg-green-400/10' };
    default:         return { text: 'text-on-tertiary-container', border: 'border-outline-variant', bg: 'bg-surface-container-low' };
  }
}

function renderCVECard(item, i) {
  var sev   = severityMeta(item.cveSeverity);
  var score = (item.cveScore != null && item.cveScore > 0) ? item.cveScore.toFixed(1) : '—';
  var cardBorder = (item.cveSeverity === 'CRITICAL' || item.cveSeverity === 'HIGH')
    ? sev.border : 'border-outline-variant';

  return [
    '<article class="flex flex-col bg-surface-container border ' + cardBorder + ' card-neon',
    ' group hover:bg-surface-container-high transition-all duration-300 relative"',
    ' style="animation:cardIn 0.35s ease both;animation-delay:' + (i * 60) + 'ms">',

    '<div class="px-5 py-3 flex justify-between items-center">',
      '<span class="font-label-caps text-[11px] font-bold ' + sev.text + '">CVSS ' + score + '</span>',
      '<span class="px-2 py-0.5 text-[11px] font-label-caps font-bold ' + sev.text + ' ' + sev.bg + '">',
        esc(item.cveSeverity || 'NA'),
      '</span>',
    '</div>',

    '<div class="border-t border-outline-variant/50"></div>',

    '<div class="px-5 py-4 flex-grow flex flex-col gap-3">',
      '<a href="' + esc(item.link) + '" target="_blank" rel="noreferrer" class="block group/title">',
        '<h3 class="font-headline-md text-[17px] text-primary neon-text-cyan leading-tight group-hover/title:opacity-80 transition-opacity">',
          esc(item.title),
        '</h3>',
      '</a>',
      '<p class="font-body-md text-sm text-on-surface-variant leading-relaxed opacity-90 line-clamp-4">',
        esc(item.contentSnippet || '—'),
      '</p>',
    '</div>',

    '<div class="border-t border-outline-variant/50"></div>',

    '<div class="px-5 py-3 flex justify-between items-center text-[9px] font-label-caps text-on-surface-variant/60 uppercase">',
      '<span>' + timeAgo(item.isoDate) + '</span>',
      '<span>' + fmtDate(item.isoDate) + '</span>',
    '</div>',

    '</article>',
  ].join('');
}

/* ── CVE sort ───────────────────────────────────────────────────────────────── */
function sortCVEItems(items) {
  var copy = items.slice();
  if (cveSortBy === 'score') {
    copy.sort(function(a, b) { return (b.cveScore || 0) - (a.cveScore || 0); });
  } else if (cveSortBy === 'severity') {
    copy.sort(function(a, b) {
      return (SEV_RANK[b.cveSeverity] || 0) - (SEV_RANK[a.cveSeverity] || 0);
    });
  } else {
    copy.sort(function(a, b) { return new Date(b.isoDate) - new Date(a.isoDate); });
  }
  return copy;
}

function renderSortBar() {
  var bar = document.getElementById('cve-sort-bar');
  if (!bar) return;
  var opts = [
    { key: 'date',     label: 'DATE' },
    { key: 'score',    label: 'CVSS SCORE' },
    { key: 'severity', label: 'SEVERITY' },
  ];
  var active  = 'font-label-caps text-[10px] px-3 py-1 border text-secondary border-secondary bg-secondary/10 tracking-widest uppercase transition-all duration-150';
  var inactive = 'font-label-caps text-[10px] px-3 py-1 border text-on-tertiary-container border-outline-variant hover:text-primary hover:border-primary/40 tracking-widest uppercase transition-all duration-150';
  bar.className = 'mb-4 flex items-center gap-2';
  bar.innerHTML =
    '<span class="font-label-caps text-[9px] text-on-tertiary-container tracking-widest mr-1">SORT_BY:</span>' +
    opts.map(function(o) {
      return '<button data-sort="' + o.key + '" class="' + (cveSortBy === o.key ? active : inactive) + '">' + o.label + '</button>';
    }).join('');

  bar.querySelectorAll('[data-sort]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      cveSortBy = btn.dataset.sort;
      renderSortBar();
      renderCards();
    });
  });
}

/* ── Card render ────────────────────────────────────────────────────────────── */
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

  var sortBar = document.getElementById('cve-sort-bar');
  if (currentTab === 'cve') {
    renderSortBar();
  } else if (sortBar) {
    sortBar.className = 'hidden';
  }

  var feeds = (newsData && newsData.feeds) || {};
  var items = feeds[currentTab] || [];
  var meta  = TABS.find(function(t) { return t.key === currentTab; }) || TABS[1];

  if (items.length === 0) {
    grid.innerHTML = '<p class="font-body-md text-muted col-span-full py-16 text-center">// NO SIGNAL — feed is empty.</p>';
    return;
  }

  var displayItems = (currentTab === 'cve') ? sortCVEItems(items) : items;
  grid.innerHTML = displayItems.map(function(item, i) {
    if (currentTab === 'cve') return renderCVECard(item, i);
    var cardMeta = meta;
    return [
      '<article class="flex flex-col bg-surface-container border border-outline-variant card-neon',
      ' group hover:bg-surface-container-high transition-all duration-300 relative"',
      ' style="animation:cardIn 0.35s ease both;animation-delay:' + (i * 60) + 'ms">',

      '<div class="p-5 border-b border-outline-variant/40">',
        '<div class="font-label-caps text-[10px] ' + cardMeta.textClass + ' tracking-widest opacity-80 mb-2">',
          '[' + esc(currentTab.toUpperCase()) + '_FEED] // ' + esc((item.source || '').toUpperCase()),
        '</div>',
        '<div class="flex justify-between items-center">',
          '<span class="material-symbols-outlined ' + cardMeta.textClass + ' text-2xl" style="font-variation-settings:\'FILL\' 1;">' + cardMeta.icon + '</span>',
          '<span class="px-2 py-0.5 bg-current/10 text-[9px] font-label-caps border border-current/30 ' + cardMeta.textClass + '">' + cardMeta.badge + '</span>',
        '</div>',
      '</div>',

      '<div class="p-5 flex-grow flex flex-col">',
        '<a href="' + esc(item.link) + '" target="_blank" rel="noreferrer"',
        '   class="block mb-3 group/title">',
          '<h3 class="font-headline-md text-[17px] ' + cardMeta.textClass + ' ' + cardMeta.accentClass + ' leading-tight group-hover/title:opacity-80 transition-opacity">',
            esc(item.title),
          '</h3>',
        '</a>',
        '<p class="font-body-md text-sm text-on-surface-variant leading-relaxed opacity-90 line-clamp-3">',
          esc(item.contentSnippet || '—'),
        '</p>',
        '<div class="mt-auto pt-4 flex justify-between items-center text-[9px] font-label-caps text-on-surface-variant/60 uppercase">',
          '<span>' + timeAgo(item.isoDate) + '</span>',
          '<span>[STATUS: ' + cardMeta.status + ']</span>',
        '</div>',
      '</div>',

      '</article>',
    ].join('');
  }).join('');

}

/* ── Tab switching ──────────────────────────────────────────────────────────── */
function switchTab(key) {
  if (key === currentTab) return;
  currentTab = key;

  document.querySelectorAll('.tab-btn[data-tab]').forEach(function(btn) {
    var tab = TABS.find(function(t) { return t.key === btn.dataset.tab; });
    var isActive = btn.dataset.tab === key;
    btn.className = 'tab-btn px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest border-b-2 transition-all duration-150 -mb-px ';
    btn.className += isActive ? tab.activeClass : INACTIVE_TAB;
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  renderCards();
}

/* ── Init ───────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.tab-btn[data-tab]').forEach(function(btn) {
    btn.addEventListener('click', function() { switchTab(btn.dataset.tab); });
  });

  var syncBtn = document.getElementById('sync-btn');
  if (syncBtn) syncBtn.addEventListener('click', loadNews);

  loadNews();
  var _refreshTimer = setInterval(loadNews, 5 * 60 * 1000);
  window.addEventListener('beforeunload', function() { clearInterval(_refreshTimer); });
});
