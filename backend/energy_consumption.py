import pandas as pd
import numpy as np
from datetime import datetime, time as Time
from typing import List, Dict, Any
from classes import HouseholdItem, UsagePeriod

"""
Leiras: Az energiafogyasztast meghatarozo fuggveny.
"""

def get_date(date: str) -> datetime:
    return datetime.strptime(date, "%Y-%m-%d").date()

def get_time(time: str) -> Time:
    return datetime.strptime(time, "%H:%M").time()

# Szurok a hasznalati feltetelekre
def condition_filter_fc(condition, temperature: pd.Series, is_day: pd.Series) -> pd.Series:
    if condition is None:
        return pd.Series(True, index=temperature.index)

    condition_type = getattr(condition, "type", None)

    # Homerseklet feltetel
    if condition_type == "temperature":
        threshold = condition.threshold
        comparator = condition.comparator
        if comparator == ">=":
            return temperature >= threshold
        if comparator == ">":
            return temperature > threshold
        if comparator == "<=":
            return temperature <= threshold
        if comparator == "<":
            return temperature < threshold
        raise ValueError(f"Kezeletlen relacios jel: {comparator}")

    # Napszak feltetel
    if condition_type == "isdayornight":
        comparator = condition.comparator
        if comparator == "isday":
            return is_day == 1.0
        if comparator == "isnight":
            return is_day == 0.0
        raise ValueError(f"Kezeletlen relacios jel: {comparator}")

    raise ValueError(f"Kezeletlen feltetel tipus: {condition_type}")

# Szurok a hasznalati idoszakokra
def usage_period_filter_fc(usage_period: UsagePeriod, dates: pd.Series, times: pd.Series, temperature: pd.Series, is_day: pd.Series) -> pd.Series:
    # Datumok ellenorzese
    start_date = get_date(usage_period.startDate)
    end_date = get_date(usage_period.endDate)
    if start_date <= end_date:
        date_filter = (dates >= start_date) & (dates <= end_date)
    else:
        # Evfordulon atnyulo idoszak
        date_filter = (dates >= start_date) | (dates <= end_date)

    # Idoszakok ellenorzese
    start_time = get_time(usage_period.startTime)
    end_time = get_time(usage_period.endTime)
    if usage_period.wholeDay:
        time_filter = pd.Series(True, index=times.index)
    else:
        time_filter = (times >= start_time) & (times < end_time)

    # Feltetelek ellenorzese
    condition_filter = condition_filter_fc(usage_period.condition, temperature, is_day)

    return date_filter & time_filter & condition_filter

# Az aktiv ciklusido kezelese
def duty_cycle_handler(is_active: pd.Series, duty_cycle: float, rated_power: float, scale: int = 10000000) -> pd.Series:
    # A float hibaja miatt skalazas
    duty_cycle_scaled = round(duty_cycle * scale)

    # Aktiv idolepesekben a ciklusidot halmozzuk
    cumulated_duty_cycle = (is_active.to_numpy(dtype=np.int64) * duty_cycle_scaled).cumsum()

    # Visszaalakitas 1-es merteku lepesekre (0, 1, 2, ...)
    duty_level = cumulated_duty_cycle // scale

    # Az eszkoz akkor indul, amikor a duty_cycle egeszre valt (0 -> 1, 1 -> 2, ...)
    is_triggered = np.diff(duty_level, prepend=0) > 0

    # A valtasok helyen (aktiv ciklusido) a rated_powert allitjuk be, egyebkent 0-t
    power = np.where(is_triggered, rated_power, 0.0)
    return pd.Series(power, index=is_active.index)


def energy_consumption_fc(weather_data: List[Dict[str, Any]], household_items: List[HouseholdItem]) -> List[Dict[str, Any]]:
    weather_df = pd.DataFrame(weather_data)

    # Idobelyegek szetbontasa datumra es idore
    timestamps = weather_df["date"].apply(datetime.fromisoformat)
    dates = timestamps.apply(lambda timestamp: timestamp.date())
    times = timestamps.apply(lambda timestamp: timestamp.time())

    # Idojarasi oszlopok kiolvasasa
    temperature = weather_df.get("temperature_2m")
    is_day = weather_df.get("is_day")

    total_consumption = pd.Series(0.0, index=weather_df.index)
    consumption_per_item: Dict[str, pd.Series] = {}

    for item in household_items:
        # Aktiv hasznalati idoszakok meghatarozasa
        is_item_active = pd.Series(False, index=weather_df.index)
        for usage_period in item.usagePeriods:
            period_filter = usage_period_filter_fc(usage_period, dates, times, temperature, is_day)
            is_item_active = is_item_active | period_filter

        # Aktiv ciklusidok meghatarozasa, teljesitmeny szamitasa
        rated_power = item.count * item.consumption
        item_consumption = duty_cycle_handler(is_item_active, item.dutyCycle, rated_power)

        consumption_per_item[item.name] = item_consumption
        total_consumption = total_consumption + item_consumption

    # Kimenet osszeallitasa
    dates = weather_df["date"].to_numpy()
    consumption_kwh = (total_consumption * 0.25 / 1000).round(4).to_numpy()
    item_consumption_arrays = {
        name: (series * 0.25 / 1000).round(4).to_numpy() for name, series in consumption_per_item.items()
    }

    energy_consumption: List[Dict[str, Any]] = [
        {
            "date": dates[i],
            "consumption_kWh": float(consumption_kwh[i]),
            "household_items": {name: float(household_items[i]) for name, household_items in item_consumption_arrays.items()},
        }
        for i in range(len(weather_df))
    ]

    return energy_consumption
