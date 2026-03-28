import { useMemo, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { Card } from '../components/ui/Card';
import { DataTable } from '../components/ui/DataTable';
import { Input } from '../components/ui/Input';

export function MarketplacePage() {
  const { api } = useAuth();
  const [filters, setFilters] = useState({
    destination: '',
    minAvailableCapacity: '',
  });

  const marketplace = useAsyncData(
    () =>
      api.vehicles.marketplace({
        limit: 100,
        destination: filters.destination || undefined,
        minAvailableCapacity: filters.minAvailableCapacity || undefined,
      }),
    [filters.destination, filters.minAvailableCapacity],
  );

  const rows = useMemo(() => marketplace.data?.data || [], [marketplace.data]);

  return (
    <div className="page-stack">
      <Card title="Cargo Space Marketplace" subtitle="Find available capacity across active fleets.">
        <div className="filters-grid">
          <Input label="Destination" value={filters.destination} onChange={(event) => setFilters((current) => ({ ...current, destination: event.target.value }))} />
          <Input
            label="Minimum capacity (kg)"
            value={filters.minAvailableCapacity}
            onChange={(event) => setFilters((current) => ({ ...current, minAvailableCapacity: event.target.value }))}
          />
        </div>
      </Card>
      <Card title="Available Vehicles">
        <DataTable
          rows={rows}
          columns={[
            { key: 'companyName', title: 'Company' },
            { key: 'plateNumber', title: 'Vehicle' },
            { key: 'availableCargoSpace', title: 'Available Cargo' },
            { key: 'activeDestination', title: 'Destination' },
            { key: 'currentLocationLabel', title: 'Current Location' },
          ]}
        />
      </Card>
    </div>
  );
}
