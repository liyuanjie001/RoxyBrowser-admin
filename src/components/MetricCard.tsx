interface Props {
  label: string;
  value: number;
  unit?: string;
  suffix?: string;
  sub?: string;
  accent?: boolean;
  className?: string;
  prevValue?: number;
}

function formatDelta(curr: number, prev: number) {
  if (!prev) return null;
  const diff = curr - prev;
  const pct = (diff / prev) * 100;
  return { diff, pct, up: diff >= 0 };
}

export function MetricCard({
  label,
  value,
  unit,
  suffix,
  sub,
  accent,
  className = '',
  prevValue,
}: Props) {
  const delta = typeof prevValue === 'number' ? formatDelta(value, prevValue) : null;
  const displayValue = `${unit ?? ''}${value.toLocaleString()}${suffix ?? ''}`;

  return (
    <div
      className={`flex flex-col rounded-xl border ${
        accent ? 'border-brand-200 bg-brand-50' : 'border-slate-100 bg-white shadow-soft'
      } ${className}`}
    >
      <div className="border-b border-slate-100 px-5 py-3.5">
        <h3 className="text-sm font-semibold text-slate-700">{label}</h3>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-5 text-center">
        <p className={`text-3xl font-bold leading-tight ${accent ? 'text-brand-700' : 'text-slate-800'}`}>
          {displayValue}
        </p>

        {sub && <p className="mt-1 text-[11px] text-slate-400">{sub}</p>}

        {delta && (
          <div className="mt-2 flex items-center gap-1 text-xs">
            <span
              className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold ${
                delta.up ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}
            >
              {delta.up ? '↑' : '↓'} {Math.abs(delta.pct).toFixed(1)}%
            </span>
            <span className="text-slate-400">环比</span>
          </div>
        )}
      </div>
    </div>
  );
}
