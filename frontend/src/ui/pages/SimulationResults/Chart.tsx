import Highcharts, { type Options } from 'highcharts'
import 'highcharts/esm/modules/sankey'
import 'highcharts/esm/modules/stock'
import * as HChartsReact from 'highcharts-react-official'
import { useColorMode } from '../../../components/color-mode'
import { baseChartOptions } from './HighchartsTheme'

// Leiras: Egyseges formazasu Highcharts diagram.

interface ChartProperties {
  options: Options
  isStock?: boolean
}

export const Chart = ({ options, isStock = false }: ChartProperties) => {
  const { colorMode } = useColorMode()
  baseChartOptions(colorMode)

  return (
    <HChartsReact.HighchartsReact key={colorMode} highcharts={Highcharts} constructorType={isStock ? 'stockChart' : 'chart'} options={options} />
  )
}
