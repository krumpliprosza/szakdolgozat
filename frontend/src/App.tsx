import { Navigate, Routes, Route } from 'react-router-dom'
import { WelcomePage } from './ui/pages/WelcomePage'
import { FirstStep } from './ui/pages/FirstStep'
import { SecondStep } from './ui/pages/SecondStep'
import { ThirdStep } from './ui/pages/ThirdStep'
import { SetupComplete } from './ui/pages/SetupComplete'
import { SimulationResults } from './ui/pages/SimulationResults'
import { WizardDataProvider } from './steps/WizardDataContext'
import { WizardLayout } from './ui/layouts/WizardLayout'

/* TODO lista

  SecondStep:
  - NREL SAM adatbazisbol modulok es inverterek betoltese?
  ThirdStep:
  - Fogyasztasi modell atalakitasa?
  SetupComplete:
  - Szimulacios parameterek megosztasa (lzString + QR kod)?

*/

// Leiras: Az utvonalakat definialja, semmi mas logikat nem tartalmaz.

function App() {
  return (
    <WizardDataProvider>
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
    </WizardDataProvider>
  )
}

export default App