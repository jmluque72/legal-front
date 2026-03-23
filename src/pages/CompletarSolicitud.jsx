import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import LandingNavbar from '../components/landing/LandingNavbar'
import Footer from '../components/Footer'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export default function CompletarSolicitud() {
  const { token } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [questions, setQuestions] = useState([])
  const [caseId, setCaseId] = useState('')
  const [answers, setAnswers] = useState({})

  useEffect(() => {
    if (!token) return
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_URL}/data-requests/${encodeURIComponent(token)}`)
        const json = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(json.error || `Error ${res.status}`)
          setQuestions([])
        } else {
          setQuestions(Array.isArray(json.questions) ? json.questions : [])
          setCaseId(json.caseId ?? '')
        }
      } catch (err) {
        setError(err.message || 'Error de conexión')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [token])

  const handleChange = (id, type, value) => {
    let v = value
    if (type === 'number') {
      const n = Number(value)
      v = Number.isNaN(n) ? '' : n
    }
    setAnswers((prev) => ({ ...prev, [id]: v }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/data-requests/${encodeURIComponent(token)}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(json.error || `Error ${res.status}`)
      } else {
        setSubmitted(true)
      }
    } catch (err) {
      setError(err.message || 'Error de conexión')
    } finally {
      setSubmitting(false)
    }
  }

  const renderField = (q) => {
    const commonClass =
      'mt-2 w-full rounded-xl border border-primary/20 bg-white px-4 py-3 text-text placeholder:text-text/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20'
    const value = answers[q.id] ?? ''

    if (q.type === 'textarea') {
      return (
        <textarea
          rows={4}
          className={commonClass}
          value={value}
          onChange={(e) => handleChange(q.id, q.type, e.target.value)}
        />
      )
    }
    if (q.type === 'select' && Array.isArray(q.options) && q.options.length > 0) {
      return (
        <select
          className={commonClass}
          value={value || ''}
          onChange={(e) => handleChange(q.id, q.type, e.target.value)}
        >
          <option value="">Seleccioná una opción</option>
          {q.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )
    }

    const inputType = q.type === 'number' ? 'number' : 'text'
    return (
      <input
        type={inputType}
        className={commonClass}
        value={value}
        onChange={(e) => handleChange(q.id, q.type, e.target.value)}
      />
    )
  }

  return (
    <>
      <LandingNavbar />
      <main className="bg-surface py-16 md:py-20">
        <div className="mx-auto max-w-2xl px-4 md:px-8">
          {loading ? (
            <p className="text-center text-text/70">Cargando solicitud…</p>
          ) : error ? (
            <div className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
              <h1 className="font-heading text-2xl font-bold text-text">No se pudo cargar la solicitud</h1>
              <p className="mt-3 text-text/80">{error}</p>
              <Link
                to="/"
                className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-primary"
              >
                Volver al inicio
              </Link>
            </div>
          ) : submitted ? (
            <div className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
              <h1 className="font-heading text-2xl font-bold text-text">Información recibida</h1>
              <p className="mt-3 text-text/80">
                Gracias por completar la información adicional. Nuestro equipo la incorporará al análisis de tu caso.
              </p>
              <Link
                to="/"
                className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-primary"
              >
                Volver al inicio
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] md:p-8">
              <h1 className="font-heading text-2xl font-bold text-text md:text-3xl">
                Información adicional sobre tu caso
              </h1>
              {caseId && (
                <p className="mt-1 text-sm text-text/70">Nº de caso: <span className="font-medium">{caseId}</span></p>
              )}
              <p className="mt-4 text-text/80">
                Por favor completá los siguientes datos para que podamos continuar con el análisis.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {questions.map((q) => (
                  <div key={q.id}>
                    <label className="font-heading text-sm font-semibold text-text">
                      {q.label}
                      {q.required && <span className="text-red-500"> *</span>}
                    </label>
                    {renderField(q)}
                  </div>
                ))}
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-primary shadow-lg transition hover:bg-accent/90 hover:shadow-xl disabled:opacity-70"
                  >
                    {submitting ? 'Enviando…' : 'Enviar información'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

