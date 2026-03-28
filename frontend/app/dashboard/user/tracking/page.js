'use client';

import { useState } from 'react';

import { DashboardLayout } from '@/components/dashboard/layout';
import { DashboardCard, SectionTitle, StatusBadge } from '@/components/dashboard/cards';
import { RouteMapCard } from '@/components/dashboard/charts';
import { statusTone, titleCaseStatus, userDemo } from '@/components/dashboard/demo-data';

export default function UserTrackingPage() {
  const [selected, setSelected] = useState(userDemo.shipments[0]);

  return (
    <DashboardLayout
      title="Shipment Tracking"
      subtitle="A customer-friendly tracking board with clearer hierarchy and cleaner route visuals."
    >
      <SectionTitle
        title="Track deliveries"
        subtitle="A polished tracking experience inspired by the reference images, but tailored to the project’s shipment workflow."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.95fr_1.25fr]">
        <DashboardCard title="My Shipments">
          <div className="space-y-3">
            {userDemo.shipments.map((shipment) => (
              <button
                key={shipment.id}
                type="button"
                onClick={() => setSelected(shipment)}
                className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${
                  selected.id === shipment.id
                    ? 'border-slate-950 bg-slate-950 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-950'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{shipment.id}</p>
                    <p className={`mt-1 text-sm ${selected.id === shipment.id ? 'text-white/65' : 'text-slate-500'}`}>
                      {shipment.pickupLocation} to {shipment.destination}
                    </p>
                  </div>
                  <StatusBadge value={titleCaseStatus(shipment.status)} tone={statusTone(shipment.status)} />
                </div>
              </button>
            ))}
          </div>
        </DashboardCard>

        <div className="space-y-6">
          <DashboardCard title="Current Delivery">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-[24px] bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Pickup</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{selected.pickupLocation}</p>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Destination</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{selected.destination}</p>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Status</p>
                <div className="mt-2">
                  <StatusBadge value={titleCaseStatus(selected.status)} tone={statusTone(selected.status)} />
                </div>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Cost</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">${selected.price}</p>
              </div>
            </div>
          </DashboardCard>

          <RouteMapCard
            title="Route Tracking"
            footer={<StatusBadge value="Live route" tone="success" />}
            stops={[
              { label: selected.pickupLocation },
              { label: 'Regional checkpoint' },
              { label: selected.destination },
            ]}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
