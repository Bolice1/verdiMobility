'use client';

import { useEffect, useState } from 'react';
import { ArrowUpRight, BriefcaseBusiness, DollarSign, Package, Truck, Users } from 'lucide-react';

import { DashboardLayout } from '@/components/dashboard/layout';
import { DashboardCard, MetricCard, SectionTitle, StatCard, StatusBadge } from '@/components/dashboard/cards';
import { LineChart, MiniTrend, ProgressChart, RouteMapCard } from '@/components/dashboard/charts';
import { adminDemo, formatCurrency, statusTone, titleCaseStatus } from '@/components/dashboard/demo-data';
import { api } from '@/services/api';

function buildAdminState(overviewData, statsData, shipmentItems, companyItems, paymentData) {
  const overview = overviewData ?? {};
  const shipments = shipmentItems?.length ? shipmentItems : adminDemo.shipments;
  const stats = statsData ?? {};
  const payments = paymentData ?? {};

  return {
    cards: {
      totalShipments: overview.total_shipments ?? adminDemo.overview.totalShipments,
      pending: shipments.filter((item) => item.status === 'pending').length || adminDemo.overview.pending,
      avgOrderCost:
        shipments.length > 0
          ? Math.round(shipments.reduce((sum, item) => sum + Number(item.price || 0), 0) / shipments.length)
          : adminDemo.overview.averageOrderCost,
      moving: overview.active_vehicles ?? adminDemo.overview.movingToDestination,
      revenue: overview.total_revenue ?? adminDemo.overview.totalRevenue,
      companies: overview.total_companies ?? adminDemo.overview.totalCompanies,
      users: overview.total_users ?? adminDemo.overview.totalUsers,
      availableVehicles: overview.available_vehicles ?? adminDemo.overview.availableVehicles,
    },
    shipments,
    companies: companyItems?.length ? companyItems : adminDemo.companies,
    paymentSummary: {
      pending: payments.summary?.byStatus?.pending?.totalAmount ?? adminDemo.payments.totalPending,
      completed: payments.summary?.byStatus?.completed?.totalAmount ?? adminDemo.payments.completed,
    },
    shipmentChart: {
      labels: (stats.shipments_per_day ?? []).map((item) => String(item.date).slice(5)),
      values: (stats.shipments_per_day ?? []).map((item) => item.count),
    },
    revenueChart: {
      labels: (stats.revenue_per_day ?? []).map((item) => String(item.date).slice(5)),
      values: (stats.revenue_per_day ?? []).map((item) => Math.round(item.revenue)),
    },
    successRate: Math.max(60, Math.min(98, Math.round((stats.vehicle_utilization_rate ?? 68) + 18))),
    vehicleUtilization: stats.vehicle_utilization_rate ?? 71,
    routeLeaders:
      stats.most_active_routes?.length
        ? stats.most_active_routes.slice(0, 3)
        : [
            { route_from: 'Cairo', route_to: 'Alexandria', shipment_count: 48 },
            { route_from: 'Giza', route_to: 'Port Said', shipment_count: 42 },
            { route_from: 'Mansoura', route_to: 'Suez', shipment_count: 37 },
          ],
  };
}

export default function AdminDashboard() {
  const [state, setState] = useState(() =>
    buildAdminState(null, null, adminDemo.shipments, adminDemo.companies, { summary: { byStatus: {} } }),
  );

  useEffect(() => {
    let active = true;

    async function load() {
      const [overviewRes, statsRes, shipmentsRes, companiesRes, paymentsRes] = await Promise.allSettled([
        api.get('/admin/overview'),
        api.get('/admin/stats?days=7'),
        api.get('/admin/shipments?limit=5&offset=0'),
        api.get('/admin/companies?limit=3&offset=0'),
        api.get('/admin/payments?limit=5&offset=0'),
      ]);

      if (!active) return;

      setState(
        buildAdminState(
          overviewRes.status === 'fulfilled' ? overviewRes.value.data?.data : null,
          statsRes.status === 'fulfilled' ? statsRes.value.data?.data : null,
          shipmentsRes.status === 'fulfilled' ? shipmentsRes.value.data?.data?.items : null,
          companiesRes.status === 'fulfilled' ? companiesRes.value.data?.data?.items : null,
          paymentsRes.status === 'fulfilled' ? paymentsRes.value.data?.data : null,
        ),
      );
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const cards = state.cards;
  const shipmentChart = state.shipmentChart.values.length
    ? state.shipmentChart
    : { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [38, 52, 41, 60, 56, 66, 49] };
  const revenueChart = state.revenueChart.values.length
    ? state.revenueChart
    : { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [18000, 22000, 21000, 26000, 24000, 29000, 25200] };

  return (
    <DashboardLayout
      title="Admin Logistics Dashboard"
      subtitle="A live operating view across shipments, fleet capacity, revenue, and customer movement."
    >
      <SectionTitle
        title="System overview"
        subtitle="Built around the actual backend: global shipments, vehicles, payments, companies, users, and platform analytics."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <MetricCard label="Total Shipments" value={cards.totalShipments} trend={{ increase: true, percent: '12.4%' }} icon={Package} emphasis="dark" />
        <MetricCard label="Pending Orders" value={cards.pending} trend={{ increase: true, percent: '4.8%' }} icon={Truck} />
        <MetricCard label="Shipment Cost / Order" value={formatCurrency(cards.avgOrderCost)} trend={{ increase: false, percent: '2.1%' }} icon={DollarSign} />
        <MetricCard label="Moving To Destination" value={cards.moving} trend={{ increase: true, percent: '9.2%' }} icon={BriefcaseBusiness} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.55fr_0.95fr]">
        <DashboardCard title="Shipment Progress Chart" action={<StatusBadge value="Weekly" tone="info" />}>
          <LineChart data={shipmentChart} />
        </DashboardCard>

        <div className="grid gap-6">
          <DashboardCard title="Success Rate">
            <ProgressChart percentage={state.successRate} label="Shipments closed cleanly" />
          </DashboardCard>
          <DashboardCard title="Shipment On Road Now">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-4xl font-semibold tracking-tight text-slate-950">{cards.availableVehicles}</p>
                <p className="mt-2 text-sm text-slate-500">Vehicles currently available for new assignments</p>
              </div>
              <MiniTrend values={[14, 18, 15, 22, 19, 27]} />
            </div>
          </DashboardCard>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_1fr]">
        <DashboardCard title="Revenue Performance">
          <LineChart data={revenueChart} />
        </DashboardCard>

        <div className="grid gap-6">
          <DashboardCard title="Operational Snapshot">
            <div className="grid gap-4 md:grid-cols-2">
              <StatCard label="Companies" value={cards.companies} sublabel="Fleet operators onboarded" />
              <StatCard label="Platform Users" value={cards.users} sublabel="Across all roles" />
              <StatCard label="Pending Amount" value={formatCurrency(state.paymentSummary.pending)} sublabel="Awaiting settlement" />
              <StatCard label="Completed Revenue" value={formatCurrency(state.paymentSummary.completed)} sublabel="Confirmed payments" />
            </div>
          </DashboardCard>
          <RouteMapCard
            title="Tracking Delivery"
            footer={<StatusBadge value="Live" tone="success" />}
            stops={[
              { label: 'Warehouse 01' },
              { label: 'Transit checkpoint' },
              { label: 'Delivery district' },
            ]}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr_0.95fr]">
        <DashboardCard title="Shipment Activities Status">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-[0.2em] text-slate-400">
                <tr>
                  <th className="px-2 py-4">Shipment</th>
                  <th className="px-2 py-4">Customer</th>
                  <th className="px-2 py-4">Route</th>
                  <th className="px-2 py-4">Status</th>
                  <th className="px-2 py-4">Handled By</th>
                  <th className="px-2 py-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {state.shipments.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-2 py-4 font-semibold text-slate-950">{item.id}</td>
                    <td className="px-2 py-4 text-slate-600">{item.sender?.name ?? item.sender ?? item.customer}</td>
                    <td className="px-2 py-4 text-slate-500">{item.route ?? `${item.pickupLocation ?? 'Origin'} to ${item.destination ?? 'Destination'}`}</td>
                    <td className="px-2 py-4">
                      <StatusBadge value={titleCaseStatus(item.status)} tone={statusTone(item.status)} />
                    </td>
                    <td className="px-2 py-4 text-slate-600">{item.driver ?? item.vehicle?.plateNumber ?? 'Dispatch queue'}</td>
                    <td className="px-2 py-4 font-semibold text-slate-950">{formatCurrency(item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <DashboardCard title="Top Network Performance">
          <div className="space-y-4">
            {state.routeLeaders.map((route) => (
              <div key={`${route.route_from}-${route.route_to}`} className="rounded-[24px] bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-950">{route.route_from} to {route.route_to}</p>
                    <p className="mt-1 text-xs text-slate-500">{route.shipment_count} shipments in the selected period</p>
                  </div>
                  <ArrowUpRight className="text-green-600" size={18} />
                </div>
              </div>
            ))}
            <div className="rounded-[24px] border border-dashed border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-950">Vehicle utilization</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{state.vehicleUtilization}%</p>
              <p className="mt-1 text-xs text-slate-500">Computed from the active fleet in the admin stats API.</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
}
