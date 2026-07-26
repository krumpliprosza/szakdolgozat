import { useEffect, useState } from 'react'

// Leiras: kezeli a helyszin allapotat es a hozza tartozo piszkozat (draft) lat/lon mezoket; csak akkor commitol uj koordinatat, ha mindket ertek ervenyes.

// Formai korlatozas a szelesseg/hosszusag ertekekre
const isValidLat = (v: number) => !Number.isNaN(v) && v >= -90 && v <= 90
const isValidLon = (v: number) => !Number.isNaN(v) && v >= -180 && v <= 180

export function useLocationForm() {
  // Locationpicker ezt a helyerteket kapja meg
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)

  // Atmeneti ertekek koordinataknak
  const [draftLat, setDraftLat] = useState('')
  const [draftLon, setDraftLon] = useState('')
  useEffect(() => {
    if (location) {
      setDraftLat(location.lat.toFixed(4))
      setDraftLon(location.lon.toFixed(4))
    }
  }, [location])

  // Szelesseget es hosszusagot csak akkor ment, ha mindket adathoz mar lett mentve hasznalhato adat
  const commitLat = (value: string) => {
    setDraftLat(value)
    const lat = parseFloat(value)
    const lon = parseFloat(draftLon)
    if (isValidLat(lat) && isValidLon(lon)) {
      setLocation({ lat, lon })
    } else {
      setLocation(null)
    }
  }
  const commitLon = (value: string) => {
    setDraftLon(value)
    const lon = parseFloat(value)
    const lat = parseFloat(draftLat)
    if (isValidLat(lat) && isValidLon(lon)) {
      setLocation({ lat, lon })
    } else {
      setLocation(null)
    }
  }

  return { location, setLocation, draftLat, draftLon, commitLat, commitLon }
}