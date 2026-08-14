import { Box, VStack, Text, Heading } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useWizardData } from '../../steps/WizardDataContext'
import { usePageTitle } from '../../hooks/usePageTitle'
import { useLocationForm } from '../../hooks/useLocationForm'
import { AnimatedPage } from '../../components/AnimatedPage'
import { LocationPicker } from '../../components/LocationPicker'
import { CoordinateEditable } from '../../components/CoordinateEditable'

// Leiras: Helyszin kivalasztasa terkepen vagy kezi koordinata-bevitellel.

export const FirstStep = () => {
  usePageTitle("Helyszín kiválasztása")

  const { location, setLocation, draftLat, draftLon, commitLat, commitLon } = useLocationForm()
  const { setData } = useWizardData()

  // A kivalasztott helyszint a varazslo adatai koze masolja, hogy mindenhol elerheto legyen
  useEffect(() => {
    setData({ location })
  }, [location])

  return (
    <AnimatedPage>
      <Heading mb={4}>Első lépés</Heading>
      <Text mb={4} color="fg.muted">Válaszd ki a térképen, hogy hol szeretnél napelemrendszert telepíteni!</Text>

      <Box position="relative" isolation="isolate" zIndex={0}>
        <LocationPicker onChange={setLocation} selected={location} /> {/* Terkep helye */}
      </Box>

      <Text mt={4} mb={1}>
        {location ? 'Kiválasztott koordináták:' : 'Itt is megadhatod a helyszín koordinátáit:'}
      </Text>

      <VStack as="span" display="inline-flex" gap={1} alignItems="left"> {/* Koordinatak kezi megadasa */}
        <CoordinateEditable
          value={draftLat}
          onCommit={commitLat}
          placeholder="pl. 47.1625"
          unitLabel="szélesség (±90°)"
        />
        <CoordinateEditable
          value={draftLon}
          onCommit={commitLon}
          placeholder="pl. 19.5033"
          unitLabel="hosszúság (±180°)"
        />
      </VStack>
    </AnimatedPage>
  )
}
