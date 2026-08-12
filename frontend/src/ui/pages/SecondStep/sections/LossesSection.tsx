import { Accordion, Heading, SimpleGrid, VStack } from '@chakra-ui/react'
import { NumField } from '../../../../components/FormFields'
import { currentYear, type SystemParams } from '../../../../steps/WizardDataContext'

// A Sajat rendszer parameterezese lapon a vesztesegek beallitasat teszi lehetove.

interface LossesSectionProps {
  params: SystemParams['losses']
  onPatch: (patch: Partial<SystemParams['losses']>) => void
}

export const LossesSection = ({ params, onPatch }: LossesSectionProps) => (
  <Accordion.Item value="losses">
    <Accordion.ItemTrigger>
      <Heading size="md" flex="1" textAlign="left">Veszteségek</Heading>
      <Accordion.ItemIndicator />
    </Accordion.ItemTrigger>
    <Accordion.ItemContent>
      <Accordion.ItemBody>
        <VStack align="stretch" gap={4}>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <NumField
              label="Vezetékellenállási veszteség"
              info="A kábelek ellenállása miatt elveszett teljesítmény hányada."
              value={params.lResistance}
              onChange={(v) => v !== null && onPatch({ lResistance: v })}
              min={0} max={0.2} step={0.005}
              helperText="0 és 0.2 között, pl. 0.02 = 2%"
            />
            <NumField
              label="Modulillesztési veszteség"
              info="A sorban/párhuzamosan kötött modulok közötti teljesítménykülönbségekből eredő veszteség."
              value={params.lMismatch}
              onChange={(v) => v !== null && onPatch({ lMismatch: v })}
              min={0} max={0.2} step={0.005}
              helperText="0 és 0.2 között, pl. 0.02 = 2%"
            />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <NumField
              label="Telepítés éve"
              info="Ebből számolja a modell az évenkénti degradációt."
              value={params.installYear}
              onChange={(v) => onPatch({ installYear: v })}
              min={1990} max={currentYear} step={1}
            />
            <NumField
              label="Éves degradációs ráta"
              info="A modul teljesítményének tipikus éves csökkenése öregedés miatt."
              value={params.annualDegradationRate}
              onChange={(v) => v !== null && onPatch({ annualDegradationRate: v })}
              min={0} max={0.05} step={0.001}
              helperText="1/év, pl. 0.005 = 0.5%/év"
            />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <NumField
              label="Szennyeződésekből származó maximális veszteség"
              info="A különböző szennyeződések okozta havi teljesítménycsökkenés felső korlátja."
              value={params.soilingMaxLoss}
              onChange={(v) => v !== null && onPatch({ soilingMaxLoss: v })}
              min={0} max={0.3} step={0.01}
              helperText="0 és 0.3 között, pl. 0.06 = 6%"
            />
            <NumField
              label="Állandó árnyékolási veszteség"
              info="Fix árnyékoló objektum esetén, ha az időben nem változó veszteséget okoz."
              value={params.lShadeConstant}
              onChange={(v) => v !== null && onPatch({ lShadeConstant: v })}
              min={0} max={0.9} step={0.01}
              helperText="0 és 0.9 között"
            />
          </SimpleGrid>
        </VStack>
      </Accordion.ItemBody>
    </Accordion.ItemContent>
  </Accordion.Item>
)
