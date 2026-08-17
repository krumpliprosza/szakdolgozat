import { Steps, Stack, Box, useStepsContext } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { StepsList } from '../steps/StepsList'
import { StepRouteSync } from '../steps/StepRouteSync'
import { PrevNextButtons } from '../steps/PrevNextButtons'
import { ChangeColorModeButton } from '../components/ChangeColorModeButton'
import { items } from '../steps/StepItems'
import { WizardDataProvider, useWizardData, type WizardData } from '../steps/WizardDataContext'

// Leiras: Az egesz varazslo vaza: osszefogja a StepsList, StepRouteSync, Outlet, PrevNextButtons, ChangeColorModeButton elemeket.

// A hibauzenet kijavitasa eseten automatikusan eltavolitja a hibat
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

// A lepes vegrehajtasat vegzi: ellenoriz es hibat kezel
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
      // Hibasan kitoltott lepes eseten hibauzenetet dob
      onStepInvalid={(details) => {
        const message = items[details.step]?.getErrorMessage(data)
        setError(message ?? `Ismeretlen hiba a(z) ${details.step + 1}. lépésnél!`)
      }}
    >
      <ErrorAutoClear error={error} setError={setError} data={data} />
      <StepsList />

      <Box p={{ base: 0, lg: 8 }} minH="100%">
        <StepRouteSync />
        <Outlet />
        {error && (
          <Box fontSize="sm" fontWeight={"bold"} color="red.muted" mt={3}>
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

// A varazslo adatait atadja a StepInner-nek
export const Step = () => (
  <Stack align="flex-start">
    <WizardDataProvider>
      <StepInner />
    </WizardDataProvider>
  </Stack>
)
