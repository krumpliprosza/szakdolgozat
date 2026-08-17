import { useEffect, useState } from 'react'

// Leiras: kezeli a helyszin allapotat es a hozza tartozo piszkozat (draft) lat/lon mezoket; csak akkor commitol uj koordinatat, ha mindket ertek ervenyes.

export type LatLon = { lat: number; lon: number } | null

// Formai korlatozas a szelesseg/hosszusag ertekekre
const isValidLat = (v: number) => !Number.isNaN(v) && v >= -90 && v <= 90
const isValidLon = (v: number) => !Number.isNaN(v) && v >= -180 && v <= 180

export function useLocationForm(location: LatLon | null, onLocationChange: (location: LatLon | null) => void) {

  // Atmeneti ertekek koordinataknak
  const [draftLat, setDraftLat] = useState(location ? location.lat.toFixed(4) : '')
  const [draftLon, setDraftLon] = useState(location ? location.lon.toFixed(4) : '')
  useEffect(() => {
    if (location) {
      setDraftLat(location.lat.toFixed(4))
      setDraftLon(location.lon.toFixed(4))
    }
  }, [location])

  // Szelesseget es hosszusagot csak akkor ment, ha mindket adathoz mar lett mentve hasznalhato adat
  const commitCoordinate = (lat: string, lon: string) => {
    const latitude = parseFloat(lat)
    const longitude = parseFloat(lon)
    onLocationChange(isValidLat(latitude) && isValidLon(longitude) ? { lat: latitude, lon: longitude } : null)
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