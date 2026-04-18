'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { DashboardCard, SectionTitle } from '@/components/dashboard/cards';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

export default function AdminCompaniesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const companies = [
    { id: 'CMP-001', name: 'FastExpress', email: 'info@fastexpress.com', vehicles: 24, status: 'active', joined: 'Jan 2023' },
    { id: 'CMP-002', name: 'LogiMove', email: 'contact@logimove.com', vehicles: 18, status: 'active', joined: 'Feb 2023' },
    { id: 'CMP-003', name: 'QuickShip', email: 'support@quickship.com', vehicles: 12, status: 'active', joined: 'Mar 2023' },
    { id: 'CMP-004', name: 'ExpressHub', email: 'hello@expresshub.com', vehicles: 30, status: 'active', joined: 'Apr 2023' },
  ];

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <SectionTitle title="Companies" subtitle="Manage logistics companies" />

      <DashboardCard className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 flex items-center gap-2 bg-slate-700/50 rounded-lg px-4 py-2">
            <Search size={18} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
          <Button className="flex items-center gap-2">
            <Plus size={18} />
            Add Company
          </Button>
        </div>
      </DashboardCard>

      <DashboardCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700 text-left text-xs font-semibold uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Vehicles</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                  <td className="px-4 py-3 font-semibold text-yellow-400">{row.name}</td>
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3">{row.vehicles}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full px-3 py-1 text-xs font-semibold bg-green-500/20 text-green-400">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{row.joined}</td>
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
