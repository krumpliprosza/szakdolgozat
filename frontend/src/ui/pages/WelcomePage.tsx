import { Center, Heading, Text, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { usePageTitle } from '../../hooks/usePageTitle'
import { AnimatedPage } from '../../components/AnimatedPage'

// Leiras: A kezdolap: cim, leiras, gomb az elso lepesre navigalashoz.

// A varazslo kesobbi lepeseiben szukseges kepeket tolti be a hatterben
const preloadWizardImages = () => {
  const fileNames = [
    '/secondstep_1_dark.svg',
    '/secondstep_1_light.svg',
    '/secondstep_2_dark.svg',
    '/secondstep_2_light.svg',
    '/thirdstep_1_dark.svg',
    '/thirdstep_1_light.svg',
    '/thirdstep_2_dark.svg',
    '/thirdstep_2_light.svg',
  ]
  fileNames.forEach((fileName) => {
    const img = new Image()
    img.src = fileName
  })
}

export const WelcomePage = () => {
  usePageTitle("Kezdőlap")
  const navigate = useNavigate()

  // A kezdolap inditasakor kezdodik el a kepek elozetes betoltese
  useEffect(() => {
    preloadWizardImages()
  }, [])

  return (
    <Center h="100vh">
      <AnimatedPage textAlign="center">
        <Heading size="4xl" m={2} mb={2}>Napelemrendszer szimulátor</Heading>
        <Text fontSize="lg" color="fg.muted" m={2} mb={6}>
          Kattints a következő gombra, hogy a szimuláció paramétereit megadhasd!
        </Text>
        <Button colorPalette="purple" variant="outline" size="lg" onClick={() => navigate("/first-step")} m={2}>
          Új szimuláció készítése
        </Button>
      </AnimatedPage>
    </Center>
  )
}
