import { Steps, useSteps, Stack, Box } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { StepsList } from '../assets/StepsList'
import { StepRouteSync } from '../assets/StepRouteSync'
import { PrevNextButtons } from '../assets/PrevNextButtons'
import { ChangeColorModeButton } from '../components/ChangeColorModeButton'
import { items } from '../assets/StepItems'

// Leiras: Az egesz varazslo vaza: osszefogja a StepsList, StepRouteSync, Outlet, PrevNextButtons, ChangeColorModeButton elemeket.

export const Step = () => {
  const steps = useSteps({
    defaultStep: 0,
    count: items.length,
  })

  return (
    <Stack align="flex-start">
      <Steps.RootProvider value={steps} size="lg" colorPalette="purple">
        <StepsList />

        <Box p={{ base: 0, lg: 8 }} minH="100%">
          <StepRouteSync />
          <Outlet /> {/* Kimenet */}
        </Box>

        <Box>
          <PrevNextButtons />
          <ChangeColorModeButton />
        </Box>
      </Steps.RootProvider>
    </Stack>
  )
}