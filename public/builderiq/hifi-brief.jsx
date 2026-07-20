// Hi-fi Dashboard AI Daily Brief - an everything-overview the admin reads each morning.
function BriefPanel({ icon, title, nav, rows }) {
  const dot = (t) => ({ good: 'var(--bq-good)', warn: 'var(--bq-brand)', ai: 'var(--bq-ai)', muted: 'var(--bq-faint)' }[t] || 'var(--bq-faint)');
  return (
    <div style={{ background: 'var(--bq-card)', borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--bq-border)', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 24, height: 24, borderRadius: 7, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-subtle)', color: 'var(--bq-muted)' }}><BqIcon d={BQ_GLYPH[icon]} size={13}></BqIcon></span>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--bq-faint)', flex: 1 }}>{title}</span>
        {nav ? <button onClick={() => window.__bqNav && window.__bqNav(nav)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--bq-faint)', padding: 2 }}><BqIcon d="M9 6 L15 12 L9 18" size={13}></BqIcon></button> : null}
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot(r[1]), flex: 'none', marginTop: 6 }}></span>
          <span style={{ fontSize: 12.5, color: 'var(--bq-ink)', lineHeight: 1.4 }}>{r[0]}{r[2] ? <span style={{ color: 'var(--bq-faint)' }}> · {r[2]}</span> : null}</span>
        </div>
      ))}
    </div>
  );
}

function HifiDailyBrief() {
  const cEv = (typeof useBqEvents !== 'undefined') ? useBqEvents('client') : [];
  const sEv = (typeof useBqEvents !== 'undefined') ? useBqEvents('sub') : [];
  const fEv = (typeof useBqEvents !== 'undefined') ? useBqEvents('field') : [];
  window.bqUseNewClients && window.bqUseNewClients();
  const acts = window.bqProj ? window.bqProj.actives() : [];
  const allP = window.bqProj ? window.bqProj.list() : [];
  const hasReal = acts.length > 0;
  const money = (n) => '$' + Number(n || 0).toLocaleString('en-US');
  const live = [
    ...cEv.map((e) => ({ who: 'Client', body: e.body, tone: e.tone, ts: e.ts })),
    ...sEv.map((e) => ({ who: 'Sub', body: e.body, tone: e.tone, ts: e.ts })),
    ...fEv.map((e) => ({ who: 'Field', body: e.body, tone: e.tone, ts: e.ts })),
  ].sort((a, b) => b.ts - a.ts).slice(0, 4);

  // ---- store-driven brief (only your real projects) ----
  if (hasReal) {
    const totalProd = acts.reduce((s, x) => s + window.bqProj.total(x.project), 0);
    const collected = acts.reduce((s, x) => s + window.bqProj.paid(x.project), 0);
    const unpaid = totalProd - collected;
    const pipe = allP.filter((x) => ['New lead', 'Estimating', 'Proposal sent'].includes(x.project.stage));
    const pipeVal = pipe.reduce((s, x) => s + (Number(x.project.contract) || 0), 0);
    const pendingCOs = acts.reduce((n, x) => n + (x.project.cos || []).filter((co) => co.status === 'sent').length, 0);
    const dueDraws = [];
    acts.forEach((x) => (x.project.draws || []).forEach((d) => { if (d.status === 'due') dueDraws.push({ x, d }); }));
    const nextMsPair = acts.map((x) => ({ x, m: (x.project.milestones || []).find((m) => !m.done) })).find((o) => o.m);
    const n = acts.length;
    const activityRows = live.length ? live.map((e) => [e.who + ': ' + e.body, e.tone, bqRel(e.ts)]) : [['No recent client, sub or field activity yet', 'muted', '']];
    const focus = [];
    if (pendingCOs) focus.push(['Follow up on ' + pendingCOs + ' change order' + (pendingCOs > 1 ? 's' : '') + ' awaiting client sign-off', 'Change Orders']);
    if (dueDraws.length) focus.push(['Collect ' + dueDraws.length + ' draw' + (dueDraws.length > 1 ? 's' : '') + ' now due (' + money(dueDraws.reduce((s, o) => s + Number(o.d.amount || 0), 0)) + ')', 'Invoices']);
    if (nextMsPair) focus.push(['Keep ' + window.bqProj.shortName(nextMsPair.x.client, nextMsPair.x.project) + ' moving: ' + nextMsPair.m.t, 'Projects']);
    if (pipe.length) focus.push([pipe.length + ' project' + (pipe.length > 1 ? 's' : '') + ' in the pipeline to advance', 'Projects']);
    while (focus.length < 1) focus.push(['You\'re all caught up - nothing needs you right now', 'Projects']);
    return (
      <React.Fragment>
        <section className="bq-ai-card ai-expanded" style={{ padding: 'calc(15px * var(--bq-sp)) 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="bq-sechead">
            <BqSpark size={16}></BqSpark>
            <span className="t" style={{ color: 'var(--bq-ai-strong)' }}>Daily brief</span>
            <button className="a" style={{ color: 'var(--bq-ai-strong)', marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', fontWeight: 600 }} onClick={() => window.__bqCmdOpen && window.__bqCmdOpen()}>Ask BuilderIQ</button>
          </div>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--bq-ink)' }}>
            You have <b>{n}</b> active project{n !== 1 ? 's' : ''} worth <b>{money(totalProd)}</b> - <b>{money(collected)}</b> collected, <b>{money(unpaid)}</b> still outstanding.{pendingCOs ? <span> <b>{pendingCOs}</b> change order{pendingCOs > 1 ? 's are' : ' is'} waiting on client sign-off.</span> : null}{nextMsPair ? <span> Next up on {window.bqProj.shortName(nextMsPair.x.client, nextMsPair.x.project)}: <b>{nextMsPair.m.t}</b>.</span> : null}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(228px, 1fr))', gap: 10 }}>
            <BriefPanel icon="watchdog" title="Money" nav="Invoices" rows={[
              [money(unpaid) + ' outstanding', unpaid > 0 ? 'warn' : 'good', dueDraws.length ? dueDraws.length + ' draw(s) due' : 'nothing overdue'],
              [money(collected) + ' collected', 'good', ''],
              [money(totalProd) + ' contract value', 'muted', ''],
            ]}></BriefPanel>
            <BriefPanel icon="leads" title="Pipeline" nav="Projects" rows={pipe.length ? pipe.slice(0, 3).map((x) => [x.client.name + ' - ' + x.project.title, 'ai', x.project.stage]) : [['No projects in the pipeline', 'muted', '']]}></BriefPanel>
            <BriefPanel icon="projects" title="Projects & schedule" nav="Projects" rows={acts.slice(0, 3).map((x) => [window.bqProj.shortName(x.client, x.project), 'good', window.bqProj.pct(x.project) + '% · ' + x.project.stage])}></BriefPanel>
            <BriefPanel icon="clients" title="Client & sub activity" nav="Client view" rows={activityRows}></BriefPanel>
          </div>
          <div style={{ background: 'var(--bq-card)', borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)', padding: '12px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--bq-ai-strong)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><BqSpark size={12}></BqSpark>Today's focus</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {focus.map(([t, nav], i) => (
                <button key={i} onClick={() => window.__bqNav && window.__bqNav(nav)} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 10px', borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bq-ai-soft)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <span style={{ width: 20, height: 20, borderRadius: 6, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-ai-soft)', color: 'var(--bq-ai-strong)', fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--bq-ink)' }}>{t}</span>
                  <BqIcon d="M9 6 L15 12 L9 18" size={14} style={{ color: 'var(--bq-faint)' }}></BqIcon>
                </button>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--bq-faint)', display: 'flex', alignItems: 'center', gap: 5 }}><BqSpark size={11}></BqSpark>Synthesized by BuilderIQ across your jobs</div>
        </section>
        <div className="ai-collapsed" style={{ alignItems: 'center', gap: 10 }}>
          <span className="bq-chip ai"><BqSpark size={11}></BqSpark>Daily brief</span>
          <span style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{n} active · {money(unpaid)} outstanding{pendingCOs ? ' · ' + pendingCOs + ' CO awaiting client' : ''}</span>
        </div>
      </React.Fragment>
    );
  }

  // ---- sample fallback (no custom clients) ----
  const activityRows = live.length
    ? live.map((e) => [e.who + ': ' + e.body, e.tone, bqRel(e.ts)])
    : [
        ['Henderson approved Change Order #4', 'good', '1h ago'],
        ['Henderson picked the matte-black faucet', 'good', '2h ago'],
        ['Vargas Framing completed beam install', 'good', '1d ago'],
        ['1 unread message from Priya', 'ai', '2h ago'],
      ];

  return (
    <React.Fragment>
      <section className="bq-ai-card ai-expanded" style={{ padding: 'calc(15px * var(--bq-sp)) 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="bq-sechead">
          <BqSpark size={16}></BqSpark>
          <span className="t" style={{ color: 'var(--bq-ai-strong)' }}>Daily brief</span>
          <span className="bq-chip ai">Tue · Jun 9 · 7:00 AM</span>
          <button className="a" style={{ color: 'var(--bq-ai-strong)', marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', fontWeight: 600 }} onClick={() => window.__bqCmdOpen && window.__bqCmdOpen()}>Ask BuilderIQ</button>
        </div>

        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--bq-ink)' }}>
          Cash is healthy at <b>$486K</b> with <b>9 jobs</b> in production. Three jobs are drifting on margin - <b>Henderson</b> plumbing labor and <b>Chen's</b> tile allowance need a look - and <b>$27,280</b> is overdue across two invoices. Henderson just approved <b>Change Order #4</b>, so their contract is now <b>$197,490</b>. Today: chase the two overdue invoices, lock the Henderson countertop date, and send the Tran proposal.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(228px, 1fr))', gap: 10 }}>
          <BriefPanel icon="watchdog" title="Money & margin" nav="Watchdog" rows={[
            ['$112.6K unpaid', 'warn', '2 overdue · $27,280'],
            ['$21,840 margin at risk', 'warn', '3 jobs drifting'],
            ['Draw 3 due Jun 22', 'muted', '$27,960'],
          ]}></BriefPanel>
          <BriefPanel icon="leads" title="Pipeline" nav="Leads" rows={[
            ['11 leads · $1.24M', 'ai', ''],
            ['4 proposals out', 'ai', 'Tanaka viewed 3×'],
            ['Tran attic - follow up', 'muted', 'referral'],
          ]}></BriefPanel>
          <BriefPanel icon="projects" title="Projects & schedule" nav="Schedule" rows={[
            ['9 active jobs', 'good', 'Henderson wk 6 of 14'],
            ['Cabinets arrive Tue', 'muted', 'countertop template Wed'],
            ['Osorio framing starts', 'muted', 'Jun 23'],
          ]}></BriefPanel>
          <BriefPanel icon="clients" title="Client & sub activity" nav="Client view" rows={activityRows}></BriefPanel>
        </div>

        <div style={{ background: 'var(--bq-card)', borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)', padding: '12px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--bq-ai-strong)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><BqSpark size={12}></BqSpark>Today's focus</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {[['Chase the 2 overdue invoices', '$27,280 · oldest 11 days', 'Invoices'], ['Confirm Henderson countertop template window', "Wed visit - they need to be home", 'Schedule'], ['Send the Tran attic proposal', 'referral from Henderson · fit 8/10', 'Proposals']].map(([t, s, nav], i) => (
              <button key={i} onClick={() => window.__bqNav && window.__bqNav(nav)} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '8px 10px', borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer', font: 'inherit', textAlign: 'left' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bq-ai-soft)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                <span style={{ width: 20, height: 20, borderRadius: 6, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-ai-soft)', color: 'var(--bq-ai-strong)', fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                <span style={{ flex: 1 }}><span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--bq-ink)' }}>{t}</span><span style={{ display: 'block', fontSize: 11.5, color: 'var(--bq-faint)' }}>{s}</span></span>
                <BqIcon d="M9 6 L15 12 L9 18" size={14} style={{ color: 'var(--bq-faint)' }}></BqIcon>
              </button>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 11, color: 'var(--bq-faint)', display: 'flex', alignItems: 'center', gap: 5 }}><BqSpark size={11}></BqSpark>Synthesized by BuilderIQ across all your jobs · projections - verify before acting</div>
      </section>

      <div className="ai-collapsed" style={{ alignItems: 'center', gap: 10 }}>
        <span className="bq-chip ai"><BqSpark size={11}></BqSpark>Daily brief</span>
        <span style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>$27,280 overdue · 3 jobs drifting · Henderson approved CO #4 · send Tran proposal</span>
      </div>
    </React.Fragment>
  );
}
window.HifiDailyBrief = HifiDailyBrief;
