import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { RoleLabel } from '@/auth/permissions';
import type { Role } from '@/auth/permissions';
import { Card } from '@/components/Card';
import { Table } from '@/components/Table';

const PROMOTABLE_ROLES: Role[] = ['CEO', 'OPERATION', 'KOL', 'TEAM_LEADER', 'GENERAL_MANAGER'];

export function AccountManager() {
  const { users, setCurrentUser, currentUser } = useAuthStore();
  const [records, setRecords] = useState(users);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const remove = (id: string) => {
    if (id === currentUser.id) { flash('不可删除当前登录账号'); return; }
    const target = records.find((u) => u.id === id);
    if (target?.role === 'CEO') { flash('最高权限账号不可删除'); return; }
    setRecords((prev) => prev.filter((u) => u.id !== id));
    flash('账号已删除');
  };

  const promote = (id: string, to: Role) => {
    setRecords((prev) => prev.map((u) => (u.id === id ? { ...u, role: to } : u)));
    if (id === currentUser.id) setCurrentUser({ ...currentUser, role: to });
    setEditingId(null);
    flash(`已将账号权限修改为「${RoleLabel[to]}」`);
  };

  return (
    <>
      <Card title="账号与权限管理" extra={<span className="chip bg-rose-50 text-rose-700">仅 CEO 可见</span>}>
        <Table
          rowKey={(r) => r.id}
          data={records}
          columns={[
            {
              key: 'username', title: '账号',
              render: (r) => <span className="font-medium text-slate-800">{r.username}</span>,
            },
            {
              key: 'realName', title: '用户名',
              render: (r) => <span className="text-slate-600">{r.realName}</span>,
            },
            {
              key: 'role', title: '当前角色',
              render: (r) => (
                <div className="flex items-center gap-1.5">
                  <span className="chip bg-slate-100 text-slate-600">{RoleLabel[r.role]}</span>
                  {editingId === r.id ? (
                    <select
                      autoFocus
                      className="rounded-md border border-brand-300 bg-white px-2 py-0.5 text-xs focus:outline-none"
                      value=""
                      onBlur={() => setEditingId(null)}
                      onChange={(e) => { if (e.target.value) promote(r.id, e.target.value as Role); }}
                    >
                      <option value="">选择角色…</option>
                      {PROMOTABLE_ROLES.filter((x) => x !== r.role).map((x) => (
                        <option key={x} value={x}>{RoleLabel[x]}</option>
                      ))}
                    </select>
                  ) : (
                    <button
                      onClick={() => setEditingId(r.id)}
                      className="text-slate-400 hover:text-brand-600"
                      title="修改角色"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z" />
                      </svg>
                    </button>
                  )}
                </div>
              ),
            },
            {
              key: 'action', title: '账号操作',
              render: (r) => (
                r.role === 'CEO' ? (
                  <span className="text-xs text-slate-300">—</span>
                ) : (
                  <button className="btn-danger !py-1" onClick={() => remove(r.id)}>删除</button>
                )
              ),
            },
          ]}
        />
      </Card>

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white shadow-xl">
          {toast}
        </div>
      )}
    </>
  );
}
