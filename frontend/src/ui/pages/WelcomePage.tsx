import { Center, Heading, Text, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { usePageTitle } from '../../hooks/usePageTitle'
import { AnimatedPage } from '../../components/AnimatedPage'

// Leiras: A kezdolap: cim, leiras, gomb az elso lepeshez navigalashoz.

let isLoaded = false;

const PictureLoader = () => {
  if (!isLoaded) {
    const pictures = [
      { fileName: '/secondstep_1_dark.svg' },
      { fileName: '/secondstep_1_light.svg' },
      { fileName: '/secondstep_2_dark.svg' },
      { fileName: '/secondstep_2_light.svg' },
      { fileName: '/thirdstep_1_dark.svg' },
      { fileName: '/thirdstep_1_light.svg' },
      { fileName: '/thirdstep_2_dark.svg' },
      { fileName: '/thirdstep_2_light.svg' },
    ]
    pictures.forEach((picture) => {
      const img = new Image();
      img.src = picture.fileName;
    });
    isLoaded = true;
  }
  return null;
}

export const WelcomePage = () => {
  usePageTitle("Kezdőlap")
  const navigate = useNavigate()
  return (
    <Center h="100vh">
      <AnimatedPage textAlign="center">
        <Heading size="4xl" mb={4}>Napelemrendszer szimulátor</Heading>
        <Text fontSize="lg" color="fg.muted" mb={8}>
          Kattints a következő gombra, hogy a szimuláció paramétereit megadhasd!
        </Text>
        <Button colorPalette="purple" variant="outline" size="lg" onClick={() => navigate("/first-step")}>
          Új szimuláció készítése
        </Button>
        <PictureLoader />
      </AnimatedPage>
    </Center>
  )
}