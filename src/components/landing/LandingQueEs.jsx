const PUNTOS = [
  {
    no: 'No es un estudio jurídico tradicional',
    si: 'Es una plataforma de gestión de casos',
  },
  {
    no: 'No reemplaza a los abogados',
    si: 'Hace su trabajo más sólido y seguro',
  },
  {
    no: 'No da asesoramiento médico',
    si: 'Integra criterio médico y bioético',
  },
]

export default function LandingQueEs() {
  return (
    <section id="que-es" className="scroll-mt-20 bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h2 className="font-heading text-3xl font-bold text-text md:text-4xl">
          ¿Qué es NexoSalud Legal?
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-text/80">
          Una infraestructura legal especializada, diseñada para que los casos de salud se analicen y gestionen con rigor, rapidez y humanidad.
        </p>
        <div className="mt-14 space-y-6">
          {PUNTOS.map((p, i) => (
            <div
              key={i}
              className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(28,43,54,0.08)] sm:flex-row sm:items-center sm:gap-8"
            >
              <div className="flex items-center gap-3 text-red-600/90">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-lg font-bold">✕</span>
                <span className="text-text/80 line-through">{p.no}</span>
              </div>
              <span className="hidden text-text/40 sm:block">→</span>
              <div className="flex items-center gap-3 text-secondary">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20 text-lg font-bold text-accent">✔</span>
                <span className="font-medium text-text">{p.si}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
