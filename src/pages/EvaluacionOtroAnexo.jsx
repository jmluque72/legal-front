import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
  'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones',
  'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
  'Santiago del Estero', 'Tierra del Fuego', 'Tucumán', 'Otro país',
]

/**
 * Formulario reducido para anexos distintos al V (Amparo, Reintegro, Otro).
 * Cuando tengamos formularios completos por anexo, se reemplaza por cada uno.
 */
export default function EvaluacionOtroAnexo() {
  const location = useLocation()
  const { anexo, tipologia, tipoCasoLabel } = location.state || {}

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
  const [success, setSuccess] = useState(false)
  const [caseId, setCaseId] = useState(null)

  const update = (key, value) => {
    setData((d) => ({ ...d, [key]: value }))
    setErrors((e) => ({ ...e, [key]: null }))
  }

  const validate = () => {
    const e = {}
    if (!data.nombre_completo?.trim()) e.nombre_completo = 'Requerido'
    if (!data.email?.trim()) e.email = 'Requerido'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Email inválido'
    if (!data.telefono?.trim()) e.telefono = 'Requerido'
    if (!data.jurisdiccion) e.jurisdiccion = 'Requerido'
    if (!data.descripcion_breve?.trim()) e.descripcion_breve = 'Requerido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const res = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          tipologia: tipologia || 'otro',
          anexo: anexo || null,
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErrors({ submit: json.error || `Error ${res.status}` })
        return
      }
      setCaseId(json.caseId)
      setSuccess(true)
    } catch (err) {
      setErrors({ submit: err.message || 'Error de conexión' })
    } finally {
      setSubmitting(false)
    }
  }

  if (success && caseId) {
    return (
      <div className="evaluar-welcome">
        <div className="evaluar-welcome-inner">
          <h1>Consulta registrada</h1>
          <p className="evaluar-welcome-desc">
            Tu caso fue derivado al módulo correspondiente. Nº de caso: <strong>{caseId}</strong>. En breve nos pondremos en contacto.
          </p>
          <Link to="/" className="evaluar-welcome-cta">Volver al inicio</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="wizard">
      <header className="wizard-header">
        <Link to="/evaluar/tipo-caso" className="wizard-back">← Volver a tipo de caso</Link>
        <h1>{tipoCasoLabel || 'Evaluación inicial'}</h1>
        {anexo && <p className="wizard-step-desc">Anexo {anexo}</p>}
      </header>
      <form onSubmit={handleSubmit} className="wizard-form">
        {errors.submit && <div className="wizard-submit-error">{errors.submit}</div>}
        <div className="wizard-step">
          <label>
            Nombre y apellido <span className="required">*</span>
            <input type="text" value={data.nombre_completo} onChange={(e) => update('nombre_completo', e.target.value)} className={errors.nombre_completo ? 'error' : ''} />
            {errors.nombre_completo && <span className="field-error">{errors.nombre_completo}</span>}
          </label>
          <label>
            DNI <span className="required">*</span>
            <input type="text" inputMode="numeric" value={data.documento} onChange={(e) => update('documento', e.target.value.replaceAll(/\D/g, '').slice(0, 8))} placeholder="7 u 8 dígitos" />
          </label>
          <label>
            Email <span className="required">*</span>
            <input type="email" value={data.email} onChange={(e) => update('email', e.target.value)} className={errors.email ? 'error' : ''} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>
          <label>
            Teléfono <span className="required">*</span>
            <input type="tel" value={data.telefono} onChange={(e) => update('telefono', e.target.value)} className={errors.telefono ? 'error' : ''} />
            {errors.telefono && <span className="field-error">{errors.telefono}</span>}
          </label>
          <label>
            Provincia / País <span className="required">*</span>
            <select value={data.jurisdiccion} onChange={(e) => update('jurisdiccion', e.target.value)} className={errors.jurisdiccion ? 'error' : ''}>
              <option value="">Seleccione</option>
              {PROVINCIAS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.jurisdiccion && <span className="field-error">{errors.jurisdiccion}</span>}
          </label>
          <label>
            Describí brevemente tu situación <span className="required">*</span>
            <textarea value={data.descripcion_breve} onChange={(e) => update('descripcion_breve', e.target.value.slice(0, 1000))} rows={4} maxLength={1000} className={errors.descripcion_breve ? 'error' : ''} />
            <span className="char-count">{data.descripcion_breve?.length ?? 0} / 1000</span>
            {errors.descripcion_breve && <span className="field-error">{errors.descripcion_breve}</span>}
          </label>
        </div>
        <div className="wizard-actions">
          <Link to="/evaluar/tipo-caso" className="wizard-btn secondary">Cancelar</Link>
          <button type="submit" className="wizard-btn primary" disabled={submitting}>{submitting ? 'Enviando...' : 'Enviar consulta'}</button>
        </div>
      </form>
    </div>
  )
}
