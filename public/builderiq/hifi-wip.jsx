// BuilderIQ - WIP / over–under billing report + Backlog & revenue forecast

// ════════════════════════════ WIP REPORT ════════════════════════════
// over/(under) billed = billed − earned;  earned = (cost-to-date ÷ est. cost) × contract
const WIP_JOBS = [
  { name: 'Osorio - Whole-home reno', contract: 342000, estCost: 251000, costToDate: 213350, billed: 308000 },
  { name: 'Henderson - Kitchen + Hall Bath', contract: 186400, estCost: 146000, costToDate: 87600, billed: 97200 },
  { name: 'Tanaka - Rear addition', contract: 164000, estCost: 136600, costToDate: 40980, billed: 62000 },
  { name: 'Alvarez - Basement finish', contract: 92700, estCost: 70400, costToDate: 49280, billed: 51000 },
  { name: 'Chen - Primary bath', contract: 64200, estCost: 47500, costToDate: 9500, billed: 9000 },
  { name: "O'Brien - Deck + porch", contract: 48900, estCost: 35200, costToDate: 33440, billed: 44000 },
];
function wipCalc(j) {
  const pct = j.costToDate / j.estCost;
  const earned = Math.round(pct * j.contract);
  const variance = j.billed - earned; // + over, − under
  return { pct: Math.round(pct * 100), earned, variance };
}
const wipK = (n) => (n < 0 ? '−$' : '$') + Math.round(Math.abs(n) / 1000) + 'k';

function WipBilledBar({ pct }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 7, background: 'var(--bq-subtle)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: pct + '%', height: '100%', borderRadius: 999, background: pct >= 80 ? 'var(--bq-good)' : pct >= 40 ? 'var(--bq-ai)' : 'var(--bq-brand)' }}></div>
      </div>
      <span className="bq-num" style={{ fontSize: 12.5, width: 38, textAlign: 'right' }}>{pct}%</span>
    </div>
  );
}

function HifiWip() {
  const rows = WIP_JOBS.map((j) => ({ ...j, ...wipCalc(j) }));
  const tot = rows.reduce((a, r) => ({ contract: a.contract + r.contract, costToDate: a.costToDate + r.costToDate, earned: a.earned + r.earned, billed: a.billed + r.billed }), { contract: 0, costToDate: 0, earned: 0, billed: 0 });
  const under = rows.filter((r) => r.variance < 0).reduce((a, r) => a + r.variance, 0);
  const over = rows.filter((r) => r.variance > 0).reduce((a, r) => a + r.variance, 0);
  const backlog = tot.contract - tot.billed;
  const cols = '2fr 1fr 1.2fr 1.1fr 1.1fr 1.2fr';

  return (
    <div className="bq-screen">
      <BqTop crumb="WIP · over / under billing" right={<React.Fragment><span className="bq-chip">As of Jun 16, 2026</span><button className="bq-btn sm"><BqIcon d={BQ_GLYPH.exports} size={13}></BqIcon>Export for CPA</button></React.Fragment>}></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="WIP Report"></BqSide>
        <main style={{ flex: 1, padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))', overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span className="bq-display" style={{ fontSize: 20 }}>Work-in-progress schedule</span>
            <span style={{ fontSize: 13, color: 'var(--bq-muted)' }}>{rows.length} active jobs · the report your accountant asks for</span>
          </div>
          <div style={{ display: 'flex', gap: 'calc(12px * var(--bq-sp))', flexWrap: 'wrap' }}>
            <BqKPI label="Signed backlog" value={wipK(backlog)} sub="contract not yet billed"></BqKPI>
            <BqKPI label="Underbilled" value={wipK(under)} sub="earned, not yet invoiced" tone="warn"></BqKPI>
            <BqKPI label="Overbilled" value={wipK(over)} sub="billed ahead of work" tone="ai"></BqKPI>
            <BqKPI label="Costs in progress" value={wipK(tot.costToDate)} sub="spent across active jobs"></BqKPI>
          </div>

          <section className="bq-ai-card ai-expanded" style={{ padding: '13px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <BqSpark></BqSpark>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--bq-ai-strong)', marginBottom: 3 }}>You've earned {wipK(-under)} you haven't billed yet</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5 }}>Three jobs are underbilled - work is done but the draw hasn't gone out. <b>Henderson</b> is the biggest gap ({wipK(rows.find((r) => r.name.startsWith('Henderson')).variance)}). Billing the next draws protects your cash position.</div>
            </div>
            <button className="bq-btn ai sm">Draft the draws</button>
          </section>

          <section className="bq-card-s" style={{ overflow: 'hidden' }}>
            <div className="bq-trow head" style={{ gridTemplateColumns: cols }}>
              <span>Project</span><span>Contract</span><span>% complete (cost)</span><span>Earned</span><span>Billed</span><span>Over / (under)</span>
            </div>
            {rows.map((r) => (
              <div key={r.name} className="bq-trow" style={{ gridTemplateColumns: cols, alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>{r.name}</span>
                <span className="cell-num" style={{ color: 'var(--bq-muted)' }}>{bqMoney(r.contract)}</span>
                <WipBilledBar pct={r.pct}></WipBilledBar>
                <span className="cell-num">{bqMoney(r.earned)}</span>
                <span className="cell-num">{bqMoney(r.billed)}</span>
                <span className="bq-num" style={{ fontSize: 13.5, color: r.variance < 0 ? 'var(--bq-brand-strong)' : 'var(--bq-good)' }}>{r.variance < 0 ? '(' + bqMoney(-r.variance) + ')' : bqMoney(r.variance)}</span>
              </div>
            ))}
            <div className="bq-trow" style={{ gridTemplateColumns: cols, alignItems: 'center', background: 'var(--bq-subtle)', fontWeight: 700 }}>
              <span>Totals</span>
              <span className="bq-num" style={{ fontSize: 13.5 }}>{bqMoney(tot.contract)}</span>
              <span style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{Math.round(tot.costToDate / rows.reduce((a, r) => a + r.estCost, 0) * 100)}% blended</span>
              <span className="bq-num" style={{ fontSize: 13.5 }}>{bqMoney(tot.earned)}</span>
              <span className="bq-num" style={{ fontSize: 13.5 }}>{bqMoney(tot.billed)}</span>
              <span className="bq-num" style={{ fontSize: 13.5, color: (over + under) < 0 ? 'var(--bq-brand-strong)' : 'var(--bq-good)' }}>{(over + under) < 0 ? '(' + bqMoney(-(over + under)) + ')' : bqMoney(over + under)}</span>
            </div>
          </section>

          <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--bq-muted)', lineHeight: 1.5, padding: '0 2px' }}>
            <div style={{ flex: 1 }}><b style={{ color: 'var(--bq-brand-strong)' }}>Underbilled</b> - you've earned more than you've invoiced. It's an asset, but it's cash sitting in unbilled work. Send the draw.</div>
            <div style={{ flex: 1 }}><b style={{ color: 'var(--bq-good)' }}>Overbilled</b> - you've invoiced ahead of completed work. Good for cash flow, but it's a liability you still owe in labor and materials.</div>
          </div>
        </main>
      </div>
    </div>
  );
}
window.HifiWip = HifiWip;

// ════════════════════════════ FORECAST - backlog & revenue ════════════════════════════
// recognized-revenue projection: committed (signed backlog) + weighted pipeline, by month
const FC_MONTHS = [
  ['Jun', 142, 8], ['Jul', 128, 24], ['Aug', 86, 38], ['Sep', 74, 52], ['Oct', 58, 70], ['Nov', 41, 88],
];
const FC_TARGET = 120;
const FC_MAX = 170;
const FC_PLOT = 184; // px height of the bar plot area

function FcBar({ committed, pipeline, label, low }) {
  const px = (v) => (v / FC_MAX * FC_PLOT);
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 0 }}>
      <div style={{ height: FC_PLOT, width: 46, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <span className="bq-num" style={{ fontSize: 11.5, textAlign: 'center', marginBottom: 4, color: 'var(--bq-muted)' }}>${committed + pipeline}k</span>
        <div title="weighted pipeline" style={{ height: px(pipeline), width: '100%', background: 'repeating-linear-gradient(45deg, var(--bq-ai-soft), var(--bq-ai-soft) 5px, var(--bq-ai-border) 5px, var(--bq-ai-border) 10px)', borderRadius: '7px 7px 0 0', boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)' }}></div>
        <div title="signed backlog" style={{ height: px(committed), width: '100%', background: low ? 'var(--bq-brand)' : 'var(--bq-ai)', borderRadius: pipeline ? 0 : '7px 7px 0 0' }}></div>
      </div>
      <span style={{ fontSize: 11.5, color: low ? 'var(--bq-brand-strong)' : 'var(--bq-muted)', fontWeight: low ? 700 : 500 }}>{label}</span>
    </div>
  );
}

function HifiForecast() {
  const committed = FC_MONTHS.reduce((a, m) => a + m[1], 0);
  const pipeline = FC_MONTHS.reduce((a, m) => a + m[2], 0);
  const next90 = FC_MONTHS.slice(0, 3).reduce((a, m) => a + m[1] + m[2], 0);

  return (
    <div className="bq-screen">
      <BqTop crumb="Backlog & revenue forecast" right={<span className="bq-chip ai"><BqSpark size={11}></BqSpark>Updated from pipeline</span>}></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Forecast"></BqSide>
        <main style={{ flex: 1, padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))', overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span className="bq-display" style={{ fontSize: 20 }}>Where revenue lands</span>
            <span style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Next 6 months · signed work + weighted pipeline</span>
          </div>
          <div style={{ display: 'flex', gap: 'calc(12px * var(--bq-sp))', flexWrap: 'wrap' }}>
            <BqKPI label="Signed backlog" value={'$' + committed + 'k'} sub="contracted, not yet built"></BqKPI>
            <BqKPI label="Weighted pipeline" value={'$' + pipeline + 'k'} sub="probability-adjusted" tone="ai"></BqKPI>
            <BqKPI label="Projected (90 days)" value={'$' + next90 + 'k'} sub="Jun–Aug recognized"></BqKPI>
            <BqKPI label="Months of backlog" value="4.6" sub="at current burn rate" tone="good"></BqKPI>
          </div>

          <section className="bq-ai-card ai-expanded" style={{ padding: '13px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <BqSpark></BqSpark>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--bq-ai-strong)', marginBottom: 3 }}>August dips below your $120k/mo target</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5 }}>Signed work in <b>August is $86k</b> - under target. Two proposals out (<b>Kim</b> $36k, <b>Delacroix</b> $58k) would more than fill the gap if signed this month. Want a push sequence on both?</div>
            </div>
            <button className="bq-btn ai sm">Nudge both deals</button>
          </section>

          <section className="bq-card-s" style={{ padding: 'calc(20px * var(--bq-sp)) 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>Projected monthly revenue</span>
              <span style={{ flex: 1 }}></span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--bq-muted)' }}><span style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--bq-ai)' }}></span>Signed</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--bq-muted)' }}><span style={{ width: 12, height: 12, borderRadius: 3, background: 'repeating-linear-gradient(45deg, var(--bq-ai-soft), var(--bq-ai-soft) 3px, var(--bq-ai-border) 3px, var(--bq-ai-border) 6px)', boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)' }}></span>Pipeline</span>
            </div>
            <div style={{ position: 'relative', display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              {/* target line - positioned within the FC_PLOT plot area, measured from the month-label baseline */}
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 'calc(' + (FC_TARGET / FC_MAX * FC_PLOT) + 'px + 27px)', borderTop: '2px dashed var(--bq-brand-border)', zIndex: 1 }}>
                <span style={{ position: 'absolute', right: 0, top: -17, fontSize: 11, fontWeight: 700, color: 'var(--bq-brand-strong)', background: 'var(--bq-card)', padding: '0 4px' }}>${FC_TARGET}k target</span>
              </div>
              {FC_MONTHS.map((m) => <FcBar key={m[0]} label={m[0]} committed={m[1]} pipeline={m[2]} low={m[1] < FC_TARGET}></FcBar>)}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
window.HifiForecast = HifiForecast;
