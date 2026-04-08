import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MalaPraxisWizard from './pages/MalaPraxisWizard'
import EvaluarLayout from './components/EvaluarLayout'
import EvaluarWelcome from './pages/EvaluarWelcome'
import EvaluarInicio from './pages/EvaluarInicio'
import EvaluarTipoCaso from './pages/EvaluarTipoCaso'
import EvaluarCasoRouter from './pages/EvaluarCasoRouter'
import EvaluarRegistrado from './pages/EvaluarRegistrado'
import EvaluarOferta from './pages/EvaluarOferta'
import EvaluarModalidad from './pages/EvaluarModalidad'
import Terminos from './pages/Terminos'
import Privacidad from './pages/Privacidad'
import CompletarSolicitud from './pages/CompletarSolicitud'
import PagoExitoso from './pages/PagoExitoso'
import PagoPendiente from './pages/PagoPendiente'
import PagoFallido from './pages/PagoFallido'
import PagoLink from './pages/PagoLink'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/terminos" element={<Terminos />} />
      <Route path="/privacidad" element={<Privacidad />} />
      <Route path="/completar/:token" element={<CompletarSolicitud />} />
      <Route path="/pago/exitoso" element={<PagoExitoso />} />
      <Route path="/pago/pendiente" element={<PagoPendiente />} />
      <Route path="/pago/fallido" element={<PagoFallido />} />
      <Route path="/pagar/:token" element={<PagoLink />} />
      <Route path="/evaluar" element={<EvaluarLayout />}>
        <Route index element={<EvaluarWelcome />} />
        <Route path="inicio" element={<EvaluarInicio />} />
        <Route path="tipo-caso" element={<EvaluarTipoCaso />} />
        <Route path="caso" element={<EvaluarCasoRouter />} />
        <Route path="registrado" element={<EvaluarRegistrado />} />
        <Route path="oferta" element={<EvaluarOferta />} />
        <Route path="modalidad" element={<EvaluarModalidad />} />
      </Route>
      <Route path="/mala-praxis" element={<MalaPraxisWizard />} />
    </Routes>
  )
}

export default App