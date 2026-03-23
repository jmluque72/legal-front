const SITUACIONES = [
  { text: 'Una obra social niega un tratamiento urgente', icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z' },
  { text: 'Un medicamento crítico no llega a tiempo', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z' },
  { text: 'Un adulto mayor queda desprotegido', icon: 'M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z' },
  { text: 'Una familia no sabe si iniciar una acción judicial', icon: 'M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0112 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z' },
  { text: 'Un caso llega tarde, mal documentado y en estado crítico', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
]

export default function LandingProblema() {
  return (
    <section id="problema" className="scroll-mt-20 bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h2 className="font-heading text-3xl font-bold text-text md:text-4xl">
          El problema
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-text/80">
          Todos los días, personas enfrentan situaciones como estas:
        </p>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SITUACIONES.slice(0, 3).map((s) => (
            <div
              key={s.text}
              className="flex gap-4 rounded-2xl bg-surface p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(28,43,54,0.08)]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
              </div>
              <p className="font-medium text-text">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {SITUACIONES.slice(3).map((s) => (
            <div
              key={s.text}
              className="flex gap-4 rounded-2xl bg-surface p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(28,43,54,0.08)]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                </svg>
              </div>
              <p className="font-medium text-text">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 rounded-2xl bg-primary p-8 text-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] md:p-10">
          <p className="font-heading text-xl font-semibold md:text-2xl">
            El problema no es solo legal. Es médico, ético, humano y estructural.
          </p>
          <p className="mt-4 text-lg text-white/90">
            NexoSalud Legal nace para ordenar ese caos.
          </p>
        </div>
      </div>
    </section>
  )
}
