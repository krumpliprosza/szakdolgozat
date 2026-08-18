import { Accordion, Heading, SimpleGrid } from '@chakra-ui/react'
import { NumField } from '../../../../components/FormFields'
import { isInverterPowerValid } from '../../../../hooks/useSystemParametersForm'
import type { SystemParameters } from '../../../../steps/WizardDataContext'

// A Sajat rendszer parameterezese lapon az inverter parametereinek beallitasat teszi lehetove.

interface InverterSectionProps {
  parameters: SystemParameters['inverter']
  onPatch: (patch: Partial<SystemParameters['inverter']>) => void
}

export const InverterSection = ({ parameters, onPatch }: InverterSectionProps) => (
  <Accordion.Item value="inverter" borderBottomWidth="2px">
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
      <Heading size="md" flex="1" textAlign="left">Inverter</Heading>
      <Accordion.ItemIndicator color="purple.fg" />
    </Accordion.ItemTrigger>
    <Accordion.ItemContent>
      <Accordion.ItemBody>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <NumField
            label="Névleges AC teljesítmény"
            info="Az inverter névleges váltóáramú kimeneti teljesítménye."
            value={parameters.pAc}
            onChange={(value) => value !== null && onPatch({ pAc: value })}
            min={0} step={50}
            helperText="watt (W)"
            invalid={ !isInverterPowerValid(parameters) }
            errorText='A névleges AC teljesítmény csak pozitív értéket vehet fel!'
          />
          <NumField
            label="Névleges hatásfok"
            info="Az inverter hatásfoka (a DC → AC átalakítás veszteségét jellemzi)."
            value={parameters.inverterEfficiency}
            onChange={(value) => value !== null && onPatch({ inverterEfficiency: value })}
            min={0.5} max={1} step={0.005}
            helperText="0.5 és 1 között, pl. 0.96 = 96%"
          />
        </SimpleGrid>
      </Accordion.ItemBody>
    </Accordion.ItemContent>
  </Accordion.Item>
)
