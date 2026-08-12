// Leiras: A hasznalati idotartamok szamara engedelyezett datumhatarok szamitasa.

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10)

export interface AllowedUsageDateRange {
  minDate: string
  maxDate: string
}

// A hasznalati idotartamok datum mezoihez tartozo engedelyezett tartomanyt adja vissza
export const getAllowedUsageDateRange = (): AllowedUsageDateRange => {
  const max = new Date()
  max.setDate(max.getDate() - 1) // tegnapi nap

  const min = new Date(max)
  min.setMonth(min.getMonth() - 12) // tegnap - 1 ev

  return { minDate: toIsoDate(min), maxDate: toIsoDate(max) }
}
