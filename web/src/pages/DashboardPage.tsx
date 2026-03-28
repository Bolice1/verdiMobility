import { useMemo } from 'react';

import { formatCompactNumber, formatCurrency } from '../../../shared/utils/format';
import { useAuth } from '../context/AuthContext';
import { useAsyncData } from '../hooks/useAsyncData';
import { OverviewCharts } from '../components/charts/OverviewCharts';
import { Card } from '../components/ui/Card';
import { StatsCard } from '../components/ui/StatsCard';

export function DashboardPage() {
  const { user, api } = useAuth();

  const adminOverview = useAsyncData(
    async () => {
      if (user?.role !== 'admin') return null;
      const [overview, stats, impact] = await Promise.all([
        api.admin.overview(),
        api.admin.stats(30),
        api.analytics.impact(),
      ]);
      return { overview: overview.data, stats: stats.data, impact };
    },
    [user?.role],
  );

  const companyOverview = useAsyncData(
    async () => {
      if (user?.role !== 'company') return null;
      const [vehicles, shipments, payments, impact] = await Promise.all([
        api.vehicles.list({ limit: 50 }),
        api.shipments.list({ limit: 50 }),
        api.payments.list({ limit: 50 }),
        api.analytics.impact(),
      ]);
      return { vehicles, shipments, payments, impact };
    },
    [user?.role],
  );

  const userOverview = useAsyncData(
    async () => {
      if (!user || !['user', 'driver'].includes(user.role)) return null;
      const [shipments, payments, marketplace] = await Promise.all([
        api.shipments.list({ limit: 20 }),
        user.role === 'driver' ? Promise.resolve(null) : api.payments.list({ limit: 20 }),
        api.vehicles.marketplace({ limit: 20 }),
      ]);
      return { shipments, payments, marketplace };
    },
    [user?.role],
  );

  const content = useMemo(() => {
    if (!user) return null;

    if (user.role === 'admin' && adminOverview.data) {
      const data = adminOverview.data;
      return (
        <>
          <div className="stats-grid">
            <StatsCard label="Users" value={formatCompactNumber(data.overview.total_users)} />
            <StatsCard label="Companies" value={formatCompactNumber(data.overview.total_companies)} />
            <StatsCard label="Vehicles" value={formatCompactNumber(data.overview.total_vehicles)} />
            <StatsCard label="Shipments" value={formatCompactNumber(data.overview.total_shipments)} />
            <StatsCard label="Revenue" value={formatCurrency(data.overview.total_revenue)} tone="success" />
            <StatsCard label="Available Fleet" value={String(data.overview.available_vehicles)} tone="warning" />
          </div>
          <OverviewCharts
            shipments={data.stats.shipments_per_day}
            revenue={data.stats.revenue_per_day}
          />
          <div className="two-up">
            <Card title="Impact Snapshot">
              <ul className="metric-list">
                <li>Delivered shipments: {data.impact.deliveredShipments}</li>
                <li>CO2 saved: {data.impact.co2SavedKg} kg</li>
                <li>Fuel saved: {data.impact.fuelSavedLiters} L</li>
                <li>Distance managed: {data.impact.distanceKm} km</li>
              </ul>
            </Card>
            <Card title="Utilization">
              <p className="hero-number">{data.stats.vehicle_utilization_rate}%</p>
              <p>Fleet utilization across non-inactive assets.</p>
            </Card>
          </div>
        </>
      );
    }

    if (user.role === 'company' && companyOverview.data) {
      const data = companyOverview.data;
      return (
        <>
          <div className="stats-grid">
            <StatsCard label="Fleet Units" value={String(data.vehicles.data.length)} />
            <StatsCard label="Shipments" value={String(data.shipments.data.length)} />
            <StatsCard label="Payments" value={String(data.payments.data.length)} />
            <StatsCard label="CO2 Saved" value={`${data.impact.co2SavedKg} kg`} tone="success" />
          </div>
          <div className="two-up">
            <Card title="Fleet Availability">
              <ul className="metric-list">
                {data.vehicles.data.slice(0, 6).map((vehicle) => (
                  <li key={vehicle.id}>
                    {vehicle.plateNumber} · {vehicle.status} · {vehicle.availableCargoSpace ?? vehicle.capacity} kg
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="Shipment Pipeline">
              <ul className="metric-list">
                {data.shipments.data.slice(0, 6).map((shipment) => (
                  <li key={shipment.id}>
                    {shipment.pickupLocation} to {shipment.destination} · {shipment.status}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </>
      );
    }

    if (userOverview.data) {
      const data = userOverview.data;
      return (
        <>
          <div className="stats-grid">
            <StatsCard label="My Shipments" value={String(data.shipments.data.length)} />
            <StatsCard label="Open Marketplace Vehicles" value={String(data.marketplace.data.length)} />
            {data.payments && <StatsCard label="Payments" value={String(data.payments.data.length)} tone="success" />}
          </div>
          <div className="two-up">
            <Card title="Recent Shipments">
              <ul className="metric-list">
                {data.shipments.data.slice(0, 5).map((shipment) => (
                  <li key={shipment.id}>
                    {shipment.pickupLocation} to {shipment.destination} · {shipment.status}
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="Marketplace Capacity">
              <ul className="metric-list">
                {data.marketplace.data.slice(0, 5).map((vehicle) => (
                  <li key={vehicle.id}>
                    {vehicle.companyName ?? 'Fleet'} · {vehicle.availableCargoSpace ?? vehicle.capacity} kg · {vehicle.activeDestination ?? 'Any route'}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </>
      );
    }

    return null;
  }, [adminOverview.data, companyOverview.data, userOverview.data, user]);

  const loading = adminOverview.loading || companyOverview.loading || userOverview.loading;
  const error = adminOverview.error || companyOverview.error || userOverview.error;

  return (
    <div className="page-stack">
      {loading && <Card title="Loading workspace"><p>Syncing operational data...</p></Card>}
      {error && <p className="error-banner">{error}</p>}
      {!loading && content}
    </div>
  );
}
