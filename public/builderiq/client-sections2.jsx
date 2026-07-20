// BuilderIQ Client - added surfaces: milestones, team, photos+lightbox, closeout, referral, notifications, prefs
const CL_PHASES = [
  ['Demo', 'done'], ['Framing', 'done'], ['Rough-in', 'done'], ['Drywall', 'done'],
  ['Tile', 'now'], ['Cabinets', 'next'], ['Countertops', 'next'], ['Paint & trim', 'next'], ['Final', 'next'],
];

function ClMilestones() {
  return (
    <section className="bq-card-s" style={{ padding: '18px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 16 }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>Where we are</span>
        <span style={{ marginLeft: 'auto', fontSize: 12.5, color: 'var(--bq-muted)' }}>Phase 5 of 9 · Tile</span>
      </div>
      <div style={{ display: 'flex', overflowX: 'auto', padding: '5px 3px 4px', scrollbarWidth: 'none' }}>
        {CL_PHASES.map(([name, st], i) => {
          const done = st === 'done', now = st === 'now';
          return (
            <div key={name} style={{ flex: '1 0 auto', minWidth: 84, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              {i > 0 ? <div style={{ position: 'absolute', right: '50%', top: 13, width: '100%', height: 2, background: done || now ? 'var(--bq-good)' : 'var(--bq-border-strong)' }}></div> : null}
              <div style={{ position: 'relative', width: 28, height: 28, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? 'var(--bq-good)' : now ? 'var(--bq-card)' : 'var(--bq-card)', boxShadow: now ? '0 0 0 3px var(--bq-brand)' : done ? 'none' : 'inset 0 0 0 2px var(--bq-border-strong)', color: '#fff', zIndex: 1 }}>
                {done ? <BqIcon d={BQ_GLYPH.check} size={14} sw={2.6}></BqIcon> : now ? <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--bq-brand)' }}></span> : null}
              </div>
              <span style={{ marginTop: 7, fontSize: 11.5, fontWeight: now ? 700 : 500, color: now ? 'var(--bq-brand-strong)' : done ? 'var(--bq-ink)' : 'var(--bq-faint)', textAlign: 'center', whiteSpace: 'nowrap' }}>{name}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const CL_TEAM = [
  ['Mike Hartwell', 'Project lead', 'MH', 'var(--bq-ink)', true],
  ['Marco Diaz', 'Lead carpenter', 'MD', 'var(--bq-brand)', false],
  ['Bright Electric', 'Electrical', 'BE', 'var(--bq-ai)', false],
  ['Reliant Plumbing', 'Plumbing', 'RP', 'var(--bq-good)', false],
  ['StoneWorks', 'Countertops', 'SW', '#7A4DB0', false],
];
function ClTeam({ go }) {
  return (
    <section className="bq-card-s" style={{ padding: '18px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 13 }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>Your team</span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--bq-faint)' }}>On site this week</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        {CL_TEAM.map(([name, role, ini, col, lead]) => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <span className="cl-avatar" style={{ background: col, color: '#fff', boxShadow: 'none', flex: 'none' }}>{ini}</span>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name.split(' ')[0]}{lead ? '' : ''}</div>
              <div style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>{role}</div>
            </div>
            {lead ? <button className="bq-btn ghost sm" style={{ padding: 7, flex: 'none' }} onClick={() => go('Messages')} title="Message"><BqIcon d={BQ_GLYPH.inbox} size={15}></BqIcon></button> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

function ClReferral() {
  const [sent, setSent] = React.useState(false);
  return (
    <section className="bq-card-s" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 14, background: 'linear-gradient(100deg, var(--bq-brand-soft), var(--bq-card) 70%)' }}>
      <span style={{ width: 44, height: 44, borderRadius: 13, flex: 'none', background: 'var(--bq-brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH.spark} size={22}></BqIcon></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14.5 }}>Know someone planning a remodel?</div>
        <div style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>Refer a friend to Hartwell Builders - you each get a <b>$250</b> credit.</div>
      </div>
      {sent ? <span className="bq-chip good" style={{ flex: 'none' }}><BqIcon d={BQ_GLYPH.check} size={12} sw={2.4}></BqIcon>Link copied</span>
        : <button className="bq-btn primary sm" style={{ flex: 'none' }} onClick={() => setSent(true)}>Refer &amp; earn</button>}
    </section>
  );
}

// ════════ UPCOMING VISITS (confirm · add to calendar · reschedule) ════════
const CL_VISITS = [
  { day: 'Mon–Tue', date: 'Jun 16–17', t: 'Cabinet install begins', sub: 'Crew on site 8am · no need to be home', need: false },
  { day: 'Wed', date: 'Jun 18', t: 'Countertop template visit', sub: 'StoneWorks measures your tops - please be home 9–11am', need: true },
  { day: 'Fri', date: 'Jun 20', t: 'Electrical trim inspection', sub: 'City inspector · access through the garage', need: false },
];
function ClVisitRow({ v, first, flash }) {
  const [state, setState] = React.useState('pending'); // pending | confirmed
  const [added, setAdded] = React.useState(false);
  const [resch, setResch] = React.useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 18px', borderTop: first ? 'none' : '1px solid var(--bq-border)' }}>
      <div style={{ width: 64, flex: 'none', paddingTop: 1 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--bq-faint)', textTransform: 'uppercase', letterSpacing: 0.4 }}>{v.day}</div>
        <div className="bq-num" style={{ fontSize: 14 }}>{v.date.split(' ').pop()}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, fontSize: 14.5 }}>{v.t}</span>
          {v.need ? <span className="bq-chip brand">Be home</span> : null}
          {state === 'confirmed' ? <span className="bq-chip good"><BqIcon d={BQ_GLYPH.check} size={11} sw={2.4}></BqIcon>Confirmed</span> : null}
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--bq-faint)', marginTop: 2 }}>{v.sub}</div>
        {resch ? (
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            <input className="cl-field" placeholder="Suggest a better day/time…" style={{ flex: '1 1 200px', padding: '8px 12px', fontSize: 13 }}></input>
            <button className="bq-btn primary sm" onClick={() => { setResch(false); flash && flash('Reschedule request sent to Mike'); }}>Send</button>
            <button className="bq-btn ghost sm" onClick={() => setResch(false)}>Cancel</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            {state === 'pending'
              ? <button className={'bq-btn sm ' + (v.need ? 'primary' : '')} onClick={() => { setState('confirmed'); flash && flash('Visit confirmed - Mike notified'); }}><BqIcon d={BQ_GLYPH.check} size={13} sw={2.2}></BqIcon>Confirm</button>
              : null}
            <button className="bq-btn sm" onClick={() => { setAdded(true); flash && flash('Added to your calendar'); }}>{added ? <React.Fragment><BqIcon d={BQ_GLYPH.check} size={13} sw={2.2}></BqIcon>Added</React.Fragment> : <React.Fragment><BqIcon d={BQ_GLYPH.cal} size={13}></BqIcon>Add to calendar</React.Fragment>}</button>
            <button className="bq-btn ghost sm" onClick={() => setResch(true)}>Can't make it?</button>
          </div>
        )}
      </div>
    </div>
  );
}
function ClVisits({ flash }) {
  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 9 }}>
        <span className="cl-eyebrow">This week on site</span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--bq-faint)' }}>Confirm so the crew knows you're set</span>
      </div>
      <div className="bq-card-s" style={{ overflow: 'hidden' }}>
        {CL_VISITS.map((v, i) => <ClVisitRow key={i} v={v} first={i === 0} flash={flash}></ClVisitRow>)}
      </div>
    </section>
  );
}

// ════════ PHOTOS + LIGHTBOX ════════
const CL_GALLERY = [
  { week: 'Week 6 · Jun 13', shots: [
    { cap: 'North wall tile up & grouted', room: 'Kitchen' }, { cap: 'Kitchen island rough-in', room: 'Kitchen' },
    { cap: 'Hall bath waterproofing', room: 'Hall bath' }, { cap: 'Tile layout dry-run', room: 'Hall bath' } ] },
  { week: 'Week 5 · Jun 6', shots: [
    { cap: 'Plumbing rough-in', room: 'Kitchen' }, { cap: '200A panel upgrade', room: 'Whole home' }, { cap: 'Vent stack re-route', room: 'Kitchen' } ] },
  { week: 'Week 4 · May 30', shots: [
    { cap: 'Framing complete', room: 'Whole home' }, { cap: 'New island base set', room: 'Kitchen' }, { cap: 'Header beam in', room: 'Kitchen' } ] },
  { week: 'Week 3 · May 23', shots: [
    { cap: 'Demo complete & hauled', room: 'Whole home' }, { cap: 'Behind-the-wall surprise', room: 'Hall bath' } ] },
];
const CL_FLAT = CL_GALLERY.flatMap((g) => g.shots.map((s) => ({ cap: s.cap, room: s.room, week: g.week })));

function ClBeforeAfter() {
  const [side, setSide] = React.useState('after');
  return (
    <section className="bq-card-s" style={{ padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Before &amp; after</div>
          <div style={{ fontSize: 12.5, color: 'var(--bq-faint)' }}>Kitchen - same view, week 0 vs. now</div>
        </div>
        <div className="seg-toggle">
          <button className={side === 'before' ? 'on' : ''} onClick={() => setSide('before')}>Before</button>
          <button className={side === 'after' ? 'on' : ''} onClick={() => setSide('after')}>Now</button>
        </div>
      </div>
      <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden' }}>
        <image-slot id="cl-ba-before" style={{ display: side === 'before' ? 'block' : 'none', width: '100%', height: 300 }} shape="rounded" radius="14" placeholder="Drop the 'before' photo · original kitchen"></image-slot>
        <image-slot id="cl-ba-after" style={{ display: side === 'after' ? 'block' : 'none', width: '100%', height: 300 }} shape="rounded" radius="14" placeholder="Drop the 'after' photo · kitchen today"></image-slot>
        <span style={{ position: 'absolute', left: 12, bottom: 12, fontSize: 11.5, fontWeight: 700, color: '#fff', background: 'rgba(26,24,19,0.62)', borderRadius: 8, padding: '4px 10px' }}>{side === 'before' ? 'Before · April' : 'Now · Week 6'}</span>
      </div>
    </section>
  );
}

function ClLightbox({ index, onClose, onNav, liked, onToggleLike, flash }) {
  const [cmt, setCmt] = React.useState('');
  React.useEffect(() => {
    const k = (e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') onNav(1); if (e.key === 'ArrowLeft') onNav(-1); };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [onNav, onClose]);
  const ph = CL_FLAT[index];
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(26,24,19,0.86)', zIndex: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4vh 4vw' }}>
      <div style={{ position: 'absolute', top: 18, right: 20, display: 'flex', alignItems: 'center', gap: 14, color: 'rgba(255,255,255,0.9)' }}>
        <span style={{ fontSize: 13 }}>{index + 1} / {CL_FLAT.length}</span>
        <button onClick={onClose} aria-label="Close" style={{ width: 38, height: 38, borderRadius: 10, border: 'none', background: 'rgba(255,255,255,0.14)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={18} sw={2}></BqIcon></button>
      </div>
      <button onClick={(e) => { e.stopPropagation(); onNav(-1); }} aria-label="Previous" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 46, height: 46, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.14)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d="M15 6 L9 12 L15 18" size={22} sw={2}></BqIcon></button>
      <button onClick={(e) => { e.stopPropagation(); onNav(1); }} aria-label="Next" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', width: 46, height: 46, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.14)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d="M9 6 L15 12 L9 18" size={22} sw={2}></BqIcon></button>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(820px, 100%)', maxHeight: '82vh' }}>
        <image-slot id={'cl-photo-' + index} style={{ display: 'block', width: '100%', height: '56vh', borderRadius: 16 }} shape="rounded" radius="16" placeholder={'Drop a photo · ' + ph.cap}></image-slot>
        <div style={{ marginTop: 14, color: '#fff', display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{ph.cap}</div>
            <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.65)' }}>{ph.week} · {ph.room}</div>
          </div>
          <button onClick={() => onToggleLike(index)} aria-label="Love this" style={{ display: 'flex', alignItems: 'center', gap: 7, border: 'none', cursor: 'pointer', borderRadius: 999, padding: '8px 14px', fontFamily: 'inherit', fontWeight: 700, fontSize: 13, background: liked ? 'var(--bq-brand)' : 'rgba(255,255,255,0.14)', color: '#fff' }}>
            <BqIcon d="M12 20 C 5 14.5, 3 11, 3 8 a4.2 4.2 0 0 1 8-1.4 A4.2 4.2 0 0 1 19 8 c0 3-2 6.5-7 12 Z" size={16} sw={1.8} style={{ fill: liked ? '#fff' : 'none' }}></BqIcon>{liked ? 'Loved' : 'Love this'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: 9, marginTop: 12 }}>
          <input value={cmt} onChange={(e) => setCmt(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && cmt.trim()) { setCmt(''); flash && flash('Comment sent to Mike'); } }} placeholder="Add a comment for Mike…" style={{ flex: 1, border: 'none', borderRadius: 999, padding: '11px 16px', font: 'inherit', fontSize: 13.5, background: 'rgba(255,255,255,0.14)', color: '#fff', outline: 'none' }}></input>
          <button onClick={() => { if (cmt.trim()) { setCmt(''); flash && flash('Comment sent to Mike'); } }} aria-label="Send comment" style={{ width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'var(--bq-brand)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={BQ_GLYPH.send} size={18}></BqIcon></button>
        </div>
      </div>
    </div>
  );
}

function ClientPhotos({ flash }) {
  const [lb, setLb] = React.useState(null);
  const [room, setRoom] = React.useState('All');
  const [liked, setLiked] = React.useState({});
  const ROOMS = ['All', 'Kitchen', 'Hall bath', 'Whole home'];
  const toggleLike = (i) => setLiked((l) => ({ ...l, [i]: !l[i] }));
  let gi = -1;
  const groups = CL_GALLERY.map((g) => ({ week: g.week, shots: g.shots.map((s) => { gi += 1; return { ...s, idx: gi }; }) }));
  return (
    <div className="cl-wrap">
      <div>
        <div className="cl-h" style={{ fontSize: 26 }}>Photos</div>
        <div style={{ color: 'var(--bq-muted)' }}>{CL_FLAT.length} progress photos from Mike &amp; the crew. Tap any to enlarge, love it, or leave a note.</div>
      </div>
      <ClBeforeAfter></ClBeforeAfter>
      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {ROOMS.map((r) => (
          <button key={r} onClick={() => setRoom(r)} className={'bq-chip' + (room === r ? ' brand' : '')} style={{ border: 'none', cursor: 'pointer', font: 'inherit', padding: '7px 14px' }}>{r}</button>
        ))}
      </div>
      {groups.map((g) => {
        const shown = g.shots.filter((s) => room === 'All' || s.room === room);
        if (!shown.length) return null;
        return (
          <div key={g.week}>
            <div className="cl-eyebrow" style={{ marginBottom: 9 }}>{g.week}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
              {shown.map((s) => (
                <div key={s.idx} style={{ position: 'relative' }}>
                  <button onClick={() => setLb(s.idx)} style={{ border: 'none', padding: 0, cursor: 'pointer', background: 'none', width: '100%' }}>
                    <div className="cl-pad" style={{ height: 116, alignItems: 'flex-end' }}>
                      <span style={{ padding: '8px 10px', fontSize: 11, color: 'var(--bq-muted)', textAlign: 'left', width: '100%', background: 'linear-gradient(transparent, rgba(0,0,0,0.06))' }}>{s.cap}</span>
                    </div>
                  </button>
                  <button onClick={() => toggleLike(s.idx)} aria-label="Love this" style={{ position: 'absolute', top: 8, right: 8, width: 30, height: 30, borderRadius: '50%', border: 'none', cursor: 'pointer', background: liked[s.idx] ? 'var(--bq-brand)' : 'rgba(255,255,255,0.85)', color: liked[s.idx] ? '#fff' : 'var(--bq-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>
                    <BqIcon d="M12 20 C 5 14.5, 3 11, 3 8 a4.2 4.2 0 0 1 8-1.4 A4.2 4.2 0 0 1 19 8 c0 3-2 6.5-7 12 Z" size={15} sw={1.8} style={{ fill: liked[s.idx] ? '#fff' : 'none' }}></BqIcon>
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {lb !== null ? <ClLightbox index={lb} liked={!!liked[lb]} onToggleLike={toggleLike} flash={flash} onClose={() => setLb(null)} onNav={(d) => setLb((i) => (i + d + CL_FLAT.length) % CL_FLAT.length)}></ClLightbox> : null}
    </div>
  );
}

// ════════ CLOSEOUT (punch list · walkthrough · warranty · review) ════════
const CL_WARRANTY = [
  ['Workmanship', '2 years', 'Hartwell Builders', BQ_GLYPH.hammer],
  ['Cabinets', '5 years', 'KraftMaid', BQ_GLYPH.select],
  ['Countertops', '15 years', 'StoneWorks', BQ_GLYPH.projects],
  ['Appliances', '1 year', 'Manufacturer', BQ_GLYPH.plug],
];
function ClStars({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} onClick={() => onChange(n)} aria-label={n + ' stars'} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2, color: n <= value ? 'var(--bq-brand)' : 'var(--bq-border-strong)' }}>
          <svg width={28} height={28} viewBox="0 0 24 24" fill={n <= value ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M12 3 L14.6 8.6 L20.5 9.3 L16 13.3 L17.3 19.2 L12 16 L6.7 19.2 L8 13.3 L3.5 9.3 L9.4 8.6 Z"></path></svg>
        </button>
      ))}
    </div>
  );
}
function ClientCloseout({ go }) {
  const [punch, setPunch] = React.useState([
    { t: 'Touch-up paint behind range', who: 'Crew', done: false },
    { t: 'Adjust pantry door alignment', who: 'Marco', done: false },
    { t: 'Caulk hall bath tub edge', who: 'Crew', done: true },
    { t: 'Replace cracked outlet cover', who: 'Bright Electric', done: true },
  ]);
  const [text, setText] = React.useState('');
  const [rating, setRating] = React.useState(0);
  const [reviewed, setReviewed] = React.useState(false);
  const open = punch.filter((p) => !p.done).length;
  const add = () => { const v = text.trim(); if (!v) return; setPunch((p) => [...p, { t: v, who: 'Crew', done: false }]); setText(''); window.bqLogEvent && window.bqLogEvent('client', { g: 'punch', tone: 'ai', body: 'Added a punch-list item: “' + v + '”', change: 'Homeowner added punch item: ' + v }); };

  return (
    <div className="cl-wrap">
      <div>
        <div className="cl-h" style={{ fontSize: 26 }}>Wrap-up</div>
        <div style={{ color: 'var(--bq-muted)' }}>Final punch list, your walkthrough, warranties, and a place to leave feedback.</div>
      </div>

      {/* punch list */}
      <section className="bq-card-s" style={{ padding: '20px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>Punch list</span>
          <span className="bq-chip brand" style={{ marginLeft: 'auto' }}>{open} open</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {punch.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: p.done ? 'var(--bq-good)' : 'var(--bq-card)', boxShadow: p.done ? 'none' : 'inset 0 0 0 2px var(--bq-border-strong)', color: '#fff' }}>{p.done ? <BqIcon d={BQ_GLYPH.check} size={12} sw={2.6}></BqIcon> : null}</span>
              <span style={{ flex: 1, fontSize: 13.5, color: p.done ? 'var(--bq-faint)' : 'var(--bq-ink)', textDecoration: p.done ? 'line-through' : 'none' }}>{p.t}</span>
              <span style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{p.done ? 'Done' : p.who}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 9, marginTop: 13 }}>
          <input className="cl-field" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') add(); }} placeholder="Spot something? Add it here…"></input>
          <button className="bq-btn primary" style={{ flex: 'none' }} onClick={add}>Add</button>
        </div>
      </section>

      {/* walkthrough */}
      <section className="bq-card-s" style={{ padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <span style={{ width: 40, height: 40, borderRadius: 12, flex: 'none', background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH.meet} size={20}></BqIcon></span>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontWeight: 700, fontSize: 14.5 }}>Final walkthrough</div>
          <div style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>Walk the finished project with Mike before closeout. Suggested: <b>Jul 18, 2:00 PM</b>.</div>
        </div>
        <button className="bq-btn primary sm" onClick={() => go('Messages')}>Confirm time</button>
        <button className="bq-btn sm" onClick={() => go('Messages')}>Suggest another</button>
      </section>

      {/* warranty */}
      <div>
        <div className="cl-eyebrow" style={{ marginBottom: 9 }}>Warranty coverage</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {CL_WARRANTY.map(([what, term, who, g]) => (
            <div key={what} className="bq-card-s" style={{ padding: '15px 16px', display: 'flex', flexDirection: 'column', gap: 7 }}>
              <span style={{ width: 34, height: 34, borderRadius: 10, background: 'var(--bq-subtle)', color: 'var(--bq-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={g} size={17}></BqIcon></span>
              <div style={{ fontWeight: 700, fontSize: 13.5 }}>{what}</div>
              <div style={{ fontSize: 12, color: 'var(--bq-muted)' }}><b className="bq-num" style={{ color: 'var(--bq-ink)' }}>{term}</b> · {who}</div>
            </div>
          ))}
        </div>
        <button className="bq-btn sm" style={{ marginTop: 11 }} onClick={() => go('Messages')}><BqIcon d={BQ_GLYPH.warranty} size={14}></BqIcon>File a warranty claim</button>
      </div>

      {/* review */}
      <section className="bq-card-s" style={{ padding: '20px 22px' }}>
        {reviewed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 40, height: 40, borderRadius: 12, flex: 'none', background: 'var(--bq-good-soft)', color: 'var(--bq-good)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH.check} size={20} sw={2.2}></BqIcon></span>
            <div><div style={{ fontWeight: 700, fontSize: 14.5 }}>Thank you!</div><div style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>Your {rating}-star review means the world to a small business.</div></div>
          </div>
        ) : (
          <React.Fragment>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>How are we doing?</div>
            <div style={{ fontSize: 12.5, color: 'var(--bq-muted)', marginBottom: 12 }}>Loving the progress? A quick review helps Hartwell Builders enormously.</div>
            <ClStars value={rating} onChange={setRating}></ClStars>
            <button className="bq-btn primary sm" style={{ marginTop: 14, opacity: rating ? 1 : 0.5, pointerEvents: rating ? 'auto' : 'none' }} onClick={() => setReviewed(true)}>Submit review</button>
          </React.Fragment>
        )}
      </section>
    </div>
  );
}

// ════════ NOTIFICATIONS + PREFERENCES ════════
const CL_ACTIVITY = [
  { g: 'select', body: 'New decision needed - hall bath faucet', time: '2h ago', unread: true, tone: 'brand' },
  { g: 'co', body: 'Change Order #4 is ready for your approval', time: '5h ago', unread: true, tone: 'brand' },
  { g: 'log', body: 'Mike posted the Week 6 update', time: 'Fri', unread: false, tone: 'ai' },
  { g: 'invoice', body: 'Draw 3 payment is due Jun 22', time: 'Thu', unread: false, tone: '' },
  { g: 'photo', body: '4 new progress photos added', time: 'Thu', unread: false, tone: '' },
];
function ClNotifPanel({ onClose, go }) {
  return (
    <React.Fragment>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 50 }}></div>
      <div className="bq-card-s" style={{ position: 'absolute', top: 50, right: 0, width: 340, zIndex: 51, padding: 0, overflow: 'hidden', boxShadow: '0 14px 36px rgba(38,35,30,0.22), 0 0 0 1px var(--bq-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 16px', borderBottom: '1px solid var(--bq-border)' }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
          <span className="bq-chip brand">{CL_ACTIVITY.filter((a) => a.unread).length} new</span>
        </div>
        <div style={{ maxHeight: 380, overflow: 'auto' }}>
          {CL_ACTIVITY.map((a, i) => (
            <div key={i} onClick={onClose} style={{ display: 'flex', gap: 11, padding: '12px 16px', borderTop: i ? '1px solid var(--bq-border)' : 'none', cursor: 'pointer', background: a.unread ? 'var(--bq-brand-soft)' : 'transparent' }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-subtle)', color: a.tone === 'brand' ? 'var(--bq-brand-strong)' : a.tone === 'ai' ? 'var(--bq-ai-strong)' : 'var(--bq-muted)' }}><BqIcon d={BQ_GLYPH[a.g]} size={15}></BqIcon></span>
              <div style={{ flex: 1 }}><div style={{ fontSize: 13, color: 'var(--bq-ink)', lineHeight: 1.4 }}>{a.body}</div><div style={{ fontSize: 11.5, color: 'var(--bq-faint)', marginTop: 2 }}>{a.time}</div></div>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}
function ClPrefsModal({ onClose }) {
  const [p, setP] = React.useState({ email: true, sms: true, push: false });
  const cats = [['email', 'Email', 'Updates, decisions & receipts to dan.henderson@gmail.com'], ['sms', 'Text messages', 'Time-sensitive items like visits & approvals'], ['push', 'Push notifications', 'On your phone via the BuilderIQ app']];
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(38,35,30,0.42)', zIndex: 85, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '12vh' }}>
      <div onClick={(e) => e.stopPropagation()} className="bq-card-s" style={{ width: 'min(440px, 94%)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '15px 18px', borderBottom: '1px solid var(--bq-border)' }}>
          <div style={{ flex: 1, fontWeight: 700, fontSize: 15 }}>Notification preferences</div>
          <button onClick={onClose} className="bq-btn ghost sm" style={{ padding: 6 }}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={16}></BqIcon></button>
        </div>
        <div style={{ padding: '8px 18px 14px' }}>
          {cats.map(([k, label, sub], i) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
              <div style={{ flex: 1 }}><div style={{ fontSize: 13.5, fontWeight: 600 }}>{label}</div><div style={{ fontSize: 11.5, color: 'var(--bq-faint)', lineHeight: 1.4 }}>{sub}</div></div>
              <button onClick={() => setP((s) => ({ ...s, [k]: !s[k] }))} style={{ width: 42, height: 24, borderRadius: 999, border: 'none', cursor: 'pointer', flex: 'none', background: p[k] ? 'var(--bq-brand)' : 'var(--bq-border-strong)', position: 'relative' }}><span style={{ position: 'absolute', top: 3, left: p[k] ? 21 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left .15s' }}></span></button>
            </div>
          ))}
        </div>
        <div style={{ padding: '13px 18px', borderTop: '1px solid var(--bq-border)', display: 'flex', justifyContent: 'flex-end' }}><button className="bq-btn primary sm" onClick={onClose}>Save</button></div>
      </div>
    </div>
  );
}

Object.assign(window, { ClMilestones, ClTeam, ClReferral, ClVisits, ClBeforeAfter, ClientPhotos, ClientCloseout, ClNotifPanel, ClPrefsModal });
