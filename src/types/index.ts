export type Channel = 'WEBSITE' | 'WECHAT' | 'DOUYIN' | 'XIAOHONGSHU' | 'KOL' | 'EMAIL' | 'OTHER';

export const ChannelLabel: Record<Channel, string> = {
  WEBSITE: '官网',
  WECHAT: '微信',
  DOUYIN: '抖音',
  XIAOHONGSHU: '小红书',
  KOL: 'KOL 合作',
  EMAIL: '邮件',
  OTHER: '其他',
};

export interface PromotionLink {
  id: string;
  ownerId: string;
  ownerName: string;
  name: string;
  code: string;
  url: string;
  channel: Channel;
  remark?: string;
  createdAt: string;
  visits: number;
  registrations: number;
  payments: number;
  revenue: number;
}

export interface RegisteredUser {
  id: string;
  phone: string;
  linkId: string;
  registeredAt: string;
  paidAmount: number | null;
}

export type CouponType = 'FULL_REDUCTION' | 'DISCOUNT';

export interface CouponBase {
  id: string;
  name: string;
  type: CouponType;
  validFrom: string;
  validTo: string;
  createdAt: string;
}

export interface FullReductionCoupon extends CouponBase {
  type: 'FULL_REDUCTION';
  threshold: number;
  amount: number;
}

export interface DiscountCoupon extends CouponBase {
  type: 'DISCOUNT';
  discountPercent: number;
}

export type Coupon = FullReductionCoupon | DiscountCoupon;

export type Site = 'COM' | 'CN';

export interface TrafficSource {
  source: string;
  visits: number;
  percent: number;
}

export interface SiteTraffic {
  site: Site;
  visits: number;
  registrations: number;
  sources: TrafficSource[];
}
