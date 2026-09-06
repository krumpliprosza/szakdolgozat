import { useEffect, useState } from 'react'

// Leiras: kezeli a helyszin allapotat es a hozza tartozo piszkozat (draft) lat/lon mezoket; csak akkor commitol uj koordinatat, ha mindket ertek ervenyes.

export type LatLon = { latitude: number; longitude: number } | null

// Formai korlatozas a szelesseg/hosszusag ertekekre
const isValidLat = (v: number) => !Number.isNaN(v) && v >= -90 && v <= 90
const isValidLon = (v: number) => !Number.isNaN(v) && v >= -180 && v <= 180

export function useLocationForm(location: LatLon | null, onLocationChange: (location: LatLon | null) => void) {

  // Atmeneti ertekek koordinataknak
  const [draftLat, setDraftLat] = useState(location ? location.latitude.toFixed(4) : '')
  const [draftLon, setDraftLon] = useState(location ? location.longitude  .toFixed(4) : '')
  useEffect(() => {
    if (location) {
      setDraftLat(location.latitude.toFixed(4))
      setDraftLon(location.longitude.toFixed(4))
    }
  }, [location])

  // Szelesseget es hosszusagot csak akkor ment, ha mindket adathoz mar lett mentve hasznalhato adat
  const commitCoordinate = (lat: string, lon: string) => {
    const latitude = parseFloat(lat)
    const longitude = parseFloat(lon)
    onLocationChange(isValidLat(latitude) && isValidLon(longitude) ? { latitude: latitude, longitude: longitude } : null)
  }
  const commitLat = (latitude: string) => {
    setDraftLat(latitude)
    commitCoordinate(latitude, draftLon)
  }
  const commitLon = (longitude: string) => {
    setDraftLon(longitude)
    commitCoordinate(draftLat, longitude)
  }

  return { location, draftLat, draftLon, commitLat, commitLon }
}