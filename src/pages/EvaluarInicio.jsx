import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
  'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones',
  'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
  'Santiago del Estero', 'Tierra del Fuego', 'Tucumán', 'Otro país',
]

const inputClass = 'mt-2 w-full rounded-xl border border-primary/20 bg-white px-4 py-3 text-text placeholder:text-text/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20'
const inputErrorClass = 'mt-2 w-full rounded-xl border-2 border-red-500/50 bg-white px-4 py-3 text-text placeholder:text-text/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20'
const labelClass = 'font-heading text-sm font-semibold text-text'

export default function EvaluarInicio() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [data, setData] = useState({
    nombre_completo: '',
    documento: '',
    email: '',
    telefono: '',
    jurisdiccion: '',
    descripcion_caso: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const update = (key, value) => {
    setData((d) => ({ ...d, [key]: value }))
    setErrors((e) => ({ ...e, [key]: null }))
  }

  const validateStep1 = () => {
    const e = {}
    if (!data.nombre_completo?.trim()) e.nombre_completo = 'Requerido'
    if (!data.documento?.trim()) e.documento = 'Requerido'
    if (!/^\d{7,8}$/.test(data.documento?.replaceAll(/\D/g, ''))) e.documento = 'DNI 7 u 8 dígitos'
    if (!data.email?.trim()) e.email = 'Requerido'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Email inválido'
    if (!data.telefono?.trim()) e.telefono = 'Requerido'
    if (!data.jurisdiccion) e.jurisdiccion = 'Requerido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e = {}
    if (!data.descripcion_caso?.trim()) e.descripcion_caso = 'Contanos brevemente tu caso para poder derivarlo.'
    if (data.descripcion_caso?.length > 5000) e.descripcion_caso = 'Máximo 5000 caracteres'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (!validateStep1()) return
    setStep(2)
  }

  const handleBack = () => setStep(1)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateStep2()) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch(`${API_URL}/evaluar/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre_completo: data.nombre_completo.trim(),
          documento: data.documento.replaceAll(/\D/g, '').slice(0, 8),
          email: data.email.trim(),
          telefono: data.telefono.trim(),
          jurisdiccion: data.jurisdiccion,
          descripcion_caso: data.descripcion_caso.trim(),
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setSubmitError(json.error || `Error ${res.status}`)
        return
      }
      navigate('/evaluar/registrado', {
        state: {
          caseId: json.caseId,
          recommended_module: json.recommended_module,
          tipologia: json.tipologia,
          anexo: json.anexo,
        },
        replace: true,
      })
    } catch (err) {
      setSubmitError(err.message || 'Error de conexión')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:py-16">
      <header className="mb-10">
        <Link to="/evaluar" className="text-sm font-medium text-primary hover:underline">
          ← Volver
        </Link>
        <h1 className="font-heading mt-4 text-3xl font-bold text-text">
          Evaluar mi caso
        </h1>
        <p className="mt-2 text-text/70">
          Paso {step} de 2
        </p>
      </header>

      {step === 1 && (
        <div className="space-y-6">
          <p className="text-text/85">
            Datos de contacto para poder responderte.
          </p>
          <div>
            <label className={labelClass}>
              Nombre y apellido <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={data.nombre_completo}
              onChange={(e) => update('nombre_completo', e.target.value)}
              className={errors.nombre_completo ? inputErrorClass : inputClass}
              placeholder="Ej. María García"
            />
            {errors.nombre_completo && <p className="mt-1 text-sm text-red-600">{errors.nombre_completo}</p>}
          </div>
          <div>
            <label className={labelClass}>
              DNI <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={data.documento}
              onChange={(e) => update('documento', e.target.value.replaceAll(/\D/g, '').slice(0, 8))}
              className={errors.documento ? inputErrorClass : inputClass}
              placeholder="7 u 8 dígitos"
            />
            {errors.documento && <p className="mt-1 text-sm text-red-600">{errors.documento}</p>}
          </div>
          <div>
            <label className={labelClass}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => update('email', e.target.value)}
              className={errors.email ? inputErrorClass : inputClass}
              placeholder="tu@email.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className={labelClass}>
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={data.telefono}
              onChange={(e) => update('telefono', e.target.value)}
              className={errors.telefono ? inputErrorClass : inputClass}
              placeholder="Ej. 11 1234-5678"
            />
            {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
          </div>
          <div>
            <label className={labelClass}>
              Provincia / País <span className="text-red-500">*</span>
            </label>
            <select
              value={data.jurisdiccion}
              onChange={(e) => update('jurisdiccion', e.target.value)}
              className={errors.jurisdiccion ? inputErrorClass : inputClass}
            >
              <option value="">Seleccione</option>
              {PROVINCIAS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            {errors.jurisdiccion && <p className="mt-1 text-sm text-red-600">{errors.jurisdiccion}</p>}
          </div>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link
              to="/evaluar"
              className="rounded-full border-2 border-primary/30 px-6 py-3 font-semibold text-primary transition hover:border-primary hover:bg-primary/5"
            >
              Cancelar
            </Link>
            <button
              type="button"
              onClick={handleNext}
              className="rounded-full bg-accent px-6 py-3 font-semibold text-primary transition hover:bg-accent/90"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-text/85">
            Contanos tu situación en tus palabras. Con eso analizamos qué tipo de servicio necesitás.
          </p>
          <div>
            <label className={labelClass}>
              Comentame tu caso <span className="text-red-500">*</span>
            </label>
            <textarea
              value={data.descripcion_caso}
              onChange={(e) => update('descripcion_caso', e.target.value.slice(0, 5000))}
              className={`resize-none ${errors.descripcion_caso ? inputErrorClass : inputClass}`}
              placeholder="Ej.: Me negaron una medicación que me recetó el médico… / Mi mamá está en un geriátrico y creemos que no la están cuidando bien… / Quiero pedir un reintegro de gastos que ya pagué…"
              rows={6}
              maxLength={5000}
            />
            <p className="mt-1 text-right text-sm text-text/60">{data.descripcion_caso.length} / 5000</p>
            {errors.descripcion_caso && <p className="mt-1 text-sm text-red-600">{errors.descripcion_caso}</p>}
          </div>
          {submitError && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="rounded-full border-2 border-primary/30 px-6 py-3 font-semibold text-primary transition hover:border-primary hover:bg-primary/5"
            >
              Atrás
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-accent px-6 py-3 font-semibold text-primary transition hover:bg-accent/90 disabled:opacity-70"
            >
              {submitting ? 'Analizando tu caso…' : 'Enviar y evaluar'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
