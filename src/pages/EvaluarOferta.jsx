import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const OPCIONES = [
  { id: 'basic', title: 'Informe BASIC', desc: 'Resumen ejecutivo con viabilidad y recomendación principal.', tag: 'Para tener claridad rápida' },
  { id: 'advanced', title: 'Informe ADVANCED', desc: 'Análisis detallado con fundamentos normativos y estrategia sugerida.', tag: 'Para decidir con fundamento' },
  { id: 'premium', title: 'Evaluación Integral Multidimensional (PREMIUM)', desc: 'Informe completo interdisciplinario: médico, legal y estratégico.', tag: 'Máxima profundidad' },
]

export default function EvaluarOferta() {
  const location = useLocation()
  const navigate = useNavigate()
  const caseId = location.state?.caseId ?? null
  const [elegido, setElegido] = useState(null)

  const handleConfirmar = (e) => {
    e.preventDefault()
    if (!elegido) return
    navigate('/evaluar/modalidad', { state: { caseId, reportLevel: elegido, viabilidad: 82 } })
  }

  return (
    <div className="evaluar-oferta">
      <div className="evaluar-oferta-inner">
        <h1>Niveles de profundidad del informe</h1>
        <p className="evaluar-oferta-desc">
          Elegí el nivel de análisis que necesitás. No es un servicio comercial: es estructura técnica para tu decisión.
        </p>
        <form onSubmit={handleConfirmar} className="evaluar-oferta-grid">
          {OPCIONES.map((op) => (
            <label
              key={op.id}
              className={`evaluar-oferta-card ${elegido === op.id ? 'evaluar-oferta-card--selected' : ''}`}
            >
              <input
                type="radio"
                name="oferta"
                value={op.id}
                checked={elegido === op.id}
                onChange={() => setElegido(op.id)}
                className="evaluar-oferta-radio"
              />
              <span className="evaluar-oferta-tag">{op.tag}</span>
              <h3 className="evaluar-oferta-title">{op.title}</h3>
              <p className="evaluar-oferta-desc-card">{op.desc}</p>
            </label>
          ))}
        </form>
        <form onSubmit={handleConfirmar} className="evaluar-oferta-actions">
          <button
            type="submit"
            disabled={!elegido}
            className="evaluar-welcome-cta"
          >
            Confirmar y solicitar informe
          </button>
          <Link to="/" className="evaluar-welcome-back">← Volver al inicio sin solicitar</Link>
        </form>
      </div>
    </div>
  )
}
