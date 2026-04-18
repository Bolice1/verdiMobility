'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { DashboardCard, SectionTitle } from '@/components/dashboard/cards';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    { id: 'USR-001', name: 'Alice Johnson', email: 'alice@example.com', role: 'user', shipments: 24, joined: 'Jan 2023', status: 'active' },
    { id: 'USR-002', name: 'Bob Smith', email: 'bob@example.com', role: 'company', shipments: 125, joined: 'Feb 2023', status: 'active' },
    { id: 'USR-003', name: 'Carol White', email: 'carol@example.com', role: 'user', shipments: 45, joined: 'Mar 2023', status: 'active' },
    { id: 'USR-004', name: 'David Brown', email: 'david@example.com', role: 'driver', shipments: 156, joined: 'Apr 2023', status: 'active' },
  ];

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400';
      case 'company':
        return 'bg-purple-500/20 text-purple-400';
      case 'driver':
        return 'bg-blue-500/20 text-blue-400';
      case 'user':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <DashboardLayout>
      <SectionTitle title="Users" subtitle="Manage platform users" />

      <DashboardCard className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 flex items-center gap-2 bg-slate-700/50 rounded-lg px-4 py-2">
            <Search size={18} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
          <Button className="flex items-center gap-2">
            <Plus size={18} />
            Add User
          </Button>
        </div>
      </DashboardCard>

      <DashboardCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700 text-left text-xs font-semibold uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Shipments</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                  <td className="px-4 py-3 font-semibold">{row.name}</td>
                  <td className="px-4 py-3">{row.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleBadgeColor(row.role)}`}>
                      {row.role.charAt(0).toUpperCase() + row.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">{row.shipments}</td>
                  <td className="px-4 py-3 text-slate-500">{row.joined}</td>
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
