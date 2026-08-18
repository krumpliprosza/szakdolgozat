import { getAllowedUsageDateRange } from "../../../components/DateRange"
import type { HouseholdItem, UsagePeriod } from "../../../steps/WizardDataContext"

// Leiras: Elore meghatarozott fogyasztasi profilok adatai.

type UsagePeriodTemplate = Omit<UsagePeriod, 'id'>
type HouseholdItemTemplate = Omit<HouseholdItem, 'id' | 'usagePeriods'> & { usagePeriods: UsagePeriodTemplate[] }

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
        name: 'A',
        count: 1,
        consumption: 1,
        usagePeriods: [
          { wholeYear: true, startDate: minDate, endDate: maxDate, wholeDay: true, startTime: '00:00', endTime: '23:59' },
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
        name: 'B',
        count: 1,
        consumption: 2,
        usagePeriods: [
          { wholeYear: true, startDate: minDate, endDate: maxDate, wholeDay: true, startTime: '00:00', endTime: '23:59' },
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
        consumption: 3,
        usagePeriods: [
          { wholeYear: true, startDate: minDate, endDate: maxDate, wholeDay: true, startTime: '00:00', endTime: '23:59' },
        ],
      },
      {
        name: 'Légkondícionáló (fűtő üzemmód)',
        count: 1,
        consumption: 3,
        usagePeriods: [
          { wholeYear: true, startDate: minDate, endDate: maxDate, wholeDay: true, startTime: '00:00', endTime: '23:59' },
        ],
      },
      {
        name: 'EV töltő',
        count: 1,
        consumption: 3,
        usagePeriods: [
          { wholeYear: true, startDate: minDate, endDate: maxDate, wholeDay: true, startTime: '00:00', endTime: '23:59' },
        ],
      },
      {
        name: 'Villanybojler',
        count: 1,
        consumption: 3,
        usagePeriods: [
          { wholeYear: true, startDate: minDate, endDate: maxDate, wholeDay: true, startTime: '00:00', endTime: '23:59' },
        ],
      },
      {
        name: 'Ruhaszárító',
        count: 1,
        consumption: 3,
        usagePeriods: [
          { wholeYear: true, startDate: minDate, endDate: maxDate, wholeDay: true, startTime: '00:00', endTime: '23:59' },
        ],
      },
      {
        name: 'Mosógép',
        count: 1,
        consumption: 3,
        usagePeriods: [
          { wholeYear: true, startDate: minDate, endDate: maxDate, wholeDay: true, startTime: '00:00', endTime: '23:59' },
        ],
      },
      {
        name: 'Mosogatógép',
        count: 1,
        consumption: 3,
        usagePeriods: [
          { wholeYear: true, startDate: minDate, endDate: maxDate, wholeDay: true, startTime: '00:00', endTime: '23:59' },
        ],
      },
      {
        name: 'Hűtőszekrény',
        count: 1,
        consumption: 3,
        usagePeriods: [
          { wholeYear: true, startDate: minDate, endDate: maxDate, wholeDay: true, startTime: '00:00', endTime: '23:59' },
        ],
      },
      {
        name: 'Villanysütő',
        count: 1,
        consumption: 3,
        usagePeriods: [
          { wholeYear: true, startDate: minDate, endDate: maxDate, wholeDay: true, startTime: '00:00', endTime: '23:59' },
        ],
      },
      {
        name: 'Világítótest',
        count: 1,
        consumption: 3,
        usagePeriods: [
          { wholeYear: true, startDate: minDate, endDate: maxDate, wholeDay: true, startTime: '00:00', endTime: '23:59' },
        ],
      },
      {
        name: 'Televízió',
        count: 1,
        consumption: 3,
        usagePeriods: [
          { wholeYear: true, startDate: minDate, endDate: maxDate, wholeDay: true, startTime: '00:00', endTime: '23:59' },
        ],
      },
      {
        name: 'PC + monitor(ok)',
        count: 1,
        consumption: 3,
        usagePeriods: [
          { wholeYear: true, startDate: minDate, endDate: maxDate, wholeDay: true, startTime: '00:00', endTime: '23:59' },
        ],
      },
      {
        name: 'Játékkonzol',
        count: 1,
        consumption: 3,
        usagePeriods: [
          { wholeYear: true, startDate: minDate, endDate: maxDate, wholeDay: true, startTime: '00:00', endTime: '23:59' },
        ],
      },
      {
        name: 'Egyéb kisebb fogyasztók összesítve',
        count: 1,
        consumption: 3,
        usagePeriods: [
          { wholeYear: true, startDate: minDate, endDate: maxDate, wholeDay: true, startTime: '00:00', endTime: '23:59' },
        ],
      },
    ],
  },
]
