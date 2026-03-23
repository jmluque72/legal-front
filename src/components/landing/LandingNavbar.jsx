import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-primary'}`}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <Link
          to="/"
          className={`font-heading text-xl font-bold md:text-2xl ${scrolled ? 'text-text' : 'text-white'}`}
          onClick={closeMenu}
        >
          NexoSalud Legal
        </Link>
        <button
          type="button"
          className={`flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg md:hidden ${scrolled ? 'text-text' : 'text-white'}`}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className={`block h-0.5 w-5 bg-current transition-all ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-5 bg-current transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-5 bg-current transition-all ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#problema" className={`text-sm font-medium transition hover:opacity-90 ${scrolled ? 'text-text hover:text-primary' : 'text-white/90 hover:text-white'}`}>El problema</a>
          <a href="#que-es" className={`text-sm font-medium transition hover:opacity-90 ${scrolled ? 'text-text hover:text-primary' : 'text-white/90 hover:text-white'}`}>Qué es</a>
          <a href="#como-funciona" className={`text-sm font-medium transition hover:opacity-90 ${scrolled ? 'text-text hover:text-primary' : 'text-white/90 hover:text-white'}`}>Cómo funciona</a>
          <a href="#servicios" className={`text-sm font-medium transition hover:opacity-90 ${scrolled ? 'text-text hover:text-primary' : 'text-white/90 hover:text-white'}`}>Servicios</a>
          <a href="#a-quien" className={`text-sm font-medium transition hover:opacity-90 ${scrolled ? 'text-text hover:text-primary' : 'text-white/90 hover:text-white'}`}>A quién</a>
          <a href="#confianza" className={`text-sm font-medium transition hover:opacity-90 ${scrolled ? 'text-text hover:text-primary' : 'text-white/90 hover:text-white'}`}>Confianza</a>
          <a href="#contacto" className={`text-sm font-medium transition hover:opacity-90 ${scrolled ? 'text-text hover:text-primary' : 'text-white/90 hover:text-white'}`}>Contacto</a>
          <Link to="/evaluar" className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-accent/90">
            Evaluar mi caso
          </Link>
        </nav>
      </div>
      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity md:hidden ${menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        aria-hidden={!menuOpen}
        onClick={closeMenu}
      />
      <div
        className={`fixed right-0 top-0 z-50 h-full w-[85vw] max-w-sm bg-primary p-6 pt-20 shadow-xl transition-transform duration-300 md:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <nav className="flex flex-col gap-5">
          <a href="#problema" className="text-lg font-medium text-white" onClick={closeMenu}>El problema</a>
          <a href="#que-es" className="text-lg font-medium text-white" onClick={closeMenu}>Qué es</a>
          <a href="#como-funciona" className="text-lg font-medium text-white" onClick={closeMenu}>Cómo funciona</a>
          <a href="#servicios" className="text-lg font-medium text-white" onClick={closeMenu}>Servicios</a>
          <a href="#a-quien" className="text-lg font-medium text-white" onClick={closeMenu}>A quién</a>
          <a href="#confianza" className="text-lg font-medium text-white" onClick={closeMenu}>Confianza</a>
          <a href="#contacto" className="text-lg font-medium text-white" onClick={closeMenu}>Contacto</a>
          <Link to="/evaluar" className="mt-4 rounded-full bg-accent px-5 py-3 text-center font-semibold text-primary" onClick={closeMenu}>
            Evaluar mi caso
          </Link>
        </nav>
      </div>
    </div>
  )
}
