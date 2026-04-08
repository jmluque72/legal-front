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

const TIPOS_COBERTURA = ['Obra social', 'Medicina prepaga', 'ART', 'Otra']

const TIPOS_PRESTACION = [
  'Medicamentos',
  'Consultas / prácticas ambulatorias',
  'Estudios / laboratorio / imagen',
  'Internación',
  'Prótesis / órtesis / insumos',
  'Otro',
]

const SITUACION_ENTIDAD = [
  'Rechazo total del reintegro',
  'Rechazo parcial',
  'Sin respuesta en plazo razonable',
  'Demora indebida',
  'Otro',
]

const EXPECTATIVAS_REINTEGRO = [
  'Reintegro del total abonado',
  'Reintegro parcial aceptable',
  'Revisión del criterio de la cobertura',
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
  tipo_prestacion: '',
  tipo_prestacion_otra: '',
  descripcion_prestacion: '',
  diagnostico_motivo: '',
  fecha_gasto_principal: '',
  monto_reclamado_ars: '',
  tiene_factura: '',
  situacion_entidad: '',
  reclamo_interno_entidad: '',
  reclamo_superintendencia: '',
  relato_ampliado: '',
  facturas_comprobantes: [],
  expectativa_reintegro: [],
  abogado_prev: '',
  declaracion: false,
  acepta_evaluacion: false,
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

function serializeForApi(data) {
  const out = { ...data }
  if (Array.isArray(out.facturas_comprobantes) && out.facturas_comprobantes.length > 0) {
    out.facturas_comprobantes = out.facturas_comprobantes.map((f) =>
      f instanceof File ? { name: f.name, size: f.size } : f
    )
  }
  return out
}

/** Índices de paso: si ya hay datos en el caso (desdeRegistrado), no pedimos identificación. */
function stepIndices(desdeRegistrado) {
  if (desdeRegistrado) {
    return { cobertura: 0, prestacion: 1, gastos: 2, tramite: 3, docs: 4, expectativa: 5, cierre: 6 }
  }
  return { id: 0, cobertura: 1, prestacion: 2, gastos: 3, tramite: 4, docs: 5, expectativa: 6, cierre: 7 }
}

export default function ReintegroAnexoVIIIWizard({ fromEvaluar = false }) {
  const navigate = useNavigate()
  const location = useLocation()
  const anexoFromState = location.state?.anexo
  const tipologiaFromState = location.state?.tipologia
  const desdeRegistrado = location.state?.desdeRegistrado
  const caseIdExistente = location.state?.caseId

  const SI = stepIndices(!!desdeRegistrado)
  const totalSteps = desdeRegistrado ? 7 : 8
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
    if (s === SI.prestacion) {
      if (!data.tipo_prestacion) e.tipo_prestacion = 'Requerido'
      if (data.tipo_prestacion === 'Otro' && !data.tipo_prestacion_otra?.trim()) {
        e.tipo_prestacion_otra = 'Describí la prestación'
      }
      if (!data.descripcion_prestacion?.trim()) e.descripcion_prestacion = 'Requerido'
      if (data.descripcion_prestacion?.length > 2000) e.descripcion_prestacion = 'Máximo 2000 caracteres'
    }
    if (s === SI.gastos) {
      if (!data.fecha_gasto_principal) e.fecha_gasto_principal = 'Requerido'
      if (!data.monto_reclamado_ars?.trim()) e.monto_reclamado_ars = 'Requerido'
      const m = Number(String(data.monto_reclamado_ars).replaceAll('.', '').replace(',', '.'))
      if (Number.isNaN(m) || m <= 0) e.monto_reclamado_ars = 'Indicá un monto válido'
      if (!data.tiene_factura) e.tiene_factura = 'Requerido'
    }
    if (s === SI.tramite) {
      if (!data.situacion_entidad) e.situacion_entidad = 'Requerido'
      if (!data.reclamo_interno_entidad) e.reclamo_interno_entidad = 'Requerido'
      if (!data.reclamo_superintendencia) e.reclamo_superintendencia = 'Requerido'
      if (!data.relato_ampliado?.trim()) e.relato_ampliado = 'Requerido'
      if (data.relato_ampliado?.length > 3000) e.relato_ampliado = 'Máximo 3000 caracteres'
    }
    if (s === SI.expectativa) {
      if (!data.expectativa_reintegro?.length) e.expectativa_reintegro = 'Seleccioná al menos una opción'
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
        payload.tipologia = tipologiaFromState || 'reintegro'
        payload.anexo = anexoFromState || 'VIII'
      }
      payload.formulario_anexo = 'VIII_reintegros'

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
          {fromEvaluar ? 'Anexo VIII – Reintegros y prestaciones de salud' : 'Consulta por reintegro'}
        </h1>
        <p className="mt-2 text-sm text-text/75 max-w-xl">
          Datos orientados a reclamos por gastos de salud abonados y negativa o demora del reintegro por parte de la cobertura.
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
            <p className="wizard-step-desc">Obra social, prepaga u otra entidad frente a la cual reclamás el reintegro.</p>
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

        {step === SI.prestacion && (
          <div className="wizard-step">
            <h2>Prestación por la que pedís reintegro</h2>
            <p className="wizard-step-desc">Qué gasto abonaste y querés que te reintegren.</p>
            <label>
              Tipo de prestación <span className="required">*</span>
              <select
                value={data.tipo_prestacion}
                onChange={(e) => update('tipo_prestacion', e.target.value)}
                className={errors.tipo_prestacion ? 'error' : ''}
              >
                <option value="">Seleccione</option>
                {TIPOS_PRESTACION.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              {errors.tipo_prestacion && <span className="field-error">{errors.tipo_prestacion}</span>}
            </label>
            {data.tipo_prestacion === 'Otro' && (
              <label>
                Detalle <span className="required">*</span>
                <input
                  type="text"
                  value={data.tipo_prestacion_otra}
                  onChange={(e) => update('tipo_prestacion_otra', e.target.value)}
                  className={errors.tipo_prestacion_otra ? 'error' : ''}
                />
                {errors.tipo_prestacion_otra && <span className="field-error">{errors.tipo_prestacion_otra}</span>}
              </label>
            )}
            <label>
              Descripción de la prestación y circunstancias <span className="required">*</span>
              <textarea
                value={data.descripcion_prestacion}
                onChange={(e) => update('descripcion_prestacion', e.target.value.slice(0, 2000))}
                rows={5}
                maxLength={2000}
                placeholder="Ej. medicación oncológica, estudios prequirúrgicos, honorarios, etc."
                className={errors.descripcion_prestacion ? 'error' : ''}
              />
              <span className="char-count">{data.descripcion_prestacion?.length ?? 0} / 2000</span>
              {errors.descripcion_prestacion && <span className="field-error">{errors.descripcion_prestacion}</span>}
            </label>
            <label>
              Diagnóstico o indicación médica (opcional)
              <textarea
                value={data.diagnostico_motivo}
                onChange={(e) => update('diagnostico_motivo', e.target.value.slice(0, 1000))}
                rows={3}
                maxLength={1000}
                placeholder="Si aplica, para contextualizar el pedido de cobertura/reintegro."
              />
            </label>
          </div>
        )}

        {step === SI.gastos && (
          <div className="wizard-step">
            <h2>Montos y comprobantes</h2>
            <p className="wizard-step-desc">Fecha principal del gasto y monto total reclamado.</p>
            <label>
              Fecha del gasto / atención principal <span className="required">*</span>
              <DatePicker
                selected={data.fecha_gasto_principal ? new Date(data.fecha_gasto_principal) : null}
                onChange={(date) =>
                  update('fecha_gasto_principal', date ? date.toISOString().slice(0, 10) : '')
                }
                locale={es}
                dateFormat="dd/MM/yyyy"
                placeholderText="Seleccioná la fecha"
                className={`wizard-datepicker ${errors.fecha_gasto_principal ? 'error' : ''}`}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                maxDate={new Date()}
              />
              {errors.fecha_gasto_principal && <span className="field-error">{errors.fecha_gasto_principal}</span>}
            </label>
            <label>
              Monto total reclamado (ARS) <span className="required">*</span>
              <input
                type="text"
                inputMode="decimal"
                value={data.monto_reclamado_ars}
                onChange={(e) => update('monto_reclamado_ars', e.target.value)}
                placeholder="Ej. 150000 o 150000,50"
                className={errors.monto_reclamado_ars ? 'error' : ''}
              />
              {errors.monto_reclamado_ars && <span className="field-error">{errors.monto_reclamado_ars}</span>}
            </label>
            <label>
              Facturas / comprobantes de pago <span className="required">*</span>
              <select
                value={data.tiene_factura}
                onChange={(e) => update('tiene_factura', e.target.value)}
                className={errors.tiene_factura ? 'error' : ''}
              >
                <option value="">Seleccione</option>
                <option value="completos">Tengo factura y comprobantes completos</option>
                <option value="parciales">Tengo documentación parcial</option>
                <option value="no">Aún no tengo factura formal</option>
              </select>
              {errors.tiene_factura && <span className="field-error">{errors.tiene_factura}</span>}
            </label>
          </div>
        )}

        {step === SI.tramite && (
          <div className="wizard-step">
            <h2>Trámite ante la cobertura</h2>
            <p className="wizard-step-desc">Qué respondió la entidad y si iniciaste reclamos formales.</p>
            <label>
              Situación con la entidad <span className="required">*</span>
              <select
                value={data.situacion_entidad}
                onChange={(e) => update('situacion_entidad', e.target.value)}
                className={errors.situacion_entidad ? 'error' : ''}
              >
                <option value="">Seleccione</option>
                {SITUACION_ENTIDAD.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.situacion_entidad && <span className="field-error">{errors.situacion_entidad}</span>}
            </label>
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
              Relato ampliado (cronología, montos, respuestas de la cobertura) <span className="required">*</span>
              <textarea
                value={data.relato_ampliado}
                onChange={(e) => update('relato_ampliado', e.target.value.slice(0, 3000))}
                rows={6}
                maxLength={3000}
                placeholder="Incluí fechas de pedidos, negativas, montos rechazados y cualquier dato útil."
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
            <p className="wizard-step-desc">Facturas, órdenes, autorizaciones, emails. Podés adjuntar ahora o enviarlos después si te los solicitan.</p>
            <label>
              Facturas y comprobantes
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={(e) =>
                  update('facturas_comprobantes', e.target.files ? [...e.target.files] : [])
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
                {EXPECTATIVAS_REINTEGRO.map((opt) => (
                  <label key={opt} className="wizard-checkbox-label">
                    <input
                      type="checkbox"
                      checked={data.expectativa_reintegro?.includes(opt)}
                      onChange={() => toggleMultiselect('expectativa_reintegro', opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
              {errors.expectativa_reintegro && <span className="field-error">{errors.expectativa_reintegro}</span>}
            </label>
            <label>
              ¿Ya consultaste con un abogado? <span className="required">*</span>
              <div className="wizard-radio">
                <label>
                  <input
                    type="radio"
                    name="abogado_prev"
                    checked={data.abogado_prev === 'Sí'}
                    onChange={() => update('abogado_prev', 'Sí')}
                  />{' '}
                  Sí
                </label>
                <label>
                  <input
                    type="radio"
                    name="abogado_prev"
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
