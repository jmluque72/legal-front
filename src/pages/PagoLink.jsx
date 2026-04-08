import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import LandingNavbar from '../components/landing/LandingNavbar'
import Footer from '../components/Footer'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export default function PagoLink() {
  const { token } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [payment, setPayment] = useState(null)

  useEffect(() => {
    if (!token) return
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API_URL}/payments/${encodeURIComponent(token)}`)
        const json = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError(json.error || `Error ${res.status}`)
          setPayment(null)
          return
        }
        setPayment(json)
      } catch (err) {
        setError(err.message || 'Error de conexión')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [token])

  const isPaid = payment?.status === 'approved'
  const canPay = !!payment?.initPoint && payment?.status === 'pending'

  return (
    <>
      <LandingNavbar />
      <main className="bg-surface py-16 md:py-20">
        <div className="mx-auto max-w-2xl px-4 md:px-8">
          <div className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] md:p-8">
            {loading ? (
              <p className="text-center text-text/70">Cargando pago…</p>
            ) : error ? (
              <>
                <h1 className="font-heading text-2xl font-bold text-text">No se pudo cargar el pago</h1>
                <p className="mt-3 text-text/80">{error}</p>
              </>
            ) : (
              <>
                <h1 className="font-heading text-2xl font-bold text-text md:text-3xl">Pago de servicios</h1>
                <p className="mt-3 text-text/80">
                  Concepto: <strong>{payment?.concepto ?? '—'}</strong>
                </p>
                <p className="mt-1 text-text/80">
                  Monto: <strong>{payment?.currency} {typeof payment?.monto === 'number' ? payment.monto.toLocaleString('es-AR') : '—'}</strong>
                </p>
                <p className="mt-1 text-text/70">
                  Caso: <strong>{payment?.caseId ?? '—'}</strong>
                </p>
                <p className="mt-4 text-text/80">
                  Estado actual: <strong>{payment?.status ?? '—'}</strong>
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  {canPay && (
                    <a
                      href={payment.initPoint}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-accent px-7 py-3.5 font-semibold text-primary transition hover:bg-accent/90"
                    >
                      Ir a pagar
                    </a>
                  )}
                  {isPaid && (
                    <Link
                      to="/pago/exitoso"
                      className="rounded-full bg-accent px-7 py-3.5 font-semibold text-primary transition hover:bg-accent/90"
                    >
                      Ver confirmación
                    </Link>
                  )}
                  {!canPay && !isPaid && (
                    <Link
                      to="/pago/pendiente"
                      className="rounded-full border-2 border-primary/30 px-7 py-3.5 font-semibold text-primary transition hover:border-primary hover:bg-primary/5"
                    >
                      Ver estado del pago
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

