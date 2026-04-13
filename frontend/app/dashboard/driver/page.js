'use client';

import { useEffect, useState } from 'react';
import { Clock3, ShieldCheck, Star, Truck } from 'lucide-react';

import { DashboardLayout } from '@/components/dashboard/layout';
import { DashboardCard, MetricCard, SectionTitle, StatusBadge } from '@/components/dashboard/cards';
import { LineChart, ProgressChart, RouteMapCard } from '@/components/dashboard/charts';
import { driverDemo, statusTone, titleCaseStatus } from '@/components/dashboard/demo-data';
import { api } from '@/services/api';

function buildDriverState(shipments, vehicles) {
  const jobs = shipments?.length
    ? shipments.map((item, index) => ({
        id: item.id,
        route: item.route ?? `${item.pickupLocation ?? 'Hub'} to ${item.destination ?? 'Destination'}`,
        status: item.status,
        progress:
          item.progress ??
          (item.status === 'delivered' ? 100 : item.status === 'in_transit' ? 67 : 32),
        eta: item.status === 'delivered' ? 'Completed' : index === 0 ? '03:35 AM' : '05:10 PM',
        customer: item.customer ?? item.senderId ?? 'Assigned customer',
      }))
    : driverDemo.jobs;

  const vehicle = vehicles?.[0] ?? { plateNumber: 'VD-2105', status: 'busy', capacity: 8000 };

  return { jobs, vehicle };
}

export default function DriverDashboard() {
  const [state, setState] = useState(() =>
    buildDriverState(driverDemo.jobs, [{ plateNumber: 'VD-2105', status: 'busy', capacity: 8000 }]),
  );

  useEffect(() => {
    let active = true;

    async function load() {
      const [shipmentsRes, vehiclesRes] = await Promise.allSettled([
        api.get('/shipments?limit=6&offset=0'),
        api.get('/vehicles?limit=2&offset=0'),
      ]);

      if (!active) return;

      setState(
        buildDriverState(
          shipmentsRes.status === 'fulfilled' ? shipmentsRes.value.data?.data : null,
          vehiclesRes.status === 'fulfilled' ? vehiclesRes.value.data?.data : null,
        ),
      );
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const activeJobs = state.jobs.filter((job) => job.status !== 'delivered');
  const earningsChart = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [60, 82, 76, 110, 92, 118, 104],
  };

  return (
    <DashboardLayout
      title="Driver Delivery Dashboard"
      subtitle="A focused board for assigned jobs, current progress, and delivery performance."
    >
      <SectionTitle
        title="Driver workspace"
        subtitle="Aligned with the current backend role scope: your visible shipments, assigned vehicle, and active delivery progress."
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
        <MetricCard label="Active Jobs" value={activeJobs.length} trend={{ increase: true, percent: '2 new' }} icon={Truck} emphasis="dark" />
        <MetricCard label="On-Time Window" value="98%" trend={{ increase: true, percent: '1.4%' }} icon={Clock3} />
        <MetricCard label="Vehicle Status" value={titleCaseStatus(state.vehicle.status)} trend={{ increase: true, percent: 'Ready' }} icon={ShieldCheck} />
        <MetricCard label="Customer Rating" value="4.8 / 5" trend={{ increase: true, percent: '0.2' }} icon={Star} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_1fr]">
        <DashboardCard title="Assigned Deliveries">
          <div className="space-y-4">
            {state.jobs.map((job) => (
              <div key={job.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-950">{job.id}</p>
                    <p className="mt-1 text-sm text-slate-500">{job.route}</p>
                  </div>
                  <StatusBadge value={titleCaseStatus(job.status)} tone={statusTone(job.status)} />
                </div>
                <div className="mt-4 h-2 rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-gradient-to-r from-slate-950 to-green-500" style={{ width: `${job.progress}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{job.progress}% complete</span>
                  <span>ETA {job.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <div className="grid gap-6">
          <DashboardCard title="Route Completion">
            <ProgressChart percentage={86} label="Current route progress" />
          </DashboardCard>
          <RouteMapCard
            title="Live Delivery Trail"
            footer={<StatusBadge value="In transit" tone="dark" />}
            stops={[
              { label: 'Pickup complete' },
              { label: 'Regional road' },
              { label: 'Final destination' },
            ]}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_1fr]">
        <DashboardCard title="Weekly Driver Earnings">
          <LineChart data={earningsChart} />
        </DashboardCard>
        <DashboardCard title="Vehicle Assignment">
          <div className="space-y-4">
            <div className="rounded-[24px] bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Assigned Vehicle</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{state.vehicle.plateNumber}</p>
              <p className="mt-2 text-sm text-slate-500">{Number(state.vehicle.capacity).toLocaleString()} kg capacity</p>
            </div>
            <div className="rounded-[24px] bg-slate-950 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">Daily focus</p>
              <p className="mt-2 text-lg font-semibold">Keep status updates accurate as jobs move from matched to in transit and delivered.</p>
            </div>
          </div>
        </DashboardCard>
      </div>
    </DashboardLayout>
  );
}
