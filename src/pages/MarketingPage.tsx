import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { hasCapability, RoleLabel } from '@/auth/permissions';
import { PermissionGate } from '@/components/PermissionGate';
import { PromotionLinkManager } from './marketing/PromotionLinkManager';
import { CouponManager } from './marketing/CouponManager';
import { AccountManager } from './marketing/AccountManager';

export function MarketingPage() {
  const { currentUser } = useAuthStore();
  const canAccounts = hasCapability(currentUser.role, 'manageAccounts');
  const canLinks = hasCapability(currentUser.role, 'managePromotionLinks');
  const canCoupons = hasCapability(currentUser.role, 'manageCoupons');

  const tabs = [
    canLinks && { key: 'links', label: '推广链接管理' },
    canCoupons && { key: 'coupons', label: '优惠券发放' },
    canAccounts && { key: 'accounts', label: '账号与权限' },
  ].filter(Boolean) as { key: string; label: string }[];

  const [active, setActive] = useState(tabs[0]?.key ?? 'links');

  if (tabs.length === 0) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-10 text-center shadow-soft">
        <p className="text-slate-500">当前角色（{RoleLabel[currentUser.role]}）无营销管理权限</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">营销管理</h2>
        <div className="mt-3 inline-flex gap-1 rounded-lg bg-slate-100 p-1">
          {tabs.map((t) => (
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
      </div>

      {active === 'links' && (
        <PermissionGate role={currentUser.role} capability="managePromotionLinks">
          <PromotionLinkManager />
        </PermissionGate>
      )}
      {active === 'coupons' && (
        <PermissionGate role={currentUser.role} capability="manageCoupons">
          <CouponManager />
        </PermissionGate>
      )}
      {active === 'accounts' && (
        <PermissionGate role={currentUser.role} capability="manageAccounts">
          <AccountManager />
        </PermissionGate>
      )}
    </div>
  );
}
