from fastapi import APIRouter
from receive_weather_data import receive_weather_data, WeatherDataRequest
from classes import WizardData

"""
Leiras: A szimulacio futasat vezerlo fuggveny.
"""

router = APIRouter()

@router.post("/run_simulation")
def run_simulation(data: WizardData):

    # Idojarasi adatok begyujtese
    weather_data = receive_weather_data(WeatherDataRequest(latitude=data.location.latitude, longitude=data.location.longitude))
    print("Idojarasi adatok pelda: ", weather_data[0])

    # Napelemrendszer termelesenek meghatarozasa
    solar_production = None

    # Fogyasztott energia megszamolasa
    energy_consumption = None

    # Energiaelosztasi strategiak futtatasa
    strategy_1, strategy_2, strategy_3 = None, None, None

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
