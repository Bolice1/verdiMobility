const KG_CO2_PER_LITER = 2.31; // average petrol

export function estimateImpact({ distanceKm, baselineDistanceKm, litersPer100km = 8 }) {
  if (!distanceKm || !baselineDistanceKm) return {};
  const fuelUsed = (distanceKm * litersPer100km) / 100;
  const baselineFuel = (baselineDistanceKm * litersPer100km) / 100;
  const fuelSavedLiters = Math.max(0, baselineFuel - fuelUsed);
  const co2SavedKg = fuelSavedLiters * KG_CO2_PER_LITER;
  return {
    fuelSavedLiters,
    co2SavedKg,
  };
}
