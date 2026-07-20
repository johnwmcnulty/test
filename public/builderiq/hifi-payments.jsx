// Hi-fi Lead capture widget + Payments
// ════════ LEAD CAPTURE FRONT-END (embeddable request-an-estimate widget) ════════
function HifiLeadCapture() {
  const [step, setStep] = React.useState('form'); // form | submitting | done
  const [project, setProject] = React.useState('Kitchen remodel');
  const [budget, setBudget] = React.useState('');
  const [timeline, setTimeline] = React.useState('');
  const submit = () => { setStep('submitting'); setTimeout(() => setStep('done'), 900); };

  return (
    <div className="bq-screen">
      <BqTop crumb="Leads / Lead capture widget"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Leads"></BqSide>
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', gap: 'calc(20px * var(--bq-sp))', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* config side */}
          <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))', minWidth: 300 }}>
            <div>
              <div className="bq-display" style={{ fontSize: 21 }}>Lead capture widget</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5 }}>Embed a "Request an estimate" form on your website. Submissions create a Lead automatically - scored and routed, no manual entry.</div>
            </div>
            <div className="bq-card-s" style={{ padding: '14px 16px' }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Embed code</div>
              <pre style={{ margin: 0, background: '#26231E', color: '#E7E2D9', borderRadius: 12, padding: '13px 15px', fontSize: 12, lineHeight: 1.6, fontFamily: "'Roboto Mono', monospace", overflow: 'auto' }}>{`<script src="https://js.builderiq.com/embed.js"
  data-company="${window.bqClean() ? 'solid-remodel' : 'hartwell-builders'}"
  data-form="estimate-request">
</script>`}</pre>
              <button className="bq-btn sm" style={{ marginTop: 10 }}>Copy snippet</button>
            </div>
            <div className="bq-card-s" style={{ padding: '14px 16px' }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10 }}>Auto-routing</div>
              {[['New leads assigned to', window.bqClean() ? 'Owner' : 'Maria H.'], ['Auto-reply email', 'On'], ['AI fit score', 'On'], ['Notify on submit', 'Email + Slack']].map(([k, v], i) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', fontSize: 13, borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
                  <span style={{ color: 'var(--bq-faint)', flex: 1 }}>{k}</span><span style={{ fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* live preview side */}
          <div style={{ flex: '1 1 360px', minWidth: 320 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 8 }}>Live preview · embeds on your site</div>
            <div className="bq-card-s" style={{ overflow: 'hidden', boxShadow: '0 12px 32px rgba(38,35,30,0.12), inset 0 0 0 1px var(--bq-border)' }}>
              <div style={{ background: 'var(--bq-brand)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH.hammer} size={15} style={{ color: '#fff' }}></BqIcon></span>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{window.bqClean() ? 'Solid Remodel' : 'Hartwell Builders'}</span>
              </div>
              {step === 'done' ? (
                <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--bq-good-soft)', color: 'var(--bq-good)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}><BqIcon d={BQ_GLYPH.check} size={26} sw={2.4}></BqIcon></div>
                  <div style={{ fontWeight: 700, fontSize: 17 }}>Thanks - we'll be in touch!</div>
                  <div style={{ fontSize: 13, color: 'var(--bq-muted)', margin: '6px 0 16px', lineHeight: 1.5 }}>{window.bqClean() ? 'We typically reply' : 'Maria typically replies'} within one business day. A confirmation is on its way to your inbox.</div>
                  <div className="bq-ai-card" style={{ padding: '11px 14px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 9 }}>
                    <BqSpark size={14}></BqSpark>
                    <span style={{ fontSize: 12, color: 'var(--bq-ink)' }}>Created <b>Lead #L-0231</b> · AI fit score <b>High</b> · routed to {window.bqClean() ? 'you' : 'Maria H.'}</span>
                  </div>
                  <button className="bq-btn sm" style={{ marginTop: 14 }} onClick={() => setStep('form')}>Reset preview</button>
                </div>
              ) : (
                <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12, opacity: step === 'submitting' ? 0.5 : 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--bq-ink)' }}>Request a free estimate</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input placeholder="First name" style={iStyle}></input>
                    <input placeholder="Last name" style={iStyle}></input>
                  </div>
                  <input placeholder="Email" style={iStyle}></input>
                  <input placeholder="Phone" style={iStyle}></input>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-faint)', marginBottom: 6 }}>Project type</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {['Kitchen remodel', 'Bathroom remodel', 'Addition', 'Whole-home', 'Other'].map((t) => (
                        <button key={t} className={'bq-chip' + (project === t ? ' brand' : '')} onClick={() => setProject(t)} style={{ cursor: 'pointer', border: 'none', font: 'inherit', fontWeight: 600 }}>{t}</button>
                      ))}
                    </div>
                  </div>
                  <textarea placeholder="Tell us about your project…" style={{ ...iStyle, minHeight: 70, resize: 'none' }}></textarea>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}><BqSelect value={budget} ph="Budget range" options={['$50k–$100k', '$100k–$200k', '$200k+']} onChange={setBudget}></BqSelect></div>
                    <div style={{ flex: 1, minWidth: 0 }}><BqSelect value={timeline} ph="Timeline" options={['ASAP', '1–3 months', '3–6 months']} onChange={setTimeline}></BqSelect></div>
                  </div>
                  <button onClick={submit} style={{ width: '100%', padding: 13, borderRadius: 12, border: 'none', background: 'var(--bq-brand)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>{step === 'submitting' ? 'Submitting…' : 'Request my estimate'}</button>
                  <div style={{ fontSize: 11, color: 'var(--bq-faint)', textAlign: 'center' }}>Powered by BuilderIQ · your info is never shared</div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
const iStyle = { flex: 1, width: '100%', boxSizing: 'border-box', font: 'inherit', fontSize: 13.5, padding: '10px 13px', borderRadius: 10, border: '1px solid var(--bq-border)', background: 'var(--bq-subtle)', color: 'var(--bq-ink)' };
window.HifiLeadCapture = HifiLeadCapture;

// ════════ PAYMENTS (homeowner pays in portal - card/ACH + deposit at approval) ════════
function HifiPayments() {
  const fmt = (n) => '$' + n.toLocaleString('en-US');
  const [method, setMethod] = React.useState('ach');
  const [paid, setPaid] = React.useState(false);

  const SCHEDULE = [
    ['Deposit (at signing)', 18640, 'Paid', 'good'],
    ['Draw 1 - Demo complete', 37280, 'Paid', 'good'],
    ['Draw 2 - Rough-in', 37280, 'Paid', 'good'],
    ['Draw 3 - Cabinets set', 27960, paid ? 'Paid' : 'Due now', paid ? 'good' : 'warn'],
    ['Draw 4 - Final walkthrough', 65240, 'Upcoming', 'muted'],
  ];
  const collected = SCHEDULE.filter((s) => s[2] === 'Paid').reduce((a, s) => a + s[1], 0);

  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--bq-page)', overflow: 'auto', padding: '32px 0' }}>
      <div style={{ width: 'min(820px, 92%)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'calc(16px * var(--bq-sp))' }}>
        {/* portal header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--bq-brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={BQ_GLYPH.hammer} size={19} style={{ color: '#fff' }}></BqIcon></span>
          <div style={{ flex: 1 }}>
            <div className="bq-display" style={{ fontSize: 21 }}>Payments</div>
            <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Hartwell Builders · Kitchen + Hall Bath · client view</div>
          </div>
          <span className="bq-chip ai">Client portal</span>
        </div>

        {/* progress */}
        <div className="bq-card-s" style={{ padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>Payment progress</span>
            <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--bq-muted)' }}><b className="bq-num" style={{ color: 'var(--bq-good)' }}>{fmt(collected)}</b> of {fmt(186400)} paid</span>
          </div>
          <BqMeter pct={(collected / 186400) * 100} tone=""></BqMeter>
        </div>

        <div style={{ display: 'flex', gap: 'calc(16px * var(--bq-sp))', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* schedule */}
          <div className="bq-card-s" style={{ flex: '1 1 360px', overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px 4px', fontWeight: 700, fontSize: 14 }}>Payment schedule</div>
            {SCHEDULE.map(([label, amt, status, tone], i) => (
              <div key={i} className="bq-trow" style={{ gridTemplateColumns: '1fr auto auto', alignItems: 'center' }}>
                <span style={{ fontSize: 13 }}>{label}</span>
                <span className="cell-num" style={{ fontWeight: 600 }}>{fmt(amt)}</span>
                <span className={'bq-chip ' + tone}>{status}</span>
              </div>
            ))}
          </div>

          {/* pay now */}
          <div className="bq-card-s" style={{ flex: '1 1 300px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {paid ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--bq-good-soft)', color: 'var(--bq-good)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><BqIcon d={BQ_GLYPH.check} size={26} sw={2.4}></BqIcon></div>
                <div style={{ fontWeight: 700, fontSize: 17 }}>Payment received</div>
                <div style={{ fontSize: 13, color: 'var(--bq-muted)', margin: '4px 0 6px' }}>{fmt(27960)} · Draw 3 · receipt emailed</div>
                <div style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>Recorded to the project &amp; synced to QuickBooks</div>
              </div>
            ) : (
              <React.Fragment>
                <div>
                  <div style={{ fontSize: 12.5, color: 'var(--bq-faint)', fontWeight: 600 }}>Amount due now · Draw 3</div>
                  <div className="bq-num" style={{ fontSize: 32 }}>{fmt(27960)}</div>
                  <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>Due Jun 22, 2026</div>
                </div>
                <div className="seg-toggle" style={{ width: '100%' }}>
                  <button className={method === 'ach' ? 'on' : ''} onClick={() => setMethod('ach')} style={{ flex: 1 }}>Bank (ACH) · free</button>
                  <button className={method === 'card' ? 'on' : ''} onClick={() => setMethod('card')} style={{ flex: 1 }}>Card · +2.9%</button>
                </div>
                {method === 'ach' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input placeholder="Routing number" style={iStyle}></input>
                    <input placeholder="Account number" style={iStyle}></input>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input placeholder="Card number" style={iStyle}></input>
                    <div style={{ display: 'flex', gap: 8 }}><input placeholder="MM / YY" style={iStyle}></input><input placeholder="CVC" style={iStyle}></input></div>
                  </div>
                )}
                <button onClick={() => setPaid(true)} style={{ width: '100%', padding: 13, borderRadius: 12, border: 'none', background: 'var(--bq-brand)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                  Pay {fmt(method === 'card' ? Math.round(27960 * 1.029) : 27960)}
                </button>
                <div style={{ fontSize: 11, color: 'var(--bq-faint)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                  <BqIcon d="M7 11 V8 a5 5 0 0 1 10 0 V11 M5 11 H19 V20 H5 Z" size={12}></BqIcon>Secured by Stripe · feeds project financials
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
window.HifiPayments = HifiPayments;
