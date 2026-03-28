'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/layout';
import { DashboardCard, SectionTitle } from '@/components/dashboard/cards';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';

export default function AdminShipmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const shipments = [
    { id: 'SHP-25007', sender: 'Acme Corp', company: 'FastExpress', status: 'in_transit', cost: '$450', date: 'Mar 28' },
    { id: 'SHP-20215', sender: 'Tech Solutions', company: 'LogiMove', status: 'pending', cost: '$520', date: 'Mar 28' },
    { id: 'SHP-19600', sender: 'Global Exports', company: 'QuickShip', status: 'delivered', cost: '$380', date: 'Mar 27' },
    { id: 'SHP-18900', sender: 'Parts Supply', company: 'FastExpress', status: 'in_transit', cost: '$410', date: 'Mar 26' },
    { id: 'SHP-17500', sender: 'Industrial Co', company: 'LogiMove', status: 'delivered', cost: '$290', date: 'Mar 25' },
  ];

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch = s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sender.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
      <SectionTitle title="All Shipments" subtitle="Manage and monitor all shipments" />

      <DashboardCard className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 flex items-center gap-2 bg-slate-700/50 rounded-lg px-4 py-2">
            <Search size={18} className="text-slate-500" />
            <input
              type="text"
              placeholder="Search by ID or sender..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-lg bg-slate-700/50 text-white px-4 py-2 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
            </select>
            <Button className="flex items-center gap-2">
              <Plus size={18} />
              New Shipment
            </Button>
          </div>
        </div>
      </DashboardCard>

      <DashboardCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700 text-left text-xs font-semibold uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Shipment ID</th>
                <th className="px-4 py-3">Sender</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              {filteredShipments.map((row) => (
                <tr key={row.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition">
                  <td className="px-4 py-3 font-medium text-yellow-400">{row.id}</td>
                  <td className="px-4 py-3">{row.sender}</td>
                  <td className="px-4 py-3">{row.company}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(row.status)}`}>
                      {row.status.replace('_', ' ').charAt(0).toUpperCase() + row.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{row.cost}</td>
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
