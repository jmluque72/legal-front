import { useLocation } from 'react-router-dom'
import MalaPraxisWizard from './MalaPraxisWizard'
import EvaluacionOtroAnexo from './EvaluacionOtroAnexo'
import ReintegroAnexoVIIIWizard from './ReintegroAnexoVIIIWizard'

/**
 * Deriva por anexo / tipología:
 * - Anexo VIII o tipología reintegro → wizard reintegros (Anexo VIII).
 * - Anexo V o sin state → evento médico adverso (legacy si no hay state).
 * - Resto → formulario reducido.
 */
export default function EvaluarCasoRouter() {
  const location = useLocation()
  const anexo = location.state?.anexo
  const tipologia = location.state?.tipologia

  if (anexo === 'VIII' || tipologia === 'reintegro') {
    return <ReintegroAnexoVIIIWizard fromEvaluar />
  }

  if (anexo === 'V' || anexo === undefined) {
    return <MalaPraxisWizard fromEvaluar />
  }

  return <EvaluacionOtroAnexo />
}
