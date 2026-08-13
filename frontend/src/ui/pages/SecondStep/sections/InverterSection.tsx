import { Accordion, Heading, SimpleGrid } from '@chakra-ui/react'
import { NumField } from '../../../../components/FormFields'
import { isInverterPowerValid } from '../../../../hooks/useSystemParamsForm'
import type { SystemParams } from '../../../../steps/WizardDataContext'

// A Sajat rendszer parameterezese lapon az inverter parametereinek beallitasat teszi lehetove.

interface InverterSectionProps {
  params: SystemParams['inverter']
  onPatch: (patch: Partial<SystemParams['inverter']>) => void
}

export const InverterSection = ({ params, onPatch }: InverterSectionProps) => (
  <Accordion.Item value="inverter">
    <Accordion.ItemTrigger>
      <Heading size="md" flex="1" textAlign="left">Inverter</Heading>
      <Accordion.ItemIndicator />
    </Accordion.ItemTrigger>
    <Accordion.ItemContent>
      <Accordion.ItemBody>
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
          <NumField
            label="Névleges AC teljesítmény"
            info="Az inverter névleges váltóáramú kimeneti teljesítménye."
            value={params.pAcNomW}
            onChange={(v) => v !== null && onPatch({ pAcNomW: v })}
            min={0} step={50}
            helperText="watt (W)"
            invalid={ !isInverterPowerValid(params) }
            errorText='A névleges AC teljesítmény csak pozitív értéket vehet fel!'
          />
          <NumField
            label="Névleges hatásfok"
            info="Az inverter hatásfoka (a DC → AC átalakítás veszteségét jellemzi)."
            value={params.inverterEfficiencyNom}
            onChange={(v) => v !== null && onPatch({ inverterEfficiencyNom: v })}
            min={0.5} max={1} step={0.005}
            helperText="0.5 és 1 között, pl. 0.96 = 96%"
          />
        </SimpleGrid>
      </Accordion.ItemBody>
    </Accordion.ItemContent>
  </Accordion.Item>
)
