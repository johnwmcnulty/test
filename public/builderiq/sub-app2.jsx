// BuilderIQ Sub app - extended surfaces: Quotes, Payments, Compliance docs, Profile,
// + shared modal/field primitives, Task detail modal, RFI modal, notifications.
// Money scope: a sub sees ONLY their own pricing/invoices. Client budgets & margins stay private.

const subMoney = (n) => '$' + Math.round(n).toLocaleString('en-US');

// ── scope lock note (shared) ──
function SubScopeNote({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5, color: 'var(--bq-muted)', background: 'var(--bq-subtle)', borderRadius: 12, padding: '10px 14px' }}>
      <BqIcon d="M7 11 V8 a5 5 0 0 1 10 0 V11 M5 11 H19 a1 1 0 0 1 1 1 V20 a1 1 0 0 1-1 1 H5 a1 1 0 0 1-1-1 V12 a1 1 0 0 1 1-1 Z" size={15} style={{ flex: 'none', color: 'var(--bq-faint)' }}></BqIcon>
      {text || "You only see what's assigned to you. Budgets, margins, pricing, and other clients stay private to Hartwell Builders."}
    </div>
  );
}

// ── modal shell (Escape + backdrop close) ──
function SubModal({ title, sub, onClose, children, footer, width, icon }) {
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div onMouseDown={onClose} style={{ position: 'fixed', inset: 0, zIndex: 120, background: 'rgba(38,35,30,0.42)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '6vh 16px', overflow: 'auto' }}>
      <div onMouseDown={(e) => e.stopPropagation()} className="bq-card-s" style={{ width: width || 560, maxWidth: '100%', background: 'var(--bq-card)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 24px 64px rgba(38,35,30,0.28)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '18px 20px', borderBottom: '1px solid var(--bq-border)' }}>
          {icon ? <span style={{ width: 38, height: 38, borderRadius: 11, flex: 'none', background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={icon} size={19}></BqIcon></span> : null}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="cl-h" style={{ fontSize: 19 }}>{title}</div>
            {sub ? <div style={{ fontSize: 12.5, color: 'var(--bq-faint)', marginTop: 2 }}>{sub}</div> : null}
          </div>
          <button onClick={onClose} aria-label="Close" style={{ width: 32, height: 32, borderRadius: 9, border: 'none', cursor: 'pointer', background: 'var(--bq-subtle)', color: 'var(--bq-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={15} sw={2}></BqIcon></button>
        </div>
        <div style={{ padding: '18px 20px', overflow: 'auto' }}>{children}</div>
        {footer ? <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 9, padding: '14px 20px', borderTop: '1px solid var(--bq-border)', background: 'var(--bq-subtle)' }}>{footer}</div> : null}
      </div>
    </div>
  );
}

function SubLabel({ children }) { return <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-muted)', display: 'block', marginBottom: 6 }}>{children}</span>; }

function SubSelect({ value, options, onChange, width }) {
  const [open, setOpen] = React.useState(false);
  const [rect, setRect] = React.useState(null);
  const ref = React.useRef(null);
  const toggle = () => { if (!open && ref.current) setRect(ref.current.getBoundingClientRect()); setOpen((o) => !o); };
  React.useEffect(() => { if (!open) return; const c = () => setOpen(false); window.addEventListener('resize', c); return () => window.removeEventListener('resize', c); }, [open]);
  const menuH = Math.min(280, options.length * 38 + 8);
  let top = 0; if (rect) { const below = window.innerHeight - rect.bottom; top = (below < menuH + 16 && rect.top > menuH) ? rect.top - menuH - 4 : rect.bottom + 4; }
  return (
    <div style={{ position: 'relative', width: width || '100%' }}>
      <button ref={ref} onClick={toggle} className="cl-field" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, cursor: 'pointer', background: '#fff' }}>
        <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
        <BqIcon d="M6 9 L12 15 L18 9" size={14} sw={2} style={{ color: 'var(--bq-faint)', flex: 'none', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .12s' }}></BqIcon>
      </button>
      {open && rect ? (
        <React.Fragment>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 130 }}></div>
          <div style={{ position: 'fixed', top: top, left: rect.left, width: rect.width, maxHeight: menuH, overflowY: 'auto', zIndex: 131, background: 'var(--bq-card)', borderRadius: 11, boxShadow: '0 12px 30px rgba(38,35,30,0.22), 0 0 0 1px var(--bq-border)', padding: 4 }}>
            {options.map((o) => (
              <button key={o} onClick={() => { onChange(o); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', padding: '9px 11px', borderRadius: 8, border: 'none', background: o === value ? 'var(--bq-subtle)' : 'transparent', cursor: 'pointer', fontSize: 13.5, fontFamily: 'inherit', color: 'var(--bq-ink)' }}>
                <span style={{ flex: 1, minWidth: 0 }}>{o}</span>{o === value ? <BqIcon d={BQ_GLYPH.check} size={13} sw={2.4} style={{ color: 'var(--bq-brand-strong)' }}></BqIcon> : null}
              </button>
            ))}
          </div>
        </React.Fragment>
      ) : null}
    </div>
  );
}

// ── photo uploader (FileReader thumbnails) ──
function SubPhotoUpload({ photos, onAdd, onRemove, label }) {
  const ref = React.useRef(null);
  const pick = (e) => {
    const files = Array.from(e.target.files || []); e.target.value = '';
    files.forEach((file) => {
      if (!/^image\//.test(file.type)) return;
      const r = new FileReader(); r.onload = () => onAdd({ url: r.result, name: file.name }); r.readAsDataURL(file);
    });
  };
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 9 }}>
        {photos.map((p, i) => (
          <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 12, overflow: 'hidden', boxShadow: 'inset 0 0 0 1px var(--bq-border)' }}>
            <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }}></img>
            <button onClick={() => onRemove(i)} aria-label="Remove" style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'rgba(38,35,30,0.7)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={12} sw={2.4}></BqIcon></button>
          </div>
        ))}
        <button onClick={() => ref.current && ref.current.click()} style={{ aspectRatio: '1', borderRadius: 12, border: '1.5px dashed var(--bq-border-strong)', background: 'var(--bq-subtle)', color: 'var(--bq-muted)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, fontFamily: 'inherit' }}>
          <BqIcon d={BQ_GLYPH.camera} size={20}></BqIcon>{label || 'Add photo'}
        </button>
      </div>
      <input ref={ref} type="file" accept="image/*" multiple onChange={pick} style={{ display: 'none' }}></input>
    </div>
  );
}

// ════════════════════════════ QUOTES ════════════════════════════
const SUB_QUOTES0 = [
  { id: 'BR-204', t: 'Cloth-wiring remediation', proj: 'Henderson - Kitchen + Hall Bath', due: 'Jun 14', status: 'requested', note: 'Found cloth wiring behind the north kitchen wall during demo. Need remediation scoped + priced so we can write a change order with the client.', amount: null },
  { id: 'BR-198', t: 'Primary suite framing', proj: 'Osorio - Whole-home remodel', due: 'Jun 6', status: 'submitted', amount: 14200, note: 'Frame new primary suite walls + closet per plan A-3.', submittedOn: 'Jun 4' },
  { id: 'BR-191', t: 'Beam install - kitchen opening', proj: 'Henderson - Kitchen + Hall Bath', due: 'May 30', status: 'accepted', amount: 3800, note: 'Install LVL beam at kitchen / dining opening.', acceptedOn: 'May 28', wo: 'WO-118' },
  { id: 'BR-187', t: 'Hall-bath wall blocking', proj: 'Henderson - Kitchen + Hall Bath', due: 'May 22', status: 'declined', amount: 950, note: 'Add blocking for grab bars + vanity.' },
];
const QUOTE_STATUS = {
  requested: { label: 'Needs your quote', chip: 'brand' },
  submitted: { label: 'Awaiting review', chip: 'ai' },
  accepted: { label: 'Accepted', chip: 'good' },
  declined: { label: 'Not awarded', chip: '' },
};

function SubQuoteModal({ req, onClose, onSubmit }) {
  const [rows, setRows] = React.useState([{ d: '', qty: 1, unit: 'ea', rate: '' }]);
  const [notes, setNotes] = React.useState('');
  const set = (i, k, v) => setRows((rs) => rs.map((r, j) => j === i ? { ...r, [k]: v } : r));
  const addRow = () => setRows((rs) => [...rs, { d: '', qty: 1, unit: 'ea', rate: '' }]);
  const delRow = (i) => setRows((rs) => rs.length > 1 ? rs.filter((_, j) => j !== i) : rs);
  const total = rows.reduce((s, r) => s + (Number(r.qty) || 0) * (Number(r.rate) || 0), 0);
  const valid = total > 0 && rows.some((r) => r.d.trim());
  return (
    <SubModal width={620} icon={BQ_GLYPH.quotes} title={'Quote · ' + req.t} sub={req.proj + ' · ' + req.id} onClose={onClose}
      footer={<React.Fragment>
        <button className="bq-btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="bq-btn primary sm" disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }} onClick={() => onSubmit(total)}>Submit quote · {subMoney(total)}</button>
      </React.Fragment>}>
      <div style={{ background: 'var(--bq-subtle)', borderRadius: 12, padding: '12px 14px', fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5, marginBottom: 16 }}>{req.note}</div>
      <SubLabel>Line items</SubLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 54px 56px 84px 28px', gap: 8, fontSize: 10.5, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', color: 'var(--bq-faint)', padding: '0 2px' }}>
          <span>Description</span><span>Qty</span><span>Unit</span><span style={{ textAlign: 'right' }}>Rate</span><span></span>
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 54px 56px 84px 28px', gap: 8, alignItems: 'center' }}>
            <input className="cl-field" value={r.d} placeholder="Labor / material…" onChange={(e) => set(i, 'd', e.target.value)} style={{ padding: '8px 10px', fontSize: 13 }}></input>
            <input className="cl-field" value={r.qty} type="number" min="0" onChange={(e) => set(i, 'qty', e.target.value)} style={{ padding: '8px 8px', fontSize: 13, textAlign: 'center' }}></input>
            <input className="cl-field" value={r.unit} onChange={(e) => set(i, 'unit', e.target.value)} style={{ padding: '8px 8px', fontSize: 13, textAlign: 'center' }}></input>
            <input className="cl-field" value={r.rate} type="number" min="0" placeholder="0" onChange={(e) => set(i, 'rate', e.target.value)} style={{ padding: '8px 10px', fontSize: 13, textAlign: 'right' }}></input>
            <button onClick={() => delRow(i)} aria-label="Remove" style={{ width: 28, height: 28, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--bq-faint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d="M5 7 H19 M9 7 V5 H15 V7 M7 7 L8 20 H16 L17 7" size={15}></BqIcon></button>
          </div>
        ))}
      </div>
      <button className="bq-btn ghost sm" onClick={addRow} style={{ marginTop: 9 }}>+ Add line</button>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--bq-border)' }}>
        <span style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Quote total</span>
        <span className="bq-num" style={{ fontSize: 22, fontWeight: 700 }}>{subMoney(total)}</span>
      </div>
      <div style={{ marginTop: 16 }}>
        <SubLabel>Notes for the GC (optional)</SubLabel>
        <textarea className="cl-field" value={notes} rows={2} onChange={(e) => setNotes(e.target.value)} placeholder="Lead time, exclusions, assumptions…" style={{ resize: 'vertical', lineHeight: 1.5 }}></textarea>
      </div>
    </SubModal>
  );
}

function SubQuotes({ flash }) {
  const hasCustom = window.bqProj && window.bqProj.actives().length > 0;
  const [quotes, setQuotes] = window.bqPersistState(hasCustom ? 'sub-quotes-live' : 'sub-quotes', hasCustom ? [] : SUB_QUOTES0);
  const [active, setActive] = React.useState(null);
  const [filter, setFilter] = React.useState('All');
  const submit = (id, total) => {
    setQuotes((qs) => qs.map((q) => q.id === id ? { ...q, status: 'submitted', amount: total, submittedOn: 'Today' } : q));
    setActive(null);
    window.bqLogEvent && window.bqLogEvent('sub', { g: 'quotes', tone: 'ai', body: 'Submitted quote ' + id + ' - ' + subMoney(total), change: 'Sub submitted a quote: ' + subMoney(total) });
    flash('Quote submitted to Hartwell Builders');
  };
  const FILTERS = ['All', 'Needs quote', 'Submitted', 'Accepted'];
  const matches = (q) => filter === 'All' ? true : filter === 'Needs quote' ? q.status === 'requested' : filter === 'Submitted' ? q.status === 'submitted' : q.status === 'accepted';
  const shown = quotes.filter(matches);
  const need = quotes.filter((q) => q.status === 'requested').length;
  return (
    <div className="cl-wrap">
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div className="cl-h" style={{ fontSize: 26 }}>Quotes &amp; bids</div>
          <div style={{ color: 'var(--bq-muted)' }}>{need ? need + ' bid request' + (need > 1 ? 's' : '') + ' waiting on your price.' : 'Bid requests from Hartwell Builders.'}</div>
        </div>
        <div className="seg-toggle">{FILTERS.map((f) => <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>{f}</button>)}</div>
      </div>
      <SubScopeNote text="These are your prices for your scope. The client's budget and Hartwell's margins are never shown to you."></SubScopeNote>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {shown.map((q) => {
          const st = QUOTE_STATUS[q.status];
          return (
            <div key={q.id} className="bq-card-s" style={{ padding: '16px 18px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 700, lineHeight: 1.3 }}>{q.t}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--bq-faint)', marginTop: 3 }}>{q.proj} · {q.id} · due {q.due}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flex: 'none' }}>
                  {q.amount != null ? <span className="bq-num" style={{ fontSize: 20, fontWeight: 700 }}>{subMoney(q.amount)}</span> : null}
                  <span className={'bq-chip ' + st.chip}>{st.label}</span>
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5, marginTop: 10 }}>{q.note}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 13 }}>
                {q.status === 'requested' ? <button className="bq-btn primary sm" onClick={() => setActive(q)}><BqIcon d={BQ_GLYPH.quotes} size={14}></BqIcon>Submit quote</button> : null}
                {q.status === 'submitted' ? <React.Fragment><span style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>Sent {q.submittedOn} · under review</span><button className="bq-btn sm" onClick={() => setActive(q)} style={{ marginLeft: 'auto' }}>Revise</button></React.Fragment> : null}
                {q.status === 'accepted' ? <span style={{ display: 'inline-flex', alignItems: 'flex-start', gap: 7, fontSize: 12.5, color: 'var(--bq-good)', fontWeight: 600 }}><BqIcon d={BQ_GLYPH.check} size={14} sw={2.2} style={{ flex: 'none', marginTop: 1 }}></BqIcon><span>Awarded · converted to {q.wo}</span></span> : null}
                {q.status === 'declined' ? <span style={{ fontSize: 12.5, color: 'var(--bq-faint)' }}>Awarded to another sub</span> : null}
              </div>
            </div>
          );
        })}
        {!shown.length ? <div style={{ textAlign: 'center', fontSize: 13.5, color: 'var(--bq-faint)', padding: '30px 0' }}>Nothing in this filter.</div> : null}
      </div>
      {active ? <SubQuoteModal req={active} onClose={() => setActive(null)} onSubmit={(total) => submit(active.id, total)}></SubQuoteModal> : null}
    </div>
  );
}

// ════════════════════════════ PAYMENTS ════════════════════════════
const SUB_PAY0 = [
  { id: 'SI-042', t: 'Beam install + labor', proj: 'Henderson', amount: 3800, status: 'paid', date: 'Paid Jun 8', method: 'ACH' },
  { id: 'SI-041', t: 'Framing draw 1', proj: 'Osorio', amount: 7500, status: 'approved', date: 'Scheduled Jun 20' },
  { id: 'SI-040', t: 'Shoring + temp support', proj: 'Henderson', amount: 1450, status: 'submitted', date: 'Submitted Jun 9' },
  { id: 'SI-038', t: 'Demo framing labor', proj: 'Henderson', amount: 2200, status: 'paid', date: 'Paid May 30', method: 'ACH' },
];
const PAY_STATUS = { paid: { label: 'Paid', chip: 'good' }, approved: { label: 'Approved', chip: 'ai' }, submitted: { label: 'Pending review', chip: 'brand' } };

function SubInvoiceModal({ onClose, onSubmit }) {
  const [proj, setProj] = React.useState('Henderson - Kitchen + Hall Bath');
  const [t, setT] = React.useState('');
  const [amt, setAmt] = React.useState('');
  const valid = t.trim() && Number(amt) > 0;
  return (
    <SubModal width={500} icon={BQ_GLYPH.invoice} title="New invoice" sub="Bill Hartwell Builders for completed work" onClose={onClose}
      footer={<React.Fragment>
        <button className="bq-btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="bq-btn primary sm" disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }} onClick={() => onSubmit({ t: t.trim(), amount: Number(amt), proj: proj.split(' - ')[0] })}>Submit invoice</button>
      </React.Fragment>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div><SubLabel>Project</SubLabel><SubSelect value={proj} options={['Henderson - Kitchen + Hall Bath', 'Osorio - Whole-home remodel']} onChange={setProj}></SubSelect></div>
        <div><SubLabel>Description</SubLabel><input className="cl-field" value={t} onChange={(e) => setT(e.target.value)} placeholder="e.g. Framing draw 2"></input></div>
        <div><SubLabel>Amount</SubLabel><div style={{ position: 'relative' }}><span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--bq-faint)', fontWeight: 600 }}>$</span><input className="cl-field" value={amt} type="number" min="0" onChange={(e) => setAmt(e.target.value)} placeholder="0" style={{ paddingLeft: 26 }}></input></div></div>
        <SubScopeNote text="You're billing for your own scope. Hartwell reviews and schedules payment - you'll see the status update here."></SubScopeNote>
      </div>
    </SubModal>
  );
}

function SubPayments({ flash }) {
  const hasCustom = window.bqProj && window.bqProj.actives().length > 0;
  const [items, setItems] = window.bqPersistState(hasCustom ? 'sub-pay-live' : 'sub-pay', hasCustom ? [] : SUB_PAY0);
  const [modal, setModal] = React.useState(false);
  const add = (inv) => {
    setItems((l) => [{ id: 'SI-' + (43 + l.length), status: 'submitted', date: 'Submitted today', ...inv }, ...l]);
    setModal(false);
    window.bqLogEvent && window.bqLogEvent('sub', { g: 'invoice', tone: 'ai', body: 'Submitted invoice - ' + subMoney(inv.amount) + ' (' + inv.t + ')', change: 'Sub submitted an invoice: ' + subMoney(inv.amount) });
    flash('Invoice submitted');
  };
  const paid = items.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const awaiting = items.filter((i) => i.status !== 'paid').reduce((s, i) => s + i.amount, 0);
  const next = items.find((i) => i.status === 'approved');
  return (
    <div className="cl-wrap">
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div className="cl-h" style={{ fontSize: 26 }}>Payments</div>
          <div style={{ color: 'var(--bq-muted)' }}>Your invoices to Hartwell Builders.</div>
        </div>
        <button className="bq-btn primary sm" onClick={() => setModal(true)}><BqIcon d={BQ_GLYPH.invoice} size={14}></BqIcon>New invoice</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <div className="bq-card-s" style={{ padding: '15px 17px' }}><div style={{ fontSize: 12, color: 'var(--bq-faint)', fontWeight: 600 }}>Paid to date</div><div className="bq-num" style={{ fontSize: 24, fontWeight: 700, marginTop: 3, color: 'var(--bq-good)' }}>{subMoney(paid)}</div></div>
        <div className="bq-card-s" style={{ padding: '15px 17px' }}><div style={{ fontSize: 12, color: 'var(--bq-faint)', fontWeight: 600 }}>Awaiting payment</div><div className="bq-num" style={{ fontSize: 24, fontWeight: 700, marginTop: 3 }}>{subMoney(awaiting)}</div></div>
        <div className="bq-card-s" style={{ padding: '15px 17px' }}><div style={{ fontSize: 12, color: 'var(--bq-faint)', fontWeight: 600 }}>Next payment</div><div style={{ fontSize: 16, fontWeight: 700, marginTop: 6 }}>{next ? next.date.replace('Scheduled ', '') + ' · ' + subMoney(next.amount) : '-'}</div></div>
      </div>
      <div className="bq-card-s" style={{ overflow: 'hidden' }}>
        {items.map((it, i) => {
          const st = PAY_STATUS[it.status];
          return (
            <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 17px', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
              <span style={{ width: 40, height: 40, borderRadius: 11, flex: 'none', background: 'var(--bq-subtle)', color: 'var(--bq-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH.invoice} size={18}></BqIcon></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{it.t}</div>
                <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{it.id} · {it.proj} · {it.date}{it.method ? ' · ' + it.method : ''}</div>
              </div>
              <span className={'bq-chip ' + st.chip}>{st.label}</span>
              <span className="bq-num" style={{ fontSize: 16, fontWeight: 700, width: 84, textAlign: 'right', flex: 'none' }}>{subMoney(it.amount)}</span>
            </div>
          );
        })}
      </div>
      {modal ? <SubInvoiceModal onClose={() => setModal(false)} onSubmit={add}></SubInvoiceModal> : null}
    </div>
  );
}

// ════════════════════════════ DOCUMENTS / COMPLIANCE ════════════════════════════
const SUB_DOCS0 = [
  { id: 'd1', t: 'General Liability - COI', kind: 'coi', status: 'ok', meta: 'Expires Aug 30, 2026', icon: 'warranty' },
  { id: 'd2', t: "Workers' Comp - COI", kind: 'coi', status: 'expiring', meta: 'Expires Jul 2, 2026 · 16 days', icon: 'warranty' },
  { id: 'd3', t: 'W-9 - Taxpayer ID', kind: 'w9', status: 'ok', meta: 'On file · filed Jan 2026', icon: 'docs' },
  { id: 'd4', t: 'Master Subcontract Agreement', kind: 'agreement', status: 'ok', meta: 'Signed Mar 4, 2026', icon: 'sign' },
  { id: 'd5', t: 'Lien waiver - Henderson draw 2', kind: 'waiver', status: 'action', meta: 'Conditional waiver · needs your signature', icon: 'sign' },
];

function SubSignModal({ doc, onClose, onSign }) {
  const [name, setName] = React.useState('');
  const valid = name.trim().length > 2;
  return (
    <SubModal width={460} icon={BQ_GLYPH.sign} title={'Sign · ' + doc.t} sub="Type your full name to e-sign this document" onClose={onClose}
      footer={<React.Fragment>
        <button className="bq-btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="bq-btn primary sm" disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }} onClick={() => onSign(doc.id)}>Sign &amp; submit</button>
      </React.Fragment>}>
      <div style={{ background: 'var(--bq-subtle)', borderRadius: 12, padding: '14px 16px', fontSize: 12.5, color: 'var(--bq-muted)', lineHeight: 1.55, marginBottom: 16 }}>
        By signing, you acknowledge receipt of payment for the work covered and waive lien rights for that amount. A copy is sent to Hartwell Builders and stored here.
      </div>
      <SubLabel>Full name</SubLabel>
      <input className="cl-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full legal name"></input>
      {valid ? <div style={{ marginTop: 14, padding: '14px 16px', borderRadius: 12, background: '#fff', boxShadow: 'inset 0 0 0 1px var(--bq-border)', fontFamily: "'Caveat', cursive", fontSize: 30, color: 'var(--bq-ink)' }}>{name}</div> : null}
    </SubModal>
  );
}

function SubDocuments({ flash }) {
  const hasCustom = window.bqProj && window.bqProj.actives().length > 0;
  const [docs, setDocs] = window.bqPersistState(hasCustom ? 'sub-docs-live' : 'sub-docs', hasCustom ? [] : SUB_DOCS0);
  const [sign, setSign] = React.useState(null);
  const upRef = React.useRef(null);
  const renew = (id) => { setDocs((ds) => ds.map((d) => d.id === id ? { ...d, status: 'ok', meta: 'Renewed today · expires Jun 2027' } : d)); flash('Insurance certificate updated'); window.bqLogEvent && window.bqLogEvent('sub', { g: 'warranty', tone: 'good', body: 'Uploaded renewed COI', change: 'Sub renewed an insurance certificate' }); };
  const signed = (id) => { setDocs((ds) => ds.map((d) => d.id === id ? { ...d, status: 'ok', meta: 'Signed today' } : d)); setSign(null); flash('Document signed'); window.bqLogEvent && window.bqLogEvent('sub', { g: 'sign', tone: 'good', body: 'Signed a lien waiver', change: 'Sub signed a lien waiver' }); };
  const STAT = { ok: { chip: 'good', label: 'Current' }, expiring: { chip: 'brand', label: 'Expiring soon' }, action: { chip: 'brand', label: 'Action needed' } };
  const attention = docs.filter((d) => d.status !== 'ok').length;
  return (
    <div className="cl-wrap">
      <div>
        <div className="cl-h" style={{ fontSize: 26 }}>Documents &amp; compliance</div>
        <div style={{ color: 'var(--bq-muted)' }}>Insurance, tax, and agreements Hartwell Builders keeps on file for you.</div>
      </div>
      {attention ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 16px', borderRadius: 14, background: 'var(--bq-brand-soft)', boxShadow: 'inset 0 0 0 1px var(--bq-brand-border)' }}>
          <BqIcon d={BQ_GLYPH.watchdog} size={18} style={{ color: 'var(--bq-brand-strong)', flex: 'none' }}></BqIcon>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--bq-brand-strong)' }}>{attention} item{attention > 1 ? 's' : ''} need attention - keep these current to stay eligible for work.</span>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 16px', borderRadius: 14, background: 'var(--bq-good-soft)', boxShadow: 'inset 0 0 0 1px #DCEBC2' }}>
          <BqIcon d={BQ_GLYPH.check} size={18} sw={2.2} style={{ color: 'var(--bq-good)', flex: 'none' }}></BqIcon>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--bq-good)' }}>All documents are current. You're good to go.</span>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {docs.map((d) => {
          const st = STAT[d.status];
          return (
            <div key={d.id} className="bq-card-s" style={{ padding: '14px 17px', display: 'flex', alignItems: 'center', gap: 13 }}>
              <span style={{ width: 42, height: 42, borderRadius: 12, flex: 'none', background: d.status === 'ok' ? 'var(--bq-subtle)' : 'var(--bq-brand-soft)', color: d.status === 'ok' ? 'var(--bq-muted)' : 'var(--bq-brand-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH[d.icon]} size={20}></BqIcon></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{d.t}</div>
                <div style={{ fontSize: 12, color: d.status === 'ok' ? 'var(--bq-faint)' : 'var(--bq-brand-strong)', fontWeight: d.status === 'ok' ? 400 : 600 }}>{d.meta}</div>
              </div>
              <span className={'bq-chip ' + st.chip}>{st.label}</span>
              {d.kind === 'coi' ? <button className="bq-btn sm" onClick={() => upRef.current && upRef.current.click()}><BqIcon d={BQ_GLYPH.exports} size={13}></BqIcon>Upload</button> : null}
              {d.kind === 'waiver' && d.status === 'action' ? <button className="bq-btn primary sm" onClick={() => setSign(d)}>Sign</button> : null}
              {(d.kind === 'w9' || d.kind === 'agreement' || (d.kind === 'waiver' && d.status === 'ok') || (d.kind === 'coi')) && d.kind !== 'coi' ? <button className="bq-btn ghost sm">View</button> : null}
            </div>
          );
        })}
      </div>
      <input ref={upRef} type="file" accept="application/pdf,image/*" onChange={(e) => { if (e.target.files && e.target.files[0]) { renew('d2'); } e.target.value = ''; }} style={{ display: 'none' }}></input>
      {sign ? <SubSignModal doc={sign} onClose={() => setSign(null)} onSign={signed}></SubSignModal> : null}
    </div>
  );
}

// ════════════════════════════ PROFILE / SETTINGS ════════════════════════════
const SUB_CREW0 = [
  { n: 'Luis Vargas', r: 'Lead framer / owner' },
  { n: 'Hector Vargas', r: 'Framer' },
  { n: 'Sal Romero', r: 'Framer' },
  { n: 'Tyler Nguyen', r: 'Apprentice' },
];

function SubProfile({ flash }) {
  const [f, setF] = window.bqPersistState('sub-company', { company: 'Vargas Framing', contact: 'Luis Vargas', email: 'ops@vargasframing.com', phone: '(512) 555-0188', area: 'Austin metro · 40 mi', trades: 'Framing, structural, shoring' });
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));
  const [crew, setCrew] = window.bqPersistState('sub-crew', SUB_CREW0);
  const [newName, setNewName] = React.useState('');
  const [notif, setNotif] = window.bqPersistState('sub-notif', { task: { Email: true, SMS: true }, schedule: { Email: true, SMS: true }, quote: { Email: true, SMS: false }, payment: { Email: true, SMS: false } });
  const addCrew = () => { const v = newName.trim(); if (!v) return; setCrew((c) => [...c, { n: v, r: 'Framer' }]); setNewName(''); };
  const Field = ({ label, k, hint }) => (
    <label style={{ display: 'block' }}><SubLabel>{label}</SubLabel><input className="cl-field" value={f[k]} onChange={(e) => set(k)(e.target.value)}></input>{hint ? <span style={{ fontSize: 11, color: 'var(--bq-faint)', marginTop: 4, display: 'block' }}>{hint}</span> : null}</label>
  );
  const NOTIF_ROWS = [['task', 'Task assigned'], ['schedule', 'Schedule change'], ['quote', 'Bid request'], ['payment', 'Payment update']];
  const toggleN = (k, ch) => setNotif((p) => ({ ...p, [k]: { ...p[k], [ch]: !p[k][ch] } }));
  return (
    <div className="cl-wrap">
      <div>
        <div className="cl-h" style={{ fontSize: 26 }}>Company profile</div>
        <div style={{ color: 'var(--bq-muted)' }}>How Hartwell Builders reaches you and your crew.</div>
      </div>

      <div className="bq-card-s" style={{ padding: '20px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
          <span className="cl-avatar" style={{ width: 56, height: 56, fontSize: 18, background: 'var(--bq-subtle)', color: 'var(--bq-muted)', boxShadow: 'inset 0 0 0 1px var(--bq-border)' }}>VF</span>
          <div><div style={{ fontWeight: 700, fontSize: 17 }}>{f.company}</div><div style={{ fontSize: 12.5, color: 'var(--bq-faint)' }}>Subcontractor · Hartwell Builders network</div></div>
          <span className="bq-chip" style={{ marginLeft: 'auto' }}><BqIcon d={BQ_GLYPH.hardhat} size={12}></BqIcon>Framing / structural</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Field label="Company name" k="company"></Field>
          <Field label="Primary contact" k="contact"></Field>
          <Field label="Email" k="email"></Field>
          <Field label="Phone" k="phone"></Field>
          <Field label="Service area" k="area"></Field>
          <Field label="Trades" k="trades"></Field>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}><button className="bq-btn primary sm" onClick={() => flash('Profile saved')}>Save changes</button></div>
      </div>

      <div className="bq-card-s" style={{ padding: '18px 20px' }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Crew</div>
        <div style={{ fontSize: 12.5, color: 'var(--bq-faint)', marginBottom: 14 }}>People who show up on site under your company.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {crew.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '9px 11px', borderRadius: 11, background: 'var(--bq-subtle)' }}>
              <span className="cl-avatar" style={{ width: 32, height: 32, fontSize: 12, background: '#fff', color: 'var(--bq-muted)', boxShadow: 'inset 0 0 0 1px var(--bq-border)' }}>{c.n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('')}</span>
              <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 600 }}>{c.n}</div><div style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>{c.r}</div></div>
              <button onClick={() => setCrew((cs) => cs.filter((_, j) => j !== i))} aria-label="Remove" style={{ width: 28, height: 28, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--bq-faint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={13} sw={2}></BqIcon></button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 9, marginTop: 12 }}>
          <input className="cl-field" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') addCrew(); }} placeholder="Add a crew member…"></input>
          <button className="bq-btn sm" onClick={addCrew} style={{ flex: 'none' }}>Add</button>
        </div>
      </div>

      <div className="bq-card-s" style={{ padding: '18px 20px 10px' }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Notifications</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 64px 64px', alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid var(--bq-border)' }}>
          <span></span><span style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', color: 'var(--bq-faint)' }}>Email</span><span style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', color: 'var(--bq-faint)' }}>SMS</span>
        </div>
        {NOTIF_ROWS.map(([k, lbl]) => (
          <div key={k} style={{ display: 'grid', gridTemplateColumns: '1fr 64px 64px', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid var(--bq-border)' }}>
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>{lbl}</span>
            {['Email', 'SMS'].map((ch) => (
              <span key={ch} style={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={() => toggleN(k, ch)} aria-label={lbl + ' ' + ch} style={{ width: 22, height: 22, borderRadius: 6, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: notif[k][ch] ? 'var(--bq-brand)' : 'var(--bq-card)', boxShadow: notif[k][ch] ? 'none' : 'inset 0 0 0 1.5px var(--bq-border-strong)' }}>{notif[k][ch] ? <BqIcon d={BQ_GLYPH.check} size={13} sw={2.8} style={{ color: '#fff' }}></BqIcon> : null}</button>
              </span>
            ))}
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px 0 8px' }}><button className="bq-btn primary sm" onClick={() => flash('Notification preferences saved')}>Save</button></div>
      </div>
    </div>
  );
}

// ════════════════════════════ TASK DETAIL MODAL ════════════════════════════
function SubTaskModal({ task, onClose, onToggleDone, onAskQuestion }) {
  const seed = (() => { const m = (task.sub || '').match(/(\d+)\/(\d+)/); const n = m ? Number(m[2]) : 0; const done = m ? Number(m[1]) : 0; return Array.from({ length: n }, (_, i) => ({ t: SUB_SUBTASKS[task.id] ? SUB_SUBTASKS[task.id][i] : 'Step ' + (i + 1), done: i < done })); })();
  const [subs, setSubs] = React.useState(seed);
  const [photos, setPhotos] = React.useState([]);
  const pct = subs.length ? Math.round(subs.filter((s) => s.done).length / subs.length * 100) : (task.done ? 100 : 0);
  const toggleSub = (i) => setSubs((ss) => ss.map((s, j) => j === i ? { ...s, done: !s.done } : s));
  return (
    <SubModal width={560} icon={BQ_GLYPH.task} title={task.t} sub={task.proj} onClose={onClose}
      footer={<React.Fragment>
        <button className="bq-btn ghost sm" onClick={() => { onAskQuestion(task); }}><BqIcon d={BQ_GLYPH.inbox} size={14}></BqIcon>Ask a question</button>
        <button className={'bq-btn sm ' + (task.done ? '' : 'primary')} onClick={() => { onToggleDone(task.id); onClose(); }}>{task.done ? 'Reopen task' : 'Mark complete'}</button>
      </React.Fragment>}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {task.pr === 'High' ? <span className="bq-chip brand">High priority</span> : null}
        <span className="bq-chip">Due {task.due}</span>
        <span className={'bq-chip ' + (task.done ? 'good' : '')}>{task.done ? 'Completed' : 'In progress'}</span>
      </div>
      <SubLabel>Scope</SubLabel>
      <div style={{ background: 'var(--bq-subtle)', borderRadius: 12, padding: '12px 14px', fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.55, marginBottom: 18 }}>{SUB_TASK_SCOPE[task.id] || 'Complete the assigned work per the shared plans. Flag any field conditions that differ from the drawings before proceeding.'}</div>
      {subs.length ? (
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <SubLabel>Checklist</SubLabel>
            <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, color: 'var(--bq-muted)' }}>{pct}%</span>
          </div>
          <div className="bq-meter" style={{ marginBottom: 12 }}><div style={{ width: pct + '%' }}></div></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {subs.map((s, i) => (
              <button key={i} onClick={() => toggleSub(i)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent', textAlign: 'left', fontFamily: 'inherit' }}>
                <span style={{ width: 20, height: 20, borderRadius: 6, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: s.done ? 'var(--bq-good)' : 'var(--bq-card)', boxShadow: s.done ? 'none' : 'inset 0 0 0 1.5px var(--bq-border-strong)' }}>{s.done ? <BqIcon d={BQ_GLYPH.check} size={12} sw={2.8} style={{ color: '#fff' }}></BqIcon> : null}</span>
                <span style={{ fontSize: 13.5, color: s.done ? 'var(--bq-faint)' : 'var(--bq-ink)', textDecoration: s.done ? 'line-through' : 'none' }}>{s.t}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <SubLabel>Progress photos</SubLabel>
      <SubPhotoUpload photos={photos} onAdd={(p) => setPhotos((ps) => [...ps, p])} onRemove={(i) => setPhotos((ps) => ps.filter((_, j) => j !== i))}></SubPhotoUpload>
    </SubModal>
  );
}
const SUB_TASK_SCOPE = {
  t1: 'Knob-and-tube / cloth wiring found behind the north kitchen wall. Walk it, photograph each run, and price remediation so we can issue a change order to the client. Coordinate with the electrician before any framing is closed up.',
  t2: 'Remove temporary shoring at the kitchen/dining opening - only after the LVL beam is fully fastened and the inspector has signed the structural. Confirm with Maria before removal.',
  t3: 'Frame the new primary suite walls and closet per plan A-3. Verify rough opening dimensions against the door/window schedule before standing walls.',
  t4: 'Install the LVL beam at the kitchen/dining opening. Completed - kept here for reference.',
  t5: 'Prep for the framing re-inspection: nailing patterns, hold-downs, hangers, and fire blocking per the structural notes.',
};
const SUB_SUBTASKS = {
  t1: ['Photograph all wiring runs', 'Get electrician walkthrough', 'Price labor + material'],
  t3: ['Verify rough openings', 'Stand exterior walls', 'Stand interior partitions', 'Set closet framing'],
  t4: ['Set beam', 'Fasten hangers', 'Inspector sign-off'],
};

// ════════════════════════════ RFI / ASK A QUESTION MODAL ════════════════════════════
function SubRFIModal({ context, onClose, flash }) {
  const [q, setQ] = React.useState('');
  const [topic, setTopic] = React.useState(context || 'General question');
  const valid = q.trim().length > 3;
  return (
    <SubModal width={500} icon={BQ_GLYPH.inbox} title="Ask a question" sub="Sends an RFI to the Hartwell Builders team" onClose={onClose}
      footer={<React.Fragment>
        <button className="bq-btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="bq-btn primary sm" disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }} onClick={() => { window.bqLogEvent && window.bqLogEvent('sub', { g: 'inbox', tone: 'ai', body: 'Raised an RFI: ' + q.trim(), change: 'Sub asked a question: ' + q.trim() }); flash('Question sent to the team'); onClose(); }}>Send question</button>
      </React.Fragment>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div><SubLabel>About</SubLabel><SubSelect value={topic} options={['General question', 'A plan or spec', 'A task', 'Schedule', 'Site conditions']} onChange={setTopic}></SubSelect></div>
        <div><SubLabel>Your question</SubLabel><textarea className="cl-field" value={q} rows={4} onChange={(e) => setQ(e.target.value)} placeholder="What do you need clarified?" style={{ resize: 'vertical', lineHeight: 1.5 }}></textarea></div>
        <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>The team is notified and your question appears in Messages with their reply.</div>
      </div>
    </SubModal>
  );
}

// ════════════════════════════ NOTIFICATIONS ════════════════════════════
const SUB_NOTIFS0 = [
  { g: 'quotes', tone: 'brand', unread: true, who: 'Bid request', body: 'Hartwell requested a quote: cloth-wiring remediation.', time: '15m ago', go: 'Quotes' },
  { g: 'cal', tone: 'ai', unread: true, who: 'Schedule', body: 'Shoring removal moved to Thu · Jun 12.', time: '1h ago', go: 'Schedule' },
  { g: 'pay', tone: 'good', unread: true, who: 'Payment', body: 'Payment received - $3,800 for beam install.', time: '2h ago', go: 'Payments' },
  { g: 'warranty', tone: 'warn', unread: false, who: 'Compliance', body: "Workers' Comp COI expires in 16 days.", time: 'Yesterday', go: 'Docs' },
  { g: 'task', tone: 'muted', unread: false, who: 'Task assigned', body: 'New task: Frame primary suite walls.', time: 'Yesterday', go: 'Tasks' },
  { g: 'inbox', tone: 'muted', unread: false, who: 'Message', body: 'Maria sent you a message about the change order.', time: '2d ago', go: 'Messages' },
];

function SubNotifPanel({ notifs, onClose, onGo, onReadAll }) {
  const tone = { good: 'var(--bq-good)', warn: 'var(--bq-brand-strong)', ai: 'var(--bq-ai)', brand: 'var(--bq-brand-strong)', muted: 'var(--bq-faint)' };
  const bg = { good: 'var(--bq-good-soft)', warn: 'var(--bq-brand-soft)', ai: 'var(--bq-ai-soft)', brand: 'var(--bq-brand-soft)', muted: 'var(--bq-subtle)' };
  return (
    <React.Fragment>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 40 }}></div>
      <div className="bq-card-s" style={{ position: 'absolute', top: 46, right: 0, width: 340, zIndex: 41, padding: 0, overflow: 'hidden', boxShadow: '0 14px 36px rgba(38,35,30,0.2), 0 0 0 1px var(--bq-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px', borderBottom: '1px solid var(--bq-border)' }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
          <button className="bq-btn ghost sm" style={{ marginLeft: 'auto', padding: '4px 8px' }} onClick={onReadAll}>Mark all read</button>
        </div>
        <div style={{ maxHeight: 400, overflow: 'auto' }}>
          {notifs.map((n, i) => (
            <button key={i} onClick={() => onGo(n)} style={{ display: 'flex', gap: 11, width: '100%', textAlign: 'left', padding: '13px 16px', border: 'none', borderTop: i ? '1px solid var(--bq-border)' : 'none', background: n.unread ? 'var(--bq-brand-soft)' : 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}>
              <span style={{ width: 32, height: 32, borderRadius: 9, flex: 'none', background: bg[n.tone], color: tone[n.tone], display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH[n.g] || BQ_GLYPH.bell} size={16}></BqIcon></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: tone[n.tone] }}>{n.who}</span>{n.unread ? <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--bq-brand)', flex: 'none' }}></span> : null}<span style={{ marginLeft: 'auto', fontSize: 10.5, color: 'var(--bq-faint)' }}>{n.time}</span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--bq-ink)', lineHeight: 1.4, marginTop: 2 }}>{n.body}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

// ════════════════════════════ PERSONAL ACCOUNT (light profile) ════════════════════════════
// A small store for the logged-in person (Luis Vargas) so name + photo stay in sync
// across the header avatar and the account menu. Intentionally lighter than the admin profile.
const SUB_ACCT_DEFAULT = { name: 'Luis Vargas', email: 'ops@vargasframing.com', phone: '(512) 555-0188', role: 'Lead framer / owner' };
function subReadAccount() {
  try { const raw = localStorage.getItem(window.bqNsKey('bq-sub-account')); const a = raw ? JSON.parse(raw) : {}; const photo = localStorage.getItem(window.bqNsKey('bq-sub-photo')) || null; return { ...SUB_ACCT_DEFAULT, ...a, photo }; }
  catch (e) { return { ...SUB_ACCT_DEFAULT, photo: null }; }
}
function subAcctInitials(a) { return (a.name || 'U').trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase(); }
function subSaveAccount(patch) {
  const { photo, ...store } = { ...subReadAccount(), ...patch };
  try { localStorage.setItem(window.bqNsKey('bq-sub-account'), JSON.stringify(store)); } catch (e) {}
  window.dispatchEvent(new Event('bq-sub-acct-change'));
  return store;
}
function useSubAccount() {
  const [a, setA] = React.useState(subReadAccount);
  React.useEffect(() => {
    const h = () => setA(subReadAccount());
    window.addEventListener('bg-sub-photo', h); window.addEventListener('bq-sub-photo', h);
    window.addEventListener('bq-sub-acct-change', h); window.addEventListener('storage', h);
    return () => { window.removeEventListener('bg-sub-photo', h); window.removeEventListener('bq-sub-photo', h); window.removeEventListener('bq-sub-acct-change', h); window.removeEventListener('storage', h); };
  }, []);
  return a;
}

function SubAvatar({ size = 36, fontSize, style }) {
  const acct = useSubAccount();
  const photo = acct.photo;
  return (
    <span className="cl-avatar" style={{ width: size, height: size, fontSize: fontSize || Math.round(size * 0.36), overflow: 'hidden', background: photo ? 'transparent' : (style && style.background) || 'var(--bq-subtle)', color: 'var(--bq-muted)', boxShadow: 'inset 0 0 0 1px var(--bq-border)', ...style }}>
      {photo ? <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}></img> : subAcctInitials(acct)}
    </span>
  );
}

function SubAccountMenu({ onClose, go, onProfile, flash }) {
  const acct = useSubAccount();
  const [signout, setSignout] = React.useState(false);
  const item = { display: 'flex', alignItems: 'center', gap: 11, width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13.5, fontFamily: 'inherit', color: 'var(--bq-ink)' };
  const links = [
    ['Your profile', BQ_GLYPH.leads, () => { onProfile(); onClose(); }],
    ['Company profile', BQ_GLYPH.partners, () => { go('Profile'); onClose(); }],
    ['Documents & compliance', BQ_GLYPH.warranty, () => { go('Docs'); onClose(); }],
    ['Messages', BQ_GLYPH.inbox, () => { go('Messages'); onClose(); }],
  ];
  return (
    <React.Fragment>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 40 }}></div>
      <div className="bq-card-s" style={{ position: 'absolute', top: 48, right: 0, width: 268, zIndex: 41, padding: 0, overflow: 'hidden', boxShadow: '0 14px 36px rgba(38,35,30,0.2), 0 0 0 1px var(--bq-border)' }}>
        {signout ? (
          <div style={{ padding: '18px 18px 16px' }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, marginBottom: 6 }}>Sign out?</div>
            <div style={{ fontSize: 12.5, color: 'var(--bq-muted)', lineHeight: 1.45, marginBottom: 14 }}>You'll need your link from Hartwell Builders to sign back in.</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 9 }}>
              <button className="bq-btn ghost sm" onClick={() => setSignout(false)}>Cancel</button>
              <button className="bq-btn sm" style={{ background: 'var(--bq-brand-strong)', color: '#fff', boxShadow: 'none' }} onClick={() => { onClose(); flash('Signed out'); }}>Sign out</button>
            </div>
          </div>
        ) : (
          <React.Fragment>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '15px 16px', borderBottom: '1px solid var(--bq-border)' }}>
              <SubAvatar size={42} fontSize={15}></SubAvatar>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{acct.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{acct.email}</div>
                <div style={{ display: 'flex', gap: 5, marginTop: 5 }}><span className="bq-chip">Vargas Framing</span><span className="bq-chip"><BqIcon d={BQ_GLYPH.hardhat} size={11}></BqIcon>Sub</span></div>
              </div>
            </div>
            <div style={{ padding: 6 }}>
              {links.map(([lbl, g, fn]) => (
                <button key={lbl} onClick={fn} style={item} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bq-subtle)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <BqIcon d={g} size={16} style={{ color: 'var(--bq-muted)', flex: 'none' }}></BqIcon>{lbl}
                </button>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--bq-border)', padding: 6 }}>
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

function SubAccountModal({ onClose, flash }) {
  const acct = subReadAccount();
  const [f, setF] = React.useState({ name: acct.name, email: acct.email, phone: acct.phone });
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));
  const [photo, setPhoto] = React.useState(acct.photo);
  const [pw, setPw] = React.useState({ cur: '', next: '', conf: '' });
  const fileRef = React.useRef(null);
  const onFile = (e) => {
    const file = e.target.files && e.target.files[0]; e.target.value = '';
    if (!file || !/^image\//.test(file.type)) { if (file) flash('Please choose an image file'); return; }
    if (file.size > 6 * 1024 * 1024) { flash('Image too large - under 6 MB'); return; }
    const r = new FileReader(); r.onload = () => { setPhoto(r.result); try { localStorage.setItem(window.bqNsKey('bq-sub-photo'), r.result); window.dispatchEvent(new Event('bq-sub-photo')); } catch (er) {} }; r.readAsDataURL(file);
  };
  const removePhoto = () => { setPhoto(null); try { localStorage.removeItem(window.bqNsKey('bq-sub-photo')); window.dispatchEvent(new Event('bq-sub-photo')); } catch (e) {} };
  const pwOk = pw.cur && pw.next.length >= 8 && pw.next === pw.conf;
  const save = () => { subSaveAccount(f); flash('Profile saved'); onClose(); };
  return (
    <SubModal width={520} icon={BQ_GLYPH.leads} title="Your profile" sub="Your personal account at Hartwell Builders" onClose={onClose}
      footer={<React.Fragment>
        <button className="bq-btn ghost sm" onClick={onClose}>Cancel</button>
        <button className="bq-btn primary sm" onClick={save}>Save changes</button>
      </React.Fragment>}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }}></input>
        <button onClick={() => fileRef.current && fileRef.current.click()} title="Change photo" className="cl-avatar" style={{ width: 64, height: 64, fontSize: 22, padding: 0, border: 'none', cursor: 'pointer', flex: 'none', overflow: 'hidden', background: photo ? 'transparent' : 'var(--bq-subtle)', color: 'var(--bq-muted)', boxShadow: 'inset 0 0 0 1px var(--bq-border)' }}>
          {photo ? <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}></img> : subAcctInitials(f)}
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="bq-btn sm" onClick={() => fileRef.current && fileRef.current.click()}><BqIcon d={BQ_GLYPH.camera} size={14}></BqIcon>Upload photo</button>
          {photo ? <button className="bq-btn ghost sm" style={{ color: 'var(--bq-brand-strong)' }} onClick={removePhoto}>Remove</button> : null}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        <div><SubLabel>Full name</SubLabel><input className="cl-field" value={f.name} onChange={(e) => set('name')(e.target.value)}></input></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
          <div><SubLabel>Email</SubLabel><input className="cl-field" value={f.email} onChange={(e) => set('email')(e.target.value)}></input></div>
          <div><SubLabel>Phone</SubLabel><input className="cl-field" value={f.phone} onChange={(e) => set('phone')(e.target.value)}></input></div>
        </div>
      </div>
      <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--bq-border)' }}>
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Change password</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 11 }}>
          <div><SubLabel>Current</SubLabel><input className="cl-field" type="password" value={pw.cur} onChange={(e) => setPw((p) => ({ ...p, cur: e.target.value }))} placeholder="••••••••"></input></div>
          <div><SubLabel>New</SubLabel><input className="cl-field" type="password" value={pw.next} onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} placeholder="••••••••"></input></div>
          <div><SubLabel>Confirm</SubLabel><input className="cl-field" type="password" value={pw.conf} onChange={(e) => setPw((p) => ({ ...p, conf: e.target.value }))} placeholder="••••••••"></input></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
          <span style={{ flex: 1, fontSize: 11.5, color: pw.next ? (pw.next.length >= 8 ? 'var(--bq-good)' : 'var(--bq-brand-strong)') : 'var(--bq-faint)' }}>{pw.next ? (pw.next.length >= 8 ? '✓ Strong enough' : '8+ characters') : 'Last changed 2 months ago'}</span>
          <button className="bq-btn sm" disabled={!pwOk} style={{ opacity: pwOk ? 1 : 0.5 }} onClick={() => { setPw({ cur: '', next: '', conf: '' }); flash('Password updated'); }}>Update password</button>
        </div>
      </div>
    </SubModal>
  );
}

Object.assign(window, {
  subMoney, SubScopeNote, SubModal, SubLabel, SubSelect, SubPhotoUpload,
  SubQuotes, SubPayments, SubDocuments, SubProfile,
  SubTaskModal, SubRFIModal, SubNotifPanel, SUB_NOTIFS0,
  SubAvatar, SubAccountMenu, SubAccountModal, useSubAccount,
});
