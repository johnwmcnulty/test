// Hi-fi Proposal builder + Client approval - direction from wireframe section 3
function PropSection({ name, done, on, onClick }) {
  return (
    <button onClick={onClick} style={{ width: '100%', textAlign: 'left', font: 'inherit', border: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: 'calc(7px * var(--bq-sp)) 12px', borderRadius: 12, background: on ? 'var(--bq-brand-soft)' : 'transparent', color: on ? 'var(--bq-brand-strong)' : done ? 'var(--bq-ink)' : 'var(--bq-muted)', fontWeight: on ? 600 : 500, fontSize: 13.5, cursor: 'pointer' }}>
      <span style={{ width: 18, height: 18, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? 'var(--bq-good-soft)' : 'var(--bq-subtle)', boxShadow: done ? 'inset 0 0 0 1px #DCEBC2' : 'inset 0 0 0 1px var(--bq-border)', color: done ? 'var(--bq-good)' : 'var(--bq-faint)' }}>
        {done ? <BqIcon d={BQ_GLYPH.check} size={10} sw={2.4}></BqIcon> : null}
      </span>
      <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
    </button>
  );
}

const PROP_SECTIONS = [
  { key: 'cover', name: 'Cover' },
  { key: 'scope', name: 'Scope of work', ai: true },
  { key: 'investment', name: 'Investment' },
  { key: 'options', name: 'Options & upgrades' },
  { key: 'allowances', name: 'Allowances' },
  { key: 'payment', name: 'Payment schedule' },
  { key: 'terms', name: 'Terms & signature' },
];

function PropHead({ title, chip }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span style={{ fontWeight: 700, fontSize: 16 }}>{title}</span>
      {chip}
    </div>
  );
}
function PropLine({ label, sub, amt, strong, first }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '9px 0', borderTop: first ? 'none' : '1px solid var(--bq-border)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: strong ? 700 : 500 }}>{label}</div>
        {sub ? <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{sub}</div> : null}
      </div>
      {amt != null ? <span className="bq-num" style={{ fontSize: strong ? 15 : 13.5, fontWeight: strong ? 700 : 600, color: strong ? 'var(--bq-brand-strong)' : 'var(--bq-ink)' }}>{amt}</span> : null}
    </div>
  );
}

function PropPaper({ section, reviewed, onReview }) {
  const k = section.key;
  if (k === 'cover') {
    return (
      <React.Fragment>
        <BqPh h={130} label="cover - their kitchen, wide shot"></BqPh>
        <div>
          <div className="bq-display" style={{ fontSize: 24, lineHeight: 1.15 }}>Your Kitchen + Hall Bath Remodel</div>
          <div style={{ fontSize: 12.5, color: 'var(--bq-muted)', marginTop: 4 }}>Prepared for Dan &amp; Priya Henderson · June 2026 · Hartwell Builders</div>
        </div>
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--bq-ink)' }}>
          From our June 2 walkthrough - the island with seating for three, the refrigerator wall staying put, and the hall bath converted to a full tiled shower. Here's everything we discussed, in writing.
        </p>
      </React.Fragment>
    );
  }
  if (k === 'scope') {
    return (
      <React.Fragment>
        <PropHead title="Scope of work" chip={reviewed
          ? <span className="bq-chip good"><BqIcon d={BQ_GLYPH.check} size={11} sw={2.4}></BqIcon>Reviewed</span>
          : <span className="bq-chip ai"><BqSpark size={11}></BqSpark>AI draft - review</span>}></PropHead>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: 'var(--bq-ink)', background: reviewed ? 'transparent' : 'var(--bq-ai-soft)', borderRadius: 12, padding: reviewed ? 0 : '12px 14px', boxShadow: reviewed ? 'none' : 'inset 0 0 0 1px var(--bq-ai-border)' }}>
          We'll take your kitchen down to the studs and rebuild it around a new island with seating for three - keeping the refrigerator wall you love. In the hall bath, the tub comes out and a full-height tiled shower goes in. Throughout, we handle demolition, plumbing, electrical, and finishes, and we leave the site broom-clean every day.
        </p>
        <div>
          {[['Kitchen', 'Down-to-studs rebuild · new island · refrigerator wall retained'], ['Hall bath', 'Tub removed · full-height tiled walk-in shower'], ['Throughout', 'Demo, plumbing, electrical, finishes · daily cleanup']].map(([r, d], i) => (
            <PropLine key={r} label={r} sub={d} first={i === 0}></PropLine>
          ))}
        </div>
        {!reviewed ? (
          <button className="bq-btn soft-ai sm" style={{ alignSelf: 'flex-start' }} onClick={onReview}><BqIcon d={BQ_GLYPH.check} size={13} sw={2.2}></BqIcon>Looks good - mark reviewed</button>
        ) : null}
      </React.Fragment>
    );
  }
  if (k === 'investment') {
    return (
      <React.Fragment>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <PropHead title="Your investment"></PropHead>
          <span className="bq-num" style={{ fontSize: 26, color: 'var(--bq-brand-strong)' }}>{bqMoney(186400)}</span>
        </div>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--bq-muted)' }}>Fixed price - covers labor, materials, permits, and daily cleanup. Anything you choose beyond the allowances below is the only thing that can change this number, and never without your written approval.</p>
        <div>
          {[['Cabinetry & install', '$42,600'], ['Countertops & tile', '$24,700'], ['Plumbing & electrical', '$31,200'], ['Demo, framing & drywall', '$38,400'], ['Finishes, paint & cleanup', '$28,900'], ['Permits & overhead', '$20,600']].map(([l, a], i) => (
            <PropLine key={l} label={l} amt={a} first={i === 0}></PropLine>
          ))}
          <PropLine label="Total" amt={bqMoney(186400)} strong></PropLine>
        </div>
      </React.Fragment>
    );
  }
  if (k === 'options') {
    return (
      <React.Fragment>
        <PropHead title="Options & upgrades"></PropHead>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--bq-muted)' }}>Optional add-ons. Dan &amp; Priya can toggle these on when they approve - the total updates automatically.</p>
        <div>
          {[['Island upgrade', 'Waterfall quartz, seating for four', '+ $7,400'], ['Heated bath floor', 'Hall bath, programmable thermostat', '+ $3,900'], ['Under-cabinet lighting', 'Dimmable LED strips, whole kitchen', '+ $1,250']].map(([l, d, a], i) => (
            <PropLine key={l} label={l} sub={d} amt={a} first={i === 0}></PropLine>
          ))}
        </div>
      </React.Fragment>
    );
  }
  if (k === 'allowances') {
    return (
      <React.Fragment>
        <PropHead title="Allowances"></PropHead>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--bq-muted)' }}>An allowance is a budget set aside for an item you'll pick during the project - like tile or fixtures. If your choice costs less, you get the difference back; if it costs more, we'll write a change order first.</p>
        <div>
          {[['Plumbing fixtures', 'Faucets, shower trim, hardware', '$3,800'], ['Tile', 'Kitchen backsplash + hall bath', '$4,500'], ['Lighting fixtures', 'Decorative fixtures, not recessed', '$2,200'], ['Cabinet hardware', 'Pulls and knobs', '$1,200'], ['Appliances', 'Owner-supplied - install included', '$0']].map(([l, d, a], i) => (
            <PropLine key={l} label={l} sub={d} amt={a} first={i === 0}></PropLine>
          ))}
          <PropLine label="Total allowances" amt="$11,700" strong></PropLine>
        </div>
      </React.Fragment>
    );
  }
  if (k === 'payment') {
    return (
      <React.Fragment>
        <PropHead title="Payment schedule"></PropHead>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--bq-muted)' }}>You pay as the work hits milestones - never ahead of it. Each draw is invoiced through the portal; pay by bank transfer (free) or card.</p>
        <div>
          {[['Deposit', 'At signing', '$18,640'], ['Draw 1', 'Demolition complete', '$37,280'], ['Draw 2', 'Rough-ins complete', '$37,280'], ['Draw 3', 'Cabinets set', '$27,960'], ['Final', 'Walkthrough & punch list', '$65,240']].map(([l, d, a], i) => (
            <PropLine key={l} label={l} sub={d} amt={a} first={i === 0}></PropLine>
          ))}
          <PropLine label="Contract total" amt={bqMoney(186400)} strong></PropLine>
        </div>
      </React.Fragment>
    );
  }
  if (k === 'terms') {
    return (
      <React.Fragment>
        <PropHead title="Terms & signature"></PropHead>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {[['Timeline', 'About 14 weeks from start, weather and inspections permitting.'], ['Changes', 'Any change to scope or price is captured in a written change order you approve before work proceeds.'], ['Warranty', 'One-year workmanship warranty; manufacturer warranties pass through to you.'], ['Insurance', 'Hartwell Builders carries general liability and workers\u2019 comp · lic #41208.']].map(([t, d]) => (
            <div key={t} style={{ display: 'flex', gap: 10 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--bq-brand)', flex: 'none', marginTop: 6 }}></span>
              <div><span style={{ fontWeight: 700, fontSize: 13.5 }}>{t}. </span><span style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5 }}>{d}</span></div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--bq-border)', paddingTop: 16, marginTop: 4 }}>
          <div style={{ height: 1.5, background: 'var(--bq-border-strong)', marginBottom: 6 }}></div>
          <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>Dan &amp; Priya Henderson sign here when they approve, right inside the portal.</div>
        </div>
      </React.Fragment>
    );
  }
  // custom / added sections
  return (
    <React.Fragment>
      <PropHead title={section.name}></PropHead>
      <div style={{ border: '2px dashed var(--bq-border-strong)', borderRadius: 12, padding: '22px 16px', textAlign: 'center', color: 'var(--bq-faint)', fontSize: 13 }}>
        Empty section - write your content here, or ask the Writing desk to draft it.
      </div>
    </React.Fragment>
  );
}

function HifiProposal() {
  const [active, setActive] = React.useState('scope');
  const [reviewed, setReviewed] = React.useState({});
  const [sent, setSent] = React.useState(false);
  const [extra, setExtra] = React.useState([]);
  const sections = [...PROP_SECTIONS, ...extra];
  const isDone = (s) => !s.ai || reviewed[s.key];
  const aiPending = sections.filter((s) => s.ai && !reviewed[s.key]);
  const cur = sections.find((s) => s.key === active) || sections[0];
  const markReviewed = (key) => setReviewed((r) => ({ ...r, [key]: true }));
  const addSection = () => {
    const n = extra.length + 1;
    const key = 'custom' + n;
    setExtra((e) => [...e, { key, name: 'New section ' + n, custom: true }]);
    setActive(key);
  };
  const openPdf = () => window.bqPrintDoc && window.bqPrintDoc(
    <BqDocSheet docType="Proposal" number="Kitchen + Hall Bath Remodel" status={sent ? 'Sent' : 'Draft'}
      billTo={{ label: 'Prepared for', name: 'Dan & Priya Henderson', project: 'Kitchen + Hall Bath Remodel' }}
      meta={[{ k: 'Date', v: 'June 2026' }, { k: 'Valid for', v: '30 days' }, { k: 'License', v: '#41208' }]}
      intro="From our June 2 walkthrough: the island with seating for three, the refrigerator wall staying put, and the hall bath converted to a full tiled shower. Here's everything we discussed, in writing."
      sections={[{ h: 'Scope of work', body: "We'll take your kitchen down to the studs and rebuild it around a new island with seating for three, keeping the refrigerator wall you love. In the hall bath, the tub comes out and a full-height tiled shower goes in. Throughout, we handle demolition, plumbing, electrical, and finishes, and we leave the site broom-clean every day." }]}
      lines={[{ desc: 'Cabinetry & install', amt: 42600 }, { desc: 'Countertops & tile', amt: 24700 }, { desc: 'Plumbing & electrical', amt: 31200 }, { desc: 'Demo, framing & drywall', amt: 38400 }, { desc: 'Finishes, paint & cleanup', amt: 28900 }, { desc: 'Permits & overhead', amt: 20600 }]}
      totals={[{ k: 'Fixed-price total', v: 186400, strong: true }]}
      note={'Allowances (included above): plumbing fixtures $3,800, tile $4,500, lighting $2,200, cabinet hardware $1,200 - total $11,700. Payment schedule: 10% deposit at signing, then four progress draws at milestones, final payment at walkthrough. One-year workmanship warranty; manufacturer warranties pass through to you.'}
      footer={(window.bqCompany ? window.bqCompany() : 'Hartwell Builders') + ' · lic #41208 · Prepared with BuilderIQ'}
    ></BqDocSheet>,
    { title: 'Proposal · Henderson' }
  );

  return (
    <div className="bq-screen">
      <BqTop crumb="Proposals / Henderson - Kitchen + Hall Bath"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Proposals"></BqSide>
        <aside style={{ width: 200, flex: 'none', borderRight: '1px solid var(--bq-border)', background: 'var(--bq-card)', padding: 'calc(14px * var(--bq-sp)) 12px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-faint)', padding: '0 12px 8px' }}>Sections</div>
          {sections.map((s) => (
            <PropSection key={s.key} name={s.name} done={isDone(s)} on={active === s.key} onClick={() => setActive(s.key)}></PropSection>
          ))}
          <button className="bq-btn ghost sm" style={{ alignSelf: 'flex-start', marginTop: 8 }} onClick={addSection}>+ Add section</button>
        </aside>

        <main style={{ flex: 1, background: 'var(--bq-subtle)', display: 'flex', justifyContent: 'center', padding: 'calc(24px * var(--bq-sp))', overflow: 'auto' }}>
          <div style={{ width: 480, background: 'var(--bq-raise)', borderRadius: 16, boxShadow: '0 8px 30px rgba(38,35,30,0.10), 0 0 0 1px var(--bq-border)', padding: 'calc(28px * var(--bq-sp)) 32px', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'visible', alignSelf: 'flex-start' }}>
            <PropPaper section={cur} reviewed={!!reviewed[cur.key]} onReview={() => markReviewed(cur.key)}></PropPaper>
          </div>
        </main>

        <aside className="ai-expanded" style={{ width: 280, flex: 'none', borderLeft: '1px solid var(--bq-border)', background: 'var(--bq-ai-soft)', padding: 'calc(14px * var(--bq-sp)) 16px', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BqSpark></BqSpark>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--bq-ai-strong)' }}>Writing desk</span>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 6 }}>Tone</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <span className="bq-chip">Plain</span>
              <span className="bq-chip brand">Warm</span>
              <span className="bq-chip">Formal</span>
            </div>
          </div>
          <div style={{ background: 'var(--bq-raise)', borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 12.5, color: 'var(--bq-muted)', lineHeight: 1.45 }}>Rewrite the scope in homeowner language - no trade jargon.</span>
            <button className="bq-btn ai sm" style={{ alignSelf: 'flex-start' }} onClick={() => { setActive('scope'); markReviewed('scope'); }}>Rewrite scope</button>
          </div>
          <div style={{ background: 'var(--bq-raise)', borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 12.5, color: 'var(--bq-muted)', lineHeight: 1.45 }}>Jump to the allowances and explain what they mean.</span>
            <button className="bq-btn ai sm" style={{ alignSelf: 'flex-start' }} onClick={() => setActive('allowances')}>Open allowances</button>
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="bq-btn ghost sm" onClick={openPdf}><BqIcon d={BQ_GLYPH.exports} size={14}></BqIcon>Preview &amp; download PDF</button>
            {sent ? (
              <React.Fragment>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bq-good-soft)', borderRadius: 12, padding: '10px 13px', boxShadow: 'inset 0 0 0 1px #DCEBC2' }}>
                  <span style={{ width: 24, height: 24, borderRadius: 7, background: 'var(--bq-good)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={BQ_GLYPH.check} size={13} sw={2.4}></BqIcon></span>
                  <span style={{ fontSize: 12.5, color: 'var(--bq-ink)', lineHeight: 1.35 }}>Sent to Dan &amp; Priya · they'll get an email + portal notice</span>
                </div>
                <button className="bq-btn soft-ai sm" onClick={() => window.__bqNav && window.__bqNav('Client view')}>Open client view →</button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div style={{ fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, color: aiPending.length ? 'var(--bq-ai-strong)' : 'var(--bq-good)' }}>
                  {aiPending.length
                    ? <React.Fragment><BqSpark size={12}></BqSpark>{aiPending.length} AI section{aiPending.length > 1 ? 's' : ''} awaiting your review</React.Fragment>
                    : <React.Fragment><BqIcon d={BQ_GLYPH.check} size={13} sw={2.2}></BqIcon>All sections reviewed</React.Fragment>}
                </div>
                <button className="bq-btn primary" style={{ opacity: aiPending.length ? 0.5 : 1, cursor: aiPending.length ? 'not-allowed' : 'pointer' }} title={aiPending.length ? 'Review all AI sections to unlock' : 'Send the proposal to your client'} onClick={() => { if (!aiPending.length) setSent(true); else setActive(aiPending[0].key); }}>
                  {aiPending.length ? 'Send to client 🔒' : 'Send to client'}
                </button>
              </React.Fragment>
            )}
          </div>
        </aside>
        <div className="ai-collapsed" style={{ position: 'absolute', right: 20, bottom: 20 }}>
          <button className="bq-btn ai" style={{ borderRadius: 999, boxShadow: '0 8px 20px rgba(124,58,237,0.35)' }}>
            <BqIcon d={BQ_GLYPH.spark} size={15}></BqIcon>Writing desk
          </button>
        </div>
      </div>
    </div>
  );
}

function ApprovalOption({ name, price, note, sel, onToggle }) {
  return (
    <div onClick={onToggle} style={{ flex: 1, background: 'var(--bq-raise)', borderRadius: 16, boxShadow: sel ? '0 0 0 2px var(--bq-brand)' : 'inset 0 0 0 1px var(--bq-border)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6, cursor: onToggle ? 'pointer' : 'default' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: 13.5 }}>{name}</span>
        <span style={{ width: 20, height: 20, borderRadius: 7, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: sel ? 'var(--bq-brand)' : 'var(--bq-subtle)', boxShadow: sel ? 'none' : 'inset 0 0 0 1px var(--bq-border-strong)', color: '#fff' }}>
          {sel ? <BqIcon d={BQ_GLYPH.check} size={11} sw={2.6}></BqIcon> : null}
        </span>
      </div>
      <span className="bq-num" style={{ fontSize: 19, color: sel ? 'var(--bq-brand-strong)' : 'var(--bq-ink)' }}>{price}</span>
      <span style={{ fontSize: 12, color: 'var(--bq-muted)', lineHeight: 1.4 }}>{note}</span>
    </div>
  );
}

function HifiApproval() {
  const fmtA = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const [island, setIsland] = React.useState(false);
  const [floor, setFloor] = React.useState(false);
  const [approved, setApproved] = React.useState(false);
  const total = 186400 + (island ? 7400 : 0) + (floor ? 3900 : 0);
  return (
    <div className="bq-screen" style={{ background: '#F4F1EB' }}>
      <div style={{ background: 'var(--bq-card)', borderBottom: '1px solid var(--bq-border)', padding: '10px 28px', display: 'flex', alignItems: 'center', gap: 12, flex: 'none', fontSize: 12, color: 'var(--bq-faint)' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--bq-border-strong)' }}></span>
        portal.builderiq.com/henderson/proposal
      </div>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 720, padding: 'calc(24px * var(--bq-sp)) 0', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'hidden' }}>
          <BqPh h={150} label="hero - their kitchen, wide shot" style={{ borderRadius: 20 }}></BqPh>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span className="bq-display" style={{ fontSize: 26 }}>Your Kitchen + Hall Bath Remodel</span>
            <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--bq-muted)' }}>Hartwell Builders · lic #41208</span>
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--bq-ink)' }}>
            Everything below reflects what we walked through on June 2 - the island with seating for three, the refrigerator wall staying put, and the hall bath converted to a full tiled shower. Fixed price, four progress payments, done before Thanksgiving.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <ApprovalOption name="As specified" price={bqMoney(186400)} note="Everything in the scope above" sel></ApprovalOption>
            <ApprovalOption name="+ Island upgrade" price="+ $7,400" note="Waterfall quartz, seating for four" sel={island} onToggle={approved ? null : () => setIsland(!island)}></ApprovalOption>
            <ApprovalOption name="+ Heated bath floor" price="+ $3,900" note="Hall bath, programmable thermostat" sel={floor} onToggle={approved ? null : () => setFloor(!floor)}></ApprovalOption>
          </div>
          <div style={{ background: 'var(--bq-raise)', borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--bq-border)', padding: '10px 18px', display: 'flex', gap: 18, fontSize: 12.5, color: 'var(--bq-muted)', alignItems: 'center' }}>
            <span>Your total - <b className="bq-num" style={{ color: 'var(--bq-brand-strong)', fontSize: 15 }}>{fmtA(total)}</b></span>
            <span style={{ color: 'var(--bq-border-strong)' }}>|</span>
            <span>Deposit 10% - <b style={{ color: 'var(--bq-ink)' }}>{fmtA(total * 0.1)}</b></span>
            <span style={{ color: 'var(--bq-border-strong)' }}>|</span>
            <span>4 progress draws at milestones</span>
            <span style={{ color: 'var(--bq-border-strong)' }}>|</span>
            <span>Final payment on walkthrough</span>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', marginTop: 'auto', paddingBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Caveat, cursive', fontSize: 30, color: '#2b3c8f', transform: 'rotate(-2deg)', paddingLeft: 8, opacity: approved ? 1 : 0.35 }}>Dan Henderson</div>
              <div style={{ borderBottom: '1.5px solid var(--bq-ink)' }}></div>
              <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', marginTop: 4 }}>{approved ? 'Signed June 12, 2026 · 9:41 AM' : 'Sign with your finger or trackpad'}</div>
            </div>
            {approved
              ? <span className="bq-chip good" style={{ fontSize: 14, padding: '10px 22px', borderRadius: 14 }}>Approved ✓ · deposit {fmtA(total * 0.1)} received</span>
              : <button className="bq-btn primary" style={{ fontSize: 15, padding: '12px 28px', borderRadius: 14 }} onClick={() => setApproved(true)}>Approve &amp; pay deposit</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HifiProposal, HifiApproval });
