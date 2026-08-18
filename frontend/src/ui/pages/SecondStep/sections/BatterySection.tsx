import { Accordion, Heading, SimpleGrid, VStack } from '@chakra-ui/react'
import { NumField } from '../../../../components/FormFields'
import type { SystemParameters } from '../../../../steps/WizardDataContext'

// A Sajat rendszer parameterezese lapon az akkumulator parametereinek beallitasat teszi lehetove.

interface BatterySectionProps {
  parameters: SystemParameters['battery']
  onPatch: (patch: Partial<SystemParameters['battery']>) => void
}

export const BatterySection = ({ parameters, onPatch }: BatterySectionProps) => (
  <Accordion.Item value="battery" borderBottomWidth="2px">
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
      <Heading size="md" flex="1" textAlign="left">Akkumulátor</Heading>
      <Accordion.ItemIndicator color="purple.fg" />
    </Accordion.ItemTrigger>
    <Accordion.ItemContent>
      <Accordion.ItemBody>
        <VStack align="stretch" gap={4}>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <NumField
              label="Kapacitás"
              info="Az akkumulátor névleges energiatároló kapacitása."
              value={parameters.capacity}
              onChange={(value) => value !== null && onPatch({ capacity: value })}
              min={0} step={0.5}
              helperText="kilowattóra (kWh)"
            />
            <NumField
              label="Kezdeti töltöttség"
              info="A töltöttségi szint, amivel a szimuláció indul."
              value={parameters.soc0}
              onChange={(value) => value !== null && onPatch({ soc0: value })}
              min={0} max={1} step={0.05}
              helperText="0 és 1 között, pl. 0.5 = 50%"
            />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <NumField
              label="Minimális töltöttségi szint"
              info="Az akkumulátor élettartamának védelme érdekében ez alá nem engedi a modell a töltöttséget kisütni."
              value={parameters.socMin}
              onChange={(value) => value !== null && onPatch({ socMin: value })}
              min={0} max={1} step={0.05}
              helperText="0 és 1 között, pl. 0.1 = 10%"
            />
            <NumField
              label="Maximális töltöttségi szint"
              info="Az akkumulátor élettartamának védelme érdekében ez fölé nem tölt a modell."
              value={parameters.socMax}
              onChange={(value) => value !== null && onPatch({ socMax: value })}
              min={0} max={1} step={0.05}
              helperText="0 és 1 között, pl. 0.9 = 90%"
            />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <NumField
              label="Maximális töltési teljesítmény"
              info="Az akkumulátor/töltésvezérlő által megengedett legnagyobb töltési teljesítmény."
              value={parameters.pChargeMax}
              onChange={(value) => value !== null && onPatch({ pChargeMax: value })}
              min={0} step={0.1}
              helperText="kilowatt (kW)"
            />
            <NumField
              label="Maximális kisütési teljesítmény"
              info="Az akkumulátor/inverter által megengedett legnagyobb kisütési teljesítmény."
              value={parameters.pDischargeMax}
              onChange={(value) => value !== null && onPatch({ pDischargeMax: value })}
              min={0} step={0.1}
              helperText="kilowatt (kW)"
            />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <NumField
              label="Töltési hatásfok"
              info="A töltés közben fellépő veszteség miatt a betáplált energiának csak ekkora része kerül ténylegesen tárolásra."
              value={parameters.etaCharge}
              onChange={(value) => value !== null && onPatch({ etaCharge: value })}
              min={0.5} max={1} step={0.01}
              helperText="0 és 1 között, pl. 0.97 = 97%"
            />
            <NumField
              label="Kisütési hatásfok"
              info="A kisütés közben fellépő veszteség miatt a tárolt energiának csak ekkora része jut vissza a rendszerbe."
              value={parameters.etaDischarge}
              onChange={(value) => value !== null && onPatch({ etaDischarge: value })}
              min={0.5} max={1} step={0.01}
              helperText="0 és 1 között, pl. 0.97 = 97%"
            />
          </SimpleGrid>
        </VStack>
      </Accordion.ItemBody>
    </Accordion.ItemContent>
  </Accordion.Item>
)
