import { getAllowedUsageDateRange } from "../../../components/DateRange"
import type { HouseholdItem, UsagePeriod } from "../../../steps/WizardDataContext"

// Leiras: Elore meghatarozott fogyasztasi profilok adatai.

type UsagePeriodTemplate = Omit<UsagePeriod, 'id'>
type HouseholdItemTemplate = Omit<HouseholdItem, 'id' | 'usagePeriods' | 'meteringPointId'> & { usagePeriods: UsagePeriodTemplate[] }

export interface PredefinedProfile {
  id: string
  title: string
  description: string
  items: HouseholdItemTemplate[]
}

const { minDate, maxDate } = getAllowedUsageDateRange()

export const predefinedProfiles: PredefinedProfile[] = [
  {
    id: 'profil1',
    title: 'Kis lakás',
    description: 'Alacsony fogyasztású, egy-két fős háztartásokra illő profil.',
    items: [
      {
        name: 'Hűtőszekrény',
        count: 1,
        consumption: 110,
        dutyCycle: 0.4,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: true, 
            startTime: '00:00', 
            endTime: '23:59' 
          },
        ],
      },
      {
        name: 'Villanybojler',
        count: 1,
        consumption: 1400,
        dutyCycle: 0.08,
        usagePeriods: [
          {
            wholeYear: true,
            startDate: minDate,
            endDate: maxDate,
            wholeDay: true,
            startTime: '00:00',
            endTime: '23:59'
          },
        ],
      },
      {
        name: 'Világítótest',
        count: 5,
        consumption: 10,
        dutyCycle: 1,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: false, 
            startTime: '18:00', 
            endTime: '23:00', 
            condition: { type: 'isdayornight', comparator: 'isnight' },
          },
        ],
      },
      {
        name: 'Televízió',
        count: 1,
        consumption: 110,
        dutyCycle: 1,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: false, 
            startTime: '19:00', 
            endTime: '22:00' 
          },
        ],
      },
      {
        name: 'Laptop',
        count: 1,
        consumption: 100,
        dutyCycle: 1,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: false, 
            startTime: '19:00', 
            endTime: '22:00' 
          },
        ],
      },
      {
        name: 'Villanytűzhely',
        count: 1,
        consumption: 2000,
        dutyCycle: 0.15,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: false, 
            startTime: '18:00', 
            endTime: '19:00' 
          },
        ],
      },
      {
        name: 'Mosógép',
        count: 1,
        consumption: 2000,
        dutyCycle: 0.1,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: false, 
            startTime: '19:00', 
            endTime: '21:00' 
          },
        ],
      },
      {
        name: 'Elektroikai eszközök készenléti fogyasztása (pl. router)',
        count: 1,
        consumption: 30,
        dutyCycle: 1,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: true, 
            startTime: '00:00', 
            endTime: '23:59' 
          },
        ],
      },
      {
        name: 'Egyéb kisebb fogyasztók összesítve',
        count: 1,
        consumption: 250,
        dutyCycle: 0.1,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: false, 
            startTime: '07:00', 
            endTime: '09:00' 
          },
        ],
      },
    ],
  },
  {
    id: 'profil2',
    title: 'Átlagos családi ház',
    description: 'Több fős, tipikus családi ház fogyasztási szokásait modellező profil.',
    items: [
      {
        name: 'Hűtőszekrény',
        count: 1,
        consumption: 110,
        dutyCycle: 0.4,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: true, 
            startTime: '00:00', 
            endTime: '23:59' 
          },
        ],
      },
      {
        name: 'Villanybojler',
        count: 1,
        consumption: 2000,
        dutyCycle: 0.1,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: true, 
            startTime: '00:00', 
            endTime: '23:59' 
          },
        ],
      },
      {
        name: 'Világítótest',
        count: 8,
        consumption: 10,
        dutyCycle: 1,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: false, 
            startTime: '18:00', 
            endTime: '23:00', 
            condition: { type: 'isdayornight', comparator: 'isnight' },
          },
        ],
      },
      {
        name: 'Televízió',
        count: 2,
        consumption: 120,
        dutyCycle: 0.6,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: false, 
            startTime: '19:00', 
            endTime: '23:00' 
          },
        ],
      },
      {
        name: 'PC + monitor(ok)',
        count: 1,
        consumption: 250,
        dutyCycle: 0.6,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: false, 
            startTime: '18:00', 
            endTime: '22:00' 
          },
        ],
      },
      {
        name: 'Mosógép',
        count: 1,
        consumption: 2100,
        dutyCycle: 0.15,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: false, 
            startTime: '19:00', 
            endTime: '21:00' 
          },
        ],
      },
      {
        name: 'Mosogatógép',
        count: 1,
        consumption: 1800,
        dutyCycle: 0.2,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: false, 
            startTime: '20:00', 
            endTime: '22:00' 
          },
        ],
      },
      {
        name: 'Egyéb kisebb fogyasztók összesítve',
        count: 1,
        consumption: 350,
        dutyCycle: 0.15,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: false, 
            startTime: '07:00', 
            endTime: '09:00' 
          },
        ],
      },
    ],
  },
  {
    id: 'profil3',
    title: 'Nagy fogyasztású háztartás',
    description: 'Elektromos autóval és fűtéssel rendelkező háztartásra jellemző, magas fogyasztású profil.',
    items: [
      {
        name: 'Légkondícionáló (hűtő üzemmód)',
        count: 1,
        consumption: 1200,
        dutyCycle: 0.35,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: true, 
            startTime: '00:00', 
            endTime: '23:59', 
            condition: { type: 'temperature', comparator: '>=', threshold: 25 },
          },
        ],
      },
      {
        name: 'Légkondícionáló (fűtő üzemmód)',
        count: 1,
        consumption: 1400,
        dutyCycle: 0.35,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: true, 
            startTime: '00:00', 
            endTime: '23:59', 
            condition: { type: 'temperature', comparator: '<=', threshold: 10 },
          },
        ],
      },
      {
        name: 'EV töltő',
        count: 1,
        consumption: 7400,
        dutyCycle: 0.06,
        usagePeriods: [
          { wholeYear: true, startDate: minDate, endDate: maxDate, wholeDay: false, startTime: '20:00', endTime: '23:59' },
          { wholeYear: true, startDate: minDate, endDate: maxDate, wholeDay: false, startTime: '00:00', endTime: '06:00' },
        ],
      },
      {
        name: 'Villanybojler',
        count: 1,
        consumption: 2000,
        dutyCycle: 0.1,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: true, 
            startTime: '00:00', 
            endTime: '23:59' 
          },
        ],
      },
      {
        name: 'Mosógép',
        count: 1,
        consumption: 2200,
        dutyCycle: 0.15,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: false, 
            startTime: '19:00', 
            endTime: '21:00' 
          },
        ],
      },
      {
        name: 'Mosogatógép',
        count: 1,
        consumption: 1800,
        dutyCycle: 0.2,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: false, 
            startTime: '20:00', 
            endTime: '22:00' 
          },
        ],
      },
      {
        name: 'Hűtőszekrény',
        count: 2,
        consumption: 150,
        dutyCycle: 0.3,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: true, 
            startTime: '00:00', 
            endTime: '23:59' 
          },
        ],
      },
      {
        name: 'Villanysütő',
        count: 1,
        consumption: 2500,
        dutyCycle: 0.15,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: false, 
            startTime: '17:00', 
            endTime: '18:30' 
          },
        ],
      },
      {
        name: 'Világítótest',
        count: 10,
        consumption: 8,
        dutyCycle: 1,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: false, 
            startTime: '18:00', 
            endTime: '23:00', 
            condition: { type: 'isdayornight', comparator: 'isnight' },
          },
        ],
      },
      {
        name: 'Televízió',
        count: 2,
        consumption: 100,
        dutyCycle: 1,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: false, 
            startTime: '19:00', 
            endTime: '23:00' 
          },
        ],
      },
      {
        name: 'PC + monitor(ok)',
        count: 2,
        consumption: 400,
        dutyCycle: 0.5,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: false, 
            startTime: '19:00', 
            endTime: '22:00' 
          },
        ],
      },
      {
        name: 'Játékkonzol',
        count: 2,
        consumption: 200,
        dutyCycle: 0.3,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: false, 
            startTime: '17:00', 
            endTime: '21:00' 
          },
        ],
      },
      {
        name: 'Egyéb kisebb fogyasztók összesítve',
        count: 1,
        consumption: 400,
        dutyCycle: 0.1,
        usagePeriods: [
          { 
            wholeYear: true, 
            startDate: minDate, 
            endDate: maxDate, 
            wholeDay: false, 
            startTime: '07:00', 
            endTime: '09:00' 
          },
        ],
      },
    ],
  },
]
