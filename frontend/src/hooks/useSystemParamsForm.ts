import { useState, type Dispatch, type SetStateAction } from 'react'
import { defaultSystemParams, type SystemParams } from '../steps/WizardDataContext'

// Leiras: a Sajat rendszer parameterezese urlap allapotat kezeli.

// A modul nevleges DC teljesitmenye nem lehet nulla
export const isModulePowerValid = (module: SystemParams['module']): boolean => {
  return module.pStcW !== 0
}

// Az inverter nevleges AC teljesitmenye nem lehet nulla
export const isInverterPowerValid = (inverter: SystemParams['inverter']): boolean => {
  return inverter.pAcNomW !== 0
}

// A Sajat rendszer parameterezese urlap hibakezelese
export const getSystemParamsError = (params: SystemParams): string | null => {
  if (!isModulePowerValid(params.module)) {
    return 'A modul névleges DC teljesítménye csak pozitív értéket vehet fel!'
  }
  if (!isInverterPowerValid(params.inverter)) {
    return 'Az inverter névleges AC teljesítménye csak pozitív értéket vehet fel!'
  }
  return null
}

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
