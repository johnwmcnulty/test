// Admin-only previews - a read-only mirror of the standalone Client / Sub apps + an activity & changes rail.
function AdminActivityRow({ g, tone, body, when, top }) {
  const col = { good: 'var(--bq-good)', ai: 'var(--bq-ai-strong)', warn: 'var(--bq-brand-strong)', muted: 'var(--bq-faint)' }[tone] || 'var(--bq-muted)';
  return (
    <div style={{ display: 'flex', gap: 11, padding: '11px 0', borderTop: top ? '1px solid var(--bq-border)' : 'none' }}>
      <span style={{ width: 28, height: 28, borderRadius: 8, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', color: col, boxShadow: 'inset 0 0 0 1px var(--bq-border)' }}><BqIcon d={BQ_GLYPH[g] || BQ_GLYPH.bell} size={14}></BqIcon></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: 'var(--bq-ink)', lineHeight: 1.4 }}>{body}</div>
        <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', marginTop: 1 }}>{when}</div>
      </div>
    </div>
  );
}

function AdminPreview({ channel, active, crumb, title, sub, src, url, openHref, changes, activity }) {
  const [device, setDevice] = React.useState('desktop');
  const live = useBqEvents(channel);
  const liveActivity = live.map((e) => ({ g: e.g, tone: e.tone, body: e.body, when: bqRel(e.ts) }));
  const allActivity = [...liveActivity, ...activity];
  const allChanges = [...live.map((e) => e.change || e.body), ...changes];
  return (
    <div className="bq-screen">
      <BqTop crumb={crumb}></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active={active}></BqSide>
        <main style={{ flex: 1, overflow: 'hidden', padding: 'calc(16px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div className="bq-display" style={{ fontSize: 21 }}>{title}</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>{sub}</div>
            </div>
            <span className="bq-chip ai"><BqIcon d="M7 11 V8 a5 5 0 0 1 10 0 V11 M5 11 H19 a1 1 0 0 1 1 1 V20 a1 1 0 0 1-1 1 H5 a1 1 0 0 1-1-1 V12 a1 1 0 0 1 1-1 Z" size={12}></BqIcon>Admin-only mirror</span>
            <div className="seg-toggle">
              <button className={device === 'desktop' ? 'on' : ''} onClick={() => setDevice('desktop')}>Desktop</button>
              <button className={device === 'phone' ? 'on' : ''} onClick={() => setDevice('phone')}>Phone</button>
            </div>
            <a className="bq-btn primary sm" href={openHref} target="_blank" rel="noopener">Open real app ↗</a>
          </div>

          <div style={{ flex: 1, display: 'flex', gap: 'calc(16px * var(--bq-sp))', overflow: 'hidden' }}>
            {/* live mirror in a window/phone frame */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
              <div style={{ width: device === 'phone' ? 412 : '100%', maxWidth: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: device === 'phone' ? 28 : 14, overflow: 'hidden', boxShadow: '0 10px 34px rgba(38,35,30,0.14), 0 0 0 1px var(--bq-border)' }}>
                <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', background: 'var(--bq-subtle)', borderBottom: '1px solid var(--bq-border)' }}>
                  <span style={{ display: 'flex', gap: 5 }}><span style={{ width: 9, height: 9, borderRadius: '50%', background: '#E5685A' }}></span><span style={{ width: 9, height: 9, borderRadius: '50%', background: '#E8B84B' }}></span><span style={{ width: 9, height: 9, borderRadius: '50%', background: '#69A85C' }}></span></span>
                  <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 7, background: '#fff', borderRadius: 999, padding: '4px 12px', fontSize: 11.5, color: 'var(--bq-faint)', boxShadow: 'inset 0 0 0 1px var(--bq-border)', maxWidth: 360, margin: '0 auto' }}>
                    <BqIcon d="M7 11 V8 a5 5 0 0 1 10 0 V11 M5 11 H19 V20 H5 Z" size={11}></BqIcon>{url}
                  </span>
                  <span className="bq-chip good" style={{ flex: 'none' }}>● Live</span>
                </div>
                <iframe src={src} title={title} style={{ flex: 1, width: '100%', border: 'none', background: '#fff' }}></iframe>
              </div>
            </div>

            {/* activity rail */}
            <aside style={{ width: 322, flex: 'none', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))', padding: '3px 5px' }}>
              <div className="bq-ai-card" style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <BqSpark size={14}></BqSpark>
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--bq-ai-strong)' }}>What's changed</span>
                  <span className="bq-chip solid-ai" style={{ marginLeft: 'auto' }}>{allChanges.length} new</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {allChanges.map((c, i) => (
                    <div key={i} style={{ display: 'flex', gap: 9, fontSize: 12.5, color: 'var(--bq-ink)', lineHeight: 1.4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--bq-ai)', flex: 'none', marginTop: 6 }}></span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bq-card-s" style={{ padding: '8px 16px 12px' }}>
                {allActivity.length ? <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)', padding: '10px 0 2px' }}>Activity</div> : null}
                {allActivity.length ? allActivity.map((a, i) => <AdminActivityRow key={i} {...a} top={i > 0}></AdminActivityRow>) : <div style={{ fontSize: 12.5, color: 'var(--bq-faint)', padding: '14px 0' }}>No activity yet - actions the {channel === 'sub' ? 'sub' : 'client'} takes in the portal show up here in real time.</div>}
              </div>

              <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', lineHeight: 1.5, padding: '0 2px' }}>
                Read-only mirror of exactly what they see. Your costs, margin, internal notes, and other clients are never shown here.
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}

function HifiClientPreview() {
  const clean = window.bqClean();
  const src = clean ? 'BuilderIQ Client (Clean).html' : 'BuilderIQ Client.html';
  const acts = window.bqProj ? window.bqProj.actives() : [];
  if (acts.length) {
    const x = acts[0];
    const last = String(x.client.name).split(/\s+/).pop().toLowerCase();
    return (
      <AdminPreview
        channel="client"
        active="Client view"
        crumb="Client view"
        title={'Client view - ' + x.client.name}
        sub={'Live mirror of the homeowner app for ' + x.project.title}
        src={src}
        url={'portal.builderiq.com/' + last}
        openHref={src}
        changes={[]}
        activity={[]}
      ></AdminPreview>
    );
  }
  if (clean) {
    return (
      <AdminPreview
        channel="client"
        active="Client view"
        crumb="Client view"
        title="Client view"
        sub="Live mirror of the homeowner portal - shows a client's project once you start one"
        src={src}
        url="portal.builderiq.com"
        openHref={src}
        changes={[]}
        activity={[]}
      ></AdminPreview>
    );
  }
  return (
    <AdminPreview
      channel="client"
      active="Client view"
      crumb="Client view"
      title="Client view - Dan & Priya Henderson"
      sub="Live mirror of the homeowner app for Kitchen + Hall Bath"
      src="BuilderIQ Client.html"
      url="portal.builderiq.com/henderson"
      openHref="BuilderIQ Client.html"
      changes={[
        'Approved Change Order #4 - contract is now $197,490',
        'Submitted faucet selection: matte black (+$40)',
        '1 unread message from Priya about the countertop template',
      ]}
      activity={[
        { g: 'co', tone: 'good', body: 'Approved & signed Change Order #4 (recessed hallway lighting)', when: '1h ago' },
        { g: 'inbox', tone: 'ai', body: 'Sent a message: “matte black faucet - too late to switch?”', when: '2h ago' },
        { g: 'select', tone: 'good', body: 'Chose hall-bath faucet - matte black Kohler', when: '2h ago' },
        { g: 'invoice', tone: 'good', body: 'Paid Draw 2 - $37,280 (ACH)', when: '3d ago' },
        { g: 'log', tone: 'muted', body: 'Viewed the Week 6 update', when: '3d ago' },
        { g: 'sign', tone: 'good', body: 'Signed the prime contract', when: 'Apr 18' },
      ]}
    ></AdminPreview>
  );
}

function HifiSubPreview() {
  const clean = window.bqClean();
  const src = clean ? 'BuilderIQ Sub (Clean).html' : 'BuilderIQ Sub.html';
  if (clean) {
    return (
      <AdminPreview
        channel="sub"
        active="Sub access"
        crumb="Sub access"
        title="Sub access"
        sub="Live mirror of the subcontractor portal - shows a sub's scope once you invite one"
        src={src}
        url="portal.builderiq.com/sub"
        openHref={src}
        changes={[]}
        activity={[]}
      ></AdminPreview>
    );
  }
  const hasCustom = window.bqProj && window.bqProj.actives().length > 0;
  return (
    <AdminPreview
      channel="sub"
      active="Sub access"
      crumb="Sub access"
      title="Sub access - Vargas Framing"
      sub="Live mirror of the subcontractor portal · framing / structural"
      src="BuilderIQ Sub.html"
      url="portal.builderiq.com/sub/vargas"
      openHref="BuilderIQ Sub.html"
      changes={hasCustom ? [] : [
        'Marked “Beam install - kitchen opening” complete',
        'Replied about the cloth-wiring material list (due Friday)',
        'Accepted the Osorio primary-suite framing assignment',
      ]}
      activity={hasCustom ? [] : [
        { g: 'check', tone: 'good', body: 'Completed task: Beam install - kitchen opening', when: '1d ago' },
        { g: 'inbox', tone: 'ai', body: 'Replied to Maria: “quantities by EOD Thursday”', when: '1d ago' },
        { g: 'photo', tone: 'muted', body: 'Viewed the Henderson framing plan', when: '2d ago' },
        { g: 'task', tone: 'good', body: 'Accepted assignment: frame Osorio primary suite', when: '4d ago' },
        { g: 'hardhat', tone: 'muted', body: 'Logged in for the first time', when: '1w ago' },
      ]}
    ></AdminPreview>
  );
}

Object.assign(window, { HifiClientPreview, HifiSubPreview });
