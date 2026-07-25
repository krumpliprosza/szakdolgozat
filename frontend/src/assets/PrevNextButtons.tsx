import { useStepsContext, Box, ButtonGroup, Button, Steps } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { getPrevButtonLabel, getNextButtonLabel } from './StepItems'

// Leiras: Az elozo/kovetkezo gombokat jeleniti meg, a szelso eseteket (0. lepes elotti es 3. lepes utani) kulon kezelve.

export const PrevNextButtons = () => {
  const { value } = useStepsContext()
  const navigate = useNavigate()

  return (
    <ButtonGroup size="sm" variant="outline" bottom={2} left={{ base: 2, sm: 4 }} position="fixed" zIndex="1000">
      { /* Elozo lepes gombok */}
      {value === 0 ? (
        <Box bg="bg.panel">
          <Button onClick={() => navigate("/")}>{getPrevButtonLabel(value)}</Button>
        </Box>
      ) : (
        <Steps.PrevTrigger asChild>
          <Box bg="bg.panel">
            <Button>{getPrevButtonLabel(value)}</Button>
          </Box>
        </Steps.PrevTrigger>
      )}
      { /* Kovetkezo lepes gombok */}
      {value !== 3 ? (
        <Steps.NextTrigger asChild>
          <Box bg="bg.panel">
            <Button>{getNextButtonLabel(value)}</Button>
          </Box>
        </Steps.NextTrigger>
      ) : (
        <Box bg="bg.panel">
          <Button onClick={() => navigate("/")}>{getNextButtonLabel(value)}</Button>
        </Box>
      )}
    </ButtonGroup>
  )
}