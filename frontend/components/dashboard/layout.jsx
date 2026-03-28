'use client';

import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';

import { Sidebar } from './sidebar';

export function DashboardLayout({
  children,
  title = 'Dashboard',
  subtitle = 'Realtime operations visibility',
  actions,
}) {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-[#f5f7f4] text-slate-950">
      <Sidebar />
      <main className="min-h-screen pl-0 lg:pl-72">
        <div className="min-h-screen px-4 py-4 md:px-6 lg:px-8">
          <header className="mb-6 rounded-[32px] border border-slate-200 bg-white px-5 py-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] md:px-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                  {user?.role ?? 'dashboard'} workspace
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
                <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="flex h-12 min-w-[250px] items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4">
                  <Search size={16} className="text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search shipments, drivers, or routes"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </label>
                {actions ?? <Button className="h-12 px-5">Open Command Center</Button>}
              </div>
            </div>
          </header>

          <div className="rounded-[36px] border border-slate-200 bg-[#fbfcfb] p-4 shadow-[0_24px_60px_rgba(15,23,42,0.05)] md:p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
