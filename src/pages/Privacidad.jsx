import { Link } from 'react-router-dom'
import LandingNavbar from '../components/landing/LandingNavbar'
import Footer from '../components/Footer'

export default function Privacidad() {
  return (
    <>
      <LandingNavbar />
      <main className="min-h-screen bg-surface py-16">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <Link to="/" className="text-sm font-medium text-primary hover:underline">
            ← Volver al inicio
          </Link>
          <h1 className="font-heading mt-6 text-3xl font-bold text-text md:text-4xl">
            Política de privacidad
          </h1>
          <p className="mt-2 text-text/70">
            Última actualización: {new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="prose prose-lg mt-10 max-w-none text-text/85">
            <p>
              NexoSalud Legal («nosotros», «la plataforma») se compromete a proteger la privacidad de los usuarios. Esta política describe qué datos recabamos, cómo los usamos y qué derechos tiene usted.
            </p>
            <h2 className="font-heading mt-8 text-xl font-semibold text-text">
              1. Datos que recabamos
            </h2>
            <p>
              Podemos recoger: nombre, documento, correo electrónico, teléfono, jurisdicción y la información que usted voluntariamente proporcione al describir su caso o al completar formularios en la plataforma. Los datos de salud o legales que comparta se tratan con la máxima confidencialidad.
            </p>
            <h2 className="font-heading mt-8 text-xl font-semibold text-text">
              2. Finalidad del tratamiento
            </h2>
            <p>
              Utilizamos sus datos para: gestionar su consulta o caso, derivarlo al módulo correspondiente, contactarlo en relación con los servicios solicitados, cumplir obligaciones legales y mejorar nuestros procesos, siempre dentro del marco de la ley.
            </p>
            <h2 className="font-heading mt-8 text-xl font-semibold text-text">
              3. Base legal y conservación
            </h2>
            <p>
              El tratamiento se basa en su consentimiento, en la ejecución del servicio solicitado o en obligaciones legales. Conservamos los datos durante el tiempo necesario para la finalidad indicada y según lo exija la normativa aplicable (incluidas normas profesionales y fiscales).
            </p>
            <h2 className="font-heading mt-8 text-xl font-semibold text-text">
              4. Derechos
            </h2>
            <p>
              Usted puede acceder, rectificar, suprimir o limitar el tratamiento de sus datos, así como oponerse o solicitar la portabilidad, cuando corresponda según la ley. Para ejercer estos derechos o formular consultas: contacto@nexosaludlegal.com.
            </p>
            <h2 className="font-heading mt-8 text-xl font-semibold text-text">
              5. Seguridad y terceros
            </h2>
            <p>
              Aplicamos medidas técnicas y organizativas para proteger sus datos. No vendemos su información personal. Solo compartimos datos con terceros cuando sea necesario para el servicio (por ejemplo, profesionales involucrados en su caso) o por obligación legal.
            </p>
            <h2 className="font-heading mt-8 text-xl font-semibold text-text">
              6. Cambios
            </h2>
            <p>
              Cualquier cambio en esta política se publicará en esta página con la nueva fecha de actualización. Le recomendamos revisarla periódicamente.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
