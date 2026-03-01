import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MalaPraxisWizard from './pages/MalaPraxisWizard'
import EvaluarWelcome from './pages/EvaluarWelcome'
import EvaluarTipoCaso from './pages/EvaluarTipoCaso'
import EvaluarCasoRouter from './pages/EvaluarCasoRouter'
import EvaluarProcesando from './pages/EvaluarProcesando'
import EvaluarResultado from './pages/EvaluarResultado'
import EvaluarOferta from './pages/EvaluarOferta'
import EvaluarModalidad from './pages/EvaluarModalidad'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/evaluar" element={<EvaluarWelcome />} />
      <Route path="/evaluar/tipo-caso" element={<EvaluarTipoCaso />} />
      <Route path="/evaluar/caso" element={<EvaluarCasoRouter />} />
      <Route path="/evaluar/procesando" element={<EvaluarProcesando />} />
      <Route path="/evaluar/resultado" element={<EvaluarResultado />} />
      <Route path="/evaluar/oferta" element={<EvaluarOferta />} />
      <Route path="/evaluar/modalidad" element={<EvaluarModalidad />} />
      <Route path="/mala-praxis" element={<MalaPraxisWizard />} />
    </Routes>
  )
}

export default App