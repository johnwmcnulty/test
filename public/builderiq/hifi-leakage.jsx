// Hi-fi AI Change Order Leakage Detector - evidence + confidence + suggested CO + actions
const LEAK_ITEMS = [
  {
    id: 'l1', title: 'Cloth-wiring remediation in hall wall', conf: 92, cat: 'Hidden condition', cost: '$1,800–$2,400', sched: '+1–2 days',
    source: 'Daily log · Jun 11', evidence: 'Electrician started panel but found old cloth wiring in the wall by the hall - gonna need to flag that, possible extra.',
    scope: 'Remove and replace ~18 ft of deteriorated cloth-insulated wiring discovered behind the hall wall; not in original scope (concealed condition).',
    rec: 'Create change order',
  },
  {
    id: 'l2', title: 'Matte black faucet upgrade', conf: 78, cat: 'Material upgrade', cost: '$40 + handling', sched: 'None',
    source: 'Client message · Today', evidence: 'Priya saw a matte black faucet she loves, is it too late to switch from the brushed nickel we picked?',
    scope: 'Upgrade kitchen faucet from spec\'d brushed nickel to client-selected matte black finish. Minor allowance overage.',
    rec: 'Create selection change',
  },
  {
    id: 'l3', title: 'Hall-bath tile over allowance', conf: 95, cat: 'Allowance exceeded', cost: '$1,380', sched: '+3 days',
    source: 'Selection · Floor + shower tile', evidence: 'Selected "Zellige + hex mosaic" at $4,480 against a $3,100 allowance - $1,380 over, no CO on file.',
    scope: 'Capture the $1,380 overage on the hall-bath tile selection the client approved. Currently uncaptured margin leakage.',
    rec: 'Create change order',
  },
  {
    id: 'l4', title: 'Added under-cabinet lighting request', conf: 64, cat: 'Client requested', cost: 'Est. $900–$1,200', sched: 'None',
    source: 'Task comment · Mike R.', evidence: 'Client asked at walkthrough if we can add LED under-cabinet lights - wasn\'t in the estimate.',
    scope: 'Furnish and install under-cabinet LED lighting across kitchen run, including transformer and dimmer. Not in original estimate.',
    rec: 'Create task to quote',
  },
];
const LEAK_CONF = (c) => c >= 90 ? ['good', 'High'] : c >= 75 ? ['ai', 'Likely'] : ['brand', 'Review'];

function HifiLeakage() {
  const [handled, setHandled] = React.useState({});
  const live = LEAK_ITEMS.filter((i) => !handled[i.id]);
  const captured = LEAK_ITEMS.filter((i) => handled[i.id] === 'co').length;

  return (
    <div className="bq-screen">
      <BqTop crumb="Change Orders / Leakage Detector"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Change Orders"></BqSide>
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="bq-logomark" style={{ background: 'var(--bq-ai)' }}><BqIcon d={BQ_GLYPH.spark} size={16} sw={1.5} style={{ color: '#fff' }}></BqIcon></span>
            <div style={{ flex: 1 }}>
              <div className="bq-display" style={{ fontSize: 22 }}>Change order leakage</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Henderson - AI scanned logs, messages, selections &amp; comments · {live.length} possible unbilled changes</div>
            </div>
          </div>

          <div className="bq-ai-card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
            <BqIcon d="M12 4 L21 19 H3 Z M12 10 V14 M12 16.5 V16.6" size={18} style={{ color: 'var(--bq-ai-strong)', flex: 'none' }}></BqIcon>
            <span style={{ fontSize: 13, color: 'var(--bq-ink)', lineHeight: 1.45 }}>
              Up to <b>~$5,400</b> of scope changes may be uncaptured on this project. Review each below - <b>nothing is billed automatically</b>.
            </span>
            {captured ? <span className="bq-chip good" style={{ marginLeft: 'auto' }}>{captured} captured</span> : null}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(12px * var(--bq-sp))' }}>
            {live.map((it) => {
              const [ctone, clabel] = LEAK_CONF(it.conf);
              return (
                <div key={it.id} className="bq-card-s" style={{ padding: 'calc(16px * var(--bq-sp)) 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{it.title}</span>
                        <span className="bq-chip">{it.cat}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flex: 'none' }}>
                      <div className="bq-num" style={{ fontSize: 18, color: ctone === 'brand' ? 'var(--bq-brand-strong)' : ctone === 'good' ? 'var(--bq-good)' : 'var(--bq-ai-strong)' }}>{it.conf}%</div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--bq-faint)' }}>{clabel} confidence</div>
                    </div>
                  </div>

                  {/* evidence */}
                  <div style={{ display: 'flex', gap: 9, margin: '12px 0', padding: '11px 14px', background: 'var(--bq-subtle)', borderRadius: 12, borderLeft: '3px solid var(--bq-ai)' }}>
                    <BqIcon d={BQ_GLYPH[it.source.startsWith('Daily') ? 'log' : it.source.startsWith('Client') ? 'clients' : it.source.startsWith('Selection') ? 'select' : 'task']} size={15} style={{ color: 'var(--bq-faint)', flex: 'none', marginTop: 1 }}></BqIcon>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--bq-faint)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Evidence · {it.source}</div>
                      <div style={{ fontSize: 13, color: 'var(--bq-ink)', lineHeight: 1.45, fontStyle: 'italic' }}>"{it.evidence}"</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: 10 }}>
                    <div><div style={{ fontSize: 11, color: 'var(--bq-faint)', fontWeight: 600 }}>Suggested scope</div><div style={{ fontSize: 12.5, color: 'var(--bq-ink)', lineHeight: 1.4 }}>{it.scope}</div></div>
                    <div style={{ flex: 'none', minWidth: 120 }}>
                      <div style={{ fontSize: 11, color: 'var(--bq-faint)', fontWeight: 600 }}>Est. cost</div><div className="bq-num" style={{ fontSize: 14 }}>{it.cost}</div>
                      <div style={{ fontSize: 11, color: 'var(--bq-faint)', fontWeight: 600, marginTop: 6 }}>Schedule impact</div><div style={{ fontSize: 12.5 }}>{it.sched}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', paddingTop: 6, borderTop: '1px solid var(--bq-border)' }}>
                    <span style={{ fontSize: 12, color: 'var(--bq-ai-strong)', fontWeight: 600 }}>Recommended: {it.rec}</span>
                    <span style={{ flex: 1 }}></span>
                    <button className="bq-btn primary sm" onClick={() => { setHandled((h) => ({ ...h, [it.id]: 'co' })); window.__bqNav && window.__bqNav('Change Orders'); }}>Create change order</button>
                    <button className="bq-btn sm" onClick={() => setHandled((h) => ({ ...h, [it.id]: 'task' }))}>Create task</button>
                    <button className="bq-btn ghost sm" onClick={() => setHandled((h) => ({ ...h, [it.id]: 'covered' }))}>Already covered</button>
                    <button className="bq-btn ghost sm" onClick={() => setHandled((h) => ({ ...h, [it.id]: 'dismiss' }))}>Dismiss</button>
                  </div>
                </div>
              );
            })}
            {!live.length ? <div className="bq-card-s" style={{ padding: 26, textAlign: 'center', fontSize: 13.5, color: 'var(--bq-muted)' }}>All detected changes have been reviewed. BuilderIQ keeps scanning as new logs and messages come in.</div> : null}
          </div>
        </main>
      </div>
    </div>
  );
}
window.HifiLeakage = HifiLeakage;
