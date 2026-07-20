// BuilderIQ Client app - shell, tab nav, Home, Updates
const CL_TABS = [
  ['Home', 'home'], ['Updates', 'log'], ['Photos', 'photo'], ['Decisions', 'select'], ['Money', 'invoice'], ['Documents', 'docs'], ['Closeout', 'warranty'], ['Messages', 'inbox'],
];
const CL_BADGES = { Decisions: 2, Documents: 1, Messages: 1 };

// ── Home ──
function ClientHome({ go, flash }) {
  return (
    <div className="cl-wrap">
      {/* status hero */}
      <section className="bq-card-s" style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="cl-eyebrow">Your remodel</div>
            <div className="cl-h" style={{ fontSize: 27, lineHeight: 1.1, marginTop: 2 }}>Kitchen + Hall Bath</div>
            <div style={{ fontSize: 13.5, color: 'var(--bq-muted)', marginTop: 3 }}>Week 6 of 14 · {window.bqCompany ? window.bqCompany() : 'Hartwell Builders'} · Mike is your project lead</div>
          </div>
          <span className="bq-chip good" style={{ fontSize: 12.5, padding: '5px 12px' }}>On track · done Nov 18</span>
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12.5, color: 'var(--bq-muted)', fontWeight: 600 }}>Overall progress</span>
            <span className="bq-num" style={{ fontSize: 16 }}>43%</span>
          </div>
          <BqMeter pct={43} tone="warn"></BqMeter>
        </div>
      </section>

      <ClMilestones></ClMilestones>

      {/* needs you */}
      <div>
        <div className="cl-eyebrow" style={{ marginBottom: 9 }}>Needs you</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
          <button className="cl-action" onClick={() => go('Decisions')}>
            <span className="ic" style={{ background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)' }}><BqIcon d={BQ_GLYPH.select} size={20}></BqIcon></span>
            <span style={{ flex: 1 }}><span style={{ display: 'block', fontWeight: 700, fontSize: 14 }}>Choose hall bath faucet</span><span style={{ display: 'block', fontSize: 12.5, color: 'var(--bq-muted)' }}>3 options · due Tuesday</span></span>
            <BqIcon d="M9 6 L15 12 L9 18" size={16} style={{ color: 'var(--bq-faint)' }}></BqIcon>
          </button>
          <button className="cl-action" onClick={() => go('Decisions')}>
            <span className="ic" style={{ background: 'var(--bq-subtle)', color: 'var(--bq-muted)' }}><BqIcon d={BQ_GLYPH.co} size={20}></BqIcon></span>
            <span style={{ flex: 1 }}><span style={{ display: 'block', fontWeight: 700, fontSize: 14 }}>Approve Change Order #4</span><span style={{ display: 'block', fontSize: 12.5, color: 'var(--bq-muted)' }}>Hallway lighting · + $1,840</span></span>
            <BqIcon d="M9 6 L15 12 L9 18" size={16} style={{ color: 'var(--bq-faint)' }}></BqIcon>
          </button>
          <button className="cl-action" onClick={() => go('Money')}>
            <span className="ic" style={{ background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)' }}><BqIcon d={BQ_GLYPH.invoice} size={20}></BqIcon></span>
            <span style={{ flex: 1 }}><span style={{ display: 'block', fontWeight: 700, fontSize: 14 }}>Draw 3 payment due</span><span style={{ display: 'block', fontSize: 12.5, color: 'var(--bq-muted)' }}>$27,960 · due Jun 22</span></span>
            <BqIcon d="M9 6 L15 12 L9 18" size={16} style={{ color: 'var(--bq-faint)' }}></BqIcon>
          </button>
        </div>
      </div>

      {/* latest update */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 9 }}>
          <span className="cl-eyebrow">Latest update</span>
          <button className="bq-btn ghost sm" style={{ marginLeft: 'auto' }} onClick={() => go('Updates')}>All updates</button>
        </div>
        <article className="bq-card-s" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 13 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="cl-avatar" style={{ background: 'var(--bq-ink)', color: '#fff', boxShadow: 'none' }}>MH</span>
            <div><div style={{ fontWeight: 700, fontSize: 14 }}>Week 6 update</div><div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>Mike Hartwell · Friday 4:02 pm</div></div>
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--bq-ink)' }}>Big week - all the wall tile in the kitchen is up and grouted, and the hall bath is waterproofed and ready for tile Monday. Electrical rough-in passed inspection on the first visit. Cabinets arrive Tuesday; we'll stage them in the garage.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: 8 }}>
            <div className="cl-pad" style={{ height: 128 }}>north wall tile</div>
            <div className="cl-pad" style={{ height: 128 }}>island rough-in</div>
            <div className="cl-pad" style={{ height: 128 }}>bath waterproofing</div>
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', display: 'flex', alignItems: 'center', gap: 5 }}><BqSpark size={11}></BqSpark>Drafted with BuilderIQ · reviewed and sent by Mike</div>
        </article>
      </div>

      {/* upcoming visits - confirm / add to calendar / reschedule */}
      <ClVisits flash={flash}></ClVisits>

      <ClTeam go={go}></ClTeam>
      <ClReferral></ClReferral>
    </div>
  );
}

// ── Updates ──
const CL_UPDATES = [
  { week: 'Week 6 update', when: 'Jun 13 · Friday', body: "All the wall tile in the kitchen is up and grouted, and the hall bath is waterproofed and ready for tile Monday. Electrical rough-in passed inspection on the first visit. Cabinets arrive Tuesday.", photos: ['north wall tile', 'island rough-in', 'bath waterproofing'] },
  { week: 'Week 5 update', when: 'Jun 6 · Friday', body: "Plumbing and electrical rough-ins are in. We re-routed a vent stack we found behind the old wall - that's the small change order I sent over. Drywall starts next week.", photos: ['kitchen rough-in', 'panel upgrade'] },
  { week: 'Week 4 update', when: 'May 30 · Friday', body: "Framing is complete and passed inspection. The new island base is set and the header over the old wall is in. It's really starting to take shape.", photos: ['framing', 'island base', 'header beam'] },
  { week: 'Week 3 update', when: 'May 23 · Friday', body: "Demolition wrapped up clean and we hauled everything off. A couple of surprises behind the cabinets but nothing major. Framing began Thursday.", photos: ['demo complete'] },
];

function ClientUpdates() {
  return (
    <div className="cl-wrap">
      <div>
        <div className="cl-h" style={{ fontSize: 26 }}>Updates</div>
        <div style={{ color: 'var(--bq-muted)' }}>Weekly progress from Mike - newest first.</div>
      </div>
      {CL_UPDATES.map((u, i) => (
        <article key={i} className="bq-card-s" style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="cl-avatar" style={{ background: 'var(--bq-ink)', color: '#fff', boxShadow: 'none' }}>MH</span>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14 }}>{u.week}</div><div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>Mike Hartwell · {u.when}</div></div>
            {i === 0 ? <span className="bq-chip brand">Newest</span> : null}
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: 'var(--bq-ink)' }}>{u.body}</p>
          <div style={{ display: 'grid', gridTemplateColumns: u.photos.length === 1 ? '1fr' : u.photos.length === 2 ? '1fr 1fr' : '1.6fr 1fr 1fr', gap: 8 }}>
            {u.photos.map((p, j) => <div key={j} className="cl-pad" style={{ height: 120 }}>{p}</div>)}
          </div>
        </article>
      ))}
      <div style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--bq-faint)', padding: '6px 0' }}>That's the start of your project · 142 photos in total</div>
    </div>
  );
}

// ── shell ──
function ClientApp() {
  const [tab, setTab] = React.useState(() => {
    try { return localStorage.getItem(window.bqNsKey('bq-client-tab')) || 'Home'; } catch (e) { return 'Home'; }
  });
  const go = React.useCallback((t) => {
    setTab(t);
    try { localStorage.setItem(window.bqNsKey('bq-client-tab'), t); } catch (e) {}
    const m = document.querySelector('.cl-main'); if (m) m.scrollTop = 0;
  }, []);
  const [toast, setToast] = React.useState(null);
  const flash = React.useCallback((m) => { setToast(m); window.clearTimeout(flash._t); flash._t = window.setTimeout(() => setToast(null), 2600); }, []);

  window.bqUseNewClients && window.bqUseNewClients(); // re-render on store change
  const activeProjects = window.bqProj ? window.bqProj.actives() : []; // [{client, project}]
  const [viewing, setViewing] = window.bqPersistState('cl-viewing', 'hen');
  const validCustom = activeProjects.some((x) => x.project.id === viewing);
  const effViewing = validCustom ? viewing : (activeProjects.length ? activeProjects[0].project.id : 'hen');
  const vcPair = activeProjects.find((x) => x.project.id === effViewing) || null;
  const vc = vcPair ? { id: vcPair.project.id, clientId: vcPair.client.id, name: vcPair.client.name, addr: vcPair.client.addr, initials: vcPair.client.initials, project: vcPair.project.title, stage: vcPair.project.stage, proj: vcPair.project, client: vcPair.client } : null;
  window.__bqClViewing = vc;

  const SECTIONS = {
    Home: ClientHome, Updates: ClientUpdates, Photos: window.ClientPhotos,
    Decisions: window.ClientDecisions, Money: window.ClientMoney,
    Documents: window.ClientDocuments, Closeout: window.ClientCloseout, Messages: window.ClientMessages,
  };
  const Cur = SECTIONS[tab] || ClientHome;
  const CurC = vc && window.ClCustomSections ? (window.ClCustomSections[tab] || window.ClCustomSections.Home) : null;
  const badges = vc ? { Decisions: vc.proj.cos.filter((x) => x.status === 'sent').length } : CL_BADGES;
  const [notif, setNotif] = React.useState(false);
  const [prefs, setPrefs] = React.useState(false);

  if (window.bqClean() && !activeProjects.length) {
    return (
      <div className="cl-shell bq-root">
        <header className="cl-header">
          <span className="cl-brandmark">{window.bqCompanyInitials()}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="cl-brandname">{window.bqCompany()}</div>
            <div className="cl-headproj">Client portal</div>
          </div>
          <span style={{ fontSize: 11, color: 'var(--bq-faint)', display: 'flex', alignItems: 'center', gap: 5 }}><BqSpark size={11}></BqSpark>Powered by BuilderIQ</span>
        </header>
        <main className="cl-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BqEmpty icon={BQ_GLYPH.home} title="Your project portal isn't set up yet" sub="When your builder starts your project, your schedule, updates, photos, selections, and payments will all appear right here." full></BqEmpty>
        </main>
      </div>
    );
  }

  return (
    <div className="cl-shell bq-root">
      <header className="cl-header">
        <span className="cl-brandmark">{window.bqCompanyInitials()}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="cl-brandname">{window.bqCompany()}</div>
          <div className="cl-headproj">{vc ? vc.name + ' · ' + vc.project : 'Dan & Priya Henderson · Kitchen + Hall Bath'}</div>
        </div>
        {activeProjects.length ? (
          <select value={effViewing} onChange={(e) => { setViewing(e.target.value); go('Home'); }} title="Demo: view this portal as" style={{ border: '1px solid var(--bq-border-strong)', borderRadius: 9, padding: '6px 8px', font: 'inherit', fontSize: 12, fontWeight: 600, background: 'var(--bq-raise)', color: 'var(--bq-ink)', outline: 'none', maxWidth: 190 }}>
            {activeProjects.length ? null : <option value="hen">Henderson (sample)</option>}
            {activeProjects.map((x) => <option key={x.project.id} value={x.project.id}>{x.client.name} - {x.project.title}</option>)}
          </select>
        ) : null}
        <span style={{ fontSize: 11, color: 'var(--bq-faint)', display: 'flex', alignItems: 'center', gap: 5 }}><BqSpark size={11}></BqSpark>Powered by BuilderIQ</span>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setNotif((b) => !b)} aria-label="Notifications" style={{ width: 38, height: 38, borderRadius: 11, border: 'none', cursor: 'pointer', background: notif ? 'var(--bq-subtle)' : 'transparent', color: 'var(--bq-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <BqIcon d={BQ_GLYPH.bell} size={19}></BqIcon>
            <span style={{ position: 'absolute', top: 7, right: 8, minWidth: 8, height: 8, borderRadius: 999, background: 'var(--bq-brand)', boxShadow: '0 0 0 2px var(--bq-card)' }}></span>
          </button>
          {notif ? <ClNotifPanel onClose={() => setNotif(false)} go={go}></ClNotifPanel> : null}
        </div>
        <button onClick={() => setPrefs(true)} aria-label="Settings" className="cl-avatar" style={{ border: 'none', cursor: 'pointer' }}>{vc ? vc.initials : 'DH'}</button>
      </header>
      <nav className="cl-nav">
        {CL_TABS.filter(([name]) => !vc || name !== 'Closeout').map(([name, g]) => (
          <button key={name} className={'cl-tab' + (tab === name ? ' on' : '')} onClick={() => go(name)}>
            <BqIcon d={BQ_GLYPH[g]} size={16}></BqIcon>
            <span>{name}</span>
            {badges[name] ? <span className="dot">{badges[name]}</span> : null}
          </button>
        ))}
      </nav>
      <main className="cl-main">
        {CurC ? <CurC c={vc} go={go} flash={flash}></CurC> : <Cur go={go} flash={flash}></Cur>}
      </main>
      <ClientAssistant go={go} key={viewing}></ClientAssistant>
      {prefs ? <ClPrefsModal onClose={() => setPrefs(false)}></ClPrefsModal> : null}
      {toast ? (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 200, background: 'var(--bq-ink)', color: '#fff', borderRadius: 11, padding: '12px 17px', fontSize: 13.5, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 9, boxShadow: '0 10px 28px rgba(38,35,30,0.35)' }}>
          <BqIcon d={BQ_GLYPH.check} size={15} sw={2.4} style={{ color: 'var(--bq-good)' }}></BqIcon>{toast}
        </div>
      ) : null}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ClientApp></ClientApp>);
