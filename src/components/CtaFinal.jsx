import { Link } from 'react-router-dom'

export default function CtaFinal() {
  return (
    <section className="landing-cta">
      <div className="landing-cta-inner">
        <h2>No tomes decisiones sin información clara.</h2>
        <p className="landing-cta-note">
          Evaluamos técnicamente tu situación para que sepas cuál es el mejor camino.
        </p>
        <Link to="/evaluar" className="btn-cta">
          Evaluar mi caso ahora
        </Link>
        <p className="landing-cta-micro">Proceso confidencial y profesional.</p>
      </div>
    </section>
  )
}
