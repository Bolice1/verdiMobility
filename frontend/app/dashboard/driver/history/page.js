'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { DashboardCard, SectionTitle } from '@/components/dashboard/cards';
import { Calendar } from 'lucide-react';
import { useState } from 'react';

export default function DriverHistoryPage() {
  const [filterMonth, setFilterMonth] = useState('2026-03');

  const deliveries = [
    { id: 'SHP-25001', route: 'NYC → Boston', status: 'Delivered', earnings: '$65', date: '2026-03-28' },
    { id: 'SHP-24999', route: 'Boston → Philly', status: 'Delivered', earnings: '$75', date: '2026-03-28' },
    { id: 'SHP-24997', route: 'Philly → DC', status: 'Delivered', earnings: '$85', date: '2026-03-28' },
    { id: 'SHP-24995', route: 'DC → Richmond', status: 'Delivered', earnings: '$55', date: '2026-03-27' },
    { id: 'SHP-24993', route: 'Richmond → Charlotte', status: 'Delivered', earnings: '$95', date: '2026-03-27' },
    { id: 'SHP-24991', route: 'Charlotte → Atlanta', status: 'Delivered', earnings: '$110', date: '2026-03-27' },
  ];

  return (
    <DashboardLayout>
      <SectionTitle title="Delivery History" subtitle="Your past deliveries and earnings" />

      <DashboardCard className="mb-8">
        <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg px-4 py-2 w-fit">
          <Calendar size={18} className="text-slate-500" />
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="bg-transparent text-white focus:outline-none"
          />
        </div>
      </DashboardCard>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard>
          <div>
            <p className="text-xs text-slate-400">Deliveries This Month</p>
            <p className="text-3xl font-bold text-yellow-400 mt-2">156</p>
            <p className="text-xs text-slate-500 mt-1">In {filterMonth}</p>
          </div>
        </DashboardCard>
        <DashboardCard>
          <div>
            <p className="text-xs text-slate-400">Total Earnings</p>
            <p className="text-3xl font-bold text-green-400 mt-2">$4,250</p>
            <p className="text-xs text-slate-500 mt-1">In {filterMonth}</p>
          </div>
        </DashboardCard>
        <DashboardCard>
          <div>
            <p className="text-xs text-slate-400">Avg per Delivery</p>
            <p className="text-3xl font-bold text-blue-400 mt-2">$27.24</p>
            <p className="text-xs text-slate-500 mt-1">This month</p>
          </div>
        </DashboardCard>
      </div>

      {/* History Table */}
      <DashboardCard title="Delivery Records">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700 text-left text-xs font-semibold uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Shipment ID</th>
                <th className="px-4 py-3">Route</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Earnings</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {deliveries.map((row) => (
                <tr key={row.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                  <td className="px-4 py-3 font-medium text-yellow-400">{row.id}</td>
                  <td className="px-4 py-3">{row.route}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full px-3 py-1 text-xs font-semibold bg-green-500/20 text-green-400">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-green-400">{row.earnings}</td>
                  <td className="px-4 py-3 text-slate-500">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </DashboardLayout>
  );
}
