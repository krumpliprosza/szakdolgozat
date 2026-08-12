import { useEffect, useState } from 'react'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { AnimatedPage } from '../../../components/AnimatedPage'
import { useWizardData } from '../../../steps/WizardDataContext'
import { useSystemParamsForm } from '../../../hooks/useSystemParamsForm'
import { ChoiceMenu } from './ChoiceMenu'
import { PredefinedSystemMenu } from './PredefinedSystemMenu'
import { CustomSystemMenu } from './CustomSystemMenu'

// Leiras: Napelemrendszer parameterezese (a felhasznalo valaszthat, hogy elore meghatarozott rendszert valaszt vagy sajat rendszert parameterez).

type SecondStepView = 'valasztosmenu' | 'eloremeghatarozottrendszer' | 'sajatrendszer'

export const SecondStep = () => {
  usePageTitle("Napelemrendszer paraméterezése")

  const [view, setView] = useState<SecondStepView>('valasztosmenu')
  const { data, setData } = useWizardData()
  const form = useSystemParamsForm(data.systemParams)

  // Az oldal allapotat atmasolja a varazslo adatai koze
  useEffect(() => {
    setData({ systemParams: form.params })
  }, [form.params])

  return (
    <AnimatedPage key={view}>
      {view === 'valasztosmenu' && (
        <ChoiceMenu
          onSelectPredefined={() => setView('eloremeghatarozottrendszer')}
          onSelectCustom={() => setView('sajatrendszer')}
          selectedMode={data.systemParamsMode}
        />
      )}
      {view === 'eloremeghatarozottrendszer' && (
        <PredefinedSystemMenu
          onBack={() => setView('valasztosmenu')}
          onSelect={(id) => setData({ systemParamsMode: 'predefined', selectedPredefinedSystemId: id })}
          selectedId={data.selectedPredefinedSystemId}
          form={form}
        />
      )}
      {view === 'sajatrendszer' && (
        <CustomSystemMenu
          onBack={() => setView('valasztosmenu')}
          onChange={() => setData({ systemParamsMode: 'custom', selectedPredefinedSystemId: null })}
          currentMode={data.systemParamsMode}
          form={form}
        />
      )}
    </AnimatedPage>
  )
}
