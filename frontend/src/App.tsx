import { Navigate, Routes, Route } from 'react-router-dom'
import { WizardLayout } from './ui/layouts/WizardLayout'
import { WelcomePage } from './ui/pages/WelcomePage'
import { FirstStep } from './ui/pages/FirstStep'
import { SecondStep } from './ui/pages/SecondStep'
import { ThirdStep } from './ui/pages/ThirdStep'
import { SetupComplete } from './ui/pages/SetupComplete'
import { SimulationResults } from './ui/pages/SimulationResults'

/* TODO lista

  Altalanos/ismeretlen hely:
  - Tarifak kezelese
  - Hibakezeles (404 not found stb.)?
  SecondStep:
  - NREL SAM adatbazisbol modulok es inverterek betoltese?
  ThirdStep:
  - Fogyasztasi modell atalakitasa?
  SetupComplete:
  - Szimulacios parameterek megosztasa (lzString + QR kod)?
  SimulationResults:
  - Ne lehessen megnyitni ellenorzes nelkul a SimulationResults oldalt

*/

// Leiras: Az utvonalakat definialja, semmi mas logikat nem tartalmaz.

function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route element={<WizardLayout />}>
        <Route path="/first-step" element={<FirstStep />} />
        <Route path="/second-step" element={<SecondStep />} />
        <Route path="/third-step" element={<ThirdStep />} />
        <Route path="/setup-complete" element={<SetupComplete />} />
      </Route>
      <Route path="/simulation-results" element={<SimulationResults />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App