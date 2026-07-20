// BuilderIQ - Crew capacity / resource scheduling + Material procurement

// ════════════════════════════ CREW CAPACITY ════════════════════════════
const CAP_WEEKS = ['Jun 16', 'Jun 23', 'Jun 30', 'Jul 7', 'Jul 14', 'Jul 21'];
// [name, color, location, current phase, contract value]
const CAP_JOBS = {
  HEN: ['Henderson', 'var(--bq-brand)', 'Henderson, NV', 'Cabinets & tile', '$186k'],
  OSO: ['Osorio', 'var(--bq-ai)', 'Summerlin', 'Framing', '$92k'],
  TAN: ['Tanaka', '#2563EB', 'Green Valley', 'Demo & rough-in', '$310k'],
  CHE: ['Chen', '#DB2777', 'Anthem', 'Foundation', '$140k'],
  ALV: ['Alvarez', 'var(--bq-good)', 'Henderson, NV', 'Electrical rough', '$78k'],
};
const CAP_CREWS = [
  { name: 'Mike R.', role: 'Lead carpenter', sub: false, weeks: [[['HEN', 100]], [['HEN', 100]], [['TAN', 100]], [['TAN', 100]], [['TAN', 60]], [[]]] },
  { name: 'Carlos + crew', role: 'Framing / GC labor', sub: false, weeks: [[['OSO', 60], ['HEN', 40]], [['OSO', 100]], [['OSO', 100]], [['ALV', 100]], [['ALV', 100]], [['ALV', 80]]] },
  { name: 'Vargas Framing', role: 'Subcontractor', sub: true, weeks: [[['TAN', 50]], [['TAN', 100]], [[]], [[]], [['CHE', 50]], [[]]] },
  { name: 'Bright Electric', role: 'Subcontractor', sub: true, weeks: [[['HEN', 50]], [[]], [['OSO', 60]], [['HEN', 70], ['CHE', 60]], [[]], [['ALV', 50]]] },
  { name: 'Reliant Plumbing', role: 'Subcontractor', sub: true, weeks: [[[]], [['HEN', 50]], [['HEN', 40]], [['CHE', 50]], [['ALV', 40]], [[]]] },
  { name: 'StoneWorks', role: 'Countertops (sub)', sub: true, weeks: [[[]], [[]], [['HEN', 40]], [[]], [['OSO', 50]], [['TAN', 40]]] },
];

function CapCell({ alloc }) {
  const load = alloc.reduce((a, x) => a + x[1], 0);
  const over = load > 100;
  if (!load) return <div style={{ height: 38, borderRadius: 8, background: 'var(--bq-subtle)', opacity: 0.5 }}></div>;
  return (
    <div title={alloc.map((x) => CAP_JOBS[x[0]][0] + ' ' + x[1] + '%').join(' · ') + (over ? ' - OVERBOOKED' : '')} style={{ height: 38, borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 1, boxShadow: over ? '0 0 0 2px var(--bq-brand)' : 'none' }}>
      {alloc.map((x, i) => (
        <div key={i} style={{ flex: x[1], background: CAP_JOBS[x[0]][1], color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', paddingLeft: 6, minHeight: 0 }}>{CAP_JOBS[x[0]][0]} {x[1]}%</div>
      ))}
    </div>
  );
}

function CapLoadBar({ load }) {
  const tone = load > 100 ? 'var(--bq-brand)' : load >= 85 ? '#D97706' : 'var(--bq-good)';
  return (
    <div style={{ height: 6, borderRadius: 999, background: 'var(--bq-card)', overflow: 'hidden', boxShadow: 'inset 0 0 0 1px var(--bq-border)' }}>
      <div style={{ width: Math.min(100, load) + '%', height: '100%', background: tone, borderRadius: 999 }}></div>
    </div>
  );
}

function CapBoard({ crews, setCrews, wk, dragRef }) {
  const [over, setOver] = React.useState(null);
  const move = (toCrew) => {
    const d = dragRef.current; setOver(null);
    if (!d || d.crewIdx === toCrew) { dragRef.current = null; return; }
    setCrews((prev) => {
      const next = prev.map((c) => ({ ...c, weeks: c.weeks.map((w) => w.map((a) => [...a])) }));
      const [moved] = next[d.crewIdx].weeks[wk].splice(d.allocIdx, 1);
      next[toCrew].weeks[wk].push(moved);
      return next;
    });
    dragRef.current = null;
  };
  return (
    <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 6, alignItems: 'flex-start' }}>
      {crews.map((c, ci) => {
        const load = c.weeks[wk].reduce((a, x) => a + x[1], 0);
        const overbooked = load > 100;
        const isTarget = over === ci;
        return (
          <div key={c.name} onDragOver={(e) => { e.preventDefault(); if (over !== ci) setOver(ci); }} onDragLeave={() => setOver((o) => o === ci ? null : o)} onDrop={() => move(ci)}
            style={{ minWidth: 196, flex: '1 0 196px', background: isTarget ? 'var(--bq-ai-soft)' : 'var(--bq-subtle)', borderRadius: 14, padding: 12, display: 'flex', flexDirection: 'column', gap: 10, boxShadow: isTarget ? 'inset 0 0 0 2px var(--bq-ai)' : overbooked ? 'inset 0 0 0 2px var(--bq-brand)' : 'inset 0 0 0 1px var(--bq-border)', transition: 'background .12s' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>{c.name}{c.sub ? <BqIcon d={BQ_GLYPH.hardhat} size={12} style={{ color: 'var(--bq-faint)' }}></BqIcon> : null}</div>
                <div style={{ fontSize: 11, color: 'var(--bq-faint)' }}>{c.role}</div>
              </div>
              <span className="bq-num" style={{ fontSize: 14, fontWeight: 700, color: overbooked ? 'var(--bq-brand-strong)' : load >= 85 ? '#B45309' : 'var(--bq-good)' }}>{load}%</span>
            </div>
            <CapLoadBar load={load}></CapLoadBar>
            {overbooked ? <span className="bq-chip brand" style={{ alignSelf: 'flex-start' }}><BqIcon d={BQ_GLYPH.watchdog} size={11}></BqIcon>Overbooked</span> : load === 0 ? <span className="bq-chip" style={{ alignSelf: 'flex-start' }}>Idle this week</span> : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, minHeight: 44 }}>
              {c.weeks[wk].length === 0 ? (
                <div style={{ border: '1.5px dashed var(--bq-border-strong)', borderRadius: 10, padding: '14px 10px', textAlign: 'center', fontSize: 11.5, color: 'var(--bq-faint)' }}>Drop a job here</div>
              ) : c.weeks[wk].map((x, ai) => (
                <div key={ai} draggable onDragStart={() => { dragRef.current = { crewIdx: ci, allocIdx: ai }; }} onDragEnd={() => setOver(null)}
                  style={{ background: CAP_JOBS[x[0]][1], color: '#fff', borderRadius: 10, padding: '10px 12px', cursor: 'grab', boxShadow: '0 1px 3px rgba(38,35,30,0.18)', display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><BqIcon d={BQ_GLYPH.hammer} size={13} style={{ color: '#fff', opacity: 0.85 }}></BqIcon><span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 0.7, textTransform: 'uppercase', opacity: 0.7 }}>Job</span><span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, opacity: 0.92 }} className="bq-num">{CAP_JOBS[x[0]][4]}</span></div>
                  <div style={{ fontWeight: 700, fontSize: 13.5, marginTop: -1 }}>{CAP_JOBS[x[0]][0]}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, opacity: 0.95 }}><span style={{ background: 'rgba(255,255,255,0.22)', borderRadius: 5, padding: '1px 6px', fontWeight: 600 }}>{CAP_JOBS[x[0]][3]}</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, opacity: 0.88 }}><span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><BqIcon d={BQ_GLYPH.pin} size={10} style={{ color: '#fff', opacity: 0.85 }}></BqIcon>{CAP_JOBS[x[0]][2]}</span><span style={{ marginLeft: 'auto', fontWeight: 600 }}>{x[1]}% of week</span></div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HifiCapacity() {
  const grid = '150px repeat(' + CAP_WEEKS.length + ', 1fr)';
  const [view, setView] = React.useState('timeline');
  const [wk, setWk] = React.useState(3);
  const [crews, setCrews] = React.useState(() => CAP_CREWS.map((c) => ({ ...c, weeks: c.weeks.map((w) => w.filter((a) => a && a.length === 2).map((a) => [...a])) })));
  const dragRef = React.useRef(null);
  // derived from `crews` so Timeline, Board, KPIs and the conflict callout always agree
  const loads = crews.map((c) => c.weeks.map((w) => w.reduce((a, x) => a + x[1], 0)));
  const flat = loads.flat();
  const util = Math.round(flat.reduce((a, v) => a + Math.min(v, 100), 0) / (flat.length * 100) * 100);
  const obks = [];
  crews.forEach((c, ci) => c.weeks.forEach((w, wi) => { if (loads[ci][wi] > 100) obks.push({ ci, wi, crew: c.name, load: loads[ci][wi], jobs: w }); }));
  const obkCrews = new Set(obks.map((o) => o.crew)).size;
  const conflict = obks[0] || null;
  let idle = null;
  for (let wi = 1; wi < CAP_WEEKS.length && !idle; wi++) { const ci = crews.findIndex((c, i) => loads[i][wi] === 0); if (ci >= 0) idle = { crew: crews[ci].name, wk: CAP_WEEKS[wi] }; }
  const tradeOf = (role) => /electric/i.test(role) ? 'Electrical' : /plumb/i.test(role) ? 'Plumbing' : /counter|stone/i.test(role) ? 'Countertops' : /framing/i.test(role) ? 'Framing' : 'Carpentry';
  const tradeJobs = {};
  crews.forEach((c) => { const t = tradeOf(c.role); (tradeJobs[t] = tradeJobs[t] || new Set()); c.weeks.forEach((w) => w.forEach((x) => tradeJobs[t].add(x[0]))); });
  const bottleneck = Object.entries(tradeJobs).sort((a, b) => b[1].size - a[1].size)[0] || ['-', new Set()];
  return (
    <div className="bq-screen">
      <BqTop crumb="Crew capacity" right={<React.Fragment>
        <div className="seg-toggle">
          <button className={view === 'timeline' ? 'on' : ''} onClick={() => setView('timeline')}>Timeline</button>
          <button className={view === 'board' ? 'on' : ''} onClick={() => setView('board')}>Board</button>
        </div>
        <button className="bq-btn sm" onClick={() => window.__bqNav && window.__bqNav('Schedule')}>Open schedule</button>
      </React.Fragment>}></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Capacity"></BqSide>
        <main style={{ flex: 1, padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))', overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span className="bq-display" style={{ fontSize: 20 }}>Who's working what, when</span>
            <span style={{ fontSize: 13, color: 'var(--bq-muted)' }}>{crews.length} crews & subs · across {Object.keys(CAP_JOBS).length} active jobs</span>
          </div>
          <div style={{ display: 'flex', gap: 'calc(12px * var(--bq-sp))', flexWrap: 'wrap' }}>
            <BqKPI label="Utilization" value={util + '%'} sub="of available crew-weeks" tone={util >= 80 ? 'good' : ''}></BqKPI>
            <BqKPI label="Overbooked" value={obkCrews + (obkCrews === 1 ? ' crew' : ' crews')} sub={conflict ? conflict.crew + ' · ' + CAP_WEEKS[conflict.wi] : 'all within capacity'} tone={obkCrews ? 'warn' : 'good'}></BqKPI>
            <BqKPI label="Idle soon" value={idle ? '1 crew' : 'None'} sub={idle ? idle.crew + ' - ' + idle.wk : 'everyone booked'}></BqKPI>
            <BqKPI label="Bottleneck trade" value={bottleneck[0]} sub={bottleneck[1].size + ' jobs contend'} tone="ai"></BqKPI>
          </div>

          {conflict ? (
            <section className="bq-ai-card ai-expanded" style={{ padding: '13px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <BqSpark></BqSpark>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--bq-ai-strong)', marginBottom: 3 }}>{conflict.crew} is over capacity the week of {CAP_WEEKS[conflict.wi]}</div>
                <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5 }}>They're at <b>{conflict.load}%</b> &mdash; {conflict.jobs.map((x) => CAP_JOBS[x[0]][0] + ' ' + x[1] + '%').join(' + ')} overlap. {view === 'board' ? 'Drag a card onto another crew or a lighter week to clear it.' : 'Open the board to rebalance it across crews.'}</div>
              </div>
              <button className="bq-btn ai sm" onClick={() => { setView('board'); setWk(conflict.wi); }}>{view === 'board' ? 'On the board' : 'Fix on board'}</button>
            </section>
          ) : (
            <section className="bq-card-s" style={{ padding: '13px 18px', display: 'flex', gap: 12, alignItems: 'center', boxShadow: 'inset 0 0 0 1px #DCEBC2', background: 'var(--bq-good-soft)' }}>
              <span style={{ width: 30, height: 30, borderRadius: 9, flex: 'none', background: 'var(--bq-good)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BqIcon d={BQ_GLYPH.check} size={17} sw={2.4}></BqIcon></span>
              <div style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: 'var(--bq-good)' }}>No conflicts &mdash; every crew is within capacity across the 6-week window.</div>
            </section>
          )}

          {view === 'timeline' ? (
            <section className="bq-card-s" style={{ padding: '16px 18px', overflow: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: grid, gap: 8, alignItems: 'center', minWidth: 720 }}>
                <span></span>
                {CAP_WEEKS.map((w) => <span key={w} style={{ fontSize: 11, fontWeight: 700, color: 'var(--bq-faint)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.5 }}>{w}</span>)}
                {crews.map((c) => (
                  <React.Fragment key={c.name}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--bq-faint)' }}>{c.role}</div>
                    </div>
                    {c.weeks.map((alloc, i) => <CapCell key={i} alloc={alloc}></CapCell>)}
                  </React.Fragment>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--bq-border)' }}>
                {Object.keys(CAP_JOBS).map((k) => (
                  <span key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--bq-muted)' }}><span style={{ width: 11, height: 11, borderRadius: 3, background: CAP_JOBS[k][1] }}></span>{CAP_JOBS[k][0]}</span>
                ))}
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--bq-muted)' }}><span style={{ width: 11, height: 11, borderRadius: 3, boxShadow: '0 0 0 2px var(--bq-brand)' }}></span>Overbooked</span>
              </div>
            </section>
          ) : (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--bq-muted)' }}>Week of</span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {CAP_WEEKS.map((w, i) => (
                    <button key={w} onClick={() => setWk(i)} className={'bq-chip' + (wk === i ? ' brand' : '')} style={{ border: 'none', cursor: 'pointer', font: 'inherit', padding: '6px 13px' }}>{w}</button>
                  ))}
                </div>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--bq-faint)', display: 'flex', alignItems: 'center', gap: 6 }}><BqIcon d="M5 9 H15 M5 9 L8 6 M5 9 L8 12 M19 15 H9 M19 15 L16 12 M19 15 L16 18" size={14}></BqIcon>Drag a job card onto a crew to reassign</span>
              </div>
              <CapBoard crews={crews} setCrews={setCrews} wk={wk} dragRef={dragRef}></CapBoard>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
window.HifiCapacity = HifiCapacity;

// ════════════════════════════ MATERIAL PROCUREMENT ════════════════════════════
const PROC_STATUS = {
  needed: ['brand', 'Order now'],
  quote: ['ai', 'Quoting'],
  ordered: ['', 'Ordered'],
  shipped: ['ai', 'In transit'],
  delivered: ['good', 'Delivered'],
};
const PROC_ORDERS = [
  { id: 'p1', item: 'Shaker cabinets (38 LF) + island', supplier: 'Timberline Cabinetry', project: 'Henderson', total: 42600, status: 'needed', eta: 'Order by Jun 20', lead: '8 wk lead' },
  { id: 'p2', item: 'Quartz slabs - level 2 (3 slabs)', supplier: 'StoneWorks', project: 'Henderson', total: 10400, status: 'quote', eta: 'Quote due Jun 18', lead: 'template first' },
  { id: 'p3', item: 'Andersen 100 windows ×4', supplier: 'BFS Pro Desk', project: 'Tanaka', total: 8200, status: 'ordered', eta: 'ETA Jul 2', lead: 'confirmed' },
  { id: 'p4', item: 'LVP flooring - 1,240 sf', supplier: 'Galleria Flooring', project: 'Alvarez', total: 6180, status: 'shipped', eta: 'Arrives Jun 19', lead: 'on truck' },
  { id: 'p5', item: 'Framing lumber package', supplier: 'BFS Pro Desk', project: 'Osorio', total: 14250, status: 'delivered', eta: 'Delivered Jun 11', lead: '' },
  { id: 'p6', item: 'Plumbing fixtures - hall bath', supplier: 'Ferguson', project: 'Henderson', total: 3800, status: 'delivered', eta: 'Delivered Jun 9', lead: '' },
];
const PROC_SUPPLIERS = [
  ['BFS Pro Desk', 'Lumber, windows, drywall', '2–5 days', '96%', 'good'],
  ['Timberline Cabinetry', 'Custom + semi-custom cabinets', '6–8 weeks', '92%', 'good'],
  ['StoneWorks', 'Quartz / granite counters', '2 wk after template', '88%', null],
  ['Ferguson', 'Plumbing + lighting fixtures', '1–10 days', '94%', 'good'],
  ['Galleria Flooring', 'LVP, tile, hardwood', '3–7 days', '81%', 'warn'],
];

function HifiProcurement() {
  const [tab, setTab] = React.useState('orders');
  const [orders, setOrders] = React.useState(PROC_ORDERS);
  const [adding, setAdding] = React.useState(false);
  const open = orders.filter((o) => o.status !== 'delivered');
  const committed = orders.filter((o) => o.status !== 'needed' && o.status !== 'quote').reduce((a, o) => a + o.total, 0);
  const cols = '2fr 1.3fr 0.9fr 1fr 1.1fr 1.1fr';

  return (
    <div className="bq-screen">
      <BqTop crumb="Material procurement" right={<React.Fragment><button className="bq-btn soft-ai sm"><BqSpark size={12}></BqSpark>Order from estimate</button><button className="bq-btn primary sm" onClick={() => setAdding(true)}>+ New order</button></React.Fragment>}></BqTop>
      {adding ? <BqQuickForm title="New material order" sub="Track a purchase order through delivery." saveLabel="Add order" fields={[{ k: 'item', label: 'Item / description', req: true, ph: 'e.g. Shaker cabinets (38 LF)' }, { k: 'supplier', label: 'Supplier', type: 'select', options: PROC_SUPPLIERS.map((s) => s[0]).concat('Other') }, { k: 'project', label: 'Project', ph: 'e.g. Henderson' }, { k: 'total', label: 'Total', type: 'number', prefix: '$', ph: '0' }]} onClose={() => setAdding(false)} onSave={(v) => { setOrders((os) => os.concat({ id: 'p' + Date.now(), item: v.item, supplier: v.supplier || 'TBD', project: v.project || '-', total: parseFloat(v.total) || 0, status: 'needed', eta: 'Set timing', lead: '' })); setTab('orders'); setAdding(false); }}></BqQuickForm> : null}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Procurement"></BqSide>
        <main style={{ flex: 1, padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))', overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span className="bq-display" style={{ fontSize: 20 }}>Materials & ordering</span>
            <span style={{ fontSize: 13, color: 'var(--bq-muted)' }}>{open.length} open orders · {bqMoney(committed)} committed</span>
          </div>
          <div style={{ display: 'flex', gap: 'calc(12px * var(--bq-sp))', flexWrap: 'wrap' }}>
            <BqKPI label="Needs ordering" value="2" sub="1 long-lead item" tone="warn"></BqKPI>
            <BqKPI label="In transit" value="2" sub="arriving this week" tone="ai"></BqKPI>
            <BqKPI label="Committed spend" value={bqMoney(committed)} sub="ordered + delivered"></BqKPI>
            <BqKPI label="On-time delivery" value="91%" sub="last 90 days" tone="good"></BqKPI>
          </div>

          <section className="bq-ai-card ai-expanded" style={{ padding: '13px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <BqSpark></BqSpark>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: 'var(--bq-ai-strong)', marginBottom: 3 }}>Order Henderson cabinets by Jun 20 to protect the schedule</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)', lineHeight: 1.5 }}>Cabinets have an <b>8-week lead</b> and install is scheduled the week of <b>Aug 18</b>. The client's selection is locked - the PO is ready to send to Timberline.</div>
            </div>
            <button className="bq-btn ai sm">Send PO</button>
          </section>

          <div className="seg-toggle" style={{ alignSelf: 'flex-start' }}>
            <button className={tab === 'orders' ? 'on' : ''} onClick={() => setTab('orders')}>Orders</button>
            <button className={tab === 'suppliers' ? 'on' : ''} onClick={() => setTab('suppliers')}>Suppliers</button>
          </div>

          {tab === 'orders' ? (
            <section className="bq-card-s" style={{ overflow: 'hidden' }}>
              <div className="bq-trow head" style={{ gridTemplateColumns: cols }}>
                <span>Item</span><span>Supplier</span><span>Project</span><span>Total</span><span>Status</span><span>Timing</span>
              </div>
              {orders.map((o) => (
                <div key={o.id} className="bq-trow" style={{ gridTemplateColumns: cols, alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>{o.item}</span>
                  <span style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{o.supplier}</span>
                  <span className="bq-chip" style={{ justifySelf: 'start' }}>{o.project}</span>
                  <span className="cell-num">{bqMoney(o.total)}</span>
                  <span className={'bq-chip ' + PROC_STATUS[o.status][0]} style={{ justifySelf: 'start' }}>{PROC_STATUS[o.status][1]}</span>
                  <span style={{ fontSize: 12, color: o.status === 'needed' ? 'var(--bq-brand-strong)' : 'var(--bq-muted)', fontWeight: o.status === 'needed' ? 600 : 400 }}>{o.eta}{o.lead ? ' · ' + o.lead : ''}</span>
                </div>
              ))}
            </section>
          ) : (
            <section className="bq-card-s" style={{ overflow: 'hidden' }}>
              <div className="bq-trow head" style={{ gridTemplateColumns: '1.4fr 1.8fr 1fr 0.9fr' }}>
                <span>Supplier</span><span>Supplies</span><span>Lead time</span><span>On-time</span>
              </div>
              {PROC_SUPPLIERS.map(([name, supplies, lead, ontime, tone]) => (
                <div key={name} className="bq-trow" style={{ gridTemplateColumns: '1.4fr 1.8fr 1fr 0.9fr', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <span style={{ width: 28, height: 28, borderRadius: 8, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-subtle)', color: 'var(--bq-muted)' }}><BqIcon d={BQ_GLYPH.vendor} size={15}></BqIcon></span>
                    <span style={{ fontWeight: 600 }}>{name}</span>
                  </div>
                  <span style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>{supplies}</span>
                  <span style={{ fontSize: 12.5 }}>{lead}</span>
                  <span className={'bq-chip ' + (tone === 'good' ? 'good' : tone === 'warn' ? 'brand' : '')} style={{ justifySelf: 'start' }}>{ontime}</span>
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
window.HifiProcurement = HifiProcurement;
