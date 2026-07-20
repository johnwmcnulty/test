// Hi-fi Expenses - list + AI receipt parser, billable, feeds budget actuals
const EXP_LIST = [
  { vendor: 'Ferguson', date: 'Jun 11', amt: 690, code: '15 · Plumbing', line: 'Faucet', proj: 'Henderson', billable: true, status: 'Coded' },
  { vendor: 'ABC Supply', date: 'Jun 10', amt: 1284, code: '06 · Cabinetry', line: 'Hardware', proj: 'Henderson', billable: true, status: 'Coded' },
  { vendor: 'Home Depot', date: 'Jun 10', amt: 218, code: '01 · General', line: 'Fasteners, blades', proj: 'Henderson', billable: false, status: 'Coded' },
  { vendor: 'Vargas Framing', date: 'Jun 9', amt: 3600, code: '05 · Structural', line: 'Beam labor', proj: 'Henderson', billable: true, status: 'Coded' },
  { vendor: 'Sunbelt Rentals', date: 'Jun 9', amt: 412, code: '05 · Structural', line: 'Shoring rental', proj: 'Henderson', billable: true, status: 'Coded' },
  { vendor: 'The Tile Shop', date: 'Jun 12', amt: 4480, code: '09 · Tile', line: 'Hall-bath tile', proj: 'Henderson', billable: true, status: 'Coded' },
  { vendor: 'StoneWorks', date: 'Jun 11', amt: 5200, code: '12 · Countertops', line: 'Quartz deposit', proj: 'Henderson', billable: true, status: 'Coded' },
  { vendor: 'Bright Electric', date: 'Jun 8', amt: 2680, code: '16 · Electrical', line: 'Service upgrade', proj: 'Henderson', billable: true, status: 'Coded' },
  { vendor: 'Reliant Plumbing', date: 'Jun 7', amt: 1850, code: '15 · Plumbing', line: 'Rough-in labor', proj: 'Henderson', billable: true, status: 'Coded' },
  { vendor: 'Austin Tile Co.', date: 'Jun 7', amt: 2100, code: '09 · Tile', line: 'Tile setting labor', proj: 'Henderson', billable: true, status: 'Coded' },
  { vendor: 'Waste Mgmt', date: 'Jun 5', amt: 525, code: '01 · General', line: 'Dumpster haul', proj: 'Henderson', billable: true, status: 'Coded' },
  { vendor: 'Sherwin-Williams', date: 'Jun 5', amt: 386, code: '22 · Paint', line: 'Primer + trim paint', proj: 'Henderson', billable: false, status: 'Coded' },
  { vendor: "Lowe's", date: 'Jun 3', amt: 268, code: '01 · General', line: 'Misc hardware', proj: 'Henderson', billable: false, status: 'Coded' },
  { vendor: 'Shell (fuel)', date: 'Jun 3', amt: 142, code: '- · Uncoded', line: 'Crew fuel', proj: 'Henderson', billable: false, status: 'Uncoded' },
];

function HifiExpenses() {
  const fmt = (n) => '$' + n.toLocaleString('en-US');
  const [parse, setParse] = React.useState('idle'); // idle | parsing | parsed
  const total = EXP_LIST.reduce((a, e) => a + e.amt, 0);
  const runParse = () => { setParse('parsing'); setTimeout(() => setParse('parsed'), 1100); };

  return (
    <div className="bq-screen">
      <BqTop crumb="Expenses"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Expenses"></BqSide>
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div className="bq-display" style={{ fontSize: 22 }}>Expenses</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Henderson - Kitchen + Hall Bath · feeds budget vs actuals</div>
            </div>
            <button className="bq-btn primary sm" onClick={() => setParse(parse === 'idle' ? 'ready' : 'idle')}><BqIcon d={BQ_GLYPH.camera} size={14}></BqIcon>Snap receipt</button>
          </div>

          <div style={{ display: 'flex', gap: 'calc(12px * var(--bq-sp))', flexWrap: 'wrap' }}>
            <BqKPI label="Actual costs to date" value={fmt(total)} sub="15 expenses"></BqKPI>
            <BqKPI label="Billable" value={fmt(EXP_LIST.filter((e) => e.billable).reduce((a, e) => a + e.amt, 0))} sub="11 of 15"></BqKPI>
            <BqKPI label="Uncoded" value="1" sub="needs review" tone="warn"></BqKPI>
          </div>

          {parse !== 'idle' ? (
            <div className="bq-ai-card" style={{ padding: 'calc(16px * var(--bq-sp)) 18px' }}>
              <div style={{ display: 'flex', gap: 'calc(16px * var(--bq-sp))', flexWrap: 'wrap', alignItems: 'center' }}>
                <BqPh h={130} label="Receipt" style={{ width: 110, flex: 'none' }}></BqPh>
                <div style={{ flex: '1 1 320px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <BqSpark size={14}></BqSpark>
                    <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--bq-ai-strong)' }}>
                      {parse === 'ready' ? 'Drop a receipt to auto-fill' : parse === 'parsing' ? 'Reading receipt…' : 'AI parsed this receipt'}
                    </span>
                    {parse === 'parsed' ? <span className="bq-chip ai" style={{ marginLeft: 'auto' }}>Review &amp; save</span> : null}
                  </div>
                  {parse === 'ready' ? (
                    <button className="bq-btn ai sm" onClick={runParse}><BqSpark size={12}></BqSpark>Parse sample receipt</button>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                      {[['Vendor', 'The Tile Shop'], ['Date', 'Jun 12, 2026'], ['Amount', '$4,480.00'], ['Likely cost code', '09 · Tile'], ['Suggested project', 'Henderson'], ['Budget line', 'Hall-bath tile']].map(([k, v]) => (
                        <div key={k} style={{ background: 'var(--bq-raise)', borderRadius: 10, boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)', padding: '8px 11px', opacity: parse === 'parsing' ? 0.4 : 1, transition: 'opacity .2s' }}>
                          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--bq-faint)' }}>{k}</div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--bq-ink)', marginTop: 1 }}>{parse === 'parsing' ? '-' : v}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {parse === 'parsed' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 12 }}>
                      <button className="bq-btn ai sm" onClick={() => setParse('idle')}>Save expense</button>
                      <span className="bq-chip">Billable to client</span>
                      <span style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>Over the tile allowance - links to CO-002</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          <div className="bq-card-s" style={{ overflow: 'hidden' }}>
            <div className="bq-trow head" style={{ gridTemplateColumns: '1.3fr 1.4fr 0.8fr auto auto' }}>
              <span>Vendor</span><span>Cost code / line</span><span>Amount</span><span>Billable</span><span>Status</span>
            </div>
            {EXP_LIST.map((e, i) => (
              <div key={i} className="bq-trow" style={{ gridTemplateColumns: '1.3fr 1.4fr 0.8fr auto auto' }}>
                <span>
                  <span style={{ display: 'block', fontWeight: 600 }}>{e.vendor}</span>
                  <span style={{ display: 'block', fontSize: 11.5, color: 'var(--bq-faint)' }}>{e.date}</span>
                </span>
                <span style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{e.code} · {e.line}</span>
                <span className="cell-num" style={{ fontWeight: 600 }}>{fmt(e.amt)}</span>
                <span>{e.billable ? <span className="bq-chip good">Billable</span> : <span className="bq-chip">Internal</span>}</span>
                <span>{e.status === 'Uncoded' ? <span className="bq-chip brand">Uncoded</span> : <span className="bq-chip"><BqIcon d={BQ_GLYPH.check} size={11} sw={2.2}></BqIcon>{e.status}</span>}</span>
              </div>
            ))}
            <div className="bq-trow" style={{ gridTemplateColumns: '1.3fr 1.4fr 0.8fr auto auto', background: 'var(--bq-subtle)' }}>
              <span style={{ fontWeight: 700 }}>Total actuals</span><span></span>
              <span className="cell-num" style={{ fontWeight: 700 }}>{fmt(total)}</span><span></span>
              <span style={{ fontSize: 11.5, color: 'var(--bq-ai-strong)', fontWeight: 600, cursor: 'pointer' }} onClick={() => window.__bqNav && window.__bqNav('Projects')}>View in budget →</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
window.HifiExpenses = HifiExpenses;
