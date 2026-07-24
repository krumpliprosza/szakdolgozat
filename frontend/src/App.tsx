//#region Importalasok

"use client"

import './App.css'
import { 
  Steps,
  useSteps,
  useStepsContext,
  Box,
  type BoxProps,
  VStack,
  HStack,
  Stack,
  ButtonGroup,
  IconButton,
  Button,
  Text,
  Mark,
  Editable,
  Heading,
  Center,
} from '@chakra-ui/react'
import {
  LuMapPin,
  LuMapPinCheck,
  LuPlug,
  LuPlugZap,
  LuHousePlus,
  LuHousePlug,
  LuCheck,
  LuPencilLine,
  LuX,
} from "react-icons/lu"
import { 
  ColorModeButton,
} from "./components/ui/color-mode"
import { 
  LocationPicker,
} from './components/ui/LocationPicker'
import { 
  Outlet, 
  Navigate, 
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom'
import { 
  useEffect,
  useState,
} from 'react'
import { 
  usePageTitle,
} from './hooks/usePageTitle'

//#endregion

/* TODO lista

  - Hibakezeles (404 not found stb.)
  Step:
  - isStepValid hasznalata (kesobb, a lepesek logikajanak elkeszitese utan)
  - szimulacio adataihoz memoria, es kezdolapon a legutolso szimulacio adatait legyen lehetseges betolteni

*/

//#region Utvonalak

// Utvonalak listaja
function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route element={<MainLayout />}>
        <Route path="/first-step" element={<FirstStep />} />
        <Route path="/second-step" element={<SecondStep />} />
        <Route path="/third-step" element={<ThirdStep />} />
        <Route path="/setup-complete" element={<SetupComplete />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

// A lepesek szinkronizalasa a meglevo utvonalakkal
const StepRouteSync = () => {
  const stepPaths = ["/first-step", "/second-step", "/third-step", "/setup-complete"]
  const { value } = useStepsContext()
  const navigate = useNavigate()

  useEffect(() => {
    const target = stepPaths[value]
    if (target) {
      navigate(target)
    }
  }, [value, navigate])

  return null
}

//#endregion

//#region Komponensek

// Animaciok hozzaadasa az oldalakhoz
const AnimatedPage = (props: BoxProps) => (
  <Box
    data-state="open"
    _open={{
      animation: "fade-in 300ms ease-out",
    }}
    {...props}
  />
)

// A lepesek listaja (felso sav)
const StepsList = () => {
  return <>
    <Steps.List>
      {items.map((step, index) => (
        <Steps.Item key={index} index={index} title={step.title}>
          <Steps.Indicator>
            <Steps.Status incomplete={step.icon} complete={step.iconcomplete} />
          </Steps.Indicator>
          <Steps.Title display={{ base: "none", lg: "block" }} fontSize={{base: "md", xl:"lg"}}>
            { step.title }
          </Steps.Title>
          <Steps.Separator />
        </Steps.Item>
      ))}
    </Steps.List>
  </>
}

// Elozo lepes gombok cimkezese
const getPrevButtonLabel = (count: number) => {
  switch (count) {
    case 0:
      return "Vissza a kezdőlapra"
    default:
      return "Előző lépés"
  }
}

// Kovetkezo lepes gombok cimkezese
const getNextButtonLabel = (count: number) => {
  switch (count) {
    case 2:
      return "Befejezés"
    case 3:
      return "Szimuláció indítása"
    default:
      return "Következő lépés"
  }
}

// Elozo es kovetkezo lepes gombok
const PrevNextButtons = () => {
  const { value } = useStepsContext()
  const navigate = useNavigate()
  return <>
    <ButtonGroup size="sm" variant="outline" bottom={2} left={{ base: 2, sm: 4 }} position="fixed" zIndex="1000">
      { /* Elozo lepes gombok */ }
      { value === 0 ? (
        <Box bg="bg.panel">
          <Button onClick={() => navigate("/")}>{ getPrevButtonLabel(value) }</Button>
        </Box>
      ) : (
        <Steps.PrevTrigger asChild>
          <Box bg="bg.panel">
            <Button>{ getPrevButtonLabel(value) }</Button>
          </Box>
        </Steps.PrevTrigger>
      )}
      { /* Kovetkezo lepes gombok */ }
      { value !== 3 ? (
        <Steps.NextTrigger asChild>
          <Box bg="bg.panel">
            <Button>{ getNextButtonLabel(value) }</Button>
          </Box>
        </Steps.NextTrigger>
      ) : (
        <Box bg="bg.panel">
          <Button onClick={() => navigate("/")}>{ getNextButtonLabel(value) }</Button>
        </Box>
      )}
    </ButtonGroup>
  </>
}

// Vilagos/sotet tema valtasa
const ChangeColorModeButton = () => {
  return <>
    <Box bg="bg.panel" borderRadius="md" position="fixed" bottom={2} right={{ base: 2, sm: 4 }} zIndex={1000}>
      <ColorModeButton />
    </Box>
  </>
}

// Lepesek listajahoz tartozo ikonok, cimek es leirasok
const items = [
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

// Varazslo komponens alapok
const Step = () => {
  const steps = useSteps({
    defaultStep: 0,
    count: items.length,
  })

  return (
    <Stack align="flex-start">
      <Steps.RootProvider value={steps} size="lg" colorPalette="purple">
        <StepsList />

        <Box p={{base: 0, lg: 8}}  minH="100%">
        
          <StepRouteSync />
          <Outlet /> {/* Kimenet */}
        
        </Box>

        <Box>

          <PrevNextButtons />
          
          <ChangeColorModeButton />
        
        </Box>
        
      </Steps.RootProvider>
    </Stack>
  )
}

//#endregion

//#region Elrendezesi modok

const MainLayout = () => {
  return (
    <>
      <Box 
        p={4}
        h="100vh" 
        display="flex" 
        flexDirection="column" 
        justifyContent="space-between"
      >
      
        <Step />
    
      </Box>
    </>
  )
}

//#endregion

//#region Oldalak

// Kezdolap
const WelcomePage = () => {
  usePageTitle("Kezdőlap")
  const navigate = useNavigate()
  return (
    <Center h="100vh">
      <AnimatedPage
        textAlign="center"
      >
        <Heading size="4xl" mb={4}>Napelemrendszer szimulátor</Heading>
        <Text fontSize="lg" color="fg.muted" mb={8}>Kattints a következő gombra, hogy a szimuláció paramétereit megadhasd!</Text>
        <Button colorPalette="purple" variant="outline" size="lg" onClick={() => navigate("/first-step")}>
          Új szimuláció készítése
        </Button>
      </AnimatedPage>
    </Center>
  )
}

// Helyszin kivalasztasa
const FirstStep = () => {
  const isValidLat = (v: number) => !Number.isNaN(v) && v >= -90 && v <= 90
  const isValidLon = (v: number) => !Number.isNaN(v) && v >= -180 && v <= 180

  usePageTitle("Helyszín kiválasztása")
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)

  // Draft text, mirrors location once it's set, but can exist independently before that
  const [draftLat, setDraftLat] = useState('')
  const [draftLon, setDraftLon] = useState('')

  // Keep drafts in sync when location changes from outside (map click, geolocation)
  useEffect(() => {
    if (location) {
      setDraftLat(location.lat.toFixed(4))
      setDraftLon(location.lon.toFixed(4))
    }
  }, [location])

  const commitLat = (value: string) => {
    setDraftLat(value)
    const lat = parseFloat(value)
    const lon = parseFloat(draftLon)
    if (isValidLat(lat) && isValidLon(lon)) {
      setLocation({ lat, lon })
    }
  }

  const commitLon = (value: string) => {
    setDraftLon(value)
    const lon = parseFloat(value)
    const lat = parseFloat(draftLat)
    if (isValidLat(lat) && isValidLon(lon)) {
      setLocation({ lat, lon })
    }
  }

  return (
    <AnimatedPage>
      <Heading mb={4}>Első lépés</Heading>
      <Text mb={4}>Válaszd ki a térképen, hogy hol szeretnél napelemrendszert telepíteni!</Text>

      <Box position="relative" isolation="isolate" zIndex={0}>
        <LocationPicker onChange={setLocation} selected={location} />
      </Box>

      <Text mt={4} mb={1}>
        {location ? 'Kiválasztott koordináták:' : 'Itt is megadhatod a helyszín koordinátáit:'}
      </Text>

      <VStack as="span" display="inline-flex" gap={1} alignItems="left">
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

// Napelemrendszer parameterezese
const SecondStep = () => {
  usePageTitle("Napelemrendszer paraméterezése")
  return (
    <AnimatedPage>
      <Heading mb={4}>Második lépés</Heading>
      <Text>Állítsd be a kívánt rendszer paramétereit!</Text>
    </AnimatedPage>
  )
}

// Fogyasztasi profil megadasa
const ThirdStep = () => {
  usePageTitle("Fogyasztási profil megadása")
  return (
    <AnimatedPage>
      <Heading mb={4}>Harmadik lépés</Heading>
      <Text>Állítsd össze háztartásod fogyasztási profilját!</Text>
    </AnimatedPage>
  )
}

// Szimulacio inditasra kesz
const SetupComplete = () => {
  usePageTitle("Szimuláció indítása")
  return (
    <AnimatedPage>
      <Heading mb={4}>Szimuláció indítása</Heading>
      <Text>Minden lépés sikeresen teljesítve, a szimuláció indításra kész!</Text>
    </AnimatedPage>
  )
}

//#endregion

export default App