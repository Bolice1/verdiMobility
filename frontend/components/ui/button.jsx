'use client';

import { motion } from 'framer-motion';

import { cn } from '@/utils/cn';

const variants = {
  primary:
    'bg-gradient-to-r from-green-700 to-green-500 text-white shadow-[0_16px_40px_rgba(22,163,74,0.28)] hover:shadow-[0_22px_50px_rgba(22,163,74,0.34)]',
  secondary:
    'border border-slate-200 bg-white/80 text-slate-900 hover:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-50',
  ghost:
    'bg-transparent text-slate-700 hover:bg-green-50 dark:text-slate-300 dark:hover:bg-green-950/30',
};

export function Button({ className, variant = 'primary', children, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18 }}
      className={cn(
        'inline-flex min-h-11 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition-all duration-300 ease-in-out',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
