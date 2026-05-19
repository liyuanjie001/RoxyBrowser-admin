import { useMemo, useState } from 'react';
import { mockEndUsers } from '@/mock/data';
import type { EndUser, UserIdentity } from '@/types';
import { USER_IDENTITIES } from '@/types';
import { Card } from '@/components/Card';
import { Table } from '@/components/Table';

type ContactKind = 'phone' | 'email';

const moneyUSD = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function CopyButton({ text, title = '复制' }: { text: string; title?: string }) {
  return (
    <button
      type="button"
      className="text-slate-300 hover:text-brand-600"
      title={title}
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard?.writeText(text);
      }}
    >
      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 16h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2zM4 12v6a2 2 0 002 2h8"
        />
      </svg>
    </button>
  );
}

function CopyableText({ value }: { value: string | null }) {
  if (!value) return <span className="text-slate-300">-</span>;
  return (
    <span className="inline-flex items-center gap-1">
      <span>{value}</span>
      <CopyButton text={value} />
    </span>
  );
}

export function UserListPage() {
  const [keyword, setKeyword] = useState('');
  const [identityQ, setIdentityQ] = useState<'' | UserIdentity>('');
  const [contactsQ, setContactsQ] = useState<ContactKind[]>([]);
  const [promoterQ, setPromoterQ] = useState('');

  const [applied, setApplied] = useState({
    keyword: '',
    identityQ: '' as '' | UserIdentity,
    contactsQ: [] as ContactKind[],
    promoterQ: '',
  });

  const onQuery = () =>
    setApplied({
      keyword: keyword.trim(),
      identityQ,
      contactsQ: [...contactsQ],
      promoterQ: promoterQ.trim(),
    });

  const onReset = () => {
    setKeyword('');
    setIdentityQ('');
    setContactsQ([]);
    setPromoterQ('');
    setApplied({ keyword: '', identityQ: '', contactsQ: [], promoterQ: '' });
  };

  const toggleContact = (k: ContactKind) => {
    setContactsQ((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  };

  const filtered = useMemo<EndUser[]>(() => {
    return mockEndUsers.filter((u) => {
      if (applied.keyword) {
        const kw = applied.keyword.toLowerCase();
        const hit =
          u.username.toLowerCase().includes(kw) ||
          (u.email?.toLowerCase().includes(kw) ?? false) ||
          (u.phone?.includes(applied.keyword) ?? false);
        if (!hit) return false;
      }
      if (applied.identityQ && u.identity !== applied.identityQ) return false;
      if (applied.contactsQ.includes('phone') && !u.phone) return false;
      if (applied.contactsQ.includes('email') && !u.email) return false;
      if (applied.promoterQ) {
        const pq = applied.promoterQ.toLowerCase();
        if (!u.promoterUsername || !u.promoterUsername.toLowerCase().includes(pq)) return false;
      }
      return true;
    });
  }, [applied]);

  const exportCsv = () => {
    const header = ['ID', '用户名', '推广用户名', '邮箱', '手机号', '身份', '折扣', '总充值', '余额', '来源'];
    const lines = filtered.map((u) =>
      [
        u.id,
        u.username,
        u.promoterUsername ?? '',
        u.email ?? '',
        u.phone ?? '',
        u.identity,
        `${u.discountPercent}%`,
        u.totalRecharge.toFixed(2),
        u.balance.toFixed(2),
        u.source ?? '',
      ]
        .map((c) => `"${String(c).replace(/"/g, '""')}"`)
        .join(','),
    );
    const csv = [header.join(','), ...lines].join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `用户列表_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="input max-w-[16rem]"
            placeholder="用户名 / 邮箱 / 手机号"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <select
            className="input max-w-[12rem]"
            value={identityQ}
            onChange={(e) => setIdentityQ(e.target.value as '' | UserIdentity)}
          >
            <option value="">用户身份</option>
            {USER_IDENTITIES.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-3 rounded-md border border-slate-200 px-3 py-1.5">
            <span className="text-xs text-slate-500">联系方式</span>
            <label className="flex cursor-pointer items-center gap-1 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={contactsQ.includes('phone')}
                onChange={() => toggleContact('phone')}
                className="h-3.5 w-3.5 rounded border-slate-300 text-brand-600"
              />
              手机
            </label>
            <label className="flex cursor-pointer items-center gap-1 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={contactsQ.includes('email')}
                onChange={() => toggleContact('email')}
                className="h-3.5 w-3.5 rounded border-slate-300 text-brand-600"
              />
              邮箱
            </label>
          </div>

          <input
            className="input max-w-[14rem]"
            placeholder="推广用户名"
            value={promoterQ}
            onChange={(e) => setPromoterQ(e.target.value)}
          />

          <button className="btn-primary" onClick={onQuery}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            查询
          </button>
          <button className="btn-ghost" onClick={onReset}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h6M20 20v-6h-6M5 14a7 7 0 0011.45 2.5M19 10A7 7 0 007.55 7.5" />
            </svg>
            重置
          </button>
          <button
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-white shadow-soft hover:bg-emerald-600"
            onClick={exportCsv}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
            </svg>
            导出
          </button>
        </div>
      </Card>

      <Card title="用户列表">
        <Table<EndUser>
          rowKey={(r) => String(r.id)}
          data={filtered}
          columns={[
            {
              key: 'id',
              title: 'ID',
              sortable: true,
              sortValue: (r) => r.id,
              render: (r) => (
                <span className="inline-flex items-center gap-1">
                  <span className="font-mono font-medium text-brand-600">{r.id}</span>
                  <CopyButton text={String(r.id)} />
                </span>
              ),
            },
            {
              key: 'username',
              title: '用户名',
              render: (r) => (
                <span className="inline-flex items-center gap-1">
                  <span className="font-medium text-slate-800">{r.username}</span>
                  <CopyButton text={r.username} />
                </span>
              ),
            },
            {
              key: 'promoterUsername',
              title: '推广用户名',
              render: (r) =>
                r.promoterUsername ? (
                  <span className="inline-flex items-center gap-1">
                    <span className="font-mono text-slate-700">{r.promoterUsername}</span>
                    <CopyButton text={r.promoterUsername} />
                  </span>
                ) : (
                  <span className="text-slate-300">-</span>
                ),
            },
            {
              key: 'email',
              title: '邮箱',
              render: (r) => <CopyableText value={r.email} />,
            },
            {
              key: 'phone',
              title: '手机号',
              render: (r) => <CopyableText value={r.phone} />,
            },
            {
              key: 'identity',
              title: '身份',
              render: (r) => <span className="text-slate-700">{r.identity}</span>,
            },
            {
              key: 'discountPercent',
              title: '折扣',
              sortable: true,
              sortValue: (r) => r.discountPercent,
              render: (r) => `${r.discountPercent}%`,
            },
            {
              key: 'totalRecharge',
              title: '总充值',
              sortable: true,
              sortValue: (r) => r.totalRecharge,
              render: (r) => moneyUSD(r.totalRecharge),
            },
            {
              key: 'balance',
              title: '余额',
              sortable: true,
              sortValue: (r) => r.balance,
              render: (r) => moneyUSD(r.balance),
            },
            {
              key: 'source',
              title: '来源',
              render: (r) => r.source ? <span className="text-slate-600">{r.source}</span> : <span className="text-slate-300">-</span>,
            },
          ]}
        />

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>共 {filtered.length} 条</span>
          <span className="text-slate-400">点击表头可排序</span>
        </div>
      </Card>
    </div>
  );
}
