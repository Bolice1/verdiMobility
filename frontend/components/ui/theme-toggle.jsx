'use client';

import { Moon, SunMedium } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

import { useMounted } from '@/hooks/use-mounted';

export function ThemeToggle() {
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();

  if (!mounted) {
    return <div className="h-11 w-20 rounded-full bg-slate-200/70 dark:bg-slate-800/70" />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative flex h-11 w-20 items-center rounded-full border border-slate-200 bg-white/80 px-1 transition-all duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900/70"
    >
      <motion.span
        className="absolute left-1 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-green-700 to-green-500 text-white"
        animate={{ x: isDark ? 36 : 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      >
        {isDark ? <Moon size={16} /> : <SunMedium size={16} />}
      </motion.span>
      <span className="ml-auto mr-2 text-xs font-semibold text-slate-500 dark:text-slate-300">
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}
