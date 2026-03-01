import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const OPCIONES = [
  {
    id: 'fijo',
    title: 'Honorarios fijos',
    desc: 'Redacción demanda, presentación judicial, seguimiento inicial, asistencia técnica.',
    precio: 850,
    moneda: 'USD',
  },
  {
    id: 'mixto',
    title: 'Modelo mixto (Anticipo + resultado)',
    desc: 'Anticipo inicial más porcentaje sobre el monto obtenido si el caso prospera.',
    anticipo: 400,
    successFee: 20,
    moneda: 'USD',
  },
  {
    id: 'suscripcion',
    title: 'Suscripción profesional (B2B)',
    desc: 'Para abogados: acceso a módulo, EIM incluidas, descuento en casos.',
    precioMensual: 250,
    moneda: 'USD',
  },
]

export default function EvaluarModalidad() {
  const location = useLocation()
  const caseId = location.state?.caseId ?? null
  const reportLevel = location.state?.reportLevel ?? null
  const viabilidad = location.state?.viabilidad ?? 82

  const [modalidad, setModalidad] = useState(null)
  const [montoEstimado, setMontoEstimado] = useState(20000)
  const [resumen, setResumen] = useState(false)
  const [firmado, setFirmado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [firma, setFirma] = useState({ nombre: '', dni: '', acepta: false })
  const [reportGenerated, setReportGenerated] = useState(null)
  const [reportLoading, setReportLoading] = useState(false)

  const showMixto = viabilidad >= 60
  const honorarioMixto = OPCIONES.find((o) => o.id === 'mixto')
  const totalMixto = honorarioMixto
    ? (honorarioMixto.anticipo || 0) + (montoEstimado * (honorarioMixto.successFee || 0)) / 100
    : 0

  const handleSeleccionar = (id) => {
    setModalidad(id)
    setResumen(false)
  }

  const handleContinuarResumen = () => {
    setResumen(true)
  }

  const handleGuardarContrato = async (e) => {
    e.preventDefault()
    if (!caseId || !modalidad || !firma.acepta || !firma.nombre?.trim() || !firma.dni?.trim()) return
    setLoading(true)
    setError(null)
    try {
      const body = {
        modalidad,
        report_level: reportLevel,
      }
      if (modalidad === 'fijo') {
        body.anticipo = OPCIONES.find((o) => o.id === 'fijo')?.precio
      }
      if (modalidad === 'mixto') {
        const o = OPCIONES.find((x) => x.id === 'mixto')
        body.anticipo = o?.anticipo
        body.success_percentage = o?.successFee
        body.monto_estimado = montoEstimado
      }
      const res = await fetch(`${API_URL}/requests/${encodeURIComponent(caseId)}/contract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || `Error ${res.status}`)
        return
      }
      setFirmado(true)
    } catch (err) {
      setError(err.message || 'Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (firmado) {
    const handleGenerarInforme = async () => {
      if (!caseId) return
      setReportLoading(true)
      try {
        const res = await fetch(`${API_URL}/reports/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ caseId, report_type: 'EIM', report_level: (reportLevel || 'basic').toString().toUpperCase() }),
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok) setReportGenerated(data)
        else setError(data.error || `Error ${res.status}`)
      } catch (err) {
        setError(err.message || 'Error de conexión')
      } finally {
        setReportLoading(false)
      }
    }

    return (
      <div className="evaluar-welcome">
        <div className="evaluar-welcome-inner">
          <h1>Contrato registrado</h1>
          <p className="evaluar-welcome-desc">
            Recibimos tu elección de modalidad y aceptación. Tu caso <strong>{caseId}</strong> queda en proceso. En breve nos pondremos en contacto para coordinar los próximos pasos.
          </p>
          {!reportGenerated ? (
            <>
              <p className="evaluar-welcome-desc">Podés solicitar la generación de tu informe ahora.</p>
              <button type="button" onClick={handleGenerarInforme} disabled={reportLoading} className="evaluar-welcome-cta">
                {reportLoading ? 'Generando…' : 'Solicitar informe'}
              </button>
              {error && <p className="evaluar-modalidad-error">{error}</p>}
            </>
          ) : (
            <p className="evaluar-welcome-desc">
              Informe generado. Código: <strong>{reportGenerated.reportId}</strong>. Podés verificar su validez en: <a href={`${API_URL.replace(/\/$/, '')}${reportGenerated.verify_url}`} target="_blank" rel="noopener noreferrer">Verificar informe</a>.
            </p>
          )}
          <Link to="/" className="evaluar-welcome-cta" style={{ marginTop: '1rem', display: 'inline-block' }}>Volver al inicio</Link>
        </div>
      </div>
    )
  }

  if (!resumen) {
    return (
      <div className="evaluar-modalidad">
        <div className="evaluar-modalidad-inner">
          <h1>Modalidad de contratación</h1>
          <p className="evaluar-modalidad-sub">Elegí la forma de trabajo más adecuada para tu caso.</p>
          {caseId && (
            <p className="evaluar-modalidad-case">Caso <strong>{caseId}</strong>{reportLevel && ` · Informe ${reportLevel}`}</p>
          )}

          <div className="evaluar-modalidad-grid">
            <div
              className={`evaluar-modalidad-card ${modalidad === 'fijo' ? 'evaluar-modalidad-card--selected' : ''}`}
              onClick={() => handleSeleccionar('fijo')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSeleccionar('fijo')}
            >
              <h3>Honorarios fijos</h3>
              <p>{OPCIONES[0].desc}</p>
              <p className="evaluar-modalidad-precio">USD {OPCIONES[0].precio}</p>
              <button type="button" className="evaluar-modalidad-btn">Seleccionar honorarios fijos</button>
            </div>

            {showMixto && (
              <div
                className={`evaluar-modalidad-card ${modalidad === 'mixto' ? 'evaluar-modalidad-card--selected' : ''}`}
                onClick={() => handleSeleccionar('mixto')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSeleccionar('mixto')}
              >
                <h3>Modelo mixto</h3>
                <p>Anticipo USD {honorarioMixto?.anticipo} + {honorarioMixto?.successFee}% del resultado</p>
                <div className="evaluar-modalidad-simulator">
                  <label>Monto estimado del caso (USD)</label>
                  <input
                    type="range"
                    min={5000}
                    max={100000}
                    step={1000}
                    value={montoEstimado}
                    onChange={(e) => setMontoEstimado(Number(e.target.value))}
                  />
                  <span className="evaluar-modalidad-simulator-value">{montoEstimado.toLocaleString('es-AR')}</span>
                  <p className="evaluar-modalidad-simulator-total">Si prospera: honorario estimado USD {Math.round(totalMixto).toLocaleString('es-AR')}</p>
                </div>
                <button type="button" className="evaluar-modalidad-btn">Seleccionar modelo mixto</button>
              </div>
            )}

            <div
              className={`evaluar-modalidad-card evaluar-modalidad-card--b2b ${modalidad === 'suscripcion' ? 'evaluar-modalidad-card--selected' : ''}`}
              onClick={() => handleSeleccionar('suscripcion')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSeleccionar('suscripcion')}
            >
              <h3>Suscripción profesional (B2B)</h3>
              <p>{OPCIONES[2].desc}</p>
              <p className="evaluar-modalidad-precio">USD {OPCIONES[2].precioMensual} / mes</p>
              <button type="button" className="evaluar-modalidad-btn">Activar plan profesional</button>
            </div>
          </div>

          <p className="evaluar-modalidad-transparencia">
            NexoSalud Legal no garantiza resultado judicial. Los honorarios por resultado se aplican exclusivamente en caso de obtención efectiva de beneficio económico.
          </p>

          <div className="evaluar-modalidad-actions">
            <button
              type="button"
              disabled={!modalidad}
              onClick={handleContinuarResumen}
              className="evaluar-welcome-cta"
            >
              Continuar y firmar contrato
            </button>
            <Link to="/evaluar/oferta" state={{ caseId }} className="evaluar-welcome-back">← Volver a oferta</Link>
          </div>
        </div>
      </div>
    )
  }

  const op = OPCIONES.find((o) => o.id === modalidad)
  return (
    <div className="evaluar-modalidad evaluar-modalidad--resumen">
      <div className="evaluar-modalidad-inner">
        <h1>Resumen antes de confirmar</h1>
        <div className="evaluar-modalidad-resumen">
          <p><strong>Modalidad:</strong> {op?.title}</p>
          {modalidad === 'fijo' && <p>Monto total: USD {op?.precio}</p>}
          {modalidad === 'mixto' && (
            <>
              <p>Anticipo: USD {op?.anticipo}</p>
              <p>Success fee: {op?.successFee}%</p>
              <p>Monto estimado caso: USD {montoEstimado.toLocaleString('es-AR')}</p>
              <p>Condición: Sentencia favorable o acuerdo homologado.</p>
            </>
          )}
          {modalidad === 'suscripcion' && <p>Precio mensual: USD {op?.precioMensual}</p>}
        </div>

        <form onSubmit={handleGuardarContrato} className="evaluar-modalidad-firma">
          <h2>Firma y aceptación</h2>
          <label>
            Nombre y apellido
            <input
              type="text"
              value={firma.nombre}
              onChange={(e) => setFirma((f) => ({ ...f, nombre: e.target.value }))}
              required
            />
          </label>
          <label>
            DNI
            <input
              type="text"
              inputMode="numeric"
              value={firma.dni}
              onChange={(e) => setFirma((f) => ({ ...f, dni: e.target.value.replace(/\D/g, '').slice(0, 8) }))}
              required
            />
          </label>
          <label className="evaluar-modalidad-check">
            <input
              type="checkbox"
              checked={firma.acepta}
              onChange={(e) => setFirma((f) => ({ ...f, acepta: e.target.checked }))}
              required
            />
            Acepto las condiciones de la modalidad elegida y declaro que la información es veraz. Fecha: {new Date().toLocaleString('es-AR')}
          </label>
          {error && <p className="evaluar-modalidad-error">{error}</p>}
          <button type="submit" disabled={loading} className="evaluar-welcome-cta">
            {loading ? 'Guardando...' : 'Confirmar contrato'}
          </button>
        </form>
      </div>
    </div>
  )
}
