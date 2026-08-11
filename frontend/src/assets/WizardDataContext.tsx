import { createContext, useContext, useState, type ReactNode } from 'react'

const currentYear = new Date().getFullYear()

export type TrackingType = 'fixed' | 'single_axis' | 'dual_axis'

export type SapmMountType = 'open_rack_glass_glass' | 'close_mount_glass_glass' | 'open_rack_glass_polymer' | 'insulated_back_glass_polymer'

export interface SystemParams {
  orientation: {
    trackingType: TrackingType
    surfaceTiltDeg: number
    surfaceAzimuthDeg: number
    axisTiltDeg: number
    axisAzimuthDeg: number
    maxTrackingAngleDeg: number
    groundCoverageRatio: number
  }
  module: {
    pStcW: number
    gammaPdc: number
    sapmMountType: SapmMountType
    isBifacial: boolean
    bifaciality: number
    iamB0: number
  }
  inverter: {
    pAcNomW: number
    inverterEfficiencyNom: number
  }
  losses: {
    lResistance: number
    lMismatch: number
    installYear: number | null
    annualDegradationRate: number
    soilingMaxLoss: number
    lShadeConstant: number
  }
  albedo: {
    groundAlbedo: number
  }
  battery: {
    capacityKwh: number
    soc0: number
    socMin: number
    socMax: number
    pChargeMaxKw: number
    pDischargeMaxKw: number
    etaCharge: number
    etaDischarge: number
  }
}

export const defaultSystemParams: SystemParams = {
  orientation: {
    trackingType: 'fixed',
    surfaceTiltDeg: 35,
    surfaceAzimuthDeg: 180,
    axisTiltDeg: 0,
    axisAzimuthDeg: 180,
    maxTrackingAngleDeg: 60,
    groundCoverageRatio: 0.35,
  },
  module: {
    pStcW: 5000,
    gammaPdc: -0.004,
    sapmMountType: 'open_rack_glass_glass',
    isBifacial: false,
    bifaciality: 0.8,
    iamB0: 0.05,
  },
  inverter: {
    pAcNomW: 4800,
    inverterEfficiencyNom: 0.96,
  },
  losses: {
    lResistance: 0.02,
    lMismatch: 0.02,
    installYear: currentYear,
    annualDegradationRate: 0.005,
    soilingMaxLoss: 0.06,
    lShadeConstant: 0,
  },
  albedo: {
    groundAlbedo: 0.2,
  },
  battery: {
    capacityKwh: 10,
    soc0: 0.5,
    socMin: 0.1,
    socMax: 0.9,
    pChargeMaxKw: 3,
    pDischargeMaxKw: 3,
    etaCharge: 0.97,
    etaDischarge: 0.97,
  },
}

export type SystemParamsMode = 'predefined' | 'custom' | null

export interface WizardData {
  location: { lat: number; lon: number } | null
  systemParams: SystemParams | null
  systemParamsMode: SystemParamsMode
  selectedPredefinedSystemId: string | null
  // TODO: consumptionProfile hozzaadasa
}

interface WizardDataContextValue {
  data: WizardData
  setData: (patch: Partial<WizardData>) => void
}

const WizardDataContext = createContext<WizardDataContextValue | null>(null)

export const WizardDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setDataState] = useState<WizardData>({ location: null, systemParams: null, systemParamsMode: null, selectedPredefinedSystemId: null })

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