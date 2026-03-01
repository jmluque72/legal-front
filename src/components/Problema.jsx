export default function Problema() {
  const cards = [
    { text: 'Negativas de cobertura', bar: 'navy' },
    { text: 'Conflictos médicos complejos', bar: 'navy' },
    { text: 'Falta de claridad legal', bar: 'navy' },
  ]

  return (
    <>
      <div className="section-header" id="problema">
        <h2>Cuando la salud se vuelve un conflicto…</h2>
      </div>
      <section className="landing-problema">
        <p className="landing-problema-intro">
          Situaciones que podemos ayudarte a evaluar con criterio técnico:
        </p>
        <div className="landing-problema-grid landing-problema-grid--three">
          {cards.map((card, i) => (
            <div key={i} className="landing-problema-card">
              <div className={`bar ${card.bar === 'green' ? 'green' : ''}`} />
              <div className="landing-problema-card-icon">
                <img src={`/images/icons/problema-${i + 1}.png`} alt="" />
              </div>
              <div className="content">{card.text}</div>
            </div>
          ))}
        </div>
        <div className="landing-problema-close">
          <p>El objetivo: que te identifiques con el escenario sin dramatismo. Evaluamos con seriedad.</p>
          <p className="green">NexoSalud Legal ordena la información para que decidas con claridad.</p>
        </div>
      </section>
    </>
  )
}
