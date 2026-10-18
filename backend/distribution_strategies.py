from typing import List, Dict, Any, Optional, Tuple
from classes import Battery, TariffPricing
import numpy as np
from scipy.optimize import linprog
from scipy.sparse import coo_matrix
from tariffs import maximum_energy_consumption_per_year
from datetime import datetime

"""
Leiras: Az energiaelosztasi algoritmusokat tartalmazo fajl.
"""

# ----- Altalanos fuggvenyek -----

# Volgyidoszak meghatarozasa A2 tarifa eseten
def is_off_peak(date_str: str) -> bool:
    dt = datetime.fromisoformat(date_str)

    # Hetvege kezelese
    if dt.weekday() >= 5:
        return True

    # Az idozona-eltolas alapjan eldontesre kerul, hogy nyari idoszamitas van-e (nyaron UTC+2, telen UTC+1)
    offset = dt.utcoffset()
    is_summer_time = offset is not None and offset.total_seconds() >= 2 * 3600

    # Nyaron 23:00-07:00, telen 22:00-06:00
    if is_summer_time:
        return dt.hour >= 23 or dt.hour < 7
    return dt.hour >= 22 or dt.hour < 6

# Energiadij szamitasa
def calculate_energy_cost(timeseries: List[Dict[str, Any]], pricing: TariffPricing, export_price: float = 0.0) -> Dict[str, Any]:
    # Eves kedvezmenyes savhatar megadasa
    threshold = float("inf") if pricing.hasNoConsumptionThreshold else maximum_energy_consumption_per_year
    # Volgyidoszaki kedvezmeny kezelese
    has_off_peak = pricing.offPeakDiscountedEnergyPrice is not None

    # Osszesitok
    cumulated_import = 0.0 # A halozatbol importalt osszes energia
    discounted_import = 0.0 # Kedvezmenyes aru energia mennyisege
    market_import = 0.0 # Piaci aru energia mennyisege
    energy_cost = 0.0 # A halozati betaplalas ara
    export_kwh = 0.0 # A halozatba visszataplalt energia

    # Havi osszesito
    monthlyData: Dict[str, Dict[str, float]] = {}

    for row in timeseries:
        # "YYYY-MM" formatum
        month_key = row["date"][:7]

        monthly_data_collector = monthlyData.setdefault(month_key, {
            "grid_import_kWh": 0.0,
            "discounted_import_kWh": 0.0,
            "market_import_kWh": 0.0,
            "energy_cost_HUF": 0.0,
            "export_revenue_HUF": 0.0,
        })

        # Visszataplalas energiamennyisege + arazas
        pv_to_grid = row.get("pv_to_grid", 0.0)
        export_kwh += pv_to_grid
        monthly_data_collector["export_revenue_HUF"] += pv_to_grid * export_price

        # Halozatbol toltes energiamennyisege
        grid_import = row.get("grid_to_load", 0.0) + row.get("grid_to_battery", 0.0)
        if grid_import <= 0:
            continue

        # Tarifa alapjan az arazas meghatarozasa
        off_peak = has_off_peak and is_off_peak(row["date"])
        discounted_price = pricing.offPeakDiscountedEnergyPrice if off_peak else pricing.discountedEnergyPrice
        market_price = (
            pricing.offPeakMarketEnergyPrice
            if off_peak and pricing.offPeakMarketEnergyPrice is not None
            else pricing.marketEnergyPrice
        )

        # A kedvezmenyes es piaci aru energia meghatarozasa
        discounted_part = max(0.0, min(grid_import, threshold - cumulated_import))
        market_part = grid_import - discounted_part
        row_cost = discounted_part * discounted_price + market_part * market_price

        # Osszesitok frissitese
        energy_cost += row_cost
        discounted_import += discounted_part
        market_import += market_part
        cumulated_import += grid_import

        # Havi osszesitok frissitese
        monthly_data_collector["grid_import_kWh"] += grid_import
        monthly_data_collector["discounted_import_kWh"] += discounted_part
        monthly_data_collector["market_import_kWh"] += market_part
        monthly_data_collector["energy_cost_HUF"] += row_cost

    export_revenue = export_kwh * export_price

    # Havi osszesites
    monthly_list = [
        {
            "month": month,
            "grid_import_kWh": round(value["grid_import_kWh"], 4),
            "discounted_import_kWh": round(value["discounted_import_kWh"], 4),
            "market_import_kWh": round(value["market_import_kWh"], 4),
            "energy_cost_HUF": round(value["energy_cost_HUF"], 2),
            "export_revenue_HUF": round(value["export_revenue_HUF"], 2),
            "gross_cost_HUF": round(value["energy_cost_HUF"] - value["export_revenue_HUF"], 2),
        }
        for month, value in sorted(monthlyData.items())
    ]

    # Teljes osszesites
    return {
        "grid_import_kWh": round(cumulated_import, 4),
        "discounted_import_kWh": round(discounted_import, 4),
        "market_import_kWh": round(market_import, 4),
        "energy_cost_HUF": round(energy_cost, 2),
        "export_revenue_HUF": round(export_revenue, 2),
        "gross_cost_HUF": round(energy_cost - export_revenue, 2),
        "monthlyData": monthly_list,
    }

# Akkumulator ciklusszamanak meghatarozasa
def equivalent_full_cycles(battery_to_load: float, usable_capacity: float) -> float:
    return round(battery_to_load / usable_capacity, 2) if usable_capacity > 0 else 0.0

# Metrikak beszurasa
def add_metrics(result: Dict[str, Any], battery: Battery, pricing: TariffPricing, export_price: float = 0.0) -> Dict[str, Any]:
    # Osszesitett koltsegek kiszamitasa
    summary = result["summary"]
    summary["cost"] = calculate_energy_cost(result["timeseries"], pricing, export_price)

    # Akkumulator ciklusszamanak meghatarozasa
    usable_capacity = (battery.socMax - battery.socMin) * battery.capacity
    summary["battery_cycles"] = equivalent_full_cycles(summary["battery_to_load"], usable_capacity)

    # Akkumulator havi ciklusszamanak meghatarozasa
    monthly_battery_to_load: Dict[str, float] = {}
    for row in result["timeseries"]:
        month_key = row["date"][:7]
        monthly_battery_to_load[month_key] = monthly_battery_to_load.get(month_key, 0.0) + row.get("battery_to_load", 0.0)
    for month_cost in summary["cost"]["monthlyData"]:
        month_cost["battery_cycles"] = equivalent_full_cycles(monthly_battery_to_load.get(month_cost["month"], 0.0), usable_capacity)

    return result

# ----- 1-2. strategia -----

# BAU szabalyalapu (ezzel egyutt az onfogyasztast maximalizalo) strategia
def bau_strategy(solar_production: List[Dict[str, Any]], energy_consumption: List[Dict[str, Any]], battery: Battery) -> Dict[str, Any]:
    # Az inverter osszes vesztesege
    inverter_loss = sum(row.get("inverter_loss_kWh") for row in solar_production)

    # Akkumulator korlatai
    soc_min = battery.socMin * battery.capacity
    soc_max = battery.socMax * battery.capacity

    # Kezdeti toltottseg
    soc = battery.soc0 * battery.capacity

    # Toltesi es meritesi korlatok
    charge_limit = battery.pChargeMax * 0.25
    discharge_limit = battery.pDischargeMax * 0.25

    timeseries: List[Dict[str, Any]] = []

    # Osszesitok
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

        if surplus > 0: # Tobblettermeles
            # A fogyasztast a napelemrendszer fedezi
            pv_to_load = load

            # A maradek energia az akkumulatorba kerul
            free_space = soc_max - soc
            max_soc_increase = max(0.0, min(free_space, charge_limit))
            if max_soc_increase > 0 and battery.etaCharge > 0:
                chargeable_input = min(surplus, max_soc_increase / battery.etaCharge)
                pv_to_battery = chargeable_input
                soc += chargeable_input * battery.etaCharge

            # A maradek energia a halozatba kerul
            pv_to_grid = surplus - pv_to_battery
        else: # Nincs elegendo termeles
            deficit = -surplus
            # A megtermelt energia a fogyasztohoz megy
            pv_to_load = pv

            # A szukseges energiat az akkumulatorbol probaljuk fedezni
            stored_energy = soc - soc_min
            if stored_energy > 0:
                max_deliverable = stored_energy * battery.etaDischarge
                battery_to_load = min(deficit, max_deliverable, discharge_limit)
                if battery.etaDischarge > 0:
                    soc -= battery_to_load / battery.etaDischarge

            # A hianyzo energiat a halozatbol hozzuk
            grid_to_load = deficit - battery_to_load

        soc = max(soc_min, min(soc, soc_max))

        total_pv_to_load += pv_to_load
        total_pv_to_battery += pv_to_battery
        total_pv_to_grid += pv_to_grid
        total_battery_to_load += battery_to_load
        total_grid_to_load += grid_to_load

        # Az energiafogyasztas forras-eloszlasanak meghatarozasa
        if load > 0:
            load_from_inverter = load - battery_to_load
            for name, item_consumption in load_row.get("household_items", {}).items():
                share = item_consumption / load
                item_from_inverter[name] = item_from_inverter.get(name, 0.0) + share * load_from_inverter
                item_from_battery[name] = item_from_battery.get(name, 0.0) + share * battery_to_load

        # Egy 15 perces idoszak osszesitese
        timeseries.append({
            "date": pv_row["date"],
            "soc_kWh": round(soc, 4),
            "pv_to_load": round(pv_to_load, 4),
            "pv_to_battery": round(pv_to_battery, 4),
            "pv_to_grid": round(pv_to_grid, 4),
            "battery_to_load": round(battery_to_load, 4),
            "grid_to_load": round(grid_to_load, 4),
        })

    # Az akkumulatorbol kialakulo veszteseg meghatarozasa
    charge_loss = total_pv_to_battery * (1 - battery.etaCharge)
    discharge_loss = total_battery_to_load * (1 / battery.etaDischarge - 1) if battery.etaDischarge > 0 else 0.0

    # Teljes osszesites
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
        "title": "önfogyasztást maximalizáló stratégia (BAU)",
        "timeseries": timeseries,
        "summary": summary,
    }

# ----- 3. strategia -----

# Kedvezmenyes es piaci egysegarak meghatarozasa
def build_price_vectors(dates: List[str], pricing: TariffPricing, export_price: float, market: bool = False) -> Tuple[np.ndarray, np.ndarray]:
    # Visszataplalasi ar
    export_vector = np.full(len(dates), export_price)

    # Alap kedvezmenyes vagy piaci egysegar
    base_price = pricing.marketEnergyPrice if market else pricing.discountedEnergyPrice
    # Esetleges volgyidoszaki ar
    off_peak_price = pricing.offPeakMarketEnergyPrice if market else pricing.offPeakDiscountedEnergyPrice

    # Minden idopontban az alapar kerul beirasra
    import_vector = np.full(len(dates), float(base_price))
    if off_peak_price is not None:
        # Volgyidoszak eseten az annak megfelelo arral kerul felulirasra az alapar
        off_peak = np.array([is_off_peak(date) for date in dates], dtype=bool)
        import_vector[off_peak] = off_peak_price
    return import_vector, export_vector

# Egy idoablak LP modelljenek matrixait menti le, hogy ne kelljen ugyanolyan parameterek eseten ujraszamolni
lp_matrix_cache: Dict[Tuple[int, float, float], Tuple[Any, Any]] = {}

# Egy idoablak LP egyenletei es egyenlotlensegei
def lp_matrices(h: int, eta_charge: float, eta_discharge: float):
    # Roviditesi lehetoseg ellenorzese
    key = (h, eta_charge, eta_discharge)
    if key in lp_matrix_cache:
        return lp_matrix_cache[key]

    k = np.arange(h)
    # Segedfuggveny: egy adott attributumtipus (sor) osszes ertekenek indexeit adja vissza:
    # 0. sor eseten pv_to_load
    # 1. sor eseten pv_to_battery
    # 2. sor eseten pv_to_grid
    # 3. sor eseten battery_to_load
    # 4. sor eseten grid_to_load
    # 5. sor eseten grid_to_battery
    # 6. sor eseten SoC
    def get_column(block, index=k):
        return block * h + index

    rows, cols, values = [], [], []
    # Segedfuggveny egy egyutthato harmas hozzadasara a matrixhoz
    def add(row, column, value):
        rows.append(np.atleast_1d(row)); cols.append(np.atleast_1d(column)); values.append(np.broadcast_to(value, np.atleast_1d(column).shape).astype(float))

    # Energiamerleg a napelemrendszer termelesere
    # pv_to_load + pv_to_battery + pv_to_grid = pv
    for b in (0, 1, 2):
        add(k, get_column(b), 1.0)
    # Energiamerleg a fogyasztora
    # pv_to_load + battery_to_load + grid_to_load = load
    for b in (0, 3, 4):
        add(h + k, get_column(b), 1.0)
    # Az akkumulator toltottsegenek alakulasa (SoC-merleg)
    # soc_k - soc_(k - 1) - eta_charge * (pv_to_battery + grid_to_battery) + battery_to_load / eta_discharge = 0
    add(2 * h + k, get_column(6), 1.0)
    add(2 * h + k[1:], get_column(6, k[1:] - 1), -1.0)
    add(2 * h + k, get_column(1), -eta_charge)
    add(2 * h + k, get_column(5), -eta_charge)
    add(2 * h + k, get_column(3), 1.0 / eta_discharge)
    a_eq = coo_matrix((np.concatenate(values), (np.concatenate(rows), np.concatenate(cols))), shape=(3 * h, 7 * h)).tocsr()

    # A toltesi teljesitmeny nem lepheti tul a toltesi korlatot
    # eta_charge * (pv_to_battery + grid_to_battery) <= toltesi korlat (b_ub)
    r2 = np.concatenate([k, k])
    c2 = np.concatenate([get_column(1), get_column(5)])
    v2 = np.full(2 * h, eta_charge)
    a_ub = coo_matrix((v2, (r2, c2)), shape=(h, 7 * h)).tocsr()

    # A kiszamolt matrixokat elmentjuk
    lp_matrix_cache[key] = (a_eq, a_ub)
    return a_eq, a_ub

# Egy idoablak energiamozgasanak optimalizalasa
def solve_window(pv: np.ndarray, load: np.ndarray, soc_start: float, import_price: np.ndarray, export_price_vector: np.ndarray, allow_grid_charge: bool, battery: Battery, terminal_factor: float) -> Dict[str, np.ndarray]:
    h = len(pv)
    # Akkumulator korlatai es hatasfokai
    soc_min = battery.socMin * battery.capacity
    soc_max = battery.socMax * battery.capacity
    charge_limit = battery.pChargeMax * 0.25
    discharge_limit = battery.pDischargeMax * 0.25
    eta_c, eta_d = battery.etaCharge, battery.etaDischarge

    # Az egyenletek es egyenlotlensegek bal oldalai
    a_eq, a_ub = lp_matrices(h, eta_c, eta_d)

    # Az egyenletek jobb oldala
    b_eq = np.concatenate([pv, load, np.zeros(h)])
    b_eq[2 * h] = soc_start # A legelso SoC ertek az soc_start
    # Az egyenlotlensegek jobb oldala
    b_ub = np.full(h, charge_limit) # Minden idopontra a charge_limit lesz a korlat

    # Celfuggveny osszeallitasa (koltseg minimalizalasa)
    ref_price = float(np.mean(import_price))
    cycle_penalty = 1e-4 * ref_price
    c = np.zeros(7 * h)
    # c[0:h] (pv_to_load) alapertelmezetten 0 erteku, ez nem kerul atirasra
    c[h:2 * h] = cycle_penalty # pv_to_battery (egyenlo koltsegek eseten ennek koszonhetoen a kisebb ciklusszamu lepest valasztja majd az optimalizalo fuggveny)
    c[2 * h:3 * h] = -export_price_vector # pv_to_grid (a visszataplalt energia ara, negativ koltsegu)
    c[3 * h:4 * h] = cycle_penalty # battery_to_load (egyenlo koltsegek eseten ennek koszonhetoen a kisebb ciklusszamu lepest valasztja majd az optimalizalo fuggveny)
    c[4 * h:5 * h] = import_price # grid_to_load (a halozatbol vett energia ara)
    c[5 * h:6 * h] = import_price # grid_to_battery (a halozatbol vett energia ara)
    # c[6h:7h] az akkumulatorhoz  tartozik, a c[7h - 1] pedig batoritja arra az optimalizalo fuggvenyt, hogy az idoablak vegen minel tobb energiat hagyjon az akkumulatorban
    c[7 * h - 1] -= terminal_factor * eta_d * ref_price

    # Korlatozasok megadasa
    max_input = charge_limit / eta_c if eta_c > 0 else 0.0
    lower = np.zeros(7 * h)
    upper = np.full(7 * h, np.inf)
    upper[0:h] = np.minimum(pv, load) # pv_to_load (nem lehet tobb, mint a pv es load minimuma)
    upper[h:2 * h] = max_input # pv_to_battery (toltesi teljesitmenykorlat)
    upper[3 * h:4 * h] = discharge_limit # battery_to_load (kisutesi teljesitmenykorlat)
    upper[5 * h:6 * h] = max_input if allow_grid_charge else 0.0 # grid_to_battery (akkor lenyeges, ha engedett az akkumulator halozatrol valo toltese)
    lower[6 * h:7 * h] = soc_min # SoC also korlatja
    upper[6 * h:7 * h] = soc_max # SoC felso korlatja

    # A linearis programozási feladat megoldása
    result = linprog(c, A_ub=a_ub, b_ub=b_ub, A_eq=a_eq, b_eq=b_eq, bounds=np.column_stack([lower, upper]))
    if result.status != 0:
        raise RuntimeError(f"Az optimalizalo nem talalt megoldast: {result.message}")

    # A megoldasvektor
    x = np.clip(result.x, 0.0, None)
    # Osszesites
    return {
        "pv_to_load": x[0:h],
        "pv_to_battery": x[h:2 * h],
        "pv_to_grid": x[2 * h:3 * h],
        "battery_to_load": x[3 * h:4 * h],
        "grid_to_load": x[4 * h:5 * h],
        "grid_to_battery": x[5 * h:6 * h],
    }

# Gordulo horizontu tervezes
def rolling_plan(solar_production: List[Dict[str, Any]], energy_consumption: List[Dict[str, Any]], battery: Battery, horizon_steps: int, replan_steps: int, import_price: np.ndarray, export_price_vector: np.ndarray, allow_grid_charge: bool, threshold: float, market_price_for_window: Optional[np.ndarray], terminal_factor: float) -> List[Dict[str, float]]:
    # A termelesi es fogyasztasi idosorok osszegyujtese
    pv_all = np.array([r["production_kWh"] for r in solar_production[:len(solar_production)]], dtype=float)
    load_all = np.array([r["consumption_kWh"] for r in energy_consumption[:len(energy_consumption)]], dtype=float)

    # Akkumulator korlatai es a kezdeti toltottseg
    soc_min = battery.socMin * battery.capacity
    soc_max = battery.socMax * battery.capacity
    soc = min(max(battery.soc0 * battery.capacity, soc_min), soc_max)

    flows: List[Dict[str, float]] = []
    cumulative_grid_import = 0.0  # A tenylegesen vegrehajtott halozati vetel
    start = 0
    while start < len(solar_production):
        end = min(start + horizon_steps, len(solar_production))
        # Ha inditaskor mar atlepesre kerult a kedvezmenyes savhatar, piaci aron tervez
        window_price = import_price[start:end]
        if market_price_for_window is not None and cumulative_grid_import >= threshold:
            window_price = market_price_for_window[start:end]

        # Az aktualis 24 oras idotartamra vonatkozo optimalis terv kiszamitasa
        plan_step = solve_window(
            pv_all[start:end], load_all[start:end], soc,
            window_price, export_price_vector[start:end],
            allow_grid_charge, battery, terminal_factor,
        )

        executed = min(replan_steps, end - start)
        for k in range(executed):
            # Az adott lepes ertekei
            step = {name: float(values[k]) for name, values in plan_step.items()}
            # A toltottseg lepesenkenti kovetese
            soc += battery.etaCharge * (step["pv_to_battery"] + step["grid_to_battery"])
            soc -= step["battery_to_load"] / battery.etaDischarge
            soc = min(max(soc, soc_min), soc_max)
            step["soc"] = soc
            flows.append(step)
            # A savhatar-figyeleshez a halozati vetel osszeszamolasa
            cumulative_grid_import += step["grid_to_load"] + step["grid_to_battery"]
        start += executed
    return flows

# A lepesenkenti energiamozgasokbol idosor es osszesito keszitese
def build_result(solar_production: List[Dict[str, Any]], energy_consumption: List[Dict[str, Any]], flows: List[Dict[str, float]], battery: Battery) -> Dict[str, Any]:
    keys = ["pv_to_load", "pv_to_battery", "pv_to_grid", "battery_to_load", "grid_to_load", "grid_to_battery"]
    totals = {k: 0.0 for k in keys}
    item_from_inverter: Dict[str, float] = {}
    item_from_battery: Dict[str, float] = {}
    timeseries: List[Dict[str, Any]] = []

    for pv_row, load_row, flow in zip(solar_production, energy_consumption, flows):
        # Osszesitjuk az egyes energiaaram-tipusokat
        for k in keys:
            totals[k] += flow[k]

        # A fogyasztast aranyosan osztjuk fel a fogyasztok kozott
        load = load_row["consumption_kWh"]
        if load > 0:
            load_from_inverter = load - flow["battery_to_load"]
            for name, item_consumption in load_row.get("household_items", {}).items():
                share = item_consumption / load
                item_from_inverter[name] = item_from_inverter.get(name, 0.0) + share * load_from_inverter
                item_from_battery[name] = item_from_battery.get(name, 0.0) + share * flow["battery_to_load"]

        timeseries.append({
            "date": pv_row["date"],
            "soc_kWh": round(flow["soc"], 4),
            **{key: round(flow[key], 4) for key in keys},
        })

    # Vesztesegek osszegyujtese
    inverter_loss = sum(row.get("inverter_loss_kWh") for row in solar_production)
    charge_loss = (totals["pv_to_battery"] + totals["grid_to_battery"]) * (1 - battery.etaCharge)
    discharge_loss = totals["battery_to_load"] * (1 / battery.etaDischarge - 1) if battery.etaDischarge > 0 else 0.0

    # Osszesites
    summary = {
        **{key: round(value, 4) for key, value in totals.items()},
        "inverter_loss": round(inverter_loss, 4),
        "charge_loss": round(charge_loss, 4),
        "discharge_loss": round(discharge_loss, 4),
        "item_from_inverter": {name: round(value, 4) for name, value in item_from_inverter.items()},
        "item_from_battery": {name: round(value, 4) for name, value in item_from_battery.items()},
    }
    return {
        "title": "előretekintő költségoptimalizáló stratégia (24 óra)",
        "timeseries": timeseries,
        "summary": summary
    }

# Koltseg osszesito hozzaadasa
def add_cost(result: Dict[str, Any], pricing: TariffPricing, export_price: float) -> Dict[str, Any]:
    summary = dict(result["summary"])

    # A BAU strategia miatt alapertelmezett 0 ertek hozzaadasa a halozatbol az akkumulatorba tarto folyamhoz
    summary.setdefault("grid_to_battery", 0.0)

    # A valodi szamlakoltseg hozzaadasa
    summary["cost"] = calculate_energy_cost(result["timeseries"], pricing, export_price)
    return {"title": "előretekintő költségoptimalizáló stratégia (24 óra)", "timeseries": result["timeseries"], "summary": summary}

# 3 orankent 24 orara elorenezo koltsegoptimalizalo strategia
def cost_optimizer_strategy(solar_production: List[Dict[str, Any]], energy_consumption: List[Dict[str, Any]], battery: Battery, pricing: TariffPricing, export_price: float, reference_plan: Dict[str, Any], horizon_steps: int = 96, replan_steps: int = 12, terminal_factor: float = 0.9) -> Dict[str, Any]:
    dates = [row["date"] for row in solar_production]

    # Kedvezmenyes es piaci egysegarak meghatarozasa
    discounted_price, export_vector = build_price_vectors(dates, pricing, export_price)
    market_price, _ = build_price_vectors(dates, pricing, export_price, market=True)

    # Az eves kedvezmenyes savhatar meghatarozasa
    threshold = float("inf") if pricing.hasNoConsumptionThreshold else maximum_energy_consumption_per_year

    # Ha a kedvezmenyes arban van idobeli valtozas, engedi a halozatrol valo toltest
    allow_grid_charge = float(np.max(discounted_price)) - float(np.min(discounted_price)) > 1e-9

    # Gordulo horizontu tervezes, idosor es osszesito keszitese
    flows = rolling_plan(
        solar_production, energy_consumption, battery, horizon_steps, replan_steps,
        discounted_price, export_vector, allow_grid_charge, threshold, market_price, terminal_factor,
    )
    built = build_result(solar_production, energy_consumption, flows, battery)

    # A koltsegoptimalizalo terv es a BAU strategia osszeallitasa
    candidates = [add_cost(built, pricing, export_price), add_cost(reference_plan, pricing, export_price)]

    # A legolcsobb terv kerul kivalasztasra
    best = min(candidates, key=lambda cost: cost["summary"]["cost"]["gross_cost_HUF"])

    return best