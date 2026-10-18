from typing import Dict
from classes import DistributorType, TariffType, TariffPricing, WizardData

"""
Leiras: Az MVM lakossagi villamosenergia tarifainak leirasa.
"""

maximum_energy_consumption_per_year = 2523.0
export_price = 5.0

# MVM Demasz Aramhalozati Kft.
demasz_a1 = TariffPricing(
    baseFee=153.035, 
    discountedEnergyPrice=36.386, 
    marketEnergyPrice=70.104, 
)
demasz_a2 = TariffPricing(
    baseFee=153.035, 
    discountedEnergyPrice=41.085, 
    marketEnergyPrice=70.104, 
    offPeakDiscountedEnergyPrice=31.052, 
    offPeakMarketEnergyPrice=70.104, 
)
demasz_b_alap = TariffPricing(
    baseFee=50.165, 
    discountedEnergyPrice=22.962, 
    marketEnergyPrice=60.935, 
)
demasz_b_komfort = TariffPricing(
    baseFee=50.165, 
    discountedEnergyPrice=23.330, 
    marketEnergyPrice=60.935, 
)
demasz_h = TariffPricing(
    baseFee=50.165, 
    discountedEnergyPrice=22.962, 
    marketEnergyPrice=22.962, 
    hasNoConsumptionThreshold=True, 
)

demasz_tariffs: Dict[TariffType, TariffPricing] = {
    'a1': demasz_a1, 
    'a2': demasz_a2, 
    'b_alap': demasz_b_alap, 
    'b_komfort': demasz_b_komfort, 
    'h': demasz_h, 
}

# E.ON Del-dunantuli es Eszak-dunantuli Aramhalozati Zrt. + OPUS TITASZ Zrt.
eon_dd_ed_opus_a1 = TariffPricing(
    baseFee=153.035, 
    discountedEnergyPrice=35.293, 
    marketEnergyPrice=70.104, 
)
eon_dd_ed_opus_a2 = TariffPricing(
    baseFee=153.035, 
    discountedEnergyPrice=43.409, 
    marketEnergyPrice=70.104, 
    offPeakDiscountedEnergyPrice=32.766, 
    offPeakMarketEnergyPrice=70.104, 
)
eon_dd_ed_opus_b_alap = TariffPricing(
    baseFee=50.165, 
    discountedEnergyPrice=23.520, 
    marketEnergyPrice=60.935, 
)
eon_dd_ed_opus_h = TariffPricing(
    baseFee=50.165, 
    discountedEnergyPrice=23.520, 
    marketEnergyPrice=23.520, 
    hasNoConsumptionThreshold=True, 
)

eon_dd_ed_opus_tariffs: Dict[TariffType, TariffPricing] = {
    'a1': eon_dd_ed_opus_a1, 
    'a2': eon_dd_ed_opus_a2, 
    'b_alap': eon_dd_ed_opus_b_alap, 
    'h': eon_dd_ed_opus_h, 
}

# ELMU Halozati Kft.
elmu_a1 = TariffPricing(
    baseFee=153.035, 
    discountedEnergyPrice=36.208, 
    marketEnergyPrice=70.104, 
)
elmu_a2 = TariffPricing(
    baseFee=153.035, 
    discountedEnergyPrice=42.456, 
    marketEnergyPrice=70.104, 
    offPeakDiscountedEnergyPrice=32.169, 
    offPeakMarketEnergyPrice=70.104, 
)
elmu_b_alap = TariffPricing(
    baseFee=50.165, 
    discountedEnergyPrice=23.152, 
    marketEnergyPrice=60.935, 
)
elmu_h = TariffPricing(
    baseFee=50.165, 
    discountedEnergyPrice=23.152, 
    marketEnergyPrice=23.152, 
    hasNoConsumptionThreshold=True, 
)

elmu_tariffs: Dict[TariffType, TariffPricing] = {
    'a1': elmu_a1, 
    'a2': elmu_a2, 
    'b_alap': elmu_b_alap, 
    'h': elmu_h, 
}

# MVM Emasz Aramhalozati Kft.
emasz_a1 = TariffPricing(
    baseFee=153.035, 
    discountedEnergyPrice=35.992, 
    marketEnergyPrice=70.104, 
)
emasz_a2 = TariffPricing(
    baseFee=153.035, 
    discountedEnergyPrice=40.500, 
    marketEnergyPrice=70.104, 
    offPeakDiscountedEnergyPrice=30.988, 
    offPeakMarketEnergyPrice=70.104, 
)
emasz_b_alap = TariffPricing(
    baseFee=50.165, 
    discountedEnergyPrice=22.682, 
    marketEnergyPrice=60.935, 
)
emasz_h = TariffPricing(
    baseFee=50.165, 
    discountedEnergyPrice=22.682, 
    marketEnergyPrice=22.682, 
    hasNoConsumptionThreshold=True, 
)

emasz_tariffs: Dict[TariffType, TariffPricing] = {
    'a1': emasz_a1, 
    'a2': emasz_a2, 
    'b_alap': emasz_b_alap, 
    'h': emasz_h, 
}

# Az elosztok es a hozzajuk tartozo arkatalogus
tariff_catalog: Dict[DistributorType, Dict[TariffType, TariffPricing]] = {
    'mvm_demasz': demasz_tariffs, 
    'eon_del_dunantuli': eon_dd_ed_opus_tariffs, 
    'eon_eszak_dunantuli': eon_dd_ed_opus_tariffs, 
    'opus_titasz': eon_dd_ed_opus_tariffs, 
    'elmu': elmu_tariffs, 
    'mvm_emasz': emasz_tariffs, 
}

# Visszaadja a megoszto adott arszabasahoz tartozo egysegarakat
def get_tariff_pricing(distributor: DistributorType, tariff_type: TariffType) -> TariffPricing:
    catalog = tariff_catalog[distributor]
    return catalog[tariff_type]

# A napelemes (akkumulatoros) meresi pont tarifaja, ez alapjan szamolunk koltseget
def get_solar_pricing(data: WizardData) -> TariffPricing:
    for metering_point in data.meteringPoints:
        if metering_point.hasSolarConnection:
            try:
                return get_tariff_pricing(data.distributor, metering_point.tariffType)
            except KeyError:
                continue
    return get_tariff_pricing(data.distributor, 'a1')
