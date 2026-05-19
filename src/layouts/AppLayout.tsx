import { useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { hasCapability, RoleLabel } from '@/auth/permissions';
import type { Capability } from '@/auth/permissions';
import { RoleSwitcher } from '@/components/RoleSwitcher';

interface NavLeaf {
  type: 'link';
  to: string;
  label: string;
  capability?: Capability;
}

interface NavGroup {
  type: 'group';
  key: string;
  label: string;
  icon: JSX.Element;
  capability?: Capability;
  children: NavLeaf[];
}

interface NavTop {
  type: 'top';
  to: string;
  label: string;
  icon: JSX.Element;
  capability?: Capability;
}

type NavItem = NavTop | NavGroup;

const icon = {
  stats: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v18h18M7 14l3-3 3 3 5-6" />
    </svg>
  ),
  list: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  users: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-5.13a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  marketing: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  ),
  payment: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
    </svg>
  ),
  workspace: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9-4 9 4-9 4-9-4zm0 6l9 4 9-4M3 17l9 4 9-4" />
    </svg>
  ),
  chevron: (
    <svg className="h-3.5 w-3.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
};

const navItems: NavItem[] = [
  { type: 'top', to: '/dashboard', label: '数据统计', icon: icon.stats, capability: 'viewPromotionDashboard' },
  { type: 'top', to: '/user-list', label: '用户列表', icon: icon.list },
  {
    type: 'group',
    key: 'users',
    label: '用户管理',
    icon: icon.users,
    children: [
      { type: 'link', to: '/users/email-block', label: '临时邮箱拦截' },
      { type: 'link', to: '/users/email-allow', label: '临时邮箱白名单' },
      { type: 'link', to: '/users/email-stats', label: '邮箱域名统计' },
      { type: 'link', to: '/users/withdrawals', label: '用户提款记录表' },
      { type: 'link', to: '/users/promotion-links', label: '用户推广链接表' },
      { type: 'link', to: '/users/rewards', label: '用户奖励明细' },
      { type: 'link', to: '/users/source', label: '用户来源' },
      { type: 'link', to: '/users/source-attribution', label: '用户来源归属设置' },
      { type: 'link', to: '/users/clicks', label: '用户点击记录' },
    ],
  },
  {
    type: 'group',
    key: 'marketing',
    label: '营销管理',
    icon: icon.marketing,
    capability: 'viewMarketingModule',
    children: [
      { type: 'link', to: '/marketing/links', label: '推广链接管理', capability: 'managePromotionLinks' },
      { type: 'link', to: '/marketing/coupons', label: '优惠券发放', capability: 'manageCoupons' },
      { type: 'link', to: '/marketing/accounts', label: '账号与权限', capability: 'manageAccounts' },
    ],
  },
  { type: 'top', to: '/payment', label: '支付管理', icon: icon.payment },
  { type: 'top', to: '/workspace', label: '空间管理', icon: icon.workspace },
];

export function AppLayout() {
  const { currentUser } = useAuthStore();
  const location = useLocation();

  const role = currentUser.role;
  const allowed = (cap?: Capability) => !cap || hasCapability(role, cap);

  const visibleItems = useMemo<NavItem[]>(() => {
    return navItems
      .map<NavItem | null>((item) => {
        if (item.type === 'top') {
          return allowed(item.capability) ? item : null;
        }
        const children = item.children.filter((c) => allowed(c.capability));
        if (!children.length) return null;
        if (!allowed(item.capability)) return null;
        return { ...item, children };
      })
      .filter((x): x is NavItem => x !== null);
  }, [role]);

  const initiallyOpen = useMemo(() => {
    const open = new Set<string>();
    for (const item of visibleItems) {
      if (item.type === 'group' && item.children.some((c) => location.pathname.startsWith(c.to))) {
        open.add(item.key);
      }
    }
    return open;
  }, [visibleItems, location.pathname]);

  const [openGroups, setOpenGroups] = useState<Set<string>>(initiallyOpen);

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

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
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
          {visibleItems.map((item) =>
            item.type === 'top' ? (
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
            ) : (
              <GroupNode
                key={item.key}
                group={item}
                open={openGroups.has(item.key)}
                onToggle={() => toggleGroup(item.key)}
              />
            ),
          )}
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

function GroupNode({
  group,
  open,
  onToggle,
}: {
  group: NavGroup;
  open: boolean;
  onToggle: () => void;
}) {
  const location = useLocation();
  const groupActive = group.children.some((c) => location.pathname.startsWith(c.to));

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={onToggle}
        className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
          groupActive
            ? 'text-brand-700'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
        }`}
      >
        {group.icon}
        <span className="flex-1 text-left">{group.label}</span>
        <span className={`text-slate-400 ${open ? 'rotate-90' : ''}`}>{icon.chevron}</span>
      </button>
      {open && (
        <div className="ml-4 space-y-0.5 border-l border-slate-100 pl-3">
          {group.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive }) =>
                `block rounded-md px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-medium'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
