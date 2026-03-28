import { useDeferredValue, useEffect, useMemo, useState } from 'react';

import { createVehicleRealtimeConnection } from '../../../shared/api/realtime';
import type { Vehicle } from '../../../shared/types';
import { getStoredTokens } from '../services/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5987';

function mergeVehicle(current: Vehicle[], incoming: Vehicle) {
  const index = current.findIndex((vehicle) => vehicle.id === incoming.id);
  if (index === -1) {
    return [incoming, ...current];
  }
  const next = current.slice();
  next[index] = {
    ...next[index],
    ...incoming,
  };
  return next;
}

export function useVehicleRealtimeFeed(initialVehicles: Vehicle[]) {
  const [vehicles, setVehicles] = useState(initialVehicles);

  useEffect(() => {
    setVehicles(initialVehicles);
  }, [initialVehicles]);

  useEffect(() => {
    const connection = createVehicleRealtimeConnection(
      API_BASE_URL,
      () => getStoredTokens(),
      (message) => {
        if (message.type !== 'vehicle.update') return;
        setVehicles((current) => mergeVehicle(current, message.vehicle));
      },
    );

    return () => {
      connection.close();
    };
  }, []);

  const deferredVehicles = useDeferredValue(vehicles);

  return useMemo(
    () =>
      deferredVehicles.filter(
        (vehicle) =>
          vehicle.currentLatitude !== null &&
          vehicle.currentLatitude !== undefined &&
          vehicle.currentLongitude !== null &&
          vehicle.currentLongitude !== undefined,
      ),
    [deferredVehicles],
  );
}
