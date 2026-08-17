import { useState, type Dispatch, type SetStateAction } from 'react'
import { defaultSystemParameters, type SystemParameters } from '../steps/WizardDataContext'

// Leiras: a Sajat rendszer parameterezese urlap allapotat kezeli.

// A modul nevleges DC teljesitmenye nem lehet nulla
export const isModulePowerValid = (module: SystemParameters['module']): boolean => {
  return module.pStc !== 0
}

// Az inverter nevleges AC teljesitmenye nem lehet nulla
export const isInverterPowerValid = (inverter: SystemParameters['inverter']): boolean => {
  return inverter.pAc !== 0
}

// A Sajat rendszer parameterezese urlap hibakezelese
export const getSystemParametersError = (parameters: SystemParameters): string | null => {
  if (!isModulePowerValid(parameters.module)) {
    return 'A modul névleges DC teljesítménye csak pozitív értéket vehet fel!'
  }
  if (!isInverterPowerValid(parameters.inverter)) {
    return 'Az inverter névleges AC teljesítménye csak pozitív értéket vehet fel!'
  }
  return null
}

// Segedelem: egy szekcio frissiteset vegzi
function makeSectionPatcher<K extends keyof SystemParameters>(
  setParameters: Dispatch<SetStateAction<SystemParameters>>,
  key: K
) {
  return (patch: Partial<SystemParameters[K]>) =>
    setParameters((prev) => ({ ...prev, [key]: { ...prev[key], ...patch } }))
}

export function useSystemParametersForm(initial?: SystemParameters | null) {
  const [parameters, setParameters] = useState<SystemParameters>(initial ?? defaultSystemParameters)

  const patchOrientation = makeSectionPatcher(setParameters, 'orientation')
  const patchModule = makeSectionPatcher(setParameters, 'module')
  const patchInverter = makeSectionPatcher(setParameters, 'inverter')
  const patchLosses = makeSectionPatcher(setParameters, 'losses')
  const patchAlbedo = makeSectionPatcher(setParameters, 'albedo')
  const patchBattery = makeSectionPatcher(setParameters, 'battery')

  const resetToDefaults = () => setParameters(defaultSystemParameters)

  return {
    parameters,
    patchOrientation,
    patchModule,
    patchInverter,
    patchLosses,
    patchAlbedo,
    patchBattery,
    resetToDefaults,
  }
}
