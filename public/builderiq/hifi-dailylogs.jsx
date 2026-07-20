// Hi-fi Daily Logs - list + AI log writer (rough notes → internal + client summaries)
const LOG_ROUGH = `weather hot ~95, humid. crew of 4 + vargas framing 2 guys.
got the beam set finally, took longer than thought, shoring out tomorrow.
inspector came framing passed. electrician started panel but found old cloth wiring in the wall by the hall - gonna need to flag that, possible extra.
cabinets supposed to deliver thurs. priya stopped by, loves the layout. asked about the faucet again.`;

const LOG_HISTORY = [
  { date: 'Wed, Jun 11', weather: '95° · Humid', crew: 6, status: 'Framing passed', shared: true, hi: 'Beam set, framing inspection passed' },
  { date: 'Tue, Jun 10', weather: '91° · Clear', crew: 4, status: 'Shoring in', shared: true, hi: 'Temporary shoring installed, beam staged' },
  { date: 'Mon, Jun 9', weather: '88° · Clear', crew: 5, status: 'Demo complete', shared: true, hi: 'Demo wrapped, dumpster hauled, site protected' },
  { date: 'Fri, Jun 6', weather: '84° · Cloudy', crew: 3, status: 'Prep', shared: false, hi: 'Site prep, material staging' },
];

function HifiDailyLogs() {
  const [phase, setPhase] = React.useState('list'); // list | compose | draft
  const [notes, setNotes] = React.useState(LOG_ROUGH);
  const [share, setShare] = React.useState(true);
  const [thinking, setThinking] = React.useState(false);

  const generate = () => { setThinking(true); setTimeout(() => { setThinking(false); setPhase('draft'); }, 1100); };

  const INTERNAL = [
    ['Work completed', 'Structural beam set across the kitchen/dining opening (took longer than planned). Framing inspection passed. Electrician began panel work.'],
    ['Crew onsite', '4 Hartwell crew + 2 Vargas Framing.'],
    ['Issue / flag', 'Old cloth wiring discovered in the hall wall during electrical rough - likely a change-order extra. Photo attached, get Bright Electric to quote.'],
    ['Inspections', 'Framing - PASSED (city).'],
    ['Look-ahead', 'Remove shoring tomorrow. Cabinets scheduled to deliver Thursday.'],
  ];
  const CLIENT = "Hi Dan & Priya - great progress today! The new structural beam is set and the city's framing inspection passed, which clears us to move into electrical and plumbing. The crew was 6 strong in the heat. Heads up: while opening the hall wall we found some old wiring we'll want to address - Maria will follow up with options shortly, no action needed from you yet. Cabinets are still on track to arrive Thursday. Thanks for stopping by - glad you love the layout!";

  return (
    <div className="bq-screen">
      <BqTop crumb="Projects / Henderson / Daily Logs"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Daily Logs"></BqSide>
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div className="bq-display" style={{ fontSize: 22 }}>Daily Logs</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Henderson - Kitchen + Hall Bath</div>
            </div>
            {phase === 'list'
              ? <button className="bq-btn ai sm" onClick={() => setPhase('compose')}><BqSpark size={13}></BqSpark>New log with AI</button>
              : <button className="bq-btn ghost sm" onClick={() => setPhase('list')}>← Back to logs</button>}
          </div>

          {phase === 'list' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(10px * var(--bq-sp))' }}>
              {LOG_HISTORY.map((l, i) => (
                <div key={i} className="bq-card-s" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--bq-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--bq-faint)', textTransform: 'uppercase' }}>{l.date.split(',')[0]}</span>
                    <span className="bq-num" style={{ fontSize: 16 }}>{l.date.split(' ')[2]}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{l.hi}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--bq-faint)' }}>{l.weather} · {l.crew} onsite · {l.status}</div>
                  </div>
                  {l.shared
                    ? <span className="bq-chip good"><BqIcon d={BQ_GLYPH.check} size={11} sw={2.2}></BqIcon>Shared with client</span>
                    : <span className="bq-chip">Internal only</span>}
                  <BqIcon d="M9 5 L16 12 L9 19" size={15} style={{ color: 'var(--bq-faint)' }}></BqIcon>
                </div>
              ))}
            </div>
          ) : phase === 'compose' ? (
            <div style={{ display: 'flex', gap: 'calc(16px * var(--bq-sp))', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              <div style={{ flex: '1 1 420px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="bq-card-s" style={{ padding: 4 }}>
                  <div style={{ display: 'flex', gap: 6, padding: '10px 12px 4px', alignItems: 'center' }}>
                    <span className="bq-chip">Wed, Jun 12</span>
                    <span className="bq-chip"><BqIcon d="M12 3 V5 M12 19 V21 M3 12 H5 M19 12 H21 M12 8 a4 4 0 1 0 0 8 a4 4 0 0 0 0-8 Z" size={11}></BqIcon>95° Humid</span>
                    <button className="bq-chip" style={{ marginLeft: 'auto', cursor: 'pointer', border: 'none', font: 'inherit' }}><BqIcon d="M12 14 a3 3 0 0 0 3-3 V6 a3 3 0 0 0-6 0 V11 a3 3 0 0 0 3 3 Z M6 11 a6 6 0 0 0 12 0 M12 17 V21" size={12}></BqIcon>Dictate</button>
                  </div>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                    style={{ width: '100%', boxSizing: 'border-box', minHeight: 220, resize: 'vertical', border: 'none', outline: 'none', background: 'transparent', font: 'inherit', fontSize: 13, lineHeight: 1.6, color: 'var(--bq-ink)', padding: '6px 14px 14px' }}></textarea>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button className="bq-btn ai" onClick={generate} disabled={thinking}>
                    {thinking ? <React.Fragment><span className="bq-spark" style={{ animation: 'bqpulse 1s ease-in-out infinite', display: 'inline-flex' }}><BqIcon d={BQ_GLYPH.spark} size={15}></BqIcon></span>Writing…</React.Fragment>
                      : <React.Fragment><BqSpark size={15}></BqSpark>Write the log</React.Fragment>}
                  </button>
                  <span style={{ fontSize: 12, color: 'var(--bq-faint)', lineHeight: 1.4 }}>Jot rough notes or dictate. AI writes a clean internal log and a client-safe summary.</span>
                </div>
              </div>
              <div style={{ flex: '1 1 200px', minWidth: 200 }}>
                <BqPh h={150} label="Add today's photos"></BqPh>
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <BqPh h={64} label="" style={{ flex: 1 }}></BqPh>
                  <BqPh h={64} label="" style={{ flex: 1 }}></BqPh>
                  <BqPh h={64} label="" style={{ flex: 1 }}></BqPh>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(12px * var(--bq-sp))' }}>
              <div className="bq-ai-card" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 16px' }}>
                <BqSpark size={14}></BqSpark>
                <span style={{ fontSize: 13, color: 'var(--bq-ink)' }}>Drafted two versions from your notes. <b>Review before sharing</b> - flagged a possible change order for you.</span>
              </div>
              <div style={{ display: 'flex', gap: 'calc(14px * var(--bq-sp))', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div className="bq-card-s" style={{ flex: '1 1 360px', padding: 'calc(14px * var(--bq-sp)) 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Internal log</span>
                    <span className="bq-chip">Team only</span>
                  </div>
                  {INTERNAL.map(([k, v]) => (
                    <div key={k} style={{ padding: '8px 0', borderTop: k === 'Work completed' ? 'none' : '1px solid var(--bq-border)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 3 }}>{k}</div>
                      <div style={{ fontSize: 13, color: 'var(--bq-ink)', lineHeight: 1.5 }}>{v}</div>
                      {k === 'Issue / flag' ? <button className="bq-btn soft-ai sm" style={{ marginTop: 7 }} onClick={() => window.__bqNav && window.__bqNav('Change Orders')}><BqSpark size={11}></BqSpark>Draft change order</button> : null}
                    </div>
                  ))}
                </div>
                <div className="bq-card-s" style={{ flex: '1 1 360px', padding: 'calc(14px * var(--bq-sp)) 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Client summary</span>
                    <span className="bq-chip ai">Homeowner-safe</span>
                  </div>
                  <div style={{ background: 'var(--bq-subtle)', borderRadius: 14, padding: '13px 15px', fontSize: 13.5, color: 'var(--bq-ink)', lineHeight: 1.55 }}>{CLIENT}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 2px' }}>
                    <button onClick={() => setShare(!share)} style={{ width: 40, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer', background: share ? 'var(--bq-ai)' : 'var(--bq-border-strong)', position: 'relative', transition: 'background .15s', flex: 'none' }}>
                      <span style={{ position: 'absolute', top: 3, left: share ? 19 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .15s' }}></span>
                    </button>
                    <span style={{ fontSize: 13, color: 'var(--bq-ink)' }}>{share ? 'Share with Dan & Priya' : 'Keep internal'}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="bq-btn primary" onClick={() => setPhase('list')}>Save log{share ? ' & share' : ''}</button>
                <button className="bq-btn ghost" onClick={() => setPhase('compose')}>Edit notes</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
window.HifiDailyLogs = HifiDailyLogs;
