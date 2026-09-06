import { useEffect, useState } from 'react'
import { useWizardData } from '../../../steps/WizardDataContext'
import { Box, Heading, Text, Carousel, IconButton } from '@chakra-ui/react'
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { usePageTitle } from '../../../hooks/usePageTitle'
import { AnimatedPage } from '../../../components/AnimatedPage'
import { ChangeColorModeButton } from '../../../components/ChangeColorModeButton'
import { Chart } from './Chart'

// Leiras: A szimulacio eredmenyeit megjelenito oldal.

interface WeatherData {
  date: string
  temperature_2m: number
  precipitation: number
  wind_speed_10m: number
  is_day: number
}

export const SimulationResults = () => {
  usePageTitle("Statisztikák")

  const { data } = useWizardData()
  console.log(data)
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])

  useEffect(() => {
    if (!data.location) return
    fetch('http://localhost:8000/run_simulation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => setWeatherData(result.weatherData))
      .catch((error) => console.error('Nem sikerult a szimulacio futtatasa: ', error))
  }, [data.location])

  const items = [1, 2, 3]
  return (
    <AnimatedPage p={{ base: 2, md: 4, lg: 8 }}>

      <Heading mb={2}>Statisztikák</Heading>
      <Text mb={6} color="fg.muted">
        Ezen az oldalon láthatod a kész szimuláció eredményeit.
      </Text>

      <Box
        bg="bg.panel"
        borderColor="border"
        borderRadius="md"
        p={{ base: 0, lg: 4 }}
      >

        {/* Idojarasi adatok */}
        <Chart
          isStock
          options={{
            title: {
              text: 'Időjárási adatok',
            },
            rangeSelector: { enabled: false },
            navigator: { enabled: true },
            scrollbar: { enabled: true },
            xAxis: { type: 'datetime' },
            yAxis: [
              {
                title: { text: 'Hőmérséklet (°C)' },
                labels: { format: '{value} °C' },
              },
              {
                title: { text: 'Szélsebesség (km/h)' },
                labels: { format: '{value} km/h' },
              },
              {
                title: { text: 'Csapadék mennyisége (mm)' },
                labels: { format: '{value} mm' },
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
                yAxis: 0,
                type: 'spline',
                name: 'Hőmérséklet',
                tooltip: { valueSuffix: ' °C' },
                data: weatherData.map((row) => [new Date(row.date).getTime(), row.temperature_2m]),
                zIndex: 2,
              },
              {
                yAxis: 1,
                type: 'spline',
                name: 'Szélsebesség',
                tooltip: { valueSuffix: ' km/h' },
                data: weatherData.map((row) => [new Date(row.date).getTime(), row.wind_speed_10m]),
                zIndex: 3,
              },
              {
                yAxis: 2,
                type: 'column',
                name: 'Csapadék mennyisége',
                tooltip: { valueSuffix: ' mm' },
                data: weatherData.map((row) => [new Date(row.date).getTime(), row.precipitation]),
                zIndex: 1,
              },
              {
                yAxis: 3,
                type: 'area',
                name: 'Napszak',
                step: 'left',
                data: weatherData.map((row) => [new Date(row.date).getTime(), row.is_day]),
                lineWidth: 0,
                marker: { enabled: false },
                enableMouseTracking: false,
                zIndex: 0,
              },
            ],
          }}
        />

        <Carousel.Root slideCount={3} allowMouseDrag>
          <Carousel.ItemGroup>
            {items.map((_, index) => (
              <Carousel.Item key={index} index={index}>

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
                        data: [15, 25, 25, 15, 25, 15, 15, 10, 20, 21, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 30, 30, 30, 30, 30, 30, 30, 41, 41, 41, 41, 41, 41, 41, 50, 50, 50, 50, 50, 50, 50, 10, 20, 21, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 30, 30, 30, 30, 30, 30, 30, 41, 41, 41, 41, 41, 41, 41, 50, 50, 50, 50, 50, 50, 50, 10, 20, 21, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 30, 30, 30, 30, 30, 30, 30, 41, 41, 41, 41, 41, 41, 41, 50, 50, 50, 50, 50, 50, 50, 10, 20, 21, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 30, 30, 30, 30, 30, 30, 30, 41, 41, 41, 41, 41, 41, 41, 50, 50, 50, 50, 50, 50, 50, 10, 20, 21, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 30, 30, 30, 30, 30, 30, 30, 41, 41, 41, 41, 41, 41, 41, 50, 50, 50, 50, 50, 50, 50, 10, 20, 21, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 30, 30, 30, 30, 30, 30, 30, 41, 41, 41, 41, 41, 41, 41, 50, 50, 50, 50, 50, 50, 50, 10, 20, 21, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 30, 30, 30, 30, 30, 30, 30, 41, 41, 41, 41, 41, 41, 41, 50, 50, 50, 50, 50, 50, 50, 10, 20, 21, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 30, 30, 30, 30, 30, 30, 30, 41, 41, 41, 41, 41, 41, 41, 50, 50, 50, 50, 50, 50, 50, 10, 20, 21, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 30, 30, 30, 30, 30, 30, 30, 41, 41, 41, 41, 41, 41, 41, 50, 50, 50, 50, 50, 50, 50, 10, 20, 21, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 30, 30, 30, 30, 30, 30, 30, 41, 41, 41, 41, 41, 41, 41, 50, 50, 50, 50, 50, 50, 50],
                        zIndex: 0,
                      },
                      {
                        type: 'areaspline',
                        name: 'Termelés',
                        tooltip: { valueSuffix: ' W' },
                        data: [25, 15, 15, 15, 15, 15, 15, 20, 10, 10, 10, 10, 10, 10, 10, 32, 32, 32, 32, 32, 32, 32, 30, 30, 30, 30, 30, 30, 30, 14, 24, 34, 24, 14, 34, 24, 50, 50, 50, 50, 50, 50, 50, 20, 10, 10, 10, 10, 10, 10, 10, 32, 32, 32, 32, 32, 32, 32, 30, 30, 30, 30, 30, 30, 30, 14, 24, 34, 24, 14, 34, 24, 50, 50, 50, 50, 50, 50, 50, 20, 10, 10, 10, 10, 10, 10, 10, 32, 32, 32, 32, 32, 32, 32, 30, 30, 30, 30, 30, 30, 30, 14, 24, 34, 24, 14, 34, 24, 50, 50, 50, 50, 50, 50, 50, 20, 10, 10, 10, 10, 10, 10, 10, 32, 32, 32, 32, 32, 32, 32, 30, 30, 30, 30, 30, 30, 30, 14, 24, 34, 24, 14, 34, 24, 50, 50, 50, 50, 50, 50, 50, 20, 10, 10, 10, 10, 10, 10, 10, 32, 32, 32, 32, 32, 32, 32, 30, 30, 30, 30, 30, 30, 30, 14, 24, 34, 24, 14, 34, 24, 50, 50, 50, 50, 50, 50, 50, 20, 10, 10, 10, 10, 10, 10, 10, 32, 32, 32, 32, 32, 32, 32, 30, 30, 30, 30, 30, 30, 30, 14, 24, 34, 24, 14, 34, 24, 50, 50, 50, 50, 50, 50, 50, 20, 10, 10, 10, 10, 10, 10, 10, 32, 32, 32, 32, 32, 32, 32, 30, 30, 30, 30, 30, 30, 30, 14, 24, 34, 24, 14, 34, 24, 50, 50, 50, 50, 50, 50, 50, 20, 10, 10, 10, 10, 10, 10, 10, 32, 32, 32, 32, 32, 32, 32, 30, 30, 30, 30, 30, 30, 30, 14, 24, 34, 24, 14, 34, 24, 50, 50, 50, 50, 50, 50, 50, 20, 10, 10, 10, 10, 10, 10, 10, 32, 32, 32, 32, 32, 32, 32, 30, 30, 30, 30, 30, 30, 30, 14, 24, 34, 24, 14, 34, 24, 50, 50, 50, 50, 50, 50, 50, 20, 10, 10, 10, 10, 10, 10, 10, 32, 32, 32, 32, 32, 32, 32, 30, 30, 30, 30, 30, 30, 30, 14, 24, 34, 24, 14, 34, 24, 50, 50, 50, 50, 50, 50, 50],
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
                    chart: {
                      zooming: {
                        type: undefined,
                      },
                    },
                    series: [{
                      type: 'sankey',
                      name: '',
                      tooltip: {
                        nodeFormat: '{point.name}: <b>{point.sum} W</b><br/>',
                        pointFormat: '{point.fromNode.name} → {point.toNode.name}: <b>{point.weight} W</b><br/>',
                      },
                      colors: [
                        '#e42535', '#d5401a', '#b15e16', '#917112', 
                        '#11883d', '#108467', '#11828d', '#167db1', 
                        '#1b73de', '#456be8', '#6567ec', '#785ceb', 
                        '#9253ea', '#aa40e7', '#c51ce3', '#d11ac5', 
                        '#da1ba4', '#de1b7d', '#e31c54', '#de351b',
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

              </Carousel.Item>
            ))}
          </Carousel.ItemGroup>

          <Carousel.Control justifyContent="center" gap="4">
            <Carousel.PrevTrigger asChild>
              <IconButton size="xs" variant="outline" borderWidth="1px" borderColor="purple.border" color="purple.fg" _hover={{ bg: 'purple.subtle' }}>
                <LuChevronLeft />
              </IconButton>
            </Carousel.PrevTrigger>

            <Carousel.Indicators 
              css={{
                bg: "fg.carouselIndicator",
                _current: {
                  bg: "purple.fg",
                },
              }}
            />

            <Carousel.NextTrigger asChild>
              <IconButton size="xs" variant="outline" borderWidth="1px" borderColor="purple.border" color="purple.fg" _hover={{ bg: 'purple.subtle' }}>
                <LuChevronRight />
              </IconButton>
            </Carousel.NextTrigger>
          </Carousel.Control>
        </Carousel.Root>

      </Box>
      
      <Text fontSize="xs" color="fg.muted" textAlign="center">Megjegyzés: a statisztikák elsősorban tájékoztató jellegűek, mivel a termelési és fogyasztási adatok mind modellek segítségével kerültek kiszámításra; ebből adódóan a valós termeléshez és fogyasztáshoz képest a kapott eredmények eltérhetnek. Az időjárási adatok szolgáltatását az <a href="https://open-meteo.com/">open-meteo.com biztosítja.</a></Text>
      <ChangeColorModeButton></ChangeColorModeButton>

    </AnimatedPage>
  )
}
