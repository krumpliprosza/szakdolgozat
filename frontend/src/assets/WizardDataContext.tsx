import { createContext, useContext, useState, type ReactNode } from 'react'

export interface WizardData {
  location: { lat: number; lon: number } | null
  // TODO: systemParams, consumptionProfile hozzaadasa
}

interface WizardDataContextValue {
  data: WizardData
  setData: (patch: Partial<WizardData>) => void
}

const WizardDataContext = createContext<WizardDataContextValue | null>(null)

export const WizardDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setDataState] = useState<WizardData>({ location: null })

  const setData = (patch: Partial<WizardData>) =>
    setDataState((prev) => ({ ...prev, ...patch }))

  return (
    <WizardDataContext.Provider value={{ data, setData }}>
      {children}
    </WizardDataContext.Provider>
  )
}

export const useWizardData = () => {
  const ctx = useContext(WizardDataContext)
  if (!ctx) throw new Error('Hiba')
  return ctx
}