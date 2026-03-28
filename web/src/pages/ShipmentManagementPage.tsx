import { useState } from 'react';

import { formatCurrency, formatDate } from '../../../shared/utils/format';
import { useAuth } from '../context/AuthContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

export function ShipmentManagementPage() {
  const { api, user } = useAuth();
  const [filters, setFilters] = useState({ status: '' });
  const [form, setForm] = useState({
    pickupLocation: '',
    destination: '',
    weight: '',
    price: '',
  });
  const shipments = useAsyncData(
    () => api.shipments.list({ limit: 100, status: filters.status || undefined }),
    [filters.status],
  );

  return (
    <div className="page-stack">
      {['user', 'admin'].includes(user?.role || '') && (
        <Card title="Create Shipment">
          <form
            className="form-grid form-grid-compact"
            onSubmit={async (event) => {
              event.preventDefault();
              await api.shipments.create({
                pickupLocation: form.pickupLocation,
                destination: form.destination,
                weight: Number(form.weight),
                price: Number(form.price),
              });
              setForm({ pickupLocation: '', destination: '', weight: '', price: '' });
              await shipments.reload();
            }}
          >
            <Input label="Pickup" value={form.pickupLocation} onChange={(event) => setForm((current) => ({ ...current, pickupLocation: event.target.value }))} />
            <Input label="Destination" value={form.destination} onChange={(event) => setForm((current) => ({ ...current, destination: event.target.value }))} />
            <Input label="Weight (kg)" value={form.weight} onChange={(event) => setForm((current) => ({ ...current, weight: event.target.value }))} />
            <Input label="Price" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} />
            <Button type="submit">Book shipment</Button>
          </form>
        </Card>
      )}

      <Card
        title="Shipment Management"
        aside={
          <Select label="Status filter" value={filters.status} onChange={(event) => setFilters({ status: event.target.value })}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="matched">Matched</option>
            <option value="in_transit">In transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        }
      >
        <DataTable
          rows={shipments.data?.data || []}
          columns={[
            { key: 'pickupLocation', title: 'Pickup' },
            { key: 'destination', title: 'Destination' },
            { key: 'status', title: 'Status' },
            {
              key: 'price',
              title: 'Price',
              render: (shipment) => formatCurrency(shipment.price),
            },
            {
              key: 'createdAt',
              title: 'Created',
              render: (shipment) => formatDate(shipment.createdAt),
            },
          ]}
        />
      </Card>
    </div>
  );
}
