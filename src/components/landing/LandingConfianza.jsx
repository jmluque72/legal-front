const metrics = [
  { value: '+500', label: 'casos analizados' },
  { value: '95%', label: 'satisfacción' },
  { value: 'Equipo', label: 'médico y legal especializado' },
]

export default function LandingConfianza() {
  return (
    <section id="confianza" className="scroll-mt-20 bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h2 className="font-heading text-3xl font-bold text-text md:text-4xl">
          Confianza
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-text/80">
          Resultados y experiencia que nos avalan.
        </p>
        <div className="mt-14 flex flex-wrap justify-center gap-12 md:gap-20">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <p className="font-heading text-4xl font-bold text-primary md:text-5xl">
                {m.value}
              </p>
              <p className="mt-1 text-text/80">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
