import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
  'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza', 'Misiones',
  'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
  'Santiago del Estero', 'Tierra del Fuego', 'Tucumán', 'Otro país',
]

const TIPOS_COBERTURA = ['Obra social', 'Medicina prepaga', 'ART', 'Otra']

const SITUACION_BIOMETRIA = [
  'No puedo completar el registro biométrico obligatorio',
  'Me niegan atención o cobertura por fallas en el registro / afiliación',
  'Datos biométricos incorrectos o confundidos con otro afiliado',
  'Uso indebido o violación de privacidad de mis datos biométricos',
  'Demoras o errores reiterados de la cobertura en el trámite',
  'Otro',
]

const EXPECTATIVAS_BIOMETRIA = [
  'Regularizar mi registro o afiliación',
  'Obtener la cobertura o atención que me niegan',
  'Protección de datos personales / privacidad',
  'Indemnización o reparación',
  'Asesoramiento sobre próximos pasos',
  'No lo sé',
]

const initialData = {
  nombre_completo: '',
  documento: '',
  email: '',
  telefono: '',
  jurisdiccion: '',
  tipo_cobertura: '',
  nombre_entidad: '',
  numero_afiliado: '',
  plan_nombre: '',
  situacion_biometria: '',
  situacion_otra: '',
  descripcion_problema: '',
  relato_ampliado: '',
  reclamo_interno_entidad: '',
  reclamo_superintendencia: '',
  documentacion_adjunta: [],
  expectativa_biometria: [],
  abogado_prev: '',
  declaracion: false,
  acepta_evaluacion: false,
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

function serializeForApi(data) {
  const out = { ...data }
  if (Array.isArray(out.documentacion_adjunta) && out.documentacion_adjunta.length > 0) {
    out.documentacion_adjunta = out.documentacion_adjunta.map((f) =>
      f instanceof File ? { name: f.name, size: f.size } : f
    )
  }
  return out
}

function stepIndices(desdeRegistrado) {
  if (desdeRegistrado) {
    return { cobertura: 0, problema: 1, tramite: 2, docs: 3, expectativa: 4, cierre: 5 }
  }
  return { id: 0, cobertura: 1, problema: 2, tramite: 3, docs: 4, expectativa: 5, cierre: 6 }
}

export default function BiometriaWizard({ fromEvaluar = false }) {
  const navigate = useNavigate()
  const location = useLocation()
  const anexoFromState = location.state?.anexo
  const tipologiaFromState = location.state?.tipologia
  const desdeRegistrado = location.state?.desdeRegistrado
  const caseIdExistente = location.state?.caseId

  const SI = stepIndices(!!desdeRegistrado)
  const totalSteps = desdeRegistrado ? 6 : 7
  const lastStep = SI.cierre

  const [data, setData] = useState(initialData)
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const update = (key, value) => {
    setData((d) => ({ ...d, [key]: value }))
    setErrors((e) => ({ ...e, [key]: null }))
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

  const validateStep = (s) => {
    const e = {}
    if (!desdeRegistrado && s === SI.id) {
      if (!data.nombre_completo?.trim()) e.nombre_completo = 'Requerido'
      if (!data.documento?.trim()) e.documento = 'Requerido'
      if (!/^\d{7,8}$/.test(data.documento?.replaceAll(/\D/g, ''))) e.documento = 'DNI 7 u 8 dígitos'
      if (!data.email?.trim()) e.email = 'Requerido'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = 'Email inválido'
      if (!data.telefono?.trim()) e.telefono = 'Requerido'
      if (!data.jurisdiccion) e.jurisdiccion = 'Requerido'
    }
    if (s === SI.cobertura) {
      if (!data.tipo_cobertura) e.tipo_cobertura = 'Requerido'
      if (!data.nombre_entidad?.trim()) e.nombre_entidad = 'Requerido'
      if (!data.numero_afiliado?.trim()) e.numero_afiliado = 'Requerido'
    }
    if (s === SI.problema) {
      if (!data.situacion_biometria) e.situacion_biometria = 'Requerido'
      if (data.situacion_biometria === 'Otro' && !data.situacion_otra?.trim()) {
        e.situacion_otra = 'Describí la situación'
      }
      if (!data.descripcion_problema?.trim()) e.descripcion_problema = 'Requerido'
      if (data.descripcion_problema?.length > 2000) e.descripcion_problema = 'Máximo 2000 caracteres'
    }
    if (s === SI.tramite) {
      if (!data.relato_ampliado?.trim()) e.relato_ampliado = 'Requerido'
      if (data.relato_ampliado?.length > 3000) e.relato_ampliado = 'Máximo 3000 caracteres'
      if (!data.reclamo_interno_entidad) e.reclamo_interno_entidad = 'Requerido'
      if (!data.reclamo_superintendencia) e.reclamo_superintendencia = 'Requerido'
    }
    if (s === SI.expectativa) {
      if (!data.expectativa_biometria?.length) e.expectativa_biometria = 'Seleccioná al menos una opción'
      if (!data.abogado_prev) e.abogado_prev = 'Requerido'
    }
    if (s === SI.cierre) {
      if (!data.declaracion) e.declaracion = 'Debés aceptar la declaración'
      if (!data.acepta_evaluacion) e.acepta_evaluacion = 'Debés aceptar la evaluación previa'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (!validateStep(step)) return
    if (step < lastStep) setStep((x) => x + 1)
  }

  const handlePrev = () => {
    if (step > 0) setStep((x) => x - 1)
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validateStep(step)) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const payload = serializeForApi(data)
      if (fromEvaluar) {
        payload.tipologia = tipologiaFromState || 'biometria'
        payload.anexo = anexoFromState || 'IV'
      }
      payload.formulario_anexo = 'IV_biometria'

      if (desdeRegistrado && caseIdExistente) {
        const omit = ['nombre_completo', 'documento', 'email', 'telefono', 'jurisdiccion']
        const patch = Object.fromEntries(Object.entries(payload).filter(([k]) => !omit.includes(k)))
        const res = await fetch(`${API_URL}/requests/${caseIdExistente}/datos`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) {
          setSubmitError(json.error || `Error ${res.status}`)
          return
        }
        navigate('/evaluar/registrado', {
          state: { caseId: caseIdExistente, formularioCompleto: true },
          replace: true,
        })
        return
      }

      const res = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setSubmitError(json.error || `Error ${res.status}`)
        return
      }
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

  const backHref = desdeRegistrado ? '/evaluar/registrado' : fromEvaluar ? '/evaluar/tipo-caso' : '/'

  return (
    <div className="wizard evaluar-flow mx-auto max-w-2xl px-4 py-12 md:py-16">
      <header className="wizard-header mb-10">
        <Link to={backHref} className="wizard-back text-sm font-medium text-primary hover:underline">
          ← Volver
        </Link>
        <h1 className="font-heading mt-4 text-3xl font-bold text-text">
          {fromEvaluar ? 'Anexo IV – Datos biométricos y afiliación' : 'Consulta por datos biométricos'}
        </h1>
        <p className="mt-2 text-sm text-text/75 max-w-xl">
          Registro de huella u otros datos biométricos, fallas de afiliación y conflictos con la cobertura vinculados a
          esos datos.
        </p>
        <div className="wizard-progress mt-6">
          <span className="wizard-progress-text">
            Paso {step + 1} de {totalSteps}
          </span>
          <div className="wizard-progress-bar">
            <div
              className="wizard-progress-fill"
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="wizard-form">
        {submitError && <div className="wizard-submit-error">{submitError}</div>}

        {!desdeRegistrado && step === SI.id && (
          <div className="wizard-step">
            <h2 className="font-heading text-xl font-semibold text-text">Identificación</h2>
            <p className="wizard-step-desc">Quien realiza la consulta.</p>
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
              DNI <span className="required">*</span>
              <input
                type="text"
                inputMode="numeric"
                value={data.documento}
                onChange={(e) => update('documento', e.target.value.replaceAll(/\D/g, '').slice(0, 8))}
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
              Provincia / país <span className="required">*</span>
              <select
                value={data.jurisdiccion}
                onChange={(e) => update('jurisdiccion', e.target.value)}
                className={errors.jurisdiccion ? 'error' : ''}
              >
                <option value="">Seleccione</option>
                {PROVINCIAS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.jurisdiccion && <span className="field-error">{errors.jurisdiccion}</span>}
            </label>
          </div>
        )}

        {step === SI.cobertura && (
          <div className="wizard-step">
            <h2>Cobertura y afiliación</h2>
            <p className="wizard-step-desc">Obra social, prepaga u otra entidad frente a la cual surge el conflicto.</p>
            <label>
              Tipo de cobertura <span className="required">*</span>
              <select
                value={data.tipo_cobertura}
                onChange={(e) => update('tipo_cobertura', e.target.value)}
                className={errors.tipo_cobertura ? 'error' : ''}
              >
                <option value="">Seleccione</option>
                {TIPOS_COBERTURA.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.tipo_cobertura && <span className="field-error">{errors.tipo_cobertura}</span>}
            </label>
            <label>
              Nombre de la obra social / prepaga / ART <span className="required">*</span>
              <input
                type="text"
                value={data.nombre_entidad}
                onChange={(e) => update('nombre_entidad', e.target.value)}
                placeholder="Ej. OSMECON, Swiss Medical, etc."
                className={errors.nombre_entidad ? 'error' : ''}
              />
              {errors.nombre_entidad && <span className="field-error">{errors.nombre_entidad}</span>}
            </label>
            <label>
              Número de afiliado / integrante <span className="required">*</span>
              <input
                type="text"
                value={data.numero_afiliado}
                onChange={(e) => update('numero_afiliado', e.target.value)}
                className={errors.numero_afiliado ? 'error' : ''}
              />
              {errors.numero_afiliado && <span className="field-error">{errors.numero_afiliado}</span>}
            </label>
            <label>
              Plan (opcional)
              <input
                type="text"
                value={data.plan_nombre}
                onChange={(e) => update('plan_nombre', e.target.value)}
                placeholder="Nombre del plan si lo sabés"
              />
            </label>
          </div>
        )}

        {step === SI.problema && (
          <div className="wizard-step">
            <h2>Situación vinculada a datos biométricos</h2>
            <p className="wizard-step-desc">Qué problema tenés con el registro o con la cobertura en relación a esos datos.</p>
            <label>
              Tipo de situación <span className="required">*</span>
              <select
                value={data.situacion_biometria}
                onChange={(e) => update('situacion_biometria', e.target.value)}
                className={errors.situacion_biometria ? 'error' : ''}
              >
                <option value="">Seleccione</option>
                {SITUACION_BIOMETRIA.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.situacion_biometria && <span className="field-error">{errors.situacion_biometria}</span>}
            </label>
            {data.situacion_biometria === 'Otro' && (
              <label>
                Detalle <span className="required">*</span>
                <input
                  type="text"
                  value={data.situacion_otra}
                  onChange={(e) => update('situacion_otra', e.target.value)}
                  className={errors.situacion_otra ? 'error' : ''}
                />
                {errors.situacion_otra && <span className="field-error">{errors.situacion_otra}</span>}
              </label>
            )}
            <label>
              Descripción del problema <span className="required">*</span>
              <textarea
                value={data.descripcion_problema}
                onChange={(e) => update('descripcion_problema', e.target.value.slice(0, 2000))}
                rows={5}
                maxLength={2000}
                placeholder="Ej. intentos de registro, mensajes de error, negativas de atención, plazos…"
                className={errors.descripcion_problema ? 'error' : ''}
              />
              <span className="char-count">{data.descripcion_problema?.length ?? 0} / 2000</span>
              {errors.descripcion_problema && <span className="field-error">{errors.descripcion_problema}</span>}
            </label>
          </div>
        )}

        {step === SI.tramite && (
          <div className="wizard-step">
            <h2>Trámite y relato</h2>
            <p className="wizard-step-desc">Cronología y reclamos que hayas iniciado.</p>
            <label>
              ¿Presentaste reclamo ante la entidad? <span className="required">*</span>
              <select
                value={data.reclamo_interno_entidad}
                onChange={(e) => update('reclamo_interno_entidad', e.target.value)}
                className={errors.reclamo_interno_entidad ? 'error' : ''}
              >
                <option value="">Seleccione</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
                <option value="tramite">En trámite</option>
              </select>
              {errors.reclamo_interno_entidad && <span className="field-error">{errors.reclamo_interno_entidad}</span>}
            </label>
            <label>
              ¿Denuncia o reclamo ante organismo de control (ej. Superintendencia)? <span className="required">*</span>
              <select
                value={data.reclamo_superintendencia}
                onChange={(e) => update('reclamo_superintendencia', e.target.value)}
                className={errors.reclamo_superintendencia ? 'error' : ''}
              >
                <option value="">Seleccione</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
                <option value="tramite">En trámite</option>
              </select>
              {errors.reclamo_superintendencia && (
                <span className="field-error">{errors.reclamo_superintendencia}</span>
              )}
            </label>
            <label>
              Relato ampliado (fechas, intentos, respuestas) <span className="required">*</span>
              <textarea
                value={data.relato_ampliado}
                onChange={(e) => update('relato_ampliado', e.target.value.slice(0, 3000))}
                rows={6}
                maxLength={3000}
                placeholder="Incluí fechas relevantes y cualquier intercambio con la cobertura."
                className={errors.relato_ampliado ? 'error' : ''}
              />
              <span className="char-count">{data.relato_ampliado?.length ?? 0} / 3000</span>
              {errors.relato_ampliado && <span className="field-error">{errors.relato_ampliado}</span>}
            </label>
          </div>
        )}

        {step === SI.docs && (
          <div className="wizard-step">
            <h2>Documentación (opcional)</h2>
            <p className="wizard-step-desc">
              Capturas, emails, credenciales de reclamo, comprobantes. Podés adjuntar ahora o enviarlos después.
            </p>
            <label>
              Archivos
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={(e) =>
                  update('documentacion_adjunta', e.target.files ? [...e.target.files] : [])
                }
              />
              <span className="field-hint">PDF o imagen. Opcional en este paso.</span>
            </label>
          </div>
        )}

        {step === SI.expectativa && (
          <div className="wizard-step">
            <h2>Expectativa</h2>
            <p className="wizard-step-desc">Qué buscás con esta consulta.</p>
            <label>
              Objetivo principal <span className="required">*</span>
              <div className="wizard-multiselect">
                {EXPECTATIVAS_BIOMETRIA.map((opt) => (
                  <label key={opt} className="wizard-checkbox-label">
                    <input
                      type="checkbox"
                      checked={data.expectativa_biometria?.includes(opt)}
                      onChange={() => toggleMultiselect('expectativa_biometria', opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
              {errors.expectativa_biometria && <span className="field-error">{errors.expectativa_biometria}</span>}
            </label>
            <label>
              ¿Ya consultaste con un abogado? <span className="required">*</span>
              <div className="wizard-radio">
                <label>
                  <input
                    type="radio"
                    name="abogado_prev_bio"
                    checked={data.abogado_prev === 'Sí'}
                    onChange={() => update('abogado_prev', 'Sí')}
                  />{' '}
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="abogado_prev_bio"
                    checked={data.abogado_prev === 'No'}
                    onChange={() => update('abogado_prev', 'No')}
                  />{' '}
                  No
                </label>
              </div>
              {errors.abogado_prev && <span className="field-error">{errors.abogado_prev}</span>}
            </label>
          </div>
        )}

        {step === SI.cierre && (
          <div className="wizard-step">
            <h2>Cierre y consentimiento</h2>
            <p className="wizard-step-desc">Declaraciones para continuar con la evaluación.</p>
            <label className="wizard-checkbox-label block">
              <input
                type="checkbox"
                checked={data.declaracion}
                onChange={(e) => update('declaracion', e.target.checked)}
              />
              <span>Declaro que la información brindada es veraz y asumo responsabilidad por su exactitud.</span>
              <span className="required"> *</span>
            </label>
            {errors.declaracion && <span className="field-error">{errors.declaracion}</span>}
            <label className="wizard-checkbox-label block">
              <input
                type="checkbox"
                checked={data.acepta_evaluacion}
                onChange={(e) => update('acepta_evaluacion', e.target.checked)}
              />
              <span>
                Entiendo que esta consulta no inicia demanda judicial ni garantiza resultado. Acepto la evaluación previa.
              </span>
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
            <Link to={backHref} className="wizard-btn secondary">
              Cancelar
            </Link>
          )}
          {step < lastStep ? (
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
    </div>
  )
}
