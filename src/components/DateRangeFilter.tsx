interface Preset {
  label: string;
  days: number;
}

const presets: Preset[] = [
  { label: '近 7 天', days: 7 },
  { label: '近 14 天', days: 14 },
  { label: '近 30 天', days: 30 },
];

interface Props {
  days: number;
  onDaysChange: (days: number) => void;
  compare: boolean;
  onCompareChange: (v: boolean) => void;
  startDate: string;
  endDate: string;
  onStartChange: (v: string) => void;
  onEndChange: (v: string) => void;
}

export function DateRangeFilter({
  days,
  onDaysChange,
  compare,
  onCompareChange,
  startDate,
  endDate,
  onStartChange,
  onEndChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      <label className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-600">
        <input
          type="checkbox"
          checked={compare}
          onChange={(e) => onCompareChange(e.target.checked)}
          className="h-3.5 w-3.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
        />
        环比上同一时期
      </label>

      {days === 0 && (
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5">
          <input
            type="date"
            className="border-none bg-transparent px-0 py-0 text-xs text-slate-700 focus:outline-none focus:ring-0"
            value={startDate}
            onChange={(e) => onStartChange(e.target.value)}
          />
          <span className="text-xs text-slate-400">—</span>
          <input
            type="date"
            className="border-none bg-transparent px-0 py-0 text-xs text-slate-700 focus:outline-none focus:ring-0"
            value={endDate}
            onChange={(e) => onEndChange(e.target.value)}
          />
        </div>
      )}

      <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
        <button
          onClick={() => onDaysChange(0)}
          className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
            days === 0 ? 'bg-white text-brand-700 shadow-soft' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          自定义
        </button>
        {presets.map((p) => (
          <button
            key={p.days}
            onClick={() => onDaysChange(p.days)}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              days === p.days ? 'bg-white text-brand-700 shadow-soft' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
