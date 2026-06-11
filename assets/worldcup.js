(function () {
  'use strict';

  const ESPN_BASE = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world';
  const REFRESH_MS_IDLE = 60_000;
  const REFRESH_MS_LIVE = 30_000;

  // ── Static tournament data ─────────────────────────────────────────────────
  const VENUES = [
    { city: 'New York / New Jersey', flag: '🇺🇸', stadium: 'MetLife Stadium',        cap: '82,500', note: 'FINAL'    },
    { city: 'Los Angeles',           flag: '🇺🇸', stadium: 'Rose Bowl',               cap: '92,000'                  },
    { city: 'Dallas',                flag: '🇺🇸', stadium: 'AT&T Stadium',            cap: '80,000'                  },
    { city: 'San Francisco Bay',     flag: '🇺🇸', stadium: "Levi's Stadium",          cap: '68,500'                  },
    { city: 'Miami',                 flag: '🇺🇸', stadium: 'Hard Rock Stadium',       cap: '65,000'                  },
    { city: 'Atlanta',               flag: '🇺🇸', stadium: 'Mercedes-Benz Stadium',   cap: '71,000'                  },
    { city: 'Seattle',               flag: '🇺🇸', stadium: 'Lumen Field',             cap: '69,000'                  },
    { city: 'Boston',                flag: '🇺🇸', stadium: 'Gillette Stadium',        cap: '65,878'                  },
    { city: 'Kansas City',           flag: '🇺🇸', stadium: 'Arrowhead Stadium',       cap: '76,416'                  },
    { city: 'Philadelphia',          flag: '🇺🇸', stadium: 'Lincoln Financial Field', cap: '69,796'                  },
    { city: 'Houston',               flag: '🇺🇸', stadium: 'NRG Stadium',             cap: '72,220'                  },
    { city: 'Toronto',               flag: '🇨🇦', stadium: 'BMO Field',               cap: '45,000'                  },
    { city: 'Vancouver',             flag: '🇨🇦', stadium: 'BC Place',                cap: '54,500'                  },
    { city: 'Mexico City',           flag: '🇲🇽', stadium: 'Estadio Azteca',          cap: '87,523', note: 'OPENING' },
    { city: 'Guadalajara',           flag: '🇲🇽', stadium: 'Estadio Akron',           cap: '49,850'                  },
    { city: 'Monterrey',             flag: '🇲🇽', stadium: 'Estadio BBVA',            cap: '53,460'                  },
  ];

  const FORMAT = [
    { stage: 'Group Stage',    detail: '12 groups × 4 teams',              dates: 'Jun 11 – Jul 2', icon: 'grid_view'     },
    { stage: 'Round of 32',    detail: 'Top 2 per group + 8 best 3rd',     dates: 'Jul 4–7',        icon: 'sports_soccer' },
    { stage: 'Round of 16',    detail: '16 teams',                          dates: 'Jul 9–12',       icon: 'sports_soccer' },
    { stage: 'Quarter-finals', detail: '8 teams',                           dates: 'Jul 14–15',      icon: 'sports_soccer' },
    { stage: 'Semi-finals',    detail: '4 teams',                           dates: 'Jul 17–18',      icon: 'sports_soccer' },
    { stage: 'Third Place',    detail: 'MetLife Stadium, NJ',               dates: 'Jul 18',         icon: 'military_tech' },
    { stage: 'Final',          detail: 'MetLife Stadium, NJ',               dates: 'Jul 19',         icon: 'emoji_events'  },
  ];

  const KEY_DATES = [
    ['Opening Match',  'Jun 11, 2026', 'Estadio Azteca, Mexico City'],
    ['Group Stage End','Jul 2, 2026',  ''],
    ['Round of 32',    'Jul 4–7',      ''],
    ['Round of 16',    'Jul 9–12',     ''],
    ['Quarter-finals', 'Jul 14–15',    ''],
    ['Semi-finals',    'Jul 17–18',    ''],
    ['Third Place',    'Jul 18, 2026', 'MetLife Stadium, NJ'],
    ['FINAL',          'Jul 19, 2026', 'MetLife Stadium, NJ'],
  ];

  const STATIC_CONFS = [
    { name: 'UEFA',     emoji: '🏆', spots: 16, teams: [
      ['England','🏴󠁧󠁢󠁥󠁮󠁧󠁿'],['France','🇫🇷'],['Germany','🇩🇪'],['Spain','🇪🇸'],['Portugal','🇵🇹'],
      ['Netherlands','🇳🇱'],['Italy','🇮🇹'],['Belgium','🇧🇪'],['Switzerland','🇨🇭'],['Croatia','🇭🇷'],
      ['Denmark','🇩🇰'],['Austria','🇦🇹'],['Scotland','🏴󠁧󠁢󠁳󠁣󠁴󠁿'],['Turkey','🇹🇷'],['Serbia','🇷🇸'],['Poland','🇵🇱'],
    ]},
    { name: 'CONMEBOL', emoji: '🌎', spots: 6, teams: [
      ['Argentina','🇦🇷'],['Brazil','🇧🇷'],['Colombia','🇨🇴'],['Ecuador','🇪🇨'],['Uruguay','🇺🇾'],['Venezuela','🇻🇪'],
    ]},
    { name: 'CONCACAF', emoji: '🌎', spots: 6, teams: [
      ['USA','🇺🇸',true],['Canada','🇨🇦',true],['Mexico','🇲🇽',true],['Panama','🇵🇦'],['Jamaica','🇯🇲'],['Costa Rica','🇨🇷'],
    ]},
    { name: 'CAF',      emoji: '🌍', spots: 9, teams: [
      ['Morocco','🇲🇦'],['Senegal','🇸🇳'],['Nigeria','🇳🇬'],["Ivory Coast",'🇨🇮'],['Egypt','🇪🇬'],
      ['South Africa','🇿🇦'],['Cameroon','🇨🇲'],['Ghana','🇬🇭'],['DR Congo','🇨🇩'],
    ]},
    { name: 'AFC',      emoji: '🌏', spots: 8, teams: [
      ['Japan','🇯🇵'],['South Korea','🇰🇷'],['Iran','🇮🇷'],['Saudi Arabia','🇸🇦'],
      ['Australia','🇦🇺'],['Uzbekistan','🇺🇿'],['Iraq','🇮🇶'],['Jordan','🇯🇴'],
    ]},
    { name: 'OFC',      emoji: '🌊', spots: 1, teams: [['New Zealand','🇳🇿']] },
  ];

  // ── State ──────────────────────────────────────────────────────────────────
  let activeTab = 'schedule';
  let viewDate = new Date();
  let refreshTimer = null;
  let hasLiveMatches = false;
  let refreshTick = 0;
  const loadedTabs = new Set();

  // ── Helpers ────────────────────────────────────────────────────────────────
  const esc = window.esc || function (s) {
    return String(s || '').replace(/[&<>"']/g, c => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  };

  function dateKey(d) {
    return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  }

  function fmtShort(d) {
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  function fmtLong(d) {
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  }

  function isToday(d) {
    const n = new Date();
    return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
  }

  function fmtTime(iso) {
    if (!iso) return '';
    try { return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); }
    catch { return ''; }
  }

  function teamFlag(name) {
    if (!name) return '⚽';
    const n = name.toLowerCase();
    const MAP = {
      argentina: '🇦🇷', australia: '🇦🇺', austria: '🇦🇹', belgium: '🇧🇪',
      brazil: '🇧🇷', cameroon: '🇨🇲', canada: '🇨🇦', chile: '🇨🇱',
      china: '🇨🇳', colombia: '🇨🇴', 'costa rica': '🇨🇷', croatia: '🇭🇷',
      czechia: '🇨🇿', 'czech republic': '🇨🇿', denmark: '🇩🇰', 'dr congo': '🇨🇩',
      ecuador: '🇪🇨', egypt: '🇪🇬', england: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', france: '🇫🇷',
      germany: '🇩🇪', ghana: '🇬🇭', honduras: '🇭🇳', hungary: '🇭🇺',
      iran: '🇮🇷', iraq: '🇮🇶', "ivory coast": '🇨🇮', "côte d'ivoire": '🇨🇮',
      jamaica: '🇯🇲', japan: '🇯🇵', jordan: '🇯🇴', mexico: '🇲🇽',
      morocco: '🇲🇦', netherlands: '🇳🇱', 'new zealand': '🇳🇿', nigeria: '🇳🇬',
      panama: '🇵🇦', paraguay: '🇵🇾', peru: '🇵🇪', poland: '🇵🇱',
      portugal: '🇵🇹', romania: '🇷🇴', 'saudi arabia': '🇸🇦', scotland: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
      senegal: '🇸🇳', serbia: '🇷🇸', slovakia: '🇸🇰', slovenia: '🇸🇮',
      'south africa': '🇿🇦', 'south korea': '🇰🇷', 'korea republic': '🇰🇷',
      spain: '🇪🇸', switzerland: '🇨🇭', turkey: '🇹🇷', 'türkiye': '🇹🇷',
      ukraine: '🇺🇦', 'united states': '🇺🇸', usa: '🇺🇸', 'u.s.': '🇺🇸',
      uruguay: '🇺🇾', uzbekistan: '🇺🇿', venezuela: '🇻🇪', wales: '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
      albania: '🇦🇱', algeria: '🇩🇿', mali: '🇲🇱',
    };
    for (const [k, v] of Object.entries(MAP)) { if (n.includes(k)) return v; }
    return '⚽';
  }

  function pane(id) { return document.getElementById(`tab-${id}`); }

  function setUpdateTime() {
    const el = document.getElementById('wc-update-time');
    if (el) el.textContent = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  // ── API ────────────────────────────────────────────────────────────────────
  async function apiFetch(path) {
    const r = await fetch(`${ESPN_BASE}/${path}`, { headers: { Accept: 'application/json' } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }

  // ── Skeleton / error ────────────────────────────────────────────────────────
  function skeleton(n, cols) {
    const items = Array(n).fill(0).map(() =>
      '<div class="card-neon p-5 animate-pulse"><div class="h-3 bg-surface-container rounded w-1/3 mb-4"></div><div class="h-8 bg-surface-container rounded mb-3"></div><div class="h-3 bg-surface-container rounded w-2/3"></div></div>'
    ).join('');
    return `<div class="grid gap-3 ${cols}">${items}</div>`;
  }

  function errBox(msg) {
    return `<div class="text-center py-20">
      <span class="material-symbols-outlined text-5xl text-error/50">error</span>
      <p class="mt-3 font-label-caps text-label-caps uppercase tracking-widest text-error/50">${esc(msg)}</p>
    </div>`;
  }

  // ── SCHEDULE tab ────────────────────────────────────────────────────────────
  async function loadSchedule() {
    const el = pane('schedule');
    el.innerHTML = skeleton(6, 'sm:grid-cols-2 lg:grid-cols-3');
    try {
      const data = await apiFetch(`scoreboard?dates=${dateKey(viewDate)}`);
      renderSchedule(el, data);
      setUpdateTime();
    } catch (err) {
      el.innerHTML = errBox(`Failed to load matches — ${err.message}`);
    }
  }

  function renderSchedule(el, data) {
    const events = data?.events || [];
    hasLiveMatches = events.some(e => e.competitions?.[0]?.status?.type?.state === 'in');
    const prev = new Date(viewDate); prev.setDate(prev.getDate() - 1);
    const next = new Date(viewDate); next.setDate(next.getDate() + 1);

    const todayBadge = isToday(viewDate)
      ? '<span class="text-secondary neon-text-magenta font-bold uppercase tracking-widest mr-1">TODAY</span> · '
      : '';

    const matchGrid = events.length
      ? `<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">${events.map(matchCard).join('')}</div>`
      : `<div class="card-neon p-12 text-center text-on-tertiary-container font-label-caps text-label-caps uppercase tracking-widest">No matches scheduled on this date</div>`;

    el.innerHTML = `
      <div class="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <button id="sch-prev" class="px-3 py-1.5 border border-outline-variant font-label-caps text-[10px] text-primary uppercase tracking-widest hover:border-primary-fixed-dim hover:text-primary-fixed-dim transition-all flex items-center gap-1">
          <span class="material-symbols-outlined text-sm align-middle">chevron_left</span>${esc(fmtShort(prev))}
        </button>
        <div class="text-center">
          <div class="font-body-md text-body-md text-primary">${todayBadge}${esc(fmtLong(viewDate))}</div>
          <div class="font-label-caps text-[9px] text-on-tertiary-container uppercase tracking-widest mt-0.5">${events.length} match${events.length !== 1 ? 'es' : ''}</div>
        </div>
        <button id="sch-next" class="px-3 py-1.5 border border-outline-variant font-label-caps text-[10px] text-primary uppercase tracking-widest hover:border-primary-fixed-dim hover:text-primary-fixed-dim transition-all flex items-center gap-1">
          ${esc(fmtShort(next))}<span class="material-symbols-outlined text-sm align-middle">chevron_right</span>
        </button>
      </div>
      ${matchGrid}`;

    el.querySelector('#sch-prev').addEventListener('click', () => { viewDate = prev; loadSchedule(); });
    el.querySelector('#sch-next').addEventListener('click', () => { viewDate = next; loadSchedule(); });
  }

  function matchCard(evt) {
    const comp = evt.competitions?.[0];
    if (!comp) return '';
    const home = comp.competitors?.find(c => c.homeAway === 'home') ?? comp.competitors?.[0];
    const away = comp.competitors?.find(c => c.homeAway === 'away') ?? comp.competitors?.[1];
    if (!home || !away) return '';

    const st = comp.status?.type;
    const isLive = st?.state === 'in';
    const isDone = st?.completed;

    let statusHtml;
    if (isLive) {
      statusHtml = `<span class="text-green-400 animate-pulse">${esc(comp.status?.displayClock || 'LIVE')}</span>`;
    } else if (isDone) {
      statusHtml = `<span class="text-on-tertiary-container">FT</span>`;
    } else {
      statusHtml = `<span class="text-primary-fixed-dim">${esc(fmtTime(comp.date || evt.date))}</span>`;
    }

    const note = evt.notes?.[0]?.headline || '';
    const venue = comp.venue?.fullName || '';
    const glowCls = isLive ? ' glow-cyan' : '';

    function teamBlock(team, score) {
      const logo = team?.logos?.[0]?.href;
      const ico = logo
        ? `<img src="${esc(logo)}" alt="" class="w-8 h-8 object-contain" />`
        : `<span class="text-2xl">${teamFlag(team?.displayName)}</span>`;
      const name = team?.shortDisplayName || team?.displayName || '?';
      const scoreHtml = (isDone || isLive)
        ? `<span class="font-headline-md text-headline-md text-primary neon-text-cyan tabular-nums">${score ?? '—'}</span>`
        : '';
      return `<div class="flex flex-col items-center gap-1.5 flex-1">
        ${ico}
        <span class="font-body-md text-body-sm text-primary text-center leading-tight max-w-[80px] line-clamp-2">${esc(name)}</span>
        ${scoreHtml}
      </div>`;
    }

    return `<div class="card-neon p-4 flex flex-col gap-3${glowCls}">
      ${note ? `<div class="font-label-caps text-[9px] uppercase tracking-widest text-on-tertiary-container">${esc(note)}</div>` : ''}
      <div class="flex items-center justify-between gap-2">
        ${teamBlock(home.team, home.score)}
        <div class="flex flex-col items-center gap-1 min-w-[56px] text-center">
          <div class="font-label-caps text-[10px]">${statusHtml}</div>
          ${isDone || isLive ? '<span class="text-on-tertiary-container opacity-40 text-base font-bold">—</span>' : ''}
        </div>
        ${teamBlock(away.team, away.score)}
      </div>
      ${venue ? `<div class="border-t border-outline-variant/40 pt-2 font-label-caps text-[9px] text-on-tertiary-container uppercase tracking-widest truncate">${esc(venue)}</div>` : ''}
    </div>`;
  }

  // ── GROUPS tab ──────────────────────────────────────────────────────────────
  async function loadGroups() {
    if (loadedTabs.has('groups')) return;
    const el = pane('groups');
    el.innerHTML = skeleton(12, 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4');
    try {
      const data = await apiFetch('standings');
      renderGroups(el, data);
      loadedTabs.add('groups');
      setUpdateTime();
    } catch (err) {
      el.innerHTML = errBox(`Failed to load standings — ${err.message}`);
    }
  }

  function renderGroups(el, data) {
    const groups = data?.children || [];
    if (!groups.length) { el.innerHTML = errBox('Group standings not yet available'); return; }

    const cards = groups.map(g => {
      const name = g.name || g.abbreviation || 'Group';
      const entries = g.standings?.entries || [];

      const rows = entries.map(e => {
        const team = e.team;
        const s = Object.fromEntries((e.stats || []).map(x => [x.abbreviation || x.name, x.value ?? 0]));
        const gp  = s['GP']  ?? s['gamesPlayed']       ?? 0;
        const w   = s['W']   ?? s['wins']               ?? 0;
        const d   = s['D']   ?? s['ties']               ?? 0;
        const l   = s['L']   ?? s['losses']             ?? 0;
        const gd  = s['GD']  ?? s['pointDifferential']  ?? ((s['GF'] ?? 0) - (s['GA'] ?? 0));
        const pts = s['PTS'] ?? s['points']             ?? 0;
        const logo = team?.logos?.[0]?.href;
        const ico = logo
          ? `<img src="${esc(logo)}" alt="" class="w-4 h-4 object-contain flex-shrink-0" />`
          : `<span class="text-sm">${teamFlag(team?.displayName)}</span>`;
        return `<tr class="border-t border-outline-variant/30 hover:bg-surface-container/40 transition-colors">
          <td class="py-1.5 pr-2">
            <div class="flex items-center gap-1.5">
              ${ico}<span class="font-body-md text-body-sm text-primary truncate" style="max-width:72px">${esc(team?.shortDisplayName || team?.displayName || '?')}</span>
            </div>
          </td>
          <td class="py-1.5 text-center text-[10px] text-on-tertiary-container tabular-nums">${gp}</td>
          <td class="py-1.5 text-center text-[10px] text-on-tertiary-container tabular-nums">${w}</td>
          <td class="py-1.5 text-center text-[10px] text-on-tertiary-container tabular-nums">${d}</td>
          <td class="py-1.5 text-center text-[10px] text-on-tertiary-container tabular-nums">${l}</td>
          <td class="py-1.5 text-center text-[10px] text-on-tertiary-container tabular-nums">${Number(gd) >= 0 ? '+' : ''}${gd}</td>
          <td class="py-1.5 text-center text-[11px] font-bold text-primary tabular-nums">${pts}</td>
        </tr>`;
      }).join('');

      return `<div class="card-neon p-4">
        <div class="font-label-caps text-label-caps uppercase tracking-widest text-primary-fixed-dim neon-text-cyan mb-3">${esc(name)}</div>
        <table class="w-full text-left">
          <thead><tr>
            <th class="pb-1.5 font-label-caps text-[9px] uppercase tracking-widest text-on-tertiary-container">Team</th>
            ${['MP','W','D','L','GD','PTS'].map(h =>
              `<th class="pb-1.5 font-label-caps text-[9px] uppercase tracking-widest text-on-tertiary-container text-center">${h}</th>`
            ).join('')}
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
    }).join('');

    el.innerHTML = `<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">${cards}</div>`;
  }

  // ── TEAMS tab ────────────────────────────────────────────────────────────────
  async function loadTeams() {
    if (loadedTabs.has('teams')) return;
    const el = pane('teams');
    el.innerHTML = skeleton(24, 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6');
    try {
      const data = await apiFetch('teams?limit=100');
      const teams = (data?.sports?.[0]?.leagues?.[0]?.teams || data?.teams || []).map(t => t.team || t);
      if (!teams.length) throw new Error('no teams');
      renderAPITeams(el, teams);
      loadedTabs.add('teams');
    } catch {
      el.innerHTML = renderStaticTeams();
      loadedTabs.add('teams');
    }
  }

  function renderAPITeams(el, teams) {
    const cards = teams.map(t => {
      const logo = t.logos?.[0]?.href;
      const ico = logo
        ? `<img src="${esc(logo)}" alt="" class="w-8 h-8 object-contain" />`
        : `<span class="text-2xl">${teamFlag(t.displayName)}</span>`;
      const name = t.shortDisplayName || t.displayName || '?';
      return `<div class="card-neon p-3 flex items-center gap-3 hover:glow-cyan transition-all cursor-default">
        ${ico}
        <div class="min-w-0 flex-1">
          <div class="font-body-md text-body-sm text-primary truncate">${esc(name)}</div>
          ${t.abbreviation ? `<div class="font-label-caps text-[9px] text-on-tertiary-container uppercase tracking-widest">${esc(t.abbreviation)}</div>` : ''}
        </div>
      </div>`;
    }).join('');
    el.innerHTML = `
      <div class="mb-3 font-label-caps text-[9px] text-on-tertiary-container uppercase tracking-widest">${teams.length} Teams · FIFA World Cup 2026</div>
      <div class="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">${cards}</div>`;
  }

  function renderStaticTeams() {
    return STATIC_CONFS.map(c => `
      <div class="mb-8">
        <div class="flex items-center gap-2 mb-3">
          <span class="font-label-caps text-label-caps uppercase tracking-widest text-primary-fixed-dim neon-text-cyan">${c.emoji} ${esc(c.name)}</span>
          <span class="font-label-caps text-[9px] text-on-tertiary-container uppercase tracking-widest">${c.spots} spots</span>
        </div>
        <div class="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          ${c.teams.map(([name, flag, isHost]) => `
            <div class="card-neon p-3 flex items-center gap-2 ${isHost ? 'glow-cyan' : ''}">
              <span class="text-xl flex-shrink-0">${flag}</span>
              <div class="min-w-0">
                <div class="font-body-md text-body-sm text-primary truncate">${esc(name)}</div>
                ${isHost ? '<div class="font-label-caps text-[9px] text-primary-fixed-dim uppercase tracking-widest">HOST</div>' : ''}
              </div>
            </div>`).join('')}
        </div>
      </div>`).join('');
  }

  // ── INFO tab ─────────────────────────────────────────────────────────────────
  function renderInfo() {
    if (loadedTabs.has('info')) return;
    loadedTabs.add('info');
    const el = pane('info');

    const venueCards = VENUES.map(v => `
      <div class="card-neon p-4 ${v.note ? 'glow-cyan' : ''}">
        <div class="flex items-start justify-between gap-2 mb-1">
          <div class="font-body-md text-body-md text-primary">${v.flag} ${esc(v.city)}</div>
          ${v.note ? `<span class="font-label-caps text-[9px] uppercase tracking-widest text-primary-fixed-dim neon-text-cyan border border-primary-fixed-dim/30 px-1.5 py-0.5 flex-shrink-0">${v.note}</span>` : ''}
        </div>
        <div class="font-body-md text-body-sm text-on-tertiary-container mb-1">${esc(v.stadium)}</div>
        <div class="font-label-caps text-[9px] text-on-tertiary-container uppercase tracking-widest">Cap. ${v.cap}</div>
      </div>`).join('');

    const fmtRows = FORMAT.map((f, i) => `
      <div class="flex items-center gap-4 ${i > 0 ? 'border-t border-outline-variant/30 pt-4' : ''}">
        <div class="w-9 h-9 border ${i === FORMAT.length - 1 ? 'border-primary-fixed-dim glow-cyan' : 'border-outline-variant'} flex items-center justify-center flex-shrink-0">
          <span class="material-symbols-outlined text-base ${i === FORMAT.length - 1 ? 'text-primary-fixed-dim' : 'text-on-tertiary-container'}">${f.icon}</span>
        </div>
        <div class="flex-1">
          <div class="font-body-md text-body-md text-primary">${esc(f.stage)}</div>
          <div class="font-label-caps text-[9px] text-on-tertiary-container uppercase tracking-widest">${esc(f.detail)}</div>
        </div>
        <div class="font-label-caps text-[9px] text-on-tertiary-container uppercase tracking-widest flex-shrink-0">${f.dates}</div>
      </div>`).join('');

    const dateRows = KEY_DATES.map(([stage, date, venue], i) => {
      const isLast = i === KEY_DATES.length - 1;
      return `<div class="flex items-center justify-between gap-4 ${i > 0 ? 'border-t border-outline-variant/30 pt-3' : ''}">
        <div class="font-body-md ${isLast ? 'text-secondary font-bold' : 'text-primary'} text-body-sm">${esc(stage)}</div>
        <div class="text-right">
          <div class="font-label-caps text-[10px] ${isLast ? 'text-secondary' : 'text-primary-fixed-dim'} uppercase tracking-widest">${esc(date)}</div>
          ${venue ? `<div class="font-label-caps text-[9px] text-on-tertiary-container uppercase tracking-widest">${esc(venue)}</div>` : ''}
        </div>
      </div>`;
    }).join('');

    el.innerHTML = `
      <!-- Stats strip -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        ${[['48','Teams'],['16','Venues'],['104','Matches'],['3','Host Nations']].map(([n, l]) =>
          `<div class="card-neon p-5 text-center">
            <div class="font-display-lg text-headline-lg text-primary neon-text-cyan">${n}</div>
            <div class="font-label-caps text-[9px] text-on-tertiary-container uppercase tracking-widest mt-1">${l}</div>
          </div>`).join('')}
      </div>

      <!-- Format + Key Dates -->
      <div class="grid gap-8 lg:grid-cols-2 mb-10">
        <div>
          <h2 class="font-label-caps text-label-caps uppercase tracking-widest text-primary-fixed-dim mb-5">Tournament Format</h2>
          <div class="card-neon p-6 flex flex-col gap-4">${fmtRows}</div>
        </div>
        <div>
          <h2 class="font-label-caps text-label-caps uppercase tracking-widest text-primary-fixed-dim mb-5">Key Dates</h2>
          <div class="card-neon p-6 flex flex-col gap-3">${dateRows}</div>
        </div>
      </div>

      <!-- Venues -->
      <div>
        <h2 class="font-label-caps text-label-caps uppercase tracking-widest text-primary-fixed-dim mb-5">Host Cities &amp; Venues</h2>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">${venueCards}</div>
      </div>`;
  }

  // ── Tab switching ────────────────────────────────────────────────────────────
  function switchTab(tab) {
    activeTab = tab;
    document.querySelectorAll('[role="tab"][data-tab]').forEach(btn => {
      const active = btn.dataset.tab === tab;
      btn.setAttribute('aria-selected', active);
      if (active) {
        btn.classList.add('text-secondary', 'border-secondary');
        btn.classList.remove('text-primary', 'border-transparent');
      } else {
        btn.classList.remove('text-secondary', 'border-secondary');
        btn.classList.add('text-primary', 'border-transparent');
      }
    });
    ['schedule', 'groups', 'teams', 'info'].forEach(id => {
      pane(id).classList.toggle('hidden', id !== tab);
    });
    if (tab === 'schedule') loadSchedule();
    else if (tab === 'groups') loadGroups();
    else if (tab === 'teams') loadTeams();
    else if (tab === 'info') renderInfo();
  }

  // ── Adaptive refresh loop ─────────────────────────────────────────────────
  // Runs every 30s during live matches, 60s otherwise.
  // Every 3 ticks it also refreshes group standings.
  function scheduleRefresh() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(async () => {
      refreshTick++;
      // Always re-fetch schedule if it's the active tab or a live match is ongoing
      if (activeTab === 'schedule' || hasLiveMatches) await loadSchedule();
      // Refresh group standings every 3 ticks (~90s live / ~3 min idle)
      if (refreshTick % 3 === 0 && loadedTabs.has('groups')) {
        loadedTabs.delete('groups');
        await loadGroups();
      }
      scheduleRefresh();
    }, hasLiveMatches ? REFRESH_MS_LIVE : REFRESH_MS_IDLE);
  }

  // ── Manual refresh ────────────────────────────────────────────────────────
  function refreshActive() {
    if (activeTab === 'schedule') {
      loadSchedule();
    } else if (activeTab === 'groups') {
      loadedTabs.delete('groups');
      loadGroups();
    } else if (activeTab === 'teams') {
      loadedTabs.delete('teams');
      loadTeams();
    }
  }

  // ── Init ───────────────────────────────────────────────────────────────────
  function init() {
    document.querySelectorAll('[role="tab"][data-tab]').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    const refreshBtn = document.getElementById('wc-refresh-btn');
    if (refreshBtn) refreshBtn.addEventListener('click', refreshActive);

    renderInfo();
    switchTab('schedule');
    scheduleRefresh();

    window.addEventListener('beforeunload', () => clearTimeout(refreshTimer));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
