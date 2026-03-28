import type { ReactNode, SelectHTMLAttributes } from 'react';

export function Select({
  label,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select className="input" {...props}>
        {children}
      </select>
    </label>
  );
}
