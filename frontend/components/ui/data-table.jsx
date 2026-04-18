import { cn } from '@/utils/cn';

export function DataTable({ columns, rows, className }) {
  return (
    <div className={cn('overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/60', className)}>
      <table className="w-full border-collapse text-left">
        <thead className="bg-slate-100/80 text-xs uppercase tracking-[0.2em] text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-5 py-4 font-medium">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className="border-t border-slate-200/70 transition-colors duration-300 hover:bg-green-50/70 dark:border-slate-800 dark:hover:bg-green-950/20"
            >
              {columns.map((column) => (
                <td key={column.key} className="px-5 py-4 text-sm text-slate-700 dark:text-slate-200">
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
