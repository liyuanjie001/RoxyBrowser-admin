interface Props {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
  className?: string;
}

export function StatCard({ label, value, sub, accent, className = '' }: Props) {
  return (
    <div
      className={`flex flex-col justify-center rounded-xl border p-4 ${
        accent ? 'border-brand-200 bg-brand-50' : 'border-slate-100 bg-white shadow-soft'
      } ${className}`}
    >
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ? 'text-brand-700' : 'text-slate-800'}`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}
