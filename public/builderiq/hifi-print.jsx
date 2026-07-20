// BuilderIQ PDF / print layer — a clean, paper-styled document sheet that any screen can
// render for print or "Save as PDF". Invoked imperatively: window.bqPrintDoc(<BqDocSheet .../>).
// Print CSS (body.bq-printing) lives in hifi-theme.css. Mounted once via BqLaunchLayer.

// extend the imperative UI bus (defined in hifi-launch.jsx) with a print channel
(function () {
  let printCb = null;
  const prev = bqUiBus.setPrint;
  bqUiBus.setPrint = (f) => { printCb = f; };
  bqUiBus.print = (node, opt) => { if (printCb) printCb(node, opt || {}); };
})();
window.bqPrintDoc = (node, opt) => bqUiBus.print(node, opt);

// ── standard business-document sheet (invoice, proposal, statement, report) ──
function BqDocSheet({ docType, number, status, company, billTo, meta, intro, lines, totals, sections, note, footer }) {
  const money = window.bqMoney || ((n) => '$' + Math.round(Number(n) || 0).toLocaleString('en-US'));
  const comp = company || (window.bqCompany ? window.bqCompany() : 'Your Company');
  const prof = window.__bqProfile ? window.__bqProfile.get() : {};
  const ink = '#26231E', muted = '#6E6759', faint = '#9A9384', line = '#E5E0D6', brand = '#C8560F';
  return (
    <div style={{ fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif', color: ink, fontSize: 13, lineHeight: 1.5 }}>
      {/* letterhead */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, borderBottom: '2px solid ' + ink, paddingBottom: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span style={{ width: 30, height: 30, borderRadius: 8, background: brand, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={BQ_GLYPH.hammer} size={17} sw={1.8} style={{ color: '#fff' }}></BqIcon></span>
            <span style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.01em' }}>{comp}</span>
          </div>
          <div style={{ fontSize: 11.5, color: muted, marginTop: 6, lineHeight: 1.6 }}>
            {prof.email ? <div>{prof.email}</div> : null}
            {prof.phone ? <div>{prof.phone}</div> : null}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: brand }}>{docType}</div>
          {number ? <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{number}</div> : null}
          {status ? <div style={{ display: 'inline-block', marginTop: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: brand, border: '1.5px solid ' + brand, borderRadius: 5, padding: '2px 8px' }}>{status}</div> : null}
        </div>
      </div>

      {/* bill-to + meta */}
      <div style={{ display: 'flex', gap: 24, marginTop: 18, flexWrap: 'wrap' }}>
        {billTo ? (
          <div style={{ flex: '1 1 200px', minWidth: 0 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: faint, marginBottom: 4 }}>{billTo.label || 'Prepared for'}</div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{billTo.name}</div>
            {billTo.addr ? <div style={{ color: muted, marginTop: 2 }}>{billTo.addr}</div> : null}
            {billTo.project ? <div style={{ color: muted, marginTop: 2 }}>{billTo.project}</div> : null}
          </div>
        ) : null}
        {meta && meta.length ? (
          <div style={{ flex: 'none', display: 'grid', gridTemplateColumns: 'auto auto', gap: '3px 16px', alignSelf: 'flex-start' }}>
            {meta.map((m, i) => (
              <React.Fragment key={i}>
                <span style={{ color: faint, fontSize: 12 }}>{m.k}</span>
                <span style={{ textAlign: 'right', fontWeight: 600, fontSize: 12.5 }}>{m.v}</span>
              </React.Fragment>
            ))}
          </div>
        ) : null}
      </div>

      {intro ? <div style={{ marginTop: 18, color: muted, lineHeight: 1.6 }}>{intro}</div> : null}

      {/* line-item table */}
      {lines && lines.length ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 18, fontSize: 12.5 }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px 0', borderBottom: '1.5px solid ' + ink, fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: muted }}>Description</th>
              <th style={{ textAlign: 'right', padding: '8px 0', borderBottom: '1.5px solid ' + ink, fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: muted, width: 120 }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l, i) => (
              <tr key={i}>
                <td style={{ padding: '9px 0', borderBottom: '1px solid ' + line, verticalAlign: 'top', paddingRight: 16 }}>{l.desc}{l.detail ? <div style={{ color: faint, fontSize: 11.5, marginTop: 2 }}>{l.detail}</div> : null}</td>
                <td style={{ padding: '9px 0', borderBottom: '1px solid ' + line, textAlign: 'right', fontVariantNumeric: 'tabular-nums', verticalAlign: 'top', whiteSpace: 'nowrap' }}>{typeof l.amt === 'number' ? money(l.amt) : l.amt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {/* free-form sections (proposals: scope, terms) */}
      {sections && sections.length ? sections.map((s, i) => (
        <div key={i} style={{ marginTop: 18 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: brand, marginBottom: 6 }}>{s.h}</div>
          <div style={{ color: muted, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{s.body}</div>
        </div>
      )) : null}

      {/* totals */}
      {totals && totals.length ? (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
          <div style={{ width: 280, maxWidth: '100%' }}>
            {totals.map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: t.strong ? '10px 0 0' : '4px 0', marginTop: t.strong ? 6 : 0, borderTop: t.strong ? '1.5px solid ' + ink : 'none', fontSize: t.strong ? 16 : 12.5, fontWeight: t.strong ? 800 : 500, color: t.strong ? ink : muted }}>
                <span>{t.k}</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>{typeof t.v === 'number' ? money(t.v) : t.v}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {note ? <div style={{ marginTop: 20, padding: '12px 14px', background: '#FAF7F1', border: '1px solid ' + line, borderRadius: 8, fontSize: 12, color: muted, lineHeight: 1.6 }}>{note}</div> : null}

      <div style={{ marginTop: 28, paddingTop: 14, borderTop: '1px solid ' + line, fontSize: 11, color: faint, textAlign: 'center', lineHeight: 1.6 }}>
        {footer || (comp + ' · Generated by BuilderIQ')}
      </div>
    </div>
  );
}
window.BqDocSheet = BqDocSheet;

function BqPrintHost() {
  const [doc, setDoc] = React.useState(null); // { node, opt }
  React.useEffect(() => {
    bqUiBus.setPrint((node, opt) => setDoc({ node, opt: opt || {} }));
    return () => bqUiBus.setPrint(null);
  }, []);
  React.useEffect(() => {
    if (!doc) return;
    const onKey = (e) => { if (e.key === 'Escape') setDoc(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [doc]);
  if (!doc) return null;
  const close = () => setDoc(null);
  const print = () => {
    document.body.classList.add('bq-printing');
    const done = () => { document.body.classList.remove('bq-printing'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    setTimeout(() => { try { window.print(); } catch (e) {} setTimeout(done, 800); }, 60);
  };
  const sheet = (
    <div id="bq-print-portal" role="dialog" aria-modal="true" aria-label="Document preview">
      <div className="bq-print-chrome">
        <span style={{ fontWeight: 600, fontSize: 13, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.opt.title || 'Document preview'}</span>
        <button className="bq-btn ghost sm" onClick={close}>Close</button>
        <button className="bq-btn primary sm" onClick={print}><BqIcon d="M6 9 V4 H18 V9 M6 18 H4 V11 a1 1 0 0 1 1-1 H19 a1 1 0 0 1 1 1 V18 H18 M8 14 H16 V21 H8 Z" size={14} sw={1.7}></BqIcon>Save as PDF</button>
      </div>
      <div className="bq-print-scroll">
        <div className="bq-print-sheet">{doc.node}</div>
      </div>
    </div>
  );
  return ReactDOM.createPortal(sheet, document.body);
}
window.BqPrintHost = BqPrintHost;
