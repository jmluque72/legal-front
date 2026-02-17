export default function Modulos() {
  const modulos = [
    'Amparos de salud',
    'Mala praxis médica',
    'Prestaciones y reintegros',
    'Adultos mayores y personas con capacidad restringida',
    'Salud mental e internaciones involuntarias',
    'Segunda opinión médico-legal',
    'Bioética y ensayos clínicos',
  ]

  return (
    <>
      <div className="section-header" id="modulos">
        <h2>Módulos Especializados</h2>
      </div>
      <section className="landing-modulos">
        <div className="landing-modulos-inner">
          <p className="landing-modulos-sub">
            Cada caso va al circuito que le corresponde — no a una bolsa genérica.
          </p>
          <div className="landing-modulos-grid">
          {modulos.map((nombre, i) => (
            <div key={i} className="landing-modulos-card">
              <div className="landing-modulos-card-icon">
                <img src={`/images/icons/modulos-${i + 1}.png`} alt="" />
              </div>
              <span>{nombre}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  )
}
