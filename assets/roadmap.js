/* ── Roadmap Page ────────────────────────────────────────────────────────── */

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
function saveDone(d) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch (_) {} }

var done      = loadDone();
var activityLog = [];
var _pulseIds   = [];

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

/* ── Update stats ───────────────────────────────────────────────────────────── */
function updateStats() {
  var o = calcOverall();
  var statsEl = document.getElementById('stats-completed');
  var pctEl   = document.getElementById('stats-pct');
  var labelEl = document.getElementById('overall-label');
  if (statsEl) statsEl.textContent = String(o.completed).padStart(2, '0');
  if (pctEl)   pctEl.textContent = o.pct + '% of ' + o.total + ' total tasks';
  if (labelEl) {
    labelEl.innerHTML = 'Neural network training sequence initialized. Complete sequential modules to authorize advanced system clearance.' +
      ' <span class="text-primary ml-2">— ' + o.completed + '/' + o.total + ' tasks (' + o.pct + '%)</span>';
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
  var bar  = document.getElementById('node-bar-'  + trackId);
  if (fill) fill.style.width = p.pct + '%';
  if (prog) prog.textContent = 'SEQUENCE_PROGRESS: ' + p.pct + '%';
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

  applyCbStyle(cb);
  updateNodeBar(trackId);
  updateStats();
  if (task) logActivity(task.title, !!done[id]);
}

function applyCbStyle(cb) {
  if (!cb) return;
  cb.style.cssText = cb.checked
    ? 'background:#00f2ff;border-color:#00f2ff;cursor:pointer;box-shadow:0 0 6px #00f2ff'
    : 'background:transparent;border:1px solid #3a494b;cursor:pointer';
}

/* ── Full render ────────────────────────────────────────────────────────────── */
function renderRoadmap() {
  var container = document.getElementById('roadmap-container');
  if (!container) return;

  var html = ROADMAP.map(function(track, idx) {
    var p     = trackProgress(track);
    var state = nodeState(track);
    var isLast = idx === ROADMAP.length - 1;

    /* --- Per-state appearance --- */
    var nodeClass   = '';
    var badgeHtml   = '';
    var statusLabel = '';
    var iconColor   = 'text-primary';
    var titleColor  = 'text-primary';

    if (state === 'COMPLETED') {
      nodeClass   = 'bg-surface-container/50 border border-outline-variant glow-cyan backdrop-blur-sm';
      badgeHtml   = '<span class="px-3 py-1 bg-primary/20 text-primary text-[10px] font-label-caps border border-primary/40">AUTH_SUCCESS</span>';
      statusLabel = '<span class="bg-primary/10 px-2 py-0.5 border border-primary/30 text-primary">' + track.nodeId + ' // VERIFIED</span>';
      iconColor   = 'text-primary';
      titleColor  = 'text-primary';

    } else if (state === 'IN_PROGRESS') {
      nodeClass   = 'bg-surface-container border-2 border-secondary glow-magenta relative overflow-hidden shadow-[0_0_30px_rgba(255,0,255,0.2)]';
      badgeHtml   = [
        '<div class="flex flex-col items-end">',
          '<span class="px-3 py-1 bg-secondary/20 text-secondary text-[10px] font-label-caps border border-secondary/40">ACTIVE_SEQUENCE</span>',
          '<span class="text-[8px] font-label-caps text-secondary/60 mt-1 uppercase tracking-tighter">Priority: Critical</span>',
        '</div>',
      ].join('');
      statusLabel = '<span class="bg-secondary/10 px-2 py-0.5 border border-secondary/30 text-secondary animate-pulse">' + track.nodeId + ' // EXECUTING...</span>';
      iconColor   = 'text-secondary neon-text-magenta';
      titleColor  = 'text-secondary';

    } else {
      /* LOCKED */
      nodeClass   = 'bg-surface-container/30 border border-outline-variant opacity-40 hover:opacity-60 transition-opacity grayscale';
      badgeHtml   = '<span class="material-symbols-outlined text-on-surface-variant text-xl">lock</span>';
      statusLabel = '<span class="bg-surface-variant/50 px-2 py-0.5 border border-outline-variant/30 text-on-surface-variant/50">' + track.nodeId + ' // ENCRYPTED</span>';
      iconColor   = 'text-on-surface-variant';
      titleColor  = 'text-on-surface-variant/80';
    }

    /* --- Ping dot for in-progress --- */
    var pingDot = state === 'IN_PROGRESS'
      ? '<div class="absolute top-0 right-0 p-2"><div class="w-1 h-1 bg-secondary rounded-full animate-ping"></div></div>'
      : '';

    /* --- Task list --- */
    var tasksHtml = track.tasks.map(function(task) {
      var isDone = !!done[task.id];
      return [
        '<li class="flex items-start gap-3 py-1.5' + (isDone ? ' text-on-tertiary-container' : '') + '" id="task-' + task.id + '">',
          '<input type="checkbox" class="mt-0.5 flex-shrink-0 appearance-none w-3.5 h-3.5 border border-outline"',
          ' id="cb-' + task.id + '" data-id="' + task.id + '" data-track="' + track.id + '"',
          (isDone ? ' checked' : '') + ' />',
          '<span>',
            '<span class="font-body-md text-[13px]' + (isDone ? ' line-through' : '') + '">' + esc(task.title) + '</span>',
            '<span class="block font-label-caps text-[10px] text-on-tertiary-container opacity-70">// ' + esc(task.meta) + '</span>',
          '</span>',
        '</li>',
      ].join('');
    }).join('');

    /* --- Progress bar --- */
    var progressHtml = '';
    if (state === 'IN_PROGRESS') {
      progressHtml = [
        '<div class="mt-8">',
          '<div class="flex justify-between items-end mb-2">',
            '<span class="text-[10px] font-label-caps text-secondary/80">SEQUENCE_PROGRESS</span>',
            '<span class="text-[12px] font-bold font-label-caps text-secondary" id="node-prog-' + track.id + '">' + p.pct + '%</span>',
          '</div>',
          '<div id="node-bar-' + track.id + '" class="w-full bg-surface-container-highest h-1.5 relative overflow-hidden">',
            '<div id="node-fill-' + track.id + '" class="absolute left-0 top-0 h-full bg-secondary shadow-[0_0_10px_#ff00ff]" style="width:' + p.pct + '%"></div>',
            '<div class="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full" style="animation:shimmer 2s infinite"></div>',
          '</div>',
        '</div>',
      ].join('');
    } else if (state === 'COMPLETED') {
      progressHtml = [
        '<div id="node-bar-' + track.id + '" class="mt-4 w-full bg-surface-container-highest h-1 relative">',
          '<div id="node-fill-' + track.id + '" class="absolute left-0 top-0 h-full bg-primary-fixed-dim shadow-[0_0_8px_#00f2ff]" style="width:100%"></div>',
        '</div>',
        '<div class="mt-2 flex gap-6">',
          '<div class="flex flex-col">',
            '<span class="text-[9px] font-label-caps text-on-surface-variant uppercase">Tasks</span>',
            '<span class="text-[12px] font-label-caps text-primary">' + p.tDone + '/' + p.total + '</span>',
          '</div>',
          '<div class="flex flex-col">',
            '<span class="text-[9px] font-label-caps text-on-surface-variant uppercase">Completion</span>',
            '<span class="text-[12px] font-label-caps text-primary">100%</span>',
          '</div>',
        '</div>',
      ].join('');
    } else {
      progressHtml = '<div id="node-bar-' + track.id + '" style="display:none"><div id="node-fill-' + track.id + '"></div></div><span id="node-prog-' + track.id + '" class="hidden"></span>';
    }

    /* --- Connector line to next node --- */
    var connectorHtml = '';
    if (!isLast) {
      if (state === 'LOCKED') {
        connectorHtml = '<div class="absolute top-full left-1/2 -translate-x-1/2 w-px h-32 border-l border-dashed border-outline-variant"></div>';
      } else if (state === 'COMPLETED') {
        var nextState = nodeState(ROADMAP[idx + 1]);
        var gradTo = nextState === 'IN_PROGRESS' ? 'to-secondary/50' : 'to-primary/20';
        connectorHtml = '<div class="absolute top-full left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-primary/50 ' + gradTo + '"></div>';
      } else {
        connectorHtml = '<div class="absolute top-full left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-secondary/20 to-primary/20"></div>';
      }
    }

    return [
      '<div class="relative group z-10 w-full max-w-lg">',

        /* Status badge above node */
        '<div class="absolute -top-8 left-0 font-label-caps text-[11px] tracking-widest opacity-70">',
          statusLabel,
        '</div>',

        /* Node card */
        '<div class="p-8 ' + nodeClass + '">',
          pingDot,

          /* Icon + badge */
          '<div class="flex justify-between items-start mb-6">',
            '<span class="material-symbols-outlined ' + iconColor + ' text-4xl" style="font-variation-settings:\'FILL\' 1;">' + track.icon + '</span>',
            badgeHtml,
          '</div>',

          /* Title + blurb */
          '<h3 class="font-headline-md text-headline-md mb-3 ' + titleColor + '">' + esc(track.label) + '</h3>',
          '<p class="font-body-md text-on-surface-variant leading-relaxed">' + esc(track.blurb) + '</p>',

          /* Task list */
          '<ul class="space-y-0 border-t border-outline-variant/30 pt-4 mt-4">' + tasksHtml + '</ul>',

          progressHtml,
        '</div>',

        connectorHtml,
      '</div>',
    ].join('');
  }).join('');

  container.innerHTML = html;

  /* Attach checkbox listeners + styles */
  container.querySelectorAll('input[type=checkbox][data-id]').forEach(function(cb) {
    applyCbStyle(cb);
    cb.addEventListener('change', function() {
      toggleTask(cb.dataset.id, cb.dataset.track);
    });
  });

  _pulseIds.forEach(clearInterval);
  _pulseIds = [];
  container.querySelectorAll('.glow-magenta').forEach(function(node) {
    _pulseIds.push(setInterval(function() {
      node.classList.toggle('shadow-[0_0_30px_rgba(255,0,255,0.4)]');
    }, 1500));
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