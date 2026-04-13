'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { DashboardCard, SectionTitle } from '@/components/dashboard/cards';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

export default function CompanyShipmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const shipments = [
    { id: 'SHP-25007', sender: 'Acme Corp', status: 'in_transit', cost: '$450', vehicle: 'KN-4521', date: 'Mar 28' },
    { id: 'SHP-20215', sender: 'Tech Solutions', status: 'pending', cost: '$520', vehicle: 'KN-4522', date: 'Mar 28' },
    { id: 'SHP-19600', sender: 'Global Exports', status: 'delivered', cost: '$380', vehicle: 'KN-4523', date: 'Mar 27' },
  ];

  const filtered = shipments.filter((s) =>
    s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.sender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/20 text-green-400';
      case 'in_transit':
        return 'bg-blue-500/20 text-blue-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <DashboardLayout>
      <SectionTitle title="Company Shipments" subtitle="Manage your shipments" />

      <DashboardCard className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 flex items-center gap-2 bg-slate-700/50 rounded-lg px-4 py-2">
            <Search size={18} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search shipments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>
      </DashboardCard>

      <DashboardCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700 text-left text-xs font-semibold uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Sender</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                  <td className="px-4 py-3 font-medium text-yellow-400">{row.id}</td>
                  <td className="px-4 py-3">{row.sender}</td>
                  <td className="px-4 py-3">{row.vehicle}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(row.status)}`}>
                      {row.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{row.cost}</td>
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
