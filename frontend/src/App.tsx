import { Navigate, Routes, Route } from 'react-router-dom'
import { WizardLayout } from './ui/layouts/WizardLayout'
import { WelcomePage } from './ui/pages/WelcomePage'
import { FirstStep } from './ui/pages/FirstStep'
import { SecondStep } from './ui/pages/SecondStep'
import { ThirdStep } from './ui/pages/ThirdStep/ThirdStep'
import { SetupComplete } from './ui/pages/SetupComplete'

/* TODO lista

  - Hibakezeles (404 not found stb.)
  - NREL SAM adatbazisbol modulok es inverterek betoltese?
  - Sajat fogyasztasi profil osszeallitasa oldal fogyaszto hozzaadasa nelkul is kivalasztottnak tekintett
  - Nincsenek elmentve a koordinatak

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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App