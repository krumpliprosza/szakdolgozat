import { Accordion, Heading } from '@chakra-ui/react'
import { NumField } from '../../../../components/FormFields'
import type { SystemParams } from '../../../../steps/WizardDataContext'

// A Sajat rendszer parameterezese lapon az albedo beallitasat teszi lehetove.

interface AlbedoSectionProps {
  params: SystemParams['albedo']
  onPatch: (patch: Partial<SystemParams['albedo']>) => void
}

export const AlbedoSection = ({ params, onPatch }: AlbedoSectionProps) => (
  <Accordion.Item value="albedo">
    <Accordion.ItemTrigger>
      <Heading size="md" flex="1" textAlign="left">Talaj-visszaverődés (albedó)</Heading>
      <Accordion.ItemIndicator />
    </Accordion.ItemTrigger>
    <Accordion.ItemContent>
      <Accordion.ItemBody>
        <NumField
          label="Talaj albedója"
          info="A talajfelszín fényvisszaverő képessége. Referenciaértékek: aszfalt esetén ~0.1, fű/föld esetén ~0.2, friss hó esetén ~0.6-0.8. Kétoldalú moduloknál a hátoldali termelést is befolyásolja."
          value={params.groundAlbedo}
          onChange={(v) => v !== null && onPatch({ groundAlbedo: v })}
          min={0} max={1} step={0.01}
          helperText="0 és 1 között"
        />
      </Accordion.ItemBody>
    </Accordion.ItemContent>
  </Accordion.Item>
)
