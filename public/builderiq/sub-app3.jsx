// BuilderIQ Sub app - part 3. "Ask BuilderIQ" assistant for the subcontractor portal.
// A floating launcher + docked chat panel, grounded in the sub's OWN scope only:
// bids/quotes, schedule, payments, compliance, plans. Client budgets & margins stay private.

const SUB_ASK_KB = [
  // scope guard FIRST - never reveal client budgets / margins / other subs' pricing
  { k: ['margin', 'budget', 'profit', 'markup', 'client pric', 'other sub', 'other client', 'total job', 'contract value'], a: 'Your portal only shows your own scope and pricing - client budgets and Hartwell\'s margins stay private. I can help with your bids, schedule, payments, or compliance, though.', act: null },
  { k: ['quote', 'bid', 'rfq', 'request'], a: 'You have one open bid request - cloth-wiring remediation at Henderson, due Jun 14. Your primary-suite framing quote ($14,200) is under review, and the beam install ($3,800) was awarded as WO-118.', act: [['Open quotes', 'Quotes']], src: 'Quotes & bids · your scope', card: { type: 'spec', title: 'Your bids', rows: [['Cloth-wiring remediation', 'Quote due Jun 14'], ['Primary-suite framing', '$14,200 · under review'], ['Beam install', '$3,800 · awarded · WO-118']] } },
  { k: ['cloth', 'wiring', 'remediation', 'knob'], a: 'Hartwell needs the cloth-wiring remediation scoped and priced by Jun 14 so they can write the client change order. Photograph each run, get the electrician walkthrough, then submit your line-item quote.', act: [['Submit the quote', 'Quotes']] },
  { k: ['schedule', 'when', 'next', 'on site', 'upcoming', 'date'], a: 'Here\'s what\'s coming up on your Hartwell jobs.', act: [['Open schedule', 'Schedule']], src: 'Shared schedule · Hartwell Builders', card: { type: 'schedule', items: [['Thu 12', 'Shoring removal · Henderson', 'brand'], ['Wed 18', 'Framing re-inspection · Osorio'], ['Mon 23', 'Primary-suite framing starts']] } },
  { k: ['shoring', 'beam', 'temporary'], a: 'Pull the temporary shoring at the kitchen/dining opening Thu Jun 12 - but only after the LVL beam is fully fastened and the inspector signs the structural. Confirm with Maria before removal.', act: [['See the task', 'Tasks']] },
  { k: ['pay', 'paid', 'owed', 'money', 'draw', 'ach'], a: 'Here\'s where your money stands - the Osorio draw is approved and lands by ACH on Jun 20.', act: [['Open payments', 'Payments']], src: 'Payments · Hartwell Builders', card: { type: 'spec', title: 'Your payments', rows: [['Paid to date', '$6,000'], ['Osorio framing · draw 1', '$7,500 · scheduled Jun 20'], ['Shoring invoice', '$1,450 · pending review']] } },
  { k: ['invoice', 'bill', 'submit invoice'], a: 'Want to bill for completed work? Start a new invoice and Hartwell will review it and schedule payment - you\'ll see the status update in Payments.', act: [['New invoice', 'Payments']] },
  { k: ['coi', 'insurance', 'compliance', 'expir', 'workers', 'comp', 'liability'], a: 'Heads up - your Workers\' Comp COI expires Jul 2 (16 days). Upload the renewal to stay eligible for work. Everything else is current.', act: [['Open compliance', 'Docs']], src: 'Compliance · COI on file' },
  { k: ['waiver', 'lien waiver'], a: 'There\'s a conditional lien waiver for the Henderson draw-2 payment waiting on your e-signature.', act: [['Sign it', 'Docs']] },
  { k: ['plan', 'spec', 'drawing', 'file', 'elevation', 'sheet'], a: 'Your shared files include the LVL beam spec, the Henderson framing plan, and the Osorio elevations. If something on a sheet isn\'t clear, I can send an RFI to the team.', act: [['Open files', 'Files'], ['Ask the team', 'rfi']] },
  { k: ['task', 'what do i', 'to do', 'assign'], a: 'Open tasks: quote the cloth-wiring remediation (due Jun 14) and remove shoring (Jun 12). Frame the primary suite at Osorio is due Jun 20.', act: [['Open tasks', 'Tasks']] },
  { k: ['who', 'contact', 'maria', 'call', 'gc', 'coordinator'], a: 'Maria coordinates your work at Hartwell - you can call or message her any time through the portal.', src: 'Hartwell team directory', card: { type: 'contact', name: 'Maria Herrera', role: 'Project coordinator · Hartwell Builders', phone: '(512) 555-0107', msgTarget: 'Messages' } },
  { k: ['question', 'ask', 'rfi', 'clarif'], a: 'I can raise an RFI to the Hartwell team for you - about a plan, a task, the schedule, or site conditions. It lands in Messages with their reply.', act: [['Ask the team', 'rfi']] },
];
const SUB_ASK_SUGGEST = [
  'What needs a quote?',
  'When am I on site next?',
  'What am I owed?',
  'Any compliance to update?',
  'Ask the team a question',
];
const SUB_ASK_VOICE = [
  'When do I get paid for the shoring invoice?',
  'When am I on site next?',
  'Anything due for compliance?',
];
const SUB_ASK_GREET = { role: 'ai', text: 'Hi Luis - I\'ve got your Vargas Framing work with Hartwell loaded. Ask me about your bids, schedule, payments, or compliance. I only see your scope, never client budgets.' };
const SUB_ASK_ACTIONS = [
  ['Open quotes & bids', 'Quotes'], ['Open the schedule', 'Schedule'], ['Open tasks', 'Tasks'], ['Open payments', 'Payments'],
  ['Open compliance docs', 'Docs'], ['Open shared files', 'Files'], ['Message the Hartwell team', 'Messages'], ['Raise an RFI to the team', 'rfi'],
];
const SUB_ASK_SYS = [
  'You are "Ask BuilderIQ" inside a subcontractor portal. You are talking to Luis Vargas of Vargas Framing, a framing sub working for Hartwell Builders (general contractor; coordinator: Maria H.).',
  'HARD SCOPE RULES (these override everything): you only see Vargas Framing\'s own scope - their bids, work orders, tasks, schedule, payments, compliance docs, and shared plan files. You never know or reveal client budgets, contract totals, Hartwell\'s margins or markup, other subs\' pricing, or anything about other clients. If asked, politely say that stays private and steer back to their own work.',
  'Voice: direct, friendly trade plain-talk. 1-3 short sentences. No markdown.',
  'FACTS - Luis\'s current work with Hartwell:',
  ...SUB_ASK_KB.map((e) => '- ' + e.a + bqCardFacts(e.card)),
].join('\n');
const SUB_EXPAND_D = 'M8 3 H5 a2 2 0 0 0 -2 2 V8 M16 3 H19 a2 2 0 0 1 2 2 V8 M8 21 H5 a2 2 0 0 1 -2 -2 V16 M16 21 H19 a2 2 0 0 0 2 -2 V16';
const SUB_SHRINK_D = 'M3 8 H6 a2 2 0 0 0 2 -2 V3 M21 8 H18 a2 2 0 0 1 -2 -2 V3 M3 16 H6 a2 2 0 0 1 2 2 V21 M21 16 H18 a2 2 0 0 0 -2 2 V21';
// contextual follow-ups keyed by each KB entry's first keyword (scope guard stays quiet)
const SUB_FU = {
  quote: ['What needs a quote?', 'When is it due?'],
  cloth: ['Submit the quote'],
  schedule: ['When am I on site next?'],
  shoring: ['When can I pull it?'],
  pay: ['When do I get paid?', 'Submit an invoice'],
  invoice: ['Start a new invoice'],
  coi: ['Upload the renewal', "What else expires?"],
  waiver: ['Sign it now'],
  plan: ['Ask the team a question'],
  task: ["What's due first?"],
  who: ['Message Maria'],
  question: ['Raise an RFI'],
};
const SUB_ASK_SUGGEST_CLEAN = ['What needs a quote?', 'When am I on site next?', 'What am I owed?', 'Ask the team a question'];
const SUB_ASK_VOICE_CLEAN = ['What needs a quote?', 'When am I on site next?', 'What am I owed?'];
const SUB_ASK_GREET_CLEAN = { role: 'ai', text: "Hi - your subcontractor portal is loaded. Ask me about your bids, schedule, payments, or compliance. I only see your own scope, never client budgets." };
function subCleanOn() { return !!(window.bqClean && window.bqClean()); }
function subSys() {
  if (!subCleanOn()) return SUB_ASK_SYS + (window.bqSubStoreFacts ? window.bqSubStoreFacts() : '');
  const ts = window.bqProj ? window.bqProj.subTasks() : [];
  const head = [
    'You are "Ask BuilderIQ" inside a subcontractor portal. You are talking to a subcontractor working for a general contractor.',
    'HARD SCOPE RULES (these override everything): you only see this sub\'s own scope - their bids, work orders, tasks, schedule, payments, compliance docs, and shared files. Never reveal client budgets, contract totals, the GC\'s margins or markup, other subs\' pricing, or other clients. If asked, say that stays private and steer back to their own work.',
    'Voice: direct, friendly trade plain-talk. 1-3 short sentences. No markdown.',
    'CRITICAL: only use the facts listed below, from the live workspace. Do NOT invent bids, work orders, payments, schedules, names, or any example/demo data. If you do not have it, say so.',
  ];
  head.push(ts.length ? 'FACTS - your assigned work: ' + ts.map(function (t) { return t.t + ' (' + t.proj + (t.done ? ', done' : ', open') + ')'; }).join('; ') + '.' : 'FACTS - no work has been assigned in the workspace yet. Tell the sub nothing is assigned and offer to help once the GC shares work. Invent nothing.');
  return head.join('\n');
}
function subAnswerClean(q) {
  const ts = window.bqProj ? window.bqProj.subTasks() : [];
  if (!ts.length) return { text: 'Nothing has been assigned to you yet. Once the general contractor shares work, I can help with your bids, schedule, payments, and compliance.', act: null, followups: null };
  return { text: 'I can help with your bids, schedule, payments, and compliance for your assigned work. What do you need?', act: [['Open tasks', 'Tasks']], followups: ['When am I on site next?'] };
}
function subAnswer(q) {
  if (subCleanOn()) return subAnswerClean(q);
  const ql = q.toLowerCase();
  const hit = SUB_ASK_KB.find((e) => e.k.some((kw) => ql.includes(kw)));
  if (hit) return { text: hit.a, act: hit.act, card: hit.card || null, src: hit.src || null, followups: SUB_FU[hit.k[0]] || null };
  return { text: 'I can help with your bids, schedule, payments, compliance docs, or the plans for your Hartwell jobs. What do you need?', act: [['View quotes', 'Quotes'], ['See schedule', 'Schedule']], followups: ['What needs a quote?', 'When am I on site next?', 'What am I owed?'] };
}

function SubAssistant({ go, onRFI }) {
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [msgs, setMsgs] = window.bqPersistState('ask-sub', [subCleanOn() ? SUB_ASK_GREET_CLEAN : SUB_ASK_GREET]);
  const [text, setText] = React.useState('');
  const [thinking, setThinking] = React.useState(false);
  const scrollRef = React.useRef(null);
  const subName = () => (subCleanOn() ? 'your company' : 'Vargas Framing');
  const SUB_FLOWS = {
    bid: {
      intro: "Let's put together a bid to send the GC.",
      steps: [
        { key: 'project', q: 'Which job is this bid for?', ph: 'e.g. Henderson kitchen', chips: () => { const t = window.bqProj ? window.bqProj.subTasks() : []; const projs = Array.from(new Set(t.map((x) => x.proj))); return projs.length ? projs : null; } },
        { key: 'scope', q: 'What\'s the scope you\'re quoting?', ph: 'e.g. Frame primary suite + closet' },
        { key: 'price', q: 'Your bid amount?', ph: '$14,200' },
        { key: 'start', q: 'When could you start?', chips: ['This week', 'Next week', '2-3 weeks out', 'Flexible'] },
      ],
      commit: (a) => {
        const price = Number(String(a.price).replace(/[^0-9.]/g, '')) || 0;
        if (window.bqBids) window.bqBids.add({ sub: subName(), project: a.project || 'Project', scope: a.scope || 'Scope', amount: price, start: a.start || '', status: 'submitted' });
        return { price: price, project: a.project };
      },
      done: (a, res) => ({ text: res ? ('Bid submitted to the GC - ' + (res.project || 'the job') + ' at $' + Number(res.price).toLocaleString('en-US') + ". You'll see the status change here once they review it.") : "I'll open Quotes.", act: [['Open my quotes', 'Quotes']], followups: ['Submit another bid', 'When am I on site next?'] }),
    },
    task: {
      precheck: () => { const t = window.bqProj ? window.bqProj.subTasks().filter((x) => !x.done) : []; return t.length ? null : { text: "You don't have any open tasks right now. Want to see your schedule?", act: [['Open schedule', 'Schedule']] }; },
      intro: "Let's mark a task done.",
      steps: [
        { key: 'task', q: 'Which task did you finish?', chips: () => (window.bqProj ? window.bqProj.subTasks().filter((x) => !x.done) : []).map((x) => x.t).slice(0, 6) },
        { key: 'note', q: 'Any note for the GC?', optional: true, ph: 'e.g. Passed inspection, ready for next trade' },
      ],
      commit: (a) => { if (window.bqProj && window.bqProj.completeSubTask) window.bqProj.completeSubTask(a.task, a.note); return { task: a.task }; },
      done: (a, res) => ({ text: res && res.task ? ('Marked “' + res.task + '” complete and let the GC know. Nice.') : "Done.", act: [['Open tasks', 'Tasks']], followups: ['Submit a bid', 'What am I owed?'] }),
    },
  };
  const flows = window.useBqFlows(setMsgs, SUB_FLOWS);
  const subIntent = (low) => {
    if (!/\b(submit|send|start|create|new|add|make|mark|complete|finish|done)\b/.test(low) && low.indexOf("let's") !== 0) return null;
    if (/\b(bid|quote|rfq)\b/.test(low)) return 'bid';
    if (/\b(task|done|complete|finish)\b/.test(low)) return 'task';
    return null;
  };
  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [msgs, thinking, open, expanded]);
  React.useEffect(() => { setMsgs((m) => { const n = m.slice(); while (n.length > 1 && n[n.length - 1].role === 'me') n.pop(); return n.length === m.length ? m : n; }); }, []);

  const ask = (q) => {
    if (!q.trim() || thinking) return;
    setMsgs((m) => [...m, { role: 'me', text: q.trim(), ts: Date.now() }]);
    setText('');
    if (flows.flowActive()) { flows.advanceFlow(q.trim()); return; }
    const intent = subIntent(q.trim().toLowerCase());
    if (intent) { flows.startFlow(intent); return; }
    setThinking(true);
    const rich = subAnswer(q); // keyword-grounded card/citation, kept even when the live model writes the prose
    window.bqLiveAsk({ system: subSys(), actions: SUB_ASK_ACTIONS, history: msgs, q: q.trim(), fallback: subAnswer }).then((ans) => {
      setThinking(false);
      setMsgs((m) => [...m, { role: 'ai', text: ans.text, act: ans.act, card: ans.card || rich.card || null, src: ans.src || rich.src || null, followups: ans.followups || rich.followups || null, ts: Date.now() }]);
    });
  };
  const runAction = (target) => {
    if (target === 'rfi') { setOpen(false); onRFI && onRFI(); return; }
    setOpen(false); go && go(target);
  };
  const voice = useBqVoice(ask, subCleanOn() ? SUB_ASK_VOICE_CLEAN : SUB_ASK_VOICE);
  const onlyGreeting = msgs.length === 1;
  const suggest = (subCleanOn() ? SUB_ASK_SUGGEST_CLEAN : SUB_ASK_SUGGEST).concat(['Submit a bid']);
  const size = expanded ? { width: 'min(680px, calc(100vw - 32px))', height: 'calc(100vh - 120px)' } : { width: 'min(384px, calc(100vw - 32px))', height: 'min(620px, calc(100vh - 140px))' };

  return (
    <React.Fragment>
      {/* launcher */}
      <button onClick={() => setOpen((o) => !o)} aria-label="Ask BuilderIQ" title="Ask BuilderIQ" className={open ? '' : 'bq-ask-fab'} style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 150, height: 52, minWidth: 52, padding: 0, borderRadius: 999, border: 'none', cursor: 'pointer', background: 'var(--bq-ai)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 28px rgba(124,58,237,0.42)', fontFamily: 'inherit', fontWeight: 700, fontSize: 14 }}>
        <BqIcon d={open ? 'M6 6 L18 18 M18 6 L6 18' : BQ_GLYPH.spark} size={open ? 20 : 22} sw={open ? 2 : 1.5}></BqIcon>
        {!open ? <span className="bq-ask-fab-lbl">Ask BuilderIQ</span> : null}
      </button>

      {/* panel */}
      {open ? (
        <div style={{ position: 'fixed', bottom: 88, right: 24, zIndex: 149, ...size, display: 'flex', flexDirection: 'column', background: 'var(--bq-card)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 24px 64px rgba(38,35,30,0.3), 0 0 0 1px var(--bq-border)', transition: 'width 0.2s ease, height 0.2s ease' }}>
          {/* header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '14px 16px', background: 'var(--bq-ai)', color: '#fff' }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, flex: 'none', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH.spark} size={19} sw={1.5}></BqIcon></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 7 }}>Ask BuilderIQ{window.bqAiLive && window.bqAiLive() ? <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 0.6, padding: '2px 7px', borderRadius: 999, background: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' }}>Live</span> : null}</div>
              <div style={{ fontSize: 11.5, opacity: 0.85, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{subCleanOn() ? 'Your work · Solid Remodel' : 'Vargas Framing · Hartwell Builders'}</div>
            </div>
            <button onClick={() => setExpanded((v) => !v)} title={expanded ? 'Shrink' : 'Expand'} aria-label={expanded ? 'Shrink' : 'Expand'} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.18)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={expanded ? SUB_SHRINK_D : SUB_EXPAND_D} size={15} sw={1.9}></BqIcon></button>
            <button onClick={() => setMsgs([subCleanOn() ? SUB_ASK_GREET_CLEAN : SUB_ASK_GREET])} title="New conversation" aria-label="New conversation" style={{ width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.18)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d="M12 5 V19 M5 12 H19" size={15} sw={2}></BqIcon></button>
            <button onClick={() => setOpen(false)} aria-label="Close" style={{ width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.18)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={15} sw={2}></BqIcon></button>
          </div>

          {/* scope note */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', fontSize: 11, color: 'var(--bq-faint)', background: 'var(--bq-subtle)', borderBottom: '1px solid var(--bq-border)' }}>
            <BqIcon d="M7 11 V8 a5 5 0 0 1 10 0 V11 M5 11 H19 a1 1 0 0 1 1 1 V20 a1 1 0 0 1-1 1 H5 a1 1 0 0 1-1-1 V12 a1 1 0 0 1 1-1 Z" size={13} style={{ flex: 'none' }}></BqIcon>
            Scoped to your work - budgets &amp; margins stay private.
          </div>

          {/* conversation */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 6px', display: 'flex', flexDirection: 'column', gap: 11 }}>
            <BqAskThread msgs={msgs} thinking={thinking} runAction={runAction} onAsk={ask} scrollRef={scrollRef}></BqAskThread>
            {onlyGreeting ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 2 }}>
                {suggest.map((s) => (
                  <button key={s} onClick={() => s === 'Ask the team a question' ? runAction('rfi') : ask(s)} className="bq-chip" style={{ border: 'none', cursor: 'pointer', font: 'inherit', padding: '8px 13px', background: '#fff', color: 'var(--bq-ink)', boxShadow: 'inset 0 0 0 1px var(--bq-border-strong)' }}>{s}</button>
                ))}
              </div>
            ) : null}
          </div>

          {/* suggestion rail */}
          {!onlyGreeting ? (
            <div style={{ display: 'flex', gap: 7, overflowX: 'auto', padding: '8px 14px 2px' }}>
              {suggest.map((s) => (
                <button key={s} onClick={() => s === 'Ask the team a question' ? runAction('rfi') : ask(s)} className="bq-chip ai" style={{ border: 'none', cursor: 'pointer', font: 'inherit', flex: 'none', padding: '6px 12px' }}>{s}</button>
              ))}
            </div>
          ) : null}

          {/* input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px 12px', borderTop: '1px solid var(--bq-border)' }}>
            <button onClick={voice.start} aria-label="Hold to ask" style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', flex: 'none', cursor: 'pointer', background: voice.listening ? 'var(--bq-ai)' : 'var(--bq-ai-soft)', color: voice.listening ? '#fff' : 'var(--bq-ai-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: voice.listening ? '0 0 0 4px var(--bq-ai-soft)' : 'none' }}>
              {voice.listening ? <BqWaveBars color="#fff"></BqWaveBars> : <BqIcon d={BQ_MIC_D} size={19}></BqIcon>}
            </button>
            <input value={voice.listening ? voice.transcript : text} readOnly={voice.listening} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') ask(text); }} placeholder={voice.listening ? 'Listening…' : 'Ask about your work…'} style={{ flex: 1, minWidth: 0, border: '1px solid ' + (voice.listening ? 'var(--bq-ai-border)' : 'var(--bq-border)'), borderRadius: 999, padding: '10px 15px', font: 'inherit', fontSize: 14, background: voice.listening ? 'var(--bq-ai-soft)' : 'var(--bq-raise)', color: 'var(--bq-ink)', outline: 'none' }}></input>
            <button onClick={() => ask(text)} aria-label="Send" disabled={!text.trim()} style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', flex: 'none', cursor: text.trim() ? 'pointer' : 'default', background: text.trim() ? 'var(--bq-ai)' : 'var(--bq-border-strong)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH.send} size={18}></BqIcon></button>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
}
window.SubAssistant = SubAssistant;
