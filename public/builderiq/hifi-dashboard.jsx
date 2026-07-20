// Hi-fi Dashboard - direction A: money command center
function DashCard({ title, sub, right, children }) {
  return (
    <div className="bq-card-s" style={{ flex: '1 1 300px', minWidth: 0, padding: '16px 18px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14.5 }}>{title}</div>
          {sub ? <div style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>{sub}</div> : null}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}
function DashLegend({ c, label, dash }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--bq-muted)' }}>
      <span style={{ width: 14, height: dash ? 0 : 9, borderRadius: 2, background: dash ? 'none' : c, borderTop: dash ? ('2px dashed ' + c) : 'none', flex: 'none' }}></span>{label}
    </span>
  );
}
// ── grayed-out placeholder scaffold shown on a brand-new (empty) dashboard ──
function DashGBar({ w, h, r, c }) {
  return <span style={{ display: 'block', width: w == null ? '100%' : w, height: h || 10, borderRadius: r == null ? 6 : r, background: c || 'var(--bq-subtle)', flex: 'none' }}></span>;
}
function DashGhostKPI() {
  return (
    <div className="bq-card-s" style={{ flex: 1, minWidth: 150, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 11 }}>
      <DashGBar w={70} h={9}></DashGBar>
      <DashGBar w={104} h={20} r={7}></DashGBar>
      <DashGBar w={86} h={8}></DashGBar>
    </div>
  );
}
function DashGhostRows({ n, widths }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 2 }}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <DashGBar w={64} h={9}></DashGBar>
          <span style={{ flex: 1, height: 9, borderRadius: 999, background: 'var(--bq-subtle)', overflow: 'hidden' }}><span style={{ display: 'block', height: '100%', width: widths[i % widths.length] + '%', borderRadius: 999, background: 'var(--bq-border-strong)' }}></span></span>
        </div>
      ))}
    </div>
  );
}
function DashGhostCard({ rows, widths }) {
  return (
    <div className="bq-card-s" style={{ flex: '1 1 300px', minWidth: 0, padding: '16px 18px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <DashGBar w={124} h={12}></DashGBar>
        <span style={{ flex: 1 }}></span>
        <DashGBar w={44} h={18} r={999}></DashGBar>
      </div>
      <DashGhostRows n={rows} widths={widths}></DashGhostRows>
    </div>
  );
}
function DashGhostTable() {
  return (
    <section className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 0 4px' }}>
      <div className="bq-sechead" style={{ padding: '0 18px', marginBottom: 10 }}><DashGBar w={92} h={12}></DashGBar></div>
      <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column' }}>
        {[68, 52, 60, 46].map((wpct, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderTop: '1px solid var(--bq-border)' }}>
            <div style={{ flex: '2.4 1 0', display: 'flex', flexDirection: 'column', gap: 6 }}><DashGBar w="70%" h={11}></DashGBar><DashGBar w="45%" h={8}></DashGBar></div>
            <DashGBar w={64} h={18} r={999}></DashGBar>
            <DashGBar w={70} h={11}></DashGBar>
            <span style={{ flex: '1.5 1 0', height: 9, borderRadius: 999, background: 'var(--bq-subtle)', overflow: 'hidden' }}><span style={{ display: 'block', height: '100%', width: wpct + '%', borderRadius: 999, background: 'var(--bq-border-strong)' }}></span></span>
            <DashGBar w={20} h={11}></DashGBar>
          </div>
        ))}
      </div>
    </section>
  );
}
function DashPlaceholder() {
  return (
    <div aria-hidden="true" style={{ opacity: 0.5, pointerEvents: 'none', userSelect: 'none', display: 'flex', flexDirection: 'column', gap: 'calc(16px * var(--bq-sp))' }}>
      <div style={{ display: 'flex', gap: 14 }}>{[0, 1, 2, 3].map((i) => <DashGhostKPI key={i}></DashGhostKPI>)}</div>
      <section style={{ display: 'flex', gap: 'calc(14px * var(--bq-sp))', flexWrap: 'wrap', alignItems: 'stretch' }}>
        <DashGhostCard rows={4} widths={[64, 44, 76, 52]}></DashGhostCard>
        <DashGhostCard rows={5} widths={[58, 72, 40, 66, 50]}></DashGhostCard>
        <DashGhostCard rows={4} widths={[80, 60, 42, 30]}></DashGhostCard>
      </section>
      <DashGhostTable></DashGhostTable>
    </div>
  );
}
function DashArea() {
  const acts = window.bqProj ? window.bqProj.actives() : [];
  const money = (n) => '$' + Number(n || 0).toLocaleString('en-US');
  if (acts.length) {
    const collected = acts.reduce((s, x) => s + window.bqProj.paid(x.project), 0);
    const total = acts.reduce((s, x) => s + window.bqProj.total(x.project), 0);
    return (
      <DashCard title="Billings vs collections" sub="This project to date" right={<span className="bq-num" style={{ fontSize: 16, fontWeight: 700 }}>{money(collected)}</span>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 4 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}><span style={{ color: 'var(--bq-muted)' }}>Collected</span><span className="bq-num" style={{ fontWeight: 700, color: 'var(--bq-good)' }}>{money(collected)}</span></div>
            <BqMeter pct={total ? Math.round(collected / total * 100) : 0}></BqMeter>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}><span style={{ color: 'var(--bq-muted)' }}>Contract value</span><span className="bq-num" style={{ fontWeight: 700 }}>{money(total)}</span></div>
            <BqMeter pct={100}></BqMeter>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', marginTop: 2 }}>Month-over-month trends appear as you bill and collect over time.</div>
        </div>
      </DashCard>
    );
  }
  const W = 300, H = 116, max = 480;
  const billed = [318, 286, 352, 408, 392, 448];
  const collected = [292, 270, 324, 356, 402, 374];
  const X = (i) => (i / (billed.length - 1)) * W;
  const Y = (v) => H - (v / max) * (H - 12) - 6;
  const line = (a) => a.map((v, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1)).join(' ');
  return (
    <DashCard title="Billings vs collections" sub="Last 6 months" right={<span className="bq-num" style={{ fontSize: 16, fontWeight: 700 }}>$448k</span>}>
      <svg width="100%" height={116} viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="none" style={{ display: 'block' }}>
        <defs><linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--bq-brand)" stopOpacity="0.26"></stop><stop offset="100%" stopColor="var(--bq-brand)" stopOpacity="0"></stop></linearGradient></defs>
        {[0.25, 0.5, 0.75].map((f) => <line key={f} x1="0" y1={H * f} x2={W} y2={H * f} stroke="var(--bq-border)" strokeWidth="1" vectorEffect="non-scaling-stroke"></line>)}
        <path d={line(billed) + ' L ' + W + ' ' + H + ' L 0 ' + H + ' Z'} fill="url(#dashGrad)"></path>
        <path d={line(billed)} fill="none" stroke="var(--bq-brand)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round"></path>
        <path d={line(collected)} fill="none" stroke="var(--bq-good)" strokeWidth="2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" strokeLinejoin="round"></path>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: 'var(--bq-faint)' }}>{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m) => <span key={m}>{m}</span>)}</div>
      <div style={{ display: 'flex', gap: 16, marginTop: 12 }}><DashLegend c="var(--bq-brand)" label="Billed"></DashLegend><DashLegend c="var(--bq-good)" label="Collected" dash></DashLegend></div>
    </DashCard>
  );
}
function DashMargin() {
  const acts = window.bqProj ? window.bqProj.actives() : [];
  if (acts.length) {
    const avg = Math.round(acts.reduce((s, x) => s + window.bqProj.pct(x.project), 0) / acts.length);
    return (
      <DashCard title="Progress by project" sub="% of milestones complete" right={<span className="bq-chip ai">avg {avg}%</span>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {acts.map((x) => {
            const pc = window.bqProj.pct(x.project);
            return (
              <div key={x.project.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}><span style={{ color: 'var(--bq-ink)', fontWeight: 500 }}>{window.bqProj.shortName(x.client, x.project)}</span><span className="bq-num" style={{ fontWeight: 700, color: 'var(--bq-good)' }}>{pc}%</span></div>
                <BqMeter pct={pc}></BqMeter>
              </div>
            );
          })}
        </div>
      </DashCard>
    );
  }
  const jobs = [['Henderson', 19.4, 22], ['Osorio', 23.5, 24], ['Delgado', 18.6, 22], ['Whitaker', 21.0, 23], ['Tanaka', 25.2, 26], ['Pearson', 28.4, 27]];
  const max = 32;
  return (
    <DashCard title="Margin by project" sub="Current % vs bid" right={<span className="bq-chip ai">avg 22.7%</span>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {jobs.map(([n, m, bid]) => {
          const warn = m < 20;
          return (
            <div key={n}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}><span style={{ color: 'var(--bq-ink)', fontWeight: 500 }}>{n}</span><span className="bq-num" style={{ fontWeight: 700, color: warn ? 'var(--bq-brand-strong)' : 'var(--bq-good)' }}>{m}%</span></div>
              <div style={{ position: 'relative', height: 8, borderRadius: 999, background: 'var(--bq-subtle)' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: (m / max * 100) + '%', borderRadius: 999, background: warn ? 'var(--bq-brand-strong)' : 'var(--bq-good)' }}></div>
                <div title={'Bid ' + bid + '%'} style={{ position: 'absolute', left: (bid / max * 100) + '%', top: -3, width: 2, height: 14, background: 'var(--bq-ink)', opacity: 0.45 }}></div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 13 }}><DashLegend c="var(--bq-good)" label="Current margin"></DashLegend><span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--bq-muted)' }}><span style={{ width: 2, height: 12, background: 'var(--bq-ink)', opacity: 0.45 }}></span>Bid target</span></div>
    </DashCard>
  );
}
function DashFunnel() {
  const allP = window.bqProj ? window.bqProj.list() : [];
  const acts = window.bqProj ? window.bqProj.actives() : [];
  if (acts.length) {
    const money = (n) => '$' + Number(n || 0).toLocaleString('en-US');
    const by = (st) => allP.filter((x) => st.includes(x.project.stage));
    const rows = [
      ['Leads', by(['New lead']), 'var(--bq-muted)'],
      ['Estimating', by(['Estimating']), 'var(--bq-ai)'],
      ['Proposals', by(['Proposal sent']), 'var(--bq-brand)'],
      ['Active', by(['In progress', 'Starts soon']), 'var(--bq-good)'],
    ];
    const max = Math.max(1, ...rows.map((r) => r[1].length));
    return (
      <DashCard title="Pipeline" sub="Your projects by stage" right={<span className="bq-chip good">{allP.length} total</span>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {rows.map(([n, arr, col]) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 72, fontSize: 12.5, color: 'var(--bq-muted)', flex: 'none' }}>{n}</span>
              <div style={{ flex: 1, height: 26, borderRadius: 7, background: 'var(--bq-subtle)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: (arr.length / max * 100) + '%', minWidth: arr.length ? 34 : 0, background: col, borderRadius: 7, display: 'flex', alignItems: 'center', paddingLeft: 9 }}>{arr.length ? <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{arr.length}</span> : null}</div>
              </div>
              <span className="bq-num" style={{ width: 56, textAlign: 'right', fontSize: 12, color: 'var(--bq-faint)', flex: 'none' }}>{money(arr.reduce((s, x) => s + (Number(x.project.contract) || 0), 0))}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', marginTop: 13 }}>{acts.length} active · {by(['New lead', 'Estimating', 'Proposal sent']).length} pre-contract</div>
      </DashCard>
    );
  }
  const stages = [['Leads', 11, '$1.24M', 'var(--bq-muted)'], ['Estimates', 7, '$980k', 'var(--bq-ai)'], ['Proposals', 4, '$612k', 'var(--bq-brand)'], ['Won', 2, '$274k', 'var(--bq-good)']];
  const max = 11;
  return (
    <DashCard title="Pipeline this quarter" sub="Leads → won" right={<span className="bq-chip good">18% win rate</span>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {stages.map(([n, c, val, col]) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 72, fontSize: 12.5, color: 'var(--bq-muted)', flex: 'none' }}>{n}</span>
            <div style={{ flex: 1, height: 26, borderRadius: 7, background: 'var(--bq-subtle)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: (c / max * 100) + '%', minWidth: 34, background: col, borderRadius: 7, display: 'flex', alignItems: 'center', paddingLeft: 9 }}><span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{c}</span></div>
            </div>
            <span className="bq-num" style={{ width: 56, textAlign: 'right', fontSize: 12, color: 'var(--bq-faint)', flex: 'none' }}>{val}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', marginTop: 13 }}>2 of 11 leads won this quarter · 4 proposals still out</div>
    </DashCard>
  );
}
function WatchRow({ icon, txt, sub, action, nav }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 'calc(10px * var(--bq-sp)) 0', borderTop: '1px solid var(--bq-ai-border)' }}>
      <span style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--bq-raise)', boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bq-ai-strong)', flex: 'none' }}>
        <BqIcon d={BQ_GLYPH[icon]} size={15}></BqIcon>
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600 }}>{txt}</div>
        <div style={{ fontSize: 12, color: 'var(--bq-muted)' }}>{sub}</div>
      </div>
      <button className="bq-btn soft-ai sm" onClick={nav ? () => window.__bqNav && window.__bqNav(nav) : undefined}>{action}</button>
      <button className="bq-btn ghost sm">Dismiss</button>
    </div>
  );
}

function DashJobRow({ name, client, stage, amt, margin, est, alerts, projectId, pct }) {
  const warn = margin < 20;
  const open = () => { if (projectId) { window.__bqCustomProject = projectId; window.__bqNav && window.__bqNav('Project Workspace'); return; } try { window.__bqProjectFocus = name; } catch (e) {} window.__bqNav && window.__bqNav('Projects'); };
  const onKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } };
  return (
    <div className="bq-trow" role="button" tabIndex={0} onClick={open} onKeyDown={onKey} title={'Open ' + name} style={{ gridTemplateColumns: '2.4fr 1.1fr 1fr 1.5fr 0.9fr', cursor: 'pointer', transition: 'background .12s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bq-subtle)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
      <div>
        <div style={{ fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{client}</div>
      </div>
      <span className="bq-chip" style={{ justifySelf: 'start' }}>{stage}</span>
      <span className="cell-num" style={{ fontWeight: 600 }}>{amt}</span>
      {projectId ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BqMeter pct={pct || 0} style={{ flex: 1 }}></BqMeter>
          <span className="cell-num" style={{ fontSize: 12.5, color: 'var(--bq-faint)', width: 70 }}>{pct || 0}% done</span>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BqMeter pct={margin * 3.2} tone={warn ? 'warn' : ''} style={{ flex: 1 }}></BqMeter>
          <span className="cell-num" style={{ fontSize: 12.5, fontWeight: 700, color: warn ? 'var(--bq-brand-strong)' : 'var(--bq-good)', width: 70 }}>{margin}% <span style={{ color: 'var(--bq-faint)', fontWeight: 500 }}>/ {est}%</span></span>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
        {alerts ? <span className="bq-chip ai" style={{ justifySelf: 'start' }}><BqSpark size={11}></BqSpark>{alerts}</span> : <span style={{ color: 'var(--bq-faint)', fontSize: 12.5 }}>-</span>}
        <BqIcon d="M9 6 L15 12 L9 18" size={15} style={{ color: 'var(--bq-faint)', flex: 'none' }}></BqIcon>
      </div>
    </div>
  );
}

function HifiDashboard() {
  const prof = useBqProfile();
  window.bqUseNewClients && window.bqUseNewClients();
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const acts = window.bqProj ? window.bqProj.actives() : [];
  const allP = window.bqProj ? window.bqProj.list() : [];
  const hasReal = acts.length > 0;
  const money = (n) => '$' + Number(n || 0).toLocaleString('en-US');
  const totalProd = acts.reduce((s, x) => s + window.bqProj.total(x.project), 0);
  const collected = acts.reduce((s, x) => s + window.bqProj.paid(x.project), 0);
  const unpaid = totalProd - collected;
  const pipe = allP.filter((x) => ['New lead', 'Estimating', 'Proposal sent'].includes(x.project.stage));
  const pipeVal = pipe.reduce((s, x) => s + (Number(x.project.contract) || 0), 0);
  const prodTxt = totalProd >= 1e6 ? '$' + (totalProd / 1e6).toFixed(2) + 'M' : money(totalProd);
  if (window.bqClean() && !hasReal) {
    return (
      <div className="bq-screen">
        <BqTop crumb="Dashboard" right={<button className="bq-btn primary sm" onClick={() => window.__bqNav && window.__bqNav('Clients')}>+ New lead</button>}></BqTop>
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <BqSide active="Dashboard" alerts={{}}></BqSide>
          <main style={{ flex: 1, padding: 'calc(20px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(16px * var(--bq-sp))', overflow: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span className="bq-display" style={{ fontSize: 22 }}>{greet}{prof.first ? ', ' + prof.first : ''}</span>
              <span style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Your command center</span>
            </div>
            <div className="bq-ai-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ width: 40, height: 40, borderRadius: 12, flex: 'none', background: 'var(--bq-ai-soft)', color: 'var(--bq-ai-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)' }}><BqIcon d={BQ_GLYPH.spark} size={20}></BqIcon></span>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>Your dashboard fills in as you work</div>
                <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5 }}>Add your first client and project - these cards, your pipeline, schedule, and money views all populate automatically.</div>
              </div>
              <button className="bq-btn primary sm" onClick={() => window.__bqNav && window.__bqNav('Clients')} style={{ flex: 'none' }}><BqIcon d="M12 5 V19 M5 12 H19" size={13}></BqIcon>Add your first client</button>
            </div>
            <DashPlaceholder></DashPlaceholder>
          </main>
        </div>
      </div>
    );
  }
  return (
    <div className="bq-screen">
      <BqTop crumb="Dashboard" right={<button className="bq-btn primary sm" onClick={() => window.__bqNav && window.__bqNav('Clients')}>+ New lead</button>}></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Dashboard" alerts={{}}></BqSide>
        <main style={{ flex: 1, padding: 'calc(20px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(16px * var(--bq-sp))', overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span className="bq-display" style={{ fontSize: 22 }}>{greet}, {prof.first}</span>
            <span style={{ fontSize: 13, color: 'var(--bq-muted)' }}>{today + ' · ' + (hasReal ? acts.length + ' active job' + (acts.length !== 1 ? 's' : '') + ' · ' + prodTxt + ' in production' : '9 active jobs · 4 crews out today · $2.1M in production')}</span>
          </div>

          {hasReal ? (
            <div style={{ display: 'flex', gap: 14 }}>
              <BqKPI label="Collected to date" value={money(collected)} sub={'of ' + money(totalProd) + ' contract'}></BqKPI>
              <BqKPI label="Outstanding" value={money(unpaid)} tone={unpaid > 0 ? 'warn' : 'good'} sub={unpaid > 0 ? 'to bill / collect' : 'all collected'}></BqKPI>
              <BqKPI label="Pipeline" value={money(pipeVal)} sub={pipe.length + ' project' + (pipe.length !== 1 ? 's' : '') + ' pre-contract'}></BqKPI>
              <BqKPI label="Active projects" value={String(acts.length)} sub="in production"></BqKPI>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 14 }}>
              <BqKPI label="Cash position" value="$486,200" sub="across operating + escrow"></BqKPI>
              <BqKPI label="Margin at risk" value="$21,840" tone="warn" sub="3 jobs drifting - see Watchdog"></BqKPI>
              <BqKPI label="Pipeline" value="$1.24M" sub="11 open leads · 4 proposals out"></BqKPI>
              <BqKPI label="Unpaid invoices" value="$112,600" sub="oldest 18 days · Alvarez draw 3"></BqKPI>
            </div>
          )}

          <HifiDailyBrief></HifiDailyBrief>

          <BqActionQueue compact limit={4}></BqActionQueue>

          <section style={{ display: 'flex', gap: 'calc(14px * var(--bq-sp))', flexWrap: 'wrap', alignItems: 'stretch' }}>
            <DashArea></DashArea>
            <DashMargin></DashMargin>
            <DashFunnel></DashFunnel>
          </section>

          <section className="bq-card-s" style={{ flex: '1 0 auto', padding: 'calc(14px * var(--bq-sp)) 0 0', display: 'flex', flexDirection: 'column', overflow: 'visible' }}>
            <div className="bq-sechead" style={{ padding: '0 18px', marginBottom: 8 }}>
              <span className="t">Active jobs</span>
              <span className="a" style={{ cursor: 'pointer' }} onClick={() => window.__bqNav && window.__bqNav('Projects')}>All projects →</span>
            </div>
            <div className="bq-trow head" style={{ gridTemplateColumns: '2.4fr 1.1fr 1fr 1.5fr 0.9fr' }}>
              <span>Job</span><span>Stage</span><span>Contract</span><span>Margin · current / bid</span><span>Alerts</span>
            </div>
            <div>
            {(() => {
              const acts = window.bqProj ? window.bqProj.actives() : [];
              if (!acts.length) return (<React.Fragment>
            <DashJobRow name="Henderson - Kitchen + Hall Bath" client="Dan & Priya Henderson" stage="Build · wk 6 of 14" amt="$186,400" margin={19.4} est={22} alerts="2"></DashJobRow>
            <DashJobRow name="Osorio - Whole-home remodel" client="Luis & Carmen Osorio" stage="Build · wk 3 of 22" amt="$410,500" margin={23.5} est={24}></DashJobRow>
            <DashJobRow name="Delgado - Garage ADU" client="Rafael Delgado" stage="Rough-in" amt="$164,900" margin={18.6} est={22} alerts="1"></DashJobRow>
            <DashJobRow name="Whitaker - Kitchen + butler's pantry" client="Joan Whitaker" stage="Cabinets" amt="$128,400" margin={21.0} est={23}></DashJobRow>
            <DashJobRow name="Alvarez - Basement finish" client="Marisol Alvarez" stage="Build · wk 11 of 12" amt="$92,700" margin={24.1} est={24} alerts="1"></DashJobRow>
            <DashJobRow name="Tanaka - Primary suite addition" client="Grace Tanaka" stage="Framing" amt="$242,000" margin={25.2} est={26}></DashJobRow>
            <DashJobRow name="Chen - Primary bath" client="Wei & Lucy Chen" stage="Starts Jul 6" amt="$64,200" margin={26.0} est={26}></DashJobRow>
            <DashJobRow name="Pearson - Sunroom addition" client="Glenn Pearson" stage="Punch list" amt="$73,200" margin={28.4} est={27}></DashJobRow>
            <DashJobRow name="O'Brien - Deck + porch" client="Pat O'Brien" stage="Punch list" amt="$48,900" margin={27.8} est={26}></DashJobRow>
              </React.Fragment>);
              return acts.map((x) => <DashJobRow key={x.project.id} projectId={x.project.id} pct={window.bqProj.pct(x.project)} name={x.client.name + ' - ' + x.project.title} client={x.client.name} stage={x.project.stage} amt={'$' + window.bqProj.total(x.project).toLocaleString()}></DashJobRow>);
            })()}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
window.HifiDashboard = HifiDashboard;
