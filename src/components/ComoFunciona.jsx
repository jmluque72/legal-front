export default function ComoFunciona() {
  const steps = [
    {
      num: 1,
      title: 'Evaluación inicial',
      desc: 'Analiza viabilidad legal, urgencia sanitaria y vía más adecuada. Evita litigios innecesarios, acelera los urgentes.',
    },
    {
      num: 2,
      title: 'Derivación al módulo',
      desc: 'Cada caso va al circuito que le corresponde, no a una bolsa genérica. 7 módulos especializados.',
    },
    {
      num: 3,
      title: 'Acompañamiento',
      desc: 'Ordena documentación, define estrategia, controla plazos y supervisa el cumplimiento efectivo.',
    },
    {
      num: 4,
      title: 'Cierre trazable',
      desc: 'Todo queda registrado, medido y auditable. Nada librado al azar.',
    },
  ]

  return (
    <>
      <div className="section-header" id="como-funciona">
        <h2>¿Cómo funciona?</h2>
      </div>
      <section className="landing-como">
        <p className="landing-como-intro">
          Todo queda registrado, medido y auditable — nada queda librado al azar.
        </p>
        <div className="landing-como-steps">
          {steps.map((step) => (
            <div key={step.num} className="landing-como-step">
              <div className="step-bar" />
              <div className="landing-como-step-icon">
                <img src={`/images/icons/pasos-${step.num}.png`} alt="" />
              </div>
              <div className="step-num">{step.num}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
