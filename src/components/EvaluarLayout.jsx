import { Outlet, useLocation, Link } from 'react-router-dom'
import LandingNavbar from './landing/LandingNavbar'

const STEP_LABELS = {
  '/evaluar': 'Inicio',
  '/evaluar/inicio': 'Datos y caso',
  '/evaluar/tipo-caso': 'Tipo de caso',
  '/evaluar/caso': 'Cuestionario',
  '/evaluar/registrado': 'Registro',
  '/evaluar/oferta': 'Oferta',
  '/evaluar/modalidad': 'Modalidad',
}

function getStepLabel(pathname) {
  if (STEP_LABELS[pathname]) return STEP_LABELS[pathname]
  if (pathname.startsWith('/evaluar/caso')) return 'Cuestionario'
  return 'Evaluar mi caso'
}

export default function EvaluarLayout() {
  const location = useLocation()
  const pathname = location.pathname
  const stepLabel = getStepLabel(pathname)

  return (
    <div className="min-h-screen bg-surface">
      <LandingNavbar />
      <div className="border-b border-primary/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 md:px-8">
          <Link to="/evaluar" className="text-sm font-medium text-text/70 hover:text-primary">
            Evaluar mi caso
          </Link>
          <span className="text-text/40">/</span>
          <span className="text-sm font-semibold text-primary">{stepLabel}</span>
        </div>
      </div>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
