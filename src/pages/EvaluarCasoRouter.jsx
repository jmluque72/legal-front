import { useLocation } from 'react-router-dom'
import MalaPraxisWizard from './MalaPraxisWizard'
import EvaluacionOtroAnexo from './EvaluacionOtroAnexo'
import ReintegroAnexoVIIIWizard from './ReintegroAnexoVIIIWizard'
import BiometriaWizard from './BiometriaWizard'
import AdultosMayoresWizard from './AdultosMayoresWizard'

/**
 * Deriva por anexo / tipología:
 * - Anexo VI o tipología adultos_mayores → wizard Adultos Mayores (Anexo VI).
 * - Anexo VIII o tipología reintegro → wizard reintegros (Anexo VIII).
 * - Tipología biometria → wizard datos biométricos (Anexo IV).
 * - Anexo V o sin state → evento médico adverso (legacy si no hay state).
 * - Resto → formulario reducido.
 */
export default function EvaluarCasoRouter() {
  const location = useLocation()
  const anexo = location.state?.anexo
  const tipologia = location.state?.tipologia

  if (anexo === 'VI' || tipologia === 'adultos_mayores') {
    return <AdultosMayoresWizard fromEvaluar />
  }

  if (anexo === 'VIII' || tipologia === 'reintegro') {
    return <ReintegroAnexoVIIIWizard fromEvaluar />
  }

  if (tipologia === 'biometria') {
    return <BiometriaWizard fromEvaluar />
  }

  if (anexo === 'V' || anexo === undefined) {
    return <MalaPraxisWizard fromEvaluar />
  }

  return <EvaluacionOtroAnexo />
}
