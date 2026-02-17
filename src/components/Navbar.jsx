import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="landing-navbar">
      <Link to="/" className="logo">NexoSalud Legal</Link>
      <ul>
        <li><a href="#problema">El problema</a></li>
        <li><a href="#que-es">Qué es</a></li>
        <li><a href="#plataforma-abogados">Plataforma + Abogados</a></li>
        <li><a href="#como-funciona">Cómo funciona</a></li>
        <li><a href="#modulos">Módulos</a></li>
        <li><a href="#diferenciadores">Diferenciadores</a></li>
        <li><a href="#estado-proyecto">Estado & Modelo</a></li>
        <li><Link to="/mala-praxis">Mala praxis</Link></li>
        <li><a href="#contacto">Contacto</a></li>
      </ul>
    </nav>
  )
}
