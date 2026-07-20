// BuilderIQ Client app - "Ask BuilderIQ" homeowner assistant.
// Floating launcher + docked chat panel, grounded in THIS homeowner's project, warm plain-language
// tone. Never exposes internal costs/margins - only the client's own numbers, schedule & decisions.

const CL_ASK_KB = [
  // scope guard FIRST - the homeowner only sees their own project, never how Hartwell prices or runs the business
  { k: ['margin', 'profit', 'markup', 'overhead', 'your cost', 'your costs', 'what it costs you', 'what do you pay', 'do you make', 'you make on', 'pay the sub', 'paying the sub', 'sub cost', 'subcontractor pricing', 'labor cost', 'wholesale', 'other client', 'other project', 'other homeowner', 'another client', 'another job'], a: 'I can only help with your remodel - your schedule, decisions, payments, photos, and documents. Anything about how Hartwell prices its work or runs the business is best answered by Mike directly.', act: [['Message Mike', 'Messages']] },
  { k: ['visit', 'when', 'next week', 'home', 'come', 'on site', 'schedule', 'upcoming'], a: 'Here\'s your coming week - the countertop template on Wednesday is the one you\'ll want to be home for.', act: [['See your week', 'Home']], src: 'your project schedule', card: { type: 'schedule', items: [['Mon–Tue', 'Cabinet install'], ['Wed', 'Countertop template - be home', 'brand'], ['Fri', 'Electrical trim inspection']] } },
  { k: ['faucet', 'decision', 'decide', 'choose', 'choice', 'select', 'pick'], a: 'One decision is open - your hall-bath faucet, due Tuesday. Three options, all within your allowance. Choosing by Tuesday keeps the cabinets on schedule.', act: [['Choose now', 'Decisions']] },
  { k: ['change order', 'lighting', 'hallway', 'co4', 'co #4', '#4', 'approve'], a: 'Change Order #4 adds six recessed lights down the hallway - about one extra day of work. You can approve it, ask Mike about it, or decline.', src: 'Change Order #4 · awaiting your decision', card: { type: 'draft', kind: 'Change Order #4', title: 'Hallway recessed lighting', amount: '+$1,840', rows: [['Adds', 'Six recessed lights · ~1 extra day'], ['New contract total', '$195,650']], cta: 'Review & decide', nav: 'Decisions' } },
  { k: ['pay', 'owe', 'owed', 'total', 'cost', 'price', 'draw', 'balance', 'left to pay', 'how much'], a: 'Here\'s where your money stands - nothing is due today, and draw 3 isn\'t due until Jun 22.', act: [['Open Money', 'Money']], src: 'Money · live', card: { type: 'spec', title: 'Where your money stands', rows: [['Contract total', '$195,650'], ['Paid so far', '$93,200'], ['Draw 3 · due Jun 22', '$27,960'], ['Remaining after draw 3', '$74,490']] } },
  { k: ['allowance', 'budget', 'over budget', 'on budget', 'tracking'], a: 'Good news - your selections are running about $320 under allowance overall. Countertops and plumbing are a touch over, but tile and flooring came in under, so it balances out.', act: [['See allowances', 'Money']] },
  { k: ['photo', 'picture', 'pic', 'progress', 'see'], a: 'There are 12 progress photos - the newest from this week show the kitchen tile up and grouted and the hall bath waterproofed.', act: [['View photos', 'Photos']] },
  { k: ['done', 'finish', 'long', 'timeline', 'far along', 'week', 'percent'], a: 'You\'re in week 6 of 14 - about 43% done - and on track to finish around Nov 18. Everything\'s moving on schedule.', act: [['See progress', 'Home']] },
  { k: ['team', 'who', 'mike', 'contractor', 'lead', 'crew', 'carpenter'], a: 'Mike Hartwell is your project lead, and Marco Diaz is the lead carpenter on site. Mike usually replies within an hour.', src: 'your project team', card: { type: 'contact', name: 'Mike Hartwell', role: 'Your project lead · Hartwell Builders', phone: '(512) 555-0134', msgTarget: 'Messages' } },
  { k: ['document', 'sign', 'contract', 'warranty', 'paperwork', 'permit'], a: 'Change Order #4 is waiting for your signature in Documents. Your contract, proposal, permit, and warranty are all stored there too.', act: [['Open documents', 'Documents']] },
  { k: ['message', 'ask mike', 'talk', 'question', 'contact', 'call'], a: 'Happy to take you to your message thread with Mike - he usually replies within an hour.', act: [['Message Mike', 'Messages']] },
  { k: ['cabinet', 'countertop', 'tile', 'kitchen', 'bath'], a: 'Cabinets arrive Tuesday and get staged in the garage, then install begins. The countertop template visit is Wednesday, and the kitchen wall tile is already up and grouted.', act: [['See your week', 'Home']] },
];
const CL_ASK_SUGGEST = [
  'When is my next visit?',
  "What's left to pay?",
  "What's Change Order #4?",
  'Any decisions for me?',
  'Message Mike',
];
const CL_ASK_VOICE = [
  'When is the countertop visit?',
  'How much is left to pay?',
  'What is Change Order 4?',
];
const CL_ASK_GREET = { role: 'ai', text: 'Hi Dan - I\'m here to help with your kitchen + hall-bath remodel. Ask me anything: what\'s next, what needs a decision, what you owe, or how things are looking.' };
const CL_ASK_ACTIONS = [
  ['See this week & progress', 'Home'], ['Open decisions', 'Decisions'], ['Open Money', 'Money'],
  ['View photos', 'Photos'], ['Open documents', 'Documents'], ['Message Mike', 'Messages'],
];
const CL_ASK_SYS = [
  'You are "Ask BuilderIQ" inside a homeowner portal. You are talking to Dan Henderson, whose kitchen + hall-bath remodel is being built by Hartwell Builders (project lead: Mike Hartwell; lead carpenter on site: Marco Diaz).',
  'HARD SCOPE RULES (these override everything): you only discuss THIS homeowner\'s own project - their schedule, decisions, change orders, payments (their client-facing numbers only), photos, and documents. You never know or reveal Hartwell\'s internal costs, margins, markup, what subs are paid, how Hartwell prices work, or anything about other clients or projects. If asked, warmly say Mike is the right person for that and offer to take them to Messages.',
  'Voice: warm, reassuring, plain language - no construction jargon, no markdown. 1-3 short sentences. Money answers use only the client-facing numbers in FACTS.',
  'FACTS - Dan\'s project:',
  ...CL_ASK_KB.map((e) => '- ' + e.a + bqCardFacts(e.card)),
].join('\n');
const CL_EXPAND_D = 'M8 3 H5 a2 2 0 0 0 -2 2 V8 M16 3 H19 a2 2 0 0 1 2 2 V8 M8 21 H5 a2 2 0 0 1 -2 -2 V16 M16 21 H19 a2 2 0 0 0 2 -2 V16';
const CL_SHRINK_D = 'M3 8 H6 a2 2 0 0 0 2 -2 V3 M21 8 H18 a2 2 0 0 1 -2 -2 V3 M3 16 H6 a2 2 0 0 1 2 2 V21 M21 16 H18 a2 2 0 0 0 -2 2 V21';
// warm, plain-language follow-ups keyed by each KB entry's first keyword (scope guard stays quiet)
const CL_FU = {
  visit: ['What should I be home for?'],
  faucet: ['See my options', 'When is it due?'],
  'change order': ['Approve it', 'Ask Mike about it'],
  pay: ['When is the next draw?', "What's my balance?"],
  allowance: ["What's over allowance?"],
  photo: ['View the newest photos'],
  done: ['When will it finish?'],
  team: ['Message Mike'],
  document: ['Sign Change Order #4'],
  message: ['Message Mike'],
  cabinet: ['When is the countertop visit?'],
};
function clientAnswer(q) {
  const ql = q.toLowerCase();
  const hit = CL_ASK_KB.find((e) => e.k.some((kw) => ql.includes(kw)));
  if (hit) return { text: hit.a, act: hit.act, card: hit.card || null, src: hit.src || null, followups: CL_FU[hit.k[0]] || null };
  return { text: 'I can help with your schedule, decisions, payments, photos, or documents - or get you to Mike. What would you like to know?', act: [['What needs me?', 'Decisions'], ['Message Mike', 'Messages']], followups: ['When is my next visit?', "What's left to pay?", 'Any decisions for me?'] };
}

function ClientAssistant({ go }) {
  const vc = window.__bqClViewing;
  const GREET = vc ? { role: 'ai', text: 'Hi ' + vc.name.split(' ')[0] + ' - I\'m here to help with your ' + String(vc.project || 'project').toLowerCase() + '. Ask me what\'s next, what needs a decision, or what you owe.' } : CL_ASK_GREET;
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [msgs, setMsgs] = window.bqPersistState(vc ? 'ask-client-' + vc.id : 'ask-client', [GREET]);
  const [text, setText] = React.useState('');
  const [thinking, setThinking] = React.useState(false);
  const scrollRef = React.useRef(null);
  const CL_FLOWS = {
    message: {
      intro: 'Happy to pass a message to your builder.',
      steps: [
        { key: 'topic', q: 'What\'s it about?', chips: ['Schedule', 'A decision', 'Something on site', 'Billing', 'Something else'] },
        { key: 'body', q: 'What would you like to tell them?', ph: 'Type your message' },
      ],
      commit: (a) => {
        const line = (a.topic && a.topic !== 'Something else' ? '[' + a.topic + '] ' : '') + (a.body || '');
        try { window.bqLogEvent && window.bqLogEvent('client', { g: 'inbox', tone: 'ai', body: (vc ? vc.name : 'Client') + ': “' + (a.body || '') + '”', change: 'New message from ' + (vc ? vc.name : 'client') }); } catch (e) {}
        try { if (vc) { const K = 'bqp:' + (window.__bqNS || '') + 'cl-msgs-' + vc.id; const cur = JSON.parse(localStorage.getItem(K) || '[]'); cur.push({ from: 'me', t: 'Now', body: line }); localStorage.setItem(K, JSON.stringify(cur)); } } catch (e) {}
        return { sent: true };
      },
      done: (a, res) => ({ text: 'Sent to your builder - they usually reply within an hour. You can see the thread in Messages.', act: [['Open Messages', 'Messages']], followups: ['When is my next visit?', 'Any decisions for me?'] }),
    },
    decision: {
      precheck: () => { const p = vc && vc.proj; const openCos = p ? (p.cos || []).filter((x) => x.status === 'sent').length : 0; const openSel = p ? (p.selections || []).filter((x) => x.status === 'sent').length : 0; return (openCos + openSel) ? null : { text: "You're all caught up - nothing needs a decision right now.", act: [['See progress', 'Home']] }; },
      intro: "Let's take care of what needs you.",
      steps: [{ key: 'go', q: 'You have items waiting for your OK. Want to review them now?', chips: ['Review decisions', 'Not now'] }],
      commit: () => null,
      done: (a) => ({ text: /review/i.test(a.go || '') ? 'Opening your decisions.' : 'No problem - they\'ll be there when you\'re ready.', act: /review/i.test(a.go || '') ? [['Open Decisions', 'Decisions']] : null }),
    },
  };
  const flows = window.useBqFlows(setMsgs, CL_FLOWS);
  const clIntent = (low) => {
    if (/\b(message|tell|send|ask mike|ask my builder|contact|reach)\b/.test(low)) return 'message';
    if (/\b(decision|decide|approve|sign|what needs me)\b/.test(low) && /\b(make|help|start|review|need|handle)\b/.test(low)) return 'decision';
    return null;
  };
  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [msgs, thinking, open, expanded]);
  React.useEffect(() => { setMsgs((m) => { const n = m.slice(); while (n.length > 1 && n[n.length - 1].role === 'me') n.pop(); return n.length === m.length ? m : n; }); }, []);

  const ask = (q) => {
    if (!q.trim() || thinking) return;
    setMsgs((m) => [...m, { role: 'me', text: q.trim(), ts: Date.now() }]);
    setText('');
    if (flows.flowActive()) { flows.advanceFlow(q.trim()); return; }
    const intent = clIntent(q.trim().toLowerCase());
    if (intent) { flows.startFlow(intent); return; }
    setThinking(true);
    const sys = vc && window.bqClientPortalFacts ? window.bqClientPortalFacts(vc.client || vc, vc.proj) : CL_ASK_SYS;
    const fb = vc ? (() => ({ text: 'I can help with your schedule, payments, decisions, or updates - or take you straight to Mike.', act: [['Open Money', 'Money'], ['Message Mike', 'Messages']] })) : clientAnswer;
    const rich = fb(q); // keyword-grounded card/citation, kept even when the live model writes the prose
    window.bqLiveAsk({ system: sys, actions: CL_ASK_ACTIONS, history: msgs, q: q.trim(), fallback: fb }).then((ans) => {
      setThinking(false);
      setMsgs((m) => [...m, { role: 'ai', text: ans.text, act: ans.act, card: ans.card || rich.card || null, src: ans.src || rich.src || null, followups: ans.followups || rich.followups || null, ts: Date.now() }]);
    });
  };
  const runAction = (target) => { setOpen(false); go && go(target); };
  const voice = useBqVoice(ask, CL_ASK_VOICE);
  const onlyGreeting = msgs.length === 1;
  const CL_SUGGEST = CL_ASK_SUGGEST;
  const size = expanded ? { width: 'min(680px, calc(100vw - 32px))', height: 'calc(100vh - 120px)' } : { width: 'min(392px, calc(100vw - 32px))', height: 'min(640px, calc(100vh - 140px))' };

  return (
    <React.Fragment>
      {/* launcher */}
      <button onClick={() => setOpen((o) => !o)} aria-label="Ask BuilderIQ" title="Ask BuilderIQ" className={open ? '' : 'bq-ask-fab'} style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 150, height: 54, minWidth: 54, padding: 0, borderRadius: 999, border: 'none', cursor: 'pointer', background: 'var(--bq-ai)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 30px rgba(124,58,237,0.42)', fontFamily: 'inherit', fontWeight: 700, fontSize: 14.5 }}>
        <BqIcon d={open ? 'M6 6 L18 18 M18 6 L6 18' : BQ_GLYPH.spark} size={open ? 21 : 23} sw={open ? 2 : 1.5}></BqIcon>
        {!open ? <span className="bq-ask-fab-lbl">Ask BuilderIQ</span> : null}
      </button>

      {/* panel */}
      {open ? (
        <div style={{ position: 'fixed', bottom: 90, right: 24, zIndex: 149, ...size, display: 'flex', flexDirection: 'column', background: 'var(--bq-card)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 28px 70px rgba(38,35,30,0.32), 0 0 0 1px var(--bq-border)', transition: 'width 0.2s ease, height 0.2s ease' }}>
          {/* header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '15px 17px', background: 'var(--bq-ai)', color: '#fff' }}>
            <span style={{ width: 36, height: 36, borderRadius: 11, flex: 'none', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH.spark} size={20} sw={1.5}></BqIcon></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15.5, display: 'flex', alignItems: 'center', gap: 7 }}>Ask BuilderIQ{window.bqAiLive && window.bqAiLive() ? <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 0.6, padding: '2px 7px', borderRadius: 999, background: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' }}>Live</span> : null}</div>
              <div style={{ fontSize: 11.5, opacity: 0.88, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Your remodel · Hartwell Builders</div>
            </div>
            <button onClick={() => setExpanded((v) => !v)} title={expanded ? 'Shrink' : 'Expand'} aria-label={expanded ? 'Shrink' : 'Expand'} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.18)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={expanded ? CL_SHRINK_D : CL_EXPAND_D} size={15} sw={1.9}></BqIcon></button>
            <button onClick={() => setMsgs([GREET])} title="New conversation" aria-label="New conversation" style={{ width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.18)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d="M12 5 V19 M5 12 H19" size={15} sw={2}></BqIcon></button>
            <button onClick={() => setOpen(false)} aria-label="Close" style={{ width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.18)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={15} sw={2}></BqIcon></button>
          </div>

          {/* conversation */}
          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '15px 15px 6px', display: 'flex', flexDirection: 'column', gap: 11, background: '#F4F1EB' }}>
            <BqAskThread msgs={msgs} thinking={thinking} runAction={runAction} onAsk={ask} scrollRef={scrollRef} variant="client"></BqAskThread>
            {onlyGreeting ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 2 }}>
                {CL_SUGGEST.map((s) => (
                  <button key={s} onClick={() => ask(s)} style={{ border: 'none', cursor: 'pointer', font: 'inherit', padding: '9px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, background: 'var(--bq-card)', color: 'var(--bq-ink)', boxShadow: 'inset 0 0 0 1px var(--bq-border-strong)' }}>{s}</button>
                ))}
              </div>
            ) : null}
          </div>

          {/* suggestion rail */}
          {!onlyGreeting ? (
            <div style={{ display: 'flex', gap: 7, overflowX: 'auto', padding: '8px 15px 2px', background: '#F4F1EB' }}>
              {CL_SUGGEST.map((s) => (
                <button key={s} onClick={() => ask(s)} className="bq-chip ai" style={{ border: 'none', cursor: 'pointer', font: 'inherit', flex: 'none', padding: '6px 12px' }}>{s}</button>
              ))}
            </div>
          ) : null}

          {/* input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 15px 13px', borderTop: '1px solid var(--bq-border)' }}>
            <button onClick={voice.start} aria-label="Hold to ask" style={{ width: 42, height: 42, borderRadius: '50%', border: 'none', flex: 'none', cursor: 'pointer', background: voice.listening ? 'var(--bq-ai)' : 'var(--bq-ai-soft)', color: voice.listening ? '#fff' : 'var(--bq-ai-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: voice.listening ? '0 0 0 4px var(--bq-ai-soft)' : 'none' }}>
              {voice.listening ? <BqWaveBars color="#fff"></BqWaveBars> : <BqIcon d={BQ_MIC_D} size={20}></BqIcon>}
            </button>
            <input value={voice.listening ? voice.transcript : text} readOnly={voice.listening} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') ask(text); }} placeholder={voice.listening ? 'Listening…' : 'Ask about your remodel…'} style={{ flex: 1, minWidth: 0, border: '1px solid ' + (voice.listening ? 'var(--bq-ai-border)' : 'var(--bq-border)'), borderRadius: 999, padding: '11px 16px', font: 'inherit', fontSize: 14, background: voice.listening ? 'var(--bq-ai-soft)' : 'var(--bq-subtle)', color: 'var(--bq-ink)', outline: 'none' }}></input>
            <button onClick={() => ask(text)} aria-label="Send" disabled={!text.trim()} style={{ width: 42, height: 42, borderRadius: '50%', border: 'none', flex: 'none', cursor: text.trim() ? 'pointer' : 'default', background: text.trim() ? 'var(--bq-ai)' : 'var(--bq-border-strong)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH.send} size={18}></BqIcon></button>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
}
window.ClientAssistant = ClientAssistant;
