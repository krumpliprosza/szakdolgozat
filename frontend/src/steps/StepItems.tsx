import {
  LuMapPin,
  LuMapPinCheck,
  LuPlug,
  LuPlugZap,
  LuHousePlus,
  LuHousePlug,
} from "react-icons/lu"
import type { WizardData } from './WizardDataContext'

// Leiras: A lepesek statikus adatai (ikonok, cimek), a gombfeliratokat visszaado fuggvenyek es az adatok ellenorzesenek leirasa.

export const items = [
  {
    icon: <LuMapPin />,
    iconcomplete: <LuMapPinCheck />,
    title: "Helyszín kiválasztása",
    // Helyszin ellenorzese
    getErrorMessage: (data: WizardData): string | null => {
      if (data.location === null) {
        return "Válassz ki egy helyszínt a térképen, vagy add meg a koordinátákat kézzel!"
      }
      return null
    },
  },
  {
    icon: <LuPlug />,
    iconcomplete: <LuPlugZap />,
    title: "Napelemrendszer paraméterezése",
    // Parameterek ellenorzese
    getErrorMessage: (data: WizardData): string | null => {
      if (data.systemParamsMode === null) {
        return "Válassz egy előre meghatározott rendszert, vagy végezd el a sajátod paraméterezését!"
      }
      return null
    },
  },
  {
    icon: <LuHousePlus />,
    iconcomplete: <LuHousePlug />,
    title: "Fogyasztási profil megadása",
    // Fogyasztasi profil ellenorzese
    getErrorMessage: (_data: WizardData): string | null => {
      if (_data.consumptionProfileMode === null) {
        return "Válassz egy előre meghatározott fogyasztási profilt, vagy állítsd össze a sajátodat!"
      }
      return null
    },
  },
]

// Elozo lepes gombok cimkezese
export const getPrevButtonLabel = (count: number) => {
  switch (count) {
    case 0:
      return "Vissza a kezdőlapra"
    default:
      return "Előző lépés"
  }
}

// Kovetkezo lepes gombok cimkezese
export const getNextButtonLabel = (count: number) => {
  switch (count) {
    case 2:
      return "Befejezés"
    case 3:
      return "Szimuláció indítása"
    default:
      return "Következő lépés"
  }
}