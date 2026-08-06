import { useStepsContext, Box, ButtonGroup, Button, Steps } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { getPrevButtonLabel, getNextButtonLabel } from './StepItems'

// Leiras: Az elozo/kovetkezo gombokat jeleniti meg, a szelso eseteket (0. lepes elotti es 3. lepes utani) kulon kezelve.

export const PrevNextButtons = () => {
  const { value } = useStepsContext()
  const navigate = useNavigate()

  return (
    <Box
      bg="bg"
      borderRadius="md"
      p={1}
      bottom={2}
      left={{ base: 2, sm: 4 }}
      position="fixed"
      zIndex="1000"
    >
      <ButtonGroup size="sm" variant="outline">
        {value === 0 ? (
          <Button onClick={() => navigate("/")}>{getPrevButtonLabel(value)}</Button>
        ) : (
          <Steps.PrevTrigger asChild>
            <Button>{getPrevButtonLabel(value)}</Button>
          </Steps.PrevTrigger>
        )}

        {value !== 3 ? (
          <Steps.NextTrigger asChild>
            <Button>{getNextButtonLabel(value)}</Button>
          </Steps.NextTrigger>
        ) : (
          <Button onClick={() => navigate("/")}>{getNextButtonLabel(value)}</Button>
        )}
      </ButtonGroup>
    </Box>
  )
}