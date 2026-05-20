import { create } from 'zustand';
import type { Coupon } from '@/types';
import { mockCoupons } from '@/mock/data';

let idCounter = 10;

const REDEEM_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function genRedeemCode(prefix: string, existing: Coupon[]): string {
  for (let attempt = 0; attempt < 50; attempt++) {
    let s = '';
    for (let i = 0; i < 6; i++) s += REDEEM_CHARS[Math.floor(Math.random() * REDEEM_CHARS.length)];
    const code = `${prefix}-${s}`;
    if (!existing.some((c) => c.redeemCode === code)) return code;
  }
  return `${prefix}-${Date.now().toString(36).slice(-6).toUpperCase()}`;
}

interface CouponState {
  coupons: Coupon[];
  enabled: Set<string>;
  toggleEnabled: (id: string) => void;
  addFullReduction: (payload: { name: string; threshold: number; amount: number; validFrom: string; validTo: string; operatorName: string }) => void;
  addDiscount: (payload: { name: string; discountPercent: number; validFrom: string; validTo: string; operatorName: string }) => void;
  addWalletCash: (payload: { name: string; amount: number; validFrom: string; validTo: string; operatorName: string }) => void;
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
  addFullReduction: ({ name, threshold, amount, validFrom, validTo, operatorName }) =>
    set((s) => ({
      coupons: [
        {
          id: `cp-${++idCounter}`,
          type: 'FULL_REDUCTION',
          name,
          redeemCode: genRedeemCode('MJ', s.coupons),
          threshold,
          amount,
          validFrom,
          validTo,
          createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
          operatorName,
        },
        ...s.coupons,
      ],
    })),
  addDiscount: ({ name, discountPercent, validFrom, validTo, operatorName }) =>
    set((s) => ({
      coupons: [
        {
          id: `cp-${++idCounter}`,
          type: 'DISCOUNT',
          name,
          redeemCode: genRedeemCode('ZK', s.coupons),
          discountPercent,
          validFrom,
          validTo,
          createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
          operatorName,
        },
        ...s.coupons,
      ],
    })),
  addWalletCash: ({ name, amount, validFrom, validTo, operatorName }) =>
    set((s) => ({
      coupons: [
        {
          id: `cp-${++idCounter}`,
          type: 'WALLET_CASH',
          name,
          redeemCode: genRedeemCode('XJ', s.coupons),
          amount,
          validFrom,
          validTo,
          createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
          operatorName,
        },
        ...s.coupons,
      ],
    })),
}));
