// Hi-fi Purchase Orders - POs to vendors tied to budget commitments
const POS = [
  { no: 'PO-0042', vendor: 'Wellborn (via ABC Supply)', code: '06 · Cabinetry', amt: 19800, status: 'Received', proj: 'Henderson', date: 'May 28', recv: '100%' },
  { no: 'PO-0043', vendor: 'StoneWorks', code: '07 · Countertops', amt: 8900, status: 'Approved', proj: 'Henderson', date: 'Jun 6', recv: '0%' },
  { no: 'PO-0044', vendor: 'Ferguson', code: '15 · Plumbing', amt: 1340, status: 'Sent', proj: 'Henderson', date: 'Jun 9', recv: '0%' },
  { no: 'PO-0045', vendor: 'Bright Electric', code: '16 · Electrical', amt: 5200, status: 'Draft', proj: 'Henderson', date: 'Jun 11', recv: '0%' },
  { no: 'PO-0046', vendor: 'Austin Tile Co.', code: '09 · Flooring', amt: 4480, status: 'Sent', proj: 'Henderson', date: 'Jun 11', recv: '0%' },
];
const PO_STATUS = { Draft: 'muted', Sent: 'ai', Approved: 'good', Received: 'good', Partial: 'warn' };

function HifiPurchaseOrders() {
  const fmt = (n) => '$' + n.toLocaleString('en-US');
  const committed = POS.filter((p) => p.status !== 'Draft').reduce((a, p) => a + p.amt, 0);
  const open = POS.filter((p) => p.status === 'Sent' || p.status === 'Approved').reduce((a, p) => a + p.amt, 0);

  return (
    <div className="bq-screen">
      <BqTop crumb="Purchase Orders"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Purchase Orders"></BqSide>
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div className="bq-display" style={{ fontSize: 22 }}>Purchase orders</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Henderson - Kitchen + Hall Bath · POs commit budget before the money is spent</div>
            </div>
            <button className="bq-btn primary sm"><BqIcon d="M12 5 V19 M5 12 H19" size={14}></BqIcon>New PO</button>
          </div>

          <div style={{ display: 'flex', gap: 'calc(12px * var(--bq-sp))', flexWrap: 'wrap' }}>
            <BqKPI label="Committed" value={fmt(committed)} sub="4 active POs"></BqKPI>
            <BqKPI label="Open (not received)" value={fmt(open)} sub="awaiting delivery" tone="ai"></BqKPI>
            <BqKPI label="Uncommitted budget" value={fmt(158200 - committed)} sub="remaining material budget"></BqKPI>
          </div>

          <div className="bq-ai-card" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
            <BqSpark size={14}></BqSpark>
            <span style={{ fontSize: 12.5, color: 'var(--bq-ink)' }}>Committing PO-0046 ($4,480 tile) will push cost code <b>09 · Flooring</b> to 104% of budget. Tie it to <b>CO-002</b> first?</span>
            <button className="bq-btn soft-ai sm" style={{ marginLeft: 'auto' }} onClick={() => window.__bqNav && window.__bqNav('Change Orders')}>Link CO</button>
          </div>

          <div className="bq-card-s" style={{ overflow: 'hidden' }}>
            <div className="bq-trow head" style={{ gridTemplateColumns: '0.9fr 1.4fr 1.1fr auto auto auto' }}>
              <span>PO</span><span>Vendor</span><span>Cost code</span><span>Amount</span><span>Received</span><span>Status</span>
            </div>
            {POS.map((p) => (
              <div key={p.no} className="bq-trow" style={{ gridTemplateColumns: '0.9fr 1.4fr 1.1fr auto auto auto', cursor: 'pointer', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>{p.no}<span style={{ display: 'block', fontSize: 11, color: 'var(--bq-faint)', fontWeight: 400 }}>{p.date}</span></span>
                <span style={{ fontSize: 12.5, color: 'var(--bq-ink)' }}>{p.vendor}</span>
                <span style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{p.code}</span>
                <span className="cell-num" style={{ fontWeight: 600 }}>{fmt(p.amt)}</span>
                <span style={{ fontSize: 12.5, color: p.recv === '100%' ? 'var(--bq-good)' : 'var(--bq-faint)', fontWeight: 600 }}>{p.recv}</span>
                <span className={'bq-chip ' + PO_STATUS[p.status]}>{p.status}</span>
              </div>
            ))}
            <div className="bq-trow" style={{ gridTemplateColumns: '0.9fr 1.4fr 1.1fr auto auto auto', background: 'var(--bq-subtle)', alignItems: 'center' }}>
              <span style={{ fontWeight: 700 }}>Committed</span><span></span><span></span>
              <span className="cell-num" style={{ fontWeight: 700 }}>{fmt(committed)}</span><span></span>
              <span style={{ fontSize: 11.5, color: 'var(--bq-ai-strong)', fontWeight: 600, cursor: 'pointer' }} onClick={() => window.__bqNav && window.__bqNav('Projects')}>In budget →</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
window.HifiPurchaseOrders = HifiPurchaseOrders;

// Hi-fi Time tracking - crew clock-in/out (geofenced field) → labor into actuals
const TIME_ENTRIES = [
  { who: 'Mike Reyes', role: 'Lead carpenter', proj: 'Henderson', code: '06 · Cabinetry', in: '7:02 AM', out: '3:34 PM', hrs: 8.5, rate: 58, geo: true, status: 'active' },
  { who: 'Carlos Mendez', role: 'Carpenter', proj: 'Henderson', code: '06 · Cabinetry', in: '7:05 AM', out: '-', hrs: 6.2, rate: 46, geo: true, status: 'clocked-in' },
  { who: 'Tyler Boone', role: 'Laborer', proj: 'Henderson', code: '01 · General', in: '7:30 AM', out: '3:30 PM', hrs: 8.0, rate: 32, geo: false, status: 'review' },
  { who: 'Mike Reyes', role: 'Lead carpenter', proj: 'Osorio', code: '05 · Structural', in: 'Jun 10', out: 'Jun 10', hrs: 7.5, rate: 58, geo: true, status: 'approved' },
];
const TIME_STATUS = { active: ['good', 'Approved'], 'clocked-in': ['ai', 'On site'], review: ['warn', 'Needs review'], approved: ['good', 'Approved'] };

function HifiTime() {
  const fmt = (n) => '$' + n.toLocaleString('en-US');
  const [entries] = React.useState(TIME_ENTRIES);
  const todayHrs = entries.filter((e) => e.in.includes('AM')).reduce((a, e) => a + e.hrs, 0);
  const todayCost = entries.filter((e) => e.in.includes('AM')).reduce((a, e) => a + e.hrs * e.rate, 0);
  const onsite = entries.filter((e) => e.status === 'clocked-in').length;

  return (
    <div className="bq-screen">
      <BqTop crumb="Projects / Henderson / Time"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Time" alerts={{ Time: onsite }}></BqSide>
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div className="bq-display" style={{ fontSize: 22 }}>Time tracking</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Crew hours flow straight into labor cost on budget vs actuals</div>
            </div>
            <button className="bq-btn sm">Export to payroll</button>
            <button className="bq-btn primary sm">Approve all</button>
          </div>

          <div style={{ display: 'flex', gap: 'calc(12px * var(--bq-sp))', flexWrap: 'wrap' }}>
            <BqKPI label="On site now" value={String(onsite)} sub="live clock-ins" tone="ai"></BqKPI>
            <BqKPI label="Hours today" value={todayHrs.toFixed(1)} sub="3 crew"></BqKPI>
            <BqKPI label="Labor cost today" value={fmt(Math.round(todayCost))} sub="→ actuals"></BqKPI>
            <BqKPI label="Needs review" value="1" sub="geofence mismatch" tone="warn"></BqKPI>
          </div>

          <div className="bq-ai-card" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
            <BqIcon d="M12 2 a7 7 0 0 0-7 7 c0 5 7 13 7 13 s7-8 7-13 a7 7 0 0 0-7-7 Z M12 11.5 a2.5 2.5 0 1 0 0-5 a2.5 2.5 0 0 0 0 5 Z" size={16} style={{ color: 'var(--bq-ai-strong)', flex: 'none' }}></BqIcon>
            <span style={{ fontSize: 12.5, color: 'var(--bq-ink)' }}><b>Tyler Boone</b>'s clock-in was 0.4 mi from the Henderson jobsite - outside the geofence. Review before approving.</span>
          </div>

          <div className="bq-card-s" style={{ overflow: 'hidden' }}>
            <div className="bq-trow head" style={{ gridTemplateColumns: '1.3fr 1.2fr auto auto auto auto' }}>
              <span>Crew member</span><span>Cost code</span><span>In / Out</span><span>Hours</span><span>Cost</span><span>Status</span>
            </div>
            {entries.map((e, i) => (
              <div key={i} className="bq-trow" style={{ gridTemplateColumns: '1.3fr 1.2fr auto auto auto auto', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span className="bq-avatar" style={{ width: 30, height: 30, fontSize: 11, background: 'var(--bq-subtle)', color: 'var(--bq-muted)', boxShadow: 'inset 0 0 0 1px var(--bq-border)' }}>{e.who.split(' ').map((n) => n[0]).join('')}</span>
                  <span><span style={{ display: 'block', fontWeight: 600 }}>{e.who}</span><span style={{ display: 'block', fontSize: 11, color: 'var(--bq-faint)' }}>{e.role} · {e.proj}</span></span>
                </span>
                <span style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{e.code}</span>
                <span style={{ fontSize: 12.5 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>{e.in}{e.geo ? <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--bq-good)' }} title="In geofence"></span> : <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--bq-brand)' }} title="Outside geofence"></span>}</span>
                  <span style={{ color: 'var(--bq-faint)' }}> – {e.out}</span>
                </span>
                <span className="cell-num" style={{ fontWeight: 600 }}>{e.hrs}{e.status === 'clocked-in' ? '…' : ''}</span>
                <span className="cell-num" style={{ fontSize: 12.5 }}>{fmt(Math.round(e.hrs * e.rate))}</span>
                <span className={'bq-chip ' + TIME_STATUS[e.status][0]}>{TIME_STATUS[e.status][1]}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
window.HifiTime = HifiTime;
