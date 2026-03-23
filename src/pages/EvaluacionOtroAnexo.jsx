import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
  'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones',
  'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
  'Santiago del Estero', 'Tierra del Fuego', 'Tucumán', 'Otro país',
]

const inputClass = 'mt-2 w-full rounded-xl border border-primary/20 bg-white px-4 py-3 text-text placeholder:text-text/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20'
const inputErrorClass = 'mt-2 w-full rounded-xl border-2 border-red-500/50 bg-white px-4 py-3 text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20'
const labelClass = 'font-heading text-sm font-semibold text-text'

export default function EvaluacionOtroAnexo() {
  const location = useLocation()
  const navigate = useNavigate()
  const { anexo, tipologia, tipoCasoLabel, caseId: caseIdState, desdeRegistrado } = location.state || {}

  const [data, setData] = useState({
    nombre_completo: '',
    documento: '',
    email: '',
    telefono: '',
    jurisdiccion: '',
    descripcion_breve: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const update = (key, value) => {
    setData((d) => ({ ...d, [key]: value }))
    setErrors((e) => ({ ...e, [key]: null }))
  }

  const validate = () => {
    const e = {}
    if (!desdeRegistrado) {
      if (!data.nombre_completo?.trim()) e.nombre_completo = 'Requerido'
      if (!data.email?.trim()) e.email = 'Requerido'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Email inválido'
      if (!data.telefono?.trim()) e.telefono = 'Requerido'
      if (!data.jurisdiccion) e.jurisdiccion = 'Requerido'
    }
    if (!data.descripcion_breve?.trim()) e.descripcion_breve = 'Requerido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const payload = desdeRegistrado && caseIdState
        ? { descripcion_breve: data.descripcion_breve?.trim(), tipologia: tipologia || 'otro', anexo: anexo || null }
        : { ...data, tipologia: tipologia || 'otro', anexo: anexo || null }
      if (desdeRegistrado && caseIdState) {
        const res = await fetch(`${API_URL}/requests/${caseIdState}/datos`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) {
          setErrors({ submit: json.error || `Error ${res.status}` })
          return
        }
        navigate('/evaluar/registrado', { state: { caseId: caseIdState, formularioCompleto: true }, replace: true })
        return
      }
      const res = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErrors({ submit: json.error || `Error ${res.status}` })
        return
      }
      navigate('/evaluar/registrado', { state: { caseId: json.caseId }, replace: true })
    } catch (err) {
      setErrors({ submit: err.message || 'Error de conexión' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:py-16">
      <header className="mb-10">
        <Link
          to={desdeRegistrado ? '/evaluar/registrado' : '/evaluar/tipo-caso'}
          className="text-sm font-medium text-primary hover:underline"
        >
          ← Volver
        </Link>
        <h1 className="font-heading mt-4 text-3xl font-bold text-text">
          {tipoCasoLabel || 'Evaluación inicial'}
        </h1>
        {anexo && <p className="mt-2 text-secondary font-medium">Anexo {anexo}</p>}
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {errors.submit}
          </div>
        )}
        {desdeRegistrado && (
          <p className="text-text/85">
            Tu nombre, email y teléfono ya están registrados. Podés agregar o ampliar la descripción de tu situación.
          </p>
        )}
        {!desdeRegistrado && (
          <>
            <div>
              <label className={labelClass}>Nombre y apellido <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={data.nombre_completo}
                onChange={(e) => update('nombre_completo', e.target.value)}
                className={errors.nombre_completo ? inputErrorClass : inputClass}
              />
              {errors.nombre_completo && <p className="mt-1 text-sm text-red-600">{errors.nombre_completo}</p>}
            </div>
            <div>
              <label className={labelClass}>DNI</label>
              <input
                type="text"
                inputMode="numeric"
                value={data.documento}
                onChange={(e) => update('documento', e.target.value.replaceAll(/\D/g, '').slice(0, 8))}
                className={inputClass}
                placeholder="7 u 8 dígitos"
              />
            </div>
            <div>
              <label className={labelClass}>Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => update('email', e.target.value)}
                className={errors.email ? inputErrorClass : inputClass}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label className={labelClass}>Teléfono <span className="text-red-500">*</span></label>
              <input
                type="tel"
                value={data.telefono}
                onChange={(e) => update('telefono', e.target.value)}
                className={errors.telefono ? inputErrorClass : inputClass}
              />
              {errors.telefono && <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>}
            </div>
            <div>
              <label className={labelClass}>Provincia / País <span className="text-red-500">*</span></label>
              <select
                value={data.jurisdiccion}
                onChange={(e) => update('jurisdiccion', e.target.value)}
                className={errors.jurisdiccion ? inputErrorClass : inputClass}
              >
                <option value="">Seleccione</option>
                {PROVINCIAS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.jurisdiccion && <p className="mt-1 text-sm text-red-600">{errors.jurisdiccion}</p>}
            </div>
          </>
        )}
        <div>
          <label className={labelClass}>
            {desdeRegistrado ? '¿Algo más que agregar a tu situación?' : 'Describí brevemente tu situación'} <span className="text-red-500">*</span>
          </label>
          <textarea
            value={data.descripcion_breve}
            onChange={(e) => update('descripcion_breve', e.target.value.slice(0, 1000))}
            rows={4}
            maxLength={1000}
            className={`resize-none ${errors.descripcion_breve ? inputErrorClass : inputClass}`}
            placeholder={desdeRegistrado ? 'Ampliá el relato si lo deseás…' : ''}
          />
          <p className="mt-1 text-right text-sm text-text/60">{data.descripcion_breve?.length ?? 0} / 1000</p>
          {errors.descripcion_breve && <p className="mt-1 text-sm text-red-600">{errors.descripcion_breve}</p>}
        </div>
        <div className="flex flex-wrap gap-4 pt-4">
          <Link
            to={desdeRegistrado ? '/evaluar/registrado' : '/evaluar/tipo-caso'}
            className="rounded-full border-2 border-primary/30 px-6 py-3 font-semibold text-primary transition hover:border-primary hover:bg-primary/5"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-accent px-6 py-3 font-semibold text-primary transition hover:bg-accent/90 disabled:opacity-70"
          >
            {submitting ? 'Enviando...' : 'Enviar consulta'}
          </button>
        </div>
      </form>
    </div>
  )
}
