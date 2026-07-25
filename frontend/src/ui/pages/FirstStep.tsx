import { Box, VStack, HStack, Text, Mark, Editable, Heading, IconButton } from '@chakra-ui/react'
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu"
import { usePageTitle } from '../../hooks/usePageTitle'
import { useLocationForm } from '../../hooks/useLocationForm'
import { AnimatedPage } from '../../components/AnimatedPage'
import { LocationPicker } from '../../components/LocationPicker'

// Leiras: Helyszin kivalasztasa terkepen vagy kezi koordinata-bevitellel (a logikat a useLocationForm hook adja).

export const FirstStep = () => {
  usePageTitle("Helyszín kiválasztása")

  const { location, setLocation, draftLat, draftLon, commitLat, commitLon } = useLocationForm()

  return (
    <AnimatedPage>
      <Heading mb={4}>Első lépés</Heading>
      <Text mb={4}>Válaszd ki a térképen, hogy hol szeretnél napelemrendszert telepíteni!</Text>

      <Box position="relative" isolation="isolate" zIndex={0}>
        <LocationPicker onChange={setLocation} selected={location} /> {/* Terkep helye */}
      </Box>

      <Text mt={4} mb={1}>
        {location ? 'Kiválasztott koordináták:' : 'Itt is megadhatod a helyszín koordinátáit:'}
      </Text>

      <VStack as="span" display="inline-flex" gap={1} alignItems="left"> {/* Koordinatak kezi megadasa */}
        <HStack>
          <Mark variant="subtle" colorPalette="purple">
            <Editable.Root
              key={`lat-${draftLat}`}
              defaultValue={draftLat}
              onValueCommit={(details) => commitLat(details.value)}
              placeholder="pl. 47.1625"
            >
              <Editable.Preview />
              <Editable.Input />
              <Editable.Control>
                <Editable.EditTrigger asChild>
                  <IconButton variant="outline" size="xs">
                    <LuPencilLine />
                  </IconButton>
                </Editable.EditTrigger>
                <Editable.CancelTrigger asChild>
                  <IconButton variant="outline" size="xs">
                    <LuX />
                  </IconButton>
                </Editable.CancelTrigger>
                <Editable.SubmitTrigger asChild>
                  <IconButton variant="outline" size="xs">
                    <LuCheck />
                  </IconButton>
                </Editable.SubmitTrigger>
              </Editable.Control>
            </Editable.Root>
          </Mark>
          <Text as="span">(szélesség)</Text>
        </HStack>

        <HStack>
          <Mark variant="subtle" colorPalette="purple">
            <Editable.Root
              key={`lon-${draftLon}`}
              defaultValue={draftLon}
              onValueCommit={(details) => commitLon(details.value)}
              placeholder="pl. 19.5033"
            >
              <Editable.Preview />
              <Editable.Input />
              <Editable.Control>
                <Editable.EditTrigger asChild>
                  <IconButton variant="outline" size="xs">
                    <LuPencilLine />
                  </IconButton>
                </Editable.EditTrigger>
                <Editable.CancelTrigger asChild>
                  <IconButton variant="outline" size="xs">
                    <LuX />
                  </IconButton>
                </Editable.CancelTrigger>
                <Editable.SubmitTrigger asChild>
                  <IconButton variant="outline" size="xs">
                    <LuCheck />
                  </IconButton>
                </Editable.SubmitTrigger>
              </Editable.Control>
            </Editable.Root>
          </Mark>
          <Text as="span">(hosszúság)</Text>
        </HStack>
      </VStack>
    </AnimatedPage>
  )
}