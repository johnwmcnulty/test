// Hi-fi AI Weekly Update generator - pulls activity → reviewable homeowner update
function WkSource({ label, count, on, onToggle }) {
  return (
    <button onClick={onToggle} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 12, border: 'none', cursor: 'pointer', background: on ? 'var(--bq-ai-soft)' : 'var(--bq-subtle)', boxShadow: on ? 'inset 0 0 0 1px var(--bq-ai-border)' : 'inset 0 0 0 1px var(--bq-border)', font: 'inherit', width: '100%', textAlign: 'left' }}>
      <span style={{ width: 18, height: 18, borderRadius: 6, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'var(--bq-ai)' : '#fff', boxShadow: on ? 'none' : 'inset 0 0 0 1.5px var(--bq-border-strong)' }}>
        {on ? <BqIcon d={BQ_GLYPH.check} size={11} sw={2.6} style={{ color: '#fff' }}></BqIcon> : null}
      </span>
      <span style={{ flex: 1, fontSize: 13, color: 'var(--bq-ink)' }}>{label}</span>
      <span className="bq-chip" style={{ background: 'var(--bq-raise)' }}>{count}</span>
    </button>
  );
}

function HifiWeekly() {
  const [phase, setPhase] = React.useState('input');
  const [srcs, setSrcs] = React.useState({ done: true, next: true, sched: true, logs: true, photos: true, sel: true, co: true, inv: true });
  const toggle = (k) => setSrcs((s) => ({ ...s, [k]: !s[k] }));
  const SOURCES = [
    ['done', 'Completed this week', '5 tasks'], ['next', 'Upcoming next week', '4 tasks'],
    ['sched', 'Schedule changes', '1'], ['logs', 'Daily logs', '4'], ['photos', 'New photos', '23'],
    ['sel', 'Pending selections', '2'], ['co', 'Pending change orders', '1'], ['inv', 'Invoices / payments', '1'],
  ];
  const generate = () => { setPhase('thinking'); setTimeout(() => setPhase('draft'), 1100); };

  const SECTIONS = [
    ['This week', 'We set the new structural beam across the kitchen and dining room and passed the city framing inspection - a big milestone that clears us for electrical and plumbing. Demo is fully complete and the space is opening up just like the plan.'],
    ['Next week', 'Electrical and plumbing rough-in continue, and your cabinets are scheduled to arrive Thursday. Once they\'re set we\'ll template for countertops.'],
    ['Decisions we need from you', 'Two selections are waiting on you in the portal: the hall-bath tile and the kitchen faucet. Approving these by Friday keeps cabinets and counters on schedule.'],
    ['Schedule status', 'On track overall. The countertop template may shift a few days depending on cabinet delivery - we\'ll confirm by Friday.'],
    ['Budget note', 'One small change order (electrical service upgrade) is ready for your review. The hall-bath tile you loved runs slightly over its allowance - we\'ve outlined options in the portal.'],
  ];

  return (
    <div className="bq-screen">
      <BqTop crumb="Clients / Henderson / Weekly Update"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Clients"></BqSide>
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 'min(720px, 100%)', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="bq-logomark" style={{ background: 'var(--bq-ai)' }}><BqIcon d={BQ_GLYPH.spark} size={16} sw={1.5} style={{ color: '#fff' }}></BqIcon></span>
              <div style={{ flex: 1 }}>
                <div className="bq-display" style={{ fontSize: 21 }}>Weekly update - Henderson</div>
                <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Week of Jun 9 · for Dan &amp; Priya Henderson</div>
              </div>
              {phase === 'draft' ? <button className="bq-btn ghost sm" onClick={() => setPhase('input')}>← Sources</button> : null}
            </div>

            {phase === 'input' ? (
              <React.Fragment>
                <div className="bq-card-s" style={{ padding: 'calc(16px * var(--bq-sp)) 18px' }}>
                  <div style={{ fontSize: 13, color: 'var(--bq-muted)', marginBottom: 12 }}>BuilderIQ pulled this week's activity from the project. Pick what to include - the AI writes a friendly homeowner update.</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {SOURCES.map(([k, l, c]) => <WkSource key={k} label={l} count={c} on={srcs[k]} onToggle={() => toggle(k)}></WkSource>)}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button className="bq-btn ai" onClick={generate}><BqSpark size={15}></BqSpark>Generate update</button>
                  <span style={{ fontSize: 12, color: 'var(--bq-faint)' }}>You'll review and edit before it's sent to the portal.</span>
                </div>
              </React.Fragment>
            ) : phase === 'thinking' ? (
              <div className="bq-card-s" style={{ padding: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <span className="bq-spark" style={{ animation: 'bqpulse 1s ease-in-out infinite', display: 'inline-flex' }}><BqIcon d={BQ_GLYPH.spark} size={22}></BqIcon></span>
                <span className="bq-display" style={{ fontSize: 17 }}>Writing the Hendersons' update…</span>
              </div>
            ) : (
              <React.Fragment>
                <div className="bq-ai-card" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px' }}>
                  <BqSpark size={14}></BqSpark>
                  <span style={{ fontSize: 13, color: 'var(--bq-ink)' }}>Draft ready. <b>Review before sending</b> - it'll post to the client portal and email Dan &amp; Priya.</span>
                </div>
                <div className="bq-card-s" style={{ padding: 'calc(20px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ fontSize: 14, color: 'var(--bq-ink)' }}>Hi Dan &amp; Priya,</div>
                  {SECTIONS.map(([h, b]) => (
                    <div key={h}>
                      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-ai-strong)', marginBottom: 4 }}>{h}</div>
                      <div style={{ fontSize: 13.5, color: 'var(--bq-ink)', lineHeight: 1.6 }}>{b}</div>
                    </div>
                  ))}
                  <div style={{ fontSize: 13.5, color: 'var(--bq-ink)', lineHeight: 1.6 }}>As always, reply here or call anytime. Thanks for being such a pleasure to build for!<br></br>- Maria, Hartwell Builders</div>
                  <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
                    <BqPh h={70} label="3 of 23 photos" style={{ flex: 1 }}></BqPh>
                    <BqPh h={70} label="" style={{ flex: 1 }}></BqPh>
                    <BqPh h={70} label="" style={{ flex: 1 }}></BqPh>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button className="bq-btn primary" onClick={() => window.__bqNav2 && window.__bqNav2('client', 'Portal')}>Send to portal &amp; email</button>
                  <button className="bq-btn soft-ai sm"><BqSpark size={12}></BqSpark>Make warmer</button>
                  <button className="bq-btn ghost sm">Edit</button>
                </div>
              </React.Fragment>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
window.HifiWeekly = HifiWeekly;
