import { Center, Heading, Text, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { usePageTitle } from '../../hooks/usePageTitle'
import { AnimatedPage } from '../../components/AnimatedPage'

// Leiras: A kezdolap: cim, leiras, gomb az elso lepeshez navigalashoz.

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
      </AnimatedPage>
    </Center>
  )
}