// Hi-fi AI Inbox - paste message → classify → suggested structured actions
const INBOX_THREADS = [
  { id: 'm1', from: 'Priya Henderson', via: 'Email', proj: 'Henderson', time: '9:15 AM', unread: true, preview: 'Faucet switch + countertop timing + old fridge…', cls: 'Multiple', clsTone: 'ai' },
  { id: 'm2', from: 'Bright Electric', via: 'SMS', proj: 'Henderson', time: '8:40 AM', unread: true, preview: 'Found more cloth wiring than expected, want to walk it…', cls: 'Change order', clsTone: 'brand' },
  { id: 'm3', from: 'Grace Tanaka', via: 'Email', proj: 'Tanaka', time: 'Yesterday', unread: false, preview: 'Reviewed the proposal - a couple questions on the…', cls: 'Client question', clsTone: 'ai' },
  { id: 'm4', from: 'StoneWorks', via: 'Email', proj: 'Henderson', time: 'Yesterday', unread: false, preview: 'Template confirmed for Tue AM, crew of 2…', cls: 'Schedule', clsTone: 'good' },
];
const INBOX_SAMPLE = `Hi Maria - finally ready to pull the trigger on the kitchen! Couple things: Priya saw a matte black faucet she loves, is it too late to switch from the brushed nickel we picked? Also - are we still on track for the countertop template next week? And will the old fridge be hauled away or do we need to deal with that?`;

function HifiInbox() {
  const [sel, setSel] = React.useState('m1');
  const [pasteMode, setPasteMode] = React.useState(false);
  const [text, setText] = React.useState(INBOX_SAMPLE);
  const [classified, setClassified] = React.useState(false);

  const ACTIONS = [
    { label: 'Selection change - matte black faucet', g: 'select', type: 'Change order candidate', go: 'Selections' },
    { label: 'Confirm countertop template date', g: 'cal', type: 'Schedule', go: 'Schedule' },
    { label: 'Reply: fridge will be hauled away', g: 'clients', type: 'Client response', go: 'Clients' },
  ];
  const CLASSES = ['Task', 'Change order', 'Selection decision', 'Schedule issue', 'Client question', 'Invoice/payment', 'Project note', 'Warranty', 'General'];

  return (
    <div className="bq-screen">
      <BqTop crumb="AI Inbox"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="AI Inbox" alerts={{ 'AI Inbox': 2 }}></BqSide>

        {/* thread list */}
        <div style={{ width: 300, flex: 'none', borderRight: '1px solid var(--bq-border)', background: 'var(--bq-card)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: 'calc(14px * var(--bq-sp)) 16px 10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="bq-display" style={{ fontSize: 19 }}>Inbox</span>
              <span className="bq-chip ai">2 new</span>
              <button className="bq-btn soft-ai sm" style={{ marginLeft: 'auto' }} onClick={() => { setPasteMode(true); setClassified(false); }}>Paste</button>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>Gmail · Outlook · SMS · WhatsApp - connect soon</div>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '2px 8px 10px' }}>
            {INBOX_THREADS.map((t) => (
              <button key={t.id} onClick={() => { setSel(t.id); setPasteMode(false); }} style={{ width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 3, padding: '11px 12px', border: 'none', borderRadius: 12, background: t.id === sel && !pasteMode ? 'var(--bq-brand-soft)' : 'transparent', cursor: 'pointer', font: 'inherit' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {t.unread ? <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--bq-ai)', flex: 'none' }}></span> : null}
                  <span style={{ fontWeight: 600, fontSize: 13, flex: 1 }}>{t.from}</span>
                  <span style={{ fontSize: 11, color: 'var(--bq-faint)' }}>{t.time}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--bq-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.preview}</div>
                <div style={{ display: 'flex', gap: 5 }}><span className="bq-chip" style={{ padding: '0 7px' }}>{t.via}</span><span className={'bq-chip ' + t.clsTone} style={{ padding: '0 7px' }}>{t.cls}</span></div>
              </button>
            ))}
          </div>
        </div>

        {/* detail / paste */}
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px' }}>
          {pasteMode && !classified ? (
            <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="bq-display" style={{ fontSize: 20 }}>Paste a message</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Drop in an email, SMS, voice transcript, or sub message. BuilderIQ classifies it and suggests actions.</div>
              <div className="bq-card-s" style={{ padding: 4 }}>
                <textarea value={text} onChange={(e) => setText(e.target.value)} style={{ width: '100%', boxSizing: 'border-box', minHeight: 180, resize: 'vertical', border: 'none', outline: 'none', background: 'transparent', font: 'inherit', fontSize: 13.5, lineHeight: 1.6, color: 'var(--bq-ink)', padding: '12px 14px' }}></textarea>
              </div>
              <button className="bq-btn ai" style={{ alignSelf: 'flex-start' }} onClick={() => setClassified(true)}><BqSpark size={15}></BqSpark>Classify &amp; suggest actions</button>
            </div>
          ) : (
            <div style={{ maxWidth: 680, display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flex: 'none' }}>PH</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Priya Henderson</div>
                  <div style={{ fontSize: 12.5, color: 'var(--bq-faint)' }}>Email · Henderson - Kitchen + Hall Bath · 9:15 AM</div>
                </div>
                <span className="bq-chip">Attached to project</span>
              </div>

              <div className="bq-card-s" style={{ padding: '15px 17px', fontSize: 13.5, color: 'var(--bq-ink)', lineHeight: 1.6 }}>{INBOX_SAMPLE}</div>

              <div className="bq-ai-card" style={{ padding: 'calc(16px * var(--bq-sp)) 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <BqSpark size={14}></BqSpark><span style={{ fontWeight: 700, fontSize: 14, color: 'var(--bq-ai-strong)' }}>Classified as 3 items</span>
                  <span className="bq-chip ai" style={{ marginLeft: 'auto' }}>Multiple intents</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {ACTIONS.map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, background: 'var(--bq-raise)', borderRadius: 12, boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)', padding: '11px 13px' }}>
                      <span style={{ width: 30, height: 30, borderRadius: 8, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-ai-soft)', color: 'var(--bq-ai-strong)' }}><BqIcon d={BQ_GLYPH[a.g]} size={15}></BqIcon></span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--bq-ink)' }}>{a.label}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>{a.type}</div>
                      </div>
                      <button className="bq-btn soft-ai sm" onClick={() => window.__bqNav && window.__bqNav(a.go)}>Create</button>
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', marginTop: 10 }}>Original message + classification saved to the project. Drafts only - you approve before anything sends.</div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 7 }}>Reclassify</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {CLASSES.map((c) => <span key={c} className={'bq-chip' + (c === 'Change order' || c === 'Schedule issue' || c === 'Client question' ? ' ai' : '')} style={{ cursor: 'pointer' }}>{c}</span>)}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
window.HifiInbox = HifiInbox;
