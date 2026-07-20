// Hi-fi Plan / takeoff assist - upload plan → Plan Review Summary + manual measurements
function HifiPlan() {
  const [phase, setPhase] = React.useState('upload'); // upload | reviewing | review
  const analyze = () => { setPhase('reviewing'); setTimeout(() => setPhase('review'), 1200); };

  const SHEETS = ['A-001 Cover', 'A-101 Floor plan', 'A-201 Elevations', 'A-301 Kitchen details', 'E-101 Electrical'];
  const ROOMS = [['Kitchen', '~310 sf'], ['Dining', '~180 sf'], ['Hall bath', '~46 sf'], ['Hallway', '~85 sf']];
  const TRADES = ['Demo', 'Framing / structural', 'Electrical', 'Plumbing', 'Cabinetry', 'Countertops', 'Flooring', 'Paint'];
  const SECTIONS = ['01 Demo & disposal', '05 Structural (beam at opening)', '06 Cabinetry', '07 Countertops', '09 Flooring', '15 Plumbing', '16 Electrical'];
  const MISSING = ['No electrical panel location/size noted', 'Window schedule not included', 'Finish schedule missing for hall bath'];
  const RISKS = ['Wall between kitchen/dining appears load-bearing - beam required', 'No ceiling height noted; affects cabinet + lighting layout'];
  const QUESTIONS = ['Confirm whether the dining-side wall is structural.', 'Is the existing electrical panel being upgraded?', 'Tile vs. LVP for the hall-bath floor?'];

  return (
    <div className="bq-screen">
      <BqTop crumb="Estimates / Plan review"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Estimates"></BqSide>
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px' }}>
          {phase !== 'review' ? (
            <div style={{ maxWidth: 620, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="bq-logomark" style={{ background: 'var(--bq-ai)' }}><BqIcon d={BQ_GLYPH.plan} size={16} sw={1.5} style={{ color: '#fff' }}></BqIcon></span>
                <div>
                  <div className="bq-display" style={{ fontSize: 21 }}>Plan review assist</div>
                  <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Upload construction plans (PDF). AI summarizes scope to jump-start your estimate.</div>
                </div>
              </div>
              <div style={{ border: '2px dashed var(--bq-border-strong)', borderRadius: 18, padding: '40px 24px', textAlign: 'center', background: 'var(--bq-card)' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--bq-subtle)', color: 'var(--bq-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><BqIcon d={BQ_GLYPH.plan} size={26}></BqIcon></div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Henderson_Kitchen_Plans.pdf</div>
                <div style={{ fontSize: 12.5, color: 'var(--bq-faint)', marginBottom: 16 }}>5 sheets · 8.2 MB · ready to analyze</div>
                <button className="bq-btn ai" onClick={analyze} disabled={phase === 'reviewing'}>
                  {phase === 'reviewing' ? <React.Fragment><span className="bq-spark" style={{ animation: 'bqpulse 1s ease-in-out infinite', display: 'inline-flex' }}><BqIcon d={BQ_GLYPH.spark} size={15}></BqIcon></span>Reading sheets…</React.Fragment> : <React.Fragment><BqSpark size={15}></BqSpark>Analyze plans</React.Fragment>}
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 12, color: 'var(--bq-faint)', lineHeight: 1.45 }}>
                <BqIcon d="M12 9 V13 M12 16.5 V16.6 M12 4 L21 19 H3 Z" size={15} style={{ flex: 'none', marginTop: 1 }}></BqIcon>
                BuilderIQ reads sheets and notes to suggest scope - it does <b>not</b> produce exact measurements. Confirm dimensions on site; enter measured quantities below.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 'calc(16px * var(--bq-sp))', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              {/* plan preview + sheets + manual measures */}
              <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 'calc(12px * var(--bq-sp))' }}>
                <BqPh h={240} label="A-101 Floor plan"></BqPh>
                <div className="bq-card-s" style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 8 }}>Detected sheets</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{SHEETS.map((s) => <span key={s} className="bq-chip">{s}</span>)}</div>
                </div>
                <div className="bq-card-s" style={{ padding: '12px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)' }}>Manual measurements</span>
                    <span className="bq-chip" style={{ marginLeft: 'auto' }}>You enter</span>
                  </div>
                  {[['Kitchen floor (sf)', '310'], ['Countertop (lf)', '24'], ['Cabinet run (lf)', '22'], ['Wall to remove (lf)', '16']].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0' }}>
                      <span style={{ fontSize: 13, color: 'var(--bq-muted)', flex: 1 }}>{k}</span>
                      <input defaultValue={v} style={{ width: 70, font: 'inherit', fontSize: 13, padding: '5px 9px', borderRadius: 8, border: '1px solid var(--bq-border)', background: 'var(--bq-subtle)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}></input>
                    </div>
                  ))}
                </div>
              </div>

              {/* plan review summary */}
              <div style={{ flex: '1 1 380px', display: 'flex', flexDirection: 'column', gap: 'calc(12px * var(--bq-sp))' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BqSpark size={14}></BqSpark><span style={{ fontWeight: 700, fontSize: 16, color: 'var(--bq-ai-strong)' }}>Plan review summary</span>
                </div>
                <div className="bq-card-s" style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 12.5, color: 'var(--bq-muted)', marginBottom: 6 }}><b style={{ color: 'var(--bq-ink)' }}>Project:</b> Henderson Kitchen Remodel · 4418 Bridle Path, Austin TX <span className="bq-chip ai" style={{ marginLeft: 6 }}>from cover sheet</span></div>
                </div>

                {[['Rooms / spaces detected', ROOMS.map((r) => r[0] + ' (' + r[1] + ')')], ['Likely trades', TRADES], ['Suggested estimate sections', SECTIONS]].map(([title, list]) => (
                  <div key={title} className="bq-card-s" style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 8 }}>{title}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{list.map((x) => <span key={x} className="bq-chip">{x}</span>)}</div>
                  </div>
                ))}

                <div className="bq-card-s" style={{ padding: '14px 16px', boxShadow: 'inset 0 0 0 1px var(--bq-brand-border)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-brand-strong)', marginBottom: 8 }}>Risk flags &amp; missing info</div>
                  <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13, color: 'var(--bq-ink)', lineHeight: 1.45 }}>
                    {[...RISKS, ...MISSING].map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </div>

                <div className="bq-ai-card" style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-ai-strong)', marginBottom: 8 }}>Questions for client / architect</div>
                  <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13, color: 'var(--bq-ink)', lineHeight: 1.45 }}>
                    {QUESTIONS.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="bq-btn primary" onClick={() => window.__bqNav && window.__bqNav('AI Estimate')}>Start estimate from this</button>
                  <button className="bq-btn ghost" onClick={() => setPhase('upload')}>Re-analyze</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
window.HifiPlan = HifiPlan;
