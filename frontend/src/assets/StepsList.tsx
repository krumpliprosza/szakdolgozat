import { Steps } from '@chakra-ui/react'
import { items } from './StepItems'

// Leiras: 

export const StepsList = () => {
  return (
    <Steps.List>
      {items.map((step, index) => (
        <Steps.Item key={index} index={index} title={step.title}>
          <Steps.Indicator>
            <Steps.Status incomplete={step.icon} complete={step.iconcomplete} />
          </Steps.Indicator>
          <Steps.Title display={{ base: "none", lg: "block" }} fontSize={{ base: "md", xl: "lg" }}>
            {step.title}
          </Steps.Title>
          <Steps.Separator />
        </Steps.Item>
      ))}
    </Steps.List>
  )
}