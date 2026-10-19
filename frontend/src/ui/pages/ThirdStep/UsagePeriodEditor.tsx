import { Box, Field, HStack, IconButton, Input, SimpleGrid, Text } from '@chakra-ui/react'
import { LuTrash2 } from 'react-icons/lu'
import { SwitchField, DateField, SelectField, NumField } from '../../../components/FormFields'
import { getAllowedUsageDateRange } from '../../../components/DateRange'
import { isUsagePeriodDateRangeFilled, isUsagePeriodTimeRangeValid } from '../../../hooks/useConsumptionProfileForm'
import type { TemperatureCondition, IsDayOrNightCondition, UsageCondition, UsagePeriod } from '../../../steps/WizardDataContext'

// Leiras: Egy fogyasztasi tetelhez tartozo egy hasznalati idotartam szerkesztese.

interface UsagePeriodEditorProps {
  period: UsagePeriod
  onChange: (patch: Partial<UsagePeriod>) => void
  onRemove: () => void
}

// A feltetelek beallitasai a kulonbozo felteteltipusokhoz
const conditionTypes: { value: UsageCondition['type']; label: string }[] = [
  { value: 'temperature', label: 'Hőmérséklet' },
  { value: 'isdayornight', label: 'Napszak' },
]

const conditionSettings: Record<UsageCondition['type'], { comparator: { value: string; label: string }[]; min: number; max: number; unit: string; default: () => UsageCondition }> = {
  temperature: {
    comparator: [
      { value: '>', label: 'Nagyobb, mint (>)' },
      { value: '>=', label: 'Nagyobb vagy egyenlő, mint (≥)' },
      { value: '<', label: 'Kisebb, mint (<)' },
      { value: '<=', label: 'Kisebb vagy egyenlő, mint (≤)' },
    ],
    min: -30,
    max: 50,
    unit: '°C',
    default: () => ({
      type: 'temperature',
      comparator: '>=',
      threshold: 20,
    }),
  },
  isdayornight: {
    comparator: [
      { value: 'isday', label: 'Nappal' },
      { value: 'isnight', label: 'Éjszaka' },
    ],
    min: 0,
    max: 0,
    unit: '',
    default: () => ({
      type: 'isdayornight',
      comparator: 'isday',
      threshold: 0,
    }),
  },
}

const createDefaultCondition = (): UsageCondition => {
  return conditionSettings.temperature.default()
}

export const UsagePeriodEditor = ({ period, onChange, onRemove }: UsagePeriodEditorProps) => {
  // Engedelyezett befejezesi es kezdesi datumok
  const { minDate, maxDate } = getAllowedUsageDateRange()

  return (
    <Box borderWidth="1px" borderColor="border" borderRadius="md" p={3} position="relative">
      <HStack justify="space-between" mb={2}>
        <Text fontWeight="medium">Működési idő:</Text>
        <IconButton variant="outline" size="sm" aria-label="Időtartam törlése" onClick={onRemove}>
          <LuTrash2 />
        </IconButton>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <Box>
          <SwitchField
            label="Egész évben"
            info="Ha be van kapcsolva, a fogyasztó az év minden napján üzemel."
            checked={period.wholeYear}
            onChange={(checked) => onChange({ wholeYear: checked })}
          />
          {!period.wholeYear && (
            <HStack mt={2} gap={2} align="flex-start">
              <DateField 
                label="Dátum kiválasztása" 
                minimum={minDate} 
                maximum={maxDate} 
                startDate={period.startDate} 
                endDate={period.endDate}
                onChange={({startDate, endDate}) => onChange({startDate, endDate})}
                invalid={!isUsagePeriodDateRangeFilled(period)}
              ></DateField>
            </HStack>
          )}
          {(!isUsagePeriodDateRangeFilled(period)) && (
            <Field.Root invalid mt={2}>
              <Field.ErrorText fontSize="sm" fontWeight="bold" color="red.muted">Ennél a felhasználási időtartamnál a kezdési dátum vagy a befejezési dátum üresen lett hagyva!</Field.ErrorText>
            </Field.Root>
          )}
        </Box>
        <Box>
          <SwitchField
            label="Egész nap"
            info="Ha be van kapcsolva, a fogyasztó a nap minden percében üzemel."
            checked={period.wholeDay}
            onChange={(checked) => onChange({ wholeDay: checked })}
          />
          {!period.wholeDay && (
            <HStack mt={2} gap={2} align="flex-end">
              <Field.Root invalid={ !isUsagePeriodTimeRangeValid(period) }>
                <Field.Label>Ettől</Field.Label>
                <Input
                  type="time"
                  value={period.startTime}
                  onChange={(e) => e.target.value && onChange({ startTime: e.target.value })}
                  borderColor={!isUsagePeriodTimeRangeValid(period) ? 'red.muted' : undefined}
                  css={{
                    '&::-webkit-calendar-picker-indicator': {
                      display: 'none',
                    },
                  }}
                />
              </Field.Root>
              <Field.Root invalid={ !isUsagePeriodTimeRangeValid(period) }>
                <Field.Label>Eddig</Field.Label>
                <Input
                  type="time"
                  value={period.endTime}
                  onChange={(e) => e.target.value && onChange({ endTime: e.target.value })}
                  borderColor={!isUsagePeriodTimeRangeValid(period) ? 'red.muted' : undefined}
                  css={{
                    '&::-webkit-calendar-picker-indicator': {
                      display: 'none',
                    },
                  }}
                />
              </Field.Root>
            </HStack>
          )}
          {(!isUsagePeriodTimeRangeValid(period)) && (
            <Field.Root invalid mt={2}>
              <Field.ErrorText fontSize="sm" fontWeight="bold" color="red.muted">Ennél a felhasználási időtartamnál a kezdési időnek legalább 15 perccel korábbinak kell lennie, mint a befejezési időnek!</Field.ErrorText>
            </Field.Root>
          )}
        </Box>
      </SimpleGrid>

      <Box mt={4} pt={4} borderTopWidth="1px" borderColor="border">
        <SwitchField
          label="Feltételhez kötött üzemelés"
          info="Ha be van kapcsolva, a fogyasztó csak akkor üzemel ebben az időtartamban, ha a megadott feltétel is teljesül."
          checked={!!period.condition}
          onChange={(checked) => onChange({ condition: checked ? createDefaultCondition() : undefined })}
        />
        {period.condition && (() => {
          const settings = conditionSettings[period.condition.type]
          return (
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mt={2}>
              <SelectField
                label="Feltétel alapja"
                info="Azt adja meg, hogy milyen mennyiséghez legyen kötve a fogyasztó üzemelése."
                value={period.condition.type}
                onChange={(value) => onChange({ condition: conditionSettings[value as UsageCondition['type']].default() })}
                options={conditionTypes}
              />
              {period.condition.type === 'temperature' && (
                <>
                  <SelectField
                    label="Reláció"
                    info="A feltétel iránya, amihez a küszöbérték tartozik."
                    value={period.condition.comparator}
                    onChange={(value) => onChange({ condition: { ...(period.condition as TemperatureCondition), comparator: value as TemperatureCondition['comparator'] } })}
                    options={settings.comparator}
                  />
                  <NumField
                    label="Küszöbérték"
                    info="Az a hőmérsékletérték, amelyhez viszonyítva értelmezendő a feltétel."
                    value={period.condition.threshold}
                    onChange={(value) => value !== null && onChange({ condition: { ...(period.condition as TemperatureCondition), threshold: value } })}
                    min={settings.min} max={settings.max} step={1}
                    helperText={settings.unit}
                  />
                </>
              )
              }
              {period.condition.type === 'isdayornight' && (
                <>
                  <SelectField
                    label="Érték"
                    info="A napszak, amelyben a fogyasztó üzemel."
                    value={period.condition.comparator}
                    onChange={(value) => onChange({ condition: { ...(period.condition as IsDayOrNightCondition), comparator: value as IsDayOrNightCondition['comparator'] } })}
                    options={settings.comparator}
                  />
                </>
              )
              }
            </SimpleGrid>
          )
        })()}
      </Box>
    </Box>
  )
}
