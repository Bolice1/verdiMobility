'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import { DashboardCard, SectionTitle, StatusBadge } from '@/components/dashboard/cards';
import { driverDemo, titleCaseStatus, statusTone } from '@/components/dashboard/demo-data';

export default function DriverJobsPage() {
  return (
    <DashboardLayout
      title="Driver Job Board"
      subtitle="A clean list of assigned jobs that matches the new dashboard style."
    >
      <SectionTitle
        title="Assigned delivery jobs"
        subtitle="Focused route cards for the driver role while more detailed job actions are added on the backend."
      />

      <div className="grid grid-cols-1 gap-6">
        {driverDemo.jobs.map((job) => (
          <DashboardCard key={job.id} title={job.id}>
            <div className="grid gap-5 md:grid-cols-[1.4fr_0.8fr]">
              <div>
                <p className="text-sm text-slate-500">{job.route}</p>
                <div className="mt-4 h-2 rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-gradient-to-r from-slate-950 to-green-500" style={{ width: `${job.progress}%` }} />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <StatusBadge value={titleCaseStatus(job.status)} tone={statusTone(job.status)} />
                  <span className="text-xs text-slate-500">{job.progress}% complete</span>
                </div>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">ETA</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">{job.eta}</p>
                <p className="mt-2 text-sm text-slate-500">{job.customer}</p>
              </div>
            </div>
          </DashboardCard>
        ))}
      </div>
    </DashboardLayout>
  );
}
