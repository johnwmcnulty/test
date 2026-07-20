// Hi-fi Clients / Contacts - master-detail with AI inbox digest + draft reply
const BQ_CLIENTS = [
  { id: 'hen', name: 'Dan & Priya Henderson', initials: 'DH', project: 'Kitchen + Hall Bath', stage: 'In progress', stageTone: 'brand', contract: 186400, paid: 93200, unread: 3, last: '2h ago', phone: '(512) 555-0148', email: 'priya.henderson@gmail.com', addr: '4418 Bridle Path, Austin TX' },
  { id: 'oso', name: 'Luis & Carmen Osorio', initials: 'LO', project: 'Whole-home remodel', stage: 'In progress', stageTone: 'brand', contract: 410500, paid: 287350, unread: 0, last: '1w ago', phone: '(512) 555-0133', email: 'carmen.osorio@gmail.com', addr: '305 Mesa Verde, Austin TX' },
  { id: 'del', name: 'Rafael Delgado', initials: 'RD', project: 'Garage ADU', stage: 'In progress', stageTone: 'brand', contract: 164900, paid: 41200, unread: 0, last: '5h ago', phone: '(512) 555-0188', email: 'rafael.delgado@gmail.com', addr: '1922 Larkspur Ln, Austin TX' },
  { id: 'alv', name: 'Marisol Alvarez', initials: 'MA', project: 'Basement finish', stage: 'In progress', stageTone: 'brand', contract: 92700, paid: 69900, unread: 0, last: '2d ago', phone: '(512) 555-0157', email: 'm.alvarez@gmail.com', addr: '610 Wexford Pl, Austin TX' },
  { id: 'whit', name: 'Joan Whitaker', initials: 'JW', project: "Kitchen + butler's pantry", stage: 'In progress', stageTone: 'brand', contract: 128400, paid: 46100, unread: 0, last: '1d ago', phone: '(512) 555-0164', email: 'joan.whitaker@me.com', addr: '77 Stillhouse Rd, Austin TX' },
  { id: 'tan', name: 'Grace Tanaka', initials: 'GT', project: 'Primary suite addition', stage: 'Proposal sent', stageTone: 'good', contract: 242000, paid: 0, unread: 0, last: '3d ago', phone: '(512) 555-0176', email: 'grace.tanaka@me.com', addr: '88 Crestview Dr, Austin TX' },
  { id: 'webb', name: 'Marcus Webb', initials: 'MW', project: 'Kitchen + powder room', stage: 'Estimating', stageTone: 'ai', contract: 0, paid: 0, unread: 0, last: 'Yesterday', phone: '(512) 555-0202', email: 'm.webb@outlook.com', addr: '1207 Oak Hollow, Austin TX' },
  { id: 'chen', name: 'Wei & Lucy Chen', initials: 'LC', project: 'Primary bath', stage: 'Starts Jul 6', stageTone: 'ai', contract: 64200, paid: 0, unread: 0, last: '4d ago', phone: '(512) 555-0191', email: 'lucy.chen@gmail.com', addr: '2240 Ridgeline Dr, Austin TX' },
  { id: 'pear', name: 'Glenn Pearson', initials: 'GP', project: 'Sunroom addition', stage: 'Closeout', stageTone: 'muted', contract: 73200, paid: 73200, unread: 0, last: '1w ago', phone: '(512) 555-0125', email: 'glenn.pearson@gmail.com', addr: '419 Maple Run, Austin TX' },
  { id: 'bryn', name: 'Allison Bryn', initials: 'AB', project: 'Deck + outdoor kitchen', stage: 'Closeout', stageTone: 'muted', contract: 78900, paid: 78900, unread: 0, last: '2w ago', phone: '(512) 555-0119', email: 'allison.bryn@gmail.com', addr: '742 Pecan Grove, Austin TX' },
  { id: 'obr', name: "Pat O'Brien", initials: 'PO', project: 'Deck + porch', stage: 'Closeout', stageTone: 'muted', contract: 48900, paid: 48900, unread: 0, last: '3w ago', phone: '(512) 555-0110', email: 'pat.obrien@gmail.com', addr: '5 Tanglewood Ct, Austin TX' },
];

const BQ_THREAD = [
  { from: 'client', t: '9:12 AM', body: 'Hey Maria - the cabinet boxes look great going in! Quick thing: Priya saw a matte black faucet she loves, is it too late to switch from the brushed nickel we picked?' },
  { from: 'client', t: '9:14 AM', body: 'Also - are we still on track for the countertop template next week? Trying to plan around being home.' },
  { from: 'client', t: '9:15 AM', body: 'And one more, sorry! Will the old fridge be hauled away or do we need to deal with that?' },
];

function ClientRow({ c, sub, active, onClick }) {
  return (
    <button onClick={onClick}
      style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 11, padding: '11px 14px', border: 'none', borderRadius: 14, background: active ? 'var(--bq-brand-soft)' : 'transparent', cursor: 'pointer', font: 'inherit' }}>
      <span style={{ width: 36, height: 36, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, background: active ? '#fff' : 'var(--bq-subtle)', color: active ? 'var(--bq-brand-strong)' : 'var(--bq-muted)', boxShadow: 'inset 0 0 0 1px var(--bq-border)' }}>{c.initials}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: 'block', fontWeight: 600, fontSize: 13.5, color: 'var(--bq-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
        <span style={{ display: 'block', fontSize: 12, color: 'var(--bq-faint)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</span>
      </span>
      {c.unread ? <span style={{ flex: 'none', minWidth: 18, height: 18, padding: '0 5px', borderRadius: 999, background: 'var(--bq-ai)', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.unread}</span> : null}
    </button>
  );
}

// unify custom (projects[]) + sample (flat) clients into a { projects:[] } view
function bqClientProjects(c) {
  if (c.custom) return (c.projects || []).map((p) => window.bqProj.ensure(p));
  return [{ id: null, title: c.project, type: c.project, stage: c.stage, stageTone: c.stageTone, contract: c.contract, collected: c.paid }];
}
function bqClientSubtitle(c) {
  const ps = bqClientProjects(c);
  if (ps.length > 1) return ps.length + ' projects · ' + ps.filter((p) => p.stage === 'In progress' || p.stage === 'Starts soon').length + ' active';
  return (ps[0] && ps[0].title) || 'No project yet';
}

function HifiClients() {
  const fmt = (n) => '$' + Number(n || 0).toLocaleString('en-US');
  const custom = window.bqUseNewClients ? window.bqUseNewClients() : [];
  const all = custom.length ? custom : bqSample(BQ_CLIENTS); // sample only as fallback (blank in clean build)
  const [sel, setSel] = React.useState(all[0] ? all[0].id : null);
  const [reply, setReply] = React.useState('');
  const [q, setQ] = React.useState('');
  const [modal, setModal] = React.useState(null); // null | {mode:'new'} | {mode:'edit',client} | {mode:'add-project',client}
  const [confirmDel, setConfirmDel] = React.useState(false);
  React.useEffect(() => { setConfirmDel(false); }, [sel]);
  React.useEffect(() => { if (window.__bqOpenNewClient) { window.__bqOpenNewClient = false; setModal({ mode: 'new' }); } }, []);
  React.useEffect(() => { if (window.__bqOpenClient) { const id = window.__bqOpenClient; window.__bqOpenClient = null; if (all.some((x) => x.id === id)) { setSel(id); setReply(''); } } });
  const c = all.find((x) => x.id === sel) || all[0];
  const projects = c ? bqClientProjects(c) : [];
  const openProject = (pj) => {
    if (c.custom && pj.id) { window.__bqCustomProject = pj.id; window.__bqNav && window.__bqNav('Project Workspace'); }
    else if (pj.contract) window.__bqNav && window.__bqNav('Projects');
    else window.__bqNav && window.__bqNav('AI Estimate');
  };
  const shown = all.filter((x) => !q.trim() || (x.name + ' ' + bqClientProjects(x).map((p) => p.title).join(' ') + ' ' + (x.addr || '')).toLowerCase().includes(q.trim().toLowerCase()));
  const saveModal = (f) => {
    const num = Number(String(f.contract).replace(/[^0-9.]/g, '')) || 0;
    const projFields = { title: f.project, type: f.project, stage: f.stage, stageTone: CL_STAGE_TONES[f.stage] || 'ai', contract: num, start: f.start, notes: f.notes };
    if (modal.mode === 'new') {
      const created = window.bqNewClients.add({ name: f.name, initials: bqClInitials(f.name), email: f.email, phone: f.phone, addr: f.addr, source: f.source, projects: [] });
      const pj = window.bqNewClients.addProject(created.id, projFields);
      setSel(created.id);
    } else if (modal.mode === 'edit') {
      window.bqNewClients.update(modal.client.id, { name: f.name, initials: bqClInitials(f.name), email: f.email, phone: f.phone, addr: f.addr, source: f.source });
    } else if (modal.mode === 'add-project') {
      const pj = window.bqNewClients.addProject(modal.client.id, projFields);
      window.__bqCustomProject = pj.id; window.__bqNav && window.__bqNav('Project Workspace');
    }
    setModal(null);
  };
  const emptyState = !c;
  const DRAFT = "Hi Priya - love the matte black choice, it'll look sharp against the white shaker. It's not too late: the matte black faucet is a $40 upgrade and I'll add it as a quick selection change for you to approve. Countertop template is still set for next Tuesday AM - I'll confirm the window by Friday. And yes, we'll haul the old fridge at no charge. Talk soon - Maria";

  return (
    <div className="bq-screen">
      <BqTop crumb="Clients"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Clients" alerts={{}}></BqSide>

        {/* list column */}
        <div style={{ width: 290, flex: 'none', borderRight: '1px solid var(--bq-border)', background: 'var(--bq-card)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: 'calc(14px * var(--bq-sp)) 16px 10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span className="bq-display" style={{ fontSize: 19 }}>Clients</span>
              <span className="bq-chip">{all.length}</span>
              <button className="bq-btn sm" style={{ marginLeft: 'auto' }} onClick={() => setModal({ mode: 'new' })}><BqIcon d="M12 5 V19 M5 12 H19" size={14}></BqIcon>New</button>
            </div>
            <label className="bq-search" style={{ width: '100%', boxSizing: 'border-box', cursor: 'text' }}><BqIcon d={BQ_GLYPH.search} size={14}></BqIcon><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search clients…" style={{ border: 'none', outline: 'none', background: 'transparent', font: 'inherit', fontSize: 13, color: 'var(--bq-ink)', flex: 1, minWidth: 0, padding: 0 }}></input></label>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '2px 8px 10px' }}>
            {shown.map((x) => <ClientRow key={x.id} c={x} sub={bqClientSubtitle(x)} active={x.id === sel} onClick={() => { setSel(x.id); setReply(''); }}></ClientRow>)}
            {!shown.length ? <div style={{ padding: '18px 14px', fontSize: 12.5, color: 'var(--bq-faint)', textAlign: 'center' }}>No clients match “{q}”</div> : null}
          </div>
        </div>

        {/* detail column */}
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
          {emptyState ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
              <div style={{ textAlign: 'center', maxWidth: 360 }}>
                <div className="bq-display" style={{ fontSize: 20, marginBottom: 8 }}>No clients yet</div>
                <div style={{ fontSize: 13.5, color: 'var(--bq-muted)', lineHeight: 1.5, marginBottom: 16 }}>Add your first client to start a project and open their portal.</div>
                <button className="bq-btn primary" onClick={() => setModal({ mode: 'new' })}><BqIcon d="M12 5 V19 M5 12 H19" size={14}></BqIcon>New client</button>
              </div>
            </div>
          ) : (
          <React.Fragment>
          {/* header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ width: 52, height: 52, borderRadius: '50%', flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18, background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)', boxShadow: 'inset 0 0 0 1px var(--bq-brand-border)' }}>{c.initials}</span>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span className="bq-display" style={{ fontSize: 22 }}>{c.name}</span>
                {projects.length > 1 ? <span className="bq-chip">{projects.length} projects</span> : <span className={'bq-chip ' + (projects[0] ? projects[0].stageTone : '')}>{projects[0] ? projects[0].stage : 'No project'}</span>}
              </div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>{c.addr || 'No address on file'}</div>
            </div>
            <button className="bq-btn sm">Call</button>
            {c.custom ? <button className="bq-btn sm" onClick={() => setModal({ mode: 'edit', client: c })}>Edit</button> : null}
            <button className="bq-btn soft-ai sm" onClick={() => window.__bqNav && window.__bqNav('Weekly Update')}><BqSpark size={12}></BqSpark>Weekly update</button>
            {c.custom ? <button className="bq-btn primary sm" onClick={() => setModal({ mode: 'add-project', client: c })}><BqIcon d="M12 5 V19 M5 12 H19" size={13}></BqIcon>New project</button> : null}
          </div>

          {/* AI inbox digest */}
          {c.unread ? (
            <React.Fragment>
              <div className="ai-expanded bq-ai-card" style={{ padding: 'calc(14px * var(--bq-sp)) 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <BqSpark size={14}></BqSpark>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--bq-ai-strong)' }}>AI inbox · {c.unread} new messages</span>
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--bq-faint)' }}>{c.last}</span>
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--bq-ink)', lineHeight: 1.5, marginBottom: 10 }}>
                  Priya is asking to <b>switch the kitchen faucet to matte black</b> (a selection change), wants to <b>confirm next week's countertop template</b>, and is checking whether the <b>old fridge gets hauled away</b>. None are blockers - one needs a quick selection approval.
                </div>
                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
                  <span className="bq-chip ai"><BqIcon d={BQ_GLYPH.proposal} size={11}></BqIcon>Selection change · faucet</span>
                  <span className="bq-chip">Schedule · countertop template</span>
                  <span className="bq-chip">Question · disposal</span>
                </div>
              </div>

              {/* thread + draft reply */}
              <div style={{ display: 'flex', gap: 'calc(14px * var(--bq-sp))', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div className="bq-card-s" style={{ flex: '1 1 340px', padding: 'calc(14px * var(--bq-sp)) 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Latest messages</div>
                  {BQ_THREAD.map((m, i) => (
                    <div key={i} style={{ background: 'var(--bq-subtle)', borderRadius: 14, borderTopLeftRadius: 4, padding: '9px 13px', maxWidth: '92%' }}>
                      <div style={{ fontSize: 13, color: 'var(--bq-ink)', lineHeight: 1.5 }}>{m.body}</div>
                      <div style={{ fontSize: 11, color: 'var(--bq-faint)', marginTop: 3 }}>{m.t}</div>
                    </div>
                  ))}
                </div>

                <div className="bq-card-s" style={{ flex: '1 1 340px', padding: 'calc(14px * var(--bq-sp)) 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <BqSpark size={13}></BqSpark><span style={{ fontWeight: 700, fontSize: 14, color: 'var(--bq-ai-strong)' }}>Suggested reply</span>
                    <span className="bq-chip ai" style={{ marginLeft: 'auto' }}>Draft</span>
                  </div>
                  <div style={{ background: 'var(--bq-ai-soft)', borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)', padding: '11px 13px', fontSize: 13, color: 'var(--bq-ink)', lineHeight: 1.55 }}>
                    {reply || DRAFT}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <button className="bq-btn ai sm" onClick={() => setReply(DRAFT)}>Use draft</button>
                    <button className="bq-btn soft-ai sm">Make it shorter</button>
                    <span style={{ fontSize: 11.5, color: 'var(--bq-faint)', lineHeight: 1.35 }}>Review before sending - nothing sends automatically.</span>
                  </div>
                </div>
              </div>
            </React.Fragment>
          ) : (
            <div className="bq-card-s" style={{ padding: '20px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-good-soft)', color: 'var(--bq-good)', flex: 'none' }}><BqIcon d={BQ_GLYPH.check} size={18} sw={2.2}></BqIcon></span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>All caught up</div>
                <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>No unread messages from {c.name.split(' ')[0]}. Last contact {c.last}.</div>
              </div>
            </div>
          )}

          {/* collapsed AI stub for quiet mode */}
          {c.unread ? (
            <div className="ai-collapsed bq-card-s" style={{ padding: '12px 16px', alignItems: 'center', gap: 10 }}>
              <BqSpark size={13}></BqSpark>
              <span style={{ fontSize: 13, color: 'var(--bq-muted)' }}>{c.unread} new messages · AI summary available</span>
              <button className="bq-btn soft-ai sm" style={{ marginLeft: 'auto' }}>Show</button>
            </div>
          ) : null}

          {/* facts grid */}
          <div style={{ display: 'flex', gap: 'calc(14px * var(--bq-sp))', flexWrap: 'wrap' }}>
            <div className="bq-card-s" style={{ flex: '1 1 260px', padding: 'calc(14px * var(--bq-sp)) 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 10 }}>Contact</div>
              {[['Phone', c.phone], ['Email', c.email], ['Address', c.addr]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 13, padding: '5px 0', borderTop: k === 'Phone' ? 'none' : '1px solid var(--bq-border)' }}>
                  <span style={{ color: 'var(--bq-faint)' }}>{k}</span><span style={{ color: 'var(--bq-ink)', fontWeight: 500, textAlign: 'right' }}>{v || '-'}</span>
                </div>
              ))}
            </div>
            {!c.custom ? (
              <div className="bq-card-s" style={{ flex: '1 1 260px', padding: 'calc(14px * var(--bq-sp)) 16px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-faint)', marginBottom: 10 }}>Financials</div>
                {c.contract ? (
                  <React.Fragment>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Contract</span>
                      <span className="bq-num" style={{ fontSize: 20 }}>{fmt(c.contract)}</span>
                    </div>
                    <BqMeter pct={c.contract ? Math.round((c.paid / c.contract) * 100) : 0}></BqMeter>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: 'var(--bq-muted)', marginTop: 7 }}>
                      <span>Paid <b style={{ color: 'var(--bq-good)' }}>{fmt(c.paid)}</b></span>
                      <span>Outstanding <b style={{ color: 'var(--bq-ink)' }}>{fmt(c.contract - c.paid)}</b></span>
                    </div>
                  </React.Fragment>
                ) : (
                  <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5 }}>No signed contract yet. <span style={{ color: 'var(--bq-ai-strong)', fontWeight: 600, cursor: 'pointer' }} onClick={() => window.__bqNav && window.__bqNav('AI Estimate')}>Build an estimate →</span></div>
                )}
              </div>
            ) : null}
          </div>

          {/* projects card - custom clients (a client can have many projects) */}
          {c.custom ? (
            <div className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 0 4px' }}>
              <div className="bq-sechead" style={{ padding: '0 18px', marginBottom: 8 }}>
                <span className="t">Projects</span>
                <span className="bq-chip" style={{ marginLeft: 8 }}>{projects.length}</span>
                <button className="bq-btn sm" style={{ marginLeft: 'auto' }} onClick={() => setModal({ mode: 'add-project', client: c })}><BqIcon d="M12 5 V19 M5 12 H19" size={13}></BqIcon>New project</button>
              </div>
              {projects.length ? projects.map((pj) => {
                const tot = window.bqProj.total(pj); const pd = window.bqProj.paid(pj); const pc = window.bqProj.pct(pj);
                return (
                  <div key={pj.id} className="bq-trow" role="button" tabIndex={0} onClick={() => openProject(pj)} style={{ gridTemplateColumns: '2fr 1fr 1.4fr 0.5fr', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bq-subtle)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pj.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{tot ? fmt(tot) : (pj.budget ? '~' + fmt(pj.budget) + ' est. budget' : 'No contract yet')}</div>
                    </div>
                    <span className={'bq-chip ' + (pj.stageTone || 'ai')} style={{ justifySelf: 'start' }}>{pj.stage}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <BqMeter pct={tot ? Math.round(pd / tot * 100) : 0} style={{ flex: 1 }}></BqMeter>
                      <span className="cell-num" style={{ fontSize: 12, color: 'var(--bq-faint)', width: 54, flex: 'none' }}>{fmt(pd)}</span>
                    </div>
                    <BqIcon d="M9 6 L15 12 L9 18" size={15} style={{ color: 'var(--bq-faint)', flex: 'none', justifySelf: 'end' }}></BqIcon>
                  </div>
                );
              }) : <div style={{ padding: '14px 18px', fontSize: 13, color: 'var(--bq-faint)' }}>No projects yet - add the first one.</div>}
            </div>
          ) : null}

          {/* details - user-created clients */}
          {c.custom ? (
            <div className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-faint)' }}>Client details</span>
                {confirmDel ? (
                  <span style={{ marginLeft: 'auto', display: 'flex', gap: 7, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--bq-muted)' }}>Remove client &amp; all projects?</span>
                    <button className="bq-btn sm" onClick={() => setConfirmDel(false)}>Keep</button>
                    <button className="bq-btn primary sm" onClick={() => { const rest = custom.filter((x) => x.id !== c.id); window.bqNewClients.remove(c.id); setConfirmDel(false); setSel(rest[0] ? rest[0].id : null); }}>Delete</button>
                  </span>
                ) : <button className="bq-btn ghost sm" style={{ marginLeft: 'auto' }} onClick={() => setConfirmDel(true)}>Delete client</button>}
              </div>
              {[['Lead source', c.source || '-'], ['Projects', projects.length]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 13, padding: '5px 0', borderTop: k === 'Lead source' ? 'none' : '1px solid var(--bq-border)' }}>
                  <span style={{ color: 'var(--bq-faint)' }}>{k}</span><span style={{ color: 'var(--bq-ink)', fontWeight: 500, textAlign: 'right' }}>{v}</span>
                </div>
              ))}
            </div>
          ) : null}

          </React.Fragment>
          )}
          {modal ? <BqNewClientModal mode={modal.mode} client={modal.client} onClose={() => setModal(null)} onSave={saveModal}></BqNewClientModal> : null}
        </main>
      </div>
    </div>
  );
}
window.HifiClients = HifiClients;

// ── new / edit client modal ──
const CL_STAGE_TONES = { 'New lead': 'ai', 'Estimating': 'ai', 'Proposal sent': 'good', 'In progress': 'brand', 'Starts soon': 'ai', 'Closeout': 'muted' };
const CL_PROJECT_TYPES = ['Kitchen', 'Bath', 'Kitchen + Hall Bath', 'Kitchen + powder room', 'Primary suite addition', 'Addition', 'Garage ADU', 'Whole-home remodel', 'Basement finish', 'Deck + porch', 'Outdoor living', 'Other'];
const CL_SOURCES = ['Referral', 'Website', 'Houzz', 'Repeat client', 'Angi', 'Yard sign', 'Other'];
function bqClInitials(name) { const p = String(name).trim().split(/\s+/).filter(Boolean); const a = p[0] ? p[0][0] : 'C'; const b = p.length > 1 ? p[p.length - 1][0] : ''; return (a + b).toUpperCase(); }
const bqClInp = { width: '100%', boxSizing: 'border-box', border: '1px solid var(--bq-border-strong)', borderRadius: 10, padding: '9px 12px', font: 'inherit', fontSize: 13.5, background: 'var(--bq-raise)', color: 'var(--bq-ink)', outline: 'none' };

function BqClField({ label, span, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 5, gridColumn: span ? '1 / -1' : 'auto', minWidth: 0 }}>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', color: 'var(--bq-faint)' }}>{label}</span>
      {children}
    </label>
  );
}

function BqNewClientModal({ mode, client, onSave, onClose }) {
  const editing = mode === 'edit';
  const projectOnly = mode === 'add-project';
  const showClient = mode === 'new' || mode === 'edit';
  const showProject = mode === 'new' || mode === 'add-project';
  const [f, setF] = React.useState(() => editing
    ? { name: client.name || '', email: client.email || '', phone: client.phone || '', addr: client.addr || '', source: client.source || 'Referral', project: 'Kitchen', stage: 'New lead', contract: '', start: '', notes: '' }
    : { name: '', email: '', phone: '', addr: '', source: 'Referral', project: 'Kitchen', stage: 'New lead', contract: '', start: '', notes: '' });
  const set = (k) => (e) => { const v = e && e.target ? e.target.value : e; setF((p) => ({ ...p, [k]: v })); };
  const ok = showClient ? f.name.trim().length > 1 : true;
  const signed = f.stage === 'In progress' || f.stage === 'Starts soon';
  const title = mode === 'new' ? 'New client' : mode === 'edit' ? 'Edit client' : 'New project for ' + client.name.split(' ')[0];
  const sub = mode === 'new' ? 'Client + their first project - flows into Projects, Portfolio & the portal.' : mode === 'edit' ? 'Update contact details - changes apply everywhere.' : 'Add another project under this client.';
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 210, background: 'rgba(38,35,30,0.42)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(620px, 100%)', maxHeight: 'calc(100vh - 64px)', overflow: 'auto', background: 'var(--bq-card)', borderRadius: 18, boxShadow: '0 28px 70px rgba(38,35,30,0.4), 0 0 0 1px var(--bq-border)', padding: '20px 22px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ width: 36, height: 36, borderRadius: 11, flex: 'none', background: 'var(--bq-brand-soft)', color: 'var(--bq-brand-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 0 1px var(--bq-brand-border)' }}><BqIcon d={projectOnly ? BQ_GLYPH.projects : BQ_GLYPH.clients} size={18}></BqIcon></span>
          <div style={{ flex: 1 }}>
            <div className="bq-display" style={{ fontSize: 18 }}>{title}</div>
            <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{sub}</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'var(--bq-subtle)', color: 'var(--bq-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={14} sw={2}></BqIcon></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {showClient ? <React.Fragment>
            <BqClField label="Client name(s)" span><input autoFocus value={f.name} onChange={set('name')} placeholder="e.g. Sam & Ana Ruiz" style={bqClInp}></input></BqClField>
            <BqClField label="Email"><input value={f.email} onChange={set('email')} placeholder="name@email.com" style={bqClInp}></input></BqClField>
            <BqClField label="Phone"><input value={f.phone} onChange={set('phone')} placeholder="(512) 555-0100" style={bqClInp}></input></BqClField>
            <BqClField label="Property address" span><input value={f.addr} onChange={set('addr')} placeholder="Street, city" style={bqClInp}></input></BqClField>
            <BqClField label="Lead source"><BqSelect value={f.source} options={CL_SOURCES} onChange={set('source')}></BqSelect></BqClField>
          </React.Fragment> : null}
          {showProject ? <React.Fragment>
            {mode === 'new' ? <div style={{ gridColumn: '1 / -1', fontSize: 11, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase', color: 'var(--bq-faint)', marginTop: 4 }}>First project</div> : null}
            <BqClField label="Project type"><BqSelect value={f.project} options={CL_PROJECT_TYPES} onChange={set('project')}></BqSelect></BqClField>
            <BqClField label="Stage"><BqSelect value={f.stage} options={Object.keys(CL_STAGE_TONES)} onChange={set('stage')}></BqSelect></BqClField>
            <BqClField label={signed ? 'Contract value' : 'Budget (rough)'}><input value={f.contract} onChange={set('contract')} placeholder="$" inputMode="numeric" style={bqClInp}></input></BqClField>
            <BqClField label="Target start"><input value={f.start} onChange={set('start')} placeholder="e.g. Aug 2026" style={bqClInp}></input></BqClField>
            <BqClField label="Notes" span><textarea value={f.notes} onChange={set('notes')} rows={2} placeholder="Scope, constraints, who referred them…" style={{ ...bqClInp, resize: 'vertical', lineHeight: 1.5 }}></textarea></BqClField>
          </React.Fragment> : null}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 16 }}>
          <span style={{ fontSize: 11.5, color: 'var(--bq-faint)', lineHeight: 1.4, flex: 1 }}>{showProject ? (signed ? 'Starts as an active job with a live client portal.' : 'Start an estimate any time - the record follows the job.') : 'Contact details only.'}</span>
          <button className="bq-btn sm" onClick={onClose}>Cancel</button>
          <button className="bq-btn primary sm" disabled={!ok} style={{ opacity: ok ? 1 : 0.5, cursor: ok ? 'pointer' : 'default' }} onClick={() => ok && onSave(f)}>{mode === 'new' ? 'Add client' : mode === 'edit' ? 'Save changes' : 'Add project'}</button>
        </div>
      </div>
    </div>
  );
}
