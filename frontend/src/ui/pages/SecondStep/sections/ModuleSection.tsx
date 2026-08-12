import { Accordion, Heading, SimpleGrid, VStack } from '@chakra-ui/react'
import { NumField, SelectField, SwitchField } from '../../../../components/FormFields'
import type { SapmMountType, SystemParams } from '../../../../steps/WizardDataContext'

// A Sajat rendszer parameterezese lapon a napelemmodul parametereinek beallitasat teszi lehetove.

interface ModuleSectionProps {
  params: SystemParams['module']
  onPatch: (patch: Partial<SystemParams['module']>) => void
}

export const ModuleSection = ({ params, onPatch }: ModuleSectionProps) => (
  <Accordion.Item value="module">
    <Accordion.ItemTrigger>
      <Heading size="md" flex="1" textAlign="left">Modul</Heading>
      <Accordion.ItemIndicator />
    </Accordion.ItemTrigger>
    <Accordion.ItemContent>
      <Accordion.ItemBody>
        <VStack align="stretch" gap={4}>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <NumField
              label="Névleges DC teljesítmény"
              info="A modul(sor) standard tesztkörülmények szerinti névleges egyenáramú teljesítménye."
              value={params.pStcW}
              onChange={(v) => v !== null && onPatch({ pStcW: v })}
              min={0} step={50}
              helperText="watt (W)"
            />
            <NumField
              label="Hőmérsékleti együttható"
              info="A teljesítmény hőmérséklet függési mezője. Negatív előjelű: minél melegebb a modul, annál erősebben csökkenti a termelést."
              value={params.gammaPdc}
              onChange={(v) => v !== null && onPatch({ gammaPdc: v })}
              min={-0.01} max={0} step={0.0005}
              helperText="1/°C, pl. -0.004 = -0.4%/°C"
            />
          </SimpleGrid>

          <SelectField
            label="Szerelési mód"
            info="A modul hőmérsékletének emelkedését a szerelési mód határozza meg leginkább."
            value={params.sapmMountType}
            onChange={(v) => onPatch({ sapmMountType: v as SapmMountType })}
            options={[
              { label: 'Nyitott állvány, üveg-üveg', value: 'open_rack_glass_glass' },
              { label: 'Nyitott állvány, üveg-polimer hátlap', value: 'open_rack_glass_polymer' },
              { label: 'Tetőre integrált, üveg-üveg', value: 'close_mount_glass_glass' },
              { label: 'Hátul szigetelt, üveg-polimer hátlap', value: 'insulated_back_glass_polymer' },
            ]}
          />

          <SelectField
            label="Modul üvegezése"
            info="A beesési szög miatti visszaverődési veszteséget befolyásolja."
            value={String(params.iamB0)}
            onChange={(v) => onPatch({ iamB0: parseFloat(v) })}
            options={[
              { label: 'Átlagos üveg', value: '0.05' },
              { label: 'AR-bevonatos üveg', value: '0.017' },
            ]}
          />

          <SwitchField
            label="Kétoldalas (bifaciális) modul"
            info="Bifaciális modulnál a panel hátoldala is termel a talajról/tetőről visszavert fényből."
            checked={params.isBifacial}
            onChange={(v) => onPatch({ isBifacial: v })}
          />

          {params.isBifacial && (
            <NumField
              label="Bifacialitási tényező"
              info="A hátoldal termelése az előlaphoz képest. Pl. 0.8 - a hátoldal a homlokoldal teljesítményének kb. 80%-át képes megtermelni azonos besugárzás mellett."
              value={params.bifaciality}
              onChange={(v) => v !== null && onPatch({ bifaciality: v })}
              min={0} max={1} step={0.01}
              helperText="0 és 1 között"
            />
          )}
        </VStack>
      </Accordion.ItemBody>
    </Accordion.ItemContent>
  </Accordion.Item>
)
