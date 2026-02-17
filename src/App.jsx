import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import MalaPraxisWizard from './pages/MalaPraxisWizard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mala-praxis" element={<MalaPraxisWizard />} />
    </Routes>
  )
}

export default App