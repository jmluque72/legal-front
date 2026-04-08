import { Link } from 'react-router-dom'
import LandingNavbar from '../components/landing/LandingNavbar'
import Footer from '../components/Footer'

export default function PagoFallido() {
  return (
    <>
      <LandingNavbar />
      <main className="bg-surface py-20">
        <div className="mx-auto max-w-xl px-4 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="font-heading mt-6 text-3xl font-bold text-text">Pago no procesado</h1>
          <p className="mt-4 text-text/80">
            Hubo un problema al procesar tu pago. Por favor intentá nuevamente o contactate con nosotros
            para que te enviemos un nuevo link de pago.
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
