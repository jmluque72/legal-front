import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
  'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones',
  'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
  'Santiago del Estero', 'Tierra del Fuego', 'Tucumán', 'Otro país',
]

const TIPOS_SITUACION = [
  { value: 'internacion_involuntaria', label: 'Internación involuntaria' },
  { value: 'alta_voluntaria', label: 'Alta voluntaria denegada' },
  { value: 'tratamiento_ambulatorio', label: 'Tratamiento ambulatorio / medicación' },
  { value: 'capacidad_restringida', label: 'Capacidad restringida / curatela' },
  { value: 'conflicto_familiar', label: 'Conflicto familiar sobre decisiones de salud mental' },
  { value: 'derechos_paciente', label: 'Derechos del paciente psiquiátrico' },
  { value: 'otro', label: 'Otro' },
]

const inputClass = 'mt-2 w-full rounded-xl border border-primary/20 bg-white px-4 py-3 text-text placeholder:text-text/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20'
const inputErrorClass = 'mt-2 w-full rounded-xl border-2 border-red-500/50 bg-white px-4 py-3 text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20'
const labelClass = 'font-heading text-sm font-semibold text-text'

export default function SaludMentalWizard({ fromEvaluar }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { caseId: caseIdState, desdeRegistrado } = location.state || {}

  const [data, setData] = useState({
    nombre_completo: '',
    documento: '',
    email: '',
    telefono: '',
    jurisdiccion: '',
    tipo_situacion: '',
    institucion: '',
    tiene_diagnostico: '',
    descripcion_caso: '',
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
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Email inválido'
      if (!data.telefono?.trim()) e.telefono = 'Requerido'
      if (!data.jurisdiccion) e.jurisdiccion = 'Requerido'
    }
    if (!data.tipo_situacion) e.tipo_situacion = 'Requerido'
    if (!data.descripcion_caso?.trim()) e.descripcion_caso = 'Requerido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const extraData = {
        tipo_situacion_salud_mental: data.tipo_situacion,
        institucion_salud_mental: data.institucion?.trim() || undefined,
        tiene_diagnostico_previo: data.tiene_diagnostico || undefined,
      }
      const payload = desdeRegistrado && caseIdState
        ? { descripcion_breve: data.descripcion_caso?.trim(), tipologia: 'salud_mental', anexo: null, ...extraData }
        : { ...data, descripcion_breve: data.descripcion_caso?.trim(), tipologia: 'salud_mental', anexo: null, ...extraData }

      const url = desdeRegistrado && caseIdState
        ? `${API_URL}/requests/${caseIdState}/datos`
        : `${API_URL}/requests`
      const method = desdeRegistrado && caseIdState ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErrors({ submit: json.error || `Error ${res.status}` })
        return
      }
      navigate('/evaluar/registrado', {
        state: desdeRegistrado
          ? { caseId: caseIdState, formularioCompleto: true }
          : { caseId: json.caseId },
        replace: true,
      })
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
        <h1 className="font-heading mt-4 text-3xl font-bold text-text">Salud mental</h1>
        <p className="mt-2 text-secondary font-medium">Módulo T2 — Salud mental y capacidad</p>
        <p className="mt-3 text-text/80 text-sm">
          Internaciones involuntarias, derechos del paciente psiquiátrico, capacidad restringida y conflictos vinculados a la Ley de Salud Mental.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errors.submit}</div>
        )}

        {desdeRegistrado && (
          <p className="text-text/85">Tu nombre, email y teléfono ya están registrados. Podés ampliar la descripción de tu situación.</p>
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
          <label className={labelClass}>Tipo de situación <span className="text-red-500">*</span></label>
          <select
            value={data.tipo_situacion}
            onChange={(e) => update('tipo_situacion', e.target.value)}
            className={errors.tipo_situacion ? inputErrorClass : inputClass}
          >
            <option value="">Seleccione</option>
            {TIPOS_SITUACION.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          {errors.tipo_situacion && <p className="mt-1 text-sm text-red-600">{errors.tipo_situacion}</p>}
        </div>

        <div>
          <label className={labelClass}>Institución o establecimiento involucrado</label>
          <input
            type="text"
            value={data.institucion}
            onChange={(e) => update('institucion', e.target.value)}
            className={inputClass}
            placeholder="Nombre del hospital, clínica u obra social"
          />
        </div>

        <div>
          <label className={labelClass}>¿Hay diagnóstico psiquiátrico previo?</label>
          <select
            value={data.tiene_diagnostico}
            onChange={(e) => update('tiene_diagnostico', e.target.value)}
            className={inputClass}
          >
            <option value="">No sé / prefiero no decir</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>
            {desdeRegistrado ? '¿Algo más que agregar?' : 'Describí tu situación'} <span className="text-red-500">*</span>
          </label>
          <textarea
            value={data.descripcion_caso}
            onChange={(e) => update('descripcion_caso', e.target.value.slice(0, 1500))}
            rows={5}
            maxLength={1500}
            className={`resize-none ${errors.descripcion_caso ? inputErrorClass : inputClass}`}
            placeholder="Contanos qué está pasando, quién está involucrado y qué necesitás resolver…"
          />
          <p className="mt-1 text-right text-sm text-text/60">{data.descripcion_caso?.length ?? 0} / 1500</p>
          {errors.descripcion_caso && <p className="mt-1 text-sm text-red-600">{errors.descripcion_caso}</p>}
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
