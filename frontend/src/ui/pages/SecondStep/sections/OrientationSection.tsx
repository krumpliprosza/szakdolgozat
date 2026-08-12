import { Accordion, Heading, SimpleGrid, VStack } from '@chakra-ui/react'
import { NumField, SelectField } from '../../../../components/FormFields'
import type { SystemParams, TrackingType } from '../../../../steps/WizardDataContext'

// A Sajat rendszer parameterezese lapon a napelemrendszer tajolasi es kovetesi parametereinek beallitasat teszi lehetove.

interface OrientationSectionProps {
  params: SystemParams['orientation']
  onPatch: (patch: Partial<SystemParams['orientation']>) => void
}

export const OrientationSection = ({ params, onPatch }: OrientationSectionProps) => (
  <Accordion.Item value="orientation">
    <Accordion.ItemTrigger>
      <Heading size="md" flex="1" textAlign="left">Tájolás</Heading>
      <Accordion.ItemIndicator />
    </Accordion.ItemTrigger>
    <Accordion.ItemContent>
      <Accordion.ItemBody>
        <VStack align="stretch" gap={4}>
          <SelectField
            label="Rendszer típusa"
            info="Fix tájolású tartószerkezet, vagy napkövető rendszer (egy- vagy kéttengelyes)."
            value={params.trackingType}
            onChange={(v) => onPatch({ trackingType: v as TrackingType })}
            options={[
              { label: 'Fix tájolású', value: 'fixed' },
              { label: 'Egytengelyes követés', value: 'single_axis' },
              { label: 'Kéttengelyes követés', value: 'dual_axis' },
            ]}
          />

          {params.trackingType === 'fixed' && (
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <NumField
                label="Dőlésszög"
                info="A panel síkja és a vízszintes talaj bezárt szöge. Referenciaértékek: 0° = vízszintes, 90° = függőleges."
                value={params.surfaceTiltDeg}
                onChange={(v) => v !== null && onPatch({ surfaceTiltDeg: v })}
                min={0} max={90} step={1}
                helperText="fok (°)"
              />
              <NumField
                label="Tájolási szög (azimut)"
                info="A panel irányítási szöge. Referenciaértékek: 0° = észak, 90° = kelet, 180° = dél, 270° = nyugat."
                value={params.surfaceAzimuthDeg}
                onChange={(v) => v !== null && onPatch({ surfaceAzimuthDeg: v })}
                min={0} max={360} step={1}
                helperText="fok (°)"
              />
            </SimpleGrid>
          )}

          {params.trackingType === 'single_axis' && (
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              <NumField
                label="Tengely dőlésszöge"
                info="Az egytengelyes követő forgástengelyének dőlése a vízszintestől. Sík terepen jellemzően 0°."
                value={params.axisTiltDeg}
                onChange={(v) => v !== null && onPatch({ axisTiltDeg: v })}
                min={0} max={90} step={1}
                helperText="fok (°)"
              />
              <NumField
                label="Tengely azimutja"
                info="A forgástengely vízszintes vetületének iránya. Észak-dél tájolású tengelynél jellemzően 180°."
                value={params.axisAzimuthDeg}
                onChange={(v) => v !== null && onPatch({ axisAzimuthDeg: v })}
                min={0} max={360} step={1}
                helperText="fok (°)"
              />
              <NumField
                label="Maximális követési szög"
                info="Az a legnagyobb szög, amennyire a panel a tengelye körül elfordulhat napkeltétől napnyugtáig."
                value={params.maxTrackingAngleDeg}
                onChange={(v) => v !== null && onPatch({ maxTrackingAngleDeg: v })}
                min={0} max={90} step={1}
                helperText="fok (°)"
              />
            </SimpleGrid>
          )}

          {params.trackingType !== 'fixed' && (
            <NumField
              label="Sortávolság aránya (GCR)"
              info="A modulszélesség és a sorok közti távolság aránya."
              value={params.groundCoverageRatio}
              onChange={(v) => v !== null && onPatch({ groundCoverageRatio: v })}
              min={0.05} max={0.95} step={0.01}
              helperText="0.05 és 0.95 között"
            />
          )}
        </VStack>
      </Accordion.ItemBody>
    </Accordion.ItemContent>
  </Accordion.Item>
)
