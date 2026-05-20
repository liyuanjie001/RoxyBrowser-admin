import { useState } from 'react';
import { useCouponStore } from '@/store/couponStore';
import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import { Modal } from '@/components/Modal';

type CreateKind = null | 'FULL_REDUCTION' | 'DISCOUNT' | 'WALLET_CASH';

export function CouponManager() {
  const { coupons, enabled, toggleEnabled, addFullReduction, addDiscount, addWalletCash } = useCouponStore();
  const { currentUser } = useAuthStore();
  const [kind, setKind] = useState<CreateKind>(null);

  const [full, setFull] = useState({ name: '', threshold: 100, amount: 10, validFrom: '', validTo: '' });
  const [disc, setDisc] = useState({ name: '', discountPercent: 90, validFrom: '', validTo: '' });
  const [wallet, setWallet] = useState({ name: '', amount: 10, validFrom: '', validTo: '' });

  const submitFull = () => {
    if (!full.name.trim() || !full.validFrom || !full.validTo) return;
    addFullReduction({ ...full, name: full.name.trim(), operatorName: currentUser.realName });
    setKind(null);
    setFull({ name: '', threshold: 100, amount: 10, validFrom: '', validTo: '' });
  };
  const submitDisc = () => {
    if (!disc.name.trim() || !disc.validFrom || !disc.validTo) return;
    addDiscount({ ...disc, name: disc.name.trim(), operatorName: currentUser.realName });
    setKind(null);
    setDisc({ name: '', discountPercent: 90, validFrom: '', validTo: '' });
  };
  const submitWallet = () => {
    if (!wallet.name.trim() || !wallet.validFrom || !wallet.validTo) return;
    addWalletCash({ ...wallet, name: wallet.name.trim(), operatorName: currentUser.realName });
    setKind(null);
    setWallet({ name: '', amount: 10, validFrom: '', validTo: '' });
  };

  return (
    <>
      <Card
        title="优惠券发放"
        extra={
          <div className="flex gap-2">
            <button className="btn-ghost" onClick={() => setKind('FULL_REDUCTION')}>新增满减券</button>
            <button className="btn-ghost" onClick={() => setKind('WALLET_CASH')}>新增钱包现金券</button>
            <button className="btn-primary" onClick={() => setKind('DISCOUNT')}>新增折扣券</button>
          </div>
        }
      >
        <Table
          rowKey={(r) => r.id}
          data={coupons}
          columns={[
            {
              key: 'type', title: '类型',
              render: (r) => {
                if (r.type === 'FULL_REDUCTION') return <span className="chip bg-amber-50 text-amber-700">满减券</span>;
                if (r.type === 'WALLET_CASH') return <span className="chip bg-emerald-50 text-emerald-700">钱包现金券</span>;
                return <span className="chip bg-violet-50 text-violet-700">折扣券</span>;
              },
            },
            { key: 'name', title: '名称', render: (r) => <span className="font-medium text-slate-800">{r.name}</span> },
            {
              key: 'redeemCode',
              title: '兑换码',
              render: (r) => (
                <span className="inline-flex items-center gap-1.5">
                  <span className="font-mono text-brand-700">{r.redeemCode}</span>
                  <button
                    type="button"
                    className="text-slate-300 hover:text-brand-600"
                    title="复制兑换码"
                    onClick={() => navigator.clipboard?.writeText(r.redeemCode)}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2zM4 12v6a2 2 0 002 2h8" />
                    </svg>
                  </button>
                </span>
              ),
            },
            {
              key: 'rule', title: '规则',
              render: (r) => {
                if (r.type === 'FULL_REDUCTION') return `满 ¥${r.threshold} 减 ¥${r.amount}`;
                if (r.type === 'WALLET_CASH') return `到账 ¥${r.amount}`;
                return `打 ${(r.discountPercent / 10).toFixed(1)} 折`;
              },
            },
            {
              key: 'valid', title: '有效期',
              render: (r) => <span className="text-slate-500">{r.validFrom} → {r.validTo}</span>,
            },
            { key: 'createdAt', title: '创建时间', className: 'text-slate-500' },
            {
              key: 'operatorName', title: '操作人',
              render: (r) => <span className="text-slate-600">{r.operatorName}</span>,
            },
            {
              key: 'status', title: '状态',
              render: (r) => {
                const on = enabled.has(r.id);
                return (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleEnabled(r.id)}
                      className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors"
                      style={{ backgroundColor: on ? '#10b981' : '#cbd5e1' }}
                    >
                      <span
                        className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform"
                        style={{ transform: on ? 'translateX(18px)' : 'translateX(3px)' }}
                      />
                    </button>
                    <span className={`text-xs ${on ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {on ? '已启用' : '已关闭'}
                    </span>
                  </div>
                );
              },
            },
          ]}
        />
      </Card>

      <Modal open={kind === 'FULL_REDUCTION'} title="新增满减券" onClose={() => setKind(null)}
        footer={<><button className="btn-ghost" onClick={() => setKind(null)}>取消</button><button className="btn-primary" onClick={submitFull}>确认新增</button></>}>
        <div className="space-y-3">
          <div><label className="label">券名称</label><input className="input" value={full.name} onChange={(e) => setFull({ ...full, name: e.target.value })} placeholder="如：满 200 减 30" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">金额门槛（¥）</label><input type="number" className="input" value={full.threshold} onChange={(e) => setFull({ ...full, threshold: Number(e.target.value) })} /></div>
            <div><label className="label">减免金额（¥）</label><input type="number" className="input" value={full.amount} onChange={(e) => setFull({ ...full, amount: Number(e.target.value) })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">生效日期</label><input type="date" className="input" value={full.validFrom} onChange={(e) => setFull({ ...full, validFrom: e.target.value })} /></div>
            <div><label className="label">失效日期</label><input type="date" className="input" value={full.validTo} onChange={(e) => setFull({ ...full, validTo: e.target.value })} /></div>
          </div>
        </div>
      </Modal>

      <Modal open={kind === 'DISCOUNT'} title="新增折扣券" onClose={() => setKind(null)}
        footer={<><button className="btn-ghost" onClick={() => setKind(null)}>取消</button><button className="btn-primary" onClick={submitDisc}>确认新增</button></>}>
        <div className="space-y-3">
          <div><label className="label">券名称</label><input className="input" value={disc.name} onChange={(e) => setDisc({ ...disc, name: e.target.value })} placeholder="如：8.5 折优惠券" /></div>
          <div>
            <label className="label">折扣百分比（1-99）</label>
            <input type="number" min={1} max={99} className="input" value={disc.discountPercent} onChange={(e) => setDisc({ ...disc, discountPercent: Number(e.target.value) })} />
            <p className="mt-1 text-xs text-slate-400">例：85 表示 8.5 折</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">生效日期</label><input type="date" className="input" value={disc.validFrom} onChange={(e) => setDisc({ ...disc, validFrom: e.target.value })} /></div>
            <div><label className="label">失效日期</label><input type="date" className="input" value={disc.validTo} onChange={(e) => setDisc({ ...disc, validTo: e.target.value })} /></div>
          </div>
        </div>
      </Modal>

      <Modal open={kind === 'WALLET_CASH'} title="新增钱包现金券" onClose={() => setKind(null)}
        footer={<><button className="btn-ghost" onClick={() => setKind(null)}>取消</button><button className="btn-primary" onClick={submitWallet}>确认新增</button></>}>
        <div className="space-y-3">
          <div><label className="label">券名称</label><input className="input" value={wallet.name} onChange={(e) => setWallet({ ...wallet, name: e.target.value })} placeholder="如：新用户钱包现金 10 元" /></div>
          <div>
            <label className="label">到账金额（¥）</label>
            <input type="number" min={1} className="input" value={wallet.amount} onChange={(e) => setWallet({ ...wallet, amount: Number(e.target.value) })} />
            <p className="mt-1 text-xs text-slate-400">用户领取后直接到账钱包余额</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="label">生效日期</label><input type="date" className="input" value={wallet.validFrom} onChange={(e) => setWallet({ ...wallet, validFrom: e.target.value })} /></div>
            <div><label className="label">失效日期</label><input type="date" className="input" value={wallet.validTo} onChange={(e) => setWallet({ ...wallet, validTo: e.target.value })} /></div>
          </div>
        </div>
      </Modal>
    </>
  );
}
