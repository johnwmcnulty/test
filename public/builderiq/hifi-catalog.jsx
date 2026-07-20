// BuilderIQ - Cost catalog (price book) manager + Plan takeoff

// ════════════════════════════ COST CATALOG ════════════════════════════
const CAT_GROUPS = [
  ['All items', 'catalog'],
  ['Labor rates', 'partners'],
  ['Materials', 'vendor'],
  ['Subcontractor', 'hardhat'],
  ['Assemblies', 'template'],
];
const CAT_ITEMS = [
  { id: 'c1', cat: 'Labor rates', name: 'Lead carpenter', unit: '/ hr', cost: 78, markup: 0, updated: 'Jan 2026', src: 'Set by you' },
  { id: 'c2', cat: 'Labor rates', name: 'Carpenter', unit: '/ hr', cost: 62, markup: 0, updated: 'Jan 2026', src: 'Set by you' },
  { id: 'c3', cat: 'Labor rates', name: 'Laborer', unit: '/ hr', cost: 44, markup: 0, updated: 'Jan 2026', src: 'Set by you' },
  { id: 'c4', cat: 'Materials', name: '2×4 stud, 8ft KD', unit: '/ ea', cost: 4.85, markup: 15, updated: '2 days ago', src: 'BFS feed', drift: true },
  { id: 'c5', cat: 'Materials', name: '½" drywall, 4×8 sheet', unit: '/ ea', cost: 16.20, markup: 15, updated: '2 days ago', src: 'BFS feed', drift: true },
  { id: 'c6', cat: 'Materials', name: 'Shaker cabinet, painted maple', unit: '/ LF', cost: 312, markup: 18, updated: '3 wk ago', src: 'Vendor quote' },
  { id: 'c7', cat: 'Materials', name: 'Quartz countertop, level 2', unit: '/ sf', cost: 64, markup: 20, updated: '3 wk ago', src: 'StoneWorks' },
  { id: 'c8', cat: 'Materials', name: 'LVP flooring, 7" plank', unit: '/ sf', cost: 3.40, markup: 22, updated: '1 mo ago', src: 'Vendor quote' },
  { id: 'c9', cat: 'Subcontractor', name: 'Electrical rough + finish', unit: '/ opening', cost: 165, markup: 12, updated: '2 mo ago', src: 'Bright Electric' },
  { id: 'c10', cat: 'Subcontractor', name: 'Plumbing fixture set', unit: '/ ea', cost: 480, markup: 12, updated: '2 mo ago', src: 'Reliant Plumbing' },
];
const CAT_ASSEMBLIES = [
  { name: 'Cabinetry & install', driver: 'per LF of run', unit: 'LF', cost: 1121, lines: ['Shaker cabinet box + doors', 'Install labor (1.4 hr/LF)', 'Soft-close hardware allowance'] },
  { name: 'Tub-to-shower conversion', driver: 'per bath', unit: 'ea', cost: 8200, lines: ['Demo + haul', 'Pan + waterproofing', 'Tile + trim (allowance)', 'Plumbing fixture set', 'Glass enclosure'] },
  { name: 'Kitchen demo & disposal', driver: 'per kitchen', unit: 'ea', cost: 4200, lines: ['Cabinet + counter removal', 'Flooring tear-out', 'Dumpster + haul', 'Dust protection'] },
  { name: 'Recessed can lighting', driver: 'per fixture', unit: 'ea', cost: 185, lines: ['Fixture + trim', 'Electrical labor', 'Drywall patch'] },
];

function CatCell({ value, prefix, suffix, onChange, w }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      {prefix ? <span style={{ fontSize: 12.5, color: 'var(--bq-faint)' }}>{prefix}</span> : null}
      <input className="cellbox" value={value} onChange={(e) => onChange(e.target.value)} style={{ width: w || 56, textAlign: 'right' }}></input>
      {suffix ? <span style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{suffix}</span> : null}
    </span>
  );
}

function HifiCatalog() {
  const clean = window.bqClean();
  const [grp, setGrp] = React.useState('All items');
  const [q, setQ] = React.useState('');
  const [items, setItems] = window.bqPersistState('catalog-items', window.bqSample(CAT_ITEMS));
  const assemblies = window.bqSample(CAT_ASSEMBLIES);
  const set = (id, key, v) => setItems((it) => it.map((x) => x.id === id ? { ...x, [key]: v, updated: 'Just now' } : x));
  const remove = (id) => setItems((it) => it.filter((x) => x.id !== id));
  const fileRef = React.useRef(null);
  const [adding, setAdding] = React.useState(false);
  const addCat = (grp !== 'All items' && grp !== 'Assemblies') ? grp : 'Materials';
  const addItem = (v) => {
    const cat = v.cat || addCat;
    setItems((it) => it.concat({ id: 'c' + Date.now(), cat, name: v.name.trim(), unit: v.unit || '/ ea', cost: parseFloat(v.cost) || 0, markup: parseFloat(v.markup) || 0, updated: 'Just now', src: 'Set by you' }));
    if (grp !== 'All items' && cat !== grp) setGrp('All items');
    setQ(''); setAdding(false);
  };
  React.useEffect(() => { setItems((it) => { const c = it.filter((x) => (x.name && String(x.name).trim()) || x.cost || x.markup); return c.length === it.length ? it : c; }); }, []);
  const importCSV = (file) => {
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      const lines = String(r.result).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      const add = [];
      lines.forEach((line, i) => {
        const c = line.split(',').map((s) => s.trim());
        if (i === 0 && /name/i.test(c[0])) return;
        if (!c[0]) return;
        add.push({ id: 'c' + Date.now() + '-' + i, cat: c[4] || 'Materials', name: c[0], unit: c[1] || '/ ea', cost: parseFloat(c[2]) || 0, markup: parseFloat(c[3]) || 0, updated: 'Imported', src: 'CSV import' });
      });
      if (add.length) { setItems((it) => it.concat(add)); setGrp('All items'); setQ(''); }
    };
    r.readAsText(file);
  };
  const sell = (it) => it.cost * (1 + (parseFloat(it.markup) || 0) / 100);
  const ql = q.toLowerCase();
  const filtered = items.filter((it) => (grp === 'All items' || it.cat === grp) && (!q || it.name.toLowerCase().includes(ql)));
  const isAssembly = grp === 'Assemblies';
  const cols = '2.2fr 0.8fr 1fr 0.9fr 1fr 1.1fr 30px';

  return (
    <div className="bq-screen">
      <BqTop crumb="Cost catalog · price book" right={<React.Fragment><input ref={fileRef} type="file" accept=".csv,text/csv" style={{ display: 'none' }} onChange={(e) => { importCSV(e.target.files[0]); e.target.value = ''; }}></input><button className="bq-btn sm" onClick={() => fileRef.current && fileRef.current.click()}><BqIcon d={BQ_GLYPH.exports} size={13}></BqIcon>Import CSV</button><button className="bq-btn primary sm" onClick={() => setAdding(true)}>+ Add item</button></React.Fragment>}></BqTop>
      {adding ? <BqQuickForm title="Add catalog item" sub="A labor rate, material, or sub cost your estimates can pull from." saveLabel="Add item" fields={[{ k: 'name', label: 'Item name', req: true, ph: 'e.g. Lead carpenter' }, { k: 'cat', label: 'Category', type: 'select', options: ['Labor rates', 'Materials', 'Subcontractor'], def: addCat }, { k: 'unit', label: 'Unit', def: '/ ea', ph: '/ hr, / sf, / LF…' }, { k: 'cost', label: 'Your cost', type: 'number', prefix: '$', ph: '0' }, { k: 'markup', label: 'Markup %', type: 'number', ph: '0' }]} onClose={() => setAdding(false)} onSave={addItem}></BqQuickForm> : null}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Cost Catalog"></BqSide>
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          {/* category rail */}
          <div style={{ width: 210, flex: 'none', borderRight: '1px solid var(--bq-border)', background: 'var(--bq-card)', padding: '16px 10px', overflow: 'auto' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: 'var(--bq-faint)', padding: '0 10px 8px' }}>Catalog</div>
            {CAT_GROUPS.map(([g, ic]) => {
              const n = g === 'All items' ? items.length : g === 'Assemblies' ? assemblies.length : items.filter((x) => x.cat === g).length;
              return (
                <div key={g} onClick={() => setGrp(g)} className={'nav-it' + (g === grp ? ' on' : '')} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 11, fontSize: 13, fontWeight: g === grp ? 600 : 500, color: g === grp ? 'var(--bq-brand-strong)' : 'var(--bq-muted)', background: g === grp ? 'var(--bq-brand-soft)' : 'transparent', cursor: 'pointer' }}>
                  <BqIcon d={BQ_GLYPH[ic]} size={15}></BqIcon><span style={{ flex: 1 }}>{g}</span><span style={{ fontSize: 11.5, color: 'var(--bq-faint)' }}>{n}</span>
                </div>
              );
            })}
          </div>

          <div style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(13px * var(--bq-sp))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div className="bq-display" style={{ fontSize: 20 }}>{grp}</div>
                <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>The numbers behind every estimate - edit once, every new quote uses it</div>
              </div>
              <div className="bq-search" style={{ width: 200, background: 'var(--bq-subtle)' }}>
                <BqIcon d={BQ_GLYPH.search} size={14}></BqIcon>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search catalog…" style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', font: 'inherit', fontSize: 12.5, color: 'var(--bq-ink)' }}></input>
              </div>
            </div>

            {clean ? null : (
            <section className="bq-ai-card ai-expanded" style={{ padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <BqSpark></BqSpark>
              <span style={{ fontSize: 13, color: 'var(--bq-ink)', flex: 1 }}>Your lumber supplier feed shows framing materials up <b>6%</b> in the last 2 weeks. <b>14 items</b> are now below market. Update them so new estimates stay accurate?</span>
              <button className="bq-btn ai sm">Apply +6% to lumber</button>
              <button className="bq-btn ghost sm">Review</button>
            </section>
            )}

            {isAssembly ? (
              assemblies.length ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {assemblies.map((a) => (
                  <div key={a.name} className="bq-card-s" style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 32, height: 32, borderRadius: 9, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bq-subtle)', color: 'var(--bq-muted)' }}><BqIcon d={BQ_GLYPH.template} size={16}></BqIcon></span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{a.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{a.lines.length} line items · priced {a.driver}</div>
                      </div>
                      <span className="bq-num" style={{ fontSize: 16 }}>{bqMoney(a.cost)}<span style={{ fontSize: 11.5, color: 'var(--bq-faint)', fontWeight: 500 }}> / {a.unit}</span></span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 11 }}>
                      {a.lines.map((l) => <span key={l} className="bq-chip">{l}</span>)}
                    </div>
                  </div>
                ))}
              </div>
              ) : (
                <BqEmpty icon={BQ_GLYPH.template} title="No assemblies yet" sub="Bundle common line items - a tub-to-shower conversion, a cabinet run - into reusable assemblies you can drop into any estimate."></BqEmpty>
              )
            ) : (
              <section className="bq-card-s" style={{ overflow: 'hidden' }}>
                <div className="bq-trow head" style={{ gridTemplateColumns: cols }}>
                  <span>Item</span><span>Unit</span><span>Your cost</span><span>Markup</span><span>Sell price</span><span>Updated</span><span></span>
                </div>
                {filtered.map((it) => (
                  <div key={it.id} className="bq-trow" style={{ gridTemplateColumns: cols, alignItems: 'center' }}>
                    <div style={{ minWidth: 0 }}>
                      <input className="cellbox" value={it.name} onChange={(e) => set(it.id, 'name', e.target.value)} placeholder="Item name…" style={{ fontWeight: 600, textAlign: 'left' }}></input>
                      <div style={{ fontSize: 11.5, color: 'var(--bq-faint)', paddingLeft: 8 }}>{it.cat}</div>
                    </div>
                    <input className="cellbox" value={it.unit} onChange={(e) => set(it.id, 'unit', e.target.value)} style={{ textAlign: 'left', fontSize: 12.5 }}></input>
                    <CatCell value={it.cost} prefix="$" onChange={(v) => set(it.id, 'cost', parseFloat(v) || 0)}></CatCell>
                    <CatCell value={it.markup} suffix="%" w={42} onChange={(v) => set(it.id, 'markup', parseFloat(v) || 0)}></CatCell>
                    <span className="bq-num" style={{ fontSize: 13.5 }}>${sell(it).toFixed(2)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--bq-faint)' }}>
                      {it.drift ? <span className="bq-chip brand" style={{ fontSize: 10.5, padding: '0 7px' }}>drift</span> : null}{it.src}
                    </span>
                    <button title="Remove item" onClick={() => remove(it.id)} onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bq-subtle)'; e.currentTarget.style.color = 'var(--bq-ink)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--bq-faint)'; }} style={{ width: 24, height: 24, borderRadius: 7, border: 'none', background: 'transparent', color: 'var(--bq-faint)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', justifySelf: 'center' }}><BqIcon d="M6 6 L18 18 M18 6 L6 18" size={13} sw={2}></BqIcon></button>
                  </div>
                ))}
                {!filtered.length ? (!q ? <BqEmpty icon={BQ_GLYPH.catalog} title={items.length ? 'Nothing in ' + grp + ' yet' : 'Build your price book'} sub="Add your labor rates, materials, and sub costs once - every new estimate pulls from them, so your numbers stay consistent." actionLabel="Add item" onAction={() => setAdding(true)}></BqEmpty> : <div style={{ padding: 26, textAlign: 'center', fontSize: 13, color: 'var(--bq-faint)' }}>No items match “{q}”.</div>) : null}
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
window.HifiCatalog = HifiCatalog;

// ════════════════════════════ PLAN TAKEOFF ════════════════════════════
// measured quantities pulled off the plan → mapped to catalog assemblies → into the estimate
const TO_MEASURE = [
  { id: 'm1', tool: 'area', room: 'Kitchen', qty: '310 sf', maps: 'Flooring + demo', cost: 9840, color: '#7C3AED' },
  { id: 'm2', tool: 'linear', room: 'Cabinet run', qty: '38 LF', maps: 'Cabinetry & install', cost: 42600, color: '#F97316' },
  { id: 'm3', tool: 'linear', room: 'Countertop edge', qty: '26 LF', maps: 'Quartz, level 2', cost: 10400, color: '#4D7C0F' },
  { id: 'm4', tool: 'count', room: 'Recessed cans', qty: '8 ea', maps: 'Can lighting', cost: 1480, color: '#2563EB' },
  { id: 'm5', tool: 'area', room: 'Hall bath', qty: '46 sf', maps: 'Tub→shower + tile', cost: 16400, color: '#DB2777' },
  { id: 'm6', tool: 'count', room: 'Windows', qty: '4 ea', maps: 'Verify - not priced', cost: 0, color: '#A39B8B' },
];
const TO_TOOLS = [['area', 'Area', 'select'], ['linear', 'Linear', 'ruler'], ['count', 'Count', 'task'], ['calibrate', 'Calibrate', 'gauge']];

function HifiTakeoff() {
  const [tool, setTool] = React.useState('linear');
  const [done, setDone] = React.useState(false);
  const total = TO_MEASURE.reduce((a, m) => a + m.cost, 0);

  return (
    <div className="bq-screen">
      <BqTop crumb="Plan takeoff" right={<React.Fragment><span className="bq-chip">Henderson - Plan set Rev C</span><button className="bq-btn primary sm" onClick={() => window.__bqNav && window.__bqNav('Estimates')}>Push to estimate →</button></React.Fragment>}></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Takeoff"></BqSide>
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          {/* plan canvas */}
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--bq-border)', background: 'var(--bq-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 18px', background: 'var(--bq-card)', borderBottom: '1px solid var(--bq-border)', flex: 'none' }}>
              <span style={{ fontWeight: 700, fontSize: 13.5, marginRight: 6 }}>Measure</span>
              <div className="seg-toggle">
                {TO_TOOLS.map(([t, lbl, ic]) => (
                  <button key={t} className={tool === t ? 'on' : ''} onClick={() => setTool(t)}><BqIcon d={BQ_GLYPH[ic]} size={13} style={{ marginRight: 4, verticalAlign: '-2px' }}></BqIcon>{lbl}</button>
                ))}
              </div>
              <span style={{ flex: 1 }}></span>
              <span style={{ fontSize: 12, color: 'var(--bq-faint)' }}>Scale: ¼" = 1'-0"</span>
            </div>
            <div style={{ flex: 1, padding: 22, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: 560, aspectRatio: '4 / 3' }}>
                <BqPh h="100%" label="Kitchen + hall-bath plan - Rev C" style={{ width: '100%', height: '100%' }}></BqPh>
                {/* measurement overlays */}
                <div style={{ position: 'absolute', left: '12%', top: '18%', width: '46%', height: '40%', border: '2px solid #7C3AED', background: 'rgba(124,58,237,0.12)', borderRadius: 4 }}><span style={{ position: 'absolute', top: 4, left: 6, fontSize: 11, fontWeight: 700, color: '#fff', background: '#7C3AED', borderRadius: 5, padding: '1px 6px' }}>Kitchen · 310 sf</span></div>
                <div style={{ position: 'absolute', left: '12%', top: '16%', width: '46%', height: 0, borderTop: '3px solid #F97316' }}><span style={{ position: 'absolute', top: -19, left: '38%', fontSize: 11, fontWeight: 700, color: '#fff', background: '#F97316', borderRadius: 5, padding: '1px 6px' }}>38 LF cabinets</span></div>
                <div style={{ position: 'absolute', left: '64%', top: '60%', width: '24%', height: '24%', border: '2px solid #DB2777', background: 'rgba(219,39,119,0.12)', borderRadius: 4 }}><span style={{ position: 'absolute', bottom: 4, left: 6, fontSize: 11, fontWeight: 700, color: '#fff', background: '#DB2777', borderRadius: 5, padding: '1px 6px' }}>Hall bath · 46 sf</span></div>
                {[['24%', '30%'], ['34%', '30%'], ['44%', '30%'], ['54%', '46%']].map(([l, t], i) => (
                  <span key={i} style={{ position: 'absolute', left: l, top: t, width: 22, height: 22, borderRadius: '50%', background: '#2563EB', color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.25)' }}>{i + 1}</span>
                ))}
              </div>
            </div>
          </div>

          {/* takeoff list */}
          <div style={{ width: 340, flex: 'none', overflow: 'auto', padding: 'calc(16px * var(--bq-sp)) 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <div className="bq-display" style={{ fontSize: 18 }}>Takeoff</div>
              <div style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>Quantities measured off the plan, mapped to your catalog</div>
            </div>

            <div className="bq-ai-card ai-expanded" style={{ padding: '11px 13px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><BqSpark size={13}></BqSpark><span style={{ fontWeight: 700, fontSize: 12.5, color: 'var(--bq-ai-strong)' }}>Auto-detected from the PDF</span></div>
              <span style={{ fontSize: 12, color: 'var(--bq-muted)', lineHeight: 1.45 }}>Found 5 rooms, a 38 LF cabinet run, and 4 windows. Map them to assemblies and the quantities flow straight into the estimate.</span>
              {done ? <span className="bq-chip good" style={{ alignSelf: 'flex-start' }}>Mapped to assemblies ✓</span> : <button className="bq-btn ai sm" style={{ alignSelf: 'flex-start' }} onClick={() => setDone(true)}>Map all</button>}
            </div>

            <div className="bq-card-s" style={{ overflow: 'hidden' }}>
              {TO_MEASURE.map((m, i) => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 14px', borderTop: i ? '1px solid var(--bq-border)' : 'none' }}>
                  <span style={{ width: 9, height: 9, borderRadius: 3, background: m.color, flex: 'none' }}></span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{m.room} · {m.qty}</div>
                    <div style={{ fontSize: 11.5, color: m.cost ? 'var(--bq-faint)' : 'var(--bq-brand-strong)' }}>{m.maps}</div>
                  </div>
                  <span className="bq-num" style={{ fontSize: 13 }}>{m.cost ? bqMoney(m.cost) : '-'}</span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', borderTop: '1px solid var(--bq-border)', background: 'var(--bq-subtle)' }}>
                <span style={{ fontWeight: 700, fontSize: 13, flex: 1 }}>Takeoff subtotal</span>
                <span className="bq-num" style={{ fontSize: 16, color: 'var(--bq-brand-strong)' }}>{bqMoney(total)}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
window.HifiTakeoff = HifiTakeoff;
