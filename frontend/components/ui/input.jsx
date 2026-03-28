import { cn } from '@/utils/cn';

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'h-12 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 text-sm text-slate-900 outline-none transition-all duration-300 ease-in-out placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-100 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-50 dark:focus:ring-green-950',
        className,
      )}
      {...props}
    />
  );
}
