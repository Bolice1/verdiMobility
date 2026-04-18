'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { DashboardCard, SectionTitle } from '@/components/dashboard/cards';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

export default function UserOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const orders = [
    { id: 'ORD-001', shipments: 2, totalCost: '$850', status: 'active', date: 'Mar 28' },
    { id: 'ORD-002', shipments: 1, totalCost: '$380', status: 'completed', date: 'Mar 27' },
    { id: 'ORD-003', shipments: 3, totalCost: '$1,200', status: 'completed', date: 'Mar 26' },
    { id: 'ORD-004', shipments: 1, totalCost: '$450', status: 'active', date: 'Mar 25' },
  ];

  const filtered = orders.filter((o) => o.id.includes(searchTerm.toUpperCase()));

  return (
    <DashboardLayout>
      <SectionTitle title="Orders" subtitle="Manage your shipping orders" />

      <DashboardCard className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 flex items-center gap-2 bg-slate-700/50 rounded-lg px-4 py-2">
            <Search size={18} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
          <Button className="flex items-center gap-2">
            <Plus size={18} />
            New Order
          </Button>
        </div>
      </DashboardCard>

      <DashboardCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700 text-left text-xs font-semibold uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Shipments</th>
                <th className="px-4 py-3">Total Cost</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                  <td className="px-4 py-3 font-medium text-yellow-400">{row.id}</td>
                  <td className="px-4 py-3">{row.shipments}</td>
                  <td className="px-4 py-3 font-semibold text-green-400">{row.totalCost}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        row.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}
                    >
                      {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{row.date}</td>
                  <td className="px-4 py-3">
                    <button className="text-blue-400 hover:text-blue-300 underline text-xs">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </DashboardLayout>
  );
}
