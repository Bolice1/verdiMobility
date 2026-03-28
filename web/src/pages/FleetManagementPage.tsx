import { useState } from 'react';

import { formatDate } from '../../../shared/utils/format';
import { useAuth } from '../context/AuthContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';

export function FleetManagementPage() {
  const { api, user } = useAuth();
  const [vehicleForm, setVehicleForm] = useState({
    companyId: user?.companyId || '',
    plateNumber: '',
    capacity: '',
    status: 'available',
    currentLatitude: '',
    currentLongitude: '',
    currentLocationLabel: '',
  });

  const fleet = useAsyncData(
    () => api.vehicles.list({ limit: 100 }),
    [],
  );

  return (
    <div className="page-stack">
      <Card title="Fleet Management" subtitle="Manage vehicles, live locations, and operating capacity.">
        <form
          className="form-grid form-grid-compact"
          onSubmit={async (event) => {
            event.preventDefault();
            await api.vehicles.create({
              companyId: vehicleForm.companyId,
              plateNumber: vehicleForm.plateNumber,
              capacity: Number(vehicleForm.capacity),
              status: vehicleForm.status,
              currentLatitude: vehicleForm.currentLatitude ? Number(vehicleForm.currentLatitude) : undefined,
              currentLongitude: vehicleForm.currentLongitude ? Number(vehicleForm.currentLongitude) : undefined,
              currentLocationLabel: vehicleForm.currentLocationLabel || undefined,
            });
            setVehicleForm({
              companyId: user?.companyId || '',
              plateNumber: '',
              capacity: '',
              status: 'available',
              currentLatitude: '',
              currentLongitude: '',
              currentLocationLabel: '',
            });
            await fleet.reload();
          }}
        >
          {user?.role === 'admin' && (
            <Input label="Company ID" value={vehicleForm.companyId} onChange={(event) => setVehicleForm((current) => ({ ...current, companyId: event.target.value }))} />
          )}
          <Input label="Plate Number" value={vehicleForm.plateNumber} onChange={(event) => setVehicleForm((current) => ({ ...current, plateNumber: event.target.value }))} />
          <Input label="Capacity (kg)" value={vehicleForm.capacity} onChange={(event) => setVehicleForm((current) => ({ ...current, capacity: event.target.value }))} />
          <Select label="Status" value={vehicleForm.status} onChange={(event) => setVehicleForm((current) => ({ ...current, status: event.target.value }))}>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </Select>
          <Input label="Latitude" value={vehicleForm.currentLatitude} onChange={(event) => setVehicleForm((current) => ({ ...current, currentLatitude: event.target.value }))} />
          <Input label="Longitude" value={vehicleForm.currentLongitude} onChange={(event) => setVehicleForm((current) => ({ ...current, currentLongitude: event.target.value }))} />
          <Input label="Location Label" value={vehicleForm.currentLocationLabel} onChange={(event) => setVehicleForm((current) => ({ ...current, currentLocationLabel: event.target.value }))} />
          <Button type="submit">Add vehicle</Button>
        </form>
      </Card>

      <Card title="Fleet Register">
        <DataTable
          rows={fleet.data?.data || []}
          columns={[
            { key: 'plateNumber', title: 'Plate' },
            { key: 'status', title: 'Status' },
            { key: 'capacity', title: 'Capacity' },
            { key: 'availableCargoSpace', title: 'Available Cargo' },
            { key: 'currentLocationLabel', title: 'Location' },
            {
              key: 'lastLocationUpdatedAt',
              title: 'Updated',
              render: (vehicle) => formatDate(vehicle.lastLocationUpdatedAt),
            },
          ]}
        />
      </Card>
    </div>
  );
}
