// Hi-fi Selections center - status pipeline, allowance/budget+schedule impact, AI reminder
const SEL_ITEMS = [
  { room: 'Kitchen', cat: 'Countertops', title: 'Quartz slab', vendor: 'StoneWorks', allowance: 8900, picked: 'Calacatta Laza, mitered edge', cost: 10350, status: 'Awaiting client', due: 'Jun 18', cv: true, sched: '+0d' },
  { room: 'Kitchen', cat: 'Cabinet hardware', title: 'Pulls + knobs', vendor: 'Top Knobs', allowance: 1400, picked: 'Matte black bar pulls', cost: 1280, status: 'Approved', due: 'Jun 14', cv: true, sched: '+0d' },
  { room: 'Kitchen', cat: 'Plumbing fixture', title: 'Faucet', vendor: 'Ferguson', allowance: 650, picked: 'Matte black pull-down', cost: 690, status: 'Options sent', due: 'Jun 20', cv: true, sched: '+0d' },
  { room: 'Kitchen', cat: 'Appliances', title: 'Induction range + hood', vendor: 'AJ Madison', allowance: 6200, picked: '-', cost: 0, status: 'Not started', due: 'Jun 25', cv: true, sched: '+2d' },
  { room: 'Hall Bath', cat: 'Tile', title: 'Floor + shower tile', vendor: 'Architectural Tile', allowance: 3100, picked: 'Zellige + hex mosaic', cost: 4480, status: 'Awaiting client', due: 'Jun 16', cv: true, sched: '+3d' },
  { room: 'Hall Bath', cat: 'Vanity', title: 'Vanity + top', vendor: 'Signature Hardware', allowance: 2400, picked: 'Walnut 48" w/ quartz', cost: 2390, status: 'Ordered', due: 'Jun 10', cv: true, sched: '+0d' },
];
const SEL_STATUS = { 'Not started': 'muted', 'Options sent': 'ai', 'Awaiting client': 'warn', Approved: 'good', Ordered: 'good', Installed: 'good' };

function SelCard({ s, onRemind }) {
  const fmt = (n) => '$' + n.toLocaleString('en-US');
  const over = s.cost - s.allowance;
  const tone = SEL_STATUS[s.status] || 'muted';
  return (
    <div className="bq-card-s" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <BqPh h={108} label={s.room + ' · ' + s.cat}></BqPh>
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{s.title}</div>
            <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>{s.room} · {s.vendor}</div>
          </div>
          <span className={'bq-chip ' + tone}>{s.status}</span>
        </div>
        <div style={{ fontSize: 13, color: s.picked === '-' ? 'var(--bq-faint)' : 'var(--bq-ink)' }}>
          {s.picked === '-' ? 'No option selected yet' : s.picked}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontSize: 12.5 }}>
          <span style={{ color: 'var(--bq-faint)' }}>Allowance</span>
          <span className="bq-num" style={{ fontSize: 15 }}>{fmt(s.allowance)}</span>
          {s.cost > 0 ? <span style={{ color: 'var(--bq-faint)' }}>· picked <b className="bq-num" style={{ color: over > 0 ? 'var(--bq-brand-strong)' : 'var(--bq-good)' }}>{fmt(s.cost)}</b></span> : null}
        </div>
        {over > 0 ? (
          <div style={{ background: 'var(--bq-brand-soft)', borderRadius: 10, boxShadow: 'inset 0 0 0 1px var(--bq-brand-border)', padding: '8px 11px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <BqIcon d="M12 4 L21 19 H3 Z M12 10 V14 M12 16.5 V16.6" size={15} style={{ color: 'var(--bq-brand-strong)', flex: 'none' }}></BqIcon>
            <span style={{ fontSize: 12, color: 'var(--bq-brand-strong)', lineHeight: 1.35, flex: 1 }}>Over allowance by <b>{fmt(over)}</b>{s.sched !== '+0d' ? ' · ' + s.sched + ' to schedule' : ''}</span>
            <button className="bq-btn sm" style={{ flex: 'none' }} onClick={() => window.__bqNav && window.__bqNav('Change Orders')}>Change order</button>
          </div>
        ) : null}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4 }}>
          <span style={{ fontSize: 12, color: 'var(--bq-faint)' }}>Due {s.due}</span>
          {s.status === 'Awaiting client' || s.status === 'Options sent' ? (
            <button className="bq-btn soft-ai sm" style={{ marginLeft: 'auto' }} onClick={() => onRemind(s)}><BqSpark size={11}></BqSpark>Remind client</button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function HifiSelections() {
  const [filter, setFilter] = React.useState('All');
  const [remind, setRemind] = React.useState(null);
  const filters = ['All', 'Awaiting client', 'Options sent', 'Approved', 'Over allowance'];
  const fmt = (n) => '$' + n.toLocaleString('en-US');
  const shown = SEL_ITEMS.filter((s) => filter === 'All' ? true : filter === 'Over allowance' ? (s.cost - s.allowance) > 0 : s.status === filter);
  const decisions = SEL_ITEMS.filter((s) => s.status === 'Awaiting client' || s.status === 'Options sent').length;
  const overTotal = SEL_ITEMS.reduce((a, s) => a + Math.max(0, s.cost - s.allowance), 0);

  return (
    <div className="bq-screen">
      <BqTop crumb="Projects / Henderson / Selections"></BqTop>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <BqSide active="Selections" alerts={{ Selections: decisions }}></BqSide>
        <main style={{ flex: 1, overflow: 'auto', padding: 'calc(18px * var(--bq-sp)) 24px', display: 'flex', flexDirection: 'column', gap: 'calc(14px * var(--bq-sp))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div className="bq-display" style={{ fontSize: 22 }}>Selections</div>
              <div style={{ fontSize: 13, color: 'var(--bq-muted)' }}>Henderson - Kitchen + Hall Bath · {decisions} awaiting a client decision</div>
            </div>
            <button className="bq-btn primary sm"><BqIcon d="M12 5 V19 M5 12 H19" size={14}></BqIcon>New selection</button>
          </div>

          <div style={{ display: 'flex', gap: 'calc(12px * var(--bq-sp))', flexWrap: 'wrap' }}>
            <BqKPI label="Decisions needed" value={String(decisions)} sub="from the client" tone="ai"></BqKPI>
            <BqKPI label="Over allowance" value={fmt(overTotal)} sub="across 3 selections" tone="warn"></BqKPI>
            <BqKPI label="Allowance budget" value="$22,650" sub="kitchen + bath combined"></BqKPI>
          </div>

          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {filters.map((f) => (
              <button key={f} className={'bq-chip' + (filter === f ? ' brand' : '')} onClick={() => setFilter(f)} style={{ cursor: 'pointer', border: 'none', font: 'inherit', fontWeight: 600 }}>{f}</button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 'calc(14px * var(--bq-sp))' }}>
            {shown.map((s, i) => <SelCard key={i} s={s} onRemind={setRemind}></SelCard>)}
          </div>
        </main>
      </div>

      {remind ? (
        <div onClick={() => setRemind(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(38,35,30,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30 }}>
          <div onClick={(e) => e.stopPropagation()} className="bq-card-s" style={{ width: 'min(460px, 92%)', padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <BqSpark size={15}></BqSpark><span style={{ fontWeight: 700, fontSize: 15, color: 'var(--bq-ai-strong)' }}>AI selection reminder</span>
              <span className="bq-chip ai" style={{ marginLeft: 'auto' }}>Draft</span>
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--bq-muted)', marginBottom: 8 }}>To Dan &amp; Priya · re: {remind.title} ({remind.room}) · due {remind.due}</div>
            <div style={{ background: 'var(--bq-ai-soft)', borderRadius: 14, boxShadow: 'inset 0 0 0 1px var(--bq-ai-border)', padding: '13px 15px', fontSize: 13.5, color: 'var(--bq-ink)', lineHeight: 1.55 }}>
              Hi Priya - quick nudge on the <b>{remind.title.toLowerCase()}</b> for the {remind.room.toLowerCase()}. To keep cabinets and counters on schedule, we'd love your pick by <b>{remind.due}</b>. I've laid out the options in your portal - tap any one to approve. Happy to hop on a quick call if it helps. - Maria
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 14 }}>
              <button className="bq-btn ai sm" onClick={() => setRemind(null)}>Send reminder</button>
              <button className="bq-btn soft-ai sm">Soften tone</button>
              <button className="bq-btn ghost sm" style={{ marginLeft: 'auto' }} onClick={() => setRemind(null)}>Cancel</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
window.HifiSelections = HifiSelections;
