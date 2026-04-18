'use client';

import { useEffect, useState } from 'react';

import { DashboardLayout } from '@/components/dashboard/layout';
import { DashboardCard, SectionTitle, StatCard, StatusBadge } from '@/components/dashboard/cards';
import { BarChart, LineChart } from '@/components/dashboard/charts';
import { adminDemo, formatCurrency } from '@/components/dashboard/demo-data';
import { api } from '@/services/api';

function buildAnalyticsState(stats, impact) {
  return {
    stats: stats ?? {
      shipments_per_day: [
        { date: '2026-03-22', count: 120 },
        { date: '2026-03-23', count: 145 },
        { date: '2026-03-24', count: 136 },
        { date: '2026-03-25', count: 160 },
        { date: '2026-03-26', count: 154 },
        { date: '2026-03-27', count: 176 },
        { date: '2026-03-28', count: 168 },
      ],
      revenue_per_day: [
        { date: '2026-03-22', revenue: 45000 },
        { date: '2026-03-23', revenue: 52000 },
        { date: '2026-03-24', revenue: 48000 },
        { date: '2026-03-25', revenue: 61000 },
        { date: '2026-03-26', revenue: 55000 },
        { date: '2026-03-27', revenue: 63000 },
        { date: '2026-03-28', revenue: 58000 },
      ],
      most_active_routes: [
        { route_from: 'Cairo', route_to: 'Alexandria', shipment_count: 41 },
        { route_from: 'Giza', route_to: 'Port Said', shipment_count: 34 },
        { route_from: 'Minya', route_to: 'Suez', shipment_count: 27 },
      ],
      vehicle_utilization_rate: 71,
    },
    impact: impact ?? {
      co2SavedKg: 12450,
      fuelSavedLiters: 3250,
      deliveredShipments: adminDemo.overview.totalShipments,
      totalShipments: adminDemo.overview.totalShipments,
      distanceKm: 82400,
    },
  };
}

export default function AdminAnalyticsDashboard() {
  const [state, setState] = useState(() => buildAnalyticsState(null, null));

  useEffect(() => {
    let active = true;

    async function load() {
      const [statsRes, impactRes] = await Promise.allSettled([
        api.get('/admin/stats?days=30'),
        api.get('/analytics/impact'),
      ]);

      if (!active) return;

      setState(
        buildAnalyticsState(
          statsRes.status === 'fulfilled' ? statsRes.value.data?.data : null,
          impactRes.status === 'fulfilled' ? impactRes.value.data : null,
        ),
      );
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const shipmentVolume = {
    labels: state.stats.shipments_per_day.map((item) => String(item.date).slice(5)),
    values: state.stats.shipments_per_day.map((item) => item.count),
  };
  const revenueTrend = {
    labels: state.stats.revenue_per_day.map((item) => String(item.date).slice(5)),
    values: state.stats.revenue_per_day.map((item) => Math.round(item.revenue)),
  };

  return (
    <DashboardLayout
      title="Admin Analytics Dashboard"
      subtitle="Trend monitoring for revenue, routes, sustainability, and fleet utilization."
    >
      <SectionTitle
        title="Analytics and impact"
        subtitle="This page turns the existing admin stats and impact endpoints into a polished analytics dashboard similar to your references."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <StatCard label="CO2 Saved" value={`${state.impact.co2SavedKg.toLocaleString()} kg`} sublabel="Environmental impact" />
        <StatCard label="Fuel Saved" value={`${state.impact.fuelSavedLiters.toLocaleString()} L`} sublabel="Operational efficiency" />
        <StatCard label="Distance Covered" value={`${state.impact.distanceKm.toLocaleString()} km`} sublabel="Across tracked shipments" />
        <StatCard label="Utilization Rate" value={`${state.stats.vehicle_utilization_rate}%`} sublabel="Active fleet usage" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <DashboardCard title="Revenue Trend">
          <LineChart data={revenueTrend} />
        </DashboardCard>
        <DashboardCard title="Shipment Volume">
          <BarChart data={shipmentVolume} />
        </DashboardCard>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.25fr_1fr]">
        <DashboardCard title="Most Active Routes">
          <div className="space-y-4">
            {state.stats.most_active_routes.map((route) => (
              <div key={`${route.route_from}-${route.route_to}`} className="rounded-[24px] bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-950">{route.route_from} to {route.route_to}</p>
                    <p className="mt-1 text-xs text-slate-500">{route.shipment_count} shipments in the current window</p>
                  </div>
                  <StatusBadge value="High demand" tone="success" />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Executive Readout">
          <div className="space-y-4">
            <div className="rounded-[24px] bg-slate-950 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">Monthly revenue view</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{formatCurrency(revenueTrend.values.reduce((sum, item) => sum + item, 0))}</p>
              <p className="mt-2 text-sm text-white/65">Rolled up from the admin revenue time series.</p>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-950">Delivered shipments</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{state.impact.deliveredShipments}</p>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-950">Tracked shipments</p>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{state.impact.totalShipments}</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
}
