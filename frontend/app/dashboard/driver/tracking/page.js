'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { DashboardCard, SectionTitle } from '@/components/dashboard/cards';
import { MapPin } from 'lucide-react';

export default function DriverTrackingPage() {
  return (
    <DashboardLayout>
      <SectionTitle title="Live Tracking" subtitle="Track your current delivery" />

      <DashboardCard className="mb-8">
        <div className="rounded-lg bg-slate-900/50 h-96 overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
            <div className="text-center">
              <MapPin size={48} className="mx-auto mb-3 text-yellow-400" />
              <p className="text-sm text-slate-400">Live map integration</p>
              <p className="text-xs text-slate-500 mt-1">Real-time GPS tracking</p>
            </div>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard title="Current Delivery">
        <div className="space-y-6">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase mb-2">Shipment Details</p>
            <div className="rounded-lg bg-slate-700/50 p-4">
              <p className="font-semibold text-white text-lg">SHP-25007</p>
              <p className="text-sm text-slate-400 mt-1">From: 123 Main St, NYC</p>
              <p className="text-sm text-slate-400">To: 456 Oak Ave, LA</p>
            </div>
          </div>

          <div className="h-px bg-slate-700" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-400">Distance Remaining</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">875 km</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Estimated Time</p>
              <p className="text-2xl font-bold text-green-400 mt-1">18 hours</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase mb-2">Route Progress</p>
            <div className="h-3 rounded-full bg-slate-700">
              <div className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500" style={{ width: '65%' }} />
            </div>
            <p className="text-xs text-slate-400 mt-2">Denver, CO - 30 mins ago</p>
          </div>
        </div>
      </DashboardCard>
    </DashboardLayout>
  );
}
