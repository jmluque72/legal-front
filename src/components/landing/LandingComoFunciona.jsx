const steps = [
  {
    num: '1',
    title: 'Evaluación inicial',
    description: 'Analizamos viabilidad legal, urgencia sanitaria y la vía más adecuada. Evitamos litigios innecesarios y aceleramos los urgentes.',
  },
  {
    num: '2',
    title: 'Derivación al módulo',
    description: 'Cada caso va al circuito que le corresponde, no a una bolsa genérica. Módulos especializados según el tipo de situación.',
  },
  {
    num: '3',
    title: 'Acompañamiento',
    description: 'Ordenamos documentación, definimos estrategia, controlamos plazos y supervisamos el cumplimiento efectivo.',
  },
  {
    num: '4',
    title: 'Cierre trazable',
    description: 'Todo queda registrado, medido y auditable. Nada librado al azar.',
  },
]

export default function LandingComoFunciona() {
  return (
    <section id="como-funciona" className="scroll-mt-20 bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h2 className="font-heading text-3xl font-bold text-text md:text-4xl">
          Cómo funciona
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-text/80">
          Cuatro pasos para que tu caso tenga orden, criterio y trazabilidad.
        </p>
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="group rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(28,43,54,0.1)]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary transition group-hover:bg-primary group-hover:text-white">
                {step.num}
              </div>
              <h3 className="mt-6 font-heading text-xl font-semibold text-text">
                {step.title}
              </h3>
              <p className="mt-3 leading-relaxed text-text/80">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
