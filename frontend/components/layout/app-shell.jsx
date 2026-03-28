'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, ClipboardList, LayoutDashboard, LineChart, Menu, PhoneCall, ShieldCheck, Truck, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useUiStore } from '@/store/ui-store';
import { cn } from '@/utils/cn';

const navItems = [
  { href: '/dashboard', label: 'Admin Dashboard', icon: ShieldCheck },
  { href: '/orders', label: 'User Orders', icon: ClipboardList },
  { href: '/drivers', label: 'Driver Board', icon: Truck },
  { href: '/analytics', label: 'Analytics', icon: LineChart },
  { href: '/contact', label: 'Contact', icon: PhoneCall },
];

export function AppShell({ children, title, eyebrow, actions }) {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUiStore();

  return (
    <div className="surface-grid min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-[1680px] gap-6 px-4 py-4 md:px-6">
        <AnimatePresence initial={false}>
          {sidebarOpen ? (
            <motion.aside
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="glass fixed inset-y-4 left-4 z-40 hidden w-[290px] rounded-[32px] p-6 lg:block"
            >
              <SidebarContent pathname={pathname} onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {sidebarOpen ? (
            <motion.div
              className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {sidebarOpen ? (
            <motion.aside
              initial={{ x: -36, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -36, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="glass fixed inset-y-4 left-4 z-40 w-[86vw] max-w-[290px] rounded-[32px] p-6 lg:hidden"
            >
              <SidebarContent pathname={pathname} onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          ) : null}
        </AnimatePresence>

        <div className={cn('w-full transition-all duration-300 ease-in-out', sidebarOpen ? 'lg:pl-[314px]' : 'lg:pl-0')}>
          <header className="glass mb-6 flex flex-col gap-4 rounded-[32px] px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleSidebar}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 transition-all duration-300 hover:border-green-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-green-800"
                >
                  {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{eyebrow}</p>
                  <h1 className="font-[family:var(--font-display)] text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {actions}
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}

function SidebarContent({ pathname, onClose }) {
  return (
    <div className="flex h-full flex-col">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-green-700 to-green-500 text-white shadow-lg shadow-green-700/30">
            <LayoutDashboard size={22} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">verdiMobility</p>
            <h2 className="text-lg font-semibold">Control Center</h2>
          </div>
        </Link>
        <button type="button" onClick={onClose} className="lg:hidden">
          <X size={18} />
        </button>
      </div>

      <div className="mb-7 rounded-[26px] bg-gradient-to-br from-green-800 via-green-700 to-green-500 p-5 text-white shadow-[0_18px_50px_rgba(22,163,74,0.28)]">
        <p className="text-xs uppercase tracking-[0.28em] text-white/70">Realtime sync</p>
        <h3 className="mt-2 text-xl font-semibold">Logistics orchestration with premium visibility</h3>
        <p className="mt-2 text-sm text-white/80">Track, assign, animate, and manage the entire system from one modular workspace.</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ease-in-out',
                active
                  ? 'bg-slate-950 text-white shadow-[0_16px_40px_rgba(15,23,42,0.2)] dark:bg-white dark:text-slate-950'
                  : 'text-slate-600 hover:bg-green-50 dark:text-slate-300 dark:hover:bg-green-950/25',
              )}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[26px] border border-dashed border-slate-300/80 p-5 dark:border-slate-700">
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-2xl bg-green-500/15 p-3 text-green-700 dark:text-green-400">
            <BarChart3 size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold">Performance mode</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">60fps friendly motion and lazy loading</p>
          </div>
        </div>
      </div>
    </div>
  );
}
