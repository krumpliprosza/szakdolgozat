import {
  LuMapPin,
  LuMapPinCheck,
  LuPlug,
  LuPlugZap,
  LuHousePlus,
  LuHousePlug,
} from "react-icons/lu"

// Leiras: A lepesek statikus adatai (ikonok, cimek) es a gombfeliratokat visszaado fuggvenyek.

export const items = [
  {
    icon: <LuMapPin />,
    iconcomplete: <LuMapPinCheck />,
    title: "Helyszín kiválasztása",
  },
  {
    icon: <LuPlug />,
    iconcomplete: <LuPlugZap />,
    title: "Napelemrendszer paraméterezése",
  },
  {
    icon: <LuHousePlus />,
    iconcomplete: <LuHousePlug />,
    title: "Fogyasztási profil megadása",
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