import { Link } from 'react-router-dom'

export default function ComoFunciona() {
  const steps = [
    { num: 1, title: 'Ingresás tu caso', desc: 'Completás un recorrido guiado con tu situación médica, el conflicto y la documentación disponible.' },
    { num: 2, title: 'Evaluación Integral Multidimensional', desc: 'El sistema analiza viabilidad legal, urgencia sanitaria y vía más adecuada.' },
    { num: 3, title: 'Informe estructurado', desc: 'Recibís un informe claro con nivel de viabilidad, urgencia y recomendación estratégica.' },
    { num: 4, title: 'Decisión con claridad', desc: 'Con la información en mano, podés decidir los próximos pasos con fundamento.' },
  ]

  return (
    <>
      <div className="section-header" id="como-funciona">
        <h2>¿Cómo funciona?</h2>
      </div>
      <section className="landing-como">
        <p className="landing-como-intro">
          Un recorrido simple para que tu situación sea evaluada con rigor técnico.
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
        <div className="landing-como-cta">
          <Link to="/evaluar" className="btn-primary">Evaluar mi caso</Link>
        </div>
      </section>
    </>
  )
}
