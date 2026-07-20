// BuilderIQ Client app - data-driven portal sections for user-created clients.
// The shell (client-app.jsx) swaps these in when "viewing as" a custom client.
// All data reads/writes go through bqProj on the shared client store, so changes
// here appear instantly in the Builder's Project Workspace (and vice versa).

function CcCard({ children, style }) {
  return <div className="bq-card-s" style={{ padding: '16px 17px', ...style }}>{children}</div>;
}
function CcEmpty({ glyph, title, sub }) {
  return (
    <CcCard style={{ textAlign: 'center', padding: '30px 18px' }}>
      <span style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bq-subtle)', color: 'var(--bq-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}><BqIcon d={BQ_GLYPH[glyph]} size={21}></BqIcon></span>
      <div style={{ fontWeight: 700, fontSize: 14.5 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5, marginTop: 4 }}>{sub}</div>
    </CcCard>
  );
}
function ccFmt(n) { return '$' + Math.round(Number(n) || 0).toLocaleString('en-US'); }

// ── Home ──
function CcHome({ c, go }) {
  const p = c.proj;
  const pct = window.bqProj.pct(p);
  const nextMs = p.milestones.find((m) => !m.done);
  const pendingCos = p.cos.filter((x) => x.status === 'sent');
  const dueDraw = p.draws.find((d) => d.status === 'due');
  const lastLog = p.logs.find((l) => l.shared);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <CcCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <div className="bq-display" style={{ fontSize: 20 }}>{c.project}</div>
            <div style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{c.addr || 'Your home'} · {c.stage === 'Closeout' ? 'Wrapping up' : 'In progress'}</div>
          </div>
          <span className="bq-num" style={{ fontSize: 26, fontWeight: 700 }}>{pct}%</span>
        </div>
        <BqMeter pct={pct}></BqMeter>
        {p.milestones.length === 0 ? <div style={{ fontSize: 13, color: 'var(--bq-muted)', marginTop: 9 }}>Schedule coming soon - Hartwell is building your plan.</div> : nextMs ? <div style={{ fontSize: 13, color: 'var(--bq-muted)', marginTop: 9 }}>Up next: <b style={{ color: 'var(--bq-ink)' }}>{nextMs.t}</b> · {nextMs.w}</div> : <div style={{ fontSize: 13, color: 'var(--bq-good)', marginTop: 9, fontWeight: 600 }}>All milestones complete</div>}
      </CcCard>

      {pendingCos.length ? (
        <button onClick={() => go('Decisions')} className="bq-card-s" style={{ textAlign: 'left', border: 'none', cursor: 'pointer', font: 'inherit', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 11, background: 'var(--bq-brand-soft)', boxShadow: 'inset 0 0 0 1px var(--bq-brand-border)' }}>
          <BqIcon d={BQ_GLYPH.select} size={19} style={{ color: 'var(--bq-brand-strong)', flex: 'none' }}></BqIcon>
          <span style={{ flex: 1, fontSize: 13.5 }}><b>{pendingCos.length} decision{pendingCos.length > 1 ? 's' : ''} waiting for you</b> - review and sign when you're ready.</span>
          <BqIcon d="M9 5 L16 12 L9 19" size={15} style={{ color: 'var(--bq-brand-strong)', flex: 'none' }}></BqIcon>
        </button>
      ) : null}

      {dueDraw ? (
        <button onClick={() => go('Money')} className="bq-card-s" style={{ textAlign: 'left', border: 'none', cursor: 'pointer', font: 'inherit', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 11 }}>
          <BqIcon d={BQ_GLYPH.invoice} size={19} style={{ color: 'var(--bq-muted)', flex: 'none' }}></BqIcon>
          <span style={{ flex: 1, fontSize: 13.5 }}><b>{dueDraw.t}</b> - {ccFmt(dueDraw.amount)} is due.</span>
          <span className="bq-chip brand">Pay</span>
        </button>
      ) : null}

      {lastLog ? (
        <CcCard>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 7 }}>Latest from the site · {lastLog.date}</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.55 }}>{lastLog.summary}</div>
          <button className="bq-btn ghost sm" style={{ marginTop: 9 }} onClick={() => go('Updates')}>All updates</button>
        </CcCard>
      ) : (
        <CcEmpty glyph="log" title="Updates coming soon" sub="Your crew shares progress notes here as work happens - usually daily."></CcEmpty>
      )}
    </div>
  );
}

// ── Updates ──
function CcUpdates({ c }) {
  const shared = c.proj.logs.filter((l) => l.shared);
  if (!shared.length) return <CcEmpty glyph="log" title="No updates yet" sub="Progress notes from the crew will appear here as your project moves."></CcEmpty>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {shared.map((l, i) => (
        <CcCard key={i}>
          <div style={{ fontSize: 12, color: 'var(--bq-faint)', marginBottom: 5 }}>{l.date}</div>
          <div style={{ fontSize: 13.5, lineHeight: 1.55 }}>{l.summary}</div>
        </CcCard>
      ))}
    </div>
  );
}

// ── Decisions (pending change orders + finish selections) ──
function CcDecisions({ c, flash }) {
  const p = c.proj;
  const pending = p.cos.filter((x) => x.status === 'sent');
  const decided = p.cos.filter((x) => x.status === 'approved' || x.status === 'declined');
  const sels = p.selections || [];
  const selPending = sels.filter((s) => s.status === 'sent');
  const selDecided = sels.filter((s) => s.status === 'approved');
  const decide = (no, status, price) => {
    window.bqProj.setCo(c.id, no, status);
    window.bqLogEvent && window.bqLogEvent('client', { g: 'co', tone: status === 'approved' ? 'good' : 'muted', body: (status === 'approved' ? 'Approved & signed ' : 'Declined ') + no + ' (' + c.project + ')' + (status === 'approved' ? ' - +' + ccFmt(price) : ''), change: c.name + ' ' + status + ' ' + no });
    flash(status === 'approved' ? no + ' signed - contract updated' : no + ' declined');
  };
  const approveSel = (s) => {
    window.bqProj.setSelection(c.id, s.id, { status: 'approved' });
    window.bqLogEvent && window.bqLogEvent('client', { g: 'select', tone: 'good', body: 'Approved selection: ' + s.item + (s.choice ? ' - ' + s.choice : '') + ' (' + c.project + ')', change: c.name + ' approved ' + s.item });
    flash(s.item + ' approved');
  };
  const nothingPending = !pending.length && !selPending.length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {selPending.map((s) => {
        const over = Number(s.price) - Number(s.allowance);
        return (
          <CcCard key={s.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
              <span style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={BQ_GLYPH.select} size={17}></BqIcon></span>
              <span style={{ fontWeight: 700, fontSize: 14.5, flex: 1 }}>{s.item}{s.room ? <span style={{ fontWeight: 500, color: 'var(--bq-faint)', fontSize: 12.5 }}> · {s.room}</span> : null}</span>
              <span className="bq-chip brand">Needs your OK</span>
            </div>
            {s.choice ? <div style={{ fontSize: 13, color: 'var(--bq-ink)', marginBottom: 4 }}>Selected: <b>{s.choice}</b></div> : null}
            <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5, marginBottom: 10 }}>Allowance <b className="bq-num" style={{ color: 'var(--bq-ink)' }}>{ccFmt(s.allowance)}</b> · selected <b className="bq-num" style={{ color: 'var(--bq-ink)' }}>{ccFmt(s.price)}</b>{over > 0 ? <span style={{ color: 'var(--bq-brand-strong)', fontWeight: 600 }}> · {ccFmt(over)} over allowance</span> : over < 0 ? <span style={{ color: 'var(--bq-good)', fontWeight: 600 }}> · {ccFmt(-over)} under</span> : ' · right at allowance'}. Nothing changes until you approve.</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="bq-btn primary sm" onClick={() => approveSel(s)}>Approve selection</button>
              <button className="bq-btn ghost sm" onClick={() => window.__bqNav2 && window.__bqNav2('Messages')}>Ask a question</button>
            </div>
          </CcCard>
        );
      })}
      {pending.map((x) => (
        <CcCard key={x.no}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 14.5 }}>{x.t}</span>
            <span className="bq-chip brand" style={{ marginLeft: 'auto' }}>{x.no}</span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5, marginBottom: 10 }}>Adds <b className="bq-num" style={{ color: 'var(--bq-ink)' }}>{ccFmt(x.price)}</b> to your contract. Nothing changes until you sign.</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="bq-btn primary sm" onClick={() => decide(x.no, 'approved', x.price)}>Approve &amp; sign</button>
            <button className="bq-btn ghost sm" onClick={() => decide(x.no, 'declined', x.price)}>Decline</button>
          </div>
        </CcCard>
      ))}
      {nothingPending ? <CcEmpty glyph="select" title="Nothing needs a decision" sub="When something needs your sign-off - a change order or a finish selection - it shows up here."></CcEmpty> : null}
      {decided.length || selDecided.length ? (
        <CcCard>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 6 }}>Decided</div>
          {selDecided.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none', fontSize: 13 }}>
              <span style={{ flex: 1 }}>{s.item}{s.choice ? ' · ' + s.choice : ''}</span>
              <span className="bq-chip good">Approved</span>
            </div>
          ))}
          {decided.map((x, i) => (
            <div key={x.no} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '7px 0', borderTop: (i || selDecided.length) ? '1px solid var(--bq-border)' : 'none', fontSize: 13 }}>
              <span style={{ flex: 1 }}>{x.no} · {x.t}</span>
              <span className={'bq-chip ' + (x.status === 'approved' ? 'good' : '')}>{x.status === 'approved' ? 'Approved' : 'Declined'}</span>
            </div>
          ))}
        </CcCard>
      ) : null}
    </div>
  );
}

// ── Money ──
function CcMoney({ c, flash }) {
  const p = c.proj;
  const total = window.bqProj.total(p);
  const paid = window.bqProj.paid(p);
  const pay = (i) => {
    const draws = p.draws.map((x, j) => j === i ? { ...x, status: 'paid' } : x);
    const nxt = draws.findIndex((x) => x.status === 'upcoming');
    if (nxt > -1) draws[nxt] = { ...draws[nxt], status: 'due' };
    window.bqProj.update(c.id, { draws, collected: draws.filter((x) => x.status === 'paid').reduce((s, x) => s + Number(x.amount || 0), 0) });
    window.bqLogEvent && window.bqLogEvent('client', { g: 'invoice', tone: 'good', body: 'Paid ' + p.draws[i].t + ' - ' + ccFmt(p.draws[i].amount) + ' (' + c.project + ')', change: c.name + ' paid a draw' });
    flash('Payment sent - thank you!');
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <CcCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Contract total</span>
          <span className="bq-num" style={{ fontSize: 24 }}>{ccFmt(total)}</span>
        </div>
        {total !== Number(p.contract) ? <div style={{ fontSize: 12, color: 'var(--bq-faint)', marginBottom: 8 }}>Base {ccFmt(p.contract)} + {ccFmt(total - p.contract)} in approved changes &amp; billed materials</div> : <div style={{ fontSize: 12, color: 'var(--bq-faint)', marginBottom: 8 }}>No changes - right at the signed number</div>}
        <BqMeter pct={total ? Math.round(paid / total * 100) : 0}></BqMeter>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--bq-muted)', marginTop: 7 }}>
          <span>Paid <b style={{ color: 'var(--bq-good)' }}>{ccFmt(paid)}</b></span>
          <span>Remaining <b style={{ color: 'var(--bq-ink)' }}>{ccFmt(total - paid)}</b></span>
        </div>
      </CcCard>
      <CcCard>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 6 }}>Payment schedule</div>
        {p.draws.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{d.t}</div>
              <div className="bq-num" style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{ccFmt(d.amount)}</div>
            </div>
            {d.status === 'paid' ? <span className="bq-chip good">Paid</span> : d.status === 'due' ? <button className="bq-btn primary sm" onClick={() => pay(i)}>Pay now</button> : <span className="bq-chip">Upcoming</span>}
          </div>
        ))}
      </CcCard>
      {(p.materials || []).filter((m) => m.billed && m.billable).length ? (
        <CcCard>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 6 }}>Materials &amp; purchases</div>
          {p.materials.filter((m) => m.billed && m.billable).map((m, i) => (
            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{m.item}</div>
                <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{m.vendor ? m.vendor + ' · ' : ''}{m.qty} {m.unit}</div>
              </div>
              <span className="bq-num" style={{ fontSize: 13.5 }}>{ccFmt(window.bqProj.matClient(m))}</span>
            </div>
          ))}
          <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', marginTop: 8, lineHeight: 1.5 }}>Materials your builder purchased for your project, added to your total above.</div>
        </CcCard>
      ) : null}
    </div>
  );
}

// ── Documents ──
function CcDocuments({ c, flash }) {
  const p = c.proj;
  const awaitingSign = p.stage === 'Proposal sent' && !p.propSigned;
  const signProp = () => {
    window.bqProj.update(c.id, { propSigned: true });
    window.bqLogEvent && window.bqLogEvent('client', { g: 'docs', tone: 'good', body: 'Signed the proposal for ' + c.project, change: c.name + ' signed the proposal' });
    flash && flash('Proposal signed - thank you!');
  };
  const propStatus = awaitingSign ? 'Sign now' : (p.stage === 'New lead' || p.stage === 'Estimating') ? 'Draft' : (p.propSigned || p.stage === 'In progress' || p.stage === 'Closeout') ? 'Signed' : 'Accepted';
  const rows = [['Construction agreement', (p.stage === 'In progress' || p.stage === 'Closeout') ? 'Signed' : 'Pending']]
    .concat(c.proj.cos.filter((x) => x.status === 'approved').map((x) => [x.no + ' - ' + x.t, 'Signed']));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {awaitingSign ? (
        <CcCard style={{ background: 'var(--bq-brand-soft)', boxShadow: 'inset 0 0 0 1px var(--bq-brand-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--bq-card)', color: 'var(--bq-brand-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={BQ_GLYPH.docs} size={17}></BqIcon></span>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14.5 }}>Your proposal is ready to sign</div><div style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>Proposal - {c.project} · {ccFmt(window.bqProj.total(p))}</div></div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--bq-ink)', lineHeight: 1.5, marginBottom: 10 }}>Review the scope and total. Signing kicks off your project and unlocks the schedule and payment plan.</div>
          <button className="bq-btn primary sm" onClick={signProp}><BqIcon d={BQ_GLYPH.check} size={13} sw={2.4}></BqIcon>Review &amp; sign</button>
        </CcCard>
      ) : null}
      <CcCard>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 6 }}>Your documents</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0' }}>
          <BqIcon d={BQ_GLYPH.docs} size={17} style={{ color: 'var(--bq-muted)', flex: 'none' }}></BqIcon>
          <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>Proposal - {c.project}</span>
          {awaitingSign ? <button className="bq-btn primary sm" onClick={signProp}>Sign now</button> : <span className="bq-chip good">{propStatus}</span>}
        </div>
        {rows.map(([t, s], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: '1px solid var(--bq-border)' }}>
            <BqIcon d={BQ_GLYPH.docs} size={17} style={{ color: 'var(--bq-muted)', flex: 'none' }}></BqIcon>
            <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{t}</span>
            <span className={'bq-chip ' + (s === 'Signed' ? 'good' : '')}>{s}</span>
          </div>
        ))}
      </CcCard>
    </div>
  );
}

// ── Messages (per-client thread) ──
function CcMessages({ c }) {
  const first = c.name.split(' ')[0];
  const [msgs, setMsgs] = window.bqPersistState('cl-msgs-' + c.id, [
    { from: 'them', who: 'Mike', t: 'Earlier', body: 'Welcome aboard, ' + first + '! This is your direct line to me - questions, concerns, anything. Excited to get started on the ' + (c.project || 'project').toLowerCase() + '.' },
  ]);
  const [text, setText] = React.useState('');
  const endRef = React.useRef(null);
  React.useEffect(() => { if (endRef.current) endRef.current.scrollTop = endRef.current.scrollHeight; }, [msgs]);
  const send = () => {
    const v = text.trim(); if (!v) return;
    setMsgs((m) => [...m, { from: 'me', t: 'Now', body: v }]); setText('');
    window.bqLogEvent && window.bqLogEvent('client', { g: 'inbox', tone: 'ai', body: c.name + ': “' + v + '”', change: 'New message from ' + c.name });
    setTimeout(() => setMsgs((m) => [...m, { from: 'them', who: 'Mike', t: 'Now', body: 'Got it - thanks, ' + first + ". I'll take a look and get back to you here." }]), 1100);
  };
  return (
    <div className="bq-card-s" style={{ display: 'flex', flexDirection: 'column', height: 'min(560px, 70vh)', overflow: 'hidden' }}>
      <div ref={endRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 6px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {msgs.map((m, i) => m.from === 'me' ? (
          <div key={i} style={{ alignSelf: 'flex-end', maxWidth: '84%', padding: '9px 13px', borderRadius: '16px 16px 4px 16px', background: 'var(--bq-brand)', color: '#fff', fontSize: 13.5, lineHeight: 1.45 }}>{m.body}</div>
        ) : (
          <div key={i} style={{ alignSelf: 'flex-start', maxWidth: '88%' }}>
            <div style={{ fontSize: 11, color: 'var(--bq-faint)', margin: '0 0 3px 4px' }}>{m.who} · {m.t}</div>
            <div style={{ padding: '9px 13px', borderRadius: '4px 16px 16px 16px', background: 'var(--bq-subtle)', fontSize: 13.5, lineHeight: 1.5 }}>{m.body}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '10px 12px', borderTop: '1px solid var(--bq-border)' }}>
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} placeholder={'Message Mike…'} style={{ flex: 1, minWidth: 0, border: '1px solid var(--bq-border)', borderRadius: 999, padding: '10px 15px', font: 'inherit', fontSize: 13.5, background: 'var(--bq-raise)', color: 'var(--bq-ink)', outline: 'none' }}></input>
        <button className="bq-btn primary sm" style={{ borderRadius: 999 }} onClick={send} disabled={!text.trim()}>Send</button>
      </div>
    </div>
  );
}

// ── Photos (per-project upload slots the client & crew fill) ──
function CcPhotos({ c }) {
  const rooms = ['Kitchen', 'Bath', 'Living area', 'Exterior'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <CcCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: 14.5, flex: 1 }}>Progress photos</span>
          <span style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{c.project}</span>
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--bq-muted)', lineHeight: 1.5 }}>Photos from the crew land here as work happens. Drop your own too - a reference shot or something you love.</div>
      </CcCard>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
        {rooms.map((r) => (
          <image-slot key={r} id={'cc-photo-' + c.id + '-' + r.toLowerCase().replace(/\s+/g, '-')} style={{ display: 'block', height: 150, borderRadius: 14 }} shape="rounded" radius="14" placeholder={r + ' - drop a photo'}></image-slot>
        ))}
      </div>
    </div>
  );
}

window.ClCustomSections = {
  Home: CcHome, Updates: CcUpdates, Photos: CcPhotos, Decisions: CcDecisions,
  Money: CcMoney, Documents: CcDocuments, Messages: CcMessages,
};
