// Hi-fi Advanced reporting dashboards - 9 dashboards w/ key charts
function RBars({ data, fmt, accent }) {
  const max = Math.max(...data.map((d) => d[1]));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {data.map(([label, v, tone], i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 130, fontSize: 12.5, color: 'var(--bq-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
          <div style={{ flex: 1, height: 22, background: 'var(--bq-subtle)', borderRadius: 7, overflow: 'hidden' }}>
            <div style={{ width: (v / max * 100) + '%', height: '100%', borderRadius: 7, background: tone === 'warn' ? 'var(--bq-brand)' : tone === 'ai' ? 'var(--bq-ai)' : tone === 'good' ? 'var(--bq-good)' : accent || 'var(--bq-brand)' }}></div>
          </div>
          <span className="bq-num" style={{ width: 64, textAlign: 'right', fontSize: 13 }}>{fmt ? fmt(v) : v}</span>
        </div>
      ))}
    </div>
  );
}
function RDonut({ pct, label, tone }) {
  const c = 2 * Math.PI * 34;
  const col = tone === 'warn' ? 'var(--bq-brand)' : tone === 'ai' ? 'var(--bq-ai)' : 'var(--bq-good)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width="92" height="92" viewBox="0 0 92 92">
        <circle cx="46" cy="46" r="34" fill="none" stroke="var(--bq-subtle)" strokeWidth="11"></circle>
        <circle cx="46" cy="46" r="34" fill="none" stroke={col} strokeWidth="11" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 46 46)"></circle>
        <text x="46" y="51" textAnchor="middle" fontSize="20" fontWeight="700" fill="var(--bq-ink)" fontFamily="Work Sans, sans-serif">{pct}%</text>
      </svg>
      <span style={{ fontSize: 12, color: 'var(--bq-muted)', textAlign: 'center' }}>{label}</span>
    </div>
  );
}

const DASHBOARDS = {
  'Company overview': { kpis: [['Active contract value', '$917.8k', null], ['Projected gross margin', '21.4%', 'ai'], ['Open opportunities', '$640k', null], ['Overdue invoices', '$4,480', 'warn']], chart: { type: 'bars', title: 'Projected gross margin by project', data: [['Osorio', 26.6, 'good'], ['Henderson', 19.2, 'warn'], ['Tanaka', 16.7, 'warn'], ['Bryn', 9.0, 'warn']], fmt: (v) => v + '%' } },
  'Sales pipeline': { kpis: [['Open opportunities', '12', null], ['Weighted value', '$418k', 'ai'], ['Win rate (90d)', '38%', null], ['Avg. days to close', '24', null]], chart: { type: 'bars', title: 'Open opportunities by stage', data: [['New lead', 5], ['Qualified', 3], ['Estimating', 2], ['Proposal sent', 2, 'ai']], fmt: (v) => v } },
  'Estimating performance': { kpis: [['Proposal approval rate', '64%', 'good'], ['Avg. estimate margin', '23.1%', 'ai'], ['Avg. turnaround', '3.2 days', null], ['Estimates this month', '9', null]], chart: { type: 'donut', pct: 64, label: 'Proposals approved (last 20)', tone: 'good' } },
  'Project profitability': { kpis: [['Avg. projected margin', '21.4%', 'ai'], ['Best type', 'Whole-home', 'good'], ['Margin at risk', '2 projects', 'warn'], ['Closed-out avg.', '22.8%', null]], chart: { type: 'bars', title: 'Most profitable project types', data: [['Whole-home', 25.4, 'good'], ['Additions', 22.1, 'good'], ['Kitchens', 19.8], ['Baths', 18.2], ['Decks', 12.5, 'warn']], fmt: (v) => v + '%' } },
  'Change orders': { kpis: [['CO approval rate', '81%', 'good'], ['Avg. CO value', '$3,240', null], ['Pending COs', '3', 'ai'], ['CO % of revenue', '7.2%', null]], chart: { type: 'donut', pct: 81, label: 'Change orders approved', tone: 'good' } },
  'Selections': { kpis: [['Pending decisions', '5', 'ai'], ['Over allowance', '$2,870', 'warn'], ['On-time rate', '72%', null], ['Avg. days to decide', '4.1', null]], chart: { type: 'bars', title: 'Pending selections by due date', data: [['Overdue', 1, 'warn'], ['This week', 2, 'ai'], ['Next week', 2], ['Later', 3]], fmt: (v) => v } },
  'Invoices / payments': { kpis: [['Outstanding', '$60.6k', null], ['Overdue', '$4,480', 'warn'], ['Avg. days to pay', '11', null], ['Collected (30d)', '$94.3k', 'good']], chart: { type: 'bars', title: 'Aging receivables', data: [['Current', 56160], ['1–15 days', 0], ['16–30 days', 0], ['30+ days', 4480, 'warn']], fmt: (v) => '$' + (v / 1000).toFixed(1) + 'k' } },
  'Team workload': { kpis: [['Open tasks', '24', null], ['Overdue', '4', 'warn'], ['Due this week', '11', 'ai'], ['Avg. per person', '6', null]], chart: { type: 'bars', title: 'Tasks overdue by assignee', data: [['Mike R.', 2, 'warn'], ['Maria H.', 1, 'warn'], ['Bright Electric', 1, 'warn'], ['StoneWorks', 0]], fmt: (v) => v } },
  'Subcontractor performance': { kpis: [['Active subs', '8', null], ['On-time rate', '86%', 'good'], ['Most delays', 'Volt Pro', 'warn'], ['Avg. quote variance', '11%', null]], chart: { type: 'bars', title: 'Subcontractors with most delays / issues', data: [['Volt Pro', 4, 'warn'], ['Reliant Plumbing', 2], ['Vargas Framing', 1], ['Bright Electric', 0, 'good']], fmt: (v) => v } },
};

function HifiReports() {
  const names = Object.keys(DASHBOARDS);
  const [sel, setSel] = React.useState(names[0]);
  const d = DASHBOARDS[sel];

  return (
    <div className="bq-screen">
      <BqTop crumb="Reports & dashboards"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Reports"></BqSide>
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          {/* dashboard switcher */}
          <div style={{ width: 220, flex: 'none', borderRight: '1px solid var(--bq-border)', background: 'var(--bq-card)', padding: '16px 10px', overflow: 'auto' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-faint)', padding: '0 10px 8px' }}>Dashboards</div>
            {names.map((n) => (
              <div key={n} onClick={() => setSel(n)} className={'nav-it' + (n === sel ? ' on' : '')} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 11, fontSize: 13, fontWeight: n === sel ? 600 : 500, color: n === sel ? 'var(--bq-brand-strong)' : 'var(--bq-muted)', background: n === sel ? 'var(--bq-brand-soft)' : 'transparent', cursor: 'pointer' }}>
                <BqIcon d={BQ_GLYPH.reports} size={14}></BqIcon>{n}
              </div>
            ))}
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div className="bq-display" style={{ fontSize: 22 }}>{sel}</div>
                <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Hartwell Builders · last 90 days</div>
              </div>
              <span className="bq-chip">Export</span>
            </div>

            <div style={{ display: 'flex', gap: 'calc(12px * var(--bq-sp))', flexWrap: 'wrap' }}>
              {d.kpis.map(([label, val, tone]) => <BqKPI key={label} label={label} value={val} tone={tone}></BqKPI>)}
            </div>

            <div className="bq-card-s" style={{ padding: 'calc(18px * var(--bq-sp)) 20px' }}>
              {d.chart.type === 'bars' ? (
                <React.Fragment>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14 }}>{d.chart.title}</div>
                  <RBars data={d.chart.data} fmt={d.chart.fmt}></RBars>
                </React.Fragment>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                  <RDonut pct={d.chart.pct} label={d.chart.label} tone={d.chart.tone}></RDonut>
                  <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5, flex: 1 }}>
                    BuilderIQ tracks this automatically as proposals, change orders, and invoices move through the pipeline. Tap any KPI to drill into the underlying records.
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
window.HifiReports = HifiReports;
