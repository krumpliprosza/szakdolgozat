import { useState } from 'react'
import { defaultSystemParams, type SystemParams } from '../assets/WizardDataContext'

// Leiras: a Sajat rendszer parameterezese urlap allapotat kezeli.

export function useSystemParamsForm(initial?: SystemParams | null) {
  const [params, setParams] = useState<SystemParams>(initial ?? defaultSystemParams)

  const patchOrientation = (patch: Partial<SystemParams['orientation']>) =>
    setParams((prev) => ({ ...prev, orientation: { ...prev.orientation, ...patch } }))

  const patchModule = (patch: Partial<SystemParams['module']>) =>
    setParams((prev) => ({ ...prev, module: { ...prev.module, ...patch } }))

  const patchInverter = (patch: Partial<SystemParams['inverter']>) =>
    setParams((prev) => ({ ...prev, inverter: { ...prev.inverter, ...patch } }))

  const patchLosses = (patch: Partial<SystemParams['losses']>) =>
    setParams((prev) => ({ ...prev, losses: { ...prev.losses, ...patch } }))

  const patchAlbedo = (patch: Partial<SystemParams['albedo']>) =>
    setParams((prev) => ({ ...prev, albedo: { ...prev.albedo, ...patch } }))

  const patchBattery = (patch: Partial<SystemParams['battery']>) =>
    setParams((prev) => ({ ...prev, battery: { ...prev.battery, ...patch } }))

  const resetToDefaults = () => setParams(defaultSystemParams)

  return {
    params,
    patchOrientation,
    patchModule,
    patchInverter,
    patchLosses,
    patchAlbedo,
    patchBattery,
    resetToDefaults,
  }
}
