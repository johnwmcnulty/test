// Hi-fi Team & Users - full user-management feature: invite, edit, roles, admins, custom roles, deactivate, delete
(function () {
  const { PfHead, PfCardHead } = window;

  const TEAM_BUILTIN_ROLES = ['Owner', 'Admin', 'Project manager', 'Estimator', 'Field user', 'Office / accounting', 'Subcontractor', 'Client'];
  const TEAM_PERMS = ['View financials', 'Edit financials', 'Send proposals & invoices', 'Create change orders', 'Manage schedule', 'Manage users', 'Billing & integrations', 'Export data'];
  const ROLE_DEFAULTS = {
    'Owner': 'all', 'Admin': 'all',
    'Project manager': ['View financials', 'Send proposals & invoices', 'Create change orders', 'Manage schedule', 'Export data'],
    'Estimator': ['View financials', 'Create change orders'],
    'Field user': ['Manage schedule'],
    'Office / accounting': ['View financials', 'Edit financials', 'Send proposals & invoices', 'Billing & integrations', 'Export data'],
    'Subcontractor': ['Manage schedule'],
    'Client': [],
  };
  function defaultPerms(role, admin) {
    if (admin || ROLE_DEFAULTS[role] === 'all') return TEAM_PERMS.slice();
    return (ROLE_DEFAULTS[role] || []).slice();
  }
  const AV_COLORS = ['#C8741A', '#1F6F5C', '#2A4B7C', '#7A4DB0', '#B23A48', '#3E7C42', '#B07A1E'];
  function avColor(s) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return AV_COLORS[h % AV_COLORS.length]; }
  function initials(n) { return n.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase(); }

  const TEAM_SEED = [
    { id: 'u1', name: 'Maria Hartwell', email: 'maria@hartwell.com', role: 'Owner', admin: true, status: 'Active', last: 'Active now', perms: TEAM_PERMS.slice() },
    { id: 'u2', name: 'Mike Reyes', email: 'mike@hartwell.com', role: 'Project manager', admin: true, status: 'Active', last: '8m ago', perms: defaultPerms('Project manager', true) },
    { id: 'u3', name: 'Dana Cho', email: 'dana@hartwell.com', role: 'Office / accounting', admin: false, status: 'Active', last: '1h ago', perms: defaultPerms('Office / accounting', false) },
    { id: 'u4', name: 'Jordan Ellis', email: 'jordan@hartwell.com', role: 'Estimator', admin: false, status: 'Active', last: 'Yesterday', perms: defaultPerms('Estimator', false) },
    { id: 'u5', name: 'Tasha Bell', email: 'tasha@hartwell.com', role: 'Project manager', admin: false, status: 'Active', last: '3h ago', perms: defaultPerms('Project manager', false) },
    { id: 'u6', name: 'Marco Diaz', email: 'marco@hartwell.com', role: 'Field user', admin: false, status: 'Active', last: '2h ago', perms: defaultPerms('Field user', false) },
    { id: 'u7', name: 'Vargas Framing', email: 'ops@vargasframing.com', role: 'Subcontractor', admin: false, status: 'Active', last: '2d ago', perms: defaultPerms('Subcontractor', false) },
    { id: 'u9', name: 'Sam Park', email: 'sam@brightelectric.com', role: 'Subcontractor', admin: false, status: 'Invited', last: 'Invited 5d ago', perms: defaultPerms('Subcontractor', false) },
  ];
  // clean build: start with just the owner
  const TEAM_CLEAN = [
    { id: 'u1', name: 'Owner', email: '', role: 'Owner', admin: true, status: 'Active', last: 'Active now', perms: TEAM_PERMS.slice() },
  ];

  const STATUS_CHIP = { Active: 'good', Invited: 'ai', Deactivated: '' };

  // ── reusable fixed-position dropdown ──
  function TmSelect({ value, options, onChange, width }) {
    const [open, setOpen] = React.useState(false);
    const [rect, setRect] = React.useState(null);
    const ref = React.useRef(null);
    const toggle = () => { if (!open && ref.current) setRect(ref.current.getBoundingClientRect()); setOpen((o) => !o); };
    React.useEffect(() => { if (!open) return; const c = () => setOpen(false); window.addEventListener('resize', c); return () => window.removeEventListener('resize', c); }, [open]);
    const menuH = Math.min(300, options.length * 38 + 8);
    let top = 0;
    if (rect) { const below = window.innerHeight - rect.bottom; top = (below < menuH + 16 && rect.top > menuH) ? rect.top - menuH - 4 : rect.bottom + 4; }
    return (
      <div style={{ position: 'relative', width: width || '100%' }}>
        <button ref={ref} onClick={toggle} style={{ fontFamily: 'inherit', fontSize: 13, color: 'var(--bq-ink)', background: 'var(--bq-card)', border: '1px solid var(--bq-border-strong)', borderRadius: 8, padding: '7px 10px', width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, cursor: 'pointer', boxShadow: open ? '0 0 0 2px var(--bq-brand-soft)' : 'none' }}>
          <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
          <BqIcon d="M6 9 L12 15 L18 9" size={14} sw={2} style={{ color: 'var(--bq-faint)', flex: 'none', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .12s' }}></BqIcon>
        </button>
        {open && rect ? (
          <React.Fragment>
            <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 95 }}></div>
            <div style={{ position: 'fixed', top: top, left: rect.left, width: rect.width, maxHeight: menuH, overflowY: 'auto', zIndex: 96, background: 'var(--bq-card)', borderRadius: 9, boxShadow: '0 12px 30px rgba(38,35,30,0.22), 0 0 0 1px var(--bq-border)', padding: 4 }}>
              {options.map((o) => (
                <button key={o} onClick={() => { onChange(o); setOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 6, border: 'none', background: o === value ? 'var(--bq-subtle)' : 'transparent', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', color: 'var(--bq-ink)' }}>
                  <span style={{ flex: 1, minWidth: 0 }}>{o}</span>
                  {o === value ? <BqIcon d={BQ_GLYPH.check} size={13} sw={2.4} style={{ color: 'var(--bq-brand)', flex: 'none' }}></BqIcon> : null}
                </button>
              ))}
            </div>
          </React.Fragment>
        ) : null}
      </div>
    );
  }

  // ── row kebab action menu ──
  function TmMenu({ items }) {
    const [open, setOpen] = React.useState(false);
    const [rect, setRect] = React.useState(null);
    const ref = React.useRef(null);
    const toggle = () => { if (!open && ref.current) setRect(ref.current.getBoundingClientRect()); setOpen((o) => !o); };
    const menuH = items.length * 38 + 8;
    let top = 0, left = 0;
    if (rect) { const below = window.innerHeight - rect.bottom; top = (below < menuH + 12 && rect.top > menuH) ? rect.top - menuH - 4 : rect.bottom + 4; left = rect.right - 190; }
    return (
      <React.Fragment>
        <button ref={ref} onClick={toggle} aria-label="Actions" style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: open ? 'var(--bq-subtle)' : 'transparent', color: 'var(--bq-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
          <BqIcon d="M12 6 v.01 M12 12 v.01 M12 18 v.01" size={18} sw={2.6}></BqIcon>
        </button>
        {open && rect ? (
          <React.Fragment>
            <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 95 }}></div>
            <div style={{ position: 'fixed', top: top, left: left, width: 190, zIndex: 96, background: 'var(--bq-card)', borderRadius: 9, boxShadow: '0 12px 30px rgba(38,35,30,0.22), 0 0 0 1px var(--bq-border)', padding: 4 }}>
              {items.map((it, i) => it.sep ? <div key={i} style={{ height: 1, background: 'var(--bq-border)', margin: '4px 0' }}></div> : (
                <button key={i} onClick={() => { setOpen(false); it.onClick(); }} style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', color: it.danger ? 'var(--bq-brand-strong)' : 'var(--bq-ink)' }}>
                  {it.icon ? <BqIcon d={it.icon} size={14} style={{ flex: 'none' }}></BqIcon> : null}{it.label}
                </button>
              ))}
            </div>
          </React.Fragment>
        ) : null}
      </React.Fragment>
    );
  }

  // ── invite / edit modal ──
  function TeamModal({ user, roles, onSave, onClose }) {
    const editing = !!user.id;
    const [f, setF] = React.useState({ name: user.name || '', email: user.email || '', role: user.role || 'Field user', admin: user.admin || false, perms: user.perms ? user.perms.slice() : defaultPerms(user.role || 'Field user', false), status: user.status || 'Invited' });
    const set = (patch) => setF((p) => ({ ...p, ...patch }));
    const setRole = (role) => set({ role, perms: defaultPerms(role, f.admin) });
    const setAdmin = (admin) => set({ admin, perms: admin ? TEAM_PERMS.slice() : defaultPerms(f.role, false) });
    const togglePerm = (p) => { if (f.admin) return; set({ perms: f.perms.includes(p) ? f.perms.filter((x) => x !== p) : f.perms.concat(p) }); };
    const valid = f.name.trim() && /.+@.+\..+/.test(f.email);
    const field = { fontFamily: 'inherit', fontSize: 13, color: 'var(--bq-ink)', background: 'var(--bq-card)', border: '1px solid var(--bq-border-strong)', borderRadius: 8, padding: '8px 11px', outline: 'none', width: '100%', boxSizing: 'border-box' };
    return (
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(38,35,30,0.4)', zIndex: 60, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '7vh' }}>
        <div onClick={(e) => e.stopPropagation()} className="bq-card-s" style={{ width: 'min(540px, 94%)', maxHeight: '86vh', overflow: 'auto', boxShadow: '0 24px 60px rgba(38,35,30,0.28), 0 0 0 1px var(--bq-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '16px 18px', borderBottom: '1px solid var(--bq-border)', position: 'sticky', top: 0, background: 'var(--bq-card)', zIndex: 2 }}>
            <span className="bq-avatar" style={{ width: 38, height: 38, fontSize: 13, background: avColor(f.name || 'New'), color: '#fff', flex: 'none' }}>{initials(f.name || 'New')}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{editing ? 'Edit teammate' : 'Invite teammate'}</div>
              <div style={{ fontSize: 12.5, color: 'var(--bq-faint)' }}>{editing ? 'Update role, access and status' : 'They’ll get an email invitation to join Hartwell Builders'}</div>
            </div>
            <button onClick={onClose} aria-label="Close" style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: 'var(--bq-subtle)', color: 'var(--bq-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={15} sw={2}></BqIcon></button>
          </div>

          <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 13 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-muted)' }}>Full name</span>
                <input value={f.name} onChange={(e) => set({ name: e.target.value })} placeholder="Jane Smith" style={field}></input>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-muted)' }}>Email</span>
                <input value={f.email} onChange={(e) => set({ email: e.target.value })} placeholder="jane@company.com" style={field}></input>
              </label>
            </div>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-muted)' }}>Role</span>
              <TmSelect value={f.role} options={roles.filter((r) => r !== 'Owner' || user.role === 'Owner')} onChange={setRole}></TmSelect>
            </label>

            {/* admin toggle */}
            <button onClick={() => setAdmin(!f.admin)} disabled={user.role === 'Owner'} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', borderRadius: 10, background: f.admin ? 'var(--bq-brand-soft)' : 'var(--bq-subtle)', border: 'none', cursor: user.role === 'Owner' ? 'default' : 'pointer', textAlign: 'left', opacity: user.role === 'Owner' ? 0.7 : 1 }}>
              <span style={{ width: 38, height: 38, borderRadius: 10, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: f.admin ? 'var(--bq-brand)' : 'var(--bq-border-strong)', color: '#fff' }}><BqIcon d="M12 3 L20 7 V12 c0 5-3.5 8-8 9 c-4.5-1-8-4-8-9 V7 Z" size={18}></BqIcon></span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>Full admin access</div>
                <div style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>{user.role === 'Owner' ? 'Owner always has full access' : 'Can manage users, billing, and all company data'}</div>
              </div>
              <span style={{ width: 44, height: 26, borderRadius: 999, flex: 'none', background: f.admin ? 'var(--bq-brand)' : 'var(--bq-border-strong)', position: 'relative', transition: 'background .15s' }}>
                <span style={{ position: 'absolute', top: 3, left: f.admin ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left .15s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}></span>
              </span>
            </button>

            {/* permissions */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 8 }}>Permissions {f.admin ? '· all enabled' : '· custom'}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 14px' }}>
                {TEAM_PERMS.map((p) => {
                  const on = f.admin || f.perms.includes(p);
                  return (
                    <label key={p} onClick={() => togglePerm(p)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: f.admin ? 'default' : 'pointer', opacity: f.admin ? 0.65 : 1 }}>
                      <span style={{ width: 18, height: 18, borderRadius: 5, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'var(--bq-brand)' : 'var(--bq-card)', boxShadow: on ? 'none' : 'inset 0 0 0 1.5px var(--bq-border-strong)' }}>{on ? <BqIcon d={BQ_GLYPH.check} size={11} sw={2.8} style={{ color: '#fff' }}></BqIcon> : null}</span>
                      <span style={{ fontSize: 12.5, color: 'var(--bq-ink)' }}>{p}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {editing && user.role !== 'Owner' ? (
              <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-muted)' }}>Status</span>
                <TmSelect value={f.status === 'Invited' ? 'Invited' : f.status} options={f.status === 'Invited' ? ['Invited', 'Active'] : ['Active', 'Deactivated']} onChange={(s) => set({ status: s })}></TmSelect>
              </label>
            ) : null}
          </div>

          <div style={{ padding: '13px 18px', borderTop: '1px solid var(--bq-border)', display: 'flex', alignItems: 'center', gap: 9, position: 'sticky', bottom: 0, background: 'var(--bq-card)' }}>
            <span style={{ flex: 1, fontSize: 11.5, color: 'var(--bq-faint)' }}>{f.admin ? 'Admin' : f.perms.length + ' of ' + TEAM_PERMS.length + ' permissions'}</span>
            <button className="bq-btn ghost sm" onClick={onClose}>Cancel</button>
            <button className="bq-btn primary sm" disabled={!valid} style={{ opacity: valid ? 1 : 0.5, cursor: valid ? 'pointer' : 'default' }} onClick={() => valid && onSave({ ...user, name: f.name.trim(), email: f.email.trim(), role: f.role, admin: f.admin, perms: f.perms, status: editing ? f.status : 'Invited' })}>
              {editing ? 'Save changes' : <React.Fragment><BqIcon d="M4 12 L9 17 L20 6" size={14} sw={2.2}></BqIcon>Send invite</React.Fragment>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── custom role modal ──
  function RoleModal({ onSave, onClose }) {
    const [name, setName] = React.useState('');
    const [perms, setPerms] = React.useState([]);
    const toggle = (p) => setPerms((s) => s.includes(p) ? s.filter((x) => x !== p) : s.concat(p));
    const valid = name.trim().length > 1;
    return (
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(38,35,30,0.4)', zIndex: 60, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '10vh' }}>
        <div onClick={(e) => e.stopPropagation()} className="bq-card-s" style={{ width: 'min(460px, 94%)', overflow: 'hidden', boxShadow: '0 24px 60px rgba(38,35,30,0.28), 0 0 0 1px var(--bq-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '15px 18px', borderBottom: '1px solid var(--bq-border)' }}>
            <span style={{ width: 34, height: 34, borderRadius: 9, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-ai-soft)', color: 'var(--bq-ai-strong)' }}><BqIcon d={BQ_GLYPH.key} size={16}></BqIcon></span>
            <div style={{ flex: 1, fontSize: 16, fontWeight: 700 }}>New custom role</div>
            <button onClick={onClose} aria-label="Close" style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: 'var(--bq-subtle)', color: 'var(--bq-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={15} sw={2}></BqIcon></button>
          </div>
          <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 13 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-muted)' }}>Role name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Warranty coordinator" style={{ fontFamily: 'inherit', fontSize: 13, color: 'var(--bq-ink)', background: 'var(--bq-card)', border: '1px solid var(--bq-border-strong)', borderRadius: 8, padding: '8px 11px', outline: 'none', width: '100%', boxSizing: 'border-box' }}></input>
            </label>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 8 }}>Default permissions</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 14px' }}>
                {TEAM_PERMS.map((p) => {
                  const on = perms.includes(p);
                  return (
                    <label key={p} onClick={() => toggle(p)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <span style={{ width: 18, height: 18, borderRadius: 5, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? 'var(--bq-brand)' : 'var(--bq-card)', boxShadow: on ? 'none' : 'inset 0 0 0 1.5px var(--bq-border-strong)' }}>{on ? <BqIcon d={BQ_GLYPH.check} size={11} sw={2.8} style={{ color: '#fff' }}></BqIcon> : null}</span>
                      <span style={{ fontSize: 12.5, color: 'var(--bq-ink)' }}>{p}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
          <div style={{ padding: '13px 18px', borderTop: '1px solid var(--bq-border)', display: 'flex', justifyContent: 'flex-end', gap: 9 }}>
            <button className="bq-btn ghost sm" onClick={onClose}>Cancel</button>
            <button className="bq-btn primary sm" disabled={!valid} style={{ opacity: valid ? 1 : 0.5 }} onClick={() => valid && onSave({ name: name.trim(), perms })}>Create role</button>
          </div>
        </div>
      </div>
    );
  }

  // ── confirm dialog ──
  function ConfirmDialog({ title, body, confirmLabel, onConfirm, onClose }) {
    return (
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(38,35,30,0.4)', zIndex: 65, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '16vh' }}>
        <div onClick={(e) => e.stopPropagation()} className="bq-card-s" style={{ width: 'min(380px, 92%)', padding: '20px 20px 16px', boxShadow: '0 24px 60px rgba(38,35,30,0.28), 0 0 0 1px var(--bq-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 10 }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)' }}><BqIcon d="M12 4 L21 19 H3 Z M12 10 V14 M12 16.5 V16.6" size={18}></BqIcon></span>
            <div style={{ fontSize: 15.5, fontWeight: 700 }}>{title}</div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5, marginBottom: 16 }}>{body}</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 9 }}>
            <button className="bq-btn ghost sm" onClick={onClose}>Cancel</button>
            <button className="bq-btn sm" style={{ background: 'var(--bq-brand-strong)', color: '#fff', boxShadow: 'none' }} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</button>
          </div>
        </div>
      </div>
    );
  }

  // ════════ MAIN PANEL ════════
  function TeamPanel() {
    const [users, setUsers] = React.useState(() => { const p = (window.__bqProfile ? window.__bqProfile.get() : null); return (window.bqClean() ? TEAM_CLEAN : TEAM_SEED).map((u) => u.id === 'u1' && p ? { ...u, name: p.display, email: p.email } : u); });
    React.useEffect(() => {
      const h = () => { const p = window.__bqProfile.get(); setUsers((list) => list.map((u) => u.id === 'u1' ? { ...u, name: p.display, email: p.email } : u)); };
      window.addEventListener('bq-profile-change', h);
      return () => window.removeEventListener('bq-profile-change', h);
    }, []);
    const [customRoles, setCustomRoles] = React.useState(window.bqClean() ? [] : [{ name: 'Warranty coordinator', perms: ['Manage schedule', 'Create change orders'] }]);
    const [q, setQ] = React.useState('');
    const [filter, setFilter] = React.useState('All');
    const [modalUser, setModalUser] = React.useState(null); // {} for new, user for edit
    const [roleModal, setRoleModal] = React.useState(false);
    const [confirm, setConfirm] = React.useState(null);
    const [toast, setToast] = React.useState(null);

    const roles = TEAM_BUILTIN_ROLES.concat(customRoles.map((r) => r.name));
    const flash = (msg) => { setToast(msg); window.clearTimeout(flash._t); flash._t = window.setTimeout(() => setToast(null), 2600); };

    const upsert = (u) => {
      setUsers((list) => {
        if (u.id) return list.map((x) => x.id === u.id ? u : x);
        return list.concat({ ...u, id: 'u' + Date.now(), last: 'Invited just now' });
      });
      flash(u.id ? 'Saved changes for ' + u.name : 'Invite sent to ' + u.email);
    };
    const patch = (id, p) => setUsers((list) => list.map((x) => x.id === id ? { ...x, ...p } : x));
    const remove = (id) => { const u = users.find((x) => x.id === id); setUsers((list) => list.filter((x) => x.id !== id)); flash('Removed ' + (u ? u.name : 'user') + ' from the team'); };

    const filtered = users.filter((u) => {
      if (filter === 'Admins' && !u.admin) return false;
      if (filter === 'Invited' && u.status !== 'Invited') return false;
      if (filter === 'Deactivated' && u.status !== 'Deactivated') return false;
      if (filter === 'Subs & clients' && !['Subcontractor', 'Client'].includes(u.role)) return false;
      if (q && !(u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
    const adminCount = users.filter((u) => u.admin).length;
    const pending = users.filter((u) => u.status === 'Invited').length;
    const active = users.filter((u) => u.status === 'Active').length;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
        <PfHead title="Team & users" sub="Invite teammates and subs, assign roles, grant admin access, and control exactly what each person can see and do.">
          <button className="bq-btn primary sm" onClick={() => setModalUser({})}><BqIcon d="M16 14 a4 4 0 1 0 -8 0 M12 10 a3 3 0 1 0 0-6 a3 3 0 0 0 0 6 M19 8 v6 M22 11 h-6" size={15} sw={2}></BqIcon>Invite user</button>
        </PfHead>

        <div style={{ display: 'flex', gap: 'calc(12px * var(--bq-sp))', flexWrap: 'wrap' }}>
          <BqKPI label="Team members" value={String(users.length)} sub={active + ' active'}></BqKPI>
          <BqKPI label="Admins" value={String(adminCount)} sub="full access" tone="ai"></BqKPI>
          <BqKPI label="Pending invites" value={String(pending)} sub="awaiting accept" tone={pending ? 'warn' : undefined}></BqKPI>
          <BqKPI label="Seats" value={users.length + ' / 15'} sub="Pro plan"></BqKPI>
        </div>

        {/* toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 240px', background: 'var(--bq-card)', border: '1px solid var(--bq-border-strong)', borderRadius: 9, padding: '7px 11px', maxWidth: 320 }}>
            <BqIcon d={BQ_GLYPH.search} size={15} style={{ color: 'var(--bq-faint)' }}></BqIcon>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', font: 'inherit', fontSize: 13, color: 'var(--bq-ink)' }}></input>
          </div>
          <div className="seg-toggle">
            {['All', 'Admins', 'Invited', 'Subs & clients', 'Deactivated'].map((fl) => <button key={fl} className={filter === fl ? 'on' : ''} onClick={() => setFilter(fl)}>{fl}</button>)}
          </div>
        </div>

        {/* user table */}
        <div className="bq-card-s" style={{ overflow: 'visible' }}>
          <div className="bq-trow head" style={{ gridTemplateColumns: '2fr 1.4fr auto auto auto', alignItems: 'center' }}>
            <span>Member</span><span>Role</span><span style={{ textAlign: 'center' }}>Admin</span><span>Status</span><span></span>
          </div>
          {filtered.map((u, i) => {
            const isOwner = u.role === 'Owner';
            const deact = u.status === 'Deactivated';
            const menu = [
              { label: 'Edit details', icon: 'M4 20 h4 L18 9 a2 2 0 0 0-3-3 L5 16 Z', onClick: () => setModalUser(u) },
            ];
            if (!isOwner) {
              menu.push({ label: u.admin ? 'Remove admin' : 'Make admin', icon: 'M12 3 L20 7 V12 c0 5-3.5 8-8 9 c-4.5-1-8-4-8-9 V7 Z', onClick: () => { patch(u.id, { admin: !u.admin, perms: !u.admin ? TEAM_PERMS.slice() : defaultPerms(u.role, false) }); flash((u.admin ? 'Removed admin from ' : 'Made admin: ') + u.name); } });
              if (u.status === 'Invited') menu.push({ label: 'Resend invite', icon: 'M4 4 h16 v16 H4 Z M4 7 L12 13 L20 7', onClick: () => flash('Invite re-sent to ' + u.email) });
              menu.push({ sep: true });
              menu.push({ label: deact ? 'Reactivate' : 'Deactivate', icon: deact ? 'M5 12 L10 17 L20 5' : 'M6 6 L18 18 M18 6 L6 18', onClick: () => { patch(u.id, { status: deact ? 'Active' : 'Deactivated' }); flash((deact ? 'Reactivated ' : 'Deactivated ') + u.name); } });
              menu.push({ label: 'Remove from team', icon: 'M4 7 H20 M9 7 V5 H15 V7 M6 7 L7 20 H17 L18 7', danger: true, onClick: () => setConfirm({ id: u.id, name: u.name }) });
            }
            return (
              <div key={u.id} className="bq-trow" style={{ gridTemplateColumns: '2fr 1.4fr auto auto auto', alignItems: 'center', opacity: deact ? 0.55 : 1 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 11, minWidth: 0 }}>
                  <span className="bq-avatar" style={{ width: 34, height: 34, fontSize: 12, flex: 'none', background: avColor(u.name), color: '#fff' }}>{initials(u.name)}</span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <span style={{ fontWeight: 600, fontSize: 13.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</span>
                      {isOwner ? <span className="bq-chip" style={{ flex: 'none' }}>You · Owner</span> : null}
                    </span>
                    <span style={{ display: 'block', fontSize: 11.5, color: 'var(--bq-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email} · {u.last}</span>
                  </span>
                </span>
                <span style={{ paddingRight: 10 }}>
                  {isOwner ? <span style={{ fontSize: 13, color: 'var(--bq-muted)', fontWeight: 600 }}>Owner</span>
                    : <TmSelect value={u.role} options={roles.filter((r) => r !== 'Owner')} onChange={(r) => { patch(u.id, { role: r, perms: defaultPerms(r, u.admin) }); }}></TmSelect>}
                </span>
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  <button onClick={() => { if (isOwner) return; patch(u.id, { admin: !u.admin, perms: !u.admin ? TEAM_PERMS.slice() : defaultPerms(u.role, false) }); }} title={u.admin ? 'Admin' : 'Grant admin'} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', cursor: isOwner ? 'default' : 'pointer', background: u.admin ? 'var(--bq-brand-soft)' : 'transparent', color: u.admin ? 'var(--bq-brand-strong)' : 'var(--bq-faint)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BqIcon d="M12 3 L20 7 V12 c0 5-3.5 8-8 9 c-4.5-1-8-4-8-9 V7 Z" size={16} style={{ fill: u.admin ? 'currentColor' : 'none' }}></BqIcon>
                  </button>
                </span>
                <span><span className={'bq-chip ' + STATUS_CHIP[u.status]}>{u.status}</span></span>
                <span style={{ display: 'flex', justifyContent: 'flex-end' }}><TmMenu items={menu}></TmMenu></span>
              </div>
            );
          })}
          {filtered.length === 0 ? <div style={{ padding: '26px', textAlign: 'center', fontSize: 13, color: 'var(--bq-faint)' }}>No members match.</div> : null}
        </div>

        {/* custom roles */}
        <div className="bq-card-s" style={{ padding: '14px 16px' }}>
          <PfCardHead right={<button className="bq-btn soft-ai sm" onClick={() => setRoleModal(true)}><BqIcon d="M12 5 V19 M5 12 H19" size={13}></BqIcon>New custom role</button>}>Roles</PfCardHead>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TEAM_BUILTIN_ROLES.map((r) => <span key={r} className="bq-chip">{r}</span>)}
            {customRoles.map((r) => (
              <span key={r.name} className="bq-chip ai" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <BqIcon d={BQ_GLYPH.key} size={11}></BqIcon>{r.name} · {r.perms.length} perms
                <button onClick={() => { setCustomRoles((cr) => cr.filter((x) => x.name !== r.name)); setUsers((list) => list.map((u) => u.role === r.name ? { ...u, role: 'Field user', perms: defaultPerms('Field user', u.admin) } : u)); flash('Deleted role ' + r.name); }} aria-label="Delete role" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'inherit', display: 'flex', padding: 0, marginLeft: 2 }}><BqIcon d="M5 5 L13 13 M13 5 L5 13" size={11} sw={2}></BqIcon></button>
              </span>
            ))}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', marginTop: 10 }}>Need a finer matrix? See <b style={{ color: 'var(--bq-ai-strong)', cursor: 'pointer' }} onClick={() => window.__bqNav && window.__bqNav('Permissions')}>Roles &amp; permissions →</b></div>
        </div>

        {toast ? (
          <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 90, background: 'var(--bq-ink)', color: '#fff', borderRadius: 10, padding: '11px 16px', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 9, boxShadow: '0 8px 24px rgba(38,35,30,0.35)' }}>
            <BqIcon d={BQ_GLYPH.check} size={15} sw={2.4} style={{ color: 'var(--bq-good)' }}></BqIcon>{toast}
          </div>
        ) : null}

        {modalUser ? <TeamModal user={modalUser} roles={roles} onSave={(u) => { upsert(u); setModalUser(null); }} onClose={() => setModalUser(null)}></TeamModal> : null}
        {roleModal ? <RoleModal onSave={(r) => { setCustomRoles((cr) => cr.concat(r)); setRoleModal(false); flash('Created role ' + r.name); }} onClose={() => setRoleModal(false)}></RoleModal> : null}
        {confirm ? <ConfirmDialog title={'Remove ' + confirm.name + '?'} body="They’ll immediately lose access to Hartwell Builders. Their activity history is kept. This can’t be undone." confirmLabel="Remove user" onConfirm={() => remove(confirm.id)} onClose={() => setConfirm(null)}></ConfirmDialog> : null}
      </div>
    );
  }

  window.BQ_PANELS = window.BQ_PANELS || {};
  window.BQ_PANELS.team = TeamPanel;
})();
