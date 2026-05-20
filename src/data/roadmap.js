// Learning roadmap. `id`s are stable identifiers used as localStorage keys —
// do not rename them or saved progress will be lost.

export const roadmap = [
  {
    id: 'linux',
    label: 'LINUX SYSTEM',
    color: 'green',
    frame: 'corners',
    blurb: 'Foundation: command line, permissions, processes, networking.',
    tasks: [
      { id: 'linux-cli', title: 'Master shell basics (bash/zsh, pipes, redirection)', meta: 'fundamentals' },
      { id: 'linux-fs', title: 'Filesystem hierarchy, permissions & ACLs', meta: 'fundamentals' },
      { id: 'linux-proc', title: 'Processes, signals, systemd services & journald', meta: 'core' },
      { id: 'linux-net', title: 'Networking: ip, ss, iptables/nftables, DNS', meta: 'core' },
      { id: 'linux-pkg', title: 'Package mgmt & building from source', meta: 'core' },
      { id: 'linux-hardening', title: 'Hardening: users, SSH, SELinux/AppArmor, auditd', meta: 'security' },
      { id: 'linux-scripting', title: 'Automation with shell scripting & cron', meta: 'advanced' },
    ],
  },
  {
    id: 'terraform',
    label: 'TERRAFORM / IAC',
    color: 'magenta',
    frame: 'nefrex',
    blurb: 'Infrastructure as Code: provision cloud resources declaratively.',
    tasks: [
      { id: 'tf-hcl', title: 'HCL syntax, providers & resources', meta: 'fundamentals' },
      { id: 'tf-state', title: 'State management & remote backends (S3 + lock)', meta: 'core' },
      { id: 'tf-vars', title: 'Variables, outputs, locals & data sources', meta: 'core' },
      { id: 'tf-modules', title: 'Reusable modules & registry usage', meta: 'core' },
      { id: 'tf-workspaces', title: 'Workspaces & multi-environment layouts', meta: 'advanced' },
      { id: 'tf-cicd', title: 'plan/apply in CI/CD pipelines', meta: 'advanced' },
      { id: 'tf-sec', title: 'Policy-as-code (tfsec, OPA, Sentinel)', meta: 'security' },
    ],
  },
  {
    id: 'k8s',
    label: 'KUBERNETES',
    color: 'cyan',
    frame: 'octagon',
    blurb: 'Container orchestration at scale: workloads, networking, security.',
    tasks: [
      { id: 'k8s-core', title: 'Pods, ReplicaSets, Deployments & Services', meta: 'fundamentals' },
      { id: 'k8s-config', title: 'ConfigMaps, Secrets & environment config', meta: 'core' },
      { id: 'k8s-storage', title: 'Volumes, PV/PVC & StatefulSets', meta: 'core' },
      { id: 'k8s-net', title: 'Ingress, NetworkPolicies & service mesh basics', meta: 'core' },
      { id: 'k8s-helm', title: 'Packaging with Helm & Kustomize', meta: 'advanced' },
      { id: 'k8s-rbac', title: 'RBAC, ServiceAccounts & Pod Security Standards', meta: 'security' },
      { id: 'k8s-observability', title: 'Observability: metrics, logs, tracing', meta: 'advanced' },
    ],
  },
]
