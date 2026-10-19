import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useWizardData } from '../../../steps/WizardDataContext'
import { Box, Heading, Text, Carousel, IconButton, Table, Center, VStack, HStack, Progress } from '@chakra-ui/react'
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
interface MonthlyStrategyCost {
  month: string
  grid_import_kWh: number
  discounted_import_kWh: number
  market_import_kWh: number
  energy_cost_HUF: number
  export_revenue_HUF: number
  gross_cost_HUF: number
  battery_cycles: number
}
interface StrategyCost {
  energy_cost_HUF: number
  export_revenue_HUF: number
  gross_cost_HUF: number
  monthlyData: MonthlyStrategyCost[]
}
interface StrategySummary {
  pv_to_load: number
  pv_to_battery: number
  pv_to_grid: number
  battery_to_load: number
  grid_to_load: number
  grid_to_battery: number
  inverter_loss: number
  charge_loss: number
  discharge_loss: number
  item_from_inverter: Record<string, number>
  item_from_battery: Record<string, number>
  battery_cycles: number
  cost: StrategyCost
}
interface Strategy {
  title: string
  summary: StrategySummary
}

// Honap nevenek formazasa a havi felbontast/eves osszegzest tartalmazo tablazathoz
const formatMonth = (monthInput: string): string => {
  const [year, month] = monthInput.split('-')
  const monthNames = ['január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december']
  return `${year}. ${monthNames[parseInt(month) - 1]}`
}

// Havi megtakaritas az akkumulatormentes rendszerhez kepest
const computeMonthlySavings = (summary: StrategySummary, baseline?: Strategy): { month: string; saving: number; baselineCost: number }[] => {
  if (!baseline) return []
  const baselineByMonth = new Map(baseline.summary.cost.monthlyData.map((m) => [m.month, m.gross_cost_HUF]))
  return summary.cost.monthlyData.map((m) => {
    const baselineCost = baselineByMonth.get(m.month) ?? 0
    return { month: m.month, saving: baselineCost - m.gross_cost_HUF, baselineCost }
  })
}

// Cimek a betoltesi oldalhoz
const progressBarTitles = [
  "Időjárási adatok lekérése...",
  "Napelemrendszer termelésének szimulálása...",
  "Háztartás fogyasztásának szimulálása...",
  "Energiaelosztási stratégiák futtatása..."
]

export const SimulationResults = () => {
  usePageTitle("Statisztikák")
  const { data } = useWizardData()
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [solarProduction, setSolarProduction] = useState<SolarProductionData[]>([])
  const [energyConsumption, setEnergyConsumption] = useState<EnergyConsumptionData[]>([])
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [progressBarIndex, setProgressBarIndex] = useState(0)

  // Szimulacio futtatasa, adatok lekerese
  useEffect(() => {
    if (!data.simulationStarted) return // Ha nincs meg minden szukseges bemeneti adat, ne fusson a szimulacio
    // Egyebkent:
    const progressBarStepDelay = 4000 * (Math.random() * 0.6 + 0.8)
    const interval = setInterval(() => {
      setProgressBarIndex((i) => (i < progressBarTitles.length - 1 ? i + 1 : i))
    }, progressBarStepDelay)

    fetch(`${import.meta.env.VITE_API_URL}/run_simulation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {setWeatherData(result.weatherData), setSolarProduction(result.solarProduction), setEnergyConsumption(result.energyConsumption), setStrategies(result.strategies)})
    .catch((error) => console.error('Nem sikerult a szimulacio futtatasa: ', error))
    .finally(() => {
      setIsPageLoading(false)
      clearInterval(interval)
    })

  }, [data])
  if (!data.simulationStarted) {return <Navigate to="/" replace />} // Ha nem futott le a szimulacio, menjen vissza a kezdolapra

  if (isPageLoading) {
    const progress = Math.round((progressBarIndex / (progressBarTitles.length - 1)) ** 0.85 * 80)
    return (
      <AnimatedPage p={{ base: 2, md: 4, lg: 8 }}>
        <Center minH="60vh">
          <VStack>
            <Text fontSize="lg" color="fg.muted" m={2}>{progressBarTitles[progressBarIndex]}</Text>
            <Progress.Root size="lg" w="full" variant="outline" colorPalette="purple" shape="full" value={progress} striped animated>
              <HStack>
                <Progress.Track flex="1">
                  <Progress.Range />
                </Progress.Track>
                <Progress.Label />
                <Progress.ValueText>{progress}%</Progress.ValueText>
              </HStack>
            </Progress.Root>
          </VStack>
        </Center>
      </AnimatedPage>
    )
  }

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

              // Megtakaritas az akkumulatormentes strategiahoz kepest
              const baselineCost = strategies[0]?.summary.cost?.gross_cost_HUF
              const saving = index > 0 && baselineCost !== undefined ? baselineCost - summary.cost.gross_cost_HUF : undefined

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
                        ...((summary.grid_to_battery ?? 0) > 0 ? [['Hálózati bevitel', 'Akkumulátor', summary.grid_to_battery ?? 0]] : []),
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

                {/* Az adott strategia egyeb mutatoi */}
                <Table.ScrollArea borderWidth="2px" borderRadius="md" borderColor="purple.tableHeader" mt={4}>
                  <Table.Root
                    size="sm"
                    variant="outline"
                    css={{
                      '& thead tr': {bg: 'purple.tableHeader'},
                      '& tbody tr:last-of-type td': {borderBottomWidth: 0, bg: 'purple.subtle'},
                      '& tbody tr:hover': {bg: 'purple.subtle'}
                    }}
                    interactive
                  >

                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader color="#E9FFE9">Hónap</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end" color="#E9FFE9">Bruttó energiadíj</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end" color="#E9FFE9">Betáplálási bevétel</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end" color="#E9FFE9">Fizetendő összeg</Table.ColumnHeader>
                        {index > 0 && <Table.ColumnHeader textAlign="end" color="#E9FFE9">Megtakarítás</Table.ColumnHeader>}
                        {(summary.battery_cycles !== 0) && <Table.ColumnHeader textAlign="end" color="#E9FFE9">Akkumulátorciklusok száma</Table.ColumnHeader>}
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      {/* Havi felbontasu adatok */}
                      {(() => {
                        const monthlySavings = index > 0 ? computeMonthlySavings(summary, strategies[0]) : []
                        return summary.cost.monthlyData.map((month, counter) => (
                          <Table.Row key={month.month}>
                            <Table.Cell fontWeight="semibold">
                              {formatMonth(month.month)}
                            </Table.Cell>
                            <Table.Cell fontWeight="semibold" textAlign="end">
                              {Math.round(month.energy_cost_HUF)} Ft
                            </Table.Cell>
                            <Table.Cell fontWeight="semibold" textAlign="end">
                              {Math.round(month.export_revenue_HUF)} Ft
                            </Table.Cell>
                            <Table.Cell fontWeight="semibold" textAlign="end">
                              {Math.round(month.gross_cost_HUF)} Ft
                            </Table.Cell>
                            {index > 0 && (
                              <Table.Cell fontWeight="semibold" textAlign="end" color={monthlySavings[counter].saving > 0 ? 'green.fg' : undefined}>
                                {Math.round(monthlySavings[counter].saving)} Ft ({baselineCost !== 0 ? -Math.round((monthlySavings[counter].saving / Math.abs(monthlySavings[counter].baselineCost)) * 10000) / 100 : 0}%)
                              </Table.Cell>
                            )}
                            {(summary.battery_cycles !== 0) && (
                              <Table.Cell fontWeight="semibold" textAlign="end">{month.battery_cycles}</Table.Cell>
                            )}
                          </Table.Row>
                        ))
                      })()}
                      {/* Osszesites */}
                      <Table.Row>
                        <Table.Cell fontWeight="semibold">Összesítve</Table.Cell>
                        <Table.Cell fontWeight="semibold" textAlign="end">
                          {Math.round(summary.cost.energy_cost_HUF)} Ft
                        </Table.Cell>
                        <Table.Cell fontWeight="semibold" textAlign="end">
                          {Math.round(summary.cost.export_revenue_HUF)} Ft
                        </Table.Cell>
                        <Table.Cell fontWeight="semibold" textAlign="end">
                          {Math.round(summary.cost.gross_cost_HUF)} Ft
                        </Table.Cell>
                        {saving !== undefined && (
                          <Table.Cell fontWeight="semibold" textAlign="end" color={saving > 0 ? 'green.fg' : undefined}>
                            {Math.round(saving)} Ft ({baselineCost !== 0 ? -Math.round((saving / Math.abs(baselineCost)) * 10000) / 100 : 0}%)
                          </Table.Cell>
                        )}
                        {(summary.battery_cycles !== 0) && (
                          <Table.Cell fontWeight="semibold" textAlign="end">
                            {summary.battery_cycles}
                          </Table.Cell>
                        )}
                      </Table.Row>
                    </Table.Body>

                  </Table.Root>
                </Table.ScrollArea>

              </Carousel.Item>
              )
            })}
          </Carousel.ItemGroup>

          <Carousel.Control justifyContent="center" gap="4" mt={3}>
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
      <Text fontSize="xs" color="fg.muted" textAlign="center">Megjegyzés: a statisztikák elsősorban tájékoztató jellegűek, mivel a termelési és fogyasztási adatok mind modellek segítségével kerültek kiszámításra; ebből adódóan a valós értékekhez képest a kapott eredmények eltérhetnek. Az időjárási adatok szolgáltatását az <a href="https://open-meteo.com/">open-meteo.com biztosítja.</a></Text>
      <ChangeColorModeButton></ChangeColorModeButton>

    </AnimatedPage>
  )
}
