export default function Problema() {
  const cards = [
    { text: 'Una obra social niega un tratamiento urgente', bar: 'navy' },
    { text: 'Un medicamento crítico no llega a tiempo', bar: 'navy' },
    { text: 'Un adulto mayor queda desprotegido', bar: 'navy' },
    { text: 'Una familia no sabe si iniciar una acción judicial', bar: 'green' },
    { text: 'Un caso llega tarde, mal documentado y en estado crítico', bar: 'green' },
  ]

  return (
    <>
      <div className="section-header" id="problema">
        <h2>El Problema</h2>
      </div>
      <section className="landing-problema">
        <p className="landing-problema-intro">
          Todos los días, personas enfrentan situaciones como estas:
        </p>
        <div className="landing-problema-grid">
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
          <p>El problema no es solo legal. Es médico, ético, humano y estructural.</p>
          <p className="green">NexoSalud Legal nace para ordenar ese caos.</p>
        </div>
      </section>
    </>
  )
}
