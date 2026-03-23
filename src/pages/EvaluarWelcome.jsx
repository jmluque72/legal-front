import { Link } from 'react-router-dom'

export default function EvaluarWelcome() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:py-24">
      <h1 className="font-heading text-3xl font-bold text-text md:text-4xl">
        Vamos a evaluar tu situación sanitaria y legal
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-text/85">
        Utilizamos un sistema técnico especializado para analizar tu caso y darte claridad sobre viabilidad, urgencia y próximos pasos recomendados.
      </p>
      <p className="mt-4 text-text/75">
        No es un trámite de demanda ni litigio. Es una evaluación estructurada para que tomes la mejor decisión.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          to="/evaluar/inicio"
          className="rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-primary transition hover:bg-accent/90"
        >
          Iniciar evaluación del caso
        </Link>
        <Link
          to="/"
          className="rounded-full border-2 border-primary/30 px-7 py-3.5 text-base font-semibold text-primary transition hover:border-primary hover:bg-primary/5"
        >
          ← Volver al inicio
        </Link>
      </div>
    </div>
  )
}
