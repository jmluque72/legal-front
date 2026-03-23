import { Link } from 'react-router-dom'

// Actualizar las URLs cuando tengan perfil
const REDES = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/nexosalud-legal', // reemplazar por la URL real
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  // Agregar más redes cuando tengan URL (Twitter/X, Instagram, etc.)
]

const ENLACES_RAPIDOS = [
  { label: 'Inicio', href: '/', isHash: false },
  { label: 'Evaluar mi caso', href: '/evaluar', isHash: false },
  { label: 'Cómo funciona', href: '/#como-funciona', isHash: true },
  { label: 'Servicios', href: '/#servicios', isHash: true },
  { label: 'Contacto', href: '/#contacto', isHash: true },
]

const ENLACES_LEGALES = [
  { label: 'Términos y condiciones', href: '/terminos' },
  { label: 'Política de privacidad', href: '/privacidad' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div className="lg:col-span-1">
            <Link to="/" className="font-heading text-xl font-bold text-white md:text-2xl">
              NexoSalud Legal
            </Link>
            <p className="mt-3 text-sm text-white/80">
              Infraestructura legal especializada en derecho de la salud.
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Contacto
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/85">
              <li>
                <a href="mailto:contacto@nexosaludlegal.com" className="hover:text-accent transition">
                  contacto@nexosaludlegal.com
                </a>
              </li>
              <li>
                <a href="tel:+5491112345678" className="hover:text-accent transition">
                  +54 9 11 1234-5678
                </a>
              </li>
              <li className="text-white/70">
                Argentina
              </li>
            </ul>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Enlaces
            </h3>
            <ul className="mt-4 space-y-2">
              {ENLACES_RAPIDOS.map(({ label, href, isHash }) => (
                <li key={label}>
                  {isHash ? (
                    <a href={href} className="text-sm text-white/85 hover:text-accent transition">
                      {label}
                    </a>
                  ) : (
                    <Link to={href} className="text-sm text-white/85 hover:text-accent transition">
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + Redes */}
          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-white">
              Legal
            </h3>
            <ul className="mt-4 space-y-2">
              {ENLACES_LEGALES.map(({ label, href }) => (
                <li key={label}>
                  <Link to={href} className="text-sm text-white/85 hover:text-accent transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            {REDES.length > 0 && (
              <>
                <h3 className="font-heading mt-8 text-sm font-semibold uppercase tracking-wider text-white">
                  Redes
                </h3>
                <ul className="mt-4 flex gap-4">
                  {REDES.map((r) => (
                    <li key={r.name}>
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/75 hover:text-accent transition"
                        aria-label={r.name}
                      >
                        {r.icon}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Línea y copyright */}
        <div className="mt-12 border-t border-white/20 pt-8">
          <p className="text-center text-sm text-white/70">
            © {year} NexoSalud Legal. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
