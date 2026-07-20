// BuilderIQ - Sales pipeline (kanban), Marketing ROI, Follow-up sequences

// ════════════════════════════ SALES PIPELINE (kanban) ════════════════════════════
const SALES_STAGES = [
  ['New lead', '', 'var(--bq-faint)'],
  ['Qualified', '', 'var(--bq-muted)'],
  ['Estimating', 'ai', 'var(--bq-ai-strong)'],
  ['Proposal sent', 'brand', 'var(--bq-brand-strong)'],
  ['Won', 'good', 'var(--bq-good)'],
];
const SALES_DEALS0 = [
  { id: 'd1', stage: 'New lead', name: 'Tran - attic conversion', source: 'Referral · Henderson', value: 99000, fit: 8, age: 'new', warm: true },
  { id: 'd2', stage: 'New lead', name: 'Webb - kitchen reface', source: 'Website form', value: 42000, fit: 7, age: '2d' },
  { id: 'd3', stage: 'New lead', name: 'Faulkner - interior repaint', source: 'Website form', value: 16000, fit: 4, age: '10d', cold: true },
  { id: 'd4', stage: 'Qualified', name: 'Hartley - whole-home reno', source: 'Phone · Mike', value: 310000, fit: 9, age: '3d', warm: true },
  { id: 'd5', stage: 'Qualified', name: 'Ross - garage ADU', source: 'Phone · Mike', value: 152000, fit: 9, age: '4d' },
  { id: 'd6', stage: 'Estimating', name: 'Okonkwo - primary bath gut', source: 'Website form', value: 52000, fit: 8, age: '5d' },
  { id: 'd7', stage: 'Estimating', name: 'Vance - basement ADU', source: 'Referral · Osorio', value: 135000, fit: 8, age: '6d' },
  { id: 'd8', stage: 'Proposal sent', name: 'Kim - mudroom + laundry', source: "Referral · O'Brien", value: 36000, fit: 8, age: '8d', warm: true },
  { id: 'd9', stage: 'Proposal sent', name: 'Delacroix - screened porch', source: 'Referral · Chen', value: 58000, fit: 7, age: '11d', stale: true },
  { id: 'd10', stage: 'Won', name: 'Henderson - Kitchen + Hall Bath', source: 'Referral', value: 186400, fit: 9, age: 'signed' },
];

function SalesCard({ d, onDragStart }) {
  const flag = d.warm ? ['good', 'Hot'] : d.cold ? ['', 'Low fit'] : d.stale ? ['brand', 'Idle 11d'] : null;
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, d.id)}
      className="bq-card-s"
      style={{ padding: '11px 13px', cursor: 'grab', boxShadow: '0 1px 2px rgba(38,35,30,0.06), 0 0 0 1px var(--bq-border)', display: 'flex', flexDirection: 'column', gap: 7 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <span style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3, flex: 1 }}>{d.name}</span>
        {flag ? <span className={'bq-chip ' + flag[0]} style={{ flex: 'none', fontSize: 10.5, padding: '1px 7px' }}>{flag[1]}</span> : null}
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>{d.source}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="bq-num" style={{ fontSize: 15, color: 'var(--bq-ink)' }}>{bqMoney(d.value)}</span>
        <span style={{ flex: 1 }}></span>
        <span className="bq-chip ai" style={{ fontSize: 10.5, padding: '1px 7px' }}><BqSpark size={9}></BqSpark>{d.fit}/10</span>
        <span style={{ fontSize: 11, color: 'var(--bq-faint)' }}>{d.age}</span>
      </div>
    </div>
  );
}

function HifiSalesPipeline() {
  const [deals, setDeals] = React.useState(SALES_DEALS0);
  const [over, setOver] = React.useState(null);
  const dragId = React.useRef(null);
  const [adding, setAdding] = React.useState(false);
  const onDragStart = (e, id) => { dragId.current = id; e.dataTransfer.effectAllowed = 'move'; };
  const onDrop = (stage) => {
    const id = dragId.current; dragId.current = null; setOver(null);
    if (!id) return;
    setDeals((ds) => ds.map((d) => d.id === id ? { ...d, stage } : d));
  };
  const byStage = (s) => deals.filter((d) => d.stage === s);
  const sum = (s) => byStage(s).reduce((a, d) => a + d.value, 0);
  const open = deals.filter((d) => d.stage !== 'Won');
  const openVal = open.reduce((a, d) => a + d.value, 0);
  // weighted = value × stage-probability
  const prob = { 'New lead': 0.1, 'Qualified': 0.25, 'Estimating': 0.45, 'Proposal sent': 0.7, 'Won': 1 };
  const weighted = open.reduce((a, d) => a + d.value * prob[d.stage], 0);

  return (
    <div className="bq-screen">
      <BqTop crumb="Sales pipeline" right={<React.Fragment><button className="bq-btn soft-ai sm"><BqSpark size={12}></BqSpark>Find stalled deals</button><button className="bq-btn primary sm" onClick={() => setAdding(true)}>+ New deal</button></React.Fragment>}></BqTop>
      {adding ? <BqQuickForm title="New deal" sub="Add an opportunity to your pipeline." saveLabel="Add deal" fields={[{ k: 'name', label: 'Deal name', req: true, ph: 'e.g. Tran - attic conversion' }, { k: 'source', label: 'Source', ph: 'Referral, website, phone…' }, { k: 'value', label: 'Estimated value', type: 'number', prefix: '$', ph: '0' }, { k: 'stage', label: 'Stage', type: 'select', options: SALES_STAGES.map((s) => s[0]) }]} onClose={() => setAdding(false)} onSave={(v) => { setDeals((ds) => ds.concat({ id: 'd' + Date.now(), stage: v.stage, name: v.name, source: v.source || 'Manual entry', value: parseFloat(v.value) || 0, fit: 7, age: 'new' })); setAdding(false); }}></BqQuickForm> : null}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Sales Pipeline"></BqSide>
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: 'calc(16px * var(--bq-sp)) 24px calc(12px * var(--bq-sp))', display: 'flex', flexDirection: 'column', gap: 'calc(12px * var(--bq-sp))', flex: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span className="bq-display" style={{ fontSize: 20 }}>Sales pipeline</span>
              <span style={{ fontSize: 13, color: 'var(--bq-muted)' }}>{open.length} open · {bqMoney(openVal)} potential · {bqMoney(Math.round(weighted))} weighted</span>
            </div>
            <div style={{ display: 'flex', gap: 'calc(12px * var(--bq-sp))', flexWrap: 'wrap' }}>
              <BqKPI label="Weighted pipeline" value={bqMoney(Math.round(weighted))} sub="value × stage probability" tone="ai"></BqKPI>
              <BqKPI label="Win rate (90d)" value="38%" sub="industry avg. ~30%"></BqKPI>
              <BqKPI label="Avg. days to close" value="24" sub="lead → signed"></BqKPI>
              <BqKPI label="Idle > 7 days" value="1 deal" sub="needs a nudge" tone="warn"></BqKPI>
            </div>
            <section className="bq-ai-card ai-expanded" style={{ padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <BqSpark></BqSpark>
              <span style={{ fontSize: 13, color: 'var(--bq-ink)', flex: 1 }}><b>Delacroix - screened porch</b> has sat in <b>Proposal sent</b> for 11 days with no reply. Deals stall here most. Send a follow-up or schedule a call?</span>
              <button className="bq-btn ai sm">Draft follow-up</button>
              <button className="bq-btn ghost sm">Dismiss</button>
            </section>
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: '0 24px 20px' }}>
            <div style={{ display: 'flex', gap: 14, minWidth: 'min-content', height: '100%' }}>
              {SALES_STAGES.map(([stage, tone, col]) => {
                const cards = byStage(stage);
                return (
                  <div
                    key={stage}
                    onDragOver={(e) => { e.preventDefault(); setOver(stage); }}
                    onDragLeave={() => setOver((o) => o === stage ? null : o)}
                    onDrop={() => onDrop(stage)}
                    style={{ width: 244, flex: 'none', display: 'flex', flexDirection: 'column', gap: 9, background: over === stage ? 'var(--bq-ai-soft)' : 'var(--bq-subtle)', borderRadius: 16, padding: 10, boxShadow: over === stage ? 'inset 0 0 0 2px var(--bq-ai-border)' : 'none', transition: 'background .12s' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '4px 4px 2px' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: col, flex: 'none' }}></span>
                      <span style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--bq-ink)' }}>{stage}</span>
                      <span className="bq-chip" style={{ fontSize: 10.5, padding: '0 7px' }}>{cards.length}</span>
                      <span style={{ flex: 1 }}></span>
                      <span className="bq-num" style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>{bqMoney(sum(stage))}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 9, overflowY: 'auto' }}>
                      {cards.map((d) => <SalesCard key={d.id} d={d} onDragStart={onDragStart}></SalesCard>)}
                      {!cards.length ? <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', textAlign: 'center', padding: '14px 0' }}>Drop deals here</div> : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
window.HifiSalesPipeline = HifiSalesPipeline;

// ════════════════════════════ MARKETING - lead-source ROI ════════════════════════════
const MKT_SOURCES = [
  { src: 'Referrals', g: 'partners', leads: 14, cost: 0, booked: 9, won: 412000, tone: 'good' },
  { src: 'Website / SEO', g: 'globe', leads: 11, cost: 1850, booked: 4, won: 188000 },
  { src: 'Houzz Pro', g: 'home', leads: 8, cost: 1400, booked: 3, won: 142000 },
  { src: 'Google LSA', g: 'search', leads: 7, cost: 1620, booked: 2, won: 96000 },
  { src: 'Angi', g: 'hammer', leads: 5, cost: 1180, booked: 1, won: 41000, tone: 'warn' },
  { src: 'Instagram', g: 'camera', leads: 2, cost: 320, booked: 0, won: 0, tone: 'warn' },
];

function MktBar({ value, max, tone }) {
  return (
    <div style={{ flex: 1, height: 8, background: 'var(--bq-subtle)', borderRadius: 999, overflow: 'hidden' }}>
      <div style={{ width: (value / max * 100) + '%', height: '100%', borderRadius: 999, background: tone === 'good' ? 'var(--bq-good)' : tone === 'warn' ? 'var(--bq-brand)' : 'var(--bq-ai)' }}></div>
    </div>
  );
}

function HifiMarketing() {
  const totLeads = MKT_SOURCES.reduce((a, s) => a + s.leads, 0);
  const totCost = MKT_SOURCES.reduce((a, s) => a + s.cost, 0);
  const totWon = MKT_SOURCES.reduce((a, s) => a + s.won, 0);
  const maxWon = Math.max(...MKT_SOURCES.map((s) => s.won));
  const cpl = (s) => s.cost === 0 ? '$0' : '$' + Math.round(s.cost / s.leads);
  const roi = (s) => s.cost === 0 ? '∞' : (s.won / s.cost).toFixed(1) + '×';
  const bookRate = (s) => Math.round(s.booked / s.leads * 100) + '%';

  return (
    <div className="bq-screen">
      <BqTop crumb="Marketing · lead-source ROI" right={<React.Fragment><span className="bq-chip">Last 90 days</span><button className="bq-btn sm"><BqIcon d={BQ_GLYPH.exports} size={13}></BqIcon>Export</button></React.Fragment>}></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Marketing"></BqSide>
        <main style={{ flex: 1, padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))', overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span className="bq-display" style={{ fontSize: 20 }}>Where your work comes from</span>
            <span style={{ fontSize: 13, color: 'var(--bq-muted)' }}>{totLeads} leads · {bqMoney(totCost)} spent · {bqMoney(totWon)} won</span>
          </div>
          <div style={{ display: 'flex', gap: 'calc(12px * var(--bq-sp))', flexWrap: 'wrap' }}>
            <BqKPI label="Leads (90d)" value={String(totLeads)} sub="across 6 channels"></BqKPI>
            <BqKPI label="Blended cost / lead" value={'$' + Math.round(totCost / totLeads)} sub="paid channels only"></BqKPI>
            <BqKPI label="Booked rate" value="40%" sub="lead → estimate booked" tone="ai"></BqKPI>
            <BqKPI label="Marketing ROI" value={(totWon / totCost).toFixed(1) + '×'} sub="won value ÷ ad spend" tone="good"></BqKPI>
          </div>

          <section className="bq-ai-card ai-expanded" style={{ padding: '13px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <BqSpark></BqSpark>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--bq-ai-strong)', marginBottom: 3 }}>Your $0 channel drives the most revenue</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5 }}>Referrals close at <b>64%</b> vs <b>23%</b> for paid, and account for <b>41% of won revenue</b> at no ad cost. Angi & Instagram spent <b>$1,500</b> for one $41k job. Consider a referral reward and pausing Instagram.</div>
            </div>
            <button className="bq-btn ai sm">Set up referral reward</button>
          </section>

          <section className="bq-card-s" style={{ overflow: 'hidden' }}>
            <div className="bq-trow head" style={{ gridTemplateColumns: '1.5fr 0.7fr 0.9fr 0.9fr 0.8fr 1.6fr 0.7fr' }}>
              <span>Source</span><span>Leads</span><span>Spend</span><span>Cost / lead</span><span>Booked</span><span>Won value</span><span>ROI</span>
            </div>
            {MKT_SOURCES.map((s) => (
              <div key={s.src} className="bq-trow" style={{ gridTemplateColumns: '1.5fr 0.7fr 0.9fr 0.9fr 0.8fr 1.6fr 0.7fr', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <span style={{ width: 28, height: 28, borderRadius: 8, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-subtle)', color: 'var(--bq-muted)' }}><BqIcon d={BQ_GLYPH[s.g]} size={15}></BqIcon></span>
                  <span style={{ fontWeight: 600 }}>{s.src}</span>
                </div>
                <span className="cell-num">{s.leads}</span>
                <span className="cell-num" style={{ color: 'var(--bq-muted)' }}>{s.cost ? bqMoney(s.cost) : '-'}</span>
                <span className="cell-num">{cpl(s)}</span>
                <span className="cell-num">{bookRate(s)}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <MktBar value={s.won} max={maxWon} tone={s.tone}></MktBar>
                  <span className="bq-num" style={{ fontSize: 12.5, width: 58, textAlign: 'right' }}>{s.won ? bqMoney(s.won) : '$0'}</span>
                </div>
                <span className={'bq-chip ' + (s.tone === 'good' ? 'good' : s.tone === 'warn' ? 'brand' : 'ai')} style={{ justifySelf: 'start' }}>{roi(s)}</span>
              </div>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
window.HifiMarketing = HifiMarketing;

// ════════════════════════════ FOLLOW-UPS - drip sequences ════════════════════════════
const SEQUENCES = [
  {
    id: 's1', name: 'New web lead - 5-touch nurture', on: true, enrolled: 6, reply: 31, trigger: 'Lead created from website form',
    steps: [
      ['Day 0', 'email', 'Thanks + what to expect', 'auto'],
      ['Day 0', 'task', 'Owner reviews fit score', 'task'],
      ['Day 2', 'text', '“Still planning your project?” check-in', 'auto'],
      ['Day 5', 'task', 'Call - book a walkthrough', 'task'],
      ['Day 9', 'email', 'Recent project + reviews', 'auto'],
    ],
  },
  {
    id: 's2', name: 'Estimate sent - no response', on: true, enrolled: 3, reply: 44, trigger: 'Estimate sent, no reply in 3 days',
    steps: [
      ['Day 3', 'email', 'Recap the estimate + offer a call', 'auto'],
      ['Day 6', 'text', '“Any questions on the numbers?”', 'auto'],
      ['Day 10', 'task', 'Personal call from owner', 'task'],
    ],
  },
  {
    id: 's3', name: 'Proposal sent follow-up', on: true, enrolled: 2, reply: 58, trigger: 'Proposal sent, not signed',
    steps: [
      ['Day 2', 'email', 'Make sure it opened + next steps', 'auto'],
      ['Day 5', 'task', 'Call to walk the proposal', 'task'],
      ['Day 9', 'email', 'Financing options reminder', 'auto'],
    ],
  },
  {
    id: 's4', name: 'Past client - annual check-in', on: false, enrolled: 0, reply: 22, trigger: '12 months after closeout',
    steps: [
      ['Month 12', 'email', 'Warranty check + “how’s it holding up?”', 'auto'],
      ['Month 12', 'task', 'Ask for a review + referral', 'task'],
    ],
  },
  {
    id: 's5', name: 'Cold lead reactivation', on: false, enrolled: 0, reply: 14, trigger: 'No activity in 60 days',
    steps: [
      ['Day 0', 'email', '“Still thinking about it?” + new work', 'auto'],
      ['Day 7', 'text', 'Limited fall opening offer', 'auto'],
    ],
  },
];
const SEQ_KIND = { email: ['proposal', 'Email'], text: ['inbox', 'Text'], task: ['task', 'Task'] };

function SeqStep({ s, last }) {
  const [day, kind, label, type] = s;
  const [g] = SEQ_KIND[kind];
  const isTask = type === 'task';
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none' }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isTask ? 'var(--bq-brand-soft)' : 'var(--bq-ai-soft)', color: isTask ? 'var(--bq-brand-strong)' : 'var(--bq-ai-strong)', boxShadow: 'inset 0 0 0 1px ' + (isTask ? 'var(--bq-brand-border)' : 'var(--bq-ai-border)') }}><BqIcon d={BQ_GLYPH[g]} size={15}></BqIcon></span>
        {!last ? <span style={{ width: 2, flex: 1, minHeight: 22, background: 'var(--bq-border)' }}></span> : null}
      </div>
      <div style={{ flex: 1, paddingBottom: last ? 0 : 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 13 }}>{label}</span>
          <span className={'bq-chip ' + (isTask ? 'brand' : 'ai')} style={{ fontSize: 10.5, padding: '0 7px' }}>{SEQ_KIND[kind][1]}{isTask ? ' · for you' : ' · auto'}</span>
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', marginTop: 2 }}>{day} after enrollment</div>
      </div>
    </div>
  );
}

function HifiSequences() {
  const [seqs, setSeqs] = React.useState(SEQUENCES);
  const [sel, setSel] = React.useState('s1');
  const [addingSeq, setAddingSeq] = React.useState(false);
  const [addingStep, setAddingStep] = React.useState(false);
  const cur = seqs.find((s) => s.id === sel);
  const toggle = (id) => setSeqs((ss) => ss.map((s) => s.id === id ? { ...s, on: !s.on } : s));
  const totalEnrolled = seqs.reduce((a, s) => a + s.enrolled, 0);

  return (
    <div className="bq-screen">
      <BqTop crumb="Follow-up sequences" right={<button className="bq-btn primary sm" onClick={() => setAddingSeq(true)}>+ New sequence</button>}></BqTop>
      {addingSeq ? <BqQuickForm title="New sequence" sub="Automate follow-ups for a group of leads or clients." saveLabel="Create sequence" fields={[{ k: 'name', label: 'Sequence name', req: true, ph: 'e.g. New web lead - 5-touch' }, { k: 'trigger', label: 'Enrolls when', ph: 'Lead created from website form' }]} onClose={() => setAddingSeq(false)} onSave={(v) => { const id = 's' + Date.now(); setSeqs((ss) => ss.concat({ id, name: v.name, trigger: v.trigger || 'Manual enrollment', on: true, enrolled: 0, reply: 0, steps: [['Day 0', 'email', 'Intro + what to expect', 'auto'], ['Day 3', 'task', 'Personal follow-up call', 'task']] })); setSel(id); setAddingSeq(false); }}></BqQuickForm> : null}
      {addingStep ? <BqQuickForm title="Add step" sub="A new touch in this sequence." saveLabel="Add step" fields={[{ k: 'label', label: 'What happens', req: true, ph: 'e.g. Check in on the estimate' }, { k: 'kind', label: 'Type', type: 'select', options: ['email', 'text', 'task'] }, { k: 'day', label: 'When', ph: 'e.g. Day 2' }]} onClose={() => setAddingStep(false)} onSave={(v) => { setSeqs((ss) => ss.map((s) => s.id === sel ? { ...s, steps: s.steps.concat([[v.day || 'Day 0', v.kind, v.label, v.kind === 'task' ? 'task' : 'auto']]) } : s)); setAddingStep(false); }}></BqQuickForm> : null}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Follow-ups"></BqSide>
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          {/* list */}
          <div style={{ width: 340, flex: 'none', borderRight: '1px solid var(--bq-border)', background: 'var(--bq-card)', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 18px 10px' }}>
              <div className="bq-display" style={{ fontSize: 18 }}>Follow-ups</div>
              <div style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{totalEnrolled} contacts being nurtured automatically</div>
            </div>
            <div className="bq-ai-card ai-expanded" style={{ margin: '0 14px 10px', padding: '10px 13px', display: 'flex', gap: 9, alignItems: 'center' }}>
              <BqSpark size={13}></BqSpark>
              <span style={{ fontSize: 12, color: 'var(--bq-muted)', lineHeight: 1.4 }}>Leads on the 5-touch sequence book <b>28% more often</b> than those left alone.</span>
            </div>
            {seqs.map((s) => (
              <div key={s.id} onClick={() => setSel(s.id)} style={{ padding: '12px 16px', borderTop: '1px solid var(--bq-border)', cursor: 'pointer', background: s.id === sel ? 'var(--bq-brand-soft)' : 'transparent', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 13, flex: 1, color: s.id === sel ? 'var(--bq-brand-strong)' : 'var(--bq-ink)' }}>{s.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); toggle(s.id); }} style={{ width: 36, height: 21, borderRadius: 999, border: 'none', cursor: 'pointer', flex: 'none', background: s.on ? 'var(--bq-good)' : 'var(--bq-border-strong)', position: 'relative' }}><span style={{ position: 'absolute', top: 2, left: s.on ? 17 : 2, width: 17, height: 17, borderRadius: '50%', background: '#fff', transition: 'left .15s' }}></span></button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5, color: 'var(--bq-faint)' }}>
                  <span>{s.steps.length} steps</span><span>·</span><span>{s.enrolled} enrolled</span><span>·</span><span className={s.reply >= 40 ? 'bq-chip good' : 'bq-chip'} style={{ fontSize: 10.5, padding: '0 7px' }}>{s.reply}% reply</span>
                </div>
              </div>
            ))}
          </div>

          {/* detail */}
          <div style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 28px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <div className="bq-display" style={{ fontSize: 21 }}>{cur.name}</div>
                <div style={{ fontSize: 13, color: 'var(--bq-muted)', marginTop: 3 }}>Enrolls when: <b style={{ color: 'var(--bq-ink)' }}>{cur.trigger}</b></div>
              </div>
              <span className={'bq-chip ' + (cur.on ? 'good' : '')}>{cur.on ? 'Active' : 'Paused'}</span>
            </div>
            <div style={{ display: 'flex', gap: 'calc(12px * var(--bq-sp))', flexWrap: 'wrap', marginBottom: 18 }}>
              <BqKPI label="Enrolled now" value={String(cur.enrolled)}></BqKPI>
              <BqKPI label="Reply rate" value={cur.reply + '%'} tone={cur.reply >= 40 ? null : 'ai'}></BqKPI>
              <BqKPI label="Steps" value={String(cur.steps.length)} sub="mix of auto + your tasks"></BqKPI>
            </div>
            <div className="bq-card-s" style={{ padding: 'calc(18px * var(--bq-sp)) 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Sequence steps</span>
                <span style={{ flex: 1 }}></span>
                <button className="bq-btn soft-ai sm"><BqSpark size={11}></BqSpark>Rewrite tone</button>
                <button className="bq-btn sm" onClick={() => setAddingStep(true)}>+ Add step</button>
              </div>
              {cur.steps.map((s, i) => <SeqStep key={i} s={s} last={i === cur.steps.length - 1}></SeqStep>)}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
window.HifiSequences = HifiSequences;
