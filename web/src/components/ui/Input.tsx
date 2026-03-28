import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  helper?: string;
};

export function Input({ label, helper, className = '', ...props }: InputProps) {
  return (
    <label className="field">
      <span>{label}</span>
      <input className={`input ${className}`.trim()} {...props} />
      {helper && <small>{helper}</small>}
    </label>
  );
}
