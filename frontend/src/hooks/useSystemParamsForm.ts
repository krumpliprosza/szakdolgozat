import { useState, type Dispatch, type SetStateAction } from 'react'
import { defaultSystemParams, type SystemParams } from '../steps/WizardDataContext'

// Leiras: a Sajat rendszer parameterezese urlap allapotat kezeli.

// Segedelem: egy szekcio frissiteset vegzi
function makeSectionPatcher<K extends keyof SystemParams>(
  setParams: Dispatch<SetStateAction<SystemParams>>,
  key: K
) {
  return (patch: Partial<SystemParams[K]>) =>
    setParams((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }))
}

export function useSystemParamsForm(initial?: SystemParams | null) {
  const [params, setParams] = useState<SystemParams>(initial ?? defaultSystemParams)

  const patchOrientation = makeSectionPatcher(setParams, 'orientation')
  const patchModule = makeSectionPatcher(setParams, 'module')
  const patchInverter = makeSectionPatcher(setParams, 'inverter')
  const patchLosses = makeSectionPatcher(setParams, 'losses')
  const patchAlbedo = makeSectionPatcher(setParams, 'albedo')
  const patchBattery = makeSectionPatcher(setParams, 'battery')

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
