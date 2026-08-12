import { currentYear, type SystemParams } from '../../../steps/WizardDataContext'

// Leiras: Elore definialt napelemrendszerek adatai.

export interface PredefinedSystem {
  id: string
  title: string
  description: string
  params: SystemParams
}

export const predefinedSystems: PredefinedSystem[] = [
  {
    id: 'rendszer1',
    title: 'Kompakt otthoni rendszer',
    description: 'Kisebb, tetőre szerelt rendszer családi házakhoz, mérsékelt fogyasztás mellett. Kis akkumulátorral rendelkezik, alacsony kezdeti beruházási költségű.',
    params: {
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
        pStcW: 3000,
        gammaPdc: -0.0035,
        sapmMountType: 'close_mount_glass_glass',
        isBifacial: false,
        bifaciality: 0.8,
        iamB0: 0.05,
      },
      inverter: {
        pAcNomW: 3000,
        inverterEfficiencyNom: 0.95,
      },
      losses: {
        lResistance: 0.02,
        lMismatch: 0.02,
        installYear: currentYear,
        annualDegradationRate: 0.005,
        soilingMaxLoss: 0.05,
        lShadeConstant: 0,
      },
      albedo: {
        groundAlbedo: 0.2,
      },
      battery: {
        capacityKwh: 7,
        soc0: 0.5,
        socMin: 0.1,
        socMax: 0.9,
        pChargeMaxKw: 2,
        pDischargeMaxKw: 2,
        etaCharge: 0.97,
        etaDischarge: 0.97,
      },
    },
  },
  {
    id: 'rendszer2',
    title: 'Családi házas rendszer akkumulátorral',
    description: 'Közepes méretű, fix tájolású rendszer, közepes akkumulátorral kiegészítve a nagyobb önfogyasztási arány elérése érdekében. A legtöbb családi ház igényét jól lefedi.',
    params: {
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
        pAcNomW: 5000,
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
        capacityKwh: 12,
        soc0: 0.5,
        socMin: 0.1,
        socMax: 0.9,
        pChargeMaxKw: 3,
        pDischargeMaxKw: 3,
        etaCharge: 0.97,
        etaDischarge: 0.97,
      },
    },
  },
  {
    id: 'rendszer3',
    title: 'Nagyteljesítményű, napkövető rendszer',
    description: 'Egytengelyes napkövetéssel és kétoldalas (bifaciális) modulokkal szerelt, nagyobb teljesítményű rendszer, nagy akkumulátoros kapacitással. Magasabb hozam, nagyobb terület- és beruházási igény mellett.',
    params: {
      orientation: {
        trackingType: 'single_axis',
        surfaceTiltDeg: 35,
        surfaceAzimuthDeg: 180,
        axisTiltDeg: 0,
        axisAzimuthDeg: 180,
        maxTrackingAngleDeg: 60,
        groundCoverageRatio: 0.35,
      },
      module: {
        pStcW: 8000,
        gammaPdc: -0.0038,
        sapmMountType: 'open_rack_glass_glass',
        isBifacial: true,
        bifaciality: 0.85,
        iamB0: 0.017,
      },
      inverter: {
        pAcNomW: 8000,
        inverterEfficiencyNom: 0.97,
      },
      losses: {
        lResistance: 0.02,
        lMismatch: 0.02,
        installYear: currentYear,
        annualDegradationRate: 0.004,
        soilingMaxLoss: 0.06,
        lShadeConstant: 0,
      },
      albedo: {
        groundAlbedo: 0.2,
      },
      battery: {
        capacityKwh: 15,
        soc0: 0.5,
        socMin: 0.1,
        socMax: 0.9,
        pChargeMaxKw: 5,
        pDischargeMaxKw: 5,
        etaCharge: 0.97,
        etaDischarge: 0.97,
      },
    },
  },
]
