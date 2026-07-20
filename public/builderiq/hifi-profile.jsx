// Hi-fi My Profile - full personal account settings: profile, security, notifications, preferences
(function () {
  function PfSwitch({ on, onClick, size }) {
    const w = size === 'lg' ? 44 : 38, h = size === 'lg' ? 26 : 22, k = h - 4;
    return (
      <button onClick={onClick} style={{ width: w, height: h, borderRadius: 999, border: 'none', cursor: 'pointer', flex: 'none', background: on ? 'var(--bq-brand)' : 'var(--bq-border-strong)', position: 'relative', transition: 'background .15s' }}>
        <span style={{ position: 'absolute', top: 2, left: on ? w - k - 2 : 2, width: k, height: k, borderRadius: '50%', background: '#fff', transition: 'left .15s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}></span>
      </button>
    );
  }
  const fieldStyle = { fontFamily: 'inherit', fontSize: 13.5, color: 'var(--bq-ink)', background: 'var(--bq-card)', border: '1px solid var(--bq-border-strong)', borderRadius: 9, padding: '9px 12px', outline: 'none', width: '100%', boxSizing: 'border-box' };
  function PfField({ label, value, onChange, placeholder, type, hint }) {
    return (
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-muted)' }}>{label}</span>
        <input value={value} type={type || 'text'} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={fieldStyle}></input>
        {hint ? <span style={{ fontSize: 11, color: 'var(--bq-faint)' }}>{hint}</span> : null}
      </label>
    );
  }
  function PfSelectField({ label, value, options, onChange }) {
    const [open, setOpen] = React.useState(false);
    const [rect, setRect] = React.useState(null);
    const ref = React.useRef(null);
    const toggle = () => { if (!open && ref.current) setRect(ref.current.getBoundingClientRect()); setOpen((o) => !o); };
    React.useEffect(() => { if (!open) return; const c = () => setOpen(false); window.addEventListener('resize', c); return () => window.removeEventListener('resize', c); }, [open]);
    const menuH = Math.min(260, options.length * 38 + 8);
    let top = 0; if (rect) { const below = window.innerHeight - rect.bottom; top = (below < menuH + 16 && rect.top > menuH) ? rect.top - menuH - 4 : rect.bottom + 4; }
    return (
      <label style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
        {label ? <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-muted)' }}>{label}</span> : null}
        <div style={{ position: 'relative' }}>
          <button ref={ref} onClick={toggle} style={{ ...fieldStyle, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, cursor: 'pointer', boxShadow: open ? '0 0 0 2px var(--bq-brand-soft)' : 'none' }}>
            <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
            <BqIcon d="M6 9 L12 15 L18 9" size={14} sw={2} style={{ color: 'var(--bq-faint)', flex: 'none', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .12s' }}></BqIcon>
          </button>
          {open && rect ? (
            <React.Fragment>
              <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 95 }}></div>
              <div style={{ position: 'fixed', top: top, left: rect.left, width: rect.width, maxHeight: menuH, overflowY: 'auto', zIndex: 96, background: 'var(--bq-card)', borderRadius: 9, boxShadow: '0 12px 30px rgba(38,35,30,0.22), 0 0 0 1px var(--bq-border)', padding: 4 }}>
                {options.map((o) => (
                  <button key={o} onClick={() => { onChange(o); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 6, border: 'none', background: o === value ? 'var(--bq-subtle)' : 'transparent', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', color: 'var(--bq-ink)' }}>
                    <span style={{ flex: 1 }}>{o}</span>{o === value ? <BqIcon d={BQ_GLYPH.check} size={13} sw={2.4} style={{ color: 'var(--bq-brand)' }}></BqIcon> : null}
                  </button>
                ))}
              </div>
            </React.Fragment>
          ) : null}
        </div>
      </label>
    );
  }
  function PfCard({ title, sub, right, children, pad }) {
    return (
      <div className="bq-card-s" style={{ padding: pad || '18px 20px' }}>
        {(title || right) ? (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{title}</div>
              {sub ? <div style={{ fontSize: 12.5, color: 'var(--bq-faint)', marginTop: 2, lineHeight: 1.4 }}>{sub}</div> : null}
            </div>
            {right}
          </div>
        ) : null}
        {children}
      </div>
    );
  }
  function Row({ title, sub, children, top }) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderTop: top ? '1px solid var(--bq-border)' : 'none' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{title}</div>
          {sub ? <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', marginTop: 1 }}>{sub}</div> : null}
        </div>
        {children}
      </div>
    );
  }

  const TABS = [['profile', 'Profile', 'leads'], ['security', 'Account & Security', 'key'], ['notifications', 'Notifications', 'bell'], ['preferences', 'Preferences', 'select']];

  function ProfileTab({ flash }) {
    const [f, setF] = React.useState(() => { const p = window.__bqProfile.get(); return { first: p.first, last: p.last, display: p.display, title: p.title, company: p.company, email: p.email, phone: p.phone, tz: p.tz, bio: p.bio }; });
    const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));
    const [photo, setPhoto] = React.useState(() => { try { return localStorage.getItem(window.bqNsKey('bq-profile-photo')) || null; } catch (e) { return null; } });
    const fileRef = React.useRef(null);
    const onFile = (e) => {
      const file = e.target.files && e.target.files[0];
      e.target.value = '';
      if (!file) return;
      if (!/^image\//.test(file.type)) { flash('Please choose an image file'); return; }
      if (file.size > 6 * 1024 * 1024) { flash('Image too large - under 6 MB'); return; }
      const reader = new FileReader();
      reader.onload = () => { const url = reader.result; setPhoto(url); try { localStorage.setItem(window.bqNsKey('bq-profile-photo'), url); window.dispatchEvent(new Event('bq-photo-change')); } catch (err) {} flash('Photo updated'); };
      reader.readAsDataURL(file);
    };
    const removePhoto = () => { setPhoto(null); try { localStorage.removeItem(window.bqNsKey('bq-profile-photo')); window.dispatchEvent(new Event('bq-photo-change')); } catch (e) {} flash('Photo removed'); };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
        <PfCard title="Photo" sub="PNG or JPG, at least 200×200px. Shown across BuilderIQ and on documents you send.">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }}></input>
            <button onClick={() => fileRef.current && fileRef.current.click()} title="Change photo" className="bq-avatar" style={{ width: 72, height: 72, fontSize: 26, padding: 0, border: 'none', cursor: 'pointer', flex: 'none', background: photo ? 'transparent' : '#C8741A', color: '#fff', overflow: 'hidden', position: 'relative' }}>
              {photo ? <img src={photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }}></img> : window.__bqProfile.initials(window.__bqProfile.get())}
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="bq-btn sm" onClick={() => fileRef.current && fileRef.current.click()}><BqIcon d={BQ_GLYPH.camera} size={14}></BqIcon>Upload new</button>
              {photo ? <button className="bq-btn ghost sm" style={{ color: 'var(--bq-brand-strong)' }} onClick={removePhoto}>Remove</button> : null}
            </div>
          </div>
        </PfCard>

        <PfCard title="Personal details">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
            <PfField label="First name" value={f.first} onChange={set('first')}></PfField>
            <PfField label="Last name" value={f.last} onChange={set('last')}></PfField>
            <PfField label="Display name" value={f.display} onChange={set('display')}></PfField>
            <PfField label="Job title" value={f.title} onChange={set('title')}></PfField>
            <PfField label="Company" value={f.company} onChange={set('company')} hint="Shown on the client portal, proposals & the crew app"></PfField>
            <PfField label="Email" value={f.email} onChange={set('email')} hint="Used for sign-in and notifications"></PfField>
            <PfField label="Phone" value={f.phone} onChange={set('phone')}></PfField>
            <PfSelectField label="Timezone" value={f.tz} options={['Eastern Time (US & Canada)', 'Central Time (US & Canada)', 'Mountain Time (US & Canada)', 'Pacific Time (US & Canada)']} onChange={set('tz')}></PfSelectField>
          </div>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 13 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-muted)' }}>Bio</span>
            <textarea value={f.bio} onChange={(e) => set('bio')(e.target.value)} rows={3} style={{ ...fieldStyle, resize: 'vertical', lineHeight: 1.5 }}></textarea>
          </label>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 9, marginTop: 16 }}>
            <button className="bq-btn ghost sm" onClick={() => { const p = window.__bqProfile.get(); setF({ first: p.first, last: p.last, display: p.display, title: p.title, company: p.company, email: p.email, phone: p.phone, tz: p.tz, bio: p.bio }); }}>Cancel</button>
            <button className="bq-btn primary sm" onClick={() => { window.__bqProfile.set(f); flash('Profile saved · updated across BuilderIQ'); }}>Save changes</button>
          </div>
        </PfCard>
      </div>
    );
  }

  function SecurityTab({ flash }) {
    const [tfa, setTfa] = window.bqPersistState('sec-tfa', true);
    const [pw, setPw] = React.useState({ cur: '', next: '', conf: '' });
    const [pwChanged, setPwChanged] = window.bqPersistState('sec-pw-changed', null);
    const [sessions, setSessions] = window.bqPersistState('sec-sessions', [
      { id: 1, dev: 'MacBook Pro · Chrome', loc: 'Austin, TX', last: 'Active now', cur: true },
      { id: 2, dev: 'iPhone 15 · BuilderIQ app', loc: 'Austin, TX', last: '2 hours ago', cur: false },
      { id: 3, dev: 'iPad · Safari', loc: 'Round Rock, TX', last: 'Yesterday', cur: false },
    ]);
    const strong = pw.next.length >= 8;
    const match = pw.next && pw.next === pw.conf;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
        <PfCard title="Password" sub="Use at least 8 characters with a mix of letters and numbers.">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 13 }}>
            <PfField label="Current password" type="password" value={pw.cur} onChange={(v) => setPw((p) => ({ ...p, cur: v }))} placeholder="••••••••"></PfField>
            <PfField label="New password" type="password" value={pw.next} onChange={(v) => setPw((p) => ({ ...p, next: v }))} placeholder="••••••••"></PfField>
            <PfField label="Confirm new" type="password" value={pw.conf} onChange={(v) => setPw((p) => ({ ...p, conf: v }))} placeholder="••••••••"></PfField>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
            <span style={{ flex: 1, fontSize: 11.5, color: pw.next ? (strong ? 'var(--bq-good)' : 'var(--bq-brand-strong)') : 'var(--bq-faint)' }}>{pw.next ? (strong ? '✓ Strong enough' : 'Too short - 8+ characters') : (pwChanged ? 'Last changed ' + pwChanged : 'Last changed 3 months ago')}</span>
            <button className="bq-btn primary sm" disabled={!(pw.cur && strong && match)} style={{ opacity: pw.cur && strong && match ? 1 : 0.5 }} onClick={() => { setPw({ cur: '', next: '', conf: '' }); setPwChanged(new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })); flash('Password updated'); }}>Update password</button>
          </div>
        </PfCard>

        <PfCard title="Two-factor authentication" right={<span className={'bq-chip ' + (tfa ? 'good' : '')}>{tfa ? 'On' : 'Off'}</span>}>
          <Row title="Authenticator app" sub={tfa ? 'Codes via Authy · added Mar 2026' : 'Protect your account with a second step at sign-in'}>
            <PfSwitch on={tfa} size="lg" onClick={() => { setTfa((v) => !v); flash(tfa ? 'Two-factor disabled' : 'Two-factor enabled'); }}></PfSwitch>
          </Row>
          {tfa ? <Row top title="Recovery codes" sub="10 single-use backup codes"><button className="bq-btn sm" onClick={() => flash('Recovery codes regenerated')}>Regenerate</button></Row> : null}
        </PfCard>

        <PfCard title="Active sessions" sub="Devices currently signed in to your account." right={<button className="bq-btn sm" onClick={() => { setSessions((s) => s.filter((x) => x.cur)); flash('Signed out everywhere else'); }}>Sign out all others</button>}>
          {sessions.map((s, i) => (
            <Row key={s.id} top={i > 0} title={<span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{s.dev}{s.cur ? <span className="bq-chip good">This device</span> : null}</span>} sub={s.loc + ' · ' + s.last}>
              {s.cur ? <span style={{ fontSize: 12, color: 'var(--bq-faint)' }}>Current</span> : <button className="bq-btn ghost sm" style={{ color: 'var(--bq-brand-strong)' }} onClick={() => { setSessions((list) => list.filter((x) => x.id !== s.id)); flash('Session revoked'); }}>Revoke</button>}
            </Row>
          ))}
        </PfCard>

        <PfCard title="Danger zone">
          <Row title="Deactivate account" sub="Temporarily disable your access. An owner can reactivate it.">
            <button className="bq-btn sm" style={{ color: 'var(--bq-brand-strong)', boxShadow: 'inset 0 0 0 1px var(--bq-brand-border)' }} onClick={() => flash('Account deactivation requested')}>Deactivate</button>
          </Row>
        </PfCard>
      </div>
    );
  }

  function NotificationsTab({ flash }) {
    const CATS = ['Project updates', 'Mentions & comments', 'Approvals needed', 'Invoices & payments', 'Schedule changes', 'AI suggestions', 'Weekly digest'];
    const CH = ['Email', 'Push', 'SMS'];
    const [grid, setGrid] = window.bqPersistState('notif-grid', () => {
      const g = {}; CATS.forEach((c, i) => { g[c] = { Email: true, Push: i < 5, SMS: i === 2 || i === 3 }; }); return g;
    });
    const [quiet, setQuiet] = window.bqPersistState('notif-quiet', true);
    const toggle = (c, ch) => setGrid((p) => ({ ...p, [c]: { ...p[c], [ch]: !p[c][ch] } }));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
        <PfCard title="Notification channels" sub="Choose how you want to hear about each kind of activity." pad="18px 20px 8px">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 64px 64px 64px', alignItems: 'center', padding: '0 0 8px', borderBottom: '1px solid var(--bq-border)' }}>
            <span></span>
            {CH.map((ch) => <span key={ch} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', color: 'var(--bq-faint)' }}>{ch}</span>)}
          </div>
          {CATS.map((c) => (
            <div key={c} style={{ display: 'grid', gridTemplateColumns: '1fr 64px 64px 64px', alignItems: 'center', padding: '11px 0', borderBottom: '1px solid var(--bq-border)' }}>
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>{c}</span>
              {CH.map((ch) => (
                <span key={ch} style={{ display: 'flex', justifyContent: 'center' }}>
                  <button onClick={() => toggle(c, ch)} aria-label={c + ' ' + ch} style={{ width: 22, height: 22, borderRadius: 6, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: grid[c][ch] ? 'var(--bq-brand)' : 'var(--bq-card)', boxShadow: grid[c][ch] ? 'none' : 'inset 0 0 0 1.5px var(--bq-border-strong)' }}>{grid[c][ch] ? <BqIcon d={BQ_GLYPH.check} size={13} sw={2.8} style={{ color: '#fff' }}></BqIcon> : null}</button>
                </span>
              ))}
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '14px 0 10px' }}><button className="bq-btn primary sm" onClick={() => flash('Notification preferences saved')}>Save preferences</button></div>
        </PfCard>
        <PfCard title="Quiet hours">
          <Row title="Pause push & SMS overnight" sub="9:00 PM – 7:00 AM · Central Time"><PfSwitch on={quiet} size="lg" onClick={() => { setQuiet((v) => !v); flash(quiet ? 'Quiet hours off' : 'Quiet hours on'); }}></PfSwitch></Row>
        </PfCard>
      </div>
    );
  }

  function PreferencesTab({ flash }) {
    const dark = !!window.__bqDark;
    const [density, setDensity] = window.bqPersistState('pref-density', 'Comfortable');
    const [landing, setLanding] = window.bqPersistState('pref-landing', 'Dashboard');
    const [dateFmt, setDateFmt] = window.bqPersistState('pref-datefmt', 'MMM D, YYYY');
    const [timeFmt, setTimeFmt] = window.bqPersistState('pref-timefmt', '12-hour');
    const [weekStart, setWeekStart] = window.bqPersistState('pref-weekstart', 'Monday');
    const [lang, setLang] = window.bqPersistState('pref-lang', 'English (US)');
    const Seg = ({ value, options, onChange }) => (
      <div className="seg-toggle">{options.map((o) => <button key={o} className={value === o ? 'on' : ''} onClick={() => onChange(o)}>{o}</button>)}</div>
    );
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
        <PfCard title="Appearance">
          <Row title="Theme" sub="Switch between light and dark across the app">
            <div className="seg-toggle">
              <button className={!dark ? 'on' : ''} onClick={() => { if (dark) window.__bqToggleDark && window.__bqToggleDark(); }}>Light</button>
              <button className={dark ? 'on' : ''} onClick={() => { if (!dark) window.__bqToggleDark && window.__bqToggleDark(); }}>Dark</button>
            </div>
          </Row>
          <Row top title="Density" sub="Spacing and component sizing"><Seg value={density} options={['Comfortable', 'Compact']} onChange={setDensity}></Seg></Row>
        </PfCard>
        <PfCard title="Defaults">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <PfSelectField label="Start page" value={landing} options={['Dashboard', 'Schedule', 'Tasks', 'AI Inbox', 'Projects']} onChange={setLanding}></PfSelectField>
            <PfSelectField label="Language" value={lang} options={['English (US)', 'English (UK)', 'Español', 'Français']} onChange={setLang}></PfSelectField>
            <PfSelectField label="Date format" value={dateFmt} options={['MMM D, YYYY', 'MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']} onChange={setDateFmt}></PfSelectField>
            <PfSelectField label="Time format" value={timeFmt} options={['12-hour', '24-hour']} onChange={setTimeFmt}></PfSelectField>
            <PfSelectField label="Week starts on" value={weekStart} options={['Sunday', 'Monday']} onChange={setWeekStart}></PfSelectField>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}><button className="bq-btn primary sm" onClick={() => flash('Preferences saved')}>Save</button></div>
        </PfCard>
      </div>
    );
  }

  function HifiProfile({ initial }) {
    const [tab, setTab] = React.useState(initial || 'profile');
    const [toast, setToast] = React.useState(null);
    const prof = useBqProfile();
    const flash = (m) => { setToast(m); window.clearTimeout(flash._t); flash._t = window.setTimeout(() => setToast(null), 2400); };
    const label = (TABS.find((t) => t[0] === tab) || [])[1];
    const Body = { profile: ProfileTab, security: SecurityTab, notifications: NotificationsTab, preferences: PreferencesTab }[tab];
    return (
      <div className="bq-screen" style={{ position: 'relative' }}>
        <BqTop crumb={'Account / ' + label}></BqTop>
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <BqSide active="My Profile"></BqSide>
          <div style={{ width: 240, flex: 'none', borderRight: '1px solid var(--bq-border)', background: 'var(--bq-card)', padding: '18px 12px', overflow: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '4px 8px 16px' }}>
              <BqAvatar size={40} fontSize={14} style={{ background: '#C8741A', color: '#fff' }}></BqAvatar>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prof.display}</div>
                <div style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>{prof.role}</div>
              </div>
            </div>
            {TABS.map(([key, lbl, g]) => (
              <div key={key} onClick={() => setTab(key)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 11, fontSize: 13.5, fontWeight: key === tab ? 600 : 500, color: key === tab ? 'var(--bq-brand-strong)' : 'var(--bq-muted)', background: key === tab ? 'var(--bq-brand-soft)' : 'transparent', cursor: 'pointer' }}>
                <BqIcon d={BQ_GLYPH[g]} size={16}></BqIcon><span>{lbl}</span>
              </div>
            ))}
          </div>
          <main style={{ flex: 1, overflow: 'auto', padding: 'calc(20px * var(--bq-sp)) 24px' }}>
            <div style={{ maxWidth: 720, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'calc(16px * var(--bq-sp))' }}>
              <div className="bq-display" style={{ fontSize: 22 }}>{label}</div>
              <Body flash={flash}></Body>
            </div>
          </main>
        </div>
        {toast ? (
          <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 90, background: 'var(--bq-ink)', color: '#fff', borderRadius: 10, padding: '11px 16px', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 9, boxShadow: '0 8px 24px rgba(38,35,30,0.35)' }}>
            <BqIcon d={BQ_GLYPH.check} size={15} sw={2.4} style={{ color: 'var(--bq-good)' }}></BqIcon>{toast}
          </div>
        ) : null}
      </div>
    );
  }
  window.HifiProfile = HifiProfile;
})();
