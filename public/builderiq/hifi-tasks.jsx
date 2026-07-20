// Hi-fi Tasks - Kanban + list, filters, subtasks/checklist, links to schedule/CO/selection
const TASKS = [
  { id: 1, t: 'Confirm cabinet delivery window', proj: 'Henderson', who: 'MR', assignee: 'Mike R.', due: 'Jun 12', pr: 'High', status: 'todo', cv: false, link: { type: 'Schedule', label: 'Cabinets set' }, sub: [['Call Wellborn rep', true], ['Update schedule', false]], cmt: 2 },
  { id: 2, t: 'Send hall-bath tile options to client', proj: 'Henderson', who: 'MH', assignee: 'Maria H.', due: 'Jun 13', pr: 'High', status: 'todo', cv: true, link: { type: 'Selection', label: 'Floor + shower tile' }, sub: [], cmt: 0 },
  { id: 3, t: 'Order induction range + hood', proj: 'Henderson', who: 'MH', assignee: 'Maria H.', due: 'Jun 16', pr: 'Med', status: 'todo', cv: false, link: { type: 'Selection', label: 'Appliances' }, sub: [['Confirm model', false], ['PO to AJ Madison', false]], cmt: 0 },
  { id: 4, t: 'Quote cloth-wiring remediation', proj: 'Henderson', who: 'BE', assignee: 'Bright Electric', due: 'Jun 14', pr: 'High', status: 'doing', cv: false, link: { type: 'Change Order', label: 'CO-003 draft' }, sub: [['Site walk', true], ['Material list', false]], cmt: 1 },
  { id: 5, t: 'Remove temporary shoring', proj: 'Henderson', who: 'MR', assignee: 'Mike R.', due: 'Jun 12', pr: 'Med', status: 'doing', cv: false, link: null, sub: [], cmt: 0 },
  { id: 6, t: 'Schedule framing re-inspection', proj: 'Osorio', who: 'MR', assignee: 'Mike R.', due: 'Jun 18', pr: 'Low', status: 'doing', cv: false, link: { type: 'Schedule', label: 'Framing insp.' }, sub: [], cmt: 0 },
  { id: 7, t: 'Beam set & framing inspection', proj: 'Henderson', who: 'MR', assignee: 'Mike R.', due: 'Jun 11', pr: 'High', status: 'done', cv: true, link: null, sub: [['Shoring', true], ['Beam', true], ['Inspect', true]], cmt: 3 },
  { id: 8, t: 'Approve cabinet hardware selection', proj: 'Henderson', who: 'MH', assignee: 'Maria H.', due: 'Jun 10', pr: 'Med', status: 'done', cv: true, link: { type: 'Selection', label: 'Pulls + knobs' }, sub: [], cmt: 0 },
];
const TK_COLS = [['todo', 'To do'], ['doing', 'In progress'], ['done', 'Done']];
const TK_PR = { High: 'brand', Med: 'muted', Low: 'muted' };
const TK_LINK_G = { Schedule: 'cal', Selection: 'select', 'Change Order': 'co' };

function TaskCard({ tk, onClick }) {
  const subDone = tk.sub.filter((s) => s[1]).length;
  return (
    <div onClick={onClick} className="bq-card-s" style={{ padding: '12px 13px', display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer', boxShadow: 'inset 0 0 0 1px var(--bq-border)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: tk.status === 'done' ? 'var(--bq-faint)' : 'var(--bq-ink)', textDecoration: tk.status === 'done' ? 'line-through' : 'none', lineHeight: 1.35, flex: 1 }}>{tk.t}</span>
        {tk.pr === 'High' && tk.status !== 'done' ? <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--bq-brand)', flex: 'none', marginTop: 5 }}></span> : null}
      </div>
      {tk.link ? <span className="bq-chip" style={{ alignSelf: 'flex-start' }}><BqIcon d={BQ_GLYPH[TK_LINK_G[tk.link.type]]} size={11}></BqIcon>{tk.link.label}</span> : null}
      {tk.sub.length ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--bq-faint)' }}>
          <BqIcon d={BQ_GLYPH.task} size={12}></BqIcon>{subDone}/{tk.sub.length} subtasks
        </div>
      ) : null}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--bq-subtle)', color: 'var(--bq-muted)', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 1px var(--bq-border)' }}>{tk.who}</span>
        <span style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>{tk.proj}</span>
        <span style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 600, color: tk.status !== 'done' && (tk.due === 'Jun 12' || tk.due === 'Jun 11' || tk.due === 'Jun 10') ? 'var(--bq-brand-strong)' : 'var(--bq-faint)' }}>{tk.due}</span>
        {tk.cv ? <BqIcon d="M2 12 s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7 Z M12 15 a3 3 0 1 0 0-6 a3 3 0 0 0 0 6 Z" size={12} style={{ color: 'var(--bq-faint)' }}></BqIcon> : null}
      </div>
    </div>
  );
}

function HifiTasks() {
  const [view, setView] = React.useState('kanban');
  const [filter, setFilter] = React.useState('All');
  const [open, setOpen] = React.useState(null);
  const FILTERS = ['All', 'My tasks', 'Overdue', 'Due this week', 'Client-visible'];
  const match = (tk) => {
    if (filter === 'My tasks') return tk.assignee === 'Maria H.';
    if (filter === 'Overdue') return tk.status !== 'done' && ['Jun 10', 'Jun 11', 'Jun 12'].includes(tk.due);
    if (filter === 'Due this week') return tk.status !== 'done';
    if (filter === 'Client-visible') return tk.cv;
    return true;
  };
  const shown = TASKS.filter(match);

  return (
    <div className="bq-screen">
      <BqTop crumb="Tasks"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Tasks" alerts={{ Tasks: 3 }}></BqSide>
        <main style={{ flex: 1, overflow: 'hidden', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(12px * var(--bq-sp))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 'none' }}>
            <div style={{ flex: 1 }}>
              <div className="bq-display" style={{ fontSize: 22 }}>Tasks</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Across active projects · 3 due today</div>
            </div>
            <div className="seg-toggle">
              <button className={view === 'kanban' ? 'on' : ''} onClick={() => setView('kanban')}>Board</button>
              <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')}>List</button>
            </div>
            <button className="bq-btn primary sm"><BqIcon d="M12 5 V19 M5 12 H19" size={14}></BqIcon>New task</button>
          </div>

          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', flex: 'none' }}>
            {FILTERS.map((f) => (
              <button key={f} className={'bq-chip' + (filter === f ? ' brand' : '')} onClick={() => setFilter(f)} style={{ cursor: 'pointer', border: 'none', font: 'inherit', fontWeight: 600 }}>{f}</button>
            ))}
          </div>

          {view === 'kanban' ? (
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'calc(12px * var(--bq-sp))', overflow: 'hidden', minHeight: 0 }}>
              {TK_COLS.map(([key, label]) => {
                const col = shown.filter((tk) => tk.status === key);
                return (
                  <div key={key} style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '0 4px 10px', flex: 'none' }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--bq-ink)', whiteSpace: 'nowrap' }}>{label}</span>
                      <span className="bq-chip">{col.length}</span>
                    </div>
                    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 9, padding: '2px 2px 8px', background: 'var(--bq-subtle)', borderRadius: 14 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, padding: 8 }}>
                        {col.map((tk) => <TaskCard key={tk.id} tk={tk} onClick={() => setOpen(tk)}></TaskCard>)}
                        {!col.length ? <div style={{ fontSize: 12, color: 'var(--bq-faint)', textAlign: 'center', padding: 14 }}>Nothing here</div> : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bq-card-s" style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
              <div className="bq-trow head" style={{ gridTemplateColumns: '2fr 1fr auto auto auto' }}>
                <span>Task</span><span>Project</span><span>Assignee</span><span>Due</span><span>Status</span>
              </div>
              {shown.map((tk) => (
                <div key={tk.id} onClick={() => setOpen(tk)} className="bq-trow" style={{ gridTemplateColumns: '2fr 1fr auto auto auto', cursor: 'pointer' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {tk.pr === 'High' && tk.status !== 'done' ? <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--bq-brand)', flex: 'none' }}></span> : null}
                    <span style={{ color: tk.status === 'done' ? 'var(--bq-faint)' : 'var(--bq-ink)', textDecoration: tk.status === 'done' ? 'line-through' : 'none' }}>{tk.t}</span>
                    {tk.cv ? <span className="bq-chip" style={{ padding: '0 7px' }}>Client</span> : null}
                  </span>
                  <span style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{tk.proj}</span>
                  <span style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{tk.assignee}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: tk.status !== 'done' && ['Jun 10', 'Jun 11', 'Jun 12'].includes(tk.due) ? 'var(--bq-brand-strong)' : 'var(--bq-faint)' }}>{tk.due}</span>
                  <span className={'bq-chip ' + (tk.status === 'done' ? 'good' : tk.status === 'doing' ? 'ai' : 'muted')}>{tk.status === 'done' ? 'Done' : tk.status === 'doing' ? 'In progress' : 'To do'}</span>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {open ? (
        <div onClick={() => setOpen(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(38,35,30,0.35)', display: 'flex', justifyContent: 'flex-end', zIndex: 30 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(420px, 92%)', height: '100%', background: 'var(--bq-card)', boxShadow: '-8px 0 32px rgba(0,0,0,0.12)', padding: '22px 24px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <span className={'bq-chip ' + (TK_PR[open.pr])}>{open.pr} priority</span>
              {open.cv ? <span className="bq-chip">Client-visible</span> : <span className="bq-chip">Internal</span>}
              <button onClick={() => setOpen(null)} className="bq-btn ghost sm" style={{ marginLeft: 'auto', padding: 6 }}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={16}></BqIcon></button>
            </div>
            <div className="bq-display" style={{ fontSize: 20 }}>{open.t}</div>
            <div style={{ display: 'flex', gap: 18, fontSize: 13, color: 'var(--bq-muted)' }}>
              <span>Assignee <b style={{ color: 'var(--bq-ink)' }}>{open.assignee}</b></span>
              <span>Due <b style={{ color: 'var(--bq-ink)' }}>{open.due}</b></span>
            </div>
            {open.link ? (
              <div onClick={() => window.__bqNav && window.__bqNav(open.link.type === 'Selection' ? 'Selections' : open.link.type === 'Schedule' ? 'Schedule' : 'Change Orders')} className="bq-card-s" style={{ padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', boxShadow: 'inset 0 0 0 1px var(--bq-border)' }}>
                <BqIcon d={BQ_GLYPH[TK_LINK_G[open.link.type]]} size={16} style={{ color: 'var(--bq-ai-strong)' }}></BqIcon>
                <span style={{ fontSize: 13 }}>Linked {open.link.type}: <b>{open.link.label}</b></span>
                <BqIcon d="M9 5 L16 12 L9 19" size={14} style={{ marginLeft: 'auto', color: 'var(--bq-faint)' }}></BqIcon>
              </div>
            ) : null}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 8 }}>Checklist {open.sub.length ? '· ' + open.sub.filter((s) => s[1]).length + '/' + open.sub.length : ''}</div>
              {open.sub.length ? open.sub.map(([label, d], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 0' }}>
                  <span style={{ width: 18, height: 18, borderRadius: 6, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: d ? 'var(--bq-good)' : '#fff', boxShadow: d ? 'none' : 'inset 0 0 0 1.5px var(--bq-border-strong)' }}>{d ? <BqIcon d={BQ_GLYPH.check} size={11} sw={2.6} style={{ color: '#fff' }}></BqIcon> : null}</span>
                  <span style={{ fontSize: 13, color: d ? 'var(--bq-faint)' : 'var(--bq-ink)', textDecoration: d ? 'line-through' : 'none' }}>{label}</span>
                </div>
              )) : <div style={{ fontSize: 13, color: 'var(--bq-faint)' }}>No subtasks yet.</div>}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 8 }}>Attachments</div>
              <div style={{ display: 'flex', gap: 8 }}><BqPh h={60} label="" style={{ flex: 1 }}></BqPh><BqPh h={60} label="" style={{ flex: 1 }}></BqPh></div>
            </div>
            <div style={{ marginTop: 'auto' }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 8 }}>Comments ({open.cmt})</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input placeholder="Add a comment…" style={{ flex: 1, font: 'inherit', fontSize: 13, padding: '9px 12px', borderRadius: 10, border: '1px solid var(--bq-border)', background: 'var(--bq-subtle)' }}></input>
                <button className="bq-btn sm">Post</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
window.HifiTasks = HifiTasks;
