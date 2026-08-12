import { Accordion, Button, Heading, Text } from '@chakra-ui/react'
import { useEffect } from 'react'
import type { SystemParams, SystemParamsMode } from '../../../steps/WizardDataContext'
import type { useSystemParamsForm } from '../../../hooks/useSystemParamsForm'
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
  currentMode: SystemParamsMode
  form: ReturnType<typeof useSystemParamsForm>
}

export const CustomSystemMenu = ({ onBack, onChange, currentMode, form }: CustomSystemMenuProps) => {
  const {
    params,
    patchOrientation: patchOrientationRaw,
    patchModule: patchModuleRaw,
    patchInverter: patchInverterRaw,
    patchLosses: patchLossesRaw,
    patchAlbedo: patchAlbedoRaw,
    patchBattery: patchBatteryRaw,
  } = form

  // Minden modositas eseten jelezzuk a szulo elemnek, hogy a Sajat rendszer parameterezese legyen kivalasztva
  const patchOrientation: typeof patchOrientationRaw = (p: Partial<SystemParams['orientation']>) => { onChange(); patchOrientationRaw(p) }
  const patchModule: typeof patchModuleRaw = (p: Partial<SystemParams['module']>) => { onChange(); patchModuleRaw(p) }
  const patchInverter: typeof patchInverterRaw = (p: Partial<SystemParams['inverter']>) => { onChange(); patchInverterRaw(p) }
  const patchLosses: typeof patchLossesRaw = (p: Partial<SystemParams['losses']>) => { onChange(); patchLossesRaw(p) }
  const patchAlbedo: typeof patchAlbedoRaw = (p: Partial<SystemParams['albedo']>) => { onChange(); patchAlbedoRaw(p) }
  const patchBattery: typeof patchBatteryRaw = (p: Partial<SystemParams['battery']>) => { onChange(); patchBatteryRaw(p) }

  // Ha egyik mod sincs meg kivalasztva, akkor is a Sajat rendszer parameterezesere alljon at
  useEffect(() => {
    if (currentMode === null) {
      onChange()
    }
  }, [])

  return (
    <>
      <Button variant="outline" mb={4} onClick={onBack}>Vissza</Button>
      <Heading mb={2}>Saját rendszer paraméterezése</Heading>
      <Text mb={6} color="fg.muted">
        Add meg a napelemrendszer egyedi paramétereit! Ha egy értékben nem vagy biztos, az adott mező melletti ⓘ ikon elmagyarázza a jelentését, valamint az alapértelmezett érték jó kiindulópontnak számíthat.
      </Text>

      <Accordion.Root collapsible variant="outline">
        <OrientationSection params={params.orientation} onPatch={patchOrientation} />
        <ModuleSection params={params.module} onPatch={patchModule} />
        <InverterSection params={params.inverter} onPatch={patchInverter} />
        <BatterySection params={params.battery} onPatch={patchBattery} />
        <AlbedoSection params={params.albedo} onPatch={patchAlbedo} />
        <LossesSection params={params.losses} onPatch={patchLosses} />
      </Accordion.Root>
    </>
  )
}
