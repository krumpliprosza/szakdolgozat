import Highcharts, { type Options } from 'highcharts'
import 'highcharts/esm/modules/sankey'
import * as HChartsReact from 'highcharts-react-official'
import { useColorMode } from '../../../components/color-mode'
import { baseChartOptions } from './HighchartsTheme'

// Leiras: Egyseges formazasu Highcharts diagram.

interface ChartProperties {
  options: Options
}

export const Chart = ({ options }: ChartProperties) => {
  const { colorMode } = useColorMode()
  const Options = Highcharts.merge(baseChartOptions(colorMode), options)

  return (
    <HChartsReact.HighchartsReact key={colorMode} highcharts={Highcharts} options={Options} />
  )
}
