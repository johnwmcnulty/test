// Hi-fi Subs & Vendors - directory, COI/license/W-9 expiry, lien waivers, 1099, performance
const VENDORS = [
  { name: 'Vargas Framing', type: 'Subcontractor', trade: 'Framing / structural', rating: 4.8, jobs: 12, coi: 'Aug 2026', lic: 'Active', w9: true, ytd: 48200, flag: null },
  { name: 'Bright Electric', type: 'Subcontractor', trade: 'Electrical', rating: 4.9, jobs: 23, coi: 'Jul 2026', lic: 'Active', w9: true, ytd: 71500, flag: null },
  { name: 'Reliant Plumbing', type: 'Subcontractor', trade: 'Plumbing', rating: 4.6, jobs: 18, coi: 'Jun 2026', lic: 'Active', w9: true, ytd: 39800, flag: 'coi' },
  { name: 'StoneWorks', type: 'Vendor', trade: 'Countertops', rating: 4.7, jobs: 9, coi: 'Sep 2026', lic: '-', w9: true, ytd: 28400, flag: null },
  { name: 'Volt Pro', type: 'Subcontractor', trade: 'Electrical', rating: 3.9, jobs: 4, coi: 'Expired', lic: 'Active', w9: false, ytd: 12200, flag: 'multi' },
  { name: 'Ferguson', type: 'Vendor', trade: 'Plumbing supply', rating: 4.5, jobs: 31, coi: '-', lic: '-', w9: true, ytd: 18900, flag: null },
  { name: 'ABC Supply', type: 'Vendor', trade: 'Building materials', rating: 4.4, jobs: 27, coi: '-', lic: '-', w9: true, ytd: 22100, flag: null },
  { name: 'Austin Tile Co.', type: 'Subcontractor', trade: 'Tile / flooring', rating: 4.7, jobs: 7, coi: 'Oct 2026', lic: 'Active', w9: true, ytd: 16300, flag: null },
];

function VendorDrawer({ v, onClose }) {
  const fmt = (n) => '$' + n.toLocaleString('en-US');
  const DOCS = [
    ['Certificate of Insurance', v.coi === 'Expired' ? 'Expired' : 'Valid to ' + v.coi, v.coi === 'Expired' ? 'warn' : v.flag === 'coi' ? 'ai' : 'good'],
    ['W-9', v.w9 ? 'On file' : 'Missing', v.w9 ? 'good' : 'warn'],
    ['Trade license', v.lic === 'Active' ? 'Active' : v.lic === '-' ? 'N/A' : v.lic, v.lic === 'Active' ? 'good' : 'muted'],
    ['Lien waivers', '3 of 4 collected', 'ai'],
    ['Master subcontractor agreement', 'Signed Mar 2025', 'good'],
  ];
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(38,35,30,0.35)', display: 'flex', justifyContent: 'flex-end', zIndex: 30 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(440px, 94%)', height: '100%', background: 'var(--bq-card)', boxShadow: '-8px 0 32px rgba(0,0,0,0.12)', padding: '22px 24px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <span style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={v.type === 'Vendor' ? BQ_GLYPH.vendor : BQ_GLYPH.hardhat} size={20}></BqIcon></span>
          <div style={{ flex: 1 }}>
            <div className="bq-display" style={{ fontSize: 19 }}>{v.name}</div>
            <div style={{ fontSize: 12.5, color: 'var(--bq-faint)' }}>{v.type} · {v.trade}</div>
          </div>
          <button onClick={onClose} className="bq-btn ghost sm" style={{ padding: 6 }}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={16}></BqIcon></button>
        </div>
        <div style={{ display: 'flex', gap: 'calc(10px * var(--bq-sp))' }}>
          <BqKPI label="Rating" value={'★ ' + v.rating} sub={v.jobs + ' jobs'}></BqKPI>
          <BqKPI label="Paid YTD" value={fmt(v.ytd)} sub="1099 tracked"></BqKPI>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 8 }}>Compliance documents</div>
          {DOCS.map(([k, v2, tone], i) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
              <BqIcon d={BQ_GLYPH.proposal} size={15} style={{ color: 'var(--bq-faint)', flex: 'none' }}></BqIcon>
              <span style={{ fontSize: 13, flex: 1 }}>{k}</span>
              <span className={'bq-chip ' + (tone === 'warn' ? 'brand' : tone)}>{v2}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="bq-btn primary sm">Request updated COI</button>
          <button className="bq-btn sm" onClick={() => window.__bqNav && window.__bqNav('Purchase Orders')}>New PO</button>
          <button className="bq-btn ghost sm">Message</button>
        </div>
      </div>
    </div>
  );
}

function HifiVendors() {
  const fmt = (n) => '$' + n.toLocaleString('en-US');
  const [filter, setFilter] = React.useState('All');
  const [open, setOpen] = React.useState(null);
  const FILTERS = ['All', 'Subcontractors', 'Vendors', 'Compliance issues'];
  const flagged = VENDORS.filter((v) => v.flag).length;
  const match = (v) => filter === 'All' ? true : filter === 'Subcontractors' ? v.type === 'Subcontractor' : filter === 'Vendors' ? v.type === 'Vendor' : !!v.flag;
  const shown = VENDORS.filter(match);

  return (
    <div className="bq-screen">
      <BqTop crumb="Subs & Vendors"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Subs & Vendors" alerts={{ 'Subs & Vendors': flagged }}></BqSide>
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div className="bq-display" style={{ fontSize: 22 }}>Subcontractors &amp; vendors</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Directory · insurance, licensing &amp; 1099 tracking · {flagged} need attention</div>
            </div>
            <button className="bq-btn sm">Export 1099 summary</button>
            <button className="bq-btn primary sm"><BqIcon d="M12 5 V19 M5 12 H19" size={14}></BqIcon>Add</button>
          </div>

          <div style={{ display: 'flex', gap: 'calc(12px * var(--bq-sp))', flexWrap: 'wrap' }}>
            <BqKPI label="Active subs & vendors" value={String(VENDORS.length)} sub="5 subs · 3 vendors"></BqKPI>
            <BqKPI label="Compliance issues" value={String(flagged)} sub="expired COI / missing W-9" tone="warn"></BqKPI>
            <BqKPI label="Paid YTD" value={fmt(VENDORS.reduce((a, v) => a + v.ytd, 0))} sub="across all" tone="ai"></BqKPI>
          </div>

          <div className="bq-ai-card" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}>
            <BqIcon d="M12 4 L21 19 H3 Z M12 10 V14 M12 16.5 V16.6" size={16} style={{ color: 'var(--bq-ai-strong)', flex: 'none' }}></BqIcon>
            <span style={{ fontSize: 12.5, color: 'var(--bq-ink)' }}><b>Volt Pro</b>'s COI expired and W-9 is missing - BuilderIQ blocked new POs until resolved. <b>Reliant Plumbing</b>'s COI expires in 18 days.</span>
            <button className="bq-btn ai sm" style={{ marginLeft: 'auto' }}>Request all</button>
          </div>

          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {FILTERS.map((f) => <button key={f} className={'bq-chip' + (filter === f ? ' brand' : '')} onClick={() => setFilter(f)} style={{ cursor: 'pointer', border: 'none', font: 'inherit', fontWeight: 600 }}>{f}</button>)}
          </div>

          <div className="bq-card-s" style={{ overflow: 'hidden' }}>
            <div className="bq-trow head" style={{ gridTemplateColumns: '1.4fr 1fr auto auto auto auto' }}>
              <span>Name</span><span>Trade</span><span>Rating</span><span>COI</span><span>W-9</span><span>Paid YTD</span>
            </div>
            {shown.map((v, i) => (
              <div key={i} onClick={() => setOpen(v)} className="bq-trow" style={{ gridTemplateColumns: '1.4fr 1fr auto auto auto auto', cursor: 'pointer', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ width: 30, height: 30, borderRadius: 9, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-subtle)', color: 'var(--bq-muted)' }}><BqIcon d={v.type === 'Vendor' ? BQ_GLYPH.vendor : BQ_GLYPH.hardhat} size={15}></BqIcon></span>
                  <span><span style={{ display: 'block', fontWeight: 600 }}>{v.name}</span><span style={{ display: 'block', fontSize: 11, color: 'var(--bq-faint)' }}>{v.type}</span></span>
                </span>
                <span style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{v.trade}</span>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>★ {v.rating}</span>
                <span>{v.coi === '-' ? <span style={{ color: 'var(--bq-faint)', fontSize: 12.5 }}>N/A</span> : <span className={'bq-chip ' + (v.coi === 'Expired' ? 'brand' : v.flag === 'coi' ? 'ai' : 'good')}>{v.coi}</span>}</span>
                <span>{v.coi === '-' && v.lic === '-' ? <span style={{ color: v.w9 ? 'var(--bq-good)' : 'var(--bq-brand-strong)' }}>{v.w9 ? '✓' : '-'}</span> : <span className={'bq-chip ' + (v.w9 ? 'good' : 'brand')}>{v.w9 ? 'On file' : 'Missing'}</span>}</span>
                <span className="cell-num" style={{ fontSize: 12.5, fontWeight: 600 }}>{fmt(v.ytd)}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
      {open ? <VendorDrawer v={open} onClose={() => setOpen(null)}></VendorDrawer> : null}
    </div>
  );
}
window.HifiVendors = HifiVendors;
