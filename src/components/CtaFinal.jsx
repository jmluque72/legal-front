import { Link } from 'react-router-dom'

export default function CtaFinal() {
  return (
    <section className="landing-cta">
      <div className="landing-cta-inner">
        <h2>NexoSalud Legal no promete milagros.</h2>
        <p className="landing-cta-sub">Promete algo más importante:</p>
        <p className="landing-cta-tag">
          Orden, criterio y humanidad en los conflictos de salud.
        </p>
        <p className="landing-cta-note">
          Porque cuando la salud está en juego, el derecho no puede llegar tarde.
        </p>
        <Link to="/mala-praxis" className="btn-cta">
          Conversemos — NexoSalud Legal está lista para su primer piloto.
        </Link>
      </div>
    </section>
  )
}
