import type { ReactNode } from 'react';

export function Card({
  title,
  subtitle,
  children,
  aside,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="card">
      {(title || subtitle || aside) && (
        <div className="card-header">
          <div>
            {title && <h3>{title}</h3>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}
