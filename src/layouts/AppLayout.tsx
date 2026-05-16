import { NavLink, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { hasCapability, RoleLabel } from '@/auth/permissions';
import type { Capability } from '@/auth/permissions';
import { RoleSwitcher } from '@/components/RoleSwitcher';

interface NavItem {
  to: string;
  label: string;
  icon: JSX.Element;
  capability: Capability;
}

const navItems: NavItem[] = [
  {
    to: '/promotion',
    label: '推广链接看板',
    capability: 'viewPromotionDashboard',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18M7 14l3-3 3 3 5-6" />
      </svg>
    ),
  },
  {
    to: '/traffic',
    label: '官网流量看板',
    capability: 'viewTrafficDashboard',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zM3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
      </svg>
    ),
  },
  {
    to: '/marketing',
    label: '营销管理',
    capability: 'viewMarketingModule',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5l-7 7 7 7M4 12h16" />
      </svg>
    ),
  },
];

export function AppLayout() {
  const { currentUser } = useAuthStore();
  const visible = navItems.filter((n) => hasCapability(currentUser.role, n.capability));

  return (
    <div className="flex h-full">
      <aside className="flex w-60 shrink-0 flex-col border-r border-slate-100 bg-white">
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">R</div>
          <div>
            <p className="text-sm font-semibold text-slate-800">RoxyBrowser</p>
            <p className="text-xs text-slate-400">管理后台</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {visible.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-100 px-5 py-4">
          <p className="text-xs text-slate-500">当前账号</p>
          <p className="mt-0.5 text-sm font-medium text-slate-800">{currentUser.name}</p>
          <span className="chip mt-1 bg-brand-50 text-brand-700">{RoleLabel[currentUser.role]}</span>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-3">
          <div>
            <h1 className="text-base font-semibold text-slate-800">RoxyBrowser 管理后台</h1>
            <p className="text-xs text-slate-400">读写分离 · 数据看板与功能模块解耦</p>
          </div>
          <RoleSwitcher />
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
