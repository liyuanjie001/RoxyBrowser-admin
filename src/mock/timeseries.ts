import type { Site } from '@/types';

export interface DailyMetric {
  date: string;
  visits: number;
  registrations: number;
  payments: number;
  revenue: number;
}

function generateDailyData(base: { visits: number; registrations: number; payments: number; revenue: number }, days: number): DailyMetric[] {
  const data: DailyMetric[] = [];
  const now = new Date('2026-05-13');
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const jitter = () => 0.7 + Math.random() * 0.6;
    const weekday = d.getDay();
    const weekendFactor = weekday === 0 || weekday === 6 ? 0.6 : 1;
    data.push({
      date: d.toISOString().slice(0, 10),
      visits: Math.round((base.visits / days) * jitter() * weekendFactor),
      registrations: Math.round((base.registrations / days) * jitter() * weekendFactor),
      payments: Math.round((base.payments / days) * jitter() * weekendFactor),
      revenue: Math.round((base.revenue / days) * jitter() * weekendFactor),
    });
  }
  return data;
}

export const promotionDailyData: Record<string, DailyMetric[]> = {
  'pl-001': generateDailyData({ visits: 12480, registrations: 824, payments: 196, revenue: 38420 }, 42),
  'pl-002': generateDailyData({ visits: 8721, registrations: 612, payments: 138, revenue: 26930 }, 35),
  'pl-003': generateDailyData({ visits: 1340, registrations: 92, payments: 18, revenue: 3420 }, 28),
  'pl-004': generateDailyData({ visits: 980, registrations: 71, payments: 12, revenue: 2120 }, 23),
  'pl-005': generateDailyData({ visits: 4120, registrations: 298, payments: 64, revenue: 12180 }, 11),
};

export function getAggregatedDaily(linkIds: string[]): DailyMetric[] {
  const map = new Map<string, DailyMetric>();
  for (const id of linkIds) {
    const series = promotionDailyData[id];
    if (!series) continue;
    for (const d of series) {
      const existing = map.get(d.date);
      if (existing) {
        existing.visits += d.visits;
        existing.registrations += d.registrations;
        existing.payments += d.payments;
        existing.revenue += d.revenue;
      } else {
        map.set(d.date, { ...d });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export interface SiteDailyMetric {
  date: string;
  visits: number;
  registrations: number;
}

function generateSiteDaily(base: { visits: number; registrations: number }, days: number): SiteDailyMetric[] {
  const data: SiteDailyMetric[] = [];
  const now = new Date('2026-05-13');
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const jitter = () => 0.7 + Math.random() * 0.6;
    const weekday = d.getDay();
    const weekendFactor = weekday === 0 || weekday === 6 ? 0.65 : 1;
    data.push({
      date: d.toISOString().slice(0, 10),
      visits: Math.round((base.visits / days) * jitter() * weekendFactor),
      registrations: Math.round((base.registrations / days) * jitter() * weekendFactor),
    });
  }
  return data;
}

export const siteDailyData: Record<Site, SiteDailyMetric[]> = {
  COM: generateSiteDaily({ visits: 184320, registrations: 6420 }, 60),
  CN: generateSiteDaily({ visits: 96210, registrations: 3180 }, 60),
};
