export default function QueEs() {
  const items = [
    { no: '✕ No es un estudio jurídico tradicional', yes: '✔ Es una plataforma de gestión de casos' },
    { no: '✕ No reemplaza a los abogados', yes: '✔ Hace su trabajo más sólido y seguro' },
    { no: '✕ No da asesoramiento médico', yes: '✔ Integra criterio médico y bioético' },
  ]

  return (
    <section className="landing-que-es" id="que-es">
      <div className="landing-que-es-inner">
        <h2>¿Qué es NexoSalud Legal?</h2>
        <p className="landing-que-es-desc">
          Una infraestructura legal especializada, diseñada para que los casos de salud se analicen y gestionen con rigor, rapidez y humanidad.
        </p>
        <div className="landing-que-es-grid">
          {items.map((item, i) => (
            <div key={i} className="landing-que-es-card">
              <div className="landing-que-es-card-icon">
                <img src={`/images/icons/quees-${i + 1}.png`} alt="" />
              </div>
              <div className="no">{item.no}</div>
              <div className="yes">{item.yes}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
