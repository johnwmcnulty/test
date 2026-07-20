// Hi-fi Subcontractor quote comparison - extract + side-by-side + highlights → line items
const QUOTE_COLS = [
  { sub: 'Bright Electric', price: 9700, lead: '2 wks', terms: 'Net 15, 50% deposit', warranty: '2 yr labor', complete: 0.95, cheapest: false, complete_flag: true },
  { sub: 'Volt Pro', price: 8450, lead: '4 wks', terms: 'Net 30', warranty: '1 yr', complete: 0.7, cheapest: true, complete_flag: false },
  { sub: 'Austin Sparky', price: 10250, lead: '1 wk', terms: '50% deposit, balance on done', warranty: '3 yr labor + parts', complete: 0.9, cheapest: false, complete_flag: false },
];
const QUOTE_ROWS = [
  { label: 'Service upgrade 100→200A', vals: [true, true, true] },
  { label: 'Island + undercab circuits', vals: [true, true, true] },
  { label: 'Recessed + fixtures', vals: [true, false, true] },
  { label: 'Permit + inspection', vals: [true, false, true] },
  { label: 'Cloth-wiring remediation', vals: [true, false, false] },
  { label: 'Temp power during reno', vals: [false, false, true] },
];

function HifiQuotes() {
  const fmt = (n) => '$' + n.toLocaleString('en-US');
  const [chosen, setChosen] = React.useState(0);

  return (
    <div className="bq-screen">
      <BqTop crumb="Estimates / Quote comparison"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Estimates"></BqSide>
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="bq-logomark" style={{ background: 'var(--bq-ai)' }}><BqIcon d={BQ_GLYPH.quotes} size={16} sw={1.5} style={{ color: '#fff' }}></BqIcon></span>
            <div style={{ flex: 1 }}>
              <div className="bq-display" style={{ fontSize: 22 }}>Electrical - quote comparison</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Henderson · 3 subcontractor quotes · AI-extracted scope &amp; terms</div>
            </div>
            <button className="bq-btn sm"><BqIcon d="M12 5 V19 M5 12 H19" size={14}></BqIcon>Add quote</button>
          </div>

          {/* AI highlights */}
          <div className="bq-ai-card" style={{ padding: 'calc(14px * var(--bq-sp)) 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><BqSpark size={14}></BqSpark><span style={{ fontWeight: 700, fontSize: 14, color: 'var(--bq-ai-strong)' }}>AI read of these quotes</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
              {[['Cheapest', 'Volt Pro at $8,450 - but excludes permit, remediation & fixtures.', 'brand'], ['Most complete', 'Bright Electric covers 95% of scope incl. the cloth-wiring remediation.', 'good'], ['Risky exclusion', 'Volt Pro omits permit/inspection - likely a costly add later.', 'brand'], ['Unclear term', 'Austin Sparky\u2019s "balance on done" payment needs a defined milestone.', 'ai']].map(([k, v, t]) => (
                <div key={k} style={{ background: 'var(--bq-raise)', borderRadius: 12, boxShadow: 'inset 0 0 0 1px ' + (t === 'brand' ? 'var(--bq-brand-border)' : t === 'good' ? '#DCEBC2' : 'var(--bq-ai-border)'), padding: '10px 12px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: t === 'brand' ? 'var(--bq-brand-strong)' : t === 'good' ? 'var(--bq-good)' : 'var(--bq-ai-strong)' }}>{k}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--bq-ink)', lineHeight: 1.4, marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* comparison table */}
          <div className="bq-card-s" style={{ overflow: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px repeat(3, 1fr)', minWidth: 640 }}>
              {/* header */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--bq-border)' }}></div>
              {QUOTE_COLS.map((c, i) => (
                <div key={i} style={{ padding: '14px 16px', borderBottom: '1px solid var(--bq-border)', borderLeft: '1px solid var(--bq-border)', background: i === chosen ? 'var(--bq-brand-soft)' : 'transparent' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 13.5 }}>{c.sub}</span>
                    {c.cheapest ? <span className="bq-chip brand" style={{ padding: '0 7px' }}>Cheapest</span> : null}
                    {c.complete_flag ? <span className="bq-chip good" style={{ padding: '0 7px' }}>Most complete</span> : null}
                  </div>
                  <div className="bq-num" style={{ fontSize: 22 }}>{fmt(c.price)}</div>
                </div>
              ))}

              {/* scope rows */}
              {QUOTE_ROWS.map((row, ri) => (
                <React.Fragment key={ri}>
                  <div style={{ padding: '10px 16px', fontSize: 13, color: 'var(--bq-ink)', borderBottom: '1px solid var(--bq-border)', display: 'flex', alignItems: 'center' }}>{row.label}</div>
                  {row.vals.map((v, ci) => (
                    <div key={ci} style={{ padding: '10px 16px', borderBottom: '1px solid var(--bq-border)', borderLeft: '1px solid var(--bq-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: ci === chosen ? 'var(--bq-brand-soft)' : 'transparent' }}>
                      {v ? <span style={{ color: 'var(--bq-good)' }}><BqIcon d={BQ_GLYPH.check} size={16} sw={2.4}></BqIcon></span> : <span style={{ color: 'var(--bq-faint)', fontSize: 13, fontWeight: 600 }}>-</span>}
                    </div>
                  ))}
                </React.Fragment>
              ))}

              {/* meta rows */}
              {[['Lead time', (c) => c.lead], ['Payment terms', (c) => c.terms], ['Warranty', (c) => c.warranty]].map(([label, get], ri) => (
                <React.Fragment key={'m' + ri}>
                  <div style={{ padding: '10px 16px', fontSize: 12, fontWeight: 600, color: 'var(--bq-faint)', textTransform: 'uppercase', letterSpacing: 0.4, borderBottom: '1px solid var(--bq-border)', display: 'flex', alignItems: 'center' }}>{label}</div>
                  {QUOTE_COLS.map((c, ci) => (
                    <div key={ci} style={{ padding: '10px 16px', fontSize: 12.5, color: 'var(--bq-muted)', borderBottom: '1px solid var(--bq-border)', borderLeft: '1px solid var(--bq-border)', background: ci === chosen ? 'var(--bq-brand-soft)' : 'transparent' }}>{get(c)}</div>
                  ))}
                </React.Fragment>
              ))}

              {/* choose row */}
              <div style={{ padding: '14px 16px' }}></div>
              {QUOTE_COLS.map((c, ci) => (
                <div key={ci} style={{ padding: '14px 16px', borderLeft: '1px solid var(--bq-border)', background: ci === chosen ? 'var(--bq-brand-soft)' : 'transparent' }}>
                  <button className={'bq-btn sm ' + (ci === chosen ? 'primary' : '')} style={{ width: '100%' }} onClick={() => setChosen(ci)}>{ci === chosen ? 'Selected' : 'Choose'}</button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Convert <b>{QUOTE_COLS[chosen].sub}</b> ({fmt(QUOTE_COLS[chosen].price)}) into budget line items under cost code <b>16 · Electrical</b>.</span>
            <button className="bq-btn primary sm" style={{ marginLeft: 'auto' }} onClick={() => window.__bqNav && window.__bqNav('Projects')}>Add to budget →</button>
          </div>
        </main>
      </div>
    </div>
  );
}
window.HifiQuotes = HifiQuotes;
