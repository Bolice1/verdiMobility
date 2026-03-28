'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { DashboardCard, SectionTitle } from '@/components/dashboard/cards';
import { Button } from '@/components/ui/button';
import { Download, Calendar } from 'lucide-react';

export default function AdminReportsPage() {
  const reports = [
    {
      id: 'RPT-001',
      title: 'Monthly Revenue Report',
      description: 'Comprehensive revenue analysis for March 2026',
      generatedDate: '2026-03-28',
      format: 'PDF',
    },
    {
      id: 'RPT-002',
      title: 'Delivery Performance Summary',
      description: 'On-time deliveries and performance metrics',
      generatedDate: '2026-03-27',
      format: 'PDF',
    },
    {
      id: 'RPT-003',
      title: 'Driver Performance Analysis',
      description: 'Individual driver ratings and delivery statistics',
      generatedDate: '2026-03-25',
      format: 'PDF',
    },
    {
      id: 'RPT-004',
      title: 'Environmental Impact Report',
      description: 'CO2 and fuel savings through platform usage',
      generatedDate: '2026-03-24',
      format: 'PDF',
    },
  ];

  return (
    <DashboardLayout>
      <SectionTitle
        title="Reports"
        subtitle="Generate and download system reports"
      />

      <DashboardCard className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 bg-slate-700/50 rounded-lg px-4 py-2">
            <Calendar size={18} className="text-slate-500" />
            <input type="date" className="bg-transparent text-white focus:outline-none" />
            <span className="text-slate-500 mx-2">-</span>
            <input type="date" className="bg-transparent text-white focus:outline-none" />
          </div>
          <Button className="flex items-center gap-2">
            <Download size={18} />
            Generate Report
          </Button>
        </div>
      </DashboardCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <DashboardCard key={report.id} className="flex flex-col">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">{report.title}</h3>
              <p className="text-sm text-slate-400 mt-1">{report.description}</p>
            </div>
            <div className="border-t border-slate-700 pt-4 mt-auto">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  <p>Generated: {report.generatedDate}</p>
                  <p>Format: {report.format}</p>
                </div>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30 transition">
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>
    </DashboardLayout>
  );
}
