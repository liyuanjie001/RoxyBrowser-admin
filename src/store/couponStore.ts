import { create } from 'zustand';
import type { Coupon } from '@/types';
import { mockCoupons } from '@/mock/data';

let idCounter = 10;

interface CouponState {
  coupons: Coupon[];
  enabled: Set<string>;
  toggleEnabled: (id: string) => void;
  addFullReduction: (payload: { name: string; threshold: number; amount: number; validFrom: string; validTo: string }) => void;
  addDiscount: (payload: { name: string; discountPercent: number; validFrom: string; validTo: string }) => void;
}

export const useCouponStore = create<CouponState>()((set) => ({
  coupons: mockCoupons,
  enabled: new Set(mockCoupons.map((c) => c.id)),
  toggleEnabled: (id) =>
    set((s) => {
      const next = new Set(s.enabled);
      next.has(id) ? next.delete(id) : next.add(id);
      return { enabled: next };
    }),
  addFullReduction: ({ name, threshold, amount, validFrom, validTo }) =>
    set((s) => ({
      coupons: [
        {
          id: `cp-${++idCounter}`,
          type: 'FULL_REDUCTION',
          name,
          threshold,
          amount,
          validFrom,
          validTo,
          createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
        },
        ...s.coupons,
      ],
    })),
  addDiscount: ({ name, discountPercent, validFrom, validTo }) =>
    set((s) => ({
      coupons: [
        {
          id: `cp-${++idCounter}`,
          type: 'DISCOUNT',
          name,
          discountPercent,
          validFrom,
          validTo,
          createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
        },
        ...s.coupons,
      ],
    })),
}));
