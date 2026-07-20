// BuilderIQ - shared "Ask BuilderIQ" chat layer used by all four assistants
// (Builder copilot, Field app, Sub portal, Client portal).
//   BqAskThread  - renders the conversation: me/ai bubbles, typewriter reveal on fresh
//                  answers, rich answer cards (contact / schedule / spec / draft),
//                  source citations, action chips, thinking dots.
//   useBqVoice   - simulated voice input: listening → live transcript → auto-send.
//   BqMicGlyph   - mic icon path + animated wave bars for listening states.
// Message shape: { role:'me'|'ai', text, act:[[label,target]]|null, card:{...}|null, src:string|null, ts:number }

const BQ_MIC_D = 'M12 14 a3 3 0 0 0 3-3 V6 a3 3 0 0 0-6 0 V11 a3 3 0 0 0 3 3 Z M6 11 a6 6 0 0 0 12 0 M12 17 V21';

function BqWaveBars({ color }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 2.5, height: 18 }}>
      {[0.5, 0.9, 0.65, 1, 0.45].map((h, i) => (
        <span key={i} style={{ width: 3, borderRadius: 2, background: color || 'currentColor', height: Math.round(18 * h), animation: 'bqwave 0.9s ease-in-out infinite', animationDelay: (i * 0.12) + 's', transformOrigin: 'center' }}></span>
      ))}
    </span>
  );
}

// ── serialize a card's facts for the live-AI system prompts (so the model knows what the card shows) ──
function bqCardFacts(card) {
  if (!card) return '';
  let bits = [];
  if (card.type === 'contact') bits = [card.name + ' - ' + card.role + ' - ' + card.phone];
  else if (card.type === 'schedule') bits = (card.items || []).map((it) => it[0] + ': ' + it[1]);
  else if (card.type === 'spec' || card.type === 'draft') {
    if (card.title) bits.push(card.title + (card.amount ? ' (' + card.amount + ')' : ''));
    bits = bits.concat((card.rows || []).map((r) => r[0] + ': ' + r[1]));
    if (card.foot) bits.push(card.foot);
  }
  return bits.length ? ' [' + bits.join('; ') + ']' : '';
}

// ── simulated voice: tap mic → listening + word-by-word transcript → auto-ask ──
function useBqVoice(onFinal, phrases) {
  const [listening, setListening] = React.useState(false);
  const [transcript, setTranscript] = React.useState('');
  const idx = React.useRef(0);
  const timers = React.useRef([]);
  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const start = () => {
    if (listening) return;
    const phrase = phrases[idx.current++ % phrases.length];
    setListening(true); setTranscript('');
    const words = phrase.split(' ');
    let t = 500; // brief "listening" pause before words land
    words.forEach((w, i) => {
      t += 95 + Math.random() * 130;
      timers.current.push(setTimeout(() => setTranscript(words.slice(0, i + 1).join(' ')), t));
    });
    timers.current.push(setTimeout(() => { setListening(false); setTranscript(''); onFinal(phrase); }, t + 550));
  };
  return { listening, transcript, start };
}

// ── rich answer cards ──
function BqAskContactCard({ card, runAction }) {
  const [calling, setCalling] = React.useState(false);
  const initials = card.name.trim().split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  const call = () => { if (calling) return; setCalling(true); setTimeout(() => setCalling(false), 1800); };
  return (
    <div style={{ marginTop: 8, borderRadius: 14, background: 'var(--bq-card)', boxShadow: 'inset 0 0 0 1px var(--bq-border), var(--bq-shadow)', padding: '12px 13px', minWidth: 230 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
        <span className="bq-avatar" style={{ width: 40, height: 40, fontSize: 14, flex: 'none', background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)' }}>{initials}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--bq-ink)' }}>{card.name}</div>
          <div style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>{card.role}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 600, color: 'var(--bq-muted)', padding: '9px 2px 10px' }}>
        <BqIcon d="M5 4 h4 l1.5 4 -2 1.5 a11 11 0 0 0 6 6 l1.5 -2 4 1.5 v4 a1 1 0 0 1 -1 1 A16 16 0 0 1 4 5 a1 1 0 0 1 1 -1 Z" size={14} style={{ flex: 'none', color: 'var(--bq-faint)' }}></BqIcon>
        {card.phone}
      </div>
      <div style={{ display: 'flex', gap: 7 }}>
        <button className="bq-btn primary sm" style={{ flex: 1, justifyContent: 'center' }} onClick={call}>
          {calling ? 'Calling…' : 'Call'}
        </button>
        {card.msgTarget ? <button className="bq-btn sm" style={{ flex: 1, justifyContent: 'center', boxShadow: '0 0 0 1px var(--bq-border-strong)' }} onClick={() => runAction && runAction(card.msgTarget)}>Message</button> : null}
      </div>
    </div>
  );
}

function BqAskScheduleCard({ card }) {
  return (
    <div style={{ marginTop: 8, borderRadius: 14, background: 'var(--bq-card)', boxShadow: 'inset 0 0 0 1px var(--bq-border), var(--bq-shadow)', padding: '4px 0', minWidth: 240 }}>
      {card.title ? <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)', padding: '9px 13px 3px' }}>{card.title}</div> : null}
      {card.items.map((it, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 13px', borderTop: i || card.title ? '1px solid var(--bq-border)' : 'none' }}>
          <span style={{ flex: 'none', minWidth: 58, textAlign: 'center', fontSize: 11, fontWeight: 800, padding: '4px 7px', borderRadius: 8, background: it[2] === 'brand' ? 'var(--bq-brand-soft)' : 'var(--bq-subtle)', color: it[2] === 'brand' ? 'var(--bq-brand-strong)' : 'var(--bq-muted)' }}>{it[0]}</span>
          <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--bq-ink)', lineHeight: 1.3 }}>{it[1]}</span>
        </div>
      ))}
    </div>
  );
}

function BqAskSpecCard({ card }) {
  return (
    <div style={{ marginTop: 8, borderRadius: 14, background: 'var(--bq-card)', boxShadow: 'inset 0 0 0 1px var(--bq-border), var(--bq-shadow)', padding: '10px 13px 11px', minWidth: 240 }}>
      {card.title ? <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 4 }}>{card.title}</div> : null}
      {card.rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'baseline', justifyContent: 'space-between', padding: '6px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-muted)', flex: 'none', maxWidth: '46%' }}>{r[0]}</span>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--bq-ink)', textAlign: 'right', lineHeight: 1.35 }}>{r[1]}</span>
        </div>
      ))}
      {card.foot ? <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--bq-brand-strong)', paddingTop: 7, borderTop: '1px solid var(--bq-border)' }}>{card.foot}</div> : null}
    </div>
  );
}

function BqAskDraftCard({ card, runAction, onDraftSend }) {
  const [sent, setSent] = React.useState(false);
  const go = () => {
    if (card.nav) { runAction && runAction(card.nav); return; }
    if (sent) return;
    onDraftSend && onDraftSend(card);
    setSent(true);
  };
  return (
    <div style={{ marginTop: 8, borderRadius: 14, background: 'var(--bq-card)', boxShadow: 'inset 0 0 0 1.5px var(--bq-ai-border), var(--bq-shadow)', overflow: 'hidden', minWidth: 244 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 13px', background: 'var(--bq-ai-soft)' }}>
        <BqIcon d={BQ_GLYPH.spark} size={13} sw={1.6} style={{ color: 'var(--bq-ai-strong)', flex: 'none' }}></BqIcon>
        <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-ai-strong)' }}>{card.kind} · AI draft</span>
      </div>
      <div style={{ padding: '10px 13px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--bq-ink)', lineHeight: 1.3 }}>{card.title}</div>
          {card.amount ? <div className="bq-num" style={{ fontSize: 16, color: 'var(--bq-brand-strong)', flex: 'none' }}>{card.amount}</div> : null}
        </div>
        {(card.rows || []).map((r, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, justifyContent: 'space-between', padding: '6px 0', borderBottom: i < card.rows.length - 1 ? '1px solid var(--bq-border)' : 'none', marginTop: i ? 0 : 6 }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--bq-faint)', flex: 'none' }}>{r[0]}</span>
            <span style={{ fontSize: 12.5, color: 'var(--bq-ink)', textAlign: 'right', lineHeight: 1.35 }}>{r[1]}</span>
          </div>
        ))}
        <button className={'bq-btn sm ' + (sent ? '' : 'primary')} disabled={sent} onClick={go} style={{ width: '100%', justifyContent: 'center', marginTop: 10, padding: '9px 12px', ...(sent ? { background: 'var(--bq-good-soft)', color: 'var(--bq-good)', boxShadow: 'none', cursor: 'default' } : {}) }}>
          {sent ? <React.Fragment><BqIcon d={BQ_GLYPH.check} size={14} sw={2.4}></BqIcon>{card.sentLabel || 'Sent to the office'}</React.Fragment> : card.cta}
        </button>
      </div>
    </div>
  );
}

function BqAskCard({ card, runAction, onDraftSend }) {
  if (!card) return null;
  if (card.type === 'contact') return <BqAskContactCard card={card} runAction={runAction}></BqAskContactCard>;
  if (card.type === 'schedule') return <BqAskScheduleCard card={card}></BqAskScheduleCard>;
  if (card.type === 'spec') return <BqAskSpecCard card={card}></BqAskSpecCard>;
  if (card.type === 'draft') return <BqAskDraftCard card={card} runAction={runAction} onDraftSend={onDraftSend}></BqAskDraftCard>;
  return null;
}

// ── one AI message: typewriter reveal, then card + citation + action chips ──
function BqAiMsg({ m, fresh, variant, runAction, onDraftSend, onGrow, onAsk, last }) {
  const words = React.useMemo(() => String(m.text || '').split(' '), [m.text]);
  const [n, setN] = React.useState(fresh ? 1 : words.length);
  const done = n >= words.length;
  React.useEffect(() => {
    if (n >= words.length) return; // reschedule on every tick so a re-render can never strand the reveal
    const id = setTimeout(() => setN((x) => Math.min(words.length, x + 1 + Math.round(Math.random()))), 34);
    return () => clearTimeout(id);
  }, [n, words.length]);
  React.useEffect(() => { onGrow && onGrow(); }, [n]);
  const client = variant === 'client';
  const bubbleStyle = {
    padding: client ? '11px 14px' : '10px 13px',
    borderRadius: '4px 16px 16px 16px',
    background: client ? 'var(--bq-card)' : 'var(--bq-ai-soft)',
    boxShadow: client ? 'inset 0 0 0 1px var(--bq-border)' : 'inset 0 0 0 1px var(--bq-ai-border)',
    fontSize: client ? 14 : 13.5, lineHeight: 1.5, color: 'var(--bq-ink)',
  };
  return (
    <div style={{ alignSelf: 'flex-start', maxWidth: '90%', display: 'flex', gap: 8 }}>
      <span style={{ width: 26, height: 26, borderRadius: 8, flex: 'none', background: 'var(--bq-ai-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)', marginTop: 2 }}><BqIcon d={BQ_GLYPH.spark} size={14} sw={1.4} style={{ color: 'var(--bq-ai-strong)' }}></BqIcon></span>
      <div style={{ minWidth: 0 }}>
        <div style={bubbleStyle}>
          {words.slice(0, n).join(' ')}
          {!done ? <span style={{ display: 'inline-block', width: 7, height: 13, marginLeft: 3, borderRadius: 2, background: 'var(--bq-ai-strong)', verticalAlign: 'middle', animation: 'bqpulse 0.8s infinite' }}></span> : null}
        </div>
        {done && m.card ? <BqAskCard card={m.card} runAction={runAction} onDraftSend={onDraftSend}></BqAskCard> : null}
        {done && m.src ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6, fontSize: 10.5, fontWeight: 600, color: 'var(--bq-faint)' }}>
            <BqIcon d="M7 3 H14 L19 8 V21 H7 Z M14 3 V8 H19" size={11} style={{ flex: 'none' }}></BqIcon>
            From {m.src}
          </div>
        ) : null}
        {done && m.act ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 8 }}>
            {m.act.map((a, j) => (
              <button key={j} onClick={() => runAction && runAction(a[1])} className="bq-btn soft-ai sm" style={{ padding: '6px 12px' }}><BqIcon d="M9 5 L16 12 L9 19" size={12} sw={2.2}></BqIcon>{a[0]}</button>
            ))}
          </div>
        ) : null}
        {done && last && Array.isArray(m.chips) && m.chips.length ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 9 }}>
            {m.chips.map((c, k) => (
              <button key={k} onClick={() => onAsk && onAsk(c)} style={{ border: 'none', cursor: 'pointer', font: 'inherit', padding: '8px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, background: 'var(--bq-ai-soft)', color: 'var(--bq-ai-strong)', boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)' }}>{c}</button>
            ))}
          </div>
        ) : null}
        {done && last && Array.isArray(m.followups) && m.followups.length ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: (m.act || m.card || m.src) ? 9 : 8 }}>
            {m.followups.map((f, k) => (
              <button key={k} onClick={() => onAsk && onAsk(f)} title={f} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: 'none', cursor: 'pointer', font: 'inherit', padding: '6px 12px 6px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: 'var(--bq-card)', color: 'var(--bq-ai-strong)', boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)', lineHeight: 1.2 }}><BqIcon d="M10 8 L6 12 L10 16 M6 12 H15 a3 3 0 0 0 3 -3 V6" size={13} sw={1.7} style={{ flex: 'none', opacity: 0.75 }}></BqIcon>{f}</button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ── the whole conversation ──
function BqAskThread({ msgs, thinking, runAction, onDraftSend, scrollRef, variant, onAsk }) {
  const mountTs = React.useRef(Date.now()).current;
  const grow = () => { if (scrollRef && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; };
  const client = variant === 'client';
  return (
    <React.Fragment>
      {msgs.map((m, i) => m.role === 'me' ? (
        <div key={i} style={{ alignSelf: 'flex-end', maxWidth: '84%', padding: client ? '10px 14px' : '9px 13px', borderRadius: '16px 16px 4px 16px', background: 'var(--bq-brand)', color: '#fff', fontSize: client ? 14 : 13.5, lineHeight: 1.45 }}>{m.text}</div>
      ) : (
        <BqAiMsg key={i} m={m} fresh={!!m.ts && m.ts >= mountTs && !m.instant} variant={variant} runAction={runAction} onDraftSend={onDraftSend} onGrow={grow} onAsk={onAsk} last={i === msgs.length - 1 && !thinking}></BqAiMsg>
      ))}
      {thinking ? (
        <div style={{ alignSelf: 'flex-start', display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ width: 26, height: 26, borderRadius: 8, flex: 'none', background: 'var(--bq-ai-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)' }}><BqIcon d={BQ_GLYPH.spark} size={14} sw={1.4} style={{ color: 'var(--bq-ai-strong)' }}></BqIcon></span>
          <div style={{ display: 'flex', gap: 4, padding: '12px 14px', borderRadius: '4px 16px 16px 16px', background: client ? 'var(--bq-card)' : 'var(--bq-ai-soft)', boxShadow: client ? 'inset 0 0 0 1px var(--bq-border)' : 'inset 0 0 0 1px var(--bq-ai-border)' }}>
            {[0, 1, 2].map((d) => <span key={d} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--bq-ai-strong)', animation: 'bqpulse 1s infinite', animationDelay: (d * 0.18) + 's' }}></span>)}
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
}

Object.assign(window, { BqAskThread, BqAskCard, useBqVoice, BqWaveBars, BQ_MIC_D, bqCardFacts });

// ── reusable guided walk-through runner (Field / Sub / Client copilots) ──
// Drives a step-at-a-time flow through the same message thread: each step emits an AI
// message whose `followups` are the quick replies, then commits a record and hands off.
// flowsDef: { <id>: { intro, precheck(), steps:[{key,q(str|fn),chips(arr|fn),optional,when(a)}], commit(a), done(a,res) } }
function useBqFlows(setMsgs, flowsDef) {
  const [flow, setFlow] = React.useState(null);
  const ref = React.useRef(null);
  React.useEffect(() => { ref.current = flow; }, [flow]);
  const pushAi = (msg) => setMsgs((m) => [...m, Object.assign({ role: 'ai', ts: Date.now(), instant: true }, msg)]);
  const chipsFor = (step, a) => {
    let c = (typeof step.chips === 'function' ? step.chips(a) : step.chips) || [];
    c = c.slice();
    if (step.optional && !c.some((x) => /^skip$/i.test(x))) c.push('Skip');
    c.push('Cancel');
    return c;
  };
  const nextIdx = (f, from, a) => { let i = from; while (i < f.steps.length && f.steps[i].when && !f.steps[i].when(a)) i++; return i; };
  const finish = (f, a) => { setFlow(null); const res = f.commit ? f.commit(a) : null; setTimeout(() => pushAi(f.done(a, res)), 300); };
  const startFlow = (id) => {
    const f = flowsDef[id]; if (!f) return;
    if (f.precheck) { const b = f.precheck(); if (b) { pushAi(b); return; } }
    const a = {}; const i0 = nextIdx(f, 0, a);
    if (i0 >= f.steps.length) { finish(f, a); return; }
    setFlow({ id: id, i: i0, answers: a });
    const s = f.steps[i0];
    pushAi({ text: (f.intro ? f.intro + '\n\n' : '') + (typeof s.q === 'function' ? s.q(a) : s.q), followups: chipsFor(s, a) });
  };
  const advanceFlow = (raw) => {
    const fl = ref.current; if (!fl) return false;
    const f = flowsDef[fl.id]; const step = f.steps[fl.i];
    if (/^(cancel|cancel setup|never ?mind|stop|quit|forget it)$/i.test(String(raw).trim())) { setFlow(null); setTimeout(() => pushAi({ text: "No problem, I've stopped there and saved nothing. What else can I help with?" }), 250); return true; }
    const skip = step.optional && /^skip$/i.test(String(raw).trim());
    const stored = skip ? '' : raw;
    const a = Object.assign({}, fl.answers, step.key ? { [step.key]: stored } : {});
    const ni = nextIdx(f, fl.i + 1, a);
    if (ni < f.steps.length) { setFlow({ id: fl.id, i: ni, answers: a }); const ns = f.steps[ni]; setTimeout(() => pushAi({ text: (typeof ns.q === 'function' ? ns.q(a) : ns.q), followups: chipsFor(ns, a) }), 280); }
    else finish(f, a);
    return true;
  };
  return { flow: flow, startFlow: startFlow, advanceFlow: advanceFlow, flowActive: () => !!ref.current };
}
window.useBqFlows = useBqFlows;
Object.assign(window, { useBqFlows });
