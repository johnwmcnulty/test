// BuilderIQ - Setup, Billing & plan, Audit log. Rendered as panels INSIDE the Settings
// hub (so the Settings nav rail stays on every page); thin shells keep direct routes working.

function SettingsShell({ crumb, children }) {
  return (
    <div className="bq-screen">
      <BqTop crumb={'Settings / ' + crumb}></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Settings"></BqSide>
        <main style={{ flex: 1, padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))', overflow: 'auto' }}>{children}</main>
      </div>
    </div>
  );
}

// ════════════════════════════ SETUP WIZARD ════════════════════════════
const SETUP_STEPS0 = [
  { id: 'profile', g: 'leads', title: 'Set up your company profile', desc: 'Logo, license #, address - appears on every proposal & invoice.', done: true },
  { id: 'team', g: 'partners', title: 'Invite your team', desc: 'Add your PM and crew leads so work can be assigned.', done: true, meta: '3 members' },
  { id: 'catalog', g: 'catalog', title: 'Import your price book', desc: 'Bring in labor rates, materials, and assemblies.', done: true, meta: '142 items' },
  { id: 'tax', g: 'finance', title: 'Set default markup & tax', desc: 'So estimates calculate margin and tax automatically.', done: true },
  { id: 'template', g: 'proposal', title: 'Customize a proposal template', desc: 'Your terms, payment schedule, and branding.', done: true },
  { id: 'project', g: 'projects', title: 'Create your first project', desc: 'Your first project is live.', done: true },
  { id: 'quickbooks', g: 'bank', title: 'Connect QuickBooks Online', desc: 'Sync invoices, expenses, and job costing to your books.', done: false, cta: 'Connect' },
  { id: 'payments', g: 'pay', title: 'Turn on online payments', desc: 'Let clients pay draws by card or bank - faster collections.', done: false, cta: 'Enable payments' },
  { id: 'client', g: 'globe', title: 'Invite a client to the portal', desc: 'Give clients access to updates, photos & decisions.', done: false, cta: 'Send invite' },
];

function SetupRing({ pct }) {
  const c = 2 * Math.PI * 32;
  return (
    <svg width="86" height="86" viewBox="0 0 86 86" style={{ flex: 'none' }}>
      <circle cx="43" cy="43" r="32" fill="none" stroke="var(--bq-subtle)" strokeWidth="9"></circle>
      <circle cx="43" cy="43" r="32" fill="none" stroke="var(--bq-brand)" strokeWidth="9" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 43 43)"></circle>
      <text x="43" y="49" textAnchor="middle" fontSize="20" fontWeight="700" fill="var(--bq-ink)" fontFamily="Work Sans, sans-serif">{pct}%</text>
    </svg>
  );
}

function SetupBody() {
  const [steps, setSteps] = React.useState(SETUP_STEPS0);
  const done = steps.filter((s) => s.done).length;
  const pct = Math.round(done / steps.length * 100);
  const toggle = (id) => setSteps((ss) => ss.map((s) => s.id === id ? { ...s, done: !s.done } : s));
  const who = (window.__bqProfile && window.__bqProfile.get().first) || 'there';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
      <PfHead title="Setup checklist" sub="Finish wiring up your shop - connect your books, turn on payments, and invite a client to close the loop from estimate to deposit."></PfHead>
      <section className="bq-card-s" style={{ padding: '22px 26px', flex: 'none', display: 'flex', alignItems: 'center', gap: 22, background: 'linear-gradient(120deg, var(--bq-brand-soft), var(--bq-card) 70%)' }}>
        <SetupRing pct={pct}></SetupRing>
        <div style={{ flex: 1 }}>
          <div className="bq-display" style={{ fontSize: 23 }}>Welcome to BuilderIQ, {who}</div>
          <div style={{ fontSize: 13.5, color: 'var(--bq-muted)', lineHeight: 1.5, marginTop: 4, maxWidth: 560 }}>You're <b>{steps.length - done} steps</b> from a fully wired shop - connect your books and turn on payments to close the loop from estimate to deposit.</div>
        </div>
        <button className="bq-btn primary">Finish setup</button>
      </section>
      <section className="bq-card-s" style={{ overflow: 'hidden' }}>
        {steps.map((s, i) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderTop: i ? '1px solid var(--bq-border)' : 'none', opacity: s.done ? 0.72 : 1 }}>
            <button onClick={() => toggle(s.id)} style={{ width: 26, height: 26, borderRadius: '50%', flex: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: s.done ? 'var(--bq-good)' : 'var(--bq-subtle)', color: s.done ? '#fff' : 'var(--bq-faint)', boxShadow: s.done ? 'none' : 'inset 0 0 0 2px var(--bq-border-strong)' }}>
              {s.done ? <BqIcon d={BQ_GLYPH.check} size={15} sw={2.4}></BqIcon> : null}
            </button>
            <span style={{ width: 34, height: 34, borderRadius: 9, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-subtle)', color: 'var(--bq-muted)' }}><BqIcon d={BQ_GLYPH[s.g]} size={17}></BqIcon></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14, textDecoration: s.done ? 'line-through' : 'none', color: s.done ? 'var(--bq-muted)' : 'var(--bq-ink)' }}>{s.title}</span>
                {s.meta ? <span className="bq-chip" style={{ fontSize: 10.5, padding: '0 7px' }}>{s.meta}</span> : null}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--bq-faint)', marginTop: 1 }}>{s.desc}</div>
            </div>
            {!s.done ? <button className="bq-btn sm" onClick={() => toggle(s.id)}>{s.cta || 'Set up'}</button> : <span className="bq-chip good" style={{ fontSize: 10.5 }}>Done</span>}
          </div>
        ))}
      </section>
    </div>
  );
}
function HifiSetup() { return <SettingsShell crumb="Setup checklist"><SetupBody></SetupBody></SettingsShell>; }
window.HifiSetup = HifiSetup;

// ════════════════════════════ BILLING & PLAN ════════════════════════════
const BILL_PLANS = [
  { name: 'Starter', price: 99, blurb: 'Solo + 1 office user', feats: ['Up to 5 active projects', '2 seats', 'Estimates & proposals', 'Client portal'], cur: false },
  { name: 'Pro', price: 249, blurb: 'Growing remodeler', feats: ['Unlimited projects', '8 seats included', 'Profit Watchdog + AI', 'QuickBooks sync', 'Online payments'], cur: true },
  { name: 'Crew', price: 499, blurb: 'Multi-crew shop', feats: ['Everything in Pro', '25 seats included', 'Capacity planning', 'Custom roles & SSO', 'Priority support'], cur: false },
];
const BILL_INVOICES = [
  ['Jun 1, 2026', 'Pro plan - monthly', '$249.00', 'Paid'],
  ['May 1, 2026', 'Pro plan - monthly', '$249.00', 'Paid'],
  ['Apr 1, 2026', 'Pro plan - monthly', '$249.00', 'Paid'],
  ['Mar 1, 2026', 'Pro plan + 2 seats', '$289.00', 'Paid'],
];

function BillingBody() {
  const billedTo = (window.__bqProfile && window.__bqProfile.get().email) || 'your account on file';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
      <PfHead title="Billing & plan" sub="Your subscription, seat usage, payment method, and full invoice history - manage your BuilderIQ plan here."></PfHead>
      <div style={{ display: 'flex', gap: 'calc(14px * var(--bq-sp))', flexWrap: 'wrap' }}>
        <section className="bq-card-s" style={{ flex: '2 1 360px', padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span className="bq-chip ai">Current plan</span>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Pro</span>
            <span style={{ flex: 1 }}></span>
            <span className="bq-num" style={{ fontSize: 22 }}>$249<span style={{ fontSize: 12, color: 'var(--bq-faint)', fontWeight: 500 }}>/mo</span></span>
          </div>
          {[['Seats', 6, 8, 'ai'], ['Active projects', 9, 999, null], ['Document storage', 31, 100, null]].map(([lbl, used, cap, tone]) => (
            <div key={lbl} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', fontSize: 12.5, marginBottom: 5 }}><span style={{ flex: 1, color: 'var(--bq-muted)' }}>{lbl}</span><span className="bq-num" style={{ fontSize: 12.5 }}>{used}{cap < 900 ? ' / ' + cap : ' · unlimited'}{lbl === 'Document storage' ? ' GB' : ''}</span></div>
              {cap < 900 ? <BqMeter pct={used / cap * 100} tone={tone}></BqMeter> : null}
            </div>
          ))}
          <div style={{ fontSize: 12, color: 'var(--bq-faint)', marginTop: 6 }}>Renews Jul 1, 2026 · 2 seats remaining</div>
        </section>
        <section className="bq-card-s" style={{ flex: '1 1 240px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Payment method</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 14px', borderRadius: 12, background: 'var(--bq-subtle)' }}>
            <span style={{ width: 38, height: 26, borderRadius: 6, background: 'var(--bq-ink)', color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>VISA</span>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13 }}>•••• 4242</div><div style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>Exp 09/27</div></div>
          </div>
          <button className="bq-btn sm" style={{ alignSelf: 'flex-start' }}>Update card</button>
          <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', marginTop: 'auto' }}>Billed to {billedTo}</div>
        </section>
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, marginTop: 4 }}>Plans</div>
      <div style={{ display: 'flex', gap: 'calc(14px * var(--bq-sp))', flexWrap: 'wrap' }}>
        {BILL_PLANS.map((p) => (
          <section key={p.name} className={p.cur ? 'bq-ai-card' : 'bq-card-s'} style={{ flex: '1 1 220px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12, boxShadow: p.cur ? '0 0 0 2px var(--bq-ai)' : undefined }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</span>{p.cur ? <span className="bq-chip ai">Your plan</span> : null}</div>
              <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{p.blurb}</div>
            </div>
            <div className="bq-num" style={{ fontSize: 26 }}>${p.price}<span style={{ fontSize: 12, color: 'var(--bq-faint)', fontWeight: 500 }}>/mo</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {p.feats.map((f) => <div key={f} style={{ display: 'flex', gap: 8, fontSize: 12.5, color: 'var(--bq-muted)' }}><BqIcon d={BQ_GLYPH.check} size={14} sw={2.2} style={{ color: 'var(--bq-good)', flex: 'none', marginTop: 1 }}></BqIcon>{f}</div>)}
            </div>
            <button className={'bq-btn sm ' + (p.cur ? 'ghost' : p.name === 'Crew' ? 'ai' : 'primary')} style={{ marginTop: 'auto' }} disabled={p.cur}>{p.cur ? 'Current' : p.price > 249 ? 'Upgrade' : 'Downgrade'}</button>
          </section>
        ))}
      </div>
      <div style={{ fontWeight: 700, fontSize: 14, marginTop: 4 }}>Billing history</div>
      <section className="bq-card-s" style={{ overflow: 'hidden' }}>
        <div className="bq-trow head" style={{ gridTemplateColumns: '1fr 2fr 1fr 0.8fr 0.6fr' }}><span>Date</span><span>Description</span><span>Amount</span><span>Status</span><span></span></div>
        {BILL_INVOICES.map((r, i) => (
          <div key={i} className="bq-trow" style={{ gridTemplateColumns: '1fr 2fr 1fr 0.8fr 0.6fr', alignItems: 'center' }}>
            <span style={{ color: 'var(--bq-muted)', fontSize: 13 }}>{r[0]}</span>
            <span style={{ fontWeight: 500 }}>{r[1]}</span>
            <span className="cell-num">{r[2]}</span>
            <span className="bq-chip good" style={{ justifySelf: 'start' }}>{r[3]}</span>
            <button className="bq-btn ghost sm" style={{ justifySelf: 'end' }}><BqIcon d={BQ_GLYPH.exports} size={13}></BqIcon></button>
          </div>
        ))}
      </section>
    </div>
  );
}
function HifiBilling() { return <SettingsShell crumb="Billing & plan"><BillingBody></BillingBody></SettingsShell>; }
window.HifiBilling = HifiBilling;

// ════════════════════════════ AUDIT LOG ════════════════════════════
const AUDIT_TYPES = [['all', 'All activity'], ['money', 'Financial'], ['docs', 'Documents'], ['access', 'Access & roles'], ['ai', 'AI actions']];
const AUDIT_LOG = [
  { who: 'Maria Hartwell', init: 'MH', type: 'money', action: 'Approved change order', entity: 'CO-001 · Henderson · +$2,680', time: '14m ago', ip: 'Austin, TX' },
  { who: 'BuilderIQ AI', init: 'AI', ai: true, type: 'ai', action: 'Drafted weekly client update', entity: 'Henderson · sent for review', time: '38m ago', ip: 'System' },
  { who: 'Mike Reyes', init: 'MR', type: 'money', action: 'Edited budget line', entity: 'Henderson · Plumbing labor $8,400 → $9,150', time: '1h ago', ip: 'Austin, TX' },
  { who: 'Bright Electric', init: 'BE', type: 'docs', action: 'Uploaded certificate of insurance', entity: 'COI · valid to Aug 2026', time: '2h ago', ip: 'Round Rock, TX' },
  { who: 'System', init: 'SY', type: 'money', action: 'Sent invoice reminder', entity: 'INV-0004 · Henderson · $4,480 overdue', time: '3h ago', ip: 'System' },
  { who: 'Maria Hartwell', init: 'MH', type: 'access', action: 'Changed role', entity: 'Mike Reyes → Project Manager', time: 'Yesterday', ip: 'Austin, TX' },
  { who: 'Dan Henderson', init: 'DH', type: 'docs', action: 'Signed proposal', entity: 'Henderson - Kitchen + Hall Bath · $186,400', time: 'Yesterday', ip: 'Client portal' },
  { who: 'BuilderIQ AI', init: 'AI', ai: true, type: 'ai', action: 'Flagged margin risk', entity: 'Tanaka · projected margin 16.7%', time: 'Yesterday', ip: 'System' },
  { who: 'Carla Núñez', init: 'CN', type: 'access', action: 'Signed in', entity: 'New device · Chrome on macOS', time: '2d ago', ip: 'Austin, TX' },
  { who: 'Maria Hartwell', init: 'MH', type: 'docs', action: 'Exported WIP report', entity: 'All projects · sent to CPA', time: '2d ago', ip: 'Austin, TX' },
];

function AuditBody() {
  const [filter, setFilter] = React.useState('all');
  const clean = !!(window.bqClean && window.bqClean());
  const rows = clean ? [] : AUDIT_LOG.filter((r) => filter === 'all' || r.type === filter);
  const cols = '1.4fr 1.3fr 2fr 0.9fr';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(13px * var(--bq-sp))' }}>
      <PfHead title="Audit log" sub="Every change across your workspace - who made it and when. Tamper-proof and retained for 7 years.">
        <button className="bq-btn sm"><BqIcon d={BQ_GLYPH.exports} size={13}></BqIcon>Export</button>
      </PfHead>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {AUDIT_TYPES.map(([k, lbl]) => (
          <button key={k} onClick={() => setFilter(k)} className={'bq-chip' + (filter === k ? ' ai' : '')} style={{ cursor: 'pointer', border: 'none', font: 'inherit', padding: '5px 13px' }}>{lbl}</button>
        ))}
      </div>
      {rows.length ? (
        <section className="bq-card-s" style={{ overflow: 'hidden' }}>
          <div className="bq-trow head" style={{ gridTemplateColumns: cols }}><span>User</span><span>Action</span><span>Detail</span><span>When</span></div>
          {rows.map((r, i) => (
            <div key={i} className="bq-trow" style={{ gridTemplateColumns: cols, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, background: r.ai ? 'var(--bq-ai-soft)' : 'var(--bq-brand-soft)', color: r.ai ? 'var(--bq-ai-strong)' : 'var(--bq-brand-strong)', boxShadow: 'inset 0 0 0 1px ' + (r.ai ? 'var(--bq-ai-border)' : 'var(--bq-brand-border)') }}>{r.ai ? <BqSpark size={12}></BqSpark> : r.init}</span>
                <span style={{ fontWeight: 600, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.who}</span>
              </div>
              <span style={{ fontSize: 13, color: 'var(--bq-ink)' }}>{r.action}</span>
              <span style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{r.entity}</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{r.time}</span><span style={{ fontSize: 11, color: 'var(--bq-faint)' }}>{r.ip}</span></div>
            </div>
          ))}
        </section>
      ) : (
        <div className="bq-card-s" style={{ padding: '40px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--bq-subtle)', color: 'var(--bq-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH.history} size={22}></BqIcon></span>
          <div style={{ fontWeight: 700, fontSize: 15 }}>No activity yet</div>
          <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5, maxWidth: 400 }}>Every change across your workspace - approvals, edits, sign-ins, AI actions - is recorded here with who, what, and when.</div>
        </div>
      )}
    </div>
  );
}
function HifiAudit() { return <SettingsShell crumb="Audit log"><AuditBody></AuditBody></SettingsShell>; }
window.HifiAudit = HifiAudit;

// register as Settings-hub panels so the nav rail stays on these pages
window.BQ_PANELS = window.BQ_PANELS || {};
Object.assign(window.BQ_PANELS, { setup: SetupBody, billing: BillingBody, audit: AuditBody });
