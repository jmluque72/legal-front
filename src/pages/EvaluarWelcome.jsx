import { Link } from 'react-router-dom'

export default function EvaluarWelcome() {
  return (
    <div className="evaluar-welcome">
      <div className="evaluar-welcome-inner">
        <h1>Vamos a evaluar tu situación sanitaria y legal</h1>
        <p className="evaluar-welcome-desc">
          Utilizamos un sistema técnico especializado para analizar tu caso y darte claridad sobre viabilidad, urgencia y próximos pasos recomendados.
        </p>
        <p className="evaluar-welcome-note">
          No es un trámite de demanda ni litigio. Es una evaluación estructurada para que tomes la mejor decisión.
        </p>
        <Link to="/evaluar/tipo-caso" className="evaluar-welcome-cta">
          Iniciar Evaluación del Caso
        </Link>
        <Link to="/" className="evaluar-welcome-back">← Volver al inicio</Link>
      </div>
    </div>
  )
}
