// Hi-fi Subcontractor view - scoped access: assigned tasks, relevant schedule, files; NO financials
function SubLimitedNote() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12, color: 'var(--bq-faint)', background: 'var(--bq-subtle)', borderRadius: 10, padding: '8px 12px' }}>
      <BqIcon d="M7 11 V8 a5 5 0 0 1 10 0 V11 M5 11 H19 a1 1 0 0 1 1 1 V20 a1 1 0 0 1-1 1 H5 a1 1 0 0 1-1-1 V12 a1 1 0 0 1 1-1 Z" size={14}></BqIcon>
      You see only what's assigned to you. Budgets, margins, and other clients stay private to Hartwell Builders.
    </div>
  );
}

function HifiSub() {
  const TASKS = [
    { t: 'Quote cloth-wiring remediation', proj: 'Henderson', due: 'Jun 14', pr: 'High', done: false, sub: '1/2' },
    { t: 'Beam install - kitchen opening', proj: 'Henderson', due: 'Jun 11', pr: 'High', done: true, sub: '3/3' },
    { t: 'Shoring removal', proj: 'Henderson', due: 'Jun 12', pr: 'Med', done: false, sub: '' },
  ];
  const SCHED = [
    { t: 'Shoring removal', date: 'Thu Jun 12', who: 'You' },
    { t: 'Framing re-inspection (Osorio)', date: 'Wed Jun 18', who: 'You + City' },
  ];

  return (
    <div className="bq-screen">
      {/* scoped top bar - no search over all jobs */}
      <div className="bq-top">
        <span className="bq-logomark"><BqIcon d={BQ_GLYPH.hammer} size={16} sw={1.8} style={{ color: '#fff' }}></BqIcon></span>
        <span className="bq-wordmark">Builder<span className="iq">IQ</span></span>
        <span className="bq-chip"><BqIcon d={BQ_GLYPH.hardhat} size={12}></BqIcon>Subcontractor</span>
        <span style={{ flex: 1 }}></span>
        <span style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Vargas Framing</span>
        <span className="bq-avatar" style={{ background: 'var(--bq-subtle)', color: 'var(--bq-muted)', boxShadow: 'inset 0 0 0 1px var(--bq-border)' }}>VF</span>
      </div>

      <main style={{ flex: 1, overflow: 'auto', padding: 'calc(20px * var(--bq-sp)) 24px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 'min(900px, 100%)', display: 'flex', flexDirection: 'column', gap: 'calc(16px * var(--bq-sp))' }}>
          <div>
            <div className="bq-display" style={{ fontSize: 24 }}>Welcome, Vargas Framing</div>
            <div style={{ fontSize: 13.5, color: 'var(--bq-muted)' }}>2 active assignments · 1 due this week</div>
          </div>
          <SubLimitedNote></SubLimitedNote>

          <div style={{ display: 'flex', gap: 'calc(16px * var(--bq-sp))', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* assigned tasks */}
            <div style={{ flex: '1 1 420px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="bq-sechead"><span className="t">My tasks</span></div>
              {TASKS.map((tk, i) => (
                <div key={i} className="bq-card-s" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 22, height: 22, borderRadius: 7, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: tk.done ? 'var(--bq-good)' : '#fff', boxShadow: tk.done ? 'none' : 'inset 0 0 0 1.5px var(--bq-border-strong)' }}>{tk.done ? <BqIcon d={BQ_GLYPH.check} size={12} sw={2.6} style={{ color: '#fff' }}></BqIcon> : null}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: tk.done ? 'var(--bq-faint)' : 'var(--bq-ink)', textDecoration: tk.done ? 'line-through' : 'none' }}>{tk.t}</div>
                    <div style={{ fontSize: 12, color: 'var(--bq-faint)', display: 'flex', gap: 8 }}>
                      <span>{tk.proj}</span>{tk.sub ? <span>· {tk.sub} subtasks</span> : null}
                    </div>
                  </div>
                  {tk.pr === 'High' && !tk.done ? <span className="bq-chip brand">High</span> : null}
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: !tk.done && (tk.due === 'Jun 12' || tk.due === 'Jun 11') ? 'var(--bq-brand-strong)' : 'var(--bq-faint)' }}>{tk.due}</span>
                </div>
              ))}

              <div className="bq-sechead" style={{ marginTop: 6 }}><span className="t">Files &amp; photos shared with you</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                <BqPh h={84} label="Beam spec"></BqPh>
                <BqPh h={84} label="Framing plan"></BqPh>
                <BqPh h={84} label=""></BqPh>
                <BqPh h={84} label=""></BqPh>
              </div>
            </div>

            {/* schedule + comments */}
            <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="bq-sechead"><span className="t">My schedule</span></div>
              <div className="bq-card-s" style={{ padding: '6px 4px' }}>
                {SCHED.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 13px', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
                    <span style={{ width: 38, height: 38, borderRadius: 11, background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={BQ_GLYPH.cal} size={17}></BqIcon></span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{s.t}</div>
                      <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{s.date} · {s.who}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bq-sechead" style={{ marginTop: 6 }}><span className="t">Recent comments</span></div>
              <div className="bq-card-s" style={{ padding: '13px 15px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--bq-ink)' }}>Maria H. <span style={{ color: 'var(--bq-faint)', fontWeight: 500 }}>· on Cloth-wiring task</span></div>
                  <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.45, marginTop: 2 }}>Can you get me a material list by Friday so we can write the change order?</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input placeholder="Reply…" style={{ flex: 1, font: 'inherit', fontSize: 13, padding: '8px 12px', borderRadius: 10, border: '1px solid var(--bq-border)', background: 'var(--bq-subtle)' }}></input>
                  <button className="bq-btn sm">Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
window.HifiSub = HifiSub;
