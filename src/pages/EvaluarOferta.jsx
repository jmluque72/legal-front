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
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <h1 className="font-heading text-3xl font-bold text-text md:text-4xl">
        Niveles de profundidad del informe
      </h1>
      <p className="mt-4 text-text/85">
        Elegí el nivel de análisis que necesitás. No es un servicio comercial: es estructura técnica para tu decisión.
      </p>

      <form onSubmit={handleConfirmar} className="mt-10 grid gap-6 sm:grid-cols-3">
        {OPCIONES.map((op) => (
          <label
            key={op.id}
            className={`flex cursor-pointer flex-col rounded-2xl border-2 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_8px_24px_rgba(28,43,54,0.08)] ${
              elegido === op.id ? 'border-accent ring-2 ring-accent/20' : 'border-primary/15'
            }`}
          >
            <input
              type="radio"
              name="oferta"
              value={op.id}
              checked={elegido === op.id}
              onChange={() => setElegido(op.id)}
              className="sr-only"
            />
            <span className="text-xs font-semibold uppercase tracking-wide text-accent">{op.tag}</span>
            <h3 className="font-heading mt-2 text-xl font-semibold text-text">{op.title}</h3>
            <p className="mt-3 flex-1 text-sm text-text/80">{op.desc}</p>
          </label>
        ))}
      </form>

      <div className="mt-10 flex flex-wrap gap-4">
        <button
          type="submit"
          onClick={handleConfirmar}
          disabled={!elegido}
          className="rounded-full bg-accent px-7 py-3.5 font-semibold text-primary transition hover:bg-accent/90 disabled:opacity-50"
        >
          Confirmar y solicitar informe
        </button>
        <Link
          to="/"
          className="rounded-full border-2 border-primary/30 px-7 py-3.5 font-semibold text-primary transition hover:border-primary hover:bg-primary/5"
        >
          ← Volver al inicio sin solicitar
        </Link>
      </div>
    </div>
  )
}
