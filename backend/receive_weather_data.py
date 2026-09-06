from pydantic import BaseModel
import openmeteo_requests
import numpy as np
import pandas as pd
import requests_cache
from retry_requests import retry
from datetime import date, timedelta

"""
Leiras: Idojarasi adatok lekerdezese Open-Meteo-bol. 
"""

cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
openmeteo = openmeteo_requests.Client(session = retry_session)

class WeatherDataRequest(BaseModel):
    latitude: float
    longitude: float

def receive_weather_data(location: WeatherDataRequest):
    latitude = location.latitude
    longitude = location.longitude
    url = "https://historical-forecast-api.open-meteo.com/v1/forecast"
    params = {
        "longitude": longitude,
        "latitude": latitude,
        "start_date": (date.today() - timedelta(days=365)).isoformat(),
        "end_date": date.today().isoformat(),
        "minutely_15": ["temperature_2m", "precipitation", "wind_speed_10m", "shortwave_radiation", "diffuse_radiation", "direct_normal_irradiance", "is_day"],
        "timezone": "auto",
    }
    responses = openmeteo.weather_api(url, params = params)

    # Helyszin feldolgozasa
    response = responses[0]

    # 15 perces felbontasu adatok feldolgozasa
    minutely_15 = response.Minutely15()
    minutely_15_temperature_2m = np.round(minutely_15.Variables(0).ValuesAsNumpy().astype(np.float64), 2)
    minutely_15_precipitation = np.round(minutely_15.Variables(1).ValuesAsNumpy().astype(np.float64), 2)
    minutely_15_wind_speed_10m = np.round(minutely_15.Variables(2).ValuesAsNumpy().astype(np.float64), 2)
    minutely_15_shortwave_radiation = np.round(minutely_15.Variables(3).ValuesAsNumpy().astype(np.float64), 2)
    minutely_15_diffuse_radiation = np.round(minutely_15.Variables(4).ValuesAsNumpy().astype(np.float64), 2)
    minutely_15_direct_normal_irradiance = np.round(minutely_15.Variables(5).ValuesAsNumpy().astype(np.float64), 2)
    minutely_15_is_day = minutely_15.Variables(6).ValuesAsNumpy()

    minutely_15_data = {
        "date": pd.date_range(
            start = pd.to_datetime(minutely_15.Time(), unit = "s", utc = True),
            end =  pd.to_datetime(minutely_15.TimeEnd(), unit = "s", utc = True),
            freq = pd.Timedelta(seconds = minutely_15.Interval()),
            inclusive = "left"
        ).tz_convert(response.Timezone().decode())
    }

    minutely_15_data["temperature_2m"] = minutely_15_temperature_2m
    minutely_15_data["precipitation"] = minutely_15_precipitation
    minutely_15_data["wind_speed_10m"] = minutely_15_wind_speed_10m
    minutely_15_data["shortwave_radiation"] = minutely_15_shortwave_radiation
    minutely_15_data["diffuse_radiation"] = minutely_15_diffuse_radiation
    minutely_15_data["direct_normal_irradiance"] = minutely_15_direct_normal_irradiance
    minutely_15_data["is_day"] = minutely_15_is_day
    minutely_15_dataframe = pd.DataFrame(data = minutely_15_data)
    minutely_15_dataframe["date"] = minutely_15_dataframe["date"].astype(str)

    return minutely_15_dataframe.to_dict(orient="records")
