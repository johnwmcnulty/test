// Hi-fi Mobile field interface - crew app: offline-first capture, clock-in, tasks,
// daily logs, field change orders, receipts, photos, messages.
// This file: shared FieldCtx + provider, shell (status bar / app bar / tab bar + capture FAB),
// sync infrastructure, Home, Time tracking, and the capture / sync / task sheets.
// Heavier screens live in hifi-field2.jsx.

const FieldCtx = React.createContext({});

const FIELD_PROJECTS = [];
function bqFieldProjects() {
  const acts = window.bqProj ? window.bqProj.actives() : [];
  if (!acts.length) return FIELD_PROJECTS;
  return acts.map((x) => ({ id: x.project.id, n: x.client.name + ' - ' + x.project.title, short: window.bqProj.shortName(x.client, x.project), addr: x.client.addr || '', ph: x.project.stage + ' · ' + window.bqProj.pct(x.project) + '%', open: (x.project.tasks || []).filter((t) => !t.done).length }));
}
const FIELD_GPS = 'On site';
function bqFieldGps() {
  const acts = window.bqProj ? window.bqProj.actives() : [];
  if (acts.length && acts[0].client.addr) return acts[0].client.addr + ' · ±12 ft';
  return FIELD_GPS;
}
const F_CHAT = 'M5 5 H19 a1 1 0 0 1 1 1 V15 a1 1 0 0 1-1 1 H10 L6 19.5 V16 H5 a1 1 0 0 1-1-1 V6 a1 1 0 0 1 1-1 Z';
const F_WIFI = 'M3 12 a9 9 0 0 1 18 0 M6.5 14.5 a5 5 0 0 1 11 0 M10 17.5 a2.2 2.2 0 0 1 4 0';
const F_WIFI_OFF = 'M3 12 a9 9 0 0 1 4.5-3.4 M21 12 a9 9 0 0 0-9-3.7 M17.5 14.5 a5 5 0 0 0-3.5-1.4 M10 17.5 a2.2 2.2 0 0 1 4 0 M4 4 L20 20';

function fmtElapsed(ms) {
  const m = Math.max(0, Math.floor(ms / 60000));
  const h = Math.floor(m / 60);
  return h ? (h + 'h ' + (m % 60) + 'm') : (m + 'm');
}
function fmtClock(ts) {
  const d = new Date(ts);
  let h = d.getHours(); const mm = String(d.getMinutes()).padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
  return h + ':' + mm + ' ' + ap;
}
function useTick(active) {
  const [, set] = React.useState(0);
  React.useEffect(() => {
    if (!active) return;
    const id = setInterval(() => set((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [active]);
}

// ─────────────────────────────────────────── provider ───────────────────────────────────────────
function FieldProvider({ children }) {
  const [screen, setScreen] = React.useState('home');
  const [sheet, setSheet] = React.useState(null);          // null | 'capture' | 'sync' | 'more' | {type:'task', task}
  const [online, setOnline] = React.useState(true);
  const [queue, setQueue] = React.useState([]);            // {id, kind, glyph, label, sub, project, status, ts}
  const [toast, setToast] = React.useState(null);
  const [clock, setClock] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(window.bqNsKey('bq-field-clock'))) || null; } catch (e) { return null; }
  });
  const [timeEntries, setTimeEntries] = window.bqPersistState('field-time', []);
  const [tasks, setTasks] = window.bqPersistState('field-tasks', []);
  const [logs, setLogs] = window.bqPersistState('field-logs', []);
  const [authed, setAuthed] = window.bqPersistState('field-session', false);
  const [account, setAccount] = window.bqPersistState('field-account', null);
  const baseWorker = window.bqClean()
    ? { name: 'Field crew', first: 'there', initials: 'FC', role: 'Field crew', company: window.bqCompany(), phone: '' }
    : { name: 'Marco Diaz', first: 'Marco', initials: 'MD', role: 'Lead carpenter', company: window.bqCompany(), phone: '(702) 555-0148' };
  const worker = account && account.name
    ? { ...baseWorker, name: account.name, first: account.name.trim().split(/\s+/)[0], initials: account.name.trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase(), phone: account.phone || baseWorker.phone }
    : baseWorker;

  const timers = React.useRef({});
  React.useEffect(() => () => { Object.values(timers.current).forEach(clearTimeout); }, []);

  const showToast = (msg, tone) => { setToast({ msg, tone: tone || 'ok' }); clearTimeout(timers.current.__toast); timers.current.__toast = setTimeout(() => setToast(null), 2600); };

  const markSynced = (id) => setQueue((q) => q.map((e) => e.id === id ? { ...e, status: 'synced' } : e));
  const scheduleSync = (id) => { timers.current[id] = setTimeout(() => markSynced(id), 1400); };

  const enqueue = (item) => {
    const id = 'q' + Date.now() + Math.round(Math.random() * 999);
    const status = online ? 'syncing' : 'queued';
    setQueue((q) => [{ id, status, ts: Date.now(), project: (window.__bqFieldProj || ''), ...item }, ...q]);
    if (online) scheduleSync(id);
    try { window.bqLogEvent && window.bqLogEvent('field', { g: item.glyph || item.kind || 'log', tone: item.tone || 'ai', body: item.label + ((item.project || window.__bqFieldProj) ? ' · ' + (item.project || window.__bqFieldProj) : ''), change: (worker && worker.first ? worker.first : 'The crew') + ' · ' + item.label }); } catch (e) {}
    return id;
  };

  const setNet = (next) => {
    setOnline(next);
    if (next) {
      // flush queued items, staggered
      setQueue((q) => q.map((e) => e.status === 'queued' ? { ...e, status: 'syncing' } : e));
      setQueue((q) => { q.forEach((e, i) => { if (e.status === 'syncing' || e.status === 'queued') { timers.current[e.id] = setTimeout(() => markSynced(e.id), 700 + i * 500); } }); return q; });
    } else {
      setQueue((q) => q.map((e) => e.status === 'syncing' ? { ...e, status: 'queued' } : e));
    }
  };

  const setTaskStatus = (id, status) => {
    setTasks((list) => list.map((t) => t.id === id ? { ...t, status } : t));
    const t = tasks.find((x) => x.id === id);
    if (t) enqueue({ kind: 'task', glyph: 'check', label: (status === 'done' ? 'Completed' : status === 'blocked' ? 'Flagged blocked' : 'Reopened') + ': ' + t.t, project: t.proj });
  };

  const addLog = (entry) => setLogs((l) => [{ id: 'l' + Date.now(), ...entry }, ...l]);

  const startClock = (project) => {
    const c = { project: project || window.__bqFieldProj || '', since: Date.now() };
    setClock(c); try { localStorage.setItem(window.bqNsKey('bq-field-clock'), JSON.stringify(c)); } catch (e) {}
    showToast('Clocked in · ' + bqFieldGps(), 'ok');
  };
  const stopClock = () => {
    if (!clock) return;
    const hrs = Math.max(0.1, (Date.now() - clock.since) / 3600000);
    setTimeEntries((te) => [{ id: 'te' + Date.now(), project: clock.project, start: 'Today', hours: Math.round(hrs * 10) / 10, note: 'Field clock' }, ...te]);
    enqueue({ kind: 'time', glyph: 'clock', label: 'Time entry · ' + (Math.round(hrs * 10) / 10) + ' hrs', project: clock.project });
    setClock(null); try { localStorage.removeItem(window.bqNsKey('bq-field-clock')); } catch (e) {}
    showToast('Clocked out · ' + (Math.round(hrs * 10) / 10) + ' hrs logged', 'ok');
  };

  const pending = queue.filter((e) => e.status !== 'synced').length;
  const syncing = queue.some((e) => e.status === 'syncing');

  window.bqUseNewClients && window.bqUseNewClients(); // re-render on store change
  const activeProjects = window.bqProj ? window.bqProj.actives() : []; // [{client, project}]
  const custOpts = activeProjects.map((x) => ({ key: x.project.id, label: window.bqProj.shortName(x.client, x.project) }));
  const projOptions = custOpts.length ? custOpts : [];
  const [projSel, setProj] = window.bqPersistState('field-proj', null);
  const projKey = projOptions.some((o) => o.key === projSel) ? projSel : (projOptions[0] ? projOptions[0].key : null);
  const projMatch = activeProjects.find((x) => x.project.id === projKey) || null;
  const proj = projMatch ? window.bqProj.shortName(projMatch.client, projMatch.project) : projKey; // display label
  const projRecord = projMatch ? projMatch.project : null;
  window.__bqFieldProj = proj;

  // when a real (custom) project is selected, the field shows ITS tasks/logs/time from the store
  const customField = !!projRecord;
  React.useEffect(() => {
    if (projRecord && clock && clock.project !== proj) {
      setClock(null); try { localStorage.removeItem(window.bqNsKey('bq-field-clock')); } catch (e) {}
    }
  }, [projRecord, proj, clock]);
  const shownTasks = customField ? (projRecord.tasks || []).map((t, i) => ({ id: 'pt' + i, t: t.t, proj: proj, pr: '', status: t.done ? 'done' : 'open', note: t.sub ? 'Assigned to sub' : '', _pidx: i })) : tasks;
  const shownLogs = customField ? (projRecord.logs || []).map((l, i) => ({ id: 'pl' + i, date: l.date, proj: proj, summary: l.summary, photos: 0, shared: l.shared })) : logs;
  const shownTime = customField ? timeEntries.filter((t) => t.note === 'Field clock') : timeEntries;
  const setTaskStatusX = customField
    ? (id) => { const idx = Number(String(id).replace('pt', '')); if (!isNaN(idx)) { window.bqProj.toggleTask(projRecord.id, idx); showToast('Task updated'); } }
    : setTaskStatus;

  const value = {
    screen, go: (s) => { setScreen(s); setSheet(null); },
    sheet, openSheet: setSheet, closeSheet: () => setSheet(null),
    online, setNet, queue, enqueue, pending, syncing,
    clock, startClock, stopClock,
    proj, setProj, projOptions, projKey, projRecord,
    tasks: shownTasks, setTaskStatus: setTaskStatusX, timeEntries: shownTime,
    logs: shownLogs, addLog, showToast, toast,
    authed, worker, account, setAccount,
    signIn: () => { setAuthed(true); setScreen('home'); setSheet(null); },
    signOut: () => { if (clock) { setClock(null); try { localStorage.setItem(window.bqNsKey('bq-field-clock'), 'null'); } catch (e) {} } setAuthed(false); setSheet(null); setScreen('home'); },
  };
  return <FieldCtx.Provider value={value}>{children}</FieldCtx.Provider>;
}
const useField = () => React.useContext(FieldCtx);

// ─────────────────────────────────────────── small parts ───────────────────────────────────────────
function FieldTile({ glyph, label, tone, onClick }) {
  const bg = tone === 'ai' ? 'var(--bq-ai)' : tone === 'brand' ? 'var(--bq-brand)' : '#fff';
  const fg = tone ? '#fff' : 'var(--bq-ink)';
  return (
    <button onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: 15, borderRadius: 18, border: 'none', cursor: 'pointer', background: bg, color: fg, boxShadow: tone ? 'none' : 'inset 0 0 0 1px var(--bq-border)', minHeight: 92, font: 'inherit', textAlign: 'left' }}>
      <BqIcon d={glyph} size={23} sw={1.7}></BqIcon>
      <span style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.2 }}>{label}</span>
    </button>
  );
}

function TaskRow({ task, onTap, onToggle }) {
  const done = task.status === 'done';
  const blocked = task.status === 'blocked';
  return (
    <div className="bq-card-s" style={{ padding: '12px 13px', display: 'flex', alignItems: 'center', gap: 12, opacity: done ? 0.72 : 1 }}>
      <button onClick={onToggle} aria-label="Toggle complete" style={{ width: 30, height: 30, borderRadius: 9, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', background: done ? 'var(--bq-good)' : '#fff', boxShadow: done ? 'none' : 'inset 0 0 0 1.5px var(--bq-border-strong)' }}>
        {done ? <BqIcon d={BQ_GLYPH.check} size={15} sw={2.6} style={{ color: '#fff' }}></BqIcon> : null}
      </button>
      <button onClick={onTap} style={{ flex: 1, minWidth: 0, textAlign: 'left', border: 'none', background: 'transparent', font: 'inherit', cursor: 'pointer', padding: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: done ? 'var(--bq-faint)' : 'var(--bq-ink)', textDecoration: done ? 'line-through' : 'none', lineHeight: 1.3 }}>{task.t}</div>
        <div style={{ fontSize: 12, color: 'var(--bq-faint)', marginTop: 1 }}>{task.proj}</div>
      </button>
      {blocked ? <span className="bq-chip" style={{ background: 'var(--bq-brand-soft)', color: 'var(--bq-bad)', boxShadow: 'inset 0 0 0 1px var(--bq-brand-border)' }}>Blocked</span>
        : task.pr ? <span className={'bq-chip ' + (task.pr === 'High' ? 'brand' : '')}>{task.pr}</span> : null}
    </div>
  );
}

function ClockCard() {
  const { clock, startClock, stopClock, proj } = useField();
  useTick(!!clock);
  const active = !!clock;
  return (
    <div className="bq-card-s" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 13, boxShadow: active ? '0 0 0 1.5px var(--bq-good)' : 'var(--bq-shadow)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <span style={{ width: 44, height: 44, borderRadius: 13, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? 'var(--bq-good-soft)' : 'var(--bq-subtle)', color: active ? 'var(--bq-good)' : 'var(--bq-muted)' }}>
          <BqIcon d={BQ_GLYPH.clock} size={22}></BqIcon>
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          {active ? (
            <React.Fragment>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--bq-good)', animation: 'bqpulse 1.6s infinite' }}></span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--bq-good)', whiteSpace: 'nowrap' }}>On the clock</span>
              </div>
              <div className="bq-num" style={{ fontSize: 24 }}>{fmtElapsed(Date.now() - clock.since)}</div>
              <div style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>{clock.project} · since {fmtClock(clock.since)}</div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Clock in to start the day</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--bq-faint)', marginTop: 2 }}>
                <BqIcon d="M12 21 C 7 16, 4 12.5, 4 9 a8 8 0 0 1 16 0 C 20 12.5, 17 16, 12 21 Z M12 11.5 a2.2 2.2 0 1 0 0-4.4 a2.2 2.2 0 0 0 0 4.4 Z" size={13}></BqIcon>{bqFieldGps()}
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
      {active
        ? <button className="bq-btn" style={{ width: '100%', padding: 13, fontSize: 15, boxShadow: '0 0 0 1px var(--bq-border-strong)' }} onClick={stopClock}>Clock out</button>
        : <button className="bq-btn primary" style={{ width: '100%', padding: 13, fontSize: 15 }} onClick={() => startClock(window.__bqFieldProj || '')}><BqIcon d={BQ_GLYPH.clock} size={16}></BqIcon>Clock in · {proj}</button>}
    </div>
  );
}

// ─────────────────────────────────────────── Home ───────────────────────────────────────────
function FieldHome() {
  const { go, tasks, setTaskStatus, openSheet, online, pending, worker } = useField();
  const open = tasks.filter((t) => t.status !== 'done').length;
  return (
    <React.Fragment>
      <div style={{ padding: '6px 4px 12px' }}>
        <div style={{ fontSize: 13, color: 'var(--bq-faint)' }}>Wednesday, Jun 12</div>
        <div className="bq-display" style={{ fontSize: 24 }}>Morning, {worker.first}</div>
      </div>

      {(!online || pending > 0) ? (
        <button onClick={() => openSheet('sync')} style={{ width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', font: 'inherit', borderRadius: 14, padding: '11px 13px', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, background: online ? 'var(--bq-ai-soft)' : 'var(--bq-brand-soft)', boxShadow: 'inset 0 0 0 1px ' + (online ? 'var(--bq-ai-border)' : 'var(--bq-brand-border)') }}>
          <BqIcon d={online ? F_WIFI : F_WIFI_OFF} size={18} style={{ color: online ? 'var(--bq-ai-strong)' : 'var(--bq-bad)', flex: 'none' }}></BqIcon>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: online ? 'var(--bq-ai-strong)' : 'var(--bq-bad)' }}>{online ? 'Syncing ' + pending + ' item' + (pending > 1 ? 's' : '') + '…' : 'Working offline'}</div>
            <div style={{ fontSize: 11.5, color: 'var(--bq-muted)' }}>{online ? 'Saved to the office automatically' : pending + ' captured · will upload when you have signal'}</div>
          </div>
          <BqIcon d="M9 5 L16 12 L9 19" size={15} style={{ color: 'var(--bq-faint)' }}></BqIcon>
        </button>
      ) : null}

      <ClockCard></ClockCard>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
        <FieldTile glyph={BQ_GLYPH.log} label="New daily log" tone="ai" onClick={() => go('log')}></FieldTile>
        <FieldTile glyph={BQ_GLYPH.camera} label="Add photo" tone="brand" onClick={() => go('photos')}></FieldTile>
        <FieldTile glyph={BQ_GLYPH.co} label="Change order" onClick={() => go('co')}></FieldTile>
        <FieldTile glyph={BQ_GLYPH.expense} label="Snap receipt" onClick={() => go('receipt')}></FieldTile>
      </div>

      <div style={{ marginTop: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Today's tasks</span>
          <span className="bq-chip brand">{open} open</span>
          <span style={{ flex: 1 }}></span>
          <button onClick={() => go('cal')} style={{ border: 'none', background: 'none', font: 'inherit', fontSize: 12.5, fontWeight: 600, color: 'var(--bq-brand-strong)', cursor: 'pointer' }}>Schedule</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tasks.map((t) => (
            <TaskRow key={t.id} task={t} onTap={() => openSheet({ type: 'task', task: t })} onToggle={() => setTaskStatus(t.id, t.status === 'done' ? 'open' : 'done')}></TaskRow>
          ))}
        </div>
      </div>

      <div className="bq-card-s" style={{ marginTop: 16, padding: '14px 15px' }}>
        <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 6 }}>Assigned projects</div>
        {bqFieldProjects().map((p, i) => (
          <button key={p.id} onClick={() => go('proj')} style={{ width: '100%', textAlign: 'left', font: 'inherit', color: 'var(--bq-ink)', border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={BQ_GLYPH.hammer} size={16}></BqIcon></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--bq-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.n}</div>
              <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{p.ph}</div>
            </div>
            <BqIcon d="M9 5 L16 12 L9 19" size={15} style={{ color: 'var(--bq-faint)' }}></BqIcon>
          </button>
        ))}
      </div>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────── Time tracking ───────────────────────────────────────────
function FieldTime() {
  const { clock, timeEntries, startClock, stopClock } = useField();
  useTick(!!clock);
  const liveHrs = clock ? (Date.now() - clock.since) / 3600000 : 0;
  const weekBase = timeEntries.reduce((s, e) => s + e.hours, 0);
  const week = Math.round((weekBase + liveHrs) * 10) / 10;
  return (
    <React.Fragment>
      <div style={{ padding: '6px 4px 14px' }}>
        <div style={{ fontSize: 13, color: 'var(--bq-faint)' }}>Feeds job costing automatically</div>
        <div className="bq-display" style={{ fontSize: 24 }}>Time</div>
      </div>
      <div className="bq-card-s" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-muted)' }}>This week</div>
          <div className="bq-num" style={{ fontSize: 30 }}>{week}<span style={{ fontSize: 15, color: 'var(--bq-faint)', fontWeight: 600 }}> hrs</span></div>
        </div>
        {clock
          ? <button className="bq-btn" style={{ boxShadow: '0 0 0 1px var(--bq-border-strong)' }} onClick={stopClock}><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--bq-good)', animation: 'bqpulse 1.6s infinite' }}></span>Clock out</button>
          : <button className="bq-btn primary" onClick={() => startClock(window.__bqFieldProj || '')}><BqIcon d={BQ_GLYPH.clock} size={15}></BqIcon>Clock in</button>}
      </div>
      <div className="bq-card-s" style={{ overflow: 'hidden' }}>
        {clock ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px', background: 'var(--bq-good-soft)' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--bq-good)', flex: 'none', animation: 'bqpulse 1.6s infinite' }}></span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{clock.project}</div>
              <div style={{ fontSize: 11.5, color: 'var(--bq-muted)' }}>Running · started {fmtClock(clock.since)}</div>
            </div>
            <span className="bq-num" style={{ fontSize: 16, color: 'var(--bq-good)' }}>{fmtElapsed(Date.now() - clock.since)}</span>
          </div>
        ) : null}
        {timeEntries.map((e, i) => (
          <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px', borderTop: (i || clock) ? '1px solid var(--bq-border)' : 'none' }}>
            <span style={{ width: 38, height: 38, borderRadius: 11, flex: 'none', background: 'var(--bq-subtle)', color: 'var(--bq-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH.clock} size={17}></BqIcon></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{e.project}</div>
              <div style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>{e.start} · {e.note}</div>
            </div>
            <span className="bq-num" style={{ fontSize: 16 }}>{e.hours}h</span>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────── sheets ───────────────────────────────────────────
function Sheet({ title, sub, onClose, children, pad }) {
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'rgba(26,24,19,0.42)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', borderRadius: 36 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: 'var(--bq-card)', borderRadius: '22px 22px 0 0', padding: pad || '8px 16px 26px', maxHeight: '88%', overflow: 'auto', boxShadow: '0 -8px 40px rgba(0,0,0,0.25)' }}>
        <div style={{ width: 38, height: 4, borderRadius: 99, background: 'var(--bq-border-strong)', margin: '6px auto 12px' }}></div>
        {title ? <div style={{ marginBottom: sub ? 2 : 12, fontSize: 17, fontWeight: 700 }}>{title}</div> : null}
        {sub ? <div style={{ marginBottom: 14, fontSize: 12.5, color: 'var(--bq-muted)' }}>{sub}</div> : null}
        {children}
      </div>
    </div>
  );
}

function CaptureSheet() {
  const { closeSheet, go, clock, startClock, stopClock } = useField();
  const Row = ({ glyph, tone, label, sub, onClick }) => (
    <button onClick={onClick} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 13, padding: '12px 12px', borderRadius: 14, border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', textAlign: 'left' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bq-subtle)'; const t = e.currentTarget.querySelector('.f-row-title'); if (t) t.style.color = 'var(--bq-brand-strong)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; const t = e.currentTarget.querySelector('.f-row-title'); if (t) t.style.color = 'var(--bq-ink)'; }}>
      <span style={{ width: 42, height: 42, borderRadius: 12, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: tone === 'ai' ? 'var(--bq-ai-soft)' : tone === 'good' ? 'var(--bq-good-soft)' : 'var(--bq-brand-soft)', color: tone === 'ai' ? 'var(--bq-ai-strong)' : tone === 'good' ? 'var(--bq-good)' : 'var(--bq-brand-strong)' }}><BqIcon d={BQ_GLYPH[glyph]} size={21}></BqIcon></span>
      <div style={{ flex: 1 }}>
        <div className="f-row-title" style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--bq-ink)', transition: 'color 0.14s ease' }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{sub}</div>
      </div>
    </button>
  );
  return (
    <Sheet title="Capture" onClose={closeSheet}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Row glyph="spark" tone="ai" label="Ask BuilderIQ" sub="Specs, schedule, contacts - or draft anything" onClick={() => go('ask')}></Row>
        <Row glyph="clock" tone="good" label={clock ? 'Clock out' : 'Clock in'} sub={clock ? 'On the clock · ' + clock.project : bqFieldGps()} onClick={() => { clock ? stopClock() : startClock(window.__bqFieldProj || ''); closeSheet(); }}></Row>
        <Row glyph="log" tone="ai" label="New daily log" sub="Dictate - AI writes it up" onClick={() => go('log')}></Row>
        <Row glyph="camera" tone="brand" label="Add photo" sub="Auto-tagged to project & phase" onClick={() => go('photos')}></Row>
        <Row glyph="co" tone="brand" label="Log a change order" sub="Catch extra work before it leaks" onClick={() => go('co')}></Row>
        <Row glyph="expense" tone="brand" label="Snap a receipt" sub="Posts to the job budget" onClick={() => go('receipt')}></Row>
      </div>
    </Sheet>
  );
}

function SyncSheet() {
  const { closeSheet, online, setNet, queue, pending } = useField();
  const StatusPill = ({ s }) => {
    if (s === 'synced') return <span className="bq-chip good"><BqIcon d={BQ_GLYPH.check} size={11} sw={2.4}></BqIcon>Synced</span>;
    if (s === 'syncing') return <span className="bq-chip ai">Syncing…</span>;
    return <span className="bq-chip brand">Queued</span>;
  };
  return (
    <Sheet title={online ? 'Synced with office' : 'Working offline'} sub={online ? 'Everything you capture uploads automatically.' : pending + ' item' + (pending !== 1 ? 's' : '') + ' waiting for signal. They\'ll upload the moment you reconnect.'} onClose={closeSheet}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 13px', borderRadius: 14, background: online ? 'var(--bq-good-soft)' : 'var(--bq-brand-soft)', boxShadow: 'inset 0 0 0 1px ' + (online ? '#DCEBC2' : 'var(--bq-brand-border)'), marginBottom: 14 }}>
        <BqIcon d={online ? F_WIFI : F_WIFI_OFF} size={20} style={{ color: online ? 'var(--bq-good)' : 'var(--bq-bad)', flex: 'none' }}></BqIcon>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: online ? 'var(--bq-good)' : 'var(--bq-bad)' }}>{online ? 'Connected' : 'No connection'}</div>
          <div style={{ fontSize: 11.5, color: 'var(--bq-muted)' }}>Jobsites drop signal - capture keeps working either way.</div>
        </div>
        <button onClick={() => setNet(!online)} style={{ width: 44, height: 26, borderRadius: 999, border: 'none', cursor: 'pointer', flex: 'none', background: online ? 'var(--bq-good)' : 'var(--bq-border-strong)', position: 'relative' }}><span style={{ position: 'absolute', top: 3, left: online ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left .15s' }}></span></button>
      </div>
      {queue.length === 0
        ? <div style={{ textAlign: 'center', padding: '20px 0', fontSize: 13, color: 'var(--bq-faint)' }}>Nothing pending. You're all caught up.</div>
        : <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {queue.slice(0, 12).map((e) => (
              <div key={e.id} className="bq-card-s" style={{ padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 11, boxShadow: 'inset 0 0 0 1px var(--bq-border)' }}>
                <span style={{ width: 34, height: 34, borderRadius: 10, flex: 'none', background: 'var(--bq-subtle)', color: 'var(--bq-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH[e.glyph] || BQ_GLYPH.log} size={16}></BqIcon></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.25 }}>{e.label}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>{e.project}</div>
                </div>
                <StatusPill s={e.status}></StatusPill>
              </div>
            ))}
          </div>}
    </Sheet>
  );
}

function TaskSheet({ task }) {
  const { closeSheet, setTaskStatus, go } = useField();
  const Act = ({ glyph, label, tone, onClick }) => (
    <button onClick={onClick} className="bq-btn" style={{ justifyContent: 'flex-start', width: '100%', padding: '12px 14px', boxShadow: '0 0 0 1px var(--bq-border)', color: tone === 'bad' ? 'var(--bq-bad)' : 'var(--bq-ink)' }}>
      <BqIcon d={BQ_GLYPH[glyph]} size={17} style={{ color: tone === 'bad' ? 'var(--bq-bad)' : tone === 'good' ? 'var(--bq-good)' : 'var(--bq-muted)' }}></BqIcon>{label}
    </button>
  );
  return (
    <Sheet onClose={closeSheet}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span className={'bq-chip ' + (task.pr === 'High' ? 'brand' : '')}>{task.proj}</span>
        {task.status === 'blocked' ? <span className="bq-chip" style={{ color: 'var(--bq-bad)' }}>Blocked</span> : null}
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.25, marginBottom: 6 }}>{task.t}</div>
      {task.note ? <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5, marginBottom: 16 }}>{task.note}</div> : <div style={{ height: 8 }}></div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Act glyph="check" tone="good" label={task.status === 'done' ? 'Reopen task' : 'Mark complete'} onClick={() => { setTaskStatus(task.id, task.status === 'done' ? 'open' : 'done'); closeSheet(); }}></Act>
        <Act glyph="co" tone="bad" label="Flag as blocked" onClick={() => { setTaskStatus(task.id, 'blocked'); closeSheet(); }}></Act>
        <Act glyph="camera" label="Add a photo" onClick={() => go('photos')}></Act>
        <Act glyph="vendor" label="Request materials" onClick={() => go('messages')}></Act>
      </div>
    </Sheet>
  );
}

function MoreSheet() {
  const { closeSheet, go } = useField();
  const items = [
    ['spark', 'Ask BuilderIQ', 'Your jobsite assistant', 'ask'],
    ['cal', 'Schedule', "What's coming up", 'cal'],
    ['clock', 'Time tracking', 'Your hours this week', 'time'],
    ['photo', 'Photos', 'Jobsite gallery', 'photos'],
    [F_CHAT, 'Messages', 'Ping the office or PM', 'messages', true],
    ['expense', 'Receipts & expenses', 'Posted to the budget', 'receipt'],
    ['projects', 'Projects', 'Files, plans & specs', 'proj'],
  ];
  return (
    <Sheet title="More" onClose={closeSheet}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((it) => (
          <button key={it[3]} onClick={() => go(it[3])} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 13, padding: '12px', borderRadius: 14, border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', textAlign: 'left' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bq-subtle)'; const t = e.currentTarget.querySelector('.f-more-title'); if (t) t.style.color = 'var(--bq-brand-strong)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; const t = e.currentTarget.querySelector('.f-more-title'); if (t) t.style.color = 'var(--bq-ink)'; }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, flex: 'none', background: 'var(--bq-subtle)', color: 'var(--bq-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={it[4] ? it[0] : BQ_GLYPH[it[0]]} size={20}></BqIcon></span>
            <div style={{ flex: 1 }}>
              <div className="f-more-title" style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--bq-ink)', transition: 'color 0.14s ease' }}>{it[1]}</div>
              <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{it[2]}</div>
            </div>
            <BqIcon d="M9 5 L16 12 L9 19" size={15} style={{ color: 'var(--bq-faint)' }}></BqIcon>
          </button>
        ))}
      </div>
    </Sheet>
  );
}

// ─────────────────────────────────────────── account / sign out ────────────────────
function FieldAccountSheet() {
  const { closeSheet, signOut, worker, online } = useField();
  const [confirm, setConfirm] = React.useState(false);
  const rowStyle = { display: 'flex', alignItems: 'center', gap: 11, padding: '11px 2px', fontSize: 13.5 };
  return (
    <Sheet title={confirm ? '' : 'Account'} onClose={closeSheet}>
      {confirm ? (
        <div style={{ padding: '2px 2px 4px' }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Sign out of BuilderIQ Field?</div>
          <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5, marginBottom: 18 }}>Any unsynced captures stay queued on this device and upload when you sign back in.</div>
          <button className="bq-btn primary" style={{ width: '100%', padding: 13, fontSize: 15, background: 'var(--bq-brand)', marginBottom: 9 }} onClick={signOut}><BqIcon d="M9 4 H6 a1 1 0 0 0-1 1 V19 a1 1 0 0 0 1 1 H9 M14 8 L18 12 L14 16 M18 12 H9" size={16} sw={2}></BqIcon>Sign out</button>
          <button className="bq-btn ghost" style={{ width: '100%' }} onClick={() => setConfirm(false)}>Cancel</button>
        </div>
      ) : (
        <React.Fragment>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '4px 2px 16px' }}>
            <span className="bq-avatar" style={{ width: 48, height: 48, fontSize: 17, flex: 'none', background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)', boxShadow: 'inset 0 0 0 1px var(--bq-border)' }}>{worker.initials}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{worker.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{worker.role} · {worker.company}</div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--bq-border)' }}></div>
          <div style={{ ...rowStyle, borderBottom: '1px solid var(--bq-border)' }}>
            <BqIcon d="M4 6 h16 v12 h-16 Z M4 8 l8 5 l8-5" size={17} style={{ color: 'var(--bq-muted)', flex: 'none' }}></BqIcon>
            <span style={{ flex: 1 }}>{worker.phone}</span>
          </div>
          <div style={{ ...rowStyle, borderBottom: '1px solid var(--bq-border)' }}>
            <BqIcon d={F_WIFI} size={17} style={{ color: online ? 'var(--bq-good)' : 'var(--bq-bad)', flex: 'none' }}></BqIcon>
            <span style={{ flex: 1 }}>{online ? 'Online · captures sync live' : 'Offline · captures queued'}</span>
          </div>
          <button onClick={() => setConfirm(true)} style={{ ...rowStyle, width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', color: 'var(--bq-brand-strong)', fontWeight: 600, marginTop: 4 }}>
            <BqIcon d="M9 4 H6 a1 1 0 0 0-1 1 V19 a1 1 0 0 0 1 1 H9 M14 8 L18 12 L14 16 M18 12 H9" size={17} sw={1.8} style={{ flex: 'none' }}></BqIcon>Sign out
          </button>
        </React.Fragment>
      )}
    </Sheet>
  );
}

// ─────────────────────────────────────────── auth gate: signup → verify → login ────────────────────
function FieldAuthHeader({ title, sub }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 24 }}>
      <span className="bq-logomark" style={{ width: 56, height: 56, borderRadius: 16, marginBottom: 14 }}><BqIcon d={BQ_GLYPH.hammer} size={28} sw={1.8} style={{ color: '#fff' }}></BqIcon></span>
      <div className="bq-wordmark" style={{ fontSize: 22 }}>Builder<span className="iq">IQ</span> <span style={{ color: 'var(--bq-faint)', fontWeight: 600 }}>Field</span></div>
      <div style={{ fontSize: 15, fontWeight: 700, marginTop: 10 }}>{title}</div>
      {sub ? <div style={{ fontSize: 13, color: 'var(--bq-muted)', marginTop: 5, lineHeight: 1.5, maxWidth: 262 }}>{sub}</div> : null}
    </div>
  );
}

function FieldAuthSteps({ cur }) {
  const items = [['signup', '1', 'Create'], ['verify', '2', 'Verify'], ['login', '3', 'Sign in']];
  const idx = items.findIndex((it) => it[0] === cur);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '2px 0 18px', flex: 'none' }}>
      {items.map((it, i) => (
        <React.Fragment key={it[0]}>
          {i ? <span style={{ width: 18, height: 1.5, background: i <= idx ? 'var(--bq-brand)' : 'var(--bq-border-strong)', borderRadius: 2 }}></span> : null}
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, background: i < idx ? 'var(--bq-good)' : i === idx ? 'var(--bq-brand)' : 'var(--bq-subtle)', color: i <= idx ? '#fff' : 'var(--bq-faint)', boxShadow: i > idx ? 'inset 0 0 0 1px var(--bq-border-strong)' : 'none' }}>
              {i < idx ? <BqIcon d={BQ_GLYPH.check} size={10} sw={3}></BqIcon> : it[1]}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: i === idx ? 'var(--bq-ink)' : 'var(--bq-faint)' }}>{it[2]}</span>
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

function FieldAuth() {
  const { signIn, worker, account, setAccount } = useField();
  const [step, setStep] = React.useState(account ? 'login' : 'signup');
  // signup
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [invite, setInvite] = React.useState('');
  const [newPin, setNewPin] = React.useState('');
  // verify
  const [sentCode, setSentCode] = React.useState('');
  const [code, setCode] = React.useState('');
  const [smsIn, setSmsIn] = React.useState(false);
  // login
  const [loginPhone, setLoginPhone] = React.useState(account ? account.phone : worker.phone);
  const [pin, setPin] = React.useState('');
  const [verified, setVerified] = React.useState(false);
  const [err, setErr] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const timers = React.useRef([]);
  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const inputStyle = { width: '100%', boxSizing: 'border-box', padding: '13px 14px', borderRadius: 13, border: '1px solid var(--bq-border-strong)', background: 'var(--bq-card)', fontSize: 15, fontFamily: 'inherit', color: 'var(--bq-ink)', outline: 'none' };
  const labelStyle = { fontSize: 12, fontWeight: 700, color: 'var(--bq-muted)', display: 'block', marginBottom: 6 };
  const linkStyle = { border: 'none', background: 'none', font: 'inherit', fontSize: 12.5, fontWeight: 700, color: 'var(--bq-brand-strong)', cursor: 'pointer', padding: 0 };

  const sendCode = () => {
    const c = String(Math.floor(100000 + Math.random() * 900000));
    setSentCode(c); setCode(''); setErr(''); setSmsIn(false);
    later(() => setSmsIn(true), 1000);
  };

  // ── signup ──
  const signupReady = name.trim().length >= 2 && phone.replace(/\D/g, '').length >= 7 && newPin.length === 4;
  const doSignup = () => {
    if (!signupReady || busy) return;
    setBusy(true);
    later(() => { setBusy(false); sendCode(); setStep('verify'); }, 620);
  };

  // ── verify ──
  const doVerify = () => {
    if (code.length !== 6 || busy) return;
    if (code !== sentCode) { setErr("That code doesn't match. Check the text and try again."); return; }
    setBusy(true);
    later(() => {
      setBusy(false); setSmsIn(false);
      setAccount({ name: name.trim(), phone: phone.trim(), pin: newPin });
      setLoginPhone(phone.trim()); setPin(''); setVerified(true); setErr('');
      setStep('login');
    }, 700);
  };

  // ── login ──
  const loginReady = loginPhone.trim().length >= 7 && pin.length === 4;
  const doLogin = () => {
    if (!loginReady || busy) return;
    if (account && account.pin && pin !== account.pin) { setErr('Wrong PIN. Try the 4 digits you chose at signup.'); return; }
    setBusy(true);
    later(signIn, 620);
  };

  const errBox = err ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', borderRadius: 12, background: 'var(--bq-brand-soft)', boxShadow: 'inset 0 0 0 1px var(--bq-brand-border)', fontSize: 12.5, fontWeight: 600, color: 'var(--bq-bad)' }}>
      <BqIcon d="M12 8 V13 M12 16.2 V16.4 M12 3 L22 20 H2 Z" size={16} style={{ flex: 'none' }}></BqIcon>{err}
    </div>
  ) : null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '6px 26px 26px', overflow: 'auto', position: 'relative' }}>
      {/* mock incoming SMS with the verification code */}
      {step === 'verify' && smsIn ? (
        <button onClick={() => { setCode(sentCode); setErr(''); setSmsIn(false); }} style={{ position: 'absolute', top: 2, left: 10, right: 10, zIndex: 60, display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', borderRadius: 16, border: 'none', cursor: 'pointer', font: 'inherit', textAlign: 'left', background: 'var(--bq-ink)', color: 'var(--bq-page)', boxShadow: '0 10px 28px rgba(0,0,0,0.32)', animation: 'bqSmsIn 0.35s ease' }}>
          <span style={{ width: 34, height: 34, borderRadius: 9, flex: 'none', background: 'var(--bq-good)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={F_CHAT} size={18} style={{ color: '#fff' }}></BqIcon></span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.65 }}><span style={{ fontWeight: 700 }}>Messages</span><span>now</span></span>
            <span style={{ display: 'block', fontSize: 12.5, lineHeight: 1.35, marginTop: 1 }}>Your BuilderIQ Field code is <b>{sentCode}</b>. Tap to fill it in.</span>
          </span>
        </button>
      ) : null}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
        <FieldAuthSteps cur={step}></FieldAuthSteps>

        {step === 'signup' ? (
          <React.Fragment>
            <FieldAuthHeader title="Join your crew" sub="Your office sent you an invite. Set up your account to start capturing from the jobsite."></FieldAuthHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <div>
                <label style={labelStyle}>Full name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder={window.bqClean() ? 'e.g. Jane Smith' : 'Marco Diaz'} style={inputStyle}></input>
              </div>
              <div>
                <label style={labelStyle}>Mobile number</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 555-0123" style={inputStyle}></input>
              </div>
              <div>
                <label style={labelStyle}>Invite code <span style={{ fontWeight: 500, color: 'var(--bq-faint)' }}>· optional</span></label>
                <input value={invite} onChange={(e) => setInvite(e.target.value.toUpperCase())} placeholder={window.bqClean() ? 'CREW-CODE' : 'HARTWELL-CREW'} style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: 1 }}></input>
              </div>
              <div>
                <label style={labelStyle}>Choose a 4-digit PIN</label>
                <input type="tel" inputMode="numeric" maxLength={4} value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))} onKeyDown={(e) => { if (e.key === 'Enter') doSignup(); }} placeholder="••••" style={{ ...inputStyle, letterSpacing: 8, fontSize: 18 }}></input>
              </div>
              <button className="bq-btn primary" disabled={!signupReady || busy} onClick={doSignup} style={{ width: '100%', padding: 14, fontSize: 15, marginTop: 5, background: signupReady ? 'var(--bq-brand)' : 'var(--bq-border-strong)', color: '#fff', opacity: busy ? 0.7 : 1, cursor: signupReady && !busy ? 'pointer' : 'default', justifyContent: 'center' }}>
                {busy ? 'Creating account…' : 'Create account'}
              </button>
              <div style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--bq-muted)', marginTop: 2 }}>
                Already set up? <button style={linkStyle} onClick={() => { setErr(''); setStep('login'); }}>Sign in</button>
              </div>
            </div>
          </React.Fragment>
        ) : null}

        {step === 'verify' ? (
          <React.Fragment>
            <FieldAuthHeader title="Verify your number" sub={'We texted a 6-digit code to ' + (phone || 'your phone') + '. Enter it below.'}></FieldAuthHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              <div>
                <label style={labelStyle}>Verification code</label>
                <input type="tel" inputMode="numeric" maxLength={6} value={code} onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setErr(''); }} onKeyDown={(e) => { if (e.key === 'Enter') doVerify(); }} placeholder="••••••" style={{ ...inputStyle, letterSpacing: 10, fontSize: 20, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}></input>
              </div>
              {errBox}
              <button className="bq-btn primary" disabled={code.length !== 6 || busy} onClick={doVerify} style={{ width: '100%', padding: 14, fontSize: 15, marginTop: 2, background: code.length === 6 ? 'var(--bq-brand)' : 'var(--bq-border-strong)', color: '#fff', opacity: busy ? 0.7 : 1, cursor: code.length === 6 && !busy ? 'pointer' : 'default', justifyContent: 'center' }}>
                {busy ? 'Verifying…' : 'Verify'}
              </button>
              <div style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--bq-muted)', display: 'flex', justifyContent: 'center', gap: 14, marginTop: 2 }}>
                <button style={linkStyle} onClick={sendCode}>Resend code</button>
                <button style={{ ...linkStyle, color: 'var(--bq-muted)' }} onClick={() => { setErr(''); setSmsIn(false); setStep('signup'); }}>Wrong number?</button>
              </div>
            </div>
          </React.Fragment>
        ) : null}

        {step === 'login' ? (
          <React.Fragment>
            <FieldAuthHeader title={account ? 'Welcome back' + (account.name ? ', ' + account.name.trim().split(/\s+/)[0] : '') : 'Sign in'} sub="Sign in to see today's work, clock in, and capture from the jobsite."></FieldAuthHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {verified ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', borderRadius: 12, background: 'var(--bq-good-soft)', fontSize: 12.5, fontWeight: 600, color: 'var(--bq-good)' }}>
                  <BqIcon d={BQ_GLYPH.check} size={15} sw={2.6} style={{ flex: 'none' }}></BqIcon>Number verified - your account is ready. Sign in with your PIN.
                </div>
              ) : null}
              <div>
                <label style={labelStyle}>Mobile number</label>
                <input type="tel" value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} placeholder="(555) 555-0123" style={inputStyle}></input>
              </div>
              <div>
                <label style={labelStyle}>4-digit PIN</label>
                <input type="tel" inputMode="numeric" maxLength={4} value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, '').slice(0, 4)); setErr(''); }} onKeyDown={(e) => { if (e.key === 'Enter') doLogin(); }} placeholder="••••" style={{ ...inputStyle, letterSpacing: 8, fontSize: 18 }}></input>
              </div>
              {errBox}
              <button className="bq-btn primary" disabled={!loginReady || busy} onClick={doLogin} style={{ width: '100%', padding: 14, fontSize: 15, marginTop: 5, background: loginReady ? 'var(--bq-brand)' : 'var(--bq-border-strong)', color: '#fff', opacity: busy ? 0.7 : 1, cursor: loginReady && !busy ? 'pointer' : 'default', justifyContent: 'center' }}>
                {busy ? 'Signing in…' : 'Sign in'}
              </button>
              <div style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--bq-muted)', marginTop: 2 }}>
                New crew member? <button style={linkStyle} onClick={() => { setErr(''); setVerified(false); setStep('signup'); }}>Create account</button>
              </div>
            </div>
          </React.Fragment>
        ) : null}
      </div>
      <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--bq-faint)', lineHeight: 1.5, marginTop: 18 }}>Trouble signing in? Ask your office to resend your invite.<br></br>{worker.company} · BuilderIQ</div>
    </div>
  );
}

// ─────────────────────────────────────────── shell ───────────────────────────────────────────
function FieldShell() {
  const f = useField();
  const BODY = { home: FieldHome, time: FieldTime, log: FieldLog, logs: FieldLogs, co: FieldCO, receipt: FieldReceipt, photos: FieldPhotos, messages: FieldMessages, proj: FieldProjects, cal: FieldSchedule, ask: FieldAsk };
  const Cur = BODY[f.screen] || FieldHome;
  const startTime = React.useRef(fmtClock(Date.now())).current;
  const tabs = [['home', BQ_GLYPH.home, 'Today'], ['proj', BQ_GLYPH.projects, 'Projects'], ['__fab'], ['logs', BQ_GLYPH.log, 'Logs'], ['__more', BQ_GLYPH.task, 'More']];
  const moreActive = ['time', 'photos', 'messages', 'cal', 'receipt', 'co', 'log', 'ask'].includes(f.screen);

  return (
    <div style={{ width: '100%', height: '100%', background: '#26231E', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto', padding: 20 }}>
      <div style={{ width: 390, maxWidth: '100%', height: 800, maxHeight: '94vh', background: '#000', borderRadius: 46, padding: 11, boxShadow: '0 30px 70px rgba(0,0,0,0.5)', flex: 'none' }}>
        <div style={{ width: '100%', height: '100%', background: 'var(--bq-page)', borderRadius: 36, overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          {/* status bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 26px 6px', fontSize: 13, fontWeight: 700, color: 'var(--bq-ink)', flex: 'none' }}>
            <span style={{ whiteSpace: 'nowrap' }}>{startTime}</span>
            <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <BqIcon d={f.online ? F_WIFI : F_WIFI_OFF} size={14} style={{ color: f.online ? 'var(--bq-ink)' : 'var(--bq-bad)' }}></BqIcon>
              <span style={{ width: 22, height: 11, borderRadius: 3, boxShadow: 'inset 0 0 0 1.5px var(--bq-ink)', position: 'relative' }}><span style={{ position: 'absolute', inset: 2, right: 6, background: 'var(--bq-ink)', borderRadius: 1 }}></span></span>
            </span>
          </div>
          {/* app bar */}
          {!f.authed ? <FieldAuth></FieldAuth> : null}
          {f.authed ? (<React.Fragment>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '4px 18px 10px', flex: 'none' }}>
            <span className="bq-logomark" style={{ width: 26, height: 26 }}><BqIcon d={BQ_GLYPH.hammer} size={14} sw={1.8} style={{ color: '#fff' }}></BqIcon></span>
            <span className="bq-wordmark" style={{ fontSize: 15 }}>Builder<span className="iq">IQ</span></span>
            <span style={{ fontSize: 11, color: 'var(--bq-faint)', fontWeight: 600 }}>Field</span>
            <span style={{ flex: 1 }}></span>
            <button onClick={() => f.go('ask')} aria-label="Ask BuilderIQ" style={{ width: 30, height: 30, borderRadius: 9, flex: 'none', cursor: 'pointer', border: 'none', background: f.screen === 'ask' ? 'var(--bq-ai)' : 'var(--bq-ai-soft)', color: f.screen === 'ask' ? '#fff' : 'var(--bq-ai-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH.spark} size={16} sw={1.5}></BqIcon></button>
            <button onClick={() => f.openSheet('sync')} aria-label="Sync status" style={{ display: 'flex', alignItems: 'center', gap: 5, border: 'none', cursor: 'pointer', borderRadius: 999, padding: '4px 9px', font: 'inherit', background: f.online ? (f.pending ? 'var(--bq-ai-soft)' : 'var(--bq-subtle)') : 'var(--bq-brand-soft)', color: f.online ? (f.pending ? 'var(--bq-ai-strong)' : 'var(--bq-muted)') : 'var(--bq-bad)' }}>
              <BqIcon d={f.online ? F_WIFI : F_WIFI_OFF} size={14}></BqIcon>
              <span style={{ fontSize: 11.5, fontWeight: 700 }}>{f.online ? (f.pending ? f.pending : 'Synced') : 'Offline'}</span>
            </button>
            <button onClick={() => f.openSheet('account')} aria-label="Account" className="bq-avatar" style={{ width: 28, height: 28, fontSize: 11, border: 'none', cursor: 'pointer', background: 'var(--bq-subtle)', color: 'var(--bq-muted)', boxShadow: 'inset 0 0 0 1px var(--bq-border)' }}>{f.worker.initials}</button>
          </div>
          {/* body */}
          <div style={{ flex: 1, overflow: 'auto', padding: '4px 16px 92px' }}>
            <Cur></Cur>
          </div>

          {/* toast */}
          {f.toast ? (
            <div style={{ position: 'absolute', left: 16, right: 16, bottom: 92, zIndex: 55, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 14, background: 'var(--bq-ink)', color: 'var(--bq-page)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
              <BqIcon d={BQ_GLYPH.check} size={16} sw={2.2} style={{ color: 'var(--bq-good)', flex: 'none' }}></BqIcon>
              <span style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3 }}>{f.toast.msg}</span>
            </div>
          ) : null}

          {/* tab bar */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'var(--bq-card)', borderTop: '1px solid var(--bq-border)', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', padding: '8px 6px 20px', flex: 'none' }}>
            {tabs.map((t, i) => {
              if (t[0] === '__fab') return (
                <button key="fab" onClick={() => f.openSheet('capture')} aria-label="Capture" style={{ width: 52, height: 52, marginTop: -22, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'var(--bq-brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(249,115,22,0.4)', flex: 'none' }}>
                  <BqIcon d="M12 5 V19 M5 12 H19" size={24} sw={2.4}></BqIcon>
                </button>
              );
              const key = t[0];
              const on = key === '__more' ? moreActive : f.screen === key;
              return (
                <button key={key} onClick={() => key === '__more' ? f.openSheet('more') : f.go(key)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, border: 'none', background: 'none', cursor: 'pointer', minWidth: 56, padding: '4px 0', color: on ? 'var(--bq-brand-strong)' : 'var(--bq-faint)' }}>
                  <BqIcon d={t[1]} size={20}></BqIcon><span style={{ fontSize: 10.5, fontWeight: 600 }}>{t[2]}</span>
                </button>
              );
            })}
          </div>

          {/* sheets */}
          {f.sheet === 'capture' ? <CaptureSheet></CaptureSheet> : null}
          {f.sheet === 'sync' ? <SyncSheet></SyncSheet> : null}
          {f.sheet === 'more' ? <MoreSheet></MoreSheet> : null}
          {f.sheet === 'account' ? <FieldAccountSheet></FieldAccountSheet> : null}
          {f.sheet && f.sheet.type === 'task' ? <TaskSheet task={f.sheet.task}></TaskSheet> : null}
          </React.Fragment>) : null}
        </div>
      </div>
    </div>
  );
}

function HifiField() {
  return (
    <FieldProvider>
      <FieldShell></FieldShell>
    </FieldProvider>
  );
}
window.HifiField = HifiField;
