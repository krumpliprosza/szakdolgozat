import { Accordion, Heading, SimpleGrid, VStack } from '@chakra-ui/react'
import { NumField, SelectField } from '../../../../components/FormFields'
import type { SystemParameters, TrackingType } from '../../../../steps/WizardDataContext'

// A Sajat rendszer parameterezese lapon a napelemrendszer tajolasi es kovetesi parametereinek beallitasat teszi lehetove.

interface OrientationSectionProps {
  parameters: SystemParameters['orientation']
  onPatch: (patch: Partial<SystemParameters['orientation']>) => void
}

export const OrientationSection = ({ parameters, onPatch }: OrientationSectionProps) => (
  <Accordion.Item value="orientation">
    <Accordion.ItemTrigger>
      <Heading size="md" flex="1" textAlign="left">Tájolás</Heading>
      <Accordion.ItemIndicator color="purple.fg" />
    </Accordion.ItemTrigger>
    <Accordion.ItemContent>
      <Accordion.ItemBody>
        <VStack align="stretch" gap={4}>
          <SelectField
            label="Rendszer típusa"
            info="Fix tájolású tartószerkezet, vagy napkövető rendszer (egy- vagy kéttengelyes)."
            value={parameters.trackingType}
            onChange={(value) => onPatch({ trackingType: value as TrackingType })}
            options={[
              { label: 'Fix tájolású', value: 'fixed' },
              { label: 'Egytengelyes követés', value: 'single_axis' },
              { label: 'Kéttengelyes követés', value: 'dual_axis' },
            ]}
          />

          {parameters.trackingType === 'fixed' && (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <NumField
                label="Dőlésszög"
                info="A panel síkja és a vízszintes talaj bezárt szöge. Referenciaértékek: 0° = vízszintes, 90° = függőleges."
                value={parameters.surfaceTilt}
                onChange={(value) => value !== null && onPatch({ surfaceTilt: value })}
                min={0} max={90} step={1}
                helperText="fok (°)"
              />
              <NumField
                label="Tájolási szög (azimut)"
                info="A panel irányítási szöge. Referenciaértékek: 0° = észak, 90° = kelet, 180° = dél, 270° = nyugat."
                value={parameters.surfaceAzimuth}
                onChange={(value) => value !== null && onPatch({ surfaceAzimuth: value })}
                min={0} max={360} step={1}
                helperText="fok (°)"
              />
            </SimpleGrid>
          )}

          {parameters.trackingType === 'single_axis' && (
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              <NumField
                label="Tengely dőlésszöge"
                info="Az egytengelyes követő forgástengelyének dőlése a vízszintestől. Sík terepen jellemzően 0°."
                value={parameters.axisTilt}
                onChange={(value) => value !== null && onPatch({ axisTilt: value })}
                min={0} max={90} step={1}
                helperText="fok (°)"
              />
              <NumField
                label="Tengely azimutja"
                info="A forgástengely vízszintes vetületének iránya. Észak-dél tájolású tengelynél jellemzően 180°."
                value={parameters.axisAzimuth}
                onChange={(value) => value !== null && onPatch({ axisAzimuth: value })}
                min={0} max={360} step={1}
                helperText="fok (°)"
              />
              <NumField
                label="Maximális követési szög"
                info="Az a legnagyobb szög, amennyire a panel a tengelye körül elfordulhat napkeltétől napnyugtáig."
                value={parameters.maxTrackingAngle}
                onChange={(value) => value !== null && onPatch({ maxTrackingAngle: value })}
                min={0} max={90} step={1}
                helperText="fok (°)"
              />
            </SimpleGrid>
          )}

          {parameters.trackingType !== 'fixed' && (
            <NumField
              label="Sortávolság aránya (GCR)"
              info="A modulszélesség és a sorok közti távolság aránya."
              value={parameters.groundCoverageRatio}
              onChange={(value) => value !== null && onPatch({ groundCoverageRatio: value })}
              min={0.05} max={0.95} step={0.01}
              helperText="0.05 és 0.95 között"
            />
          )}
        </VStack>
      </Accordion.ItemBody>
    </Accordion.ItemContent>
  </Accordion.Item>
)
