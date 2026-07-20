// Hi-fi AI Profit Watchdog - profit health, labeled projections, insights w/ actions
const WD_PROJECTS = [
  { name: 'Henderson - Kitchen + Hall Bath', contract: 186400, finalRev: 195760, finalCost: 158200, margin: 19.2, target: 22, health: 'watch', insights: 3 },
  { name: 'Osorio - Whole-home remodel', contract: 410500, finalRev: 438900, finalCost: 322000, margin: 26.6, target: 24, health: 'healthy', insights: 1 },
  { name: 'Tanaka - Primary suite addition', contract: 242000, finalRev: 242000, finalCost: 201500, margin: 16.7, target: 22, health: 'at risk', insights: 4 },
  { name: 'Bryn - Deck + outdoor kitchen', contract: 78900, finalRev: 78900, finalCost: 71800, margin: 9.0, target: 20, health: 'critical', insights: 2 },
];
const WD_HEALTH = { healthy: ['good', 'Healthy'], watch: ['ai', 'Watch'], 'at risk': ['warn', 'At risk'], critical: ['warn', 'Critical'] };

function HifiWatchdog() {
  const fmt = (n) => '$' + n.toLocaleString('en-US');
  const [sel, setSel] = React.useState(0);
  const [dismissed, setDismissed] = React.useState({});
  const p = WD_PROJECTS[sel];
  const gp = p.finalRev - p.finalCost;

  const INSIGHTS = [
    { id: 'e1', tone: 'warn', code: 'Electrical', title: 'Electrical trending 18% over budget', body: 'Electrical is trending 18% over budget due to two recent expenses (panel upgrade, cloth-wiring remediation) and one pending selection overage. $2,680 is already an approved CO; the remediation looks unbilled.', action: 'Draft change order', go: 'Change Orders' },
    { id: 'e2', tone: 'ai', code: 'Billing', title: '$24,000 of completed work is underbilled', body: 'Rough-in is complete but Draw 3 hasn\'t been sent. Sending it now improves cash position and protects margin.', action: 'Open invoice', go: 'Invoices' },
    { id: 'e3', tone: 'warn', code: 'Selections', title: 'Tile selection $1,380 over allowance', body: 'The hall-bath tile the client chose exceeds its allowance and has no change order yet. This is margin leakage if not captured.', action: 'Create change order', go: 'Change Orders' },
  ];
  const live = INSIGHTS.filter((i) => !dismissed[i.id]);

  return (
    <div className="bq-screen">
      <BqTop crumb="Profit Watchdog"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Watchdog" alerts={{ Watchdog: 2 }}></BqSide>
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="bq-logomark" style={{ background: 'var(--bq-ai)' }}><BqIcon d={BQ_GLYPH.watchdog} size={16} sw={1.6} style={{ color: '#fff' }}></BqIcon></span>
            <div style={{ flex: 1 }}>
              <div className="bq-display" style={{ fontSize: 22 }}>Profit Watchdog</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>AI watches margin across 4 active projects · 2 need attention</div>
            </div>
            <span className="bq-chip ai"><BqSpark size={11}></BqSpark>Updated 8 min ago</span>
            <button className="bq-btn soft-ai sm" onClick={() => window.__bqNav && window.__bqNav('Change Order Leakage')}><BqSpark size={12}></BqSpark>Scan for CO leakage</button>
          </div>

          {/* portfolio row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'calc(12px * var(--bq-sp))' }}>
            {WD_PROJECTS.map((pr, i) => {
              const [tone, label] = WD_HEALTH[pr.health];
              return (
                <div key={i} onClick={() => setSel(i)} className="bq-card-s" style={{ padding: '14px 16px', cursor: 'pointer', boxShadow: i === sel ? '0 0 0 2px var(--bq-ai)' : 'var(--bq-shadow)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span className={'bq-chip ' + tone}>{label}</span>
                    {pr.insights ? <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--bq-faint)' }}>{pr.insights} insights</span> : null}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, minHeight: 34 }}>{pr.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
                    <span className="bq-num" style={{ fontSize: 24, color: pr.margin >= pr.target ? 'var(--bq-good)' : 'var(--bq-brand-strong)' }}>{pr.margin}%</span>
                    <span style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>vs {pr.target}% target</span>
                  </div>
                  <BqMeter pct={(pr.margin / pr.target) * 100} tone={pr.margin >= pr.target ? '' : 'warn'} style={{ marginTop: 8 }}></BqMeter>
                </div>
              );
            })}
          </div>

          {/* selected project detail */}
          <div style={{ display: 'flex', gap: 'calc(16px * var(--bq-sp))', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 'calc(12px * var(--bq-sp))' }}>
              <div className="bq-card-s" style={{ padding: 'calc(16px * var(--bq-sp)) 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{p.name.split(' - ')[0]} forecast</span>
                  <span className="bq-chip ai" style={{ marginLeft: 'auto' }}>Projection</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'calc(12px * var(--bq-sp))' }}>
                  {[['Projected revenue', fmt(p.finalRev), 'var(--bq-ink)'], ['Projected cost', fmt(p.finalCost), 'var(--bq-ink)'], ['Projected gross profit', fmt(gp), 'var(--bq-good)'], ['Projected margin', p.margin + '%', p.margin >= p.target ? 'var(--bq-good)' : 'var(--bq-brand-strong)']].map(([k, v, c]) => (
                    <div key={k}>
                      <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', fontWeight: 600 }}>{k}</div>
                      <div className="bq-num" style={{ fontSize: 20, color: c }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--bq-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>Variance from {p.target}% target</span>
                  <span className="bq-num" style={{ marginLeft: 'auto', fontSize: 16, color: p.margin >= p.target ? 'var(--bq-good)' : 'var(--bq-brand-strong)' }}>{p.margin >= p.target ? '+' : ''}{(p.margin - p.target).toFixed(1)} pts</span>
                </div>
              </div>

              <div className="bq-card-s" style={{ padding: 'calc(16px * var(--bq-sp)) 18px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 10 }}>Cost codes at risk</div>
                {[['Electrical', 18, 'over'], ['Structural', 8, 'over'], ['Cabinetry', -2, 'under']].map(([code, v]) => (
                  <div key={code} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0' }}>
                    <span style={{ fontSize: 13, flex: 1 }}>{code}</span>
                    <BqMeter pct={Math.min(100, 50 + v * 2.5)} tone={v > 0 ? 'warn' : ''} style={{ width: 90 }}></BqMeter>
                    <span className="bq-num" style={{ fontSize: 13, width: 48, textAlign: 'right', color: v > 0 ? 'var(--bq-brand-strong)' : 'var(--bq-good)' }}>{v > 0 ? '+' : ''}{v}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI insights */}
            <div style={{ flex: '1 1 360px', display: 'flex', flexDirection: 'column', gap: 'calc(10px * var(--bq-sp))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BqSpark size={14}></BqSpark><span style={{ fontWeight: 700, fontSize: 15, color: 'var(--bq-ai-strong)' }}>What's affecting margin</span>
                <span className="bq-chip ai" style={{ marginLeft: 'auto' }}>{live.length} insights</span>
              </div>
              {live.map((ins) => (
                <div key={ins.id} className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 16px', boxShadow: 'inset 0 0 0 1px ' + (ins.tone === 'warn' ? 'var(--bq-brand-border)' : 'var(--bq-ai-border)') }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span className={'bq-chip ' + (ins.tone === 'warn' ? 'brand' : 'ai')}>{ins.code}</span>
                    <span style={{ fontWeight: 700, fontSize: 13.5 }}>{ins.title}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5 }}>{ins.body}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 11 }}>
                    <button className="bq-btn primary sm" onClick={() => window.__bqNav && window.__bqNav(ins.go)}>{ins.action}</button>
                    <button className="bq-btn ghost sm" onClick={() => setDismissed((d) => ({ ...d, [ins.id]: true }))}>Dismiss</button>
                    <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--bq-faint)' }}>Logged to audit trail</span>
                  </div>
                </div>
              ))}
              {!live.length ? <div className="bq-card-s" style={{ padding: 20, textAlign: 'center', fontSize: 13, color: 'var(--bq-faint)' }}>All insights handled for this project.</div> : null}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
window.HifiWatchdog = HifiWatchdog;
