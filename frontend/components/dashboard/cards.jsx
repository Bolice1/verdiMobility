'use client';

import { motion } from 'framer-motion';

import { cn } from '@/utils/cn';

export function MetricCard({ label, value, trend, icon: Icon, emphasis = 'light', className }) {
  const trendUp = trend?.increase ?? false;
  const trendPercent = trend?.percent ?? '0%';
  const accent = emphasis === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={cn(
        accent
          ? 'rounded-[30px] border border-slate-900 bg-slate-950 p-6 text-white shadow-[0_26px_60px_rgba(15,23,42,0.22)]'
          : 'rounded-[30px] border border-slate-200 bg-white p-6 text-slate-950 shadow-[0_18px_50px_rgba(15,23,42,0.08)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className={cn('text-sm font-medium', accent ? 'text-slate-400' : 'text-slate-500')}>
            {label}
          </p>
          <h3 className={cn('mt-3 text-3xl font-semibold tracking-tight', accent ? 'text-white' : 'text-slate-950')}>
            {value}
          </h3>
          {trend ? (
            <p
              className={cn(
                'mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                accent
                  ? trendUp
                    ? 'bg-green-500/10 text-green-300'
                    : 'bg-red-500/10 text-red-300'
                  : trendUp
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700',
              )}
            >
              {trendUp ? 'Up' : 'Down'} {trendPercent}
            </p>
          ) : null}
        </div>
        {Icon ? (
          <div
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-2xl',
              accent ? 'bg-green-500/14 text-green-300' : 'bg-green-50 text-green-700',
            )}
          >
            <Icon size={28} />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

export function StatCard({ label, value, sublabel, className }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        'rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]',
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{value}</p>
      {sublabel ? <p className="mt-1 text-xs text-slate-500">{sublabel}</p> : null}
    </motion.div>
  );
}

export function DashboardCard({ title, children, action, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-[32px] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)]',
        className,
      )}
    >
      {title || action ? (
        <div className="mb-6 flex items-center justify-between gap-4">
          {title ? <h3 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h3> : <span />}
          {action}
        </div>
      ) : null}
      {children}
    </motion.div>
  );
}

export function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">{title}</h1>
      {subtitle ? <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">{subtitle}</p> : null}
    </div>
  );
}

export function StatusBadge({ value, tone = 'neutral' }) {
  const tones = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-lime-100 text-lime-700',
    info: 'bg-slate-100 text-slate-700',
    dark: 'bg-slate-950 text-white',
    neutral: 'bg-slate-100 text-slate-600',
  };

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize',
        tones[tone] ?? tones.neutral,
      )}
    >
      {value}
    </span>
  );
}
