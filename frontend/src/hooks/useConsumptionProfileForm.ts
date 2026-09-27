import { useState } from 'react'
import type { HouseholdItem, UsagePeriod } from '../steps/WizardDataContext'
import { getAllowedUsageDateRange } from '../components/DateRange'

// Leiras: a Sajat fogyasztasi profil osszeallitasa urlapot kezeli.

// Tetelenkent ennyi hasznalati idotartam adhato meg
export const MAX_USAGE_PERIODS = 5

// Ket idopont kozti minimum tavolsag (idolepesek miatt)
export const MIN_USAGE_TIME_GAP_IN_MINUTES = 15

// Idopont percekre alakitasa
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// Datumok ellenorzese
export const isUsagePeriodDateRangeFilled = (period: UsagePeriod): boolean => {
  return period.wholeYear || (period.startDate !== '' && period.endDate !== '')
}

// Idotartamok ellenorzese
export const isUsagePeriodTimeRangeValid = (period: UsagePeriod): boolean => {
  return period.wholeDay || (timeToMinutes(period.endTime) - MIN_USAGE_TIME_GAP_IN_MINUTES >= timeToMinutes(period.startTime))
}

// Egy fogyaszto hibakezelese
export const getHouseholdItemError = (item: HouseholdItem): string | null => {
  if (item.name.trim() === '') {
    return `Adj nevet minden fogyasztónak!`
  }
  if (item.consumption === 0) {
    return `A(z) "${item.name}" elem fogyasztása csak pozitív szám lehet!`
  }
  if (item.usagePeriods.length === 0) {
    return `A(z) "${item.name}" elemhez nem tartozik felhasználási idő!`
  }
  for (const period of item.usagePeriods) {
    if (!isUsagePeriodDateRangeFilled(period)) {
      return `A(z) "${item.name}" elem egyik felhasználási időtartama esetén a kezdési dátum vagy a befejezési dátum üresen lett hagyva!`
    }
    if (!isUsagePeriodTimeRangeValid(period)) {
      return `A(z) "${item.name}" elem egyik felhasználási időtartama esetén a kezdési időnek legalább 15 perccel korábbinak kell lennie, mint a befejezési időnek!`
    }
  }
  return null
}

// A fogyasztok listajara vonatkozo hibakezeles
export const getHouseholdItemsError = (items: HouseholdItem[] | null): string | null => {
  if (!items || items.length === 0) {
    return 'Legalább egy elemet adj hozzá a fogyasztók listájához!'
  }
  const names = items.map((item) => item.name.trim().toLowerCase())
  if (new Set(names).size !== names.length) {
    return 'Nem lehet két egyező nevű fogyasztó a listában!'
  }
  for (const item of items) {
    const error = getHouseholdItemError(item)
    if (error) {
      return error
    }
  }
  return null
}

// Egyedi azonosito generalasa uj elemekhez
const makeId = () => Math.random().toString(36).slice(2, 10)

// Uj hasznalati idotartam alapertelmezett ertekekkel
const createEmptyPeriod = (): UsagePeriod => {
  const { minDate, maxDate } = getAllowedUsageDateRange()
  return {
    id: makeId(),
    wholeYear: true,
    startDate: minDate,
    endDate: maxDate,
    wholeDay: true,
    startTime: '00:00',
    endTime: '23:59',
  }
}

// Egy uj elemnek egyedi nevet ad at
const makeUniqueName = (existing: HouseholdItem[], base: string) => {
  const taken = new Set(existing.map((item) => item.name.trim().toLowerCase()))
  if (!taken.has(base.toLowerCase())) return base
  let i = 2
  while (taken.has(`${base} ${i}`.toLowerCase())) i++
  return `${base} ${i}`
}

// Uj fogyaszto alapertelmezett ertekekkel
const createEmptyItem = (existing: HouseholdItem[], meteringPointId: string): HouseholdItem => ({
  id: makeId(),
  name: makeUniqueName(existing, 'Új eszköz'),
  count: 1,
  consumption: 0,
  dutyCycle: 1,
  usagePeriods: [createEmptyPeriod()],
  meteringPointId,
})

export function useConsumptionProfileForm(initial?: HouseholdItem[] | null, defaultMeteringPointId?: string) {
  const [items, setItems] = useState<HouseholdItem[]>(initial ?? [])

  // Tetel hozzaadasa
  const addItem = () => {
    setItems((prev) => [...prev, createEmptyItem(prev, defaultMeteringPointId ?? '')])
  }

  // Tetel adatainak frissitese
  const updateItem = (id: string, patch: Partial<Omit<HouseholdItem, 'id' | 'usagePeriods'>>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  // Tetel torlese
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  // Hasznalati idotartam hozzaadasa
  const addUsagePeriod = (itemId: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId && item.usagePeriods.length < MAX_USAGE_PERIODS ? { ...item, usagePeriods: [...item.usagePeriods, createEmptyPeriod()] } : item))
    )
  }

  // Hasznalati idotartam frissitese
  const updateUsagePeriod = (itemId: string, periodId: string, patch: Partial<UsagePeriod>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, usagePeriods: item.usagePeriods.map((p) => (p.id === periodId ? { ...p, ...patch } : p)) }
          : item
      )
    )
  }

  // Hasznalati idotartam torlese
  const removeUsagePeriod = (itemId: string, periodId: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, usagePeriods: item.usagePeriods.filter((p) => p.id !== periodId) } : item))
    )
  }

  // Megvizsgalja, hogy a megadott nevet mar hasznalja-e egy masik tetel
  const isNameTaken = (id: string, name: string) => items.some((item) => item.id !== id && item.name.trim().toLowerCase() === name.trim().toLowerCase() && name.trim() !== '')

  // A teljes fogyasztasi profil lecserelese
  const loadItems = (newItems: Array<Omit<HouseholdItem, 'id' | 'usagePeriods' | 'meteringPointId'> & { usagePeriods: Array<Omit<UsagePeriod, 'id'>> }>, meteringPointId: string) => {
    setItems(
      newItems.map((item) => ({
        ...item,
        id: makeId(),
        meteringPointId,
        usagePeriods: item.usagePeriods.map((period) => ({ ...period, id: makeId() })),
      }))
    )
  }

  return {
    items,
    addItem,
    updateItem,
    removeItem,
    addUsagePeriod,
    updateUsagePeriod,
    removeUsagePeriod,
    isNameTaken,
    loadItems,
  }
}
