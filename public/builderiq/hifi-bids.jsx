// Hi-fi Bid Requests (RFQ) - send a scope to multiple subs, collect & compare quotes
const RFQS = [
  {
    trade: 'Electrical', icon: 'leads', project: 'Henderson Kitchen + Bath', due: 'Jun 20', status: 'Bids in', tone: 'ai',
    scope: ['Rough-in & trim for relocated island circuits', 'Add 6 recessed cans in hallway (CO #4)', 'Two 20A GFCI counter circuits', 'Under-cabinet lighting transformer + dimmers'],
    subs: [
      { name: 'Bright Electric', state: 'Quoted', bid: 14800, note: 'Incl. permit & inspection', tone: 'good' },
      { name: 'Volt Pro', state: 'Quoted', bid: 12200, note: 'Excludes patching', tone: 'brand' },
      { name: 'Current Co.', state: 'Viewed', bid: null, note: 'Opened 1h ago', tone: '' },
    ],
  },
  {
    trade: 'Framing', icon: 'hardhat', project: 'Henderson Kitchen + Bath', due: 'Jun 24', status: 'Sent', tone: 'brand',
    scope: ['Remove non-bearing wall btwn kitchen & dining', 'Header & temporary shoring', 'Re-frame hall-bath partition'],
    subs: [
      { name: 'Vargas Framing', state: 'Quoted', bid: 9600, note: 'Incl. LVL header', tone: 'good' },
      { name: 'Sierra Carpentry', state: 'Declined', bid: null, note: 'Booked through Aug', tone: '' },
      { name: 'Oakline Framing', state: 'No response', bid: null, note: 'Sent 2d ago', tone: '' },
    ],
  },
  {
    trade: 'Tile / flooring', icon: 'select', project: 'Henderson Kitchen + Bath', due: 'Jun 28', status: 'Draft', tone: '',
    scope: ['Hall-bath floor + wet-wall tile (≈210 sf)', 'Kitchen backsplash (≈48 sf)', 'Schluter waterproofing'],
    subs: [],
  },
];

function RfqDrawer({ r, onClose }) {
  const fmt = (n) => '$' + n.toLocaleString('en-US');
  const bids = r.subs.filter((s) => s.bid != null).map((s) => s.bid);
  const low = bids.length ? Math.min(...bids) : null;
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(38,35,30,0.35)', display: 'flex', justifyContent: 'flex-end', zIndex: 30 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(460px, 95%)', height: '100%', background: 'var(--bq-card)', boxShadow: '-8px 0 32px rgba(0,0,0,0.12)', padding: '22px 24px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 15 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
          <span style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={BQ_GLYPH[r.icon]} size={20}></BqIcon></span>
          <div style={{ flex: 1 }}>
            <div className="bq-display" style={{ fontSize: 19 }}>{r.trade} RFQ</div>
            <div style={{ fontSize: 12.5, color: 'var(--bq-faint)' }}>{r.project} · due {r.due}</div>
          </div>
          <button onClick={onClose} className="bq-btn ghost sm" style={{ padding: 6 }}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={16}></BqIcon></button>
        </div>

        <div className="bq-ai-card" style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '11px 14px' }}>
          <BqSpark size={15}></BqSpark>
          <span style={{ fontSize: 12, color: 'var(--bq-ink)' }}>Scope auto-drafted from your estimate's <b>{r.trade}</b> section. Review before sending - pricing is the sub's, not BuilderIQ's.</span>
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 8 }}>Scope of work</div>
          {r.scope.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 9, padding: '6px 0', fontSize: 13 }}>
              <BqIcon d={BQ_GLYPH.check} size={15} style={{ color: 'var(--bq-good)', flex: 'none', marginTop: 1 }}></BqIcon><span>{s}</span>
            </div>
          ))}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)' }}>Invited subs ({r.subs.length})</span>
            <button className="bq-btn ghost sm" style={{ marginLeft: 'auto' }}><BqIcon d="M12 5 V19 M5 12 H19" size={13}></BqIcon>Invite more</button>
          </div>
          {r.subs.length ? r.subs.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-subtle)', color: 'var(--bq-muted)' }}><BqIcon d={BQ_GLYPH.hardhat} size={15}></BqIcon></span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 7 }}>{s.name}{s.bid != null && s.bid === low ? <span className="bq-chip good">Low bid</span> : null}</div>
                <div style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>{s.note}</div>
              </div>
              {s.bid != null ? <span className="bq-num" style={{ fontSize: 15 }}>{fmt(s.bid)}</span> : <span className={'bq-chip ' + (s.tone || '')}>{s.state}</span>}
            </div>
          )) : <div style={{ fontSize: 13, color: 'var(--bq-faint)', padding: '8px 0' }}>No subs invited yet - this RFQ is still a draft.</div>}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {r.status === 'Draft'
            ? <button className="bq-btn primary sm">Send to subs</button>
            : <button className="bq-btn primary sm" onClick={() => window.__bqNav && window.__bqNav('Quote Comparison')}>Compare bids</button>}
          {bids.length ? <button className="bq-btn sm" onClick={() => window.__bqNav && window.__bqNav('Quote Comparison')}>Award &amp; convert to budget</button> : null}
          <button className="bq-btn ghost sm">Edit scope</button>
        </div>
      </div>
    </div>
  );
}

function HifiBids() {
  const fmt = (n) => '$' + Number(n || 0).toLocaleString('en-US');
  const [open, setOpen] = React.useState(null);
  const liveBids = window.bqUseBids ? window.bqUseBids() : [];
  const clean = !!(window.bqClean && window.bqClean());
  const rfqs = clean ? [] : RFQS;
  const responded = rfqs.reduce((a, r) => a + r.subs.filter((s) => s.bid != null).length, 0);
  const invited = rfqs.reduce((a, r) => a + r.subs.length, 0);
  const STAT = { submitted: ['Awaiting review', 'ai'], awarded: ['Awarded', 'good'], declined: ['Declined', ''] };

  return (
    <div className="bq-screen">
      <BqTop crumb="Bid Requests"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Bid Requests"></BqSide>
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div className="bq-display" style={{ fontSize: 22 }}>Bid requests</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Send a scope to multiple subs, collect quotes, then award the winner into your budget</div>
            </div>
            <button className="bq-btn primary sm"><BqIcon d="M12 5 V19 M5 12 H19" size={14}></BqIcon>New RFQ</button>
          </div>

          {liveBids.length ? (
            <section className="bq-card-s" style={{ padding: 'calc(12px * var(--bq-sp)) 0 4px' }}>
              <div className="bq-sechead" style={{ padding: '0 18px', marginBottom: 8 }}><span className="t">Bids from your subs</span><span className="bq-chip ai" style={{ marginLeft: 8 }}>{liveBids.filter((b) => b.status === 'submitted').length} awaiting review</span></div>
              {liveBids.map((b) => {
                const s = STAT[b.status] || STAT.submitted;
                return (
                  <div key={b.id} className="bq-trow" style={{ gridTemplateColumns: '1.4fr 2fr 1fr 1.4fr', alignItems: 'center' }}>
                    <div style={{ minWidth: 0 }}><div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.sub}</div><div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{b.project}{b.start ? ' · ' + b.start : ''}</div></div>
                    <span style={{ fontSize: 13, color: 'var(--bq-muted)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.scope}</span>
                    <span className="cell-num">{fmt(b.amount)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                      {b.status === 'submitted' ? (
                        <React.Fragment>
                          <button className="bq-btn primary sm" onClick={() => window.bqBids.update(b.id, { status: 'awarded' })}>Award</button>
                          <button className="bq-btn ghost sm" onClick={() => window.bqBids.update(b.id, { status: 'declined' })}>Decline</button>
                        </React.Fragment>
                      ) : <span className={'bq-chip ' + s[1]}>{s[0]}</span>}
                      <button className="bq-btn ghost sm" aria-label="Remove" onClick={() => window.bqBids.remove(b.id)}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={13}></BqIcon></button>
                    </span>
                  </div>
                );
              })}
            </section>
          ) : null}

          {!rfqs.length && !liveBids.length ? (
            <BqEmpty icon={BQ_GLYPH.bid} title="No bid requests yet" sub="Send a scope to your subs to collect quotes, or they can submit bids from their portal - everything lands here to compare and award." actionLabel="New RFQ" onAction={() => {}}></BqEmpty>
          ) : null}

          {rfqs.length ? (
          <React.Fragment>
          <div style={{ display: 'flex', gap: 'calc(12px * var(--bq-sp))', flexWrap: 'wrap' }}>
            <BqKPI label="Open RFQs" value={String(rfqs.length)} sub="2 sent · 1 draft"></BqKPI>
            <BqKPI label="Subs invited" value={String(invited)} sub="across all trades"></BqKPI>
            <BqKPI label="Quotes received" value={String(responded)} sub="awaiting award" tone="ai"></BqKPI>
            <BqKPI label="Avg turnaround" value="1.8d" sub="invite → quote"></BqKPI>
          </div>

          <div className="bq-ai-card ai-expanded" style={{ display: 'flex', alignItems: 'flex-start', gap: 11, padding: '13px 16px' }}>
            <BqSpark size={17}></BqSpark>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--bq-ai-strong)', marginBottom: 2 }}>Electrical bids are in - Volt Pro is $2,600 lower, but excludes patching</div>
              <div style={{ fontSize: 12.5, color: 'var(--bq-ink)' }}>Bright Electric ({fmt(14800)}) includes permit, inspection &amp; drywall patching. Volt Pro ({fmt(12200)}) excludes patching (~$1,400 of separate work) <b>and</b> their COI is expired. Net, Bright is the safer award.</div>
            </div>
            <button className="bq-btn ai sm" style={{ flex: 'none' }} onClick={() => window.__bqNav && window.__bqNav('Quote Comparison')}>Compare</button>
          </div>
          <div className="bq-ai-card ai-collapsed" style={{ alignItems: 'center', gap: 8, padding: '8px 14px' }}>
            <BqSpark size={14}></BqSpark><span style={{ fontSize: 12.5, color: 'var(--bq-ai-strong)', fontWeight: 600 }}>Electrical bids ready to compare</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(12px * var(--bq-sp))' }}>
            {rfqs.map((r, i) => {
              const bids = r.subs.filter((s) => s.bid != null).map((s) => s.bid);
              const range = bids.length ? (bids.length > 1 ? fmt(Math.min(...bids)) + '–' + fmt(Math.max(...bids)) : fmt(bids[0])) : '-';
              return (
                <div key={i} onClick={() => setOpen(r)} className="bq-card-s" style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ width: 42, height: 42, borderRadius: 12, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-subtle)', color: 'var(--bq-muted)' }}><BqIcon d={BQ_GLYPH[r.icon]} size={19}></BqIcon></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}><span style={{ fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' }}>{r.trade}</span><span className={'bq-chip ' + (r.tone || '')}>{r.status}</span></div>
                    <div style={{ fontSize: 12.5, color: 'var(--bq-faint)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.project} · due {r.due}</div>
                  </div>
                  <div style={{ textAlign: 'center', flex: 'none' }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{r.subs.filter((s) => s.bid != null).length}/{r.subs.length || '-'}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--bq-faint)' }}>quoted</div>
                  </div>
                  <div style={{ textAlign: 'right', flex: 'none', minWidth: 132 }}>
                    <div className="bq-num" style={{ fontSize: 15, whiteSpace: 'nowrap' }}>{range}</div>
                    <div style={{ fontSize: 10.5, color: 'var(--bq-faint)' }}>bid range</div>
                  </div>
                  <BqIcon d="M9 6 L15 12 L9 18" size={16} style={{ color: 'var(--bq-faint)', flex: 'none' }}></BqIcon>
                </div>
              );
            })}
          </div>
          </React.Fragment>
          ) : null}
        </main>
      </div>
      {open ? <RfqDrawer r={open} onClose={() => setOpen(null)}></RfqDrawer> : null}
    </div>
  );
}
window.HifiBids = HifiBids;
