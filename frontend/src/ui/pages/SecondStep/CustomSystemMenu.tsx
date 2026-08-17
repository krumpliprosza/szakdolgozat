import { Accordion, Button, Heading, Text } from '@chakra-ui/react'
import { useEffect } from 'react'
import type { SystemParameters, SystemParametersMode } from '../../../steps/WizardDataContext'
import type { useSystemParametersForm } from '../../../hooks/useSystemParametersForm'
import { OrientationSection } from './sections/OrientationSection'
import { ModuleSection } from './sections/ModuleSection'
import { InverterSection } from './sections/InverterSection'
import { BatterySection } from './sections/BatterySection'
import { AlbedoSection } from './sections/AlbedoSection'
import { LossesSection } from './sections/LossesSection'

// Leiras: Sajat rendszer parameterezesehez tartozo menu.

interface CustomSystemMenuProps {
  onBack: () => void
  onChange: () => void
  currentMode: SystemParametersMode
  form: ReturnType<typeof useSystemParametersForm>
}

export const CustomSystemMenu = ({ onBack, onChange, currentMode, form }: CustomSystemMenuProps) => {
  const {
    parameters,
    patchOrientation: patchOrientationRaw,
    patchModule: patchModuleRaw,
    patchInverter: patchInverterRaw,
    patchLosses: patchLossesRaw,
    patchAlbedo: patchAlbedoRaw,
    patchBattery: patchBatteryRaw,
  } = form

  // Minden modositas eseten jelezzuk a szulo elemnek, hogy a Sajat rendszer parameterezese legyen kivalasztva
  const patchOrientation: typeof patchOrientationRaw = (p: Partial<SystemParameters['orientation']>) => { onChange(); patchOrientationRaw(p) }
  const patchModule: typeof patchModuleRaw = (p: Partial<SystemParameters['module']>) => { onChange(); patchModuleRaw(p) }
  const patchInverter: typeof patchInverterRaw = (p: Partial<SystemParameters['inverter']>) => { onChange(); patchInverterRaw(p) }
  const patchLosses: typeof patchLossesRaw = (p: Partial<SystemParameters['losses']>) => { onChange(); patchLossesRaw(p) }
  const patchAlbedo: typeof patchAlbedoRaw = (p: Partial<SystemParameters['albedo']>) => { onChange(); patchAlbedoRaw(p) }
  const patchBattery: typeof patchBatteryRaw = (p: Partial<SystemParameters['battery']>) => { onChange(); patchBatteryRaw(p) }

  // Ha egyik mod sincs meg kivalasztva, akkor is a Sajat rendszer parameterezesere alljon at
  useEffect(() => {
    if (currentMode === null) {
      onChange()
    }
  }, [])

  return (
    <>
      <Button variant="outline" mb={4} onClick={onBack}>Vissza</Button>
      <Heading mb={4}>Saját rendszer paraméterezése</Heading>
      <Text mb={4} color="fg.muted">
        Add meg a napelemrendszer egyedi paramétereit! Ha egy értékben nem vagy biztos, az adott mező melletti ⓘ ikon elmagyarázza a jelentését, valamint az alapértelmezett érték jó kiindulópontnak számíthat.
      </Text>

      <Accordion.Root collapsible variant="outline">
        <OrientationSection parameters={parameters.orientation} onPatch={patchOrientation} />
        <ModuleSection parameters={parameters.module} onPatch={patchModule} />
        <InverterSection parameters={parameters.inverter} onPatch={patchInverter} />
        <BatterySection parameters={parameters.battery} onPatch={patchBattery} />
        <AlbedoSection parameters={parameters.albedo} onPatch={patchAlbedo} />
        <LossesSection parameters={parameters.losses} onPatch={patchLosses} />
      </Accordion.Root>
    </>
  )
}
