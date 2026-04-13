import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import { es } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'

const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
  'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones',
  'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
  'Santiago del Estero', 'Tierra del Fuego', 'Tucumán', 'Otro país',
]

const UBICACIONES = [
  { value: 'domicilio_particular', label: 'Domicilio particular' },
  { value: 'geriatrico', label: 'Geriátrico' },
  { value: 'residencia', label: 'Residencia' },
  { value: 'hospital_clinica', label: 'Hospital / Clínica' },
  { value: 'otro', label: 'Otro' },
]

const ROLES_CONSULTANTE = [
  { value: 'self', label: 'La propia persona' },
  { value: 'hijo_hija', label: 'Hijo/a' },
  { value: 'conyuge_pareja', label: 'Cónyuge / pareja' },
  { value: 'familiar', label: 'Familiar' },
  { value: 'cuidador', label: 'Cuidador/a' },
  { value: 'tercero', label: 'Tercero con interés legítimo' },
]

const APOYOS_LEGALES = [
  { value: 'curador', label: 'Curador designado judicialmente' },
  { value: 'apoyo_judicial', label: 'Apoyo judicial' },
  { value: 'ninguno', label: 'Ninguno' },
  { value: 'no_sabe', label: 'No sabe' },
]

const TIPOS_SITUACION = [
  { value: 'prestacion_medica', label: 'Negativa o demora en prestación médica' },
  { value: 'internacion_alta', label: 'Internación prolongada o alta indebida' },
  { value: 'obra_social_prepaga', label: 'Conflicto con obra social o prepaga' },
  { value: 'geriatrico', label: 'Abusos o problemas en geriátrico / residencia' },
  { value: 'conflicto_familiar', label: 'Conflicto familiar vinculado a decisiones médicas' },
  { value: 'manejo_dinero', label: 'Manejo irregular de ingresos, jubilación o bienes' },
  { value: 'negligencia_abandono', label: 'Negligencia o abandono' },
  { value: 'necesidad_apoyos_curatela', label: 'Necesidad de apoyos o curatela' },
  { value: 'riesgo_judicializacion', label: 'Riesgo de judicialización por terceros' },
  { value: 'otro', label: 'Otro' },
]

const RIESGOS = [
  { key: 'risk_medical', label: 'Riesgo médico', desc: 'La persona tiene una situación de salud comprometida o sin atención adecuada.' },
  { key: 'risk_financial', label: 'Riesgo patrimonial', desc: 'Hay riesgo sobre ingresos, bienes o jubilación de la persona.' },
  { key: 'risk_family', label: 'Conflicto familiar', desc: 'Hay disputas familiares que afectan las decisiones o el bienestar de la persona.' },
  { key: 'risk_abuse', label: 'Abuso o manipulación', desc: 'Hay indicios de maltrato, manipulación o presión indebida.' },
  { key: 'risk_isolation', label: 'Aislamiento', desc: 'La persona está aislada o sin red de apoyo.' },
  { key: 'risk_judicial', label: 'Judicialización inminente', desc: 'Existe riesgo de que el caso derive en un proceso judicial urgente.' },
]

const initialData = {
  // VI.1 – Persona protegida
  protected_name: '',
  protected_dni: '',
  protected_birthdate: null,
  protected_age: null,
  current_location: '',
  province: '',
  // VI.2 – Consultante
  applicant_role: '',
  applicant_name: '',
  applicant_dni: '',
  applicant_phone: '',
  applicant_email: '',
  relationship: '',
  cohabits: '',
  controls_decisions: '',
  // VI.3 – Autonomía
  understands_decisions: '',
  expresses_will: '',
  legal_support: '',
  cognitive_diagnosis: '',
  // VI.4 – Motivo
  issue_type: [],
  narrative: '',
  urgency_declared: '',
  // VI.5 – Riesgos
  risk_medical: false,
  risk_financial: false,
  risk_family: false,
  risk_abuse: false,
  risk_isolation: false,
  risk_judicial: false,
  // VI.6 – Consentimientos
  consent_interest: false,
  consent_terms: false,
  consent_eval: false,
  consent_referral: false,
}

const STEPS = {
  persona: 0,
  consultante: 1,
  autonomia: 2,
  motivo: 3,
  riesgos: 4,
  consentimientos: 5,
  cierre: 6,
}
const TOTAL_STEPS = 7

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

function calcAge(birthdate) {
  if (!birthdate) return null
  const today = new Date()
  let age = today.getFullYear() - birthdate.getFullYear()
  const m = today.getMonth() - birthdate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) age--
  return age
}

function deriveFlags(data) {
  const age = data.protected_age
  const is_elderly = age !== null && age >= 65
  const vulnerability_flag = is_elderly || data.cognitive_diagnosis === 'si' || data.current_location !== 'domicilio_particular'
  const third_party = data.applicant_role !== 'self'
  const conflict_of_interest = third_party && data.controls_decisions === 'si'
  const negatives = ['understands_decisions', 'expresses_will', 'legal_support', 'cognitive_diagnosis']
    .filter((k) => data[k] === 'no' || data[k] === 'no_sabe').length
  const autonomy_risk = negatives >= 2
  const risk_count = RIESGOS.filter((r) => data[r.key]).length
  const multi_risk_flag = risk_count >= 2
  const priority = multi_risk_flag ? 'high' : 'medium'
  return { is_elderly, vulnerability_flag, third_party, conflict_of_interest, autonomy_risk, multi_risk_flag, priority }
}

export default function AdultosMayoresWizard({ fromEvaluar = false }) {
  const navigate = useNavigate()
  const location = useLocation()
  const anexoFromState = location.state?.anexo
  const tipologiaFromState = location.state?.tipologia
  const desdeRegistrado = location.state?.desdeRegistrado
  const caseIdExistente = location.state?.caseId

  const [step, setStep] = useState(desdeRegistrado ? STEPS.persona : STEPS.persona)
  const [data, setData] = useState(initialData)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  function update(field, value) {
    setData((prev) => {
      const next = { ...prev, [field]: value }
      if (field === 'protected_birthdate') {
        next.protected_age = calcAge(value)
      }
      return next
    })
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function toggleIssueType(value) {
    setData((prev) => {
      const current = prev.issue_type
      return {
        ...prev,
        issue_type: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      }
    })
    setErrors((prev) => ({ ...prev, issue_type: undefined }))
  }

  function validate() {
    const e = {}
    if (step === STEPS.persona) {
      if (!data.protected_name.trim() || data.protected_name.trim().length < 3) e.protected_name = 'Ingresá el nombre completo (mín. 3 caracteres)'
      if (!/^\d{7,8}$/.test(data.protected_dni)) e.protected_dni = 'Ingresá un DNI válido (7 u 8 dígitos)'
      if (!data.protected_birthdate) e.protected_birthdate = 'Seleccioná la fecha de nacimiento'
      if (!data.current_location) e.current_location = 'Seleccioná la ubicación actual'
      if (!data.province) e.province = 'Seleccioná la provincia'
    }
    if (step === STEPS.consultante) {
      if (!data.applicant_role) e.applicant_role = 'Seleccioná tu rol'
      if (!data.applicant_name.trim() || data.applicant_name.trim().length < 3) e.applicant_name = 'Ingresá tu nombre completo'
      if (!/^\d{7,8}$/.test(data.applicant_dni)) e.applicant_dni = 'DNI inválido'
      if (!data.applicant_phone.trim()) e.applicant_phone = 'Ingresá un teléfono de contacto'
      if (!/\S+@\S+\.\S+/.test(data.applicant_email)) e.applicant_email = 'Ingresá un email válido'
      if (!data.cohabits) e.cohabits = 'Respondé esta pregunta'
      if (!data.controls_decisions) e.controls_decisions = 'Respondé esta pregunta'
    }
    if (step === STEPS.autonomia) {
      if (!data.understands_decisions) e.understands_decisions = 'Respondé esta pregunta'
      if (!data.expresses_will) e.expresses_will = 'Respondé esta pregunta'
      if (!data.legal_support) e.legal_support = 'Respondé esta pregunta'
      if (!data.cognitive_diagnosis) e.cognitive_diagnosis = 'Respondé esta pregunta'
    }
    if (step === STEPS.motivo) {
      if (data.issue_type.length === 0) e.issue_type = 'Seleccioná al menos una situación'
      if (!data.narrative.trim() || data.narrative.trim().length < 20) e.narrative = 'Describí la situación (mín. 20 caracteres)'
      if (!data.urgency_declared) e.urgency_declared = 'Respondé esta pregunta'
    }
    if (step === STEPS.consentimientos) {
      if (!data.consent_interest) e.consent_interest = 'Este consentimiento es obligatorio'
      if (!data.consent_terms) e.consent_terms = 'Este consentimiento es obligatorio'
      if (!data.consent_eval) e.consent_eval = 'Este consentimiento es obligatorio'
      if (!data.consent_referral) e.consent_referral = 'Este consentimiento es obligatorio'
    }
    return e
  }

  function handleNext(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    setStep((s) => s + 1)
    window.scrollTo(0, 0)
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1))
    window.scrollTo(0, 0)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    setSubmitting(true)
    setSubmitError(null)
    try {
      const flags = deriveFlags(data)
      const payload = {
        ...data,
        ...flags,
        tipologia: tipologiaFromState || 'adultos_mayores',
        anexo: anexoFromState || 'VI',
        formulario_anexo: 'VI_adultos_mayores',
        protected_birthdate: data.protected_birthdate ? data.protected_birthdate.toISOString().slice(0, 10) : null,
      }

      if (desdeRegistrado && caseIdExistente) {
        const omit = ['applicant_name', 'applicant_dni', 'applicant_email', 'applicant_phone']
        const patch = Object.fromEntries(Object.entries(payload).filter(([k]) => !omit.includes(k)))
        const res = await fetch(`${API_URL}/requests/${caseIdExistente}/datos`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) { setSubmitError(json.error || `Error ${res.status}`); return }
        navigate('/evaluar/registrado', { state: { caseId: caseIdExistente, formularioCompleto: true }, replace: true })
        return
      }

      const res = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) { setSubmitError(json.error || `Error ${res.status}`); return }
      if (fromEvaluar) {
        navigate('/evaluar/registrado', { state: { caseId: json.caseId }, replace: true })
      } else {
        navigate('/', { state: { caseId: json.caseId } })
      }
    } catch (err) {
      setSubmitError(err.message || 'Error de conexión')
    } finally {
      setSubmitting(false)
    }
  }

  const flags = deriveFlags(data)
  const backHref = desdeRegistrado ? '/evaluar/registrado' : fromEvaluar ? '/evaluar/tipo-caso' : '/'

  return (
    <div className="wizard evaluar-flow mx-auto max-w-2xl px-4 py-12 md:py-16">
      <header className="wizard-header mb-10">
        <Link to={backHref} className="wizard-back text-sm font-medium text-primary hover:underline">
          ← Volver
        </Link>
        <h1 className="font-heading mt-4 text-3xl font-bold text-text">
          Anexo VI – Adultos Mayores y Vulnerabilidad
        </h1>
        <p className="mt-2 text-sm text-text/75 max-w-xl">
          Módulo de evaluación reforzada para situaciones que involucran a personas adultas mayores o en situación de vulnerabilidad.
        </p>
        <div className="wizard-progress mt-6">
          <span className="wizard-progress-text">Paso {step + 1} de {TOTAL_STEPS}</span>
          <div className="wizard-progress-bar">
            <div className="wizard-progress-fill" style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} />
          </div>
        </div>
      </header>

      <form onSubmit={step === STEPS.consentimientos ? handleSubmit : handleNext} className="wizard-form">
        {submitError && <div className="wizard-submit-error">{submitError}</div>}

        {/* ── PASO 0: PERSONA PROTEGIDA (VI.1) ── */}
        {step === STEPS.persona && (
          <div className="wizard-step">
            <h2 className="font-heading text-xl font-semibold text-text">Datos de la persona</h2>
            <p className="wizard-step-desc">Datos de la persona adulta mayor por quien realizás la consulta.</p>

            <label>
              Nombre completo <span className="required">*</span>
              <input
                type="text"
                value={data.protected_name}
                onChange={(e) => update('protected_name', e.target.value)}
                placeholder="Nombre y apellido de la persona"
                className={errors.protected_name ? 'error' : ''}
              />
              {errors.protected_name && <span className="field-error">{errors.protected_name}</span>}
            </label>

            <label>
              DNI <span className="required">*</span>
              <input
                type="text"
                value={data.protected_dni}
                onChange={(e) => update('protected_dni', e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="Sin puntos ni espacios"
                inputMode="numeric"
                className={errors.protected_dni ? 'error' : ''}
              />
              {errors.protected_dni && <span className="field-error">{errors.protected_dni}</span>}
            </label>

            <label>
              Fecha de nacimiento <span className="required">*</span>
              <DatePicker
                selected={data.protected_birthdate}
                onChange={(d) => update('protected_birthdate', d)}
                locale={es}
                dateFormat="dd/MM/yyyy"
                maxDate={new Date()}
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={100}
                placeholderText="dd/mm/aaaa"
                className={`wizard-datepicker${errors.protected_birthdate ? ' error' : ''}`}
                wrapperClassName="wizard-datepicker-wrapper"
              />
              {errors.protected_birthdate && <span className="field-error">{errors.protected_birthdate}</span>}
              {data.protected_age !== null && (
                <span className="field-hint">Edad: {data.protected_age} años{data.protected_age >= 65 ? ' — activará módulo adultos mayores' : ''}</span>
              )}
            </label>

            {data.protected_age !== null && data.protected_age < 65 && (
              <div className="wizard-info-box">
                La persona tiene menos de 65 años. El módulo aplica igual si existe una situación de vulnerabilidad especial (dependencia, deterioro cognitivo, institucionalización).
              </div>
            )}

            <label>
              ¿Dónde se encuentra actualmente? <span className="required">*</span>
              <select
                value={data.current_location}
                onChange={(e) => update('current_location', e.target.value)}
                className={errors.current_location ? 'error' : ''}
              >
                <option value="">Seleccioná una opción</option>
                {UBICACIONES.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
              {errors.current_location && <span className="field-error">{errors.current_location}</span>}
            </label>

            <label>
              Provincia <span className="required">*</span>
              <select
                value={data.province}
                onChange={(e) => update('province', e.target.value)}
                className={errors.province ? 'error' : ''}
              >
                <option value="">Seleccioná una provincia</option>
                {PROVINCIAS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              {errors.province && <span className="field-error">{errors.province}</span>}
            </label>
          </div>
        )}

        {/* ── PASO 1: CONSULTANTE (VI.2) ── */}
        {step === STEPS.consultante && (
          <div className="wizard-step">
            <h2 className="font-heading text-xl font-semibold text-text">¿Quién realiza esta consulta?</h2>
            <p className="wizard-step-desc">Identificación de quien inicia el proceso.</p>

            <label>
              Rol <span className="required">*</span>
              <select
                value={data.applicant_role}
                onChange={(e) => update('applicant_role', e.target.value)}
                className={errors.applicant_role ? 'error' : ''}
              >
                <option value="">Seleccioná tu relación con la persona</option>
                {ROLES_CONSULTANTE.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              {errors.applicant_role && <span className="field-error">{errors.applicant_role}</span>}
            </label>

            {data.applicant_role && data.applicant_role !== 'self' && (
              <div className="wizard-alert-box">
                Al consultar en nombre de un tercero, el proceso puede requerir acreditar tu vínculo y obtener el consentimiento directo de la persona.
              </div>
            )}

            <label>
              Nombre y apellido <span className="required">*</span>
              <input
                type="text"
                value={data.applicant_name}
                onChange={(e) => update('applicant_name', e.target.value)}
                placeholder="Tu nombre completo"
                className={errors.applicant_name ? 'error' : ''}
              />
              {errors.applicant_name && <span className="field-error">{errors.applicant_name}</span>}
            </label>

            <label>
              DNI <span className="required">*</span>
              <input
                type="text"
                value={data.applicant_dni}
                onChange={(e) => update('applicant_dni', e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="Sin puntos ni espacios"
                inputMode="numeric"
                className={errors.applicant_dni ? 'error' : ''}
              />
              {errors.applicant_dni && <span className="field-error">{errors.applicant_dni}</span>}
            </label>

            <label>
              Teléfono <span className="required">*</span>
              <input
                type="tel"
                value={data.applicant_phone}
                onChange={(e) => update('applicant_phone', e.target.value)}
                placeholder="Ej: 1155667788"
                className={errors.applicant_phone ? 'error' : ''}
              />
              {errors.applicant_phone && <span className="field-error">{errors.applicant_phone}</span>}
            </label>

            <label>
              Email <span className="required">*</span>
              <input
                type="email"
                value={data.applicant_email}
                onChange={(e) => update('applicant_email', e.target.value)}
                placeholder="tu@email.com"
                className={errors.applicant_email ? 'error' : ''}
              />
              {errors.applicant_email && <span className="field-error">{errors.applicant_email}</span>}
            </label>

            <label>
              ¿Convivís con la persona? <span className="required">*</span>
              <div className="wizard-radio-group">
                {['si', 'no'].map((v) => (
                  <label key={v} className="wizard-radio-option">
                    <input type="radio" name="cohabits" value={v} checked={data.cohabits === v} onChange={() => update('cohabits', v)} />
                    {v === 'si' ? 'Sí' : 'No'}
                  </label>
                ))}
              </div>
              {errors.cohabits && <span className="field-error">{errors.cohabits}</span>}
            </label>

            <label>
              ¿Administrás dinero, bienes o tomás decisiones médicas en su nombre? <span className="required">*</span>
              <div className="wizard-radio-group">
                {['si', 'no'].map((v) => (
                  <label key={v} className="wizard-radio-option">
                    <input type="radio" name="controls_decisions" value={v} checked={data.controls_decisions === v} onChange={() => update('controls_decisions', v)} />
                    {v === 'si' ? 'Sí' : 'No'}
                  </label>
                ))}
              </div>
              {errors.controls_decisions && <span className="field-error">{errors.controls_decisions}</span>}
              {flags.conflict_of_interest && (
                <div className="wizard-alert-box mt-3">
                  El sistema detectó un posible conflicto de interés. El caso quedará sujeto a revisión institucional.
                </div>
              )}
            </label>
          </div>
        )}

        {/* ── PASO 2: AUTONOMÍA Y CAPACIDAD (VI.3) ── */}
        {step === STEPS.autonomia && (
          <div className="wizard-step">
            <h2 className="font-heading text-xl font-semibold text-text">Autonomía y capacidad</h2>
            <p className="wizard-step-desc wizard-step-disclaimer">
              Estas preguntas no constituyen un diagnóstico médico ni legal. Su finalidad es orientar la evaluación inicial del caso.
            </p>

            <label>
              ¿La persona comprende las decisiones médicas que la involucran? <span className="required">*</span>
              <select value={data.understands_decisions} onChange={(e) => update('understands_decisions', e.target.value)} className={errors.understands_decisions ? 'error' : ''}>
                <option value="">Seleccioná una opción</option>
                <option value="si">Sí</option>
                <option value="parcialmente">Parcialmente</option>
                <option value="no">No</option>
                <option value="no_sabe">No sabe / No puede determinarse</option>
              </select>
              {errors.understands_decisions && <span className="field-error">{errors.understands_decisions}</span>}
            </label>

            <label>
              ¿Puede expresar su voluntad? <span className="required">*</span>
              <select value={data.expresses_will} onChange={(e) => update('expresses_will', e.target.value)} className={errors.expresses_will ? 'error' : ''}>
                <option value="">Seleccioná una opción</option>
                <option value="si">Sí</option>
                <option value="con_dificultad">Con dificultad</option>
                <option value="no">No</option>
                <option value="no_sabe">No sabe</option>
              </select>
              {errors.expresses_will && <span className="field-error">{errors.expresses_will}</span>}
            </label>

            <label>
              ¿Tiene apoyos legales formales? <span className="required">*</span>
              <select value={data.legal_support} onChange={(e) => update('legal_support', e.target.value)} className={errors.legal_support ? 'error' : ''}>
                <option value="">Seleccioná una opción</option>
                {APOYOS_LEGALES.map((a) => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
              {errors.legal_support && <span className="field-error">{errors.legal_support}</span>}
            </label>

            <label>
              ¿Existe un diagnóstico cognitivo conocido? <span className="required">*</span>
              <select value={data.cognitive_diagnosis} onChange={(e) => update('cognitive_diagnosis', e.target.value)} className={errors.cognitive_diagnosis ? 'error' : ''}>
                <option value="">Seleccioná una opción</option>
                <option value="si">Sí (Alzheimer, demencia u otro)</option>
                <option value="no">No</option>
                <option value="no_sabe">No sabe</option>
              </select>
              {errors.cognitive_diagnosis && <span className="field-error">{errors.cognitive_diagnosis}</span>}
            </label>

            {flags.autonomy_risk && (
              <div className="wizard-alert-box">
                Las respuestas indican riesgo de autonomía. Se sugerirá evaluación del módulo de limitación a la capacidad (Anexo V).
              </div>
            )}
          </div>
        )}

        {/* ── PASO 3: MOTIVO DE LA CONSULTA (VI.4) ── */}
        {step === STEPS.motivo && (
          <div className="wizard-step">
            <h2 className="font-heading text-xl font-semibold text-text">Motivo de la consulta</h2>
            <p className="wizard-step-desc">Podés seleccionar más de una situación.</p>

            <fieldset className={`wizard-checkbox-group${errors.issue_type ? ' error' : ''}`}>
              <legend>¿Qué situación motiva la consulta? <span className="required">*</span></legend>
              {TIPOS_SITUACION.map((t) => (
                <label key={t.value} className="wizard-checkbox-option">
                  <input
                    type="checkbox"
                    checked={data.issue_type.includes(t.value)}
                    onChange={() => toggleIssueType(t.value)}
                  />
                  {t.label}
                </label>
              ))}
              {errors.issue_type && <span className="field-error">{errors.issue_type}</span>}
            </fieldset>

            <label>
              Describí la situación con el mayor detalle posible <span className="required">*</span>
              <textarea
                value={data.narrative}
                onChange={(e) => update('narrative', e.target.value)}
                rows={5}
                placeholder="Contá qué está pasando, desde cuándo y qué intentaste resolver hasta ahora..."
                className={errors.narrative ? 'error' : ''}
              />
              {errors.narrative && <span className="field-error">{errors.narrative}</span>}
            </label>

            <label>
              ¿La situación es urgente? <span className="required">*</span>
              <div className="wizard-radio-group">
                {[
                  { value: 'si', label: 'Sí, requiere atención inmediata' },
                  { value: 'no', label: 'No, puede esperar' },
                  { value: 'no_sabe', label: 'No sabe' },
                ].map((opt) => (
                  <label key={opt.value} className="wizard-radio-option">
                    <input
                      type="radio"
                      name="urgency_declared"
                      value={opt.value}
                      checked={data.urgency_declared === opt.value}
                      onChange={() => update('urgency_declared', opt.value)}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              {errors.urgency_declared && <span className="field-error">{errors.urgency_declared}</span>}
            </label>
          </div>
        )}

        {/* ── PASO 4: MATRIZ DE RIESGOS (VI.5) ── */}
        {step === STEPS.riesgos && (
          <div className="wizard-step">
            <h2 className="font-heading text-xl font-semibold text-text">Evaluación de riesgos</h2>
            <p className="wizard-step-desc">Marcá todas las situaciones que apliquen. Si hay dos o más, el caso pasa a revisión institucional prioritaria.</p>

            <div className="wizard-risk-grid">
              {RIESGOS.map((r) => (
                <label
                  key={r.key}
                  className={`wizard-risk-card${data[r.key] ? ' selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={data[r.key]}
                    onChange={(e) => update(r.key, e.target.checked)}
                    className="wizard-risk-checkbox"
                  />
                  <div className="wizard-risk-content">
                    <span className="wizard-risk-label">{r.label}</span>
                    <span className="wizard-risk-desc">{r.desc}</span>
                  </div>
                </label>
              ))}
            </div>

            {flags.multi_risk_flag && (
              <div className="wizard-alert-box mt-6">
                Se detectaron múltiples riesgos. El caso será marcado con prioridad ALTA y quedará bloqueado para asignación automática. Requiere revisión institucional.
              </div>
            )}
          </div>
        )}

        {/* ── PASO 5: CONSENTIMIENTOS REFORZADOS (VI.6) ── */}
        {step === STEPS.consentimientos && (
          <div className="wizard-step">
            <h2 className="font-heading text-xl font-semibold text-text">Consentimientos</h2>
            <p className="wizard-step-desc">Por tratarse de un módulo sensible, todos los consentimientos son obligatorios.</p>

            {data.applicant_role !== 'self' && (
              <div className="wizard-info-box mb-6">
                Este proceso puede requerir el consentimiento directo de la persona involucrada y la presentación de documentación que acredite tu vínculo.
              </div>
            )}

            {[
              { key: 'consent_interest', label: 'Declaro actuar en interés de la persona protegida y no en beneficio propio.' },
              { key: 'consent_terms', label: 'Comprendo que el servicio es de evaluación y orientación, y que no se garantizan resultados judiciales ni administrativos.' },
              { key: 'consent_eval', label: 'Autorizo la evaluación interdisciplinaria del caso, que puede incluir análisis jurídico, médico e institucional.' },
              { key: 'consent_referral', label: 'Acepto que el caso pueda ser derivado a otro módulo, a organismos externos, o rechazado fundadamente.' },
            ].map(({ key, label }) => (
              <div key={key} className={`wizard-consent-item${errors[key] ? ' error' : ''}`}>
                <label className="wizard-checkbox-option wizard-consent-check">
                  <input
                    type="checkbox"
                    checked={data[key]}
                    onChange={(e) => update(key, e.target.checked)}
                  />
                  <span>{label}</span>
                </label>
                {errors[key] && <span className="field-error">{errors[key]}</span>}
              </div>
            ))}

            <div className="wizard-summary mt-8">
              <h3 className="wizard-summary-title">Resumen del caso</h3>
              <ul className="wizard-summary-list">
                <li><strong>Persona:</strong> {data.protected_name || '—'} {data.protected_age !== null ? `(${data.protected_age} años)` : ''}</li>
                <li><strong>Ubicación:</strong> {UBICACIONES.find(u => u.value === data.current_location)?.label || '—'} · {data.province || '—'}</li>
                <li><strong>Consultante:</strong> {ROLES_CONSULTANTE.find(r => r.value === data.applicant_role)?.label || '—'}</li>
                <li><strong>Situación:</strong> {data.issue_type.map(v => TIPOS_SITUACION.find(t => t.value === v)?.label).filter(Boolean).join(', ') || '—'}</li>
                <li><strong>Urgencia:</strong> {data.urgency_declared === 'si' ? 'Sí' : data.urgency_declared === 'no' ? 'No' : data.urgency_declared === 'no_sabe' ? 'No sabe' : '—'}</li>
                <li><strong>Riesgos detectados:</strong> {RIESGOS.filter(r => data[r.key]).map(r => r.label).join(', ') || 'Ninguno marcado'}</li>
                {flags.multi_risk_flag && <li className="wizard-summary-alert"><strong>Prioridad:</strong> ALTA – revisión institucional obligatoria</li>}
                {flags.conflict_of_interest && <li className="wizard-summary-alert"><strong>Alerta:</strong> Posible conflicto de interés detectado</li>}
                {flags.autonomy_risk && <li className="wizard-summary-alert"><strong>Alerta:</strong> Riesgo de autonomía – se sugiere evaluar módulo de capacidad</li>}
              </ul>
            </div>
          </div>
        )}

        {/* ── PASO 6: CIERRE ── */}
        {step === STEPS.cierre && (
          <div className="wizard-step wizard-step-cierre">
            <div className="wizard-success-icon">✓</div>
            <h2 className="font-heading text-2xl font-semibold text-text mt-4">Consulta registrada</h2>
            <p className="mt-3 text-text/80">
              Tu caso fue ingresado al módulo de Adultos Mayores y Vulnerabilidad. Un equipo especializado lo revisará en las próximas horas.
            </p>
            {flags.multi_risk_flag && (
              <p className="mt-2 text-sm font-medium text-amber-700 bg-amber-50 rounded-xl px-4 py-3">
                Por la presencia de múltiples riesgos, tu caso tiene prioridad alta y será revisado de forma urgente.
              </p>
            )}
            <Link to="/" className="wizard-btn primary mt-8 inline-block">Volver al inicio</Link>
          </div>
        )}

        {/* ── Navegación ── */}
        {step < STEPS.cierre && (
          <div className="wizard-nav mt-8">
            {step > 0 && (
              <button type="button" onClick={handleBack} className="wizard-btn secondary">
                ← Anterior
              </button>
            )}
            {step < STEPS.consentimientos && (
              <button type="submit" className="wizard-btn primary">
                Siguiente →
              </button>
            )}
            {step === STEPS.consentimientos && (
              <button type="submit" className="wizard-btn primary" disabled={submitting}>
                {submitting ? 'Enviando...' : 'Enviar consulta'}
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
