import { Box, Heading, Text, Center } from '@chakra-ui/react'
import { usePageTitle } from '../../../hooks/usePageTitle'
import { AnimatedPage } from '../../../components/AnimatedPage'
import { ChangeColorModeButton } from '../../../components/ChangeColorModeButton'
import { Chart } from './Chart'

// Leiras: A szimulacio eredmenyeit megjelenito oldal.

export const SimulationResults = () => {
  usePageTitle("Statisztikák")

  return (
    <AnimatedPage p={{ base: 4, lg: 8 }}>

      <Heading mb={2}>Statisztikák</Heading>
      <Text mb={6} color="fg.muted">
        Ezen az oldalon láthatod a kész szimuláció eredményeit.
      </Text>

      <Box
        bg="bg.panel"
        borderColor="border"
        borderRadius="md"
        p={4}
      >

        <Chart
          options={{
            title: {
              text: 'Időjárási adatok',
            },
            series: [
              {
                type: 'spline',
                name: 'Hőmérséklet',
                data: [25, 14, 3, 32, 11, 7, 9, 13, 5, 25, 14, 3, 32, 11, 7, 9, 13, 5, 25, 14, 3, 32, 11, 7, 9, 13, 5, 25, 14, 3, 32, 11, 7, 9, 13, 5],
              },
              {
                type: 'spline',
                name: 'Csapadék',
                data: [1, 2, 3, 4, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 4, 3, 2, 1],
              },
              {
                type: 'spline',
                name: 'Szélsebesség',
                data: [0, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 12, 12, 12, 2, 30, 30, 30, 30, 30, 30, 30, 24, 24, 24, 4, 24, 42, 24, 50, 50, 50, 50, 50, 50, 50],
              },
            ],
          }}
        />

        <Chart
          options={{
            title: {
              text: 'Napelemrendszer termelése és a háztartás fogyasztása',
            },
            series: [
              {
                type: 'areaspline',
                name: 'Termelés',
                data: [0, 10, 10, 10, 10, 10, 10, 10, 32, 32, 32, 32, 32, 32, 32, 30, 30, 30, 30, 30, 30, 30, 4, 4, 4, 4, 4, 4, 4, 50, 50, 50, 50, 50, 50, 50],
              },
              {
                type: 'areaspline',
                name: 'Fogyasztás',
                data: [10, 20, 21, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 30, 30, 30, 30, 30, 30, 30, 41, 41, 41, 41, 41, 41, 41, 50, 50, 50, 50, 50, 50, 50],
              },
            ],
          }}
        />

        <a href="https://www.highcharts.com/docs/chart-and-series-types/sankey-diagram">Sankey diagram helye (+ link)</a>

      </Box>
      
      <Center><Text fontSize="xs" color="fg.muted">Megjegyzés: a statisztikák elsősorban tájékoztató jellegűek, mivel a termelési és fogyasztási adatok modellek segítségével kerültek kiszámításra. Ebből adódóan a valós termeléshez és fogyasztáshoz képest a kapott eredmények eltérhetnek.</Text></Center>
      <ChangeColorModeButton></ChangeColorModeButton>

    </AnimatedPage>
  )
}
