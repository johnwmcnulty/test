// BuilderIQ hi-fi shared parts
const bqMoney = (n) => '$' + Math.round(Number(n) || 0).toLocaleString('en-US');

function BqIcon({ d, size = 16, sw = 1.6, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={style} aria-hidden="true" focusable="false">
      <path d={d} stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  );
}

// Shared empty-state - used across every screen when there's no data yet (esp. the clean build).
function BqEmpty({ icon, title, sub, actionLabel, onAction, full, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 3, padding: full ? '56px 24px' : '36px 24px', minHeight: full ? 320 : 0, flex: full ? 1 : 'none' }}>
      <span style={{ width: 54, height: 54, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-subtle)', color: 'var(--bq-faint)', marginBottom: 12 }}>
        <BqIcon d={icon || BQ_GLYPH.clients} size={25} sw={1.6}></BqIcon>
      </span>
      <div className="bq-display" style={{ fontSize: 19, color: 'var(--bq-ink)' }}>{title}</div>
      {sub ? <div style={{ fontSize: 13.5, lineHeight: 1.55, maxWidth: 400, color: 'var(--bq-muted)' }}>{sub}</div> : null}
      {actionLabel ? <button className="bq-btn primary" style={{ marginTop: 14 }} onClick={onAction}><BqIcon d="M12 5 V19 M5 12 H19" size={14} sw={2.2}></BqIcon>{actionLabel}</button> : null}
      {children}
    </div>
  );
}
function BqQuickForm({ title, sub, fields, saveLabel, onClose, onSave }) {
  const [f, setF] = React.useState(() => { const o = {}; fields.forEach((x) => { o[x.k] = x.def != null ? x.def : (x.type === 'select' ? (x.options[0] || '') : ''); }); return o; });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const ok = fields.filter((x) => x.req).every((x) => String(f[x.k]).trim());
  const fld = { font: 'inherit', fontSize: 13.5, padding: '9px 11px', borderRadius: 10, border: '1px solid var(--bq-border-strong)', background: 'var(--bq-card)', color: 'var(--bq-ink)', outline: 'none', width: '100%', boxSizing: 'border-box' };
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 210, background: 'rgba(38,35,30,0.42)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(460px, 100%)', background: 'var(--bq-card)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 28px 64px rgba(38,35,30,0.30), 0 0 0 1px var(--bq-border)' }}>
        <div style={{ padding: '17px 20px 6px' }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{title}</div>
          {sub ? <div style={{ fontSize: 12.5, color: 'var(--bq-faint)', marginTop: 2 }}>{sub}</div> : null}
        </div>
        <div style={{ padding: '10px 20px 4px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {fields.map((x) => (
            <label key={x.k} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-muted)' }}>{x.label}{x.req ? '' : ' · optional'}</span>
              {x.type === 'select'
                ? <BqSelect value={f[x.k]} options={x.options} onChange={(v) => set(x.k, v)}></BqSelect>
                : <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>{x.prefix ? <span style={{ color: 'var(--bq-faint)', fontSize: 13.5, fontWeight: 600 }}>{x.prefix}</span> : null}<input autoFocus={fields[0].k === x.k} value={f[x.k]} onChange={(e) => set(x.k, e.target.value)} placeholder={x.ph || ''} inputMode={x.type === 'number' ? 'decimal' : undefined} style={fld}></input></div>}
            </label>
          ))}
        </div>
        <div style={{ padding: '14px 20px', marginTop: 6, borderTop: '1px solid var(--bq-border)', display: 'flex', alignItems: 'center', gap: 9, justifyContent: 'flex-end' }}>
          <button className="bq-btn ghost sm" onClick={onClose}>Cancel</button>
          <button className="bq-btn primary sm" disabled={!ok} style={{ opacity: ok ? 1 : 0.5, cursor: ok ? 'pointer' : 'default' }} onClick={() => ok && onSave(f)}>{saveLabel || 'Add'}</button>
        </div>
      </div>
    </div>
  );
}
function BqSelect({ value, options, onChange, width, tone, ph }) {
  const [open, setOpen] = React.useState(false);
  const [rect, setRect] = React.useState(null);
  const ref = React.useRef(null);
  const opts = options.map((o) => (o && typeof o === 'object') ? o : { value: o, label: o });
  const cur = opts.find((o) => o.value === value);
  const label = cur ? cur.label : (ph || '');
  const toggle = () => { if (!open && ref.current) setRect(ref.current.getBoundingClientRect()); setOpen((o) => !o); };
  React.useEffect(() => { if (!open) return; const c = () => setOpen(false); window.addEventListener('resize', c); window.addEventListener('scroll', c, true); return () => { window.removeEventListener('resize', c); window.removeEventListener('scroll', c, true); }; }, [open]);
  const menuH = Math.min(288, opts.length * 36 + 8);
  let top = 0;
  if (rect) { const below = window.innerHeight - rect.bottom; top = (below < menuH + 16 && rect.top > menuH) ? rect.top - menuH - 4 : rect.bottom + 4; }
  const chip = !!tone;
  const trig = chip
    ? { fontFamily: 'inherit', fontWeight: 600, fontSize: 12, padding: '3px 9px', borderRadius: 999, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }
    : { fontFamily: 'inherit', fontWeight: 500, fontSize: 13.5, color: 'var(--bq-ink)', background: 'var(--bq-card)', border: '1px solid var(--bq-border-strong)', borderRadius: 10, padding: '9px 11px', width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, cursor: 'pointer', boxShadow: open ? '0 0 0 2px var(--bq-brand-soft)' : 'none' };
  return (
    <div style={{ position: 'relative', width: chip ? 'auto' : (width || '100%'), display: chip ? 'inline-block' : 'block' }}>
      <button ref={ref} type="button" onClick={toggle} className={chip ? ('bq-chip ' + tone) : ''} style={trig}>
        <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: cur ? undefined : 'var(--bq-faint)' }}>{label}</span>
        <BqIcon d="M6 9 L12 15 L18 9" size={chip ? 12 : 14} sw={2} style={{ flex: 'none', opacity: 0.75, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .12s' }}></BqIcon>
      </button>
      {open && rect ? (
        <React.Fragment>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 220 }}></div>
          <div style={{ position: 'fixed', top: top, left: rect.left, minWidth: rect.width, maxHeight: menuH, overflowY: 'auto', zIndex: 221, background: 'var(--bq-card)', borderRadius: 11, boxShadow: '0 14px 34px rgba(38,35,30,0.24), 0 0 0 1px var(--bq-border)', padding: 4 }}>
            {opts.map((o) => (
              <button key={String(o.value)} type="button" onClick={() => { onChange(o.value); setOpen(false); }} onMouseEnter={(e) => { if (o.value !== value) e.currentTarget.style.background = 'var(--bq-subtle)'; }} onMouseLeave={(e) => { if (o.value !== value) e.currentTarget.style.background = 'transparent'; }} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 7, border: 'none', background: o.value === value ? 'var(--bq-subtle)' : 'transparent', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', color: 'var(--bq-ink)', whiteSpace: 'nowrap' }}>
                <span style={{ flex: 1, minWidth: 0 }}>{o.label}</span>
                {o.value === value ? <BqIcon d={BQ_GLYPH.check} size={13} sw={2.4} style={{ color: 'var(--bq-brand)', flex: 'none' }}></BqIcon> : null}
              </button>
            ))}
          </div>
        </React.Fragment>
      ) : null}
    </div>
  );
}
const BQ_GLYPH = {
  home: 'M4 11 L12 4 L20 11 M6 9.5 V19 a1 1 0 0 0 1 1 H17 a1 1 0 0 0 1-1 V9.5',
  leads: 'M12 12 a4 4 0 1 0 0-8 a4 4 0 0 0 0 8 Z M4 20 c0-3.5 3.5-5.5 8-5.5 s8 2 8 5.5',
  estimate: 'M7 3 H17 a1 1 0 0 1 1 1 V20 a1 1 0 0 1-1 1 H7 a1 1 0 0 1-1-1 V4 a1 1 0 0 1 1-1 Z M9 7 H15 M9 11 H15 M9 15 H12',
  proposal: 'M5 4 H15 L19 8 V20 a1 1 0 0 1-1 1 H5 a1 1 0 0 1-1-1 V5 a1 1 0 0 1 1-1 Z M15 4 V8 H19 M8 14 C 9.5 12.5, 11 15.5, 12.5 14 S 15 13, 16 13.5',
  projects: 'M3 21 H21 M5 21 V8 L12 3 L19 8 V21 M9 21 V14 H15 V21',
  co: 'M12 3 a9 9 0 1 1-9 9 M3 12 a9 9 0 0 1 3-6.7 M12 8 V12 L15 14',
  invoice: 'M6 3 H18 V21 L15.5 19.5 L13 21 L10.5 19.5 L8 21 L6 19.5 Z M9 8 H15 M9 12 H15',
  clients: 'M9 11 a3.5 3.5 0 1 0 0-7 a3.5 3.5 0 0 0 0 7 Z M2.5 19 c0-3 3-4.8 6.5-4.8 s6.5 1.8 6.5 4.8 M16 4.5 a3.5 3.5 0 0 1 0 6.6 M18 14.5 c2.1 0.7 3.5 2 3.5 4.5',
  reports: 'M4 20 V14 M10 20 V9 M16 20 V12 M22 20 H2 M22 20 V5',
  search: 'M10.5 17 a6.5 6.5 0 1 0 0-13 a6.5 6.5 0 0 0 0 13 Z M15.5 15.5 L20 20',
  spark: 'M12 3 L13.8 9.2 L20 11 L13.8 12.8 L12 19 L10.2 12.8 L4 11 L10.2 9.2 Z M19 17 L19.6 18.9 L21.5 19.5 L19.6 20.1 L19 22 L18.4 20.1 L16.5 19.5 L18.4 18.9 Z',
  camera: 'M4 8 H7 L9 5 H15 L17 8 H20 a1 1 0 0 1 1 1 V18 a1 1 0 0 1-1 1 H4 a1 1 0 0 1-1-1 V9 a1 1 0 0 1 1-1 Z M12 16 a3 3 0 1 0 0-6 a3 3 0 0 0 0 6 Z',
  check: 'M5 13 L9.5 17.5 L19 7',
  cal: 'M4 6 a1 1 0 0 1 1-1 H19 a1 1 0 0 1 1 1 V19 a1 1 0 0 1-1 1 H5 a1 1 0 0 1-1-1 Z M4 9.5 H20 M8 3 V6 M16 3 V6',
  select: 'M4 5 a1 1 0 0 1 1-1 H10 a1 1 0 0 1 1 1 V10 a1 1 0 0 1-1 1 H5 a1 1 0 0 1-1-1 Z M14 5 a1 1 0 0 1 1-1 H19 a1 1 0 0 1 1 1 V10 a1 1 0 0 1-1 1 H15 a1 1 0 0 1-1-1 Z M4 15 a1 1 0 0 1 1-1 H10 a1 1 0 0 1 1 1 V19 a1 1 0 0 1-1 1 H5 a1 1 0 0 1-1-1 Z M14 14 L20 20 M20 14 L14 20',
  log: 'M8 4 H16 a1 1 0 0 1 1 1 V20 a1 1 0 0 1-1 1 H6 a1 1 0 0 1-1-1 V5 a1 1 0 0 1 1-1 H8 Z M9 3.5 H13 a1 1 0 0 1 1 1 V5 a1 1 0 0 1-1 1 H9 a1 1 0 0 1-1-1 V4.5 a1 1 0 0 1 1-1 Z M8.5 11 L10 12.5 L13 9.5 M8.5 16 H15',
  task: 'M9 6 H20 M9 12 H20 M9 18 H20 M4 5.5 L5 6.5 L7 4.5 M4 11.5 L5 12.5 L7 10.5 M4 17.5 L5 18.5 L7 16.5',
  photo: 'M3 7 a1 1 0 0 1 1-1 H6 L7.5 4 H16.5 L18 6 H20 a1 1 0 0 1 1 1 V18 a1 1 0 0 1-1 1 H4 a1 1 0 0 1-1-1 Z M3 16 L8 11.5 L11.5 15 L15 12 L21 17.5',
  expense: 'M6 3 H18 V21 L15.5 19.5 L13 21 L10.5 19.5 L8 21 L6 19.5 Z M12 6.5 V17 M14.3 9 a2.2 2 0 0 0-2.3-1.3 c-1.3 0-2.2 .7-2.2 1.7 0 2.3 4.4 1.1 4.4 3.4 0 1-.9 1.7-2.2 1.7 a2.4 2 0 0 1-2.3-1.3',
  bell: 'M18 9 a6 6 0 1 0-12 0 c0 5-2 7-2 7 H20 s-2-2-2-7 Z M9.5 20 a2.5 2 0 0 0 5 0',
  hardhat: 'M3.5 18 H20.5 M5 18 a7 7 0 0 1 14 0 M9 8.5 V6.2 a3 3 0 0 1 6 0 V8.5',
  watchdog: 'M12 3 L20 6 V11 c0 5-3.5 8.5-8 10 c-4.5-1.5-8-5-8-10 V6 Z M8.5 12 L11 14.5 L15.5 9.5',
  inbox: 'M4 13 L6.5 5 H17.5 L20 13 V19 a1 1 0 0 1-1 1 H5 a1 1 0 0 1-1-1 Z M4 13 H8.5 L10 15.5 H14 L15.5 13 H20',
  plan: 'M6 3 H15 L19 7 V20 a1 1 0 0 1-1 1 H6 a1 1 0 0 1-1-1 V4 a1 1 0 0 1 1-1 Z M14 3 V8 H19 M8 12 H15 M8 15.5 H15 M8 18.5 H12',
  quotes: 'M12 4 V19.5 M7.5 20 H16.5 M5 7.5 H19 M5 7.5 L3 12.5 H7 Z M19 7.5 L17 12.5 H21 Z M9.5 4.5 H14.5',
  automation: 'M13 3 L5 13.5 H11 L10 21 L19 10 H12.5 Z',
  code: 'M9 8 L5 12 L9 16 M15 8 L19 12 L15 16',
  webhook: 'M8.5 9 a3.5 3.5 0 1 1 4.5 3.4 L10 18 M9 15 a3.5 3.5 0 0 0 5 3 M15 14 a3.5 3.5 0 1 0-2-6.4',
  plug: 'M9 3 V7 M15 3 V7 M7 7 H17 V11 a5 5 0 0 1-10 0 Z M12 16 V21',
  bank: 'M3 9 L12 4 L21 9 M4 9 V18 M9 9 V18 M15 9 V18 M20 9 V18 M3 18 H21 M2.5 21 H21.5',
  exports: 'M12 3 V14 M8 10.5 L12 14 L16 10.5 M5 17 V20 H19 V17',
  key: 'M15 7 a3.5 3.5 0 1 0-3.4 4.4 L4 19 V21 H6 L7 19.5 H9 V17.5 H11 L13.6 14.9 A3.5 3.5 0 0 0 15 7 Z',
  partners: 'M8 11 a3 3 0 1 0 0-6 a3 3 0 0 0 0 6 Z M2 20 a6 6 0 0 1 12 0 M16 5.4 a3 3 0 0 1 0 5.8 M15 14.3 a6 6 0 0 1 7 5.7',
  globe: 'M12 3 a9 9 0 1 0 0 18 a9 9 0 0 0 0-18 Z M3 12 H21 M12 3 c3.2 4 3.2 14 0 18 c-3.2-4-3.2-14 0-18',
  template: 'M12 3 L21 7.5 L12 12 L3 7.5 Z M3 12 L12 16.5 L21 12 M3 16.5 L12 21 L21 16.5',
  warranty: 'M12 3 L19 6 V11 c0 5-3 8-7 10 c-4-2-7-5-7-10 V6 Z M9 11.5 L11 13.5 L15 9.5',
  punch: 'M4 6 H7 V9 H4 Z M4 13 H7 V16 H4 Z M10 7.5 H20 M10 14.5 H20 M5 7.5 L5.2 7.8 M5 14.5 L5.2 14.8',
  vendor: 'M3 8 L5 4 H19 L21 8 M3 8 V19 a1 1 0 0 0 1 1 H20 a1 1 0 0 0 1-1 V8 M3 8 H21 M8 12 H16',
  po: 'M7 4 H14 L18 8 V20 a1 1 0 0 0-1 1 H7 a1 1 0 0 1-1-1 V5 a1 1 0 0 1 1-1 Z M14 4 V8 H18 M9 13 H15 M9 16.5 H13 M9.5 9.5 H11',
  clock: 'M12 3 a9 9 0 1 0 0 18 a9 9 0 0 0 0-18 Z M12 7.5 V12 L15 14',
  pay: 'M3 7 a1 1 0 0 1 1-1 H20 a1 1 0 0 1 1 1 V17 a1 1 0 0 1-1 1 H4 a1 1 0 0 1-1-1 Z M3 10 H21 M7 14.5 H11',
  hammer: 'M14 4 L20 10 L17.5 12.5 L11.5 6.5 Z M11.5 6.5 L4 14 L7 17 L14.5 9.5',
  pin: 'M12 21 c4-5 7-8.2 7-11.5 a7 7 0 0 0-14 0 c0 3.3 3 6.5 7 11.5 Z M12 12 a2.5 2.5 0 1 0 0-5 a2.5 2.5 0 0 0 0 5 Z',
  docs: 'M9 2.5 H15.5 L20 7 V18 a1 1 0 0 1-1 1 H9 a1 1 0 0 1-1-1 V3.5 a1 1 0 0 1 1-1 Z M15.5 2.5 V7 H20 M5 6 V20.5 a1 1 0 0 0 1 1 H16',
  meet: 'M3 8 a1 1 0 0 1 1-1 H13 a1 1 0 0 1 1 1 V16 a1 1 0 0 1-1 1 H4 a1 1 0 0 1-1-1 Z M15 10.2 L21 7 V17 L15 13.8 M7 11 a1.4 1.4 0 1 0 0-2.8 a1.4 1.4 0 0 0 0 2.8 Z M4.5 15 c0-1.6 1.3-2.4 2.5-2.4 s2.5 .8 2.5 2.4',
  finance: 'M12 3 a9 9 0 1 0 0 18 a9 9 0 0 0 0-18 Z M9.2 9 h.01 M14.8 15 h.01 M15 9 L9 15',
  bid: 'M8 4 H16 V6 a0.5 .5 0 0 1-.5 .5 H8.5 a0.5 .5 0 0 1-.5-.5 Z M8 5 H6.5 a1 1 0 0 0-1 1 V20 a1 1 0 0 0 1 1 H17.5 a1 1 0 0 0 1-1 V6 a1 1 0 0 0-1-1 H16 M12 10.5 V17 M14 12 a2 1.5 0 0 0-2-1.1 c-1.1 0-1.9 .6-1.9 1.4 0 1.9 3.8 1 3.8 2.7 0 .8-.8 1.4-1.9 1.4 a2 1.5 0 0 1-2-1.1',
  sign: 'M4 20 H20 M5 16 C 8 16, 8 8.5, 11 8.5 S 12.5 14, 14.5 14 S 16 9, 18 9',
  moon: 'M20.5 13.2 A8 8 0 1 1 10.8 3.5 A6.4 6.4 0 0 0 20.5 13.2 Z',
  sun: 'M12 4.2 V2.5 M12 21.5 V19.8 M4.2 12 H2.5 M21.5 12 H19.8 M6.4 6.4 L5.2 5.2 M18.8 18.8 L17.6 17.6 M17.6 6.4 L18.8 5.2 M5.2 18.8 L6.4 17.6 M12 16.2 a4.2 4.2 0 1 0 0-8.4 a4.2 4.2 0 0 0 0 8.4 Z',
  board: 'M4 5 a1 1 0 0 1 1-1 H8 a1 1 0 0 1 1 1 V19 a1 1 0 0 1-1 1 H5 a1 1 0 0 1-1-1 Z M10.5 5 a1 1 0 0 1 1-1 H14 a1 1 0 0 1 1 1 V15 a1 1 0 0 1-1 1 H11.5 a1 1 0 0 1-1-1 Z M17 5 a1 1 0 0 1 1-1 H21 a1 1 0 0 1 1 1 V12 a1 1 0 0 1-1 1 H18 a1 1 0 0 1-1-1 Z',
  megaphone: 'M3 10 V14 a1 1 0 0 0 1 1 H6 L13 19 V5 L6 9 H4 a1 1 0 0 0-1 1 Z M16.5 9 C18.7 10.7 18.7 13.3 16.5 15 M8.5 15 V18.5 a1 1 0 0 0 1 1 H10.5 a1 1 0 0 0 1-1 V16',
  send: 'M4 11.5 L20 4 L14.5 20 L11 13 Z M11 13 L20 4',
  catalog: 'M5 4.5 a1.5 1.5 0 0 1 1.5-1.5 H18 a1 1 0 0 1 1 1 V20 H7 a2 2 0 0 1-2-2 Z M5 18 a2 2 0 0 1 2-2 H19 M9 7.5 H15 M9 11 H13',
  ruler: 'M4 8.5 L8.5 4 L20 15.5 L15.5 20 Z M8.5 8 L10 9.5 M11 6.5 L13 8.5 M13.5 9.5 L15.5 11.5 M9 12.5 L11 14.5',
  ledger: 'M4 4 H20 V20 H4 Z M4 9 H20 M9.5 9 V20 M14.5 4 V9 M6.5 13 H7.7 M6.5 16.5 H7.7',
  trend: 'M4 16.5 L9.5 11 L13 14.5 L20 6.5 M20 6.5 H15 M20 6.5 V11.5 M4 20 H20',
  gauge: 'M3.5 18 a8.5 8.5 0 0 1 17 0 M12 18 L16.5 10.5 M5.5 18 H7 M17 18 H18.5 M12 8.5 V10',
  cart: 'M2.5 4 H5 L7 15 H18 L20 7 H6 M9 19 a1.3 1.3 0 1 0 0.01 0 M16.5 19 a1.3 1.3 0 1 0 0.01 0',
  rocket: 'M12 3 C16 5.5 16.5 11 15 15 L13 17 H11 L9 15 C7.5 11 8 5.5 12 3 Z M12 8.5 a1.6 1.6 0 1 0 0.01 0 M9.5 16.5 C7.5 17.5 7.5 19.5 7.5 21 C9.5 21 10 19.5 10 18 M14.5 16.5 C16.5 17.5 16.5 19.5 16.5 21 C14.5 21 14 19.5 14 18',
  history: 'M3.6 11 a8.5 8.5 0 1 1 0.3 3.4 M3.6 11 L3.6 6.5 M3.6 11 H8 M12 7.5 V12 L15 14',
  gear: 'M12 3 L15.25 6.37 L19.79 7.5 L18.5 12 L19.79 16.5 L15.25 17.63 L12 21 L8.75 17.63 L4.21 16.5 L5.5 12 L4.21 7.5 L8.75 6.37 Z M12 9 a3 3 0 1 0 0 6 a3 3 0 0 0 0-6 Z'
};

function BqSpark({ size = 15 }) {
  return <span className="bq-spark" style={{ display: 'inline-flex' }}><BqIcon d={BQ_GLYPH.spark} size={size} sw={1.4}></BqIcon></span>;
}

// ─── shared logged-in user identity store ───
// Single source of truth for the current user. Any setting changed on the
// Profile page is written here and reflected app-wide (avatars, menus, team row).
const BQ_PROFILE_DEFAULT = {
  first: 'Maria', last: 'Hartwell', display: 'Maria Hartwell',
  title: 'Owner / General Contractor', role: 'Owner · Admin', company: 'Hartwell Builders',
  email: 'maria@hartwell.com', phone: '(512) 555-0142',
  tz: 'Central Time (US & Canada)',
  bio: 'Founder of Hartwell Builders. 18 years in residential remodeling across the Austin metro.',
};
// clean build: neutral owner the user fills in on the Profile page
const BQ_PROFILE_CLEAN = {
  first: 'Owner', last: '', display: 'Owner',
  title: 'Owner / General Contractor', role: 'Owner · Admin', company: '',
  email: '', phone: '',
  tz: 'Central Time (US & Canada)',
  bio: '',
};
function bqReadProfile() {
  const DEF = window.bqClean && window.bqClean() ? BQ_PROFILE_CLEAN : BQ_PROFILE_DEFAULT;
  try { const raw = localStorage.getItem(window.bqNsKey('bq-profile')); const p = raw ? JSON.parse(raw) : {}; const photo = localStorage.getItem(window.bqNsKey('bq-profile-photo')) || null; return { ...DEF, ...p, photo }; }
  catch (e) { return { ...DEF, photo: null }; }
}
function bqInitials(p) {
  const f = (p.first || '').trim()[0] || '';
  const l = (p.last || '').trim()[0] || '';
  const j = (f + l) || ((p.display || 'U').trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join(''));
  return (j || 'U').toUpperCase();
}
function bqSaveProfile(patch) {
  const cur = bqReadProfile();
  const next = { ...cur, ...patch };
  // keep display name coherent if first/last changed and display wasn't explicitly set in this patch
  if ((patch.first !== undefined || patch.last !== undefined) && patch.display === undefined) {
    if (cur.display === ((cur.first || '') + ' ' + (cur.last || '')).trim()) next.display = ((next.first || '') + ' ' + (next.last || '')).trim();
  }
  const { photo, ...store } = next;
  try { localStorage.setItem(window.bqNsKey('bq-profile'), JSON.stringify(store)); } catch (e) {}
  window.dispatchEvent(new Event('bq-profile-change'));
  return next;
}
window.__bqProfile = { get: bqReadProfile, set: bqSaveProfile, initials: bqInitials };
// ── company / lead identity as a single source of truth (Profile → every surface) ──
function bqCompany() { const c = (bqReadProfile().company || '').trim(); if (c) return c; return (window.bqClean && window.bqClean()) ? 'Solid Remodel' : 'Hartwell Builders'; }
function bqCompanyInitials() { const p = bqCompany().trim().split(/\s+/).filter(Boolean); return (((p[0] ? p[0][0] : '') + (p[1] ? p[1][0] : '')).toUpperCase()) || 'CO'; }
function bqLeadName() { const d = (bqReadProfile().display || '').trim(); return (d && d !== 'Owner') ? d : bqCompany(); }
window.bqCompany = bqCompany; window.bqCompanyInitials = bqCompanyInitials; window.bqLeadName = bqLeadName;
function useBqProfile() {
  const [p, setP] = React.useState(bqReadProfile);
  React.useEffect(() => {
    const h = () => setP(bqReadProfile());
    window.addEventListener('bq-profile-change', h);
    window.addEventListener('bq-photo-change', h);
    window.addEventListener('storage', h);
    return () => { window.removeEventListener('bq-profile-change', h); window.removeEventListener('bq-photo-change', h); window.removeEventListener('storage', h); };
  }, []);
  return p;
}
window.useBqProfile = useBqProfile;

function BqAvatar({ size = 34, fontSize, style }) {
  const prof = useBqProfile();
  const photo = prof.photo;
  return (
    <span className="bq-avatar" style={{ width: size, height: size, fontSize: fontSize || Math.round(size * 0.4), overflow: 'hidden', background: photo ? 'transparent' : undefined, flex: 'none', ...style }}>
      {photo ? <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}></img> : bqInitials(prof)}
    </span>
  );
}
window.BqAvatar = BqAvatar;

function BqTop({ crumb, right }) {
  const [bell, setBell] = React.useState(false);
  const [menu, setMenu] = React.useState(false);
  window.bqUseNewClients && window.bqUseNewClients();
  window.useBqNotifTick && window.useBqNotifTick();
  const acts = window.bqProj ? window.bqProj.actives() : [];
  let NOTIFS;
  if (acts.length) {
    NOTIFS = [];
    acts.forEach((x) => {
      const nm = window.bqProj.shortName(x.client, x.project);
      (x.project.cos || []).filter((co) => co.status === 'sent').forEach((co) => NOTIFS.push({ g: 'co', tone: 'ai', unread: true, body: nm + ': ' + co.t + ' awaiting client sign-off (+$' + Number(co.price || 0).toLocaleString() + ').', who: 'Change order', time: 'just now', go: 'Project Workspace', pid: x.project.id }));
      (x.project.draws || []).filter((d) => d.status === 'due').forEach((d) => NOTIFS.push({ g: 'invoice', tone: 'warn', unread: true, body: nm + ': ' + d.t + ' is due ($' + Number(d.amount || 0).toLocaleString() + ').', who: 'Payment', time: 'today', go: 'Invoices' }));
      const nextMs = (x.project.milestones || []).find((m) => !m.done);
      if (nextMs) NOTIFS.push({ g: 'cal', tone: 'muted', unread: false, body: nm + ': next up - ' + nextMs.t + '.', who: 'Schedule', time: 'today', go: 'Project Workspace', pid: x.project.id });
    });
    (window.bqProj.subTasks ? window.bqProj.subTasks() : []).filter((t) => !t.done).forEach((t) => NOTIFS.push({ g: 'task', tone: 'ai', unread: true, body: t.proj + ': sub task “' + t.t + '” assigned.', who: 'Task', time: 'today', go: 'Tasks' }));
  } else {
    NOTIFS = bqSample((typeof BQ_NOTIFS !== 'undefined') ? BQ_NOTIFS : []);
  }
  // apply persistent read/dismiss state so "new" count and mark-read survive reload
  NOTIFS = NOTIFS.map((n) => { const id = n.id || (n.g + '|' + n.body); const read = window.bqNotif && window.bqNotif.isRead(id); const dismissed = window.bqNotif && window.bqNotif.isDismissed(id); return { ...n, id, _dismissed: dismissed, unread: n.unread && !read }; }).filter((n) => !n._dismissed);
  const unread = NOTIFS.filter((n) => n.unread).length;
  // breadcrumb: parent nav group (from the sidebar structure) › page path.
  // read the live screen from the synchronously-persisted nav (window.__bqScreen is set in an effect, so it lags a render).
  let bcScreen = window.__bqScreen;
  try { const nv = JSON.parse(localStorage.getItem(window.bqNsKey('bq-proto-nav'))); if (nv && nv.side === 'builder' && nv.screen) bcScreen = nv.screen; } catch (e) {}
  let bcSegs = crumb ? String(crumb).split(' / ') : [];
  if (typeof BQ_NAV_GROUPS !== 'undefined' && bcScreen) {
    const g = BQ_NAV_GROUPS.find((gr) => gr.label && bqNavAll(gr).some((it) => it[0] === bcScreen));
    if (g && bcSegs[0] !== g.label) bcSegs = [g.label].concat(bcSegs);
  }
  return (
    <div className="bq-top">
      <span className="bq-logomark"><BqIcon d={BQ_GLYPH.hammer} size={16} sw={1.8} style={{ color: '#fff' }}></BqIcon></span>
      <span className="bq-wordmark">Builder<span className="iq">IQ</span></span>
      {bcSegs.length ? (
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
          {bcSegs.map((s, i) => (
            <React.Fragment key={i}>
              <BqIcon d="M9 6 L15 12 L9 18" size={11} sw={2} style={{ color: 'var(--bq-border-strong)', flex: 'none' }}></BqIcon>
              <span style={{ fontSize: 13, fontWeight: i === bcSegs.length - 1 ? 600 : 500, color: i === bcSegs.length - 1 ? 'var(--bq-ink)' : 'var(--bq-faint)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s}</span>
            </React.Fragment>
          ))}
        </span>
      ) : null}
      <span style={{ flex: 1 }}></span>
      {right}
      <button className="bq-search" onClick={() => window.__bqCmdOpen && window.__bqCmdOpen()} style={{ border: 'none', cursor: 'pointer', font: 'inherit' }}>
        <BqIcon d={BQ_GLYPH.search} size={14}></BqIcon>
        <span style={{ flex: 1, textAlign: 'left' }}>Search or ask…</span>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--bq-faint)', background: 'var(--bq-card)', borderRadius: 5, padding: '1px 5px', boxShadow: 'inset 0 0 0 1px var(--bq-border)' }}>⌘K</span>
      </button>
      <button onClick={() => window.__bqToggleDark && window.__bqToggleDark()} title="Toggle dark mode" aria-label="Toggle dark mode" style={{ width: 34, height: 34, borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--bq-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bq-subtle)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
        <BqIcon d={window.__bqDark ? BQ_GLYPH.sun : BQ_GLYPH.moon} size={18}></BqIcon>
      </button>
      <div style={{ position: 'relative' }}>
        <button data-bq-bell onClick={() => setBell((b) => !b)} aria-label="Notifications" style={{ width: 34, height: 34, borderRadius: 10, border: 'none', cursor: 'pointer', background: bell ? 'var(--bq-subtle)' : 'transparent', color: 'var(--bq-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <BqIcon d={BQ_GLYPH.bell} size={18}></BqIcon>
          {unread ? <span style={{ position: 'absolute', top: 5, right: 6, minWidth: 15, height: 15, padding: '0 4px', borderRadius: 999, background: 'var(--bq-brand)', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 2px var(--bq-card)' }}>{unread}</span> : null}
        </button>
        {bell ? <BqNotifPanel notifs={NOTIFS} onClose={() => setBell(false)}></BqNotifPanel> : null}
      </div>
      <div style={{ position: 'relative' }}>
        <button onClick={() => setMenu((m) => !m)} aria-label="Account menu" style={{ border: 'none', cursor: 'pointer', padding: 0, background: 'transparent', borderRadius: '50%', display: 'flex', boxShadow: menu ? '0 0 0 2px var(--bq-brand)' : 'none' }}><BqAvatar size={34}></BqAvatar></button>
        {menu ? <BqProfileMenu onClose={() => setMenu(false)}></BqProfileMenu> : null}
      </div>
    </div>
  );
}

function BqProfileMenu({ onClose }) {
  const [signout, setSignout] = React.useState(false);
  const [reset, setReset] = React.useState(false);
  const prof = useBqProfile();
  const dark = !!window.__bqDark;
  const go = (tab) => { window.__bqProfileTab = tab; window.__bqNav && window.__bqNav('My Profile'); onClose(); };
  const links = [
    ['Your profile', 'leads', 'profile'],
    ['Account & security', 'key', 'security'],
    ['Notifications', 'bell', 'notifications'],
    ['Preferences', 'select', 'preferences'],
  ];
  const item = { boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 10, width: '100%', minWidth: 0, textAlign: 'left', padding: '9px 12px', borderRadius: 9, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', color: 'var(--bq-ink)' };
  return (
    <React.Fragment>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 40 }}></div>
      <div className="bq-card-s" style={{ position: 'absolute', top: 44, right: 0, width: 280, zIndex: 41, padding: 0, overflow: 'hidden', boxShadow: '0 12px 32px rgba(38,35,30,0.18), 0 0 0 1px var(--bq-border)' }}>
        {signout ? (
          <div style={{ padding: '18px 18px 16px' }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 6 }}>Sign out of BuilderIQ?</div>
            <div style={{ fontSize: 12.5, color: 'var(--bq-muted)', lineHeight: 1.45, marginBottom: 14 }}>You’ll need to sign back in to access your projects.</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 9 }}>
              <button className="bq-btn ghost sm" onClick={() => setSignout(false)}>Cancel</button>
              <button className="bq-btn sm" style={{ background: 'var(--bq-brand-strong)', color: '#fff', boxShadow: 'none' }} onClick={onClose}>Sign out</button>
            </div>
          </div>
        ) : reset ? (
          <div style={{ padding: '18px 18px 16px' }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 6 }}>Reset demo data?</div>
            <div style={{ fontSize: 12.5, color: 'var(--bq-muted)', lineHeight: 1.45, marginBottom: 14 }}>Clears every client, project, estimate, and edit you’ve made in this demo and reloads with the original sample data. This can’t be undone.</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 9 }}>
              <button className="bq-btn ghost sm" onClick={() => setReset(false)}>Cancel</button>
              <button className="bq-btn sm" style={{ background: 'var(--bq-brand-strong)', color: '#fff', boxShadow: 'none' }} onClick={() => window.bqResetDemo && window.bqResetDemo()}>Reset demo</button>
            </div>
          </div>
        ) : (
          <React.Fragment>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '15px 16px', borderBottom: '1px solid var(--bq-border)' }}>
              <BqAvatar size={44} fontSize={16} style={{ background: '#C8741A', color: '#fff' }}></BqAvatar>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{prof.display}</div>
                <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prof.email}</div>
                <div style={{ display: 'flex', gap: 5, marginTop: 5 }}><span className="bq-chip">Owner</span><span className="bq-chip ai">Admin</span></div>
              </div>
            </div>
            <div style={{ padding: 6 }}>
              {links.map(([lbl, g, tab]) => (
                <button key={tab} onClick={() => go(tab)} style={item} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bq-subtle)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <BqIcon d={BQ_GLYPH[g]} size={16} style={{ color: 'var(--bq-muted)', flex: 'none' }}></BqIcon>{lbl}
                </button>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--bq-border)', padding: 6 }}>
              <div style={{ ...item, cursor: 'default' }}>
                <BqIcon d={dark ? BQ_GLYPH.sun : BQ_GLYPH.moon} size={16} style={{ color: 'var(--bq-muted)', flex: 'none' }}></BqIcon>
                <span style={{ flex: 1 }}>Dark mode</span>
                <button onClick={() => window.__bqToggleDark && window.__bqToggleDark()} style={{ width: 38, height: 22, borderRadius: 999, border: 'none', cursor: 'pointer', flex: 'none', background: dark ? 'var(--bq-brand)' : 'var(--bq-border-strong)', position: 'relative' }}><span style={{ position: 'absolute', top: 2, left: dark ? 18 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .15s' }}></span></button>
              </div>
              <button onClick={() => { window.__bqNav && window.__bqNav('Team'); onClose(); }} style={item} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bq-subtle)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <BqIcon d={BQ_GLYPH.partners} size={16} style={{ color: 'var(--bq-muted)', flex: 'none' }}></BqIcon>Team &amp; company
              </button>
              <button onClick={() => { onClose(); window.bqStartTour && window.bqStartTour(); }} style={item} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bq-subtle)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <BqIcon d={BQ_GLYPH.spark} size={16} style={{ color: 'var(--bq-muted)', flex: 'none' }}></BqIcon>Product tour
              </button>
              <button onClick={onClose} style={item} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bq-subtle)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <BqIcon d={BQ_GLYPH.docs} size={16} style={{ color: 'var(--bq-muted)', flex: 'none' }}></BqIcon>Help &amp; support
              </button>
            </div>
            <div style={{ borderTop: '1px solid var(--bq-border)', padding: 6 }}>
              <button onClick={() => setReset(true)} style={item} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bq-subtle)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <BqIcon d={BQ_GLYPH.history} size={16} style={{ color: 'var(--bq-muted)', flex: 'none' }}></BqIcon>Reset demo data
              </button>
              <button onClick={() => setSignout(true)} style={{ ...item, color: 'var(--bq-brand-strong)' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bq-subtle)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <BqIcon d="M9 4 H6 a1 1 0 0 0-1 1 V19 a1 1 0 0 0 1 1 H9 M14 8 L18 12 L14 16 M18 12 H9" size={16} sw={1.8} style={{ flex: 'none' }}></BqIcon>Sign out
              </button>
            </div>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  );
}

function BqNotifPanel({ notifs, onClose }) {
  const [done, setDone] = React.useState({});
  const NOTIF_ACT = { select: 'Review', co: 'Send', invoice: 'Remind', task: 'Open', cal: 'View', expense: 'Review' };
  const toneColor = (t) => ({ ai: 'var(--bq-ai)', warn: 'var(--bq-brand)', good: 'var(--bq-good)', muted: 'var(--bq-faint)' }[t] || 'var(--bq-muted)');
  return (
    <React.Fragment>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 40 }}></div>
      <div className="bq-card-s" style={{ position: 'absolute', top: 42, right: 0, width: 340, zIndex: 41, padding: 0, overflow: 'hidden', boxShadow: '0 12px 32px rgba(38,35,30,0.18), 0 0 0 1px var(--bq-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 16px', borderBottom: '1px solid var(--bq-border)' }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
          <span className="bq-chip ai">{notifs.filter((n) => n.unread).length} new</span>
          <button onClick={() => { window.bqNotif && window.bqNotif.markAllRead(notifs.map((n) => n.id)); onClose(); }} style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: 'var(--bq-brand-strong)', cursor: 'pointer', border: 'none', background: 'transparent', fontFamily: 'inherit', padding: 0 }}>Mark all read</button>
        </div>
        <div style={{ maxHeight: 420, overflow: 'auto' }}>
          {!notifs.length ? <div style={{ padding: '26px 16px', textAlign: 'center', fontSize: 13, color: 'var(--bq-faint)' }}>You're all caught up.</div> : null}
          {notifs.map((n, i) => {
            if (done[i]) return null;
            const label = NOTIF_ACT[n.g] || 'Open';
            const goNow = () => { if (window.bqNotif && n.id) window.bqNotif.markRead(n.id); if (n.pid) window.__bqCustomProject = n.pid; if (n.go) window.__bqNav && window.__bqNav(n.go); onClose(); };
            return (
              <div key={i} style={{ display: 'flex', gap: 11, padding: '12px 16px', borderTop: i ? '1px solid var(--bq-border)' : 'none', background: n.unread ? 'var(--bq-ai-soft)' : 'transparent' }}>
                <span style={{ width: 30, height: 30, borderRadius: 9, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-raise)', color: toneColor(n.tone), boxShadow: 'inset 0 0 0 1px var(--bq-border)' }}><BqIcon d={BQ_GLYPH[n.g] || BQ_GLYPH.bell} size={15}></BqIcon></span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div onClick={goNow} style={{ cursor: 'pointer' }}>
                    <div style={{ fontSize: 13, color: 'var(--bq-ink)', lineHeight: 1.4 }}>{n.body}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', marginTop: 2 }}>{n.who} · {n.time}</div>
                  </div>
                  {n.unread ? (
                    <div style={{ display: 'flex', gap: 7, marginTop: 8 }}>
                      <button className="bq-btn primary sm" style={{ padding: '4px 12px' }} onClick={goNow}>{label}</button>
                      <button className="bq-btn ghost sm" style={{ padding: '4px 10px' }} onClick={() => { if (window.bqNotif && n.id) window.bqNotif.dismiss(n.id); setDone((d) => ({ ...d, [i]: true })); }}>Snooze</button>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );
}

const BQ_NAV_GROUPS = [
  { items: [['Dashboard', 'home'], ['Portfolio', 'trend']] },
  { label: 'Pipeline', items: [['Leads', 'leads'], ['Sales Pipeline', 'board'], ['Clients', 'clients'], ['Estimates', 'estimate'], ['Proposals', 'proposal'], ['Client view', 'globe'], ['Marketing', 'megaphone'], ['Follow-ups', 'send'], ['Cost Catalog', 'catalog'], ['Takeoff', 'ruler']] },
  { label: 'Project', items: [['Projects', 'projects'], ['Schedule', 'cal'], ['Tasks', 'task'], ['Selections', 'select'], ['Change Orders', 'co'], ['Daily Logs', 'log'], ['Photos', 'photo'], ['Purchase Orders', 'po'], ['Procurement', 'cart'], ['Meetings', 'meet'], ['Capacity', 'gauge'], ['Time', 'clock'], ['Closeout', 'warranty']] },
  { label: 'Subs', items: [['Subs & Vendors', 'vendor'], ['Bid Requests', 'bid'], ['Sub access', 'hardhat']] },
  { label: 'Money', items: [['Invoices', 'invoice'], ['Expenses', 'expense'], ['WIP Report', 'ledger'], ['Forecast', 'trend'], ['Financing', 'finance']] },
  { label: 'Intelligence', items: [['Watchdog', 'watchdog'], ['AI Inbox', 'inbox'], ['Reports', 'reports'], ['Automations', 'automation']] },
  { label: 'Company', items: [['Team', 'partners'], ['Documents', 'docs'], ['Settings', 'gear']] },
];
function bqNavAll(grp) { return grp.items.concat(grp.more || []); }

// phone-only bottom tab bar — the primary Builder nav under ~620px (drawer moves to "More")
function BqMobileTabs({ screen, onGo, onMenu, alerts }) {
  const TABS = [
    ['Dashboard', 'home', 'Home'],
    ['Projects', 'projects', 'Projects'],
    ['Invoices', 'invoice', 'Money'],
    ['AI Inbox', 'inbox', 'Inbox'],
  ];
  const moreActive = !TABS.some((t) => t[0] === screen);
  return (
    <nav className="bq-mobiletabs" aria-label="Primary">
      {TABS.map(([name, g, lbl]) => {
        const on = screen === name;
        return (
          <button key={name} onClick={() => onGo(name)} aria-current={on ? 'page' : undefined} aria-label={lbl} style={{ flex: 1, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '7px 0 5px', color: on ? 'var(--bq-brand-strong)' : 'var(--bq-faint)', font: 'inherit', position: 'relative' }}>
            <span style={{ position: 'relative', display: 'flex' }}>
              <BqIcon d={BQ_GLYPH[g]} size={21} sw={on ? 2 : 1.7}></BqIcon>
              {alerts && alerts[name] ? <span style={{ position: 'absolute', top: -3, right: -5, minWidth: 7, height: 7, borderRadius: 999, background: 'var(--bq-brand)', boxShadow: '0 0 0 2px var(--bq-card)' }}></span> : null}
            </span>
            <span style={{ fontSize: 10.5, fontWeight: on ? 700 : 600 }}>{lbl}</span>
          </button>
        );
      })}
      <button onClick={onMenu} aria-label="More menu" aria-current={moreActive ? 'page' : undefined} style={{ flex: 1, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '7px 0 5px', color: moreActive ? 'var(--bq-brand-strong)' : 'var(--bq-faint)', font: 'inherit' }}>
        <BqIcon d="M4 7 H20 M4 12 H20 M4 17 H20" size={21} sw={moreActive ? 2.2 : 1.9}></BqIcon>
        <span style={{ fontSize: 10.5, fontWeight: moreActive ? 700 : 600 }}>More</span>
      </button>
    </nav>
  );
}

let bqSideScrollTop = 0;
function BqSide({ active, alerts }) {
  const labeled = BQ_NAV_GROUPS.filter((g) => g.label);
  const groupOf = (name) => { const g = labeled.find((gr) => bqNavAll(gr).some((it) => it[0] === name)); return g ? g.label : null; };
  const inMore = (gr, name) => (gr.more || []).some((it) => it[0] === name);
  const activeGroup = groupOf(active);
  const [open, setOpen] = React.useState(() => {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(window.bqNsKey('bq-nav-open'))); } catch (e) {}
    const set = new Set(Array.isArray(saved) ? saved : (activeGroup ? [activeGroup] : []));
    if (activeGroup) set.add(activeGroup);
    return set;
  });
  React.useEffect(() => {
    if (activeGroup) setOpen((prev) => prev.has(activeGroup) ? prev : new Set(prev).add(activeGroup));
  }, [active]);
  const toggle = (label) => setOpen((prev) => {
    const n = new Set(prev);
    n.has(label) ? n.delete(label) : n.add(label);
    try { localStorage.setItem(window.bqNsKey('bq-nav-open'), JSON.stringify([...n])); } catch (e) {}
    return n;
  });
  // secondary links live under a nested “More” reveal inside each group
  const [moreOpen, setMoreOpen] = React.useState(() => new Set());
  React.useEffect(() => { const g = labeled.find((gr) => inMore(gr, active)); if (g) setMoreOpen((p) => p.has(g.label) ? p : new Set(p).add(g.label)); }, [active]);
  const toggleMore = (label) => setMoreOpen((p) => { const n = new Set(p); n.has(label) ? n.delete(label) : n.add(label); return n; });
  const [collapsed, setCollapsed] = React.useState(() => { try { return localStorage.getItem(window.bqNsKey('bq-nav-collapsed')) === '1'; } catch (e) { return false; } });
  const toggleCollapse = () => setCollapsed((c) => { const n = !c; try { localStorage.setItem(window.bqNsKey('bq-nav-collapsed'), n ? '1' : '0'); } catch (e) {} return n; });
  const scrollRef = React.useRef(null);
  React.useLayoutEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = bqSideScrollTop; }, []);
  const Item = ([name, g]) => collapsed ? (
    <div key={name} className={'nav-it' + (name === active ? ' on' : '')} title={name} onClick={() => window.__bqNav && window.__bqNav(name)}>
      <BqIcon d={BQ_GLYPH[g]} size={17}></BqIcon>
      {alerts && alerts[name] ? <span className="nav-dot"></span> : null}
    </div>
  ) : (
    <div key={name} className={'nav-it' + (name === active ? ' on' : '')} onClick={() => window.__bqNav && window.__bqNav(name)}>
      <BqIcon d={BQ_GLYPH[g]} size={16}></BqIcon>
      <span style={{ flex: 1, fontWeight: 600 }}>{name}</span>
      {alerts && alerts[name] ? <span className="bq-chip ai" style={{ padding: '0 7px' }}>{alerts[name]}</span> : null}
    </div>
  );
  // sub links (a group's "More" items): indented under a rail, lighter, dot instead of icon
  const SubItem = ([name, g]) => (
    <div key={name} className={'nav-it nav-sub' + (name === active ? ' on' : '')} onClick={() => window.__bqNav && window.__bqNav(name)} style={{ paddingLeft: 14 }}>
      <span style={{ width: 16, display: 'flex', justifyContent: 'center', flex: 'none' }}><span style={{ width: 4, height: 4, borderRadius: '50%', background: name === active ? 'var(--bq-brand-strong)' : 'var(--bq-faint)' }}></span></span>
      <span style={{ flex: 1, fontSize: 12.5, fontWeight: name === active ? 600 : 500, color: name === active ? undefined : 'var(--bq-muted)' }}>{name}</span>
      {alerts && alerts[name] ? <span className="bq-chip ai" style={{ padding: '0 7px' }}>{alerts[name]}</span> : null}
    </div>
  );
  const collapseBtn = { width: 30, height: 30, borderRadius: 9, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--bq-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' };
  return (
    <nav className={'bq-side' + (collapsed ? ' collapsed' : '')} style={collapsed ? { width: 58 } : undefined}>
      <div ref={scrollRef} onScroll={(e) => { bqSideScrollTop = e.currentTarget.scrollTop; }} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: collapsed ? 2 : 1, minHeight: 0, paddingBottom: 8 }}>
        {collapsed
          ? BQ_NAV_GROUPS.map((grp, gi) => {
              const all = bqNavAll(grp);
              const hasActive = all.some((it) => it[0] === active);
              return (
                <div key={gi} style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: gi > 0 ? 6 : 0, paddingTop: gi > 0 ? 8 : 0, borderTop: gi > 0 ? '1px solid var(--bq-border)' : 'none' }}>
                  {grp.label ? <div title={grp.label} style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', color: hasActive ? 'var(--bq-brand-strong)' : 'var(--bq-faint)', textAlign: 'center', lineHeight: 1.15, padding: '0 2px 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{grp.label}</div> : null}
                  {all.map(Item)}
                </div>
              );
            })
          : BQ_NAV_GROUPS.map((grp, gi) => {
              if (!grp.label) return grp.items.map(Item);
              const isOpen = open.has(grp.label);
              const all = bqNavAll(grp);
              const groupAlerts = all.reduce((s, it) => s + (alerts && alerts[it[0]] ? (parseInt(alerts[it[0]], 10) || 1) : 0), 0);
              const hasActive = all.some((it) => it[0] === active);
              const moreShown = moreOpen.has(grp.label);
              const moreAlerts = (grp.more || []).reduce((s, it) => s + (alerts && alerts[it[0]] ? (parseInt(alerts[it[0]], 10) || 1) : 0), 0);
              return (
                <div key={gi} style={{ marginTop: gi > 1 ? 4 : 0 }}>
                  <button onClick={() => toggle(grp.label)} style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', border: 'none', background: isOpen ? 'var(--bq-subtle)' : 'transparent', cursor: 'pointer', padding: '7px 12px', borderRadius: 9, fontFamily: 'inherit', transition: 'background .12s' }}>
                    <span style={{ flex: 1, textAlign: 'left', fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: hasActive ? 'var(--bq-brand-strong)' : isOpen ? 'var(--bq-muted)' : 'var(--bq-faint)' }}>{grp.label}</span>
                    {!isOpen && groupAlerts ? <span className="bq-chip ai" style={{ padding: '0 6px', fontSize: 10 }}>{groupAlerts}</span> : null}
                    <BqIcon d="M6 9 L12 15 L18 9" size={13} sw={2.2} style={{ color: 'var(--bq-faint)', transform: isOpen ? 'none' : 'rotate(-90deg)', transition: 'transform .15s' }}></BqIcon>
                  </button>
                  {isOpen ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {grp.items.map(Item)}
                      {moreShown && grp.more && grp.more.length ? (
                        <div style={{ marginLeft: 20, paddingLeft: 6, borderLeft: '1.5px solid var(--bq-border)', display: 'flex', flexDirection: 'column', gap: 1, marginTop: 2 }}>
                          {grp.more.map(SubItem)}
                        </div>
                      ) : null}
                      {grp.more && grp.more.length ? (
                        <div onClick={() => toggleMore(grp.label)} title={moreShown ? 'Show less' : 'Show more'} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', margin: '1px 0', borderRadius: 10, cursor: 'pointer', color: 'var(--bq-faint)', fontSize: 12.5, fontWeight: 600 }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bq-subtle)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                          <span style={{ width: 16, display: 'flex', justifyContent: 'center', flex: 'none' }}><BqIcon d="M6 9 L12 15 L18 9" size={13} sw={2.2} style={{ transform: moreShown ? 'rotate(180deg)' : 'none', transition: 'transform .15s' }}></BqIcon></span>
                          <span style={{ flex: 1 }}>{moreShown ? 'Show less' : 'More'}</span>
                          {!moreShown && moreAlerts ? <span className="bq-chip ai" style={{ padding: '0 6px' }}>{moreAlerts}</span> : <span style={{ fontSize: 11, color: 'var(--bq-faint)' }}>{moreShown ? '' : grp.more.length}</span>}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
      </div>
      <div style={{ padding: collapsed ? '10px 8px' : '10px 12px', flex: 'none', borderTop: '1px solid var(--bq-border)' }}>
        {collapsed ? (
          <button onClick={toggleCollapse} aria-label="Expand sidebar" title="Expand sidebar" style={{ ...collapseBtn, width: '100%' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bq-subtle)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            <BqIcon d="M13 6 L19 12 L13 18 M5 6 L11 12 L5 18" size={16} sw={2}></BqIcon>
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ flex: 1, fontSize: 11.5, color: 'var(--bq-faint)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{window.bqCompany()} · Pro plan</span>
            <button onClick={toggleCollapse} aria-label="Collapse sidebar" title="Collapse sidebar" style={collapseBtn} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bq-subtle)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <BqIcon d="M11 6 L5 12 L11 18 M19 6 L13 12 L19 18" size={16} sw={2}></BqIcon>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

const BQ_CMD_AI = [
  ['Create a change order for added recessed lights in the kitchen', 'co', 'Change Orders', 'Drafts a CO - you review before sending'],
  ['Show projects with margin under 25%', 'watchdog', 'Watchdog', 'Filters the profit watchdog'],
  ['Find overdue selections', 'select', 'Selections', '2 results'],
  ['Draft a client update for the Henderson project', 'spark', 'Weekly Update', 'Opens the weekly update writer'],
  ['Send the Henderson tile selection a booking link', 'meet', 'Meetings', 'Drafts a booking invite'],
  ['Draft a framing RFQ from the Henderson estimate', 'bid', 'Bid Requests', 'Builds a bid request to send to subs'],
];
const BQ_CMD_NAV = [
  ['Henderson - Kitchen + Hall Bath', 'projects', 'Projects', 'Project'],
  ['Profit Watchdog', 'watchdog', 'Watchdog', 'Module'],
  ['Change order leakage', 'spark', 'Change Order Leakage', 'AI scan'],
  ['Integration marketplace', 'plug', 'Integrations', 'Platform'],
  ['Developer portal & API keys', 'code', 'Developers', 'Platform'],
  ['QuickBooks Online sync', 'bank', 'Developers', 'Platform'],
  ['Roles & permissions', 'key', 'Permissions', 'Platform'],
  ['Team & users - invite, roles, admins', 'partners', 'Team', 'Platform'],
  ['Partner accounts', 'partners', 'Partners', 'Platform'],
  ['Vertical templates', 'template', 'Settings', 'Platform'],
  ['Reports & dashboards', 'reports', 'Reports', 'Module'],
  ['Warranty & closeout', 'warranty', 'Closeout', 'Module'],
  ['Subcontractors & vendors', 'vendor', 'Subs & Vendors', 'Subs'],
  ['Purchase orders', 'po', 'Purchase Orders', 'Project'],
  ['Crew time tracking', 'clock', 'Time', 'Module'],
  ['Lead capture widget', 'leads', 'Leads', 'Pipeline'],
  ['Documents & e-signature vault', 'docs', 'Documents', 'Company'],
  ['Client financing offers', 'finance', 'Financing', 'Money'],
  ['Bid requests / RFQs to subs', 'bid', 'Bid Requests', 'Subs'],
  ['Client meetings & booking links', 'meet', 'Meetings', 'Project'],
  ['Sales pipeline - kanban board', 'board', 'Sales Pipeline', 'Pipeline'],
  ['Marketing - lead source ROI', 'megaphone', 'Marketing', 'Pipeline'],
  ['Follow-up sequences / drip', 'send', 'Follow-ups', 'Pipeline'],
  ['Cost catalog / price book', 'catalog', 'Cost Catalog', 'Pipeline'],
  ['Plan takeoff - measure quantities', 'ruler', 'Takeoff', 'Pipeline'],
  ['WIP / over-under billing report', 'ledger', 'WIP Report', 'Money'],
  ['Backlog & revenue forecast', 'trend', 'Forecast', 'Money'],
  ['Crew capacity & scheduling', 'gauge', 'Capacity', 'Project'],
  ['Material procurement & ordering', 'cart', 'Procurement', 'Project'],
  ['Getting started / setup', 'rocket', 'Setup', 'Platform'],
  ['Billing & subscription plan', 'pay', 'Billing', 'Platform'],
  ['Audit log - activity history', 'history', 'Audit Log', 'Platform'],
];
// clean build: generic AI command suggestions (no sample client names)
const BQ_CMD_AI_CLEAN = [
  ['Draft a change order', 'co', 'Change Orders', 'Drafts a CO - you review before sending'],
  ['Show projects with margin under 25%', 'watchdog', 'Watchdog', 'Filters the profit watchdog'],
  ['Find overdue selections', 'select', 'Selections', 'Scans your projects'],
  ['Draft a weekly client update', 'spark', 'Weekly Update', 'Opens the weekly update writer'],
  ['Draft an RFQ to send to subs', 'bid', 'Bid Requests', 'Builds a bid request'],
];

function BqCommand({ onClose }) {
  const [q, setQ] = React.useState('');
  const [draft, setDraft] = React.useState(null);
  const [drafting, setDrafting] = React.useState(false);
  const openDraft = (r) => { setDraft(r); setDrafting(true); setTimeout(() => setDrafting(false), 750); };
  const DRAFT_BODY = {
    'Change Orders': 'CO #5 - Recessed lights, kitchen\n\nFurnish & install six 4" LED cans on a dimmer, incl. wiring, patch and paint. Adds ~1 day.\nPrice: $1,920 · 28% margin. Ready for you to review and send.',
    'Watchdog': '3 jobs under 25% margin: Delgado 18.6%, Henderson 19.4%, Whitaker 21.0%.\nBiggest driver - Delgado structural cost code is 8% over the revised budget.',
    'Selections': '2 overdue selections:\n• Henderson - hall-bath faucet (4 days late)\n• Tanaka - floor tile (2 days late)\nDraft nudges are ready to send to both clients.',
    'Weekly Update': 'Henderson - Week 6\nKitchen wall tile is up and grouted; the hall bath is waterproofed and ready for tile Monday. Electrical rough-in passed on the first inspection. Cabinets arrive Tuesday.',
    'Meetings': 'Booking invite - Henderson tile selection\n3 proposed times this week (30 min, showroom) ready to send to Dan & Priya.',
    'Bid Requests': 'Framing RFQ - Henderson\nScope pulled from the estimate: LVL beam at the kitchen opening, blocking, and shear. Ready to send to 3 framing subs.',
  };
  const bqDraftBody = (r) => (window.bqClean() ? null : DRAFT_BODY[r[2]]) || ('Here\'s a draft based on “' + r[0] + '”. Review the details below, then open it to finish and send.');
  const ql = q.toLowerCase();
  const clean = window.bqClean();
  const ai = (clean ? BQ_CMD_AI_CLEAN : BQ_CMD_AI).filter((r) => !q || r[0].toLowerCase().includes(ql));
  // live records from the store - real clients & active projects, searchable by name
  const liveNav = [];
  if (window.bqProj) {
    (window.bqProj.actives() || []).forEach((x) => liveNav.push({ label: window.bqProj.shortName(x.client, x.project), glyph: 'projects', cat: 'Project', pid: x.project.id }));
  }
  if (window.bqStore) {
    (window.bqStore.read() || []).forEach((c) => liveNav.push({ label: c.name, glyph: 'clients', cat: 'Client', screen: 'Clients', cid: c.id }));
  }
  if (window.bqProj) {
    (window.bqProj.list() || []).forEach((x) => {
      const nm = window.bqProj.shortName(x.client, x.project);
      (x.project.cos || []).forEach((co) => liveNav.push({ label: (co.t || 'Change order') + ' · ' + nm, glyph: 'co', cat: 'Change order', screen: 'Change Orders' }));
      (x.project.draws || []).filter((d) => d.status === 'due' || d.status === 'overdue').forEach((d) => liveNav.push({ label: (d.t || 'Invoice') + ' · ' + nm, glyph: 'invoice', cat: 'Invoice', screen: 'Invoices' }));
    });
  }
  const liveMatches = liveNav.filter((r) => !q || r.label.toLowerCase().includes(ql) || r.cat.toLowerCase().includes(ql));
  const nav = (clean ? BQ_CMD_NAV.filter((r) => !(r[2] === 'Projects' && r[3] === 'Project')) : BQ_CMD_NAV).filter((r) => !q || r[0].toLowerCase().includes(ql) || r[3].toLowerCase().includes(ql));
  const goTo = (screen) => { window.__bqNav && window.__bqNav(screen); onClose(); };
  const goLive = (r) => { if (r.pid) { window.__bqCustomProject = r.pid; window.__bqNav && window.__bqNav('Project Workspace'); } else { if (r.cid) window.__bqOpenClient = r.cid; window.__bqNav && window.__bqNav(r.screen || 'Clients'); } onClose(); };
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(38,35,30,0.35)', zIndex: 60, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '10vh' }}>
      <div onClick={(e) => e.stopPropagation()} className="bq-card-s" role="dialog" aria-modal="true" aria-label="Search and commands" style={{ width: 'min(620px, 92%)', overflow: 'hidden', boxShadow: '0 24px 60px rgba(38,35,30,0.28), 0 0 0 1px var(--bq-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid var(--bq-border)' }}>
          <BqIcon d={BQ_GLYPH.search} size={17} style={{ color: 'var(--bq-faint)' }}></BqIcon>
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects, contacts, invoices… or ask BuilderIQ" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', font: 'inherit', fontSize: 15, color: 'var(--bq-ink)' }}></input>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--bq-faint)', background: 'var(--bq-subtle)', borderRadius: 5, padding: '2px 6px' }}>Esc</span>
        </div>
        <div style={{ maxHeight: '52vh', overflow: 'auto', padding: '8px 8px 10px' }}>
          {draft ? (
            <div style={{ padding: '6px 8px 4px' }}>
              <button onClick={() => setDraft(null)} className="bq-btn ghost sm" style={{ marginBottom: 10 }}><BqIcon d="M15 5 L8 12 L15 19" size={15}></BqIcon>Back to results</button>
              <div className="bq-ai-card" style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><BqSpark size={13}></BqSpark><span style={{ fontWeight: 700, fontSize: 13, color: 'var(--bq-ai-strong)' }}>{draft[0]}</span></div>
                {drafting ? (
                  <div style={{ display: 'flex', gap: 4, padding: '8px 0' }}>{[0, 1, 2].map((d) => <span key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--bq-ai-strong)', animation: 'bqpulse 1s infinite', animationDelay: (d * 0.18) + 's' }}></span>)}</div>
                ) : (
                  <div style={{ fontSize: 13, color: 'var(--bq-ink)', lineHeight: 1.55, whiteSpace: 'pre-line' }}>{bqDraftBody(draft)}</div>
                )}
              </div>
              {!drafting ? (
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button className="bq-btn ai" onClick={() => goTo(draft[2])}><BqIcon d={BQ_GLYPH.exports} size={14}></BqIcon>Open in {draft[2]}</button>
                  <button className="bq-btn soft-ai sm" onClick={() => { setDrafting(true); setTimeout(() => setDrafting(false), 700); }}>Regenerate</button>
                </div>
              ) : null}
            </div>
          ) : (
          <React.Fragment>
          {ai.length ? <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', color: 'var(--bq-ai-strong)', padding: '8px 12px 4px', display: 'flex', alignItems: 'center', gap: 6 }}><BqSpark size={11}></BqSpark>Ask BuilderIQ</div> : null}
          {ai.map((r, i) => (
            <button key={i} onClick={() => openDraft(r)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 11, border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bq-ai-soft)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <span style={{ width: 28, height: 28, borderRadius: 8, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-ai-soft)', color: 'var(--bq-ai-strong)' }}><BqIcon d={BQ_GLYPH[r[1]]} size={15}></BqIcon></span>
              <span style={{ flex: 1 }}><span style={{ display: 'block', fontSize: 13.5, color: 'var(--bq-ink)', fontWeight: 500 }}>{r[0]}</span><span style={{ display: 'block', fontSize: 11.5, color: 'var(--bq-faint)' }}>{r[3]}</span></span>
              <span className="bq-chip ai">Draft</span>
            </button>
          ))}
          {liveMatches.length ? <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', color: 'var(--bq-faint)', padding: '12px 12px 4px' }}>Your records</div> : null}
          {liveMatches.map((r, i) => (
            <button key={'live' + i} onClick={() => goLive(r)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 11, border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bq-subtle)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <span style={{ width: 28, height: 28, borderRadius: 8, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)' }}><BqIcon d={BQ_GLYPH[r.glyph]} size={15}></BqIcon></span>
              <span style={{ flex: 1, fontSize: 13.5, color: 'var(--bq-ink)' }}>{r.label}</span>
              <span className="bq-chip">{r.cat}</span>
            </button>
          ))}
          {nav.length ? <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', color: 'var(--bq-faint)', padding: '12px 12px 4px' }}>Jump to</div> : null}
          {nav.map((r, i) => (
            <button key={i} onClick={() => goTo(r[2])} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '9px 12px', borderRadius: 11, border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bq-subtle)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <span style={{ width: 28, height: 28, borderRadius: 8, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-subtle)', color: 'var(--bq-muted)' }}><BqIcon d={BQ_GLYPH[r[1]]} size={15}></BqIcon></span>
              <span style={{ flex: 1, fontSize: 13.5, color: 'var(--bq-ink)' }}>{r[0]}</span>
              <span className="bq-chip">{r[3]}</span>
            </button>
          ))}
          {!ai.length && !nav.length && !liveMatches.length ? <div style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--bq-faint)' }}>No matches. Try “margin”, “overdue”, or a project name.</div> : null}
          </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

function BqKPI({ label, value, sub, tone }) {
  const col = tone === 'warn' ? 'var(--bq-brand-strong)' : tone === 'ai' ? 'var(--bq-ai-strong)' : 'var(--bq-ink)';
  return (
    <div className="bq-card-s bq-kpi" style={{ flex: 1 }}>
      <span className="lab">{label}</span>
      <span className="val bq-num" style={{ color: col }}>{value}</span>
      {sub ? <span className="sub">{sub}</span> : null}
    </div>
  );
}

function BqMeter({ pct, tone, style }) {
  return (
    <div className="bq-meter" style={style}>
      <div className={tone || ''} style={{ width: Math.min(100, pct) + '%' }}></div>
    </div>
  );
}

function BqPh({ h, label, style }) {
  return (
    <div className="bq-ph" style={{ height: h, ...style }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <BqIcon d={BQ_GLYPH.camera} size={14}></BqIcon>{label || ''}
      </span>
    </div>
  );
}

// sample data
const BQ_NOTIFS = [
  { g: 'select', tone: 'ai', unread: true, body: 'Dan & Priya need to decide on the hall-bath tile selection.', who: 'Client decision', time: '12m ago', go: 'Selections' },
  { g: 'co', tone: 'warn', unread: true, body: 'Overdue selection: kitchen faucet options sent 4 days ago.', who: 'Reminder', time: '1h ago', go: 'Selections' },
  { g: 'task', tone: 'ai', unread: true, body: 'You were assigned “Confirm cabinet delivery window”.', who: 'Task assigned', time: '2h ago', go: 'Tasks' },
  { g: 'invoice', tone: 'warn', unread: false, body: 'INV-0004 is 9 days overdue ($4,480).', who: 'Henderson', time: 'Yesterday', go: 'Invoices' },
  { g: 'expense', tone: 'muted', unread: false, body: 'Budget variance: Structural cost code 8% over revised budget.', who: 'Watchdog', time: 'Yesterday', go: 'Projects' },
  { g: 'cal', tone: 'good', unread: false, body: 'Schedule changed: Countertop template moved +3 days.', who: 'Team', time: '2d ago', go: 'Schedule' },
];
const BQ_JOB = {
  name: 'Henderson - Kitchen + Hall Bath',
  client: 'Dan & Priya Henderson',
  total: 186400,
};

// ── cross-app event bus (client/sub apps → admin mirrors, via shared-origin localStorage) ──
function bqRel(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 45) return 'just now';
  const m = Math.floor(s / 60); if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60); if (h < 24) return h + 'h ago';
  return Math.floor(h / 24) + 'd ago';
}
function bqReadEvents(channel) {
  try { return JSON.parse(localStorage.getItem(window.bqNsKey('bq-events-' + channel))) || []; } catch (e) { return []; }
}
function bqLogEvent(channel, evt) {
  const key = window.bqNsKey('bq-events-' + channel);
  const list = bqReadEvents(channel);
  const item = { ...evt, ts: Date.now() };
  list.unshift(item);
  try { localStorage.setItem(key, JSON.stringify(list.slice(0, 40))); } catch (e) {}
  // storage event only fires in OTHER docs; dispatch locally too
  try { window.dispatchEvent(new CustomEvent('bqevent', { detail: { channel } })); } catch (e) {}
  return item;
}
function useBqEvents(channel) {
  const [events, setEvents] = React.useState(() => bqReadEvents(channel));
  React.useEffect(() => {
    const refresh = () => setEvents(bqReadEvents(channel));
    const onStorage = (e) => { if (!e.key || e.key === window.bqNsKey('bq-events-' + channel)) refresh(); };
    const onCustom = (e) => { if (e.detail && e.detail.channel === channel) refresh(); };
    window.addEventListener('storage', onStorage);
    window.addEventListener('bqevent', onCustom);
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('bqevent', onCustom); };
  }, [channel]);
  return events;
}

Object.assign(window, { bqMoney, BqIcon, BQ_GLYPH, BqSpark, BqTop, BqNotifPanel, BqSide, BqMobileTabs, BqCommand, BqKPI, BqMeter, BqPh, BQ_JOB, BQ_NOTIFS, bqRel, bqReadEvents, bqLogEvent, useBqEvents, BqEmpty, BqQuickForm, BqSelect });
