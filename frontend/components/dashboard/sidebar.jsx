'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  BriefcaseBusiness,
  CircleUserRound,
  Gauge,
  LifeBuoy,
  LogOut,
  Package,
  Settings,
  TrendingUp,
  Truck,
} from 'lucide-react';

import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/utils/cn';

const navItems = {
  admin: [
    { label: 'Overview', href: '/dashboard/admin', icon: Gauge },
    { label: 'Analytics', href: '/dashboard/admin/analytics', icon: TrendingUp },
    { label: 'Workspace', href: '/dashboard/settings', icon: Settings },
  ],
  company: [
    { label: 'Overview', href: '/dashboard/company', icon: BriefcaseBusiness },
    { label: 'Fleet', href: '/dashboard/company', icon: Truck },
    { label: 'Workspace', href: '/dashboard/settings', icon: Settings },
  ],
  driver: [
    { label: 'Overview', href: '/dashboard/driver', icon: Truck },
    { label: 'Jobs', href: '/dashboard/driver/jobs', icon: Package },
    { label: 'Workspace', href: '/dashboard/settings', icon: Settings },
  ],
  user: [
    { label: 'Overview', href: '/dashboard/user', icon: CircleUserRound },
    { label: 'Tracking', href: '/dashboard/user/tracking', icon: Truck },
    { label: 'Workspace', href: '/dashboard/settings', icon: Settings },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, setRolePreview } = useAuthStore();
  const userRole = user?.role || 'user';
  const items = navItems[userRole] || navItems.user;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-slate-950 px-5 py-6 text-white lg:flex lg:flex-col">
      <div className="mb-8 flex items-center gap-3 rounded-[28px] bg-white/5 px-4 py-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500 text-slate-950">
          <BarChart3 size={22} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">verdiMobility</p>
          <h2 className="text-lg font-semibold">Operations Suite</h2>
        </div>
      </div>

      <div className="mb-7 rounded-[30px] border border-white/10 bg-gradient-to-br from-white/10 to-green-500/10 p-5">
        <p className="text-xs uppercase tracking-[0.28em] text-white/50">Role Preview</p>
        <select
          value={userRole}
          onChange={(event) => setRolePreview(event.target.value)}
          className="mt-3 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none"
        >
          <option value="admin">Admin</option>
          <option value="company">Company</option>
          <option value="driver">Driver</option>
          <option value="user">User</option>
        </select>
        <p className="mt-3 text-xs leading-6 text-white/60">
          Switch roles to preview each dashboard while the backend auth flow is still being wired.
        </p>
      </div>

      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white text-slate-950'
                  : 'text-slate-300 hover:bg-white/8 hover:text-white',
              )}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <div className="rounded-[28px] border border-white/10 bg-white/6 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/45">Current User</p>
          <p className="mt-2 text-base font-semibold text-white">{user?.name || 'Preview User'}</p>
          <p className="mt-1 text-sm text-white/55">{user?.email || 'user@verdimobility.com'}</p>
          <div className="mt-3 inline-flex rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-green-300">
            {userRole}
          </div>
        </div>

        <Link
          href="/contact"
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-300 transition-all hover:bg-white/8 hover:text-white"
        >
          <LifeBuoy size={18} />
          Support
        </Link>

        <div className="space-y-2">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm text-slate-300 hover:bg-white/8 hover:text-white transition-all"
          >
            <Settings size={18} />
            Settings
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-sm text-slate-300 hover:bg-white/8 hover:text-white transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
