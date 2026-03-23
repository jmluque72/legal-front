const CAMBIOS = [
  { antes: 'Improvisación', despues: 'Previsibilidad' },
  { antes: 'Paciente desprotegido', despues: 'Mejor protección del paciente' },
  { antes: 'Baja calidad jurídica', despues: 'Decisiones más fundamentadas' },
  { antes: 'Trazabilidad nula', despues: 'Registro auditable completo' },
  { antes: 'Ética ignorada', despues: 'Bioética integrada desde el inicio' },
]

export default function LandingQueCambia() {
  return (
    <section id="que-cambia" className="scroll-mt-20 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h2 className="font-heading text-3xl font-bold text-text md:text-4xl">
          ¿Qué cambia con NexoSalud Legal?
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-text/80">
          De la incertidumbre al criterio. De lo disperso a lo trazable.
        </p>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CAMBIOS.map((c, i) => (
            <div
              key={i}
              className="rounded-2xl bg-surface p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(28,43,54,0.08)]"
            >
              <p className="text-text/70 line-through">{c.antes}</p>
              <p className="mt-2 text-lg font-semibold text-secondary">→ {c.despues}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
