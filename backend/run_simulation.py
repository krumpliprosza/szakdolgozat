from fastapi import APIRouter
from receive_weather_data import receive_weather_data, WeatherDataRequest
from solar_production import solar_production_fc
from energy_consumption import energy_consumption_fc
from distribution_strategies import bau_strategy
from classes import WizardData

"""
Leiras: A szimulacio futasat vezerlo fuggveny.
"""

router = APIRouter()

@router.post("/run_simulation")
def run_simulation(data: WizardData):

    # Osszes bejovo adat
    print(f"\nData:\n{data}")

    # Idojarasi adatok begyujtese
    print(f"\nLocation: {data.location}")
    weather_data = receive_weather_data(WeatherDataRequest(latitude=data.location.latitude, longitude=data.location.longitude))

    # Napelemrendszer termelesenek meghatarozasa
    print(f"\nSystemParameters:\nOrientation: {data.systemParameters.orientation}\nModule: {data.systemParameters.module}\nInverter: {data.systemParameters.inverter}\nLosses: {data.systemParameters.losses}\nBattery: {data.systemParameters.battery}\nAlbedo: {data.systemParameters.albedo}")
    solar_production = solar_production_fc(weather_data, data.location, data.systemParameters)

    # Fogyasztott energia megszamolasa
    print(f"\nHouseholdItems:")
    for household_item in data.HouseholdItems:
        print(f"{household_item}\n")
    energy_consumption = energy_consumption_fc(weather_data, data.HouseholdItems)

    # Energiaelosztasi strategiak futtatasa
    strategy_1 = bau_strategy(solar_production, energy_consumption, data.systemParameters.battery)
    strategy_2 = None
    strategy_3 = None

    # Peldaadatok kiirasa
    print(f"\n--------------------------------------------------")
    print(f"\nweatherData pelda:\n{weather_data[0]}")
    print(f"\nsolarProduction pelda:\n{solar_production[0]}")
    print(f"\nenergyConsumption pelda:\n{energy_consumption[0]}")

    # Adatok osszefuzese
    return {
        "weatherData": weather_data,
        "solarProduction": solar_production,
        "energyConsumption": energy_consumption,
        "strategies": {
            "strategy1": strategy_1,
            "strategy2": strategy_2,
            "strategy3": strategy_3
        }
    }
