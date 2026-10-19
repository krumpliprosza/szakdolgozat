import { Button, Heading, Text, Center, Stack } from '@chakra-ui/react'
import { OptionCard } from '../../../components/OptionCard'
import { mainMeteringPointId } from '../../../steps/WizardDataContext'
import { predefinedProfiles, type PredefinedProfile } from './PredefinedProfiles'
import type { useConsumptionProfileForm } from '../../../hooks/useConsumptionProfileForm'

// Leiras: Elore meghatarozott fogyasztasi profil valasztasahoz tartozo menu.

interface PredefinedProfileMenuProps {
  onBack: () => void
  onSelect: (id: string) => void
  selectedId: string | null
  form: ReturnType<typeof useConsumptionProfileForm>
}

export const PredefinedProfileMenu = ({ onBack, onSelect, selectedId, form }: PredefinedProfileMenuProps) => {
  const { loadItems } = form

  const selectProfile = (profile: PredefinedProfile) => {
    loadItems(profile.items, mainMeteringPointId)
    onSelect(profile.id)
    onBack()
  }

  return (
    <>
      <Button variant="outline" mb={4} onClick={onBack}>Vissza</Button>
      <Heading mb={4}>Előre meghatározott rendszer kiválasztása</Heading>
      <Text mb={4} color="fg.muted">
        Válassz a meglévő fogyasztási profilok közül! A kiválasztott profil paraméterei automatikusan
        kitöltésre kerülnek, ezeket a "Saját fogyasztási profil összeállítása" nézetben bármikor módosíthatod.
      </Text>

      <Center>
        <Stack justify="center" direction={{ base: "column", md: "row" }} gap="10" align="stretch" w="full" maxW="1800px">

          {predefinedProfiles.map((profile) => {
            const isSelected = selectedId === profile.id
            return (
              <OptionCard
                key={profile.id}
                title={profile.title}
                description={profile.description}
                selected={isSelected}
                alwaysPurpleButton
                buttonLabel={isSelected ? "Kiválasztva" : "Kiválasztás"}
                onSelect={() => selectProfile(profile)}
              />
            )
          })}

        </Stack>
      </Center>

    </>
  )
}
