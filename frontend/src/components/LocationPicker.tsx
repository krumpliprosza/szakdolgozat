import { useEffect, useState } from 'react'
import { useColorModeValue } from './color-mode'
import { Box, Button, HStack, Text, useBreakpointValue } from '@chakra-ui/react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Leiras: A Leaflet terkepes komponens: kattintasra koordinatat valaszt, sajat helyzetem gomb, hibakezeles geolokacional.

// A Leaflet alapertelmezett jelolo ikonjanak lecserelese
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Segedvaltozo a szelesseg/hosszusag tarolasara
type LatLon = { latitude: number; longitude: number }

interface LocationPickerProps {
  onChange: (coords: LatLon) => void
  selected?: LatLon | null
  initialCenter?: LatLon
  initialZoom?: number
}

// Kattintasokat figyelo komponens
const ClickHandler = ({ onPick }: { onPick: (latitude: number, longitude: number) => void }) => {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

// A terkepet a kivalasztott koordinatat kozepre helyezve allitja be
const RecenterOnLocate = ({ target }: { target: LatLon | null }) => {
  const map = useMap()
  useEffect(() => {
    if (target) {
      map.flyTo([target.latitude, target.longitude], 14)
    }
  }, [target, map])
  return null
}

// Terkepes helyszinvalaszto komponens
export const LocationPicker = ({
  onChange,
  selected,
  initialCenter = { latitude: 47.1625, longitude: 19.5033 }, // Alapertelmezetten Magyarorszag
  initialZoom = 7,
}: LocationPickerProps) => {

  const [coords, setCoords] = useState<LatLon | null>(selected ?? null)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (
      selected &&
      (selected.latitude !== coords?.latitude || selected.longitude !== coords?.longitude)
    ) {
      setCoords(selected)
    }
  }, [selected])

  const markerColor = useColorModeValue('#641BA3', '#9333EA')
  // Lila jelolo ikon
  const purpleIcon = L.divIcon({
    className: 'custom-marker',
    html: `
      <svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M15 0C6.7 0 0 6.7 0 15c0 11.25 15 27 15 27s15-15.75 15-27c0-8.3-6.7-15-15-15z"
          fill=${markerColor}
          stroke="#000000"
          stroke-width="0"
        />
        <circle cx="15" cy="15" r="6" fill="white" />
      </svg>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42], // A jelolo alja pont a terkep kozepere mutat
    popupAnchor: [0, -42],
  })

  // Uj koordinata beallitasa
  const setLocation = (latitude: number, longitude: number) => {
    const next = { latitude, longitude }
    setCoords(next)
    setError(null)
    onChange(next)
  }

  // Sajat pozicio lekerdezese
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError('A böngésződ nem támogatja a helymeghatározást.')
      return
    }
    setLocating(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords.latitude, position.coords.longitude)
        setLocating(false)
      },
      (err) => {
        let message = 'Ismeretlen hiba történt a helymeghatározás során.'

        switch (err.code) {
          case err.PERMISSION_DENIED:
            message = 'A helymeghatározási kísérlet el lett utasítva. Engedélyezd az eszközöd/böngésződ beállításaiban, majd próbáld újra.'
            break
          case err.POSITION_UNAVAILABLE:
            message = 'A jelenlegi pozíció nem elérhető.'
            break
          case err.TIMEOUT:
            message = 'A helymeghatározás túl sokáig tartott, kérlek, próbáld újra.'
            break
        }

        setError(message)
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // Terkep meretezese
  const mapHeight = useBreakpointValue({base: '450px'}) ?? '450px'
  return (
    <Box>
      <Box borderWidth="1px" borderRadius="md" overflow="hidden">
        
        <MapContainer
          center={[initialCenter.latitude, initialCenter.longitude]}
          zoom={initialZoom}
          style={{ height: mapHeight, width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onPick={setLocation} /> { /* Kattintasok vizsgalata */ }
          <RecenterOnLocate target={coords} /> { /* A terkep igazitasa ugy, hogy a marker kozepre legyen allitva */ }
          {coords && <Marker position={[coords.latitude, coords.longitude]} icon={purpleIcon} />}
        </MapContainer>

      </Box>

      <Text fontSize="sm" color="fg.muted" mt={1}>
        Kattints bárhova a térképen a pont kiválasztásához.
      </Text>

      <HStack my={2} gap={3}>
        <Button size="sm" variant="outline" onClick={handleUseMyLocation} loading={locating}>
          Saját helyzetem használata
        </Button>
      </HStack>
      
      {error && ( 
        <Text fontSize="sm" fontWeight={"bold"} color="red.muted" mb={2}> { /* Hibakezeles */ }
          {error}
        </Text>
      )}
    </Box>
  )
}