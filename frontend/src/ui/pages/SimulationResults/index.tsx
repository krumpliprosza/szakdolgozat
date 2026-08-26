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
        {/* Idojarasi adatok */}
        <Chart
          options={{
            title: {
              text: 'Időjárási adatok',
            },
            yAxis: [
              {
                title: { text: 'Csapadék mennyisége (mm)' },
                labels: { format: '{value} mm' },
              },
              {
                title: { text: 'Hőmérséklet (°C)' },
                labels: { format: '{value} °C' },
              },
              {
                title: { text: 'Szélsebesség (km/h)' },
                labels: { format: '{value} km/h' },
              },
              {
                min: 0,
                max: 1,
                visible: false,
                startOnTick: false,
                endOnTick: false,
              },
            ],
            series: [
              {
                yAxis: 1,
                type: 'spline',
                name: 'Hőmérséklet',
                tooltip: { valueSuffix: ' °C' },
                data: [25, 14, 3, 32, 11, 7, 9, 13, 5, 25, 14, 3, 32, 11, 7, 9, 13, 5, 25, 14, 3, 32, 11, 7, 9, 13, 5, 25, 14, 3, 32, 11, 7, 9, 13, 5],
                zIndex: 2,
              },
              {
                yAxis: 2,
                type: 'spline',
                name: 'Szélsebesség',
                tooltip: { valueSuffix: ' km/h' },
                data: [0, 10, 10, 10, 10, 10, 10, 10, 12, 12, 12, 12, 12, 12, 2, 30, 30, 30, 30, 30, 30, 30, 24, 24, 24, 4, 24, 42, 24, 50, 50, 50, 50, 50, 50, 50],
                zIndex: 3,
              },
              {
                yAxis: 0,
                type: 'column',
                name: 'Csapadék mennyisége',
                tooltip: { valueSuffix: ' mm' },
                data: [1, 2, 3, 4, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 4, 3, 2, 1, 1, 2, 3, 4, 5, 4, 3, 2, 1],
                zIndex: 1,
              },
              {
                yAxis: 3,
                type: 'area',
                name: 'Napszak',
                step: 'left',
                data: [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
                lineWidth: 0,
                marker: { enabled: false },
                enableMouseTracking: false,
                zIndex: 0,
              },
            ],
          }}
        />
        {/* A haztartas fogyasztasa es a napelemrendszer termelese */}
        <Chart
          options={{
            title: {
              text: 'A háztartás fogyasztása és a napelemrendszer termelése',
            },
            yAxis: [
              {
                title: { text: 'Teljesítmény (W)' },
                labels: { format: '{value} W' },
              },
            ],
            series: [
              {
                type: 'areaspline',
                name: 'Fogyasztás',
                tooltip: { valueSuffix: ' W' },
                data: [10, 20, 21, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 30, 30, 30, 30, 30, 30, 30, 41, 41, 41, 41, 41, 41, 41, 50, 50, 50, 50, 50, 50, 50],
                zIndex: 0,
              },
              {
                type: 'areaspline',
                name: 'Termelés',
                tooltip: { valueSuffix: ' W' },
                data: [0, 10, 10, 10, 10, 10, 10, 10, 32, 32, 32, 32, 32, 32, 32, 30, 30, 30, 30, 30, 30, 30, 4, 4, 4, 4, 4, 4, 4, 50, 50, 50, 50, 50, 50, 50],
                zIndex: 1,
              },
            ],
          }}
        />
        {/* Az energiaaramlas eloszlasa */}
        <Chart
          options={{
            title: {
              text: 'Az energiaáramlás eloszlása',
            },
            series: [{
              type: 'sankey',
              name: '',
              tooltip: { valueSuffix: ' W' },
              colors: [
                
              ],
              keys: ['from', 'to', 'weight'],
              nodes: [
                { id: 'Napelem', color: '#D69E2E', },
                { id: 'Hálózati bevitel', color: '#38A169', },
                { id: 'Inverter', color: '#B794F4'},
                { id: 'Akkumulátor', color: '#63B3ED'},
                { id: 'Veszteség', color: '#E53E3E', },
                { id: 'Világítás', },
                { id: 'Hűtő', },
                { id: 'Sütő', },
                { id: 'Visszatáplálás a hálózatba', color: '#ffff00' },
              ],
              data: [
                ['Napelem', 'Inverter', 35],
                ['Napelem', 'Akkumulátor', 10],
                ['Napelem', 'Veszteség', 5],
                ['Hálózati bevitel', 'Inverter', 15],
                ['Inverter', 'Világítás', 10],
                ['Inverter', 'Hűtő', 15],
                ['Inverter', 'Sütő', 15],
                ['Inverter', 'Visszatáplálás a hálózatba', 10],
                ['Akkumulátor', 'Világítás', 5],
                ['Akkumulátor', 'Sütő', 5],
              ],
            },
            ],
          }}
        />
      </Box>
      
      <Center><Text fontSize="xs" color="fg.muted">Megjegyzés: a statisztikák elsősorban tájékoztató jellegűek, mivel a termelési és fogyasztási adatok mind modellek segítségével kerültek kiszámításra. Ebből adódóan a valós termeléshez és fogyasztáshoz képest a kapott eredmények eltérhetnek.</Text></Center>
      <ChangeColorModeButton></ChangeColorModeButton>

    </AnimatedPage>
  )
}
