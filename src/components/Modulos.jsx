export default function Modulos() {
  const servicios = [
    { title: 'Evaluación Integral', desc: 'Análisis de viabilidad legal y médica de tu caso.', link: '#como-funciona' },
    { title: 'Informes Especializados', desc: 'Informes técnicos con recomendación estratégica.', link: '#como-funciona' },
    { title: 'Dirección Estratégica', desc: 'Acompañamiento en la definición de pasos y plazos.', link: '#como-funciona' },
    { title: 'Análisis Alto Impacto (CAIS)', desc: 'Evaluación para casos de alto impacto sanitario.', link: '#como-funciona' },
  ]

  return (
    <>
      <div className="section-header" id="servicios">
        <h2>Servicios</h2>
      </div>
      <section className="landing-modulos">
        <div className="landing-modulos-inner">
          <p className="landing-modulos-sub">
            Niveles de profundidad según lo que necesites para tu situación.
          </p>
          <div className="landing-servicios-grid">
            {servicios.map((s, i) => (
              <div key={i} className="landing-servicios-card">
                <div className="landing-modulos-card-icon">
                  <img src={`/images/icons/modulos-${Math.min(i + 1, 4)}.png`} alt="" />
                </div>
                <h3 className="landing-servicios-card-title">{s.title}</h3>
                <p className="landing-servicios-card-desc">{s.desc}</p>
                <a href={s.link} className="landing-servicios-link">Conocer más</a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
