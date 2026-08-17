import { Box, Field, HStack, IconButton, Input, SimpleGrid, Text } from '@chakra-ui/react'
import { LuTrash2 } from 'react-icons/lu'
import { SwitchField, DateField } from '../../../components/FormFields'
import { getAllowedUsageDateRange } from '../../../components/DateRange'
import { isUsagePeriodDateRangeFilled, isUsagePeriodTimeRangeValid } from '../../../hooks/useConsumptionProfileForm'
import type { UsagePeriod } from '../../../steps/WizardDataContext'

// Leiras: Egy fogyasztasi tetelhez tartozo egy hasznalati idotartam szerkesztese.

interface UsagePeriodEditorProps {
  period: UsagePeriod
  onChange: (patch: Partial<UsagePeriod>) => void
  onRemove: () => void
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
              ></DateField>
            </HStack>
          )}
          {(!isUsagePeriodDateRangeFilled(period)) && (
            <Field.Root invalid mt={2}>
              <Field.ErrorText fontSize="sm" fontWeight={"bold"} color="red.muted">Ennél a felhasználási időtartamnál a kezdési dátum vagy a befejezési dátum üresen lett hagyva!</Field.ErrorText>
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
              <Field.ErrorText fontSize="sm" fontWeight={"bold"} color="red.muted">Ennél a felhasználási időtartamnál a kezdési időnek legalább 15 perccel korábbinak kell lennie, mint a befejezési időnek!</Field.ErrorText>
            </Field.Root>
          )}
        </Box>
      </SimpleGrid>
    </Box>
  )
}
