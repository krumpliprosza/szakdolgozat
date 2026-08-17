import { useEffect, useState } from 'react'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { AnimatedPage } from '../../../components/AnimatedPage'
import { useWizardData } from '../../../steps/WizardDataContext'
import { useSystemParametersForm } from '../../../hooks/useSystemParametersForm'
import { ChoiceMenu } from './ChoiceMenu'
import { PredefinedSystemMenu } from './PredefinedSystemMenu'
import { CustomSystemMenu } from './CustomSystemMenu'

// Leiras: Napelemrendszer parameterezese (a felhasznalo valaszthat, hogy elore meghatarozott rendszert valaszt vagy sajat rendszert parameterez).

type SecondStepView = 'valasztosmenu' | 'eloremeghatarozottrendszer' | 'sajatrendszer'

export const SecondStep = () => {
  usePageTitle("Napelemrendszer paraméterezése")

  const [view, setView] = useState<SecondStepView>('valasztosmenu')
  const { data, setData } = useWizardData()
  const form = useSystemParametersForm(data.systemParameters)

  // Az oldal allapotat atmasolja a varazslo adatai koze
  useEffect(() => {
    setData({ systemParameters: form.parameters })
  }, [form.parameters])

  return (
    <AnimatedPage key={view}>
      {view === 'valasztosmenu' && (
        <ChoiceMenu
          onSelectPredefined={() => setView('eloremeghatarozottrendszer')}
          onSelectCustom={() => setView('sajatrendszer')}
          selectedMode={data.systemParametersMode}
        />
      )}
      {view === 'eloremeghatarozottrendszer' && (
        <PredefinedSystemMenu
          onBack={() => setView('valasztosmenu')}
          onSelect={(id) => setData({ systemParametersMode: 'predefined', selectedPredefinedSystemId: id })}
          selectedId={data.selectedPredefinedSystemId}
          form={form}
        />
      )}
      {view === 'sajatrendszer' && (
        <CustomSystemMenu
          onBack={() => setView('valasztosmenu')}
          onChange={() => setData({ systemParametersMode: 'custom', selectedPredefinedSystemId: null })}
          currentMode={data.systemParametersMode}
          form={form}
        />
      )}
    </AnimatedPage>
  )
}
