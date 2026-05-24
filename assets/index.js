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
    key: 'cloud', label: 'CLOUD', icon: 'cloud',
    activeClass:  'text-secondary border-secondary hover-glitch',
    badge: 'CLOUD', status: 'STABLE',
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
var SEED = {"updatedAt":"2026-05-20T14:41:22.179Z","generator":"seed","feeds":{"cve":[{"title":"CVE-2025-29927 - Next.js Middleware Authorization Bypass via x-middleware-subrequest Header","link":"https://cvefeed.io/vuln/detail/CVE-2025-29927","source":"cvefeed.io","isoDate":"2025-03-22T10:00:00.000Z","contentSnippet":"A critical vulnerability in Next.js allows attackers to bypass middleware-based authorization checks by manipulating the x-middleware-subrequest header, potentially granting unauthorized access to protected routes.","cveScore":9.1,"cveSeverity":"CRITICAL"},{"title":"CVE-2024-3400 - PAN-OS GlobalProtect Gateway Command Injection","link":"https://cvefeed.io/vuln/detail/CVE-2024-3400","source":"cvefeed.io","isoDate":"2024-04-12T00:00:00.000Z","contentSnippet":"A command injection vulnerability in the GlobalProtect feature of Palo Alto Networks PAN-OS allows an unauthenticated attacker to execute arbitrary code with root privileges on the firewall.","cveScore":10.0,"cveSeverity":"CRITICAL"},{"title":"CVE-2024-6387 - OpenSSH regreSSHion Remote Code Execution via Signal Handler Race Condition","link":"https://cvefeed.io/vuln/detail/CVE-2024-6387","source":"cvefeed.io","isoDate":"2024-07-01T00:00:00.000Z","contentSnippet":"A race condition in the OpenSSH server (sshd) on glibc-based Linux systems allows an unauthenticated attacker to achieve remote code execution as root. Affects default configurations of sshd.","cveScore":8.1,"cveSeverity":"HIGH"}],"cloud":[{"title":"Trust at every layer: How sealed images extend OS integrity from boot to runtime","link":"https://www.redhat.com/en/blog/how-sealed-images-red-hat-enterprise-linux-extend-os-integrity-boot-runtime","source":"Red Hat Blog","isoDate":"2026-05-20T00:00:00.000Z","contentSnippet":"Consider a medical device running Linux in a hospital, an ATM on a street corner, or a gateway device at the edge of a manufacturing network."},{"title":"Meet Gordon: Docker's AI Agent For Your Entire Container Workflow","link":"https://www.docker.com/blog/meet-gordon-dockers-ai-agent-for-your-entire-container-workflow/","source":"Docker Blog","isoDate":"2026-05-19T19:08:04.000Z","contentSnippet":"Gordon understands your environment, proposes fixes, and takes action across your entire Docker workflow. Now generally available."},{"title":"Red Hat Enterprise Linux 10.2 and 9.8 are here","link":"https://www.redhat.com/en/blog/rhel-102-and-98-intelligent-evolution-enterprise-linux","source":"Red Hat Blog","isoDate":"2026-05-20T00:00:00.000Z","contentSnippet":"RHEL 10.2 and 9.8 evolve the OS from a foundation to a powerful engine for critical applications, security, and innovation."}],"system":[{"title":"[$] What is to be done about MGLRU?","link":"https://lwn.net/Articles/1072866/","source":"LWN.net","isoDate":"2026-05-20T13:14:51.000Z","contentSnippet":"The addition of the multi-generational LRU (MGLRU) was meant to provide a better reclaim implementation. Discussions are ongoing."},{"title":"Security updates for Wednesday","link":"https://lwn.net/Articles/1073713/","source":"LWN.net","isoDate":"2026-05-20T13:04:17.000Z","contentSnippet":"Security updates have been issued by AlmaLinux, Debian, Fedora, and others covering kernel, libpng, nginx, ruby, and more."},{"title":"[$] The tenth OpenPGP email summit","link":"https://lwn.net/Articles/1072870/","source":"LWN.net","isoDate":"2026-05-20T11:00:15.000Z","contentSnippet":"The OpenPGP Email Summit is an annual meeting for those who work on encrypted email. The tenth installment took place in March 2026."}]}};

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

  var feeds = (newsData && newsData.feeds) || {};
  var items = feeds[currentTab] || [];
  var meta  = TABS.find(function(t) { return t.key === currentTab; }) || TABS[1];

  if (items.length === 0) {
    grid.innerHTML = '<p class="font-body-md text-muted col-span-full py-16 text-center">// NO SIGNAL — feed is empty.</p>';
    return;
  }

  grid.innerHTML = items.map(function(item, i) {
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
