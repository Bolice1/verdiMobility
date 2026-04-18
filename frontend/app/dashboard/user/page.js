'use client';

import { useEffect, useMemo, useState } from 'react';
import { CircleDollarSign, Package, Route, Timer } from 'lucide-react';

import { DashboardLayout } from '@/components/dashboard/layout';
import { DashboardCard, MetricCard, SectionTitle, StatusBadge } from '@/components/dashboard/cards';
import { BarChart, ProgressChart, RouteMapCard } from '@/components/dashboard/charts';
import { formatCurrency, statusTone, titleCaseStatus, userDemo } from '@/components/dashboard/demo-data';
import { api } from '@/services/api';

function mapShipments(items) {
  return (items?.length ? items : userDemo.shipments).map((item) => ({
    ...item,
    progress:
      item.status === 'delivered'
        ? 100
        : item.status === 'in_transit'
          ? 68
          : item.status === 'matched'
            ? 38
            : 12,
  }));
}

export default function UserDashboard() {
  const [shipments, setShipments] = useState(() => mapShipments(userDemo.shipments));

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const response = await api.get('/shipments?limit=8&offset=0');
        if (active) {
          setShipments(mapShipments(response.data?.data));
        }
      } catch {
        if (active) {
          setShipments(mapShipments(userDemo.shipments));
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const summary = useMemo(() => {
    const totalSpent = shipments.reduce((sum, item) => sum + Number(item.price || 0), 0);
    return {
      totalShipments: shipments.length,
      activeShipments: shipments.filter((item) => item.status !== 'delivered' && item.status !== 'cancelled').length,
      totalSpent,
      avgCycle: '2.3 days',
    };
  }, [shipments]);

  const activityChart = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [2, 4, 3, 5, 4, 6, 3],
  };

  return (
    <DashboardLayout
      title="Customer Shipment Dashboard"
      subtitle="Track current deliveries, delivery performance, and your shipment history in one place."
    >
      <SectionTitle
        title="My logistics activity"
        subtitle="This dashboard reflects the actual user role in the backend: create shipments, monitor your deliveries, and rate completed driver work."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <MetricCard label="Total Shipments" value={summary.totalShipments} trend={{ increase: true, percent: '8.0%' }} icon={Package} emphasis="dark" />
        <MetricCard label="Active Deliveries" value={summary.activeShipments} trend={{ increase: true, percent: '1 new' }} icon={Route} />
        <MetricCard label="Total Spent" value={formatCurrency(summary.totalSpent)} trend={{ increase: false, percent: '2.4%' }} icon={CircleDollarSign} />
        <MetricCard label="Average Cycle Time" value={summary.avgCycle} trend={{ increase: true, percent: '0.4 day faster' }} icon={Timer} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_1fr]">
        <DashboardCard title="Current Shipments">
          <div className="space-y-4">
            {shipments.map((shipment) => (
              <div key={shipment.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{shipment.id}</p>
                    <p className="mt-1 text-sm text-slate-500">{shipment.pickupLocation} to {shipment.destination}</p>
                  </div>
                  <StatusBadge value={titleCaseStatus(shipment.status)} tone={statusTone(shipment.status)} />
                </div>
                <div className="mt-4 h-2 rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-gradient-to-r from-slate-950 to-green-500" style={{ width: `${shipment.progress}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{shipment.progress}% complete</span>
                  <span>{formatCurrency(shipment.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <div className="grid gap-6">
          <DashboardCard title="Delivery Completion">
            <ProgressChart percentage={91} label="Orders delivered without issue" />
          </DashboardCard>
          <RouteMapCard
            title="Tracking Delivery"
            footer={<StatusBadge value="Client view" tone="info" />}
            stops={[
              { label: 'Pickup booked' },
              { label: 'Vehicle assigned' },
              { label: 'Final delivery' },
            ]}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_1fr]">
        <DashboardCard title="Weekly Activity">
          <BarChart data={activityChart} />
        </DashboardCard>
        <DashboardCard title="Service Snapshot">
          <div className="space-y-4">
            <div className="rounded-[24px] bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Preferred route</p>
              <p className="mt-2 text-lg font-semibold text-slate-950">Cairo to Port Said</p>
              <p className="mt-1 text-sm text-slate-500">Most repeated corridor this month</p>
            </div>
            <div className="rounded-[24px] bg-slate-950 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">Next improvement</p>
              <p className="mt-2 text-lg font-semibold">Payment history is the next backend-backed panel to add for users.</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
}
