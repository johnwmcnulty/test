// Hi-fi Client portal - direction A: living timeline (homeowner-facing)
function PortalUpdate({ week, when, body, photos, drafted }) {
  return (
    <article className="bq-card-s" style={{ padding: 'calc(18px * var(--bq-sp)) 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="bq-avatar">MH</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{week}</div>
          <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>Mike Hartwell · {when}</div>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: 'var(--bq-ink)' }}>{body}</p>
      {photos ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: 8 }}>
          <BqPh h={120} label="north wall tile"></BqPh>
          <BqPh h={120} label="island rough-in"></BqPh>
          <BqPh h={120} label="bath waterproofing"></BqPh>
        </div>
      ) : null}
      {drafted ? <div style={{ fontSize: 11, color: 'var(--bq-faint)', display: 'flex', alignItems: 'center', gap: 5 }}><BqSpark size={11}></BqSpark>Drafted with BuilderIQ · reviewed and sent by Mike</div> : null}
    </article>
  );
}

function HifiPortal() {
  return (
    <div className="bq-screen" style={{ background: '#F4F1EB' }}>
      <header style={{ background: 'var(--bq-card)', borderBottom: '1px solid var(--bq-border)', padding: 'calc(16px * var(--bq-sp)) 32px', display: 'flex', alignItems: 'center', gap: 16, flex: 'none' }}>
        <span className="bq-logomark" style={{ background: 'var(--bq-ink)' }}><span style={{ color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12 }}>HB</span></span>
        <div>
          <div className="bq-display" style={{ fontSize: 18 }}>Your remodel - week 6 of 14</div>
          <div style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>Hartwell Builders · Mike is your project lead</div>
        </div>
        <span style={{ flex: 1 }}></span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 220 }}>
          <BqMeter pct={43} tone="warn" style={{ flex: 1 }}></BqMeter>
          <span className="bq-num" style={{ fontSize: 15 }}>43%</span>
        </div>
        <span className="bq-chip good">On track · done Nov 18</span>
      </header>

      <div style={{ flex: 1, display: 'flex', gap: 20, padding: 'calc(20px * var(--bq-sp)) 32px', overflow: 'hidden' }}>
        <main style={{ flex: 1.5, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>
          <PortalUpdate
            week="Week 6 update"
            when="Friday 4:02 pm"
            body="Big week - all the wall tile in the kitchen is up and grouted, and the hall bath is waterproofed and ready for tile Monday. Electrical rough-in passed inspection on the first visit. Cabinets arrive Tuesday; we'll stage them in the garage."
            photos drafted></PortalUpdate>
          <section className="bq-card-s" style={{ padding: 'calc(16px * var(--bq-sp)) 20px' }}>
            <div className="bq-sechead" style={{ marginBottom: 10 }}><span className="t">What's happening next week</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13.5 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><span style={{ width: 64, color: 'var(--bq-faint)', fontWeight: 600, fontSize: 12 }}>Mon–Tue</span>Cabinet install begins</div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><span style={{ width: 64, color: 'var(--bq-faint)', fontWeight: 600, fontSize: 12 }}>Wed</span>Countertop template visit<span className="bq-chip brand">we'll need you home</span></div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><span style={{ width: 64, color: 'var(--bq-faint)', fontWeight: 600, fontSize: 12 }}>Fri</span>Electrical trim inspection</div>
            </div>
          </section>
        </main>

        <aside style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>
          <section className="bq-card-s" style={{ padding: 'calc(16px * var(--bq-sp)) 18px', boxShadow: '0 0 0 2px var(--bq-brand)' }}>
            <div className="bq-sechead" style={{ marginBottom: 10 }}>
              <span className="t">Needs your pick</span>
              <span className="bq-chip brand">due Tue</span>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <BqPh h={52} style={{ width: 52, flex: 'none' }} label=""></BqPh>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>Hall bath faucet</div>
                <div style={{ fontSize: 12, color: 'var(--bq-muted)' }}>3 options within your allowance</div>
              </div>
              <button className="bq-btn primary sm">Choose</button>
            </div>
          </section>

          <section className="bq-card-s" style={{ padding: 'calc(16px * var(--bq-sp)) 18px' }}>
            <div className="bq-sechead" style={{ marginBottom: 10 }}><span className="t">Money</span><span className="a">Full statement</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 12.5, color: 'var(--bq-muted)' }}>Paid to date</span>
                <span className="bq-num" style={{ fontSize: 18 }}>$96,400</span>
              </div>
              <BqMeter pct={52} tone="warn"></BqMeter>
              <div style={{ fontSize: 12, color: 'var(--bq-faint)' }}>Next draw $24,000 at cabinet completion · contract $186,400 + $9,250 in approved changes</div>
            </div>
          </section>

          <section className="bq-card-s" style={{ padding: 'calc(16px * var(--bq-sp)) 18px', flex: 1, overflow: 'hidden' }}>
            <div className="bq-sechead" style={{ marginBottom: 10 }}><span className="t">All photos</span><span className="a">142 →</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <BqPh h={56} label=""></BqPh><BqPh h={56} label=""></BqPh><BqPh h={56} label=""></BqPh>
              <BqPh h={56} label=""></BqPh><BqPh h={56} label=""></BqPh><BqPh h={56} label=""></BqPh>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
window.HifiPortal = HifiPortal;
