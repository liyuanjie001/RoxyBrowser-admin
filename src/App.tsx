import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { Placeholder } from '@/pages/Placeholder';
import { UserPromotionLinkTable } from '@/pages/users/UserPromotionLinkTable';
import { UserListPage } from '@/pages/users/UserListPage';
import { PromotionLinkManager } from '@/pages/marketing/PromotionLinkManager';
import { CouponManager } from '@/pages/marketing/CouponManager';
import { AccountManager } from '@/pages/marketing/AccountManager';
import { useAuthStore } from '@/store/authStore';
import { hasCapability } from '@/auth/permissions';
import type { Capability } from '@/auth/permissions';

function Guard({ capability, children }: { capability: Capability; children: JSX.Element }) {
  const { currentUser } = useAuthStore();
  if (!hasCapability(currentUser.role, capability)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route
          path="dashboard"
          element={
            <Guard capability="viewPromotionDashboard">
              <DashboardPage />
            </Guard>
          }
        />

        <Route path="user-list" element={<UserListPage />} />

        <Route path="users">
          <Route path="email-block" element={<Placeholder title="临时邮箱拦截" />} />
          <Route path="email-allow" element={<Placeholder title="临时邮箱白名单" />} />
          <Route path="email-stats" element={<Placeholder title="邮箱域名统计" />} />
          <Route path="withdrawals" element={<Placeholder title="用户提款记录表" />} />
          <Route path="promotion-links" element={<UserPromotionLinkTable />} />
          <Route path="rewards" element={<Placeholder title="用户奖励明细" />} />
          <Route path="source" element={<Placeholder title="用户来源" />} />
          <Route path="source-attribution" element={<Placeholder title="用户来源归属设置" />} />
          <Route path="clicks" element={<Placeholder title="用户点击记录" />} />
        </Route>

        <Route path="marketing">
          <Route index element={<Navigate to="/marketing/links" replace />} />
          <Route
            path="links"
            element={
              <Guard capability="managePromotionLinks">
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-slate-800">推广链接管理</h2>
                  <PromotionLinkManager />
                </div>
              </Guard>
            }
          />
          <Route
            path="coupons"
            element={
              <Guard capability="manageCoupons">
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-slate-800">优惠券发放</h2>
                  <CouponManager />
                </div>
              </Guard>
            }
          />
          <Route
            path="accounts"
            element={
              <Guard capability="manageAccounts">
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-slate-800">账号与权限</h2>
                  <AccountManager />
                </div>
              </Guard>
            }
          />
        </Route>

        <Route path="payment" element={<Placeholder title="支付管理" />} />
        <Route path="workspace" element={<Placeholder title="空间管理" />} />

        <Route path="promotion" element={<Navigate to="/dashboard" replace />} />
        <Route path="traffic" element={<Navigate to="/dashboard" replace />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
