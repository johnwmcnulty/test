// Hi-fi Mobile field interface - part 2. Full screens consumed by FieldShell (hifi-field.jsx):
// daily-log composer + history, field change-order capture, receipt/expense capture,
// photo gallery, office messages, projects, schedule. All read state via useField().

function FieldHead({ title, sub, back, onBack, right }) {
  const { go } = useField();
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '4px 0 14px' }}>
      {back ? (
        <button onClick={onBack || (() => go('home'))} className="bq-btn ghost sm" style={{ padding: 7, flex: 'none' }}><BqIcon d="M15 5 L8 12 L15 19" size={18}></BqIcon></button>
      ) : null}
      <div style={{ flex: 1, minWidth: 0 }}>
        {sub ? <div style={{ fontSize: 12.5, color: 'var(--bq-faint)' }}>{sub}</div> : null}
        <div className="bq-display" style={{ fontSize: back ? 20 : 24 }}>{title}</div>
      </div>
      {right}
    </div>
  );
}

function FieldProjChip({ project }) {
  return <span className="bq-chip"><BqIcon d={BQ_GLYPH.hammer} size={11}></BqIcon>{project || ''}</span>;
}

function FieldProjPicker() {
  const { setProj, projKey, projOptions } = useField();
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {projOptions.map((o) => (
        <button key={o.key} onClick={() => setProj(o.key)} className={'bq-chip' + (o.key === projKey ? ' brand' : '')} style={{ border: 'none', cursor: 'pointer', font: 'inherit' }}>
          <BqIcon d={BQ_GLYPH.hammer} size={11}></BqIcon>{o.label}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────── Daily log composer ───────────────────────────────────────────
function FieldLog() {
  const { go, addLog, enqueue, showToast, proj, projRecord } = useField();
  const [stage, setStage] = React.useState('compose'); // compose | written
  const [share, setShare] = React.useState(true);
  const save = () => {
    const summary = projRecord
      ? 'Crew on site - progress logged from the field on the ' + String(projRecord.title || 'project').toLowerCase() + '.'
      : 'Beam set across the kitchen opening; framing inspection passed. Electrical rough started - flagged old cloth wiring in the hall wall as a possible change order.';
    addLog({ date: 'Wed · Jun 12', proj: proj, summary: summary, photos: 2, shared: share });
    if (projRecord) window.bqProj.addLog(projRecord.id, { date: 'Today', summary: summary, shared: share });
    enqueue({ kind: 'log', glyph: 'log', label: 'Daily log · Jun 12' + (share ? ' (shared w/ client)' : ''), project: proj });
    showToast('Daily log saved' + (share ? ' & shared' : ''));
    go('logs');
  };
  return (
    <React.Fragment>
      <FieldHead title="New daily log" back onBack={() => go('home')}></FieldHead>
      {stage === 'compose' ? (
        <React.Fragment>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <FieldProjPicker></FieldProjPicker>
            <span className="bq-chip"><BqIcon d={BQ_GLYPH.sun} size={11}></BqIcon>95° · clear</span>
          </div>
          <button style={{ width: '100%', padding: 16, borderRadius: 16, border: 'none', background: 'var(--bq-ai)', color: '#fff', fontWeight: 700, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer' }}>
            <BqIcon d="M12 14 a3 3 0 0 0 3-3 V6 a3 3 0 0 0-6 0 V11 a3 3 0 0 0 3 3 Z M6 11 a6 6 0 0 0 12 0 M12 17 V21" size={22}></BqIcon>Hold to dictate
          </button>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--bq-faint)', margin: '10px 0' }}>or type rough notes - AI cleans it up</div>
          <textarea placeholder="beam set, framing passed, found old cloth wiring in hall wall…" style={{ width: '100%', boxSizing: 'border-box', minHeight: 96, resize: 'none', borderRadius: 14, border: '1px solid var(--bq-border)', background: 'var(--bq-raise)', font: 'inherit', fontSize: 14, lineHeight: 1.5, color: 'var(--bq-ink)', padding: '12px 14px' }}></textarea>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, margin: '12px 0' }}>
            <BqPh h={84} label=""></BqPh>
            <BqPh h={84} label=""></BqPh>
            <div style={{ height: 84, borderRadius: 14, border: '2px dashed var(--bq-border-strong)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: 'var(--bq-faint)' }}>
              <BqIcon d={BQ_GLYPH.camera} size={20}></BqIcon><span style={{ fontSize: 11, fontWeight: 600 }}>Add</span>
            </div>
          </div>
          <button className="bq-btn ai" style={{ width: '100%', padding: 14, fontSize: 15 }} onClick={() => setStage('written')}><BqSpark size={16}></BqSpark>Write the log</button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="bq-ai-card" style={{ padding: '14px 15px', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><BqSpark size={13}></BqSpark><span style={{ fontWeight: 700, fontSize: 14, color: 'var(--bq-ai-strong)' }}>Log written</span></div>
            <div style={{ fontSize: 13, color: 'var(--bq-ink)', lineHeight: 1.5 }}>Beam set across the kitchen opening; framing inspection passed. Electrical rough started - <b>flagged old cloth wiring</b> in the hall wall as a possible change order.</div>
          </div>
          <button onClick={() => go('co')} className="bq-card-s" style={{ width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer', font: 'inherit', padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 11, marginBottom: 10, boxShadow: 'inset 0 0 0 1px var(--bq-brand-border)', background: 'var(--bq-brand-soft)' }}>
            <BqIcon d={BQ_GLYPH.co} size={20} style={{ color: 'var(--bq-brand-strong)', flex: 'none' }}></BqIcon>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--bq-brand-strong)' }}>Turn the wiring flag into a change order?</div>
              <div style={{ fontSize: 12, color: 'var(--bq-muted)' }}>Catch it before it becomes unbilled work</div>
            </div>
            <BqIcon d="M9 5 L16 12 L9 19" size={15} style={{ color: 'var(--bq-brand-strong)' }}></BqIcon>
          </button>
          <div className="bq-card-s" style={{ padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>Share with client?</div>
              <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>A homeowner-safe summary is ready</div>
            </div>
            <button onClick={() => setShare((s) => !s)} style={{ width: 44, height: 26, borderRadius: 999, border: 'none', cursor: 'pointer', flex: 'none', background: share ? 'var(--bq-ai)' : 'var(--bq-border-strong)', position: 'relative' }}><span style={{ position: 'absolute', top: 3, left: share ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left .15s' }}></span></button>
          </div>
          <button className="bq-btn primary" style={{ width: '100%', padding: 14, fontSize: 15 }} onClick={save}>Save{share ? ' & share' : ''}</button>
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

// ─────────────────────────────────────────── Daily log history ───────────────────────────────────────────
function FieldLogs() {
  const { go, logs } = useField();
  return (
    <React.Fragment>
      <FieldHead title="Daily logs" sub="Your jobsite record" right={<button className="bq-btn primary sm" onClick={() => go('log')}><BqIcon d="M12 5 V19 M5 12 H19" size={14} sw={2.2}></BqIcon>New</button>}></FieldHead>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {logs.map((l) => (
          <div key={l.id} className="bq-card-s" style={{ padding: '14px 15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
              <span style={{ fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap' }}>{l.date}</span>
              <span className="bq-chip">{l.proj}</span>
              <span style={{ flex: 1 }}></span>
              {l.shared ? <span className="bq-chip ai"><BqIcon d={BQ_GLYPH.clients} size={11}></BqIcon>Shared</span> : <span className="bq-chip">Internal</span>}
            </div>
            <div style={{ fontSize: 13, color: 'var(--bq-ink)', lineHeight: 1.5 }}>{l.summary}</div>
            {l.photos ? (
              <div style={{ display: 'flex', gap: 7, marginTop: 11 }}>
                {Array.from({ length: Math.min(l.photos, 3) }).map((_, i) => <BqPh key={i} h={56} style={{ width: 56, borderRadius: 11 }} label=""></BqPh>)}
                {l.photos > 3 ? <div style={{ width: 56, height: 56, borderRadius: 11, background: 'var(--bq-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--bq-muted)' }}>+{l.photos - 3}</div> : null}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────── Field change order ───────────────────────────────────────────
function FieldCO() {
  const { go, enqueue, showToast, proj, projRecord } = useField();
  const clientLabel = (window.bqProj && projRecord) ? (((window.bqProj.actives().find((x) => x.project.id === projRecord.id) || {}).client || {}).name || 'the client') : 'the client';
  const [stage, setStage] = React.useState('capture'); // capture | draft | sent
  const LINES = [
    ['Remove & cap old cloth wiring - hall wall', 640],
    ['New 20A circuit + AFCI breaker, permit update', 720],
  ];
  const cost = LINES.reduce((s, l) => s + l[1], 0);
  const price = 1740;
  const send = () => {
    enqueue({ kind: 'co', glyph: 'co', label: 'Change order draft · ' + bqMoney(price), project: proj });
    if (projRecord) {
      const n = window.bqProj.get(projRecord.id).proj.cos.length;
      window.bqProj.addCo(projRecord.id, { no: 'CO-' + (101 + n), t: 'Field-captured extra work', price: price, status: 'draft', from: 'field' });
    }
    setStage('sent'); showToast('Change order sent to office');
  };
  return (
    <React.Fragment>
      <FieldHead title="Change order" back onBack={() => go('home')}></FieldHead>
      {stage === 'capture' ? (
        <React.Fragment>
          <div className="bq-ai-card" style={{ padding: '12px 14px', marginBottom: 14, display: 'flex', gap: 10 }}>
            <BqSpark size={15}></BqSpark>
            <div style={{ fontSize: 12.5, color: 'var(--bq-ink)', lineHeight: 1.5 }}>Found something not in the contract? Snap it and say what happened - BuilderIQ drafts the change order so it doesn't go unbilled.</div>
          </div>
          <FieldProjPicker></FieldProjPicker>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, margin: '12px 0' }}>
            <BqPh h={92} label=""></BqPh>
            <div style={{ height: 92, borderRadius: 14, border: '2px dashed var(--bq-border-strong)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: 'var(--bq-faint)' }}>
              <BqIcon d={BQ_GLYPH.camera} size={20}></BqIcon><span style={{ fontSize: 11, fontWeight: 600 }}>Photo</span>
            </div>
            <div style={{ height: 92, borderRadius: 14, border: '2px dashed var(--bq-border-strong)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, color: 'var(--bq-faint)' }}>
              <BqIcon d="M12 14 a3 3 0 0 0 3-3 V6 a3 3 0 0 0-6 0 V11 a3 3 0 0 0 3 3 Z M6 11 a6 6 0 0 0 12 0 M12 17 V21" size={20}></BqIcon><span style={{ fontSize: 11, fontWeight: 600 }}>Voice</span>
            </div>
          </div>
          <textarea defaultValue="Opened hall wall for the new circuit - found old cloth-insulated wiring. Code says we have to replace it before we can close up. Not in the original scope." style={{ width: '100%', boxSizing: 'border-box', minHeight: 92, resize: 'none', borderRadius: 14, border: '1px solid var(--bq-border)', background: 'var(--bq-raise)', font: 'inherit', fontSize: 14, lineHeight: 1.5, color: 'var(--bq-ink)', padding: '12px 14px', marginBottom: 12 }}></textarea>
          <button className="bq-btn ai" style={{ width: '100%', padding: 14, fontSize: 15 }} onClick={() => setStage('draft')}><BqSpark size={16}></BqSpark>Draft the change order</button>
        </React.Fragment>
      ) : stage === 'draft' ? (
        <React.Fragment>
          <div className="bq-ai-card" style={{ padding: '14px 15px', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}><BqSpark size={13}></BqSpark><span style={{ fontWeight: 700, fontSize: 14, color: 'var(--bq-ai-strong)' }}>CO-007 · drafted</span></div>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Replace non-compliant wiring - hall wall</div>
            {LINES.map((l, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: i ? '1px solid var(--bq-ai-border)' : 'none', fontSize: 13 }}>
                <span style={{ flex: 1, color: 'var(--bq-ink)' }}>{l[0]}</span>
                <span className="bq-num" style={{ fontSize: 14 }}>{bqMoney(l[1])}</span>
              </div>
            ))}
          </div>
          <div className="bq-card-s" style={{ padding: '13px 15px', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
              <span style={{ flex: 1, color: 'var(--bq-muted)' }}>Cost</span><span className="bq-num">{bqMoney(cost)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0 0', fontSize: 13 }}>
              <span style={{ flex: 1, color: 'var(--bq-muted)' }}>Client price (28% margin)</span><span className="bq-num" style={{ fontSize: 17, color: 'var(--bq-brand-strong)' }}>{bqMoney(price)}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--bq-muted)', marginBottom: 14, padding: '0 2px' }}>
            <BqIcon d={BQ_GLYPH.watchdog} size={15} style={{ color: 'var(--bq-ai-strong)', flex: 'none' }}></BqIcon>
            Protects <b style={{ color: 'var(--bq-ink)' }}>&nbsp;{bqMoney(price)}&nbsp;</b> from leaking as unbilled work.
          </div>
          <button className="bq-btn primary" style={{ width: '100%', padding: 14, fontSize: 15 }} onClick={send}><BqIcon d={BQ_GLYPH.send} size={16}></BqIcon>Send to office for pricing review</button>
          <button className="bq-btn ghost" style={{ width: '100%', marginTop: 8 }} onClick={() => setStage('capture')}>Back to edit</button>
        </React.Fragment>
      ) : (
        <div style={{ paddingTop: 30, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bq-good-soft)', color: 'var(--bq-good)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><BqIcon d={BQ_GLYPH.check} size={32} sw={2.4}></BqIcon></div>
          <div className="bq-display" style={{ fontSize: 20, marginBottom: 6 }}>Sent to the office</div>
          <div style={{ fontSize: 13.5, color: 'var(--bq-muted)', lineHeight: 1.5, maxWidth: 280, margin: '0 auto 22px' }}>Tasha will confirm pricing and send <b>this change order</b> to {clientLabel} for signature. You'll get a ping when it's approved.</div>
          <button className="bq-btn" style={{ minWidth: 180 }} onClick={() => go('home')}>Back to Today</button>
        </div>
      )}
    </React.Fragment>
  );
}

// ─────────────────────────────────────────── Receipt / expense ───────────────────────────────────────────
function FieldReceipt() {
  const { go, enqueue, showToast, proj, projRecord } = useField();
  const [stage, setStage] = React.useState('snap'); // snap | review | done
  const post = () => {
    if (projRecord) window.bqProj.addMaterial(projRecord.id, { item: 'Ferguson - plumbing fixtures', vendor: 'Ferguson', qty: 1, unit: 'lot', cost: 284.16, billable: true, billed: false });
    enqueue({ kind: 'expense', glyph: 'expense', label: 'Material · Ferguson · $284.16', project: proj });
    setStage('done'); showToast('Purchase logged to ' + proj);
  };
  const Field = ({ label, value, chip }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 0', borderTop: '1px solid var(--bq-border)' }}>
      <span style={{ fontSize: 12.5, color: 'var(--bq-muted)', width: 92, flex: 'none' }}>{label}</span>
      {chip ? <span className="bq-chip ai" style={{ marginLeft: 'auto' }}>{value}</span> : <span style={{ flex: 1, textAlign: 'right', fontSize: 14, fontWeight: 600 }}>{value}</span>}
    </div>
  );
  return (
    <React.Fragment>
      <FieldHead title="Snap a receipt" back onBack={() => go('home')}></FieldHead>
      {stage === 'snap' ? (
        <React.Fragment>
          <div style={{ height: 230, borderRadius: 18, border: '2px dashed var(--bq-border-strong)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--bq-faint)', marginBottom: 14, background: 'var(--bq-subtle)' }}>
            <BqIcon d={BQ_GLYPH.camera} size={34}></BqIcon>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Center the receipt in frame</span>
          </div>
          <button className="bq-btn ai" style={{ width: '100%', padding: 14, fontSize: 15 }} onClick={() => setStage('review')}><BqSpark size={16}></BqSpark>Scan receipt</button>
          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--bq-faint)', marginTop: 10 }}>BuilderIQ reads the vendor, amount, and suggests a cost code</div>
        </React.Fragment>
      ) : stage === 'review' ? (
        <React.Fragment>
          <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            <BqPh h={120} label="" style={{ width: 92, flex: 'none', borderRadius: 14 }}></BqPh>
            <div className="bq-ai-card" style={{ flex: 1, padding: '12px 13px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}><BqSpark size={12}></BqSpark><span style={{ fontSize: 12, fontWeight: 700, color: 'var(--bq-ai-strong)', whiteSpace: 'nowrap' }}>Read from receipt</span></div>
              <div style={{ fontSize: 12.5, color: 'var(--bq-muted)', lineHeight: 1.45 }}>Check the cost code, then post it to the job.</div>
            </div>
          </div>
          <div className="bq-card-s" style={{ padding: '4px 15px 12px' }}>
            <Field label="Vendor" value="Ferguson Plumbing Supply"></Field>
            <Field label="Amount" value="$284.16"></Field>
            <Field label="Date" value="Jun 12, 2026"></Field>
            <Field label="Project" value={proj} chip></Field>
            <Field label="Cost code" value="Plumbing fixtures · 15-100" chip></Field>
          </div>
          <button className="bq-btn primary" style={{ width: '100%', padding: 14, fontSize: 15, marginTop: 14 }} onClick={post}><BqIcon d={BQ_GLYPH.check} size={16} sw={2.2}></BqIcon>Post expense</button>
          <button className="bq-btn ghost" style={{ width: '100%', marginTop: 8 }} onClick={() => setStage('snap')}>Retake</button>
        </React.Fragment>
      ) : (
        <div style={{ paddingTop: 30, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bq-good-soft)', color: 'var(--bq-good)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><BqIcon d={BQ_GLYPH.check} size={32} sw={2.4}></BqIcon></div>
          <div className="bq-display" style={{ fontSize: 20, marginBottom: 6 }}>Posted to the budget</div>
          <div style={{ fontSize: 13.5, color: 'var(--bq-muted)', lineHeight: 1.5, maxWidth: 280, margin: '0 auto 22px' }}>$284.16 logged against <b>{proj}</b>. It'll show in budget-vs-actuals right away.</div>
          <button className="bq-btn" style={{ minWidth: 180 }} onClick={() => go('home')}>Back to Today</button>
        </div>
      )}
    </React.Fragment>
  );
}

// ─────────────────────────────────────────── Photos ───────────────────────────────────────────
function FieldPhotos() {
  const { showToast } = useField();
  const [phase, setPhase] = React.useState('All');
  const PHASES = ['All', 'Demo', 'Framing', 'Rough-in'];
  const PHOTOS = [
    { phase: 'Rough-in', tag: 'Electrical' }, { phase: 'Rough-in', tag: 'Plumbing' },
    { phase: 'Framing', tag: 'Kitchen' }, { phase: 'Framing', tag: 'Hall bath' },
    { phase: 'Demo', tag: 'Before' }, { phase: 'Demo', tag: 'Haul-out' },
  ];
  const shown = PHOTOS.filter((p) => phase === 'All' || p.phase === phase);
  return (
    <React.Fragment>
      <FieldHead title="Photos" sub={useField().proj}></FieldHead>
      <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 12, margin: '0 -16px', padding: '0 16px 12px' }}>
        {PHASES.map((p) => (
          <button key={p} onClick={() => setPhase(p)} className={'bq-chip' + (phase === p ? ' brand' : '')} style={{ border: 'none', cursor: 'pointer', font: 'inherit', flex: 'none', padding: '6px 13px' }}>{p}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
        <button onClick={() => showToast('Camera opened')} style={{ aspectRatio: '1', borderRadius: 16, border: '2px dashed var(--bq-border-strong)', background: 'var(--bq-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--bq-brand-strong)', cursor: 'pointer', font: 'inherit' }}>
          <BqIcon d={BQ_GLYPH.camera} size={26}></BqIcon><span style={{ fontSize: 12, fontWeight: 700 }}>Add photo</span>
        </button>
        {shown.map((p, i) => (
          <div key={i} style={{ position: 'relative', aspectRatio: '1' }}>
            <BqPh h="100%" label="" style={{ width: '100%', height: '100%', borderRadius: 16 }}></BqPh>
            <span style={{ position: 'absolute', left: 8, bottom: 8, fontSize: 10.5, fontWeight: 700, color: '#fff', background: 'rgba(26,24,19,0.6)', borderRadius: 7, padding: '3px 8px', backdropFilter: 'blur(4px)' }}>{p.tag}</span>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────── Messages ───────────────────────────────────────────
function FieldMessages() {
  const { enqueue, proj } = useField();
  const [msgs, setMsgs] = React.useState([
    { me: false, who: 'Tasha (PM)', t: 'Morning Marco - inspector confirmed a 1pm window today.', time: '7:18' },
    { me: true, t: 'Copy. Shoring comes out this AM, area will be clear.', time: '7:21' },
    { me: false, who: 'Tasha (PM)', t: 'Cabinet delivery pushed to Tue - stage them in the garage when they land.', time: '7:24' },
  ]);
  const [text, setText] = React.useState('');
  const endRef = React.useRef(null);
  React.useEffect(() => { if (endRef.current) endRef.current.scrollTop = endRef.current.scrollHeight; }, [msgs]);
  const send = () => {
    if (!text.trim()) return;
    setMsgs((m) => [...m, { me: true, t: text.trim(), time: '7:42' }]);
    enqueue({ kind: 'msg', glyph: 'send', label: 'Message to office', project: proj });
    setText('');
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', margin: '0 -16px', padding: '0' }}>
      <div style={{ padding: '4px 16px 12px' }}>
        <FieldHead title="Office" sub="Tasha Bell · Project manager"></FieldHead>
      </div>
      <div ref={endRef} style={{ flex: 1, overflowY: 'auto', padding: '0 16px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.me ? 'flex-end' : 'flex-start', gap: 2 }}>
            {!m.me && m.who ? <span style={{ fontSize: 11, color: 'var(--bq-faint)', fontWeight: 600, paddingLeft: 4 }}>{m.who}</span> : null}
            <div style={{ maxWidth: '78%', padding: '9px 13px', borderRadius: m.me ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: m.me ? 'var(--bq-brand)' : 'var(--bq-card)', color: m.me ? '#fff' : 'var(--bq-ink)', fontSize: 13.5, lineHeight: 1.4, boxShadow: m.me ? 'none' : 'var(--bq-shadow)' }}>{m.t}</div>
            <span style={{ fontSize: 10, color: 'var(--bq-faint)', padding: '0 4px' }}>{m.time}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, padding: '10px 16px 4px', borderTop: '1px solid var(--bq-border)', background: 'var(--bq-card)' }}>
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} placeholder="Message the office…" style={{ flex: 1, border: '1px solid var(--bq-border)', borderRadius: 999, padding: '10px 15px', font: 'inherit', fontSize: 14, background: 'var(--bq-raise)', color: 'var(--bq-ink)', outline: 'none' }}></input>
        <button onClick={send} aria-label="Send" style={{ width: 42, height: 42, borderRadius: '50%', border: 'none', background: 'var(--bq-brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flex: 'none' }}><BqIcon d={BQ_GLYPH.send} size={18}></BqIcon></button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────── Projects ───────────────────────────────────────────
function FieldProjects() {
  const { go } = useField();
  return (
    <React.Fragment>
      <FieldHead title="Projects" sub="Assigned to your crew"></FieldHead>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {bqFieldProjects().map((p) => (
          <div key={p.id} className="bq-card-s" style={{ padding: '15px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
              <span style={{ width: 40, height: 40, borderRadius: 11, background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={BQ_GLYPH.hammer} size={18}></BqIcon></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14.5, lineHeight: 1.25 }}>{p.n}</div>
                <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{p.addr}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="bq-chip">{p.ph}</span>
              {p.open ? <span className="bq-chip brand">{p.open} open task{p.open > 1 ? 's' : ''}</span> : null}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="bq-btn sm" style={{ flex: 1 }} onClick={() => go('cal')}><BqIcon d={BQ_GLYPH.cal} size={13}></BqIcon>Schedule</button>
              <button className="bq-btn sm" style={{ flex: 1 }} onClick={() => go('log')}><BqIcon d={BQ_GLYPH.log} size={13}></BqIcon>New log</button>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 4 }}>Project files</div>
              {[['Framing plan', 'plan'], ['Permit card', 'punch'], ['Spec - cabinets & finishes', 'docs']].map(([f, g], i) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
                  <BqIcon d={BQ_GLYPH[g]} size={15} style={{ color: 'var(--bq-muted)', flex: 'none' }}></BqIcon>
                  <span style={{ flex: 1, fontSize: 13 }}>{f}</span>
                  <BqIcon d={BQ_GLYPH.exports} size={14} style={{ color: 'var(--bq-faint)' }}></BqIcon>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
}

// ─────────────────────────────────────────── Schedule ───────────────────────────────────────────
function FieldSchedule() {
  const { go } = useField();
  const acts = window.bqProj ? window.bqProj.actives() : [];
  const DATES = acts.length
    ? acts.reduce((out, x) => { (x.project.milestones || []).filter((m) => !m.done).forEach((m, i) => out.push({ t: m.t, date: m.w, proj: window.bqProj.shortName(x.client, x.project), soon: out.length === 0 })); return out; }, [])
    : [];
  return (
    <React.Fragment>
      <FieldHead title="Schedule" sub="We'll text you if anything moves"></FieldHead>
      {!DATES.length ? <div className="bq-card-s" style={{ padding: '22px 16px', textAlign: 'center', fontSize: 13, color: 'var(--bq-faint)' }}>No upcoming milestones - you're all caught up.</div> : <div className="bq-card-s" style={{ overflow: 'hidden' }}>
        {DATES.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 15px', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
            <div style={{ width: 56, textAlign: 'center', flex: 'none' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--bq-faint)', textTransform: 'uppercase' }}>{String(d.date).split(' · ')[0].split(' ')[0]}</div>
              <div className="bq-num" style={{ fontSize: 16 }}>{String(d.date).split(' ').pop()}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{d.t}</div>
              <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{d.proj}</div>
            </div>
            {d.soon ? <span className="bq-chip brand">Next</span> : null}
          </div>
        ))}
      </div>}
      <button className="bq-btn" style={{ width: '100%', marginTop: 12 }} onClick={() => go('log')}><BqIcon d={BQ_GLYPH.log} size={14}></BqIcon>Log today's work</button>
    </React.Fragment>
  );
}

Object.assign(window, { FieldLog, FieldLogs, FieldCO, FieldReceipt, FieldPhotos, FieldMessages, FieldProjects, FieldSchedule });
