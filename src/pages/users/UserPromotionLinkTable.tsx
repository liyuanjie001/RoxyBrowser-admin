import { useEffect, useMemo, useRef, useState } from 'react';
import { usePromotionStore } from '@/store/promotionStore';
import type { PromotionLink, UserIdentity } from '@/types';
import { USER_IDENTITIES } from '@/types';
import { Card } from '@/components/Card';
import { Table } from '@/components/Table';

type ModifiedFilter = '' | 'yes' | 'no';

const moneyUSD = (n: number) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const moneyCNY = (n: number) =>
  `¥${n.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}`;

const dashIfNull = (n: number | null) => (n === null ? '-' : n.toLocaleString());

const dashIfZero = (n: number, fmt: (n: number) => string) => (n === 0 ? '$0.00' : fmt(n));

function IdentityChip({ value }: { value: UserIdentity }) {
  const map: Record<UserIdentity, string> = {
    创始用户: 'bg-rose-50 text-rose-700',
    高级合作伙伴: 'bg-violet-50 text-violet-700',
    特邀用户: 'bg-amber-50 text-amber-700',
    新用户: 'bg-slate-100 text-slate-600',
  };
  return <span className={`chip ${map[value]}`}>{value}</span>;
}

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

export function UserPromotionLinkTable() {
  const { links } = usePromotionStore();

  const [nameQ, setNameQ] = useState('');
  const [identityQ, setIdentityQ] = useState<'' | UserIdentity>('');
  const [promotersQ, setPromotersQ] = useState<string[]>([]);
  const [modifiedQ, setModifiedQ] = useState<ModifiedFilter>('');

  const [applied, setApplied] = useState({
    nameQ: '',
    identityQ: '' as '' | UserIdentity,
    promotersQ: [] as string[],
    modifiedQ: '' as ModifiedFilter,
  });

  const promoterOptions = useMemo(() => {
    const set = new Set<string>();
    for (const l of links) {
      const n = l.ownerName.trim();
      if (n) set.add(n);
    }
    return Array.from(set).sort();
  }, [links]);

  const [toast, setToast] = useState<string | null>(null);
  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  };

  const onQuery = () => setApplied({ nameQ: nameQ.trim(), identityQ, promotersQ: [...promotersQ], modifiedQ });
  const onReset = () => {
    setNameQ('');
    setIdentityQ('');
    setPromotersQ([]);
    setModifiedQ('');
    setApplied({ nameQ: '', identityQ: '', promotersQ: [], modifiedQ: '' });
  };

  const filtered = useMemo(() => {
    return links.filter((l) => {
      const target = `${l.ownerUsername} ${l.ownerName}`.toLowerCase();
      if (applied.nameQ && !target.includes(applied.nameQ.toLowerCase())) return false;
      if (applied.identityQ && l.identity !== applied.identityQ) return false;
      if (applied.promotersQ.length && !applied.promotersQ.includes(l.ownerName)) return false;
      if (applied.modifiedQ === 'yes' && !l.modified) return false;
      if (applied.modifiedQ === 'no' && l.modified) return false;
      return true;
    });
  }, [links, applied]);

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="input max-w-[14rem]"
            placeholder="用户名"
            value={nameQ}
            onChange={(e) => setNameQ(e.target.value)}
          />
          <select
            className="input max-w-[14rem]"
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
          <MultiSelect
            placeholder="推广人(BD)姓名"
            options={promoterOptions}
            value={promotersQ}
            onChange={setPromotersQ}
          />
          <select
            className="input max-w-[14rem]"
            value={modifiedQ}
            onChange={(e) => setModifiedQ(e.target.value as ModifiedFilter)}
          >
            <option value="">是否修改折扣</option>
            <option value="yes">是</option>
            <option value="no">-</option>
          </select>
          <div className="ml-auto flex gap-2">
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
          </div>
        </div>
      </Card>

      <Card title="用户推广链接">
        <Table<PromotionLink>
          rowKey={(r) => r.id}
          data={filtered}
          columns={[
            {
              key: 'ownerUsername',
              title: '用户名',
              render: (r) => (
                <div className="flex items-center gap-1">
                  <span className="font-medium text-slate-800">{r.ownerUsername}</span>
                  <CopyButton text={r.ownerUsername} title="复制用户名" />
                </div>
              ),
            },
            {
              key: 'ownerName',
              title: '推广人(BD)姓名',
              render: (r) => <span className="text-slate-700">{r.ownerName}</span>,
            },
            {
              key: 'identity',
              title: '用户身份',
              render: (r) => <IdentityChip value={r.identity} />,
            },
            {
              key: 'url',
              title: '推广链接',
              render: (r) => (
                <div className="flex items-center gap-1.5">
                  <span
                    className="block max-w-[18rem] truncate font-mono text-xs text-slate-600"
                    title={r.url}
                  >
                    {r.url}
                  </span>
                  <CopyButton text={r.url} title="复制链接" />
                </div>
              ),
            },
            {
              key: 'ownedUserCount',
              title: '名下用户数量',
              sortable: true,
              sortValue: (r) => r.ownedUserCount,
              render: (r) => r.ownedUserCount.toLocaleString(),
            },
            {
              key: 'subscriberCount',
              title: '订阅人数',
              sortable: true,
              sortValue: (r) => r.subscriberCount ?? -1,
              render: (r) => dashIfNull(r.subscriberCount),
            },
            {
              key: 'visits',
              title: '访问量',
              sortable: true,
              sortValue: (r) => r.visits,
              render: (r) => r.visits.toLocaleString(),
            },
            {
              key: 'registrations',
              title: '注册量',
              sortable: true,
              sortValue: (r) => r.registrations,
              render: (r) => r.registrations.toLocaleString(),
            },
            {
              key: 'payments',
              title: '付费量',
              sortable: true,
              sortValue: (r) => r.payments,
              render: (r) => r.payments.toLocaleString(),
            },
            {
              key: 'totalRecharge',
              title: '名下用户充值总金额',
              sortable: true,
              sortValue: (r) => r.totalRecharge,
              render: (r) => dashIfZero(r.totalRecharge, moneyUSD),
            },
            {
              key: 'recharge30d',
              title: '近30天名下用户充值',
              sortable: true,
              sortValue: (r) => r.recharge30d,
              render: (r) => dashIfZero(r.recharge30d, moneyUSD),
            },
            {
              key: 'withdrawable',
              title: '可提现金额',
              sortable: true,
              sortValue: (r) => r.withdrawable,
              render: (r) => dashIfZero(r.withdrawable, moneyUSD),
            },
            {
              key: 'withdrawn',
              title: '已提现金额',
              sortable: true,
              sortValue: (r) => r.withdrawn,
              render: (r) => dashIfZero(r.withdrawn, moneyUSD),
            },
            {
              key: 'revenue',
              title: '总收入',
              sortable: true,
              sortValue: (r) => r.revenue,
              render: (r) => <span className="font-medium text-brand-700">{moneyCNY(r.revenue)}</span>,
            },
            {
              key: 'code',
              title: 'code 别名',
              render: (r) => <span className="font-mono text-xs text-slate-600">{r.code}</span>,
            },
            {
              key: 'linkType',
              title: '链接类型',
              render: (r) => <span className="font-mono text-slate-700">{r.linkType}</span>,
            },
            {
              key: 'rebateNonAgent',
              title: '非代理返利',
              render: (r) => `${r.rebateNonAgent}%`,
            },
            {
              key: 'rebateAgent',
              title: '代理返利',
              render: (r) => `${r.rebateAgent}%`,
            },
            {
              key: 'userDiscount',
              title: '用户折扣',
              render: (r) => `${r.userDiscount}%`,
            },
            {
              key: 'modified',
              title: '是否修改折扣',
              render: (r) =>
                r.modified ? (
                  <span className="font-medium text-emerald-600">是</span>
                ) : (
                  <span className="text-slate-300">-</span>
                ),
            },
            {
              key: 'createdAt',
              title: '创建时间',
              className: 'text-slate-500 whitespace-nowrap',
            },
            {
              key: 'action',
              title: '操作',
              render: (r) => (
                <button
                  className="btn-ghost !py-1"
                  onClick={() => flash(`编辑 ${r.ownerUsername} 的推广链接（功能占位）`)}
                >
                  编辑
                </button>
              ),
            },
          ]}
        />

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>共 {filtered.length} 条</span>
          <span className="text-slate-400">显示当前页 · 排序点击表头</span>
        </div>
      </Card>

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white shadow-xl">
          {toast}
        </div>
      )}
    </div>
  );
}

function MultiSelect({
  options,
  value,
  onChange,
  placeholder,
}: {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  };

  return (
    <div ref={ref} className="relative max-w-[14rem] flex-1 min-w-[12rem]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="input flex w-full items-center gap-1.5 text-left"
      >
        {value.length === 0 ? (
          <span className="flex-1 truncate text-slate-400">{placeholder}</span>
        ) : (
          <span className="flex flex-1 flex-wrap gap-1 overflow-hidden">
            {value.slice(0, 2).map((v) => (
              <span key={v} className="chip bg-brand-50 text-brand-700">
                {v}
              </span>
            ))}
            {value.length > 2 && (
              <span className="chip bg-slate-100 text-slate-600">+{value.length - 2}</span>
            )}
          </span>
        )}
        <svg
          className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-xs text-slate-400">暂无可选</div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 px-3 py-1.5 text-xs">
                <button
                  type="button"
                  className="text-brand-600 hover:underline"
                  onClick={() => onChange(options.slice())}
                >
                  全选
                </button>
                <button
                  type="button"
                  className="text-slate-500 hover:underline"
                  onClick={() => onChange([])}
                >
                  清空
                </button>
              </div>
              {options.map((opt) => {
                const checked = value.includes(opt);
                return (
                  <label
                    key={opt}
                    className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(opt)}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="truncate">{opt}</span>
                  </label>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
}
