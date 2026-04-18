import { env } from '../config/index.js';

const DIRECTIONS_URL = 'https://maps.googleapis.com/maps/api/directions/json';

/**
 * Fetch driving distance and duration between two locations using Google Directions API.
 * Returns null if API key is missing.
 */
export async function getDrivingMetrics({ origin, destination }) {
  if (!env.googleMapsApiKey) return null;

  const url = new URL(DIRECTIONS_URL);
  url.searchParams.set('origin', origin);
  url.searchParams.set('destination', destination);
  url.searchParams.set('mode', 'driving');
  url.searchParams.set('key', env.googleMapsApiKey);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`maps_api_failed_${res.status}`);
  }
  const data = await res.json();
  if (data.status !== 'OK') {
    throw new Error(`maps_status_${data.status}`);
  }
  const leg = data.routes?.[0]?.legs?.[0];
  if (!leg?.distance?.value || !leg?.duration?.value) {
    throw new Error('maps_missing_leg');
  }
  return {
    distanceKm: leg.distance.value / 1000,
    durationMin: leg.duration.value / 60,
  };
}
