import { Button, Heading, Text, SimpleGrid } from '@chakra-ui/react'
import { LuPlus } from 'react-icons/lu'
import { HouseholdItemCard } from './HouseholdItemCard'
import type { useConsumptionProfileForm } from '../../../hooks/useConsumptionProfileForm'
import type { ConsumptionProfileMode, HouseholdItem, UsagePeriod } from '../../../steps/WizardDataContext'

// Leiras: Sajat fogyasztasi profil osszeallitasahoz tartozo menu.

interface CustomProfileMenuProps {
  onBack: () => void
  onChange: () => void
  currentMode: ConsumptionProfileMode
  form: ReturnType<typeof useConsumptionProfileForm>
}

export const CustomProfileMenu = ({ onBack, onChange, form }: CustomProfileMenuProps) => {
  const {
    items,
    addItem: addItemRaw,
    updateItem: updateItemRaw,
    removeItem: removeItemRaw,
    addUsagePeriod: addUsagePeriodRaw,
    updateUsagePeriod: updateUsagePeriodRaw,
    removeUsagePeriod: removeUsagePeriodRaw,
  } = form

  // Minden modositas eseten jelezzuk a szulo elemnek, hogy a Sajat profil osszeallitasa legyen kivalasztva
  const addItem = () => { onChange(); addItemRaw() }
  const updateItem = (id: string, patch: Partial<Omit<HouseholdItem, 'id' | 'usagePeriods'>>) => { onChange(); updateItemRaw(id, patch) }
  const removeItem = (id: string) => { onChange(); removeItemRaw(id) }
  const addUsagePeriod = (itemId: string) => { onChange(); addUsagePeriodRaw(itemId) }
  const updateUsagePeriod = (itemId: string, periodId: string, patch: Partial<UsagePeriod>) => { onChange(); updateUsagePeriodRaw(itemId, periodId, patch) }
  const removeUsagePeriod = (itemId: string, periodId: string) => { onChange(); removeUsagePeriodRaw(itemId, periodId) }

  return (
    <>
      <Button variant="outline" mb={4} onClick={onBack}>Vissza</Button>
      <Heading mb={4}>Saját fogyasztási profil összeállítása</Heading>
      <Text mb={4} color="fg.muted">
        Add hozzá háztartásod fogyasztóit típusonként!
      </Text>

      <Button variant="outline" mb={4} onClick={addItem} alignSelf="flex-start">
        <LuPlus /> Új fogyasztó hozzáadása
      </Button>

      {items.length === 0 ? (
        <Text color="fg.muted">Még nincs hozzáadva egyetlen fogyasztó sem.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
          {items.map((item) => (
            <HouseholdItemCard
              key={item.id}
              item={item}
              onUpdate={(patch) => updateItem(item.id, patch)}
              onRemove={() => removeItem(item.id)}
              onAddUsagePeriod={() => addUsagePeriod(item.id)}
              onUpdateUsagePeriod={(periodId, patch) => updateUsagePeriod(item.id, periodId, patch)}
              onRemoveUsagePeriod={(periodId) => removeUsagePeriod(item.id, periodId)}
            />
          ))}
        </SimpleGrid>
      )}
    </>
  )
}
