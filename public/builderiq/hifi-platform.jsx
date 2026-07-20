// Hi-fi Platform (Phase 4) - shell + shared helpers + panels 1–5
window.BQ_PANELS = window.BQ_PANELS || {};

// ── shared platform helpers (exposed for panel file 2) ──
function PfToggle({ on, onClick }) {
  return (
    <button onClick={onClick} style={{ width: 40, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer', background: on ? 'var(--bq-ai)' : 'var(--bq-border-strong)', position: 'relative', flex: 'none', transition: 'background .15s' }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 19 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .15s' }}></span>
    </button>
  );
}
function PfCode({ children }) {
  return (
    <pre style={{ margin: 0, background: '#26231E', color: '#E7E2D9', borderRadius: 14, padding: '14px 16px', fontSize: 12.5, lineHeight: 1.6, fontFamily: "'Roboto Mono', ui-monospace, monospace", overflow: 'auto', whiteSpace: 'pre' }}>{children}</pre>
  );
}
function PfHead({ title, sub, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 220 }}>
        <div className="bq-display" style={{ fontSize: 21 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--bq-muted)', maxWidth: 560, lineHeight: 1.45 }}>{sub}</div>
      </div>
      {children}
    </div>
  );
}
function PfCardHead({ children, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <span style={{ fontWeight: 700, fontSize: 14.5 }}>{children}</span>
      {right ? <span style={{ marginLeft: 'auto' }}>{right}</span> : null}
    </div>
  );
}
Object.assign(window, { PfToggle, PfCode, PfHead, PfCardHead });

const MTAG = { GET: 'ai', POST: 'good', PATCH: 'brand', DELETE: 'brand' };
function Method({ m }) { return <span className={'bq-chip ' + MTAG[m]} style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 10.5, padding: '0 7px' }}>{m}</span>; }

// ════════ 1 · API & DEVELOPER PORTAL ════════
function DevPanel() {
  const [sandbox, setSandbox] = React.useState(false);
  const [revealed, setRevealed] = React.useState(false);
  const live = 'bq_live_sk_9f2c••••••••••••••••4a7e';
  const sand = 'bq_test_sk_0b13••••••••••••••••e29d';
  const ENDPOINTS = [
    ['contacts', ['GET', 'POST']], ['leads', ['GET', 'POST']], ['opportunities', ['GET', 'PATCH']],
    ['projects', ['GET', 'POST', 'PATCH']], ['estimates', ['GET', 'POST']], ['estimate_line_items', ['GET', 'POST', 'PATCH', 'DELETE']],
    ['proposals', ['GET', 'POST']], ['cost_codes', ['GET', 'POST']], ['price_book_items', ['GET', 'POST', 'PATCH']],
    ['budgets', ['GET']], ['budget_line_items', ['GET', 'PATCH']], ['change_orders', ['GET', 'POST']],
    ['tasks', ['GET', 'POST', 'PATCH', 'DELETE']], ['schedule_items', ['GET', 'PATCH']], ['selections', ['GET', 'PATCH']],
    ['daily_logs', ['GET', 'POST']], ['files', ['GET', 'POST']], ['photos', ['GET', 'POST']],
    ['invoices', ['GET', 'POST']], ['expenses', ['GET', 'POST']], ['payments', ['GET']],
    ['notifications', ['GET']], ['ai_suggestions', ['GET']],
  ];
  const usage = [42, 61, 38, 70, 55, 88, 34, 49, 72, 60, 45, 91, 58, 40];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
      <PfHead title="API & developer portal" sub="REST API v1 for every core object. JSON responses, API keys + OAuth-ready, per-company scoping, pagination, filtering, sorting, rate limits, and audit logging.">
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ fontSize: 12.5, color: 'var(--bq-muted)', fontWeight: 600 }}>Sandbox mode</span>
          <PfToggle on={sandbox} onClick={() => setSandbox((s) => !s)}></PfToggle>
        </div>
      </PfHead>

      {sandbox ? <div className="bq-ai-card" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px' }}><BqIcon d={BQ_GLYPH.code} size={15} style={{ color: 'var(--bq-ai-strong)' }}></BqIcon><span style={{ fontSize: 12.5, color: 'var(--bq-ink)' }}>Sandbox active - requests hit seeded test data and never touch production records.</span></div> : null}

      {/* keys */}
      <div style={{ display: 'flex', gap: 'calc(12px * var(--bq-sp))', flexWrap: 'wrap' }}>
        {[['Live key', live, 'var(--bq-brand)'], ['Sandbox key', sand, 'var(--bq-ai)']].map(([label, key, c]) => (
          <div key={label} className="bq-card-s" style={{ flex: '1 1 300px', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: c }}></span>
              <span style={{ fontWeight: 700, fontSize: 13.5 }}>{label}</span>
              <span className="bq-chip" style={{ marginLeft: 'auto' }}>{label === 'Live key' ? 'Production' : 'Test'}</span>
            </div>
            <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12.5, background: 'var(--bq-subtle)', borderRadius: 10, padding: '9px 12px', color: 'var(--bq-ink)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {revealed ? key.replace(/•+/, label === 'Live key' ? '9f2c1a8b4e7e' : '0b13c7a4e29d') : key}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button className="bq-btn sm" onClick={() => setRevealed((r) => !r)}>{revealed ? 'Hide' : 'Reveal'}</button>
              <button className="bq-btn sm">Copy</button>
              <button className="bq-btn ghost sm" style={{ marginLeft: 'auto', color: 'var(--bq-brand-strong)' }}>Rotate</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 'calc(16px * var(--bq-sp))', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* endpoints */}
        <div className="bq-card-s" style={{ flex: '1 1 360px', overflow: 'hidden', padding: '14px 16px' }}>
          <PfCardHead right={<span className="bq-chip ai">v1</span>}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>Endpoints <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 11.5, color: 'var(--bq-faint)', fontWeight: 500 }}>api.builderiq.com/v1</span></span></PfCardHead>
          <div style={{ maxHeight: 320, overflow: 'auto', margin: '0 -16px -14px' }}>
            {ENDPOINTS.map(([obj, methods]) => (
              <div key={obj} className="bq-trow" style={{ gridTemplateColumns: '1fr auto', padding: '8px 16px' }}>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12.5, color: 'var(--bq-ink)' }}>/{obj}</span>
                <span style={{ display: 'flex', gap: 4 }}>{methods.map((m) => <Method key={m} m={m}></Method>)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* right column */}
        <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 'calc(12px * var(--bq-sp))' }}>
          <div className="bq-card-s" style={{ padding: '14px 16px' }}>
            <PfCardHead>Example request</PfCardHead>
            <PfCode>{`curl https://api.builderiq.com/v1/projects \\
  -H "Authorization: Bearer bq_live_sk_…" \\
  -G -d "status=active" \\
  -d "sort=-updated_at" -d "limit=25"`}</PfCode>
          </div>
          <div className="bq-card-s" style={{ padding: '14px 16px' }}>
            <PfCardHead right={<span className="bq-num" style={{ fontSize: 14 }}>1,284 / 10k</span>}>API usage today</PfCardHead>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 56 }}>
              {usage.map((v, i) => <div key={i} style={{ flex: 1, height: v + '%', background: i === 11 ? 'var(--bq-brand)' : 'var(--bq-ai)', borderRadius: 3, opacity: 0.45 + v / 180 }}></div>)}
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', marginTop: 8 }}>Rate limit 600 req/min · resets hourly · 429 on exceed</div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="bq-btn primary sm"><BqIcon d={BQ_GLYPH.exports} size={13}></BqIcon>Download OpenAPI 3.1</button>
            <button className="bq-btn sm">API docs</button>
            <button className="bq-btn sm">Changelog</button>
          </div>
        </div>
      </div>

      {/* changelog */}
      <div className="bq-card-s" style={{ padding: '14px 16px' }}>
        <PfCardHead>Changelog</PfCardHead>
        {[['v1.3', 'Jun 2026', 'Added /selections PATCH + budget.variance_detected webhook.'], ['v1.2', 'May 2026', 'Cursor pagination on all list endpoints; new ai_suggestions resource.'], ['v1.0', 'Mar 2026', 'Public API v1 GA - 23 core resources, API keys + audit logs.']].map(([v, d, body], i) => (
          <div key={v} style={{ display: 'flex', gap: 12, padding: '8px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
            <span className="bq-chip ai" style={{ flex: 'none', fontFamily: "'Roboto Mono', monospace" }}>{v}</span>
            <span style={{ fontSize: 12, color: 'var(--bq-faint)', flex: 'none', width: 64 }}>{d}</span>
            <span style={{ fontSize: 13, color: 'var(--bq-ink)', lineHeight: 1.45 }}>{body}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════ 2 · WEBHOOKS ════════
function WebhooksPanel() {
  const EVENTS = ['contact.created', 'lead.created', 'opportunity.stage_changed', 'estimate.created', 'proposal.sent', 'proposal.viewed', 'proposal.approved', 'proposal.declined', 'project.created', 'project.updated', 'change_order.created', 'change_order.sent', 'change_order.approved', 'task.created', 'task.completed', 'schedule_item.updated', 'selection.approved', 'daily_log.created', 'invoice.sent', 'invoice.paid', 'expense.created', 'ai_suggestion.created', 'budget.variance_detected'];
  const [subbed, setSubbed] = React.useState(() => new Set(['proposal.approved', 'invoice.paid', 'change_order.approved', 'budget.variance_detected']));
  const [secret, setSecret] = React.useState(false);
  const toggle = (e) => setSubbed((s) => { const n = new Set(s); n.has(e) ? n.delete(e) : n.add(e); return n; });
  const LOGS = [
    ['proposal.approved', '200', 'good', '2m ago', '142ms'],
    ['invoice.paid', '200', 'good', '1h ago', '98ms'],
    ['budget.variance_detected', '500', 'brand', '3h ago', 'retry 2/5'],
    ['change_order.approved', '200', 'good', 'Yesterday', '120ms'],
    ['proposal.viewed', '410', 'brand', 'Yesterday', 'disabled'],
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
      <PfHead title="Webhooks" sub="Subscribe an endpoint to real-time events. Deliveries are signed, retried with backoff, logged, and replayable."></PfHead>

      <div className="bq-card-s" style={{ padding: '14px 16px' }}>
        <PfCardHead right={<span className="bq-chip good">Active</span>}>Endpoint</PfCardHead>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12.5, background: 'var(--bq-subtle)', borderRadius: 10, padding: '9px 12px', flex: '1 1 280px' }}>https://hooks.hartwell.com/builderiq</span>
          <button className="bq-btn sm">Edit</button>
          <button className="bq-btn primary sm"><BqIcon d={BQ_GLYPH.webhook} size={13}></BqIcon>Send test event</button>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginTop: 10 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-faint)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Signing secret</span>
          <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12, background: 'var(--bq-subtle)', borderRadius: 8, padding: '6px 10px' }}>{secret ? 'whsec_7Hk2p9Lm4Qx8…' : 'whsec_••••••••••••••'}</span>
          <button className="bq-btn ghost sm" onClick={() => setSecret((s) => !s)}>{secret ? 'Hide' : 'Reveal'}</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'calc(16px * var(--bq-sp))', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div className="bq-card-s" style={{ flex: '1 1 340px', padding: '14px 16px' }}>
          <PfCardHead right={<span className="bq-chip ai">{subbed.size} subscribed</span>}>Event subscriptions</PfCardHead>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 14px', maxHeight: 300, overflow: 'auto' }}>
            {EVENTS.map((e) => (
              <label key={e} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 2px', cursor: 'pointer' }}>
                <span onClick={() => toggle(e)} style={{ width: 17, height: 17, borderRadius: 5, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: subbed.has(e) ? 'var(--bq-ai)' : '#fff', boxShadow: subbed.has(e) ? 'none' : 'inset 0 0 0 1.5px var(--bq-border-strong)' }}>{subbed.has(e) ? <BqIcon d={BQ_GLYPH.check} size={10} sw={2.8} style={{ color: '#fff' }}></BqIcon> : null}</span>
                <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 11.5, color: 'var(--bq-ink)' }}>{e}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bq-card-s" style={{ flex: '1 1 320px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px 4px' }}><PfCardHead>Delivery logs</PfCardHead></div>
          <div className="bq-trow head" style={{ gridTemplateColumns: '1fr auto auto auto' }}><span>Event</span><span>Code</span><span>When</span><span></span></div>
          {LOGS.map((l, i) => (
            <div key={i} className="bq-trow" style={{ gridTemplateColumns: '1fr auto auto auto', alignItems: 'center' }}>
              <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 11.5, overflow: 'hidden', textOverflow: 'ellipsis' }}>{l[0]}</span>
              <span className={'bq-chip ' + l[2]} style={{ fontFamily: "'Roboto Mono', monospace" }}>{l[1]}</span>
              <span style={{ fontSize: 11.5, color: 'var(--bq-faint)', whiteSpace: 'nowrap' }}>{l[3]}</span>
              <button className="bq-btn ghost sm" style={{ padding: '3px 8px' }}>Replay</button>
            </div>
          ))}
          <div style={{ padding: '10px 16px', fontSize: 11.5, color: 'var(--bq-faint)' }}>Failed deliveries retry 5× with exponential backoff, then disable.</div>
        </div>
      </div>
    </div>
  );
}

// ════════ 3 · INTEGRATION MARKETPLACE ════════
function IntegrationsPanel() {
  const CATS = ['All', 'Accounting', 'Payments', 'Storage', 'Email/Calendar', 'CRM', 'Automation', 'Messaging', 'Document signing'];
  const [cat, setCat] = React.useState('All');
  const INTS = [
    ['QuickBooks Online', 'Accounting', 'Connected', 'bank'], ['Stripe', 'Payments', 'Connected', 'expense'],
    ['Google Drive', 'Storage', 'Connected', 'plug'], ['Dropbox', 'Storage', 'Available', 'plug'],
    ['OneDrive', 'Storage', 'Available', 'plug'], ['Gmail', 'Email/Calendar', 'Connected', 'inbox'],
    ['Outlook', 'Email/Calendar', 'Available', 'inbox'], ['Google Calendar', 'Email/Calendar', 'Available', 'cal'],
    ['Microsoft 365 Calendar', 'Email/Calendar', 'Available', 'cal'], ['HubSpot', 'CRM', 'Available', 'clients'],
    ['Zapier', 'Automation', 'Connected', 'automation'], ['Make', 'Automation', 'Available', 'automation'],
    ['n8n', 'Automation', 'Available', 'automation'], ['Slack', 'Messaging', 'Connected', 'bell'],
    ['Microsoft Teams', 'Messaging', 'Available', 'bell'], ['DocuSign', 'Document signing', 'Available', 'proposal'],
  ];
  const shown = INTS.filter((i) => cat === 'All' || i[1] === cat);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
      <PfHead title="Integration marketplace" sub="Connect BuilderIQ to the tools you already run. New integrations roll out continuously across every category."></PfHead>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {CATS.map((c) => <button key={c} className={'bq-chip' + (cat === c ? ' brand' : '')} onClick={() => setCat(c)} style={{ cursor: 'pointer', border: 'none', font: 'inherit', fontWeight: 600 }}>{c}</button>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'calc(12px * var(--bq-sp))' }}>
        {shown.map(([name, c, status, g]) => (
          <div key={name} className="bq-card-s" style={{ padding: '15px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 38, height: 38, borderRadius: 11, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: status === 'Connected' ? 'var(--bq-ai-soft)' : 'var(--bq-subtle)', color: status === 'Connected' ? 'var(--bq-ai-strong)' : 'var(--bq-muted)' }}><BqIcon d={BQ_GLYPH[g]} size={18}></BqIcon></span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5 }}>{name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>{c}</div>
              </div>
            </div>
            {status === 'Connected'
              ? <button className="bq-btn sm" style={{ width: '100%' }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--bq-good)' }}></span>Connected · Manage</button>
              : <button className="bq-btn soft-ai sm" style={{ width: '100%' }}>Connect</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ════════ 4 · QUICKBOOKS ONLINE SYNC ════════
function QuickBooksPanel() {
  const [syncObjs, setSyncObjs] = React.useState(() => new Set(['Customers', 'Invoices', 'Invoice payments', 'Expenses', 'Products/Services']));
  const OBJS = ['Customers', 'Vendors', 'Invoices', 'Invoice payments', 'Bills', 'Expenses', 'Products/Services', 'Projects/Jobs'];
  const toggle = (o) => setSyncObjs((s) => { const n = new Set(s); n.has(o) ? n.delete(o) : n.add(o); return n; });
  const PREVIEW = [
    ['Invoice INV-0007', 'Create', 'good', '$27,960'], ['Invoice INV-0006', 'Skip (synced)', 'muted', '-'],
    ['Payment - Henderson Draw 2', 'Create', 'good', '$37,280'], ['Expense - Ferguson', 'Create', 'good', '$690'],
    ['Customer - Osorio', 'Possible duplicate', 'brand', 'review'],
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
      <PfHead title="QuickBooks Online sync" sub="Company-level OAuth connection. One-way push to QBO first, with optional two-way for selected objects.">
        <button className="bq-btn sm"><span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--bq-good)' }}></span>Connected · Hartwell Builders LLC</button>
      </PfHead>

      <div className="bq-ai-card" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px', boxShadow: 'inset 0 0 0 1px var(--bq-brand-border)', background: 'var(--bq-brand-soft)' }}>
        <BqIcon d="M12 4 L21 19 H3 Z M12 10 V14 M12 16.5 V16.6" size={17} style={{ color: 'var(--bq-brand-strong)', flex: 'none' }}></BqIcon>
        <span style={{ fontSize: 12.5, color: 'var(--bq-brand-strong)', lineHeight: 1.45 }}><b>QuickBooks Online is your accounting system of record.</b> Financial edits should be made in QBO; BuilderIQ pushes records and reconciles, it does not overwrite QBO ledgers.</span>
      </div>

      <div style={{ display: 'flex', gap: 'calc(16px * var(--bq-sp))', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div className="bq-card-s" style={{ flex: '1 1 280px', padding: '14px 16px' }}>
          <PfCardHead>Objects to sync</PfCardHead>
          {OBJS.map((o) => (
            <div key={o} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderTop: o === 'Customers' ? 'none' : '1px solid var(--bq-border)' }}>
              <span style={{ fontSize: 13, flex: 1 }}>{o}</span>
              <PfToggle on={syncObjs.has(o)} onClick={() => toggle(o)}></PfToggle>
            </div>
          ))}
        </div>

        <div style={{ flex: '1 1 360px', display: 'flex', flexDirection: 'column', gap: 'calc(12px * var(--bq-sp))' }}>
          <div className="bq-card-s" style={{ padding: '14px 16px' }}>
            <PfCardHead>Mapping</PfCardHead>
            {[['BuilderIQ cost codes', 'QBO Classes'], ['Price book items', 'QBO Products/Services'], ['Projects', 'QBO Sub-customers']].map(([a, b]) => (
              <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 12.5 }}>
                <span style={{ flex: 1, color: 'var(--bq-ink)' }}>{a}</span>
                <BqIcon d="M5 12 H17 M13 8 L17 12 L13 16" size={14} style={{ color: 'var(--bq-faint)' }}></BqIcon>
                <span style={{ flex: 1, color: 'var(--bq-muted)', textAlign: 'right' }}>{b}</span>
              </div>
            ))}
          </div>
          <div className="bq-card-s" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px 4px' }}><PfCardHead right={<span className="bq-chip ai">Preview</span>}>Sync preview - 5 changes</PfCardHead></div>
            {PREVIEW.map((p, i) => (
              <div key={i} className="bq-trow" style={{ gridTemplateColumns: '1fr auto auto', alignItems: 'center' }}>
                <span style={{ fontSize: 12.5 }}>{p[0]}</span>
                <span className={'bq-chip ' + p[2]}>{p[1]}</span>
                <span className="cell-num" style={{ fontSize: 12.5, width: 70, textAlign: 'right' }}>{p[3]}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 8, padding: '12px 16px' }}>
              <button className="bq-btn primary sm">Push 4 to QuickBooks</button>
              <button className="bq-btn ghost sm">View sync logs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════ 5 · ZAPIER / MAKE / n8n ════════
function AutomationReadyPanel() {
  const TRIGGERS = ['New lead', 'New project', 'Proposal approved', 'Change order approved', 'Task completed', 'Invoice overdue', 'New AI suggestion'];
  const ACTIONS = ['Create lead', 'Create contact', 'Create project', 'Create task', 'Create change order draft', 'Create daily log', 'Create invoice draft', 'Upload file', 'Add project note'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
      <PfHead title="Zapier · Make · n8n" sub="No-code automation across 6,000+ apps. BuilderIQ exposes these triggers and actions to every major automation platform.">
        <div style={{ display: 'flex', gap: 8 }}>
          {['Zapier', 'Make', 'n8n'].map((p) => <button key={p} className="bq-btn soft-ai sm">Connect on {p}</button>)}
        </div>
      </PfHead>
      <div style={{ display: 'flex', gap: 'calc(16px * var(--bq-sp))', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {[['Triggers', 'When this happens in BuilderIQ…', TRIGGERS, 'ai', 'webhook'], ['Actions', 'BuilderIQ does this for you…', ACTIONS, 'good', 'automation']].map(([title, sub, list, tone, g]) => (
          <div key={title} className="bq-card-s" style={{ flex: '1 1 320px', padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: tone === 'ai' ? 'var(--bq-ai-soft)' : 'var(--bq-good-soft)', color: tone === 'ai' ? 'var(--bq-ai-strong)' : 'var(--bq-good)' }}><BqIcon d={BQ_GLYPH[g]} size={16}></BqIcon></span>
              <span style={{ fontWeight: 700, fontSize: 15 }}>{title}</span>
              <span className="bq-chip" style={{ marginLeft: 'auto' }}>{list.length}</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--bq-faint)', marginBottom: 10 }}>{sub}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {list.map((x) => (
                <div key={x} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 11px', background: 'var(--bq-subtle)', borderRadius: 10 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: tone === 'ai' ? 'var(--bq-ai)' : 'var(--bq-good)', flex: 'none' }}></span>
                  <span style={{ fontSize: 13, color: 'var(--bq-ink)' }}>{x}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// editable account field (persists to the profile store)
function AcctField({ label, value, onSave, placeholder, span }) {
  const [v, setV] = React.useState(value || '');
  React.useEffect(() => { setV(value || ''); }, [value]);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, gridColumn: span ? '1 / -1' : 'auto' }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-muted)' }}>{label}</span>
      <input value={v} onChange={(e) => setV(e.target.value)} onBlur={() => onSave((v || '').trim())} placeholder={placeholder} style={{ fontFamily: 'inherit', fontSize: 13.5, color: 'var(--bq-ink)', background: 'var(--bq-card)', border: '1px solid var(--bq-border-strong)', borderRadius: 9, padding: '9px 12px', outline: 'none', width: '100%', boxSizing: 'border-box' }}></input>
    </label>
  );
}

// ════════ 0 · ACCOUNT (company profile + plan + connected apps) ════════
const ACCT_APPS = [
  ['quickbooks', 'QuickBooks Online', 'Sync invoices, expenses & payments', 'bank', 'quickbooks'],
  ['stripe', 'Stripe Payments', 'Collect client card & ACH payments', 'pay', 'integrations'],
  ['gcal', 'Google Calendar', 'Two-way sync for schedule & crews', 'cal', 'integrations'],
  ['gmail', 'Gmail', 'Log client email into the project inbox', 'inbox', 'integrations'],
  ['dropbox', 'Dropbox', 'Back up plans, photos & documents', 'docs', 'integrations'],
  ['companycam', 'CompanyCam', 'Pull field photos into daily logs', 'photo', 'integrations'],
  ['zapier', 'Zapier', 'Automate with 6,000+ apps', 'automation', 'automation'],
];
function AccountPanel() {
  const prof = useBqProfile();
  const save = (patch) => window.__bqProfile.set(patch);
  const acts = window.bqProj ? window.bqProj.actives() : [];
  const clients = window.bqStore ? window.bqStore.read() : [];
  const inProd = acts.reduce((s, x) => s + window.bqProj.total(x.project), 0);
  const money = (n) => '$' + Number(n || 0).toLocaleString('en-US');
  const [apps, setApps] = window.bqPersistState('acct-apps', { quickbooks: true, stripe: true, gcal: true, gmail: true, dropbox: false, companycam: false, zapier: true });
  const connected = ACCT_APPS.filter((a) => apps[a[0]]).length;
  const seats = Math.min(10, Math.max(3, clients.length + 2));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
      <PfHead title="Account" sub="Your company profile, plan, and the apps connected to BuilderIQ - this is what appears on client-facing proposals, invoices, and the portal.">
        <span className="bq-chip good">Pro plan</span>
      </PfHead>
      <div style={{ display: 'flex', gap: 'calc(14px * var(--bq-sp))', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div className="bq-card-s" style={{ flex: '2 1 380px', padding: '16px 18px' }}>
          <PfCardHead right={<span style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>{window.bqCompanyInitials()}</span>}>Company information</PfCardHead>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
            <AcctField label="Company name" span value={prof.company} onSave={(x) => save({ company: x })} placeholder="e.g. Solid Remodel"></AcctField>
            <AcctField label="License #" value={prof.license} onSave={(x) => save({ license: x })} placeholder="e.g. TRCC-12345"></AcctField>
            <AcctField label="Main phone" value={prof.phone} onSave={(x) => save({ phone: x })} placeholder="(512) 555-0100"></AcctField>
            <AcctField label="Business address" span value={prof.address} onSave={(x) => save({ address: x })} placeholder="Street, city, state"></AcctField>
            <AcctField label="Website" value={prof.website} onSave={(x) => save({ website: x })} placeholder="yourcompany.com"></AcctField>
            <AcctField label="Owner email" value={prof.email} onSave={(x) => save({ email: x })} placeholder="name@email.com"></AcctField>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}><BqIcon d={BQ_GLYPH.check} size={13} sw={2.2} style={{ color: 'var(--bq-good)' }}></BqIcon>Saved automatically · shown on proposals, invoices & the client portal</div>
        </div>
        <div style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: 'calc(12px * var(--bq-sp))' }}>
          <div className="bq-card-s" style={{ padding: '16px 18px' }}>
            <PfCardHead right={<button className="bq-btn sm" onClick={() => window.__bqNav && window.__bqNav('Billing')}>Manage</button>}>Plan &amp; billing</PfCardHead>
            {[['Plan', 'Pro · $249/mo'], ['Seats', seats + ' of 10 used'], ['Renews', 'Jul 1, 2026'], ['Owner', prof.display]].map(([k, v], i) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13, padding: '6px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
                <span style={{ color: 'var(--bq-faint)' }}>{k}</span><span style={{ fontWeight: 600, textAlign: 'right' }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="bq-card-s" style={{ padding: '16px 18px' }}>
            <PfCardHead>Workspace</PfCardHead>
            {[['Active projects', String(acts.length)], ['Clients', String(clients.length)], ['In production', money(inProd)], ['Connected apps', connected + ' of ' + ACCT_APPS.length]].map(([k, v], i) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13, padding: '6px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
                <span style={{ color: 'var(--bq-faint)' }}>{k}</span><span className="bq-num" style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bq-card-s" style={{ padding: '16px 18px 6px' }}>
        <PfCardHead right={<button className="bq-btn sm" onClick={() => window.__bqNav && window.__bqNav('Integrations')}>Browse marketplace</button>}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>Connected apps <span className="bq-chip ai">{connected} connected</span></span></PfCardHead>
        {ACCT_APPS.map(([key, name, desc, g], i) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderTop: '1px solid var(--bq-border)' }}>
            <span style={{ width: 38, height: 38, borderRadius: 11, flex: 'none', background: apps[key] ? 'var(--bq-brand-soft)' : 'var(--bq-subtle)', color: apps[key] ? 'var(--bq-brand-strong)' : 'var(--bq-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH[g]} size={18}></BqIcon></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 7 }}>{name}{apps[key] ? <span className="bq-chip good" style={{ padding: '0 7px' }}>Connected</span> : null}</div>
              <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{desc}</div>
            </div>
            <PfToggle on={!!apps[key]} onClick={() => setApps((a) => ({ ...a, [key]: !a[key] }))}></PfToggle>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window.BQ_PANELS, { account: AccountPanel, developers: DevPanel, webhooks: WebhooksPanel, integrations: IntegrationsPanel, quickbooks: QuickBooksPanel, automation: AutomationReadyPanel });

// ════════ SHELL ════════
// Grouped settings rail. A string item opens a panel; a { nav } item routes to a full screen.
const PLATFORM_GROUPS = [
  { label: 'Account', items: [
    ['account', 'Company & account', 'clients'],
    ['billing', 'Billing & plan', 'pay'],
    ['setup', 'Setup checklist', 'rocket'],
  ] },
  { label: 'Team & access', items: [
    ['team', 'Team & users', 'partners'],
    ['permissions', 'Roles & permissions', 'key'],
    ['audit', 'Audit log', 'history'],
  ] },
  { label: 'Integrations', items: [
    ['integrations', 'App marketplace', 'plug'],
    ['quickbooks', 'QuickBooks sync', 'bank'],
    ['automation', 'Automation', 'automation'],
    ['developers', 'API & webhooks', 'code'],
    ['exports', 'Data exports', 'exports'],
  ] },
  { label: 'Enterprise', items: [
    ['security', 'Security', 'watchdog'],
    ['whitelabel', 'White-label portal', 'globe'],
    ['partners', 'Partner accounts', 'partners'],
    ['templates', 'Vertical templates', 'template'],
  ] },
];
// legacy initial keys → the section they now live in
const PLATFORM_ALIAS = { webhooks: 'developers' };
function bqPlatformLabel(sec) {
  for (let i = 0; i < PLATFORM_GROUPS.length; i++) { const it = PLATFORM_GROUPS[i].items.find((x) => x[0] === sec); if (it) return it[1]; }
  return 'Settings';
}

function HifiPlatform({ initial, active }) {
  const [sec, setSec] = React.useState(PLATFORM_ALIAS[initial] || initial || 'account');
  const rowStyle = (on) => ({ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 11, fontSize: 13, fontWeight: on ? 600 : 500, color: on ? 'var(--bq-brand-strong)' : 'var(--bq-muted)', background: on ? 'var(--bq-brand-soft)' : 'transparent', cursor: 'pointer' });
  const renderPanel = () => {
    if (sec === 'developers') return <React.Fragment><DevPanel></DevPanel><div style={{ height: 'calc(14px * var(--bq-sp))', flex: 'none' }}></div><WebhooksPanel></WebhooksPanel></React.Fragment>;
    const P = (window.BQ_PANELS && window.BQ_PANELS[sec]) || (() => <div style={{ padding: 24, color: 'var(--bq-faint)' }}>Coming soon.</div>);
    return <P></P>;
  };
  return (
    <div className="bq-screen">
      <BqTop crumb={'Settings / ' + bqPlatformLabel(sec)}></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active={active === 'Team' ? 'Team' : 'Settings'}></BqSide>
        <div style={{ width: 230, flex: 'none', borderRight: '1px solid var(--bq-border)', background: 'var(--bq-card)', padding: '14px 10px', overflow: 'auto' }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--bq-ink)', padding: '4px 10px 10px' }}>Settings</div>
          {PLATFORM_GROUPS.map((grp) => (
            <div key={grp.label} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-faint)', padding: '8px 10px 4px' }}>{grp.label}</div>
              {grp.items.map(([keyOrNav, lbl, g]) => {
                const isNav = keyOrNav && typeof keyOrNav === 'object';
                const on = !isNav && keyOrNav === sec;
                return (
                  <div key={lbl} onClick={() => isNav ? (window.__bqNav && window.__bqNav(keyOrNav.nav)) : setSec(keyOrNav)} style={rowStyle(on)} onMouseEnter={(e) => { if (!on) e.currentTarget.style.background = 'var(--bq-subtle)'; }} onMouseLeave={(e) => { if (!on) e.currentTarget.style.background = 'transparent'; }}>
                    <BqIcon d={BQ_GLYPH[g]} size={15}></BqIcon><span style={{ flex: 1 }}>{lbl}</span>
                    {isNav ? <BqIcon d="M9 6 L15 12 L9 18" size={13} style={{ color: 'var(--bq-faint)', flex: 'none' }}></BqIcon> : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(20px * var(--bq-sp)) 24px' }}>
          {renderPanel()}
        </main>
      </div>
    </div>
  );
}
window.HifiPlatform = HifiPlatform;
