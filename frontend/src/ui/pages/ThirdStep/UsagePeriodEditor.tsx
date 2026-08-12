import { Box, Field, HStack, IconButton, Input, SimpleGrid, Text } from '@chakra-ui/react'
import { LuTrash2 } from 'react-icons/lu'
import { SwitchField } from '../../../components/FormFields'
import { getAllowedUsageDateRange } from '../../../components/DateRange'
import type { ConsumptionUsagePeriod } from '../../../steps/WizardDataContext'

// Leiras: Egy fogyasztasi tetelhez tartozo egy hasznalati idotartam szerkesztese.

interface UsagePeriodEditorProps {
  period: ConsumptionUsagePeriod
  onChange: (patch: Partial<ConsumptionUsagePeriod>) => void
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
            <HStack mt={2} gap={2} align="flex-end">
              <Field.Root>
                <Field.Label>Ettől</Field.Label>
                <Input
                  type="date"
                  min={minDate}
                  max={maxDate}
                  value={period.startDate}
                  onChange={(e) => e.target.value && onChange({ startDate: e.target.value })}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Eddig</Field.Label>
                <Input
                  type="date"
                  min={minDate}
                  max={maxDate}
                  value={period.endDate}
                  onChange={(e) => e.target.value && onChange({ endDate: e.target.value })}
                />
              </Field.Root>
            </HStack>
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
              <Field.Root>
                <Field.Label>Ettől</Field.Label>
                <Input
                  type="time"
                  value={period.startTime}
                  onChange={(e) => e.target.value && onChange({ startTime: e.target.value })}
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Eddig</Field.Label>
                <Input
                  type="time"
                  value={period.endTime}
                  onChange={(e) => e.target.value && onChange({ endTime: e.target.value })}
                />
              </Field.Root>
            </HStack>
          )}
        </Box>
      </SimpleGrid>
    </Box>
  )
}
