// BuilderIQ - Project Workspace for user-created projects.
// Runs the whole lifecycle for ONE project (estimate → proposal → active → closeout)
// and makes every detail editable inline, including the Collected amount. A client can
// hold many projects; this screen edits the one addressed by window.__bqCustomProject.
// All reads/writes go through bqProj on the shared store, so the Client portal, Field
// app, and Sub portal see changes instantly.

// ── inline editable value (click to edit; Enter/blur saves) ──
function WsEdit({ value, money, placeholder, onSave, style, big }) {
  const [editing, setEditing] = React.useState(false);
  const [v, setV] = React.useState('');
  const start = () => { setV(money ? String(value == null ? '' : value) : (value || '')); setEditing(true); };
  const commit = () => { const out = money ? (Number(String(v).replace(/[^0-9.]/g, '')) || 0) : v.trim(); onSave(out); setEditing(false); };
  const inp = { border: '1px solid var(--bq-ai)', borderRadius: 8, padding: big ? '4px 8px' : '3px 7px', font: 'inherit', fontSize: big ? 19 : 13.5, fontWeight: big ? 700 : 500, background: 'var(--bq-raise)', color: 'var(--bq-ink)', outline: 'none', width: money ? 130 : 220, maxWidth: '100%' };
  if (editing) return <input autoFocus value={v} onChange={(e) => setV(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }} inputMode={money ? 'numeric' : 'text'} style={inp}></input>;
  const disp = money ? (value != null && value !== '' ? '$' + Number(value).toLocaleString('en-US') : (placeholder || '$0')) : (value || placeholder || '-');
  return (
    <span onClick={start} title="Click to edit" style={{ cursor: 'text', borderBottom: '1px dashed var(--bq-border-strong)', paddingBottom: 1, ...style }}>{disp}</span>
  );
}

function WsSection({ title, right, children }) {
  return (
    <section className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 18px' }}>
      <div className="bq-sechead" style={{ marginBottom: 10 }}>
        <span className="t">{title}</span>
        {right ? <span style={{ marginLeft: 'auto' }}>{right}</span> : null}
      </div>
      {children}
    </section>
  );
}

function WsAdd({ placeholder, cta, onAdd, money }) {
  const [v, setV] = React.useState('');
  const [amt, setAmt] = React.useState('');
  const ok = v.trim() && (!money || Number(String(amt).replace(/[^0-9.]/g, '')));
  const go = () => { if (!ok) return; onAdd(v.trim(), Number(String(amt).replace(/[^0-9.]/g, '')) || 0); setV(''); setAmt(''); };
  const inp = { border: '1px solid var(--bq-border-strong)', borderRadius: 10, padding: '8px 11px', font: 'inherit', fontSize: 13, background: 'var(--bq-raise)', color: 'var(--bq-ink)', outline: 'none' };
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
      <input value={v} onChange={(e) => setV(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') go(); }} placeholder={placeholder} style={{ ...inp, flex: 1, minWidth: 0 }}></input>
      {money ? <input value={amt} onChange={(e) => setAmt(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') go(); }} placeholder="$" inputMode="numeric" style={{ ...inp, width: 90, flex: 'none' }}></input> : null}
      <button className="bq-btn sm" disabled={!ok} style={{ opacity: ok ? 1 : 0.5, flex: 'none' }} onClick={go}>{cta || 'Add'}</button>
    </div>
  );
}

function WsCheck({ done, onClick }) {
  return (
    <button onClick={onClick} aria-label={done ? 'Mark open' : 'Mark done'} style={{ width: 24, height: 24, borderRadius: 8, flex: 'none', border: 'none', cursor: 'pointer', background: done ? 'var(--bq-good)' : 'var(--bq-subtle)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: done ? 'none' : 'inset 0 0 0 1.5px var(--bq-border-strong)' }}>
      {done ? <BqIcon d={BQ_GLYPH.check} size={13} sw={2.6}></BqIcon> : null}
    </button>
  );
}

function WsDel({ onClick }) {
  return <button onClick={onClick} aria-label="Remove" title="Remove" style={{ width: 24, height: 24, borderRadius: 7, flex: 'none', border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--bq-faint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={13} sw={2}></BqIcon></button>;
}

const WS_STAGES = ['New lead', 'Estimating', 'Proposal sent', 'In progress', 'Closeout'];
const WS_STAGE_TONE = { 'New lead': 'ai', 'Estimating': 'ai', 'Proposal sent': 'good', 'In progress': 'brand', 'Starts soon': 'ai', 'Closeout': 'muted' };

function HifiWorkspace() {
  window.bqUseNewClients(); // re-render on store change
  const [pid] = React.useState(() => window.__bqCustomProject);
  const found = pid ? window.bqProj.get(pid) : null;
  const [toast, setToast] = React.useState(null);
  const [delP, setDelP] = React.useState(false);
  const flash = (m) => { setToast(m); clearTimeout(flash._t); flash._t = setTimeout(() => setToast(null), 2400); };

  if (!found) {
    return (
      <div className="bq-screen">
        <BqTop crumb="Project Workspace"></BqTop>
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <BqSide active="Projects"></BqSide>
          <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', maxWidth: 380 }}>
              <div className="bq-display" style={{ fontSize: 20, marginBottom: 8 }}>No project selected</div>
              <div style={{ fontSize: 13.5, color: 'var(--bq-muted)', lineHeight: 1.5, marginBottom: 16 }}>Open a project from the Projects list or a client's record to manage it here.</div>
              <button className="bq-btn primary" onClick={() => window.__bqNav && window.__bqNav('Projects')}>Go to Projects</button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const client = found.client;
  const p = found.project;
  const stageIdx = Math.max(0, WS_STAGES.indexOf(p.stage === 'Starts soon' ? 'In progress' : p.stage));
  const active = p.stage === 'In progress' || p.stage === 'Starts soon' || p.stage === 'Closeout';
  const totalV = window.bqProj.total(p);
  const paidV = window.bqProj.paid(p);
  const pctV = window.bqProj.pct(p);
  const fmt = (n) => '$' + Number(n).toLocaleString('en-US');
  const up = (patch) => window.bqProj.update(p.id, patch);
  const setStage = (stage) => up({ stage, stageTone: WS_STAGE_TONE[stage] || 'ai' });

  // lifecycle actions
  const saveEstimate = (v) => { up({ contract: v, stage: 'Estimating', stageTone: 'ai' }); flash('Estimate saved - ' + fmt(v)); };
  const sendProposal = () => { setStage('Proposal sent'); up({ propSigned: false }); flash('Proposal sent to ' + client.name.split(' ')[0]); };
  const dragRef = React.useRef(null);
  const reorderMs = (from, to) => { if (from == null || to == null || from === to) return; const arr = p.milestones.slice(); const [m] = arr.splice(from, 1); arr.splice(to, 0, m); up({ milestones: arr }); };
  const approve = () => {
    const s = window.bqProj.seed(p.contract);
    up({ stage: 'In progress', stageTone: 'brand', collected: Math.round(p.contract * 0.1), milestones: s.milestones, draws: s.draws });
    flash('Project started - deposit recorded, portal is live');
  };
  const complete = () => { setStage('Closeout'); flash('Moved to closeout'); };
  const est = React.useRef(null);

  return (
    <div className="bq-screen">
      <BqTop crumb={'Clients / ' + client.name + ' / ' + (p.title || 'Project')}></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Projects"></BqSide>
        <main style={{ flex: 1, padding: 'calc(20px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))', overflow: 'auto' }}>

          {/* header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 13, flexWrap: 'wrap' }}>
            <span style={{ width: 46, height: 46, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)', boxShadow: 'inset 0 0 0 1px var(--bq-brand-border)' }}>{client.initials}</span>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span className="bq-display" style={{ fontSize: 21 }}><WsEdit value={p.title} onSave={(v) => up({ title: v, type: v })} placeholder="Project title"></WsEdit></span>
                <BqSelect value={p.stage} options={WS_STAGES} onChange={(v) => setStage(v)} tone={p.stageTone || 'ai'}></BqSelect>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{client.name}{client.addr ? ' · ' + client.addr : ''}</div>
            </div>
            <button className="bq-btn sm" onClick={() => window.__bqNav && window.__bqNav('Clients')}>Client record</button>
            {active ? <span className="bq-chip good"><BqIcon d={BQ_GLYPH.globe} size={11}></BqIcon>Portal live</span> : null}
            {delP ? (
              <span style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--bq-muted)' }}>Delete this project?</span>
                <button className="bq-btn sm" onClick={() => setDelP(false)}>Keep</button>
                <button className="bq-btn primary sm" onClick={() => { window.bqStore.removeProject(p.id); window.__bqNav && window.__bqNav('Clients'); }}>Delete</button>
              </span>
            ) : <button className="bq-btn ghost sm" onClick={() => setDelP(true)}>Delete project</button>}
          </div>

          {/* lifecycle rail */}
          <div className="bq-card-s" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            {WS_STAGES.map((s, i) => (
              <React.Fragment key={s}>
                {i ? <span style={{ width: 18, height: 2, borderRadius: 2, background: i <= stageIdx ? 'var(--bq-brand)' : 'var(--bq-border)', flex: 'none' }}></span> : null}
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: i === stageIdx ? 700 : 500, color: i < stageIdx ? 'var(--bq-good)' : i === stageIdx ? 'var(--bq-ink)' : 'var(--bq-faint)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: i < stageIdx ? 'var(--bq-good)' : i === stageIdx ? 'var(--bq-brand)' : 'var(--bq-border-strong)', flex: 'none' }}></span>{s}
                </span>
              </React.Fragment>
            ))}
          </div>

          {!active ? (
            <div style={{ display: 'flex', gap: 'calc(14px * var(--bq-sp))', flexWrap: 'wrap', alignItems: 'stretch' }}>
              <WsSection title="1 · Estimate">
                {p.stage === 'New lead' || p.stage === 'Estimating' ? (
                  <React.Fragment>
                    <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5, marginBottom: 8 }}>Build it as line items - the total becomes the estimate on this project.</div>
                    {(p.estLines || []).map((ln, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
                        <span style={{ flex: 1, fontSize: 13.5 }}><WsEdit value={ln.t} onSave={(v) => window.bqProj.setEstLine(p.id, i, { t: v })}></WsEdit></span>
                        <span className="bq-num" style={{ fontSize: 13 }}><WsEdit value={ln.cost} money onSave={(v) => window.bqProj.setEstLine(p.id, i, { cost: v })}></WsEdit></span>
                        <WsDel onClick={() => window.bqProj.delEstLine(p.id, i)}></WsDel>
                      </div>
                    ))}
                    <WsAdd placeholder="Line item (e.g. Cabinetry)…" money cta="Add" onAdd={(t, amt) => window.bqProj.addEstLine(p.id, { t: t, cost: amt })}></WsAdd>
                    {(() => {
                      const est = (p.estLines || []).reduce((s, x) => s + (Number(x.cost) || 0), 0);
                      return (
                        <React.Fragment>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--bq-border)' }}>
                            <span style={{ fontSize: 12.5, color: 'var(--bq-muted)', fontWeight: 600 }}>Estimate total</span>
                            <span className="bq-num" style={{ fontSize: 17, marginLeft: 'auto' }}>{fmt(est || Number(p.contract) || 0)}</span>
                          </div>
                          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                            <button className="bq-btn primary sm" disabled={!est} style={{ opacity: est ? 1 : 0.5 }} onClick={() => { if (est > 0) { up({ contract: est, stage: 'Estimating', stageTone: 'ai' }); flash('Estimate saved - ' + fmt(est)); } }}>Save estimate{p.stage === 'New lead' ? ' → move forward' : ''}</button>
                            <button className="bq-btn soft-ai sm" onClick={() => { window.__bqEstimateFor = p.id; window.__bqCustomProject = p.id; window.__bqNav && window.__bqNav('AI Estimate'); }}><BqSpark size={12}></BqSpark>Build in AI Estimate</button>
                          </div>
                          {p.stage === 'Estimating' && !est ? <div style={{ fontSize: 12, color: 'var(--bq-faint)', marginTop: 8 }}>Estimate on file <b className="bq-num">{fmt(Number(p.contract) || 0)}</b> · <WsEdit value={p.contract} money onSave={(v) => up({ contract: v })}></WsEdit> to override</div> : null}
                        </React.Fragment>
                      );
                    })()}
                  </React.Fragment>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span className="bq-chip good"><BqIcon d={BQ_GLYPH.check} size={11} sw={2.4}></BqIcon>Done</span>
                    <span style={{ fontSize: 13.5 }}>Estimate <b className="bq-num"><WsEdit value={p.contract} money onSave={(v) => up({ contract: v })}></WsEdit></b></span>
                  </div>
                )}
              </WsSection>
              <WsSection title="2 · Proposal">
                {p.stage === 'Estimating' ? (
                  <React.Fragment>
                    <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5, marginBottom: 10 }}>Package the estimate into a client-ready proposal with scope, terms, and e-signature.</div>
                    <button className="bq-btn primary sm" onClick={sendProposal}><BqIcon d={BQ_GLYPH.send} size={13}></BqIcon>Send proposal to {client.name.split(' ')[0]}</button>
                  </React.Fragment>
                ) : p.stage === 'Proposal sent' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><span className="bq-chip good"><BqIcon d={BQ_GLYPH.check} size={11} sw={2.4}></BqIcon>Sent</span><span style={{ fontSize: 13.5, color: 'var(--bq-muted)' }}>{p.propSigned ? 'Signed by ' + client.name.split(' ')[0] : 'Awaiting signature'}</span>{p.propSigned ? <span className="bq-chip good" style={{ marginLeft: 'auto' }}>Signed</span> : null}</div>
                    {!p.propSigned ? <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{client.name.split(' ')[0]} can review &amp; sign in their portal. You can also record a signature here.</div> : null}
                    {!p.propSigned ? <button className="bq-btn sm" style={{ alignSelf: 'flex-start' }} onClick={() => { up({ propSigned: true }); flash('Signature recorded'); }}>Record signature</button> : null}
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: 'var(--bq-faint)' }}>Waiting on the estimate.</div>
                )}
              </WsSection>
              <WsSection title="3 · Start the project">
                {p.stage === 'Proposal sent' ? (
                  <React.Fragment>
                    <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5, marginBottom: 10 }}>On approval: deposit is recorded, the schedule + draw plan are created, and the client portal goes live.</div>
                    <button className="bq-btn primary sm" onClick={approve}><BqIcon d={BQ_GLYPH.check} size={13} sw={2.4}></BqIcon>Client approved - start project</button>
                  </React.Fragment>
                ) : (
                  <div style={{ fontSize: 13, color: 'var(--bq-faint)' }}>Unlocks once the proposal is out.</div>
                )}
              </WsSection>
            </div>
          ) : (
            <React.Fragment>
              {/* KPIs - Contract, Collected (editable), Progress, Stage */}
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <div className="bq-card-s bq-kpi" style={{ flex: 1, minWidth: 150 }}><span className="lab">Contract + COs</span><span className="val bq-num">{fmt(totalV)}</span><span className="sub">base <WsEdit value={p.contract} money onSave={(v) => up({ contract: v })}></WsEdit></span></div>
                <div className="bq-card-s bq-kpi" style={{ flex: 1, minWidth: 150 }}>
                  <span className="lab">Collected</span>
                  <span className="val bq-num" style={{ color: 'var(--bq-good)' }}><WsEdit value={paidV} money big onSave={(v) => up({ collected: v })}></WsEdit></span>
                  <span className="sub">{fmt(totalV - paidV)} remaining · click to edit</span>
                </div>
                <div className="bq-card-s bq-kpi" style={{ flex: 1, minWidth: 150 }}>
                  <span className="lab">Progress</span><span className="val bq-num">{pctV}%</span>
                  <BqMeter pct={pctV} style={{ marginTop: 6 }}></BqMeter>
                </div>
                <div className="bq-card-s bq-kpi" style={{ flex: 1, minWidth: 150 }}>
                  <span className="lab">Stage</span><span className="val" style={{ fontSize: 17 }}>{p.stage}</span>
                  {p.stage !== 'Closeout' ? <button className="bq-btn sm" style={{ marginTop: 4 }} disabled={pctV < 100} title={pctV < 100 ? 'Finish the milestones first' : ''} onClick={() => pctV >= 100 && complete()}>Complete project</button> : <span className="sub">Warranty period begins</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 'calc(14px * var(--bq-sp))', alignItems: 'start' }}>
                {/* milestones */}
                <WsSection title="Schedule · milestones" right={p.milestones.length > 1 ? <span style={{ fontSize: 11, color: 'var(--bq-faint)' }}>drag to reorder</span> : null}>
                  {p.milestones.map((m, i) => (
                    <div key={i} draggable onDragStart={() => { dragRef.current = i; }} onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); reorderMs(dragRef.current, i); dragRef.current = null; }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
                      <span title="Drag to reorder" style={{ cursor: 'grab', color: 'var(--bq-faint)', flex: 'none', display: 'flex', touchAction: 'none' }}><BqIcon d="M9 6 h.01 M15 6 h.01 M9 12 h.01 M15 12 h.01 M9 18 h.01 M15 18 h.01" size={15} sw={2.4}></BqIcon></span>
                      <WsCheck done={m.done} onClick={() => up({ milestones: p.milestones.map((x, j) => j === i ? { ...x, done: !x.done } : x) })}></WsCheck>
                      <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: m.done ? 'var(--bq-faint)' : 'var(--bq-ink)' }}><WsEdit value={m.t} onSave={(v) => up({ milestones: p.milestones.map((x, j) => j === i ? { ...x, t: v } : x) })}></WsEdit></span>
                      <span style={{ fontSize: 12, color: 'var(--bq-faint)' }}><WsEdit value={m.w} onSave={(v) => up({ milestones: p.milestones.map((x, j) => j === i ? { ...x, w: v } : x) })}></WsEdit></span>
                      <WsDel onClick={() => up({ milestones: p.milestones.filter((_, j) => j !== i) })}></WsDel>
                    </div>
                  ))}
                  <WsAdd placeholder="Add a milestone…" onAdd={(t) => up({ milestones: [...p.milestones, { t, w: '-', done: false }] })}></WsAdd>
                </WsSection>

                {/* tasks */}
                <WsSection title="Tasks" right={<span style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>Sub-assigned show in the Sub portal</span>}>
                  {p.tasks.length ? p.tasks.map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
                      <WsCheck done={t.done} onClick={() => window.bqProj.toggleTask(p.id, i)}></WsCheck>
                      <span style={{ flex: 1, fontSize: 13.5, color: t.done ? 'var(--bq-faint)' : 'var(--bq-ink)' }}><WsEdit value={t.t} onSave={(v) => up({ tasks: p.tasks.map((x, j) => j === i ? { ...x, t: v } : x) })}></WsEdit></span>
                      {(() => {
                        const vs = window.bqVendors ? window.bqVendors.read() : [];
                        const names = vs.map((x) => x.name);
                        const val = t.sub ? (t.subName || 'Sub') : 'In-house';
                        const opts = ['In-house'].concat(names);
                        if (t.sub && val !== 'In-house' && names.indexOf(val) < 0) opts.push(val);
                        opts.push('+ Add a sub…');
                        return <BqSelect value={val} options={opts} tone={t.sub ? 'ai' : ''} onChange={(v) => {
                          if (v === '+ Add a sub…') { window.__bqNav && window.__bqNav('Subs & Vendors'); return; }
                          up({ tasks: p.tasks.map((x, j) => j === i ? { ...x, sub: v !== 'In-house', subName: v !== 'In-house' ? v : '' } : x) });
                        }}></BqSelect>;
                      })()}
                      <WsDel onClick={() => up({ tasks: p.tasks.filter((_, j) => j !== i) })}></WsDel>
                    </div>
                  )) : <div style={{ fontSize: 13, color: 'var(--bq-faint)', padding: '4px 0' }}>No tasks yet - add the first one.</div>}
                  <WsAdd placeholder="Add a task…" onAdd={(t) => up({ tasks: [...p.tasks, { t, done: false, sub: false }] })}></WsAdd>
                </WsSection>

                {/* change orders */}
                <WsSection title="Change orders" right={<span className="bq-chip">{fmt(totalV - p.contract)} approved</span>}>
                  {p.cos.length ? p.cos.map((x, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{x.no} · <WsEdit value={x.t} onSave={(v) => up({ cos: p.cos.map((y, j) => j === i ? { ...y, t: v } : y) })}></WsEdit></div>
                        <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{x.from === 'field' ? 'Captured in the field · ' : ''}<WsEdit value={x.price} money onSave={(v) => up({ cos: p.cos.map((y, j) => j === i ? { ...y, price: v } : y) })}></WsEdit></div>
                      </div>
                      {x.status === 'sent' ? <span className="bq-chip ai">Awaiting client</span> : x.status === 'approved' ? <span className="bq-chip good">Approved</span> : x.status === 'declined' ? <span className="bq-chip">Declined</span> : (
                        <button className="bq-btn primary sm" onClick={() => { window.bqProj.setCo(p.id, x.no, 'sent'); flash('Sent to ' + client.name.split(' ')[0] + ' for signature'); }}>Send</button>
                      )}
                      <WsDel onClick={() => up({ cos: p.cos.filter((_, j) => j !== i) })}></WsDel>
                    </div>
                  )) : <div style={{ fontSize: 13, color: 'var(--bq-faint)', padding: '4px 0' }}>None yet. Extra work gets drafted here - or captured from the field.</div>}
                  <WsAdd placeholder="Describe the change…" money cta="Draft" onAdd={(t, amt) => up({ cos: [{ no: 'CO-' + (101 + p.cos.length), t, price: amt, status: 'draft' }, ...p.cos] })}></WsAdd>
                </WsSection>

                {/* draws */}
                <WsSection title="Payment schedule">
                  {p.draws.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600 }}><WsEdit value={d.t} onSave={(v) => up({ draws: p.draws.map((y, j) => j === i ? { ...y, t: v } : y) })}></WsEdit></div>
                        <div className="bq-num" style={{ fontSize: 13, color: 'var(--bq-muted)' }}><WsEdit value={d.amount} money onSave={(v) => up({ draws: p.draws.map((y, j) => j === i ? { ...y, amount: v } : y) })}></WsEdit></div>
                      </div>
                      {d.status === 'paid' ? <span className="bq-chip good">Paid</span> : d.status === 'due' ? (
                        <button className="bq-btn primary sm" onClick={() => {
                          const draws = p.draws.map((x, j) => j === i ? { ...x, status: 'paid' } : x);
                          const nxt = draws.findIndex((x) => x.status === 'upcoming');
                          if (nxt > -1) draws[nxt] = { ...draws[nxt], status: 'due' };
                          up({ draws, collected: draws.filter((x) => x.status === 'paid').reduce((s, x) => s + Number(x.amount || 0), 0) });
                          flash('Payment recorded - ' + fmt(d.amount));
                        }}>Record payment</button>
                      ) : <span className="bq-chip">Upcoming</span>}
                    </div>
                  ))}
                  <WsAdd placeholder="Add a draw…" money cta="Add" onAdd={(t, amt) => up({ draws: [...p.draws, { t, amount: amt, status: 'upcoming' }] })}></WsAdd>
                </WsSection>

                {/* materials & purchases */}
                <WsSection title="Materials & purchases" right={<span className="bq-chip">{fmt((p.materials || []).filter((m) => m.billed && m.billable).reduce((s, m) => s + window.bqProj.matClient(m), 0))} billed</span>}>
                  {(p.materials || []).length ? p.materials.map((m) => (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: '1px solid var(--bq-border)' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600 }}><WsEdit value={m.item} onSave={(v) => window.bqProj.setMaterial(p.id, m.id, { item: v })}></WsEdit></div>
                        <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>
                          <WsEdit value={m.vendor} placeholder="vendor" onSave={(v) => window.bqProj.setMaterial(p.id, m.id, { vendor: v })}></WsEdit>
                          {' · '}{m.qty} {m.unit} · cost <WsEdit value={m.cost} money onSave={(v) => window.bqProj.setMaterial(p.id, m.id, { cost: v })}></WsEdit>
                          {m.billable ? <span> · client {fmt(window.bqProj.matClient(m))}</span> : null}
                        </div>
                      </div>
                      <button className={'bq-chip' + (m.billable ? ' ai' : '')} style={{ border: 'none', cursor: 'pointer', font: 'inherit' }} title="Toggle billable to client" onClick={() => window.bqProj.setMaterial(p.id, m.id, { billable: !m.billable })}>{m.billable ? 'Billable' : 'Own cost'}</button>
                      {m.billable ? (m.billed ? <span className="bq-chip good">Billed</span> : <button className="bq-btn primary sm" onClick={() => { window.bqProj.setMaterial(p.id, m.id, { billed: true }); window.bqLogEvent && window.bqLogEvent('client', { g: 'invoice', tone: 'ai', body: client.name + ': ' + m.item + ' billed - ' + fmt(window.bqProj.matClient(m)), change: 'Materials billed to ' + client.name }); flash('Sent to client - ' + fmt(window.bqProj.matClient(m))); }}>Bill client</button>) : <span style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>internal</span>}
                      <WsDel onClick={() => window.bqProj.delMaterial(p.id, m.id)}></WsDel>
                    </div>
                  )) : <div style={{ fontSize: 13, color: 'var(--bq-faint)', padding: '4px 0' }}>No purchases yet - log materials here or snap a receipt from the field.</div>}
                  <WsAdd placeholder="Material or item…" money cta="Log" onAdd={(t, amt) => window.bqProj.addMaterial(p.id, { item: t, cost: amt, vendor: '', qty: 1, unit: 'ea' })}></WsAdd>
                </WsSection>

                {/* selections & allowances */}
                <WsSection title="Selections & allowances" right={<span style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>Client approves in their portal</span>}>
                  {(p.selections || []).length ? p.selections.map((s) => {
                    const over = Number(s.price) - Number(s.allowance);
                    return (
                      <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: '1px solid var(--bq-border)' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13.5, fontWeight: 600, display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}><WsEdit value={s.item} onSave={(v) => window.bqProj.setSelection(p.id, s.id, { item: v })}></WsEdit><span style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--bq-faint)' }}><WsEdit value={s.room} placeholder="room" onSave={(v) => window.bqProj.setSelection(p.id, s.id, { room: v })}></WsEdit></span></div>
                          <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>chose <WsEdit value={s.choice} placeholder="add option" onSave={(v) => window.bqProj.setSelection(p.id, s.id, { choice: v })}></WsEdit> · allowance <WsEdit value={s.allowance} money onSave={(v) => window.bqProj.setSelection(p.id, s.id, { allowance: v })}></WsEdit> · selected <WsEdit value={s.price} money onSave={(v) => window.bqProj.setSelection(p.id, s.id, { price: v })}></WsEdit>{over > 0 ? <span style={{ color: 'var(--bq-brand-strong)', fontWeight: 600 }}> · +{fmt(over)} over</span> : null}</div>
                        </div>
                        {s.status === 'approved' ? <span className="bq-chip good">Approved</span> : s.status === 'sent' ? <button className="bq-btn sm" onClick={() => window.bqProj.setSelection(p.id, s.id, { status: 'approved' })}>Approve</button> : <button className="bq-btn primary sm" onClick={() => { window.bqProj.setSelection(p.id, s.id, { status: 'sent' }); flash('Sent to ' + client.name.split(' ')[0] + ' for approval'); }}>Send</button>}
                        <WsDel onClick={() => window.bqProj.delSelection(p.id, s.id)}></WsDel>
                      </div>
                    );
                  }) : <div style={{ fontSize: 13, color: 'var(--bq-faint)', padding: '4px 0' }}>No selections yet - add finishes and allowances.</div>}
                  <WsAdd placeholder="Selection (e.g. Kitchen faucet)…" money cta="Add" onAdd={(t, amt) => window.bqProj.addSelection(p.id, { item: t, price: amt, allowance: amt, status: 'pending' })}></WsAdd>
                </WsSection>
              </div>

              {/* daily log */}
              <WsSection title="Daily log" right={<span style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>Shared entries appear in the client portal</span>}>
                {p.logs.length ? p.logs.map((l, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
                    <span style={{ fontSize: 12, color: 'var(--bq-faint)', width: 76, flex: 'none', paddingTop: 1 }}>{l.date}</span>
                    <span style={{ flex: 1, fontSize: 13.5, lineHeight: 1.5 }}><WsEdit value={l.summary} onSave={(v) => up({ logs: p.logs.map((y, j) => j === i ? { ...y, summary: v } : y) })}></WsEdit></span>
                    <button className={'bq-chip' + (l.shared ? ' ai' : '')} style={{ border: 'none', cursor: 'pointer', font: 'inherit', alignSelf: 'flex-start' }} onClick={() => up({ logs: p.logs.map((y, j) => j === i ? { ...y, shared: !y.shared } : y) })}>{l.shared ? 'Shared' : 'Internal'}</button>
                  </div>
                )) : <div style={{ fontSize: 13, color: 'var(--bq-faint)', padding: '4px 0' }}>No entries yet - the crew can add them from the Field app too.</div>}
                <WsAdd placeholder="What happened on site today?" cta="Log it" onAdd={(t) => window.bqProj.addLog(p.id, { date: 'Today', summary: t, shared: true })}></WsAdd>
              </WsSection>
            </React.Fragment>
          )}

          {toast ? <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 220, background: 'var(--bq-ink)', color: '#fff', fontSize: 13, fontWeight: 600, padding: '10px 18px', borderRadius: 999, boxShadow: '0 12px 30px rgba(38,35,30,0.35)' }}>{toast}</div> : null}
        </main>
      </div>
    </div>
  );
}
window.HifiWorkspace = HifiWorkspace;
