import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { formatCurrency } from '../../../shared/utils/format';
import { Card } from '../components/Card';
import { Field } from '../components/Field';
import { Screen } from '../components/Screen';
import { useAuth } from '../context/AuthProvider';
import type { Shipment } from '../../../shared/types';

export function ShipmentBookingScreen() {
  const { api, user } = useAuth();
  const [form, setForm] = useState({
    pickupLocation: '',
    destination: '',
    weight: '',
    price: '',
  });
  const [shipments, setShipments] = useState<Shipment[]>([]);

  const loadShipments = async () => {
    const result = await api.shipments.list({ limit: 20 });
    setShipments(result.data);
  };

  useEffect(() => {
    void loadShipments();
  }, [api]);

  return (
    <Screen>
      {user?.role !== 'driver' && (
        <Card title="Book shipment" subtitle="Fast cargo request flow for mobile users">
          <Field label="Pickup" value={form.pickupLocation} onChangeText={(value) => setForm((current) => ({ ...current, pickupLocation: value }))} />
          <Field label="Destination" value={form.destination} onChangeText={(value) => setForm((current) => ({ ...current, destination: value }))} />
          <Field label="Weight (kg)" value={form.weight} onChangeText={(value) => setForm((current) => ({ ...current, weight: value }))} keyboardType="numeric" />
          <Field label="Price" value={form.price} onChangeText={(value) => setForm((current) => ({ ...current, price: value }))} keyboardType="numeric" />
          <Pressable
            style={styles.primary}
            onPress={async () => {
              await api.shipments.create({
                pickupLocation: form.pickupLocation,
                destination: form.destination,
                weight: Number(form.weight),
                price: Number(form.price),
              });
              setForm({ pickupLocation: '', destination: '', weight: '', price: '' });
              await loadShipments();
            }}
          >
            <Text style={styles.primaryLabel}>Create shipment</Text>
          </Pressable>
        </Card>
      )}

      <Card title="Recent shipments">
        {shipments.map((shipment) => (
          <Text key={shipment.id} style={styles.row}>
            {shipment.pickupLocation} to {shipment.destination} · {shipment.status} · {formatCurrency(shipment.price)}
          </Text>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  row: {
    color: '#e2e8f0',
    marginBottom: 8,
  },
});
