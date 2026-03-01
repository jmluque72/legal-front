import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function EvaluarProcesando() {
  const navigate = useNavigate()
  const location = useLocation()
  const caseId = location.state?.caseId ?? null
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const duration = 4000
    const step = 50
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + step, 100)
        if (next >= 100) {
          clearInterval(interval)
          navigate('/evaluar/resultado', { state: { caseId }, replace: true })
        }
        return next
      })
    }, duration / (100 / step))
    return () => clearInterval(interval)
  }, [navigate, caseId])

  return (
    <div className="evaluar-procesando">
      <div className="evaluar-procesando-inner">
        <h1>Estamos evaluando tu situación…</h1>
        <p className="evaluar-procesando-desc">
          El sistema está analizando la información para darte un resultado con viabilidad, urgencia y recomendación.
        </p>
        <div className="evaluar-procesando-bar">
          <div className="evaluar-procesando-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  )
}
