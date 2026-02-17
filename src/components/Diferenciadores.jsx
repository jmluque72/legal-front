export default function Diferenciadores() {
  const caisItems = [
    'Riesgo de vida',
    'Daño irreversible posible',
    'Impacto colectivo',
    'Conflictos éticos complejos',
  ]

  const bioeticaItems = [
    'Decisiones médicas críticas',
    'Consentimientos informados complejos',
    'Ensayos clínicos',
    'Personas en situación de vulnerabilidad',
  ]

  return (
    <>
      <div className="section-header section-header--green" id="diferenciadores">
        <h2>Diferenciadores Clave</h2>
      </div>
      <section className="landing-diferenciadores">
        <div className="landing-diferenciadores-grid">
          <div className="landing-diferenciadores-card">
            <div className="diferenciadores-card-icon">
              <img src="/images/icons/diff-1.png" alt="" />
            </div>
            <h3 className="dif-card-title">CAIS</h3>
            <p className="dif-card-sub">Casos de Alto Impacto Sanitario</p>
            <ul className="dif-card-list">
              {caisItems.map((item, i) => (
                <li key={i}>▶ {item}</li>
              ))}
            </ul>
            <div className="dif-card-footer">
              Activa automáticamente un nivel superior de análisis y control.
            </div>
          </div>
          <div className="landing-diferenciadores-card">
            <div className="diferenciadores-card-icon">
              <img src="/images/icons/diff-2.png" alt="" />
            </div>
            <h3 className="dif-card-title">Bioética integrada</h3>
            <p className="dif-card-sub dif-card-sub--green">Desde el inicio del caso — no al final.</p>
            <ul className="dif-card-list">
              {bioeticaItems.map((item, i) => (
                <li key={i}>▶ {item}</li>
              ))}
            </ul>
            <div className="dif-card-footer">
              La bioética no aparece al final: forma parte del análisis del caso.
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
