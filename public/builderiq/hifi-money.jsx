// Hi-fi Budget vs actuals + Change orders - wireframe section 4
function BudgetRow({ code, name, budget, committed, actual, pct, varTxt, over, flag }) {
  return (
    <div className="bq-trow" style={{ gridTemplateColumns: '2fr 0.9fr 0.9fr 0.9fr 1.5fr 1.1fr' }}>
      <span><span style={{ color: 'var(--bq-faint)', marginRight: 8, fontVariantNumeric: 'tabular-nums' }}>{code}</span><span style={{ fontWeight: 600 }}>{name}</span></span>
      <span className="cell-num">{budget}</span>
      <span className="cell-num" style={{ color: 'var(--bq-muted)' }}>{committed}</span>
      <span className="cell-num">{actual}</span>
      <BqMeter pct={pct} tone={over ? 'warn' : ''}></BqMeter>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span className="cell-num" style={{ fontSize: 12.5, fontWeight: 700, color: over ? 'var(--bq-brand-strong)' : 'var(--bq-good)' }}>{varTxt}</span>
        {flag ? <span className="bq-chip ai" style={{ padding: '0 7px' }}><BqSpark size={10}></BqSpark></span> : null}
      </span>
    </div>
  );
}

// ═══ Projects landing: list of open projects, each connected to its client ═══
function HifiProjects({ onOpen }) {
  window.bqUseNewClients && window.bqUseNewClients(); // re-render on store change
  const sample = (typeof BQ_PORT_JOBS !== 'undefined' ? BQ_PORT_JOBS : []).map((j) => ({
    key: j.short, name: j.n, short: j.short, client: j.client, contract: j.contract,
    margin: j.margin, bid: j.bid, pct: j.pct, sched: j.sched, collected: j.collected, sample: true,
  }));
  const customs = (window.bqProj ? window.bqProj.actives() : []).map((x) => ({
    key: x.project.id, id: x.project.id, name: x.client.name + ' - ' + x.project.title, short: window.bqProj.shortName(x.client, x.project), client: x.client.name,
    contract: window.bqProj.total(x.project), margin: 0, bid: 0, pct: window.bqProj.pct(x.project), sched: x.project.stage === 'Closeout' ? 'soon' : 'on',
    collected: window.bqProj.paid(x.project), custom: true, initials: x.client.initials,
  }));
  const rows = customs.length ? customs : bqSample(sample); // sample only as fallback (blank in clean build)
  const schedMap = { on: ['On track', 'good'], behind: ['Behind', 'brand'], risk: ['At risk', 'brand'], soon: ['Wrapping up', 'ai'], ahead: ['Ahead', 'good'] };
  const openProject = (r) => {
    if (r.custom) { window.__bqCustomProject = r.id; window.__bqNav && window.__bqNav('Project Workspace'); return; }
    if (onOpen) { onOpen(r.name); return; }
    try { window.__bqProjectFocus = r.name; } catch (e) {}
    window.__bqNav && window.__bqNav('Projects');
  };
  const fmtk = (n) => '$' + Math.round(n / 1000) + 'k';
  return (
    <div className="bq-screen">
      <BqTop crumb="Projects"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Projects" alerts={{ 'Change Orders': 1 }}></BqSide>
        <main style={{ flex: 1, padding: 'calc(20px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))', overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <span className="bq-display" style={{ fontSize: 22 }}>Projects</span>
            <span style={{ fontSize: 13, color: 'var(--bq-muted)' }}>{rows.length} open · each tied to its client</span>
            <button className="bq-btn primary sm" style={{ marginLeft: 'auto' }} onClick={() => { window.__bqOpenNewClient = true; window.__bqNav && window.__bqNav('Clients'); }}><BqIcon d="M12 5 V19 M5 12 H19" size={14}></BqIcon>New client &amp; project</button>
          </div>
          <section className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 0 4px' }}>
            <div className="bq-trow head" style={{ gridTemplateColumns: '2.2fr 1.8fr 1fr 1.3fr 1fr' }}>
              <span>Project</span><span>Client</span><span>Stage</span><span>Progress</span><span>Collected</span>
            </div>
            {rows.map((r) => {
              const [lbl, tone] = schedMap[r.sched] || ['On track', 'good'];
              return (
                <div key={r.key} className="bq-trow" role="button" tabIndex={0} onClick={() => openProject(r)} onKeyDown={(e) => { if (e.key === 'Enter') openProject(r); }} style={{ gridTemplateColumns: '2.2fr 1.8fr 1fr 1.3fr 1fr', cursor: 'pointer', transition: 'background .12s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bq-subtle)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.short}{r.custom ? <span className="bq-chip ai" style={{ marginLeft: 7 }}>New</span> : null}</div>
                    <div style={{ fontSize: 12, color: 'var(--bq-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fmtk(r.contract)} contract</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); window.__bqNav && window.__bqNav('Clients'); }} style={{ textAlign: 'left', border: 'none', background: 'transparent', font: 'inherit', cursor: 'pointer', padding: 0, minWidth: 0, color: 'var(--bq-ai-strong)', fontWeight: 500, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title="Open client record">{r.client}</button>
                  <span className={'bq-chip ' + tone} style={{ justifySelf: 'start' }}>{lbl}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <BqMeter pct={r.pct} style={{ flex: 1 }}></BqMeter>
                    <span className="cell-num" style={{ fontSize: 12, color: 'var(--bq-faint)', width: 32, flex: 'none' }}>{r.pct}%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="cell-num" style={{ fontSize: 13 }}>{fmtk(r.collected)}</span>
                    <BqIcon d="M9 6 L15 12 L9 18" size={15} style={{ color: 'var(--bq-faint)', flex: 'none' }}></BqIcon>
                  </div>
                </div>
              );
            })}
            {!rows.length ? <BqEmpty icon={BQ_GLYPH.projects} title="No projects yet" sub="Add a client and their first project to see it here - with live progress, collected-to-date, and budget health." actionLabel="Add a client" onAction={() => window.__bqNav && window.__bqNav('Clients')}></BqEmpty> : null}
          </section>
        </main>
      </div>
    </div>
  );
}
window.HifiProjects = HifiProjects;

function HifiBudget() {
  const focus = (() => { try { return window.__bqProjectFocus || null; } catch (e) { return null; } })();
  const [job, setJob] = React.useState(focus);
  React.useEffect(() => { try { window.__bqProjectFocus = null; } catch (e) {} }, []);
  // custom client project name lands here → send to workspace instead of Henderson budget
  React.useEffect(() => {
    if (!job) return;
    const hit = (window.bqProj ? window.bqProj.list() : []).find((x) => job === x.client.name + ' - ' + x.project.title);
    if (hit) { window.__bqCustomProject = hit.project.id; window.__bqNav && window.__bqNav('Project Workspace'); }
  }, [job]);
  if (!job) return <HifiProjects onOpen={setJob}></HifiProjects>;
  return <HifiBudgetDetail jobName={job} onBack={() => setJob(null)}></HifiBudgetDetail>;
}

function HifiBudgetDetail({ jobName, onBack }) {
  const short = (jobName || BQ_JOB.name).split(' - ')[0];
  return (
    <div className="bq-screen">
      <BqTop crumb={'Projects / ' + short + ' / Budget'}></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Projects"></BqSide>
        <main style={{ flex: 1, padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))', overflow: 'auto' }}>
          <button className="bq-btn ghost sm" style={{ alignSelf: 'flex-start' }} onClick={onBack}><BqIcon d="M15 5 L8 12 L15 19" size={15}></BqIcon>All projects</button>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span className="bq-display" style={{ fontSize: 20 }}>{BQ_JOB.name}</span>
            <span className="bq-chip">Build · week 6 of 14</span>
            <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--bq-muted)' }}>Updated 20 min ago from QuickBooks + receipts</span>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            <BqKPI label="Contract + change orders" value="$195,650" sub="$186,400 base + $9,250 approved COs"></BqKPI>
            <BqKPI label="Spent to date" value="$87,940" sub="45% of budget · 43% of schedule"></BqKPI>
            <BqKPI label="Projected margin" value="19.4%" tone="warn" sub="bid at 22.0% - drift −2.6 pts"></BqKPI>
          </div>
          <section className="bq-card-s" style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', overflow: 'visible', paddingTop: 6 }}>
            <div className="bq-trow head" style={{ gridTemplateColumns: '2fr 0.9fr 0.9fr 0.9fr 1.5fr 1.1fr' }}>
              <span>Cost code</span><span>Budget</span><span>Committed</span><span>Actual</span><span>Burn</span><span>Variance</span>
            </div>
            <BudgetRow code="01" name="Demo & disposal" budget="$8,420" committed="-" actual="$9,180" pct={100} varTxt="+$760" over flag></BudgetRow>
            <BudgetRow code="06" name="Cabinetry & install" budget="$42,600" committed="$41,900" actual="$12,400" pct={29} varTxt="on track"></BudgetRow>
            <BudgetRow code="07" name="Countertops" budget="$11,280" committed="$11,960" actual="-" pct={0} varTxt="+$680" over></BudgetRow>
            <BudgetRow code="09" name="Tile & flooring" budget="$13,420" committed="$13,420" actual="$6,100" pct={45} varTxt="−$620"></BudgetRow>
            <BudgetRow code="15" name="Plumbing" budget="$14,860" committed="-" actual="$16,240" pct={100} varTxt="+$1,380" over flag></BudgetRow>
            <BudgetRow code="16" name="Electrical" budget="$9,640" committed="$8,900" actual="$4,300" pct={45} varTxt="on track"></BudgetRow>
            <BudgetRow code="22" name="Paint & finish" budget="$6,180" committed="-" actual="-" pct={0} varTxt="not started"></BudgetRow>
          </section>
        </main>
        <aside className="ai-expanded" style={{ width: 280, flex: 'none', borderLeft: '1px solid var(--bq-border)', background: 'var(--bq-ai-soft)', padding: 'calc(14px * var(--bq-sp)) 16px', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BqSpark></BqSpark>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--bq-ai-strong)' }}>Watchdog read</span>
          </div>
          <div style={{ background: 'var(--bq-raise)', borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 12.5, color: 'var(--bq-ink)', lineHeight: 1.5 }}>The plumbing overrun is <b>labor, not material</b> - rough-in took two extra days re-routing the vent stack. That work wasn't in the bid.</span>
            <button className="bq-btn ai sm" style={{ alignSelf: 'flex-start' }} onClick={() => window.__bqNav && window.__bqNav('Change Orders')}>Draft CO for vent work</button>
          </div>
          <div style={{ background: 'var(--bq-raise)', borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 12.5, color: 'var(--bq-ink)', lineHeight: 1.5 }}><b>$2,150</b> of approved CO work hasn't been invoiced yet.</span>
            <button className="bq-btn ai sm" style={{ alignSelf: 'flex-start' }}>Add to next draw</button>
          </div>
          <div style={{ marginTop: 'auto', fontSize: 11.5, color: 'var(--bq-muted)', lineHeight: 1.45 }}>
            Expenses flow in from receipt photos and your QuickBooks sync - no double entry.
          </div>
        </aside>
        <div className="ai-collapsed" style={{ position: 'absolute', right: 20, bottom: 20 }}>
          <button className="bq-btn ai" style={{ borderRadius: 999, boxShadow: '0 8px 20px rgba(124,58,237,0.35)' }}>
            <BqIcon d={BQ_GLYPH.spark} size={15}></BqIcon>Watchdog · 2
          </button>
        </div>
      </div>
    </div>
  );
}

function COStage({ label, children }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-faint)', paddingBottom: 6, borderBottom: '1px solid var(--bq-border)' }}>{label}</div>
      {children}
    </div>
  );
}

function HifiChangeOrders() {
  // stage: 0 detected → 1 drafted → 2 sent → 3 signed
  const [stage, setStage] = React.useState(0);
  React.useEffect(() => {
    if (stage === 2) {
      const tm = setTimeout(() => setStage(3), 1400);
      return () => clearTimeout(tm);
    }
  }, [stage]);
  return (
    <div className="bq-screen">
      <BqTop crumb="Change Orders / Henderson"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Change Orders" alerts={{ 'Change Orders': 1 }}></BqSide>
        <main style={{ flex: 1, padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', gap: 18, overflow: 'hidden' }}>
          <COStage label="1 · Detected">
            <div className="bq-ai-card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, opacity: stage > 0 ? 0.65 : 1 }}>
              <span className="bq-chip ai" style={{ alignSelf: 'flex-start' }}><BqSpark size={11}></BqSpark>From Tuesday's daily log</span>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: 'var(--bq-ink)', fontStyle: 'italic' }}>
                "…client stopped by, wants the island outlet moved to the side and 2 more recessed cans over the sink"
              </p>
              {stage === 0
                ? <div style={{ display: 'flex', gap: 6 }}>
                    <button className="bq-btn ai sm" onClick={() => setStage(1)}>Looks right - draft CO</button>
                    <button className="bq-btn ghost sm">Not a change</button>
                  </div>
                : <span className="bq-chip good" style={{ alignSelf: 'flex-start' }}>Drafted as CO-03 ✓</span>}
            </div>
            <div className="bq-ai-card" style={{ padding: '12px 16px', opacity: 0.65, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className="bq-chip ai" style={{ alignSelf: 'flex-start' }}><BqSpark size={11}></BqSpark>From client email</span>
              <span style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>"could we also look at a pot filler?" - likely scope add</span>
            </div>
          </COStage>

          <COStage label="2 · Draft - your review">
            {stage === 0 ? (
              <div style={{ border: '1.5px dashed var(--bq-border-strong)', borderRadius: 'var(--bq-r-card)', padding: '22px 16px', textAlign: 'center', fontSize: 12.5, color: 'var(--bq-faint)' }}>
                Accept the detection and the priced draft appears here
              </div>
            ) : (
            <div className="bq-card-s" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>CO-03 · Electrical revisions</span>
                <span className="bq-chip ai"><BqSpark size={11}></BqSpark>AI draft</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="bq-trow" style={{ gridTemplateColumns: '1fr auto', padding: '7px 0' }}><span style={{ fontSize: 13 }}>Relocate island outlet</span><span className="cell-num" style={{ fontWeight: 600 }}>$640</span></div>
                <div className="bq-trow" style={{ gridTemplateColumns: '1fr auto', padding: '7px 0' }}><span style={{ fontSize: 13 }}>2 recessed cans, wired + trimmed</span><span className="cell-num" style={{ fontWeight: 600 }}>$1,200</span></div>
                <div className="bq-trow" style={{ gridTemplateColumns: '1fr auto', padding: '9px 0', background: 'var(--bq-brand-soft)', borderRadius: 10, paddingLeft: 10, paddingRight: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 13.5 }}>Client price</span>
                  <span className="bq-num" style={{ fontSize: 17, color: 'var(--bq-brand-strong)' }}>$1,840</span>
                </div>
              </div>
              <div style={{ fontSize: 12, color: 'var(--bq-muted)' }}>Margin impact <b style={{ color: 'var(--bq-good)' }}>+$430</b> · Schedule +1 day · Prices from your price book</div>
              {stage === 1
                ? <div style={{ display: 'flex', gap: 6 }}>
                    <button className="bq-btn sm">Edit</button>
                    <button className="bq-btn primary sm" onClick={() => setStage(2)}>Send for signature</button>
                  </div>
                : <span className="bq-chip brand" style={{ alignSelf: 'flex-start' }}>{stage === 2 ? 'Sent - waiting for client…' : 'Signed by P. Henderson ✓'}</span>}
            </div>
            )}
          </COStage>

          <COStage label="3 · Signed & absorbed">
            {stage < 3 ? (
              <div style={{ border: '1.5px dashed var(--bq-border-strong)', borderRadius: 'var(--bq-r-card)', padding: '22px 16px', textAlign: 'center', fontSize: 12.5, color: 'var(--bq-faint)' }}>
                {stage === 2 ? 'Waiting for client signature…' : 'Once signed, the budget, schedule, invoice and portal update automatically'}
              </div>
            ) : (
            <div className="bq-card-s" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12 }}>
                <span className="bq-chip">Draft</span>
                <span style={{ color: 'var(--bq-faint)' }}>→</span>
                <span className="bq-chip brand">Sent</span>
                <span style={{ color: 'var(--bq-faint)' }}>→</span>
                <span className="bq-chip good">Approved</span>
              </div>
              <div style={{ fontFamily: 'Caveat, cursive', fontSize: 26, color: '#2b3c8f', transform: 'rotate(-2deg)' }}>P. Henderson</div>
              <div style={{ borderTop: '1px solid var(--bq-border)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 7, fontSize: 12.5, color: 'var(--bq-muted)' }}>
                {['Budget updated (+$1,840 / +$430 margin)', 'Schedule shifted +1 day', 'Added to next invoice draw', 'Client portal timeline updated'].map((t) => (
                  <span key={t} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: 'var(--bq-good)', display: 'flex' }}><BqIcon d={BQ_GLYPH.check} size={12} sw={2.2}></BqIcon></span>{t}
                  </span>
                ))}
              </div>
            </div>
            )}
          </COStage>
        </main>
      </div>
    </div>
  );
}

Object.assign(window, { HifiBudget, HifiChangeOrders });
