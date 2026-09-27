import { useEffect, useState } from 'react'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { AnimatedPage } from '../../../components/AnimatedPage'
import { useWizardData, mainMeteringPointId } from '../../../steps/WizardDataContext'
import { useConsumptionProfileForm } from '../../../hooks/useConsumptionProfileForm'
import { ChoiceMenu } from './ChoiceMenu'
import { PredefinedProfileMenu } from './PredefinedProfileMenu'
import { CustomProfileMenu } from './CustomProfileMenu'

// Leiras: Fogyasztasi profil megadasa (a felhasznalo valaszthat, hogy elore meghatarozott fogyasztasi profilt valaszt vagy az alapoktol allitja ossze).

type ThirdStepView = 'valasztosmenu' | 'eloremeghatarozottprofil' | 'sajatprofil'

// A harmadik lepesen beluli menupontok leptetese
export const ThirdStep = () => {
  usePageTitle("Fogyasztási profil megadása")

  const [view, setView] = useState<ThirdStepView>('valasztosmenu')
  const { data, setData } = useWizardData()
  const form = useConsumptionProfileForm(data.HouseholdItems, mainMeteringPointId)

  // A felvett fogyasztokat atmasolja a varazslo adatai koze
  useEffect(() => {
    setData({ HouseholdItems: form.items })
  }, [form.items])

  return (
    <AnimatedPage key={view}>
      {view === 'valasztosmenu' && (
        <ChoiceMenu
          onSelectPredefined={() => setView('eloremeghatarozottprofil')}
          onSelectCustom={() => setView('sajatprofil')}
          selectedMode={data.consumptionProfileMode}
        />
      )}
      {view === 'eloremeghatarozottprofil' && (
        <PredefinedProfileMenu
          onBack={() => setView('valasztosmenu')}
          onSelect={(id) => setData({ consumptionProfileMode: 'predefined', selectedPredefinedProfileId: id })}
          selectedId={data.selectedPredefinedProfileId}
          form={form}
        />
      )}
      {view === 'sajatprofil' && (
        <CustomProfileMenu 
          onBack={() => setView('valasztosmenu')} 
          onChange={() => setData({ consumptionProfileMode: 'custom', selectedPredefinedProfileId: null })}
          currentMode={data.consumptionProfileMode}
          form={form}
          distributor={data.distributor}
          onDistributorChange={(distributor) => setData({distributor})}
          meteringPoints={data.meteringPoints}
          onMeteringPointsChange={(meteringPoints) => setData({meteringPoints})}
        />
      )}
    </AnimatedPage>
  )
}
