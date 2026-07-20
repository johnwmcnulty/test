// BuilderIQ - project-scoped Builder screens. When the builder has real (custom) active
// projects, the sidebar detail screens render THAT data instead of the Henderson demo.
// Sample screens remain as a no-custom-client fallback via bqScoped().

function ScShell({ active, crumb, alerts, children }) {
  return (
    <div className="bq-screen">
      <BqTop crumb={crumb}></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active={active} alerts={alerts || {}}></BqSide>
        <main style={{ flex: 1, padding: 'calc(20px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))', overflow: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
function ScHead({ title, sub, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
      <span className="bq-display" style={{ fontSize: 22 }}>{title}</span>
      {sub ? <span style={{ fontSize: 13, color: 'var(--bq-muted)' }}>{sub}</span> : null}
      {right ? <span style={{ marginLeft: 'auto' }}>{right}</span> : null}
    </div>
  );
}
function ScEmpty({ glyph, title, note, cta, onCta }) {
  return (
    <div className="bq-card-s" style={{ padding: '40px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <span style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--bq-subtle)', color: 'var(--bq-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH[glyph] || BQ_GLYPH.projects} size={23}></BqIcon></span>
      <div style={{ fontWeight: 700, fontSize: 15 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5, maxWidth: 500 }}>{note}</div>
      {cta ? <button className="bq-btn primary sm" style={{ marginTop: 6 }} onClick={onCta}>{cta}</button> : null}
    </div>
  );
}
const scMoney = (n) => '$' + Number(n || 0).toLocaleString('en-US');
function scOpenWs(pid) { window.__bqCustomProject = pid; window.__bqNav && window.__bqNav('Project Workspace'); }
function scFlash(setToast, m) { setToast(m); setTimeout(() => setToast(null), 2200); }
function ScToast({ toast }) {
  if (!toast) return null;
  return <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 220, background: 'var(--bq-ink)', color: '#fff', fontSize: 13, fontWeight: 600, padding: '10px 18px', borderRadius: 999, boxShadow: '0 12px 30px rgba(38,35,30,0.35)' }}>{toast}</div>;
}

// flatten helpers
function scRows(acts, key) {
  const out = [];
  acts.forEach((x) => (x.project[key] || []).forEach((item, idx) => out.push({ client: x.client, project: x.project, item, idx, label: window.bqProj.shortName(x.client, x.project) })));
  return out;
}

// ── Invoices / Payments (draws) ──
function ScopedInvoices({ acts }) {
  window.bqUseNewClients();
  const [toast, setToast] = React.useState(null);
  const rows = scRows(acts, 'draws');
  const billed = acts.reduce((s, x) => s + window.bqProj.total(x.project), 0);
  const collected = acts.reduce((s, x) => s + window.bqProj.paid(x.project), 0);
  const pay = (pj, i) => {
    const draws = pj.draws.map((x, j) => j === i ? { ...x, status: 'paid' } : x);
    const nxt = draws.findIndex((x) => x.status === 'upcoming');
    if (nxt > -1) draws[nxt] = { ...draws[nxt], status: 'due' };
    window.bqProj.update(pj.id, { draws, collected: draws.filter((x) => x.status === 'paid').reduce((s, x) => s + Number(x.amount || 0), 0) });
    scFlash(setToast, 'Payment recorded');
  };
  const STAT = { paid: ['Paid', 'good'], due: ['Due now', 'brand'], upcoming: ['Upcoming', ''] };
  return (
    <ScShell active="Invoices" crumb="Invoices">
      <ScHead title="Invoices & payments" sub={acts.length + ' active project' + (acts.length !== 1 ? 's' : '')}></ScHead>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <div className="bq-card-s bq-kpi" style={{ flex: 1, minWidth: 150 }}><span className="lab">Contract value</span><span className="val bq-num">{scMoney(billed)}</span></div>
        <div className="bq-card-s bq-kpi" style={{ flex: 1, minWidth: 150 }}><span className="lab">Collected</span><span className="val bq-num" style={{ color: 'var(--bq-good)' }}>{scMoney(collected)}</span></div>
        <div className="bq-card-s bq-kpi" style={{ flex: 1, minWidth: 150 }}><span className="lab">Outstanding</span><span className="val bq-num" style={{ color: 'var(--bq-brand-strong)' }}>{scMoney(billed - collected)}</span></div>
      </div>
      <section className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 0 4px' }}>
        <div className="bq-sechead" style={{ padding: '0 18px', marginBottom: 8 }}><span className="t">Draw schedule</span></div>
        <div className="bq-trow head" style={{ gridTemplateColumns: '1.4fr 2fr 1fr 1fr' }}><span>Project</span><span>Draw</span><span>Amount</span><span>Status</span></div>
        {rows.length ? rows.map((r) => {
          const [lbl, tone] = STAT[r.item.status] || ['', ''];
          return (
            <div key={r.project.id + r.idx} className="bq-trow" style={{ gridTemplateColumns: '1.4fr 2fr 1fr 1fr' }}>
              <span style={{ fontWeight: 600 }}>{r.label}</span>
              <span>{r.item.t}</span>
              <span className="cell-num">{scMoney(r.item.amount)}</span>
              <span style={{ display: 'flex', justifyContent: 'flex-start' }}>{r.item.status === 'due' ? <button className="bq-btn primary sm" onClick={() => pay(r.project, r.idx)}>Record payment</button> : <span className={'bq-chip ' + tone}>{lbl}</span>}</span>
            </div>
          );
        }) : <div style={{ padding: '16px 18px', fontSize: 13, color: 'var(--bq-faint)' }}>No draws yet - start the project to generate a payment schedule.</div>}
      </section>
      <ScToast toast={toast}></ScToast>
    </ScShell>
  );
}

// ── Change Orders ──
function ScopedChangeOrders({ acts }) {
  window.bqUseNewClients();
  const [toast, setToast] = React.useState(null);
  const rows = scRows(acts, 'cos');
  const approved = rows.filter((r) => r.item.status === 'approved').reduce((s, r) => s + Number(r.item.price || 0), 0);
  const STAT = { draft: ['Draft', ''], sent: ['Awaiting client', 'ai'], approved: ['Approved', 'good'], declined: ['Declined', ''] };
  return (
    <ScShell active="Change Orders" crumb="Change Orders">
      <ScHead title="Change orders" sub={scMoney(approved) + ' approved across active projects'}></ScHead>
      <section className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 0 4px' }}>
        <div className="bq-trow head" style={{ gridTemplateColumns: '1.3fr 2.2fr 1fr 1.2fr' }}><span>Project</span><span>Change order</span><span>Price</span><span>Status</span></div>
        {rows.length ? rows.map((r) => {
          const [lbl, tone] = STAT[r.item.status] || ['', ''];
          return (
            <div key={r.project.id + r.idx} className="bq-trow" style={{ gridTemplateColumns: '1.3fr 2.2fr 1fr 1.2fr' }}>
              <span style={{ fontWeight: 600 }}>{r.label}</span>
              <span>{r.item.no} · {r.item.t}</span>
              <span className="cell-num">{scMoney(r.item.price)}</span>
              <span style={{ display: 'flex', gap: 6 }}>{r.item.status === 'draft' ? <button className="bq-btn primary sm" onClick={() => { window.bqProj.setCo(r.project.id, r.item.no, 'sent'); scFlash(setToast, 'Sent to client'); }}>Send</button> : <span className={'bq-chip ' + tone}>{lbl}</span>}</span>
            </div>
          );
        }) : <div style={{ padding: '16px 18px', fontSize: 13, color: 'var(--bq-faint)' }}>No change orders. Draft one from a project's workspace, or capture from the field.</div>}
      </section>
      <ScToast toast={toast}></ScToast>
    </ScShell>
  );
}

// ── Schedule (milestones) ──
function ScopedSchedule({ acts }) {
  window.bqUseNewClients();
  return (
    <ScShell active="Schedule" crumb="Schedule">
      <ScHead title="Schedule" sub="Milestones across active projects"></ScHead>
      {acts.map((x) => (
        <section key={x.project.id} className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 18px' }}>
          <div className="bq-sechead" style={{ marginBottom: 10 }}><span className="t">{window.bqProj.shortName(x.client, x.project)}</span><span className="bq-chip" style={{ marginLeft: 8 }}>{window.bqProj.pct(x.project)}%</span><button className="bq-btn ghost sm" style={{ marginLeft: 'auto' }} onClick={() => scOpenWs(x.project.id)}>Open</button></div>
          {(x.project.milestones || []).map((m, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
              <span style={{ width: 18, height: 18, borderRadius: '50%', flex: 'none', background: m.done ? 'var(--bq-good)' : 'var(--bq-subtle)', boxShadow: m.done ? 'none' : 'inset 0 0 0 1.5px var(--bq-border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{m.done ? <BqIcon d={BQ_GLYPH.check} size={11} sw={2.6} style={{ color: '#fff' }}></BqIcon> : null}</span>
              <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: m.done ? 'var(--bq-faint)' : 'var(--bq-ink)' }}>{m.t}</span>
              <span style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{m.w}</span>
            </div>
          ))}
        </section>
      ))}
      {!acts.length ? <ScEmpty glyph="calendar" title="No schedule yet" note="Milestones appear here as you start projects. Every new project gets a schedule you can adjust."></ScEmpty> : null}
    </ScShell>
  );
}

// ── Daily Logs ──
function ScopedDailyLogs({ acts }) {
  window.bqUseNewClients();
  const rows = scRows(acts, 'logs');
  return (
    <ScShell active="Daily Logs" crumb="Daily Logs">
      <ScHead title="Daily logs" sub="Site updates across active projects"></ScHead>
      {rows.length ? rows.map((r) => (
        <div key={r.project.id + r.idx} className="bq-card-s" style={{ padding: '13px 16px', display: 'flex', gap: 12 }}>
          <span style={{ fontSize: 12, color: 'var(--bq-faint)', width: 84, flex: 'none', paddingTop: 1 }}>{r.item.date}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--bq-muted)', marginBottom: 3 }}>{r.label}</div>
            <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>{r.item.summary}</div>
          </div>
          {r.item.shared ? <span className="bq-chip ai" style={{ alignSelf: 'flex-start' }}>Shared</span> : <span className="bq-chip" style={{ alignSelf: 'flex-start' }}>Internal</span>}
        </div>
      )) : <ScEmpty glyph="log" title="No daily logs yet" note="Logs appear here as your crew posts them from the field or you add them in the project workspace."></ScEmpty>}
    </ScShell>
  );
}

// ── Tasks ──
function ScopedTasks({ acts }) {
  window.bqUseNewClients();
  const rows = scRows(acts, 'tasks');
  return (
    <ScShell active="Tasks" crumb="Tasks">
      <ScHead title="Tasks" sub={rows.filter((r) => !r.item.done).length + ' open'}></ScHead>
      <section className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 18px' }}>
        {rows.length ? rows.map((r) => (
          <div key={r.project.id + r.idx} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: r.idx || rows.indexOf(r) ? '1px solid var(--bq-border)' : 'none' }}>
            <button onClick={() => window.bqProj.toggleTask(r.project.id, r.idx)} style={{ width: 22, height: 22, borderRadius: 7, flex: 'none', border: 'none', cursor: 'pointer', background: r.item.done ? 'var(--bq-good)' : 'var(--bq-subtle)', boxShadow: r.item.done ? 'none' : 'inset 0 0 0 1.5px var(--bq-border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{r.item.done ? <BqIcon d={BQ_GLYPH.check} size={12} sw={2.6} style={{ color: '#fff' }}></BqIcon> : null}</button>
            <span style={{ flex: 1, fontSize: 13.5, color: r.item.done ? 'var(--bq-faint)' : 'var(--bq-ink)' }}>{r.item.t}</span>
            {r.item.sub ? <span className="bq-chip ai">{r.item.subName || 'Sub assigned'}</span> : null}
            <span style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{r.label}</span>
          </div>
        )) : <div style={{ fontSize: 13, color: 'var(--bq-faint)', padding: '4px 0' }}>No tasks yet - add them in a project workspace.</div>}
      </section>
    </ScShell>
  );
}

// ── Reports (store rollup) ──
function ScopedReports({ acts }) {
  window.bqUseNewClients();
  const allP = window.bqProj.list();
  const total = acts.reduce((s, x) => s + window.bqProj.total(x.project), 0);
  const collected = acts.reduce((s, x) => s + window.bqProj.paid(x.project), 0);
  const pipe = allP.filter((x) => ['New lead', 'Estimating', 'Proposal sent'].includes(x.project.stage));
  const KPI = [['Active projects', String(acts.length), null], ['Contract value', scMoney(total), null], ['Collected', scMoney(collected), 'good'], ['Outstanding', scMoney(total - collected), 'warn'], ['In pipeline', String(pipe.length), 'ai'], ['Avg. progress', (acts.length ? Math.round(acts.reduce((s, x) => s + window.bqProj.pct(x.project), 0) / acts.length) : 0) + '%', null]];
  return (
    <ScShell active="Reports" crumb="Reports">
      <ScHead title="Reports" sub="Live rollup across your projects"></ScHead>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        {KPI.map(([l, v, t]) => (
          <div key={l} className="bq-card-s bq-kpi" style={{ flex: '1 1 160px', minWidth: 150 }}><span className="lab">{l}</span><span className="val bq-num" style={{ color: t === 'good' ? 'var(--bq-good)' : t === 'warn' ? 'var(--bq-brand-strong)' : t === 'ai' ? 'var(--bq-ai-strong)' : 'var(--bq-ink)' }}>{v}</span></div>
        ))}
      </div>
      <section className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 0 4px' }}>
        <div className="bq-sechead" style={{ padding: '0 18px', marginBottom: 8 }}><span className="t">By project</span></div>
        <div className="bq-trow head" style={{ gridTemplateColumns: '2fr 1fr 1.5fr 1fr' }}><span>Project</span><span>Stage</span><span>Collected</span><span>Progress</span></div>
        {acts.map((x) => (
          <div key={x.project.id} className="bq-trow" style={{ gridTemplateColumns: '2fr 1fr 1.5fr 1fr' }}>
            <span style={{ fontWeight: 600 }}>{window.bqProj.shortName(x.client, x.project)}</span>
            <span className={'bq-chip ' + (x.project.stageTone || 'ai')} style={{ justifySelf: 'start' }}>{x.project.stage}</span>
            <span className="cell-num">{scMoney(window.bqProj.paid(x.project))} <span style={{ color: 'var(--bq-faint)' }}>/ {scMoney(window.bqProj.total(x.project))}</span></span>
            <span className="cell-num">{window.bqProj.pct(x.project)}%</span>
          </div>
        ))}
      </section>
    </ScShell>
  );
}

// ── Watchdog (honest low-data) ──
function ScopedWatchdog({ acts }) {
  window.bqUseNewClients();
  const signals = [];
  acts.forEach((x) => {
    const t = window.bqProj.total(x.project), p = window.bqProj.paid(x.project), pc = window.bqProj.pct(x.project);
    if (pc >= 40 && t > 0 && p / t < 0.25) signals.push({ tone: 'warn', title: window.bqProj.shortName(x.client, x.project) + ' - billing behind progress', body: pc + '% complete but only ' + Math.round(p / t * 100) + '% collected. Consider sending the next draw.' });
    (x.project.cos || []).filter((c) => c.status === 'draft').forEach((c) => signals.push({ tone: 'ai', title: window.bqProj.shortName(x.client, x.project) + ' - unsent change order', body: c.no + ' (' + scMoney(c.price) + ') is drafted but not sent. Unsent COs leak margin.' }));
  });
  return (
    <ScShell active="Watchdog" crumb="Watchdog">
      <ScHead title="Profit Watchdog" sub="Risk signals across your projects"></ScHead>
      {signals.length ? signals.map((s, i) => (
        <div key={i} className="bq-ai-card" style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}><BqSpark size={14}></BqSpark><span style={{ fontWeight: 700, fontSize: 14, color: 'var(--bq-ai-strong)' }}>{s.title}</span></div>
          <div style={{ fontSize: 13, color: 'var(--bq-ink)', lineHeight: 1.5 }}>{s.body}</div>
        </div>
      )) : <ScEmpty glyph="watchdog" title="No risk signals" note="The Watchdog flags margin drift, billing lag, and unsent change orders. Nothing needs attention across your active projects right now."></ScEmpty>}
    </ScShell>
  );
}

// ── Weekly Update (generated) ──
function ScopedWeekly({ acts }) {
  window.bqUseNewClients();
  const [copied, setCopied] = React.useState(null);
  const sign = window.bqLeadName ? window.bqLeadName() : 'your builder';
  return (
    <ScShell active="Weekly Update" crumb="Weekly Update">
      <ScHead title="Weekly client updates" sub="AI-drafted from each project's activity"></ScHead>
      {acts.map((x) => {
        const done = (x.project.milestones || []).filter((m) => m.done);
        const next = (x.project.milestones || []).find((m) => !m.done);
        const log = (x.project.logs || []).find((l) => l.shared);
        const draft = 'Hi ' + x.client.name.split(' ')[0] + ' - quick update on your ' + String(x.project.title || 'project').toLowerCase() + '. ' +
          (log ? log.summary + ' ' : '') +
          "We're about " + window.bqProj.pct(x.project) + '% through the schedule' + (next ? ', and next up is ' + next.t.toLowerCase() + '.' : '.') +
          ' As always, reach out with any questions. - ' + sign;
        return (
          <div key={x.project.id} className="bq-card-s" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><BqSpark size={13}></BqSpark><span style={{ fontWeight: 700, fontSize: 14 }}>{window.bqProj.shortName(x.client, x.project)}</span><span className="bq-chip ai" style={{ marginLeft: 'auto' }}>Draft</span></div>
            <div style={{ background: 'var(--bq-ai-soft)', borderRadius: 12, boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)', padding: '12px 14px', fontSize: 13.5, lineHeight: 1.6 }}>{draft}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="bq-btn ai sm" onClick={() => { setCopied(x.project.id); setTimeout(() => setCopied(null), 1800); }}>{copied === x.project.id ? 'Copied ✓' : 'Copy'}</button>
              <button className="bq-btn soft-ai sm" onClick={() => scOpenWs(x.project.id)}>Open project</button>
            </div>
          </div>
        );
      })}
      {!acts.length ? <ScEmpty glyph="spark" title="No updates to draft" note="When you have active projects, BuilderIQ drafts a weekly client update for each one from its activity."></ScEmpty> : null}
    </ScShell>
  );
}

// ── generic empties for peripheral client-specific tools ──
function scGeneric(active, title, glyph, note) {
  return function ({ acts }) {
    window.bqUseNewClients();
    return (
      <ScShell active={active} crumb={active}>
        <ScHead title={title}></ScHead>
        <ScEmpty glyph={glyph} title={'Nothing here yet'} note={note} cta={acts && acts.length ? 'Open a project' : 'Add a client'} onCta={() => (acts && acts[0]) ? scOpenWs(acts[0].project.id) : (window.__bqNav && window.__bqNav('Clients'))}></ScEmpty>
      </ScShell>
    );
  };
}

// ── Pipeline: store-driven sales board / leads / follow-ups / marketing ──
const SC_PIPE_COLS = [['New lead', 'New lead', 'var(--bq-faint)'], ['Estimating', 'Estimating', 'var(--bq-ai-strong)'], ['Proposal sent', 'Proposal sent', 'var(--bq-brand-strong)'], ['Won', ['In progress', 'Starts soon', 'Closeout'], 'var(--bq-good)']];
function scInCol(stage, spec) { return Array.isArray(spec) ? spec.includes(stage) : stage === spec; }

function ScopedSalesPipeline() {
  window.bqUseNewClients();
  const all = window.bqProj ? window.bqProj.list() : [];
  const openVal = all.filter((x) => !scInCol(x.project.stage, SC_PIPE_COLS[3][1])).reduce((s, x) => s + (Number(x.project.contract) || Number(x.project.budget) || 0), 0);
  return (
    <ScShell active="Sales Pipeline" crumb="Sales Pipeline">
      <ScHead title="Sales pipeline" sub={all.length + ' project' + (all.length !== 1 ? 's' : '') + ' · ' + scMoney(openVal) + ' in open pipeline'}
        right={<button className="bq-btn primary sm" onClick={() => window.__bqNav && window.__bqNav('Clients')}><BqIcon d="M12 5 V19 M5 12 H19" size={13}></BqIcon>New lead</button>}></ScHead>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', overflowX: 'auto', paddingBottom: 6 }}>
        {SC_PIPE_COLS.map(([label, spec, col]) => {
          const cards = all.filter((x) => scInCol(x.project.stage, spec));
          return (
            <div key={label} style={{ flex: '1 0 220px', minWidth: 220, background: 'var(--bq-subtle)', borderRadius: 14, padding: 10, display: 'flex', flexDirection: 'column', gap: 9 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '2px 4px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: col, flex: 'none' }}></span>
                <span style={{ fontWeight: 700, fontSize: 12.5 }}>{label}</span>
                <span className="bq-chip" style={{ marginLeft: 'auto' }}>{cards.length}</span>
              </div>
              {cards.map((x) => (
                <div key={x.project.id} role="button" tabIndex={0} onClick={() => scOpenWs(x.project.id)} className="bq-card-s" style={{ padding: '11px 13px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 6, boxShadow: '0 1px 2px rgba(38,35,30,0.06), 0 0 0 1px var(--bq-border)' }}>
                  <span style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>{x.client.name} - {x.project.title}</span>
                  <div style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>{x.client.addr || 'No address'}</div>
                  <span className="bq-num" style={{ fontSize: 14.5 }}>{scMoney(window.bqProj.total(x.project) || Number(x.project.budget) || 0)}</span>
                </div>
              ))}
              {!cards.length ? <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', textAlign: 'center', padding: '12px 0' }}>-</div> : null}
            </div>
          );
        })}
      </div>
    </ScShell>
  );
}

function ScopedLeads() {
  window.bqUseNewClients();
  const all = window.bqProj ? window.bqProj.list() : [];
  const leads = all.filter((x) => ['New lead', 'Estimating', 'Proposal sent'].includes(x.project.stage));
  return (
    <ScShell active="Leads" crumb="Leads">
      <ScHead title="Leads" sub={leads.length + ' open'} right={<button className="bq-btn primary sm" onClick={() => window.__bqNav && window.__bqNav('Clients')}><BqIcon d="M12 5 V19 M5 12 H19" size={13}></BqIcon>New lead</button>}></ScHead>
      {leads.length ? (
        <section className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 0 4px' }}>
          <div className="bq-trow head" style={{ gridTemplateColumns: '2fr 1.4fr 1fr 1fr' }}><span>Lead</span><span>Address</span><span>Est. value</span><span>Stage</span></div>
          {leads.map((x) => (
            <div key={x.project.id} className="bq-trow" role="button" tabIndex={0} onClick={() => scOpenWs(x.project.id)} style={{ gridTemplateColumns: '2fr 1.4fr 1fr 1fr', cursor: 'pointer' }}>
              <span style={{ fontWeight: 600 }}>{x.client.name} - {x.project.title}</span>
              <span style={{ color: 'var(--bq-faint)', fontSize: 12.5 }}>{x.client.addr || '-'}</span>
              <span className="cell-num">{scMoney(Number(x.project.contract) || Number(x.project.budget) || 0)}{!Number(x.project.contract) && Number(x.project.budget) ? <span style={{ color: 'var(--bq-faint)', fontWeight: 500 }}> est.</span> : null}</span>
              <span className={'bq-chip ' + (x.project.stageTone || 'ai')} style={{ justifySelf: 'start' }}>{x.project.stage}</span>
            </div>
          ))}
        </section>
      ) : <ScEmpty glyph="leads" title="No open leads" note="New leads appear here. Add a client to start one - as it moves through estimating and proposal, it flows across the pipeline." cta="Add a lead" onCta={() => window.__bqNav && window.__bqNav('Clients')}></ScEmpty>}
    </ScShell>
  );
}

function ScopedFollowups() {
  window.bqUseNewClients();
  const all = window.bqProj ? window.bqProj.list() : [];
  const need = all.filter((x) => x.project.stage === 'Proposal sent' || x.project.stage === 'Estimating');
  return (
    <ScShell active="Follow-ups" crumb="Follow-ups">
      <ScHead title="Follow-ups" sub={need.length + ' awaiting a nudge'}></ScHead>
      {need.length ? need.map((x) => (
        <div key={x.project.id} className="bq-card-s" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{x.client.name} - {x.project.title}</div>
            <div style={{ fontSize: 12.5, color: 'var(--bq-faint)' }}>{x.project.stage === 'Proposal sent' ? 'Proposal out - waiting on a decision' : 'Estimate in progress'}</div>
          </div>
          <button className="bq-btn soft-ai sm" onClick={() => window.__bqNav && window.__bqNav('Weekly Update')}><BqSpark size={12}></BqSpark>Draft nudge</button>
          <button className="bq-btn sm" onClick={() => scOpenWs(x.project.id)}>Open</button>
        </div>
      )) : <ScEmpty glyph="send" title="Nobody to chase" note="When you have leads mid-estimate or proposals awaiting a decision, they'll surface here with a one-tap AI nudge."></ScEmpty>}
    </ScShell>
  );
}

function ScopedMarketing() {
  window.bqUseNewClients();
  const all = window.bqProj ? window.bqProj.list() : [];
  const bySource = {};
  all.forEach((x) => { const s = x.client.source || 'Direct'; bySource[s] = (bySource[s] || 0) + 1; });
  const rows = Object.keys(bySource);
  return (
    <ScShell active="Marketing" crumb="Marketing">
      <ScHead title="Marketing" sub="Where your clients come from"></ScHead>
      {rows.length ? (
        <section className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 0 4px' }}>
          <div className="bq-trow head" style={{ gridTemplateColumns: '2fr 1fr' }}><span>Lead source</span><span>Clients</span></div>
          {rows.map((s) => (
            <div key={s} className="bq-trow" style={{ gridTemplateColumns: '2fr 1fr' }}><span style={{ fontWeight: 600 }}>{s}</span><span className="cell-num">{bySource[s]}</span></div>
          ))}
        </section>
      ) : <ScEmpty glyph="megaphone" title="No campaign data yet" note="Lead-source ROI builds here as clients come in through referrals, your website, and other channels."></ScEmpty>}
    </ScShell>
  );
}

function ScopedTime() {
  window.bqUseNewClients();
  return (
    <ScShell active="Time" crumb="Time">
      <ScHead title="Time tracking" sub="Crew hours across active projects"></ScHead>
      <ScEmpty glyph="clock" title="No time logged yet" note="Hours appear here as your crew clocks in from the Field app. Each entry is GPS-stamped and flows into job costing."></ScEmpty>
    </ScShell>
  );
}

function ScopedCapacity() {
  window.bqUseNewClients();
  const acts = window.bqProj ? window.bqProj.actives() : [];
  return (
    <ScShell active="Capacity" crumb="Capacity">
      <ScHead title="Crew capacity" sub={acts.length + ' active project' + (acts.length !== 1 ? 's' : '') + ' in production'}></ScHead>
      <section className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 0 4px' }}>
        <div className="bq-sechead" style={{ padding: '0 18px', marginBottom: 8 }}><span className="t">Projects needing crew</span></div>
        <div className="bq-trow head" style={{ gridTemplateColumns: '2fr 1fr 1.4fr' }}><span>Project</span><span>Stage</span><span>Progress</span></div>
        {acts.length ? acts.map((x) => (
          <div key={x.project.id} className="bq-trow" role="button" tabIndex={0} onClick={() => scOpenWs(x.project.id)} style={{ gridTemplateColumns: '2fr 1fr 1.4fr', cursor: 'pointer' }}>
            <span style={{ fontWeight: 600 }}>{window.bqProj.shortName(x.client, x.project)}</span>
            <span className={'bq-chip ' + (x.project.stageTone || 'ai')} style={{ justifySelf: 'start' }}>{x.project.stage}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}><BqMeter pct={window.bqProj.pct(x.project)} style={{ flex: 1 }}></BqMeter><span className="cell-num" style={{ fontSize: 12, color: 'var(--bq-faint)', width: 34 }}>{window.bqProj.pct(x.project)}%</span></div>
          </div>
        )) : <div style={{ padding: '16px 18px', fontSize: 13, color: 'var(--bq-faint)' }}>No active projects to staff.</div>}
      </section>
      <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>Assign crews and subs to tasks from each project's workspace.</div>
    </ScShell>
  );
}

function ScopedPhotos() {
  window.bqUseNewClients();
  return (
    <ScShell active="Photos" crumb="Photos">
      <ScHead title="Photos" sub="Progress photos across active projects"></ScHead>
      <ScEmpty glyph="photo" title="No photos yet" note="Progress photos your crew captures in the field appear here, grouped by project and phase."></ScEmpty>
    </ScShell>
  );
}

function ScopedDocuments() {
  window.bqUseNewClients();
  const acts = window.bqProj ? window.bqProj.actives() : [];
  return (
    <ScShell active="Documents" crumb="Documents">
      <ScHead title="Documents" sub="Contracts & signed change orders"></ScHead>
      {acts.map((x) => {
        const rows = [['Proposal - ' + x.project.title, 'Accepted'], ['Construction agreement', 'Signed']].concat((x.project.cos || []).filter((c) => c.status === 'approved').map((c) => [c.no + ' - ' + c.t, 'Signed']));
        return (
          <section key={x.project.id} className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 8 }}>{window.bqProj.shortName(x.client, x.project)}</div>
            {rows.map(([t, s], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
                <BqIcon d={BQ_GLYPH.docs} size={17} style={{ color: 'var(--bq-muted)', flex: 'none' }}></BqIcon>
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>{t}</span>
                <span className="bq-chip good">{s}</span>
              </div>
            ))}
          </section>
        );
      })}
      {!acts.length ? <ScEmpty glyph="docs" title="No documents yet" note="Signed proposals, agreements, and approved change orders file here automatically as projects progress."></ScEmpty> : null}
    </ScShell>
  );
}

// ── Expenses (materials/purchases cost side) ──
function ScopedExpenses({ acts }) {
  window.bqUseNewClients();
  const rows = [];
  acts.forEach((x) => (x.project.materials || []).forEach((m) => rows.push({ x, m })));
  const totalCost = rows.reduce((s, r) => s + window.bqProj.matCost(r.m), 0);
  const billed = rows.filter((r) => r.m.billed && r.m.billable).reduce((s, r) => s + window.bqProj.matClient(r.m), 0);
  return (
    <ScShell active="Expenses" crumb="Expenses">
      <ScHead title="Expenses & materials" sub="Purchases logged across active projects"></ScHead>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <div className="bq-card-s bq-kpi" style={{ flex: 1, minWidth: 150 }}><span className="lab">Total spent</span><span className="val bq-num">{scMoney(totalCost)}</span></div>
        <div className="bq-card-s bq-kpi" style={{ flex: 1, minWidth: 150 }}><span className="lab">Billed to clients</span><span className="val bq-num" style={{ color: 'var(--bq-good)' }}>{scMoney(billed)}</span></div>
        <div className="bq-card-s bq-kpi" style={{ flex: 1, minWidth: 150 }}><span className="lab">Line items</span><span className="val bq-num">{rows.length}</span></div>
      </div>
      {rows.length ? (
        <section className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 0 4px' }}>
          <div className="bq-trow head" style={{ gridTemplateColumns: '1.3fr 1.8fr 1fr 1fr 1fr' }}><span>Project</span><span>Item</span><span>Vendor</span><span>Cost</span><span>Status</span></div>
          {rows.map((r) => (
            <div key={r.m.id} className="bq-trow" role="button" tabIndex={0} onClick={() => scOpenWs(r.x.project.id)} style={{ gridTemplateColumns: '1.3fr 1.8fr 1fr 1fr 1fr', cursor: 'pointer' }}>
              <span style={{ fontWeight: 600 }}>{window.bqProj.shortName(r.x.client, r.x.project)}</span>
              <span>{r.m.item}</span>
              <span style={{ color: 'var(--bq-faint)', fontSize: 12.5 }}>{r.m.vendor || '-'}</span>
              <span className="cell-num">{scMoney(window.bqProj.matCost(r.m))}</span>
              <span style={{ display: 'flex' }}>{!r.m.billable ? <span className="bq-chip">Own cost</span> : r.m.billed ? <span className="bq-chip good">Billed {scMoney(window.bqProj.matClient(r.m))}</span> : <span className="bq-chip ai">Billable</span>}</span>
            </div>
          ))}
        </section>
      ) : <ScEmpty glyph="expense" title="No expenses yet" note="Log materials in a project workspace or snap a receipt from the Field app - purchases show here with what's billable to the client." cta="Open a project" onCta={() => acts[0] && scOpenWs(acts[0].project.id)}></ScEmpty>}
    </ScShell>
  );
}

// ── WIP / over-under billing - derived from milestones (% earned) + draws (billed) ──
function scWipRow(p) {
  const contract = window.bqProj.total(p);
  const earned = Math.round((window.bqProj.pct(p) / 100) * contract);
  const billed = (p.draws || []).filter((d) => d.status === 'paid' || d.status === 'due').reduce((s, d) => s + (Number(d.amount) || 0), 0);
  return { contract: contract, earned: earned, billed: billed, variance: billed - earned, pctc: window.bqProj.pct(p) };
}
function ScopedWip({ acts }) {
  window.bqUseNewClients();
  const rows = acts.map((x) => ({ x: x, w: scWipRow(x.project) }));
  const tot = rows.reduce((a, r) => ({ contract: a.contract + r.w.contract, earned: a.earned + r.w.earned, billed: a.billed + r.w.billed }), { contract: 0, earned: 0, billed: 0 });
  const under = rows.reduce((s, r) => s + Math.min(r.w.variance, 0), 0);
  const over = rows.reduce((s, r) => s + Math.max(r.w.variance, 0), 0);
  const backlog = tot.contract - tot.billed;
  const cols = '2fr 1fr 1.3fr 1fr 1fr 1.2fr';
  return (
    <ScShell active="WIP Report" crumb="WIP · over / under billing">
      <ScHead title="Work-in-progress schedule" sub={rows.length + ' active project' + (rows.length !== 1 ? 's' : '') + ' · the report your accountant asks for'}></ScHead>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <div className="bq-card-s bq-kpi" style={{ flex: 1, minWidth: 150 }}><span className="lab">Signed backlog</span><span className="val bq-num">{scMoney(backlog)}</span><span className="sub">contract not yet billed</span></div>
        <div className="bq-card-s bq-kpi" style={{ flex: 1, minWidth: 150 }}><span className="lab">Underbilled</span><span className="val bq-num" style={{ color: 'var(--bq-brand-strong)' }}>{scMoney(-under)}</span><span className="sub">earned, not yet invoiced</span></div>
        <div className="bq-card-s bq-kpi" style={{ flex: 1, minWidth: 150 }}><span className="lab">Overbilled</span><span className="val bq-num" style={{ color: 'var(--bq-good)' }}>{scMoney(over)}</span><span className="sub">billed ahead of work</span></div>
        <div className="bq-card-s bq-kpi" style={{ flex: 1, minWidth: 150 }}><span className="lab">Contract value</span><span className="val bq-num">{scMoney(tot.contract)}</span><span className="sub">across active jobs</span></div>
      </div>
      {rows.length ? (
        <section className="bq-card-s" style={{ overflow: 'hidden' }}>
          <div className="bq-trow head" style={{ gridTemplateColumns: cols }}><span>Project</span><span>Contract</span><span>% complete</span><span>Earned</span><span>Billed</span><span>Over / (under)</span></div>
          {rows.map((r) => (
            <div key={r.x.project.id} className="bq-trow" role="button" tabIndex={0} onClick={() => scOpenWs(r.x.project.id)} style={{ gridTemplateColumns: cols, alignItems: 'center', cursor: 'pointer' }}>
              <span style={{ fontWeight: 600 }}>{window.bqProj.shortName(r.x.client, r.x.project)}</span>
              <span className="cell-num" style={{ color: 'var(--bq-muted)' }}>{scMoney(r.w.contract)}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><BqMeter pct={r.w.pctc} style={{ flex: 1 }}></BqMeter><span className="cell-num" style={{ fontSize: 12, width: 34 }}>{r.w.pctc}%</span></div>
              <span className="cell-num">{scMoney(r.w.earned)}</span>
              <span className="cell-num">{scMoney(r.w.billed)}</span>
              <span className="bq-num" style={{ fontSize: 13.5, color: r.w.variance < 0 ? 'var(--bq-brand-strong)' : 'var(--bq-good)' }}>{r.w.variance < 0 ? '(' + scMoney(-r.w.variance) + ')' : scMoney(r.w.variance)}</span>
            </div>
          ))}
        </section>
      ) : <ScEmpty glyph="ledger" title="Nothing to report yet" note="Work-in-progress accounting appears here once your projects have billings and costs."></ScEmpty>}
      <div style={{ fontSize: 12, color: 'var(--bq-muted)', lineHeight: 1.5, padding: '0 2px' }}><b style={{ color: 'var(--bq-brand-strong)' }}>Underbilled</b> - you've earned more than you've invoiced. Send the next draw to protect cash.</div>
    </ScShell>
  );
}

// ── Cash-flow forecast - built from each active project's draw schedule ──
function ScopedForecast({ acts }) {
  window.bqUseNewClients();
  const rows = [];
  acts.forEach((x) => (x.project.draws || []).forEach((d, i) => rows.push({ x: x, d: d, idx: i })));
  const contract = acts.reduce((s, x) => s + window.bqProj.total(x.project), 0);
  const collected = acts.reduce((s, x) => s + window.bqProj.paid(x.project), 0);
  const dueNow = rows.filter((r) => r.d.status === 'due').reduce((s, r) => s + (Number(r.d.amount) || 0), 0);
  const upcoming = rows.filter((r) => r.d.status === 'upcoming').reduce((s, r) => s + (Number(r.d.amount) || 0), 0);
  const STAT = { paid: ['Collected', 'good'], due: ['Due now', 'brand'], upcoming: ['Upcoming', 'ai'] };
  const ordered = rows.slice().sort((a, b) => ({ due: 0, upcoming: 1, paid: 2 }[a.d.status] - { due: 0, upcoming: 1, paid: 2 }[b.d.status]));
  return (
    <ScShell active="Forecast" crumb="Cash-flow forecast">
      <ScHead title="Where cash lands" sub="Projected from your active draw schedules"></ScHead>
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
        <div className="bq-card-s bq-kpi" style={{ flex: 1, minWidth: 150 }}><span className="lab">Contract value</span><span className="val bq-num">{scMoney(contract)}</span><span className="sub">signed across active jobs</span></div>
        <div className="bq-card-s bq-kpi" style={{ flex: 1, minWidth: 150 }}><span className="lab">Collected</span><span className="val bq-num" style={{ color: 'var(--bq-good)' }}>{scMoney(collected)}</span><span className="sub">received to date</span></div>
        <div className="bq-card-s bq-kpi" style={{ flex: 1, minWidth: 150 }}><span className="lab">Due now</span><span className="val bq-num" style={{ color: 'var(--bq-brand-strong)' }}>{scMoney(dueNow)}</span><span className="sub">invoiced, awaiting payment</span></div>
        <div className="bq-card-s bq-kpi" style={{ flex: 1, minWidth: 150 }}><span className="lab">Still to bill</span><span className="val bq-num" style={{ color: 'var(--bq-ai-strong)' }}>{scMoney(upcoming)}</span><span className="sub">upcoming draws</span></div>
      </div>
      {ordered.length ? (
        <section className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 0 4px' }}>
          <div className="bq-trow head" style={{ gridTemplateColumns: '1.6fr 2fr 1fr 1fr' }}><span>Project</span><span>Draw</span><span>Amount</span><span>Status</span></div>
          {ordered.map((r) => { const s = STAT[r.d.status] || ['Upcoming', 'ai']; return (
            <div key={r.x.project.id + r.idx} className="bq-trow" role="button" tabIndex={0} onClick={() => scOpenWs(r.x.project.id)} style={{ gridTemplateColumns: '1.6fr 2fr 1fr 1fr', cursor: 'pointer' }}>
              <span style={{ fontWeight: 600 }}>{window.bqProj.shortName(r.x.client, r.x.project)}</span>
              <span>{r.d.t}</span>
              <span className="cell-num">{scMoney(r.d.amount)}</span>
              <span className={'bq-chip ' + s[1]} style={{ justifySelf: 'start' }}>{s[0]}</span>
            </div>
          ); })}
        </section>
      ) : <ScEmpty glyph="trend" title="No draw schedule yet" note="Cash-flow projections build from your draw schedules as projects progress."></ScEmpty>}
    </ScShell>
  );
}

// inline click-to-edit text (scoped screens)
function ScInlineEdit({ value, placeholder, onSave }) {
  const [ed, setEd] = React.useState(false);
  const [v, setV] = React.useState('');
  const start = () => { setV(value || ''); setEd(true); };
  const commit = () => { onSave((v || '').trim()); setEd(false); };
  if (ed) return <input autoFocus value={v} onChange={(e) => setV(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEd(false); }} style={{ border: '1px solid var(--bq-ai)', borderRadius: 8, padding: '3px 7px', font: 'inherit', fontSize: 13, background: 'var(--bq-raise)', color: 'var(--bq-ink)', outline: 'none', width: 150, maxWidth: '100%' }}></input>;
  return <span onClick={start} title="Click to edit" style={{ cursor: 'text', borderBottom: value ? '1px dashed var(--bq-border-strong)' : '1px dashed var(--bq-border)', color: value ? 'inherit' : 'var(--bq-faint)' }}>{value || placeholder || '-'}</span>;
}

// ── Subs & Vendors (account-level registry) ──
function ScopedVendors() {
  const vendors = window.bqUseVendors ? window.bqUseVendors() : [];
  const acts = window.bqProj ? window.bqProj.actives() : [];
  window.bqUseNewClients();
  const [toast, setToast] = React.useState(null);
  const [nm, setNm] = React.useState(''); const [tr, setTr] = React.useState(''); const [ph, setPh] = React.useState(''); const [em, setEm] = React.useState('');
  const usage = (name) => acts.filter((x) => (x.project.tasks || []).some((t) => t.sub && t.subName === name)).length;
  const vinit = (n) => { const p = String(n || '').trim().split(/\s+/).filter(Boolean); return (((p[0] ? p[0][0] : 'V') + (p[1] ? p[1][0] : '')).toUpperCase()) || 'V'; };
  const add = () => { if (!nm.trim() || !window.bqVendors) return; window.bqVendors.add({ name: nm.trim(), trade: tr.trim(), phone: ph.trim(), email: em.trim() }); setNm(''); setTr(''); setPh(''); setEm(''); scFlash(setToast, 'Added to your directory'); };
  const inp = { border: '1px solid var(--bq-border-strong)', borderRadius: 10, padding: '9px 12px', font: 'inherit', fontSize: 13.5, background: 'var(--bq-raise)', color: 'var(--bq-ink)', outline: 'none' };
  return (
    <ScShell active="Subs & Vendors" crumb="Subs & Vendors">
      <ScHead title="Subs & vendors" sub={vendors.length + ' in your directory'}></ScHead>
      <section className="bq-card-s" style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 10 }}>Add a sub or vendor</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input value={nm} onChange={(e) => setNm(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') add(); }} placeholder="Company or name" style={{ ...inp, flex: '2 1 180px', minWidth: 0 }}></input>
          <input value={tr} onChange={(e) => setTr(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') add(); }} placeholder="Trade (e.g. Framing)" style={{ ...inp, flex: '1 1 130px', minWidth: 0 }}></input>
          <input value={ph} onChange={(e) => setPh(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') add(); }} placeholder="Phone" style={{ ...inp, flex: '1 1 120px', minWidth: 0 }}></input>
          <input value={em} onChange={(e) => setEm(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') add(); }} placeholder="Email" style={{ ...inp, flex: '1 1 150px', minWidth: 0 }}></input>
          <button className="bq-btn primary sm" onClick={add} disabled={!nm.trim()} style={{ flex: 'none', opacity: nm.trim() ? 1 : 0.5 }}>Add</button>
        </div>
      </section>
      {vendors.length ? (
        <section className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 0 4px' }}>
          <div className="bq-trow head" style={{ gridTemplateColumns: '1.8fr 1.2fr 1.8fr 1.1fr' }}><span>Sub / vendor</span><span>Trade</span><span>Contact</span><span>On jobs</span></div>
          {vendors.map((v) => (
            <div key={v.id} className="bq-trow" style={{ gridTemplateColumns: '1.8fr 1.2fr 1.8fr 1.1fr', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                <span style={{ width: 32, height: 32, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)' }}>{v.initials}</span>
                <span style={{ fontWeight: 600, minWidth: 0 }}><ScInlineEdit value={v.name} onSave={(x) => x && window.bqVendors.update(v.id, { name: x, initials: vinit(x) })}></ScInlineEdit></span>
              </div>
              <span style={{ color: 'var(--bq-muted)' }}><ScInlineEdit value={v.trade} placeholder="Add trade" onSave={(x) => window.bqVendors.update(v.id, { trade: x })}></ScInlineEdit></span>
              <span style={{ fontSize: 12.5, display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                <ScInlineEdit value={v.phone} placeholder="Add phone" onSave={(x) => window.bqVendors.update(v.id, { phone: x })}></ScInlineEdit>
                <ScInlineEdit value={v.email} placeholder="Add email" onSave={(x) => window.bqVendors.update(v.id, { email: x })}></ScInlineEdit>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                {usage(v.name) ? <span className="bq-chip ai">{usage(v.name)} job{usage(v.name) !== 1 ? 's' : ''}</span> : <span style={{ color: 'var(--bq-faint)', fontSize: 12.5 }}>-</span>}
                <button className="bq-btn ghost sm" onClick={() => { window.bqVendors.remove(v.id); scFlash(setToast, 'Removed'); }}>Remove</button>
              </span>
            </div>
          ))}
        </section>
      ) : <ScEmpty glyph="vendor" title="No subs or vendors yet" note="Add the subs and suppliers you work with, then assign them to tasks from a project workspace - they'll show up in the Sub portal."></ScEmpty>}
      <ScToast toast={toast}></ScToast>
    </ScShell>
  );
}

// ── Selections & allowances (per-project, client-approval loop) ──
function ScopedSelections({ acts }) {
  window.bqUseNewClients();
  const [toast, setToast] = React.useState(null);
  const rows = scRows(acts, 'selections');
  const STAT = { pending: ['Not sent', ''], sent: ['Awaiting client', 'ai'], approved: ['Approved', 'good'] };
  const cols = '1.4fr 2fr 1fr 1.2fr 1.3fr';
  const pending = rows.filter((r) => r.item.status === 'sent').length;
  return (
    <ScShell active="Selections" crumb="Selections">
      <ScHead title="Selections & allowances" sub={rows.length ? (pending + ' awaiting the client') : 'Finish choices across active projects'}></ScHead>
      {rows.length ? (
        <section className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 0 4px' }}>
          <div className="bq-trow head" style={{ gridTemplateColumns: cols }}><span>Project</span><span>Item</span><span>Allowance</span><span>Selected</span><span>Status</span></div>
          {rows.map((r) => {
            const s = STAT[r.item.status] || STAT.pending;
            const over = Number(r.item.price) - Number(r.item.allowance);
            return (
              <div key={r.project.id + r.idx} className="bq-trow" style={{ gridTemplateColumns: cols, alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>{r.label}</span>
                <div style={{ minWidth: 0 }}><div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.item.item}</div>{(r.item.room || r.item.choice) ? <div style={{ fontSize: 12, color: 'var(--bq-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{[r.item.room, r.item.choice].filter(Boolean).join(' · ')}</div> : null}</div>
                <span className="cell-num" style={{ color: 'var(--bq-muted)' }}>{scMoney(r.item.allowance)}</span>
                <span className="cell-num">{scMoney(r.item.price)}{over > 0 ? <span style={{ color: 'var(--bq-brand-strong)', fontWeight: 600 }}> +{scMoney(over)}</span> : null}</span>
                <span style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  {r.item.status === 'pending' ? <button className="bq-btn primary sm" onClick={() => { window.bqProj.setSelection(r.project.id, r.item.id, { status: 'sent' }); scFlash(setToast, 'Sent to client'); }}>Send to client</button>
                  : r.item.status === 'sent' ? <button className="bq-btn sm" onClick={() => { window.bqProj.setSelection(r.project.id, r.item.id, { status: 'approved' }); scFlash(setToast, 'Marked approved'); }}>Mark approved</button>
                  : <span className={'bq-chip ' + s[1]}>{s[0]}</span>}
                </span>
              </div>
            );
          })}
        </section>
      ) : <ScEmpty glyph="select" title="No selections yet" note="Add finish selections and allowances from a project workspace - track what's chosen, what's over allowance, and what's waiting on the client here." cta={acts && acts.length ? 'Open a project' : 'Add a client'} onCta={() => (acts && acts[0]) ? scOpenWs(acts[0].project.id) : (window.__bqNav && window.__bqNav('Clients'))}></ScEmpty>}
      <ScToast toast={toast}></ScToast>
    </ScShell>
  );
}

// ── AI Inbox (derived triage across the live workspace - no fake messages) ──
function ScopedInbox({ acts }) {
  window.bqUseNewClients();
  const items = [];
  acts.forEach((x) => {
    const nm = window.bqProj.shortName(x.client, x.project);
    (x.project.cos || []).filter((c) => c.status === 'sent').forEach((c) => items.push({ tone: 'ai', g: 'co', t: nm + ' - change order awaiting sign-off', sub: c.no + ' · ' + scMoney(c.price), act: 'Open', pid: x.project.id }));
    (x.project.selections || []).filter((s) => s.status === 'sent').forEach((s) => items.push({ tone: 'ai', g: 'select', t: nm + ' - selection awaiting client', sub: s.item, act: 'Open', pid: x.project.id }));
    (x.project.draws || []).filter((d) => d.status === 'due').forEach((d) => items.push({ tone: 'warn', g: 'invoice', t: nm + ' - payment due', sub: d.t + ' · ' + scMoney(d.amount), act: 'Collect', pid: x.project.id }));
    (x.project.tasks || []).filter((t) => t.sub && !t.done).forEach((t) => items.push({ tone: '', g: 'task', t: nm + ' - sub task open', sub: t.t, act: 'Open', pid: x.project.id }));
  });
  const toneBg = { warn: 'var(--bq-brand-soft)', ai: 'var(--bq-ai-soft)', '': 'var(--bq-subtle)' };
  const toneFg = { warn: 'var(--bq-bad)', ai: 'var(--bq-ai-strong)', '': 'var(--bq-muted)' };
  return (
    <ScShell active="AI Inbox" crumb="AI Inbox">
      <ScHead title="AI Inbox" sub={items.length ? (items.length + ' triaged from your live projects') : 'Triaged from your live projects'}></ScHead>
      {items.length ? (
        <section className="bq-card-s" style={{ padding: '4px 0' }}>
          {items.map((it, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
              <span style={{ width: 34, height: 34, borderRadius: 10, flex: 'none', background: toneBg[it.tone], color: toneFg[it.tone], display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH[it.g] || BQ_GLYPH.inbox} size={16}></BqIcon></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.3 }}>{it.t}</div>
                <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{it.sub}</div>
              </div>
              <button className="bq-btn primary sm" onClick={() => scOpenWs(it.pid)}>{it.act}</button>
            </div>
          ))}
        </section>
      ) : <ScEmpty glyph="inbox" title="Inbox zero" note="BuilderIQ triages client and sub activity across your projects - change orders awaiting sign-off, selections pending, payments due, and open sub tasks land here. Nothing needs you right now."></ScEmpty>}
    </ScShell>
  );
}

// ── Closeout (punch lists + warranty on wrapping projects) ──
function ScopedCloseout({ acts }) {
  window.bqUseNewClients();
  const [toast, setToast] = React.useState(null);
  const [adds, setAdds] = React.useState({});
  const closing = acts.filter((x) => x.project.stage === 'Closeout' || window.bqProj.pct(x.project) >= 90);
  const addPunch = (pid) => { const v = (adds[pid] || '').trim(); if (!v) return; window.bqProj.addPunch(pid, v); setAdds((s) => ({ ...s, [pid]: '' })); scFlash(setToast, 'Punch item added'); };
  const inp = { border: '1px solid var(--bq-border-strong)', borderRadius: 10, padding: '8px 11px', font: 'inherit', fontSize: 13, background: 'var(--bq-raise)', color: 'var(--bq-ink)', outline: 'none' };
  return (
    <ScShell active="Closeout" crumb="Closeout">
      <ScHead title="Closeout" sub="Punch lists & warranty on wrapping projects"></ScHead>
      {closing.length ? closing.map((x) => {
        const punch = x.project.punch || [];
        const openN = punch.filter((p) => !p.done).length;
        return (
          <section key={x.project.id} className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 18px' }}>
            <div className="bq-sechead" style={{ marginBottom: 10 }}>
              <span className="t">{window.bqProj.shortName(x.client, x.project)}</span>
              <span className={'bq-chip ' + (x.project.stage === 'Closeout' ? 'muted' : 'ai')} style={{ marginLeft: 8 }}>{x.project.stage === 'Closeout' ? 'In closeout' : window.bqProj.pct(x.project) + '% - ready to close'}</span>
              <button className="bq-btn ghost sm" style={{ marginLeft: 'auto' }} onClick={() => scOpenWs(x.project.id)}>Open</button>
            </div>
            {punch.length ? punch.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
                <button onClick={() => window.bqProj.togglePunch(x.project.id, i)} aria-label={p.done ? 'Mark open' : 'Mark done'} style={{ width: 22, height: 22, borderRadius: 7, flex: 'none', border: 'none', cursor: 'pointer', background: p.done ? 'var(--bq-good)' : 'var(--bq-subtle)', boxShadow: p.done ? 'none' : 'inset 0 0 0 1.5px var(--bq-border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{p.done ? <BqIcon d={BQ_GLYPH.check} size={12} sw={2.6} style={{ color: '#fff' }}></BqIcon> : null}</button>
                <span style={{ flex: 1, fontSize: 13.5, color: p.done ? 'var(--bq-faint)' : 'var(--bq-ink)', textDecoration: p.done ? 'line-through' : 'none' }}>{p.t}</span>
                <button onClick={() => window.bqProj.delPunch(x.project.id, i)} aria-label="Remove" style={{ width: 22, height: 22, borderRadius: 6, border: 'none', cursor: 'pointer', background: 'transparent', color: 'var(--bq-faint)', flex: 'none' }}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={12} sw={2}></BqIcon></button>
              </div>
            )) : <div style={{ fontSize: 13, color: 'var(--bq-faint)', padding: '2px 0 6px' }}>No punch items - add anything left to finish.</div>}
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <input value={adds[x.project.id] || ''} onChange={(e) => setAdds((s) => ({ ...s, [x.project.id]: e.target.value }))} onKeyDown={(e) => { if (e.key === 'Enter') addPunch(x.project.id); }} placeholder="Add a punch-list item…" style={{ ...inp, flex: 1, minWidth: 0 }}></input>
              <button className="bq-btn sm" onClick={() => addPunch(x.project.id)} style={{ flex: 'none' }}>Add</button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--bq-faint)', marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}><BqIcon d={BQ_GLYPH.warranty || BQ_GLYPH.check} size={13}></BqIcon>{openN ? (openN + ' item' + (openN !== 1 ? 's' : '') + ' left before warranty starts') : '1-year workmanship warranty ready to begin'}</div>
          </section>
        );
      }) : <ScEmpty glyph="warranty" title="Nothing in closeout" note="Projects appear here as they reach 90%+ or move to closeout - manage the punch list and kick off the warranty period."></ScEmpty>}
      <ScToast toast={toast}></ScToast>
    </ScShell>
  );
}

window.BQ_SCOPED = {
  'Invoices': ScopedInvoices,
  'Payments': ScopedInvoices,
  'Change Orders': ScopedChangeOrders,
  'Schedule': ScopedSchedule,
  'Daily Logs': ScopedDailyLogs,
  'Tasks': ScopedTasks,
  'Reports': ScopedReports,
  'Watchdog': ScopedWatchdog,
  'Weekly Update': ScopedWeekly,
  'Selections': ScopedSelections,
  'Expenses': ScopedExpenses,
  'Purchase Orders': scGeneric('Purchase Orders', 'Purchase Orders', 'po', 'Purchase orders for your active projects will appear here.'),
  'Change Order Leakage': scGeneric('Change Order Leakage', 'Change Order Leakage', 'watchdog', 'The scanner flags unbilled extra work. No leakage detected across your active projects.'),
  'WIP Report': ScopedWip,
  'Forecast': ScopedForecast,
  'Closeout': ScopedCloseout,
  'Meetings': scGeneric('Meetings', 'Meetings', 'meet', 'Scheduled client and site meetings for your projects will appear here.'),
  'Bid Requests': scGeneric('Bid Requests', 'Bid Requests', 'bid', 'Send bid requests to subs from a project, and track responses here.'),
  'Procurement': scGeneric('Procurement', 'Procurement', 'cart', 'Material orders and lead-time tracking for your projects will appear here.'),
  'Plan Review': scGeneric('Plan Review', 'AI Plan Review', 'spark', 'Upload plans from a project to run an AI takeoff and code check.'),
  'Quote Comparison': scGeneric('Quote Comparison', 'Quote Comparison', 'quotes', 'Compare sub quotes side-by-side once bids come in for your projects.'),
  'AI Inbox': ScopedInbox,
  'Estimates': scGeneric('Estimates', 'Estimates', 'est', 'Estimates you build for your projects appear here. Start one from a project workspace.'),
  'Proposals': scGeneric('Proposals', 'Proposals', 'proposal', 'Client-ready proposals appear here once you send them from a project.'),
  'Sales Pipeline': ScopedSalesPipeline,
  'Leads': ScopedLeads,
  'Follow-ups': ScopedFollowups,
  'Marketing': ScopedMarketing,
  'Financing': scGeneric('Financing', 'Client Financing', 'finance', 'Financing offers you can extend to clients appear here per project, based on the contract amount.'),
  'Subs & Vendors': ScopedVendors,
  'Takeoff': scGeneric('Takeoff', 'Plan Takeoff', 'ruler', 'Upload a plan set from a project to measure areas, lengths, and counts for your estimate.'),
  'Audit Log': scGeneric('Audit Log', 'Audit Log', 'ledger', 'A tamper-proof record of every change appears here as you and your team work across projects.'),
  'Time': ScopedTime,
  'Capacity': ScopedCapacity,
  'Photos': ScopedPhotos,
  'Documents': ScopedDocuments,
};

// wrapper: scoped view when custom active projects exist, else the sample screen.
// In the clean build there are no sample projects, so always use the scoped view - it
// renders honest empty states instead of the Henderson demo.
window.bqScoped = function (name, Sample) {
  return function (props) {
    const acts = window.bqProj ? window.bqProj.actives() : [];
    const S = window.BQ_SCOPED && window.BQ_SCOPED[name];
    if ((acts.length || window.bqClean()) && S) return React.createElement(S, { acts: acts });
    return React.createElement(Sample, props);
  };
};
