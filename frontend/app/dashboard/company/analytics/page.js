'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { DashboardCard, SectionTitle, StatCard } from '@/components/dashboard/cards';
import { LineChart, BarChart } from '@/components/dashboard/charts';

export default function CompanyAnalyticsPage() {
  return (
    <DashboardLayout>
      <SectionTitle title="Analytics" subtitle="Your company performance metrics" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Revenue" value="$125K" sublabel="This month" />
        <StatCard label="Shipmentshed" value="1,245" sublabel="This month" />
        <StatCard label="Avg Rating" value="4.7/5" sublabel="From customers" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        <DashboardCard title="Revenue This Month">
          <LineChart
            data={{
              values: [12000, 14000, 13000, 15500, 14000, 16000, 15500],
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            }}
          />
        </DashboardCard>

        <DashboardCard title="Shipments by Status">
          <BarChart
            data={{
              values: [320, 85, 45, 12],
              labels: ['Delivered', 'In Transit', 'Pending', 'Cancelled'],
            }}
          />
        </DashboardCard>
      </div>

      <DashboardCard title="Performance Summary">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'On-time Delivery', value: '94%', color: 'text-green-400' },
            { label: 'Customer Rating', value: '4.7/5', color: 'text-yellow-400' },
            { label: 'Successful Rate', value: '98.5%', color: 'text-blue-400' },
            { label: 'Avg Delivery Time', value: '2.3h', color: 'text-purple-400' },
          ].map((metric) => (
            <div key={metric.label} className="rounded-lg bg-slate-700/50 p-4 text-center">
              <p className="text-xs text-slate-400">{metric.label}</p>
              <p className={`text-2xl font-bold mt-2 ${metric.color}`}>{metric.value}</p>
            </div>
          ))}
        </div>
      </DashboardCard>
    </DashboardLayout>
  );
}
