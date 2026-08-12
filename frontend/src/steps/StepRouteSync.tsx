import { useStepsContext } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

// Leiras: Figyeli a Step allapotat, es ha valtozik, navigal a megfelelo utvonalra - ez koti ossze a varazslo belso allapotat az App utvonalaival.

export const StepRouteSync = () => {
  const stepPaths = ["/first-step", "/second-step", "/third-step", "/setup-complete"]
  const { value } = useStepsContext()
  const navigate = useNavigate()

  useEffect(() => {
    const target = stepPaths[value]
    if (target) {
      navigate(target)
    }
  }, [value, navigate])

  return null
}