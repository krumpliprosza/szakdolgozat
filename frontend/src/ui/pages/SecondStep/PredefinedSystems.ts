import { currentYear, type SystemParameters } from '../../../steps/WizardDataContext'

// Leiras: Elore definialt napelemrendszerek adatai.

export interface PredefinedSystem {
  id: string
  title: string
  description: string
  parameters: SystemParameters
}

export const predefinedSystems: PredefinedSystem[] = [
  {
    id: 'rendszer1',
    title: 'Kompakt otthoni rendszer',
    description: 'Kisebb, tetőre szerelt rendszer családi házakhoz mérsékelt fogyasztás mellett. Kis akkumulátorral rendelkezik, így alacsony kezdeti beruházási költségű.',
    parameters: {
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
        pStc: 3000,
        gammaPdc: -0.0035,
        mountType: 'insulated',
        isBifacial: false,
        bifaciality: 0.8,
        iamB0: 0.05,
      },
      inverter: {
        pAc: 3000,
        inverterEfficiency: 0.95,
      },
      losses: {
        lResistance: 0.02,
        lMismatch: 0.02,
        installYear: currentYear,
        annualDegradationRate: 0.005,
        lSoilingMax: 0.05,
        lShade: 0,
      },
      albedo: {
        albedo: 0.2,
      },
      battery: {
        capacity: 7,
        soc0: 0.5,
        socMin: 0.1,
        socMax: 0.9,
        pChargeMax: 2,
        pDischargeMax: 2,
        etaCharge: 0.97,
        etaDischarge: 0.97,
      },
    },
  },
  {
    id: 'rendszer2',
    title: 'Családi házas rendszer akkumulátorral',
    description: 'Közepes méretű, fix tájolású rendszer, közepes akkumulátorral kiegészítve a nagyobb önfogyasztási arány elérése érdekében. A legtöbb családi ház igényét jól lefedi.',
    parameters: {
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
        mountType: 'freestanding',
        isBifacial: false,
        bifaciality: 0.8,
        iamB0: 0.05,
      },
      inverter: {
        pAc: 5000,
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
        capacity: 12,
        soc0: 0.5,
        socMin: 0.1,
        socMax: 0.9,
        pChargeMax: 3,
        pDischargeMax: 3,
        etaCharge: 0.97,
        etaDischarge: 0.97,
      },
    },
  },
  {
    id: 'rendszer3',
    title: 'Nagyteljesítményű, napkövető rendszer',
    description: 'Egytengelyes napkövetéssel és kétoldalas modulokkal szerelt, nagyobb teljesítményű rendszer, nagy kapacitású akkumulátorral. Ez egy magasabb hozamot biztosító, nagyobb beruházási igényű rendszer.',
    parameters: {
      orientation: {
        trackingType: 'single_axis',
        surfaceTilt: 35,
        surfaceAzimuth: 180,
        axisTilt: 0,
        axisAzimuth: 180,
        maxTrackingAngle: 60,
        groundCoverageRatio: 0.35,
      },
      module: {
        pStc: 8000,
        gammaPdc: -0.0038,
        mountType: 'freestanding',
        isBifacial: true,
        bifaciality: 0.85,
        iamB0: 0.017,
      },
      inverter: {
        pAc: 8000,
        inverterEfficiency: 0.97,
      },
      losses: {
        lResistance: 0.02,
        lMismatch: 0.02,
        installYear: currentYear,
        annualDegradationRate: 0.004,
        lSoilingMax: 0.06,
        lShade: 0,
      },
      albedo: {
        albedo: 0.2,
      },
      battery: {
        capacity: 15,
        soc0: 0.5,
        socMin: 0.1,
        socMax: 0.9,
        pChargeMax: 5,
        pDischargeMax: 5,
        etaCharge: 0.97,
        etaDischarge: 0.97,
      },
    },
  },
]
