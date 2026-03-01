import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

/**
 * Evaluación inicial (Anexo II) – Tipo de caso.
 * Deriva al anexo correspondiente: IV Amparos, V Evento médico adverso, VIII Reintegros, u Otro.
 */
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
    id: 'evento_medico_adverso',
    label: 'Evento médico adverso',
    anexo: 'V',
    anexoLabel: 'Evaluación de evento médico adverso',
    desc: 'Quiero evaluar si hubo un error médico o resultado evitable (daño ya ocurrido).',
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
    <div className="evaluar-welcome evaluar-tipo-caso">
      <div className="evaluar-tipo-caso-inner">
        <h1>Evaluación inicial</h1>
        <p className="evaluar-tipo-caso-sub">Anexo II – Tipo de caso</p>
        <p className="evaluar-welcome-desc">
          Indicá qué tipo de situación tenés para derivar tu caso al módulo correspondiente.
        </p>

        <div className="evaluar-tipo-caso-options">
          {TIPOS_CASO.map((op) => (
            <label
              key={op.id}
              className={`evaluar-tipo-caso-card ${selected === op.id ? 'evaluar-tipo-caso-card--selected' : ''}`}
            >
              <input
                type="radio"
                name="tipo_caso"
                value={op.id}
                checked={selected === op.id}
                onChange={() => setSelected(op.id)}
                className="evaluar-oferta-radio"
              />
              <span className="evaluar-tipo-caso-label">{op.label}</span>
              {op.anexoLabel && (
                <span className="evaluar-tipo-caso-anexo">Anexo {op.anexo || '—'} · {op.anexoLabel}</span>
              )}
              <p className="evaluar-tipo-caso-desc">{op.desc}</p>
            </label>
          ))}
        </div>

        <div className="evaluar-tipo-caso-actions">
          <button
            type="button"
            onClick={handleContinuar}
            disabled={!selected}
            className="evaluar-welcome-cta"
          >
            Continuar
          </button>
          <Link to="/evaluar" className="evaluar-welcome-back">← Volver</Link>
        </div>
      </div>
    </div>
  )
}
