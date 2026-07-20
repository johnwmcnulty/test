// Hi-fi Mobile field interface - part 3. "Ask BuilderIQ" - the field AI assistant.
// Voice-first chat grounded in the active job (Henderson). Answers spec / selection /
// schedule / measurement / contact questions with rich answer cards + citations, and can
// draft a change order inline (wired: sends into the sync queue). Uses hifi-ask-shared.jsx.

// ── grounded knowledge for the Henderson - Kitchen + Hall Bath job ──
const FIELD_ASK_KB = [
  { k: ['tile', 'backsplash', 'zellige', 'floor', 'flooring'], a: 'Here are the approved tile selections - shower runs stacked vertical to the ceiling, backsplash is running bond.', src: 'Selections · approved May 12',
    card: { type: 'spec', title: 'Tile & flooring - approved', rows: [['Hall-bath shower', 'Cloé zellige 2.5×8 · Bianco matte'], ['Kitchen backsplash', 'Cloé zellige · Sage'], ['Floors throughout', 'Emser Nature 12×24 · Greige'], ['Grout', '1/8" · Delorean Gray']] } },
  { k: ['cabinet', 'delivery', 'crestwood'], a: 'Crestwood cabinets land Tue Jun 18 - stage them in the garage, not the kitchen. Finish is painted Sage Mist with a 3" Shaker; hardware ships separately.', act: [['Open schedule', 'cal']], src: 'Schedule · updated yesterday',
    card: { type: 'schedule', items: [['Tue 18', 'Cabinet delivery - stage in garage', 'brand'], ['Thu 20', 'Countertop template'], ['Fri 21', 'Electrical trim inspection']] } },
  { k: ['ceiling', 'height', 'soffit'], a: 'Kitchen finished ceiling is 9\'-1". The soffit over the sink run drops to 8\'-0" to carry the range-hood duct out the north wall. Hall bath stays at 8\'-0".', src: 'Plan A-201 · kitchen sections' },
  { k: ['grab bar', 'blocking', 'bath', 'accessib'], a: 'Hall-bath grab bars need 2x10 blocking, centerline 33"–36" off finished floor: a 32" run on the back wall and a 42" run on the control wall, per the accessibility selection.', act: [['See the task', 'home']], src: 'Plan A-301 + accessibility selection' },
  { k: ['paint', 'color', 'sherwin', 'wall', 'trim'], a: 'Paint schedule below - hall-bath ceiling gets the same Alabaster in a bath-grade satin.', src: 'Selections · paint schedule',
    card: { type: 'spec', title: 'Paint - Sherwin-Williams', rows: [['Walls', 'Accessible Beige 7036 · eggshell'], ['Trim & doors', 'Alabaster 7008 · semi-gloss'], ['Hall-bath ceiling', 'Alabaster 7008 · bath satin']] } },
  { k: ['electric', 'recessed', 'can', 'light', 'outlet', 'pendant'], a: 'Kitchen: 6 recessed cans on two switched zones, under-cabinet LED tape, 2 island pendants on a dimmer. Hall bath: paired vanity sconces + an exhaust-fan/light combo. All small-appliance circuits are 20A AFCI.', src: 'Plan E-2 · electrical' },
  { k: ['inspect', 'permit', 'inspector'], a: 'Ray confirmed a 1:00 PM window today for the framing/electrical rough. The permit card is in the project files under Henderson.', act: [['Open files', 'proj']], src: 'Permit record · Henderson',
    card: { type: 'contact', name: 'Ray Alcala', role: 'City inspector · framing & electrical', phone: '(512) 555-0188' } },
  { k: ['who', 'contact', 'call', 'pm', 'manager'], a: 'Tasha runs this job. Electrician is Vega Electric (Luis), plumber is Ferguson\'s install crew, and Maria is your owner contact at the office.', src: 'Project directory',
    card: { type: 'contact', name: 'Tasha Bell', role: 'Project manager · Henderson', phone: '(512) 555-0142', msgTarget: 'messages' } },
  { k: ['schedule', 'next', 'today', 'when', 'upcoming'], a: 'Nothing has moved since yesterday - today is shoring, then cabinets Tuesday.', act: [['Open schedule', 'cal']], src: 'Schedule · updated yesterday',
    card: { type: 'schedule', items: [['Today', 'Pull temporary shoring - structural sign-off is in', 'brand'], ['Tue 18', 'Cabinet delivery'], ['Fri 20', 'Electrical trim inspection']] } },
  { k: ['change order', 'extra work', 'not in scope', 'out of scope', 'unbilled', 'island outlet'], a: 'Anything outside the contract should go in as a change order so it doesn\'t get eaten. Here\'s a draft from what you described - check it and send it to the office to confirm pricing.', src: 'Contract scope · Henderson',
    card: { type: 'draft', kind: 'Change order', title: 'Island outlet relocation', amount: '+$640', rows: [['Scope', 'Move two island outlets per client request'], ['Pricing', 'T&M · 3 hrs + materials'], ['Client', 'Needs Henderson approval']], cta: 'Send to office', sentLabel: 'Sent - office will confirm' } },
  { k: ['log', 'daily', 'report'], a: 'I can write up today\'s daily log from a few rough notes or a voice memo - and prep a homeowner-safe version to share with the Hendersons.', act: [['Start a daily log', 'log']] },
  { k: ['clock', 'time', 'hours'], a: 'Want me to start your time? I\'ll clock you in on Henderson with a GPS stamp - it flows straight into job costing.', act: [['Go to time', 'time']] },
  { k: ['receipt', 'expense', 'material', 'bought'], a: 'Snap the receipt and I\'ll read the vendor and amount, suggest a cost code, and post it to the Henderson budget.', act: [['Snap a receipt', 'receipt']] },
];
const FIELD_ASK_SUGGEST = [
  "What's the hall-bath tile?",
  'When do cabinets arrive?',
  'Kitchen ceiling height?',
  'Grab-bar blocking?',
  'Who\'s the inspector?',
  'Draft a change order',
];
const FIELD_ASK_VOICE = [
  'What size blocking for the hall-bath grab bars?',
  'When is the countertop template?',
  'Client wants the island outlets moved - draft a change order',
];
const FIELD_ASK_GREET = { role: 'ai', text: 'Morning, Marco - I\'ve got the Henderson job loaded. Ask me about the plans, selections, schedule, or who to call. You can talk or type.' };
const FIELD_ASK_GREET_CLEAN = { role: 'ai', text: 'Welcome to BuilderIQ Field. Once you\'re assigned a job, ask me about the plans, selections, schedule, or who to call - you can talk or type.' };
const FIELD_ASK_ACTIONS = [
  ['Open the schedule', 'cal'], ['Open today\'s tasks', 'home'], ['Open project files', 'proj'], ['Message the office', 'messages'],
  ['Draft a change order', 'co'], ['Start a daily log', 'log'], ['Go to the time clock', 'time'], ['Snap a receipt', 'receipt'], ['Open photos', 'photos'],
];
const FIELD_ASK_SYS = [
  'You are "Ask BuilderIQ", the jobsite AI assistant in the BuilderIQ field app. You are talking to Marco Diaz, lead carpenter, standing on the Henderson - Kitchen + Hall Bath job. His hands are often busy: answer fast, concrete, and specific - measurements, dates, names, phone numbers.',
  'Voice: crew-boss plain talk. 1-3 short sentences. No markdown.',
  'FACTS - the Henderson job:',
  ...FIELD_ASK_KB.map((e) => '- ' + e.a + bqCardFacts(e.card)),
  'Marco can capture from here: daily logs, change orders, receipts, photos, and time (clock in/out on Henderson).',
].join('\n');
// contextual follow-ups keyed by each KB entry's first keyword
const FIELD_FU = {
  tile: ['What grout & color?', 'When does tile go in?'],
  cabinet: ['Where do I stage them?', 'When is the countertop template?'],
  ceiling: ['What about the hall bath?'],
  'grab bar': ['Show the accessibility spec', 'Where is the task?'],
  paint: ['What sheen on the trim?'],
  electric: ['How many circuits?', 'Where do the pendants go?'],
  inspect: ['Call the inspector', 'Where is the permit card?'],
  who: ['Call Tasha', 'Message the office'],
  schedule: ['What lands Tuesday?', 'Anything today?'],
  'change order': ['Send it to the office', "What counts as out of scope?"],
  log: ['Start it now'],
  clock: ['Clock me in on Henderson'],
  receipt: ['Snap a receipt'],
};
const FIELD_ASK_SUGGEST_CLEAN = ['What job am I on?', 'Start a daily log', 'Snap a receipt', 'Message the office'];
const FIELD_ASK_VOICE_CLEAN = ['What job am I on today?', 'Start a daily log', 'Clock me in'];
function fieldCleanOn() { return !!(window.bqClean && window.bqClean()); }
function fieldSys() {
  if (!fieldCleanOn()) return FIELD_ASK_SYS;
  const P = window.bqProj; const jobs = P ? P.actives() : [];
  const head = [
    'You are "Ask BuilderIQ", the jobsite AI assistant in the BuilderIQ field app. You are talking to a field crew member. Answer fast, concrete, and specific.',
    'Voice: crew-boss plain talk. 1-3 short sentences. No markdown.',
    'CRITICAL: only use the facts listed below, from the live workspace. Do NOT invent jobs, specs, measurements, selections, schedules, names, or any example/demo data. If you do not have it, say so and offer to raise it with the office.',
  ];
  if (!jobs.length) head.push('FACTS - no job is assigned in the workspace yet. Tell the worker nothing is loaded and offer to help once a job is assigned. Invent nothing.');
  else { head.push('FACTS - active jobs in the workspace:'); jobs.forEach(function (x) { head.push('- ' + x.client.name + ' - ' + (x.project.title || 'project') + ' · ' + x.project.stage + ' · ' + P.pct(x.project) + '% complete'); }); }
  head.push('You can capture from here: daily logs, change orders, receipts, photos, and time.');
  return head.join('\n');
}
function fieldAnswerClean(q) {
  const P = window.bqProj; const jobs = P ? P.actives() : [];
  if (!jobs.length) return { text: "There's no job loaded yet. Once the office assigns you one, I can pull specs, selections, schedule and contacts - and write up logs or change orders for you.", act: null, followups: null };
  return { text: 'I can pull specs, selections, schedule, and contacts for your assigned jobs, and write up a daily log or draft a change order. What do you need?', act: [['Start a daily log', 'log']], followups: ['Start a daily log', 'Snap a receipt'] };
}
function fieldAnswer(q) {
  if (fieldCleanOn()) return fieldAnswerClean(q);
  const ql = q.toLowerCase();
  const hit = FIELD_ASK_KB.find((e) => e.k.some((kw) => ql.includes(kw)));
  if (hit) return { text: hit.a, act: hit.act || null, card: hit.card || null, src: hit.src || null, followups: FIELD_FU[hit.k[0]] || null };
  return { text: 'I can pull anything on the Henderson job - specs, selections, measurements, schedule, or contacts - and I can write up a daily log or draft a change order for you. What do you need?', act: [['Draft a log', 'log'], ['Log a change order', 'co']], followups: ["What's the hall-bath tile?", 'When do cabinets arrive?', 'Who do I call?'] };
}

function FieldAsk() {
  const { go, clock, startClock, showToast, enqueue, proj } = useField();
  const [msgs, setMsgs] = window.bqPersistState(window.bqClean() ? 'ask-field-clean' : 'ask-field', [window.bqClean() ? FIELD_ASK_GREET_CLEAN : FIELD_ASK_GREET]);
  const [text, setText] = React.useState('');
  const [thinking, setThinking] = React.useState(false);
  const scrollRef = React.useRef(null);
  const jobName = () => { const P = window.bqProj; const j = P ? P.actives()[0] : null; return j ? (j.client.name + ' - ' + (j.project.title || 'project')) : (window.__bqFieldProj || 'your job'); };
  const FIELD_FLOWS = {
    log: {
      intro: "Let's write up today's log.",
      steps: [
        { key: 'work', q: 'What got done on site today?', ph: 'e.g. Set lower cabinets, ran sink plumbing' },
        { key: 'crew', q: 'Who was on site?', chips: ['Just me', 'Me + one', 'Full crew', 'Me + a sub'] },
        { key: 'issue', q: 'Anything blocking or worth flagging?', chips: ['All good', 'Waiting on materials', 'Need a decision', 'Weather delay'] },
        { key: 'share', q: 'Share a homeowner-friendly version with the client?', chips: ['Share with client', 'Keep internal'] },
      ],
      commit: (a) => {
        const shared = /share/i.test(a.share || '');
        const P = window.bqProj; const j = P ? P.actives()[0] : null;
        if (j) P.addLog(j.project.id, { date: 'Today', summary: a.work + (/(all good)/i.test(a.issue || '') ? '' : ' · ' + a.issue), shared: shared });
        enqueue && enqueue({ kind: 'log', glyph: 'log', label: "Daily log · " + (a.work || 'site update').slice(0, 40), project: proj || jobName() });
        return { shared: shared };
      },
      done: (a, res) => ({ text: res && res.shared ? "Logged it and shared a clean version to the client's portal. Nice work today." : "Logged it as an internal note. Nice work today.", followups: ['Snap a receipt', 'Clock out'] }),
    },
    co: {
      intro: "Let's capture a change order before it gets lost.",
      steps: [
        { key: 'desc', q: 'What changed? (the extra work)', ph: 'e.g. Move two island outlets' },
        { key: 'why', q: 'Why - who asked?', chips: ['Client asked', 'Field condition', 'Inspector required', 'Design change'] },
        { key: 'price', q: 'Rough price, if you know it?', chips: ['T&M - office prices it', 'Under $500', '$500-1,500', '$1,500-5,000'] },
      ],
      commit: (a) => {
        const label = 'Change order · ' + (a.desc || 'extra work') + (a.price && !/office/i.test(a.price) ? ' (' + a.price + ')' : '');
        enqueue && enqueue({ kind: 'co', glyph: 'co', label: label, project: proj || jobName() });
        return { desc: a.desc };
      },
      done: (a, res) => ({ text: 'Sent to the office as a draft change order. They\'ll price it and get client sign-off before it\'s billed - so your crew\'s time is covered.', followups: ['Log today\'s work', 'Message the office'] }),
    },
    clock: {
      precheck: () => clock ? { text: "You're already clocked in on " + (clock.proj || jobName()) + '. Want me to clock you out?', act: [['Go to time clock', 'time']] } : null,
      intro: "Let's get you on the clock.",
      steps: [{ key: 'confirm', q: () => 'Clock in on ' + jobName() + '?', chips: ['Clock me in', 'Not now'] }],
      commit: (a) => { if (/clock me in/i.test(a.confirm || '')) { const p = jobName(); startClock && startClock(p); return { on: p }; } return null; },
      done: (a, res) => ({ text: res ? 'Clocked in on ' + res.on + ' with a GPS stamp. It flows straight into job costing.' : 'No problem - I\'ll leave the clock alone.', act: res ? [['Go to time clock', 'time']] : null }),
    },
  };
  const flows = window.useBqFlows(setMsgs, FIELD_FLOWS);
  const fieldIntent = (low) => {
    if (!/\b(log|record|write|start|draft|capture|clock|add)\b/.test(low) && low.indexOf("let's") !== 0) return null;
    if (/change ?order|extra work|out of scope/.test(low)) return 'co';
    if (/\b(clock|time|hours)\b/.test(low)) return 'clock';
    if (/\b(log|daily|report|today)\b/.test(low)) return 'log';
    return null;
  };
  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [msgs, thinking]);
  React.useEffect(() => { setMsgs((m) => { const n = m.slice(); while (n.length > 1 && n[n.length - 1].role === 'me') n.pop(); return n.length === m.length ? m : n; }); }, []);

  const ask = (q) => {
    if (!q.trim() || thinking) return;
    setMsgs((m) => [...m, { role: 'me', text: q.trim(), ts: Date.now() }]);
    setText('');
    if (flows.flowActive()) { flows.advanceFlow(q.trim()); return; }
    const intent = fieldIntent(q.trim().toLowerCase());
    if (intent) { flows.startFlow(intent); return; }
    setThinking(true);
    const rich = fieldAnswer(q); // keyword-grounded card/citation, kept even when the live model writes the prose
    window.bqLiveAsk({ system: fieldSys(), actions: FIELD_ASK_ACTIONS, history: msgs, q: q.trim(), fallback: fieldAnswer }).then((ans) => {
      setThinking(false);
      setMsgs((m) => [...m, { role: 'ai', text: ans.text, act: ans.act, card: ans.card || rich.card || null, src: ans.src || rich.src || null, followups: ans.followups || rich.followups || null, ts: Date.now() }]);
    });
  };

  const runAction = (screen) => {
    if (screen === 'time' && !clock) { const p = window.__bqFieldProj || 'Henderson'; startClock(p); showToast('Clocked in · ' + p); }
    go(screen);
  };

  const sendDraft = (card) => {
    enqueue({ kind: 'co', glyph: 'co', label: 'Change order draft · ' + card.title + ' (' + card.amount + ')', project: proj || 'Henderson' });
    showToast('Change order sent to the office');
  };

  const voice = useBqVoice(ask, fieldCleanOn() ? FIELD_ASK_VOICE_CLEAN : FIELD_ASK_VOICE);
  const onlyGreeting = msgs.length === 1;
  const suggest = fieldCleanOn() ? FIELD_ASK_SUGGEST_CLEAN : FIELD_ASK_SUGGEST;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', margin: '0 -16px' }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '4px 16px 12px' }}>
        <span style={{ width: 38, height: 38, borderRadius: 12, flex: 'none', background: 'var(--bq-ai)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH.spark} size={20} sw={1.5} style={{ color: '#fff' }}></BqIcon></span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="bq-display" style={{ fontSize: 20, lineHeight: 1.1, display: 'flex', alignItems: 'center', gap: 8 }}>Ask BuilderIQ{window.bqAiLive && window.bqAiLive() ? <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 0.6, padding: '2px 7px', borderRadius: 999, background: 'var(--bq-ai-soft)', color: 'var(--bq-ai-strong)', boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)', textTransform: 'uppercase', fontFamily: 'var(--bq-font, inherit)' }}>Live</span> : null}</div>
          <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Henderson - Kitchen + Hall Bath</div>
        </div>
        <button onClick={() => setMsgs([fieldCleanOn() ? FIELD_ASK_GREET_CLEAN : FIELD_ASK_GREET])} title="New conversation" aria-label="New conversation" style={{ width: 34, height: 34, borderRadius: 10, border: 'none', flex: 'none', cursor: 'pointer', background: 'var(--bq-ai-soft)', color: 'var(--bq-ai-strong)', boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d="M12 5 V19 M5 12 H19" size={16} sw={2}></BqIcon></button>
      </div>

      {/* conversation */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '0 16px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <BqAskThread msgs={msgs} thinking={thinking} runAction={runAction} onDraftSend={sendDraft} onAsk={ask} scrollRef={scrollRef}></BqAskThread>

        {onlyGreeting ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 2 }}>
            {suggest.map((s) => (
              <button key={s} onClick={() => ask(s)} className="bq-chip" style={{ border: 'none', cursor: 'pointer', font: 'inherit', padding: '8px 13px', background: '#fff', color: 'var(--bq-ink)', boxShadow: 'inset 0 0 0 1px var(--bq-border-strong)' }}>{s}</button>
            ))}
          </div>
        ) : null}
      </div>

      {/* suggestion rail (once chatting) */}
      {!onlyGreeting ? (
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', padding: '8px 16px 4px' }}>
          {suggest.map((s) => (
            <button key={s} onClick={() => ask(s)} className="bq-chip ai" style={{ border: 'none', cursor: 'pointer', font: 'inherit', flex: 'none', padding: '6px 12px' }}>{s}</button>
          ))}
        </div>
      ) : null}

      {/* input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px 4px', borderTop: '1px solid var(--bq-border)', background: 'var(--bq-card)' }}>
        <button onClick={voice.start} aria-label="Hold to ask" style={{ width: 42, height: 42, borderRadius: '50%', border: 'none', flex: 'none', cursor: 'pointer', background: voice.listening ? 'var(--bq-ai)' : 'var(--bq-ai-soft)', color: voice.listening ? '#fff' : 'var(--bq-ai-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: voice.listening ? '0 0 0 4px var(--bq-ai-soft)' : 'none' }}>
          {voice.listening ? <BqWaveBars color="#fff"></BqWaveBars> : <BqIcon d={BQ_MIC_D} size={20}></BqIcon>}
        </button>
        <input value={voice.listening ? voice.transcript : text} readOnly={voice.listening} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') ask(text); }} placeholder={voice.listening ? 'Listening…' : 'Ask about the job…'} style={{ flex: 1, minWidth: 0, border: '1px solid ' + (voice.listening ? 'var(--bq-ai-border)' : 'var(--bq-border)'), borderRadius: 999, padding: '10px 15px', font: 'inherit', fontSize: 14, background: voice.listening ? 'var(--bq-ai-soft)' : 'var(--bq-raise)', color: 'var(--bq-ink)', outline: 'none' }}></input>
        <button onClick={() => ask(text)} aria-label="Send" disabled={!text.trim()} style={{ width: 42, height: 42, borderRadius: '50%', border: 'none', flex: 'none', cursor: text.trim() ? 'pointer' : 'default', background: text.trim() ? 'var(--bq-ai)' : 'var(--bq-border-strong)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH.send} size={18}></BqIcon></button>
      </div>
    </div>
  );
}
window.FieldAsk = FieldAsk;
