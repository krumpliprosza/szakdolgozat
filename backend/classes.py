from typing import List, Literal, Optional, Union
from pydantic import BaseModel, ConfigDict

"""
Leiras: Az osztalyok leirasa. 
"""

TrackingType = Literal['fixed', 'single_axis', 'dual_axis']
MountType = Literal[
    'freestanding',
    'semi_integrated',
    'insulated',
]
SystemParametersMode = Literal['predefined', 'custom']
ConsumptionProfileMode = Literal['predefined', 'custom']

class Orientation(BaseModel):
    trackingType: TrackingType
    surfaceTilt: float
    surfaceAzimuth: float
    axisTilt: float
    axisAzimuth: float
    maxTrackingAngle: float
    groundCoverageRatio: float

class Module(BaseModel):
    pStc: float
    gammaPdc: float
    mountType: MountType
    isBifacial: bool
    bifaciality: float
    iamB0: float

class Inverter(BaseModel):
    pAc: float
    inverterEfficiency: float

class Losses(BaseModel):
    lResistance: float
    lMismatch: float
    installYear: int
    annualDegradationRate: float
    lSoilingMax: float
    lShade: float

class Albedo(BaseModel):
    albedo: float

class Battery(BaseModel):
    capacity: float
    soc0: float
    socMin: float
    socMax: float
    pChargeMax: float
    pDischargeMax: float
    etaCharge: float
    etaDischarge: float

class SystemParameters(BaseModel):
    orientation: Orientation
    module: Module
    inverter: Inverter
    losses: Losses
    albedo: Albedo
    battery: Battery

class TemperatureCondition(BaseModel):
    type: Literal['temperature']
    comparator: Literal['>=', '>', '<=', '<']
    threshold: float

class IsDayOrNightCondition(BaseModel):
    type: Literal['isdayornight']
    comparator: Literal['isday', 'isnight']

UsageCondition = Union[TemperatureCondition, IsDayOrNightCondition]

class UsagePeriod(BaseModel):
    id: str
    wholeYear: bool
    startDate: str
    endDate: str
    wholeDay: bool
    startTime: str
    endTime: str
    condition: Optional[UsageCondition] = None

class HouseholdItem(BaseModel):
    id: str
    name: str
    count: int
    consumption: float
    dutyCycle: float
    usagePeriods: List[UsagePeriod]

class Location(BaseModel):
    latitude: float
    longitude: float

class WizardData(BaseModel):
    model_config = ConfigDict()

    location: Location
    systemParameters: SystemParameters
    systemParametersMode: SystemParametersMode
    selectedPredefinedSystemId: Optional[str]
    consumptionProfileMode: ConsumptionProfileMode
    selectedPredefinedProfileId: Optional[str]
    HouseholdItems: List[HouseholdItem]
