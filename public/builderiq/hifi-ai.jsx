// BuilderIQ - shared live-AI layer + demo persistence helpers.
// Loaded before all app scripts in every entry point.
//
// window.bqAiLive()            → true when the in-page Claude helper is available
// window.bqLiveAsk(cfg)        → Promise<{text, act, live}> - live Claude answer with
//                                scripted-KB fallback (cfg.fallback) on error/unavailable
// window.bqPersistState(k, v)  → React.useState that survives refresh (localStorage 'bqp:'+k)
// window.bqResetDemo()         → clear all BuilderIQ demo keys ('bq-', 'bqp:') and reload
//
// window.bqClean()             → true in the "BuilderIQ (Clean)" build (blank sample data)
// window.bqSample(arr)         → arr in the demo, [] in the clean build

// ── clean-build mode ── the "BuilderIQ (Clean)" entry points set window.__bqClean=true
// (all hardcoded sample data blanks out → empty states) and window.__bqNS='clean:' (its own
// isolated storage) in a plain <script> before these load. Demo entry points leave both
// unset, so the demo is completely unchanged.
window.__bqClean = window.__bqClean || false;
window.__bqNS = window.__bqNS || '';
window.bqClean = function () { return !!window.__bqClean; };
window.bqSample = function (arr) { return window.__bqClean ? [] : arr; };
// Namespaced localStorage key: keeps the leading "bq-" (so bqResetDemo still clears it)
// but injects __bqNS, so Clean and Demo builds never share identity, activity, or nav state.
window.bqNsKey = function (k) { return String(k).replace(/^bq-/, 'bq-' + (window.__bqNS || '')); };

(function () {
  function aiLive() {
    try { return !!(window.claude && typeof window.claude.complete === 'function'); } catch (e) { return false; }
  }

  function parseAi(raw, actions) {
    const allowed = {};
    (actions || []).forEach(function (a) { allowed[a[1]] = true; });
    let text = String(raw == null ? '' : raw).trim();
    // strip code fences
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
    let obj = null;
    const i = text.indexOf('{'); const j = text.lastIndexOf('}');
    if (i !== -1 && j > i) { try { obj = JSON.parse(text.slice(i, j + 1)); } catch (e) { obj = null; } }
    if (obj && typeof obj.text === 'string' && obj.text.trim()) {
      let act = null;
      if (Array.isArray(obj.act)) {
        act = obj.act.filter(function (p) { return Array.isArray(p) && typeof p[0] === 'string' && allowed[p[1]]; }).slice(0, 2);
        if (!act.length) act = null;
      }
      return { text: bqNoDash(obj.text.trim()), act: act, live: true };
    }
    // model intended JSON but it didn't parse (often truncated) - salvage the text field, never show raw JSON
    if (/^\s*\{/.test(text) || /"text"\s*:/.test(text)) {
      const m = text.match(/"text"\s*:\s*"((?:\\.|[^"\\])*)"/);
      if (m) { try { const t = JSON.parse('"' + m[1] + '"'); if (t && t.trim()) return { text: bqNoDash(t.trim()), act: null, live: true }; } catch (e) {} }
      return null; // let the caller fall back to the scripted answer
    }
    if (text) return { text: bqNoDash(text), act: null, live: true };
    return null;
  }

  const FORMAT_RULES = '\n\nFORMAT: Respond with ONLY a JSON object, no markdown fences: {"text": "your reply", "act": [["Button label", "TARGET"]] or null}. "text" is plain conversational prose, 1-3 short sentences, no markdown, no bullet lists. Never use em dashes or en dashes; use commas, periods, or a spaced hyphen instead. "act" offers 0-2 tap-able shortcuts - only TARGET values from the ACTIONS list, only when they genuinely help the answer. Never invent facts, names, dates, or dollar amounts that are not in your FACTS; if you do not know, say so and point to the right person or screen.';
  // strip any em/en dash the model still emits, so no live reply shows one
  function bqNoDash(s) { return typeof s === 'string' ? s.replace(/\s*\u2014\s*/g, ' - ').replace(/\u2013/g, '-') : s; }

  async function liveAsk(cfg) {
    const t0 = Date.now();
    const scripted = function () {
      const f = cfg.fallback ? cfg.fallback(cfg.q) : { text: 'What do you need?', act: null };
      return { text: f.text, act: f.act || null, card: f.card || null, src: f.src || null, live: false };
    };
    let out = null;
    if (aiLive()) {
      try {
        const actLines = (cfg.actions || []).map(function (a) { return '- TARGET "' + a[1] + '" - ' + a[0]; }).join('\n');
        const sys = cfg.system + (actLines ? '\n\nACTIONS you may offer:\n' + actLines : '') + FORMAT_RULES;
        const msgs = (cfg.history || [])
          .filter(function (m) { return m && m.text; })
          .slice(-12)
          .map(function (m) { return { role: m.role === 'me' ? 'user' : 'assistant', content: m.text }; });
        msgs.push({ role: 'user', content: cfg.q });
        const raw = await Promise.race([
          window.claude.complete({ system: sys, messages: msgs, max_tokens: 500 }),
          new Promise(function (_, rej) { setTimeout(function () { rej(new Error('bq-ai-timeout')); }, 20000); }),
        ]);
        out = parseAi(raw, cfg.actions);
      } catch (e) { out = null; }
    }
    if (!out) out = scripted();
    const min = cfg.minDelay == null ? 700 : cfg.minDelay;
    const wait = Math.max(0, min - (Date.now() - t0));
    if (wait) await new Promise(function (r) { setTimeout(r, wait); });
    return out;
  }

  function persistState(key, initial) {
    const K = 'bqp:' + (window.__bqNS || '') + key;
    const pair = React.useState(function () {
      try { const raw = localStorage.getItem(K); if (raw != null) return JSON.parse(raw); } catch (e) {}
      return typeof initial === 'function' ? initial() : initial;
    });
    const v = pair[0];
    React.useEffect(function () {
      try { localStorage.setItem(K, JSON.stringify(v)); } catch (e) {}
    }, [v]);
    return pair;
  }

  function resetDemo() {
    try {
      const kill = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.indexOf('bq-') === 0 || k.indexOf('bqp:') === 0)) kill.push(k);
      }
      kill.forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) {}
    try { location.reload(); } catch (e) {}
  }

  window.bqAiLive = aiLive;
  window.bqLiveAsk = liveAsk;
  window.bqPersistState = persistState;
  window.bqResetDemo = resetDemo;
})();

// ── client + project store: user-created clients each hold projects[]; persisted + shared ──
(function () {
  const KEY = 'bqp:' + (window.__bqNS || '') + 'new-clients';
  const uid = function (p) { return (p || 'p') + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36); };

  function seed(contract) {
    const r = function (x) { return Math.round(x / 10) * 10; };
    return {
      milestones: [
        { t: 'Kickoff & site protection', w: 'Week 1', done: true },
        { t: 'Demo & rough-in', w: 'Weeks 2–4', done: false },
        { t: 'Inspections', w: 'Week 5', done: false },
        { t: 'Finishes & install', w: 'Weeks 6–8', done: false },
        { t: 'Punch list & closeout', w: 'Week 9', done: false },
      ],
      tasks: [], cos: [], logs: [],
      draws: [
        { t: 'Deposit (at signing)', amount: r(contract * 0.1), status: 'paid' },
        { t: 'Draw 1 - rough-in complete', amount: r(contract * 0.3), status: 'due' },
        { t: 'Draw 2 - finishes started', amount: r(contract * 0.3), status: 'upcoming' },
        { t: 'Final - at completion', amount: r(contract * 0.3), status: 'upcoming' },
      ],
    };
  }

  // heal a project that is active but was never seeded (created straight as In progress)
  function ensureProject(pj) {
    const base = { milestones: [], tasks: [], cos: [], draws: [], logs: [], materials: [], selections: [], punch: [], estLines: [] };
    const p = Object.assign(base, pj || {});
    const active = p.stage === 'In progress' || p.stage === 'Starts soon' || p.stage === 'Closeout';
    if (active && !p.milestones.length && !p.draws.length && Number(p.contract) > 0) {
      const s = seed(Number(p.contract));
      return Object.assign({}, p, { milestones: s.milestones, draws: s.draws });
    }
    return p;
  }

  // normalize legacy single-project records → { ...client, projects:[project] }
  function normalize(c) {
    if (Array.isArray(c.projects)) return c;
    const legacy = {
      id: (c.id || uid('cust')) + '-p1',
      title: c.project || 'Remodel',
      type: c.project || 'Remodel',
      stage: c.stage || 'New lead',
      stageTone: c.stageTone || 'ai',
      contract: Number(c.contract) || 0,
      collected: (c.paid != null ? Number(c.paid) : undefined),
      start: c.start || '', source: c.source || '', notes: c.notes || '',
      milestones: (c.proj && c.proj.milestones) || [],
      tasks: (c.proj && c.proj.tasks) || [],
      cos: (c.proj && c.proj.cos) || [],
      draws: (c.proj && c.proj.draws) || [],
      logs: (c.proj && c.proj.logs) || [],
    };
    const client = { id: c.id, name: c.name, initials: c.initials, email: c.email, phone: c.phone, addr: c.addr, source: c.source, notes: c.notes, custom: true, unread: c.unread || 0, last: c.last || 'Just now', projects: [legacy] };
    return client;
  }

  function readRaw() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function read() {
    const raw = readRaw();
    let migrated = false;
    const list = raw.map(function (c) { const n = normalize(c); if (n !== c) migrated = true; return n; });
    if (migrated) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} }
    return list;
  }
  function write(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
    try { window.dispatchEvent(new Event('bq-clients-change')); } catch (e) {}
  }

  // ── client CRUD ──
  const store = {
    read: read,
    add: function (c) { const l = read(); const client = Object.assign({ id: uid('cust'), custom: true, unread: 0, last: 'Just now', projects: [] }, c); l.unshift(client); write(l); return client; },
    update: function (id, patch) { write(read().map(function (c) { return c.id === id ? Object.assign({}, c, patch) : c; })); },
    remove: function (id) {
      const l = read(); const idx = l.findIndex(function (c) { return c.id === id; }); if (idx < 0) return;
      const snap = l[idx];
      write(l.filter(function (c) { return c.id !== id; }));
      if (window.bqToast) window.bqToast((snap.name || 'Client') + ' deleted', { tone: 'warn', undoLabel: 'Undo', onUndo: function () { const cur = read(); cur.splice(Math.min(idx, cur.length), 0, snap); write(cur); } });
    },
    addProject: function (clientId, pj) {
      const project = Object.assign({ id: uid('pj'), title: 'Remodel', stage: 'New lead', stageTone: 'ai', contract: 0, milestones: [], tasks: [], cos: [], draws: [], logs: [], materials: [], selections: [], punch: [], estLines: [] }, pj);
      write(read().map(function (c) { return c.id === clientId ? Object.assign({}, c, { projects: [project].concat(c.projects || []) }) : c; }));
      return project;
    },
    removeProject: function (projectId) {
      let snap = null, cid = null, idx = 0;
      read().forEach(function (c) { (c.projects || []).forEach(function (p, i) { if (p.id === projectId) { snap = p; cid = c.id; idx = i; } }); });
      write(read().map(function (c) { return Object.assign({}, c, { projects: (c.projects || []).filter(function (p) { return p.id !== projectId; }) }); }));
      if (snap && window.bqToast) window.bqToast((snap.title || snap.type || 'Project') + ' deleted', { tone: 'warn', undoLabel: 'Undo', onUndo: function () { write(read().map(function (c) { if (c.id !== cid) return c; const ps = (c.projects || []).slice(); ps.splice(Math.min(idx, ps.length), 0, snap); return Object.assign({}, c, { projects: ps }); })); } });
    },
  };
  window.bqNewClients = store; // client CRUD (name kept for compatibility)
  window.bqStore = store;

  window.bqUseNewClients = function () {
    const pair = React.useState(read);
    React.useEffect(function () {
      const h = function () { pair[1](read()); };
      window.addEventListener('bq-clients-change', h);
      window.addEventListener('storage', h);
      return function () { window.removeEventListener('bq-clients-change', h); window.removeEventListener('storage', h); };
    }, []);
    return pair[0];
  };

  // ── project math + ops (addressed by projectId or a project object) ──
  function total(p) {
    const approved = (p.cos || []).filter(function (x) { return x.status === 'approved'; }).reduce(function (s, x) { return s + (Number(x.price) || 0); }, 0);
    const mats = (p.materials || []).filter(function (m) { return m.billed && m.billable; }).reduce(function (s, m) { return s + matClient(m); }, 0);
    return (Number(p.contract) || 0) + approved + mats;
  }
  function matCost(m) { return (Number(m.qty) || 0) * (Number(m.cost) || 0); }
  function matClient(m) { return m.billable ? Math.round(matCost(m) * (1 + (m.markup == null ? 0.15 : Number(m.markup)))) : 0; }
  function paid(p) {
    if (p.collected != null && p.collected !== '') return Number(p.collected) || 0;
    return (p.draws || []).filter(function (d) { return d.status === 'paid'; }).reduce(function (s, d) { return s + (Number(d.amount) || 0); }, 0);
  }
  function pct(p) {
    const ms = p.milestones || [];
    if (!ms.length) return 0;
    return Math.round(ms.filter(function (m) { return m.done; }).length / ms.length * 100);
  }
  function shortName(client, project) {
    const last = String(client.name || '').split(/\s+/).pop() || client.name;
    const multi = (client.projects || []).length > 1;
    return multi ? last + ' · ' + (project.title || project.type || 'Project') : last;
  }
  function locate(projectId) {
    const clients = read();
    for (let i = 0; i < clients.length; i++) {
      const p = (clients[i].projects || []).find(function (x) { return x.id === projectId; });
      if (p) return { client: clients[i], project: ensureProject(p) };
    }
    return null;
  }
  function updateProject(projectId, patch) {
    write(read().map(function (c) {
      return Object.assign({}, c, { projects: (c.projects || []).map(function (p) { return p.id === projectId ? Object.assign({}, ensureProject(p), patch) : p; }) });
    }));
  }
  function listAll() {
    const out = [];
    read().forEach(function (c) { (c.projects || []).forEach(function (p) { out.push({ client: c, project: ensureProject(p) }); }); });
    return out;
  }
  function actives() {
    return listAll().filter(function (x) { return x.project.stage === 'In progress' || x.project.stage === 'Starts soon' || x.project.stage === 'Closeout'; });
  }
  window.bqProj = {
    seed: seed, ensure: ensureProject, total: total, paid: paid, pct: pct, shortName: shortName, matCost: matCost, matClient: matClient,
    get: locate, list: listAll, actives: actives, update: updateProject,
    addLog: function (id, log) { const l = locate(id); if (l) updateProject(id, { logs: [log].concat(l.project.logs) }); },
    addMaterial: function (id, mat) { const l = locate(id); if (l) updateProject(id, { materials: [Object.assign({ id: 'mat' + Date.now().toString(36), date: 'Today', qty: 1, unit: 'ea', cost: 0, markup: 0.15, billable: true, billed: false }, mat)].concat(l.project.materials || []) }); },
    setMaterial: function (id, mid, patch) { const l = locate(id); if (l) updateProject(id, { materials: (l.project.materials || []).map(function (m) { return m.id === mid ? Object.assign({}, m, patch) : m; }) }); },
    delMaterial: function (id, mid) { const l = locate(id); if (l) updateProject(id, { materials: (l.project.materials || []).filter(function (m) { return m.id !== mid; }) }); },
    addSelection: function (id, sel) { const l = locate(id); if (l) updateProject(id, { selections: [Object.assign({ id: 'sel' + Date.now().toString(36), status: 'pending', allowance: 0, price: 0 }, sel)].concat(l.project.selections || []) }); },
    setSelection: function (id, sid, patch) { const l = locate(id); if (l) updateProject(id, { selections: (l.project.selections || []).map(function (s) { return s.id === sid ? Object.assign({}, s, patch) : s; }) }); },
    delSelection: function (id, sid) { const l = locate(id); if (l) updateProject(id, { selections: (l.project.selections || []).filter(function (s) { return s.id !== sid; }) }); },
    addPunch: function (id, t) { const l = locate(id); if (l) updateProject(id, { punch: (l.project.punch || []).concat([{ t: t, done: false }]) }); },
    togglePunch: function (id, idx) { const l = locate(id); if (l) updateProject(id, { punch: (l.project.punch || []).map(function (x, i) { return i === idx ? Object.assign({}, x, { done: !x.done }) : x; }) }); },
    delPunch: function (id, idx) { const l = locate(id); if (l) updateProject(id, { punch: (l.project.punch || []).filter(function (_, i) { return i !== idx; }) }); },
    addEstLine: function (id, line) { const l = locate(id); if (l) updateProject(id, { estLines: (l.project.estLines || []).concat([Object.assign({ t: 'Line item', cost: 0 }, line)]) }); },
    setEstLine: function (id, idx, patch) { const l = locate(id); if (l) updateProject(id, { estLines: (l.project.estLines || []).map(function (x, i) { return i === idx ? Object.assign({}, x, patch) : x; }) }); },
    delEstLine: function (id, idx) { const l = locate(id); if (l) updateProject(id, { estLines: (l.project.estLines || []).filter(function (_, i) { return i !== idx; }) }); },
    addCo: function (id, co) { const l = locate(id); if (l) updateProject(id, { cos: [co].concat(l.project.cos) }); },
    setCo: function (id, no, status) { const l = locate(id); if (l) updateProject(id, { cos: l.project.cos.map(function (x) { return x.no === no ? Object.assign({}, x, { status: status }) : x; }) }); },
    subTasks: function () {
      const out = [];
      read().forEach(function (c) { (c.projects || []).forEach(function (p) {
        (ensureProject(p).tasks || []).forEach(function (t, i) { if (t.sub) out.push({ projectId: p.id, idx: i, t: t.t, done: !!t.done, proj: shortName(c, p) }); });
      }); });
      return out;
    },
    toggleTask: function (projectId, idx) {
      const l = locate(projectId); if (!l) return;
      updateProject(projectId, { tasks: l.project.tasks.map(function (t, i) { return i === idx ? Object.assign({}, t, { done: !t.done }) : t; }) });
    },
    completeSubTask: function (label, note) {
      const hit = this.subTasks().find(function (t) { return !t.done && t.t === label; }) || this.subTasks().find(function (t) { return !t.done && String(t.t).toLowerCase().indexOf(String(label || '').toLowerCase()) >= 0; });
      if (!hit) return null;
      const l = locate(hit.projectId); if (!l) return null;
      updateProject(hit.projectId, { tasks: l.project.tasks.map(function (t, i) { return i === hit.idx ? Object.assign({}, t, { done: true, subNote: note || t.subNote }) : t; }) });
      try { window.bqLogEvent && window.bqLogEvent('sub', { g: 'task', tone: 'good', body: 'Sub marked \u201c' + hit.t + '\u201d complete' + (note ? ' - ' + note : ''), change: 'Sub completed: ' + hit.t }); } catch (e) {}
      return hit;
    },
  };

  // ── assistant facts ──
  window.bqNewClientFacts = function () {
    const rows = listAll();
    if (!rows.length) return '';
    return '\nFACTS - clients & projects Maria recently added: ' + rows.map(function (x) {
      const p = x.project;
      const cos = (p.cos || []).filter(function (co) { return co.status === 'approved'; });
      return x.client.name + ' - ' + (p.title || 'project') + ' (stage: ' + p.stage + (Number(p.contract) ? ', contract $' + total(p).toLocaleString() : '') + (x.client.addr ? ', ' + x.client.addr : '') + (cos.length ? ', ' + cos.length + ' approved CO(s)' : '') + ')';
    }).join('; ') + '.';
  };
  window.bqClientPortalFacts = function (client, project) {
    const p = project;
    const pending = (p.cos || []).filter(function (x) { return x.status === 'sent'; });
    const nextDraw = (p.draws || []).find(function (d) { return d.status === 'due'; });
    const nextMs = (p.milestones || []).find(function (m) { return !m.done; });
    const clean = !!(window.bqClean && window.bqClean());
    const prof = window.__bqProfile ? window.__bqProfile.get() : null;
    const gc = clean ? 'Solid Remodel' : 'Hartwell Builders';
    const lead = clean ? ((prof && prof.display && prof.display !== 'Owner') ? prof.display : 'your builder') : 'Mike Hartwell';
    return [
      'You are "Ask BuilderIQ" inside a homeowner portal. You are talking to ' + client.name + ', whose ' + (p.title || 'remodel') + ' at ' + (client.addr || 'their home') + ' is being built by ' + gc + ' (project lead: ' + lead + ').',
      'HARD SCOPE RULES (these override everything): only discuss THIS homeowner\'s own project. Never reveal ' + gc + '\'s internal costs, margins, sub pricing, or other clients. If asked, warmly point them to ' + lead + ' via Messages.',
      'Voice: warm, plain language, 1-3 short sentences, no markdown.',
      'FACTS - this project:',
      '- Stage: ' + p.stage + ' · progress ' + pct(p) + '%' + (nextMs ? ' · next milestone: ' + nextMs.t + ' (' + nextMs.w + ')' : ''),
      '- Contract total $' + total(p).toLocaleString() + ' (base $' + (Number(p.contract) || 0).toLocaleString() + ' + approved changes) · paid $' + paid(p).toLocaleString() + ' · remaining $' + (total(p) - paid(p)).toLocaleString(),
      nextDraw ? '- Next payment due: ' + nextDraw.t + ' - $' + Number(nextDraw.amount).toLocaleString() : '- No payment currently due.',
      pending.length ? '- ' + pending.length + ' change order(s) awaiting their decision: ' + pending.map(function (x) { return x.t + ' (+$' + Number(x.price).toLocaleString() + ')'; }).join('; ') : '- No decisions pending right now.',
      (p.logs || []).length ? '- Latest update from the site: ' + p.logs[0].summary : '- No site updates shared yet.',
    ].join('\n');
  };
  window.bqSubStoreFacts = function () {
    const ts = window.bqProj.subTasks();
    if (!ts.length) return '';
    return '\nFACTS - newly assigned Hartwell work: ' + ts.map(function (t) { return t.t + ' (' + t.proj + (t.done ? ', done' : ', open') + ')'; }).join('; ') + '.';
  };
})();

// ── account-level subcontractor / vendor registry (shared across projects) ──
(function () {
  const VKEY = 'bqp:' + (window.__bqNS || '') + 'vendors';
  const vuid = function () { return 'v' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36); };
  function vread() { try { return JSON.parse(localStorage.getItem(VKEY)) || []; } catch (e) { return []; } }
  function vwrite(l) { try { localStorage.setItem(VKEY, JSON.stringify(l)); } catch (e) {} try { window.dispatchEvent(new Event('bq-vendors-change')); } catch (e) {} }
  function vinitials(n) { const p = String(n || '').trim().split(/\s+/).filter(Boolean); return (((p[0] ? p[0][0] : 'V') + (p[1] ? p[1][0] : '')).toUpperCase()) || 'V'; }
  window.bqVendors = {
    read: vread,
    add: function (v) { const l = vread(); const rec = Object.assign({ id: vuid(), initials: vinitials(v.name), trade: '', phone: '', email: '' }, v); l.unshift(rec); vwrite(l); return rec; },
    update: function (id, patch) { vwrite(vread().map(function (v) { return v.id === id ? Object.assign({}, v, patch) : v; })); },
    remove: function (id) { vwrite(vread().filter(function (v) { return v.id !== id; })); },
  };
  window.bqUseVendors = function () {
    const pair = React.useState(vread);
    React.useEffect(function () {
      const h = function () { pair[1](vread()); };
      window.addEventListener('bq-vendors-change', h); window.addEventListener('storage', h);
      return function () { window.removeEventListener('bq-vendors-change', h); window.removeEventListener('storage', h); };
    }, []);
    return pair[0];
  };
})();

// ── bid requests / submitted bids (subs submit → builder reviews in Bid Requests) ──
(function () {
  const BKEY = 'bqp:' + (window.__bqNS || '') + 'bids';
  const buid = function () { return 'b' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36); };
  function bread() { try { return JSON.parse(localStorage.getItem(BKEY)) || []; } catch (e) { return []; } }
  function bwrite(l) { try { localStorage.setItem(BKEY, JSON.stringify(l)); } catch (e) {} try { window.dispatchEvent(new Event('bq-bids-change')); } catch (e) {} }
  window.bqBids = {
    read: bread,
    add: function (b) { const l = bread(); const rec = Object.assign({ id: buid(), status: 'submitted', ts: Date.now() }, b); l.unshift(rec); bwrite(l); return rec; },
    update: function (id, patch) { bwrite(bread().map(function (b) { return b.id === id ? Object.assign({}, b, patch) : b; })); },
    remove: function (id) { bwrite(bread().filter(function (b) { return b.id !== id; })); },
  };
  window.bqUseBids = function () {
    const pair = React.useState(bread);
    React.useEffect(function () {
      const h = function () { pair[1](bread()); };
      window.addEventListener('bq-bids-change', h); window.addEventListener('storage', h);
      return function () { window.removeEventListener('bq-bids-change', h); window.removeEventListener('storage', h); };
    }, []);
    return pair[0];
  };
})();
