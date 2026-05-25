/* ── CVE / News Dashboard ─────────────────────────────────────────────────── */

(function () {

var TABS = [
  {
    key: 'cve', label: 'CVE', icon: 'security',
    activeClass:  'text-secondary border-secondary hover-glitch',
    badge: 'Live threat', status: 'Active threat',
    textClass:   'text-primary',
    accentClass: 'neon-text-cyan',
  },
  {
    key: 'ai', label: 'AI', icon: 'smart_toy',
    activeClass:  'text-secondary border-secondary hover-glitch',
    badge: 'AI update', status: 'Stable',
    textClass:   'text-primary',
    accentClass: 'neon-text-cyan',
  },
];

var INACTIVE_TAB = 'text-primary border-transparent hover:border-primary/40 hover-glitch';

/* Time constants */
var MS_HOUR       = 3600000;
var MS_DAY        = 86400000;
var MS_WEEK       = 604800000;
var REFRESH_MS    = 5 * 60 * 1000;
var CARD_DELAY_MS = 60;

/* Shared select class for sort/filter dropdowns */
var SELECT_CLS = 'appearance-none font-label-caps text-[10px] text-primary bg-surface-container border border-outline-variant pl-2 pr-8 py-1 min-w-[140px] tracking-widest hover:border-primary/60 focus:outline-none focus:border-secondary focus:text-secondary transition-all duration-150 cursor-pointer';

/* Seed data — rendered if /news.json fetch fails (e.g. file:// protocol). */
var SEED = {
  updatedAt: '2026-05-20T14:41:22.179Z',
  generator: 'seed',
  feeds: {
    cve: [
      {
        title: 'CVE-2025-29927 - Next.js Middleware Authorization Bypass via x-middleware-subrequest Header',
        link: 'https://cvefeed.io/vuln/detail/CVE-2025-29927',
        source: 'cvefeed.io',
        isoDate: '2025-03-22T10:00:00.000Z',
        contentSnippet: 'A critical vulnerability in Next.js allows attackers to bypass middleware-based authorization checks by manipulating the x-middleware-subrequest header, potentially granting unauthorized access to protected routes.',
        cveScore: 9.1,
        cveSeverity: 'CRITICAL',
      },
      {
        title: 'CVE-2024-3400 - PAN-OS GlobalProtect Gateway Command Injection',
        link: 'https://cvefeed.io/vuln/detail/CVE-2024-3400',
        source: 'cvefeed.io',
        isoDate: '2024-04-12T00:00:00.000Z',
        contentSnippet: 'A command injection vulnerability in the GlobalProtect feature of Palo Alto Networks PAN-OS allows an unauthenticated attacker to execute arbitrary code with root privileges on the firewall.',
        cveScore: 10.0,
        cveSeverity: 'CRITICAL',
      },
      {
        title: 'CVE-2024-6387 - OpenSSH regreSSHion Remote Code Execution via Signal Handler Race Condition',
        link: 'https://cvefeed.io/vuln/detail/CVE-2024-6387',
        source: 'cvefeed.io',
        isoDate: '2024-07-01T00:00:00.000Z',
        contentSnippet: 'A race condition in the OpenSSH server (sshd) on glibc-based Linux systems allows an unauthenticated attacker to achieve remote code execution as root. Affects default configurations of sshd.',
        cveScore: 8.1,
        cveSeverity: 'HIGH',
      },
    ],
    ai: [
      {
        title: 'Gemini 2.5 Pro Preview: Our most intelligent model',
        link: 'https://blog.google/technology/ai/gemini-2-5-pro-preview/',
        source: 'Google AI Blog',
        isoDate: '2026-05-14T00:00:00.000Z',
        contentSnippet: 'Gemini 2.5 Pro Preview delivers state-of-the-art performance on coding, math, and science benchmarks, with a 1M token context window.',
      },
      {
        title: 'Amazon Bedrock now supports cross-region inference',
        link: 'https://aws.amazon.com/blogs/machine-learning/amazon-bedrock-cross-region-inference/',
        source: 'AWS Machine Learning Blog',
        isoDate: '2026-05-13T00:00:00.000Z',
        contentSnippet: 'Cross-region inference lets you route model requests to the AWS region with available capacity, improving resilience and throughput.',
      },
      {
        title: 'Llama 3 is now available in Amazon SageMaker JumpStart',
        link: 'https://aws.amazon.com/blogs/machine-learning/llama-3-sagemaker-jumpstart/',
        source: 'AWS Machine Learning Blog',
        isoDate: '2026-05-12T00:00:00.000Z',
        contentSnippet: "Meta's Llama 3 models are now available for one-click deployment via SageMaker JumpStart, enabling fine-tuning and inference at scale.",
      },
    ],
  },
};

/* ── State ──────────────────────────────────────────────────────────────────── */
var newsData       = null;
var currentTab     = 'cve';
var cveSortBy      = 'date';   // 'date' | 'score'
var aiFilterSource = 'all';

/* ── Helpers ────────────────────────────────────────────────────────────────── */
function fmtDate(iso) {
  try { return new Date(iso).toISOString().slice(0, 16).replace('T', ' ') + ' UTC'; }
  catch (_) { return iso || '—'; }
}

function timeAgo(iso) {
  try {
    var diff = Date.now() - new Date(iso).getTime();
    var h = Math.floor(diff / MS_HOUR);
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

/* ── Shared card sections ───────────────────────────────────────────────────── */
function _cardBody(item) {
  return [
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
  ].join('');
}

function _cardFooter(item) {
  return [
    '<div class="border-t border-outline-variant/50"></div>',
    '<div class="px-5 py-3 flex justify-between items-center text-[9px] font-label-caps text-on-surface-variant/60 uppercase">',
      '<span>' + timeAgo(item.isoDate) + '</span>',
      '<span>' + fmtDate(item.isoDate) + '</span>',
    '</div>',
  ].join('');
}

/* ── Card renderers ─────────────────────────────────────────────────────────── */
function renderCVECard(item, i) {
  var sev       = severityMeta(item.cveSeverity);
  var score     = (item.cveScore != null && item.cveScore > 0) ? item.cveScore.toFixed(1) : '—';
  var cardBorder = (item.cveSeverity === 'CRITICAL' || item.cveSeverity === 'HIGH')
    ? sev.border : 'border-outline-variant';

  return [
    '<article class="flex flex-col bg-surface-container border ' + cardBorder + ' card-neon',
    ' group hover:bg-surface-container-high transition-all duration-300 relative"',
    ' style="animation:cardIn 0.35s ease both;animation-delay:' + (i * CARD_DELAY_MS) + 'ms">',

    '<div class="px-5 py-3 flex justify-between items-center">',
      '<span class="font-label-caps text-[11px] font-bold ' + sev.text + '">CVSS ' + score + '</span>',
      '<span class="px-2 py-0.5 text-[11px] font-label-caps font-bold ' + sev.text + ' ' + sev.bg + '">',
        esc(item.cveSeverity || 'NA'),
      '</span>',
    '</div>',

    '<div class="border-t border-outline-variant/50"></div>',

    _cardBody(item),
    _cardFooter(item),

    '</article>',
  ].join('');
}

function renderFeedCard(item, i, meta) {
  return [
    '<article class="flex flex-col bg-surface-container border border-primary card-neon',
    ' group hover:bg-surface-container-high transition-all duration-300 relative"',
    ' style="animation:cardIn 0.35s ease both;animation-delay:' + (i * CARD_DELAY_MS) + 'ms">',

    '<div class="px-5 py-3 flex justify-between items-center">',
      '<span class="material-symbols-outlined text-primary text-xl" style="font-variation-settings:\'FILL\' 1;">' + meta.icon + '</span>',
      '<span class="font-label-caps text-[10px] text-on-tertiary-container tracking-widest truncate max-w-[60%] text-right">' + esc(item.source || '') + '</span>',
    '</div>',
    '<div class="border-t border-outline-variant/50"></div>',

    _cardBody(item),
    _cardFooter(item),

    '</article>',
  ].join('');
}

/* ── Sort / filter bars ─────────────────────────────────────────────────────── */
function renderSortBar() {
  var bar = document.getElementById('cve-sort-bar');
  if (!bar) return;
  bar.className = 'mb-4 flex items-center justify-end gap-2';
  bar.innerHTML =
    '<label for="cve-sort-select" class="font-label-caps text-[9px] text-on-tertiary-container tracking-widest">Sort:</label>' +
    '<div class="relative">' +
    '<select id="cve-sort-select" class="' + SELECT_CLS + '">' +
    '<option value="date"'  + (cveSortBy === 'date'  ? ' selected' : '') + '>Date</option>' +
    '<option value="score"' + (cveSortBy === 'score' ? ' selected' : '') + '>CVSS Score</option>' +
    '</select>' +
    '<span class="material-symbols-outlined pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-primary select-none" style="font-size:14px">expand_more</span>' +
    '</div>';

  var sel = bar.querySelector('#cve-sort-select');
  if (sel) sel.addEventListener('change', function() { cveSortBy = this.value; renderCards(); });
}

function renderFilterBar() {
  var bar = document.getElementById('ai-filter-bar');
  if (!bar) return;
  var feeds = (newsData && newsData.feeds) || {};
  var sources = ['all'];
  (feeds['ai'] || []).forEach(function(item) {
    if (item.source && sources.indexOf(item.source) === -1) sources.push(item.source);
  });
  bar.className = 'mb-4 flex items-center justify-end gap-2';
  bar.innerHTML =
    '<label for="ai-filter-select" class="font-label-caps text-[9px] text-on-tertiary-container tracking-widest">Source:</label>' +
    '<div class="relative">' +
    '<select id="ai-filter-select" class="' + SELECT_CLS + '">' +
    sources.map(function(s) {
      return '<option value="' + esc(s) + '"' + (aiFilterSource === s ? ' selected' : '') + '>' + esc(s === 'all' ? 'All' : s) + '</option>';
    }).join('') +
    '</select>' +
    '<span class="material-symbols-outlined pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-primary select-none" style="font-size:14px">expand_more</span>' +
    '</div>';

  var sel = bar.querySelector('#ai-filter-select');
  if (sel) sel.addEventListener('change', function() { aiFilterSource = this.value; renderCards(); });
}

/* ── Card render ────────────────────────────────────────────────────────────── */
function renderTabCounts() {
  var feeds = (newsData && newsData.feeds) || {};
  TABS.forEach(function(t) {
    var el = document.getElementById('tab-count-' + t.key);
    if (el) el.textContent = '[' + (feeds[t.key] || []).length + ']';
  });
}

function sortCVEItems(items) {
  var copy = items.slice();
  if (cveSortBy === 'score') {
    copy.sort(function(a, b) { return (b.cveScore || 0) - (a.cveScore || 0); });
  } else {
    copy.sort(function(a, b) { return new Date(b.isoDate) - new Date(a.isoDate); });
  }
  return copy;
}

function filterAIItems(items) {
  if (aiFilterSource === 'all') return items;
  return items.filter(function(item) { return item.source === aiFilterSource; });
}

function renderCards() {
  var grid = document.getElementById('news-grid');
  if (!grid) return;
  renderTabCounts();

  var sortBar   = document.getElementById('cve-sort-bar');
  var filterBar = document.getElementById('ai-filter-bar');
  if (currentTab === 'cve') {
    renderSortBar();
    if (filterBar) filterBar.className = 'hidden';
  } else {
    if (sortBar) sortBar.className = 'hidden';
    renderFilterBar();
  }

  var feeds = (newsData && newsData.feeds) || {};
  var items = feeds[currentTab] || [];
  var meta  = TABS.find(function(t) { return t.key === currentTab; }) || TABS[1];

  if (items.length === 0) {
    grid.innerHTML = '<p class="font-body-md text-muted col-span-full py-16 text-center">// NO SIGNAL — feed is empty.</p>';
    return;
  }

  var displayItems = (currentTab === 'cve') ? sortCVEItems(items) : filterAIItems(items);
  grid.innerHTML = displayItems.map(function(item, i) {
    if (currentTab === 'cve') return renderCVECard(item, i);
    return renderFeedCard(item, i, meta);
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
  var _refreshTimer = setInterval(loadNews, REFRESH_MS);
  window.addEventListener('beforeunload', function() { clearInterval(_refreshTimer); });
});

}());
