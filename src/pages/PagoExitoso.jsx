import { Link } from 'react-router-dom'
import LandingNavbar from '../components/landing/LandingNavbar'
import Footer from '../components/Footer'

export default function PagoExitoso() {
  return (
    <>
      <LandingNavbar />
      <main className="bg-surface py-20">
        <div className="mx-auto max-w-xl px-4 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-heading mt-6 text-3xl font-bold text-text">Pago recibido</h1>
          <p className="mt-4 text-text/80">
            Tu pago fue acreditado correctamente. Nuestro equipo fue notificado y se pondrá en contacto a la brevedad.
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
