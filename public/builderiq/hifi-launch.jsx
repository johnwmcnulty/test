// BuilderIQ launch layer — first-run onboarding, guided tour, global toast+undo,
// promise-based confirm, persistent notification read-state, and a shared date formatter.
// Loaded after hifi-parts.jsx (so bqNsKey/BqIcon/BqSelect exist) and before the app entry.

// ── shared date/time formatter (single source of truth) ──
(function () {
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function toDate(v) { if (v instanceof Date) return v; if (typeof v === 'number') return new Date(v); const d = new Date(v); return isNaN(d.getTime()) ? null : d; }
  // bqDate(v)         → "Jun 14" (adds ", 2025" only when not the current year)
  // bqDate(v,'time')  → "3:45 PM"      bqDate(v,'rel') → "2h ago"      bqDate(v,'full') → "Jun 14, 2025"
  window.bqDate = function (v, mode) {
    const d = toDate(v); if (!d) return String(v == null ? '' : v);
    if (mode === 'rel') return window.bqRel ? window.bqRel(d.getTime()) : (MON[d.getMonth()] + ' ' + d.getDate());
    if (mode === 'time') { let h = d.getHours(); const mm = String(d.getMinutes()).padStart(2, '0'); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return h + ':' + mm + ' ' + ap; }
    const base = MON[d.getMonth()] + ' ' + d.getDate();
    return (mode === 'full' || d.getFullYear() !== new Date().getFullYear()) ? base + ', ' + d.getFullYear() : base;
  };
})();

// ── persistent notification read / dismiss state ──
(function () {
  const RK = window.bqNsKey('bq-notif-read');
  const DK = window.bqNsKey('bq-notif-dismiss');
  const load = (k) => { try { return JSON.parse(localStorage.getItem(k)) || {}; } catch (e) { return {}; } };
  let read = load(RK), dism = load(DK);
  const save = () => { try { localStorage.setItem(RK, JSON.stringify(read)); localStorage.setItem(DK, JSON.stringify(dism)); } catch (e) {} try { window.dispatchEvent(new Event('bq-notif-change')); } catch (e) {} };
  window.bqNotif = {
    isRead: (id) => !!read[id] || !!dism[id],
    isDismissed: (id) => !!dism[id],
    markRead: (id) => { read[id] = 1; save(); },
    markAllRead: (ids) => { (ids || []).forEach((i) => { read[i] = 1; }); save(); },
    dismiss: (id) => { dism[id] = 1; save(); },
  };
  window.useBqNotifTick = function () {
    const [, set] = React.useState(0);
    React.useEffect(() => {
      const h = () => { read = load(RK); dism = load(DK); set((n) => n + 1); };
      window.addEventListener('bq-notif-change', h); window.addEventListener('storage', h);
      return () => { window.removeEventListener('bq-notif-change', h); window.removeEventListener('storage', h); };
    }, []);
  };
})();

// ── imperative UI bus: window.bqToast(msg, opts) / window.bqConfirm(opts) ──
const bqUiBus = (function () {
  let toastCb = null, confirmCb = null;
  return {
    setToast: (f) => { toastCb = f; }, setConfirm: (f) => { confirmCb = f; },
    toast: (msg, opt) => { if (toastCb) toastCb(msg, opt || {}); },
    confirm: (opt) => new Promise((res) => { if (confirmCb) confirmCb(opt || {}, res); else res(true); }),
  };
})();
// bqToast('Saved', { tone:'good'|'warn', undoLabel:'Undo', onUndo:fn, duration:6000 })
window.bqToast = (m, o) => bqUiBus.toast(m, o);
// await bqConfirm({ title, body, confirmLabel, cancelLabel, danger:true }) → boolean
window.bqConfirm = (o) => bqUiBus.confirm(o);

function BqToastHost() {
  const [items, setItems] = React.useState([]);
  const timers = React.useRef({});
  const drop = React.useCallback((id) => { setItems((l) => l.filter((t) => t.id !== id)); clearTimeout(timers.current[id]); delete timers.current[id]; }, []);
  React.useEffect(() => {
    bqUiBus.setToast((msg, opt) => {
      const id = 't' + Date.now() + Math.random().toString(36).slice(2, 5);
      setItems((l) => [...l.slice(-3), { id, msg, ...opt }]);
      timers.current[id] = setTimeout(() => drop(id), opt.duration || (opt.onUndo ? 6500 : 3800));
    });
    return () => bqUiBus.setToast(null);
  }, [drop]);
  const toneBar = (t) => t.tone === 'good' ? 'var(--bq-good)' : t.tone === 'warn' ? 'var(--bq-brand)' : 'var(--bq-ai-strong)';
  return (
    <div style={{ position: 'fixed', left: '50%', bottom: 26, transform: 'translateX(-50%)', zIndex: 400, display: 'flex', flexDirection: 'column', gap: 9, alignItems: 'center', pointerEvents: 'none' }}>
      {items.map((t) => (
        <div key={t.id} className="bq-toast-in" style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: 12, minWidth: 260, maxWidth: 440, padding: '12px 14px', borderRadius: 13, background: 'var(--bq-ink)', color: '#fff', boxShadow: '0 18px 44px rgba(38,35,30,0.34)', fontSize: 13.5 }}>
          <span style={{ width: 4, alignSelf: 'stretch', borderRadius: 4, background: toneBar(t), flex: 'none' }}></span>
          <span style={{ flex: 1, lineHeight: 1.4 }}>{t.msg}</span>
          {t.onUndo ? <button onClick={() => { t.onUndo(); drop(t.id); }} style={{ flex: 'none', border: 'none', background: 'transparent', color: '#F7B77A', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', padding: '2px 4px' }}>{t.undoLabel || 'Undo'}</button> : null}
          <button onClick={() => drop(t.id)} aria-label="Dismiss" style={{ flex: 'none', border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.55)', cursor: 'pointer', padding: 2, display: 'flex' }}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={15} sw={2}></BqIcon></button>
        </div>
      ))}
    </div>
  );
}

function BqConfirmHost() {
  const [q, setQ] = React.useState(null); // { opt, res }
  React.useEffect(() => {
    bqUiBus.setConfirm((opt, res) => setQ({ opt, res }));
    return () => bqUiBus.setConfirm(null);
  }, []);
  if (!q) return null;
  const o = q.opt;
  const done = (v) => { q.res(v); setQ(null); };
  return (
    <div onClick={() => done(false)} style={{ position: 'fixed', inset: 0, zIndex: 420, background: 'rgba(38,35,30,0.46)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} className="bq-toast-in" role="alertdialog" aria-modal="true" aria-label={o.title || 'Confirm'} style={{ width: 'min(420px, 100%)', background: 'var(--bq-card)', borderRadius: 18, padding: '20px 22px 18px', boxShadow: '0 28px 64px rgba(38,35,30,0.32), 0 0 0 1px var(--bq-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 10 }}>
          <span style={{ width: 34, height: 34, borderRadius: 10, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: o.danger ? 'var(--bq-brand-soft)' : 'var(--bq-ai-soft)', color: o.danger ? 'var(--bq-brand-strong)' : 'var(--bq-ai-strong)' }}><BqIcon d={o.danger ? 'M12 8 V13 M12 16.5 h.01 M10.3 4 L2.8 17.5 a1.5 1.5 0 0 0 1.3 2.3 H19.9 a1.5 1.5 0 0 0 1.3-2.3 L13.7 4 a1.5 1.5 0 0 0-3.4 0 Z' : BQ_GLYPH.spark} size={18}></BqIcon></span>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{o.title || 'Are you sure?'}</div>
        </div>
        {o.body ? <div style={{ fontSize: 13.5, color: 'var(--bq-muted)', lineHeight: 1.5, marginBottom: 16 }}>{o.body}</div> : null}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 9 }}>
          <button className="bq-btn ghost sm" onClick={() => done(false)}>{o.cancelLabel || 'Cancel'}</button>
          <button className="bq-btn sm" style={{ background: o.danger ? 'var(--bq-brand-strong)' : 'var(--bq-brand)', color: '#fff', boxShadow: 'none' }} onClick={() => done(true)}>{o.confirmLabel || 'Confirm'}</button>
        </div>
      </div>
    </div>
  );
}

// ── first-run onboarding wizard (clean build) ──
const BQ_ONBOARD_KEY = () => window.bqNsKey('bq-onboarded');
function bqNeedsOnboarding() {
  try { if (localStorage.getItem(BQ_ONBOARD_KEY())) return false; } catch (e) { return false; }
  return !!(window.bqClean && window.bqClean());
}
function BqOnboarding({ onClose }) {
  const [step, setStep] = React.useState(0);
  const [f, setF] = React.useState({ company: '', owner: '', clientName: '', projType: 'Kitchen remodel', budget: '' });
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const finish = (startTour) => {
    const patch = {};
    if (f.company.trim()) patch.company = f.company.trim();
    if (f.owner.trim()) { patch.display = f.owner.trim(); const parts = f.owner.trim().split(/\s+/); patch.first = parts[0]; patch.last = parts.slice(1).join(' '); }
    if (Object.keys(patch).length && window.__bqProfile) window.__bqProfile.set(patch);
    if (f.clientName.trim() && window.bqStore) {
      const c = window.bqStore.add({ name: f.clientName.trim() });
      window.bqStore.addProject(c.id, { title: f.projType, type: f.projType, stage: 'New lead', stageTone: 'ai', contract: Number(String(f.budget).replace(/[^0-9.]/g, '')) || 0 });
    }
    try { localStorage.setItem(BQ_ONBOARD_KEY(), '1'); } catch (e) {}
    onClose();
    if (startTour && window.bqStartTour) setTimeout(() => window.bqStartTour(), 350);
  };
  const skip = () => { try { localStorage.setItem(BQ_ONBOARD_KEY(), '1'); } catch (e) {} onClose(); };
  const fld = { font: 'inherit', fontSize: 14, padding: '11px 13px', borderRadius: 11, border: '1px solid var(--bq-border-strong)', background: 'var(--bq-card)', color: 'var(--bq-ink)', outline: 'none', width: '100%', boxSizing: 'border-box' };
  const lab = { fontSize: 12.5, fontWeight: 600, color: 'var(--bq-muted)' };
  const STEPS = [
    // 0 — welcome
    (
      <div key="w" style={{ textAlign: 'center', padding: '8px 4px' }}>
        <span style={{ width: 60, height: 60, borderRadius: 17, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-brand)', color: '#fff', marginBottom: 16 }}><BqIcon d={BQ_GLYPH.hammer} size={30} sw={1.7}></BqIcon></span>
        <div className="bq-display" style={{ fontSize: 25, marginBottom: 8 }}>Welcome to BuilderIQ</div>
        <div style={{ fontSize: 14.5, color: 'var(--bq-muted)', lineHeight: 1.55, maxWidth: 380, margin: '0 auto' }}>Let's set up your company so estimates, proposals, and the client portal all show the right name. Takes about a minute.</div>
      </div>
    ),
    // 1 — company + owner
    (
      <div key="c" style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        <div>
          <div className="bq-display" style={{ fontSize: 20, marginBottom: 4 }}>Your company</div>
          <div style={{ fontSize: 13, color: 'var(--bq-faint)' }}>This appears on everything you send to clients and subs.</div>
        </div>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={lab}>Company name</span><input autoFocus value={f.company} onChange={(e) => set('company', e.target.value)} placeholder="e.g. Solid Remodel LLC" style={fld}></input></label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={lab}>Your name · optional</span><input value={f.owner} onChange={(e) => set('owner', e.target.value)} placeholder="e.g. Jordan Ellis" style={fld}></input></label>
      </div>
    ),
    // 2 — first project (optional)
    (
      <div key="p" style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        <div>
          <div className="bq-display" style={{ fontSize: 20, marginBottom: 4 }}>Add your first job</div>
          <div style={{ fontSize: 13, color: 'var(--bq-faint)' }}>Optional. You can skip and add jobs later. Everything you enter is saved on this device.</div>
        </div>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={lab}>Client name</span><input autoFocus value={f.clientName} onChange={(e) => set('clientName', e.target.value)} placeholder="e.g. Dan & Priya Henderson" style={fld}></input></label>
        <div style={{ display: 'flex', gap: 12 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}><span style={lab}>Project type</span><BqSelect value={f.projType} options={['Kitchen remodel', 'Bathroom remodel', 'Whole-home remodel', 'Addition', 'Basement finish', 'Deck / outdoor', 'Other']} onChange={(v) => set('projType', v)}></BqSelect></label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}><span style={lab}>Est. budget · optional</span><div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ color: 'var(--bq-faint)', fontWeight: 600 }}>$</span><input value={f.budget} onChange={(e) => set('budget', e.target.value)} inputMode="decimal" placeholder="120,000" style={fld}></input></div></label>
        </div>
      </div>
    ),
  ];
  const last = step === STEPS.length - 1;
  const canNext = step !== 1 || f.company.trim();
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 430, background: 'rgba(38,35,30,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="bq-toast-in" role="dialog" aria-modal="true" aria-label="Set up BuilderIQ" style={{ width: 'min(500px, 100%)', background: 'var(--bq-card)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 30px 70px rgba(38,35,30,0.4), 0 0 0 1px var(--bq-border)' }}>
        <div style={{ height: 4, background: 'var(--bq-subtle)' }}><div style={{ height: '100%', width: ((step + 1) / STEPS.length * 100) + '%', background: 'var(--bq-brand)', transition: 'width .25s' }}></div></div>
        <div style={{ padding: '26px 26px 4px', minHeight: 172 }}>{STEPS[step]}</div>
        <div style={{ padding: '16px 26px 22px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="bq-btn ghost sm" onClick={skip}>{step === 0 ? 'Skip setup' : 'Skip'}</button>
          <span style={{ flex: 1 }}></span>
          {step > 0 ? <button className="bq-btn ghost sm" onClick={() => setStep((s) => s - 1)}>Back</button> : null}
          {!last
            ? <button className="bq-btn primary sm" disabled={!canNext} style={{ opacity: canNext ? 1 : 0.5 }} onClick={() => canNext && setStep((s) => s + 1)}>Continue</button>
            : <button className="bq-btn primary sm" onClick={() => finish(true)}>Finish &amp; take a tour</button>}
        </div>
      </div>
    </div>
  );
}

// ── guided product tour ──
const BQ_TOUR_STEPS = [
  { sel: '.bq-side', title: 'Your whole business, in order', body: 'The sidebar follows how a job actually flows: Pipeline, Project, Money, and an Intelligence layer that watches margins for you.', place: 'right' },
  { sel: '.bq-search', title: 'Search or ask, from anywhere', body: 'Find any project, client, or invoice, or ask BuilderIQ to draft a change order or find overdue selections. Press ⌘K anytime.', place: 'bottom' },
  { sel: '[data-bq-bell]', title: 'What needs you, together', body: 'Client decisions, overdue invoices, and updates from the field and your subs all surface here as they happen.', place: 'bottom' },
  { sel: '.bq-ask-fab', title: 'AI that knows your jobs', body: 'The assistant drafts client updates, RFQs, and estimates using your real project data, and you always review before anything sends.', place: 'left' },
];
window.bqStartTour = () => { try { window.dispatchEvent(new Event('bq-start-tour')); } catch (e) {} };

function BqTour() {
  const [i, setI] = React.useState(-1);
  const [rect, setRect] = React.useState(null);
  React.useEffect(() => {
    const start = () => setI(0);
    window.addEventListener('bq-start-tour', start);
    return () => window.removeEventListener('bq-start-tour', start);
  }, []);
  const step = i >= 0 ? BQ_TOUR_STEPS[i] : null;
  React.useEffect(() => {
    if (!step) { setRect(null); return; }
    let raf;
    const measure = () => {
      const el = document.querySelector(step.sel);
      if (el) { const r = el.getBoundingClientRect(); setRect({ top: r.top, left: r.left, width: r.width, height: r.height }); }
      else { setRect(null); }
    };
    measure();
    raf = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', measure); };
  }, [i]);
  if (!step) return null;
  const close = () => setI(-1);
  const next = () => { if (i < BQ_TOUR_STEPS.length - 1) setI(i + 1); else close(); };
  const pad = 8;
  const hole = rect ? { top: rect.top - pad, left: rect.left - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 } : null;
  // tooltip placement relative to the spotlight (falls back to centered if the element is missing)
  const TW = 320;
  let tip = { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' };
  if (hole) {
    if (step.place === 'right') tip = { top: Math.max(16, hole.top), left: Math.min(window.innerWidth - TW - 16, hole.left + hole.width + 14) };
    else if (step.place === 'left') tip = { top: Math.max(16, Math.min(hole.top, window.innerHeight - 190)), left: Math.max(16, hole.left - TW - 14) };
    else if (step.place === 'bottom') tip = { top: hole.top + hole.height + 14, left: Math.max(16, Math.min(window.innerWidth - TW - 16, hole.left + hole.width / 2 - TW / 2)) };
  }
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 440 }}>
      {hole
        ? <div onClick={next} style={{ position: 'fixed', top: hole.top, left: hole.left, width: hole.width, height: hole.height, borderRadius: 12, boxShadow: '0 0 0 9999px rgba(38,35,30,0.62)', transition: 'all .25s ease', pointerEvents: 'auto' }}></div>
        : <div onClick={next} style={{ position: 'fixed', inset: 0, background: 'rgba(38,35,30,0.62)' }}></div>}
      <div className="bq-toast-in" role="dialog" aria-modal="true" aria-label={step.title} style={{ position: 'fixed', width: TW, ...tip, background: 'var(--bq-card)', borderRadius: 15, padding: '16px 17px 14px', boxShadow: '0 22px 54px rgba(38,35,30,0.4), 0 0 0 1px var(--bq-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
          <BqSpark size={13}></BqSpark>
          <span style={{ fontWeight: 700, fontSize: 14.5, flex: 1 }}>{step.title}</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.55, marginBottom: 14 }}>{step.body}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 5, flex: 1 }}>{BQ_TOUR_STEPS.map((_, k) => <span key={k} style={{ width: k === i ? 18 : 6, height: 6, borderRadius: 3, background: k === i ? 'var(--bq-brand)' : 'var(--bq-border-strong)', transition: 'width .2s' }}></span>)}</div>
          <button className="bq-btn ghost sm" onClick={close}>Skip</button>
          <button className="bq-btn primary sm" onClick={next}>{i < BQ_TOUR_STEPS.length - 1 ? 'Next' : 'Done'}</button>
        </div>
      </div>
    </div>
  );
}

// ── mount everything once, near the app root ──
function BqLaunchLayer({ side }) {
  const [onboard, setOnboard] = React.useState(false);
  React.useEffect(() => {
    if (side === 'builder' && bqNeedsOnboarding()) { const t = setTimeout(() => setOnboard(true), 500); return () => clearTimeout(t); }
  }, [side]);
  return (
    <React.Fragment>
      <BqToastHost></BqToastHost>
      <BqConfirmHost></BqConfirmHost>
      <BqPrintHost></BqPrintHost>
      <BqTour></BqTour>
      {onboard ? <BqOnboarding onClose={() => setOnboard(false)}></BqOnboarding> : null}
    </React.Fragment>
  );
}
window.BqLaunchLayer = BqLaunchLayer;
