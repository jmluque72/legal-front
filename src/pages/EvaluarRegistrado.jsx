import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function EvaluarRegistrado() {
  const location = useLocation()
  const navigate = useNavigate()
  const { caseId, recommended_module, anexo, tipologia, formularioCompleto } = location.state ?? {}

  const continuarFlujo = () => {
    navigate('/evaluar/caso', {
      state: {
        caseId,
        anexo: anexo ?? null,
        tipologia: tipologia ?? 'otro',
        tipoCasoLabel: recommended_module ?? 'A clasificar',
        desdeRegistrado: true,
      },
    })
  }

  if (formularioCompleto) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 md:py-24">
        <h1 className="font-heading text-3xl font-bold text-text md:text-4xl">
          Formulario del anexo completado
        </h1>
        <p className="mt-6 text-lg text-text/85">
          Recibimos las respuestas del cuestionario. Tu caso queda completo y derivado al área correspondiente.
        </p>
        {caseId && (
          <p className="mt-4 font-medium text-primary">
            Nº de caso: <strong>{caseId}</strong>
          </p>
        )}
        <p className="mt-4 text-text/75">
          En breve nos pondremos en contacto.
        </p>
        <Link
          to="/"
          className="mt-10 inline-block rounded-full bg-accent px-7 py-3.5 font-semibold text-primary transition hover:bg-accent/90"
        >
          Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:py-24">
      <h1 className="font-heading text-3xl font-bold text-text md:text-4xl">
        Consulta registrada
      </h1>
      <p className="mt-6 text-lg text-text/85">
        Clasificamos tu caso según tu relato. Con esa calificación quedó registrado y derivado al área correspondiente.
      </p>
      {recommended_module && (
        <p className="mt-4 text-text/85">
          Tu caso califica para: <strong className="text-primary">{recommended_module}</strong>
        </p>
      )}
      {caseId && (
        <p className="mt-2 font-medium text-primary">
          Nº de caso: <strong>{caseId}</strong>
        </p>
      )}
      <p className="mt-4 text-text/75">
        Continuá con las preguntas del anexo para completar la evaluación.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={continuarFlujo}
          className="rounded-full bg-accent px-7 py-3.5 font-semibold text-primary transition hover:bg-accent/90"
        >
          Continuar con las preguntas del anexo
        </button>
        <Link
          to="/"
          className="rounded-full border-2 border-primary/30 px-7 py-3.5 font-semibold text-primary transition hover:border-primary hover:bg-primary/5"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
