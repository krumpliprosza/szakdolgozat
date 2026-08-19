import { Accordion, Heading, SimpleGrid, VStack } from '@chakra-ui/react'
import { NumField } from '../../../../components/FormFields'
import { currentYear, type SystemParameters } from '../../../../steps/WizardDataContext'

// A Sajat rendszer parameterezese lapon a vesztesegek beallitasat teszi lehetove.

interface LossesSectionProps {
  parameters: SystemParameters['losses']
  onPatch: (patch: Partial<SystemParameters['losses']>) => void
}

export const LossesSection = ({ parameters, onPatch }: LossesSectionProps) => (
  <Accordion.Item value="losses" borderBottomWidth="2px">
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
      <Heading size="md" flex="1" textAlign="left">Veszteségek</Heading>
      <Accordion.ItemIndicator color="purple.fg" />
    </Accordion.ItemTrigger>
    <Accordion.ItemContent>
      <Accordion.ItemBody>
        <VStack align="stretch" gap={4}>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <NumField
              label="Vezetékellenállási veszteség"
              info="A kábelek ellenállása miatt elveszett teljesítmény hányada."
              value={parameters.lResistance}
              onChange={(value) => value !== null && onPatch({ lResistance: value })}
              min={0} max={0.2} step={0.005}
              formatOptions={{ style: 'percent', maximumFractionDigits: 1 }}
              helperText="0% és 20% között"
            />
            <NumField
              label="Modulillesztési veszteség"
              info="A sorban/párhuzamosan kötött modulok közötti teljesítménykülönbségekből eredő veszteség."
              value={parameters.lMismatch}
              onChange={(value) => value !== null && onPatch({ lMismatch: value })}
              min={0} max={0.2} step={0.005}
              formatOptions={{ style: 'percent', maximumFractionDigits: 1 }}
              helperText="0% és 20% között"
            />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <NumField
              label="Telepítés éve"
              info="Ebből számolja a modell az évenkénti degradációt."
              value={parameters.installYear}
              onChange={(value) => onPatch({ installYear: value })}
              min={1990} max={currentYear} step={1}
            />
            <NumField
              label="Éves degradációs ráta"
              info="A modul teljesítményének tipikus éves csökkenése öregedés miatt."
              value={parameters.annualDegradationRate}
              onChange={(value) => value !== null && onPatch({ annualDegradationRate: value })}
              min={0} max={0.05} step={0.001}
              formatOptions={{ style: 'percent', maximumFractionDigits: 1 }}
              helperText="%/év, 0% és 5% között"
            />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <NumField
              label="Szennyeződésekből származó maximális veszteség"
              info="A különböző szennyeződések okozta havi teljesítménycsökkenés felső korlátja."
              value={parameters.lSoilingMax}
              onChange={(value) => value !== null && onPatch({ lSoilingMax: value })}
              min={0} max={0.3} step={0.01}
              formatOptions={{ style: 'percent', maximumFractionDigits: 0 }}
              helperText="0% és 30% között"
            />
            <NumField
              label="Állandó árnyékolási veszteség"
              info="Fix árnyékoló objektum által okozott veszteség."
              value={parameters.lShade}
              onChange={(value) => value !== null && onPatch({ lShade: value })}
              min={0} max={0.9} step={0.01}
              formatOptions={{ style: 'percent', maximumFractionDigits: 0 }}
              helperText="0% és 90% között"
            />
          </SimpleGrid>
        </VStack>
      </Accordion.ItemBody>
    </Accordion.ItemContent>
  </Accordion.Item>
)
