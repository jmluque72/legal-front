import { Link, useLocation } from 'react-router-dom'

function getScoreClass (value) {
  if (value >= 75) return 'evaluar-resultado-score-fill--alto'
  if (value >= 50) return 'evaluar-resultado-score-fill--medio'
  return 'evaluar-resultado-score-fill--bajo'
}

export default function EvaluarResultado() {
  const location = useLocation()
  const caseId = location.state?.caseId ?? null

  const resultado = {
    viabilidad: 82,
    urgencia: 'Alta',
    probabilidadCautelar: 'Alta',
    recomendacion: 'Acción de amparo. Solicitud cautelar inmediata recomendada.',
  }

  return (
    <div className="evaluar-resultado">
      <div className="evaluar-resultado-inner">
        <h1>Tu situación fue evaluada</h1>
        {caseId && (
          <p className="evaluar-resultado-case">Nº de caso: <strong>{caseId}</strong></p>
        )}
        <div className="evaluar-resultado-grid">
          <div className="evaluar-resultado-card">
            <span className="evaluar-resultado-label">Viabilidad jurídica</span>
            <span className="evaluar-resultado-value">{resultado.viabilidad}%</span>
            <div className="evaluar-resultado-score-bar">
              <div
                className={`evaluar-resultado-score-fill ${getScoreClass(resultado.viabilidad)}`}
                style={{ width: `${resultado.viabilidad}%` }}
              />
            </div>
          </div>
          <div className="evaluar-resultado-card">
            <span className="evaluar-resultado-label">Urgencia</span>
            <span className="evaluar-resultado-value evaluar-resultado-urgency">{resultado.urgencia}</span>
          </div>
          <div className="evaluar-resultado-card">
            <span className="evaluar-resultado-label">Probabilidad de medida cautelar</span>
            <span className="evaluar-resultado-value">{resultado.probabilidadCautelar}</span>
          </div>
        </div>
        <div className="evaluar-resultado-recomendacion">
          <h2>Recomendación</h2>
          <p>{resultado.recomendacion}</p>
        </div>
        <p className="evaluar-resultado-note">
          Este resultado es preliminar. Podés solicitar un informe detallado en el siguiente paso.
        </p>
        <Link
          to="/evaluar/oferta"
          state={{ caseId }}
          className="evaluar-resultado-cta"
        >
          Ver opciones de informe
        </Link>
        <Link to="/" className="evaluar-welcome-back">← Volver al inicio</Link>
      </div>
    </div>
  )
}
