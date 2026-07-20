// Hi-fi Platform (Phase 4) - panels 6–11. Loaded after hifi-platform.jsx (uses window helpers).
(function () {
  const { PfToggle, PfHead, PfCardHead } = window;

  // ════════ 6 · BI & DATA EXPORTS ════════
  function ExportsPanel() {
    const EXPORTS = [
      ['Project profitability', 'Revenue, cost, margin by project', 'reports'],
      ['Budget vs actual', 'Per cost code, all active jobs', 'expense'],
      ['Invoices & payments', 'AR aging, payment history', 'invoice'],
      ['Change orders', 'Status, value, approval rate', 'co'],
      ['Selections', 'Decisions, allowance variance', 'select'],
      ['Task performance', 'Completion, overdue by assignee', 'task'],
      ['Audit log', 'Every financial / AI / approval action', 'watchdog'],
      ['Estimates & proposals', 'Win rate, turnaround, margin', 'estimate'],
    ];
    const [fmt, setFmt] = React.useState('CSV');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
        <PfHead title="BI & data exports" sub="Your data is yours. Export anything to CSV or Excel, schedule email reports, or stream to a warehouse-ready destination.">
          <div className="seg-toggle">
            {['CSV', 'Excel', 'Warehouse'].map((f) => <button key={f} className={fmt === f ? 'on' : ''} onClick={() => setFmt(f)}>{f}</button>)}
          </div>
        </PfHead>

        {fmt === 'Warehouse' ? (
          <div className="bq-ai-card" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px' }}>
            <BqIcon d={BQ_GLYPH.bank} size={16} style={{ color: 'var(--bq-ai-strong)', flex: 'none' }}></BqIcon>
            <span style={{ fontSize: 12.5, color: 'var(--bq-ink)' }}>Warehouse-ready export delivers newline-delimited JSON to S3, BigQuery, or Snowflake on a schedule - ideal for Looker, Power BI, or Tableau.</span>
          </div>
        ) : null}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'calc(12px * var(--bq-sp))' }}>
          {EXPORTS.map(([name, sub, g]) => (
            <div key={name} className="bq-card-s" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 34, height: 34, borderRadius: 10, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-subtle)', color: 'var(--bq-muted)' }}><BqIcon d={BQ_GLYPH[g]} size={16}></BqIcon></span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', lineHeight: 1.35 }}>{sub}</div>
              </div>
              <button className="bq-btn ghost sm" style={{ padding: 7 }}><BqIcon d={BQ_GLYPH.exports} size={15}></BqIcon></button>
            </div>
          ))}
        </div>

        <div className="bq-card-s" style={{ padding: '14px 16px' }}>
          <PfCardHead right={<button className="bq-btn soft-ai sm">New scheduled report</button>}>Scheduled reports</PfCardHead>
          {[['Weekly profitability - every Monday 7am', window.bqClean() ? 'to owner@yourcompany.com' : 'to owner@hartwell.com', 'good'], ['Monthly AR aging - 1st of month', window.bqClean() ? 'to accounting@yourcompany.com' : 'to accounting@hartwell.com', 'good']].map(([t, who, tone], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--bq-good)', flex: 'none' }}></span>
              <span style={{ fontSize: 13, flex: 1 }}>{t} <span style={{ color: 'var(--bq-faint)' }}>· {who}</span></span>
              <PfToggle on={true}></PfToggle>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ════════ 7 · ROLES & PERMISSIONS ════════
  function PermissionsPanel() {
    const ROLES = ['Owner', 'Admin', 'PM', 'Estimator', 'Field', 'Accounting', 'Sub', 'Client'];
    const AREAS = [
      ['View financials', [1, 1, 1, 1, 0, 1, 0, 0]], ['Edit financials', [1, 1, 0, 0, 0, 1, 0, 0]],
      ['View margin', [1, 1, 1, 0, 0, 1, 0, 0]], ['View markup', [1, 1, 0, 0, 0, 1, 0, 0]],
      ['Send proposal', [1, 1, 1, 0, 0, 0, 0, 0]], ['Approve proposal (internal)', [1, 1, 0, 0, 0, 0, 0, 0]],
      ['Send invoice', [1, 1, 0, 0, 0, 1, 0, 0]], ['Create change order', [1, 1, 1, 1, 0, 0, 0, 0]],
      ['Send change order', [1, 1, 1, 0, 0, 0, 0, 0]], ['View client messages', [1, 1, 1, 0, 0, 0, 0, 2]],
      ['Manage users', [1, 1, 0, 0, 0, 0, 0, 0]], ['Manage integrations', [1, 1, 0, 0, 0, 0, 0, 0]],
      ['Export data', [1, 1, 1, 0, 0, 1, 0, 0]], ['Access API', [1, 1, 0, 0, 0, 0, 0, 0]],
    ];
    const ALL_ROLES = ['Owner', 'Admin', 'Project manager', 'Estimator', 'Field user', 'Office / accounting', 'Subcontractor', 'Client', 'External consultant', 'API integration'];
    const Cell = ({ v }) => (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0', borderLeft: '1px solid var(--bq-border)' }}>
        {v === 1 ? <span style={{ color: 'var(--bq-good)' }}><BqIcon d={BQ_GLYPH.check} size={15} sw={2.4}></BqIcon></span>
          : v === 2 ? <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--bq-saffron, #E8A03D)', boxShadow: 'inset 0 0 0 1px var(--bq-border)' }} title="Own project only"></span>
          : <span style={{ color: 'var(--bq-line, #ccc)', fontSize: 13 }}>-</span>}
      </div>
    );
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
        <PfHead title="Roles & permissions" sub="Granular, role-based access across 10 roles. Financials, margin, sending, and platform access are all independently gated.">
          <button className="bq-btn primary sm"><BqIcon d="M12 5 V19 M5 12 H19" size={14}></BqIcon>Custom role</button>
        </PfHead>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {ALL_ROLES.map((r) => <span key={r} className="bq-chip">{r}</span>)}
        </div>

        <div className="bq-card-s" style={{ overflow: 'auto' }}>
          <div style={{ minWidth: 760 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '200px repeat(8, 1fr)', position: 'sticky', top: 0, background: 'var(--bq-card)', zIndex: 1, borderBottom: '1px solid var(--bq-border)' }}>
              <div style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)' }}>Permission</div>
              {ROLES.map((r) => <div key={r} style={{ padding: '12px 4px', textAlign: 'center', fontSize: 11.5, fontWeight: 700, borderLeft: '1px solid var(--bq-border)' }}>{r}</div>)}
            </div>
            {AREAS.map(([area, vals], ri) => (
              <div key={area} style={{ display: 'grid', gridTemplateColumns: '200px repeat(8, 1fr)', borderBottom: ri < AREAS.length - 1 ? '1px solid var(--bq-border)' : 'none', background: ri % 2 ? 'var(--bq-subtle)' : 'transparent' }}>
                <div style={{ padding: '8px 16px', fontSize: 12.5, color: 'var(--bq-ink)', display: 'flex', alignItems: 'center' }}>{area}</div>
                {vals.map((v, ci) => <Cell key={ci} v={v}></Cell>)}
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ color: 'var(--bq-good)' }}><BqIcon d={BQ_GLYPH.check} size={13} sw={2.4}></BqIcon></span>Allowed</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--bq-saffron, #E8A03D)' }}></span>Scoped to own project</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>- Denied</span>
        </div>
      </div>
    );
  }

  // ════════ 8 · PARTNER ACCOUNTS ════════
  function PartnersPanel() {
    const CLIENTS = window.bqClean() ? [
      ['Solid Remodel', 'Your company', 'Active', 'good', 0, '-'],
    ] : [
      ['Hartwell Builders', 'Austin, TX', 'Healthy', 'good', 4, '92%'],
      ['Cedar & Co. Remodeling', 'Denver, CO', 'Onboarding', 'ai', 2, '-'],
      ['Summit Custom Homes', 'Boise, ID', 'Healthy', 'good', 7, '88%'],
      ['Tide & Timber', 'Portland, OR', 'Needs attention', 'warn', 3, '64%'],
    ];
    const CHECK = [['Company profile + branding', true], ['Cost codes & price book imported', true], ['Team invited & roles set', true], ['QuickBooks connected', false], ['First estimate created', false]];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
        <PfHead title="Partner accounts" sub="For consultants, accountants, and implementation partners managing multiple contractor companies from one login.">
          <button className="bq-btn primary sm"><BqIcon d="M12 5 V19 M5 12 H19" size={14}></BqIcon>Add client company</button>
        </PfHead>
        <div style={{ display: 'flex', gap: 'calc(12px * var(--bq-sp))', flexWrap: 'wrap' }}>
          <BqKPI label="Client companies" value={window.bqClean() ? '1' : '4'} sub={window.bqClean() ? 'your company' : '1 onboarding'}></BqKPI>
          <BqKPI label="Combined contract value" value={window.bqClean() ? '$0' : '$4.2M'} sub={window.bqClean() ? 'no projects yet' : 'across all clients'} tone="ai"></BqKPI>
          <BqKPI label="Avg. margin" value={window.bqClean() ? '-' : '21.8%'} sub="portfolio-wide"></BqKPI>
          <BqKPI label="Needs attention" value={window.bqClean() ? '0' : '1'} sub={window.bqClean() ? 'all healthy' : 'Tide & Timber'} tone="warn"></BqKPI>
        </div>

        <div style={{ display: 'flex', gap: 'calc(16px * var(--bq-sp))', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div className="bq-card-s" style={{ flex: '1 1 420px', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px 4px' }}><PfCardHead>Client companies</PfCardHead></div>
            <div className="bq-trow head" style={{ gridTemplateColumns: '1.6fr 1fr auto auto' }}><span>Company</span><span>Status</span><span>Jobs</span><span>Margin</span></div>
            {CLIENTS.map((c, i) => (
              <div key={i} className="bq-trow" style={{ gridTemplateColumns: '1.6fr 1fr auto auto', cursor: 'pointer', alignItems: 'center' }}>
                <span><span style={{ display: 'block', fontWeight: 600 }}>{c[0]}</span><span style={{ display: 'block', fontSize: 11.5, color: 'var(--bq-faint)' }}>{c[1]}</span></span>
                <span><span className={'bq-chip ' + c[3]}>{c[2]}</span></span>
                <span className="cell-num" style={{ fontSize: 13 }}>{c[4]}</span>
                <span className="cell-num" style={{ fontSize: 13, fontWeight: 600 }}>{c[5]}</span>
              </div>
            ))}
            <div style={{ padding: '10px 16px' }}><button className="bq-btn soft-ai sm"><BqIcon d={BQ_GLYPH.template} size={13}></BqIcon>Deploy template to a client</button></div>
          </div>

          <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: 'calc(12px * var(--bq-sp))' }}>
            <div className="bq-card-s" style={{ padding: '14px 16px' }}>
              <PfCardHead right={<span className="bq-chip ai">3 / 5</span>}>Implementation - Cedar &amp; Co.</PfCardHead>
              {CHECK.map(([t, done], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 0' }}>
                  <span style={{ width: 18, height: 18, borderRadius: 6, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? 'var(--bq-good)' : '#fff', boxShadow: done ? 'none' : 'inset 0 0 0 1.5px var(--bq-border-strong)' }}>{done ? <BqIcon d={BQ_GLYPH.check} size={11} sw={2.6} style={{ color: '#fff' }}></BqIcon> : null}</span>
                  <span style={{ fontSize: 13, color: done ? 'var(--bq-faint)' : 'var(--bq-ink)', textDecoration: done ? 'line-through' : 'none' }}>{t}</span>
                </div>
              ))}
            </div>
            <div className="bq-card-s" style={{ padding: '14px 16px' }}>
              <PfCardHead>Support notes</PfCardHead>
              <div style={{ fontSize: 12.5, color: 'var(--bq-muted)', lineHeight: 1.5 }}>Tide &amp; Timber margin slipped - review their change-order capture on the next call. QBO mapping pending for Cedar &amp; Co.</div>
              <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--bq-faint)' }}>Billing relationship: Partner-billed · 4 seats</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ════════ 9 · WHITE-LABEL PORTAL ════════
  function WhitelabelPanel() {
    const [accent, setAccent] = React.useState('#C8741A');
    const PALETTE = ['#C8741A', '#1F6F5C', '#2A4B7C', '#7A4DB0', '#B23A48'];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
        <PfHead title="White-label client portal" sub="Higher-tier companies can fully brand the homeowner experience - logo, colors, domain, and document styling.">
          <span className="bq-chip ai">Pro &amp; Enterprise</span>
        </PfHead>
        <div style={{ display: 'flex', gap: 'calc(16px * var(--bq-sp))', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* controls */}
          <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 'calc(12px * var(--bq-sp))' }}>
            <div className="bq-card-s" style={{ padding: '14px 16px' }}>
              <PfCardHead>Brand</PfCardHead>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <BqPh h={56} label="Logo" style={{ width: 96, flex: 'none' }}></BqPh>
                <div style={{ fontSize: 12, color: 'var(--bq-faint)', lineHeight: 1.4 }}>SVG or PNG · shown on portal, proposals, and invoices</div>
              </div>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 7 }}>Accent color</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {PALETTE.map((c) => (
                  <button key={c} onClick={() => setAccent(c)} style={{ width: 30, height: 30, borderRadius: 8, background: c, border: 'none', cursor: 'pointer', boxShadow: accent === c ? '0 0 0 2px #fff, 0 0 0 4px ' + c : 'inset 0 0 0 1px rgba(0,0,0,0.1)' }}></button>
                ))}
              </div>
            </div>
            <div className="bq-card-s" style={{ padding: '14px 16px' }}>
              <PfCardHead>Domain &amp; sender</PfCardHead>
              {[['Custom domain', window.bqClean() ? 'portal.solidremodel.com' : 'portal.hartwell.com'], ['Email sender', window.bqClean() ? 'updates@solidremodel.com' : 'updates@hartwell.com'], ['Welcome text', '“Welcome to your project hub”']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 12.5 }}>
                  <span style={{ color: 'var(--bq-faint)', width: 110, flex: 'none' }}>{k}</span>
                  <span style={{ fontFamily: k === 'Welcome text' ? 'inherit' : "'Roboto Mono', monospace", color: 'var(--bq-ink)' }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {['Proposal styling', 'Invoice styling', 'Weekly update format', 'Warranty packet branding'].map((x) => <span key={x} className="bq-chip">{x}</span>)}
              </div>
            </div>
          </div>

          {/* live preview */}
          <div style={{ flex: '1 1 320px' }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 8 }}>Live preview</div>
            <div className="bq-card-s" style={{ overflow: 'hidden', padding: 0 }}>
              <div style={{ background: accent, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH.hammer} size={15} style={{ color: '#fff' }}></BqIcon></span>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{window.bqClean() ? 'Solid Remodel' : 'Hartwell Builders'}</span>
                <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.85)', fontSize: 12 }}>{window.bqClean() ? 'portal.solidremodel.com' : 'portal.hartwell.com'}</span>
              </div>
              <div style={{ padding: '18px' }}>
                <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--bq-ink)' }}>Welcome to your project hub</div>
                <div style={{ fontSize: 12.5, color: 'var(--bq-muted)', marginBottom: 14 }}>Kitchen + Hall Bath · 62% complete</div>
                <div style={{ height: 8, borderRadius: 999, background: 'var(--bq-subtle)', overflow: 'hidden', marginBottom: 14 }}><div style={{ width: '62%', height: '100%', background: accent }}></div></div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button style={{ flex: 1, padding: '9px', borderRadius: 10, border: 'none', background: accent, color: '#fff', fontWeight: 600, fontSize: 13 }}>Approve selection</button>
                  <button style={{ flex: 1, padding: '9px', borderRadius: 10, border: '1px solid var(--bq-border)', background: 'var(--bq-raise)', color: 'var(--bq-ink)', fontWeight: 600, fontSize: 13 }}>View update</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ════════ 10 · VERTICAL TEMPLATES ════════
  function TemplatesPanel() {
    const VERTICALS = [
      ['Kitchen remodeler', 'estimate', 1], ['Bathroom remodeler', 'select', 1], ['Basement remodeler', 'projects', 0],
      ['Whole-home remodeler', 'hammer', 1], ['Custom home builder', 'template', 0], ['Roofing contractor', 'projects', 0],
      ['HVAC contractor', 'automation', 0], ['Electrical contractor', 'code', 0], ['Plumbing contractor', 'expense', 0],
      ['Flooring contractor', 'select', 0], ['Painting contractor', 'photo', 0], ['Outdoor living / deck', 'hammer', 1],
    ];
    const [open, setOpen] = React.useState(0);
    const INCLUDES = ['Estimate sections', 'Cost codes', 'Proposal terms', 'Exclusions', 'Payment schedule', 'Task templates', 'Schedule template', 'Selection categories', 'Common change order types', 'Client update style'];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
        <PfHead title="Vertical templates" sub="Prebuilt starting points per trade - so a new company is productive on day one instead of building cost codes from scratch."></PfHead>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 'calc(12px * var(--bq-sp))' }}>
          {VERTICALS.map(([name, g, ready], i) => (
            <div key={name} onClick={() => setOpen(i)} className="bq-card-s" style={{ padding: '15px 16px', cursor: 'pointer', boxShadow: i === open ? '0 0 0 2px var(--bq-brand)' : 'var(--bq-shadow)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ width: 36, height: 36, borderRadius: 10, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)' }}><BqIcon d={BQ_GLYPH[g]} size={17}></BqIcon></span>
                {ready ? <span className="bq-chip good" style={{ marginLeft: 'auto' }}>Ready</span> : <span className="bq-chip" style={{ marginLeft: 'auto' }}>Beta</span>}
              </div>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>{name}</div>
            </div>
          ))}
        </div>
        <div className="bq-card-s" style={{ padding: '16px 18px' }}>
          <PfCardHead right={<button className="bq-btn primary sm">Apply to a company</button>}>{VERTICALS[open][0]} · what's included</PfCardHead>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {INCLUDES.map((x) => <span key={x} className="bq-chip"><BqIcon d={BQ_GLYPH.check} size={11} sw={2.2}></BqIcon>{x}</span>)}
          </div>
        </div>
      </div>
    );
  }

  // ════════ 11 · SECURITY & ENTERPRISE ════════
  function SecurityPanel() {
    const [tfa, setTfa] = React.useState(true);
    const [sso, setSso] = React.useState(false);
    const USERS = window.bqClean() ? [['Owner', 'Owner', 'good']] : [['Maria Hartwell', 'Owner', 'good'], ['Mike Reyes', 'Project manager', 'good'], ['Dana Cho', 'Office / accounting', 'good'], ['Jordan Ellis', 'Estimator', 'muted']];
    const AUDIT = window.bqClean() ? [['Signed in', 'Owner', 'Just now']] : [['Proposal P-204 approved', 'Maria H.', '2m ago'], ['CO-001 sent to client', 'Maria H.', '1h ago'], ['Invoice INV-0006 marked paid', 'Dana C.', 'Yesterday'], ['API key rotated (live)', 'Maria H.', '2d ago']];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
        <PfHead title="Security & enterprise" sub="Company-level security, audit, and data governance - the foundations larger firms require."></PfHead>
        <div style={{ display: 'flex', gap: 'calc(16px * var(--bq-sp))', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 'calc(12px * var(--bq-sp))' }}>
            <div className="bq-card-s" style={{ padding: '14px 16px' }}>
              <PfCardHead>Authentication</PfCardHead>
              {[['Two-factor authentication', 'Required for all users', tfa, setTfa], ['Single sign-on (SAML)', 'SSO-ready - connect your IdP', sso, setSso]].map(([t, sub, on, set], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 600 }}>{t}</div><div style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>{sub}</div></div>
                  <PfToggle on={on} onClick={() => set((v) => !v)}></PfToggle>
                </div>
              ))}
            </div>
            <div className="bq-card-s" style={{ padding: '14px 16px' }}>
              <PfCardHead>Data governance</PfCardHead>
              {[['Data retention', '7 years (financial), then archive'], ['Backup exports', 'Nightly · last run 3:00 AM'], ['Region', 'US · SOC 2 in progress']].map(([k, v], i) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none', fontSize: 12.5 }}>
                  <span style={{ color: 'var(--bq-faint)', flex: 1 }}>{k}</span><span style={{ color: 'var(--bq-ink)', fontWeight: 500 }}>{v}</span>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                <button className="bq-btn sm"><BqIcon d={BQ_GLYPH.exports} size={13}></BqIcon>Export all company data</button>
                <button className="bq-btn ghost sm">Backup logs</button>
              </div>
            </div>
          </div>

          <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 'calc(12px * var(--bq-sp))' }}>
            <div className="bq-card-s" style={{ padding: '14px 16px' }}>
              <PfCardHead right={<button className="bq-btn soft-ai sm">Invite user</button>}>Users &amp; roles</PfCardHead>
              {USERS.map((u, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
                  <span className="bq-avatar" style={{ width: 30, height: 30, fontSize: 11, background: 'var(--bq-subtle)', color: 'var(--bq-muted)', boxShadow: 'inset 0 0 0 1px var(--bq-border)' }}>{u[0].split(' ').map((n) => n[0]).join('')}</span>
                  <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{u[0]}</div><div style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>{u[1]}</div></div>
                  <button className="bq-btn ghost sm" style={{ padding: '3px 9px' }}>Edit</button>
                </div>
              ))}
            </div>
            <div className="bq-card-s" style={{ padding: '14px 16px' }}>
              <PfCardHead right={<span className="bq-chip">Immutable</span>}>Audit log</PfCardHead>
              {AUDIT.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--bq-ai)', flex: 'none' }}></span>
                  <span style={{ fontSize: 12.5, flex: 1 }}>{a[0]}</span>
                  <span style={{ fontSize: 11.5, color: 'var(--bq-faint)', whiteSpace: 'nowrap' }}>{a[1]} · {a[2]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  Object.assign(window.BQ_PANELS, { exports: ExportsPanel, permissions: PermissionsPanel, partners: PartnersPanel, whitelabel: WhitelabelPanel, templates: TemplatesPanel, security: SecurityPanel });
})();
