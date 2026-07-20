// Hi-fi Automation rules engine - if-this-then-that templates + toggles
const AUTO_RULES = [
  { id: 'a1', on: true, trigger: 'Proposal approved', tg: 'proposal', action: 'Create project from proposal + notify PM', ag: 'projects', runs: 14 },
  { id: 'a2', on: true, trigger: 'Selection due date approaching (3 days)', tg: 'select', action: 'Draft client reminder for review', ag: 'spark', runs: 22 },
  { id: 'a3', on: true, trigger: 'Invoice overdue', tg: 'invoice', action: 'Notify client + alert project manager', ag: 'bell', runs: 6 },
  { id: 'a4', on: true, trigger: 'Budget line exceeds 90% of budget', tg: 'expense', action: 'Alert owner + suggest change order', ag: 'co', runs: 9 },
  { id: 'a5', on: false, trigger: 'Task overdue', tg: 'task', action: 'Alert assignee + project manager', ag: 'bell', runs: 0 },
  { id: 'a6', on: false, trigger: 'New AI risk detected', tg: 'watchdog', action: 'Create task for project manager to review', ag: 'task', runs: 0 },
  { id: 'a7', on: true, trigger: 'Change order approved', tg: 'co', action: 'Add to budget + draft invoice line', ag: 'invoice', runs: 5 },
  { id: 'a8', on: false, trigger: 'Schedule item delayed', tg: 'cal', action: 'Notify client + affected subcontractors', ag: 'hardhat', runs: 0 },
];
const AUTO_TEMPLATES = [
  ['Proposal → Project', 'When a proposal is approved, spin up the project automatically.'],
  ['Selection nudge', 'Remind clients before a selection due date slips.'],
  ['Overdue invoice chase', 'Auto-draft a friendly payment reminder.'],
  ['Margin guardrail', 'Alert the owner when a cost code runs hot.'],
];

function HifiAutomations() {
  const [rules, setRules] = React.useState(AUTO_RULES);
  const toggle = (id) => setRules((rs) => rs.map((r) => r.id === id ? { ...r, on: !r.on } : r));
  const active = rules.filter((r) => r.on).length;

  return (
    <div className="bq-screen">
      <BqTop crumb="Automations"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Automations"></BqSide>
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="bq-logomark" style={{ background: 'var(--bq-ai)' }}><BqIcon d={BQ_GLYPH.automation} size={16} sw={1.5} style={{ color: '#fff' }}></BqIcon></span>
            <div style={{ flex: 1 }}>
              <div className="bq-display" style={{ fontSize: 22 }}>Automations</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>{active} active rules · if this, then that - drafts stay reviewable</div>
            </div>
            <button className="bq-btn primary sm"><BqIcon d="M12 5 V19 M5 12 H19" size={14}></BqIcon>New rule</button>
          </div>

          {/* templates */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 8 }}>Start from a template</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
              {AUTO_TEMPLATES.map(([t, sub]) => (
                <div key={t} className="bq-card-s" style={{ padding: '13px 15px', cursor: 'pointer', boxShadow: 'inset 0 0 0 1px var(--bq-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                    <BqIcon d={BQ_GLYPH.automation} size={14} style={{ color: 'var(--bq-ai-strong)' }}></BqIcon>
                    <span style={{ fontWeight: 700, fontSize: 13.5 }}>{t}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--bq-muted)', lineHeight: 1.4 }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* rules */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 8 }}>Your rules</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(10px * var(--bq-sp))' }}>
              {rules.map((r) => (
                <div key={r.id} className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 16px', display: 'flex', alignItems: 'center', gap: 14, opacity: r.on ? 1 : 0.6 }}>
                  <button onClick={() => toggle(r.id)} style={{ width: 40, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer', background: r.on ? 'var(--bq-ai)' : 'var(--bq-border-strong)', position: 'relative', flex: 'none' }}>
                    <span style={{ position: 'absolute', top: 3, left: r.on ? 19 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .15s' }}></span>
                  </button>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 240px' }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--bq-faint)' }}>If</span>
                      <span style={{ width: 26, height: 26, borderRadius: 7, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-subtle)', color: 'var(--bq-muted)' }}><BqIcon d={BQ_GLYPH[r.tg]} size={14}></BqIcon></span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--bq-ink)' }}>{r.trigger}</span>
                    </div>
                    <BqIcon d="M5 12 H17 M13 8 L17 12 L13 16" size={16} style={{ color: 'var(--bq-faint)', flex: 'none' }}></BqIcon>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 240px' }}>
                      <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--bq-ai-strong)' }}>Then</span>
                      <span style={{ width: 26, height: 26, borderRadius: 7, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-ai-soft)', color: 'var(--bq-ai-strong)' }}><BqIcon d={BQ_GLYPH[r.ag]} size={14}></BqIcon></span>
                      <span style={{ fontSize: 13, color: 'var(--bq-ink)' }}>{r.action}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 11.5, color: 'var(--bq-faint)', flex: 'none', whiteSpace: 'nowrap' }}>{r.runs ? r.runs + ' runs' : 'Off'}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
window.HifiAutomations = HifiAutomations;
