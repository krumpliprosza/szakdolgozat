import pandas as pd
import numpy as np
import pvlib
from datetime import datetime, timezone
from typing import List, Dict, Any
from classes import SystemParameters, Location

"""
Leiras: A napelemrendszer termeleset meghatarozo fuggveny.
"""

pvsyst_parameters = pvlib.temperature.TEMPERATURE_MODEL_PARAMETERS["pvsyst"]

# Tajolas meghatarozasa
def get_surface_orientation(orientation, solar_zenith: pd.Series, solar_azimuth: pd.Series):
    # Fix tajolasu rendszer
    if orientation.trackingType == "fixed":
        # A panel a megadott ertekek szerint fixen all
        surface_tilt = pd.Series(orientation.surfaceTilt, index=solar_zenith.index)
        surface_azimuth = pd.Series(orientation.surfaceAzimuth, index=solar_zenith.index)
        return surface_tilt, surface_azimuth

    # Egytengelyes kovetesu rendszer
    if orientation.trackingType == "single_axis":
        tracking = pvlib.tracking.singleaxis(
            apparent_zenith=solar_zenith,
            solar_azimuth=solar_azimuth,
            axis_tilt=orientation.axisTilt,
            axis_azimuth=orientation.axisAzimuth,
            max_angle=orientation.maxTrackingAngle,
            backtrack=True,
            gcr=orientation.groundCoverageRatio,
        )
        # A panel a maximalis kovetesi szogig koveti a napot
        surface_tilt = tracking["surface_tilt"].fillna(0.0)
        surface_azimuth = tracking["surface_azimuth"].fillna(orientation.axisAzimuth)
        return surface_tilt, surface_azimuth

    # Ketttengelyes kovetesu rendszer
    if orientation.trackingType == "dual_axis":
        # A panel a maximalis kovetesi szogig merolegesen nez a napra
        surface_tilt = solar_zenith.clip(lower=0.0, upper=orientation.maxTrackingAngle)
        surface_azimuth = solar_azimuth.copy()
        return surface_tilt, surface_azimuth

    raise ValueError(f"Kezeletlen kovetesi tipus: {orientation.trackingType}")

# A modul korabol adodo teljesitmenycsokkenes kiszamitasa
def l_degradation_fc(timestamps: pd.DatetimeIndex, install_year: int, annual_degradation_rate: float) -> np.ndarray:
    years_elapsed = (timestamps.year - install_year) + (timestamps.dayofyear - 1) / 365.25
    years_elapsed = np.clip(years_elapsed, a_min=0.0, a_max=None)
    return np.power(1.0 - annual_degradation_rate, years_elapsed)

# Napelemrendszer termelesenek meghatarozasa
def solar_production_fc(weather_data: List[Dict[str, Any]], location: Location, system_parameters: SystemParameters) -> List[Dict[str, Any]]:
    weather_df = pd.DataFrame(weather_data)

    parsed_timestamps = weather_df["date"].apply(datetime.fromisoformat)
    timestamps = pd.DatetimeIndex(parsed_timestamps.apply(lambda ts: ts.astimezone(timezone.utc)))

    orientation = system_parameters.orientation
    module = system_parameters.module
    inverter = system_parameters.inverter
    losses = system_parameters.losses
    albedo = system_parameters.albedo.albedo

    ghi = weather_df["shortwave_radiation"].to_numpy(dtype=np.float64)
    dhi = weather_df["diffuse_radiation"].to_numpy(dtype=np.float64)
    dni = weather_df["direct_normal_irradiance"].to_numpy(dtype=np.float64)
    temp_air = weather_df["temperature_2m"].to_numpy(dtype=np.float64)
    wind_speed = weather_df["wind_speed_10m"].to_numpy(dtype=np.float64)

    # Napallas szamitasa
    solar_position = pvlib.solarposition.get_solarposition(
        time=timestamps,
        latitude=location.latitude,
        longitude=location.longitude,
    )
    solar_zenith = solar_position["apparent_zenith"]
    solar_azimuth = solar_position["azimuth"]

    # Panelfelulet doleseszoge es azimutja a kovetesi tipus alapjan
    surface_tilt, surface_azimuth = get_surface_orientation(orientation, solar_zenith, solar_azimuth)

    # Extraterresztrialis sugarzas es relativ legtomeg
    dni_extra = pvlib.irradiance.get_extra_radiation(timestamps)
    airmass = pvlib.atmosphere.get_relative_airmass(solar_zenith)

    # Sikra eso teljes sugarzas meghatarozasa (Perez-modell)
    poa = pvlib.irradiance.get_total_irradiance(
        surface_tilt=surface_tilt,
        surface_azimuth=surface_azimuth,
        solar_zenith=solar_zenith,
        solar_azimuth=solar_azimuth,
        dni=dni,
        ghi=ghi,
        dhi=dhi,
        dni_extra=dni_extra,
        airmass=airmass,
        albedo=albedo,
        model="perez",
    )

    # Beesesi szog (AOI) es az abbol szarmazo optikai veszteseg (IAM, ASHRAE modell)
    aoi = pvlib.irradiance.aoi(surface_tilt, surface_azimuth, solar_zenith, solar_azimuth)
    iam = pvlib.iam.ashrae(aoi, b=module.iamB0)

    poa_direct = poa["poa_direct"].fillna(0.0) * iam.fillna(0.0)
    poa_diffuse = poa["poa_sky_diffuse"].fillna(0.0) + poa["poa_ground_diffuse"].fillna(0.0)
    effective_irradiance = (poa_direct + poa_diffuse).clip(lower=0.0)

    # Ketoldali modulok eseten a hatso feluletre erkezo sugarzas beszamitasa
    if module.isBifacial:
        rear_irradiance = pd.Series(ghi, index=effective_irradiance.index) * albedo * module.bifaciality
        effective_irradiance = effective_irradiance + rear_irradiance.clip(lower=0.0)

    # Cella homersekletenek becslese (PVsyst modell)
    temp_parameters = pvsyst_parameters[module.mountType]
    cell_temperature = pvlib.temperature.pvsyst_cell(
        poa_global=effective_irradiance,
        temp_air=temp_air,
        wind_speed=wind_speed,
        **temp_parameters,
    )

    # DC teljesitmeny (PVWatts modell)
    dc_power = pvlib.pvsystem.pvwatts_dc(
        effective_irradiance=effective_irradiance,
        temp_cell=cell_temperature,
        pdc0=module.pStc,
        gamma_pdc=module.gammaPdc,
    )

    # Rendszervesztesegek
    total_losses = (1.0 - losses.lResistance) * (1.0 - losses.lMismatch) * (1.0 - losses.lSoilingMax) * (1.0 - losses.lShade) * l_degradation_fc(timestamps, losses.installYear, losses.annualDegradationRate)

    # DC teljesitmeny szamitasa
    dc_power_after_losses = (dc_power * total_losses).clip(lower=0.0)

    # AC teljesitmeny szamitasa (PVWatts inverter modell)
    inverter_pdc0 = inverter.pAc / inverter.inverterEfficiency
    ac_power = pvlib.inverter.pvwatts(
        pdc=dc_power_after_losses,
        pdc0=inverter_pdc0,
        eta_inv_nom=inverter.inverterEfficiency,
    ).clip(lower=0.0, upper=inverter.pAc)

    # Kimenet osszeallitasa
    dates = weather_df["date"].to_numpy()
    production_kwh = (ac_power * 0.25 / 1000).round(4).to_numpy()

    solar_production: List[Dict[str, Any]] = [
        {
            "date": dates[i],
            "production_kWh": float(production_kwh[i]),
        }
        for i in range(len(weather_df))
    ]

    return solar_production
