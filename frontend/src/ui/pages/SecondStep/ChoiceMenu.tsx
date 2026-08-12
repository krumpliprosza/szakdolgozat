import { Heading, Text, Center, Stack } from '@chakra-ui/react'
import { OptionCard } from '../../../components/OptionCard'
import type { SystemParamsMode } from '../../../steps/WizardDataContext'

// Leiras: A masodik lepes elso nezete: kivalaszthato az elore meghatarozott rendszer vagy a sajat rendszer parameterezese.

interface ChoiceMenuProps {
  onSelectPredefined: () => void
  onSelectCustom: () => void
  selectedMode: SystemParamsMode
}

export const ChoiceMenu = ({ onSelectPredefined, onSelectCustom, selectedMode }: ChoiceMenuProps) => (
  <>
    <Heading mb={4}>Második lépés</Heading>
    <Text mb={4}>Állítsd be a kívánt napelemrendszer paramétereit!</Text>
    <Center>
      <Stack direction={{ base: "column", md: "row" }} gap="10" align="stretch" w="full" maxW="1800px">

        <OptionCard
          image={{
            light: '/secondstep_1_light.svg',
            dark: '/secondstep_1_dark.svg',
            ariaLabel: 'Saját fogyasztási profil összeállítása',
          }}
          title="Előre meghatározott rendszer kiválasztása"
          description="Ennél a lehetőségnél kész, előre beállított napelemrendszerek állnak rendelkezésre. Ez a megoldás ideális azoknak, akik gyorsan, a technikai részletek aprólékos megadása nélkül szeretnének haladni."
          selected={selectedMode === 'predefined'}
          buttonLabel={selectedMode === 'predefined' ? "Módosítás" : "Kiválasztás"}
          onSelect={onSelectPredefined}
        />

        <OptionCard
          image={{
            light: '/secondstep_2_light.svg',
            dark: '/secondstep_2_dark.svg',
            ariaLabel: 'Saját fogyasztási profil összeállítása',
          }}
          title="Saját rendszer paraméterezése"
          description="Ez az alternatíva lehetőséget ad egy teljesen egyedi specifikációkkal rendelkező rendszer beállítására. Ez azok számára hasznos, akik a maximális pontosság érdekében maguk szabályoznák a modellt."
          selected={selectedMode === 'custom'}
          buttonLabel={selectedMode === 'custom' ? "Módosítás" : "Kiválasztás"}
          onSelect={onSelectCustom}
        />

      </Stack>
    </Center>
  </>
)
