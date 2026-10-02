import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useWizardData } from '../../../steps/WizardDataContext'
import { Box, Heading, Text, Carousel, IconButton } from '@chakra-ui/react'
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { usePageTitle } from '../../../hooks/usePageTitle'
import { AnimatedPage } from '../../../components/AnimatedPage'
import { ChangeColorModeButton } from '../../../components/ChangeColorModeButton'
import { Chart } from './Chart'
import { useColorModeValue } from '../../../components/color-mode'

// Leiras: A szimulacio eredmenyeit megjelenito oldal.

interface WeatherData {
  date: string
  temperature_2m: number
  precipitation: number
  wind_speed_10m: number
  is_day: number
}

interface SolarProductionData {
  date: string
  production_kWh: number
}

interface EnergyConsumptionData {
  date: string
  consumption_kWh: number
  household_items: Record<string, number>
}

interface StrategyTimeseriesRow {
  date: string
  soc_kWh: number
  pv_to_load: number
  pv_to_battery: number
  pv_to_grid: number
  battery_to_load: number
  grid_to_load: number
}

interface StrategySummary {
  pv_to_load: number
  pv_to_battery: number
  pv_to_grid: number
  battery_to_load: number
  grid_to_load: number
  inverter_loss: number
  charge_loss: number
  discharge_loss: number
  item_from_inverter: Record<string, number>
  item_from_battery: Record<string, number>
}

interface Strategy {
  title: string
  timeseries: StrategyTimeseriesRow[]
  summary: StrategySummary
}

export const SimulationResults = () => {
  usePageTitle("Statisztikák")

  const { data } = useWizardData()
  if (!data.simulationStarted) {
    return <Navigate to="/" replace />
  }
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [solarProduction, setSolarProduction] = useState<SolarProductionData[]>([])
  const [energyConsumption, setEnergyConsumption] = useState<EnergyConsumptionData[]>([])
  const [strategies, setStrategies] = useState<Strategy[]>([])

  // Szimulacio futtatasa, adatok lekerese
  useEffect(() => {
    if (!data.location) return
    fetch('http://localhost:8000/run_simulation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        setWeatherData(result.weatherData)
        setSolarProduction(result.solarProduction)
        setEnergyConsumption(result.energyConsumption)
        setStrategies(Object.values<Strategy | null>(result.strategies).filter((strategy) => strategy !== null))
      })
      .catch((error) => console.error('Nem sikerult a szimulacio futtatasa: ', error))
  }, [data.location])

  return (
    <AnimatedPage p={{ base: 2, md: 4, lg: 8 }}>

      <Heading mb={2}>Statisztikák</Heading>
      <Text mb={6} color="fg.muted">
        Ezen az oldalon láthatod a kész szimuláció eredményeit.
      </Text>

      <Box
        bg="bg.panel"
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
            legend: {
              enabled: true,
            },
            navigator: { enabled: true, baseSeries: 'napszak' },
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
                tooltip: { valueSuffix: ' °C', valueDecimals: 2 },
                data: weatherData.map((row) => [new Date(row.date).getTime(), row.temperature_2m]),
                zIndex: 2,
              },
              {
                yAxis: 1,
                type: 'spline',
                name: 'Szélsebesség',
                tooltip: { valueSuffix: ' km/h', valueDecimals: 2 },
                data: weatherData.map((row) => [new Date(row.date).getTime(), row.wind_speed_10m]),
                zIndex: 3,
              },
              {
                yAxis: 2,
                type: 'area',
                name: 'Csapadék mennyisége',
                step: 'center',
                tooltip: { valueSuffix: ' mm', valueDecimals: 2 },
                dataGrouping: { approximation: 'sum', groupPixelWidth: 10 },
                data: weatherData.map((row) => [new Date(row.date).getTime(), row.precipitation]),
                fillOpacity: 0.7,
                lineWidth: 1,
                zIndex: 1,
              },
              {
                id: 'napszak',
                yAxis: 3,
                type: 'area',
                name: 'Napszak',
                step: 'left',
                data: weatherData.map((row) => [new Date(row.date).getTime(), row.is_day]),
                lineWidth: 0,
                marker: { enabled: false },
                enableMouseTracking: false,
                showInLegend: false,
                zIndex: 0,
              },
            ],
          }}
        />

        {/* A haztartas fogyasztasa es a napelemrendszer termelese + energiamerleg */}
        <Chart
          isStock
          options={{
            title: {
              text: 'A háztartás fogyasztása és a napelemrendszer termelése',
            },
            legend: {
              enabled: true,
            },
            navigator: { enabled: true, baseSeries: 'energiamerleg' },
            scrollbar: { enabled: true },
            xAxis: { type: 'datetime' },
            yAxis: [
              {
                title: { text: 'Energia (kWh)' },
                labels: { format: '{value} kWh' },
                height: '65%',
                resize: { enabled: true },
                startOnTick: false,
                endOnTick: false,
              },
              {
                title: { text: 'Energiamérleg (kWh)' },
                labels: { format: '{value} kWh' },
                top: '70%',
                height: '30%',
                offset: 0,
                startOnTick: false,
                endOnTick: false,
              },
            ],
            series: [
              {
                yAxis: 0,
                type: 'areaspline',
                name: 'Fogyasztás',
                tooltip: { valueSuffix: ' kWh', valueDecimals: 2 },
                dataGrouping: { approximation: 'sum', groupPixelWidth: 20 },
                data: energyConsumption.map((row) => [new Date(row.date).getTime(), row.consumption_kWh]),
                zIndex: 0,
              },
              {
                yAxis: 0,
                type: 'areaspline',
                name: 'Termelés',
                tooltip: { valueSuffix: ' kWh', valueDecimals: 2 },
                dataGrouping: { approximation: 'sum', groupPixelWidth: 20 },
                data: solarProduction.map((row) => [new Date(row.date).getTime(), row.production_kWh]),
                zIndex: 1,
              },
              {
                id: 'energiamerleg',
                yAxis: 1,
                type: 'line',
                name: 'Energiamérleg',
                tooltip: { valueSuffix: ' kWh', valueDecimals: 2  },
                dataGrouping: { approximation: 'sum', groupPixelWidth: 20 },
                data: energyConsumption.map((row, i) => [new Date(row.date).getTime(), ((solarProduction[i].production_kWh) - row.consumption_kWh)]),
                zoneAxis: 'y',
                zones: [
                  { // Fogyasztas > termeles
                    value: 0, 
                    color: useColorModeValue('#E53E3E', '#FC8181')
                  },
                  { // Termeles > fogyasztas
                    color: useColorModeValue('#38A169', '#9AE6B4')
                  },
                ],
                marker: { enabled: false },
                showInLegend: false,
                zIndex: 2,
              },
            ],
          }}
        />

        {/* Strategiankenti adatok */}
        <Carousel.Root slideCount={strategies.length} allowMouseDrag>
          <Carousel.ItemGroup>
            {strategies.map(({ title, summary }, index) => {
              const itemNames = Object.keys(summary.item_from_inverter)
              return (
              <Carousel.Item key={title} index={index}>

                {/* Az energiaaramlas eloszlasa */}
                <Chart
                  options={{
                    title: {
                      text: `Az energiaáramlás eloszlása - ${title}`,
                    },
                    rangeSelector: {
                      enabled: false,
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
                        nodeFormat: '{point.name}: <b>{point.sum:.2f} kWh</b><br/>',
                        pointFormat: '{point.fromNode.name} → {point.toNode.name}: <b>{point.weight:.2f} kWh</b><br/>',
                      },
                      colors: [
                        '#000000', '#000000', '#000000', '#000000', 
                        '#E42535', '#D5401A', '#B15E16', '#917112', 
                        '#11883D', '#108467', '#11828D', '#167DB1', 
                        '#1B73DE', '#456BE8', '#6567EC', '#785CEB', 
                        '#9253EA', '#AA40E7', '#C51CE3', '#D11AC5', 
                        '#DA1BA4', '#DE1b7D', '#E31C54', '#DE351B',
                      ],
                      keys: ['from', 'to', 'weight'],
                      nodes: [
                        { id: 'Hálózati bevitel', color: '#38A169' },
                        { id: 'Napelem', color: '#D69E2E' },
                        { id: 'Inverter', color: '#B794F4' },
                        { id: 'Akkumulátor', color: '#63B3ED' },
                        { id: 'Visszatáplálás a hálózatba', color: '#FFFF00' },
                        { id: 'Veszteségek', color: '#888888' },
                        ...itemNames.map((id) => ({ id })),
                      ],
                      data: [
                        ['Hálózati bevitel', 'Inverter', summary.grid_to_load],
                        ['Napelem', 'Inverter', summary.pv_to_load + summary.pv_to_grid + summary.inverter_loss],
                        ['Napelem', 'Akkumulátor', summary.pv_to_battery],
                        ['Inverter', 'Visszatáplálás a hálózatba', summary.pv_to_grid],
                        ...itemNames.flatMap((name) => [
                          ['Inverter', name, summary.item_from_inverter[name]],
                          ['Akkumulátor', name, summary.item_from_battery[name]],
                        ]),
                        ['Inverter', 'Veszteségek', summary.inverter_loss],
                        ['Akkumulátor', 'Veszteségek', summary.charge_loss + summary.discharge_loss]
                      ],
                    },
                    ],
                  }}
                />

              </Carousel.Item>
              )
            })}
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
      <br/>
      <Text fontSize="xs" color="fg.muted" textAlign="center">Megjegyzés: a statisztikák elsősorban tájékoztató jellegűek, mivel a termelési és fogyasztási adatok mind modellek segítségével kerültek kiszámításra; ebből adódóan a valós termeléshez és fogyasztáshoz képest a kapott eredmények eltérhetnek. Az időjárási adatok szolgáltatását az <a href="https://open-meteo.com/">open-meteo.com biztosítja.</a></Text>
      <ChangeColorModeButton></ChangeColorModeButton>

    </AnimatedPage>
  )
}
