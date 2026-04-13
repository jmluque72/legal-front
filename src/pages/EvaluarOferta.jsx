import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const OPCIONES = [
  { id: 'basic',    title: 'Informe BASIC',    desc: 'Resumen ejecutivo con viabilidad y recomendación principal.',                              tag: 'Para tener claridad rápida' },
  { id: 'advanced', title: 'Informe ADVANCED', desc: 'Análisis detallado con fundamentos normativos y estrategia sugerida.',                     tag: 'Para decidir con fundamento' },
  { id: 'premium',  title: 'Evaluación Integral Multidimensional (PREMIUM)', desc: 'Informe completo interdisciplinario: médico, legal y estratégico.', tag: 'Máxima profundidad' },
]

function viabilidadConfig(pct) {
  if (pct === null || pct === undefined) return null
  if (pct >= 80) return { label: 'Alta',       color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500' }
  if (pct >= 60) return { label: 'Media-Alta', color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200',    bar: 'bg-blue-500' }
  if (pct >= 40) return { label: 'Media',      color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   bar: 'bg-amber-500' }
  return              { label: 'Baja',        color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200',     bar: 'bg-red-500' }
}

export default function EvaluarOferta() {
  const location = useLocation()
  const navigate  = useNavigate()
  const caseId    = location.state?.caseId ?? null
  const [elegido, setElegido] = useState(null)

  const [viabilidadPct,   setViabilidadPct]   = useState(null)
  const [eimTotalScore,   setEimTotalScore]    = useState(null)
  const [recommendedModule, setRecommendedModule] = useState(null)
  const [loadingViab,     setLoadingViab]      = useState(false)

  // Fetch viabilidad real desde la API
  useEffect(() => {
    if (!caseId) return
    setLoadingViab(true)
    fetch(`${API_URL}/requests/${encodeURIComponent(caseId)}/viabilidad`)
      .then((r) => r.json())
      .then((data) => {
        if (data.viabilidad_pct !== undefined) setViabilidadPct(data.viabilidad_pct)
        if (data.eim_total_score !== undefined) setEimTotalScore(data.eim_total_score)
        if (data.recommended_module)            setRecommendedModule(data.recommended_module)
      })
      .catch(() => {/* falla silenciosamente */})
      .finally(() => setLoadingViab(false))
  }, [caseId])

  const handleConfirmar = (e) => {
    e.preventDefault()
    if (!elegido) return
    navigate('/evaluar/modalidad', {
      state: {
        caseId,
        reportLevel: elegido,
        viabilidad: viabilidadPct ?? 82,
      },
    })
  }

  const cfg = viabilidadConfig(viabilidadPct)

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <h1 className="font-heading text-3xl font-bold text-text md:text-4xl">
        Niveles de profundidad del informe
      </h1>
      <p className="mt-4 text-text/85">
        Elegí el nivel de análisis que necesitás. No es un servicio comercial: es estructura técnica para tu decisión.
      </p>

      {/* Badge de viabilidad */}
      {caseId && (
        <div className="mt-6">
          {loadingViab ? (
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
              Calculando viabilidad del caso…
            </div>
          ) : cfg ? (
            <div className={`inline-flex items-center gap-4 rounded-xl border px-5 py-3.5 ${cfg.bg} ${cfg.border}`}>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Viabilidad estimada — Caso {caseId}
                </p>
                {recommendedModule && (
                  <p className="mt-0.5 text-xs text-slate-500">{recommendedModule}</p>
                )}
              </div>
              <div className="text-right">
                <span className={`text-3xl font-bold tabular-nums ${cfg.color}`}>{viabilidadPct}%</span>
                <p className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</p>
              </div>
              <div className="w-24">
                <div className="h-2 w-full rounded-full bg-white/60">
                  <div
                    className={`h-2 rounded-full transition-all ${cfg.bar}`}
                    style={{ width: `${viabilidadPct}%` }}
                  />
                </div>
                {eimTotalScore !== null && (
                  <p className="mt-1 text-right text-[10px] text-slate-400">EIM: {eimTotalScore}/100</p>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}

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
