/* ── Roadmap Page ────────────────────────────────────────────────────────── */

(function () {

var STORAGE_KEY  = 'devsecops-hub:roadmap:v2';
var MAX_ACTIVITY = 5;
var TIME_START   = 11;
var TIME_END     = 19;
var CLS_LABEL_SM = 'font-label-caps text-[10px]';

/* Days 1–8 seeded as completed per curriculum status */
var DEFAULT_DONE = {
  'k8s-d1': true, 'k8s-d2': true, 'k8s-d3': true, 'k8s-d4': true,
  'k8s-d5': true, 'k8s-d6': true, 'k8s-d7': true, 'k8s-d8': true,
};

var ROADMAP = [
  {
    id: 'k8s', label: 'Kubernetes', nodeId: 'NODE_01',
    tasks: [
      { id: 'k8s-d1',  title: 'Day 1 — Architecture & Internals',      topics: 'Control Plane, etcd (RAFT), kubelet, kube-proxy, CRI/CNI/CSI',                                                       meta: 'core'     },
      { id: 'k8s-d2',  title: 'Day 2 — Workloads & Controllers',       topics: 'Init/Sidecar patterns, Liveness/Readiness/Startup probes, Deployment, StatefulSet, DaemonSet, Job & CronJob',         meta: 'core'     },
      { id: 'k8s-d3',  title: 'Day 3 — Networking & Connectivity',     topics: 'Flat network model, CNI (Calico/Cilium), Service types, Ingress & Ingress Controller, CoreDNS',                        meta: 'core'     },
      { id: 'k8s-d4',  title: 'Day 4 — Storage & Configuration',       topics: 'PV/PVC/StorageClass, Static vs Dynamic provisioning, Access modes, ConfigMap, Secret, Sealed Secrets, Vault',          meta: 'core'     },
      { id: 'k8s-d5',  title: 'Day 5 — Scheduling & Resource Mgmt',    topics: 'Requests/Limits, CPU throttling vs OOMKill, QoS classes, Node/Pod Affinity, Taints & Tolerations, Priority',          meta: 'core'     },
      { id: 'k8s-d6',  title: 'Day 6 — Security & Access Control',     topics: 'RBAC (Role/ClusterRole/Binding), ServiceAccounts, Network Policies (Zero Trust), Security Context',                    meta: 'security' },
      { id: 'k8s-d7',  title: 'Day 7 — Observability',                 topics: 'Node-level logging (DaemonSet), EFK vs PLG stack, Prometheus pull model, Histogram/Counter/Gauge, kube-state-metrics', meta: 'advanced' },
      { id: 'k8s-d8',  title: 'Day 8 — Package Management',            topics: 'Helm v3 (no Tiller), Chart/Release lifecycle, Kustomize Base & Overlay, Helm + Kustomize post-renderer hybrid',       meta: 'advanced' },
      { id: 'k8s-d9',  title: 'Day 9 — Troubleshooting & Maintenance', topics: 'Cordon/Drain/Uncordon, etcd snapshot backup & restore, Cluster upgrade lifecycle (kubeadm)',                           meta: 'advanced' },
      { id: 'k8s-d10', title: 'Day 10 — Advanced Topics',              topics: 'GitOps, Service Mesh (Istio/Linkerd), eBPF, Multi-cluster federation, Modern Ecosystem',                               meta: 'advanced' },
    ],
  },
  {
    id: 'linux', label: 'Linux System', nodeId: 'NODE_02',
    tasks: [
      { id: 'linux-cli',       title: 'Shell Fundamentals',       topics: 'bash/zsh, pipes, redirection, expansion, quoting',          meta: 'fundamentals' },
      { id: 'linux-fs',        title: 'Filesystem & Permissions', topics: 'Hierarchy, chmod/chown, ACLs, hard/soft links',              meta: 'fundamentals' },
      { id: 'linux-proc',      title: 'Processes & Services',     topics: 'Signals, ps/top, systemd units, journald',                   meta: 'core'         },
      { id: 'linux-net',       title: 'Networking',               topics: 'ip, ss, iptables/nftables, DNS, routing',                    meta: 'core'         },
      { id: 'linux-pkg',       title: 'Package Management',       topics: 'apt/yum, building from source, version pinning',             meta: 'core'         },
      { id: 'linux-hardening', title: 'Hardening & Security',     topics: 'Users, SSH config, SELinux/AppArmor, auditd',               meta: 'security'     },
      { id: 'linux-scripting', title: 'Automation & Scripting',   topics: 'Shell scripting patterns, cron, systemd timers',             meta: 'advanced'     },
    ],
  },
  {
    id: 'terraform', label: 'Terraform / IaC', nodeId: 'NODE_03',
    tasks: [
      { id: 'tf-hcl',        title: 'HCL Syntax & Providers',    topics: 'Resources, data sources, provider configuration',            meta: 'fundamentals' },
      { id: 'tf-state',      title: 'State Management',          topics: 'Remote backends (S3 + DynamoDB lock), state isolation',       meta: 'core'         },
      { id: 'tf-vars',       title: 'Variables & Outputs',       topics: 'Input vars, locals, outputs, tfvars files',                  meta: 'core'         },
      { id: 'tf-modules',    title: 'Reusable Modules',          topics: 'Module structure, registry usage, versioning',               meta: 'core'         },
      { id: 'tf-workspaces', title: 'Workspaces & Environments', topics: 'Workspace commands, multi-env layout patterns',              meta: 'advanced'     },
      { id: 'tf-cicd',       title: 'CI/CD Integration',         topics: 'plan/apply in pipelines, automated drift detection',         meta: 'advanced'     },
      { id: 'tf-sec',        title: 'Policy as Code',            topics: 'tfsec, OPA, Sentinel, compliance guardrails',                meta: 'security'     },
    ],
  },
];

/* ── State ──────────────────────────────────────────────────────────────────── */
function loadDone() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) { saveDone(DEFAULT_DONE); return DEFAULT_DONE; }
    var parsed = JSON.parse(raw);
    if (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    return {};
  } catch (_) { return {}; }
}
function saveDone(d) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch (_) {} }

var done        = loadDone();
var activityLog = [];
var activeTrack = 'k8s';

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

/* ── Activity log ───────────────────────────────────────────────────────────── */
function logActivity(taskTitle, isDone) {
  var now = new Date().toISOString().slice(TIME_START, TIME_END);
  activityLog.unshift({ time: now, msg: (isDone ? 'Completed: ' : 'Unchecked: ') + taskTitle });
  if (activityLog.length > MAX_ACTIVITY) activityLog.pop();
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

/* ── Tab button state ───────────────────────────────────────────────────────── */
var TAB_ACTIVE   = 'tab-btn px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest border-b-2 transition-all duration-150 -mb-px hover-glitch text-secondary border-secondary';
var TAB_INACTIVE = 'tab-btn px-4 py-2 font-label-caps text-label-caps uppercase tracking-widest border-b-2 transition-all duration-150 -mb-px hover-glitch text-primary border-transparent hover:border-primary/40';

function updateTabBtns() {
  document.querySelectorAll('.tab-btn[data-track]').forEach(function(btn) {
    var isActive = btn.dataset.track === activeTrack;
    btn.setAttribute('aria-selected', String(isActive));
    btn.className = isActive ? TAB_ACTIVE : TAB_INACTIVE;
  });
}

/* ── Update stats ───────────────────────────────────────────────────────────── */
function updateStats() {
  var o       = calcOverall();
  var statsEl = document.getElementById('stats-completed');
  var pctEl   = document.getElementById('stats-pct');
  var labelEl = document.getElementById('overall-label');
  var ctrlEl  = document.getElementById('ctrl-progress');
  if (statsEl) statsEl.textContent = String(o.completed).padStart(2, '0');
  if (pctEl)   pctEl.textContent = o.pct + '% of ' + o.total + ' total tasks';
  if (ctrlEl)  ctrlEl.textContent = o.completed + ' / ' + o.total + ' (' + o.pct + '%)';
  if (labelEl) {
    labelEl.innerHTML =
      'Neural network training sequence initialized. Complete sequential modules to authorize advanced system clearance.' +
      ' <span class="text-primary ml-2">— ' + o.completed + '/' + o.total + ' tasks (' + o.pct + '%)</span>' +
      ' <span class="inline-block w-2 h-2 rounded-full bg-secondary animate-ping align-middle ml-1"></span>';
  }
}

/* ── Day card ───────────────────────────────────────────────────────────────── */
function renderDayCard(task, trackId) {
  var isDone = !!done[task.id];

  var cardCls  = isDone ? 'glow-magenta bg-surface-container' : 'card-neon bg-surface-container-low';
  var titleCls = 'task-title font-body-md text-[14px] font-bold leading-snug ' + (isDone ? 'text-secondary neon-text-magenta' : 'text-primary neon-text-cyan');
  var badge    = isDone
    ? '<span class="px-2 py-0.5 bg-secondary/20 text-secondary ' + CLS_LABEL_SM + ' border border-secondary/40 tracking-widest">COMPLETED</span>'
    : '<span class="px-2 py-0.5 text-on-tertiary-container ' + CLS_LABEL_SM + ' border border-outline-variant/50 tracking-widest">PENDING</span>';

  return [
    '<div class="p-5 border border-outline-variant ' + cardCls + (isDone ? ' opacity-80' : '') + '" id="task-' + task.id + '">',
      '<div class="flex items-start justify-between gap-2 mb-3">',
        '<span class="' + CLS_LABEL_SM + ' text-on-tertiary-container tracking-widest">// ' + esc(task.meta).toUpperCase() + '</span>',
        badge,
      '</div>',
      '<p class="' + titleCls + ' mb-2">' + esc(task.title) + '</p>',
      task.topics ? '<p class="font-body-md text-[11px] text-on-surface-variant/70 leading-relaxed">' + esc(task.topics) + '</p>' : '',
      '<div class="flex items-center mt-4 pt-3 border-t border-outline-variant/30">',
        '<label class="flex items-center gap-2 cursor-pointer select-none">',
          '<input type="checkbox" class="appearance-none w-3.5 h-3.5 border flex-shrink-0"',
            ' id="cb-' + task.id + '" data-id="' + task.id + '" data-track="' + trackId + '"' + (isDone ? ' checked' : '') + ' />',
          '<span class="' + CLS_LABEL_SM + ' text-on-surface-variant tracking-widest">' + (isDone ? 'MARK_UNDONE' : 'MARK_DONE') + '</span>',
        '</label>',
      '</div>',
    '</div>',
  ].join('');
}

/* ── Track panel ────────────────────────────────────────────────────────────── */
function renderTrackPanel(track) {
  var p      = trackProgress(track);
  var done100 = p.pct === 100;
  var barCls  = done100 ? 'bg-primary-fixed-dim shadow-[0_0_8px_#00f2ff]' : 'bg-secondary shadow-[0_0_6px_rgba(255,171,243,0.5)]';
  var pctCls  = done100 ? 'text-primary' : 'text-secondary';

  var progressBar = [
    '<div class="flex items-center justify-between mb-2">',
      '<span class="' + CLS_LABEL_SM + ' text-on-surface-variant tracking-widest">' + p.tDone + ' / ' + p.total + ' MODULES COMPLETED</span>',
      '<span class="' + CLS_LABEL_SM + ' ' + pctCls + '">' + p.pct + '%</span>',
    '</div>',
    '<div class="w-full h-px bg-outline-variant mb-6 relative overflow-hidden">',
      '<div class="absolute left-0 top-0 h-full transition-all duration-500 ' + barCls + '" style="width:' + p.pct + '%"></div>',
    '</div>',
  ].join('');

  var grid = '<div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">' +
    track.tasks.map(function(t) { return renderDayCard(t, track.id); }).join('') +
    '</div>';

  return progressBar + grid;
}

/* ── Render active tab ──────────────────────────────────────────────────────── */
function renderCurrentTrack() {
  var container = document.getElementById('roadmap-container');
  if (!container) return;
  var track = ROADMAP.find(function(t) { return t.id === activeTrack; });
  if (!track) return;
  container.innerHTML = renderTrackPanel(track);
  container.querySelectorAll('input[type=checkbox][data-id]').forEach(function(cb) {
    applyCbStyle(cb);
  });
}

/* ── Switch tab ─────────────────────────────────────────────────────────────── */
function switchTab(trackId) {
  activeTrack = trackId;
  updateTabBtns();
  renderCurrentTrack();
}

/* ── Toggle task ────────────────────────────────────────────────────────────── */
function toggleTask(id) {
  var task = null;
  ROADMAP.some(function(tr) {
    return (task = tr.tasks.find(function(t) { return t.id === id; }));
  });
  done[id] = !done[id];
  saveDone(done);
  renderCurrentTrack();
  updateStats();
  if (task) logActivity(task.title, !!done[id]);
}

function applyCbStyle(cb) {
  if (!cb) return;
  cb.style.cssText = cb.checked
    ? 'background:#ffabf3;border-color:#ffabf3;cursor:pointer;box-shadow:0 0 6px rgba(255,171,243,0.6)'
    : 'background:transparent;border:1px solid #3a494b;cursor:pointer';
}

/* ── Modal ──────────────────────────────────────────────────────────────────── */
function openModal() {
  var countEl = document.getElementById('modal-count');
  if (countEl) countEl.textContent = calcOverall().completed;
  document.getElementById('reset-modal').classList.remove('hidden');
}
function closeModal() { document.getElementById('reset-modal').classList.add('hidden'); }
function doReset() {
  done = {};
  saveDone(done);
  activityLog = [];
  closeModal();
  renderCurrentTrack();
  renderActivityLog();
  updateStats();
}

/* ── Init ───────────────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  updateTabBtns();
  renderCurrentTrack();
  renderActivityLog();
  updateStats();

  document.querySelectorAll('.tab-btn[data-track]').forEach(function(btn) {
    btn.addEventListener('click', function() { switchTab(btn.dataset.track); });
  });

  var container = document.getElementById('roadmap-container');
  if (container) {
    container.addEventListener('change', function(e) {
      var cb = e.target;
      if (cb.tagName === 'INPUT' && cb.type === 'checkbox' && cb.dataset.id) {
        toggleTask(cb.dataset.id);
      }
    });
  }

  var resetBtn     = document.getElementById('reset-btn');
  var modalConfirm = document.getElementById('modal-confirm');
  var modalCancel  = document.getElementById('modal-cancel');
  var modalOverlay = document.getElementById('reset-modal');
  if (resetBtn)     resetBtn.addEventListener('click', openModal);
  if (modalConfirm) modalConfirm.addEventListener('click', doReset);
  if (modalCancel)  modalCancel.addEventListener('click', closeModal);
  if (modalOverlay) modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) closeModal();
  });
});

}());
