// Hi-fi Photos/videos timeline - phase grouping, tags, client-visible, AI descriptions
const PHOTO_GROUPS = [
  { day: 'Wed, Jun 11', phase: 'Structural', items: [
    { tags: ['Kitchen', 'During', 'Framing'], video: false, cv: true, ai: 'Engineered beam set across the kitchen-dining opening; temporary shoring still in place.' },
    { tags: ['Kitchen', 'During', 'Issue'], video: false, cv: false, ai: 'Old cloth-insulated wiring exposed in the hall wall - flagged for electrical review.' },
    { tags: ['Kitchen', 'During'], video: true, cv: true, ai: 'Walkthrough video: framing inspection passed.' },
  ]},
  { day: 'Mon, Jun 9', phase: 'Demo', items: [
    { tags: ['Kitchen', 'Before'], video: false, cv: true, ai: 'Original kitchen before demolition - existing soffit and wall to be removed.' },
    { tags: ['Kitchen', 'During', 'Demo'], video: false, cv: false, ai: 'Demolition in progress; wall framing exposed.' },
    { tags: ['Hall Bath', 'Before'], video: false, cv: true, ai: 'Existing hall bath prior to renovation.' },
    { tags: ['Kitchen', 'After', 'Demo'], video: false, cv: true, ai: 'Space cleared and protected after demo, ready for structural work.' },
  ]},
];
const TAG_TONE = { Before: '', During: 'ai', After: 'good', Issue: 'brand' };

function PhotoTile({ p, onClick }) {
  return (
    <div onClick={onClick} style={{ position: 'relative', cursor: 'pointer' }}>
      <BqPh h={150} label=""></BqPh>
      {p.video ? <span style={{ position: 'absolute', top: 8, left: 8, width: 26, height: 26, borderRadius: '50%', background: 'rgba(38,35,30,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d="M9 7 L17 12 L9 17 Z" size={13} style={{ color: '#fff' }}></BqIcon></span> : null}
      <span style={{ position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: '50%', background: p.cv ? 'var(--bq-ai)' : 'rgba(38,35,30,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title={p.cv ? 'Visible to client' : 'Internal only'}>
        <BqIcon d={p.cv ? 'M2 12 s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7 Z M12 15 a3 3 0 1 0 0-6 a3 3 0 0 0 0 6 Z' : 'M4 4 L20 20 M9.5 5.5 a10 10 0 0 1 12.5 6.5 s-1.3 2.6-3.8 4.4 M6.2 6.2 C3.6 8 2 12 2 12 s3.5 7 10 7 a10 10 0 0 0 3.3-.5'} size={13} style={{ color: '#fff' }}></BqIcon>
      </span>
      <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {p.tags.slice(0, 2).map((t) => <span key={t} className={'bq-chip ' + (TAG_TONE[t] || '')} style={{ background: TAG_TONE[t] ? undefined : 'rgba(255,255,255,0.92)', fontSize: 10.5, padding: '1px 7px' }}>{t}</span>)}
      </div>
    </div>
  );
}

function HifiPhotos() {
  const [filter, setFilter] = React.useState('All');
  const [open, setOpen] = React.useState(null);
  const FILTERS = ['All', 'Before', 'During', 'After', 'Issues', 'Client-visible', 'Videos'];
  const match = (p) => {
    if (filter === 'All') return true;
    if (filter === 'Issues') return p.tags.includes('Issue');
    if (filter === 'Client-visible') return p.cv;
    if (filter === 'Videos') return p.video;
    return p.tags.includes(filter);
  };

  return (
    <div className="bq-screen">
      <BqTop crumb="Projects / Henderson / Photos"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Photos"></BqSide>
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div className="bq-display" style={{ fontSize: 22 }}>Photos &amp; videos</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Henderson - Kitchen + Hall Bath · 23 items · visual project timeline</div>
            </div>
            <button className="bq-btn sm"><BqIcon d={BQ_GLYPH.camera} size={14}></BqIcon>Upload</button>
          </div>

          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {FILTERS.map((f) => (
              <button key={f} className={'bq-chip' + (filter === f ? ' brand' : '')} onClick={() => setFilter(f)} style={{ cursor: 'pointer', border: 'none', font: 'inherit', fontWeight: 600 }}>{f}</button>
            ))}
          </div>

          {PHOTO_GROUPS.map((g) => {
            const items = g.items.filter(match);
            if (!items.length) return null;
            return (
              <div key={g.day}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'var(--bq-brand)', flex: 'none' }}></span>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{g.day}</span>
                  <span className="bq-chip">{g.phase}</span>
                  <span style={{ height: 1, flex: 1, background: 'var(--bq-border)' }}></span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 'calc(12px * var(--bq-sp))', paddingLeft: 19 }}>
                  {items.map((p, i) => <PhotoTile key={i} p={p} onClick={() => setOpen(p)}></PhotoTile>)}
                </div>
              </div>
            );
          })}
        </main>
      </div>

      {open ? (
        <div onClick={() => setOpen(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(38,35,30,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30, padding: 24 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: 0, maxWidth: 820, width: '100%', background: 'var(--bq-card)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.3)' }}>
            <BqPh h={420} label="" style={{ flex: '1 1 60%', borderRadius: 0 }}></BqPh>
            <div style={{ flex: '1 1 40%', minWidth: 280, padding: '22px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{open.video ? 'Video' : 'Photo'} details</span>
                <button onClick={() => setOpen(null)} className="bq-btn ghost sm" style={{ marginLeft: 'auto', padding: 6 }}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={16}></BqIcon></button>
              </div>
              <div className="bq-ai-card" style={{ padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}><BqSpark size={13}></BqSpark><span style={{ fontWeight: 700, fontSize: 13, color: 'var(--bq-ai-strong)' }}>AI description</span></div>
                <div style={{ fontSize: 13, color: 'var(--bq-ink)', lineHeight: 1.5 }}>{open.ai}</div>
                <button className="bq-btn soft-ai sm" style={{ marginTop: 9 }}>Use as caption</button>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 8 }}>Tags</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {open.tags.map((t) => <span key={t} className={'bq-chip ' + (TAG_TONE[t] || '')}>{t}</span>)}
                  <span className="bq-chip" style={{ cursor: 'pointer' }}><BqIcon d="M12 5 V19 M5 12 H19" size={11}></BqIcon>Add</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
                <span style={{ width: 40, height: 24, borderRadius: 999, background: open.cv ? 'var(--bq-ai)' : 'var(--bq-border-strong)', position: 'relative', flex: 'none' }}><span style={{ position: 'absolute', top: 3, left: open.cv ? 19 : 3, width: 18, height: 18, borderRadius: '50%', background: 'var(--bq-raise)' }}></span></span>
                <span style={{ fontSize: 13, color: 'var(--bq-ink)' }}>{open.cv ? 'Visible to client' : 'Internal only'}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
window.HifiPhotos = HifiPhotos;
