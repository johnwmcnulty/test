// Hi-fi Project Schedule - fully editable Gantt with drag/resize, live cascade, conflict & slack intelligence, synced calendar
const SCH_WEEKS = ['Jun 2', 'Jun 9', 'Jun 16', 'Jun 23', 'Jun 30', 'Jul 7', 'Jul 14', 'Jul 21'];
const SCH_TODAY = 2.55; // fractional week position of "today"
const SCH_PHASES = [
  { name: 'Demo & prep', tone: 'muted', items: [
    { id: 'demo', t: 'Site protection + demo', start: 0, len: 1, status: 'Done', pct: 100, who: 'Crew', cv: true },
    { id: 'haul', t: 'Dumpster + haul-away', start: 0.4, len: 0.8, status: 'Done', pct: 100, who: 'Crew', cv: false },
  ]},
  { name: 'Structural', tone: 'brand', items: [
    { id: 'beam', t: 'Shoring + beam install', start: 1, len: 1.2, status: 'In progress', pct: 60, who: 'Vargas Framing', cv: true, after: 'demo' },
    { id: 'framinsp', t: 'Framing inspection', start: 2.1, len: 0.4, status: 'Scheduled', who: 'City', cv: true, after: 'beam' },
  ]},
  { name: 'Rough-ins', tone: 'ai', items: [
    { id: 'elec', t: 'Electrical rough + panel', start: 2.4, len: 1.3, status: 'Scheduled', who: 'Bright Electric', cv: false, after: 'framinsp' },
    { id: 'plumb', t: 'Plumbing rough', start: 2.6, len: 1, status: 'Scheduled', who: 'Reliant Plumbing', cv: false, after: 'framinsp' },
  ]},
  { name: 'Finishes', tone: 'good', items: [
    { id: 'cab', t: 'Cabinets delivered + set', start: 4, len: 1.4, status: 'At risk', who: 'Crew', cv: true, after: 'elec' },
    { id: 'counter', t: 'Countertop template + install', start: 5.2, len: 1.2, status: 'Scheduled', who: 'StoneWorks', cv: true, after: 'cab' },
    { id: 'floor', t: 'Flooring refinish', start: 6, len: 1, status: 'Scheduled', who: 'Crew', cv: false, after: 'counter' },
    { id: 'punch', t: 'Punch list + final', start: 6.8, len: 1, status: 'Scheduled', who: 'Crew', cv: true, after: 'floor' },
  ]},
];

const SCH_EYE = 'M2 12 s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7 Z M12 15 a3 3 0 1 0 0-6 a3 3 0 0 0 0 6 Z';
const SCH_WARN = 'M12 3 L22 20 H2 Z M12 10 V14 M12 17 V17.4';
const SCH_TRASH = 'M4 7 H20 M9 7 V5 a1 1 0 0 1 1-1 H14 a1 1 0 0 1 1 1 V7 M6 7 L7 20 a1 1 0 0 0 1 1 H16 a1 1 0 0 0 1-1 L18 7';
const SCH_UNDO = 'M9 14 L4 9 L9 4 M4 9 H15 a5 5 0 0 1 0 10 H9';
const SCH_DAY = 1 / 7;        // one day as a fraction of a week
const SCH_BASE = new Date(2026, 5, 1); // Mon Jun 1, 2026 → week 0 starts Jun 2
const SCH_GENERIC = ['Crew', 'City']; // resources that can run parallel tasks - excluded from conflict checks
const SCH_STATUSES = ['Scheduled', 'In progress', 'At risk', 'Done'];
// Roster of assignable people/companies - in-house employees + subcontractors
const SCH_ROSTER = [
  { name: 'Crew', role: 'In-house crew', kind: 'emp' },
  { name: 'Marco Diaz', role: 'Lead carpenter', kind: 'emp' },
  { name: 'Tasha Bell', role: 'Project manager', kind: 'emp' },
  { name: 'Vargas Framing', role: 'Framing sub', kind: 'sub' },
  { name: 'Bright Electric', role: 'Electrical sub', kind: 'sub' },
  { name: 'Reliant Plumbing', role: 'Plumbing sub', kind: 'sub' },
  { name: 'StoneWorks', role: 'Countertop sub', kind: 'sub' },
  { name: 'City', role: 'Inspector', kind: 'sub' },
];
function schInitials(n) { return n.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase(); }

function schClone(phases) { return phases.map((ph) => ({ ...ph, items: ph.items.map((it) => ({ ...it })) })); }

// Forward pass: push successors so they never start before their predecessor finishes (creates slack, never pulls early)
function schResolve(phases) {
  const map = {};
  phases.forEach((ph) => ph.items.forEach((it) => { map[it.id] = it; }));
  for (let pass = 0; pass < 8; pass++) {
    let changed = false;
    phases.forEach((ph) => ph.items.forEach((it) => {
      if (it.after && map[it.after]) {
        const pred = map[it.after];
        const min = pred.start + pred.len;
        if (it.start < min - 1e-6) { it.start = min; changed = true; }
      }
    }));
    if (!changed) break;
  }
  return phases;
}

function schDate(weekFrac) {
  const d = new Date(SCH_BASE);
  d.setDate(d.getDate() + 1 + Math.round(weekFrac * 7)); // +1 → Jun 2 baseline
  return d;
}
function schFmt(d) { return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
function schAddDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function schSameDay(a, b) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function schOverlap(a, b) { return a.start < b.start + b.len - 1e-6 && b.start < a.start + a.len - 1e-6; }
function schDaysWord(n) { return Math.abs(n) === 1 ? n + ' day' : n + ' days'; }

function SchLegendItem({ swatch, label, icon, ring }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--bq-muted)', whiteSpace: 'nowrap' }}>
      {icon
        ? <BqIcon d={icon} size={13} style={{ color: swatch }}></BqIcon>
        : <span style={{ width: 16, height: 9, borderRadius: 3, background: swatch, boxShadow: ring ? '0 0 0 1.5px var(--bq-brand-strong)' : 'none', flex: 'none' }}></span>}
      {label}
    </span>
  );
}

function SchStepBtn({ d, onClick, title }) {
  return (
    <button title={title} onClick={onClick} style={{ width: 26, height: 26, borderRadius: 7, border: '1px solid var(--bq-border-strong)', background: 'var(--bq-card)', color: 'var(--bq-ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
      <BqIcon d={d} size={13} sw={2.2}></BqIcon>
    </button>
  );
}

// Custom dropdown - fixed-positioned menu floats above the modal (never clipped), flips up when low on space
function SchSelect({ value, options, onChange, renderItem }) {
  const [open, setOpen] = React.useState(false);
  const [rect, setRect] = React.useState(null);
  const btnRef = React.useRef(null);
  const toggle = () => {
    if (!open && btnRef.current) setRect(btnRef.current.getBoundingClientRect());
    setOpen((o) => !o);
  };
  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, [open]);
  const menuH = Math.min(280, options.length * 40 + 8);
  let top = 0, openUp = false;
  if (rect) {
    const spaceBelow = window.innerHeight - rect.bottom;
    openUp = spaceBelow < menuH + 16 && rect.top > menuH + 16;
    top = openUp ? rect.top - menuH - 4 : rect.bottom + 4;
  }
  return (
    <div style={{ position: 'relative' }}>
      <button ref={btnRef} onClick={toggle} style={{ fontFamily: 'inherit', fontSize: 13, color: 'var(--bq-ink)', background: 'var(--bq-card)', border: '1px solid var(--bq-border-strong)', borderRadius: 8, padding: '7px 10px', outline: 'none', width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, cursor: 'pointer', boxShadow: open ? '0 0 0 2px var(--bq-brand-soft)' : 'none' }}>
        <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{renderItem ? renderItem(value) : value}</span>
        <BqIcon d="M6 9 L12 15 L18 9" size={14} sw={2} style={{ color: 'var(--bq-faint)', flex: 'none', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.12s' }}></BqIcon>
      </button>
      {open && rect ? (
        <React.Fragment>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 95 }}></div>
          <div style={{ position: 'fixed', top: top, left: rect.left, width: rect.width, maxHeight: menuH, overflowY: 'auto', zIndex: 96, background: 'var(--bq-card)', borderRadius: 9, boxShadow: '0 12px 30px rgba(38,35,30,0.22), 0 0 0 1px var(--bq-border)', padding: 4 }}>
            {options.map((o) => (
              <button key={o} onClick={() => { onChange(o); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 6, border: 'none', background: o === value ? 'var(--bq-subtle)' : 'transparent', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', color: 'var(--bq-ink)' }}>
                <span style={{ flex: 1, minWidth: 0 }}>{renderItem ? renderItem(o) : o}</span>
                {o === value ? <BqIcon d={BQ_GLYPH.check} size={13} sw={2.4} style={{ color: 'var(--bq-brand)', flex: 'none' }}></BqIcon> : null}
              </button>
            ))}
          </div>
        </React.Fragment>
      ) : null}
    </div>
  );
}

function SchModal({ it, phaseName, predName, color, statusColor, behind, conflictWith, onNudge, onEdit, onDelete, onClose }) {
  const inProg = it.status === 'In progress';
  const dur = Math.max(1, Math.round(it.len * 7));
  const [notified, setNotified] = React.useState(false);
  const facts = [
    ['Phase', phaseName],
    ['Window', schFmt(schDate(it.start)) + ' → ' + schFmt(schDate(it.start + it.len))],
    ['Duration', dur + (dur === 1 ? ' day' : ' days')],
    ['Depends on', predName || 'Project start'],
  ];
  const fieldStyle = { fontFamily: 'inherit', fontSize: 13, color: 'var(--bq-ink)', background: 'var(--bq-card)', border: '1px solid var(--bq-border-strong)', borderRadius: 8, padding: '7px 10px', outline: 'none', width: '100%', boxSizing: 'border-box' };
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(38,35,30,0.4)', zIndex: 60, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '8vh' }}>
      <div onClick={(e) => e.stopPropagation()} className="bq-card-s" style={{ width: 'min(560px, 94%)', maxHeight: '86vh', overflow: 'auto', boxShadow: '0 24px 60px rgba(38,35,30,0.28), 0 0 0 1px var(--bq-border)' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: '16px 18px', borderBottom: '1px solid var(--bq-border)', position: 'sticky', top: 0, background: 'var(--bq-card)', zIndex: 2 }}>
          <span style={{ width: 11, height: 11, borderRadius: 3, flex: 'none', marginTop: 4, background: color }}></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <input value={it.t} onChange={(e) => onEdit({ t: e.target.value })} placeholder="Milestone name" style={{ fontFamily: 'inherit', fontSize: 16, fontWeight: 700, lineHeight: 1.3, color: 'var(--bq-ink)', background: 'transparent', border: 'none', borderBottom: '1px dashed transparent', outline: 'none', flex: 1, minWidth: 0, padding: '1px 0' }} onFocus={(e) => e.target.style.borderBottomColor = 'var(--bq-border-strong)'} onBlur={(e) => e.target.style.borderBottomColor = 'transparent'}></input>
              {it.cv ? <BqIcon d={SCH_EYE} size={13} style={{ color: 'var(--bq-faint)', flex: 'none' }}></BqIcon> : null}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 6, flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 999, fontSize: 11.5, fontWeight: 700, whiteSpace: 'nowrap', color: it.status === 'Scheduled' ? 'var(--bq-muted)' : '#fff', background: it.status === 'Scheduled' ? 'var(--bq-subtle)' : statusColor[it.status], boxShadow: it.status === 'Scheduled' ? 'inset 0 0 0 1px var(--bq-border-strong)' : 'none' }}>
                {it.status === 'At risk' ? <BqIcon d={SCH_WARN} size={11} sw={2} style={{ color: '#fff' }}></BqIcon> : null}
                {it.status}{inProg && it.pct != null ? ' · ' + it.pct + '%' : ''}
              </span>
              {behind > 0 ? <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--bq-brand-strong)' }}>{schDaysWord(behind)} behind baseline</span> : null}
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: 'var(--bq-subtle)', color: 'var(--bq-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
            <BqIcon d="M6 6 L18 18 M18 6 L6 18" size={15} sw={2}></BqIcon>
          </button>
        </div>

        {/* conflict warning */}
        {conflictWith ? (
          <div style={{ margin: '14px 18px 0', padding: '10px 13px', borderRadius: 10, background: 'var(--bq-brand-soft)', boxShadow: 'inset 0 0 0 1px var(--bq-brand-border)', display: 'flex', alignItems: 'center', gap: 9 }}>
            <BqIcon d={SCH_WARN} size={15} sw={2} style={{ color: 'var(--bq-brand-strong)', flex: 'none' }}></BqIcon>
            <span style={{ fontSize: 12.5, color: 'var(--bq-ink)', lineHeight: 1.4 }}><b>{it.who}</b> is double-booked - overlaps <b>{conflictWith}</b>.</span>
          </div>
        ) : null}

        {/* progress bar for in-progress */}
        {inProg && it.pct != null ? (
          <div style={{ padding: '14px 18px 0' }}>
            <div style={{ height: 7, borderRadius: 4, background: 'var(--bq-subtle)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: it.pct + '%', background: color, borderRadius: 4 }}></div>
            </div>
          </div>
        ) : null}

        {/* facts */}
        <div style={{ padding: '14px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '13px 18px' }}>
          {facts.map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 3 }}>{k}</div>
              <div style={{ fontSize: 13.5, color: 'var(--bq-ink)', lineHeight: 1.35 }}>{v}</div>
            </div>
          ))}
        </div>

        {/* editable details */}
        <div style={{ padding: '13px 18px', borderTop: '1px solid var(--bq-border)', background: 'var(--bq-subtle)', display: 'flex', flexDirection: 'column', gap: 11 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', color: 'var(--bq-faint)' }}>Edit details</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-muted)' }}>Status</span>
              <SchSelect
                value={it.status}
                options={SCH_STATUSES}
                onChange={(v) => onEdit({ status: v, pct: v === 'Done' ? 100 : v === 'In progress' ? (it.pct == null ? 25 : it.pct) : it.pct })}
                renderItem={(s) => (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', flex: 'none', background: s === 'Scheduled' ? 'var(--bq-faint)' : statusColor[s], boxShadow: s === 'Scheduled' ? 'inset 0 0 0 1px var(--bq-border-strong)' : 'none' }}></span>
                    {s}
                  </span>
                )}
              ></SchSelect>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-muted)' }}>Assigned to</span>
              <SchSelect
                value={it.who}
                options={(SCH_ROSTER.some((p) => p.name === it.who) ? SCH_ROSTER.map((p) => p.name) : [it.who].concat(SCH_ROSTER.map((p) => p.name)))}
                onChange={(v) => onEdit({ who: v })}
                renderItem={(n) => {
                  const p = SCH_ROSTER.find((x) => x.name === n);
                  const emp = p && p.kind === 'emp';
                  return (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                      <span style={{ width: 22, height: 22, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9.5, fontWeight: 700, background: emp ? 'var(--bq-brand-soft)' : 'var(--bq-subtle)', color: emp ? 'var(--bq-brand-strong)' : 'var(--bq-muted)', boxShadow: emp ? 'none' : 'inset 0 0 0 1px var(--bq-border-strong)' }}>{schInitials(n)}</span>
                      <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n}{p ? <span style={{ color: 'var(--bq-faint)', fontWeight: 500 }}> · {p.role}</span> : null}</span>
                    </span>
                  );
                }}
              ></SchSelect>
            </label>
          </div>
          <button onClick={() => onEdit({ cv: !it.cv })} style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', background: 'none', border: 'none', padding: 0, fontFamily: 'inherit', alignSelf: 'flex-start' }}>
            <span style={{ width: 38, height: 22, borderRadius: 999, flex: 'none', background: it.cv ? 'var(--bq-brand)' : 'var(--bq-border-strong)', position: 'relative', transition: 'background 0.15s' }}>
              <span style={{ position: 'absolute', top: 2, left: it.cv ? 18 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.15s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}></span>
            </span>
            <span style={{ fontSize: 13, color: 'var(--bq-ink)', fontWeight: 600, whiteSpace: 'nowrap' }}>Visible on client portal</span>
          </button>
        </div>

        {/* schedule steppers */}
        <div style={{ padding: '14px 18px', borderTop: '1px solid var(--bq-border)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', color: 'var(--bq-faint)', width: '100%' }}>Adjust schedule</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--bq-muted)', minWidth: 40 }}>Start</span>
            <SchStepBtn d="M15 6 L9 12 L15 18" title="Pull 1 day earlier" onClick={() => onNudge(-SCH_DAY, 0)}></SchStepBtn>
            <SchStepBtn d="M9 6 L15 12 L9 18" title="Push 1 day later" onClick={() => onNudge(SCH_DAY, 0)}></SchStepBtn>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--bq-muted)', minWidth: 50 }}>Length</span>
            <SchStepBtn d="M5 12 H19" title="1 day shorter" onClick={() => onNudge(0, -SCH_DAY)}></SchStepBtn>
            <span className="bq-num" style={{ fontSize: 13, fontWeight: 700, minWidth: 42, textAlign: 'center' }}>{dur}d</span>
            <SchStepBtn d="M12 5 V19 M5 12 H19" title="1 day longer" onClick={() => onNudge(0, SCH_DAY)}></SchStepBtn>
          </div>
        </div>

        {/* footer */}
        <div style={{ padding: '13px 18px', borderTop: '1px solid var(--bq-border)', display: 'flex', alignItems: 'center', gap: 9, position: 'sticky', bottom: 0, background: 'var(--bq-card)' }}>
          <button className="bq-btn ghost sm" onClick={onDelete} style={{ color: 'var(--bq-brand-strong)' }}><BqIcon d={SCH_TRASH} size={14}></BqIcon>Delete</button>
          {notified ? <span style={{ fontSize: 12, color: 'var(--bq-good)', display: 'flex', alignItems: 'center', gap: 5, marginLeft: 4 }}><BqIcon d={BQ_GLYPH.check} size={13} sw={2.4}></BqIcon>Notified</span> : null}
          <span style={{ flex: 1 }}></span>
          {it.cv ? (
            notified
              ? <button className="bq-btn sm" disabled style={{ color: 'var(--bq-good)', boxShadow: 'inset 0 0 0 1px var(--bq-good)', cursor: 'default' }}><BqIcon d={BQ_GLYPH.check} size={13} sw={2.4}></BqIcon>Notified</button>
              : <button className="bq-btn ai sm" onClick={() => setNotified(true)}><BqSpark size={13}></BqSpark>Notify client</button>
          ) : null}
          <button className="bq-btn primary sm" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

function HifiSchedule() {
  const [view, setView] = React.useState('timeline');
  const [phases, setPhases] = React.useState(() => schClone(SCH_PHASES));
  const [sel, setSel] = React.useState(null);
  const [detail, setDetail] = React.useState(null); // id of item shown in modal
  const [nudge, setNudge] = React.useState(null);   // { name, who }
  const [drag, setDrag] = React.useState(null);     // { id, mode } while dragging
  const [dragTip, setDragTip] = React.useState(null); // { x, y, text, sub } live tooltip
  const [hoverId, setHoverId] = React.useState(null); // bar under the cursor
  const [conflictsDismissed, setConflictsDismissed] = React.useState(false);
  const [canUndo, setCanUndo] = React.useState(false);
  const initial = React.useRef(schClone(SCH_PHASES));
  const histRef = React.useRef([]);
  const newIdRef = React.useRef(1);

  const COL = 102, LABEL = 224, PHASE_H = 30, ROW_H = 46, AXIS_H = 46;
  const DAYW = COL / 7;
  const WEEKS = SCH_WEEKS.length;
  const bodyW = LABEL + COL * WEEKS;
  const phaseColor = (tone) => ({ brand: 'var(--bq-brand)', ai: 'var(--bq-ai)', good: 'var(--bq-good)', muted: 'var(--bq-border-strong)' }[tone]);
  const statusColor = { Done: 'var(--bq-good)', 'In progress': 'var(--bq-brand)', Scheduled: 'var(--bq-faint)', 'At risk': 'var(--bq-brand-strong)' };

  // flatten phases → rows
  const rows = [];
  const pos = {};
  let y = 0;
  phases.forEach((ph) => {
    rows.push({ type: 'phase', name: ph.name, tone: ph.tone, top: y });
    y += PHASE_H;
    ph.items.forEach((it) => {
      rows.push({ type: 'item', it: it, tone: ph.tone, top: y });
      pos[it.id] = { top: y, start: it.start, len: it.len };
      y += ROW_H;
    });
  });
  const bodyH = y;
  const todayX = LABEL + COL * SCH_TODAY;

  const tone = {};
  const phaseName = {};
  const itemMap = {};
  phases.forEach((ph) => ph.items.forEach((it) => { tone[it.id] = ph.tone; phaseName[it.id] = ph.name; itemMap[it.id] = it; }));
  const predName = {};
  phases.forEach((ph) => ph.items.forEach((it) => { if (it.after && itemMap[it.after]) predName[it.id] = itemMap[it.after].t; }));
  const baseMap = {};
  initial.current.forEach((ph) => ph.items.forEach((it) => { baseMap[it.id] = it; }));
  const totalItems = Object.keys(itemMap).length;

  // dependency connectors
  const links = [];
  phases.forEach((ph) => ph.items.forEach((it) => {
    if (it.after && pos[it.after]) {
      const a = pos[it.after], b = pos[it.id];
      links.push({ key: it.after + '>' + it.id, from: it.after, to: it.id, x1: LABEL + COL * (a.start + a.len) - 4, y1: a.top + ROW_H / 2, x2: LABEL + COL * b.start + 3, y2: b.top + ROW_H / 2 });
    }
  }));

  // dependency chain for the hovered bar (ancestors + descendants)
  const chain = React.useMemo(() => {
    if (!hoverId || !itemMap[hoverId]) return null;
    const set = new Set([hoverId]);
    let cur = hoverId;
    while (itemMap[cur] && itemMap[cur].after && itemMap[itemMap[cur].after] && !set.has(itemMap[cur].after)) { set.add(itemMap[cur].after); cur = itemMap[cur].after; }
    let added = true;
    while (added) { added = false; phases.forEach((ph) => ph.items.forEach((it) => { if (it.after && set.has(it.after) && !set.has(it.id)) { set.add(it.id); added = true; } })); }
    return set;
  }, [hoverId, phases]);

  // crew double-booking conflicts (named subs only)
  const all = [];
  phases.forEach((ph) => ph.items.forEach((it) => all.push(it)));
  const conflicts = [];
  const conflictIds = {};
  for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) {
    const a = all[i], b = all[j];
    if (a.who === b.who && !SCH_GENERIC.includes(a.who) && schOverlap(a, b)) {
      conflicts.push({ who: a.who, a, b });
      conflictIds[a.id] = b.t; conflictIds[b.id] = a.t;
    }
  }

  const selItem = sel ? itemMap[sel] : null;
  const detailItem = detail ? itemMap[detail] : null;

  function pushHistory() { histRef.current.push(schClone(phases)); if (histRef.current.length > 60) histRef.current.shift(); setCanUndo(true); }
  function undo() { const h = histRef.current.pop(); if (h) { setPhases(h); setCanUndo(histRef.current.length > 0); } }

  function commit(id, next) {
    setPhases((prev) => {
      const cl = schClone(prev);
      let target = null;
      cl.forEach((ph) => ph.items.forEach((it) => { if (it.id === id) { Object.assign(it, next); target = it; } }));
      if (target) {
        if (target.start < 0) target.start = 0;
        if (target.start + target.len > WEEKS) target.start = Math.max(0, WEEKS - target.len);
        if (target.len < SCH_DAY) target.len = SCH_DAY;
      }
      return schResolve(cl);
    });
  }

  function startDrag(e, it, mode) {
    e.preventDefault();
    e.stopPropagation();
    setSel(it.id);
    pushHistory();
    const startX = e.clientX;
    const orig = { start: it.start, len: it.len };
    const snap = (v) => Math.round(v / SCH_DAY) * SCH_DAY;
    let didMove = false;
    setDrag({ id: it.id, mode });
    const onMove = (ev) => {
      const dW = (ev.clientX - startX) / COL;
      if (Math.abs(ev.clientX - startX) > 2) didMove = true;
      let start = orig.start, len = orig.len;
      if (mode === 'move') start = snap(orig.start + dW);
      else if (mode === 'r') len = snap(orig.len + dW);
      else if (mode === 'l') { const ns = snap(orig.start + dW); len = orig.len + (orig.start - ns); start = ns; }
      if (len < SCH_DAY) { if (mode === 'l') start = orig.start + orig.len - SCH_DAY; len = SCH_DAY; }
      if (start < 0) { if (mode === 'l') len = orig.start + orig.len; start = 0; }
      if (start + len > WEEKS && mode !== 'l') { if (mode === 'move') start = WEEKS - len; else len = WEEKS - start; }
      commit(it.id, { start, len });
      const durDays = Math.max(1, Math.round(len * 7));
      let sub;
      if (mode === 'move') { const dd = Math.round((start - orig.start) * 7); sub = (dd > 0 ? '+' : '') + schDaysWord(dd); }
      else { const dd = Math.round((len - orig.len) * 7); sub = durDays + 'd' + (dd ? '  (' + (dd > 0 ? '+' : '') + dd + ')' : ''); }
      setDragTip({ x: ev.clientX, y: ev.clientY, text: schFmt(schDate(start)) + ' → ' + schFmt(schDate(start + len)), sub });
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      setDrag(null);
      setDragTip(null);
      if (didMove) { if (it.cv) setNudge({ name: it.t, who: it.who }); }
      else { histRef.current.pop(); setCanUndo(histRef.current.length > 0); if (mode === 'move') setDetail(it.id); }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  function nudgeItem(id, dStart, dLen) {
    const it = itemMap[id];
    if (!it) return;
    pushHistory();
    commit(id, { start: it.start + (dStart || 0), len: it.len + (dLen || 0) });
    if (it.cv) setNudge({ name: it.t, who: it.who });
  }

  function editItem(id, patch) { pushHistory(); commit(id, patch); }

  function addMilestone() {
    pushHistory();
    const id = 'new' + (newIdRef.current++);
    const st = Math.round(SCH_TODAY / SCH_DAY) * SCH_DAY;
    setPhases((prev) => {
      const cl = schClone(prev);
      cl[cl.length - 1].items.push({ id, t: 'New milestone', start: st, len: 1, status: 'Scheduled', who: 'Crew', cv: false });
      return cl;
    });
    setSel(id); setDetail(id);
  }

  function deleteItem(id) {
    pushHistory();
    setPhases((prev) => {
      const cl = schClone(prev);
      let removedAfter;
      cl.forEach((ph) => ph.items.forEach((it) => { if (it.id === id) removedAfter = it.after; }));
      cl.forEach((ph) => { ph.items = ph.items.filter((it) => it.id !== id); });
      cl.forEach((ph) => ph.items.forEach((it) => { if (it.after === id) it.after = removedAfter; }));
      return schResolve(cl);
    });
    setDetail(null); setSel(null);
  }

  // keyboard: Esc closes/deselects, Cmd/Ctrl+Z undoes
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { if (detail) setDetail(null); else if (sel) setSel(null); }
      else if ((e.metaKey || e.ctrlKey) && (e.key === 'z' || e.key === 'Z')) { e.preventDefault(); undo(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [detail, sel]);

  const dimmed = (id) => chain && !chain.has(id);

  return (
    <div className="bq-screen" style={{ position: 'relative' }}>
      <BqTop crumb="Projects / Henderson / Schedule"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Schedule"></BqSide>
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(12px * var(--bq-sp))', userSelect: drag ? 'none' : 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div className="bq-display" style={{ fontSize: 22 }}>Schedule</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Henderson - Kitchen + Hall Bath · 8-week plan · {totalItems} milestones</div>
            </div>
            <div className="seg-toggle">
              <button className={view === 'timeline' ? 'on' : ''} onClick={() => setView('timeline')}>Timeline</button>
              <button className={view === 'calendar' ? 'on' : ''} onClick={() => setView('calendar')}>Calendar</button>
            </div>
            <button className="bq-btn sm" disabled={!canUndo} onClick={undo} style={{ opacity: canUndo ? 1 : 0.45, cursor: canUndo ? 'pointer' : 'default' }} title="Undo (⌘Z)"><BqIcon d={SCH_UNDO} size={14}></BqIcon>Undo</button>
            <button className="bq-btn sm"><BqIcon d={BQ_GLYPH.cal} size={14}></BqIcon>Export feed (.ics)</button>
            <button className="bq-btn primary sm" onClick={addMilestone}><BqIcon d="M12 5 V19 M5 12 H19" size={14}></BqIcon>Add milestone</button>
          </div>

          {conflicts.length && !conflictsDismissed ? (
            <div className="bq-ai-card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', boxShadow: 'inset 0 0 0 1px var(--bq-brand-border)' }}>
              <BqIcon d={SCH_WARN} size={16} sw={2} style={{ color: 'var(--bq-brand-strong)', flex: 'none' }}></BqIcon>
              <span style={{ fontSize: 13, color: 'var(--bq-ink)', lineHeight: 1.45 }}>
                <b>Scheduling conflict.</b> {conflicts[0].who} is booked on <b>{conflicts[0].a.t}</b> and <b>{conflicts[0].b.t}</b> at the same time{conflicts.length > 1 ? ' · +' + (conflicts.length - 1) + ' more' : ''}. Move one to clear it.
              </span>
              <button className="bq-btn ghost sm" style={{ marginLeft: 'auto' }} onClick={() => { setSel(conflicts[0].b.id); setDetail(conflicts[0].b.id); }}>Review</button>
              <button className="bq-btn ghost sm" onClick={() => setConflictsDismissed(true)}>Dismiss</button>
            </div>
          ) : null}

          {nudge ? (
            <div className="bq-ai-card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px' }}>
              <BqSpark size={14}></BqSpark>
              <span style={{ fontSize: 13, color: 'var(--bq-ink)', lineHeight: 1.45 }}>
                You rescheduled <b>{nudge.name}</b>. Dependent tasks shifted to keep the chain intact, and this is a <b>client-visible</b> milestone - notify Dan &amp; Priya and {nudge.who}?
              </span>
              <button className="bq-btn ai sm" style={{ marginLeft: 'auto' }} onClick={() => setNudge(null)}>Notify both</button>
              <button className="bq-btn ghost sm" onClick={() => setNudge(null)}>Just save</button>
            </div>
          ) : null}

          {view === 'timeline' ? (
            <React.Fragment>
              {/* legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', padding: '0 2px' }}>
                <SchLegendItem swatch="var(--bq-good)" label="Done"></SchLegendItem>
                <SchLegendItem swatch="var(--bq-brand)" label="In progress"></SchLegendItem>
                <SchLegendItem swatch="var(--bq-border-strong)" label="Scheduled"></SchLegendItem>
                <SchLegendItem swatch="var(--bq-brand-strong)" label="At risk" ring></SchLegendItem>
                <SchLegendItem swatch="var(--bq-faint)" label="Client-visible" icon={SCH_EYE}></SchLegendItem>
                <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--bq-faint)', display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}><BqIcon d="M9 3 v18 M9 8 h11 M9 14 h7" size={12}></BqIcon>Click for details · drag to move · grip tabs to resize · hover to trace dependencies</span>
              </div>

              <div className="bq-card-s" style={{ overflow: 'auto' }}>
                <div style={{ position: 'relative', width: bodyW, minWidth: '100%', cursor: drag ? (drag.mode === 'move' ? 'grabbing' : 'ew-resize') : 'default' }}>
                  {/* week axis (sticky) */}
                  <div style={{ position: 'sticky', top: 0, zIndex: 5, display: 'flex', height: AXIS_H, background: 'var(--bq-card)', borderBottom: '1px solid var(--bq-border)' }}>
                    <div style={{ width: LABEL, flex: 'none', borderRight: '1px solid var(--bq-border)', display: 'flex', alignItems: 'center', padding: '0 16px', fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-faint)' }}>Milestone</div>
                    {SCH_WEEKS.map((w, i) => (
                      <div key={w} style={{ width: COL, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: i === Math.floor(SCH_TODAY) ? 'var(--bq-brand-strong)' : 'var(--bq-faint)', borderLeft: '1px solid var(--bq-border)' }}>{w}</div>
                    ))}
                    <div style={{ position: 'absolute', bottom: -4, left: todayX, transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '7px solid var(--bq-brand)', zIndex: 6 }}></div>
                  </div>

                  {/* body */}
                  <div style={{ position: 'relative', height: bodyH }}>
                    {/* click-empty to deselect */}
                    <div onClick={() => setSel(null)} style={{ position: 'absolute', inset: 0, zIndex: 0 }}></div>
                    {/* weekend shading */}
                    {SCH_WEEKS.map((w, wi) => (
                      <div key={'wk' + wi} style={{ position: 'absolute', left: LABEL + COL * wi + DAYW * 5, top: 0, width: DAYW * 2, height: bodyH, background: 'rgba(38,35,30,0.045)', zIndex: 0 }}></div>
                    ))}
                    {/* week gridlines */}
                    {SCH_WEEKS.map((w, wi) => (
                      <div key={wi} style={{ position: 'absolute', left: LABEL + COL * wi, top: 0, height: bodyH, borderLeft: '1px solid var(--bq-border)', zIndex: 0 }}></div>
                    ))}
                    <div style={{ position: 'absolute', left: LABEL, top: 0, height: bodyH, borderLeft: '1px solid var(--bq-border)', zIndex: 0 }}></div>
                    <div style={{ position: 'absolute', left: todayX, top: 0, height: bodyH, width: 2, marginLeft: -1, background: 'var(--bq-brand)', opacity: 0.55, zIndex: 1 }}></div>

                    {/* phase bands + row separators */}
                    {rows.map((r, i) => r.type === 'phase' ? (
                      <div key={'p' + i} style={{ position: 'absolute', left: 0, top: r.top, width: bodyW, height: PHASE_H, background: 'var(--bq-subtle)', borderBottom: '1px solid var(--bq-border)', borderTop: i ? '1px solid var(--bq-border)' : 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', zIndex: 2 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: phaseColor(r.tone) }}></span>
                        <span style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>{r.name}</span>
                      </div>
                    ) : (
                      <div key={'s' + i} style={{ position: 'absolute', left: 0, top: r.top + ROW_H - 1, width: bodyW, borderBottom: '1px solid var(--bq-border)', zIndex: 0 }}></div>
                    ))}

                    {/* dependency connectors */}
                    <svg width={bodyW} height={bodyH} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', zIndex: 3 }}>
                      {links.map((l) => {
                        const midx = Math.max(l.x1 + 11, l.x2 - 16);
                        const on = chain && chain.has(l.from) && chain.has(l.to);
                        const dim = chain && !on;
                        const stroke = on ? 'var(--bq-ink)' : 'var(--bq-border-strong)';
                        return (
                          <g key={l.key} style={{ opacity: dim ? 0.2 : 1 }}>
                            <path d={'M ' + l.x1 + ' ' + l.y1 + ' H ' + midx + ' V ' + l.y2 + ' H ' + (l.x2 - 1)} fill="none" stroke={stroke} strokeWidth={on ? 2 : 1.5}></path>
                            <path d={'M ' + (l.x2 - 6) + ' ' + (l.y2 - 4) + ' L ' + l.x2 + ' ' + l.y2 + ' L ' + (l.x2 - 6) + ' ' + (l.y2 + 4)} fill="none" stroke={stroke} strokeWidth={on ? 2 : 1.5} strokeLinejoin="round" strokeLinecap="round"></path>
                          </g>
                        );
                      })}
                    </svg>

                    {/* left labels */}
                    {rows.filter((r) => r.type === 'item').map((r, i) => (
                      <div key={'l' + i} onClick={() => { setSel(r.it.id); setDetail(r.it.id); }} onMouseEnter={() => setHoverId(r.it.id)} onMouseLeave={() => setHoverId((h) => (h === r.it.id ? null : h))} style={{ position: 'absolute', left: 0, top: r.top, width: LABEL, height: ROW_H, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', zIndex: 4, cursor: 'pointer', background: sel === r.it.id ? 'var(--bq-subtle)' : 'transparent', opacity: dimmed(r.it.id) ? 0.4 : 1, transition: 'opacity 0.12s' }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', flex: 'none', background: statusColor[r.it.status], boxShadow: r.it.status === 'Scheduled' ? 'inset 0 0 0 1px var(--bq-border-strong)' : 'none' }}></span>
                        <span style={{ fontSize: 13, color: 'var(--bq-ink)', lineHeight: 1.25, flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.it.t}</span>
                        {conflictIds[r.it.id] ? <BqIcon d={SCH_WARN} size={12} sw={2} style={{ color: 'var(--bq-brand-strong)', flex: 'none' }}></BqIcon> : null}
                        {r.it.cv ? <BqIcon d={SCH_EYE} size={12} style={{ color: 'var(--bq-faint)', flex: 'none' }}></BqIcon> : null}
                      </div>
                    ))}

                    {/* bars + annotations */}
                    {rows.filter((r) => r.type === 'item').map((r, i) => {
                      const it = r.it;
                      const c = phaseColor(r.tone);
                      const left = LABEL + COL * it.start + 4;
                      const width = COL * it.len - 8;
                      const atRisk = it.status === 'At risk';
                      const inProg = it.status === 'In progress';
                      const done = it.status === 'Done';
                      const isSel = sel === it.id;
                      const isDragging = drag && drag.id === it.id;
                      const showTabs = isSel || isDragging || hoverId === it.id;
                      const behind = baseMap[it.id] ? Math.round((it.start - baseMap[it.id].start) * 7) : 0;
                      const conflict = conflictIds[it.id];
                      const annoText = conflict ? 'Double-booked' : behind > 0 ? '+' + behind + 'd behind' : null;
                      const handle = (side) => (
                        <div onMouseDown={(e) => startDrag(e, it, side)} title="Drag to change duration" style={{ position: 'absolute', top: 0, bottom: 0, [side === 'l' ? 'left' : 'right']: 0, width: 20, cursor: 'ew-resize', zIndex: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 2.5, height: 18, padding: '0 4px', borderRadius: 5, background: 'rgba(255,255,255,0.95)', boxShadow: '0 1px 4px rgba(38,35,30,0.35)', opacity: showTabs ? 1 : 0, transform: showTabs ? 'scale(1)' : 'scale(0.7)', transition: 'opacity 0.12s, transform 0.12s' }}>
                            <span style={{ width: 2, height: 11, borderRadius: 1, background: c }}></span>
                            <span style={{ width: 2, height: 11, borderRadius: 1, background: c }}></span>
                          </span>
                        </div>
                      );
                      return (
                        <React.Fragment key={'b' + i}>
                          <div
                            onMouseDown={(e) => startDrag(e, it, 'move')}
                            onMouseEnter={() => setHoverId(it.id)}
                            onMouseLeave={() => setHoverId((h) => (h === it.id ? null : h))}
                            title={it.t + ' · ' + it.who + ' · ' + it.status + ' · ' + schFmt(schDate(it.start)) + '–' + schFmt(schDate(it.start + it.len)) + ' · click for details, drag to move'}
                            style={{ position: 'absolute', left: left, top: r.top + 11, height: 24, width: width, borderRadius: 7, zIndex: isDragging ? 7 : 4, cursor: isDragging && drag.mode === 'move' ? 'grabbing' : isDragging ? 'ew-resize' : 'grab', overflow: 'hidden', background: done ? c : inProg ? 'color-mix(in srgb, ' + c + ' 26%, transparent)' : c, opacity: dimmed(it.id) ? 0.3 : it.status === 'Scheduled' ? 0.62 : 1, boxShadow: isDragging ? '0 6px 16px rgba(38,35,30,0.28), 0 0 0 2px var(--bq-ink)' : conflict ? '0 0 0 2px var(--bq-brand-strong)' : atRisk ? '0 0 0 2px var(--bq-brand-strong)' : isSel ? '0 0 0 2px var(--bq-ink)' : 'none', display: 'flex', alignItems: 'center', padding: '0 22px', gap: 6, transition: isDragging ? 'none' : 'box-shadow 0.12s, opacity 0.12s' }}>
                            {inProg ? <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: it.pct + '%', background: c, borderRadius: '7px 0 0 7px' }}></div> : null}
                            {done ? <BqIcon d={BQ_GLYPH.check} size={12} sw={2.6} style={{ color: '#fff', flex: 'none', position: 'relative' }}></BqIcon> : null}
                            {atRisk ? <BqIcon d={SCH_WARN} size={12} sw={2} style={{ color: '#fff', flex: 'none', position: 'relative' }}></BqIcon> : null}
                            <span style={{ position: 'relative', fontSize: 11, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.who}{inProg && it.pct != null ? ' · ' + it.pct + '%' : ''}</span>
                            {handle('l')}
                            {handle('r')}
                          </div>
                          {annoText && !isDragging ? (
                            <div style={{ position: 'absolute', left: left + width + 8, top: r.top + 13, height: 20, display: 'flex', alignItems: 'center', gap: 4, padding: '0 7px', borderRadius: 6, background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)', fontSize: 10.5, fontWeight: 700, whiteSpace: 'nowrap', zIndex: 4, pointerEvents: 'none', opacity: dimmed(it.id) ? 0.3 : 1 }}>
                              {conflict ? <BqIcon d={SCH_WARN} size={10} sw={2.2}></BqIcon> : null}{annoText}
                            </div>
                          ) : null}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--bq-faint)', flexWrap: 'wrap' }}>
                <button className="bq-btn ghost sm" onClick={() => { pushHistory(); setPhases(schClone(initial.current)); setSel(null); setNudge(null); setConflictsDismissed(false); }}>Reset to baseline plan</button>
                <span>Changes cascade through dependents · weekends shaded · <b>Esc</b> to deselect · <b>⌘Z</b> to undo.</span>
              </div>
            </React.Fragment>
          ) : (
            <SchCalendar phases={phases} phaseColor={phaseColor} onOpen={(id) => { setView('timeline'); setSel(id); setDetail(id); }}></SchCalendar>
          )}
        </main>
      </div>

      {/* live drag tooltip */}
      {dragTip ? (
        <div style={{ position: 'fixed', left: dragTip.x + 16, top: dragTip.y - 18, zIndex: 90, pointerEvents: 'none', background: 'var(--bq-ink)', color: '#fff', borderRadius: 8, padding: '7px 11px', boxShadow: '0 6px 18px rgba(38,35,30,0.35)', whiteSpace: 'nowrap' }}>
          <div style={{ fontSize: 12.5, fontWeight: 700 }}>{dragTip.text}</div>
          <div style={{ fontSize: 11, opacity: 0.8, marginTop: 1 }}>{dragTip.sub}</div>
        </div>
      ) : null}

      {detailItem ? (
        <SchModal
          it={detailItem}
          phaseName={phaseName[detailItem.id]}
          predName={predName[detailItem.id]}
          color={phaseColor(tone[detailItem.id])}
          statusColor={statusColor}
          behind={baseMap[detailItem.id] ? Math.round((detailItem.start - baseMap[detailItem.id].start) * 7) : 0}
          conflictWith={conflictIds[detailItem.id]}
          onNudge={(ds, dl) => nudgeItem(detailItem.id, ds, dl)}
          onEdit={(patch) => editItem(detailItem.id, patch)}
          onDelete={() => deleteItem(detailItem.id)}
          onClose={() => setDetail(null)}
        ></SchModal>
      ) : null}
    </div>
  );
}

// Calendar derived live from the timeline state
function SchCalendar({ phases, phaseColor, onOpen }) {
  const first = new Date(2026, 5, 1);
  const startWd = (first.getDay() + 6) % 7; // Mon = 0
  const today = schDate(SCH_TODAY);
  const evMap = {};
  let maxOffset = 29; // at least the full month
  phases.forEach((ph) => ph.items.forEach((it) => {
    const d = schDate(it.start);
    const k = d.toDateString();
    (evMap[k] = evMap[k] || []).push({ id: it.id, label: it.t, tone: ph.tone, cv: it.cv });
    const off = Math.round((d - first) / 86400000);
    if (off > maxOffset) maxOffset = off;
  }));
  const cells = Math.max(35, Math.ceil((startWd + maxOffset + 1) / 7) * 7);
  return (
    <div className="bq-card-s" style={{ padding: 'calc(16px * var(--bq-sp)) 18px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, background: 'var(--bq-border)', borderRadius: 12, overflow: 'hidden' }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d} style={{ background: 'var(--bq-subtle)', padding: '8px 10px', fontSize: 11, fontWeight: 700, color: 'var(--bq-faint)', textTransform: 'uppercase', letterSpacing: 0.6 }}>{d}</div>
        ))}
        {Array.from({ length: cells }).map((_, i) => {
          const date = schAddDays(first, i - startWd);
          const inMonth = date.getMonth() === 5;
          const weekend = date.getDay() === 0 || date.getDay() === 6;
          const isToday = schSameDay(date, today);
          const evs = evMap[date.toDateString()] || [];
          return (
            <div key={i} style={{ background: isToday ? 'var(--bq-brand-soft)' : weekend ? 'var(--bq-subtle)' : 'var(--bq-card)', minHeight: 78, padding: '6px 7px', opacity: inMonth ? 1 : 0.45, boxShadow: isToday ? 'inset 0 0 0 1.5px var(--bq-brand)' : 'none', display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ fontSize: 11.5, color: isToday ? 'var(--bq-brand-strong)' : 'var(--bq-faint)', fontWeight: 700 }}>{date.getDate()}</div>
              {evs.slice(0, 3).map((ev, k) => (
                <div key={k} onClick={() => onOpen(ev.id)} title={ev.label} style={{ fontSize: 10.5, fontWeight: 600, color: '#fff', background: phaseColor(ev.tone), borderRadius: 6, padding: '2px 6px', lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {ev.cv ? <BqIcon d={SCH_EYE} size={9} style={{ color: '#fff', flex: 'none' }}></BqIcon> : null}{ev.label}
                </div>
              ))}
              {evs.length > 3 ? <div style={{ fontSize: 10, color: 'var(--bq-faint)', fontWeight: 600 }}>+{evs.length - 3} more</div> : null}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--bq-faint)' }}>Reflects your latest timeline edits · click an event to open it.</div>
    </div>
  );
}
window.HifiSchedule = HifiSchedule;
