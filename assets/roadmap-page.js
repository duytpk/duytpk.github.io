/* ── Roadmap Page — node-based design ────────────────────────────────────── */

var STORAGE_KEY = 'devsecops-hub:roadmap:v1';

var ROADMAP = [
  {
    id: 'linux', label: 'Linux System', icon: 'terminal',
    blurb: 'Foundation: command line, permissions, processes, networking.',
    nodeId: 'NODE_01',
    tasks: [
      { id: 'linux-cli',       title: 'Master shell basics (bash/zsh, pipes, redirection)', meta: 'fundamentals' },
      { id: 'linux-fs',        title: 'Filesystem hierarchy, permissions & ACLs',            meta: 'fundamentals' },
      { id: 'linux-proc',      title: 'Processes, signals, systemd services & journald',     meta: 'core'         },
      { id: 'linux-net',       title: 'Networking: ip, ss, iptables/nftables, DNS',          meta: 'core'         },
      { id: 'linux-pkg',       title: 'Package mgmt & building from source',                 meta: 'core'         },
      { id: 'linux-hardening', title: 'Hardening: users, SSH, SELinux/AppArmor, auditd',     meta: 'security'     },
      { id: 'linux-scripting', title: 'Automation with shell scripting & cron',               meta: 'advanced'     },
    ],
  },
  {
    id: 'terraform', label: 'Terraform / IaC', icon: 'cloud',
    blurb: 'Infrastructure as Code: provision cloud resources declaratively.',
    nodeId: 'NODE_02',
    tasks: [
      { id: 'tf-hcl',        title: 'HCL syntax, providers & resources',             meta: 'fundamentals' },
      { id: 'tf-state',      title: 'State management & remote backends (S3 + lock)', meta: 'core'         },
      { id: 'tf-vars',       title: 'Variables, outputs, locals & data sources',      meta: 'core'         },
      { id: 'tf-modules',    title: 'Reusable modules & registry usage',              meta: 'core'         },
      { id: 'tf-workspaces', title: 'Workspaces & multi-environment layouts',         meta: 'advanced'     },
      { id: 'tf-cicd',       title: 'plan/apply in CI/CD pipelines',                  meta: 'advanced'     },
      { id: 'tf-sec',        title: 'Policy-as-code (tfsec, OPA, Sentinel)',           meta: 'security'     },
    ],
  },
  {
    id: 'k8s', label: 'Kubernetes', icon: 'hub',
    blurb: 'Container orchestration at scale: workloads, networking, security.',
    nodeId: 'NODE_03',
    tasks: [
      { id: 'k8s-core',          title: 'Pods, ReplicaSets, Deployments & Services',     meta: 'fundamentals' },
      { id: 'k8s-config',        title: 'ConfigMaps, Secrets & environment config',       meta: 'core'         },
      { id: 'k8s-storage',       title: 'Volumes, PV/PVC & StatefulSets',                 meta: 'core'         },
      { id: 'k8s-net',           title: 'Ingress, NetworkPolicies & service mesh basics',  meta: 'core'         },
      { id: 'k8s-helm',          title: 'Packaging with Helm & Kustomize',                meta: 'advanced'     },
      { id: 'k8s-rbac',          title: 'RBAC, ServiceAccounts & Pod Security Standards', meta: 'security'     },
      { id: 'k8s-observability', title: 'Observability: metrics, logs, tracing',          meta: 'advanced'     },
    ],
  },
];

/* ── State ──────────────────────────────────────────────────────────────────── */
function loadDone() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch (_) { return {}; }
}
function saveDone(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }

var done = loadDone();
var activityLog = []; // recent toggle events (session-only)

/* ── Progress helpers ───────────────────────────────────────────────────────── */
function trackProgress(track) {
  var tDone = track.tasks.filter(function(x) { return done[x.id]; }).length;
  var pct   = Math.round((tDone / track.tasks.length) * 100);
  return { tDone: tDone, total: track.tasks.length, pct: pct };
}

function calcOverall() {
  var total = 0, completed = 0;
  ROADMAP.forEach(function(t) {
    total     += t.tasks.length;
    completed += t.tasks.filter(function(x) { return done[x.id]; }).length;
  });
  return { total: total, completed: completed, pct: total ? Math.round((completed / total) * 100) : 0 };
}

/* Node state: COMPLETED | IN_PROGRESS | LOCKED */
function nodeState(track) {
  var p = trackProgress(track);
  if (p.pct === 100) return 'COMPLETED';
  if (p.tDone  >  0) return 'IN_PROGRESS';
  return 'LOCKED';
}

/* ── Activity log ───────────────────────────────────────────────────────────── */
function logActivity(taskTitle, isDone) {
  var now = new Date().toISOString().slice(11, 19);
  activityLog.unshift({ time: now, msg: (isDone ? 'Completed: ' : 'Unchecked: ') + taskTitle });
  if (activityLog.length > 5) activityLog.pop();
  renderActivityLog();
}

function renderActivityLog() {
  var el = document.getElementById('activity-log');
  if (!el) return;
  if (activityLog.length === 0) {
    el.innerHTML = '<div class="flex gap-4"><span class="text-primary-fixed-dim font-bold">READY_</span><span class="bg-primary w-2 h-4 cursor-blink inline-block"></span></div>';
    return;
  }
  el.innerHTML = activityLog.map(function(e) {
    return '<div class="flex gap-4"><span class="text-secondary">[' + e.time + ']</span><span>' + esc(e.msg) + '</span></div>';
  }).join('') + '<div class="flex gap-4 mt-1"><span class="text-primary-fixed-dim font-bold">READY_</span><span class="bg-primary w-2 h-4 cursor-blink inline-block"></span></div>';
}

/* ── Update stats widgets ───────────────────────────────────────────────────── */
function updateStats() {
  var o = calcOverall();
  var statsEl = document.getElementById('stats-completed');
  var pctEl   = document.getElementById('stats-pct');
  var labelEl = document.getElementById('overall-label');
  if (statsEl) statsEl.textContent = String(o.completed).padStart(2, '0');
  if (pctEl)   pctEl.textContent = o.pct + '% of ' + o.total + ' total tasks';
  if (labelEl) {
    labelEl.innerHTML = 'Hệ thống theo dõi tiến độ đào tạo. Hoàn thành các node để mở khóa các đặc quyền hệ thống tiếp theo. <span class="text-primary ml-2">— ' + o.completed + '/' + o.total + ' tasks (' + o.pct + '%)</span>';
  }
}

/* ── Partial node bar update (no full re-render) ──────────────────────────── */
function updateNodeBar(trackId) {
  var track = null;
  for (var i = 0; i < ROADMAP.length; i++) {
    if (ROADMAP[i].id === trackId) { track = ROADMAP[i]; break; }
  }
  if (!track) return;
  var p = trackProgress(track);

  var fill = document.getElementById('node-fill-' + trackId);
  var prog = document.getElementById('node-prog-' + trackId);
  var bar  = document.getElementById('node-bar-' + trackId);
  if (fill) fill.style.width = p.pct + '%';
  if (prog) prog.textContent = 'PROGRESS: ' + p.pct + '%';
  if (bar)  bar.style.display = p.tDone > 0 ? 'block' : 'none';
}

/* ── Toggle task ────────────────────────────────────────────────────────────── */
function toggleTask(id, trackId) {
  var task = null;
  for (var i = 0; i < ROADMAP.length; i++) {
    for (var j = 0; j < ROADMAP[i].tasks.length; j++) {
      if (ROADMAP[i].tasks[j].id === id) { task = ROADMAP[i].tasks[j]; break; }
    }
  }
  done[id] = !done[id];
  saveDone(done);

  var item = document.getElementById('task-' + id);
  var cb   = document.getElementById('cb-' + id);
  if (item) item.classList.toggle('line-through', !!done[id]);
  if (item) item.classList.toggle('text-on-tertiary-container', !!done[id]);
  if (cb)   cb.checked = !!done[id];

  updateNodeBar(trackId);
  updateStats();
  if (task) logActivity(task.title, !!done[id]);
}

/* ── Escape helper ──────────────────────────────────────────────────────────── */
function esc(str) {
  return String(str || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── Full render ────────────────────────────────────────────────────────────── */
function renderRoadmap() {
  var container = document.getElementById('roadmap-container');
  if (!container) return;

  var html = ROADMAP.map(function(track, idx) {
    var p     = trackProgress(track);
    var state = nodeState(track);
    var isLast = idx === ROADMAP.length - 1;

    /* Node appearance by state */
    var nodeGlowClass = '';
    var badgeHtml     = '';
    var statusLabel   = '';
    var iconColor     = 'text-primary';

    if (state === 'COMPLETED') {
      nodeGlowClass = 'glow-cyan';
      badgeHtml = '<span class="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-label-caps">COMPLETED</span>';
      statusLabel = '<span class="text-[10px] font-label-caps text-primary opacity-50">[ ' + track.nodeId + ': STABLE ]</span>';
    } else if (state === 'IN_PROGRESS') {
      nodeGlowClass = 'glow-magenta';
      iconColor = 'text-secondary';
      badgeHtml = '<span class="px-2 py-0.5 bg-secondary/20 text-secondary text-[10px] font-label-caps flex items-center gap-1">' +
        '<span class="w-1 h-1 bg-secondary rounded-full animate-ping"></span>ACTIVE_TASK</span>';
      statusLabel = '<span class="text-[10px] font-label-caps text-secondary opacity-80 animate-pulse">[ ' + track.nodeId + ': IN_PROGRESS ]</span>';
    } else {
      /* LOCKED */
      nodeGlowClass = '';
      badgeHtml = '<span class="material-symbols-outlined text-on-surface-variant text-sm">lock</span>';
      statusLabel = '<span class="text-[10px] font-label-caps text-on-surface-variant opacity-40">[ ' + track.nodeId + ': LOCKED ]</span>';
      iconColor = 'text-on-surface-variant';
    }

    var lockedClass = state === 'LOCKED' ? 'opacity-50 hover:opacity-80 transition-opacity grayscale hover:grayscale-0' : '';

    /* Task list */
    var tasksHtml = track.tasks.map(function(task) {
      var isDone = !!done[task.id];
      return '<li class="flex items-start gap-3 py-1.5' + (isDone ? ' text-on-tertiary-container' : '') + '" id="task-' + task.id + '">' +
        '<input type="checkbox" class="mt-0.5 flex-shrink-0 appearance-none w-3.5 h-3.5 border border-outline' +
          (isDone ? ' bg-primary-fixed-dim border-primary-fixed-dim checked:bg-primary-fixed-dim' : ' hover:border-primary cursor-pointer') +
          '" id="cb-' + task.id + '" data-id="' + task.id + '" data-track="' + track.id + '"' +
          (isDone ? ' checked' : '') + ' />' +
        '<span>' +
          '<span class="font-body-md text-[13px]' + (isDone ? ' line-through' : '') + '">' + esc(task.title) + '</span>' +
          '<span class="block font-label-caps text-[10px] text-on-tertiary-container opacity-70">// ' + esc(task.meta) + '</span>' +
        '</span>' +
      '</li>';
    }).join('');

    /* Progress bar (only shown when in progress) */
    var progressHtml = state === 'IN_PROGRESS' ? [
      '<div id="node-bar-' + track.id + '" class="mt-4 w-full bg-surface-container-highest h-1 relative">',
        '<div id="node-fill-' + track.id + '" class="absolute left-0 top-0 h-full bg-secondary shadow-[0_0_8px_#ffabf3]" style="width:' + p.pct + '%"></div>',
      '</div>',
      '<div class="mt-2 text-[10px] font-label-caps text-secondary" id="node-prog-' + track.id + '">PROGRESS: ' + p.pct + '%</div>',
    ].join('') : (state === 'COMPLETED' ? [
      '<div id="node-bar-' + track.id + '" class="mt-4 w-full bg-surface-container-highest h-1 relative">',
        '<div id="node-fill-' + track.id + '" class="absolute left-0 top-0 h-full bg-primary-fixed-dim shadow-[0_0_8px_#00dbe7]" style="width:100%"></div>',
      '</div>',
    ].join('') : '<div id="node-bar-' + track.id + '" style="display:none"><div id="node-fill-' + track.id + '"></div></div><span id="node-prog-' + track.id + '" class="hidden"></span>');

    /* Connector line to next node */
    var connectorHtml = isLast ? '' : (state === 'LOCKED'
      ? '<div class="absolute top-full left-1/2 -translate-x-1/2 w-[2px] h-24 border-l-2 border-dashed border-outline-variant"></div>'
      : '<div class="absolute top-full left-1/2 -translate-x-1/2 w-[2px] h-24 bg-primary/30"></div>');

    return [
      '<div class="relative group z-10 w-full max-w-xl">',
        '<div class="absolute -top-6 left-0">' + statusLabel + '</div>',
        '<div class="p-6 bg-surface-container border border-outline-variant ' + nodeGlowClass + ' ' + lockedClass + ' relative overflow-hidden">',

          /* Icon + badge */
          '<div class="flex justify-between items-start mb-4">',
            '<span class="material-symbols-outlined ' + iconColor + ' text-3xl" style="font-variation-settings:\'FILL\' 1;">' + track.icon + '</span>',
            badgeHtml,
          '</div>',

          /* Title + blurb */
          '<h3 class="font-headline-md text-headline-md mb-2">' + esc(track.label) + '</h3>',
          '<p class="font-body-md text-on-surface-variant mb-4">' + esc(track.blurb) + '</p>',

          /* Task list */
          '<ul class="space-y-0 border-t border-outline-variant/30 pt-4">' + tasksHtml + '</ul>',

          progressHtml,
        '</div>',
        connectorHtml,
      '</div>',
    ].join('');
  }).join('');

  container.innerHTML = html;

  /* Attach checkbox listeners */
  container.querySelectorAll('input[type=checkbox][data-id]').forEach(function(cb) {
    cb.addEventListener('change', function() {
      toggleTask(cb.dataset.id, cb.dataset.track);
    });
    /* Style checked state manually since Tailwind CDN can't do :checked dynamically for custom colours */
    cb.style.cssText = cb.checked
      ? 'background:#00dbe7;border-color:#00dbe7;cursor:pointer'
      : 'background:transparent;border:1px solid #3a494b;cursor:pointer';
    cb.addEventListener('change', function() {
      cb.style.cssText = cb.checked
        ? 'background:#00dbe7;border-color:#00dbe7;cursor:pointer'
        : 'background:transparent;border:1px solid #3a494b;cursor:pointer';
    });
  });

  updateStats();
}

/* ── Modal ──────────────────────────────────────────────────────────────────── */
function openModal() {
  var countEl = document.getElementById('modal-count');
  if (countEl) countEl.textContent = calcOverall().completed;
  document.getElementById('reset-modal').classList.remove('hidden');
}
function closeModal() {
  document.getElementById('reset-modal').classList.add('hidden');
}
function doReset() {
  done = {};
  saveDone(done);
  activityLog = [];
  closeModal();
  renderRoadmap();
  renderActivityLog();
}

/* ── Init ───────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function() {
  renderRoadmap();
  renderActivityLog();

  var resetBtn     = document.getElementById('reset-btn');
  var modalConfirm = document.getElementById('modal-confirm');
  var modalCancel  = document.getElementById('modal-cancel');
  var modalOverlay = document.getElementById('reset-modal');

  if (resetBtn)     resetBtn.addEventListener('click', openModal);
  if (modalConfirm) modalConfirm.addEventListener('click', doReset);
  if (modalCancel)  modalCancel.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      if (e.target === modalOverlay) closeModal();
    });
  }
});
