import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { createVehicleRealtimeConnection } from '../../../shared/api/realtime';
import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { Screen } from '../components/Screen';
import { useAuth } from '../context/AuthProvider';
import type { Vehicle } from '../../../shared/types';
import { getStoredTokens } from '../services/api';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5987';

export function TrackingScreen() {
  const { api, user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleId, setVehicleId] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationLabel, setLocationLabel] = useState('');

  useEffect(() => {
    const mergeVehicle = (incoming: Vehicle) => {
      setVehicles((current) => {
        const index = current.findIndex((vehicle) => vehicle.id === incoming.id);
        if (index === -1) return [incoming, ...current];
        const next = current.slice();
        next[index] = { ...next[index], ...incoming };
        return next;
      });
    };

    const load = async () => {
      const result = await api.vehicles.marketplace({ limit: 50 });
      setVehicles(result.data);
    };
    void load();

    const connection = createVehicleRealtimeConnection(
      API_BASE_URL,
      () => getStoredTokens(),
      (message) => {
        if (message.type !== 'vehicle.update') return;
        mergeVehicle(message.vehicle);
      },
    );

    return () => {
      connection.close();
    };
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
          if (
            vehicle.currentLatitude === null ||
            vehicle.currentLatitude === undefined ||
            vehicle.currentLongitude === null ||
            vehicle.currentLongitude === undefined
          ) {
            return null;
          }
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
      {user?.role === 'driver' && (
        <Card title="Publish location" subtitle="Push fresh coordinates to the live fleet map">
          <Field label="Vehicle ID" value={vehicleId} onChangeText={setVehicleId} />
          <Field label="Latitude" value={latitude} onChangeText={setLatitude} keyboardType="numeric" />
          <Field label="Longitude" value={longitude} onChangeText={setLongitude} keyboardType="numeric" />
          <Field label="Location label" value={locationLabel} onChangeText={setLocationLabel} />
          <Pressable
            style={styles.primary}
            onPress={async () => {
              await api.vehicles.updateLocation(vehicleId, {
                currentLatitude: Number(latitude),
                currentLongitude: Number(longitude),
                currentLocationLabel: locationLabel || undefined,
              });
              setLatitude('');
              setLongitude('');
              setLocationLabel('');
            }}
          >
            <Text style={styles.primaryLabel}>Send live update</Text>
          </Pressable>
        </Card>
      )}
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
  primary: {
    backgroundColor: '#15803d',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryLabel: {
    color: '#f0fdf4',
    fontWeight: '700',
  },
});
