import type { ReactNode } from 'react';

interface Props {
  title?: string;
  extra?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Card({ title, extra, children, className = '' }: Props) {
  return (
    <div className={`rounded-xl border border-slate-100 bg-white shadow-soft ${className}`}>
      {(title || extra) && (
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          {title && <h3 className="text-sm font-semibold text-slate-700">{title}</h3>}
          {extra && <div>{extra}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
