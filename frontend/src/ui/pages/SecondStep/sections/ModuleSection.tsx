import { Accordion, Heading, SimpleGrid, VStack } from '@chakra-ui/react'
import { NumField, SelectField, SwitchField } from '../../../../components/FormFields'
import { isModulePowerValid } from '../../../../hooks/useSystemParametersForm'
import type { MountType, SystemParameters } from '../../../../steps/WizardDataContext'

// A Sajat rendszer parameterezese lapon a napelemmodul parametereinek beallitasat teszi lehetove.

interface ModuleSectionProps {
  parameters: SystemParameters['module']
  onPatch: (patch: Partial<SystemParameters['module']>) => void
}

export const ModuleSection = ({ parameters, onPatch }: ModuleSectionProps) => (
  <Accordion.Item value="module" borderBottomWidth="2px">
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
      <Heading size="md" flex="1" textAlign="left">Modul</Heading>
      <Accordion.ItemIndicator color="purple.fg" />
    </Accordion.ItemTrigger>
    <Accordion.ItemContent>
      <Accordion.ItemBody>
        <VStack align="stretch" gap={4}>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <NumField
              label="Névleges DC teljesítmény"
              info="A modul(sor) standard tesztkörülmények szerinti névleges egyenáramú teljesítménye."
              value={parameters.pStc}
              onChange={(value) => value !== null && onPatch({ pStc: value })}
              min={0} step={50}
              helperText="watt (W)"
              invalid={ !isModulePowerValid(parameters) }
              errorText='A névleges DC teljesítmény csak pozitív értéket vehet fel!'
            />
            <NumField
              label="Hőmérsékleti együttható"
              info="A teljesítmény hőmérséklet függési mezője. Negatív előjelű: minél melegebb a modul, annál erősebben csökkenti a termelést."
              value={parameters.gammaPdc}
              onChange={(value) => value !== null && onPatch({ gammaPdc: value })}
              min={-0.01} max={0} step={0.0005}
              formatOptions={{ style: 'percent', maximumFractionDigits: 2 }}
              helperText="%/°C, -1%/°C és 0%/°C között"
            />
          </SimpleGrid>

          <SelectField
            label="Szerelési mód"
            info="A modul hőmérsékletének emelkedését a szerelési mód határozza meg leginkább."
            value={parameters.mountType}
            onChange={(value) => onPatch({ mountType: value as MountType })}
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
            value={String(parameters.iamB0)}
            onChange={(value) => onPatch({ iamB0: parseFloat(value) })}
            options={[
              { label: 'Átlagos üveg', value: '0.05' },
              { label: 'AR-bevonatos üveg', value: '0.017' },
            ]}
          />

          <SwitchField
            label="Kétoldalas (bifaciális) modul"
            info="Bifaciális modulnál a panel hátoldala is termel a talajról/tetőről visszavert fényből."
            checked={parameters.isBifacial}
            onChange={(value) => onPatch({ isBifacial: value })}
          />

          {parameters.isBifacial && (
            <NumField
              label="Bifacialitási tényező"
              info="A hátoldal termelése az előlaphoz képest. Pl. 0.8 - a hátoldal a homlokoldal teljesítményének kb. 80%-át képes megtermelni azonos besugárzás mellett."
              value={parameters.bifaciality}
              onChange={(value) => value !== null && onPatch({ bifaciality: value })}
              min={0} max={1} step={0.01}
              formatOptions={{ style: 'percent', maximumFractionDigits: 0 }}
              helperText="0% és 100% között"
            />
          )}
        </VStack>
      </Accordion.ItemBody>
    </Accordion.ItemContent>
  </Accordion.Item>
)
