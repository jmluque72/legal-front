import { useLocation } from 'react-router-dom'
import MalaPraxisWizard from './MalaPraxisWizard'
import EvaluacionOtroAnexo from './EvaluacionOtroAnexo'

/**
 * Deriva por anexo: Anexo V → wizard completo (Evento médico adverso);
 * el resto → formulario reducido (EvaluacionOtroAnexo).
 * Acceso directo a /evaluar/caso sin state se trata como Anexo V (legacy).
 */
export default function EvaluarCasoRouter() {
  const location = useLocation()
  const anexo = location.state?.anexo

  // Sin state = flujo legacy (link directo): wizard Anexo V
  if (anexo === 'V' || anexo === undefined) {
    return <MalaPraxisWizard fromEvaluar />
  }

  return <EvaluacionOtroAnexo />
}
