export type Role =
  | 'CEO'
  | 'GENERAL_MANAGER'
  | 'TEAM_LEADER'
  | 'OPERATION'
  | 'KOL'
  | 'TECH_SUPPORT'
  | 'VIEWER'
  | 'TELESALES'
  | 'NON_OPERATION';

export const RoleLabel: Record<Role, string> = {
  CEO: 'CEO',
  GENERAL_MANAGER: '总经理',
  TEAM_LEADER: '组长',
  OPERATION: '运营',
  KOL: 'KOL',
  TECH_SUPPORT: '技术支持',
  VIEWER: '查看者',
  TELESALES: '电销人员',
  NON_OPERATION: '非运营员工',
};

export interface User {
  id: string;
  name: string;
  realName: string;
  username: string;
  role: Role;
}

export type Capability =
  | 'viewPromotionDashboard'
  | 'viewTrafficDashboard'
  | 'viewMarketingModule'
  | 'viewRevenue'
  | 'viewPhoneFull'
  | 'managePromotionLinks'
  | 'manageCoupons'
  | 'manageAccounts';

export type DataScope = 'ALL' | 'OWN';

export interface RolePolicy {
  capabilities: Capability[];
  promotionDataScope: DataScope;
}

export const RolePolicies: Record<Role, RolePolicy> = {
  CEO: {
    capabilities: [
      'viewPromotionDashboard',
      'viewTrafficDashboard',
      'viewMarketingModule',
      'viewRevenue',
      'viewPhoneFull',
      'managePromotionLinks',
      'manageCoupons',
      'manageAccounts',
    ],
    promotionDataScope: 'ALL',
  },
  GENERAL_MANAGER: {
    capabilities: [
      'viewPromotionDashboard',
      'viewTrafficDashboard',
      'viewMarketingModule',
      'viewRevenue',
      'viewPhoneFull',
      'managePromotionLinks',
      'manageCoupons',
    ],
    promotionDataScope: 'ALL',
  },
  TEAM_LEADER: {
    capabilities: [
      'viewPromotionDashboard',
      'viewTrafficDashboard',
      'viewMarketingModule',
      'viewRevenue',
      'viewPhoneFull',
      'managePromotionLinks',
      'manageCoupons',
    ],
    promotionDataScope: 'ALL',
  },
  OPERATION: {
    capabilities: [
      'viewPromotionDashboard',
      'viewTrafficDashboard',
      'viewMarketingModule',
      'viewPhoneFull',
      'managePromotionLinks',
      'manageCoupons',
    ],
    promotionDataScope: 'ALL',
  },
  KOL: {
    capabilities: [
      'viewPromotionDashboard',
      'viewTrafficDashboard',
      'viewMarketingModule',
      'viewPhoneFull',
      'managePromotionLinks',
      'manageCoupons',
    ],
    promotionDataScope: 'ALL',
  },
  TECH_SUPPORT: {
    capabilities: ['viewPromotionDashboard', 'viewTrafficDashboard'],
    promotionDataScope: 'ALL',
  },
  VIEWER: {
    capabilities: ['viewPromotionDashboard', 'viewTrafficDashboard'],
    promotionDataScope: 'ALL',
  },
  TELESALES: {
    capabilities: ['viewPromotionDashboard', 'viewTrafficDashboard', 'viewPhoneFull'],
    promotionDataScope: 'OWN',
  },
  NON_OPERATION: {
    capabilities: ['viewPromotionDashboard', 'viewTrafficDashboard'],
    promotionDataScope: 'OWN',
  },
};

export function hasCapability(role: Role, capability: Capability): boolean {
  return RolePolicies[role].capabilities.includes(capability);
}

export function getDataScope(role: Role): DataScope {
  return RolePolicies[role].promotionDataScope;
}

export function maskPhone(phone: string): string {
  if (phone.length < 7) return phone;
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
}
