import { Button, Heading, Text, Center, Stack } from '@chakra-ui/react'
import { OptionCard } from '../../../components/OptionCard'
import { predefinedSystems, type PredefinedSystem } from './PredefinedSystems'
import type { useSystemParamsForm } from '../../../hooks/useSystemParamsForm'

// Leiras: Elore meghatarozott rendszer valasztasahoz tartozo menu.

interface PredefinedSystemMenuProps {
  onBack: () => void
  onSelect: (id: string) => void
  selectedId: string | null
  form: ReturnType<typeof useSystemParamsForm>
}

export const PredefinedSystemMenu = ({ onBack, onSelect, selectedId, form }: PredefinedSystemMenuProps) => {
  const { patchOrientation, patchModule, patchInverter, patchLosses, patchAlbedo, patchBattery } = form

  // Az elore meghatarozott rendszer kivalasztasa eseten az osszes parametert bemasolja a varazslo adataihoz
  const selectSystem = (system: PredefinedSystem) => {
    patchOrientation(system.params.orientation)
    patchModule(system.params.module)
    patchInverter(system.params.inverter)
    patchLosses(system.params.losses)
    patchAlbedo(system.params.albedo)
    patchBattery(system.params.battery)
    onSelect(system.id)
    onBack()
  }

  return (
    <>
      <Button variant="outline" mb={4} onClick={onBack}>Vissza</Button>
      <Heading mb={4}>Előre meghatározott rendszer kiválasztása</Heading>
      <Text mb={4} color="fg.muted">
        Válassz a meglévő napelemrendszerek közül! A kiválasztott rendszer paraméterei automatikusan
        kitöltésre kerülnek, ezeket a "Saját rendszer paraméterezése" nézetben bármikor módosíthatod.
      </Text>

      <Center>
        <Stack direction={{ base: "column", md: "row" }} gap="10" align="stretch" w="full" maxW="1800px">

          {predefinedSystems.map((system) => {
            const isSelected = selectedId === system.id
            return (
              <OptionCard
                key={system.id}
                title={system.title}
                description={system.description}
                selected={isSelected}
                alwaysPurpleButton
                buttonLabel={isSelected ? "Kiválasztva" : "Kiválasztás"}
                onSelect={() => selectSystem(system)}
              />
            )
          })}

        </Stack>
      </Center>

    </>
  )
}
