import { Heading, Text, Stack, Center } from '@chakra-ui/react'
import { OptionCard } from '../../../components/OptionCard'
import type { ConsumptionProfileMode } from '../../../steps/WizardDataContext'

// Leiras: Fogyasztasi profil megadasa (a felhasznalo valaszthat, hogy elore meghatarozott fogyasztasi profilt valaszt vagy azt az alapoktol allitja ossze).

export interface ChoiceMenuProps {
  onSelectPredefined: () => void
  onSelectCustom: () => void
  selectedMode: ConsumptionProfileMode
}

export const ChoiceMenu = ({
  onSelectPredefined,
  onSelectCustom,
}: {
  onSelectPredefined: () => void
  onSelectCustom: () => void
  selectedMode: ConsumptionProfileMode
}) => (
  <>
    <Heading mb={4}>Harmadik lépés</Heading>
    <Text mb={4}>Állítsd össze háztartásod fogyasztási profilját!</Text>

    <Center>
      <Stack direction={{ base: "column", md: "row" }} gap="10" align="stretch" w="full" maxW="1800px">

        <OptionCard
          flex="1"
          image={{
            light: '/thirdstep_1_light.svg',
            dark: '/thirdstep_1_dark.svg',
            ariaLabel: 'Saját fogyasztási profil összeállítása',
          }}
          title="Előre meghatározott fogyasztási profil kiválasztása"
          description="Itt a már előre elkészített felhasználási sablonok egyikének alkalmazására nyílik mód. Ez a funkció rendkívül praktikus, ha valaki elkerülné a háztartási berendezések egyenkénti számba vételét."
          buttonLabel="Kiválasztás"
          onSelect={onSelectPredefined}
        />

        <OptionCard
          flex="1"
          image={{
            light: '/thirdstep_2_light.svg',
            dark: '/thirdstep_2_dark.svg',
            ariaLabel: 'Saját fogyasztási profil összeállítása',
          }}
          title="Saját fogyasztási profil összeállítása"
          description="Ezen a ponton az energiaigények modelljét lehet teljesen egyénileg, az alapoktól felépíteni. Ez egy hasznos funkció mindazoknak, akik a lehető legpontosabban akarják rögzíteni otthonuk áramfogyasztását."
          buttonLabel="Kiválasztás"
          onSelect={onSelectCustom}
        />

      </Stack>
    </Center>
  </>
)