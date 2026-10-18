from fastapi import APIRouter
from receive_weather_data import receive_weather_data, WeatherDataRequest
from solar_production import solar_production_fc
from energy_consumption import energy_consumption_fc
from distribution_strategies import bau_strategy, cost_optimizer_strategy, add_metrics
from classes import WizardData
from tariffs import get_solar_pricing, export_price

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
    pricing = get_solar_pricing(data)

    strategy_1 = bau_strategy(solar_production, energy_consumption, data.systemParameters.battery.model_copy(update={"capacity": 0.0}))
    strategy_1["title"] = "akkumulátor nélküli rendszer"
    strategy_2 = bau_strategy(solar_production, energy_consumption, data.systemParameters.battery)
    strategy_3 = cost_optimizer_strategy(solar_production, energy_consumption, data.systemParameters.battery, pricing, export_price=export_price, reference_plan=strategy_2)

    # Osszehasonlithato mutatok (koltseg, ciklusok szama) mindharom strategiara
    for strategy in (strategy_1, strategy_2, strategy_3):
        add_metrics(strategy, data.systemParameters.battery, pricing, export_price)

    # Kimenetre szukseges adatok osszeallitasa
    weather_data = [{column: row[column] for column in ("date", "temperature_2m", "precipitation", "wind_speed_10m", "is_day")} for row in weather_data]
    solar_production = [{"date": row["date"], "production_kWh": row["production_kWh"]} for row in solar_production]
    energy_consumption = [{"date": row["date"], "consumption_kWh": row["consumption_kWh"]} for row in energy_consumption]
    strategies = [{"title": strategy["title"], "summary": strategy["summary"]} for strategy in (strategy_1, strategy_2, strategy_3)]

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
        "strategies": strategies
    }
