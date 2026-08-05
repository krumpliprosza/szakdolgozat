import { Button, Card, Image, Heading, Text, Stack, Center } from '@chakra-ui/react'
import { useState } from 'react'
import { usePageTitle } from '../../hooks/usePageTitle'
import { AnimatedPage } from '../../components/AnimatedPage'

// Leiras: Fogyasztasi profil megadasa (a felhasznalo valaszthat, hogy elore meghatarozott fogyasztasi profilt valaszt vagy az alapoktol allitja ossze).

type ThirdStepView = 'valasztosmenu' | 'eloremeghatarozottprofil' | 'sajatprofil'

// Kivalaszthato lehetosegek a harmadik lepesben: elore meghatarozott profil vagy sajat profil osszeallitasa
const ChoiceMenu = ({
  onSelectPredefined,
  onSelectCustom,
}: {
  onSelectPredefined: () => void
  onSelectCustom: () => void
}) => (
  <>
    <Heading mb={4}>Harmadik lépés</Heading>
    <Text mb={4}>Állítsd össze háztartásod fogyasztási profilját!</Text>

    <Center>
      <Stack direction={{ base: "column", md: "row" }} gap="10">

        <Card.Root overflow="hidden" pt={2}>
          <Image src="thirdstep_1.png" alt="Előre meghatározott fogyasztási profil kiválasztása"/>
          <Card.Body gap="2">
            <Card.Title>Előre meghatározott fogyasztási profil kiválasztása</Card.Title>
            <Card.Description>
              Itt a már előre elkészített felhasználási sablonok egyikének alkalmazására nyílik mód. Ez a funkció rendkívül praktikus, ha valaki elkerülné a háztartási berendezések egyenkénti számba vételét.
            </Card.Description>
          </Card.Body>
          <Card.Footer>
            <Button variant="outline" onClick={onSelectPredefined}>Kiválasztás</Button>
          </Card.Footer>
        </Card.Root>

        <Card.Root overflow="hidden" pt={2}>
          <Image src="thirdstep_2.png" alt="Saját fogyasztási profil összeállítása"/>
          <Card.Body gap="2">
            <Card.Title>Saját fogyasztási profil összeállítása</Card.Title>
            <Card.Description>
              Ezen a ponton az energiaigények modelljét lehet teljesen egyénileg, az alapoktól felépíteni. Ez egy hasznos funkció mindazoknak, akik a lehető legpontosabban akarják rögzíteni otthonuk áramfogyasztását.
            </Card.Description>
          </Card.Body>
          <Card.Footer>
            <Button variant="outline" onClick={onSelectCustom}>Kiválasztás</Button>
          </Card.Footer>
        </Card.Root>

      </Stack>
    </Center>
  </>
)

// Elore meghatarozott fogyasztasi profil valasztasahoz tartozo menu
const PredefinedProfileMenu = ({ onBack }: { onBack: () => void }) => (
  <>
    <Button variant="outline" mb={4} onClick={onBack}>Vissza</Button>
    <Heading mb={4}>Előre meghatározott fogyasztási profil kiválasztása</Heading>
    <Text mb={4}>
      Válassz a meglévő fogyasztási profilok közül!
      {/* TODO: az elore beallitott fogyasztasi profilok listajanak megjelenitese */}
    </Text>
  </>
)

// Sajat fogyasztasi profil osszeallitasahoz tartozo menu
const CustomProfileMenu = ({ onBack }: { onBack: () => void }) => (
  <>
    <Button variant="outline" mb={4} onClick={onBack}>Vissza</Button>
    <Heading mb={4}>Saját fogyasztási profil összeállítása</Heading>
    <Text mb={4}>
      Add meg háztartásod egyedi fogyasztási adatait!
      {/* TODO: a sajat fogyasztasi profilt megado urlap */}
    </Text>
  </>
)

// A harmadik lepesen beluli menupontok leptetese
export const ThirdStep = () => {
  usePageTitle("Fogyasztási profil megadása")

  const [view, setView] = useState<ThirdStepView>('valasztosmenu')

  return (
    <AnimatedPage key={view}>
      {view === 'valasztosmenu' && (
        <ChoiceMenu
          onSelectPredefined={() => setView('eloremeghatarozottprofil')}
          onSelectCustom={() => setView('sajatprofil')}
        />
      )}
      {view === 'eloremeghatarozottprofil' && (
        <PredefinedProfileMenu onBack={() => setView('valasztosmenu')} />
      )}
      {view === 'sajatprofil' && (
        <CustomProfileMenu onBack={() => setView('valasztosmenu')} />
      )}
    </AnimatedPage>
  )
}