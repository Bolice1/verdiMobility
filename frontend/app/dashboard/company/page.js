'use client';

import { useEffect, useState } from 'react';
import { Boxes, Route, Truck, Users } from 'lucide-react';

import { DashboardLayout } from '@/components/dashboard/layout';
import { DashboardCard, MetricCard, SectionTitle, StatCard, StatusBadge } from '@/components/dashboard/cards';
import { BarChart, ProgressChart, RouteMapCard } from '@/components/dashboard/charts';
import { companyDemo, formatCurrency, statusTone, titleCaseStatus } from '@/components/dashboard/demo-data';
import { api } from '@/services/api';

function buildCompanyState(shipments, vehicles, impact) {
  const shipmentItems = shipments?.length ? shipments : companyDemo.shipments;
  const vehicleItems = vehicles?.length ? vehicles : companyDemo.vehicles;

  return {
    shipmentItems,
    vehicleItems,
    metrics: {
      activeVehicles: vehicleItems.filter((item) => item.status === 'busy' || item.status === 'available').length,
      deliveriesInMotion: shipmentItems.filter((item) => item.status === 'in_transit' || item.status === 'matched').length,
      monthlyRevenue: shipmentItems.reduce((sum, item) => sum + Number(item.price || 0), 0),
      avgCapacity:
        vehicleItems.length > 0
          ? Math.round(vehicleItems.reduce((sum, item) => sum + Number(item.usage || 0), 0) / vehicleItems.length)
          : 78,
      co2Saved: impact?.co2SavedKg ?? 12450,
    },
  };
}

export default function CompanyDashboard() {
  const [state, setState] = useState(() => buildCompanyState(companyDemo.shipments, companyDemo.vehicles, null));

  useEffect(() => {
    let active = true;

    async function load() {
      const [shipmentsRes, vehiclesRes, impactRes] = await Promise.allSettled([
        api.get('/shipments?limit=8&offset=0'),
        api.get('/vehicles?limit=8&offset=0'),
        api.get('/analytics/impact'),
      ]);

      if (!active) return;

      setState(
        buildCompanyState(
          shipmentsRes.status === 'fulfilled' ? shipmentsRes.value.data?.data : null,
          vehiclesRes.status === 'fulfilled' ? vehiclesRes.value.data?.data : null,
          impactRes.status === 'fulfilled' ? impactRes.value.data : null,
        ),
      );
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const utilizationChart = {
    labels: ['W1', 'W2', 'W3', 'W4'],
    values: [
      state.vehicleItems.filter((item) => item.status === 'busy').length * 8 + 24,
      56,
      49,
      62,
    ],
  };

  return (
    <DashboardLayout
      title="Company Dispatch Dashboard"
      subtitle="Monitor fleet readiness, route load, and live customer shipments from one control surface."
    >
      <SectionTitle
        title="Fleet operations"
        subtitle="This workspace matches the real company role in the backend: scoped shipments, vehicles, matching, and impact reporting."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <MetricCard label="Active Vehicles" value={state.metrics.activeVehicles} trend={{ increase: true, percent: '6.2%' }} icon={Truck} emphasis="dark" />
        <MetricCard label="Deliveries In Motion" value={state.metrics.deliveriesInMotion} trend={{ increase: true, percent: '4.1%' }} icon={Route} />
        <MetricCard label="Shipment Revenue" value={formatCurrency(state.metrics.monthlyRevenue)} trend={{ increase: true, percent: '11.8%' }} icon={Boxes} />
        <MetricCard label="Driver Coverage" value={`${companyDemo.drivers.length}`} trend={{ increase: true, percent: '3.0%' }} icon={Users} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
        <DashboardCard title="Fleet Capacity Outlook">
          <BarChart data={utilizationChart} />
        </DashboardCard>
        <div className="grid gap-6">
          <DashboardCard title="Average Capacity Usage">
            <ProgressChart percentage={state.metrics.avgCapacity} label="Fleet loading efficiency" />
          </DashboardCard>
          <DashboardCard title="Sustainability Signal">
            <div className="space-y-4">
              <StatCard label="CO2 Saved" value={`${state.metrics.co2Saved.toLocaleString()} kg`} sublabel="Visible through the current impact API" />
              <StatCard label="Driver Ratings" value="4.8 / 5" sublabel="Based on completed deliveries" />
            </div>
          </DashboardCard>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_1fr]">
        <DashboardCard title="Shipment Queue">
          <div className="space-y-3">
            {state.shipmentItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4">
                <div>
                  <p className="font-semibold text-slate-950">{item.id}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.customer ?? item.destination} {item.pickupLocation ? `from ${item.pickupLocation}` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <StatusBadge value={titleCaseStatus(item.status)} tone={statusTone(item.status)} />
                  <p className="mt-2 text-sm font-semibold text-slate-950">{item.vehicle ?? 'Assignment pending'}</p>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
        <RouteMapCard
          title="Dispatch Visibility"
          footer={<StatusBadge value="Company" tone="info" />}
          stops={[
            { label: 'Origin warehouse' },
            { label: 'Regional checkpoint' },
            { label: 'Customer delivery' },
          ]}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
        <DashboardCard title="Fleet Readiness Board">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-2 py-4">Plate</th>
                  <th className="px-2 py-4">Route</th>
                  <th className="px-2 py-4">Capacity</th>
                  <th className="px-2 py-4">Usage</th>
                  <th className="px-2 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {state.vehicleItems.map((item) => (
                  <tr key={item.plateNumber} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-2 py-4 font-semibold text-slate-950">{item.plateNumber}</td>
                    <td className="px-2 py-4 text-slate-500">{item.route ?? 'Awaiting assignment'}</td>
                    <td className="px-2 py-4 text-slate-600">{Number(item.capacity).toLocaleString()} kg</td>
                    <td className="px-2 py-4 text-slate-950">{item.usage ?? 0}%</td>
                    <td className="px-2 py-4">
                      <StatusBadge value={titleCaseStatus(item.status)} tone={statusTone(item.status)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <DashboardCard title="Driver Leaderboard">
          <div className="space-y-4">
            {companyDemo.drivers.map((driver) => (
              <div key={driver.name} className="rounded-[24px] bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-950">{driver.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{driver.vehicle}</p>
                  </div>
                  <StatusBadge value={`${driver.rating} rating`} tone="success" />
                </div>
                <p className="mt-3 text-xs text-slate-500">{driver.jobs} route assignments this cycle</p>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
}
