import { useAuthStore } from '@/store/authStore';

export function RoleSwitcher() {
  const { currentUser, users, setCurrentUser } = useAuthStore();
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500">调试角色：</span>
      <select
        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 focus:border-brand-500 focus:outline-none"
        value={currentUser.id}
        onChange={(e) => {
          const u = users.find((x) => x.id === e.target.value);
          if (u) setCurrentUser(u);
        }}
      >
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
    </div>
  );
}
