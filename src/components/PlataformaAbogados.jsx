export default function PlataformaAbogados() {
  const plataformaItems = [
    'Evalúa el caso',
    'Lo ordena y estructura',
    'Aporta información estratégica',
    'Genera dossier jurisprudencial',
  ]

  const dossierItems = [
    'Casos similares y misma jurisdicción',
    'Extractos relevantes',
    'Argumentos reutilizables',
  ]

  const resultadoItems = [
    'Mejora la calidad del escrito',
    'Reduce tiempos',
    'Disminuye riesgos',
  ]

  return (
    <>
      <div className="section-header" id="plataforma-abogados">
        <h2>Plataforma + Abogados: la combinación correcta</h2>
      </div>
      <section className="landing-plataforma-abogados">
        <p className="plataforma-intro">
          Los abogados son protagonistas, no reemplazados.
        </p>
        <div className="plataforma-grid">
          <div className="plataforma-block">
            <div className="plataforma-block-icon">
              <img src="/images/icons/plataforma-1.png" alt="" />
            </div>
            <h3>La plataforma:</h3>
            <ul className="plataforma-list">
              {plataformaItems.map((item, i) => (
                <li key={i}>✔ {item}</li>
              ))}
            </ul>
            <p className="plataforma-nota">
              NexoSalud Legal no litiga, no firma demandas, no se presenta en tribunales.
            </p>
          </div>
          <div className="plataforma-block plataforma-block--dossier">
            <div className="plataforma-block-icon">
              <img src="/images/icons/plataforma-2.png" alt="" />
            </div>
            <h3>Dossier Jurisprudencial</h3>
            <p className="plataforma-sub">Para cada caso admitido:</p>
            <ul className="plataforma-list plataforma-list--arrows">
              {dossierItems.map((item, i) => (
                <li key={i}>▶ {item}</li>
              ))}
            </ul>
            <p className="plataforma-resultado">Resultado:</p>
            <ul className="plataforma-list">
              {resultadoItems.map((item, i) => (
                <li key={i}>✔ {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
