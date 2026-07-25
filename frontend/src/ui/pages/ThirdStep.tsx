import { Heading, Text } from '@chakra-ui/react'
import { usePageTitle } from '../../hooks/usePageTitle'
import { AnimatedPage } from '../../components/AnimatedPage'

// Leiras: Fogyasztasi profil megadasa.

export const ThirdStep = () => {
  usePageTitle("Fogyasztási profil megadása")
  return (
    <AnimatedPage>
      <Heading mb={4}>Harmadik lépés</Heading>
      <Text>Állítsd össze háztartásod fogyasztási profilját!</Text>
    </AnimatedPage>
  )
}