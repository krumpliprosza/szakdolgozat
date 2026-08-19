import { Accordion, Heading } from '@chakra-ui/react'
import { NumField } from '../../../../components/FormFields'
import type { SystemParameters } from '../../../../steps/WizardDataContext'

// A Sajat rendszer parameterezese lapon az albedo beallitasat teszi lehetove.

interface AlbedoSectionProps {
  parameters: SystemParameters['albedo']
  onPatch: (patch: Partial<SystemParameters['albedo']>) => void
}

export const AlbedoSection = ({ parameters, onPatch }: AlbedoSectionProps) => (
  <Accordion.Item value="albedo" borderBottomWidth="2px">
    <Accordion.ItemTrigger 
      _open={{ borderBottomWidth: "2px" }}
      transition="border-bottom-width linear 0ms"
      css={{
        '&[data-state="open"]': {
          transitionDelay: "0ms",
        },
        '&[data-state="closed"]': {
          transitionDelay: "200ms",
        },
      }}
    >
      <Heading size="md" flex="1" textAlign="left">Talaj-visszaverődés (albedó)</Heading>
      <Accordion.ItemIndicator color="purple.fg" />
    </Accordion.ItemTrigger>
    <Accordion.ItemContent>
      <Accordion.ItemBody>
        <NumField
          label="Talaj albedója"
          info="A talajfelszín fényvisszaverő képessége. Referenciaértékek: aszfalt esetén ~10%, fű/föld esetén ~20%, friss hó esetén ~60-80%. Kétoldalú moduloknál a hátoldali termelést is befolyásolja."
          value={parameters.albedo}
          onChange={(value) => value !== null && onPatch({ albedo: value })}
          min={0} max={1} step={0.01}
          formatOptions={{ style: 'percent', maximumFractionDigits: 0 }}
          helperText="0% és 100% között"
        />
      </Accordion.ItemBody>
    </Accordion.ItemContent>
  </Accordion.Item>
)
