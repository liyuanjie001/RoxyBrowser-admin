import { useState } from 'react';
import { TrafficDashboardPage } from './TrafficDashboardPage';
import { PromotionDashboardPage } from './PromotionDashboardPage';

type TabKey = 'traffic' | 'promotion';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'traffic', label: '官网流量看板' },
  { key: 'promotion', label: '推广数据看板' },
];

export function DashboardPage() {
  const [active, setActive] = useState<TabKey>('traffic');

  return (
    <div className="space-y-6">
      <div className="inline-flex gap-1 rounded-lg bg-slate-100 p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              active === t.key ? 'bg-white text-brand-700 shadow-soft' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active === 'traffic' ? <TrafficDashboardPage /> : <PromotionDashboardPage />}
    </div>
  );
}
