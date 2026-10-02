from typing import List, Dict, Any
from classes import Battery

"""
Leiras: Az energiaelosztasi algoritmusokat tartalmazo fajl.
"""

# BAU szabalyalapu strategia
def bau_strategy(solar_production: List[Dict[str, Any]], energy_consumption: List[Dict[str, Any]], battery: Battery) -> Dict[str, Any]:

    inverter_loss = sum(row.get("inverter_loss_kWh") for row in solar_production)

    # Akkumulator korlatainak megadasa
    soc_min = battery.socMin * battery.capacity
    soc_max = battery.socMax * battery.capacity
    
    soc = battery.soc0 * battery.capacity

    charge_limit = battery.pChargeMax * 0.25
    discharge_limit = battery.pDischargeMax * 0.25

    timeseries: List[Dict[str, Any]] = []

    # Osszesitok a diagramhoz
    total_pv_to_load = 0.0
    total_pv_to_battery = 0.0
    total_pv_to_grid = 0.0
    total_battery_to_load = 0.0
    total_grid_to_load = 0.0
    item_from_inverter: Dict[str, float] = {}
    item_from_battery: Dict[str, float] = {}

    for pv_row, load_row in zip(solar_production, energy_consumption):
        pv = pv_row["production_kWh"]
        load = load_row["consumption_kWh"]

        pv_to_load = 0.0
        pv_to_battery = 0.0
        pv_to_grid = 0.0
        battery_to_load = 0.0
        grid_to_load = 0.0

        # Tobblettermeles szamitasa
        surplus = pv - load

        if surplus > 0:
            # A fogyasztast teljes egeszeben a napelemrendszer fedezi
            pv_to_load = load

            # A maradek energia az toltesi korlatokat figyelembe veve az akkumulatorba kerul
            free_space = soc_max - soc
            max_soc_increase = max(0.0, min(free_space, charge_limit))
            if max_soc_increase > 0 and battery.etaCharge > 0:
                chargeable_input = min(surplus, max_soc_increase / battery.etaCharge)
                pv_to_battery = chargeable_input
                soc += chargeable_input * battery.etaCharge

            # Ami ezutan is megmaradt, az a halozatba megy vissza
            pv_to_grid = surplus - pv_to_battery
        else:
            deficit = -surplus
            # A megtermelt energia egesze a fogyasztohoz megy
            pv_to_load = pv

            # A maradek szukseges energia a fogyasztasi korlatokat figyelembe veve az akkumulatorbol elfogyasztasra kerul 
            stored_energy = soc - soc_min
            if stored_energy > 0:
                max_deliverable = stored_energy * battery.etaDischarge
                battery_to_load = min(deficit, max_deliverable, discharge_limit)
                if battery.etaDischarge > 0:
                    soc -= battery_to_load / battery.etaDischarge

            # A meg mindig hianyzo reszt a halozatbol hozzuk
            grid_to_load = deficit - battery_to_load

        soc = max(soc_min, min(soc, soc_max))

        total_pv_to_load += pv_to_load
        total_pv_to_battery += pv_to_battery
        total_pv_to_grid += pv_to_grid
        total_battery_to_load += battery_to_load
        total_grid_to_load += grid_to_load

        # Fogyasztasok kiosztasa
        if load > 0:
            load_from_inverter = load - battery_to_load
            for name, item_consumption in load_row.get("household_items", {}).items():
                share = item_consumption / load
                item_from_inverter[name] = item_from_inverter.get(name, 0.0) + share * load_from_inverter
                item_from_battery[name] = item_from_battery.get(name, 0.0) + share * battery_to_load

        timeseries.append({
            "date": pv_row["date"],
            "soc_kWh": round(soc, 4),
            "pv_to_load": round(pv_to_load, 4),
            "pv_to_battery": round(pv_to_battery, 4),
            "pv_to_grid": round(pv_to_grid, 4),
            "battery_to_load": round(battery_to_load, 4),
            "grid_to_load": round(grid_to_load, 4),
        })

    # Az akkumulator hatasfoka miatt fellepo veszteseg
    charge_loss = total_pv_to_battery * (1 - battery.etaCharge)
    discharge_loss = (
        total_battery_to_load * (1 / battery.etaDischarge - 1)
        if battery.etaDischarge > 0
        else 0.0
    )

    summary = {
        "pv_to_load": round(total_pv_to_load, 4),
        "pv_to_battery": round(total_pv_to_battery, 4),
        "pv_to_grid": round(total_pv_to_grid, 4),
        "battery_to_load": round(total_battery_to_load, 4),
        "grid_to_load": round(total_grid_to_load, 4),
        "inverter_loss": round(inverter_loss, 4),
        "charge_loss": round(charge_loss, 4),
        "discharge_loss": round(discharge_loss, 4),
        "item_from_inverter": {name: round(value, 4) for name, value in item_from_inverter.items()},
        "item_from_battery": {name: round(value, 4) for name, value in item_from_battery.items()},
    }

    print("\nBAU osszesito:\n", summary)

    return {
        "title": "alap stratégia (BAU)",
        "timeseries": timeseries,
        "summary": summary,
    }