import { Box } from '@chakra-ui/react'
import { Step } from '../../components/Step'

// Leiras: A varazslo alapvazat adja, es beleteszi a Step komponenst. Ebben helyezkednek el a FirstStep, SecondStep, ThirdStep es SetupComplete oldalak.

export const WizardLayout = () => {
  return (
    <Box
      p={4}
      h="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Step />
    </Box>
  )
}