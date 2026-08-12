import { Button, Heading, Text, VStack } from '@chakra-ui/react'
import { LuPlus } from 'react-icons/lu'
import { HouseholdItemCard } from './HouseholdItemCard'
import type { useConsumptionProfileForm } from '../../../hooks/useConsumptionProfileForm'

// Leiras: Sajat fogyasztasi profil osszeallitasahoz tartozo menu.

interface CustomProfileMenuProps {
  onBack: () => void
  form: ReturnType<typeof useConsumptionProfileForm>
}

export const CustomProfileMenu = ({ onBack, form }: CustomProfileMenuProps) => {
  const {
    items,
    addItem,
    updateItem,
    removeItem,
    addUsagePeriod,
    updateUsagePeriod,
    removeUsagePeriod,
    isNameTaken,
  } = form

  return (
    <>
      <Button variant="outline" mb={4} onClick={onBack}>Vissza</Button>
      <Heading mb={2}>Saját fogyasztási profil összeállítása</Heading>
      <Text mb={6} color="fg.muted">
        Add hozzá háztartásod fogyasztóit típusonként!
      </Text>

      <Button variant="outline" mb={6} onClick={addItem} alignSelf="flex-start">
        <LuPlus /> Új fogyasztó hozzáadása
      </Button>

      {items.length === 0 ? (
        <Text color="fg.muted">Még nincs hozzáadva egyetlen fogyasztó sem.</Text>
      ) : (
        <VStack align="stretch" gap={4}>
          {items.map((item) => (
            <HouseholdItemCard
              key={item.id}
              item={item}
              nameInvalid={isNameTaken(item.id, item.name)}
              onUpdate={(patch) => updateItem(item.id, patch)}
              onRemove={() => removeItem(item.id)}
              onAddUsagePeriod={() => addUsagePeriod(item.id)}
              onUpdateUsagePeriod={(periodId, patch) => updateUsagePeriod(item.id, periodId, patch)}
              onRemoveUsagePeriod={(periodId) => removeUsagePeriod(item.id, periodId)}
            />
          ))}
        </VStack>
      )}
    </>
  )
}
