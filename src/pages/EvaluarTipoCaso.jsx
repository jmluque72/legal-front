import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const TIPOS_CASO = [
  {
    id: 'prestacion_medica',
    label: 'Prestación médica / medicación / tratamiento no cubierto',
    anexo: 'IV',
    anexoLabel: 'Amparos de salud',
    desc: 'Me niegan o demoran una prestación, medicación o tratamiento.',
  },
  {
    id: 'reintegro',
    label: 'Reintegro',
    anexo: 'VIII',
    anexoLabel: 'Reintegros',
    desc: 'Necesito que me reintegren gastos de salud ya abonados.',
  },
  {
    id: 'urgencia_vital',
    label: 'Urgencia vital',
    anexo: 'IV',
    anexoLabel: 'Amparos de salud',
    desc: 'Situación de riesgo vital que requiere cobertura urgente.',
  },
  {
    id: 'biometria',
    label: 'Datos biométricos / afiliación',
    anexo: 'IV',
    anexoLabel: 'Datos biométricos y afiliación',
    desc: 'Registro de huella u otros datos biométricos, fallas de afiliación o cobertura vinculadas a esos datos.',
  },
  {
    id: 'evento_medico_adverso',
    label: 'Evento médico adverso',
    anexo: 'V',
    anexoLabel: 'Evaluación de evento médico adverso',
    desc: 'Quiero evaluar si hubo un error médico o resultado evitable (daño ya ocurrido).',
  },
  {
    id: 'adultos_mayores',
    label: 'Adulto mayor / persona en situación de vulnerabilidad',
    anexo: 'VI',
    anexoLabel: 'Adultos Mayores y Vulnerabilidad',
    desc: 'Conflicto que involucra a una persona mayor de 65 años o en situación de dependencia, institucionalización o riesgo.',
  },
  {
    id: 'segunda_opinion',
    label: 'Segunda opinión médico-legal',
    anexo: 'VII',
    anexoLabel: 'Segunda opinión médico-legal',
    desc: 'Quiero saber si hubo un error, revisar un diagnóstico o evaluar si tengo caso legal, sin que haya una negativa de cobertura de por medio.',
  },
  {
    id: 'salud_mental',
    label: 'Salud mental',
    anexo: null,
    anexoLabel: 'Salud mental y capacidad',
    desc: 'Internación involuntaria, derechos del paciente psiquiátrico, capacidad restringida, curatela por salud mental.',
  },
  {
    id: 'cais',
    label: 'Caso de alto impacto sanitario (CAIS)',
    anexo: 'III',
    anexoLabel: 'Alto impacto — Módulo M7',
    desc: 'Situación grave con múltiples afectados, falla institucional sistémica, daño colectivo o riesgo vital inmediato. Requiere intervención urgente y asignación a abogado experto.',
  },
  {
    id: 'otro',
    label: 'Otro',
    anexo: null,
    anexoLabel: 'A clasificar',
    desc: 'Otra situación sanitaria o legal que necesito evaluar.',
  },
]

export default function EvaluarTipoCaso() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)

  const handleContinuar = () => {
    if (!selected) return
    const opcion = TIPOS_CASO.find((t) => t.id === selected)
    const tipologia = opcion.id === 'evento_medico_adverso' ? 'evento_medico_adverso' : opcion.id
    const anexo = opcion.anexo || 'otro'
    navigate('/evaluar/caso', { state: { anexo, tipologia, tipoCasoLabel: opcion.anexoLabel } })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="font-heading text-3xl font-bold text-text md:text-4xl">
        Evaluación inicial
      </h1>
      <p className="mt-2 text-secondary font-medium">Anexo II – Tipo de caso</p>
      <p className="mt-4 text-text/85">
        Indicá qué tipo de situación tenés para derivar tu caso al módulo correspondiente.
      </p>

      <div className="mt-10 space-y-4">
        {TIPOS_CASO.map((op) => (
          <label
            key={op.id}
            className={`flex cursor-pointer gap-4 rounded-2xl border-2 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all hover:shadow-[0_8px_24px_rgba(28,43,54,0.08)] ${
              selected === op.id ? 'border-accent ring-2 ring-accent/20' : 'border-primary/15'
            }`}
          >
            <input
              type="radio"
              name="tipo_caso"
              value={op.id}
              checked={selected === op.id}
              onChange={() => setSelected(op.id)}
              className="mt-1 h-5 w-5 accent-accent"
            />
            <div className="flex-1">
              <span className="font-heading text-lg font-semibold text-text">{op.label}</span>
              {op.anexoLabel && (
                <span className="ml-2 text-sm text-text/60">Anexo {op.anexo || '—'} · {op.anexoLabel}</span>
              )}
              <p className="mt-2 text-text/80">{op.desc}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <button
          type="button"
          onClick={handleContinuar}
          disabled={!selected}
          className="rounded-full bg-accent px-7 py-3.5 font-semibold text-primary transition hover:bg-accent/90 disabled:opacity-50"
        >
          Continuar
        </button>
        <Link
          to="/evaluar"
          className="rounded-full border-2 border-primary/30 px-7 py-3.5 font-semibold text-primary transition hover:border-primary hover:bg-primary/5"
        >
          ← Volver
        </Link>
      </div>
    </div>
  )
}
