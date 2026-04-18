'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { DashboardCard, SectionTitle } from '@/components/dashboard/cards';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

export default function CompanyVehiclesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const vehicles = [
    { id: 'VH-001', plate: 'KN-4521', driver: 'John Doe', capacity: '5000kg', usage: '85%', status: 'In Transit', lastTrip: '2 hours ago' },
    { id: 'VH-002', plate: 'KN-4522', driver: 'Unassigned', capacity: '5000kg', usage: '0%', status: 'Available', lastTrip: '1 day ago' },
    { id: 'VH-003', plate: 'KN-4523', driver: 'Mike Johnson', capacity: '5000kg', usage: '92%', status: 'In Transit', lastTrip: 'Now' },
    { id: 'VH-004', plate: 'KN-4524', driver: 'Sarah Williams', capacity: '5000kg', usage: '45%', status: 'Available', lastTrip: '3 hours ago' },
  ];

  const filtered = vehicles.filter((v) =>
    v.plate.includes(searchTerm.toUpperCase()) ||
    v.driver.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <SectionTitle title="Vehicles" subtitle="Manage your fleet" />

      <DashboardCard className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 flex items-center gap-2 bg-slate-700/50 rounded-lg px-4 py-2">
            <Search size={18} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search vehicles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
          <Button className="flex items-center gap-2">
            <Plus size={18} />
            Add Vehicle
          </Button>
        </div>
      </DashboardCard>

      <DashboardCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700 text-left text-xs font-semibold uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Vehicle ID</th>
                <th className="px-4 py-3">Plate</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Capacity</th>
                <th className="px-4 py-3">Usage</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last Trip</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                  <td className="px-4 py-3 font-medium text-yellow-400">{row.id}</td>
                  <td className="px-4 py-3">{row.plate}</td>
                  <td className="px-4 py-3">{row.driver}</td>
                  <td className="px-4 py-3">{row.capacity}</td>
                  <td className="px-4 py-3 font-semibold text-yellow-400">{row.usage}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        row.status === 'In Transit'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{row.lastTrip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </DashboardLayout>
  );
}
