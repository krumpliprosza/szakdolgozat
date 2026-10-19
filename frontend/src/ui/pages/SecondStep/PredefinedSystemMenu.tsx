import { Button, Heading, Text, Center, Stack } from '@chakra-ui/react'
import { OptionCard } from '../../../components/OptionCard'
import { predefinedSystems, type PredefinedSystem } from './PredefinedSystems'
import type { useSystemParametersForm } from '../../../hooks/useSystemParametersForm'

// Leiras: Elore meghatarozott rendszer valasztasahoz tartozo menu.

interface PredefinedSystemMenuProps {
  onBack: () => void
  onSelect: (id: string) => void
  selectedId: string | null
  form: ReturnType<typeof useSystemParametersForm>
}

export const PredefinedSystemMenu = ({ onBack, onSelect, selectedId, form }: PredefinedSystemMenuProps) => {
  const { patchOrientation, patchModule, patchInverter, patchLosses, patchAlbedo, patchBattery } = form

  // Az elore meghatarozott rendszer kivalasztasa eseten az osszes parametert bemasolja a varazslo adataihoz
  const selectSystem = (system: PredefinedSystem) => {
    patchOrientation(system.parameters.orientation)
    patchModule(system.parameters.module)
    patchInverter(system.parameters.inverter)
    patchLosses(system.parameters.losses)
    patchAlbedo(system.parameters.albedo)
    patchBattery(system.parameters.battery)
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
        <Stack justify="center" direction={{ base: "column", md: "row" }} gap="10" align="stretch" w="full" maxW="1800px">

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
