import { Button, Card, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { LuPlus, LuTrash2 } from 'react-icons/lu'
import { CounterField, NumField, TextField } from '../../../components/FormFields'
import { UsagePeriodEditor } from './UsagePeriodEditor'
import type { HouseholdItem, ConsumptionUsagePeriod } from '../../../steps/WizardDataContext'
import { MAX_USAGE_PERIODS } from '../../../hooks/useConsumptionProfileForm'

// Leiras: Egy fogyasztasi tetel kartyaja.

interface HouseholdItemCardProps {
  item: HouseholdItem
  nameInvalid: boolean
  onUpdate: (patch: Partial<Omit<HouseholdItem, 'id' | 'usagePeriods'>>) => void
  onRemove: () => void
  onAddUsagePeriod: () => void
  onUpdateUsagePeriod: (periodId: string, patch: Partial<ConsumptionUsagePeriod>) => void
  onRemoveUsagePeriod: (periodId: string) => void
}

export const HouseholdItemCard = ({
  item,
  nameInvalid,
  onUpdate,
  onRemove,
  onAddUsagePeriod,
  onUpdateUsagePeriod,
  onRemoveUsagePeriod,
}: HouseholdItemCardProps) => (
  <Card.Root borderColor="purple.border" borderWidth="2px">
    <Card.Body gap={4}>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <TextField
          label="Név"
          info="A fogyasztó elnevezése."
          value={item.name}
          onChange={(v) => onUpdate({ name: v })}
          placeholder="pl. Hűtőszekrény"
          invalid={nameInvalid}
          errorText="Ez a név már foglalt!"
        />
        <CounterField
          label="Darabszám"
          info="Az eszközök száma a háztartásban."
          value={item.count}
          onChange={(v) => onUpdate({ count: v })}
          min={1}
          max={50}
        />
        <NumField
          label="Fogyasztás"
          info="Egy darab eszköz üzemi teljesítményfelvétele."
          value={item.consumptionW}
          onChange={(v) => v !== null && onUpdate({ consumptionW: v })}
          min={0}
          step={25}
          helperText="watt (W)"
        />
      </SimpleGrid>

      <VStack align="stretch" gap={3}>
        <HStack justify="space-between">
          <Text fontWeight="medium">Használati időtartamok</Text>
          <Button size="sm" variant="outline" onClick={onAddUsagePeriod} disabled={item.usagePeriods.length >= MAX_USAGE_PERIODS}>
            <LuPlus /> Időtartam hozzáadása
          </Button>
        </HStack>

        {item.usagePeriods.length === 0 && (
          <Text fontSize="sm" color="fg.muted">Ehhez a tételhez még nincs megadva használati időtartam.</Text>
        )}

        {item.usagePeriods.map((period) => (
          <UsagePeriodEditor
            key={period.id}
            period={period}
            onChange={(patch) => onUpdateUsagePeriod(period.id, patch)}
            onRemove={() => onRemoveUsagePeriod(period.id)}
          />
        ))}
      </VStack>
    </Card.Body>
    <Card.Footer>
      <Button variant="outline" colorPalette="red" onClick={onRemove}>
        <LuTrash2 /> Fogyasztó törlése
      </Button>
    </Card.Footer>
  </Card.Root>
)
