import { Link } from 'react-router-dom'
import LandingNavbar from '../components/landing/LandingNavbar'
import Footer from '../components/Footer'

export default function PagoPendiente() {
  return (
    <>
      <LandingNavbar />
      <main className="bg-surface py-20">
        <div className="mx-auto max-w-xl px-4 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
            <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-heading mt-6 text-3xl font-bold text-text">Pago en proceso</h1>
          <p className="mt-4 text-text/80">
            Tu pago está siendo procesado. En cuanto se confirme, nuestro equipo recibirá la notificación automáticamente.
            Podés revisar el estado del pago en tu cuenta de Mercado Pago.
          </p>
          <Link
            to="/"
            className="mt-8 inline-block rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-primary shadow-lg transition hover:bg-accent/90"
          >
            Volver al inicio
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
