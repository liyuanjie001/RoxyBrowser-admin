import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { PromotionDashboardPage } from '@/pages/PromotionDashboardPage';
import { TrafficDashboardPage } from '@/pages/TrafficDashboardPage';
import { MarketingPage } from '@/pages/MarketingPage';
import { useAuthStore } from '@/store/authStore';
import { hasCapability } from '@/auth/permissions';

function Guard({ capability, children }: { capability: Parameters<typeof hasCapability>[1]; children: JSX.Element }) {
  const { currentUser } = useAuthStore();
  if (!hasCapability(currentUser.role, capability)) {
    return <Navigate to="/promotion" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/promotion" replace />} />
        <Route
          path="promotion"
          element={
            <Guard capability="viewPromotionDashboard">
              <PromotionDashboardPage />
            </Guard>
          }
        />
        <Route
          path="traffic"
          element={
            <Guard capability="viewTrafficDashboard">
              <TrafficDashboardPage />
            </Guard>
          }
        />
        <Route
          path="marketing"
          element={
            <Guard capability="viewMarketingModule">
              <MarketingPage />
            </Guard>
          }
        />
        <Route path="*" element={<Navigate to="/promotion" replace />} />
      </Route>
    </Routes>
  );
}
