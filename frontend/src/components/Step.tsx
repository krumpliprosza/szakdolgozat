import { Steps, Stack, Box, useStepsContext } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { StepsList } from '../assets/StepsList'
import { StepRouteSync } from '../assets/StepRouteSync'
import { PrevNextButtons } from '../assets/PrevNextButtons'
import { ChangeColorModeButton } from '../components/ChangeColorModeButton'
import { items } from '../assets/StepItems'
import { WizardDataProvider, useWizardData, type WizardData } from '../assets/WizardDataContext'

// Leiras: Az egesz varazslo vaza: osszefogja a StepsList, StepRouteSync, Outlet, PrevNextButtons, ChangeColorModeButton elemeket.

const ErrorAutoClear = ({
  error,
  setError,
  data,
}: {
  error: string | null
  setError: (error: string | null) => void
  data: WizardData
}) => {
  const { value } = useStepsContext()

  useEffect(() => {
    if (error && items[value]?.getErrorMessage(data) == null) {
      setError(null)
    }
  }, [data, value, error, setError])

  return null
}

const StepInner = () => {
  const { data } = useWizardData()
  const [error, setError] = useState<string | null>(null)

  return (
    <Steps.Root
      size="lg"
      colorPalette="purple"
      count={items.length}
      linear
      isStepValid={(index) => items[index]?.getErrorMessage(data) == null}
      onStepChange={() => setError(null)}
      onStepInvalid={(details) => {
        const message = items[details.step]?.getErrorMessage(data)
        setError(message ?? `A(z) ${details.step + 1}. lépés nincs kitöltve.`)
      }}
    >
      <ErrorAutoClear error={error} setError={setError} data={data} />
      <StepsList />

      <Box p={{ base: 0, lg: 8 }} minH="100%">
        <StepRouteSync />
        <Outlet />
        {error && (
          <Box color="red.fg" textStyle="sm" mt={3}>
            {error}
          </Box>
        )}
      </Box>

      <Box>
        <PrevNextButtons />
        <ChangeColorModeButton />
      </Box>
    </Steps.Root>
  )
}

export const Step = () => (
  <Stack align="flex-start">
    <WizardDataProvider>
      <StepInner />
    </WizardDataProvider>
  </Stack>
)
