// BuilderIQ Sub app - standalone subcontractor portal (scoped: tasks, schedule, files, messages; NO financials)
const SUB_TABS = [
  ['Home', 'home'], ['Tasks', 'task'], ['Schedule', 'cal'], ['Quotes', 'quotes'], ['Payments', 'pay'], ['Docs', 'warranty'], ['Files', 'photo'], ['Messages', 'inbox'],
];

const SUB_TASKS0 = [
  { id: 't1', t: 'Quote cloth-wiring remediation', proj: 'Henderson - Kitchen + Hall Bath', due: 'Jun 14', pr: 'High', done: false, sub: '1/2' },
  { id: 't2', t: 'Shoring removal', proj: 'Henderson - Kitchen + Hall Bath', due: 'Jun 12', pr: 'Med', done: false, sub: '' },
  { id: 't3', t: 'Frame primary suite walls', proj: 'Osorio - Whole-home remodel', due: 'Jun 20', pr: 'Med', done: false, sub: '0/4' },
  { id: 't4', t: 'Beam install - kitchen opening', proj: 'Henderson - Kitchen + Hall Bath', due: 'Jun 11', pr: 'High', done: true, sub: '3/3' },
  { id: 't5', t: 'Re-inspection prep - framing', proj: 'Osorio - Whole-home remodel', due: 'Jun 9', pr: 'Med', done: true, sub: '' },
];
const SUB_SCHED = [
  { t: 'Shoring removal', date: 'Thu · Jun 12', who: 'You', proj: 'Henderson' },
  { t: 'Framing re-inspection', date: 'Wed · Jun 18', who: 'You + City', proj: 'Osorio' },
  { t: 'Primary suite framing - start', date: 'Mon · Jun 23', who: 'You + 1 crew', proj: 'Osorio' },
  { t: 'Primary suite framing - finish', date: 'Fri · Jun 27', who: 'You + 1 crew', proj: 'Osorio' },
];
const SUB_FILES = [
  ['Beam spec - LVL', 'plan'], ['Henderson framing plan', 'plan'], ['Osorio elevations', 'plan'],
  ['Site photo - opening', 'photo'], ['Site photo - wall layout', 'photo'], ['Permit card', 'punch'],
];
const SUB_THREAD0 = [
  { from: 'them', who: 'Maria H.', t: 'Wed 11:02 AM', body: 'Can you get me a material list for the cloth-wiring remediation by Friday so we can write the change order?' },
  { from: 'me', t: 'Wed 11:20 AM', body: "Will do - I'll walk it tomorrow AM and send quantities by EOD Thursday." },
  { from: 'them', who: 'Maria H.', t: 'Wed 11:24 AM', body: 'Perfect, thanks. Shoring can come out Thursday once the beam is fully fastened.' },
];

// ── Home ──
function SubHome({ go }) {
  const open = SUB_TASKS0.filter((t) => !t.done);
  return (
    <div className="cl-wrap">
      <section className="bq-card-s" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="cl-eyebrow">Subcontractor portal</div>
            <div className="cl-h" style={{ fontSize: 27, lineHeight: 1.1, marginTop: 2 }}>Welcome, Vargas Framing</div>
            <div style={{ fontSize: 13.5, color: 'var(--bq-muted)', marginTop: 3 }}>2 active jobs with Hartwell Builders · {open.length} open tasks</div>
          </div>
          <span className="bq-chip"><BqIcon d={BQ_GLYPH.hardhat} size={12}></BqIcon>Framing / structural</span>
        </div>
        <SubScopeNote></SubScopeNote>
      </section>

      <div>
        <div className="cl-eyebrow" style={{ marginBottom: 9 }}>Needs you</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
          <button className="cl-action" onClick={() => go('Tasks')}>
            <span className="ic" style={{ background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)' }}><BqIcon d={BQ_GLYPH.task} size={20}></BqIcon></span>
            <span style={{ flex: 1 }}><span style={{ display: 'block', fontWeight: 700, fontSize: 14 }}>Quote cloth-wiring remediation</span><span style={{ display: 'block', fontSize: 12.5, color: 'var(--bq-muted)' }}>Henderson · due Jun 14</span></span>
            <BqIcon d="M9 6 L15 12 L9 18" size={16} style={{ color: 'var(--bq-faint)' }}></BqIcon>
          </button>
          <button className="cl-action" onClick={() => go('Schedule')}>
            <span className="ic" style={{ background: 'var(--bq-subtle)', color: 'var(--bq-muted)' }}><BqIcon d={BQ_GLYPH.cal} size={20}></BqIcon></span>
            <span style={{ flex: 1 }}><span style={{ display: 'block', fontWeight: 700, fontSize: 14 }}>Shoring removal</span><span style={{ display: 'block', fontSize: 12.5, color: 'var(--bq-muted)' }}>On site Thursday Jun 12</span></span>
            <BqIcon d="M9 6 L15 12 L9 18" size={16} style={{ color: 'var(--bq-faint)' }}></BqIcon>
          </button>
          <button className="cl-action" onClick={() => go('Messages')}>
            <span className="ic" style={{ background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)' }}><BqIcon d={BQ_GLYPH.inbox} size={20}></BqIcon></span>
            <span style={{ flex: 1 }}><span style={{ display: 'block', fontWeight: 700, fontSize: 14 }}>Maria needs a material list</span><span style={{ display: 'block', fontSize: 12.5, color: 'var(--bq-muted)' }}>For the change order · by Friday</span></span>
            <BqIcon d="M9 6 L15 12 L9 18" size={16} style={{ color: 'var(--bq-faint)' }}></BqIcon>
          </button>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 9 }}>
          <span className="cl-eyebrow">Up next on site</span>
          <button className="bq-btn ghost sm" style={{ marginLeft: 'auto' }} onClick={() => go('Schedule')}>Full schedule</button>
        </div>
        <div className="bq-card-s" style={{ overflow: 'hidden' }}>
          {SUB_SCHED.slice(0, 3).map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
              <span style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={BQ_GLYPH.cal} size={18}></BqIcon></span>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 14 }}>{s.t}</div><div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{s.proj} · {s.who}</div></div>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--bq-muted)' }}>{s.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Tasks ──
function SubTasks({ flash }) {
  const storeList = window.bqUseNewClients ? window.bqUseNewClients() : [];
  const hbTasks = window.bqProj ? window.bqProj.subTasks() : [];
  const hasCustom = window.bqProj && window.bqProj.actives().length > 0;
  const [tasks, setTasks] = window.bqPersistState(hasCustom ? 'sub-tasks-live' : 'sub-tasks', hasCustom ? [] : SUB_TASKS0);
  const [filter, setFilter] = React.useState('Open');
  const [active, setActive] = React.useState(null);
  const [rfi, setRfi] = React.useState(null);
  const toggle = (id) => setTasks((ts) => ts.map((t) => {
    if (t.id !== id) return t;
    const nd = !t.done;
    if (nd) window.bqLogEvent && window.bqLogEvent('sub', { g: 'check', tone: 'good', body: 'Completed task: ' + t.t, change: 'Completed: ' + t.t });
    return { ...t, done: nd };
  }));
  const shown = tasks.filter((t) => filter === 'All' ? true : filter === 'Open' ? !t.done : t.done);
  const shownHb = hbTasks.filter((t) => filter === 'All' ? true : filter === 'Open' ? !t.done : t.done);
  const toggleHb = (tk) => {
    if (!tk.done) window.bqLogEvent && window.bqLogEvent('sub', { g: 'check', tone: 'good', body: 'Completed task: ' + tk.t + ' (' + tk.proj + ')', change: 'Completed: ' + tk.t });
    window.bqProj.toggleTask(tk.projectId, tk.idx);
  };
  const FILTERS = ['Open', 'Done', 'All'];

  return (
    <div className="cl-wrap">
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div className="cl-h" style={{ fontSize: 26 }}>My tasks</div>
          <div style={{ color: 'var(--bq-muted)' }}>Assignments from Hartwell Builders across your active jobs.</div>
        </div>
        <div className="seg-toggle">
          {FILTERS.map((f) => <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>{f}</button>)}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {shown.map((tk) => (
          <div key={tk.id} className="bq-card-s" role="button" tabIndex={0} onClick={() => setActive(tk)} style={{ padding: '14px 17px', display: 'flex', alignItems: 'center', gap: 13, cursor: 'pointer' }}>
            <button onClick={(e) => { e.stopPropagation(); toggle(tk.id); }} aria-label="toggle done" style={{ width: 24, height: 24, borderRadius: 8, flex: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: tk.done ? 'var(--bq-good)' : 'var(--bq-card)', boxShadow: tk.done ? 'none' : 'inset 0 0 0 1.5px var(--bq-border-strong)' }}>{tk.done ? <BqIcon d={BQ_GLYPH.check} size={13} sw={2.6} style={{ color: '#fff' }}></BqIcon> : null}</button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: tk.done ? 'var(--bq-faint)' : 'var(--bq-ink)', textDecoration: tk.done ? 'line-through' : 'none' }}>{tk.t}</div>
              <div style={{ fontSize: 12.5, color: 'var(--bq-faint)', display: 'flex', gap: 8, flexWrap: 'wrap' }}><span>{tk.proj}</span>{tk.sub ? <span>· {tk.sub} subtasks</span> : null}</div>
            </div>
            {tk.pr === 'High' && !tk.done ? <span className="bq-chip brand">High</span> : null}
            <span style={{ fontSize: 12.5, fontWeight: 600, color: !tk.done && (tk.due === 'Jun 12' || tk.due === 'Jun 14') ? 'var(--bq-brand-strong)' : 'var(--bq-faint)' }}>{tk.due}</span>
            <BqIcon d="M9 6 L15 12 L9 18" size={15} style={{ color: 'var(--bq-faint)', flex: 'none' }}></BqIcon>
          </div>
        ))}
        {shownHb.map((tk) => (
          <div key={'hb' + tk.projectId + tk.idx} className="bq-card-s" style={{ padding: '14px 17px', display: 'flex', alignItems: 'center', gap: 13 }}>
            <button onClick={() => toggleHb(tk)} aria-label="toggle done" style={{ width: 24, height: 24, borderRadius: 8, flex: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: tk.done ? 'var(--bq-good)' : 'var(--bq-card)', boxShadow: tk.done ? 'none' : 'inset 0 0 0 1.5px var(--bq-border-strong)' }}>{tk.done ? <BqIcon d={BQ_GLYPH.check} size={13} sw={2.6} style={{ color: '#fff' }}></BqIcon> : null}</button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: tk.done ? 'var(--bq-faint)' : 'var(--bq-ink)', textDecoration: tk.done ? 'line-through' : 'none' }}>{tk.t}</div>
              <div style={{ fontSize: 12.5, color: 'var(--bq-faint)' }}>{tk.proj} · assigned by Hartwell</div>
            </div>
            {!tk.done ? <span className="bq-chip ai">New</span> : null}
          </div>
        ))}
        {!shown.length && !shownHb.length ? <div style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--bq-faint)', padding: '30px 0' }}>Nothing here - nice work.</div> : null}
      </div>
      {active ? <SubTaskModal task={active} onClose={() => setActive(null)} onToggleDone={toggle} onAskQuestion={(t) => { setActive(null); setRfi('A task'); }}></SubTaskModal> : null}
      {rfi ? <SubRFIModal context={rfi} onClose={() => setRfi(null)} flash={flash}></SubRFIModal> : null}
    </div>
  );
}

// ── Schedule ──
function SubSchedule() {
  return (
    <div className="cl-wrap">
      <div>
        <div className="cl-h" style={{ fontSize: 26 }}>My schedule</div>
        <div style={{ color: 'var(--bq-muted)' }}>Just your dates. We'll text you if anything moves.</div>
      </div>
      <div className="bq-card-s" style={{ overflow: 'hidden' }}>
        {SUB_SCHED.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '15px 18px', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
            <div style={{ width: 56, textAlign: 'center', flex: 'none' }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--bq-faint)', textTransform: 'uppercase' }}>{s.date.split(' · ')[0]}</div>
              <div className="bq-num" style={{ fontSize: 19 }}>{s.date.split(' ').pop()}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14.5 }}>{s.t}</div>
              <div style={{ fontSize: 12.5, color: 'var(--bq-faint)' }}>{s.proj} · {s.who}</div>
            </div>
            <span className="bq-chip">{s.proj}</span>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--bq-faint)' }}>Add to your calendar - <span style={{ color: 'var(--bq-brand-strong)', fontWeight: 600, cursor: 'pointer' }}>download .ics feed</span></div>
    </div>
  );
}

// ── Files ──
function SubFiles({ flash }) {
  const [uploads, setUploads] = React.useState([]);
  const [rfi, setRfi] = React.useState(false);
  const ref = React.useRef(null);
  const pick = (e) => {
    const files = Array.from(e.target.files || []); e.target.value = '';
    files.forEach((file) => { const r = new FileReader(); r.onload = () => { setUploads((u) => [{ url: /^image\//.test(file.type) ? r.result : null, name: file.name, g: /^image\//.test(file.type) ? 'photo' : 'docs' }, ...u]); }; if (/^image\//.test(file.type)) r.readAsDataURL(file); else { setUploads((u) => [{ url: null, name: file.name, g: 'docs' }, ...u]); } });
    if (files.length) { flash(files.length + ' file' + (files.length > 1 ? 's' : '') + ' uploaded'); window.bqLogEvent && window.bqLogEvent('sub', { g: 'photo', tone: 'ai', body: 'Uploaded ' + files.length + ' file(s)', change: 'Sub uploaded files' }); }
  };
  return (
    <div className="cl-wrap">
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div className="cl-h" style={{ fontSize: 26 }}>Files &amp; photos</div>
          <div style={{ color: 'var(--bq-muted)' }}>Plans and specs shared with you - plus photos you upload from the field.</div>
        </div>
        <button className="bq-btn ghost sm" onClick={() => setRfi(true)}><BqIcon d={BQ_GLYPH.inbox} size={14}></BqIcon>Ask about a plan</button>
        <button className="bq-btn primary sm" onClick={() => ref.current && ref.current.click()}><BqIcon d={BQ_GLYPH.camera} size={14}></BqIcon>Upload</button>
        <input ref={ref} type="file" accept="image/*,application/pdf" multiple onChange={pick} style={{ display: 'none' }}></input>
      </div>
      {uploads.length ? (
        <div>
          <div className="cl-eyebrow" style={{ marginBottom: 9 }}>Your uploads</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12 }}>
            {uploads.map((u, i) => (
              <div key={i} className="bq-card-s" style={{ overflow: 'hidden' }}>
                {u.url ? <img src={u.url} alt={u.name} style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }}></img> : <div className="cl-pad" style={{ height: 120, borderRadius: 0 }}><BqIcon d={BQ_GLYPH.docs} size={20}></BqIcon></div>}
                <div style={{ padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</span>
                  <span className="bq-chip good" style={{ flex: 'none' }}>Uploaded</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      <div>
        <div className="cl-eyebrow" style={{ marginBottom: 9 }}>Shared with you</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12 }}>
          {SUB_FILES.map(([name, g], i) => (
            <div key={i} className="bq-card-s" style={{ overflow: 'hidden' }}>
              <div className="cl-pad" style={{ height: 120, borderRadius: 0 }}><BqIcon d={BQ_GLYPH[g]} size={20}></BqIcon></div>
              <div style={{ padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
                <BqIcon d={BQ_GLYPH.exports} size={15} style={{ color: 'var(--bq-faint)', flex: 'none' }}></BqIcon>
              </div>
            </div>
          ))}
        </div>
      </div>
      {rfi ? <SubRFIModal context="A plan or spec" onClose={() => setRfi(false)} flash={flash}></SubRFIModal> : null}
    </div>
  );
}

// ── Messages ──
function SubMessages() {
  const [msgs, setMsgs] = window.bqPersistState('sub-msgs', SUB_THREAD0);
  const [text, setText] = React.useState('');
  const endRef = React.useRef(null);
  React.useEffect(() => { if (endRef.current) endRef.current.scrollTop = endRef.current.scrollHeight; }, [msgs]);
  const send = () => {
    const v = text.trim(); if (!v) return;
    setMsgs((m) => [...m, { from: 'me', t: 'Now', body: v }]); setText('');
    window.bqLogEvent && window.bqLogEvent('sub', { g: 'inbox', tone: 'ai', body: 'Replied: “' + v + '”', change: 'New reply from the sub' });
    setTimeout(() => setMsgs((m) => [...m, { from: 'them', who: 'Maria H.', t: 'Now', body: 'Got it - thanks. I\'ll flag it on the project.' }]), 1100);
  };
  return (
    <div className="cl-wrap" style={{ height: '100%', boxSizing: 'border-box' }}>
      <div>
        <div className="cl-h" style={{ fontSize: 26 }}>Messages</div>
        <div style={{ color: 'var(--bq-muted)' }}>Your thread with the Hartwell Builders team.</div>
      </div>
      <div className="bq-card-s" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 360 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 18px', borderBottom: '1px solid var(--bq-border)' }}>
          <span className="cl-avatar" style={{ background: 'var(--bq-ink)', color: '#fff', boxShadow: 'none' }}>MH</span>
          <div><div style={{ fontWeight: 700, fontSize: 14 }}>Maria H. · Hartwell Builders</div><div style={{ fontSize: 12, color: 'var(--bq-good)', fontWeight: 600 }}>● Project coordinator</div></div>
        </div>
        <div ref={endRef} style={{ flex: 1, overflow: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {msgs.map((m, i) => (
            <div key={i} className={'cl-bubble ' + m.from}>{m.body}<div className="meta">{m.from === 'them' ? (m.who + ' · ') : ''}{m.t}</div></div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 9, padding: '12px 16px', borderTop: '1px solid var(--bq-border)' }}>
          <input className="cl-field" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} placeholder="Message the team…"></input>
          <button className="bq-btn primary" onClick={send} style={{ flex: 'none' }}>Send</button>
        </div>
      </div>
    </div>
  );
}

// ── shell ──
const SUB_BADGES = { Tasks: 2, Quotes: 1, Docs: 1, Messages: 1 };
function SubApp() {
  const [tab, setTab] = React.useState(() => { try { return localStorage.getItem(window.bqNsKey('bq-sub-tab')) || 'Home'; } catch (e) { return 'Home'; } });
  const [toast, setToast] = React.useState(null);
  const [bell, setBell] = React.useState(false);
  const [acctMenu, setAcctMenu] = React.useState(false);
  const [acctModal, setAcctModal] = React.useState(false);
  const [askRfi, setAskRfi] = React.useState(false);
  const [notifs, setNotifs] = React.useState(SUB_NOTIFS0);
  const flash = React.useCallback((m) => { setToast(m); window.clearTimeout(flash._t); flash._t = window.setTimeout(() => setToast(null), 2400); }, []);
  const go = React.useCallback((t) => {
    setTab(t);
    try { localStorage.setItem(window.bqNsKey('bq-sub-tab'), t); } catch (e) {}
    const m = document.querySelector('.cl-main'); if (m) m.scrollTop = 0;
  }, []);
  const unread = notifs.filter((n) => n.unread).length;
  const SECTIONS = { Home: SubHome, Tasks: SubTasks, Schedule: SubSchedule, Quotes: SubQuotes, Payments: SubPayments, Docs: SubDocuments, Files: SubFiles, Messages: SubMessages, Profile: SubProfile };
  const Cur = SECTIONS[tab] || SubHome;

  if (window.bqClean()) {
    return (
      <div className="cl-shell bq-root">
        <header className="cl-header">
          <span className="cl-brandmark"><BqIcon d={BQ_GLYPH.hammer} size={18} sw={1.8} style={{ color: '#fff' }}></BqIcon></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="cl-brandname">Solid Remodel</div>
            <div className="cl-headproj">Subcontractor access</div>
          </div>
          <span style={{ fontSize: 11, color: 'var(--bq-faint)', display: 'flex', alignItems: 'center', gap: 5 }}><BqSpark size={11}></BqSpark>Powered by BuilderIQ</span>
        </header>
        <main className="cl-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BqEmpty icon={BQ_GLYPH.hammer} title="No work assigned yet" sub="When Solid Remodel invites you to a job, your tasks, schedule, shared plan files, and payments will appear here." full></BqEmpty>
        </main>
      </div>
    );
  }

  return (
    <div className="cl-shell bq-root">
      <header className="cl-header">
        <span className="cl-brandmark"><BqIcon d={BQ_GLYPH.hammer} size={18} sw={1.8} style={{ color: '#fff' }}></BqIcon></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="cl-brandname">Hartwell Builders</div>
          <div className="cl-headproj">Subcontractor access · Vargas Framing</div>
        </div>
        <span style={{ fontSize: 11, color: 'var(--bq-faint)', display: 'flex', alignItems: 'center', gap: 5 }}><BqSpark size={11}></BqSpark>Powered by BuilderIQ</span>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setBell((b) => !b)} aria-label="Notifications" style={{ width: 38, height: 38, borderRadius: 10, border: 'none', cursor: 'pointer', background: bell ? 'var(--bq-subtle)' : 'transparent', color: 'var(--bq-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <BqIcon d={BQ_GLYPH.bell} size={19}></BqIcon>
            {unread ? <span style={{ position: 'absolute', top: 6, right: 7, minWidth: 15, height: 15, padding: '0 4px', borderRadius: 999, background: 'var(--bq-brand)', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 2px var(--bq-card)' }}>{unread}</span> : null}
          </button>
          {bell ? <SubNotifPanel notifs={notifs} onClose={() => setBell(false)} onReadAll={() => setNotifs((ns) => ns.map((n) => ({ ...n, unread: false })))} onGo={(n) => { setNotifs((ns) => ns.map((x) => x === n ? { ...x, unread: false } : x)); setBell(false); go(n.go); }}></SubNotifPanel> : null}
        </div>
        <button onClick={() => go('Profile')} aria-label="Company profile" title="Company profile" style={{ width: 34, height: 34, borderRadius: 10, border: 'none', cursor: 'pointer', background: tab === 'Profile' ? 'var(--bq-subtle)' : 'transparent', color: 'var(--bq-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bq-subtle)'} onMouseLeave={(e) => { if (tab !== 'Profile') e.currentTarget.style.background = 'transparent'; }}>
          <BqIcon d={BQ_GLYPH.partners} size={18}></BqIcon>
        </button>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setAcctMenu((m) => !m)} aria-label="Account" style={{ border: 'none', cursor: 'pointer', padding: 0, background: 'transparent', borderRadius: '50%', display: 'flex', boxShadow: acctMenu ? '0 0 0 2px var(--bq-brand)' : 'none' }}>
            <SubAvatar size={36}></SubAvatar>
          </button>
          {acctMenu ? <SubAccountMenu onClose={() => setAcctMenu(false)} go={go} onProfile={() => setAcctModal(true)} flash={flash}></SubAccountMenu> : null}
        </div>
      </header>
      <nav className="cl-nav">
        {SUB_TABS.map(([name, g]) => (
          <button key={name} className={'cl-tab' + (tab === name ? ' on' : '')} onClick={() => go(name)}>
            <BqIcon d={BQ_GLYPH[g]} size={16}></BqIcon><span>{name}</span>
            {SUB_BADGES[name] ? <span className="dot">{SUB_BADGES[name]}</span> : null}
          </button>
        ))}
      </nav>
      <main className="cl-main"><Cur go={go} flash={flash}></Cur></main>
      <SubAssistant go={go} onRFI={() => setAskRfi(true)}></SubAssistant>
      {askRfi ? <SubRFIModal context="General question" onClose={() => setAskRfi(false)} flash={flash}></SubRFIModal> : null}
      {acctModal ? <SubAccountModal onClose={() => setAcctModal(false)} flash={flash}></SubAccountModal> : null}
      {toast ? (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 200, background: 'var(--bq-ink)', color: '#fff', borderRadius: 10, padding: '11px 16px', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 9, boxShadow: '0 8px 24px rgba(38,35,30,0.35)' }}>
          <BqIcon d={BQ_GLYPH.check} size={15} sw={2.4} style={{ color: 'var(--bq-good)' }}></BqIcon>{toast}
        </div>
      ) : null}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<SubApp></SubApp>);
