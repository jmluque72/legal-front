import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
  'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones',
  'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
  'Santiago del Estero', 'Tierra del Fuego', 'Tucumán', 'Otro país',
]

const TIPOS_IMPACTO = [
  { value: 'error_sistemico',    label: 'Error sistémico (falla repetida del sistema de salud)' },
  { value: 'dano_colectivo',     label: 'Daño colectivo (múltiples personas afectadas)' },
  { value: 'falla_institucional', label: 'Falla institucional grave' },
  { value: 'exposicion_mediatica', label: 'Exposición mediática o riesgo reputacional' },
  { value: 'crisis_sanitaria',   label: 'Crisis sanitaria o emergencia de salud pública' },
  { value: 'otro',               label: 'Otro' },
]

const inputClass = 'mt-2 w-full rounded-xl border border-primary/20 bg-white px-4 py-3 text-text placeholder:text-text/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20'
const inputErrorClass = 'mt-2 w-full rounded-xl border-2 border-red-500/50 bg-white px-4 py-3 text-text focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20'
const labelClass = 'font-heading text-sm font-semibold text-text'

export default function CaisWizard({ fromEvaluar }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { caseId: caseIdState, desdeRegistrado } = location.state || {}

  const [data, setData] = useState({
    nombre_completo: '',
    documento: '',
    email: '',
    telefono: '',
    jurisdiccion: '',
    tipo_impacto: '',
    cantidad_afectados: '',
    hay_riesgo_vital: '',
    institucion: '',
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
    if (!data.tipo_impacto) e.tipo_impacto = 'Requerido'
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
        tipo_impacto_cais: data.tipo_impacto,
        cantidad_afectados: data.cantidad_afectados?.trim() || undefined,
        hay_riesgo_vital_inmediato: data.hay_riesgo_vital || undefined,
        institucion_cais: data.institucion?.trim() || undefined,
      }
      const payload = desdeRegistrado && caseIdState
        ? { descripcion_breve: data.descripcion_caso?.trim(), tipologia: 'cais', anexo: 'III', ...extraData }
        : { ...data, descripcion_breve: data.descripcion_caso?.trim(), tipologia: 'cais', anexo: 'III', ...extraData }

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
        <h1 className="font-heading mt-4 text-3xl font-bold text-text">Caso de alto impacto sanitario</h1>
        <p className="mt-2 text-secondary font-medium">Módulo M7 — CAIS · Anexo III</p>
        <div className="mt-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          Este módulo está reservado para situaciones graves con múltiples afectados, fallas institucionales sistémicas
          o riesgo vital inmediato. Tu caso recibirá prioridad máxima y asignación a un abogado experto (Nivel IV).
        </div>
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
          <label className={labelClass}>Tipo de impacto <span className="text-red-500">*</span></label>
          <select
            value={data.tipo_impacto}
            onChange={(e) => update('tipo_impacto', e.target.value)}
            className={errors.tipo_impacto ? inputErrorClass : inputClass}
          >
            <option value="">Seleccione</option>
            {TIPOS_IMPACTO.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          {errors.tipo_impacto && <p className="mt-1 text-sm text-red-600">{errors.tipo_impacto}</p>}
        </div>

        <div>
          <label className={labelClass}>Cantidad estimada de personas afectadas</label>
          <input
            type="text"
            inputMode="numeric"
            value={data.cantidad_afectados}
            onChange={(e) => update('cantidad_afectados', e.target.value.replace(/\D/g, ''))}
            className={inputClass}
            placeholder="Ej: 15"
          />
        </div>

        <div>
          <label className={labelClass}>¿Hay riesgo vital inmediato para algún afectado?</label>
          <select
            value={data.hay_riesgo_vital}
            onChange={(e) => update('hay_riesgo_vital', e.target.value)}
            className={inputClass}
          >
            <option value="">No sé / No aplica</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Institución u organismo involucrado</label>
          <input
            type="text"
            value={data.institucion}
            onChange={(e) => update('institucion', e.target.value)}
            className={inputClass}
            placeholder="Nombre del hospital, obra social, clínica u organismo público"
          />
        </div>

        <div>
          <label className={labelClass}>
            {desdeRegistrado ? '¿Algo más que agregar?' : 'Describí la situación'} <span className="text-red-500">*</span>
          </label>
          <textarea
            value={data.descripcion_caso}
            onChange={(e) => update('descripcion_caso', e.target.value.slice(0, 1500))}
            rows={6}
            maxLength={1500}
            className={`resize-none ${errors.descripcion_caso ? inputErrorClass : inputClass}`}
            placeholder="Describí qué ocurrió, quiénes están involucrados, cuántos afectados hay y qué medidas se tomaron hasta ahora…"
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
            className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-70"
          >
            {submitting ? 'Enviando...' : 'Enviar caso urgente'}
          </button>
        </div>
      </form>
    </div>
  )
}
