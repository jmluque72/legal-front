import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="landing-hero">
      <div className="landing-hero-inner">
        <div>
          <h1>Evaluamos tu situación sanitaria y legal con rigor técnico</h1>
          <p className="landing-hero-sub">
            Análisis estructurado, evaluación integral y claridad para que tomes la mejor decisión.
          </p>
          <div className="landing-hero-cta">
            <Link to="/evaluar" className="btn-primary">Evaluar mi caso</Link>
            <a href="#como-funciona" className="btn-secondary">Cómo funciona</a>
          </div>
        </div>
        <div className="landing-hero-img-wrap">
          <img
            src="/images/nexosalud-hero.png"
            alt="NexoSalud Legal"
            className="landing-hero-img"
          />
        </div>
      </div>
    </section>
  )
}
