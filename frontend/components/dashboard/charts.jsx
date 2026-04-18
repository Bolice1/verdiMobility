'use client';

import { motion } from 'framer-motion';

export function ProgressChart({ percentage, label }) {
  const radius = 44;
  const circumference = 2 * Math.PI * radius;

  return (
    <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
      <div className="relative h-40 w-40">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#16a34a"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - percentage / 100) }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-semibold tracking-tight text-slate-950">{percentage}%</div>
            <div className="mt-1 text-xs text-slate-500">{label}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function BarChart({ data }) {
  const maxValue = Math.max(...data.values, 1);

  return (
    <div className="space-y-4">
      <div className="flex h-56 items-end justify-between gap-3 rounded-[28px] bg-slate-50 px-4 pb-4 pt-6">
        {data.values.map((value, idx) => {
          const height = (value / maxValue) * 100;
          return (
            <div key={`${data.labels?.[idx] ?? idx}`} className="flex flex-1 flex-col items-center justify-end gap-2">
              <span className="text-xs font-medium text-slate-500">{value}</span>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ delay: idx * 0.06, duration: 0.5 }}
                className="w-full rounded-t-[20px] bg-gradient-to-t from-slate-950 via-green-800 to-green-500"
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between px-1 text-xs text-slate-500">
        {data.labels?.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>
    </div>
  );
}

export function LineChart({ data }) {
  const maxValue = Math.max(...data.values, 1);
  const points = data.values.map((value, idx) => ({
    x: (idx / Math.max(data.values.length - 1, 1)) * 100,
    y: 100 - (value / maxValue) * 100,
  }));
  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

  return (
    <div className="space-y-4 rounded-[28px] bg-slate-50 p-5">
      <svg className="h-52 w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="dashboardLine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[20, 40, 60, 80].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#dbe4db" strokeDasharray="2 3" />
        ))}
        <motion.path
          d={line}
          fill="none"
          stroke="#0f172a"
          strokeWidth="2.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1 }}
        />
        <motion.path
          d={`${line} L 100 100 L 0 100`}
          fill="url(#dashboardLine)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        {points.map((point, idx) => (
          <motion.circle
            key={idx}
            cx={point.x}
            cy={point.y}
            r="2.2"
            fill="#16a34a"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12 + idx * 0.05 }}
          />
        ))}
      </svg>
      <div className="flex justify-between text-xs text-slate-500">
        {data.labels?.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

export function MiniTrend({ values = [] }) {
  const maxValue = Math.max(...values, 1);
  const points = values.map((value, idx) => ({
    x: (idx / Math.max(values.length - 1, 1)) * 100,
    y: 100 - (value / maxValue) * 100,
  }));
  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');

  return (
    <svg className="h-12 w-28" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d={line} fill="none" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

export function RouteMapCard({ title, stops = [], footer }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.07)]">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-950">{title}</h4>
        {footer}
      </div>
      <div className="relative overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.15),transparent_18%),linear-gradient(135deg,#f8fafc_0%,#eef7ef_100%)] p-4">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.18)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.18)_1px,transparent_1px)] bg-[size:34px_34px]" />
        <div className="relative h-48 rounded-[20px] border border-white/80 bg-white/50 p-4 backdrop-blur-sm">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 180" preserveAspectRatio="none">
            <path
              d="M36 126 C 80 52, 140 72, 172 92 S 240 140, 272 54"
              fill="none"
              stroke="#111827"
              strokeWidth="4"
              strokeDasharray="8 10"
            />
            <circle cx="36" cy="126" r="10" fill="#111827" />
            <circle cx="172" cy="92" r="11" fill="#16a34a" />
            <circle cx="272" cy="54" r="12" fill="#84cc16" />
          </svg>
          <div className="relative flex h-full flex-col justify-between">
            {stops.map((stop) => (
              <div key={stop.label} className="inline-flex w-fit items-center gap-3 rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-700 shadow-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
                {stop.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
