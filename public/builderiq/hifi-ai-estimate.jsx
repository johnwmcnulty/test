// Hi-fi AI scope-to-estimate - paste messy notes → structured, editable draft
const AISugg = ({ children, tone = 'ai' }) => (
  <span className={'bq-chip ' + tone} style={{ alignSelf: 'flex-start' }}><BqSpark size={10}></BqSpark>AI suggestion</span>
);

function AiDraftSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="bq-card-s" style={{ overflow: 'hidden', flexShrink: 0 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: 'calc(12px * var(--bq-sp)) 16px', background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', textAlign: 'left' }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--bq-ink)', whiteSpace: 'nowrap' }}>{title}</span>
        <span style={{ marginLeft: 'auto', color: 'var(--bq-faint)', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .15s', display: 'flex' }}>
          <BqIcon d="M9 5 L16 12 L9 19" size={15}></BqIcon>
        </span>
      </button>
      {open ? <div style={{ padding: '0 16px calc(14px * var(--bq-sp))' }}>{children}</div> : null}
    </div>
  );
}

const AI_NOTES = `Forwarded from client (Webb):
"Hi Maria - finally ready to pull the trigger on the kitchen! We want to lose the wall between kitchen & dining, new shaker cabinets (white), quartz counters, that big island we talked about w/ seating for 4. Keeping appliances mostly but want a new induction range + hood. Floors are oak, would love to refinish not replace if possible. Budget-wise hoping under $90k but flexible for the right result. Oh and the powder room off the hall is hideous, can we squeeze that in too?"

Mike's site visit voice memo (Tue):
- load-bearing wall, will need beam + temp shoring, ~16ft span
- existing oak floor in decent shape, refinish OK, patch where wall was
- panel is 100A, island + induction range probably needs a sub-panel or upgrade - flag
- powder room is tiny, 1980s, just vanity/toilet/floor swap, no plumbing moves
- no permit pulled yet, this town requires one for structural`;

function HifiAiEstimate() {
  const fmt = (n) => '$' + Math.round(n).toLocaleString('en-US');
  const [pid] = React.useState(() => { const v = window.__bqEstimateFor; window.__bqEstimateFor = null; return v || null; });
  const linked = pid && window.bqProj ? window.bqProj.get(pid) : null;
  const [phase, setPhase] = React.useState('input'); // input | thinking | draft
  const [notes, setNotes] = React.useState(window.bqClean() ? '' : AI_NOTES);
  const [type, setType] = React.useState('Kitchen remodel');
  const [size, setSize] = React.useState(window.bqClean() ? '' : '~220 sq ft');
  const [tier, setTier] = React.useState('Standard');
  const [region, setRegion] = React.useState(window.bqClean() ? '' : 'Henderson, NV');
  const [step, setStep] = React.useState(0);
  const [summary, setSummary] = React.useState(
    window.bqClean() ? '' : 'Full kitchen remodel for the Webb residence: remove a ~16 ft load-bearing wall between the kitchen and dining room (engineered beam + temporary shoring), install white shaker cabinetry with a new seated island, quartz countertops, induction range and hood, and refinish the existing oak flooring. Includes a light powder-room refresh off the hall (vanity, toilet, floor - no plumbing relocation). Structural permit required.'
  );

  const THINK_STEPS = ['Reading 2 sources…', 'Matching scope to your price book…', 'Pulling rates from 11 past kitchen jobs…', 'Drafting sections + flagging risk…'];

  const generate = () => {
    setPhase('thinking');
    setStep(0);
  };
  React.useEffect(() => {
    if (phase !== 'thinking') return;
    if (step < THINK_STEPS.length) {
      const tm = setTimeout(() => setStep((s) => s + 1), 480);
      return () => clearTimeout(tm);
    }
    const tm = setTimeout(() => setPhase('draft'), 380);
    return () => clearTimeout(tm);
  }, [phase, step]);

  const SECTIONS = [
    { code: '01', name: 'Demo & disposal', total: 6800, lines: [['Remove wall, cabinets, counters, flooring patch areas', 4200], ['Dumpster + haul-away', 1650], ['Protect + dust control', 950]] },
    { code: '05', name: 'Structural', total: 11400, lines: [['Engineered beam, ~16 ft span (allowance)', 6400], ['Temporary shoring + install labor', 3600], ['Engineer letter / stamp', 1400]] },
    { code: '06', name: 'Cabinetry & island', total: 28600, lines: [['White shaker cabinets, painted', 19800], ['Seated island w/ panel ends', 5400], ['Install labor', 3400]] },
    { code: '07', name: 'Countertops', total: 8900, lines: [['Quartz, ~58 sf incl. island (allowance)', 8900]] },
    { code: '09', name: 'Flooring', total: 5200, lines: [['Refinish existing oak + patch at wall line', 5200]] },
    { code: '15', name: 'Plumbing', total: 3100, lines: [['Reconnect sink/DW at island', 2100], ['Powder room: vanity + toilet swap', 1000]] },
    { code: '16', name: 'Electrical', total: 9700, lines: [['100A→200A service upgrade (induction + island)', 5200], ['Island circuits, undercab, recessed', 3300], ['Powder room refresh', 1200]] },
  ];
  const cost = SECTIONS.reduce((a, s) => a + s.total, 0);
  const MARKUP = 0.22;
  const clientTotal = cost * (1 + MARKUP);

  const ALLOWANCES = [['Quartz countertops', '$8,900'], ['Engineered beam', '$6,400'], ['Cabinet hardware + pulls', '$1,400'], ['Plumbing + lighting fixtures', '$2,600']];
  const EXCLUSIONS = ['New appliances beyond range + hood (client keeping fridge, DW)', 'Dining-room refinishing beyond the wall patch', 'Asbestos / lead abatement if discovered (1980s home)', 'Window or exterior changes'];
  const QUESTIONS = [
    'Confirm the 100A→200A service upgrade - does the client want it now or keep induction at 100A with load management?',
    'Quartz slab selection + edge profile (affects the $8,900 allowance).',
    'Powder room: floor tile vs. LVP, and is the existing toilet staying?',
  ];
  const RISKS = [
    { t: 'Load-bearing wall', b: 'Beam sizing isn\'t final until the engineer signs off - the $6,400 is an allowance, not a fixed price.', tone: 'warn' },
    { t: 'Panel capacity', b: 'Induction range + island on a 100A panel is tight. Priced the upgrade in; verify before quoting firm.', tone: 'warn' },
    { t: '1980s build', b: 'Possible lead paint / asbestos in flooring layers. Excluded - call out abatement as a contingency.', tone: 'warn' },
  ];

  return (
    <div className="bq-screen">
      <BqTop crumb="Estimates / New - AI draft"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Estimates"></BqSide>

        {phase === 'input' ? (
          <main style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '36px 24px' }}>
            <div style={{ width: 'min(680px, 100%)', display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="bq-logomark" style={{ background: 'var(--bq-ai)' }}><BqIcon d={BQ_GLYPH.spark} size={16} sw={1.5} style={{ color: '#fff' }}></BqIcon></span>
                <div>
                  <div className="bq-display" style={{ fontSize: 22 }}>Generate estimate with AI</div>
                  <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Paste client emails, your site notes, or a voice transcript. We'll draft sections and pricing for you to verify.</div>
                </div>
              </div>

              <div className="bq-card-s" style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {(() => {
                  const label = { fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 5 };
                  const ctl = { width: '100%', boxSizing: 'border-box', font: 'inherit', fontSize: 13, padding: '9px 11px', borderRadius: 9, border: 'none', boxShadow: 'inset 0 0 0 1px var(--bq-border)', background: 'var(--bq-card)', color: 'var(--bq-ink)', outline: 'none' };
                  const TYPES = ['Kitchen remodel', 'Bathroom remodel', 'Primary suite', 'Basement finish', 'Home addition', 'Whole-home remodel', 'ADU / garage conversion', 'Outdoor / deck', 'Custom / other'];
                  const TIERS = ['Budget-friendly', 'Standard', 'High-end', 'Luxury'];
                  return (
                    <React.Fragment>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <div style={label}>Project type</div>
                        <select value={type} onChange={(e) => setType(e.target.value)} style={ctl}>
                          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <div style={label}>Approx. size</div>
                        <input value={size} onChange={(e) => setSize(e.target.value)} placeholder="e.g. 220 sq ft" style={ctl}></input>
                      </div>
                      <div>
                        <div style={label}>Quality tier</div>
                        <select value={tier} onChange={(e) => setTier(e.target.value)} style={ctl}>
                          {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <div style={label}>Location <span style={{ textTransform: 'none', fontWeight: 500, color: 'var(--bq-faint)' }}>· tunes labor rates</span></div>
                        <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. Henderson, NV" style={ctl}></input>
                      </div>
                    </React.Fragment>
                  );
                })()}
              </div>

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="bq-btn soft-ai sm" onClick={() => window.__bqNav && window.__bqNav('Plan Review')}><BqIcon d={BQ_GLYPH.plan} size={13}></BqIcon>Review plans first</button>
                <button className="bq-btn soft-ai sm" onClick={() => window.__bqNav && window.__bqNav('Quote Comparison')}><BqIcon d={BQ_GLYPH.quotes} size={13}></BqIcon>Compare sub quotes</button>
              </div>

              <div className="bq-card-s" style={{ padding: 4, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: 6, padding: '10px 12px 4px' }}>
                  <span className="bq-chip"><BqIcon d={BQ_GLYPH.proposal} size={11}></BqIcon>client email</span>
                  <span className="bq-chip"><BqIcon d={BQ_GLYPH.estimate} size={11}></BqIcon>site notes</span>
                  <span className="bq-chip">voice transcript</span>
                </div>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', minHeight: 240, resize: 'vertical', border: 'none', outline: 'none', background: 'transparent', font: 'inherit', fontSize: 13, lineHeight: 1.6, color: 'var(--bq-ink)', padding: '8px 14px 14px', whiteSpace: 'pre-wrap' }}></textarea>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="bq-btn ai" onClick={generate}><BqIcon d={BQ_GLYPH.spark} size={15}></BqIcon>Generate estimate</button>
                <span style={{ fontSize: 12, color: 'var(--bq-faint)', lineHeight: 1.4 }}>
                  AI drafts are suggestions, not final pricing. You'll review and edit everything before it becomes an estimate.
                </span>
              </div>
            </div>
          </main>
        ) : phase === 'thinking' ? (
          <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 320 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="bq-spark" style={{ animation: 'bqpulse 1s ease-in-out infinite' }}><BqIcon d={BQ_GLYPH.spark} size={22}></BqIcon></span>
                <span className="bq-display" style={{ fontSize: 18 }}>Drafting your estimate…</span>
              </div>
              {THINK_STEPS.map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: i < step ? 'var(--bq-ink)' : 'var(--bq-faint)', transition: 'color .2s' }}>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', background: i < step ? 'var(--bq-good-soft)' : 'var(--bq-subtle)', color: 'var(--bq-good)' }}>
                    {i < step ? <BqIcon d={BQ_GLYPH.check} size={11} sw={2.4}></BqIcon> : null}
                  </span>
                  {s}
                </div>
              ))}
            </div>
          </main>
        ) : (
          <React.Fragment>
            <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(12px * var(--bq-sp))' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexShrink: 0 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="bq-display" style={{ fontSize: 20 }}>{linked ? (linked.client.name + ' - ' + linked.project.title) : 'Webb - Kitchen + powder room'}</span>
                    <AISugg></AISugg>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{linked ? ('Estimating for ' + linked.client.name + ' · confirm, then save to the project') : (type + ' · drafted from 2 sources · nothing saved yet')}</div>
                </div>
                {linked ? <button className="bq-btn primary sm" onClick={() => { window.bqProj.update(pid, { contract: Math.round(clientTotal), stage: 'Estimating', stageTone: 'ai' }); window.__bqCustomProject = pid; window.__bqNav && window.__bqNav('Project Workspace'); }}><BqIcon d={BQ_GLYPH.check} size={13} sw={2.4}></BqIcon>Save to project</button> : null}
                <button className="bq-btn soft-ai sm" onClick={() => setPhase('input')}><BqIcon d={BQ_GLYPH.spark} size={13}></BqIcon>Regenerate</button>
              </div>

              <div className="bq-ai-card" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', flexShrink: 0 }}>
                <BqIcon d="M12 9 V13 M12 16.5 V16.6 M12 4 L21 19 H3 Z" size={17} style={{ color: 'var(--bq-ai-strong)', flex: 'none' }}></BqIcon>
                <span style={{ fontSize: 12.5, color: 'var(--bq-ai-strong)', lineHeight: 1.45 }}>
                  <b>Verify before sending.</b> Allowances, beam sizing, and the service upgrade are estimates from your price book and past jobs - confirm pricing and scope with the client.
                </span>
              </div>

              <AiDraftSection title="Project summary">
                <textarea value={summary} onChange={(e) => setSummary(e.target.value)}
                  style={{ width: '100%', boxSizing: 'border-box', minHeight: 96, resize: 'vertical', border: '1px solid var(--bq-border)', borderRadius: 12, background: 'var(--bq-subtle)', font: 'inherit', fontSize: 13, lineHeight: 1.55, color: 'var(--bq-ink)', padding: '10px 12px' }}></textarea>
              </AiDraftSection>

              <AiDraftSection title="Estimate sections">
                <div className="bq-card-s" style={{ boxShadow: 'inset 0 0 0 1px var(--bq-border)', overflow: 'hidden' }}>
                  {SECTIONS.map((s) => (
                    <React.Fragment key={s.code}>
                      <div className="bq-trow group" style={{ gridTemplateColumns: '1fr auto', border: 'none', borderTop: '1px solid var(--bq-border)' }}>
                        <span><span style={{ color: 'var(--bq-faint)', marginRight: 8 }}>{s.code}</span>{s.name}</span>
                        <span className="cell-num">{fmt(s.total)}</span>
                      </div>
                      {s.lines.map(([d, c], i) => (
                        <div key={i} className="bq-trow" style={{ gridTemplateColumns: '1fr auto' }}>
                          <span style={{ color: 'var(--bq-muted)' }}>{d}</span>
                          <span className="cell-num">{fmt(c)}</span>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                  <div className="bq-trow" style={{ gridTemplateColumns: '1fr auto auto', background: 'var(--bq-subtle)', gap: 24 }}>
                    <span style={{ fontWeight: 700 }}>Estimated cost</span>
                    <span className="cell-num" style={{ fontWeight: 700 }}>{fmt(cost)}</span>
                    <span style={{ fontSize: 12, color: 'var(--bq-muted)', alignSelf: 'center' }}>+22% markup → <b className="cell-num" style={{ color: 'var(--bq-brand-strong)' }}>{fmt(clientTotal)}</b> client</span>
                  </div>
                </div>
              </AiDraftSection>

              <div style={{ display: 'flex', gap: 'calc(12px * var(--bq-sp))', flexWrap: 'wrap', flexShrink: 0 }}>
                <div style={{ flex: '1 1 300px' }}>
                  <AiDraftSection title="Allowances">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {ALLOWANCES.map(([n, v]) => (
                        <div key={n} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
                          <span style={{ color: 'var(--bq-muted)' }}>{n}</span><span className="cell-num" style={{ fontWeight: 600 }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </AiDraftSection>
                </div>
                <div style={{ flex: '1 1 300px' }}>
                  <AiDraftSection title="Suggested exclusions">
                    <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.45 }}>
                      {EXCLUSIONS.map((e) => <li key={e}>{e}</li>)}
                    </ul>
                  </AiDraftSection>
                </div>
              </div>
            </main>

            <aside className="ai-expanded" style={{ width: 300, flex: 'none', borderLeft: '1px solid var(--bq-border)', background: 'var(--bq-ai-soft)', padding: 'calc(16px * var(--bq-sp)) 16px', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto' }}>
              <div style={{ background: 'var(--bq-raise)', borderRadius: 16, boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)', padding: '14px 16px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-faint)' }}>Draft confidence</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '4px 0 8px' }}>
                  <span className="bq-num" style={{ fontSize: 30, color: 'var(--bq-ai-strong)' }}>72%</span>
                  <span style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>Medium</span>
                </div>
                <BqMeter pct={72} tone="ai"></BqMeter>
                <div style={{ fontSize: 12, color: 'var(--bq-muted)', marginTop: 8, lineHeight: 1.45 }}>
                  Held back by the structural beam and 3 open questions. Resolve those and confidence rises.
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                  <BqSpark size={13}></BqSpark><span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--bq-ai-strong)' }}>Before you quote - {QUESTIONS.length} questions</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {QUESTIONS.map((q, i) => (
                    <div key={i} style={{ background: 'var(--bq-raise)', borderRadius: 12, boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)', padding: '10px 12px', fontSize: 12.5, color: 'var(--bq-ink)', lineHeight: 1.45 }}>
                      {q}
                    </div>
                  ))}
                  <button className="bq-btn soft-ai sm" style={{ alignSelf: 'flex-start' }}>Send all to client</button>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                  <BqIcon d="M12 4 L21 19 H3 Z M12 10 V14 M12 16.5 V16.6" size={14} style={{ color: 'var(--bq-brand-strong)' }}></BqIcon>
                  <span style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--bq-brand-strong)' }}>Risk flags</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {RISKS.map((r) => (
                    <div key={r.t} style={{ background: 'var(--bq-raise)', borderRadius: 12, boxShadow: 'inset 0 0 0 1px var(--bq-brand-border)', padding: '10px 12px' }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--bq-brand-strong)' }}>{r.t}</div>
                      <div style={{ fontSize: 12, color: 'var(--bq-muted)', lineHeight: 1.45, marginTop: 2 }}>{r.b}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8, position: 'sticky', bottom: 0, background: 'var(--bq-ai-soft)', paddingTop: 8 }}>
                <button className="bq-btn primary" style={{ width: '100%' }} onClick={() => window.__bqNav && window.__bqNav('Estimates')}>
                  Accept &amp; open estimate →
                </button>
                <button className="bq-btn ghost sm" style={{ width: '100%' }} onClick={() => setPhase('input')}>Discard draft</button>
              </div>
            </aside>

            <div className="ai-collapsed" style={{ position: 'absolute', right: 20, bottom: 20 }}>
              <button className="bq-btn primary" onClick={() => window.__bqNav && window.__bqNav('Estimates')}>Accept &amp; open estimate →</button>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
window.HifiAiEstimate = HifiAiEstimate;
