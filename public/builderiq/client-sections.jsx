// BuilderIQ Client app - Decisions · Money · Documents (e-sign) · Messages
const clFmt = (n) => '$' + Math.round(n).toLocaleString('en-US');

// ════════ DECISIONS ════════
const CL_FAUCET = [
  { name: 'Brushed nickel - Delta Trinsic', price: 'Within allowance', note: 'Classic, matches your cabinet hardware', tone: '' },
  { name: 'Matte black - Kohler Purist', price: '+ $40', note: "Priya's favorite - bold against the white shaker", tone: 'brand' },
  { name: 'Chrome - Moen Align', price: '− $60 credit', note: 'Budget-friendly and easy to keep clean', tone: 'good' },
];

function ClientDecisions({ go }) {
  const [pick, setPick] = window.bqPersistState('cl-pick', 1);
  const [picked, setPicked] = window.bqPersistState('cl-picked', false);
  const [compare, setCompare] = React.useState(false);
  const [co, setCo] = window.bqPersistState('cl-co4', 'open'); // open | approved | declined

  return (
    <div className="cl-wrap">
      <div>
        <div className="cl-h" style={{ fontSize: 26 }}>Decisions</div>
        <div className="cl-sub" style={{ color: 'var(--bq-muted)' }}>A couple of things need your input to keep the project moving.</div>
      </div>

      {/* selection */}
      <section className="bq-card-s" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={BQ_GLYPH.select} size={19}></BqIcon></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Choose your hall bath faucet</div>
            <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>3 options, all within your allowance · needed by Tuesday</div>
          </div>
          <span className="bq-chip brand">Due Tue</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 12 }}>
          {CL_FAUCET.map((f, i) => {
            const on = pick === i;
            return (
              <button key={i} onClick={() => !picked && setPick(i)} style={{ textAlign: 'left', font: 'inherit', cursor: picked ? 'default' : 'pointer', border: 'none', background: 'var(--bq-card)', borderRadius: 16, padding: '14px 15px', display: 'flex', flexDirection: 'column', gap: 8, boxShadow: on ? '0 0 0 2px var(--bq-brand)' : 'inset 0 0 0 1px var(--bq-border)', opacity: picked && !on ? 0.5 : 1 }}>
                <div className="cl-pad" style={{ height: 96 }}><span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><BqIcon d={BQ_GLYPH.camera} size={13}></BqIcon></span></div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 13.5, flex: 1, lineHeight: 1.3 }}>{f.name}</span>
                  <span style={{ width: 20, height: 20, borderRadius: 7, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'var(--bq-brand)' : 'var(--bq-subtle)', color: '#fff', boxShadow: on ? 'none' : 'inset 0 0 0 1px var(--bq-border-strong)' }}>{on ? <BqIcon d={BQ_GLYPH.check} size={11} sw={2.6}></BqIcon> : null}</span>
                </div>
                <span className={'bq-chip ' + (f.tone || '')} style={{ alignSelf: 'flex-start' }}>{f.price}</span>
                <span style={{ fontSize: 12, color: 'var(--bq-muted)', lineHeight: 1.4 }}>{f.note}</span>
              </button>
            );
          })}
        </div>
        {/* see it in your space + leaning toward */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          <image-slot id="cl-faucet-space" style={{ display: 'block', flex: '1 1 240px', height: 190, borderRadius: 14 }} shape="rounded" radius="14" placeholder={'Drop a photo of the ' + CL_FAUCET[pick].name.split(' - ')[0].toLowerCase() + ' faucet in your hall bath'}></image-slot>
          <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: 9, justifyContent: 'center' }}>
            <div className="cl-eyebrow">You're leaning toward</div>
            <div style={{ fontWeight: 700, fontSize: 17, lineHeight: 1.25 }}>{CL_FAUCET[pick].name}</div>
            <span className={'bq-chip ' + (CL_FAUCET[pick].tone || '')} style={{ alignSelf: 'flex-start' }}>{CL_FAUCET[pick].price}</span>
            <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5 }}>{CL_FAUCET[pick].note}</div>
            <button className="bq-btn ghost sm" style={{ alignSelf: 'flex-start' }} onClick={() => setCompare((c) => !c)}><BqIcon d={BQ_GLYPH.select} size={13}></BqIcon>{compare ? 'Hide comparison' : 'Compare all three'}</button>
          </div>
        </div>
        {compare ? (
          <div className="bq-card-s" style={{ overflow: 'hidden', boxShadow: 'inset 0 0 0 1px var(--bq-border)' }}>
            {CL_FAUCET.map((f, i) => (
              <div key={i} onClick={() => !picked && setPick(i)} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 14px', borderTop: i ? '1px solid var(--bq-border)' : 'none', cursor: picked ? 'default' : 'pointer', background: pick === i ? 'var(--bq-brand-soft)' : 'transparent' }}>
                <span style={{ width: 18, height: 18, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: pick === i ? 'var(--bq-brand)' : 'var(--bq-subtle)', color: '#fff', boxShadow: pick === i ? 'none' : 'inset 0 0 0 1px var(--bq-border-strong)' }}>{pick === i ? <BqIcon d={BQ_GLYPH.check} size={10} sw={2.6}></BqIcon> : null}</span>
                <span style={{ flex: '1 1 130px', fontSize: 13.5, fontWeight: 600, minWidth: 0 }}>{f.name}</span>
                <span style={{ flex: '1 1 140px', fontSize: 12.5, color: 'var(--bq-muted)', minWidth: 0 }}>{f.note}</span>
                <span className={'bq-chip ' + (f.tone || '')} style={{ flex: 'none' }}>{f.price}</span>
              </div>
            ))}
          </div>
        ) : null}
        {!picked ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--bq-muted)' }}>
            <BqIcon d={BQ_GLYPH.cal} size={14} style={{ color: 'var(--bq-brand-strong)', flex: 'none' }}></BqIcon>
            Choosing by <b style={{ color: 'var(--bq-ink)' }}>&nbsp;Tuesday&nbsp;</b> keeps your cabinets on schedule.
          </div>
        ) : null}
        {picked ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bq-good-soft)', borderRadius: 12, padding: '11px 15px', boxShadow: 'inset 0 0 0 1px #DCEBC2' }}>
            <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--bq-good)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={BQ_GLYPH.check} size={15} sw={2.4}></BqIcon></span>
            <span style={{ fontSize: 13.5, color: 'var(--bq-ink)' }}>Sent to Mike - <b>{CL_FAUCET[pick].name.split(' - ')[0]}</b>. He'll order it this week.</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="bq-btn primary" onClick={() => { setPicked(true); window.bqLogEvent && window.bqLogEvent('client', { g: 'select', tone: 'good', body: 'Chose hall-bath faucet - ' + CL_FAUCET[pick].name.split(' - ')[0], change: 'Submitted faucet selection: ' + CL_FAUCET[pick].name.split(' - ')[0] }); }}>Submit my choice</button>
            <button className="bq-btn ghost sm" onClick={() => go('Messages')}>Ask Mike a question</button>
          </div>
        )}
      </section>

      {/* change order approval */}
      <section className="bq-card-s" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--bq-subtle)', color: 'var(--bq-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={BQ_GLYPH.co} size={19}></BqIcon></span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Change Order #4 - Recessed hallway lighting</div>
            <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Requested by you on the June 8 walkthrough</div>
          </div>
          {co === 'approved' ? <span className="bq-chip good">Approved</span> : <span className="bq-chip brand">Needs approval</span>}
        </div>
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: 'var(--bq-ink)' }}>
          Add six recessed LED lights down the hallway on a dimmer, matching the kitchen cans. Includes wiring, patching, and paint touch-up. Adds about <b>one day</b> to the schedule.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <image-slot id="cl-co4-photo" style={{ display: 'block', flex: '0 0 150px', height: 112, borderRadius: 12 }} shape="rounded" radius="12" placeholder="Hallway - where the lights go"></image-slot>
          <div style={{ flex: '1 1 240px', display: 'flex', gap: 10, alignItems: 'flex-start', background: 'var(--bq-ai-soft)', borderRadius: 12, padding: '12px 14px', boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)' }}>
            <span className="cl-avatar" style={{ width: 30, height: 30, fontSize: 11, background: 'var(--bq-ink)', color: '#fff', boxShadow: 'none', flex: 'none' }}>MH</span>
            <div style={{ fontSize: 12.5, color: 'var(--bq-ink)', lineHeight: 1.5 }}><b>Mike:</b> These make the hallway feel a lot bigger at night and match the kitchen perfectly. Totally optional, though - no pressure either way.</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', background: 'var(--bq-subtle)', borderRadius: 12, padding: '12px 16px', fontSize: 13 }}>
          <span style={{ color: 'var(--bq-muted)' }}>Price impact <b className="bq-num" style={{ color: 'var(--bq-ink)', fontSize: 15 }}>+ $1,840</b></span>
          <span style={{ color: 'var(--bq-border-strong)' }}>|</span>
          <span style={{ color: 'var(--bq-muted)' }}>Schedule <b style={{ color: 'var(--bq-ink)' }}>+ 1 day</b></span>
          <span style={{ color: 'var(--bq-border-strong)' }}>|</span>
          <span style={{ color: 'var(--bq-muted)' }}>New contract total <b style={{ color: 'var(--bq-ink)' }}>{clFmt(co === 'approved' ? 197490 : 195650)}</b></span>
        </div>
        {co === 'approved' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--bq-good)', fontWeight: 600 }}>
            <BqIcon d={BQ_GLYPH.check} size={16} sw={2.2}></BqIcon> Approved &amp; signed June 14, 2026 · added to your contract and schedule
          </div>
        ) : co === 'declined' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--bq-muted)', fontWeight: 600 }}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={15} sw={2} style={{ color: 'var(--bq-faint)' }}></BqIcon>Declined · Mike notified - the hallway lighting won't be added and your total is unchanged.</span>
            <button className="bq-btn ghost sm" onClick={() => setCo('open')}>Reconsider</button>
          </div>
        ) : (
          <React.Fragment>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button className="bq-btn primary" onClick={() => { setCo('approved'); window.bqLogEvent && window.bqLogEvent('client', { g: 'co', tone: 'good', body: 'Approved & signed Change Order #4 (recessed hallway lighting)', change: 'Approved Change Order #4 - contract now $197,490' }); }}>Approve &amp; sign</button>
              <button className="bq-btn sm" onClick={() => go('Messages')}>Ask a question</button>
              <button className="bq-btn ghost sm" onClick={() => { setCo('declined'); window.bqLogEvent && window.bqLogEvent('client', { g: 'co', tone: 'muted', body: 'Declined Change Order #4 (recessed hallway lighting)', change: 'Declined Change Order #4' }); }}>Decline</button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--bq-faint)', display: 'flex', alignItems: 'center', gap: 6 }}><BqIcon d="M12 3 a9 9 0 1 0 0 18 a9 9 0 0 0 0-18 Z M12 8 V13 M12 16 h.01" size={13} style={{ flex: 'none' }}></BqIcon>Declining is fine - the hallway stays as-is and nothing changes on your contract or schedule.</div>
          </React.Fragment>
        )}
      </section>

      {/* settled */}
      <div>
        <div className="cl-eyebrow" style={{ marginBottom: 8 }}>Already decided</div>
        <div className="bq-card-s" style={{ overflow: 'hidden' }}>
          {[['Kitchen cabinet style - White shaker', 'Apr 24'], ['Countertop - Calacatta quartz', 'May 2'], ['Backsplash tile - Zellige white', 'May 9'], ['Cabinet hardware - Matte black pulls', 'May 18']].map(([d, when], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 16px', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--bq-good-soft)', color: 'var(--bq-good)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', boxShadow: 'inset 0 0 0 1px #DCEBC2' }}><BqIcon d={BQ_GLYPH.check} size={12} sw={2.4}></BqIcon></span>
              <span style={{ flex: 1, fontSize: 13.5 }}>{d}</span>
              <span style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{when}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ════════ MONEY ════════
function ClAllowances() {
  const ROWS = [
    ['Cabinets', 18000, 18000, 'on'],
    ['Countertops', 9000, 9600, 'over'],
    ['Tile & backsplash', 7500, 6900, 'under'],
    ['Plumbing fixtures', 5200, 5240, 'over'],
    ['Lighting', 3800, 3800, 'on'],
    ['Flooring', 11000, 10400, 'under'],
  ];
  return (
    <section className="bq-card-s" style={{ padding: '20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>Allowances</span>
        <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--bq-muted)' }}>How your selections track against budget</span>
      </div>
      <div style={{ fontSize: 12, color: 'var(--bq-faint)', marginBottom: 14 }}>Net so far <b style={{ color: 'var(--bq-good)' }}>$320 under</b> across all categories</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        {ROWS.map(([name, budget, actual, st]) => {
          const over = st === 'over', under = st === 'under';
          const col = over ? 'var(--bq-brand-strong)' : under ? 'var(--bq-good)' : 'var(--bq-muted)';
          const diff = actual - budget;
          return (
            <div key={name}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 5, fontSize: 13 }}>
                <span style={{ fontWeight: 600 }}>{name}</span>
                <span style={{ marginLeft: 'auto', color: 'var(--bq-faint)' }}>{clFmt(actual)} <span style={{ opacity: 0.7 }}>/ {clFmt(budget)}</span></span>
                <span className="bq-num" style={{ fontWeight: 700, color: col, width: 64, textAlign: 'right' }}>{diff === 0 ? 'On budget' : (diff > 0 ? '+' : '−') + clFmt(Math.abs(diff))}</span>
              </div>
              <div style={{ position: 'relative', height: 7, borderRadius: 999, background: 'var(--bq-subtle)', overflow: 'hidden' }}>
                {(() => { const rowMax = Math.max(budget, actual) * 1.06; return (
                  <React.Fragment>
                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: (actual / rowMax * 100) + '%', borderRadius: 999, background: col }}></div>
                    <div title="Budget" style={{ position: 'absolute', left: (budget / rowMax * 100) + '%', top: 0, width: 2, height: '100%', background: 'var(--bq-ink)', opacity: 0.4 }}></div>
                  </React.Fragment>
                ); })()}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ClPayHistory() {
  const HIST = [
    ['Draw 2 - Rough-in', 'May 28, 2026', 37280, 'rcpt-0003'],
    ['Draw 1 - Demo complete', 'May 9, 2026', 37280, 'rcpt-0002'],
    ['Deposit at signing', 'Apr 18, 2026', 18640, 'rcpt-0001'],
  ];
  return (
    <section className="bq-card-s" style={{ overflow: 'hidden' }}>
      <div style={{ padding: '15px 18px 6px', fontWeight: 700, fontSize: 15 }}>Payment history</div>
      {HIST.map(([label, when, amt, id], i) => (
        <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderTop: '1px solid var(--bq-border)' }}>
          <span style={{ width: 30, height: 30, borderRadius: 9, flex: 'none', background: 'var(--bq-good-soft)', color: 'var(--bq-good)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 1px #DCEBC2' }}><BqIcon d={BQ_GLYPH.check} size={15} sw={2.2}></BqIcon></span>
          <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13.5, fontWeight: 600 }}>{label}</div><div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{when} · {id}</div></div>
          <span className="cell-num" style={{ fontWeight: 600 }}>{clFmt(amt)}</span>
          <button className="bq-btn ghost sm"><BqIcon d={BQ_GLYPH.exports} size={14}></BqIcon>Receipt</button>
        </div>
      ))}
    </section>
  );
}

// ════════ MONEY ════════
function ClientMoney({ go }) {
  const [method, setMethod] = React.useState('ach');
  const [paid, setPaid] = window.bqPersistState('cl-paid-draw3', false);
  const [autopay, setAutopay] = window.bqPersistState('cl-autopay', false);
  const SCHEDULE = [
    ['Deposit (at signing)', 18640, 'Paid', 'good'],
    ['Draw 1 - Demo complete', 37280, 'Paid', 'good'],
    ['Draw 2 - Rough-in', 37280, 'Paid', 'good'],
    ['Draw 3 - Cabinets set', 27960, paid ? 'Paid' : 'Due now', paid ? 'good' : 'brand'],
    ['Draw 4 - Final walkthrough', 65240, 'Upcoming', ''],
  ];
  const collected = SCHEDULE.filter((s) => s[2] === 'Paid').reduce((a, s) => a + s[1], 0);

  return (
    <div className="cl-wrap">
      <div>
        <div className="cl-h" style={{ fontSize: 26 }}>Money</div>
        <div style={{ color: 'var(--bq-muted)' }}>Your payment schedule, statement, and a secure way to pay.</div>
      </div>

      <section className="bq-card-s" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Your project total</span>
          <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--bq-muted)' }}>What it costs, and what's left</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'stretch', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 140px' }}><div style={{ fontSize: 12, color: 'var(--bq-faint)', fontWeight: 600 }}>Original contract</div><div className="bq-num" style={{ fontSize: 20 }}>{clFmt(186400)}</div></div>
          <div style={{ alignSelf: 'center', color: 'var(--bq-faint)', fontSize: 18, fontWeight: 700 }}>+</div>
          <div style={{ flex: '1 1 140px' }}><div style={{ fontSize: 12, color: 'var(--bq-faint)', fontWeight: 600 }}>Approved changes</div><div className="bq-num" style={{ fontSize: 20 }}>+ {clFmt(9250)}</div><div style={{ fontSize: 11, color: 'var(--bq-faint)' }}>3 change orders</div></div>
          <div style={{ alignSelf: 'center', color: 'var(--bq-faint)', fontSize: 18, fontWeight: 700 }}>=</div>
          <div style={{ flex: '1 1 160px', background: 'var(--bq-subtle)', borderRadius: 12, padding: '10px 14px' }}><div style={{ fontSize: 12, color: 'var(--bq-muted)', fontWeight: 600 }}>Current contract price</div><div className="bq-num" style={{ fontSize: 22 }}>{clFmt(195650)}</div></div>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
            <span style={{ color: 'var(--bq-muted)' }}><b className="bq-num" style={{ color: 'var(--bq-good)', fontSize: 15 }}>{clFmt(collected)}</b> paid</span>
            <span style={{ color: 'var(--bq-muted)' }}><b className="bq-num" style={{ color: 'var(--bq-ink)', fontSize: 15 }}>{clFmt(195650 - collected)}</b> remaining</span>
          </div>
          <BqMeter pct={(collected / 195650) * 100} tone=""></BqMeter>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bq-brand-soft)', borderRadius: 12, padding: '11px 15px', boxShadow: 'inset 0 0 0 1px var(--bq-brand-border)' }}>
          <BqIcon d={BQ_GLYPH.invoice} size={17} style={{ color: 'var(--bq-brand-strong)', flex: 'none' }}></BqIcon>
          <span style={{ flex: 1, fontSize: 13, color: 'var(--bq-ink)' }}>Next payment - <b>Draw 3</b> of {clFmt(27960)}, due Jun 22</span>
        </div>
      </section>

      <ClAllowances></ClAllowances>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div className="bq-card-s" style={{ flex: '1 1 360px', overflow: 'hidden' }}>
          <div style={{ padding: '15px 18px 6px', fontWeight: 700, fontSize: 15 }}>Payment schedule</div>
          {SCHEDULE.map(([label, amt, status, tone], i) => (
            <div key={i} className="bq-trow" style={{ gridTemplateColumns: '1fr auto auto', alignItems: 'center' }}>
              <span style={{ fontSize: 13.5 }}>{label}</span>
              <span className="cell-num" style={{ fontWeight: 600 }}>{clFmt(amt)}</span>
              <span className={'bq-chip ' + tone}>{status}</span>
            </div>
          ))}
        </div>

        <div className="bq-card-s" style={{ flex: '1 1 320px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {paid ? (
            <div style={{ textAlign: 'center', padding: '18px 0' }}>
              <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'var(--bq-good-soft)', color: 'var(--bq-good)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><BqIcon d={BQ_GLYPH.check} size={27} sw={2.4}></BqIcon></div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>Payment received</div>
              <div style={{ fontSize: 13.5, color: 'var(--bq-muted)', margin: '4px 0 6px' }}>{clFmt(27960)} · Draw 3 · receipt emailed to you</div>
              <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>Thanks! Mike has been notified.</div>
            </div>
          ) : (
            <React.Fragment>
              <div>
                <div style={{ fontSize: 12.5, color: 'var(--bq-faint)', fontWeight: 600 }}>Amount due now · Draw 3</div>
                <div className="bq-num" style={{ fontSize: 34 }}>{clFmt(27960)}</div>
                <div style={{ fontSize: 12.5, color: 'var(--bq-faint)' }}>Due Jun 22, 2026</div>
              </div>
              <div className="seg-toggle" style={{ width: '100%' }}>
                <button className={method === 'ach' ? 'on' : ''} onClick={() => setMethod('ach')} style={{ flex: 1 }}>Bank (ACH) · free</button>
                <button className={method === 'card' ? 'on' : ''} onClick={() => setMethod('card')} style={{ flex: 1 }}>Card · +2.9%</button>
              </div>
              {method === 'ach' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input placeholder="Routing number" className="cl-field"></input>
                  <input placeholder="Account number" className="cl-field"></input>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input placeholder="Card number" className="cl-field"></input>
                  <div style={{ display: 'flex', gap: 8 }}><input placeholder="MM / YY" className="cl-field"></input><input placeholder="CVC" className="cl-field"></input></div>
                </div>
              )}
              <button onClick={() => { setPaid(true); window.bqLogEvent && window.bqLogEvent('client', { g: 'invoice', tone: 'good', body: 'Paid Draw 3 - ' + clFmt(method === 'card' ? Math.round(27960 * 1.029) : 27960) + ' (' + (method === 'card' ? 'card' : 'ACH') + ')', change: 'Paid Draw 3 (' + clFmt(27960) + ')' }); }} className="bq-btn primary" style={{ width: '100%', padding: 13, fontSize: 15 }}>
                Pay {clFmt(method === 'card' ? Math.round(27960 * 1.029) : 27960)}
              </button>
              <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                <BqIcon d="M7 11 V8 a5 5 0 0 1 10 0 V11 M5 11 H19 V20 H5 Z" size={12}></BqIcon>Secured by Stripe · receipts emailed automatically
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12.5, color: 'var(--bq-muted)', cursor: 'pointer', justifyContent: 'center' }}>
                <input type="checkbox" checked={autopay} onChange={(e) => setAutopay(e.target.checked)} style={{ accentColor: 'var(--bq-brand)' }}></input>
                Turn on autopay for future draws
              </label>
            </React.Fragment>
          )}
        </div>
      </div>

      <ClPayHistory></ClPayHistory>
    </div>
  );
}

// ════════ DOCUMENTS + e-signature ════════
const CL_DOCS = [
  { id: 'co4', name: 'Change Order #4 - Recessed hallway lighting', meta: 'Awaiting your signature', kind: 'sign', tone: 'brand', g: 'co' },
  { id: 'pc', name: 'Prime Contract - Kitchen + Hall Bath', meta: 'Signed Apr 18, 2026', kind: 'signed', tone: 'good', g: 'docs' },
  { id: 'prop', name: 'Proposal - Kitchen + Hall Bath', meta: 'Approved Apr 18, 2026', kind: 'signed', tone: 'good', g: 'proposal' },
  { id: 'co1', name: 'Change Order #1 - 200A service upgrade', meta: 'Signed May 6, 2026', kind: 'signed', tone: 'good', g: 'co' },
  { id: 'co2', name: 'Change Order #2 - Tile upgrade', meta: 'Signed May 28, 2026', kind: 'signed', tone: 'good', g: 'co' },
  { id: 'permit', name: 'Building Permit - 2024-RES-8841', meta: 'Shared by Hartwell Builders', kind: 'file', tone: '', g: 'punch' },
  { id: 'warr', name: 'Workmanship Warranty', meta: 'Shared by Hartwell Builders', kind: 'file', tone: '', g: 'warranty' },
];

function ClSignModal({ doc, onClose, onSigned }) {
  const ref = React.useRef(null);
  const drawing = React.useRef(false);
  const [ink, setInk] = React.useState(false);
  const [mode, setMode] = React.useState('draw');
  const [typed, setTyped] = React.useState('Dan Henderson');
  const [ok, setOk] = React.useState(false);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#1A1813';
  }, [mode]);
  const pos = (e) => { const r = ref.current.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return { x: t.clientX - r.left, y: t.clientY - r.top }; };
  const down = (e) => { e.preventDefault(); drawing.current = true; const ctx = ref.current.getContext('2d'); const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
  const move = (e) => { if (!drawing.current) return; e.preventDefault(); const ctx = ref.current.getContext('2d'); const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); setInk(true); };
  const up = () => { drawing.current = false; };
  const clear = () => { const c = ref.current; c.getContext('2d').clearRect(0, 0, c.width, c.height); setInk(false); };
  const canSign = ok && (mode === 'draw' ? ink : typed.trim().length > 1);

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(38,35,30,0.42)', zIndex: 80, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '5vh' }}>
      <div onClick={(e) => e.stopPropagation()} className="bq-card-s" style={{ width: 'min(540px, 94%)', maxHeight: '90vh', overflow: 'auto', background: 'var(--bq-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 20px', borderBottom: '1px solid var(--bq-border)' }}>
          <span style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={BQ_GLYPH.sign} size={18}></BqIcon></span>
          <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 15 }}>{done ? 'Signed & recorded' : 'Sign document'}</div><div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{doc.name}</div></div>
          <button onClick={onClose} className="bq-btn ghost sm" style={{ padding: 6 }}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={16}></BqIcon></button>
        </div>
        {!done ? (
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 13 }}>
            <div className="cl-pad" style={{ height: 110 }}><span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><BqIcon d={BQ_GLYPH.docs} size={15}></BqIcon>Document preview</span></div>
            <div className="seg-toggle" style={{ alignSelf: 'flex-start' }}>
              <button className={mode === 'draw' ? 'on' : ''} onClick={() => setMode('draw')}>Draw</button>
              <button className={mode === 'type' ? 'on' : ''} onClick={() => setMode('type')}>Type</button>
            </div>
            {mode === 'draw' ? (
              <div>
                <div style={{ position: 'relative', borderRadius: 12, background: '#fff', boxShadow: 'inset 0 0 0 1px var(--bq-border-strong)', overflow: 'hidden' }}>
                  <canvas ref={ref} width={500} height={150} style={{ width: '100%', height: 150, display: 'block', touchAction: 'none', cursor: 'crosshair' }} onMouseDown={down} onMouseMove={move} onMouseUp={up} onMouseLeave={up} onTouchStart={down} onTouchMove={move} onTouchEnd={up}></canvas>
                  <div style={{ position: 'absolute', left: 18, right: 18, bottom: 22, borderBottom: '1.5px solid var(--bq-border-strong)', pointerEvents: 'none' }}></div>
                  {!ink ? <span style={{ position: 'absolute', left: 0, right: 0, top: 56, textAlign: 'center', color: 'var(--bq-faint)', fontSize: 12.5, pointerEvents: 'none' }}>Draw your signature here</span> : null}
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
              <input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} style={{ marginTop: 2, accentColor: 'var(--bq-brand)' }}></input>
              <span>I agree this electronic signature is the legal equivalent of my handwritten signature under the E-SIGN Act.</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button className="bq-btn ghost sm" onClick={onClose}>Cancel</button>
              <button className="bq-btn primary" style={{ marginLeft: 'auto', opacity: canSign ? 1 : 0.5, pointerEvents: canSign ? 'auto' : 'none' }} onClick={() => setDone(true)}>Adopt &amp; sign</button>
            </div>
          </div>
        ) : (
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bq-good-soft)', borderRadius: 14, padding: '14px 16px', boxShadow: 'inset 0 0 0 1px #DCEBC2' }}>
              <span style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--bq-good)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={BQ_GLYPH.check} size={20} sw={2.2}></BqIcon></span>
              <div><div style={{ fontWeight: 700, color: 'var(--bq-good)' }}>Signed &amp; filed</div><div style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>A copy was emailed to you and to Hartwell Builders.</div></div>
            </div>
            <div>
              {[['Signer', 'Dan Henderson'], ['Email', 'dan.henderson@gmail.com'], ['IP address', '73.42.118.6'], ['Timestamp', 'Jun 14, 2026 · 2:41 PM PDT']].map(([k, v], i) => (
                <div key={k} style={{ display: 'flex', gap: 10, padding: '8px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none', fontSize: 13 }}><span style={{ color: 'var(--bq-faint)', width: 110, flex: 'none' }}>{k}</span><span style={{ fontWeight: 500 }}>{v}</span></div>
              ))}
            </div>
            <button className="bq-btn primary" style={{ alignSelf: 'flex-end' }} onClick={() => { onSigned(doc.id); onClose(); }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

function ClientDocuments() {
  const [signed, setSigned] = window.bqPersistState('cl-signed-docs', []);
  const [open, setOpen] = React.useState(null);
  const docs = CL_DOCS.map((d) => signed.includes(d.id) ? { ...d, kind: 'signed', tone: 'good', meta: 'Signed Jun 14, 2026' } : d);
  const awaiting = docs.filter((d) => d.kind === 'sign');

  return (
    <div className="cl-wrap">
      <div>
        <div className="cl-h" style={{ fontSize: 26 }}>Documents</div>
        <div style={{ color: 'var(--bq-muted)' }}>Everything you've signed, plus anything that still needs your signature.</div>
      </div>

      {awaiting.length ? (
        <div className="cl-eyebrow">Awaiting your signature</div>
      ) : null}
      {awaiting.map((d) => (
        <section key={d.id} className="bq-card-s" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 0 0 2px var(--bq-brand)' }}>
          <span style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={BQ_GLYPH[d.g]} size={20}></BqIcon></span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14.5 }}>{d.name}</div>
            <div style={{ fontSize: 12.5, color: 'var(--bq-brand-strong)', fontWeight: 600 }}>{d.meta}</div>
          </div>
          <button className="bq-btn primary sm" onClick={() => setOpen(d)}><BqIcon d={BQ_GLYPH.sign} size={14}></BqIcon>Review &amp; sign</button>
        </section>
      ))}

      <div className="cl-eyebrow" style={{ marginTop: 4 }}>Your documents</div>
      <div className="bq-card-s" style={{ overflow: 'hidden' }}>
        {docs.filter((d) => d.kind !== 'sign').map((d, i) => (
          <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 18px', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--bq-subtle)', color: 'var(--bq-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={BQ_GLYPH[d.g]} size={16}></BqIcon></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{d.name}</div>
              <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{d.meta}</div>
            </div>
            {d.kind === 'signed' ? <span className="bq-chip good">Signed</span> : <span className="bq-chip">Shared</span>}
            <button className="bq-btn ghost sm"><BqIcon d={BQ_GLYPH.exports} size={14}></BqIcon>PDF</button>
          </div>
        ))}
      </div>
      {open ? <ClSignModal doc={open} onClose={() => setOpen(null)} onSigned={(id) => { setSigned((s) => [...s, id]); window.bqLogEvent && window.bqLogEvent('client', { g: 'sign', tone: 'good', body: 'Signed ' + open.name, change: 'Signed ' + open.name }); }}></ClSignModal> : null}
    </div>
  );
}

// ════════ MESSAGES ════════
const CL_THREAD0 = [
  { from: 'them', who: 'Mike', t: 'Wed 9:18 AM', body: "Morning! Quick heads up - cabinets arrive Tuesday and we'll stage them in the garage." },
  { from: 'me', t: 'Wed 9:31 AM', body: "Sounds good. Priya saw a matte black faucet she loves - is it too late to switch?" },
  { from: 'them', who: 'Mike', t: 'Wed 9:40 AM', body: "Not at all - I added it as a choice for you in Decisions. It's a $40 upgrade." },
  { from: 'me', t: 'Wed 9:42 AM', body: "Perfect, approving now. Will the old fridge get hauled away?" },
  { from: 'them', who: 'Mike', t: 'Wed 9:45 AM', body: "Yep - no charge, we'll take it during cabinet week." },
];

function ClientMessages() {
  const [msgs, setMsgs] = window.bqPersistState('cl-msgs', CL_THREAD0);
  const [text, setText] = React.useState('');
  const endRef = React.useRef(null);
  React.useEffect(() => { if (endRef.current) endRef.current.scrollTop = endRef.current.scrollHeight; }, [msgs]);
  const send = () => {
    const v = text.trim(); if (!v) return;
    setMsgs((m) => [...m, { from: 'me', t: 'Now', body: v }]); setText('');
    window.bqLogEvent && window.bqLogEvent('client', { g: 'inbox', tone: 'ai', body: 'Sent a message: “' + v + '”', change: 'New message from the homeowner' });
    setTimeout(() => setMsgs((m) => [...m, { from: 'them', who: 'Mike', t: 'Now', body: "Got it - thanks, Dan. I'll take care of it and update you here." }]), 1100);
  };
  const sendPhoto = () => {
    setMsgs((m) => [...m, { from: 'me', t: 'Now', photo: 'jobsite photo', body: 'Is this the right spot for the outlet?' }]);
    window.bqLogEvent && window.bqLogEvent('client', { g: 'photo', tone: 'ai', body: 'Sent Mike a photo', change: 'Homeowner sent a photo' });
    setTimeout(() => setMsgs((m) => [...m, { from: 'them', who: 'Mike', t: 'Now', body: "Perfect spot - I'll let the electrician know. Thanks for the photo!" }]), 1100);
  };

  return (
    <div className="cl-wrap" style={{ height: '100%', boxSizing: 'border-box' }}>
      <div>
        <div className="cl-h" style={{ fontSize: 26 }}>Messages</div>
        <div style={{ color: 'var(--bq-muted)' }}>Talk to Mike directly - questions, feedback, anything at all.</div>
      </div>
      <div className="bq-card-s" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 380 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '13px 18px', borderBottom: '1px solid var(--bq-border)' }}>
          <span className="cl-avatar" style={{ background: 'var(--bq-ink)', color: '#fff', boxShadow: 'none' }}>MH</span>
          <div><div style={{ fontWeight: 700, fontSize: 14 }}>Mike Hartwell</div><div style={{ fontSize: 12, color: 'var(--bq-good)', fontWeight: 600 }}>● Project lead · usually replies in an hour</div></div>
        </div>
        <div ref={endRef} style={{ flex: 1, overflow: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {msgs.map((m, i) => (
            <div key={i} className={'cl-bubble ' + m.from}>
              {m.photo ? <div className="cl-pad" style={{ height: 120, borderRadius: 10, marginBottom: 8, alignItems: 'center' }}><span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><BqIcon d={BQ_GLYPH.camera} size={14}></BqIcon>{m.photo}</span></div> : null}
              {m.body}
              <div className="meta">{m.from === 'them' ? (m.who + ' · ') : ''}{m.t}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 9, padding: '12px 16px', borderTop: '1px solid var(--bq-border)', alignItems: 'center' }}>
          <button onClick={sendPhoto} aria-label="Attach a photo" className="bq-btn ghost sm" style={{ flex: 'none', padding: 9 }}><BqIcon d={BQ_GLYPH.camera} size={18}></BqIcon></button>
          <input className="cl-field" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} placeholder="Message Mike…"></input>
          <button className="bq-btn primary" onClick={send} style={{ flex: 'none' }}>Send</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { clFmt, ClientDecisions, ClientMoney, ClientDocuments, ClientMessages });
