import { Card, Heading, Text } from '@chakra-ui/react'
import { SelectField, SwitchField } from '../../../components/FormFields'
import { distributorList, tariffList, mainCircuitTariffs, controlledCircuitTariffs, tariffLabels, mainMeteringPointId, controlledMeteringPointId, type DistributorType, type MeteringPoint, type TariffType } from '../../../steps/WizardDataContext'

// Leiras: A halozati eloszto es a meresi pontok tarifajanak kivalasztasahoz tartozo szekcio.

interface MeteringPointsSectionProps {
  distributor: DistributorType
  onDistributorChange: (distributor: DistributorType) => void
  meteringPoints: MeteringPoint[]
  onMeteringPointsChange: (points: MeteringPoint[]) => void
  onControlledPointRemoved: (removedMeteringPointId: string) => void
}

// Egy adott korhoz tartozo, az aktualis elosztonal elerheto tarifak
const tariffOptions = (distributor: DistributorType, allowedTypes: TariffType[]) =>
  tariffList[distributor]
    .filter((type) => allowedTypes.includes(type))
    .map((type) => ({ label: tariffLabels[type], value: type }))

export const MeteringPointsSection = ({
  distributor,
  onDistributorChange,
  meteringPoints,
  onMeteringPointsChange,
  onControlledPointRemoved,
}: MeteringPointsSectionProps) => {
  const mainPoint = meteringPoints.find((point) => point.id === mainMeteringPointId) ?? meteringPoints[0]
  const controlledPoint = meteringPoints.find((point) => point.id === controlledMeteringPointId)

  // Eloszto valtasanak kezelese
  const handleDistributorChange = (nextDistributor: DistributorType) => {
    onDistributorChange(nextDistributor)
    const mainOptions = tariffOptions(nextDistributor, mainCircuitTariffs)
    const controlledOptions = tariffOptions(nextDistributor, controlledCircuitTariffs)
    onMeteringPointsChange(
      meteringPoints.map((point) => {
        const isMain = point.id === mainMeteringPointId
        const options = isMain ? mainOptions : controlledOptions
        if (options.some((option) => option.value === point.tariffType)) return point
        return { ...point, tariffType: options[0].value as TariffType }
      })
    )
  }

  // Tarifa valtasanak kezelese
  const handleTariffChange = (meteringPointId: string, value: string) => {
    onMeteringPointsChange(
      meteringPoints.map((point) => (point.id === meteringPointId ? { ...point, tariffType: value as TariffType } : point))
    )
  }

  // Vezerelt kor kapcsolojanak kezelese
  const handleToggleControlledPoint = (checked: boolean) => {
    if (checked) {
      const defaultOptions = tariffOptions(distributor, controlledCircuitTariffs)
      onMeteringPointsChange([
        ...meteringPoints,
        { id: controlledMeteringPointId, label: 'Vezérelt kör', tariffType: defaultOptions[0].value as TariffType, hasSolarConnection: false },
      ])
    } else {
      onMeteringPointsChange(meteringPoints.filter((point) => point.id !== controlledMeteringPointId))
      onControlledPointRemoved(controlledMeteringPointId)
    }
  }

  return (
    <Card.Root borderColor="purple.border" borderWidth="2px" mb={6}>
      <Card.Body gap={4}>
        <Heading size="md">Mérési pontok és tarifák</Heading>
        <Text color="fg.muted" fontSize="sm">
          Itt adhatod meg, hogy háztartásod melyik hálózati elosztóhoz tartozik, és milyen tarifák kerülnek alkalmazásra.
        </Text>

        <SelectField
          label="A felhasználási helyen illetékes elosztó"
          info="Az az elosztó, amelyik a telephely áramellátásáért és az árszabásért felelős."
          value={distributor}
          onChange={(value) => handleDistributorChange(value as DistributorType)}
          options={distributorList}
        />

        <SelectField
          label="Fő kör tarifája"
          info="Az általános háztartási fogyasztás és a napelem termelése ehhez a mérési ponthoz tartozik."
          value={mainPoint.tariffType}
          onChange={(value) => handleTariffChange(mainMeteringPointId, value)}
          options={tariffOptions(distributor, mainCircuitTariffs)}
        />

        <SwitchField
          label="A háztartás tartalmaz vezérelt kört is"
          info="Ha be van kapcsolva, akkor a háztartási eszközök egy vezérelt körhöz kapcsolására is lehetőség nyílik."
          checked={Boolean(controlledPoint)}
          onChange={handleToggleControlledPoint}
        />

        {controlledPoint && (
          <SelectField
            label="Vezérelt kör tarifája"
            info="A vezérelt kör olyan eszközöket tartalmaz, amelyek külön mérőórán, külön tarifával vannak elszámolva. A napelem termelése ezt a kört nem tudja táplálni."
            value={controlledPoint.tariffType}
            onChange={(value) => handleTariffChange(controlledMeteringPointId, value)}
            options={tariffOptions(distributor, controlledCircuitTariffs)}
          />
        )}
      </Card.Body>
    </Card.Root>
  )
}