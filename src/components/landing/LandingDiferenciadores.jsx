const CAIS_ITEMS = [
  'Riesgo de vida',
  'Daño irreversible posible',
  'Impacto colectivo',
  'Conflictos éticos complejos',
]

const BIOETICA_ITEMS = [
  'Decisiones médicas críticas',
  'Consentimientos informados complejos',
  'Ensayos clínicos',
  'Personas en situación de vulnerabilidad',
]

export default function LandingDiferenciadores() {
  return (
    <section id="diferenciadores" className="scroll-mt-20 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h2 className="font-heading text-3xl font-bold text-text md:text-4xl">
          Diferenciadores clave
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-text/80">
          Lo que hace que cada caso se trate con el nivel de rigor que corresponde.
        </p>
        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-surface p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(28,43,54,0.08)]">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-primary px-3 py-1 text-sm font-bold text-white">CAIS</span>
              <span className="font-heading text-lg font-semibold text-text">Casos de Alto Impacto Sanitario</span>
            </div>
            <ul className="mt-4 space-y-2">
              {CAIS_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-2 text-text/85">
                  <span className="text-accent">▶</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-text/75">
              Activa automáticamente un nivel superior de análisis y control.
            </p>
          </div>
          <div className="rounded-2xl bg-surface p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(28,43,54,0.08)]">
            <h3 className="font-heading text-lg font-semibold text-text">
              Bioética integrada
            </h3>
            <p className="mt-2 text-text/80">
              Desde el inicio del caso — no al final.
            </p>
            <ul className="mt-4 space-y-2">
              {BIOETICA_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-2 text-text/85">
                  <span className="text-accent">▶</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-text/75">
              La bioética no aparece al final: forma parte del análisis del caso.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
