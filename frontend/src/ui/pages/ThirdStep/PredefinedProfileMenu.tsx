import { Button, Heading, Text } from '@chakra-ui/react'

// Leiras: Elore meghatarozott fogyasztasi profil valasztasahoz tartozo menu.

interface PredefinedProfileMenuProps {
  onBack: () => void
}

export const PredefinedProfileMenu = ({ onBack }: PredefinedProfileMenuProps) => (
  <>
    <Button variant="outline" mb={4} onClick={onBack}>Vissza</Button>
    <Heading mb={4}>Előre meghatározott fogyasztási profil kiválasztása</Heading>
    <Text mb={4}>
      Válassz a meglévő fogyasztási profilok közül!
      {/* TODO: az elore beallitott fogyasztasi profilok listajanak megjelenitese */}
    </Text>
  </>
)
