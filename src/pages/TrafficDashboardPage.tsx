import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { siteDailyData } from '@/mock/timeseries';
import type { SiteDailyMetric } from '@/mock/timeseries';
import { mockTraffic } from '@/mock/data';
import type { Site } from '@/types';
import { Card } from '@/components/Card';
import { DateRangeFilter } from '@/components/DateRangeFilter';

function filterByRange<T extends { date: string }>(data: T[], days: number, start: string, end: string): T[] {
  if (days > 0) {
    const cutoff = new Date('2026-05-13');
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    return data.filter((d) => d.date > cutoffStr);
  }
  return data.filter((d) => d.date >= start && d.date <= end);
}

function getPrevSlice(current: SiteDailyMetric[], full: SiteDailyMetric[]): SiteDailyMetric[] {
  if (current.length === 0) return [];
  const startIdx = full.indexOf(current[0]);
  if (startIdx <= 0) return [];
  return full.slice(Math.max(startIdx - current.length, 0), startIdx);
}

function buildCompare(current: SiteDailyMetric[], full: SiteDailyMetric[]) {
  const prevSlice = getPrevSlice(current, full);
  return current.map((c, i) => ({
    ...c,
    visits_prev: prevSlice[i]?.visits ?? null,
    registrations_prev: prevSlice[i]?.registrations ?? null,
  }));
}

function SiteSection({ site }: { site: Site }) {
  const label = site === 'COM' ? 'roxybrowser.com' : 'roxybrowser.cn';
  const fullData = siteDailyData[site];
  const trafficMeta = mockTraffic.find((t) => t.site === site)!;

  const [days, setDays] = useState(14);
  const [compare, setCompare] = useState(false);
  const [startDate, setStartDate] = useState('2026-04-29');
  const [endDate, setEndDate] = useState('2026-05-13');

  const currentData = useMemo(() => filterByRange(fullData, days, startDate, endDate), [fullData, days, startDate, endDate]);
  const chartData = useMemo(() => (compare ? buildCompare(currentData, fullData) : currentData), [compare, currentData, fullData]);

  const totals = useMemo(() => {
    return currentData.reduce(
      (acc, d) => { acc.visits += d.visits; acc.registrations += d.registrations; return acc; },
      { visits: 0, registrations: 0 },
    );
  }, [currentData]);

  const prevTotals = useMemo(() => {
    const prev = getPrevSlice(currentData, fullData);
    return prev.reduce(
      (acc, d) => { acc.visits += d.visits; acc.registrations += d.registrations; return acc; },
      { visits: 0, registrations: 0 },
    );
  }, [currentData, fullData]);

  const conversionRate = totals.visits > 0 ? (totals.registrations / totals.visits) * 100 : 0;
  const prevConversionRate = prevTotals.visits > 0 ? (prevTotals.registrations / prevTotals.visits) * 100 : 0;

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <h3 className="text-base font-semibold text-slate-800">{label}</h3>
        <DateRangeFilter
          days={days}
          onDaysChange={setDays}
          compare={compare}
          onCompareChange={setCompare}
          startDate={startDate}
          endDate={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
        />
      </div>

      {/* 左总览 右趋势 1:2，使用 grid-rows 让左侧卡片均分高度 */}
      <div className="grid grid-cols-3 gap-4">
        {/* 三指标合一卡片 */}
        <div className="col-span-1 flex flex-col rounded-xl border border-slate-100 bg-white shadow-soft">
          <div className="border-b border-slate-100 px-5 py-3.5">
            <h3 className="text-sm font-semibold text-slate-700">{label} 总览</h3>
          </div>
          {[
            { label: '访问量', value: totals.visits, prev: prevTotals.visits, accent: false },
            { label: '注册量', value: totals.registrations, prev: prevTotals.registrations, accent: false },
            { label: '注册转化率', value: conversionRate, prev: prevConversionRate, suffix: '%', accent: true },
          ].map((item, i) => {
            const delta = item.prev ? (() => {
              const pct = ((item.value - item.prev) / item.prev) * 100;
              return { pct, up: pct >= 0 };
            })() : null;
            return (
              <div key={i} className={`flex items-center justify-between px-5 py-3 ${i < 2 ? 'border-b border-slate-50' : ''}`}>
                <div>
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className={`mt-0.5 text-xl font-bold ${item.accent ? 'text-brand-700' : 'text-slate-800'}`}>
                    {item.suffix ? `${item.value.toFixed(2)}${item.suffix}` : item.value.toLocaleString()}
                  </p>
                </div>
                {delta && (
                  <span className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold ${delta.up ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {delta.up ? '↑' : '↓'} {Math.abs(delta.pct).toFixed(1)}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className="col-span-2">
          <Card title="访问量 & 注册量趋势">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v: string) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="visits" name="访问量" stroke="#2f7afe" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="registrations" name="注册量" stroke="#10b981" strokeWidth={2} dot={false} />
                  {compare && <Line type="monotone" dataKey="visits_prev" name="访问量（环比）" stroke="#2f7afe" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />}
                  {compare && <Line type="monotone" dataKey="registrations_prev" name="注册量（环比）" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      <Card title="流量来源分布">
        <ul className="space-y-3">
          {trafficMeta.sources.map((s) => (
            <li key={s.source}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{s.source}</span>
                <span className="text-slate-500">
                  {s.visits.toLocaleString()} · {s.percent}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-brand-500" style={{ width: `${s.percent}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
}

export function TrafficDashboardPage() {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">官网流量数据看板</h2>
      </div>

      <SiteSection site="COM" />
      <SiteSection site="CN" />
    </div>
  );
}
