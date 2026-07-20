// Hi-fi Invoices - list + detail, statuses, sources (budget / payment schedule / approved CO)
const INV_LIST = [
  { no: 'INV-0007', client: 'Henderson', proj: 'Kitchen + Hall Bath', issued: 'Jun 8', due: 'Jun 22', total: 27960, paid: 0, status: 'Viewed', src: 'Payment schedule · Draw 3' },
  { no: 'INV-0006', client: 'Henderson', proj: 'Kitchen + Hall Bath', issued: 'May 24', due: 'Jun 7', total: 37280, paid: 37280, status: 'Paid', src: 'Payment schedule · Draw 2' },
  { no: 'INV-0005', client: 'Osorio', proj: 'Whole-home remodel', issued: 'Jun 1', due: 'Jun 15', total: 48200, paid: 20000, status: 'Partially paid', src: 'Payment schedule · Draw 5' },
  { no: 'INV-0004', client: 'Henderson', proj: 'Kitchen + Hall Bath', issued: 'May 20', due: 'Jun 3', total: 4480, paid: 0, status: 'Overdue', src: 'Approved CO-002 · Tile upgrade' },
  { no: 'INV-0003', client: 'Bryn', proj: 'Deck + outdoor kitchen', issued: 'May 12', due: 'May 26', total: 19725, paid: 19725, status: 'Paid', src: 'Final invoice' },
  { no: 'INV-0008', client: 'Tanaka', proj: 'Primary suite addition', issued: '-', due: '-', total: 24200, paid: 0, status: 'Draft', src: 'Payment schedule · Deposit' },
  { no: 'INV-0009', client: 'Osorio', proj: 'Whole-home remodel', issued: 'Jun 9', due: 'Jun 23', total: 62000, paid: 0, status: 'Sent', src: 'Payment schedule · Draw 6' },
  { no: 'INV-0010', client: 'Delgado', proj: 'Garage ADU', issued: 'Jun 7', due: 'Jun 21', total: 41200, paid: 0, status: 'Viewed', src: 'Payment schedule · Draw 2' },
  { no: 'INV-0002', client: 'Alvarez', proj: 'Basement finish', issued: 'May 30', due: 'Jun 13', total: 22800, paid: 0, status: 'Overdue', src: 'Payment schedule · Draw 3' },
  { no: 'INV-0011', client: 'Whitaker', proj: "Kitchen + butler's pantry", issued: 'May 28', due: 'Jun 11', total: 18400, paid: 18400, status: 'Paid', src: 'Payment schedule · Draw 1' },
  { no: 'INV-0012', client: 'Pearson', proj: 'Sunroom addition', issued: 'Jun 10', due: 'Jun 24', total: 14600, paid: 0, status: 'Sent', src: 'Final draw' },
  { no: 'INV-0013', client: "O'Brien", proj: 'Deck + porch', issued: 'Jun 2', due: 'Jun 16', total: 9800, paid: 9800, status: 'Paid', src: 'Final invoice' },
  { no: 'INV-0001', client: 'Chen', proj: 'Primary bath', issued: '-', due: '-', total: 12840, paid: 0, status: 'Draft', src: 'Payment schedule · Deposit' },
];
const INV_STATUS = { Draft: 'muted', Sent: 'ai', Viewed: 'ai', 'Partially paid': 'warn', Paid: 'good', Overdue: 'warn', Voided: 'muted' };

function HifiInvoices() {
  const fmt = (n) => '$' + n.toLocaleString('en-US');
  const [sel, setSel] = React.useState('INV-0007');
  const inv = INV_LIST.find((i) => i.no === sel);
  const LINES = [
    ['Draw 3 - Rough-in complete (per payment schedule)', 24000],
    ['Allowance reconciliation - cabinet hardware', 1280],
    ['Approved CO-001 - service upgrade to 200A', 2680],
  ];
  const sub = LINES.reduce((a, l) => a + l[1], 0);
  const tax = 0;
  const outstanding = INV_LIST.filter((i) => i.status !== 'Paid' && i.status !== 'Draft' && i.status !== 'Voided').reduce((a, i) => a + (i.total - i.paid), 0);
  const openPdf = () => window.bqPrintDoc && window.bqPrintDoc(
    <BqDocSheet docType="Invoice" number={inv.no} status={inv.status}
      billTo={{ label: 'Bill to', name: inv.client, project: inv.proj }}
      meta={[{ k: 'Issued', v: inv.issued }, { k: 'Due', v: inv.due }, { k: 'Reference', v: inv.src }]}
      lines={LINES.map(([d, c]) => ({ desc: d, amt: c }))}
      totals={[{ k: 'Subtotal', v: sub }, { k: 'Tax (materials)', v: tax }, { k: 'Total due', v: sub + tax, strong: true }]}
      note={inv.status === 'Overdue' ? 'This invoice is past due. Please remit payment at your earliest convenience to avoid interruption to the schedule.' : 'Payment due by ' + inv.due + '. Pay online securely through your client portal, or by check payable to ' + (window.bqCompany ? window.bqCompany() : 'us') + '.'}
    ></BqDocSheet>,
    { title: inv.no + ' · ' + inv.client }
  );

  return (
    <div className="bq-screen">
      <BqTop crumb="Invoices"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Invoices" alerts={{ Invoices: 1 }}></BqSide>
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div className="bq-display" style={{ fontSize: 22 }}>Invoices</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Syncs to QuickBooks Online · {fmt(outstanding)} outstanding</div>
            </div>
            <button className="bq-btn sm">From payment schedule</button>
            <button className="bq-btn primary sm"><BqIcon d="M12 5 V19 M5 12 H19" size={14}></BqIcon>New invoice</button>
          </div>

          <div style={{ display: 'flex', gap: 'calc(12px * var(--bq-sp))', flexWrap: 'wrap' }}>
            <BqKPI label="Outstanding" value={fmt(outstanding)} sub="8 open invoices"></BqKPI>
            <BqKPI label="Overdue" value={fmt(27280)} sub="2 invoices · oldest 11 days" tone="warn"></BqKPI>
            <BqKPI label="Paid this month" value={fmt(143810)} sub="5 invoices" tone="ai"></BqKPI>
          </div>

          <div style={{ display: 'flex', gap: 'calc(16px * var(--bq-sp))', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* list */}
            <div className="bq-card-s" style={{ flex: '1 1 440px', overflow: 'hidden' }}>
              <div className="bq-trow head" style={{ gridTemplateColumns: '1.1fr 1fr auto auto' }}>
                <span>Invoice</span><span>Project</span><span>Total</span><span>Status</span>
              </div>
              {INV_LIST.map((i) => (
                <div key={i.no} onClick={() => setSel(i.no)} className="bq-trow" style={{ gridTemplateColumns: '1.1fr 1fr auto auto', cursor: 'pointer', background: i.no === sel ? 'var(--bq-brand-soft)' : 'transparent' }}>
                  <span>
                    <span style={{ display: 'block', fontWeight: 600 }}>{i.no}</span>
                    <span style={{ display: 'block', fontSize: 11.5, color: 'var(--bq-faint)' }}>{i.client} · due {i.due}</span>
                  </span>
                  <span style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{i.proj}</span>
                  <span className="cell-num" style={{ fontWeight: 600 }}>{fmt(i.total)}</span>
                  <span className={'bq-chip ' + (INV_STATUS[i.status] || 'muted')}>{i.status}</span>
                </div>
              ))}
            </div>

            {/* detail */}
            <div className="bq-card-s" style={{ flex: '1 1 340px', padding: 'calc(16px * var(--bq-sp)) 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div className="bq-num" style={{ fontSize: 20 }}>{inv.no}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{inv.client} · {inv.proj}</div>
                </div>
                <span className={'bq-chip ' + (INV_STATUS[inv.status] || 'muted')}>{inv.status}</span>
              </div>
              <div style={{ display: 'flex', gap: 18, fontSize: 12.5 }}>
                <span style={{ color: 'var(--bq-faint)' }}>Issued <b style={{ color: 'var(--bq-ink)' }}>{inv.issued}</b></span>
                <span style={{ color: 'var(--bq-faint)' }}>Due <b style={{ color: 'var(--bq-ink)' }}>{inv.due}</b></span>
              </div>
              <div className="bq-chip ai" style={{ alignSelf: 'flex-start' }}><BqIcon d={BQ_GLYPH.invoice} size={11}></BqIcon>{inv.src}</div>

              <div style={{ borderTop: '1px solid var(--bq-border)', paddingTop: 10 }}>
                {LINES.map(([d, c], i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13, padding: '6px 0' }}>
                    <span style={{ color: 'var(--bq-muted)', lineHeight: 1.4 }}>{d}</span>
                    <span className="cell-num" style={{ flex: 'none' }}>{fmt(c)}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--bq-border)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--bq-muted)' }}><span>Subtotal</span><span className="cell-num">{fmt(sub)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--bq-muted)' }}><span>Tax (materials)</span><span className="cell-num">{fmt(tax)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
                  <span style={{ fontWeight: 700 }}>Total due</span><span className="bq-num" style={{ fontSize: 22 }}>{fmt(sub + tax)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                <button className="bq-btn primary sm" style={{ flex: 1 }} onClick={() => window.__bqNav2 && window.__bqNav2('client', 'Payments')}>Send to client</button>
                <button className="bq-btn sm" onClick={openPdf}><BqIcon d={BQ_GLYPH.exports} size={14}></BqIcon>PDF</button>
                <button className="bq-btn sm">Record payment</button>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', textAlign: 'center' }}>Online payment via portal · feeds project financials</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
window.HifiInvoices = HifiInvoices;
