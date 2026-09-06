import { createContext, useContext, useState, type ReactNode } from 'react'

// Leiras: A szimulaciohoz szukseges adatok adatait es tipusait gyujti ossze.

export const currentYear = new Date().getFullYear()
export type TrackingType = 'fixed' | 'single_axis' | 'dual_axis'
export type MountType = 'open_rack_glass_glass' | 'close_mount_glass_glass' | 'open_rack_glass_polymer' | 'insulated_back_glass_polymer'
export type SystemParametersMode = 'predefined' | 'custom' | null
export type ConsumptionProfileMode = 'predefined' | 'custom' | null

// Napelemrendszer parameterei
export interface SystemParameters {
  orientation: {
    trackingType: TrackingType
    surfaceTilt: number
    surfaceAzimuth: number
    axisTilt: number
    axisAzimuth: number
    maxTrackingAngle: number
    groundCoverageRatio: number
  }
  module: {
    pStc: number
    gammaPdc: number
    mountType: MountType
    isBifacial: boolean
    bifaciality: number
    iamB0: number
  }
  inverter: {
    pAc: number
    inverterEfficiency: number
  }
  losses: {
    lResistance: number
    lMismatch: number
    installYear: number | null
    annualDegradationRate: number
    lSoilingMax: number
    lShade: number
  }
  albedo: {
    albedo: number
  }
  battery: {
    capacity: number
    soc0: number
    socMin: number
    socMax: number
    pChargeMax: number
    pDischargeMax: number
    etaCharge: number
    etaDischarge: number
  }
}

export const defaultSystemParameters: SystemParameters = {
  orientation: {
    trackingType: 'fixed',
    surfaceTilt: 35,
    surfaceAzimuth: 180,
    axisTilt: 0,
    axisAzimuth: 180,
    maxTrackingAngle: 60,
    groundCoverageRatio: 0.35,
  },
  module: {
    pStc: 5000,
    gammaPdc: -0.004,
    mountType: 'open_rack_glass_glass',
    isBifacial: false,
    bifaciality: 0.8,
    iamB0: 0.05,
  },
  inverter: {
    pAc: 4800,
    inverterEfficiency: 0.96,
  },
  losses: {
    lResistance: 0.02,
    lMismatch: 0.02,
    installYear: currentYear,
    annualDegradationRate: 0.005,
    lSoilingMax: 0.06,
    lShade: 0,
  },
  albedo: {
    albedo: 0.2,
  },
  battery: {
    capacity: 10,
    soc0: 0.5,
    socMin: 0.1,
    socMax: 0.9,
    pChargeMax: 3,
    pDischargeMax: 3,
    etaCharge: 0.97,
    etaDischarge: 0.97,
  },
}

// Homersekleti feltetel
export interface TemperatureCondition {
  type: 'temperature'
  comparator: '>=' | '>' | '<=' | '<'
  threshold: number
}

// Napszak feltetel
export interface IsDayOrNightCondition {
  type: 'isdayornight'
  comparator: 'isday' | 'isnight'
  threshold: number
}

// Felhasznalasi idotartamhoz feltetelek osszegyujtese
export type UsageCondition = TemperatureCondition | IsDayOrNightCondition

// Felhasznalasi idotartam
export interface UsagePeriod {
  id: string
  wholeYear: boolean
  startDate: string
  endDate: string
  wholeDay: boolean
  startTime: string
  endTime: string
  condition?: UsageCondition
}

// A fogyasztas egy adott eleme
export interface HouseholdItem {
  id: string
  name: string
  count: number
  consumption: number
  dutyCycle: number
  usagePeriods: UsagePeriod[]
}

// A teljes szimulacio bemeneti adatai
export interface WizardData {
  location: { latitude: number; longitude: number } | null
  systemParameters: SystemParameters | null
  systemParametersMode: SystemParametersMode
  selectedPredefinedSystemId: string | null
  consumptionProfileMode: ConsumptionProfileMode
  selectedPredefinedProfileId: string | null
  HouseholdItems: HouseholdItem[] | null
}

interface WizardDataContextValue {
  data: WizardData
  setData: (patch: Partial<WizardData>) => void
}

const WizardDataContext = createContext<WizardDataContextValue | null>(null)

// A varazslo adatait biztositja minden lepesben
export const WizardDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setDataState] = useState<WizardData>({ 
    location: null, 
    systemParameters: null, 
    systemParametersMode: null, 
    selectedPredefinedSystemId: null, 
    consumptionProfileMode: null, 
    selectedPredefinedProfileId: null, 
    HouseholdItems: [], 
  })

  const setData = (patch: Partial<WizardData>) =>
    setDataState((prev) => ({ ...prev, ...patch }))

  return (
    <WizardDataContext.Provider value={{ data, setData }}>
      {children}
    </WizardDataContext.Provider>
  )
}

// Segedelem: a WizardDataContext egyszerubb elereset biztositja
export const useWizardData = () => {
  const context = useContext(WizardDataContext)
  if (!context) throw new Error('Hiba')
  return context
}