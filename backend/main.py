import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from run_simulation import router as run_simulation

load_dotenv()

app = FastAPI()

origins = [
    origin.strip() for origin in os.environ.get("ORIGINS").split(",") if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

"""
---------
Utvonalak
---------
"""

"""
Szimulacio futtatasa (/run_simulation)
"""
app.include_router(run_simulation)
