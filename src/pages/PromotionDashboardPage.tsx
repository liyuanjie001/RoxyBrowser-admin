import { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuthStore } from '@/store/authStore';
import { usePromotionStore } from '@/store/promotionStore';
import { getDataScope, hasCapability } from '@/auth/permissions';
import { getAggregatedDaily } from '@/mock/timeseries';
import type { DailyMetric } from '@/mock/timeseries';
import { Card } from '@/components/Card';
import { MetricCard } from '@/components/MetricCard';
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

function getPrevSlice(current: DailyMetric[], full: DailyMetric[]): DailyMetric[] {
  if (current.length === 0) return [];
  const startIdx = full.indexOf(current[0]);
  if (startIdx <= 0) return [];
  return full.slice(Math.max(startIdx - current.length, 0), startIdx);
}

function sumKey(data: DailyMetric[], key: keyof DailyMetric): number {
  return data.reduce((acc, d) => acc + (d[key] as number), 0);
}

function buildCompareData(current: DailyMetric[], full: DailyMetric[]) {
  const prevSlice = getPrevSlice(current, full);
  return current.map((c, i) => ({
    date: c.date,
    visits: c.visits,
    registrations: c.registrations,
    payments: c.payments,
    revenue: c.revenue,
    visits_prev: prevSlice[i]?.visits ?? null,
    registrations_prev: prevSlice[i]?.registrations ?? null,
    payments_prev: prevSlice[i]?.payments ?? null,
    revenue_prev: prevSlice[i]?.revenue ?? null,
  }));
}

export function PromotionDashboardPage() {
  const { currentUser } = useAuthStore();
  const { links } = usePromotionStore();

  const scope = getDataScope(currentUser.role);
  const canSeeRevenue = hasCapability(currentUser.role, 'viewRevenue');

  const visibleLinks = useMemo(
    () => (scope === 'ALL' ? links : links.filter((l) => l.ownerId === currentUser.id)),
    [links, scope, currentUser.id],
  );

  const promoters = useMemo(() => {
    const map = new Map<string, string>();
    visibleLinks.forEach((l) => map.set(l.ownerId, l.ownerName));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [visibleLinks]);

  const [promoterId, setPromoterId] = useState<string>('ALL');

  const filteredLinks = useMemo(
    () => (promoterId === 'ALL' ? visibleLinks : visibleLinks.filter((l) => l.ownerId === promoterId)),
    [visibleLinks, promoterId],
  );

  const fullDaily = useMemo(() => getAggregatedDaily(filteredLinks.map((l) => l.id)), [filteredLinks]);

  const [days, setDays] = useState(7);
  const [compare, setCompare] = useState(false);
  const [startDate, setStartDate] = useState('2026-05-06');
  const [endDate, setEndDate] = useState('2026-05-13');

  const currentData = useMemo(() => filterByRange(fullDaily, days, startDate, endDate), [fullDaily, days, startDate, endDate]);
  const chartData = useMemo(() => (compare ? buildCompareData(currentData, fullDaily) : currentData), [compare, currentData, fullDaily]);

  const totals = useMemo(() => {
    return {
      visits: sumKey(currentData, 'visits'),
      registrations: sumKey(currentData, 'registrations'),
      payments: sumKey(currentData, 'payments'),
      revenue: sumKey(currentData, 'revenue'),
    };
  }, [currentData]);

  const prevTotals = useMemo(() => {
    const prev = getPrevSlice(currentData, fullDaily);
    return {
      visits: sumKey(prev, 'visits'),
      registrations: sumKey(prev, 'registrations'),
      payments: sumKey(prev, 'payments'),
      revenue: sumKey(prev, 'revenue'),
    };
  }, [currentData, fullDaily]);


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">推广链接数据看板</h2>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {promoters.length > 1 ? (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">推广人</span>
            <select
              value={promoterId}
              onChange={(e) => setPromoterId(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="ALL">全员</option>
              {promoters.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <span />
        )}
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

      {/* 收入：仅高权限可见，放在第一位 */}
      {canSeeRevenue && (
        <div className="grid grid-cols-3 gap-4">
          <MetricCard
            className="col-span-1 h-full"
            label="总收入"
            unit="¥"
            value={totals.revenue}
            sub="仅 CEO / 总经理 / 组长可见"
            prevValue={prevTotals.revenue}
          />
          <div className="col-span-2">
            <Card title="收入趋势">
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v: string) => v.slice(5)} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" name="收入（¥）" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                    {compare && <Line type="monotone" dataKey="revenue_prev" name="收入（环比）" stroke="#8b5cf6" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* 付费量：左总量 右趋势 1:2 */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          className="col-span-1 h-full"
          label="付费用户数"
          value={totals.payments}
          prevValue={prevTotals.payments}
        />
        <div className="col-span-2">
          <Card title="付费量趋势">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v: string) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="payments" name="付费量" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  {compare && <Line type="monotone" dataKey="payments_prev" name="付费量（环比）" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* 访问量：左总量 右趋势 1:2 */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          className="col-span-1 h-full"
          label="总访问量"
          value={totals.visits}
          sub={`${filteredLinks.length} 条推广链接`}
          prevValue={prevTotals.visits}
        />
        <div className="col-span-2">
          <Card title="访问量趋势">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v: string) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="visits" name="访问量" stroke="#2f7afe" strokeWidth={2} dot={false} />
                  {compare && <Line type="monotone" dataKey="visits_prev" name="访问量（环比）" stroke="#2f7afe" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* 注册量：左总量 右趋势 1:2 */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard
          className="col-span-1 h-full"
          label="总注册量"
          value={totals.registrations}
          prevValue={prevTotals.registrations}
        />
        <div className="col-span-2">
          <Card title="注册量趋势">
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v: string) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="registrations" name="注册量" stroke="#10b981" strokeWidth={2} dot={false} />
                  {compare && <Line type="monotone" dataKey="registrations_prev" name="注册量（环比）" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

    </div>
  );
}
