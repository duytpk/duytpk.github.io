/* ── Roadmap Page ────────────────────────────────────────────────────────── */

(function () {

var STORAGE_KEY  = 'devsecops-hub:roadmap:v4';
var MAX_ACTIVITY = 5;
var TIME_START   = 11;
var TIME_END     = 19;
var CLS_LABEL_SM = 'font-label-caps text-[10px]';

/* Chapter IDs for K8s Days 1–8 seeded as completed */
var DEFAULT_DONE = {
  'k8s-d1-p1':true,'k8s-d1-p2':true,'k8s-d1-p3':true,
  'k8s-d2-p1':true,'k8s-d2-p2':true,'k8s-d2-p3':true,'k8s-d2-p4':true,
  'k8s-d3-p1':true,'k8s-d3-p2':true,'k8s-d3-p3':true,'k8s-d3-p4':true,
  'k8s-d4-p1':true,'k8s-d4-p2':true,'k8s-d4-p3':true,'k8s-d4-p4':true,
  'k8s-d5-p1':true,'k8s-d5-p2':true,'k8s-d5-p3':true,
  'k8s-d6-p1':true,'k8s-d6-p2':true,'k8s-d6-p3':true,'k8s-d6-p4':true,
  'k8s-d7-p1':true,'k8s-d7-p2':true,'k8s-d7-p3':true,'k8s-d7-p4':true,
  'k8s-d8-p1':true,'k8s-d8-p2':true,'k8s-d8-p3':true,'k8s-d8-p4':true,
};

var ROADMAP = [
  {
    id: 'k8s', label: 'Kubernetes', icon: 'hub',
    tasks: [
      { id:'k8s-d1',  title:'Day 1',  subtitle:'Architecture & Internals', notionUrl:'https://standing-base-a86.notion.site/Day-1-Architecture-Internals-2e6d10056cc9803ba66bfa7921dc086f', chapters:[
        {id:'k8s-d1-p1', label:'Kubernetes Architecture Deep Dive'},
        {id:'k8s-d1-p2', label:'Request Flow — Anatomy of kubectl apply'},
        {id:'k8s-d1-p3', label:'Advanced Troubleshooting Scenarios'},
      ]},
      { id:'k8s-d2',  title:'Day 2',  subtitle:'Workloads & Controllers', notionUrl:'https://standing-base-a86.notion.site/Day-2-Workloads-Controllers-2e6d10056cc9804690f8da067150f7a3', chapters:[
        {id:'k8s-d2-p1', label:'Pod Architecture & Container Design Patterns'},
        {id:'k8s-d2-p2', label:'Workload Controllers (Orchestration Layer)'},
        {id:'k8s-d2-p3', label:'Rolling Update Flow & Operational Mechanics'},
        {id:'k8s-d2-p4', label:'Advanced Troubleshooting Scenarios'},
      ]},
      { id:'k8s-d3',  title:'Day 3',  subtitle:'Networking & Connectivity', notionUrl:'https://standing-base-a86.notion.site/Day-3-Networking-Connectivity-2e6d10056cc980aeb047f7ee722a41bc', chapters:[
        {id:'k8s-d3-p1', label:'Networking & Connectivity — The Nervous System'},
        {id:'k8s-d3-p2', label:'Operational Flow — Packet Journey'},
        {id:'k8s-d3-p3', label:'Scenario-Based Analysis'},
        {id:'k8s-d3-p4', label:'Professional Troubleshooting Workflow (SOP)'},
      ]},
      { id:'k8s-d4',  title:'Day 4',  subtitle:'Storage & Configuration', notionUrl:'https://standing-base-a86.notion.site/Day-4-Storage-Configuration-2e6d10056cc980df9ca8c16e2e360c26', chapters:[
        {id:'k8s-d4-p1', label:'Storage Fundamentals'},
        {id:'k8s-d4-p2', label:'Volume Lifecycle Management'},
        {id:'k8s-d4-p3', label:'Configuration Management (ConfigMap & Secret)'},
        {id:'k8s-d4-p4', label:'Advanced Troubleshooting Scenarios'},
      ]},
      { id:'k8s-d5',  title:'Day 5',  subtitle:'Scheduling & Resource Mgmt', notionUrl:'https://standing-base-a86.notion.site/Day-5-Scheduling-Resource-Management-2e6d10056cc980d4bbb7c6021989917d', chapters:[
        {id:'k8s-d5-p1', label:'Resource Management Fundamentals'},
        {id:'k8s-d5-p2', label:'Advanced Scheduling Strategies'},
        {id:'k8s-d5-p3', label:'Scenario-Based Troubleshooting'},
      ]},
      { id:'k8s-d6',  title:'Day 6',  subtitle:'Security & Access Control', notionUrl:'https://standing-base-a86.notion.site/Day-6-Security-Access-Control-2e7d10056cc980c488c1d7d7fb3c20cb', chapters:[
        {id:'k8s-d6-p1', label:'RBAC — Role-Based Access Control'},
        {id:'k8s-d6-p2', label:'Network Policies (Traffic Control)'},
        {id:'k8s-d6-p3', label:'Security Context'},
        {id:'k8s-d6-p4', label:'Troubleshooting Case Studies'},
      ]},
      { id:'k8s-d7',  title:'Day 7',  subtitle:'Observability', notionUrl:'https://standing-base-a86.notion.site/Day-7-Observability-Monitor-and-Logging-2e6d10056cc9801c8e51d07c014f6f8d', chapters:[
        {id:'k8s-d7-p1', label:'Centralized Logging Architecture'},
        {id:'k8s-d7-p2', label:'Monitoring with Prometheus Stack'},
        {id:'k8s-d7-p3', label:'Metrics Collection Architecture in K8s'},
        {id:'k8s-d7-p4', label:'Troubleshooting Observability'},
      ]},
      { id:'k8s-d8',  title:'Day 8',  subtitle:'Package Management', notionUrl:'https://standing-base-a86.notion.site/Day-8-Package-Management-Templating-2e6d10056cc98042b566c1aea0d6e7de', chapters:[
        {id:'k8s-d8-p1', label:'Helm Deep Dive (Architecture & Lifecycle)'},
        {id:'k8s-d8-p2', label:'Kustomize Fundamentals (Overlay & Mutation)'},
        {id:'k8s-d8-p3', label:'Helm vs. Kustomize & Hybrid Model'},
        {id:'k8s-d8-p4', label:'Troubleshooting Challenge'},
      ]},
      { id:'k8s-d9',  title:'Day 9',  subtitle:'Troubleshooting & Maintenance', notionUrl:'https://standing-base-a86.notion.site/Day-9-Troubleshooting-Cluster-Maintenance-2e7d10056cc9805fa971c2ad05c222d2', chapters:[
        {id:'k8s-d9-p1', label:'Advanced Debugging Capabilities'},
        {id:'k8s-d9-p2', label:'Node Maintenance Operations'},
        {id:'k8s-d9-p3', label:'Etcd Disaster Recovery (DR)'},
      ]},
      { id:'k8s-d10', title:'Day 10', subtitle:'Advanced Topics', notionUrl:'https://standing-base-a86.notion.site/Day-10-Advanced-Topics-Modern-Ecosystem-2e7d10056cc980848eadd7f8328f756f', chapters:[
        {id:'k8s-d10-p1', label:'GitOps, Service Mesh & eBPF (Coming Soon)'},
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
    if (day.chapters) {
      day.chapters.forEach(function(ch) { out.push(ch); });
    } else {
      day.children.forEach(function(grp) {
        grp.items.forEach(function(it) { out.push(it); });
      });
    }
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
    el.innerHTML = '<div class="flex gap-4"><span class="text-primary-fixed-dim font-bold">Ready_</span><span class="bg-primary w-2 h-4 cursor-blink inline-block"></span></div>';
    return;
  }
  el.innerHTML = activityLog.map(function(e) {
    return '<div class="flex gap-4"><span class="text-secondary">[' + e.time + ']</span><span>' + esc(e.msg) + '</span></div>';
  }).join('') + '<div class="flex gap-4 mt-1"><span class="text-primary-fixed-dim font-bold">Ready_</span><span class="bg-primary w-2 h-4 cursor-blink inline-block"></span></div>';
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
      ' <span class="text-primary ml-2">— ' + o.completed + '/' + o.total + ' tasks (' + o.pct + '%)</span>';
  }
}

/* ── K8s card grid rendering ────────────────────────────────────────────────── */

function renderK8sChapter(ch, trackId) {
  var iDone = !!done[ch.id];
  return [
    '<label class="flex items-start gap-2 py-0.5 cursor-pointer group/leaf">',
      '<input type="checkbox" class="appearance-none w-3 h-3 border flex-shrink-0 mt-0.5"',
        ' id="cb-' + ch.id + '" data-id="' + ch.id + '" data-track="' + trackId + '"' + (iDone ? ' checked' : '') + ' />',
      '<span class="font-body-md text-[12px] leading-tight ' + (iDone ? 'line-through opacity-40' : 'text-on-surface-variant group-hover/leaf:text-primary transition-colors') + '">' + esc(ch.label) + '</span>',
    '</label>',
  ].join('');
}

function renderDayCard(day, trackId, idx) {
  var total  = day.chapters.length;
  var nDone  = day.chapters.filter(function(ch) { return !!done[ch.id]; }).length;
  var pct    = total ? Math.round((nDone / total) * 100) : 0;
  var allDone = nDone === total;
  var anyDone = nDone > 0;
  var cardBorder   = allDone ? 'glow-magenta border-secondary/50' : (anyDone ? 'card-neon' : 'border-outline-variant');
  var titleColor   = allDone ? 'text-secondary neon-text-magenta' : 'text-primary neon-text-cyan';
  var subColor     = allDone ? 'text-secondary/60' : 'text-on-tertiary-container';
  var progressBar  = allDone ? 'bg-secondary' : 'bg-primary-fixed-dim';
  var fullTitle = esc(day.title) + ' — ' + esc(day.subtitle);
  var titleEl   = day.notionUrl
    ? '<a href="' + esc(day.notionUrl) + '" target="_blank" rel="noopener noreferrer"'
      + ' class="font-headline-md text-[15px] font-bold ' + titleColor + ' hover:underline hover:opacity-80">'
      + fullTitle + '</a>'
    : '<span class="font-headline-md text-[15px] font-bold ' + titleColor + '">' + fullTitle + '</span>';

  var chapters = day.chapters.map(function(ch) { return renderK8sChapter(ch, trackId); }).join('');

  return [
    '<article class="flex flex-col bg-surface-container border h-[240px] overflow-hidden ' + cardBorder + ' group hover:bg-surface-container-high transition-all duration-300 relative"',
      ' style="animation:cardIn 0.35s ease both;animation-delay:' + (idx * 60) + 'ms">',
      '<div class="px-5 py-3 flex justify-between items-center">',
        titleEl,
        '<span class="font-label-caps text-[10px] text-on-tertiary-container">' + nDone + '/' + total + '</span>',
      '</div>',
      '<div class="border-t border-outline-variant/50"></div>',
      '<div class="px-5 py-3 flex-grow flex flex-col gap-1.5">',
        chapters,
      '</div>',
      '<div class="border-t border-outline-variant/50"></div>',
      '<div class="px-5 py-3">',
        '<div class="w-full h-0.5 bg-outline-variant/50 overflow-hidden">',
          '<div class="h-0.5 ' + progressBar + ' transition-all duration-500" style="width:' + pct + '%"></div>',
        '</div>',
        '<div class="font-label-caps text-[9px] text-on-surface-variant/60 uppercase mt-1.5">' + pct + '% complete</div>',
      '</div>',
    '</article>',
  ].join('');
}

function renderK8sPanel(track) {
  var leaves  = getLeaves(track);
  var nDone   = leaves.filter(function(x) { return !!done[x.id]; }).length;
  var pct     = leaves.length ? Math.round((nDone / leaves.length) * 100) : 0;
  var allDone = nDone === leaves.length;
  var rootBorder  = allDone ? 'glow-magenta' : 'card-neon';
  var rootColor   = allDone ? 'text-secondary neon-text-magenta' : 'text-primary neon-text-cyan';
  var nl  = 'background:var(--neon-cyan);box-shadow:0 0 8px var(--neon-cyan),0 0 20px var(--neon-cyan-20)';
  var nlm = 'background:var(--neon-magenta);box-shadow:0 0 8px var(--neon-magenta),0 0 20px var(--neon-magenta-20)';

  /* Layout constants — keep in sync with h-[240px] cards and gap-3 (12px) */
  var CARD_H = 240;
  var GAP    = 12;
  var N      = track.tasks.length;
  var COL_H  = N * CARD_H + (N - 1) * GAP;   /* total day-column height */
  var HALF   = CARD_H / 2;                    /* 120px — half-card */
  var STRIDE = CARD_H + GAP;                  /* 252px — center-to-center */
  var ROOT_Y = COL_H / 2;                     /* K8s root center y */

  /* Branches: cyan normally, magenta when every chapter in that day is done */
  var branches = track.tasks.map(function(day, i) {
    var dayDone = day.chapters.every(function(ch) { return !!done[ch.id]; });
    return '<div class="absolute h-px" style="left:50%;right:0;top:' + (HALF + i * STRIDE) + 'px;' + (dayDone ? nlm : nl) + '"></div>';
  }).join('');

  /* Day cards rendered directly in flex-col (no row wrapper) */
  var cards = track.tasks.map(function(day, i) {
    return renderDayCard(day, track.id, i);
  }).join('');

  return [
    /* 3-column grid: [K8s root | connector | day cards] — all ~CVE-card width */
    '<div class="grid" style="grid-template-columns:420px 1fr 420px;gap:0;align-items:start">',

      /* ── Col 1: K8s root — same 1fr width as day cards, vertically centered ── */
      '<div class="flex items-center" style="height:' + COL_H + 'px">',
        '<div class="w-full h-[240px] flex flex-col border p-4 bg-surface-container-low ' + rootBorder + '"',
            ' style="animation:cardIn 0.35s ease both">',
          '<span class="material-symbols-outlined text-3xl text-primary-fixed-dim mb-3"',
              ' style="font-variation-settings:\'FILL\' 1">hub</span>',
          '<h2 class="font-headline-md ' + rootColor + ' uppercase tracking-widest mb-2">Kubernetes</h2>',
          '<p class="font-body-md text-on-surface-variant text-[11px] opacity-80 mb-4">',
            'Container orchestration platform — manage clusters, pods, networking, storage, and security at scale.',
          '</p>',
          '<div class="mt-auto">',
            '<div class="font-label-caps text-[10px] text-on-tertiary-container">' + nDone + '/' + leaves.length + ' chapters</div>',
            '<div class="font-label-caps text-[12px] text-primary-fixed-dim">' + pct + '% complete</div>',
          '</div>',
        '</div>',
      '</div>',

      /* ── Col 2: Connector — trunk + vertical spine + per-day branches ── */
      '<div class="relative" style="height:' + COL_H + 'px">',
        /* Trunk: K8s root right-edge → spine, at K8s vertical center */
        '<div class="absolute left-0 h-px" style="right:50%;top:' + ROOT_Y + 'px;' + (allDone ? nlm : nl) + '"></div>',
        /* Spine: first-day center → last-day center */
        '<div class="absolute w-px" style="left:50%;top:' + HALF + 'px;bottom:' + HALF + 'px;' + (allDone ? nlm : nl) + '"></div>',
        branches,
      '</div>',

      /* ── Col 3: Day cards — 1fr, same width as K8s root ── */
      '<div class="flex flex-col gap-3">',
        cards,
      '</div>',

    '</div>',
  ].join('');
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
  container.innerHTML = track.id === 'k8s' ? renderK8sPanel(track) : renderTrackPanel(track);
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
      if (day.chapters) {
        return (found = day.chapters.find(function(ch) { return ch.id === id; }));
      }
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
