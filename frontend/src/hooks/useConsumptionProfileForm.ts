import { useState } from 'react'
import type { ConsumptionItem, ConsumptionUsagePeriod } from '../steps/WizardDataContext'
import { getAllowedUsageDateRange } from '../components/DateRange'

// Leiras: a Sajat fogyasztasi profil osszeallitasa urlapot kezeli.

// Tetelenkent ennyi hasznalati idotartam adhato meg
export const MAX_USAGE_PERIODS = 5

// Egyedi azonosito generalasa uj elemekhez
const makeId = () => Math.random().toString(36).slice(2, 10)

// Uj hasznalati idotartam alapertelmezett ertekekkel
const createEmptyPeriod = (): ConsumptionUsagePeriod => {
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
const makeUniqueName = (existing: ConsumptionItem[], base: string) => {
  const taken = new Set(existing.map((it) => it.name.trim().toLowerCase()))
  if (!taken.has(base.toLowerCase())) return base
  let i = 2
  while (taken.has(`${base} ${i}`.toLowerCase())) i++
  return `${base} ${i}`
}

// Uj fogyaszto alapertelmezett ertekekkel
const createEmptyItem = (existing: ConsumptionItem[]): ConsumptionItem => ({
  id: makeId(),
  name: makeUniqueName(existing, 'Új eszköz'),
  count: 1,
  consumptionW: 0,
  usagePeriods: [createEmptyPeriod()],
})

export function useConsumptionProfileForm(initial?: ConsumptionItem[] | null) {
  const [items, setItems] = useState<ConsumptionItem[]>(initial ?? [])

  // Tetel hozzaadasa
  const addItem = () => {
    setItems((prev) => [...prev, createEmptyItem(prev)])
  }

  // Tetel adatainak frissitese
  const updateItem = (id: string, patch: Partial<Omit<ConsumptionItem, 'id' | 'usagePeriods'>>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }

  // Tetel torlese
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }

  // Hasznalati idotartam hozzaadasa
  const addUsagePeriod = (itemId: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId && it.usagePeriods.length < MAX_USAGE_PERIODS ? { ...it, usagePeriods: [...it.usagePeriods, createEmptyPeriod()] } : it))
    )
  }

  // Hasznalati idotartam frissitese
  const updateUsagePeriod = (itemId: string, periodId: string, patch: Partial<ConsumptionUsagePeriod>) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? { ...it, usagePeriods: it.usagePeriods.map((p) => (p.id === periodId ? { ...p, ...patch } : p)) }
          : it
      )
    )
  }

  // Hasznalati idotartam torlese
  const removeUsagePeriod = (itemId: string, periodId: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, usagePeriods: it.usagePeriods.filter((p) => p.id !== periodId) } : it))
    )
  }

  // Megvizsgalja, hogy a megadott nevet mar hasznalja-e egy masik tetel
  const isNameTaken = (id: string, name: string) => items.some((it) => it.id !== id && it.name.trim().toLowerCase() === name.trim().toLowerCase() && name.trim() !== '')

  return {
    items,
    addItem,
    updateItem,
    removeItem,
    addUsagePeriod,
    updateUsagePeriod,
    removeUsagePeriod,
    isNameTaken,
  }
}
