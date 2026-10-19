import Highcharts from 'highcharts'
import type { ColorMode } from '../../../components/color-mode'

// Leiras: A diagramok egyseges, alapertelmezett formazasat adja vissza.

const colors = {
  light: {
    purpleBorder: '#641BA3',
    purpleText: '#4A1772',
    purpleBackground: '#E9D5FF',
    selectedButton: '#7131AA',
    background: '#E9FFE9',
    panelBorder: '#6B46C1',
    text: '#1A202C',
    mutedText: '#4A5568',
    gridLine: '#C6E8C6',
    axisLine: '#6B46C1',
    seriesColors: ['#E53E3E', '#38A169', '#3182CE', '#D69E2E', '#6B46C1',],
    tooltipBackground: '#FFFFFF',
    subtle: '#e9d8fd',
  },
  dark: {
    purpleBorder: '#C084FC',
    purpleText: '#D8B4FE',
    purpleBackground: '#2F0553',
    selectedButton: '#852FD5',
    background: '#0E0616',
    panelBorder: '#B794F4',
    text: '#E9FFE9',
    mutedText: '#A0AEC0',
    gridLine: '#2D2540',
    axisLine: '#B794F4',
    seriesColors: ['#FC8181', '#68D391', '#63B3ED', '#F6E05E', '#B794F4',],
    tooltipBackground: '#1A1025',
    subtle: '#581c87',
  },
}

// Az adott temahoz tartozo diagrambeallitasokat adja vissza
export const baseChartOptions = (colorMode: ColorMode): void => {
    const color = colors[colorMode] ?? colors.light

    Highcharts.setOptions({
        lang: {
            yAxisTitle: '',
            locale: 'hu-HU',
            months: ['január', 'február', 'március', 'április', 'május', 'június', 'július', 'augusztus', 'szeptember', 'október', 'november', 'december'],
            shortMonths: ['jan.', 'febr.', 'márc.', 'ápr.', 'máj.', 'jún.', 'júl.', 'aug.', 'szept.', 'okt.', 'nov.', 'dec.'],
            weekdays: ['vasárnap', 'hétfő', 'kedd', 'szerda', 'csütörtök', 'péntek', 'szombat'],
        },
        chart: {
            backgroundColor: 'transparent',
            height: '50%',
            style: {
                fontFamily: 'inherit',
            },
            zooming: {
                type: 'x',
                pinchType: 'x',
            },
            panning: {
                enabled: true, 
                type: 'x', 
            },
            ignoreHiddenSeries: false,
        },
        rangeSelector: {
            enabled: true,
            inputEnabled: false,
            dropdown: 'never',
            buttonPosition: { align: 'right' },
            labelStyle: { display: 'none' },
            buttonSpacing: 6,
            buttonTheme: {
                border: { width: '1px' },
                width: 55,
                fill: color.background,
                stroke: color.purpleBorder,
                'stroke-width': 1,
                r: 4,
                style: { color: color.purpleText, fontWeight: '500' },
                states: {
                    hover: {
                        fill: color.purpleBackground,
                    },
                    select: {
                        stroke: color.selectedButton,
                        fill: color.selectedButton,
                        style: { color: '#FFFFFF' }
                    },
                },
            },
            buttons: [
                { type: 'week', count: 1, text: '1 hét', title: '1 hét' },
                { type: 'month', count: 1, text: '1 hónap', title: '1 hónap' },
                { type: 'month', count: 3, text: '3 hónap', title: '3 hónap' },
                { type: 'month', count: 6, text: '6 hónap', title: '6 hónap' },
                { type: 'all', text: 'Mind', title: 'Mind' },
            ],
            selected: 4,
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
                fillOpacity: 0.2,
            },
            series: {
                dataGrouping: {
                    dateTimeLabelFormats: {
                        week: ['%[AebY] hete', '%[Aeb]', '-%[AebY]'],
                    },
                },
            },
        },
        credits: {
            enabled: false,
        },
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 600,
                    },
                    chartOptions: {
                        chart: {
                            height: 500,
                        },
                        yAxis: [
                            { labels: { enabled: false }, title: { text: undefined } },
                            { labels: { enabled: false }, title: { text: undefined } },
                            { labels: { enabled: false }, title: { text: undefined } },
                            { labels: { enabled: false }, title: { text: undefined } },
                        ],
                    },
                },
            ],
        },
    })
}
