const MODULOS = [
  { name: 'Amparos de salud', desc: 'Cobertura de tratamientos, medicación y prestaciones denegadas o demoradas.' },
  { name: 'Mala praxis médica', desc: 'Evaluación de evento médico adverso y daño evitable.' },
  { name: 'Prestaciones y reintegros', desc: 'Reclamos por gastos de salud ya abonados y cobertura.' },
  { name: 'Adultos mayores y capacidad restringida', desc: 'Protección y representación en situaciones de vulnerabilidad.' },
  { name: 'Salud mental e internaciones involuntarias', desc: 'Marco normativo y garantías en tratamientos e internación.' },
  { name: 'Segunda opinión médico-legal', desc: 'Análisis técnico para respaldar decisiones clínicas o legales.' },
  { name: 'Bioética y ensayos clínicos', desc: 'Consentimiento informado, protocolos y conflictos éticos en investigación.' },
]

export default function LandingModulos() {
  return (
    <section id="modulos" className="scroll-mt-20 bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h2 className="font-heading text-3xl font-bold text-text md:text-4xl">
          Módulos especializados
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-text/80">
          Cada caso va al circuito que le corresponde — no a una bolsa genérica.
        </p>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MODULOS.map((m) => (
            <div
              key={m.name}
              className="rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(28,43,54,0.08)]"
            >
              <h3 className="font-heading text-lg font-semibold text-text">
                {m.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text/80">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
