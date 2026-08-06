import { Box } from '@chakra-ui/react'
import { ColorModeButton } from "./color-mode"

// Leiras: A vilagos/sotet tema valto gombot jeleniti meg fixen a jobb also sarokban.

export const ChangeColorModeButton = () => {
  return (
    <Box
      bg="bg"
      borderWidth="0px"
      borderColor="colorPalette.border"
      colorPalette="purple"
      borderRadius="md"
      p={1}
      position="fixed"
      bottom={2}
      right={{ base: 2, sm: 4 }}
      zIndex={1000}
    >
      <ColorModeButton />
    </Box>
  )
}