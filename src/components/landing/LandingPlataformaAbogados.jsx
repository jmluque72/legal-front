const PLATAFORMA = [
  'Evalúa el caso',
  'Lo ordena y estructura',
  'Aporta información estratégica',
  'Genera dossier jurisprudencial',
]

const DOSSIER = [
  'Casos similares y misma jurisdicción',
  'Extractos relevantes',
  'Argumentos reutilizables',
]

export default function LandingPlataformaAbogados() {
  return (
    <section id="plataforma-abogados" className="scroll-mt-20 bg-surface py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <h2 className="font-heading text-3xl font-bold text-text md:text-4xl">
          Plataforma + Abogados: la combinación correcta
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-text/80">
          Los abogados son protagonistas, no reemplazados.
        </p>
        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <h3 className="font-heading text-xl font-semibold text-text">
              La plataforma
            </h3>
            <ul className="mt-4 space-y-3">
              {PLATAFORMA.map((item) => (
                <li key={item} className="flex items-center gap-3 text-text/85">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent font-semibold">✔</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-xl bg-primary/5 p-4 text-sm text-text/85">
              NexoSalud Legal no litiga, no firma demandas ni se presenta en tribunales.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <h3 className="font-heading text-xl font-semibold text-text">
              Dossier jurisprudencial
            </h3>
            <p className="mt-2 text-text/80">
              Para cada caso admitido:
            </p>
            <ul className="mt-4 space-y-2">
              {DOSSIER.map((item) => (
                <li key={item} className="flex items-center gap-2 text-text/85">
                  <span className="text-accent">▶</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 font-medium text-text">
              Resultado: mejor calidad del escrito, menos tiempos y menos riesgos.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
