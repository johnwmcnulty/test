// Hi-fi Estimate builder - interactive: live totals + acceptable AI suggestions
function HifiEstimate() {
  const fmt = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const [groups, setGroups] = React.useState([
    { code: '06', name: 'Cabinetry & Install', lines: [
      { id: 'c1', desc: 'Shaker cabinets, painted maple', qty: 38, unit: 'LF', cost: 820 },
      { id: 'c2', desc: 'Install labor (2 carpenters)', qty: 52, unit: 'hr', cost: 95 },
      { id: 'c3', desc: 'Hardware + soft-close allowance', qty: 1, unit: 'ls', cost: 1400 },
    ]},
    { code: '15', name: 'Plumbing', lines: [
      { id: 'p1', desc: 'Rough-in relocation (sink + DW)', qty: 1, unit: 'ls', cost: 4800 },
      { id: 'p2', desc: 'Fixture install - sink, DW, pot filler', qty: 32, unit: 'hr', cost: 110 },
    ]},
    { code: '09', name: 'Tile & Flooring', lines: [
      { id: 't1', desc: 'Porcelain floor tile, 240 sf', qty: 240, unit: 'sf', cost: 9.4 },
      { id: 't2', desc: 'Tile labor', qty: 64, unit: 'hr', cost: 58 },
    ]},
  ]);
  const [rollup, setRollup] = React.useState(93724); // 14 more cost codes, collapsed
  const [suggs, setSuggs] = React.useState([
    { id: 's1', title: 'Likely missing: haul-away', body: 'You included a dumpster + haul-away on 9 of your last 10 kitchen jobs (avg $1,650). This one has none.', action: '+ Add line ($1,650)' },
    { id: 's2', title: 'Tile labor looks low', body: 'Estimated at $58/hr - your last 3 jobs actually averaged $72/hr for tile work.', action: 'Update rate to $72' },
    { id: 's3', title: 'Quartz price moved', body: 'Stoneworks slab pricing up 6% since May. Affects 1 line in Countertops (+$680).', action: 'Reprice line' },
  ]);

  const MARKUP = 0.22, CONT = 0.05;
  const shownSum = groups.reduce((a, g) => a + g.lines.reduce((b, l) => b + l.qty * l.cost, 0), 0);
  const subtotal = shownSum + rollup;
  const total = subtotal * (1 + MARKUP) * (1 + CONT);
  const marginPct = ((total - subtotal) / total) * 100;

  const setCell = (gi, li, field, raw) => {
    const v = parseFloat(String(raw).replace(/[^0-9.]/g, ''));
    if (isNaN(v)) return;
    setGroups((gs) => gs.map((g, a) => a !== gi ? g : { ...g, lines: g.lines.map((l, b) => b !== li ? l : { ...l, [field]: v }) }));
  };

  const applySugg = (id) => {
    if (id === 's1') {
      setGroups((gs) => [{ code: '01', name: 'Demo & Disposal', lines: [{ id: 'd1', desc: 'Dumpster + haul-away', qty: 1, unit: 'ls', cost: 1650 }] }, ...gs]);
    } else if (id === 's2') {
      setGroups((gs) => gs.map((g) => g.code !== '09' ? g : { ...g, lines: g.lines.map((l) => l.id !== 't2' ? l : { ...l, cost: 72 }) }));
    } else if (id === 's3') {
      setRollup((r) => r + 680);
    }
    setSuggs((ss) => ss.map((s) => s.id === id ? { ...s, applied: true } : s));
  };
  const dismissSugg = (id) => setSuggs((ss) => ss.filter((s) => s.id !== id));
  const open = suggs.filter((s) => !s.applied).length;

  return (
    <div className="bq-screen">
      <BqTop crumb="Estimates / E-1042"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Estimates"></BqSide>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 'calc(14px * var(--bq-sp)) 24px', background: 'var(--bq-card)', borderBottom: '1px solid var(--bq-border)', flex: 'none' }}>
        <div>
          <div className="bq-display" style={{ fontSize: 19 }}>{BQ_JOB.name}</div>
          <div style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{BQ_JOB.client} · 42 Maple St · Estimate #E-1042</div>
        </div>
        <span className="bq-chip">Draft</span>
        <span style={{ flex: 1 }}></span>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-faint)' }}>Client total</div>
          <div className="bq-num" style={{ fontSize: 24, color: 'var(--bq-brand-strong)' }}>{fmt(total)}</div>
        </div>
        <div style={{ textAlign: 'right', paddingRight: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-faint)' }}>Margin</div>
          <div className="bq-num" style={{ fontSize: 24, color: marginPct >= 20 ? 'var(--bq-good)' : 'var(--bq-brand-strong)' }}>{marginPct.toFixed(1)}%</div>
        </div>
        <button className="bq-btn soft-ai" onClick={() => window.__bqNav && window.__bqNav('AI Estimate')}><BqSpark size={13}></BqSpark>Start from notes</button>
        <button className="bq-btn">Preview</button>
        <button className="bq-btn primary" onClick={() => window.__bqNav && window.__bqNav('Proposals')}>To proposal →</button>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <main style={{ flex: 1, padding: 'calc(16px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="bq-card-s" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', paddingTop: 6 }}>
            <div className="bq-trow head" style={{ gridTemplateColumns: '2.6fr 0.6fr 0.6fr 0.9fr 1fr' }}>
              <span>Item</span><span>Qty</span><span>Unit</span><span>Unit cost</span><span>Total</span>
            </div>
            <div style={{ overflow: 'auto', flex: 1 }}>
              {groups.map((g, gi) => (
                <React.Fragment key={g.code}>
                  <div className="bq-trow group" style={{ gridTemplateColumns: '1fr auto' }}>
                    <span><span style={{ color: 'var(--bq-faint)', marginRight: 8 }}>{g.code}</span>{g.name}</span>
                    <span className="cell-num">{fmt(g.lines.reduce((a, l) => a + l.qty * l.cost, 0))}</span>
                  </div>
                  {g.lines.map((l, li) => (
                    <div key={l.id} className="bq-trow" style={{ gridTemplateColumns: '2.6fr 0.6fr 0.6fr 0.9fr 1fr' }}>
                      <span>{l.desc}</span>
                      <input className="cellbox" value={l.qty} onChange={(e) => setCell(gi, li, 'qty', e.target.value)}></input>
                      <span style={{ color: 'var(--bq-muted)' }}>{l.unit}</span>
                      <input className="cellbox" value={'$' + l.cost} onChange={(e) => setCell(gi, li, 'cost', e.target.value)}></input>
                      <span className="cell-num" style={{ fontWeight: 600 }}>{fmt(l.qty * l.cost)}</span>
                    </div>
                  ))}
                </React.Fragment>
              ))}
              <div className="bq-trow" style={{ gridTemplateColumns: '1fr auto', color: 'var(--bq-muted)' }}>
                <span>14 more cost codes - collapsed</span>
                <span className="cell-num">{fmt(rollup)}</span>
              </div>
              <div style={{ padding: '10px 16px', display: 'flex', gap: 8 }}>
                <button className="bq-btn ghost sm">+ Line item</button>
                <button className="bq-btn ghost sm">+ Cost code group</button>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--bq-border)', background: 'var(--bq-subtle)', borderRadius: '0 0 var(--bq-r-card) var(--bq-r-card)', padding: 'calc(12px * var(--bq-sp)) 18px', display: 'flex', gap: 24, fontSize: 13, flex: 'none' }}>
              <span>Cost subtotal <b className="cell-num">{fmt(subtotal)}</b></span>
              <span>Markup <b className="cell-num">22%</b></span>
              <span>Contingency <b className="cell-num">5%</b></span>
              <span style={{ marginLeft: 'auto' }}>Client total <b className="cell-num" style={{ color: 'var(--bq-brand-strong)' }}>{fmt(total)}</b></span>
            </div>
          </div>
        </main>

        <aside className="ai-expanded" style={{ width: 280, flex: 'none', borderLeft: '1px solid var(--bq-border)', background: 'var(--bq-ai-soft)', padding: 'calc(14px * var(--bq-sp)) 16px', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BqSpark></BqSpark>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--bq-ai-strong)' }}>Estimate assistant</span>
            {open > 0 ? <span className="bq-chip solid-ai" style={{ marginLeft: 'auto' }}>{open}</span> : <span className="bq-chip good" style={{ marginLeft: 'auto' }}>all clear</span>}
          </div>
          {suggs.map((s) => (
            <div key={s.id} style={{ background: 'var(--bq-raise)', borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)', padding: 'calc(12px * var(--bq-sp)) 14px', display: 'flex', flexDirection: 'column', gap: 8, opacity: s.applied ? 0.65 : 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, display: 'flex', gap: 7, alignItems: 'center' }}>
                <BqSpark size={13}></BqSpark>{s.title}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--bq-muted)', lineHeight: 1.4 }}>{s.body}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {s.applied
                  ? <span className="bq-chip good">Applied ✓</span>
                  : <React.Fragment>
                      <button className="bq-btn ai sm" onClick={() => applySugg(s.id)}>{s.action}</button>
                      <button className="bq-btn ghost sm" onClick={() => dismissSugg(s.id)}>Dismiss</button>
                    </React.Fragment>}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 'auto', fontSize: 11.5, color: 'var(--bq-muted)', lineHeight: 1.45 }}>
            Suggestions come from your price book and past jobs. Nothing changes until you accept it.
          </div>
        </aside>
        <div className="ai-collapsed" style={{ position: 'absolute', right: 20, bottom: 20 }}>
          <button className="bq-btn ai" style={{ borderRadius: 999, boxShadow: '0 8px 20px rgba(124,58,237,0.35)' }}>
            <BqIcon d={BQ_GLYPH.spark} size={15}></BqIcon>Assistant{open ? ' · ' + open : ''}
          </button>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}
window.HifiEstimate = HifiEstimate;
