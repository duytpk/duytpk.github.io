/* ── Roadmap Page ────────────────────────────────────────────────────────── */

(function () {

var STORAGE_KEY  = 'devsecops-hub:roadmap:v3';
var MAX_ACTIVITY = 5;
var TIME_START   = 11;
var TIME_END     = 19;
var CLS_LABEL_SM = 'font-label-caps text-[10px]';

/* Leaf IDs for K8s Days 1–8 seeded as completed */
var DEFAULT_DONE = {
  'k8s-d1-d1':true,'k8s-d1-d2':true,'k8s-d1-d3':true,'k8s-d1-e1':true,'k8s-d1-e2':true,'k8s-d1-e3':true,
  'k8s-d2-d1':true,'k8s-d2-d2':true,'k8s-d2-d3':true,'k8s-d2-e1':true,'k8s-d2-e2':true,'k8s-d2-e3':true,
  'k8s-d3-d1':true,'k8s-d3-d2':true,'k8s-d3-d3':true,'k8s-d3-e1':true,'k8s-d3-e2':true,'k8s-d3-e3':true,
  'k8s-d4-d1':true,'k8s-d4-d2':true,'k8s-d4-d3':true,'k8s-d4-e1':true,'k8s-d4-e2':true,'k8s-d4-e3':true,
  'k8s-d5-d1':true,'k8s-d5-d2':true,'k8s-d5-d3':true,'k8s-d5-e1':true,'k8s-d5-e2':true,'k8s-d5-e3':true,
  'k8s-d6-d1':true,'k8s-d6-d2':true,'k8s-d6-d3':true,'k8s-d6-e1':true,'k8s-d6-e2':true,'k8s-d6-e3':true,
  'k8s-d7-d1':true,'k8s-d7-d2':true,'k8s-d7-d3':true,'k8s-d7-e1':true,'k8s-d7-e2':true,'k8s-d7-e3':true,
  'k8s-d8-d1':true,'k8s-d8-d2':true,'k8s-d8-d3':true,'k8s-d8-e1':true,'k8s-d8-e2':true,'k8s-d8-e3':true,
};

var ROADMAP = [
  {
    id: 'k8s', label: 'Kubernetes', icon: 'hub',
    tasks: [
      { id:'k8s-d1',  title:'Day 1',  subtitle:'Architecture & Internals', children:[
        { label:'DOCUMENTS', items:[
          {id:'k8s-d1-d1', label:'Control Plane & etcd (RAFT)'},
          {id:'k8s-d1-d2', label:'kubelet, kube-proxy, node agents'},
          {id:'k8s-d1-d3', label:'CRI / CNI / CSI interfaces'},
        ]},
        { label:'EXERCISES', items:[
          {id:'k8s-d1-e1', label:'Deploy a kind cluster'},
          {id:'k8s-d1-e2', label:'Inspect etcd via etcdctl'},
          {id:'k8s-d1-e3', label:'Trace a Pod through the API server'},
        ]},
      ]},
      { id:'k8s-d2',  title:'Day 2',  subtitle:'Workloads & Controllers', children:[
        { label:'DOCUMENTS', items:[
          {id:'k8s-d2-d1', label:'Pod lifecycle & Init/Sidecar patterns'},
          {id:'k8s-d2-d2', label:'Deployment & ReplicaSet mechanics'},
          {id:'k8s-d2-d3', label:'StatefulSet, DaemonSet, Job & CronJob'},
        ]},
        { label:'EXERCISES', items:[
          {id:'k8s-d2-e1', label:'Rolling update & rollback'},
          {id:'k8s-d2-e2', label:'StatefulSet + headless Service'},
          {id:'k8s-d2-e3', label:'Configure Liveness/Readiness probes'},
        ]},
      ]},
      { id:'k8s-d3',  title:'Day 3',  subtitle:'Networking & Connectivity', children:[
        { label:'DOCUMENTS', items:[
          {id:'k8s-d3-d1', label:'Flat network model & CNI deep dive'},
          {id:'k8s-d3-d2', label:'Service types: ClusterIP, NodePort, LB'},
          {id:'k8s-d3-d3', label:'Ingress controllers & CoreDNS'},
        ]},
        { label:'EXERCISES', items:[
          {id:'k8s-d3-e1', label:'Deploy Calico/Cilium CNI'},
          {id:'k8s-d3-e2', label:'Expose app via Ingress + TLS'},
          {id:'k8s-d3-e3', label:'Diagnose DNS resolution issues'},
        ]},
      ]},
      { id:'k8s-d4',  title:'Day 4',  subtitle:'Storage & Configuration', children:[
        { label:'DOCUMENTS', items:[
          {id:'k8s-d4-d1', label:'PV / PVC / StorageClass lifecycle'},
          {id:'k8s-d4-d2', label:'ConfigMap & Secret management'},
          {id:'k8s-d4-d3', label:'Sealed Secrets & Vault integration'},
        ]},
        { label:'EXERCISES', items:[
          {id:'k8s-d4-e1', label:'StatefulSet with dynamic PVC'},
          {id:'k8s-d4-e2', label:'Mount secrets as env & volume'},
          {id:'k8s-d4-e3', label:'Set up a StorageClass'},
        ]},
      ]},
      { id:'k8s-d5',  title:'Day 5',  subtitle:'Scheduling & Resource Mgmt', children:[
        { label:'DOCUMENTS', items:[
          {id:'k8s-d5-d1', label:'Requests, Limits & QoS classes'},
          {id:'k8s-d5-d2', label:'Node/Pod Affinity & Anti-Affinity'},
          {id:'k8s-d5-d3', label:'Taints, Tolerations & PriorityClass'},
        ]},
        { label:'EXERCISES', items:[
          {id:'k8s-d5-e1', label:'LimitRange & ResourceQuota lab'},
          {id:'k8s-d5-e2', label:'Schedule pods with affinity rules'},
          {id:'k8s-d5-e3', label:'Taint nodes & apply tolerations'},
        ]},
      ]},
      { id:'k8s-d6',  title:'Day 6',  subtitle:'Security & Access Control', children:[
        { label:'DOCUMENTS', items:[
          {id:'k8s-d6-d1', label:'RBAC: Roles, ClusterRoles, Bindings'},
          {id:'k8s-d6-d2', label:'ServiceAccounts & token projection'},
          {id:'k8s-d6-d3', label:'Network Policies & Security Context'},
        ]},
        { label:'EXERCISES', items:[
          {id:'k8s-d6-e1', label:'Create RBAC role for a namespace'},
          {id:'k8s-d6-e2', label:'Apply Zero Trust Network Policy'},
          {id:'k8s-d6-e3', label:'Configure Pod Security Context'},
        ]},
      ]},
      { id:'k8s-d7',  title:'Day 7',  subtitle:'Observability', children:[
        { label:'DOCUMENTS', items:[
          {id:'k8s-d7-d1', label:'Logging architecture & EFK/PLG stacks'},
          {id:'k8s-d7-d2', label:'Prometheus pull model & metric types'},
          {id:'k8s-d7-d3', label:'kube-state-metrics & Grafana dashboards'},
        ]},
        { label:'EXERCISES', items:[
          {id:'k8s-d7-e1', label:'Deploy Prometheus + Grafana stack'},
          {id:'k8s-d7-e2', label:'Set up alerts with Alertmanager'},
          {id:'k8s-d7-e3', label:'Stream logs with Loki'},
        ]},
      ]},
      { id:'k8s-d8',  title:'Day 8',  subtitle:'Package Management', children:[
        { label:'DOCUMENTS', items:[
          {id:'k8s-d8-d1', label:'Helm v3 architecture & chart structure'},
          {id:'k8s-d8-d2', label:'Chart lifecycle & values management'},
          {id:'k8s-d8-d3', label:'Kustomize Base/Overlay patterns'},
        ]},
        { label:'EXERCISES', items:[
          {id:'k8s-d8-e1', label:'Author and install a Helm chart'},
          {id:'k8s-d8-e2', label:'Kustomize multi-env overlay'},
          {id:'k8s-d8-e3', label:'Helm + Kustomize post-renderer'},
        ]},
      ]},
      { id:'k8s-d9',  title:'Day 9',  subtitle:'Troubleshooting & Maintenance', children:[
        { label:'DOCUMENTS', items:[
          {id:'k8s-d9-d1', label:'Debugging commands & node inspection'},
          {id:'k8s-d9-d2', label:'etcd backup & restore procedures'},
          {id:'k8s-d9-d3', label:'Cluster upgrade with kubeadm'},
        ]},
        { label:'EXERCISES', items:[
          {id:'k8s-d9-e1', label:'Cordon, drain & uncordon a node'},
          {id:'k8s-d9-e2', label:'etcd snapshot backup & restore'},
          {id:'k8s-d9-e3', label:'Perform a kubeadm cluster upgrade'},
        ]},
      ]},
      { id:'k8s-d10', title:'Day 10', subtitle:'Advanced Topics', children:[
        { label:'DOCUMENTS', items:[
          {id:'k8s-d10-d1', label:'GitOps with ArgoCD & Flux'},
          {id:'k8s-d10-d2', label:'Service Mesh: Istio / Linkerd'},
          {id:'k8s-d10-d3', label:'eBPF fundamentals & multi-cluster'},
        ]},
        { label:'EXERCISES', items:[
          {id:'k8s-d10-e1', label:'Deploy ArgoCD & sync a Helm chart'},
          {id:'k8s-d10-e2', label:'Istio sidecar injection & mTLS'},
          {id:'k8s-d10-e3', label:'Multi-cluster with Cilium Cluster Mesh'},
        ]},
      ]},
    ],
  },
  {
    id: 'linux', label: 'Linux System', icon: 'terminal',
    tasks: [
      { id:'linux-cli',       title:'Module 1', subtitle:'Shell Fundamentals', children:[
        { label:'RESOURCES', items:[
          {id:'linux-cli-d1', label:'Bash syntax: pipes, redirection, expansion'},
          {id:'linux-cli-d2', label:'Process substitution & here-docs'},
          {id:'linux-cli-d3', label:'Aliases, functions & startup files'},
        ]},
        { label:'PRACTICE', items:[
          {id:'linux-cli-e1', label:'Write a pipeline to parse logs'},
          {id:'linux-cli-e2', label:'Use xargs and process substitution'},
          {id:'linux-cli-e3', label:'Create custom .bashrc functions'},
        ]},
      ]},
      { id:'linux-fs',        title:'Module 2', subtitle:'Filesystem & Permissions', children:[
        { label:'RESOURCES', items:[
          {id:'linux-fs-d1', label:'Filesystem hierarchy standard (FHS)'},
          {id:'linux-fs-d2', label:'chmod, chown, umask & sticky bit'},
          {id:'linux-fs-d3', label:'ACLs, hard links & soft links'},
        ]},
        { label:'PRACTICE', items:[
          {id:'linux-fs-e1', label:'Set up directory ACLs'},
          {id:'linux-fs-e2', label:'Debug permission denied errors'},
          {id:'linux-fs-e3', label:'Map hard vs soft link behavior'},
        ]},
      ]},
      { id:'linux-proc',      title:'Module 3', subtitle:'Processes & Services', children:[
        { label:'RESOURCES', items:[
          {id:'linux-proc-d1', label:'Process states & signals'},
          {id:'linux-proc-d2', label:'systemd units & service lifecycle'},
          {id:'linux-proc-d3', label:'journald log management'},
        ]},
        { label:'PRACTICE', items:[
          {id:'linux-proc-e1', label:'Write a systemd unit file'},
          {id:'linux-proc-e2', label:'Send signals with kill & trap'},
          {id:'linux-proc-e3', label:'Query logs with journalctl filters'},
        ]},
      ]},
      { id:'linux-net',       title:'Module 4', subtitle:'Networking', children:[
        { label:'RESOURCES', items:[
          {id:'linux-net-d1', label:'ip addr, ip route & ss commands'},
          {id:'linux-net-d2', label:'iptables / nftables rule chains'},
          {id:'linux-net-d3', label:'DNS resolution & /etc/resolv.conf'},
        ]},
        { label:'PRACTICE', items:[
          {id:'linux-net-e1', label:'Set up static IP & routing'},
          {id:'linux-net-e2', label:'Write an iptables DROP rule'},
          {id:'linux-net-e3', label:'Trace DNS with dig & tcpdump'},
        ]},
      ]},
      { id:'linux-pkg',       title:'Module 5', subtitle:'Package Management', children:[
        { label:'RESOURCES', items:[
          {id:'linux-pkg-d1', label:'apt / dnf / yum package databases'},
          {id:'linux-pkg-d2', label:'Building from source: configure, make'},
          {id:'linux-pkg-d3', label:'Version pinning & holds'},
        ]},
        { label:'PRACTICE', items:[
          {id:'linux-pkg-e1', label:'Install & pin a specific version'},
          {id:'linux-pkg-e2', label:'Compile a program from source'},
          {id:'linux-pkg-e3', label:'Create a local apt mirror'},
        ]},
      ]},
      { id:'linux-hardening', title:'Module 6', subtitle:'Hardening & Security', children:[
        { label:'RESOURCES', items:[
          {id:'linux-hard-d1', label:'SSH hardening & key-based auth'},
          {id:'linux-hard-d2', label:'SELinux / AppArmor profiles'},
          {id:'linux-hard-d3', label:'auditd rules & log analysis'},
        ]},
        { label:'PRACTICE', items:[
          {id:'linux-hard-e1', label:'Disable root SSH, use key auth'},
          {id:'linux-hard-e2', label:'Write a custom AppArmor profile'},
          {id:'linux-hard-e3', label:'Set auditd rule for /etc/passwd'},
        ]},
      ]},
      { id:'linux-scripting', title:'Module 7', subtitle:'Automation & Scripting', children:[
        { label:'RESOURCES', items:[
          {id:'linux-scr-d1', label:'Shell scripting patterns & best practices'},
          {id:'linux-scr-d2', label:'cron & systemd timer units'},
          {id:'linux-scr-d3', label:'Error handling & idempotency'},
        ]},
        { label:'PRACTICE', items:[
          {id:'linux-scr-e1', label:'Write a backup rotation script'},
          {id:'linux-scr-e2', label:'Schedule a systemd timer'},
          {id:'linux-scr-e3', label:'Add trap for clean exit handling'},
        ]},
      ]},
    ],
  },
  {
    id: 'terraform', label: 'Terraform / IaC', icon: 'cloud',
    tasks: [
      { id:'tf-hcl',        title:'Module 1', subtitle:'HCL Syntax & Providers', children:[
        { label:'RESOURCES', items:[
          {id:'tf-hcl-d1', label:'HCL blocks, arguments & expressions'},
          {id:'tf-hcl-d2', label:'Provider configuration & versioning'},
          {id:'tf-hcl-d3', label:'Resource meta-arguments (count, for_each)'},
        ]},
        { label:'PRACTICE', items:[
          {id:'tf-hcl-e1', label:'Provision an S3 bucket with HCL'},
          {id:'tf-hcl-e2', label:'Use for_each to create multiple resources'},
          {id:'tf-hcl-e3', label:'Pin provider versions in required_providers'},
        ]},
      ]},
      { id:'tf-state',      title:'Module 2', subtitle:'State Management', children:[
        { label:'RESOURCES', items:[
          {id:'tf-state-d1', label:'terraform.tfstate structure & purpose'},
          {id:'tf-state-d2', label:'Remote backends: S3 + DynamoDB lock'},
          {id:'tf-state-d3', label:'State isolation & workspace model'},
        ]},
        { label:'PRACTICE', items:[
          {id:'tf-state-e1', label:'Migrate local state to S3 backend'},
          {id:'tf-state-e2', label:'Simulate state lock & force-unlock'},
          {id:'tf-state-e3', label:'Import existing resource into state'},
        ]},
      ]},
      { id:'tf-vars',       title:'Module 3', subtitle:'Variables & Outputs', children:[
        { label:'RESOURCES', items:[
          {id:'tf-vars-d1', label:'Input variables: types, defaults, validation'},
          {id:'tf-vars-d2', label:'Locals & complex expressions'},
          {id:'tf-vars-d3', label:'Outputs & cross-module referencing'},
        ]},
        { label:'PRACTICE', items:[
          {id:'tf-vars-e1', label:'Add validation block to a variable'},
          {id:'tf-vars-e2', label:'Use locals to build a name prefix map'},
          {id:'tf-vars-e3', label:'Expose outputs across root/child modules'},
        ]},
      ]},
      { id:'tf-modules',    title:'Module 4', subtitle:'Reusable Modules', children:[
        { label:'RESOURCES', items:[
          {id:'tf-mod-d1', label:'Module structure: main, variables, outputs'},
          {id:'tf-mod-d2', label:'Terraform Registry & versioned sources'},
          {id:'tf-mod-d3', label:'Module composition patterns'},
        ]},
        { label:'PRACTICE', items:[
          {id:'tf-mod-e1', label:'Extract a VPC module from root config'},
          {id:'tf-mod-e2', label:'Publish a module to local registry'},
          {id:'tf-mod-e3', label:'Pin module version & upgrade'},
        ]},
      ]},
      { id:'tf-workspaces', title:'Module 5', subtitle:'Workspaces & Environments', children:[
        { label:'RESOURCES', items:[
          {id:'tf-ws-d1', label:'terraform workspace commands'},
          {id:'tf-ws-d2', label:'Workspace vs directory-based envs'},
          {id:'tf-ws-d3', label:'Environment-specific variable files'},
        ]},
        { label:'PRACTICE', items:[
          {id:'tf-ws-e1', label:'Create dev/staging/prod workspaces'},
          {id:'tf-ws-e2', label:'Switch workspace & apply selectively'},
          {id:'tf-ws-e3', label:'Use tfvars per environment'},
        ]},
      ]},
      { id:'tf-cicd',       title:'Module 6', subtitle:'CI/CD Integration', children:[
        { label:'RESOURCES', items:[
          {id:'tf-cicd-d1', label:'terraform plan in PR pipelines'},
          {id:'tf-cicd-d2', label:'Automated drift detection'},
          {id:'tf-cicd-d3', label:'Atlantis & TFC run workflows'},
        ]},
        { label:'PRACTICE', items:[
          {id:'tf-cicd-e1', label:'Add terraform plan to GitHub Actions'},
          {id:'tf-cicd-e2', label:'Gate apply on plan approval'},
          {id:'tf-cicd-e3', label:'Schedule drift detection cron'},
        ]},
      ]},
      { id:'tf-sec',        title:'Module 7', subtitle:'Policy as Code', children:[
        { label:'RESOURCES', items:[
          {id:'tf-sec-d1', label:'tfsec static analysis rules'},
          {id:'tf-sec-d2', label:'OPA Rego policies for Terraform'},
          {id:'tf-sec-d3', label:'Sentinel policy framework (TFC)'},
        ]},
        { label:'PRACTICE', items:[
          {id:'tf-sec-e1', label:'Run tfsec on a module & fix findings'},
          {id:'tf-sec-e2', label:'Write an OPA policy to block public S3'},
          {id:'tf-sec-e3', label:'Enforce tags via Sentinel policy'},
        ]},
      ]},
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
function getLeaves(track) {
  var out = [];
  track.tasks.forEach(function(day) {
    day.children.forEach(function(grp) {
      grp.items.forEach(function(it) { out.push(it); });
    });
  });
  return out;
}

function isDayDone(day) {
  return day.children.every(function(grp) {
    return grp.items.every(function(it) { return !!done[it.id]; });
  });
}

function isGroupDone(grp) {
  return grp.items.every(function(it) { return !!done[it.id]; });
}

function trackProgress(track) {
  var leaves = getLeaves(track);
  var n = leaves.filter(function(x) { return !!done[x.id]; }).length;
  return { tDone: n, total: leaves.length, pct: leaves.length ? Math.round((n / leaves.length) * 100) : 0 };
}

function calcOverall() {
  var total = 0, completed = 0;
  ROADMAP.forEach(function(t) {
    var p = trackProgress(t);
    total += p.total; completed += p.tDone;
  });
  return { total: total, completed: completed, pct: total ? Math.round((completed / total) * 100) : 0 };
}

/* ── Activity log ───────────────────────────────────────────────────────────── */
function logActivity(label, isDone) {
  var now = new Date().toISOString().slice(TIME_START, TIME_END);
  activityLog.unshift({ time: now, msg: (isDone ? 'Completed: ' : 'Unchecked: ') + label });
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

/* ── Tree rendering ─────────────────────────────────────────────────────────── */

var LINE = 'bg-outline-variant';

function renderLeafItem(item, trackId) {
  var iDone = !!done[item.id];
  return [
    '<label class="flex items-start gap-2 py-0.5 cursor-pointer group/leaf">',
      '<input type="checkbox" class="appearance-none w-3 h-3 border flex-shrink-0 mt-0.5"',
        ' id="cb-' + item.id + '" data-id="' + item.id + '" data-track="' + trackId + '"' + (iDone ? ' checked' : '') + ' />',
      '<span class="font-body-md text-[11px] leading-tight ' + (iDone ? 'line-through opacity-40' : 'text-on-surface-variant group-hover/leaf:text-primary transition-colors') + '">' + esc(item.label) + '</span>',
    '</label>',
  ].join('');
}

function renderChildGroup(grp, trackId, isFirstGrp, isLastGrp) {
  var gDone   = isGroupDone(grp);
  var gBorder = gDone ? 'glow-magenta' : 'card-neon';
  var gLblCls = gDone ? 'text-secondary' : 'text-on-tertiary-container';
  var spineTop = isFirstGrp ? 'top-1/2' : 'top-0';
  var spineBot = isLastGrp  ? 'bottom-1/2' : 'bottom-0';

  var items = grp.items.map(function(it) { return renderLeafItem(it, trackId); }).join('');

  return [
    '<div class="relative flex items-center py-1">',
      '<div class="absolute left-0 ' + spineTop + ' ' + spineBot + ' w-px ' + LINE + '"></div>',
      '<div class="w-4 h-px ' + LINE + ' flex-shrink-0"></div>',
      '<div class="p-3 border border-outline-variant ' + gBorder + ' min-w-[200px]">',
        '<div class="' + CLS_LABEL_SM + ' ' + gLblCls + ' mb-2 tracking-widest">' + esc(grp.label) + '</div>',
        items,
      '</div>',
    '</div>',
  ].join('');
}

function renderDayRow(day, trackId, totalDays, idx) {
  var dayDone   = isDayDone(day);
  var dayBorder = dayDone ? 'glow-magenta' : 'card-neon';
  var dayColor  = dayDone ? 'text-secondary neon-text-magenta' : 'text-primary neon-text-cyan';
  var subColor  = dayDone ? 'text-secondary/60' : 'text-on-tertiary-container';
  var isFirst = idx === 0;
  var isLast  = idx === totalDays - 1;
  var spineTop = isFirst ? 'top-1/2' : 'top-0';
  var spineBot = isLast  ? 'bottom-1/2' : 'bottom-0';
  var spineDiv = (totalDays > 1)
    ? '<div class="absolute left-0 ' + spineTop + ' ' + spineBot + ' w-px ' + LINE + '"></div>'
    : '';

  var children = day.children.map(function(grp, gi) {
    return renderChildGroup(grp, trackId, gi === 0, gi === day.children.length - 1);
  }).join('');

  return [
    '<div class="relative flex items-center py-3" id="day-row-' + day.id + '">',
      spineDiv,
      '<div class="w-8 h-px ' + LINE + ' flex-shrink-0"></div>',
      '<div class="p-3 border border-outline-variant ' + dayBorder + ' flex-shrink-0 min-w-[120px]" id="day-node-' + day.id + '">',
        '<div class="font-body-md text-[13px] font-bold ' + dayColor + '">' + esc(day.title) + '</div>',
        '<div class="' + CLS_LABEL_SM + ' ' + subColor + ' mt-0.5 tracking-wide">' + esc(day.subtitle) + '</div>',
      '</div>',
      '<div class="w-8 h-px ' + LINE + ' flex-shrink-0"></div>',
      '<div class="flex flex-col">',
        children,
      '</div>',
    '</div>',
  ].join('');
}

function renderTrackPanel(track) {
  var allDone    = track.tasks.every(function(d) { return isDayDone(d); });
  var rootBorder = allDone ? 'glow-magenta' : 'card-neon';
  var rootColor  = allDone ? 'text-secondary neon-text-magenta' : 'text-primary neon-text-cyan';

  var dayRows = track.tasks.map(function(day, i) {
    return renderDayRow(day, track.id, track.tasks.length, i);
  }).join('');

  return [
    '<div class="flex items-stretch overflow-x-auto">',
      /* Root node box */
      '<div class="self-stretch flex items-center flex-shrink-0">',
        '<div class="p-5 border border-outline-variant self-stretch flex flex-col items-center justify-center gap-3 ' + rootBorder + '" style="min-width:90px">',
          '<span class="material-symbols-outlined text-3xl ' + rootColor + '" style="font-variation-settings:\'FILL\' 1">' + esc(track.icon) + '</span>',
          '<span class="font-body-md text-[12px] font-bold ' + rootColor + '">' + esc(track.label).toUpperCase() + '</span>',
        '</div>',
      '</div>',
      /* Root → days spine connector */
      '<div class="self-center w-8 h-px ' + LINE + ' flex-shrink-0"></div>',
      /* Days column */
      '<div class="flex flex-col relative">',
        dayRows,
      '</div>',
    '</div>',
  ].join('');
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
  var found = null;
  ROADMAP.some(function(tr) {
    return tr.tasks.some(function(day) {
      return day.children.some(function(grp) {
        return (found = grp.items.find(function(it) { return it.id === id; }));
      });
    });
  });
  done[id] = !done[id];
  saveDone(done);
  renderCurrentTrack();
  updateStats();
  if (found) logActivity(found.label, !!done[id]);
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
