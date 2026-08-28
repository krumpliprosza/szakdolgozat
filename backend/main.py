from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import openmeteo_requests
import pandas as pd
import requests_cache
from retry_requests import retry
from datetime import date, timedelta

''' TODO lista

    - fastapi deploy atnezese
    - majd legyen a start_time timedelta-nal a napok szama 365
    - requirements.txt vagy hasonlo keszitese

'''

app = FastAPI()
cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
openmeteo = openmeteo_requests.Client(session = retry_session)
origins = [
    "https://szakdolgozat.fastapicloud.dev",
    "http://localhost",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return "Backend OK"

# Idojarasi adatok lekerdezese
@app.get("/receive_weather_data/{longitude}/{latitude}")
def receive_weather_data(longitude: float, latitude: float):
    url = "https://historical-forecast-api.open-meteo.com/v1/forecast"
    params = {
        "longitude": longitude,
        "latitude": latitude,
        "start_date": (date.today() - timedelta(days=30)).isoformat(),
        "end_date": date.today().isoformat(),
        "minutely_15": ["temperature_2m", "precipitation", "wind_speed_10m", "shortwave_radiation", "diffuse_radiation", "direct_normal_irradiance", "is_day"],
        "timezone": "auto",
    }
    responses = openmeteo.weather_api(url, params = params)

    # Helyszin feldolgozasa
    response = responses[0]

    # 15 perces felbontasu adatok feldolgozasa
    minutely_15 = response.Minutely15()
    minutely_15_temperature_2m = minutely_15.Variables(0).ValuesAsNumpy()
    minutely_15_precipitation = minutely_15.Variables(1).ValuesAsNumpy()
    minutely_15_wind_speed_10m = minutely_15.Variables(2).ValuesAsNumpy()
    minutely_15_shortwave_radiation = minutely_15.Variables(3).ValuesAsNumpy()
    minutely_15_diffuse_radiation = minutely_15.Variables(4).ValuesAsNumpy()
    minutely_15_direct_normal_irradiance = minutely_15.Variables(5).ValuesAsNumpy()
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
