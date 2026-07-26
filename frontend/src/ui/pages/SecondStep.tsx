import { Heading, Text } from '@chakra-ui/react'
import { usePageTitle } from '../../hooks/usePageTitle'
import { AnimatedPage } from '../../components/AnimatedPage'

// Leiras: Napelemrendszer parameterezese.

export const SecondStep = () => {
  usePageTitle("Napelemrendszer paraméterezése")
  return (
    <AnimatedPage>
      <Heading mb={4}>Második lépés</Heading>
      <Text>Állítsd be a kívánt rendszer paramétereit!</Text>

      
    </AnimatedPage>
  )
}