import { Button, Card, Image, Heading, Text, Stack, Center } from '@chakra-ui/react'
import { useState } from 'react'
import { usePageTitle } from '../../hooks/usePageTitle'
import { AnimatedPage } from '../../components/AnimatedPage'

// Leiras: Napelemrendszer parameterezese (a felhasznalo valaszthat, hogy elore meghatarozott rendszert valaszt vagy sajat rendszert parameterez).

type SecondStepView = 'valasztosmenu' | 'eloremeghatarozottrendszer' | 'sajatrendszer'

// Kivalaszthato lehetosegek a masodik lepesben: elore meghatarozott rendszer vagy sajat rendszer parameterezese
const ChoiceMenu = ({
  onSelectPredefined,
  onSelectCustom,
}: {
  onSelectPredefined: () => void
  onSelectCustom: () => void
}) => (
  <>
    <Heading mb={4}>Második lépés</Heading>
    <Text mb={4}>Állítsd be a kívánt napelemrendszer paramétereit!</Text>

    <Center>
      <Stack direction={{ base: "column", md: "row" }} gap="10">

        <Card.Root overflow="hidden" pt={2}>
          <Image src="secondstep_1.png" alt="Előre meghatározott rendszer kiválasztása"/>
          <Card.Body gap="2">
            <Card.Title>Előre meghatározott rendszer kiválasztása</Card.Title>
            <Card.Description>
              Ennél a lehetőségnél kész, előre beállított napelemrendszerek állnak rendelkezésre. Ez a megoldás ideális azoknak, akik gyorsan, a technikai részletek aprólékos megadása nélkül szeretnének haladni.
            </Card.Description>
          </Card.Body>
          <Card.Footer>
            <Button variant="outline" onClick={onSelectPredefined}>Kiválasztás</Button>
          </Card.Footer>
        </Card.Root>

        <Card.Root overflow="hidden" pt={2}>
          <Image src="secondstep_2.png" alt="Saját rendszer paraméterezése"/>
          <Card.Body gap="2">
            <Card.Title>Saját rendszer paraméterezése</Card.Title>
            <Card.Description>
              Ez az alternatíva lehetőséget ad egy teljesen egyedi specifikációkkal rendelkező rendszer beállítására. Ez azok számára hasznos, akik a maximális pontosság érdekében maguk szabályoznák a modellt.
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

// Elore meghatarozott rendszer valasztasahoz tartozo menu
const PredefinedSystemMenu = ({ onBack }: { onBack: () => void }) => (
  <>
    <Button variant="outline" mb={4} onClick={onBack}>Vissza</Button>
    <Heading mb={4}>Előre meghatározott rendszer kiválasztása</Heading>
    <Text mb={4}>
      Válassz a meglévő napelemrendszerek közül!
      {/* TODO: az elore beallitott napelemrendszerek listajanak megjelenitese */}
    </Text>
  </>
)

// Sajat rendszer parameterezesehez tartozo menu
const CustomSystemMenu = ({ onBack }: { onBack: () => void }) => (
  <>
    <Button variant="outline" mb={4} onClick={onBack}>Vissza</Button>
    <Heading mb={4}>Saját rendszer paraméterezése</Heading>
    <Text mb={4}>
      Add meg a napelemrendszer egyedi paramétereit!
      {/* TODO: a sajat rendszer parametereit megado urlap */}
    </Text>
  </>
)

// A masodik lepesen beluli menupontok leptetese
export const SecondStep = () => {
  usePageTitle("Napelemrendszer paraméterezése")

  const [view, setView] = useState<SecondStepView>('valasztosmenu')

  return (
    <AnimatedPage key={view}>
      {view === 'valasztosmenu' && (
        <ChoiceMenu
          onSelectPredefined={() => setView('eloremeghatarozottrendszer')}
          onSelectCustom={() => setView('sajatrendszer')}
        />
      )}
      {view === 'eloremeghatarozottrendszer' && (
        <PredefinedSystemMenu onBack={() => setView('valasztosmenu')} />
      )}
      {view === 'sajatrendszer' && (
        <CustomSystemMenu onBack={() => setView('valasztosmenu')} />
      )}
    </AnimatedPage>
  )
}