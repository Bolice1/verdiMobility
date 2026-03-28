'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { DashboardCard, SectionTitle } from '@/components/dashboard/cards';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

export default function AdminDriversPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const drivers = [
    { id: 'DRV-001', name: 'John Doe', license: 'DL-001234', company: 'FastExpress', rating: 4.8, deliveries: 156, status: 'active' },
    { id: 'DRV-002', name: 'Jane Smith', license: 'DL-005678', company: 'LogiMove', rating: 4.6, deliveries: 142, status: 'active' },
    { id: 'DRV-003', name: 'Mike Johnson', license: 'DL-009012', company: 'QuickShip', rating: 5.0, deliveries: 98, status: 'active' },
    { id: 'DRV-004', name: 'Sarah Williams', license: 'DL-003456', company: 'FastExpress', rating: 4.7, deliveries: 178, status: 'active' },
  ];

  const filtered = drivers.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.license.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <SectionTitle title="Drivers" subtitle="Manage platform drivers" />

      <DashboardCard className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 flex items-center gap-2 bg-slate-700/50 rounded-lg px-4 py-2">
            <Search size={18} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
          <Button className="flex items-center gap-2">
            <Plus size={18} />
            Add Driver
          </Button>
        </div>
      </DashboardCard>

      <DashboardCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700 text-left text-xs font-semibold uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">License</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Deliveries</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                  <td className="px-4 py-3 font-semibold">{row.name}</td>
                  <td className="px-4 py-3 text-slate-500">{row.license}</td>
                  <td className="px-4 py-3">{row.company}</td>
                  <td className="px-4 py-3 text-yellow-400 font-semibold">⭐ {row.rating}</td>
                  <td className="px-4 py-3">{row.deliveries}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full px-3 py-1 text-xs font-semibold bg-green-500/20 text-green-400">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3 text-blue-400 hover:text-blue-300 underline text-xs cursor-pointer">View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </DashboardLayout>
  );
}
