import Highcharts, { type Options } from 'highcharts'
import type { ColorMode } from '../../../components/color-mode'

// Leiras: A diagramok egyseges, alapertelmezett formazasat adja vissza.

const palette = {
  light: {
    background: '#E9FFE9',
    panelBorder: '#6B46C1',
    text: '#1A202C',
    mutedText: '#4A5568',
    gridLine: '#C6E8C6',
    axisLine: '#6B46C1',
    seriesColors: ['#E53E3E', '#3182CE', '#38A169', '#6B46C1', '#D69E2E'],
    tooltipBackground: '#FFFFFF',
  },
  dark: {
    background: '#0E0616',
    panelBorder: '#B794F4',
    text: '#E9FFE9',
    mutedText: '#A0AEC0',
    gridLine: '#2D2540',
    axisLine: '#B794F4',
    seriesColors: ['#FC8181', '#63B3ED', '#68D391', '#B794F4', '#F6E05E'],
    tooltipBackground: '#1A1025',
  },
}

// Az adott temahoz tartozo diagrambeallitasokat adja vissza
export const baseChartOptions = (colorMode: ColorMode): Options => {
    const colors = palette[colorMode] ?? palette.light

    Highcharts.setOptions({
        lang: {
            resetZoom: 'Nagyítás visszaállítása',
            resetZoomTitle: 'np',
            yAxisTitle: ''
        },
    })

    return {
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
                    fill: colors.tooltipBackground,
                    stroke: colors.axisLine,
                    'stroke-width': 2,
                    r: 4,
                    padding: 8,
                    style: {
                        color: colors.text,
                        fontWeight: '500',
                    },
                    states: {
                        hover: {
                            fill: colors.axisLine,
                            style: {
                                color: colors.background,
                            },
                        },
                    },
                },
                position: {
                    align: 'right',
                    x: -10,
                    y: 10,
                },
            },
        },
        colors: colors.seriesColors,
        title: {
            style: {
                color: colors.text,
                fontWeight: 'bold',
            },
        },
        subtitle: {
            style: {
                color: colors.mutedText,
            },
        },
        xAxis: {
            lineColor: colors.axisLine,
            tickColor: colors.axisLine,
            gridLineColor: colors.gridLine,
            labels: {
                style: {
                    color: colors.mutedText,
                },
            },
            title: {
                style: {
                    color: colors.text,
                },
            },
        },
        yAxis: {
            gridLineColor: colors.gridLine,
            labels: {
                style: {
                    color: colors.mutedText,
                },
            },
            title: {
                style: {
                    color: colors.text,
                },
            },
        },
        legend: {
            itemStyle: {
                color: colors.text,
            },
            itemHoverStyle: {
                color: colors.mutedText,
            },
        },
        tooltip: {
            backgroundColor: colors.tooltipBackground,
            borderColor: colors.axisLine,
            style: {
                color: colors.text,
            },
        },
        credits: {
            enabled: false,
        },
    }
}
