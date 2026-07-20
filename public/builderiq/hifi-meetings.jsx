// Hi-fi Meetings - client-facing scheduling: homeowners book selection meetings & walkthroughs
const MEET_TYPES = [
  { name: 'Selection meeting', mins: 45, place: 'Showroom or video', icon: 'select', on: true, color: 'ai' },
  { name: 'Site walkthrough', mins: 30, place: 'Job site', icon: 'projects', on: true, color: 'brand' },
  { name: 'Final walkthrough', mins: 60, place: 'Job site', icon: 'warranty', on: true, color: 'good' },
  { name: 'Design consult', mins: 60, place: 'Video call', icon: 'meet', on: false, color: '' },
];
const MEETINGS = [
  { day: 'Mon', date: 'Jun 16', time: '10:00 AM', type: 'Selection meeting', who: 'Dan & Priya Henderson', where: 'Showroom', status: 'Confirmed', tone: 'good' },
  { day: 'Tue', date: 'Jun 17', time: '8:30 AM', type: 'Site walkthrough', who: 'Henderson + Vargas Framing', where: 'Job site', status: 'Confirmed', tone: 'good' },
  { day: 'Thu', date: 'Jun 19', time: '2:00 PM', type: 'Selection meeting', who: 'The Okafors', where: 'Video call', status: 'Client booking', tone: 'ai' },
  { day: 'Fri', date: 'Jun 20', time: '-', type: 'Final walkthrough', who: 'Marcus Lee', where: 'Job site', status: 'Awaiting times', tone: 'brand' },
];
const MEET_WEEK = [
  { d: 'Mon 16', slots: 1 }, { d: 'Tue 17', slots: 1 }, { d: 'Wed 18', slots: 4 },
  { d: 'Thu 19', slots: 2 }, { d: 'Fri 20', slots: 3 }, { d: 'Sat 21', slots: 0 },
];

function HifiMeetings() {
  const [types, setTypes] = React.useState(MEET_TYPES);
  const [copied, setCopied] = React.useState(false);
  const toggle = (i) => setTypes((ts) => ts.map((t, j) => j === i ? { ...t, on: !t.on } : t));
  const awaiting = MEETINGS.filter((m) => m.status !== 'Confirmed').length;

  return (
    <div className="bq-screen">
      <BqTop crumb="Meetings"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Meetings" alerts={{ 'Meetings': awaiting }}></BqSide>
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div className="bq-display" style={{ fontSize: 22 }}>Meetings</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Let homeowners self-book selection meetings, walkthroughs &amp; site visits</div>
            </div>
            <button className="bq-btn sm">Sync calendar</button>
            <button className="bq-btn primary sm"><BqIcon d="M12 5 V19 M5 12 H19" size={14}></BqIcon>New meeting</button>
          </div>

          <div style={{ display: 'flex', gap: 'calc(12px * var(--bq-sp))', flexWrap: 'wrap' }}>
            <BqKPI label="Upcoming" value="4" sub="next 7 days"></BqKPI>
            <BqKPI label="Awaiting client booking" value={String(awaiting)} sub="link sent" tone="ai"></BqKPI>
            <BqKPI label="Confirmed this week" value="2" sub="on the calendar"></BqKPI>
            <BqKPI label="No-shows (90d)" value="1" sub="auto-reminders on" tone="warn"></BqKPI>
          </div>

          <div className="bq-ai-card" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 15px' }}>
            <BqSpark size={16}></BqSpark>
            <span style={{ fontSize: 12.5, color: 'var(--bq-ink)' }}>The Hendersons' <b>tile selection</b> is due in 3 days. Send them a booking link so they can pick a time that fits - BuilderIQ will write a friendly invite.</span>
            <button className="bq-btn ai sm" style={{ marginLeft: 'auto' }}>Send booking link</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'calc(14px * var(--bq-sp))', alignItems: 'start' }}>
            {/* upcoming */}
            <div className="bq-card-s" style={{ overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '13px 16px 4px' }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>Upcoming</span>
                <span style={{ marginLeft: 'auto', fontSize: 12.5, fontWeight: 600, color: 'var(--bq-brand-strong)', cursor: 'pointer' }}>Calendar view</span>
              </div>
              {MEETINGS.map((m, i) => (
                <div key={i} className="bq-trow" style={{ gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 14 }}>
                  <span style={{ width: 50, textAlign: 'center', flex: 'none' }}>
                    <span style={{ display: 'block', fontSize: 10.5, fontWeight: 700, color: 'var(--bq-faint)', textTransform: 'uppercase' }}>{m.day}</span>
                    <span className="bq-num" style={{ fontSize: 18 }}>{m.date.split(' ')[1]}</span>
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', fontWeight: 600 }}>{m.type}</span>
                    <span style={{ display: 'block', fontSize: 11.5, color: 'var(--bq-faint)' }}>{m.time !== '-' ? m.time + ' · ' : ''}{m.who} · {m.where}</span>
                  </span>
                  <span className={'bq-chip ' + (m.tone || '')}>{m.status}</span>
                </div>
              ))}
            </div>

            {/* booking link + availability */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
              <div className="bq-card-s" style={{ padding: '16px 18px' }}>
                <div className="bq-sechead" style={{ marginBottom: 12 }}><span className="t">Meeting types you offer</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {types.map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, opacity: t.on ? 1 : 0.5 }}>
                      <span style={{ width: 32, height: 32, borderRadius: 9, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.color ? 'var(--bq-' + (t.color === 'ai' ? 'ai-soft' : t.color === 'good' ? 'good-soft' : 'brand-soft') + ')' : 'var(--bq-subtle)', color: t.color ? 'var(--bq-' + (t.color === 'ai' ? 'ai-strong' : t.color === 'good' ? 'good' : 'brand-strong') + ')' : 'var(--bq-muted)' }}><BqIcon d={BQ_GLYPH[t.icon]} size={16}></BqIcon></span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{t.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>{t.mins} min · {t.place}</div>
                      </div>
                      <button onClick={() => toggle(i)} aria-label="toggle" style={{ width: 38, height: 22, borderRadius: 999, border: 'none', cursor: 'pointer', background: t.on ? 'var(--bq-brand)' : 'var(--bq-border-strong)', position: 'relative', flex: 'none', transition: 'background 0.15s' }}>
                        <span style={{ position: 'absolute', top: 2, left: t.on ? 18 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.15s' }}></span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bq-card-s" style={{ padding: '16px 18px' }}>
                <div className="bq-sechead" style={{ marginBottom: 6 }}><span className="t">Your booking page</span></div>
                <div style={{ fontSize: 12.5, color: 'var(--bq-muted)', marginBottom: 10 }}>Homeowners pick from your open times. Share per project so it's pre-filled.</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bq-subtle)', borderRadius: 10, padding: '8px 12px', boxShadow: 'inset 0 0 0 1px var(--bq-border)' }}>
                  <BqIcon d={BQ_GLYPH.globe} size={14} style={{ color: 'var(--bq-faint)', flex: 'none' }}></BqIcon>
                  <span style={{ flex: 1, fontSize: 12.5, color: 'var(--bq-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>book.hartwellbuilders.com/henderson</span>
                  <button className="bq-btn sm" style={{ padding: '4px 10px' }} onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1400); }}>{copied ? 'Copied' : 'Copy'}</button>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                  {MEET_WEEK.map((d, i) => (
                    <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: 'var(--bq-faint)', fontWeight: 600, marginBottom: 4 }}>{d.d.split(' ')[0]}</div>
                      <div style={{ height: 44, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: d.slots ? 'var(--bq-brand-soft)' : 'var(--bq-subtle)', color: d.slots ? 'var(--bq-brand-strong)' : 'var(--bq-faint)', boxShadow: d.slots ? 'inset 0 0 0 1px var(--bq-brand-border)' : 'inset 0 0 0 1px var(--bq-border)' }}>
                        <span className="bq-num" style={{ fontSize: 16 }}>{d.slots || '-'}</span>
                        <span style={{ fontSize: 8.5 }}>{d.slots ? 'open' : 'full'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
window.HifiMeetings = HifiMeetings;
