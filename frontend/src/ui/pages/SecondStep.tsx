import { Accordion, Button, Card, Box, Heading, Text, Stack, Center, SimpleGrid, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { usePageTitle } from '../../hooks/usePageTitle'
import { AnimatedPage } from '../../components/AnimatedPage'
import { useWizardData, type TrackingType, type SapmMountType } from '../../assets/WizardDataContext'
import { useSystemParamsForm } from '../../hooks/useSystemParamsForm'
import { NumField, SelectField, SwitchField } from '../../components/FormFields'

// Leiras: Napelemrendszer parameterezese (a felhasznalo valaszthat, hogy elore meghatarozott rendszert valaszt vagy sajat rendszert parameterez).

type SecondStepView = 'valasztosmenu' | 'eloremeghatarozottrendszer' | 'sajatrendszer'
export const currentYear = new Date().getFullYear()

// Kivalaszthato lehetosegek a masodik lepesben: elore meghatarozott rendszer vagy sajat rendszer parameterezese
const ChoiceMenu = ({
  onSelectPredefined,
  onSelectCustom,
}: {
  onSelectPredefined: () => void
  onSelectCustom: () => void
}) => (
  <>
    <Heading mb={4}>Második lépés</Heading>
    <Text mb={4}>Állítsd be a kívánt napelemrendszer paramétereit!</Text>

    <Center>
      <Stack direction={{ base: "column", md: "row" }} gap="10" align="stretch" w="full" maxW="1800px">

        <Card.Root overflow="hidden" pt={2} borderColor="purple.border" borderWidth="2px">
          <Box
            backgroundImage="url(/secondstep_1_light.svg)"
            _dark={{ backgroundImage: "url(/secondstep_1_dark.svg)" }}
            backgroundSize="cover"
            backgroundPosition="center"
            aspectRatio="5/3"
            role="img"
            aria-label="Saját fogyasztási profil összeállítása"
          />
          <Card.Body gap="2">
            <Card.Title>Előre meghatározott rendszer kiválasztása</Card.Title>
            <Card.Description>
              Ennél a lehetőségnél kész, előre beállított napelemrendszerek állnak rendelkezésre. Ez a megoldás ideális azoknak, akik gyorsan, a technikai részletek aprólékos megadása nélkül szeretnének haladni.
            </Card.Description>
          </Card.Body>
          <Card.Footer>
            <Button variant="outline" onClick={onSelectPredefined}>Kiválasztás</Button>
          </Card.Footer>
        </Card.Root>

        <Card.Root overflow="hidden" pt={2} borderColor="purple.border" borderWidth="2px">
          <Box
            backgroundImage="url(/secondstep_2_light.svg)"
            _dark={{ backgroundImage: "url(/secondstep_2_dark.svg)" }}
            backgroundSize="cover"
            backgroundPosition="center"
            aspectRatio="5/3"
            role="img"
            aria-label="Saját fogyasztási profil összeállítása"
          />
          <Card.Body gap="2">
            <Card.Title>Saját rendszer paraméterezése</Card.Title>
            <Card.Description>
              Ez az alternatíva lehetőséget ad egy teljesen egyedi specifikációkkal rendelkező rendszer beállítására. Ez azok számára hasznos, akik a maximális pontosság érdekében maguk szabályoznák a modellt.
            </Card.Description>
          </Card.Body>
          <Card.Footer>
            <Button variant="outline" onClick={onSelectCustom}>Kiválasztás</Button>
          </Card.Footer>
        </Card.Root>

      </Stack>
    </Center>
  </>
)

// Elore meghatarozott rendszer valasztasahoz tartozo menu
const PredefinedSystemMenu = ({ onBack }: { onBack: () => void }) => (
  <>
    <Button variant="outline" mb={4} onClick={onBack}>Vissza</Button>
    <Heading mb={4}>Előre meghatározott rendszer kiválasztása</Heading>
    <Text mb={4}>
      Válassz a meglévő napelemrendszerek közül!
      {/* TODO: az elore beallitott napelemrendszerek listajanak megjelenitese */}
    </Text>
  </>
)

// Sajat rendszer parameterezesehez tartozo menu
const CustomSystemMenu = ({
  onBack,
  form,
}: {
  onBack: () => void
  form: ReturnType<typeof useSystemParamsForm>
}) => {
  const { params, patchOrientation, patchModule, patchInverter, patchLosses, patchAlbedo, patchBattery } = form

  return (
    <>
      <Button variant="outline" mb={4} onClick={onBack}>Vissza</Button>
      <Heading mb={2}>Saját rendszer paraméterezése</Heading>
      <Text mb={6} color="fg.muted">
        Add meg a napelemrendszer egyedi paramétereit! Ha egy értékben nem vagy biztos, az adott mező melletti ⓘ ikon elmagyarázza a jelentését, valamint az alapértelmezett érték jó kiindulópontnak számíthat.
      </Text>

      <Accordion.Root collapsible variant="outline">

        {/* Tajolas */}
        <Accordion.Item value="orientation">
          <Accordion.ItemTrigger>
            <Heading size="md" flex="1" textAlign="left">Tájolás</Heading>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <VStack align="stretch" gap={4}>
                <SelectField
                  label="Rendszer típusa"
                  info="Fix tájolású tartószerkezet, vagy napkövető rendszer (egy- vagy kéttengelyes)."
                  value={params.orientation.trackingType}
                  onChange={(v) => patchOrientation({ trackingType: v as TrackingType })}
                  options={[
                    { label: 'Fix tájolású', value: 'fixed' },
                    { label: 'Egytengelyes követés', value: 'single_axis' },
                    { label: 'Kéttengelyes követés', value: 'dual_axis' },
                  ]}
                />

                {params.orientation.trackingType === 'fixed' && (
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    <NumField
                      label="Dőlésszög"
                      info="A panel síkja és a vízszintes talaj bezárt szöge. Referenciaértékek: 0° = vízszintes, 90° = függőleges."
                      value={params.orientation.surfaceTiltDeg}
                      onChange={(v) => v !== null && patchOrientation({ surfaceTiltDeg: v })}
                      min={0} max={90} step={1}
                      helperText="fok (°)"
                    />
                    <NumField
                      label="Tájolási szög (azimut)"
                      info="A panel irányítási szöge. Referenciaértékek: 0° = észak, 90° = kelet, 180° = dél, 270° = nyugat."
                      value={params.orientation.surfaceAzimuthDeg}
                      onChange={(v) => v !== null && patchOrientation({ surfaceAzimuthDeg: v })}
                      min={0} max={360} step={1}
                      helperText="fok (°)"
                    />
                  </SimpleGrid>
                )}

                {params.orientation.trackingType === 'single_axis' && (
                  <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                    <NumField
                      label="Tengely dőlésszöge"
                      info="Az egytengelyes követő forgástengelyének dőlése a vízszintestől. Sík terepen jellemzően 0°."
                      value={params.orientation.axisTiltDeg}
                      onChange={(v) => v !== null && patchOrientation({ axisTiltDeg: v })}
                      min={0} max={90} step={1}
                      helperText="fok (°)"
                    />
                    <NumField
                      label="Tengely azimutja"
                      info="A forgástengely vízszintes vetületének iránya. Észak-dél tájolású tengelynél jellemzően 180°."
                      value={params.orientation.axisAzimuthDeg}
                      onChange={(v) => v !== null && patchOrientation({ axisAzimuthDeg: v })}
                      min={0} max={360} step={1}
                      helperText="fok (°)"
                    />
                    <NumField
                      label="Maximális követési szög"
                      info="Az a legnagyobb szög, amennyire a panel a tengelye körül elfordulhat napkeltétől napnyugtáig."
                      value={params.orientation.maxTrackingAngleDeg}
                      onChange={(v) => v !== null && patchOrientation({ maxTrackingAngleDeg: v })}
                      min={0} max={90} step={1}
                      helperText="fok (°)"
                    />
                  </SimpleGrid>
                )}

                {params.orientation.trackingType !== 'fixed' && (
                  <NumField
                    label="Sortávolság aránya (GCR)"
                    info="A modulszélesség és a sorok közti távolság aránya."
                    value={params.orientation.groundCoverageRatio}
                    onChange={(v) => v !== null && patchOrientation({ groundCoverageRatio: v })}
                    min={0.05} max={0.95} step={0.01}
                    helperText="0 és 1 között, pl. 0.35"
                  />
                )}
              </VStack>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>

        {/* Modul */}
        <Accordion.Item value="module">
          <Accordion.ItemTrigger>
            <Heading size="md" flex="1" textAlign="left">Modul</Heading>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <VStack align="stretch" gap={4}>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <NumField
                    label="Névleges DC teljesítmény"
                    info="A modul(sor) standard tesztkörülmények szerinti névleges egyenáramú teljesítménye."
                    value={params.module.pStcW}
                    onChange={(v) => v !== null && patchModule({ pStcW: v })}
                    min={0} step={50}
                    helperText="watt (W)"
                  />
                  <NumField
                    label="Hőmérsékleti együttható"
                    info="A teljesítmény hőmérséklet függési mezője. Negatív előjelű: minél melegebb a modul, annál erősebben csökkenti a termelést."
                    value={params.module.gammaPdc}
                    onChange={(v) => v !== null && patchModule({ gammaPdc: v })}
                    min={-0.01} max={0} step={0.0005}
                    helperText="1/°C, pl. -0.004 = -0.4%/°C"
                  />
                </SimpleGrid>

                <SelectField
                  label="Szerelési mód"
                  info="A modul hőmérsékletének emelkedését a szerelési mód határozza meg leginkább."
                  value={params.module.sapmMountType}
                  onChange={(v) => patchModule({ sapmMountType: v as SapmMountType })}
                  options={[
                    { label: 'Nyitott állvány, üveg-üveg', value: 'open_rack_glass_glass' },
                    { label: 'Nyitott állvány, üveg-polimer hátlap', value: 'open_rack_glass_polymer' },
                    { label: 'Tetőre integrált, üveg-üveg', value: 'close_mount_glass_glass' },
                    { label: 'Hátul szigetelt, üveg-polimer hátlap', value: 'insulated_back_glass_polymer' },
                  ]}
                />

                <SelectField
                  label="Modul üvegezése"
                  info="A beesési szög miatti visszaverődési veszteséget befolyásolja."
                  value={String(params.module.iamB0)}
                  onChange={(v) => patchModule({ iamB0: parseFloat(v) })}
                  options={[
                    { label: 'Átlagos üveg', value: '0.05' },
                    { label: 'AR-bevonatos üveg', value: '0.017' },
                  ]}
                />

                <SwitchField
                  label="Kétoldalas (bifaciális) modul"
                  info="Bifaciális modulnál a panel hátoldala is termel a talajról/tetőről visszavert fényből."
                  checked={params.module.isBifacial}
                  onChange={(v) => patchModule({ isBifacial: v })}
                />

                {params.module.isBifacial && (
                  <NumField
                    label="Bifacialitási tényező"
                    info="A hátoldal termelése az előlaphoz képest. Pl. 0.8 - a hátoldal a homlokoldal teljesítményének kb. 80%-át képes megtermelni azonos besugárzás mellett."
                    value={params.module.bifaciality}
                    onChange={(v) => v !== null && patchModule({ bifaciality: v })}
                    min={0} max={1} step={0.01}
                    helperText="0 és 1 között"
                  />
                )}
              </VStack>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>

        {/* Inverter */}
        <Accordion.Item value="inverter">
          <Accordion.ItemTrigger>
            <Heading size="md" flex="1" textAlign="left">Inverter</Heading>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <NumField
                  label="Névleges AC teljesítmény"
                  info="Az inverter névleges váltóáramú kimeneti teljesítménye."
                  value={params.inverter.pAcNomW}
                  onChange={(v) => v !== null && patchInverter({ pAcNomW: v })}
                  min={0} step={50}
                  helperText="watt (W)"
                />
                <NumField
                  label="Névleges hatásfok"
                  info="Az inverter hatásfoka (a DC → AC átalakítás veszteségét jellemzi)."
                  value={params.inverter.inverterEfficiencyNom}
                  onChange={(v) => v !== null && patchInverter({ inverterEfficiencyNom: v })}
                  min={0.5} max={1} step={0.005}
                  helperText="0.5 és 1 között, pl. 0.96 = 96%"
                />
              </SimpleGrid>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>

        {/* Akkumulator */}
        <Accordion.Item value="battery">
          <Accordion.ItemTrigger>
            <Heading size="md" flex="1" textAlign="left">Akkumulátor</Heading>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <VStack align="stretch" gap={4}>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <NumField
                    label="Kapacitás"
                    info="Az akkumulátor névleges energiatároló kapacitása."
                    value={params.battery.capacityKwh}
                    onChange={(v) => v !== null && patchBattery({ capacityKwh: v })}
                    min={0} step={0.5}
                    helperText="kilowattóra (kWh)"
                  />
                  <NumField
                    label="Kezdeti töltöttség"
                    info="A töltöttségi szint, amivel a szimuláció indul."
                    value={params.battery.soc0}
                    onChange={(v) => v !== null && patchBattery({ soc0: v })}
                    min={0} max={1} step={0.05}
                    helperText="0 és 1 között, pl. 0.5 = 50%"
                  />
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <NumField
                    label="Minimális töltöttségi szint"
                    info="Az akkumulátor élettartamának védelme érdekében ez alá nem engedi a modell a töltöttséget kisütni."
                    value={params.battery.socMin}
                    onChange={(v) => v !== null && patchBattery({ socMin: v })}
                    min={0} max={1} step={0.05}
                    helperText="0 és 1 között, pl. 0.1 = 10%"
                  />
                  <NumField
                    label="Maximális töltöttségi szint"
                    info="Az akkumulátor élettartamának védelme érdekében ez fölé nem tölt a modell."
                    value={params.battery.socMax}
                    onChange={(v) => v !== null && patchBattery({ socMax: v })}
                    min={0} max={1} step={0.05}
                    helperText="0 és 1 között, pl. 0.9 = 90%"
                  />
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <NumField
                    label="Maximális töltési teljesítmény"
                    info="Az akkumulátor/töltésvezérlő által megengedett legnagyobb töltési teljesítmény."
                    value={params.battery.pChargeMaxKw}
                    onChange={(v) => v !== null && patchBattery({ pChargeMaxKw: v })}
                    min={0} step={0.1}
                    helperText="kilowatt (kW)"
                  />
                  <NumField
                    label="Maximális kisütési teljesítmény"
                    info="Az akkumulátor/inverter által megengedett legnagyobb kisütési teljesítmény."
                    value={params.battery.pDischargeMaxKw}
                    onChange={(v) => v !== null && patchBattery({ pDischargeMaxKw: v })}
                    min={0} step={0.1}
                    helperText="kilowatt (kW)"
                  />
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <NumField
                    label="Töltési hatásfok"
                    info="A töltés közben fellépő veszteség miatt a betáplált energiának csak ekkora része kerül ténylegesen tárolásra."
                    value={params.battery.etaCharge}
                    onChange={(v) => v !== null && patchBattery({ etaCharge: v })}
                    min={0.5} max={1} step={0.01}
                    helperText="0 és 1 között, pl. 0.97 = 97%"
                  />
                  <NumField
                    label="Kisütési hatásfok"
                    info="A kisütés közben fellépő veszteség miatt a tárolt energiának csak ekkora része jut vissza a rendszerbe."
                    value={params.battery.etaDischarge}
                    onChange={(v) => v !== null && patchBattery({ etaDischarge: v })}
                    min={0.5} max={1} step={0.01}
                    helperText="0 és 1 között, pl. 0.97 = 97%"
                  />
                </SimpleGrid>
              </VStack>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>

        {/* Albedo */}
        <Accordion.Item value="albedo">
          <Accordion.ItemTrigger>
            <Heading size="md" flex="1" textAlign="left">Talaj-visszaverődés (albedó)</Heading>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <NumField
                label="Talaj albedója"
                info="A talajfelszín fényvisszaverő képessége. Referenciaértékek: aszfalt esetén ~0.1, fű/föld esetén ~0.2, friss hó esetén ~0.6-0.8. Kétoldalú moduloknál a hátoldali termelést is befolyásolja."
                value={params.albedo.groundAlbedo}
                onChange={(v) => v !== null && patchAlbedo({ groundAlbedo: v })}
                min={0} max={1} step={0.01}
                helperText="0 és 1 között"
              />
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>

        {/* Vesztesegek */}
        <Accordion.Item value="losses">
          <Accordion.ItemTrigger>
            <Heading size="md" flex="1" textAlign="left">Veszteségek</Heading>
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent>
            <Accordion.ItemBody>
              <VStack align="stretch" gap={4}>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <NumField
                    label="Vezetékellenállási veszteség"
                    info="A kábelek ellenállása miatt elveszett teljesítmény hányada."
                    value={params.losses.lResistance}
                    onChange={(v) => v !== null && patchLosses({ lResistance: v })}
                    min={0} max={0.2} step={0.005}
                    helperText="0 és 0.2 között, pl. 0.02 = 2%"
                  />
                  <NumField
                    label="Modulillesztési veszteség"
                    info="A sorban/párhuzamosan kötött modulok közötti teljesítménykülönbségekből eredő veszteség."
                    value={params.losses.lMismatch}
                    onChange={(v) => v !== null && patchLosses({ lMismatch: v })}
                    min={0} max={0.2} step={0.005}
                    helperText="0 és 0.2 között, pl. 0.02 = 2%"
                  />
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <NumField
                    label="Telepítés éve"
                    info="Ebből számolja a modell az évenkénti degradációt."
                    value={params.losses.installYear}
                    onChange={(v) => patchLosses({ installYear: v })}
                    min={1990} max={currentYear} step={1}
                  />
                  <NumField
                    label="Éves degradációs ráta"
                    info="A modul teljesítményének tipikus éves csökkenése öregedés miatt."
                    value={params.losses.annualDegradationRate}
                    onChange={(v) => v !== null && patchLosses({ annualDegradationRate: v })}
                    min={0} max={0.05} step={0.001}
                    helperText="1/év, pl. 0.005 = 0.5%/év"
                  />
                </SimpleGrid>

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                  <NumField
                    label="Szennyeződésekből származó maximális veszteség"
                    info="A különböző szennyeződések okozta havi teljesítménycsökkenés felső korlátja."
                    value={params.losses.soilingMaxLoss}
                    onChange={(v) => v !== null && patchLosses({ soilingMaxLoss: v })}
                    min={0} max={0.3} step={0.01}
                    helperText="0 és 0.3 között, pl. 0.06 = 6%"
                  />
                  <NumField
                    label="Állandó árnyékolási veszteség"
                    info="Fix árnyékoló objektum esetén, ha az időben nem változó veszteséget okoz."
                    value={params.losses.lShadeConstant}
                    onChange={(v) => v !== null && patchLosses({ lShadeConstant: v })}
                    min={0} max={0.9} step={0.01}
                    helperText="0 és 0.9 között"
                  />
                </SimpleGrid>
              </VStack>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>

      </Accordion.Root>
    </>
  )
}

// A masodik lepesen beluli menupontok leptetese
export const SecondStep = () => {
  usePageTitle("Napelemrendszer paraméterezése")

  const [view, setView] = useState<SecondStepView>('valasztosmenu')
  const { data, setData } = useWizardData()
  const form = useSystemParamsForm(data.systemParams)

  useEffect(() => {
    setData({ systemParams: form.params })
  }, [form.params])

  return (
    <AnimatedPage key={view}>
      {view === 'valasztosmenu' && (
        <ChoiceMenu
          onSelectPredefined={() => setView('eloremeghatarozottrendszer')}
          onSelectCustom={() => setView('sajatrendszer')}
        />
      )}
      {view === 'eloremeghatarozottrendszer' && (
        <PredefinedSystemMenu onBack={() => setView('valasztosmenu')} />
      )}
      {view === 'sajatrendszer' && (
        <CustomSystemMenu onBack={() => setView('valasztosmenu')} form={form} />
      )}
    </AnimatedPage>
  )
}
