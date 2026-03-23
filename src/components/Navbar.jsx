import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className={`landing-navbar-wrapper ${scrolled ? 'landing-navbar--scrolled' : ''}`}>
      <nav className={`landing-navbar ${menuOpen ? 'landing-navbar--open' : ''}`}>
        <Link to="/" className="logo" onClick={closeMenu}>NexoSalud Legal</Link>
        <button
          type="button"
          className="landing-navbar-toggle"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>
      <div
        className={`landing-navbar-backdrop ${menuOpen ? 'landing-navbar-backdrop--open' : ''}`}
        aria-hidden={!menuOpen}
        onClick={closeMenu}
      />
      <div className={`landing-navbar-drawer ${menuOpen ? 'landing-navbar-drawer--open' : ''}`}>
        <ul className="landing-navbar-menu">
          <li><a href="#como-funciona" onClick={closeMenu}>Cómo funciona</a></li>
          <li><a href="#servicios" onClick={closeMenu}>Servicios</a></li>
          <li><a href="#que-es" onClick={closeMenu}>Institucional</a></li>
          <li><a href="#contacto" onClick={closeMenu}>Contacto</a></li>
          <li>
            <Link to="/evaluar" className="navbar-cta" onClick={closeMenu}>Evaluar mi caso</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
