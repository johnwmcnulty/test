// Hi-fi Documents - versioned vault + native e-signature
const DOC_CATS = ['All', 'Contracts', 'Proposals', 'Permits', 'Plans', 'Insurance', 'Warranties'];
const DOCS = [
  { name: 'Prime Contract - Henderson', cat: 'Contracts', ver: 3, project: 'Henderson Kitchen + Bath', status: 'Awaiting signature', tone: 'ai', who: 'Dan & Priya', updated: 'Today' },
  { name: 'Change Order #4 - Recessed lighting', cat: 'Contracts', ver: 1, project: 'Henderson Kitchen + Bath', status: 'Awaiting signature', tone: 'ai', who: 'Dan & Priya', updated: 'Today' },
  { name: 'Building Permit - 2024-RES-8841', cat: 'Permits', ver: 1, project: 'Henderson Kitchen + Bath', status: 'Issued', tone: 'good', who: 'City of Henderson', updated: '2d ago' },
  { name: 'Electrical Permit', cat: 'Permits', ver: 1, project: 'Henderson Kitchen + Bath', status: 'Pending', tone: 'brand', who: 'City of Henderson', updated: '4d ago' },
  { name: 'Kitchen plan set - Rev C', cat: 'Plans', ver: 3, project: 'Henderson Kitchen + Bath', status: 'Current', tone: '', who: 'Mara (designer)', updated: '1w ago' },
  { name: 'COI - Vargas Framing', cat: 'Insurance', ver: 2, project: 'Company-wide', status: 'Valid to Aug 2026', tone: 'good', who: 'Vargas Framing', updated: '3w ago' },
  { name: 'COI - Volt Pro', cat: 'Insurance', ver: 1, project: 'Company-wide', status: 'Expired', tone: 'bad', who: 'Volt Pro', updated: '2mo ago' },
  { name: 'Workmanship Warranty Packet', cat: 'Warranties', ver: 2, project: 'Template', status: 'Template', tone: '', who: 'Hartwell Builders', updated: '1mo ago' },
  { name: 'Signed Proposal - Henderson', cat: 'Proposals', ver: 2, project: 'Henderson Kitchen + Bath', status: 'Signed', tone: 'good', who: 'Dan & Priya', updated: 'Apr 18' },
];

function SignatureModal({ doc, onClose }) {
  const canvasRef = React.useRef(null);
  const drawing = React.useRef(false);
  const [hasInk, setHasInk] = React.useState(false);
  const [mode, setMode] = React.useState('draw');
  const [typed, setTyped] = React.useState('Dan Henderson');
  const [consent, setConsent] = React.useState(false);
  const [signed, setSigned] = React.useState(false);

  React.useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#26231E';
  }, [mode]);

  const pos = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  };
  const start = (e) => { e.preventDefault(); drawing.current = true; const ctx = canvasRef.current.getContext('2d'); const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const move = (e) => { if (!drawing.current) return; e.preventDefault(); const ctx = canvasRef.current.getContext('2d'); const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); setHasInk(true); };
  const end = () => { drawing.current = false; };
  const clear = () => { const c = canvasRef.current; c.getContext('2d').clearRect(0, 0, c.width, c.height); setHasInk(false); };

  const canSign = consent && (mode === 'draw' ? hasInk : typed.trim().length > 1);
  const now = 'Jun 14, 2026 · 2:18 PM PDT';

  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(38,35,30,0.4)', zIndex: 60, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '5vh' }}>
      <div onClick={(e) => e.stopPropagation()} className="bq-card-s" style={{ width: 'min(560px, 94%)', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 24px 60px rgba(38,35,30,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '15px 20px', borderBottom: '1px solid var(--bq-border)' }}>
          <span style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--bq-ai-soft)', color: 'var(--bq-ai-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={BQ_GLYPH.sign} size={18}></BqIcon></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{signed ? 'Signed & recorded' : 'Sign document'}</div>
            <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{doc.name} · v{doc.ver}</div>
          </div>
          <button onClick={onClose} className="bq-btn ghost sm" style={{ padding: 6 }}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={16}></BqIcon></button>
        </div>

        {!signed ? (
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 13 }}>
            <div className="bq-ph" style={{ height: 120 }} aria-hidden="true">
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><BqIcon d={BQ_GLYPH.docs} size={15}></BqIcon>Document preview - 6 pages</span>
            </div>
            <div className="seg-toggle" style={{ alignSelf: 'flex-start' }}>
              <button className={mode === 'draw' ? 'on' : ''} onClick={() => setMode('draw')}>Draw</button>
              <button className={mode === 'type' ? 'on' : ''} onClick={() => setMode('type')}>Type</button>
            </div>
            {mode === 'draw' ? (
              <div>
                <div style={{ position: 'relative', borderRadius: 12, background: '#fff', boxShadow: 'inset 0 0 0 1px var(--bq-border-strong)', overflow: 'hidden' }}>
                  <canvas ref={canvasRef} width={500} height={150} style={{ width: '100%', height: 150, display: 'block', touchAction: 'none', cursor: 'crosshair' }}
                    onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
                    onTouchStart={start} onTouchMove={move} onTouchEnd={end}></canvas>
                  <div style={{ position: 'absolute', left: 18, right: 18, bottom: 22, borderBottom: '1.5px solid var(--bq-border-strong)', pointerEvents: 'none' }}></div>
                  {!hasInk ? <span style={{ position: 'absolute', left: 0, right: 0, top: 56, textAlign: 'center', color: 'var(--bq-faint)', fontSize: 12.5, pointerEvents: 'none' }}>Draw your signature here</span> : null}
                </div>
                <div style={{ textAlign: 'right', marginTop: 5 }}><button className="bq-btn ghost sm" onClick={clear}>Clear</button></div>
              </div>
            ) : (
              <div style={{ position: 'relative', borderRadius: 12, background: '#fff', boxShadow: 'inset 0 0 0 1px var(--bq-border-strong)', padding: '8px 18px' }}>
                <input value={typed} onChange={(e) => setTyped(e.target.value)} style={{ width: '100%', border: 'none', outline: 'none', font: '34px "Caveat", cursive', color: '#1A1813', textAlign: 'center', background: 'transparent' }}></input>
                <div style={{ borderBottom: '1.5px solid var(--bq-border-strong)' }}></div>
              </div>
            )}
            <label style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 12, color: 'var(--bq-muted)', cursor: 'pointer' }}>
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ marginTop: 2, accentColor: 'var(--bq-brand)' }}></input>
              <span>I agree this electronic signature is the legal equivalent of my handwritten signature, and consent to do business electronically under the E-SIGN Act.</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button className="bq-btn ghost sm" onClick={onClose}>Cancel</button>
              <button className="bq-btn primary" style={{ marginLeft: 'auto', opacity: canSign ? 1 : 0.5, pointerEvents: canSign ? 'auto' : 'none' }} onClick={() => setSigned(true)}>Adopt &amp; sign</button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bq-good-soft)', borderRadius: 14, padding: '14px 16px', boxShadow: 'inset 0 0 0 1px #DCEBC2' }}>
              <span style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--bq-good)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={BQ_GLYPH.check} size={20} sw={2.2}></BqIcon></span>
              <div><div style={{ fontWeight: 700, color: 'var(--bq-good)' }}>Signature recorded</div><div style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>A sealed PDF was filed to the vault and both parties were emailed a copy.</div></div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 8 }}>Audit trail</div>
              {[['Signer', 'Dan Henderson'], ['Email', 'dan.henderson@gmail.com'], ['IP address', '73.42.118.6'], ['Timestamp', now], ['Document hash', 'a7f3…be91 (SHA-256)']].map(([k, v], i) => (
                <div key={k} style={{ display: 'flex', gap: 10, padding: '8px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none', fontSize: 13 }}>
                  <span style={{ color: 'var(--bq-faint)', width: 120, flex: 'none' }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
            <button className="bq-btn primary" style={{ alignSelf: 'flex-end' }} onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

function HifiDocuments() {
  const [cat, setCat] = React.useState('All');
  const [sign, setSign] = React.useState(null);
  const awaiting = DOCS.filter((d) => d.status === 'Awaiting signature').length;
  const shown = DOCS.filter((d) => cat === 'All' || d.cat === cat);
  const catIcon = { Contracts: 'docs', Proposals: 'proposal', Permits: 'punch', Plans: 'plan', Insurance: 'warranty', Warranties: 'warranty' };

  return (
    <div className="bq-screen">
      <BqTop crumb="Documents"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Documents" alerts={{ 'Documents': awaiting }}></BqSide>
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div className="bq-display" style={{ fontSize: 22 }}>Documents</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Contracts, permits, plans &amp; insurance - versioned, with built-in e-signature</div>
            </div>
            <button className="bq-btn sm">Templates</button>
            <button className="bq-btn primary sm"><BqIcon d="M12 5 V19 M5 12 H19" size={14}></BqIcon>Upload</button>
          </div>

          <div style={{ display: 'flex', gap: 'calc(12px * var(--bq-sp))', flexWrap: 'wrap' }}>
            <BqKPI label="Documents on file" value={String(DOCS.length)} sub="across all projects"></BqKPI>
            <BqKPI label="Awaiting signature" value={String(awaiting)} sub="contract + change order" tone="ai"></BqKPI>
            <BqKPI label="Expiring / pending" value="2" sub="COI expired · permit pending" tone="warn"></BqKPI>
            <BqKPI label="Templates" value="7" sub="reusable across jobs"></BqKPI>
          </div>

          <div className="bq-ai-card" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 15px' }}>
            <BqSpark size={16}></BqSpark>
            <span style={{ fontSize: 12.5, color: 'var(--bq-ink)' }}>Two documents need the Hendersons' signature - the <b>prime contract</b> and <b>Change Order #4</b>. BuilderIQ can send one combined signing link.</span>
            <button className="bq-btn ai sm" style={{ marginLeft: 'auto' }}>Send signing link</button>
          </div>

          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {DOC_CATS.map((c) => <button key={c} className={'bq-chip' + (cat === c ? ' brand' : '')} onClick={() => setCat(c)} style={{ cursor: 'pointer', border: 'none', font: 'inherit', fontWeight: 600 }}>{c}</button>)}
          </div>

          <div className="bq-card-s" style={{ overflow: 'hidden' }}>
            <div className="bq-trow head" style={{ gridTemplateColumns: '2fr 1fr 1.3fr auto auto' }}>
              <span>Document</span><span>Project</span><span>Status</span><span>Updated</span><span></span>
            </div>
            {shown.map((d, i) => {
              const sgn = d.status === 'Awaiting signature';
              return (
                <div key={i} className="bq-trow" style={{ gridTemplateColumns: '2fr 1fr 1.3fr auto auto', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                    <span style={{ width: 32, height: 32, borderRadius: 9, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-subtle)', color: 'var(--bq-muted)' }}><BqIcon d={BQ_GLYPH[catIcon[d.cat] || 'docs']} size={16}></BqIcon></span>
                    <span style={{ minWidth: 0 }}><span style={{ display: 'block', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.name}</span><span style={{ display: 'block', fontSize: 11, color: 'var(--bq-faint)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{d.cat} · v{d.ver} · {d.who}</span></span>
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--bq-muted)' }}>{d.project}</span>
                  <span><span className={'bq-chip ' + (d.tone === 'bad' ? 'brand' : d.tone)}>{d.status}</span></span>
                  <span style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{d.updated}</span>
                  <span style={{ textAlign: 'right' }}>{sgn ? <button className="bq-btn ai sm" onClick={() => setSign(d)}><BqIcon d={BQ_GLYPH.sign} size={13}></BqIcon>Sign</button> : <button className="bq-btn ghost sm">Open</button>}</span>
                </div>
              );
            })}
          </div>
        </main>
      </div>
      {sign ? <SignatureModal doc={sign} onClose={() => setSign(null)}></SignatureModal> : null}
    </div>
  );
}
window.HifiDocuments = HifiDocuments;
