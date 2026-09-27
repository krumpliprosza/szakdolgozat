import { Button, Card, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react'
import { LuPlus, LuTrash2 } from 'react-icons/lu'
import { CounterField, NumField, SelectField, TextField } from '../../../components/FormFields'
import { UsagePeriodEditor } from './UsagePeriodEditor'
import type { HouseholdItem, MeteringPoint, UsagePeriod } from '../../../steps/WizardDataContext'
import { MAX_USAGE_PERIODS } from '../../../hooks/useConsumptionProfileForm'

// Leiras: Egy fogyasztasi tetel kartyaja.

interface HouseholdItemCardProps {
  item: HouseholdItem
  meteringPoints: MeteringPoint[]
  onUpdate: (patch: Partial<Omit<HouseholdItem, 'id' | 'usagePeriods'>>) => void
  onRemove: () => void
  onAddUsagePeriod: () => void
  onUpdateUsagePeriod: (periodId: string, patch: Partial<UsagePeriod>) => void
  onRemoveUsagePeriod: (periodId: string) => void
}

export const HouseholdItemCard = ({
  item,
  meteringPoints,
  onUpdate,
  onRemove,
  onAddUsagePeriod,
  onUpdateUsagePeriod,
  onRemoveUsagePeriod,
}: HouseholdItemCardProps) => (
  <Card.Root borderColor="purple.border" borderWidth="2px">
    <Card.Body gap={4}>

      <TextField
        label="Név"
        info="A fogyasztó elnevezése."
        value={item.name}
        onChange={(value) => onUpdate({ name: value })}
        placeholder="pl. Hűtőszekrény"
        invalid={item.name === ''}
        errorText="Adj nevet ennek a fogyasztónak!"
      />

      {meteringPoints.length > 1 && (
        <SelectField
          label="Mérési pont"
          info="Az a mérőóra, amelyik köréhez kapcsolódik a fogyasztó."
          value={item.meteringPointId}
          onChange={(value) => onUpdate({ meteringPointId: value })}
          options={meteringPoints.map((point) => ({ label: point.label, value: point.id }))}
        />
      )}

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <CounterField
          label="Darabszám"
          info="Az eszközök száma a háztartásban."
          value={item.count}
          onChange={(value) => onUpdate({ count: value })}
          min={1}
          max={50}
        />
        <NumField
          label="Fogyasztás"
          info="Egy darab eszköz üzemi teljesítményfelvétele."
          value={item.consumption}
          onChange={(value) => value !== null && onUpdate({ consumption: value })}
          min={0}
          max={25000}
          step={25}
          helperText="watt (W)"
          invalid={item.consumption === 0}
          errorText="Ezen elemtípus fogyasztása csak pozitív szám lehet!"
        />
      </SimpleGrid>

      <NumField
        label="Aktív ciklusidő"
        info="Azt adja meg, hogy az eszköz használati időtartamán belül az idő hány százalékában üzemel ténylegesen az eszköz."
        value={item.dutyCycle ?? 1}
        onChange={(value) => onUpdate({ dutyCycle: value ?? undefined })}
        min={0.05}
        max={1}
        step={0.05}
        formatOptions={{ style: 'percent', maximumFractionDigits: 0 }}
        helperText="5% és 100% között"
      />

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
