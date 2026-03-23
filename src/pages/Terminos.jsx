import { Link } from 'react-router-dom'
import LandingNavbar from '../components/landing/LandingNavbar'
import Footer from '../components/Footer'

export default function Terminos() {
  return (
    <>
      <LandingNavbar />
      <main className="min-h-screen bg-surface py-16">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <Link to="/" className="text-sm font-medium text-primary hover:underline">
            ← Volver al inicio
          </Link>
          <h1 className="font-heading mt-6 text-3xl font-bold text-text md:text-4xl">
            Términos y condiciones
          </h1>
          <p className="mt-2 text-text/70">
            Última actualización: {new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="prose prose-lg mt-10 max-w-none text-text/85">
            <p>
              Al utilizar los servicios de NexoSalud Legal («la plataforma», «nosotros»), usted acepta los presentes términos y condiciones. Le recomendamos leerlos con atención.
            </p>
            <h2 className="font-heading mt-8 text-xl font-semibold text-text">
              1. Objeto y alcance
            </h2>
            <p>
              NexoSalud Legal es una infraestructura legal especializada en derecho de la salud. Los servicios ofrecidos a través del sitio web y de la plataforma se rigen por estos términos, así como por la legislación aplicable en la República Argentina.
            </p>
            <h2 className="font-heading mt-8 text-xl font-semibold text-text">
              2. Uso del servicio
            </h2>
            <p>
              El usuario se compromete a utilizar la plataforma de forma lícita y a proporcionar información veraz. La plataforma no constituye asesoramiento médico ni reemplaza la relación con un profesional de la salud o un abogado.
            </p>
            <h2 className="font-heading mt-8 text-xl font-semibold text-text">
              3. Propiedad intelectual
            </h2>
            <p>
              Todo el contenido del sitio (textos, diseños, logotipos, software) es propiedad de NexoSalud Legal o de sus licenciantes y está protegido por las leyes de propiedad intelectual.
            </p>
            <h2 className="font-heading mt-8 text-xl font-semibold text-text">
              4. Limitación de responsabilidad
            </h2>
            <p>
              NexoSalud Legal no garantiza resultados específicos en ningún caso. La información proporcionada tiene carácter orientativo y no constituye asesoramiento legal vinculante. Para decisiones concretas, consulte con un profesional.
            </p>
            <h2 className="font-heading mt-8 text-xl font-semibold text-text">
              5. Modificaciones
            </h2>
            <p>
              Nos reservamos el derecho de modificar estos términos. Los cambios serán publicados en esta página con indicación de la fecha de actualización. El uso continuado del servicio implica la aceptación de los términos vigentes.
            </p>
            <h2 className="font-heading mt-8 text-xl font-semibold text-text">
              6. Contacto
            </h2>
            <p>
              Para consultas sobre estos términos: contacto@nexosaludlegal.com.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
