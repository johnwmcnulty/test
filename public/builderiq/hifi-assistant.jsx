// BuilderIQ Builder app - "Ask BuilderIQ" assistant (docked panel + launcher),
// the Portfolio command-center screen, and a cross-project action queue used on both
// the Portfolio screen and the Dashboard. Builder scope: full visibility across all jobs.

// ─────────── shared cross-project data ───────────
const BQ_PORT_JOBS = [
  { n: 'Henderson - Kitchen + Hall Bath', short: 'Henderson', client: 'Dan & Priya Henderson', contract: 186400, margin: 19.4, bid: 22, pct: 43, sched: 'risk', billed: 130480, collected: 93200, risk: 2 },
  { n: 'Osorio - Whole-home remodel', short: 'Osorio', client: 'Luis & Carmen Osorio', contract: 410500, margin: 23.5, bid: 24, pct: 14, sched: 'on', billed: 98520, collected: 91000, risk: 0 },
  { n: 'Delgado - Garage ADU', short: 'Delgado', client: 'Rafael Delgado', contract: 164900, margin: 18.6, bid: 22, pct: 38, sched: 'behind', billed: 62660, collected: 62660, risk: 1 },
  { n: "Whitaker - Kitchen + butler's pantry", short: 'Whitaker', client: 'Joan Whitaker', contract: 128400, margin: 21.0, bid: 23, pct: 55, sched: 'on', billed: 70620, collected: 70620, risk: 0 },
  { n: 'Alvarez - Basement finish', short: 'Alvarez', client: 'Marisol Alvarez', contract: 92700, margin: 24.1, bid: 24, pct: 92, sched: 'on', billed: 85284, collected: 60484, risk: 1 },
  { n: 'Tanaka - Primary suite addition', short: 'Tanaka', client: 'Grace Tanaka', contract: 242000, margin: 25.2, bid: 26, pct: 22, sched: 'on', billed: 53240, collected: 53240, risk: 0 },
  { n: 'Pearson - Sunroom addition', short: 'Pearson', client: 'Glenn Pearson', contract: 73200, margin: 28.4, bid: 27, pct: 96, sched: 'soon', billed: 69540, collected: 69540, risk: 0 },
];
const BQ_ACTIONS_SAMPLE = [
  { g: 'select', tone: 'brand', t: 'Henderson - hall-bath faucet overdue', sub: 'Client decision · 2 days late', act: 'Nudge', nav: 'Selections' },
  { g: 'co', tone: 'brand', t: 'Change Order #4 ready to send', sub: 'Henderson · hallway lighting · +$1,840', act: 'Send', nav: 'Change Orders' },
  { g: 'invoice', tone: 'warn', t: 'Alvarez draw 3 unpaid - 18 days', sub: '$24,800 outstanding · send a reminder', act: 'Remind', nav: 'Invoices' },
  { g: 'watchdog', tone: 'ai', t: 'Delgado margin slipping', sub: '18.6% vs 22% bid · review cost codes', act: 'Review', nav: 'Watchdog' },
  { g: 'cal', tone: '', t: 'Delgado rough-in is a day behind', sub: 'Reschedule the inspection window', act: 'Open', nav: 'Schedule' },
  { g: 'bid', tone: '', t: '2 proposals expire this week', sub: 'Whitaker & Chen · follow up', act: 'Follow up', nav: 'Follow-ups' },
];

// ─────────── Assistant knowledge ───────────
const BQ_ASK_KB = [
  { k: ['risk', 'margin', 'watchdog', 'drift', 'slipping', 'under bid', 'profit'], a: 'Three jobs are under their bid margin - Henderson (19.4% vs 22%), Delgado (18.6% vs 22%), and Whitaker is trending down. That\'s about $21,840 of margin at risk. The Watchdog has the cost-code breakdown.', act: [['Open Watchdog', 'Watchdog']], src: 'Profit Watchdog · live', fu: ['Draft a plan to recover Delgado', 'Why is Henderson slipping?'], card: { type: 'spec', title: 'Margin vs bid', rows: [['Henderson', '19.4% vs 22% - $4,850 at risk'], ['Delgado', '18.6% vs 22% - $5,600 at risk'], ['Whitaker', '21.0% vs 23% - trending down']], foot: '≈ $21,840 of margin at risk' } },
  { k: ['today', 'needs me', 'need to', 'to do', 'priorit', 'action', 'urgent'], a: 'Top of your list today: 2 overdue selections (Henderson faucet, Tanaka tile), Change Order #4 is drafted and waiting to send, and Alvarez draw 3 is 18 days unpaid. Your action queue has them ranked.', act: [['Open action queue', 'Portfolio']], fu: ['What\'s unpaid?', 'Anything behind schedule?'] },
  { k: ['cash', 'unpaid', 'invoice', 'owed', 'collect', 'receivable', 'ar'], a: 'Cash position is $486,200. You\'ve got $112,600 in unpaid invoices - the oldest is Alvarez draw 3 at 18 days ($24,800). Want to send a reminder?', act: [['Open Invoices', 'Invoices']], src: 'Invoices · aging report', fu: ['Who should I chase first?', 'Draft a reminder for Alvarez'], card: { type: 'spec', title: 'Oldest unpaid', rows: [['Alvarez · draw 3', '$24,800 · 18 days'], ['Henderson · draw 2', '$37,280 · 6 days'], ['Tanaka · deposit 2', '$26,620 · 2 days']], foot: '$112,600 total outstanding' } },
  { k: ['pipeline', 'lead', 'sales', 'proposal', 'win', 'pending'], a: '11 open leads worth $1.24M, 4 proposals still out, and an 18% win rate this quarter. Two leads have gone quiet - I can draft follow-ups.', act: [['Open pipeline', 'Sales Pipeline'], ['Draft follow-ups', 'Follow-ups']], fu: ['Which leads went quiet?', 'Draft the follow-ups'] },
  { k: ['update', 'weekly', 'client update', 'henderson update', 'newsletter'], a: 'I drafted this week\'s Henderson client update - tile\'s up and grouted, the hall bath is waterproofed, and cabinets land Tuesday. Give it a read and send.', act: null, src: 'Daily logs + schedule · this week', fu: ['Add the CO #4 note', 'What\'s coming up next week?'], card: { type: 'draft', kind: 'Client update', title: 'Henderson - week 6 of 14', rows: [['Highlights', 'Tile up & grouted · hall bath waterproofed'], ['Coming up', 'Cabinets Tue · countertop template Wed']], cta: 'Open in the writer', nav: 'Weekly Update' } },
  { k: ['change order', 'co', 'leak', 'extra'], a: 'Change Order #4 is drafted and waiting for you to send to the Hendersons. I also flagged possible CO leakage on Delgado - extra demo that hasn\'t been billed.', act: [['CO leakage scan', 'Change Order Leakage']], src: 'Change orders · Henderson', fu: ['What\'s the CO leakage risk?', 'How much is Delgado leaking?'], card: { type: 'draft', kind: 'Change order #4', title: 'Hallway recessed lighting', amount: '+$1,840', rows: [['Scope', 'Six recessed cans · hallway'], ['Status', 'Drafted - waiting to send']], cta: 'Review & send', nav: 'Change Orders' } },
  { k: ['schedule', 'behind', 'delay', 'late', 'timeline', 'crew'], a: 'Two jobs have schedule risk: Delgado is a day behind on rough-in, and Henderson\'s countertop template depends on Tuesday\'s cabinet delivery. 4 crews are out today.', act: [['Open schedule', 'Schedule']], fu: ['Why is Delgado behind?', 'What depends on Tuesday?'] },
  { k: ['portfolio', 'all jobs', 'overview', 'across', 'company', 'how are we'], a: 'Across 7 active jobs you\'ve got $1.30M in production at a 22.7% blended margin. Two jobs are under bid and one is behind schedule. The Portfolio screen rolls it all up.', act: [['Open Portfolio', 'Portfolio']], fu: ['Which jobs are under bid?', 'Where\'s cash tight?'] },
  { k: ['estimate', 'bid', 'new job', 'quote', 'takeoff'], a: 'Happy to - I can walk you through it right here. A few quick questions, I\'ll set up the project as an estimating lead, and open the estimator so you can refine every line.', act: [['Walk me through it', 'flow:estimate'], ['Open the estimator', 'AI Estimate']], fu: ['Start from a past job', 'Use a template'] },
  { k: ['team', 'who', 'people', 'staff'], a: '4 crews are out today across Henderson, Osorio, Delgado, and Tanaka. Marco Diaz is lead on Henderson. You can manage roles and access under Team.', act: [['Open Team', 'Team']], fu: ['Who\'s on Henderson today?', 'Manage roles & access'] },
  { k: ['henderson'], a: 'Henderson is in build week 6 of 14 - 19.4% margin (2.6 under bid), the faucet selection is overdue, and CO #4 is ready to send. Want to open it?', act: [['Open Henderson', 'Projects']], fu: ['What\'s overdue on Henderson?', 'Draft the Henderson update'] },
];
const BQ_ASK_SUGGEST = [
  'Which jobs are at risk?',
  'What needs me today?',
  "What's unpaid?",
  'Draft the Henderson update',
  "How's the pipeline?",
  "What's my cash position?",
  'Record a payment',
  'Draft a change order',
  'Which leads went quiet?',
];
// suggestions tuned to the screen you're on - falls back to the general set
const BQ_ASK_SUGGEST_SCREEN = {
  Invoices: ["What's unpaid?", 'Record a payment', 'Who should I chase first?'],
  Payments: ["What's unpaid?", 'Record a payment', "What's my cash position?"],
  'Budget vs Actual': ['Which jobs are at risk?', 'Draft a plan to recover Delgado'],
  Schedule: ["What's behind schedule?", 'Why is Delgado behind?', 'What depends on Tuesday?'],
  'Sales Pipeline': ["How's the pipeline?", 'Which leads went quiet?', 'Draft the follow-ups'],
  Leads: ["How's the pipeline?", 'Which leads went quiet?'],
  'Follow-ups': ['Draft the follow-ups', 'Which leads went quiet?'],
  Watchdog: ['Which jobs are at risk?', 'Draft a plan to recover Delgado', 'Why is Henderson slipping?'],
  'Change Order Leakage': ["What's the CO leakage risk?", 'How much is Delgado leaking?'],
  'Change Orders': ['Draft a change order', "What's the CO leakage risk?"],
  'Daily Logs': ["Log today's progress", "What's the latest on site?"],
  Tasks: ['Add a task', "What's open across my jobs?"],
  'Project Workspace': ["Log today's progress", 'Draft a change order', 'Record a payment', 'Add a task'],
  Portfolio: ['What needs me today?', 'Which jobs are at risk?', "What's unpaid?"],
  Projects: ["What's overdue on Henderson?", 'Draft the Henderson update', 'Which jobs are at risk?'],
  Clients: ['Walk me through adding a client', 'Add a project', "How's the pipeline?"],
  'Weekly Update': ['Draft the Henderson update', "What's coming up next week?"],
  Team: ["Who's on Henderson today?", 'Manage roles & access'],
};
function bqBuilderSuggest() {
  if (window.bqClean && window.bqClean()) {
    const has = window.bqProj && window.bqProj.actives().length;
    return has ? BQ_ASK_SUGGEST_CLEAN : BQ_ASK_SUGGEST_CLEAN_EMPTY;
  }
  const s = BQ_ASK_SUGGEST_SCREEN[window.__bqScreen];
  return (s && s.length) ? s : BQ_ASK_SUGGEST;
}
const BQ_ASK_VOICE = [
  'Which jobs are under their bid margin?',
  "What's unpaid right now?",
  'Draft the Henderson weekly update',
];
const BQ_ASK_GREET = { role: 'ai', text: 'Hi Maria - I can see across all 7 active jobs. Ask me about margins, cash, schedule, or the pipeline, or have me draft an update, change order, or follow-up.' };
const BQ_ASK_ACTIONS = [
  ['Open the margin Watchdog', 'Watchdog'], ['Open Portfolio & the action queue', 'Portfolio'], ['Open Invoices', 'Invoices'],
  ['Open the sales pipeline', 'Sales Pipeline'], ['Draft lead follow-ups', 'Follow-ups'], ['Draft the weekly client update', 'Weekly Update'],
  ['Open Change Orders', 'Change Orders'], ['Run the CO leakage scan', 'Change Order Leakage'], ['Open the Schedule', 'Schedule'],
  ['Walk me through a new estimate', 'flow:estimate'], ['Walk me through adding a client', 'flow:client'], ['Draft a change order', 'flow:changeorder'], ['Record a payment', 'flow:payment'], ['Log today’s progress', 'flow:dailylog'], ['Add a task', 'flow:task'], ['Open the estimator', 'AI Estimate'], ['Open Team', 'Team'], ['Open Projects', 'Projects'],
];
const BQ_ASK_SYS = [
  'You are "Ask BuilderIQ", the AI copilot inside BuilderIQ, a construction-management platform for residential remodelers. You are talking to Maria, owner of Hartwell Builders. You see all company data: every job, margin, invoice, schedule, and lead.',
  'Voice: a sharp, trusted ops partner - direct, warm, contractor plain-talk. Write dollar amounts like $24,800. No markdown, no lists.',
  'FACTS - active jobs (contract · margin now vs bid · % complete · schedule · billed/collected):',
  ...BQ_PORT_JOBS.map((j) => '- ' + j.n + ' (client ' + j.client + '): $' + j.contract.toLocaleString() + ' · ' + j.margin + '% vs ' + j.bid + '% bid · ' + j.pct + '% done · schedule ' + j.sched + ' · billed $' + j.billed.toLocaleString() + ', collected $' + j.collected.toLocaleString()),
  'FACTS - current situation notes:',
  ...BQ_ASK_KB.map((e) => '- ' + e.a + bqCardFacts(e.card)),
  'FACTS - company: cash position $486,200; $112,600 unpaid invoices (oldest: Alvarez draw 3, $24,800, 18 days); 11 open leads worth $1.24M; 4 proposals out; 18% win rate this quarter; 4 crews out today (Henderson, Osorio, Delgado, Tanaka).',
].join('\n');
// ── clean build: the copilot is grounded ONLY in the live workspace store - no sample/demo data ──
function bqCleanOn() { return !!(window.bqClean && window.bqClean()); }
const BQ_ASK_VOICE_CLEAN = ['How are my jobs doing?', "What's been collected so far?", 'How do I add a client?'];
const BQ_ASK_SUGGEST_CLEAN_EMPTY = ['What can you do?', 'How do I add a client?', 'Start a new estimate'];
const BQ_ASK_SUGGEST_CLEAN = ['How are my jobs doing?', 'Record a payment', 'Draft a change order', "Log today's progress", 'How is my cash looking?', 'Start a new estimate'];
function bqBuilderGreet() {
  if (!bqCleanOn()) return BQ_ASK_GREET;
  const n = window.bqProj ? window.bqProj.actives().length : 0;
  return { role: 'ai', text: n
    ? 'I can see across your ' + n + ' active job' + (n !== 1 ? 's' : '') + '. Ask me about contracts, cash collected, schedule, or your pipeline - everything here comes from your live workspace.'
    : "I'm your copilot. Your workspace is empty for now - add your first client and project and I'll start tracking contracts, cash, and schedule. Ask me anything, or I can point you to the right screen." };
}
function bqBuilderSubtitle() {
  if (!bqCleanOn()) return 'Hartwell Builders · 7 active jobs';
  const n = window.bqProj ? window.bqProj.actives().length : 0;
  return 'Solid Remodel · ' + n + ' active job' + (n !== 1 ? 's' : '');
}
function bqBuilderSys() {
  if (!bqCleanOn()) return BQ_ASK_SYS + (window.bqNewClientFacts ? window.bqNewClientFacts() : '');
  const P = window.bqProj;
  const all = P ? P.list() : [];
  const jobs = P ? P.actives() : [];
  const head = [
    'You are "Ask BuilderIQ", the AI copilot inside BuilderIQ, a construction-management platform for residential remodelers. You are talking to the owner of the company. You can see everything in their live workspace: every client, job, invoice, and schedule.',
    'Voice: a sharp, trusted ops partner - direct, warm, contractor plain-talk. Write dollar amounts like $24,800. No markdown, no lists.',
    'CRITICAL: only state facts listed below, which come from the live workspace. This is a real, possibly brand-new account - do NOT invent jobs, clients, dollar amounts, margins, names, leads, or any example/demo data. If you do not have a number, say you do not have it yet.',
  ];
  if (!all.length) {
    head.push('FACTS - the workspace is empty: no clients, jobs, invoices, or leads have been added yet. Guide the owner to add their first client and project, and offer to take them there. Invent nothing.');
  } else {
    head.push('FACTS - jobs in the workspace (client · project · stage · contract · % complete · collected):');
    all.forEach(function (x) { const p = x.project; head.push('- ' + x.client.name + ' - ' + (p.title || 'project') + ' · ' + p.stage + ' · contract $' + P.total(p).toLocaleString() + ' · ' + P.pct(p) + '% complete · collected $' + P.paid(p).toLocaleString()); });
    head.push('Summary: ' + jobs.length + ' active of ' + all.length + ' total.');
  }
  return head.join('\n');
}
function bqBuilderAnswerClean(q) {
  const P = window.bqProj;
  const all = P ? P.list() : [];
  const jobs = P ? P.actives() : [];
  if (!all.length) return { text: "Your workspace is empty so far - no clients, jobs, or invoices yet. I can walk you through adding your first client and project step by step, then I'll start tracking contracts, cash collected, and schedule for you.", act: [['Walk me through adding a client', 'flow:client'], ['Start an estimate', 'flow:estimate']], followups: ['What can you do?'] };
  const contract = jobs.reduce(function (s, x) { return s + P.total(x.project); }, 0);
  const collected = jobs.reduce(function (s, x) { return s + P.paid(x.project); }, 0);
  return { text: 'You have ' + jobs.length + ' active job' + (jobs.length !== 1 ? 's' : '') + ' totaling $' + contract.toLocaleString() + ' in contracts, with $' + collected.toLocaleString() + ' collected so far. Open Portfolio to see them all.', act: [['Open Portfolio', 'Portfolio']], followups: ["What's collected so far?", 'Add a client'] };
}
function bqBuilderAnswer(q) {
  if (bqCleanOn()) return bqBuilderAnswerClean(q);
  const ql = q.toLowerCase();
  const hit = BQ_ASK_KB.find((e) => e.k.some((kw) => ql.includes(kw)));
  if (hit) return { text: hit.a, act: hit.act, card: hit.card || null, src: hit.src || null, followups: hit.fu || null };
  return { text: 'I can pull anything across your jobs - margins, cash, schedule, pipeline - or draft updates, change orders, and follow-ups. What do you need?', act: [['Margin at risk', 'Watchdog'], ['What needs me', 'Portfolio']], followups: ['Which jobs are at risk?', "What's unpaid?", "How's the pipeline?"] };
}

const BQ_EXPAND_D = 'M8 3 H5 a2 2 0 0 0 -2 2 V8 M16 3 H19 a2 2 0 0 1 2 2 V8 M8 21 H5 a2 2 0 0 1 -2 -2 V16 M16 21 H19 a2 2 0 0 0 2 -2 V16';
const BQ_SHRINK_D = 'M3 8 H6 a2 2 0 0 0 2 -2 V3 M21 8 H18 a2 2 0 0 1 -2 -2 V3 M3 16 H6 a2 2 0 0 1 2 2 V21 M21 16 H18 a2 2 0 0 0 -2 2 V21';
const BQ_ASK_TONE_BG = { brand: 'var(--bq-brand-soft)', warn: 'var(--bq-brand-soft)', ai: 'var(--bq-ai-soft)', '': 'var(--bq-subtle)' };
const BQ_ASK_TONE_FG = { brand: 'var(--bq-brand-strong)', warn: 'var(--bq-bad)', ai: 'var(--bq-ai-strong)', '': 'var(--bq-muted)' };

// ── in-chat guided walk-throughs ──
// The copilot conducts a whole task one step at a time - asking the next relevant
// question, acknowledging each answer, skipping anything already known (`when`) or
// waved off (optional → Skip) - then WRITES the finished record to the live store
// (bqStore / bqProj) and hands off to the next task. Steps: { key, q (str|fn),
// chips (arr|fn), free, optional, ph, transform, when(answers) }.
const BQ_PROJ_CHIPS = ['Kitchen', 'Bathroom', 'Addition', 'Whole-home', 'Basement finish', 'Garage ADU', 'Outdoor living', 'Other'];
const BQ_SCOPE_CHIPS = ['Light refresh', 'Full remodel', 'High-end finishes', 'Structural / addition'];
const BQ_BUDGET_CHIPS = ['Under $50k', '$50–100k', '$100–200k', '$200–400k', '$400k+', 'Not sure yet'];
const BQ_SOURCE_CHIPS = ['Referral', 'Website', 'Houzz', 'Repeat client', 'Angi', 'Other'];
const BQ_STAGE_CHIPS = ['Just a lead', 'Estimating now', 'Proposal going out', 'Signed - starting soon'];
const BQ_STAGE_MAP = { 'Just a lead': ['New lead', 'ai'], 'Estimating now': ['Estimating', 'ai'], 'Proposal going out': ['Proposal sent', 'good'], 'Signed - starting soon': ['Starts soon', 'brand'] };
const BQ_BUDGET_NUM = { 'Under $50k': 40000, '$50–100k': 75000, '$100–200k': 150000, '$200–400k': 300000, '$400k+': 500000 };

// treat skips / non-answers as empty
function bqVal(v) { const s = String(v == null ? '' : v).trim(); return (!s || /^(skip|not sure( yet)?|n\/a|none|no)$/i.test(s)) ? '' : s; }
function bqFirst(nm) { return bqVal(nm).split(/\s+/)[0] || 'them'; }
function bqInitials2(nm) { const p = bqVal(nm).split(/\s+/).filter(Boolean); const a = p[0] ? p[0][0] : 'C'; const b = p.length > 1 ? p[p.length - 1][0] : ''; return ((a + b).toUpperCase()) || 'CL'; }
function bqProjTitle(t) { return (t && t !== 'Other') ? t : 'New project'; }
function bqFindClientByName(nm) {
  const q = bqVal(nm).toLowerCase(); if (!q || !window.bqStore) return null;
  const list = window.bqStore.read() || [];
  return list.find((c) => String(c.name || '').toLowerCase() === q) || list.find((c) => String(c.name || '').toLowerCase().indexOf(q) >= 0) || null;
}
function bqExistingClientChips() {
  const list = (window.bqStore ? window.bqStore.read() : []) || [];
  return list.slice(0, 5).map((c) => c.name).concat(['+ New client']);
}
function bqMoney(n) { return '$' + Number(n || 0).toLocaleString('en-US'); }
// active projects the copilot can act on (change orders, payments, logs, tasks)
function bqActiveList() { return window.bqProj ? window.bqProj.actives() : []; }
function bqActiveProjectChips() { return bqActiveList().map((x) => window.bqProj.shortName(x.client, x.project)); }
function bqFindActiveByLabel(label) {
  const a = bqActiveList(); const q = bqVal(label).toLowerCase(); if (!q) return null;
  return a.find((x) => window.bqProj.shortName(x.client, x.project).toLowerCase() === q)
    || a.find((x) => (x.client.name + ' ' + (x.project.title || '')).toLowerCase().indexOf(q) >= 0) || null;
}
function bqPickActive(label) { return bqFindActiveByLabel(label) || bqActiveList()[0] || null; }
function bqNoActive(verb) { return { text: "You don't have an active project yet, so there's nothing to " + verb + ". Want me to set a client and project up first?", act: [['Add a client', 'flow:client']] }; }
// build (or extend) a client + project from the collected answers; returns { clientId, projectId, client, project, stage }
function bqCommitClientProject(a, opts) {
  opts = opts || {};
  if (!window.bqStore) return null;
  let client = opts.existingClient || (a.client && a.client !== '+ New client' ? bqFindClientByName(a.client) : null);
  const nm = bqVal(a.name) || bqVal(a.client) || 'New client';
  if (!client) {
    client = window.bqStore.add({ name: nm, initials: bqInitials2(nm), phone: bqVal(a.phone), email: bqVal(a.email), addr: bqVal(a.addr), source: (a.source && a.source !== 'Other') ? bqVal(a.source) || 'Referral' : 'Referral' });
  } else {
    const patch = {}; ['phone', 'email', 'addr'].forEach((k) => { if (!client[k] && bqVal(a[k])) patch[k] = bqVal(a[k]); });
    if (Object.keys(patch).length) window.bqStore.update(client.id, patch);
  }
  const st = BQ_STAGE_MAP[a.stage] || [opts.stage || 'New lead', opts.stageTone || 'ai'];
  const stage = st[0], tone = st[1];
  const signed = stage === 'Starts soon' || stage === 'In progress';
  const notes = [bqVal(a.scope), (a.budget && bqVal(a.budget)) ? 'Budget ' + a.budget : '', bqVal(a.notes)].filter(Boolean).join(' · ');
  const pj = window.bqStore.addProject(client.id, {
    title: bqProjTitle(a.type), type: bqVal(a.type) || 'Remodel', stage: stage, stageTone: tone,
    contract: signed ? (BQ_BUDGET_NUM[a.budget] || 0) : 0, budget: BQ_BUDGET_NUM[a.budget] || 0,
    start: bqVal(a.start), notes: notes,
  });
  return { clientId: client.id, projectId: pj.id, client: client, project: pj, stage: stage };
}
// summary card of exactly what got written
function bqRecordCard(a, res, title) {
  const rows = [['Client', (res && res.client && res.client.name) || bqVal(a.name) || bqVal(a.client) || '-'], ['Project', bqProjTitle(a.type)]];
  if (bqVal(a.scope)) rows.push(['Scope', a.scope]);
  if (a.budget && bqVal(a.budget)) rows.push(['Budget', a.budget]);
  if (bqVal(a.start)) rows.push(['Target start', a.start]);
  if (bqVal(a.phone)) rows.push(['Phone', a.phone]);
  if (bqVal(a.email)) rows.push(['Email', a.email]);
  if (bqVal(a.addr)) rows.push(['Address', a.addr]);
  if (bqVal(a.source)) rows.push(['Lead source', a.source]);
  rows.push(['Stage', (res && res.stage) || 'New lead']);
  return { type: 'spec', title: title || 'Added to your workspace', rows: rows };
}

const BQ_FLOWS = {
  client: {
    intro: "Let's get your new client set up. I'll ask a few quick things and add each one as we go - tap Skip on anything you don't have yet.",
    steps: [
      { key: 'name', q: "What's the client's name?", free: true, ph: 'e.g. Sam & Ana Ruiz' },
      { key: 'type', q: (a) => 'Nice - what are we building for ' + bqFirst(a.name) + '?', chips: BQ_PROJ_CHIPS },
      { key: 'stage', q: 'Where are they in the process?', chips: BQ_STAGE_CHIPS },
      { key: 'budget', q: 'Ballpark budget?', chips: BQ_BUDGET_CHIPS },
      { key: 'start', q: 'When are they hoping to start?', free: true, optional: true, ph: 'e.g. Aug 2026' },
      { key: 'phone', q: (a) => 'Best phone number for ' + bqFirst(a.name) + '?', free: true, optional: true, ph: '(512) 555-0100' },
      { key: 'email', q: 'And an email?', free: true, optional: true, ph: 'name@email.com' },
      { key: 'addr', q: 'Property address?', free: true, optional: true, ph: 'Street, city' },
      { key: 'source', q: 'Last one - how did they find you?', chips: BQ_SOURCE_CHIPS, optional: true },
    ],
    commit: (a) => bqCommitClientProject(a),
    done: (a, res) => ({
      text: res
        ? "Done - I've added " + (bqVal(a.name) || 'the client') + ' with their ' + String(bqProjTitle(a.type)).toLowerCase() + " project and saved everything you gave me. What next?"
        : "I'll open Clients so you can finish this up.",
      card: bqRecordCard(a, res, 'New client added'),
      act: res
        ? [['Build their estimate', 'project:' + res.projectId], ["Open " + bqFirst(a.name) + "'s file", 'Clients'], ['Add another client', 'flow:client']]
        : [['Open Clients', 'Clients']],
    }),
  },
  estimate: {
    intro: "Let's build this estimate together. A few quick questions, I'll set up the project, and open the estimator.",
    steps: [
      { key: 'name', q: "Who's it for? (client name)", free: true, ph: 'e.g. Sam & Ana Ruiz', when: (a) => !bqVal(a.name) },
      { key: 'type', q: 'What type of project?', chips: BQ_PROJ_CHIPS, when: (a) => !bqVal(a.type) },
      { key: 'scope', q: 'How deep is the scope?', chips: BQ_SCOPE_CHIPS },
      { key: 'budget', q: 'Ballpark budget to aim for?', chips: BQ_BUDGET_CHIPS, when: (a) => !a.budget },
    ],
    commit: (a) => bqCommitClientProject(a, { stage: 'Estimating', stageTone: 'ai' }),
    done: (a, res) => ({
      text: res
        ? 'Set up - a ' + (bqVal(a.scope) ? String(a.scope).toLowerCase() + ' ' : '') + String(bqProjTitle(a.type)).toLowerCase() + ' for ' + (bqVal(a.name) || 'your client') + (bqVal(a.budget) ? ' around ' + a.budget : '') + ". I've saved it as an estimating lead - opening the estimator so you can refine every line."
        : "I'll open the estimator so you can build it line by line.",
      card: bqRecordCard(a, res, 'Estimate started'),
      act: res ? [['Open the project', 'project:' + res.projectId], ['Add contact details', 'Clients']] : [['Open the estimator', 'AI Estimate']],
    }),
  },
  project: {
    intro: "Sure - let's add a project.",
    steps: [
      { key: 'client', q: 'Which client is this project for?', chips: (a) => bqExistingClientChips(), free: true, ph: 'Type a client name' },
      { key: 'name', q: "What's the new client's name?", free: true, ph: 'e.g. Sam & Ana Ruiz', when: (a) => a.client === '+ New client' },
      { key: 'type', q: 'What kind of project?', chips: BQ_PROJ_CHIPS },
      { key: 'stage', q: 'Where does it stand?', chips: BQ_STAGE_CHIPS },
      { key: 'budget', q: 'Ballpark budget?', chips: BQ_BUDGET_CHIPS },
      { key: 'start', q: 'Target start?', free: true, optional: true, ph: 'e.g. Sep 2026' },
    ],
    commit: (a) => {
      const existing = (a.client && a.client !== '+ New client') ? bqFindClientByName(a.client) : null;
      return bqCommitClientProject(a, { existingClient: existing });
    },
    done: (a, res) => ({
      text: res ? ('Added - a ' + String(bqProjTitle(a.type)).toLowerCase() + ' project' + (res.client ? ' for ' + res.client.name : '') + '. Want to open it?') : "I'll open Clients.",
      card: bqRecordCard(a, res, 'Project added'),
      act: res ? [['Open the project', 'project:' + res.projectId], ['Build the estimate', 'project:' + res.projectId], ['Add another project', 'flow:project']] : [['Open Clients', 'Clients']],
    }),
  },
  changeorder: {
    intro: "Let's draft a change order.",
    precheck: () => bqActiveList().length ? null : bqNoActive('bill a change against'),
    steps: [
      { key: 'project', q: 'Which project is the change on?', chips: () => bqActiveProjectChips(), free: true, ph: 'Project name', when: () => bqActiveList().length > 1 },
      { key: 'desc', q: 'What changed? (the extra work)', free: true, ph: 'e.g. Add six recessed cans in the hallway' },
      { key: 'price', q: 'Price for the change?', free: true, ph: '$1,840' },
    ],
    commit: (a) => {
      const hit = bqPickActive(a.project); if (!hit) return null;
      const price = Number(String(a.price).replace(/[^0-9.]/g, '')) || 0;
      const no = 'CO-' + (101 + (hit.project.cos || []).length);
      window.bqProj.addCo(hit.project.id, { no: no, t: bqVal(a.desc) || 'Change order', price: price, status: 'draft' });
      return { projectId: hit.project.id, no: no, price: price, label: window.bqProj.shortName(hit.client, hit.project) };
    },
    done: (a, res) => ({
      text: res ? ('Drafted ' + res.no + ' on ' + res.label + ' at ' + bqMoney(res.price) + ". It's saved as a draft - review and send it to the client whenever you're ready.") : "I'll open Change Orders.",
      card: res ? { type: 'spec', title: 'Change order drafted', rows: [['Project', res.label], ['Change', bqVal(a.desc) || '-'], ['Price', bqMoney(res.price)], ['Status', 'Draft · not sent']] } : null,
      act: res ? [['Review & send', 'Change Orders'], ['Open the project', 'project:' + res.projectId]] : [['Open Change Orders', 'Change Orders']],
    }),
  },
  payment: {
    intro: "Let's record a payment.",
    precheck: () => bqActiveList().length ? null : bqNoActive('record a payment on'),
    steps: [
      { key: 'project', q: 'Which project got paid?', chips: () => bqActiveProjectChips(), free: true, ph: 'Project name', when: () => bqActiveList().length > 1 },
      { key: 'amount', q: 'How much came in?', free: true, ph: '$18,640' },
    ],
    commit: (a) => {
      const hit = bqPickActive(a.project); if (!hit) return null;
      const amt = Number(String(a.amount).replace(/[^0-9.]/g, '')) || 0;
      const p = hit.project; let draws = (p.draws || []).slice();
      const dueIdx = draws.findIndex((d) => d.status === 'due');
      if (dueIdx > -1) { draws[dueIdx] = Object.assign({}, draws[dueIdx], { status: 'paid', amount: amt || draws[dueIdx].amount }); const nxt = draws.findIndex((d) => d.status === 'upcoming'); if (nxt > -1) draws[nxt] = Object.assign({}, draws[nxt], { status: 'due' }); }
      else { draws = draws.concat([{ t: 'Payment received', amount: amt, status: 'paid' }]); }
      const collected = draws.filter((d) => d.status === 'paid').reduce((s, d) => s + Number(d.amount || 0), 0);
      window.bqProj.update(p.id, { draws: draws, collected: collected });
      return { projectId: p.id, amt: amt, collected: collected, label: window.bqProj.shortName(hit.client, p) };
    },
    done: (a, res) => ({
      text: res ? ('Recorded ' + bqMoney(res.amt) + ' on ' + res.label + '. Collected to date is ' + bqMoney(res.collected) + '.') : "I'll open Payments.",
      card: res ? { type: 'spec', title: 'Payment recorded', rows: [['Project', res.label], ['Amount', bqMoney(res.amt)], ['Collected to date', bqMoney(res.collected)]] } : null,
      act: res ? [['Open Payments', 'Payments'], ['Open the project', 'project:' + res.projectId]] : [['Open Payments', 'Payments']],
    }),
  },
  dailylog: {
    intro: "Let's log today's progress.",
    precheck: () => bqActiveList().length ? null : bqNoActive('log against'),
    steps: [
      { key: 'project', q: 'Which project?', chips: () => bqActiveProjectChips(), free: true, ph: 'Project name', when: () => bqActiveList().length > 1 },
      { key: 'note', q: 'What happened on site?', free: true, ph: 'e.g. Tile up and grouted in the hall bath' },
      { key: 'share', q: 'Share this with the client?', chips: ['Share with client', 'Keep internal'] },
    ],
    commit: (a) => {
      const hit = bqPickActive(a.project); if (!hit) return null;
      const shared = /share/i.test(a.share || '');
      window.bqProj.addLog(hit.project.id, { date: 'Today', summary: bqVal(a.note) || 'Site update', shared: shared });
      return { projectId: hit.project.id, shared: shared, label: window.bqProj.shortName(hit.client, hit.project) };
    },
    done: (a, res) => ({
      text: res ? ('Logged it on ' + res.label + (res.shared ? " and shared it to the client's portal." : ' as an internal note.')) : "I'll open Daily Logs.",
      card: res ? { type: 'spec', title: 'Daily log added', rows: [['Project', res.label], ['Note', bqVal(a.note) || '-'], ['Visibility', res.shared ? 'Shared with client' : 'Internal']] } : null,
      act: res ? [['Open the project', 'project:' + res.projectId], ['See all logs', 'Daily Logs']] : [['Open Daily Logs', 'Daily Logs']],
    }),
  },
  task: {
    intro: "Let's add a task.",
    precheck: () => bqActiveList().length ? null : bqNoActive('add a task to'),
    steps: [
      { key: 'project', q: 'Which project?', chips: () => bqActiveProjectChips(), free: true, ph: 'Project name', when: () => bqActiveList().length > 1 },
      { key: 'task', q: 'What needs doing?', free: true, ph: 'e.g. Order cabinet hardware' },
      { key: 'sub', q: 'Who owns it?', chips: ['Assign to a sub', 'Keep in-house'] },
    ],
    commit: (a) => {
      const hit = bqPickActive(a.project); if (!hit) return null;
      const sub = /sub/i.test(a.sub || '');
      window.bqProj.update(hit.project.id, { tasks: (hit.project.tasks || []).concat([{ t: bqVal(a.task) || 'New task', done: false, sub: sub }]) });
      return { projectId: hit.project.id, sub: sub, label: window.bqProj.shortName(hit.client, hit.project) };
    },
    done: (a, res) => ({
      text: res ? ('Added it to ' + res.label + (res.sub ? " and flagged it for a sub - it'll show up in the Sub portal." : '.')) : "I'll open Tasks.",
      card: res ? { type: 'spec', title: 'Task added', rows: [['Project', res.label], ['Task', bqVal(a.task) || '-'], ['Owner', res.sub ? 'Assigned to a sub' : 'In-house']] } : null,
      act: res ? [['Open the project', 'project:' + res.projectId], ['See all tasks', 'Tasks']] : [['Open Tasks', 'Tasks']],
    }),
  },
};
function bqFlowIntent(low) {
  const verb = /\b(walk me through|guide me|step by step|help me|start|create|new|build|set ?up|add|make|onboard|draft|log|record|enter)\b/.test(low) || low.indexOf("let's") === 0;
  if (!verb) return null;
  if (/change ?order/.test(low)) return 'changeorder';
  if (/\b(payment|deposit|draw)\b/.test(low) || /record .*(payment|paid)/.test(low)) return 'payment';
  if (/\b(daily ?log|site update|progress note)\b/.test(low) || /\blog\b/.test(low)) return 'dailylog';
  if (/\b(task|to-?do|punch)\b/.test(low)) return 'task';
  if (/\b(estimate|bid|takeoff|quote)\b/.test(low)) return 'estimate';
  if (/\b(client|customer|homeowner|lead)\b/.test(low)) return 'client';
  if (/\b(project|job)\b/.test(low)) return 'project';
  return null;
}

function BqAssistant() {
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [msgs, setMsgs] = window.bqPersistState(bqCleanOn() ? 'ask-builder-clean' : 'ask-builder', [bqBuilderGreet()]);
  const [text, setText] = React.useState('');
  const [thinking, setThinking] = React.useState(false);
  const [, bump] = React.useReducer((x) => x + 1, 0); // re-read the current screen when nav changes
  const scrollRef = React.useRef(null);
  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [msgs, thinking, open, expanded]);
  React.useEffect(() => { setMsgs((m) => { const n = m.slice(); while (n.length > 1 && n[n.length - 1].role === 'me') n.pop(); return n.length === m.length ? m : n; }); }, []);
  React.useEffect(() => { const h = () => bump(); window.addEventListener('bq:navigate', h); return () => window.removeEventListener('bq:navigate', h); }, []);

  const [aqDone] = window.bqPersistState('action-done', {});
  const pending = bqSample(BQ_ACTIONS_SAMPLE).filter((a, i) => !aqDone[i]); // empty in the clean build (no sample)
  const priorities = pending.slice(0, 3);
  const suggest = bqBuilderSuggest();

  const [flow, setFlow] = React.useState(null); // in-chat guided walk-through: { id, i, answers }
  const flowRef = React.useRef(null);
  React.useEffect(() => { flowRef.current = flow; }, [flow]);
  const pushAi = (msg) => setMsgs((m) => [...m, Object.assign({ role: 'ai', ts: Date.now(), instant: true }, msg)]); // flow prompts render at once (no typewriter) so questions + chips are never truncated
  // options shown under a step: its own chips, an optional Skip, always a Cancel escape
  const flowStepChips = (step, answers) => {
    let chips = typeof step.chips === 'function' ? step.chips(answers) : (step.chips || []);
    chips = (chips || []).slice();
    if (step.optional && !chips.some((c) => /^skip$/i.test(c))) chips.push('Skip');
    chips.push('Cancel setup');
    return chips;
  };
  // next runnable step index at/after `from`, honoring when()
  const nextStepIdx = (f, from, answers) => { let i = from; while (i < f.steps.length && f.steps[i].when && !f.steps[i].when(answers)) i++; return i; };
  const finishFlow = (f, answers) => {
    setFlow(null);
    const res = f.commit ? f.commit(answers) : null;
    setTimeout(() => pushAi(f.done(answers, res)), 320);
  };
  const startFlow = (id, seed) => {
    const f = BQ_FLOWS[id]; if (!f) return;
    setOpen(true);
    if (f.precheck) { const block = f.precheck(); if (block) { pushAi(block); return; } }
    const answers = seed || {};
    const i0 = nextStepIdx(f, 0, answers);
    if (i0 >= f.steps.length) { finishFlow(f, answers); return; }
    setFlow({ id: id, i: i0, answers: answers });
    const s0 = f.steps[i0];
    const intro = typeof f.intro === 'function' ? f.intro(answers) : f.intro;
    const q = typeof s0.q === 'function' ? s0.q(answers) : s0.q;
    pushAi({ text: intro + '\n\n' + q, chips: flowStepChips(s0, answers) });
  };
  const advanceFlow = (raw) => {
    const fl = flowRef.current; if (!fl) return;
    const f = BQ_FLOWS[fl.id];
    const step = f.steps[fl.i];
    if (/^(cancel setup|cancel|never ?mind|stop|quit|forget it)$/i.test(String(raw).trim())) {
      setFlow(null);
      setTimeout(() => pushAi({ text: "No problem - I've stopped there and saved nothing. What else can I help with?" }), 260);
      return;
    }
    const isSkip = step.optional && /^skip$/i.test(String(raw).trim());
    const stored = isSkip ? '' : (step.transform ? step.transform(raw) : raw);
    const answers = Object.assign({}, fl.answers, step.key ? { [step.key]: stored } : {});
    const ni = nextStepIdx(f, fl.i + 1, answers);
    if (ni < f.steps.length) {
      setFlow({ id: fl.id, i: ni, answers: answers });
      const ns = f.steps[ni];
      const q = typeof ns.q === 'function' ? ns.q(answers) : ns.q;
      setTimeout(() => pushAi({ text: q, chips: flowStepChips(ns, answers) }), 300);
    } else {
      finishFlow(f, answers);
    }
  };
  const ask = (q) => {
    if (!q.trim() || thinking) return;
    const qt = q.trim();
    setMsgs((m) => [...m, { role: 'me', text: qt, ts: Date.now() }]);
    setText('');
    if (flowRef.current) { advanceFlow(qt); return; }
    const intent = bqFlowIntent(qt.toLowerCase());
    if (intent) { startFlow(intent); return; }
    setThinking(true);
    const rich = bqBuilderAnswer(q); // keyword-grounded card/citation, kept even when the live model writes the prose
    window.bqLiveAsk({ system: bqBuilderSys(), actions: BQ_ASK_ACTIONS, history: msgs, q: qt, fallback: bqBuilderAnswer }).then((ans) => { setThinking(false); setMsgs((m) => [...m, { role: 'ai', text: ans.text, act: ans.act, card: ans.card || rich.card || null, src: ans.src || rich.src || null, followups: ans.followups || rich.followups || null, ts: Date.now() }]); });
  };
  const runAction = (target) => {
    if (typeof target === 'string' && target.indexOf('flow:') === 0) { startFlow(target.slice(5)); return; }
    if (typeof target === 'string' && target.indexOf('project:') === 0) { window.__bqCustomProject = target.slice(8); setOpen(false); window.__bqNav && window.__bqNav('Project Workspace'); return; }
    setOpen(false); window.__bqNav && window.__bqNav(target);
  };
  const voice = useBqVoice(ask, bqCleanOn() ? BQ_ASK_VOICE_CLEAN : BQ_ASK_VOICE);
  const onlyGreeting = msgs.length === 1;
  const activeStep = flow ? BQ_FLOWS[flow.id].steps[flow.i] : null; // drives the input placeholder during a walk-through
  const flowPh = activeStep ? (activeStep.ph || (activeStep.free ? 'Type your answer…' : 'Type or pick above…')) : null;
  const size = expanded
    ? { width: 'min(760px, calc(100vw - 32px))', height: 'calc(100vh - 108px)' }
    : { width: 'min(400px, calc(100vw - 32px))', height: 'min(640px, calc(100vh - 130px))' };

  return (
    <React.Fragment>
      <button onClick={() => setOpen((o) => !o)} aria-label="Ask BuilderIQ" title="Ask BuilderIQ" className={open ? '' : 'bq-ask-fab'} style={{ position: 'fixed', bottom: 22, right: 22, zIndex: 70, height: 52, minWidth: 52, padding: 0, borderRadius: 999, border: 'none', cursor: 'pointer', background: 'var(--bq-ai)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 30px rgba(124,58,237,0.45)', fontFamily: 'inherit', fontWeight: 700, fontSize: 14 }}>
        <BqIcon d={open ? 'M6 6 L18 18 M18 6 L6 18' : BQ_GLYPH.spark} size={open ? 21 : 23} sw={open ? 2 : 1.5}></BqIcon>
        {!open ? <span className="bq-ask-fab-lbl">Ask BuilderIQ</span> : null}
      </button>
      {!open && pending.length ? <span aria-hidden="true" style={{ position: 'fixed', bottom: 62, right: 16, zIndex: 71, minWidth: 20, height: 20, padding: '0 5px', borderRadius: 999, background: 'var(--bq-brand)', color: '#fff', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 2px var(--bq-card)', pointerEvents: 'none' }}>{pending.length}</span> : null}

      {open ? (
        <div style={{ position: 'fixed', bottom: 86, right: 22, zIndex: 69, ...size, display: 'flex', flexDirection: 'column', background: 'var(--bq-card)', borderRadius: 18, overflow: 'hidden', boxShadow: '0 28px 70px rgba(38,35,30,0.4), 0 0 0 1px var(--bq-border)', transition: 'width 0.2s ease, height 0.2s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '14px 16px', background: 'var(--bq-ai)', color: '#fff' }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, flex: 'none', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH.spark} size={19} sw={1.5}></BqIcon></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 7 }}>Ask BuilderIQ{window.bqAiLive && window.bqAiLive() ? <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 0.6, padding: '2px 7px', borderRadius: 999, background: 'rgba(255,255,255,0.22)', textTransform: 'uppercase' }}>Live</span> : null}</div>
              <div style={{ fontSize: 11.5, opacity: 0.86, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bqBuilderSubtitle()}</div>
            </div>
            <button onClick={() => setExpanded((v) => !v)} title={expanded ? 'Shrink' : 'Expand'} aria-label={expanded ? 'Shrink' : 'Expand'} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.18)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d={expanded ? BQ_SHRINK_D : BQ_EXPAND_D} size={15} sw={1.9}></BqIcon></button>
            <button onClick={() => setMsgs([bqBuilderGreet()])} title="New conversation" aria-label="New conversation" style={{ width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.18)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d="M12 5 V19 M5 12 H19" size={15} sw={2}></BqIcon></button>
            <button onClick={() => setOpen(false)} aria-label="Close" style={{ width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'rgba(255,255,255,0.18)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={15} sw={2}></BqIcon></button>
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 6px', display: 'flex', flexDirection: 'column', gap: 11 }}>
            <BqAskThread msgs={msgs} thinking={thinking} runAction={runAction} onAsk={ask} scrollRef={scrollRef}></BqAskThread>
            {onlyGreeting && priorities.length ? (
              <div style={{ marginTop: 2, borderRadius: 14, background: 'var(--bq-card)', boxShadow: 'inset 0 0 0 1px var(--bq-border), var(--bq-shadow)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '10px 13px 8px', fontSize: 10.5, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', color: 'var(--bq-faint)' }}>
                  <BqIcon d={BQ_GLYPH.spark} size={13} sw={1.5} style={{ color: 'var(--bq-ai-strong)', flex: 'none' }}></BqIcon>Needs you today<span className="bq-chip brand" style={{ marginLeft: 'auto', padding: '0 8px' }}>{pending.length}</span>
                </div>
                {priorities.map((a, i) => (
                  <button key={i} onClick={() => runAction(a.nav)} style={{ width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 11, padding: '9px 13px', border: 'none', borderTop: '1px solid var(--bq-border)', background: 'transparent', cursor: 'pointer', font: 'inherit' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bq-subtle)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ width: 30, height: 30, borderRadius: 9, flex: 'none', background: BQ_ASK_TONE_BG[a.tone], color: BQ_ASK_TONE_FG[a.tone], display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH[a.g]} size={15}></BqIcon></span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--bq-ink)', lineHeight: 1.3 }}>{a.t}</span>
                      <span style={{ display: 'block', fontSize: 11, color: 'var(--bq-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.sub}</span>
                    </span>
                    <span className="bq-btn primary sm" style={{ flex: 'none', pointerEvents: 'none' }}>{a.act}</span>
                  </button>
                ))}
              </div>
            ) : null}
            {onlyGreeting ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: priorities.length ? 4 : 2 }}>
                {suggest.map((s) => <button key={s} onClick={() => ask(s)} style={{ border: 'none', cursor: 'pointer', font: 'inherit', padding: '8px 13px', borderRadius: 999, fontSize: 12.5, fontWeight: 600, background: 'var(--bq-card)', color: 'var(--bq-ink)', boxShadow: 'inset 0 0 0 1px var(--bq-border-strong)' }}>{s}</button>)}
              </div>
            ) : null}
          </div>

          {!onlyGreeting && !flow ? (
            <div style={{ display: 'flex', gap: 7, overflowX: 'auto', padding: '8px 14px 2px' }}>
              {suggest.map((s) => <button key={s} onClick={() => ask(s)} className="bq-chip ai" style={{ border: 'none', cursor: 'pointer', font: 'inherit', flex: 'none', padding: '6px 12px' }}>{s}</button>)}
            </div>
          ) : null}

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px 12px', borderTop: '1px solid var(--bq-border)' }}>
            <button onClick={voice.start} aria-label="Hold to ask" style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', flex: 'none', cursor: 'pointer', background: voice.listening ? 'var(--bq-ai)' : 'var(--bq-ai-soft)', color: voice.listening ? '#fff' : 'var(--bq-ai-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: voice.listening ? '0 0 0 4px var(--bq-ai-soft)' : 'none' }}>
              {voice.listening ? <BqWaveBars color="#fff"></BqWaveBars> : <BqIcon d={BQ_MIC_D} size={19}></BqIcon>}
            </button>
            <input value={voice.listening ? voice.transcript : text} readOnly={voice.listening} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') ask(text); }} placeholder={voice.listening ? 'Listening…' : (flowPh || 'Ask across your jobs…')} style={{ flex: 1, minWidth: 0, border: '1px solid ' + (voice.listening ? 'var(--bq-ai-border)' : 'var(--bq-border)'), borderRadius: 999, padding: '10px 15px', font: 'inherit', fontSize: 14, background: voice.listening ? 'var(--bq-ai-soft)' : 'var(--bq-raise)', color: 'var(--bq-ink)', outline: 'none' }}></input>
            <button onClick={() => ask(text)} aria-label="Send" disabled={!text.trim()} style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', flex: 'none', cursor: text.trim() ? 'pointer' : 'default', background: text.trim() ? 'var(--bq-ai)' : 'var(--bq-border-strong)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH.send} size={18}></BqIcon></button>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
}
window.BqAssistant = BqAssistant;

// ─────────── Cross-project action queue ───────────
function BqActionQueue({ compact, limit }) {
  const toneBg = { brand: 'var(--bq-brand-soft)', warn: 'var(--bq-brand-soft)', ai: 'var(--bq-ai-soft)', '': 'var(--bq-subtle)' };
  const toneFg = { brand: 'var(--bq-brand-strong)', warn: 'var(--bq-bad)', ai: 'var(--bq-ai-strong)', '': 'var(--bq-muted)' };
  const [done, setDone] = window.bqPersistState('action-done', {});
  const BQ_ACTIONS = (window.bqProj && window.bqProj.actives().length) ? [] : bqSample(BQ_ACTIONS_SAMPLE);
  const items = (limit ? BQ_ACTIONS.slice(0, limit) : BQ_ACTIONS).filter((_, i) => !done[i]);
  return (
    <section className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 0 6px' }}>
      <div className="bq-sechead" style={{ padding: '0 18px', marginBottom: 8 }}>
        <span className="t">Needs you today</span>
        <span className="bq-chip brand" style={{ marginLeft: 8 }}>{items.length}</span>
        <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--bq-faint)' }}>Across all jobs · ranked by urgency</span>
      </div>
      {items.length === 0 ? (
        <div style={{ padding: '18px', textAlign: 'center', fontSize: 13, color: 'var(--bq-faint)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          All clear - nothing needs you right now.
          {Object.keys(done).length ? <button className="bq-btn ghost sm" onClick={() => setDone({})}>Bring back {Object.keys(done).length} snoozed</button> : null}
        </div>
      ) : null}
      {items.map((a, i) => {
        const realIdx = BQ_ACTIONS.indexOf(a);
        return (
          <div key={realIdx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 'calc(11px * var(--bq-sp)) 18px', borderTop: '1px solid var(--bq-border)' }}>
            <span style={{ width: 34, height: 34, borderRadius: 10, flex: 'none', background: toneBg[a.tone], color: toneFg[a.tone], display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH[a.g]} size={16}></BqIcon></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.3 }}>{a.t}</div>
              <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{a.sub}</div>
            </div>
            <button className="bq-btn primary sm" onClick={() => window.__bqNav && window.__bqNav(a.nav)}>{a.act}</button>
            {!compact ? <button className="bq-btn ghost sm" onClick={() => setDone((d) => ({ ...d, [realIdx]: true }))}>Snooze</button> : null}
          </div>
        );
      })}
    </section>
  );
}
window.BqActionQueue = BqActionQueue;

// ─────────── Portfolio command center ───────────
function PortKPI({ label, value, sub, tone }) {
  const col = tone === 'warn' ? 'var(--bq-brand-strong)' : tone === 'good' ? 'var(--bq-good)' : 'var(--bq-ink)';
  return (
    <div className="bq-card-s bq-kpi" style={{ flex: 1, minWidth: 150 }}>
      <span className="lab">{label}</span>
      <span className="val bq-num" style={{ color: col }}>{value}</span>
      {sub ? <span className="sub">{sub}</span> : null}
    </div>
  );
}
function PortSched({ s }) {
  const map = { on: ['On track', 'good'], behind: ['Behind', 'brand'], risk: ['At risk', 'brand'], soon: ['Wrapping up', 'ai'], ahead: ['Ahead', 'good'] };
  const [lbl, tone] = map[s] || ['On track', 'good'];
  return <span className={'bq-chip ' + tone}>{lbl}</span>;
}
function HifiPortfolio() {
  const prof = useBqProfile();
  window.bqUseNewClients && window.bqUseNewClients(); // re-render on store change
  const addedJobs = (window.bqProj ? window.bqProj.actives() : []).filter((x) => Number(x.project.contract) > 0).map((x) => ({ n: x.client.name + ' - ' + x.project.title, short: window.bqProj.shortName(x.client, x.project), client: x.client.name, projectId: x.project.id, contract: window.bqProj.total(x.project), margin: 0, bid: 0, pct: window.bqProj.pct(x.project), sched: 'on', billed: 0, collected: window.bqProj.paid(x.project), risk: 0, isNew: true }));
  const jobs = addedJobs.length ? addedJobs : bqSample(BQ_PORT_JOBS); // sample only as fallback (blank in clean build)
  const real = jobs.filter((j) => !j.isNew);
  const totalContract = jobs.reduce((a, j) => a + j.contract, 0);
  const collected = jobs.reduce((a, j) => a + j.collected, 0);
  const billed = jobs.reduce((a, j) => a + j.billed, 0);
  const toCollect = billed - collected;
  const realContract = real.reduce((a, j) => a + j.contract, 0) || 1;
  const blended = (real.reduce((a, j) => a + j.margin * j.contract, 0) / realContract).toFixed(1);
  const atRisk = real.filter((j) => j.margin < j.bid - 1).length;
  const schedRisk = real.filter((j) => j.sched === 'behind' || j.sched === 'risk').length;
  return (
    <div className="bq-screen">
      <BqTop crumb="Portfolio" right={<button className="bq-btn sm" onClick={() => window.__bqNav && window.__bqNav('Reports')}><BqIcon d={BQ_GLYPH.exports} size={14}></BqIcon>Export</button>}></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Portfolio" alerts={{ 'Change Orders': 1, Invoices: 1 }}></BqSide>
        <main style={{ flex: 1, padding: 'calc(20px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(16px * var(--bq-sp))', overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <span className="bq-display" style={{ fontSize: 22 }}>Portfolio</span>
            <span style={{ fontSize: 13, color: 'var(--bq-muted)' }}>{jobs.length} active jobs · every job, one screen</span>
          </div>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <PortKPI label="In production" value={'$' + (totalContract / 1e6).toFixed(2) + 'M'} sub={jobs.length + ' active contracts'}></PortKPI>
            <PortKPI label="Blended margin" value={blended + '%'} tone={Number(blended) < 22 ? 'warn' : 'good'} sub={atRisk + ' job' + (atRisk !== 1 ? 's' : '') + ' under bid'}></PortKPI>
            <PortKPI label="Billed, not collected" value={'$' + Math.round(toCollect / 1000) + 'k'} tone="warn" sub="awaiting collection"></PortKPI>
            <PortKPI label="Schedule risk" value={schedRisk + ' job' + (schedRisk !== 1 ? 's' : '')} tone={schedRisk ? 'warn' : 'good'} sub={schedRisk ? 'needs attention' : 'all on track'}></PortKPI>
          </div>

          <BqActionQueue></BqActionQueue>

          <section className="bq-card-s" style={{ padding: 'calc(14px * var(--bq-sp)) 0 4px' }}>
            <div className="bq-sechead" style={{ padding: '0 18px', marginBottom: 8 }}>
              <span className="t">All jobs</span>
              <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--bq-faint)' }}>Margin · schedule · cash</span>
            </div>
            <div className="bq-trow head" style={{ gridTemplateColumns: '2.4fr 1.5fr 1fr 1.3fr 0.7fr' }}>
              <span>Job</span><span>Margin · cur / bid</span><span>Schedule</span><span>Cash collected</span><span>Risk</span>
            </div>
            {jobs.map((j) => {
              const warn = j.margin < j.bid - 1;
              const cashPct = Math.round(j.collected / j.contract * 100);
              return (
                <div key={j.projectId || j.short} className="bq-trow" role="button" tabIndex={0} onClick={() => { if (j.isNew) { window.__bqCustomProject = j.projectId; window.__bqNav && window.__bqNav('Project Workspace'); return; } try { window.__bqProjectFocus = j.n; } catch (e) {} window.__bqNav && window.__bqNav('Projects'); }} style={{ gridTemplateColumns: '2.4fr 1.5fr 1fr 1.3fr 0.7fr', cursor: 'pointer', transition: 'background .12s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bq-subtle)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.short}{j.isNew ? <span className="bq-chip ai" style={{ marginLeft: 7 }}>New</span> : null}</div>
                    <div style={{ fontSize: 12, color: 'var(--bq-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{j.client} · {'$' + Math.round(j.contract / 1000) + 'k'}</div>
                  </div>
                  {j.isNew ? <span style={{ fontSize: 12, color: 'var(--bq-faint)', alignSelf: 'center' }}>No cost data yet</span> : <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <BqMeter pct={j.margin * 3.2} tone={warn ? 'warn' : ''} style={{ flex: 1 }}></BqMeter>
                    <span className="cell-num" style={{ fontSize: 12.5, fontWeight: 700, color: warn ? 'var(--bq-brand-strong)' : 'var(--bq-good)', width: 64, flex: 'none' }}>{j.margin}% <span style={{ color: 'var(--bq-faint)', fontWeight: 500 }}>/{j.bid}</span></span>
                  </div>}
                  <PortSched s={j.sched}></PortSched>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <BqMeter pct={cashPct} tone="" style={{ flex: 1 }}></BqMeter>
                    <span className="cell-num" style={{ fontSize: 12, color: 'var(--bq-faint)', width: 34, flex: 'none' }}>{cashPct}%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {j.risk ? <span className="bq-chip brand" style={{ padding: '0 8px' }}>{j.risk}</span> : <span style={{ color: 'var(--bq-faint)', fontSize: 12.5 }}>-</span>}
                    <BqIcon d="M9 6 L15 12 L9 18" size={15} style={{ color: 'var(--bq-faint)', flex: 'none' }}></BqIcon>
                  </div>
                </div>
              );
            })}
            {!jobs.length ? <BqEmpty icon={BQ_GLYPH.projects} title="No active jobs yet" sub="Once you start projects, every one shows here on a single screen - margin, schedule health, and cash collected at a glance." actionLabel="Add a client" onAction={() => window.__bqNav && window.__bqNav('Clients')}></BqEmpty> : null}
          </section>
        </main>
      </div>
    </div>
  );
}
window.HifiPortfolio = HifiPortfolio;
