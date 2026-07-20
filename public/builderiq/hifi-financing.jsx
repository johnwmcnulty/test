// Hi-fi Financing - homeowner monthly-payment offers presented at proposal time
const FIN_PLANS = [
  { lender: 'Sunlight Financial', term: 60, apr: 6.99, fee: 4.9, badge: 'Lowest monthly' },
  { lender: 'Hearth', term: 120, apr: 9.49, fee: 0, badge: 'No dealer fee' },
  { lender: 'Acorn Lending', term: 84, apr: 7.99, fee: 3.5, badge: null },
  { lender: 'Greenline HELOC', term: 180, apr: 8.25, fee: 1.5, badge: 'Largest jobs' },
];
const FIN_OFFERS = [
  { client: 'Dan & Priya Henderson', project: 'Kitchen + Hall Bath', amount: 186400, plan: 'Sunlight · 60mo', status: 'Pre-qualified', tone: 'ai' },
  { client: 'The Okafors', project: 'Primary Suite Addition', amount: 142000, plan: 'Hearth · 120mo', status: 'Offer sent', tone: 'brand' },
  { client: 'Marcus Lee', project: 'Basement Finish', amount: 68500, plan: 'Acorn · 84mo', status: 'Approved', tone: 'good' },
  { client: 'The Alvarados', project: 'Whole-home Reno', amount: 312000, plan: 'HELOC · 180mo', status: 'Declined', tone: 'muted' },
];

function finMonthly(P, apr, n) {
  const r = apr / 100 / 12;
  if (r === 0) return P / n;
  return P * r / (1 - Math.pow(1 + r, -n));
}

function HifiFinancing() {
  const fmt = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const [amt, setAmt] = React.useState(186400);
  const [planIdx, setPlanIdx] = React.useState(0);
  const plan = FIN_PLANS[planIdx];
  const mo = finMonthly(amt, plan.apr, plan.term);

  return (
    <div className="bq-screen">
      <BqTop crumb="Financing"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Financing"></BqSide>
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div className="bq-display" style={{ fontSize: 22 }}>Financing</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Offer homeowners monthly-payment options right inside the proposal</div>
            </div>
            <button className="bq-btn sm">Lender settings</button>
            <button className="bq-btn primary sm"><BqIcon d="M12 5 V19 M5 12 H19" size={14}></BqIcon>New offer</button>
          </div>

          <div style={{ display: 'flex', gap: 'calc(12px * var(--bq-sp))', flexWrap: 'wrap' }}>
            <BqKPI label="Approved this year" value="$418K" sub="9 jobs financed"></BqKPI>
            <BqKPI label="Avg ticket lift" value="+22%" sub="financed vs. cash bids" tone="ai"></BqKPI>
            <BqKPI label="Offers outstanding" value="2" sub="awaiting client" tone="warn"></BqKPI>
            <BqKPI label="Approval rate" value="74%" sub="pre-qual → approved"></BqKPI>
          </div>

          <div className="bq-ai-card ai-expanded" style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: '13px 16px' }}>
            <BqSpark size={17}></BqSpark>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--bq-ai-strong)', marginBottom: 2 }}>Present financing on the Henderson proposal</div>
              <div style={{ fontSize: 12.5, color: 'var(--bq-ink)' }}>At {fmt(186400)} this job is a strong fit. A <b>Sunlight 60-month</b> plan shows the homeowners about <b>{fmt(finMonthly(186400, 6.99, 60))}/mo</b> - jobs presented with a monthly payment close <b>22% higher</b>. BuilderIQ can add a “Payment options” block to the proposal.</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button className="bq-btn ai sm">Add to proposal</button>
              <button className="bq-btn ghost sm">Dismiss</button>
            </div>
          </div>
          <div className="bq-ai-card ai-collapsed" style={{ alignItems: 'center', gap: 8, padding: '8px 14px' }}>
            <BqSpark size={14}></BqSpark><span style={{ fontSize: 12.5, color: 'var(--bq-ai-strong)', fontWeight: 600 }}>1 financing suggestion</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 'calc(14px * var(--bq-sp))', alignItems: 'start' }}>
            {/* plans */}
            <div className="bq-card-s" style={{ padding: '16px 18px' }}>
              <div className="bq-sechead" style={{ marginBottom: 12 }}><span className="t">Lender plans</span><span className="bq-chip">4 active</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {FIN_PLANS.map((p, i) => {
                  const m = finMonthly(amt, p.apr, p.term);
                  const on = i === planIdx;
                  return (
                    <button key={i} onClick={() => setPlanIdx(i)} style={{ textAlign: 'left', font: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, background: on ? 'var(--bq-brand-soft)' : 'var(--bq-card)', border: 'none', boxShadow: on ? 'inset 0 0 0 1.5px var(--bq-brand-border)' : 'inset 0 0 0 1px var(--bq-border)' }}>
                      <span style={{ width: 38, height: 38, borderRadius: 11, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'var(--bq-brand)' : 'var(--bq-subtle)', color: on ? '#fff' : 'var(--bq-muted)' }}><BqIcon d={BQ_GLYPH.bank} size={18}></BqIcon></span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}><span style={{ fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap' }}>{p.lender}</span>{p.badge ? <span className={'bq-chip ' + (on ? 'brand' : '')}>{p.badge}</span> : null}</div>
                        <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{p.term} months · {p.apr}% APR · {p.fee ? p.fee + '% dealer fee' : 'no dealer fee'}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="bq-num" style={{ fontSize: 18, color: on ? 'var(--bq-brand-strong)' : 'var(--bq-ink)' }}>{fmt(m)}</div>
                        <div style={{ fontSize: 10.5, color: 'var(--bq-faint)' }}>/mo est.</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* calculator */}
            <div className="bq-card-s" style={{ padding: '16px 18px' }}>
              <div className="bq-sechead" style={{ marginBottom: 12 }}><span className="t">Payment preview</span></div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-muted)' }}>Job amount</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '6px 0 14px' }}>
                <input type="range" min="20000" max="400000" step="2000" value={amt} onChange={(e) => setAmt(Number(e.target.value))} style={{ flex: 1, accentColor: 'var(--bq-brand)' }}></input>
                <span className="bq-num" style={{ fontSize: 16, minWidth: 92, textAlign: 'right' }}>{fmt(amt)}</span>
              </div>
              <div style={{ background: 'var(--bq-ai-soft)', borderRadius: 14, padding: '16px 18px', textAlign: 'center', boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)' }}>
                <div style={{ fontSize: 12, color: 'var(--bq-ai-strong)', fontWeight: 600 }}>{plan.lender} · {plan.term} mo</div>
                <div className="bq-num" style={{ fontSize: 40, color: 'var(--bq-ai-strong)', margin: '4px 0', letterSpacing: '-1.5px' }}>{fmt(mo)}<span style={{ fontSize: 15, fontWeight: 600 }}>/mo</span></div>
                <div style={{ fontSize: 12, color: 'var(--bq-muted)' }}>{plan.apr}% APR · est. before taxes &amp; title</div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <button className="bq-btn primary sm" style={{ flex: 1 }}>Send pre-qual link</button>
                <button className="bq-btn sm">Copy</button>
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--bq-faint)', marginTop: 10, lineHeight: 1.5 }}>Estimates only. Soft pull for pre-qualification does not affect credit score. Final terms set by lender.</div>
            </div>
          </div>

          {/* offers table */}
          <div className="bq-card-s" style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px 4px' }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Active offers</span>
              <span style={{ marginLeft: 'auto', fontSize: 12.5, fontWeight: 600, color: 'var(--bq-brand-strong)', cursor: 'pointer' }}>See all</span>
            </div>
            <div className="bq-trow head" style={{ gridTemplateColumns: '1.4fr 1.3fr auto 1fr auto' }}>
              <span>Client</span><span>Project</span><span>Amount</span><span>Plan</span><span>Status</span>
            </div>
            {FIN_OFFERS.map((o, i) => (
              <div key={i} className="bq-trow" style={{ gridTemplateColumns: '1.4fr 1.3fr auto 1fr auto', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>{o.client}</span>
                <span style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{o.project}</span>
                <span className="cell-num" style={{ fontWeight: 600 }}>{fmt(o.amount)}</span>
                <span style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{o.plan}</span>
                <span><span className={'bq-chip ' + (o.tone === 'muted' ? '' : o.tone)}>{o.status}</span></span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
window.HifiFinancing = HifiFinancing;
