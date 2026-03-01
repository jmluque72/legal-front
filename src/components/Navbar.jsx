import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`landing-navbar ${scrolled ? 'landing-navbar--scrolled' : ''}`}>
      <Link to="/" className="logo">NexoSalud Legal</Link>
      <ul>
        <li><a href="#como-funciona">Cómo funciona</a></li>
        <li><a href="#servicios">Servicios</a></li>
        <li><a href="#que-es">Institucional</a></li>
        <li><a href="#contacto">Contacto</a></li>
        <li>
          <Link to="/evaluar" className="navbar-cta">Evaluar mi caso</Link>
        </li>
      </ul>
    </nav>
  )
}
