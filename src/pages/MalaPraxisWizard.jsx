import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import { es } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'

const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
  'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones',
  'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
  'Santiago del Estero', 'Tierra del Fuego', 'Tucumán', 'Otro país'
]

const ESPECIALIDADES = [
  'Clínica médica', 'Cirugía', 'Traumatología', 'Ginecología', 'Pediatría',
  'Anestesiología', 'Cardiología', 'Neurología', 'Oncología', 'Ortopedia',
  'Radiología', 'Medicina interna', 'Emergencias', 'Otra'
]

const TIPOS_EVENTO = [
  'Error diagnóstico', 'Error quirúrgico', 'Error en medicación',
  'Falta de consentimiento informado', 'Demora en atención', 'Otro'
]

const EXPECTATIVAS = [
  'Explicación', 'Reparación económica', 'Responsabilidad institucional', 'No lo sé'
]

const initialData = {
  rol_solicitante: '',
  vinculo: '',
  nombre_completo: '',
  documento: '',
  email: '',
  telefono: '',
  jurisdiccion: '',
  paciente_nombre: '',
  paciente_edad: '',
  estado_paciente: '',
  fecha_evento: '',
  institucion: '',
  tipo_institucion: '',
  especialidad: '',
  especialidad_otra: '',
  tipo_evento: [],
  descripcion_evento: '',
  consecuencia: '',
  internacion: '',
  incapacidad: '',
  historia_clinica: null,
  estudios: [],
  consentimiento: '', // 'file' | 'no_tengo'
  consentimiento_file: null,
  expectativa: [],
  abogado_prev: '',
  declaracion: false,
  acepta_evaluacion: false
}

const sampleData = {
  ...initialData,
  rol_solicitante: 'Familiar directo',
  vinculo: 'Cónyuge',
  nombre_completo: 'María García López',
  documento: '30123456',
  email: 'maria.garcia@ejemplo.com',
  telefono: '1155667788',
  jurisdiccion: 'CABA',
  paciente_nombre: 'Juan García',
  paciente_edad: '45',
  estado_paciente: 'Vivo',
  fecha_evento: '2022-03-15',
  institucion: 'Hospital General de Agudos',
  tipo_institucion: 'Pública',
  especialidad: 'Cirugía',
  tipo_evento: ['Error quirúrgico', 'Demora en atención'],
  descripcion_evento: 'El paciente fue intervenido por apendicitis. Postoperatorio con signos de infección no tratados a tiempo. Segunda intervención por complicaciones. Secuelas por demora en el diagnóstico de la infección.',
  consecuencia: 'Secuelas graves',
  internacion: 'Sí',
  incapacidad: 'En evaluación',
  consentimiento: 'file',
  expectativa: ['Explicación', 'Reparación económica'],
  abogado_prev: 'No',
  declaracion: true,
  acepta_evaluacion: true
}

function getNextStep(current, data) {
  if (current === 0 && data.rol_solicitante === 'Paciente') return 2
  if (current >= 6) return 6
  return current + 1
}

function getPrevStep(current, data) {
  if (current === 2 && data.rol_solicitante === 'Paciente') return 0
  if (current <= 0) return 0
  return current - 1
}

function getStepLabel(index) {
  const labels = [
    'Identificación',
    'Datos del paciente',
    'Evento médico',
    'Daño alegado',
    'Documentación',
    'Expectativa',
    'Cierre'
  ]
  return labels[index] ?? ''
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

function serializeForApi(data) {
  const out = { ...data }
  if (out.historia_clinica instanceof File) {
    out.historia_clinica = { name: out.historia_clinica.name, size: out.historia_clinica.size }
  }
  if (Array.isArray(out.estudios) && out.estudios.length > 0) {
    out.estudios = out.estudios.map((f) => (f instanceof File ? { name: f.name, size: f.size } : f))
  }
  if (out.consentimiento_file instanceof File) {
    out.consentimiento_file = { name: out.consentimiento_file.name, size: out.consentimiento_file.size }
  }
  return out
}

export default function MalaPraxisWizard({ fromEvaluar = false }) {
  const navigate = useNavigate()
  const location = useLocation()
  const anexoFromState = location.state?.anexo
  const tipologiaFromState = location.state?.tipologia
  const [data, setData] = useState(initialData)
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [prescripcionAlerta, setPrescripcionAlerta] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [caseId, setCaseId] = useState(null)

  const update = (key, value) => {
    setData((d) => ({ ...d, [key]: value }))
    setErrors((e) => ({ ...e, [key]: null }))
  }

  const showForm2 = data.rol_solicitante && data.rol_solicitante !== 'Paciente'

  const validateStep = (s) => {
    const e = {}
    if (s === 0) {
      if (!data.rol_solicitante) e.rol_solicitante = 'Requerido'
      if (!data.nombre_completo?.trim()) e.nombre_completo = 'Requerido'
      if (!data.documento?.trim()) e.documento = 'Requerido'
      if (!/^\d{7,8}$/.test(data.documento?.replaceAll(/\D/g, ''))) e.documento = 'DNI 7 u 8 dígitos'
      if (!data.email?.trim()) e.email = 'Requerido'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Email inválido'
      if (!data.telefono?.trim()) e.telefono = 'Requerido'
      if (!data.jurisdiccion) e.jurisdiccion = 'Requerido'
      if (showForm2 && !data.vinculo?.trim()) e.vinculo = 'Requerido'
    }
    if (s === 1 && showForm2) {
      if (!data.paciente_edad && data.paciente_edad !== 0) e.paciente_edad = 'Requerido'
      if (!data.estado_paciente) e.estado_paciente = 'Requerido'
    }
    if (s === 2) {
      if (!data.fecha_evento) e.fecha_evento = 'Requerido'
      if (!data.institucion?.trim()) e.institucion = 'Requerido'
      if (!data.tipo_institucion) e.tipo_institucion = 'Requerido'
      if (!data.especialidad && !data.especialidad_otra?.trim()) e.especialidad = 'Requerido'
      if (!data.tipo_evento?.length) e.tipo_evento = 'Seleccione al menos uno'
      if (!data.descripcion_evento?.trim()) e.descripcion_evento = 'Requerido'
      if (data.descripcion_evento?.length > 1000) e.descripcion_evento = 'Máximo 1000 caracteres'
    }
    if (s === 3) {
      if (!data.consecuencia) e.consecuencia = 'Requerido'
      if (!data.internacion) e.internacion = 'Requerido'
      if (!data.incapacidad) e.incapacidad = 'Requerido'
    }
    if (s === 4) {
      if (!data.consentimiento) e.consentimiento = 'Indique si tiene consentimiento o no'
    }
    if (s === 5) {
      if (!data.expectativa?.length) e.expectativa = 'Requerido'
      if (!data.abogado_prev) e.abogado_prev = 'Requerido'
    }
    if (s === 6) {
      if (!data.declaracion) e.declaracion = 'Debe aceptar la declaración'
      if (!data.acepta_evaluacion) e.acepta_evaluacion = 'Debe aceptar la evaluación previa'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (!validateStep(step)) return
    setStep((s) => getNextStep(s, data))
  }

  const handlePrev = () => {
    setStep((s) => getPrevStep(s, data))
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validateStep(6)) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const payload = serializeForApi(data)
      if (fromEvaluar) {
        payload.tipologia = tipologiaFromState || 'evento_medico_adverso'
        payload.anexo = anexoFromState || 'V'
      }
      const res = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setSubmitError(json.error || `Error ${res.status}`)
        return
      }
      const newCaseId = json.caseId ?? null
      setCaseId(newCaseId)
      if (fromEvaluar) {
        navigate('/evaluar/procesando', { state: { caseId: newCaseId } })
      } else {
        setSubmitSuccess(true)
      }
    } catch (err) {
      setSubmitError(err.message || 'Error de conexión')
    } finally {
      setSubmitting(false)
    }
  }

  const handleFechaChange = (value) => {
    update('fecha_evento', value)
    if (value) {
      const anios = (Date.now() - new Date(value)) / (365.25 * 24 * 60 * 60 * 1000)
      setPrescripcionAlerta(anios >= 10)
    } else {
      setPrescripcionAlerta(false)
    }
  }

  const toggleMultiselect = (key, option) => {
    setData((d) => {
      const arr = d[key] || []
      const set = new Set(arr)
      if (set.has(option)) set.delete(option)
      else set.add(option)
      return { ...d, [key]: [...set] }
    })
    setErrors((e) => ({ ...e, [key]: null }))
  }

  const totalSteps = showForm2 ? 7 : 6
  let currentStepDisplay
  if (showForm2) currentStepDisplay = step + 1
  else currentStepDisplay = step === 0 ? 1 : step

  const handleLlenarTodo = () => {
    setData(sampleData)
    setErrors({})
    setPrescripcionAlerta(true)
  }

  const handleLlegarAlFinal = () => {
    setStep(6)
  }

  return (
    <div className="wizard">
      <header className="wizard-header">
        <Link to={fromEvaluar ? "/evaluar/tipo-caso" : "/"} className="wizard-back">← Volver</Link>
        <h1>{fromEvaluar ? 'Evaluación de Evento Médico Adverso' : 'Consulta por mala praxis'}</h1>
        <div className="wizard-actions-top">
          <button type="button" className="wizard-btn secondary" onClick={handleLlenarTodo}>
            Llenar todo
          </button>
          <button type="button" className="wizard-btn secondary" onClick={handleLlegarAlFinal}>
            Llegar al final
          </button>
        </div>
        <div className="wizard-progress">
          <span className="wizard-progress-text">Paso {currentStepDisplay} de {totalSteps}</span>
          <div className="wizard-progress-bar">
            <div className="wizard-progress-fill" style={{ width: `${(currentStepDisplay / totalSteps) * 100}%` }} />
          </div>
        </div>
      </header>

      {submitSuccess ? (
        <div className="wizard-success">
          <h2>Gracias por su consulta</h2>
          {caseId && (
            <p className="wizard-success-case-id">
              Su número de caso es: <strong>{caseId}</strong>
            </p>
          )}
          <p>Hemos registrado su consulta. En breve alguien se pondrá en contacto para informarle sobre el caso.</p>
          <Link to={fromEvaluar ? "/evaluar/tipo-caso" : "/"} className="wizard-btn primary">Volver al inicio</Link>
        </div>
      ) : (
      <form onSubmit={handleSubmit} className="wizard-form">
        {submitError && (
          <div className="wizard-submit-error">
            {submitError}
          </div>
        )}
        {/* FORM 1 - Identificación */}
        {step === 0 && (
          <div className="wizard-step">
            <h2>Identificación del solicitante</h2>
            <p className="wizard-step-desc">Datos de quién realiza la consulta.</p>

            <label>
              Rol del solicitante <span className="required">*</span>
              <select
                value={data.rol_solicitante}
                onChange={(e) => update('rol_solicitante', e.target.value)}
                className={errors.rol_solicitante ? 'error' : ''}
              >
                <option value="">Seleccione</option>
                <option value="Paciente">Paciente</option>
                <option value="Familiar directo">Familiar directo</option>
                <option value="Representante legal">Representante legal</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.rol_solicitante && <span className="field-error">{errors.rol_solicitante}</span>}
            </label>

            {showForm2 && (
              <label>
                Vínculo con el paciente <span className="required">*</span>
                <input
                  type="text"
                  value={data.vinculo}
                  onChange={(e) => update('vinculo', e.target.value)}
                  placeholder="Ej. hijo, cónyuge, tutor"
                  className={errors.vinculo ? 'error' : ''}
                />
                {errors.vinculo && <span className="field-error">{errors.vinculo}</span>}
              </label>
            )}

            <label>
              Nombre y apellido <span className="required">*</span>
              <input
                type="text"
                value={data.nombre_completo}
                onChange={(e) => update('nombre_completo', e.target.value)}
                className={errors.nombre_completo ? 'error' : ''}
              />
              {errors.nombre_completo && <span className="field-error">{errors.nombre_completo}</span>}
            </label>

            <label>
              DNI / Identificación <span className="required">*</span>
              <input
                type="text"
                inputMode="numeric"
                value={data.documento}
                onChange={(e) => update('documento', e.target.value.replaceAll(/\D/g, '').slice(0, 8))}
                placeholder="7 u 8 dígitos"
                className={errors.documento ? 'error' : ''}
              />
              {errors.documento && <span className="field-error">{errors.documento}</span>}
            </label>

            <label>
              Email <span className="required">*</span>
              <input
                type="email"
                value={data.email}
                onChange={(e) => update('email', e.target.value)}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </label>

            <label>
              Teléfono <span className="required">*</span>
              <input
                type="tel"
                value={data.telefono}
                onChange={(e) => update('telefono', e.target.value)}
                className={errors.telefono ? 'error' : ''}
              />
              {errors.telefono && <span className="field-error">{errors.telefono}</span>}
            </label>

            <label>
              Provincia / País <span className="required">*</span>
              <select
                value={data.jurisdiccion}
                onChange={(e) => update('jurisdiccion', e.target.value)}
                className={errors.jurisdiccion ? 'error' : ''}
              >
                <option value="">Seleccione</option>
                {PROVINCIAS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              {errors.jurisdiccion && <span className="field-error">{errors.jurisdiccion}</span>}
            </label>
          </div>
        )}

        {/* FORM 2 - Datos del paciente */}
        {step === 1 && showForm2 && (
          <div className="wizard-step">
            <h2>Datos del paciente</h2>
            <p className="wizard-step-desc">Información de la persona afectada.</p>

            <label>
              Nombre del paciente
              <input
                type="text"
                value={data.paciente_nombre}
                onChange={(e) => update('paciente_nombre', e.target.value)}
                placeholder="Opcional"
              />
            </label>

            <label>
              Edad del paciente <span className="required">*</span>
              <input
                type="number"
                min="0"
                max="120"
                value={data.paciente_edad}
                onChange={(e) => update('paciente_edad', e.target.value)}
                className={errors.paciente_edad ? 'error' : ''}
              />
              {data.paciente_edad && Number(data.paciente_edad) < 18 && (
                <span className="field-hint">Menor de edad</span>
              )}
              {data.paciente_edad && Number(data.paciente_edad) >= 65 && (
                <span className="field-hint">Adulto mayor</span>
              )}
              {errors.paciente_edad && <span className="field-error">{errors.paciente_edad}</span>}
            </label>

            <label>
              Estado actual del paciente <span className="required">*</span>
              <select
                value={data.estado_paciente}
                onChange={(e) => update('estado_paciente', e.target.value)}
                className={errors.estado_paciente ? 'error' : ''}
              >
                <option value="">Seleccione</option>
                <option value="Vivo">Vivo</option>
                <option value="Fallecido">Fallecido</option>
              </select>
              {data.estado_paciente === 'Fallecido' && (
                <span className="field-hint alert">Se activará protocolo y evaluación especial.</span>
              )}
              {errors.estado_paciente && <span className="field-error">{errors.estado_paciente}</span>}
            </label>
          </div>
        )}

        {/* FORM 3 - Evento médico */}
        {step === 2 && (
          <div className="wizard-step">
            <h2>Descripción del evento médico</h2>
            <p className="wizard-step-desc">Detalle del hecho (sin asumir responsabilidad).</p>

            <label>
              Fecha del hecho <span className="required">*</span>
              <DatePicker
                selected={data.fecha_evento ? new Date(data.fecha_evento) : null}
                onChange={(date) => handleFechaChange(date ? date.toISOString().slice(0, 10) : '')}
                locale={es}
                dateFormat="dd/MM/yyyy"
                placeholderText="Seleccione la fecha"
                className={`wizard-datepicker ${errors.fecha_evento ? 'error' : ''}`}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                maxDate={new Date()}
              />
              {prescripcionAlerta && (
                <span className="field-hint alert">Alerta: más de 10 años desde el hecho. Posible prescripción.</span>
              )}
              {errors.fecha_evento && <span className="field-error">{errors.fecha_evento}</span>}
            </label>

            <label>
              Lugar de atención <span className="required">*</span>
              <input
                type="text"
                value={data.institucion}
                onChange={(e) => update('institucion', e.target.value)}
                placeholder="Nombre del hospital o clínica"
                className={errors.institucion ? 'error' : ''}
              />
              {errors.institucion && <span className="field-error">{errors.institucion}</span>}
            </label>

            <label>
              Tipo de institución <span className="required">*</span>
              <select
                value={data.tipo_institucion}
                onChange={(e) => update('tipo_institucion', e.target.value)}
                className={errors.tipo_institucion ? 'error' : ''}
              >
                <option value="">Seleccione</option>
                <option value="Pública">Pública</option>
                <option value="Privada">Privada</option>
                <option value="Obra social / prepaga">Obra social / prepaga</option>
              </select>
              {errors.tipo_institucion && <span className="field-error">{errors.tipo_institucion}</span>}
            </label>

            <label>
              Especialidad médica involucrada <span className="required">*</span>
              <select
                value={data.especialidad}
                onChange={(e) => update('especialidad', e.target.value)}
                className={errors.especialidad ? 'error' : ''}
              >
                <option value="">Seleccione</option>
                {ESPECIALIDADES.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
              {data.especialidad === 'Otra' && (
                <input
                  type="text"
                  value={data.especialidad_otra}
                  onChange={(e) => update('especialidad_otra', e.target.value)}
                  placeholder="Indique la especialidad"
                  className="wizard-input-inline"
                />
              )}
              {errors.especialidad && <span className="field-error">{errors.especialidad}</span>}
            </label>

            <label>
              Tipo de evento <span className="required">*</span>
              <div className="wizard-multiselect">
                {TIPOS_EVENTO.map((opt) => (
                  <label key={opt} className="wizard-checkbox-label">
                    <input
                      type="checkbox"
                      checked={data.tipo_evento?.includes(opt)}
                      onChange={() => toggleMultiselect('tipo_evento', opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
              {errors.tipo_evento && <span className="field-error">{errors.tipo_evento}</span>}
            </label>

            <label>
              Descripción libre del hecho <span className="required">*</span>
              <textarea
                value={data.descripcion_evento}
                onChange={(e) => update('descripcion_evento', e.target.value.slice(0, 1000))}
                rows={5}
                maxLength={1000}
                placeholder="Describa los hechos con la mayor precisión posible."
                className={errors.descripcion_evento ? 'error' : ''}
              />
              <span className="char-count">{data.descripcion_evento?.length ?? 0} / 1000</span>
              <p className="wizard-disclaimer">Esta descripción no implica que exista responsabilidad médica.</p>
              {errors.descripcion_evento && <span className="field-error">{errors.descripcion_evento}</span>}
            </label>
          </div>
        )}

        {/* FORM 4 - Daño alegado */}
        {step === 3 && (
          <div className="wizard-step">
            <h2>Daño alegado</h2>
            <p className="wizard-step-desc">Consecuencias del evento.</p>

            <label>
              Consecuencia del evento <span className="required">*</span>
              <select
                value={data.consecuencia}
                onChange={(e) => update('consecuencia', e.target.value)}
                className={errors.consecuencia ? 'error' : ''}
              >
                <option value="">Seleccione</option>
                <option value="Sin secuelas">Sin secuelas</option>
                <option value="Secuelas leves">Secuelas leves</option>
                <option value="Secuelas graves">Secuelas graves</option>
                <option value="Fallecimiento">Fallecimiento</option>
              </select>
              {errors.consecuencia && <span className="field-error">{errors.consecuencia}</span>}
            </label>

            <label>
              ¿Hubo internación posterior? <span className="required">*</span>
              <div className="wizard-radio">
                <label><input type="radio" name="internacion" checked={data.internacion === 'Sí'} onChange={() => update('internacion', 'Sí')} /> Sí</label>
                <label><input type="radio" name="internacion" checked={data.internacion === 'No'} onChange={() => update('internacion', 'No')} /> No</label>
              </div>
              {errors.internacion && <span className="field-error">{errors.internacion}</span>}
            </label>

            <label>
              Incapacidad declarada <span className="required">*</span>
              <select
                value={data.incapacidad}
                onChange={(e) => update('incapacidad', e.target.value)}
                className={errors.incapacidad ? 'error' : ''}
              >
                <option value="">Seleccione</option>
                <option value="Sí">Sí</option>
                <option value="No">No</option>
                <option value="En evaluación">En evaluación</option>
              </select>
              {errors.incapacidad && <span className="field-error">{errors.incapacidad}</span>}
            </label>
          </div>
        )}

        {/* FORM 5 - Documentación */}
        {step === 4 && (
          <div className="wizard-step">
            <h2>Documentación disponible</h2>
            <p className="wizard-step-desc">No excluyente, pero recomendable para la evaluación.</p>

            <label>
              Historia clínica
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => update('historia_clinica', e.target.files?.[0] ?? null)}
              />
              <span className="field-hint">Opcional. Recomendable.</span>
            </label>

            <label>
              Estudios médicos
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={(e) => update('estudios', e.target.files ? [...(e.target.files)] : [])}
              />
            </label>

            <label>
              Consentimiento informado <span className="required">*</span>
              <div className="wizard-radio">
                <label>
                  <input
                    type="radio"
                    name="consentimiento"
                    checked={data.consentimiento === 'file'}
                    onChange={() => update('consentimiento', 'file')}
                  />
                  Adjuntar archivo
                </label>
                <label>
                  <input
                    type="radio"
                    name="consentimiento"
                    checked={data.consentimiento === 'no_tengo'}
                    onChange={() => update('consentimiento', 'no_tengo')}
                  />
                  No tengo
                </label>
              </div>
              {data.consentimiento === 'file' && (
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => update('consentimiento_file', e.target.files?.[0] ?? null)}
                  className="wizard-file-inline"
                />
              )}
              {data.consentimiento === 'no_tengo' && (
                <span className="field-hint alert">Se registrará para la evaluación.</span>
              )}
              {errors.consentimiento && <span className="field-error">{errors.consentimiento}</span>}
            </label>
          </div>
        )}

        {/* FORM 6 - Expectativa */}
        {step === 5 && (
          <div className="wizard-step">
            <h2>Expectativa del solicitante</h2>
            <p className="wizard-step-desc">Qué espera obtener con esta consulta.</p>

            <label>
              ¿Qué espera obtener? <span className="required">*</span>
              <div className="wizard-multiselect">
                {EXPECTATIVAS.map((opt) => (
                  <label key={opt} className="wizard-checkbox-label">
                    <input
                      type="checkbox"
                      checked={data.expectativa?.includes(opt)}
                      onChange={() => toggleMultiselect('expectativa', opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
              {errors.expectativa && <span className="field-error">{errors.expectativa}</span>}
            </label>

            <label>
              ¿Ya habló con un abogado? <span className="required">*</span>
              <div className="wizard-radio">
                <label><input type="radio" name="abogado_prev" checked={data.abogado_prev === 'Sí'} onChange={() => update('abogado_prev', 'Sí')} /> Sí</label>
                <label><input type="radio" name="abogado_prev" checked={data.abogado_prev === 'No'} onChange={() => update('abogado_prev', 'No')} /> No</label>
              </div>
              {errors.abogado_prev && <span className="field-error">{errors.abogado_prev}</span>}
            </label>
          </div>
        )}

        {/* FORM 7 - Cierre */}
        {step === 6 && (
          <div className="wizard-step">
            <h2>Cierre y consentimiento</h2>
            <p className="wizard-step-desc">Declaraciones necesarias para continuar.</p>

            <label className="wizard-checkbox-label block">
              <input
                type="checkbox"
                checked={data.declaracion}
                onChange={(e) => update('declaracion', e.target.checked)}
              />
              <span>Declaro que la información brindada es veraz y que asumo responsabilidad por su exactitud.</span>
              <span className="required"> *</span>
            </label>
            {errors.declaracion && <span className="field-error">{errors.declaracion}</span>}

            <label className="wizard-checkbox-label block">
              <input
                type="checkbox"
                checked={data.acepta_evaluacion}
                onChange={(e) => update('acepta_evaluacion', e.target.checked)}
              />
              <span>Entiendo que esta consulta no implica inicio de demanda ni garantía de viabilidad. Acepto la evaluación previa.</span>
              <span className="required"> *</span>
            </label>
            {errors.acepta_evaluacion && <span className="field-error">{errors.acepta_evaluacion}</span>}
          </div>
        )}

        <div className="wizard-actions">
          {step > 0 ? (
            <button type="button" className="wizard-btn secondary" onClick={handlePrev}>
              Anterior
            </button>
          ) : (
            <Link to="/" className="wizard-btn secondary">Cancelar</Link>
          )}
          {step < 6 ? (
            <button type="button" className="wizard-btn primary" onClick={handleNext}>
              Siguiente
            </button>
          ) : (
            <button type="submit" className="wizard-btn primary" disabled={submitting}>
              {submitting ? 'Enviando...' : 'Enviar consulta'}
            </button>
          )}
        </div>
      </form>
      )}
    </div>
  )
}
