import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { useAuth } from '../context/AuthProvider';
import type { Vehicle } from '../../../shared/types';

export function TrackingScreen() {
  const { api } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const load = async () => {
      const result = await api.vehicles.marketplace({ limit: 50 });
      setVehicles(result.data);
    };
    void load();
  }, [api]);

  return (
    <Screen scroll={false}>
      <Card title="Vehicle Tracking" subtitle="Map-based fleet visibility">
        <Text style={styles.copy}>Active vehicle positions and open capacity.</Text>
      </Card>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -1.9441,
          longitude: 30.0619,
          latitudeDelta: 1.4,
          longitudeDelta: 1.4,
        }}
      >
        {vehicles.map((vehicle) => {
          if (!vehicle.currentLatitude || !vehicle.currentLongitude) return null;
          return (
            <Marker
              key={vehicle.id}
              coordinate={{
                latitude: Number(vehicle.currentLatitude),
                longitude: Number(vehicle.currentLongitude),
              }}
              title={vehicle.plateNumber}
              description={`${vehicle.availableCargoSpace ?? vehicle.capacity} kg • ${vehicle.activeDestination ?? 'Open route'}`}
            />
          );
        })}
      </MapView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  copy: {
    color: '#cbd5e1',
  },
  map: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
});
