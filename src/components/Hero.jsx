import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="landing-hero">
      <div className="landing-hero-inner">
        <div>
          <h1>Infraestructura legal especializada en derecho de la salud</h1>
          <p className="landing-hero-sub">Pitch Deck para Inversores · MVP / Prototipo</p>
          <div className="landing-hero-pills">
            <span>Derecho</span>
            <span>Medicina</span>
            <span>Ética</span>
            <span>Humanidad</span>
          </div>
          <div className="landing-hero-cta">
            <Link to="/mala-praxis" className="btn-primary">Iniciar caso de mala praxis</Link>
            <a href="#contacto" className="btn-primary">Contacto</a>
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
