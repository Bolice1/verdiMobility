import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { Screen } from '../components/Screen';
import { useAuth } from '../context/AuthProvider';
import type { Vehicle } from '../../../shared/types';

export function MarketplaceScreen() {
  const { api } = useAuth();
  const [destination, setDestination] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const result = await api.vehicles.marketplace({
        limit: 30,
        destination: destination || undefined,
      });
      setVehicles(result.data);
      setLoading(false);
    };

    void load();
  }, [api, destination]);

  return (
    <Screen>
      <Card title="Marketplace" subtitle="Available cargo space across live fleets">
        <Field label="Filter by destination" value={destination} onChangeText={setDestination} />
      </Card>
      {loading ? <ActivityIndicator color="#86efac" /> : null}
      {vehicles.map((vehicle) => (
        <Card
          key={vehicle.id}
          title={`${vehicle.companyName ?? 'Fleet'} · ${vehicle.plateNumber}`}
          subtitle={`${vehicle.availableCargoSpace ?? vehicle.capacity} kg available`}
        >
          <Text style={styles.copy}>Destination: {vehicle.activeDestination ?? 'Open route'}</Text>
          <Text style={styles.copy}>Location: {vehicle.currentLocationLabel ?? 'Awaiting update'}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  copy: {
    color: '#dbeafe',
  },
});
