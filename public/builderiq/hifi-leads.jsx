// Hi-fi Leads - pipeline list + AI intake
function LeadRow({ name, source, scope, budget, fit, age, nav }) {
  return (
    <div className="bq-trow" style={{ gridTemplateColumns: '1.8fr 1fr 1.6fr 0.9fr 0.9fr 0.7fr' }}>
      <div>
        <div style={{ fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{source}</div>
      </div>
      <span className="bq-chip" style={{ justifySelf: 'start' }}>{age}</span>
      <span style={{ fontSize: 13, color: 'var(--bq-muted)' }}>{scope}</span>
      <span className="cell-num" style={{ fontWeight: 600 }}>{budget}</span>
      <span className="bq-chip ai" style={{ justifySelf: 'start' }}><BqSpark size={10}></BqSpark>fit {fit}</span>
      <button className="bq-btn sm" onClick={() => window.__bqNav && window.__bqNav('AI Estimate')}><BqSpark size={12}></BqSpark>Estimate</button>
    </div>
  );
}

function HifiLeads() {
  const [drafted, setDrafted] = React.useState(false);
  return (
    <div className="bq-screen">
      <BqTop crumb="Leads" right={<React.Fragment><button className="bq-btn sm" onClick={() => window.__bqNav && window.__bqNav('Lead Capture')}><BqIcon d={BQ_GLYPH.code} size={13}></BqIcon>Capture widget</button><button className="bq-btn primary sm">+ New lead</button></React.Fragment>}></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Leads"></BqSide>
        <main style={{ flex: 1, padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))', overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span className="bq-display" style={{ fontSize: 20 }}>Leads</span>
            <span style={{ fontSize: 13, color: 'var(--bq-muted)' }}>11 open · $1.24M potential</span>
          </div>

          <section className="bq-ai-card ai-expanded" style={{ padding: 'calc(14px * var(--bq-sp)) 18px', display: 'flex', gap: 18 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <BqSpark></BqSpark>
                <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--bq-ai-strong)' }}>New lead - AI intake</span>
                <span className="bq-chip">forwarded email · 8 min ago</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--bq-muted)', fontStyle: 'italic' }}>
                "Hi - we got your name from the Hendersons. Looking to redo our attic into a guest suite w/ small bath, maybe a dormer? Hoping to start fall. Realistic budget?? - Sam Tran"
              </p>
            </div>
            <div style={{ width: 300, flex: 'none', background: 'var(--bq-raise)', borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-faint)' }}>Structured by AI - verify</div>
              <div style={{ fontSize: 12.5, display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span><b>Scope:</b> attic conversion, guest suite + ¾ bath, possible dormer</span>
                <span><b>Budget hint:</b> none given - similar jobs ran $88–110k</span>
                <span><b>Referral:</b> Henderson (active client) · <b>fit 8/10</b></span>
              </div>
              {drafted
                ? <span className="bq-chip good" style={{ alignSelf: 'flex-start' }}>Added to pipeline ✓</span>
                : <div style={{ display: 'flex', gap: 6 }}>
                    <button className="bq-btn ai sm" onClick={() => setDrafted(true)}>Accept intake</button>
                    <button className="bq-btn ghost sm">Edit</button>
                  </div>}
            </div>
          </section>

          <section className="bq-card-s" style={{ flex: '1 0 auto', paddingTop: 6, overflow: 'visible', display: 'flex', flexDirection: 'column' }}>
            <div className="bq-trow head" style={{ gridTemplateColumns: '1.8fr 1fr 1.6fr 0.9fr 0.9fr 0.7fr' }}>
              <span>Lead</span><span>Age</span><span>Scope</span><span>Est. value</span><span>Fit</span><span></span>
            </div>
            <div>
              {drafted ? <LeadRow name="Tran - attic conversion" source="email · referral: Henderson" scope="Guest suite + ¾ bath, dormer TBD" budget="$88–110k" fit="8/10" age="new"></LeadRow> : null}
              <LeadRow name="Webb - kitchen reface" source="web form" scope="Cabinet reface, counters, backsplash" budget="$38–46k" fit="7/10" age="2 days"></LeadRow>
              <LeadRow name="Hartley - whole-home reno" source="phone · note by Mike" scope="Full gut, 3,400 sf, 2-story" budget="$280–340k" fit="9/10" age="3 days"></LeadRow>
              <LeadRow name="Ross - garage ADU" source="phone · note by Mike" scope="Detached ADU over garage, 540 sf" budget="$140–165k" fit="9/10" age="4 days"></LeadRow>
              <LeadRow name="Okonkwo - primary bath gut" source="web form" scope="Full primary bath, freestanding tub, curbless shower" budget="$46–58k" fit="8/10" age="5 days"></LeadRow>
              <LeadRow name="Vance - basement ADU" source="referral: Osorio" scope="Basement conversion to rental suite" budget="$120–150k" fit="8/10" age="6 days"></LeadRow>
              <LeadRow name="Kim - mudroom + laundry" source="referral: O'Brien" scope="Mudroom build-out, relocate laundry" budget="$32–40k" fit="8/10" age="1 week"></LeadRow>
              <LeadRow name="Brennan - kitchen + flooring" source="web form" scope="Kitchen remodel + LVP through main floor" budget="$58–72k" fit="6/10" age="1 week"></LeadRow>
              <LeadRow name="Delacroix - screened porch" source="referral: Chen" scope="Sunroom + screened porch, 320 sf" budget="$52–64k" fit="7/10" age="1 week"></LeadRow>
              <LeadRow name="Faulkner - whole-home repaint" source="web form" scope="Interior repaint, 2,800 sf" budget="$14–18k" fit="4/10" age="10 days"></LeadRow>
              <LeadRow name="Sayed - garage + workshop" source="web form" scope="Detached garage with finished workshop" budget="$40–52k" fit="5/10" age="2 weeks"></LeadRow>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
window.HifiLeads = HifiLeads;
