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

const inputClass = 'mt-2 w-full rounded-xl border border-primary/20 bg-white px-4 py-3 text-text placeholder:text-text/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20'
const labelClass = 'font-heading text-sm font-semibold text-text'

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
      <div className="mx-auto max-w-2xl px-4 py-16 md:py-24">
        <h1 className="font-heading text-3xl font-bold text-text md:text-4xl">
          Contrato registrado
        </h1>
        <p className="mt-6 text-lg text-text/85">
          Recibimos tu elección de modalidad y aceptación. Tu caso <strong>{caseId}</strong> queda en proceso. En breve nos pondremos en contacto para coordinar los próximos pasos.
        </p>
        {!reportGenerated ? (
          <div className="mt-8">
            <p className="text-text/85">Podés solicitar la generación de tu informe ahora.</p>
            <button
              type="button"
              onClick={handleGenerarInforme}
              disabled={reportLoading}
              className="mt-4 rounded-full bg-accent px-7 py-3.5 font-semibold text-primary transition hover:bg-accent/90 disabled:opacity-70"
            >
              {reportLoading ? 'Generando…' : 'Solicitar informe'}
            </button>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </div>
        ) : (
          <p className="mt-6 text-text/85">
            Informe generado. Código: <strong>{reportGenerated.reportId}</strong>. Podés verificar su validez en:{' '}
            <a href={`${API_URL.replace(/\/$/, '')}${reportGenerated.verify_url}`} target="_blank" rel="noopener noreferrer" className="text-accent underline hover:no-underline">
              Verificar informe
            </a>.
          </p>
        )}
        <Link
          to="/"
          className="mt-10 inline-block rounded-full bg-accent px-7 py-3.5 font-semibold text-primary transition hover:bg-accent/90"
        >
          Volver al inicio
        </Link>
      </div>
    )
  }

  if (!resumen) {
    const cardBase = 'rounded-2xl border-2 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_8px_24px_rgba(28,43,54,0.08)] cursor-pointer'
    const cardSelected = 'border-accent ring-2 ring-accent/20'
    const cardDefault = 'border-primary/15'

    return (
      <div className="mx-auto max-w-5xl px-4 py-12 md:py-16">
        <h1 className="font-heading text-3xl font-bold text-text md:text-4xl">
          Modalidad de contratación
        </h1>
        <p className="mt-2 text-secondary font-medium">Elegí la forma de trabajo más adecuada para tu caso.</p>
        {caseId && (
          <p className="mt-2 text-text/75">
            Caso <strong>{caseId}</strong>{reportLevel && ` · Informe ${reportLevel}`}
          </p>
        )}

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div
            className={`${cardBase} ${modalidad === 'fijo' ? cardSelected : cardDefault}`}
            onClick={() => handleSeleccionar('fijo')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSeleccionar('fijo')}
          >
            <h3 className="font-heading text-xl font-semibold text-text">{OPCIONES[0].title}</h3>
            <p className="mt-2 text-text/80">{OPCIONES[0].desc}</p>
            <p className="mt-4 text-2xl font-bold text-primary">USD {OPCIONES[0].precio}</p>
            <button type="button" className="mt-4 w-full rounded-full bg-primary/10 py-2.5 font-semibold text-primary transition hover:bg-primary/20">
              Seleccionar honorarios fijos
            </button>
          </div>

          {showMixto && (
            <div
              className={`${cardBase} ${modalidad === 'mixto' ? cardSelected : cardDefault}`}
              onClick={() => handleSeleccionar('mixto')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleSeleccionar('mixto')}
            >
              <h3 className="font-heading text-xl font-semibold text-text">Modelo mixto</h3>
              <p className="mt-2 text-text/80">Anticipo USD {honorarioMixto?.anticipo} + {honorarioMixto?.successFee}% del resultado</p>
              <div className="mt-4 space-y-2">
                <label className={labelClass}>Monto estimado del caso (USD)</label>
                <input
                  type="range"
                  min={5000}
                  max={100000}
                  step={1000}
                  value={montoEstimado}
                  onChange={(e) => setMontoEstimado(Number(e.target.value))}
                  className="w-full accent-accent"
                />
                <p className="text-lg font-semibold text-primary">{montoEstimado.toLocaleString('es-AR')}</p>
                <p className="text-sm text-text/70">Si prospera: honorario estimado USD {Math.round(totalMixto).toLocaleString('es-AR')}</p>
              </div>
              <button type="button" className="mt-4 w-full rounded-full bg-primary/10 py-2.5 font-semibold text-primary transition hover:bg-primary/20">
                Seleccionar modelo mixto
              </button>
            </div>
          )}

          <div
            className={`${cardBase} ${modalidad === 'suscripcion' ? cardSelected : cardDefault}`}
            onClick={() => handleSeleccionar('suscripcion')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSeleccionar('suscripcion')}
          >
            <h3 className="font-heading text-xl font-semibold text-text">{OPCIONES[2].title}</h3>
            <p className="mt-2 text-text/80">{OPCIONES[2].desc}</p>
            <p className="mt-4 text-2xl font-bold text-primary">USD {OPCIONES[2].precioMensual} / mes</p>
            <button type="button" className="mt-4 w-full rounded-full bg-primary/10 py-2.5 font-semibold text-primary transition hover:bg-primary/20">
              Activar plan profesional
            </button>
          </div>
        </div>

        <p className="mt-8 text-sm text-text/70">
          NexoSalud Legal no garantiza resultado judicial. Los honorarios por resultado se aplican exclusivamente en caso de obtención efectiva de beneficio económico.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <button
            type="button"
            disabled={!modalidad}
            onClick={handleContinuarResumen}
            className="rounded-full bg-accent px-7 py-3.5 font-semibold text-primary transition hover:bg-accent/90 disabled:opacity-50"
          >
            Continuar y firmar contrato
          </button>
          <Link
            to="/evaluar/oferta"
            state={{ caseId }}
            className="rounded-full border-2 border-primary/30 px-7 py-3.5 font-semibold text-primary transition hover:border-primary hover:bg-primary/5"
          >
            ← Volver a oferta
          </Link>
        </div>
      </div>
    )
  }

  const op = OPCIONES.find((o) => o.id === modalidad)
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:py-16">
      <h1 className="font-heading text-3xl font-bold text-text md:text-4xl">
        Resumen antes de confirmar
      </h1>
      <div className="mt-8 rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
        <p className="font-medium text-text"><strong>Modalidad:</strong> {op?.title}</p>
        {modalidad === 'fijo' && <p className="mt-2 text-text/85">Monto total: USD {op?.precio}</p>}
        {modalidad === 'mixto' && (
          <div className="mt-2 space-y-1 text-text/85">
            <p>Anticipo: USD {op?.anticipo}</p>
            <p>Success fee: {op?.successFee}%</p>
            <p>Monto estimado caso: USD {montoEstimado.toLocaleString('es-AR')}</p>
            <p>Condición: Sentencia favorable o acuerdo homologado.</p>
          </div>
        )}
        {modalidad === 'suscripcion' && <p className="mt-2 text-text/85">Precio mensual: USD {op?.precioMensual}</p>}
      </div>

      <form onSubmit={handleGuardarContrato} className="mt-10 space-y-6">
        <h2 className="font-heading text-xl font-semibold text-text">Firma y aceptación</h2>
        <div>
          <label className={labelClass}>Nombre y apellido</label>
          <input
            type="text"
            value={firma.nombre}
            onChange={(e) => setFirma((f) => ({ ...f, nombre: e.target.value }))}
            className={inputClass}
            required
          />
        </div>
        <div>
          <label className={labelClass}>DNI</label>
          <input
            type="text"
            inputMode="numeric"
            value={firma.dni}
            onChange={(e) => setFirma((f) => ({ ...f, dni: e.target.value.replace(/\D/g, '').slice(0, 8) }))}
            className={inputClass}
            required
          />
        </div>
        <label className="flex cursor-pointer gap-3">
          <input
            type="checkbox"
            checked={firma.acepta}
            onChange={(e) => setFirma((f) => ({ ...f, acepta: e.target.checked }))}
            className="mt-1 h-5 w-5 accent-accent"
            required
          />
          <span className="text-text/85">
            Acepto las condiciones de la modalidad elegida y declaro que la información es veraz. Fecha: {new Date().toLocaleString('es-AR')}
          </span>
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-accent px-7 py-3.5 font-semibold text-primary transition hover:bg-accent/90 disabled:opacity-70"
        >
          {loading ? 'Guardando...' : 'Confirmar contrato'}
        </button>
      </form>
    </div>
  )
}
