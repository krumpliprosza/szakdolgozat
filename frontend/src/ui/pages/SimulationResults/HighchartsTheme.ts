import Highcharts from 'highcharts'
import type { ColorMode } from '../../../components/color-mode'

// Leiras: A diagramok egyseges, alapertelmezett formazasat adja vissza.

const colors = {
  light: {
    background: '#E9FFE9',
    panelBorder: '#6B46C1',
    text: '#1A202C',
    mutedText: '#4A5568',
    gridLine: '#C6E8C6',
    axisLine: '#6B46C1',
    seriesColors: ['#E53E3E', '#38A169', '#3182CE', '#D69E2E', '#6B46C1',],
    tooltipBackground: '#FFFFFF',
  },
  dark: {
    background: '#0E0616',
    panelBorder: '#B794F4',
    text: '#E9FFE9',
    mutedText: '#A0AEC0',
    gridLine: '#2D2540',
    axisLine: '#B794F4',
    seriesColors: ['#FC8181', '#68D391', '#63B3ED', '#F6E05E', '#B794F4',],
    tooltipBackground: '#1A1025',
  },
}

// Az adott temahoz tartozo diagrambeallitasokat adja vissza
export const baseChartOptions = (colorMode: ColorMode): void => {
    const color = colors[colorMode] ?? colors.light

    Highcharts.setOptions({
        lang: {
            resetZoom: 'Nagyítás visszaállítása',
            resetZoomTitle: 'np',
            yAxisTitle: ''
        },
        chart: {
            backgroundColor: 'transparent',
            style: {
                fontFamily: 'inherit',
            },
            zooming: {
                type: 'x',
            },
            resetZoomButton: {
                theme: {
                    fill: color.tooltipBackground,
                    stroke: color.axisLine,
                    strokeWidth: 2,
                    r: 4,
                    padding: 8,
                    style: {
                        color: color.text,
                        fontWeight: '500',
                    },
                    states: {
                        hover: {
                            fill: color.axisLine,
                            style: {
                                color: color.background,
                            },
                        },
                    },
                },
                position: {
                    align: 'right',
                },
            },
        },
        colors: color.seriesColors,
        title: {
            style: {
                color: color.text,
                fontWeight: 'bold',
            },
        },
        subtitle: {
            style: {
                color: color.mutedText,
            },
        },
        xAxis: {
            lineColor: color.axisLine,
            tickColor: color.axisLine,
            gridLineColor: color.gridLine,
            labels: {
                style: {
                    color: color.mutedText,
                },
            },
            title: {
                style: {
                    color: color.text,
                },
            },
        },
        yAxis: {
            gridLineColor: color.gridLine,
            labels: {
                style: {
                    color: color.mutedText,
                },
            },
            title: {
                style: {
                    color: color.text,
                },
            },
        },
        legend: {
            itemStyle: {
                color: color.text,
            },
            itemHoverStyle: {
                color: color.mutedText,
            },
        },
        tooltip: {
            shared: true,
            split: false,
            backgroundColor: color.tooltipBackground,
            borderColor: color.axisLine,
            style: {
                color: color.text,
            },
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.5,
            },
            column: {
                opacity: 0.75,
            },
            area: {
                fillOpacity: 0.15,
            }
        },
        credits: {
            enabled: false,
        },
    })
}
