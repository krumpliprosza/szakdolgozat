import { Heading, Text } from '@chakra-ui/react'
import { usePageTitle } from '../../hooks/usePageTitle'
import { AnimatedPage } from '../../components/AnimatedPage'

// Leiras: Zaro oldal, ami jelzi, hogy a szimulacio indithato.

export const SetupComplete = () => {
  usePageTitle("Szimuláció indítása")
  return (
    <AnimatedPage>
      <Heading mb={4}>Szimuláció indítása</Heading>
      <Text mb={4}>Minden lépés sikeresen teljesítve, a szimuláció indításra kész!</Text>
    </AnimatedPage>
  )
}