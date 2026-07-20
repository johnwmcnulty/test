// Hi-fi Warranty & Closeout - punch list, final walkthrough sign-off, warranty tracking + claims
const PUNCH = [
  { id: 1, room: 'Kitchen', item: 'Touch up paint at window casing', who: 'Crew', status: 'open', cv: true },
  { id: 2, room: 'Kitchen', item: 'Adjust cabinet door alignment (2 uppers)', who: 'Crew', status: 'open', cv: true },
  { id: 3, room: 'Kitchen', item: 'Replace cracked outlet cover by range', who: 'Bright Electric', status: 'progress', cv: false },
  { id: 4, room: 'Hall Bath', item: 'Re-caulk tub/tile joint', who: 'Crew', status: 'done', cv: true },
  { id: 5, room: 'Hall Bath', item: 'Vanity drawer soft-close sticks', who: 'Crew', status: 'done', cv: false },
  { id: 6, room: 'Whole home', item: 'Final clean + remove floor protection', who: 'Crew', status: 'open', cv: true },
];
const PUNCH_STATUS = { open: ['', 'Open'], progress: ['ai', 'In progress'], done: ['good', 'Done'] };

const WARRANTIES = [
  { item: 'Workmanship (whole project)', provider: 'Hartwell Builders', term: '2 years', ends: 'Jun 2028', status: 'Active' },
  { item: 'Cabinetry', provider: 'Wellborn', term: 'Limited lifetime', ends: '-', status: 'Active' },
  { item: 'Quartz countertops', provider: 'StoneWorks / Cambria', term: 'Lifetime (residential)', ends: '-', status: 'Active' },
  { item: 'Induction range + hood', provider: 'Manufacturer', term: '1 year', ends: 'Jun 2027', status: 'Active' },
  { item: 'Plumbing fixtures', provider: 'Ferguson', term: '5 years', ends: 'Jun 2031', status: 'Active' },
];

function HifiCloseout() {
  const [tab, setTab] = React.useState('punch');
  const [punch, setPunch] = React.useState(PUNCH);
  const [signed, setSigned] = React.useState(false);
  const cycle = (id) => setPunch((ps) => ps.map((p) => p.id === id ? { ...p, status: p.status === 'open' ? 'progress' : p.status === 'progress' ? 'done' : 'open' } : p));
  const openCount = punch.filter((p) => p.status !== 'done').length;
  const TABS = [['punch', 'Punch list'], ['walkthrough', 'Final walkthrough'], ['warranty', 'Warranties'], ['claims', 'Claims']];

  return (
    <div className="bq-screen">
      <BqTop crumb="Projects / Henderson / Closeout"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Closeout" alerts={{ Closeout: openCount }}></BqSide>
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div className="bq-display" style={{ fontSize: 22 }}>Closeout &amp; warranty</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Henderson - Kitchen + Hall Bath · {openCount} punch items left to reach final sign-off</div>
            </div>
            <span className="bq-chip ai">96% complete</span>
          </div>

          {/* closeout progress strip */}
          <div className="bq-card-s" style={{ padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 0, flexWrap: 'wrap' }}>
            {[['Punch list', openCount === 0, openCount + ' open'], ['Final walkthrough', signed, signed ? 'Signed' : 'Pending'], ['Final invoice', false, 'Draw 4 ready'], ['Warranty packet', false, 'Auto-generated'], ['Job closed', false, '-']].map(([label, done, sub], i, arr) => (
              <React.Fragment key={label}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 96 }}>
                  <span style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? 'var(--bq-good)' : 'var(--bq-subtle)', color: done ? '#fff' : 'var(--bq-faint)', boxShadow: done ? 'none' : 'inset 0 0 0 1.5px var(--bq-border-strong)', fontWeight: 700, fontSize: 13 }}>{done ? <BqIcon d={BQ_GLYPH.check} size={15} sw={2.6}></BqIcon> : i + 1}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: done ? 'var(--bq-ink)' : 'var(--bq-muted)', textAlign: 'center', lineHeight: 1.25 }}>{label}</span>
                  <span style={{ fontSize: 10.5, color: 'var(--bq-faint)' }}>{sub}</span>
                </div>
                {i < arr.length - 1 ? <div style={{ flex: 1, height: 2, background: 'var(--bq-border)', minWidth: 20, marginTop: 15 }}></div> : null}
              </React.Fragment>
            ))}
          </div>

          <div className="seg-toggle" style={{ alignSelf: 'flex-start' }}>
            {TABS.map(([k, l]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}
          </div>

          {tab === 'punch' ? (
            <div className="bq-card-s" style={{ overflow: 'hidden' }}>
              <div className="bq-trow head" style={{ gridTemplateColumns: 'auto 1fr auto auto' }}><span></span><span>Item</span><span>Owner</span><span>Status</span></div>
              {punch.map((p) => (
                <div key={p.id} className="bq-trow" style={{ gridTemplateColumns: 'auto 1fr auto auto', alignItems: 'center' }}>
                  <button onClick={() => cycle(p.id)} style={{ width: 22, height: 22, borderRadius: 7, flex: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: p.status === 'done' ? 'var(--bq-good)' : '#fff', boxShadow: p.status === 'done' ? 'none' : 'inset 0 0 0 1.5px var(--bq-border-strong)' }}>{p.status === 'done' ? <BqIcon d={BQ_GLYPH.check} size={12} sw={2.6} style={{ color: '#fff' }}></BqIcon> : null}</button>
                  <span>
                    <span style={{ display: 'block', fontWeight: 500, color: p.status === 'done' ? 'var(--bq-faint)' : 'var(--bq-ink)', textDecoration: p.status === 'done' ? 'line-through' : 'none' }}>{p.item}</span>
                    <span style={{ display: 'block', fontSize: 11.5, color: 'var(--bq-faint)' }}>{p.room}{p.cv ? ' · client-reported' : ''}</span>
                  </span>
                  <span style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{p.who}</span>
                  <span className={'bq-chip ' + PUNCH_STATUS[p.status][0]}>{PUNCH_STATUS[p.status][1]}</span>
                </div>
              ))}
              <div style={{ padding: '12px 16px', display: 'flex', gap: 8 }}>
                <button className="bq-btn sm"><BqIcon d="M12 5 V19 M5 12 H19" size={14}></BqIcon>Add punch item</button>
                <button className="bq-btn soft-ai sm"><BqSpark size={12}></BqSpark>Import from client walkthrough notes</button>
              </div>
            </div>
          ) : tab === 'walkthrough' ? (
            <div style={{ display: 'flex', gap: 'calc(16px * var(--bq-sp))', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div className="bq-card-s" style={{ flex: '1 1 360px', padding: 'calc(16px * var(--bq-sp)) 18px' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Final walkthrough sign-off</div>
                <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5, marginBottom: 14 }}>Walk the completed project with Dan &amp; Priya. When they're satisfied all punch items are resolved, capture their signature to formally accept the work and trigger the final invoice.</div>
                {[['Project', 'Henderson - Kitchen + Hall Bath'], ['Walkthrough date', 'Jun 26, 2026'], ['Open punch items', openCount + (openCount === 1 ? ' item' : ' items')]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderTop: k === 'Project' ? 'none' : '1px solid var(--bq-border)' }}>
                    <span style={{ color: 'var(--bq-faint)' }}>{k}</span><span style={{ fontWeight: 600, color: k === 'Open punch items' && openCount ? 'var(--bq-brand-strong)' : 'var(--bq-ink)' }}>{v}</span>
                  </div>
                ))}
                {openCount ? <div className="bq-ai-card" style={{ marginTop: 12, padding: '10px 13px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: 'inset 0 0 0 1px var(--bq-brand-border)', background: 'var(--bq-brand-soft)' }}><BqIcon d="M12 4 L21 19 H3 Z M12 10 V14" size={15} style={{ color: 'var(--bq-brand-strong)', flex: 'none' }}></BqIcon><span style={{ fontSize: 12, color: 'var(--bq-brand-strong)' }}>Resolve all punch items before sign-off, or note exceptions on the form.</span></div> : null}
              </div>
              <div className="bq-card-s" style={{ flex: '1 1 300px', padding: 'calc(16px * var(--bq-sp)) 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Client acceptance</div>
                <div style={{ height: 110, borderRadius: 12, border: '2px dashed var(--bq-border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: signed ? 'var(--bq-good-soft)' : 'var(--bq-subtle)', position: 'relative' }}>
                  {signed
                    ? <span style={{ fontFamily: 'cursive', fontSize: 30, color: 'var(--bq-ink)', transform: 'rotate(-4deg)' }}>Priya Henderson</span>
                    : <span style={{ fontSize: 12.5, color: 'var(--bq-faint)' }}>Client signs here at walkthrough</span>}
                </div>
                {signed ? <div style={{ fontSize: 11.5, color: 'var(--bq-good)', fontWeight: 600 }}>Signed Jun 26, 2026 · logged to audit trail</div> : null}
                {!signed
                  ? <button className="bq-btn primary" onClick={() => setSigned(true)}>Capture signature</button>
                  : <button className="bq-btn primary" onClick={() => window.__bqNav && window.__bqNav('Invoices')}>Generate final invoice →</button>}
              </div>
            </div>
          ) : tab === 'warranty' ? (
            <React.Fragment>
              <div className="bq-card-s" style={{ overflow: 'hidden' }}>
                <div className="bq-trow head" style={{ gridTemplateColumns: '1.4fr 1fr auto auto' }}><span>Coverage</span><span>Provider</span><span>Term</span><span>Status</span></div>
                {WARRANTIES.map((w, i) => (
                  <div key={i} className="bq-trow" style={{ gridTemplateColumns: '1.4fr 1fr auto auto', alignItems: 'center' }}>
                    <span style={{ fontWeight: 500 }}>{w.item}</span>
                    <span style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{w.provider}</span>
                    <span style={{ fontSize: 12.5 }}>{w.term}{w.ends !== '-' ? ' · until ' + w.ends : ''}</span>
                    <span className="bq-chip good">{w.status}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="bq-btn primary sm"><BqSpark size={13}></BqSpark>Generate warranty packet (PDF)</button>
                <button className="bq-btn sm" onClick={() => window.__bqNav2 && window.__bqNav2('client', 'Portal')}>Publish to client portal</button>
              </div>
            </React.Fragment>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(12px * var(--bq-sp))' }}>
              <div className="bq-card-s" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--bq-ai-soft)', color: 'var(--bq-ai-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={BQ_GLYPH.warranty} size={18}></BqIcon></span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Grout discoloration - hall bath</div>
                  <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>Reported by client · Jul 14, 2026 · within workmanship warranty</div>
                </div>
                <span className="bq-chip ai">Under review</span>
                <button className="bq-btn sm" onClick={() => window.__bqNav && window.__bqNav('Schedule')}>Schedule visit</button>
              </div>
              <div className="bq-card-s" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--bq-good-soft)', color: 'var(--bq-good)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={BQ_GLYPH.check} size={18} sw={2}></BqIcon></span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Cabinet door re-alignment</div>
                  <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>Resolved · Jul 2, 2026 · no charge (workmanship)</div>
                </div>
                <span className="bq-chip good">Closed</span>
              </div>
              <button className="bq-btn sm" style={{ alignSelf: 'flex-start' }}><BqIcon d="M12 5 V19 M5 12 H19" size={14}></BqIcon>Log warranty claim</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
window.HifiCloseout = HifiCloseout;
