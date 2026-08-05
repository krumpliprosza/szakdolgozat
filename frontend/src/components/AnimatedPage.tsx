import { Box, type BoxProps } from '@chakra-ui/react'

// Leiras: Fade-in animaciot ad az oldalaknak megjelenesekor.

export const AnimatedPage = (props: BoxProps) => (
  <Box
    data-state="open"
    _open={{
      animation: "fade-in 400ms ease-out",
    }}
    {...props}
  />
)