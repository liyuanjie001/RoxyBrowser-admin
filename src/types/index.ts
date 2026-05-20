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

export type UserIdentity = '创始用户' | '高级合作伙伴' | '特邀用户' | '新用户';
export const USER_IDENTITIES: UserIdentity[] = ['创始用户', '高级合作伙伴', '特邀用户', '新用户'];

export type LinkType = 'Link A' | 'Link B' | 'Link C';
export const LINK_TYPES: LinkType[] = ['Link A', 'Link B', 'Link C'];

export interface PromotionLink {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerUsername: string;
  operatorName: string;
  linkedUsername?: string;
  name: string;
  code: string;
  inviteId: string;
  url: string;
  channel: Channel;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent?: string;
  utmTerm?: string;
  bdCode?: string;
  remark?: string;
  createdAt: string;
  visits: number;
  registrations: number;
  payments: number;
  revenue: number;
  identity: UserIdentity;
  ownedUserCount: number;
  subscriberCount: number | null;
  totalRecharge: number;
  recharge30d: number;
  withdrawable: number;
  withdrawn: number;
  linkType: LinkType;
  rebateNonAgent: number;
  rebateAgent: number;
  userDiscount: number;
  modified: boolean;
}

export interface RegisteredUser {
  id: string;
  phone: string;
  linkId: string;
  registeredAt: string;
  paidAmount: number | null;
}

export type CouponType = 'FULL_REDUCTION' | 'DISCOUNT' | 'WALLET_CASH';

export interface CouponBase {
  id: string;
  name: string;
  type: CouponType;
  redeemCode: string;
  validFrom: string;
  validTo: string;
  createdAt: string;
  operatorName: string;
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

export interface WalletCashCoupon extends CouponBase {
  type: 'WALLET_CASH';
  amount: number;
}

export type Coupon = FullReductionCoupon | DiscountCoupon | WalletCashCoupon;

export type UserSource = '直接注册' | '谷歌注册' | 'github注册' | null;

export interface EndUser {
  id: number;
  username: string;
  email: string | null;
  phone: string | null;
  identity: UserIdentity;
  discountPercent: number;
  totalRecharge: number;
  balance: number;
  source: UserSource;
  promoterUsername: string | null;
}

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
