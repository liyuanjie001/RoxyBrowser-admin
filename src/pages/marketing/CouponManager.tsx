import { useState } from 'react';
import { useCouponStore } from '@/store/couponStore';
import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import { Modal } from '@/components/Modal';

type CreateKind = null | 'FULL_REDUCTION' | 'DISCOUNT';

export function CouponManager() {
  const { coupons, enabled, toggleEnabled, addFullReduction, addDiscount } = useCouponStore();
  const [kind, setKind] = useState<CreateKind>(null);

  const [full, setFull] = useState({ name: '', threshold: 100, amount: 10, validFrom: '', validTo: '' });
  const [disc, setDisc] = useState({ name: '', discountPercent: 90, validFrom: '', validTo: '' });

  const submitFull = () => {
    if (!full.name.trim() || !full.validFrom || !full.validTo) return;
    addFullReduction({ ...full, name: full.name.trim() });
    setKind(null);
    setFull({ name: '', threshold: 100, amount: 10, validFrom: '', validTo: '' });
  };
  const submitDisc = () => {
    if (!disc.name.trim() || !disc.validFrom || !disc.validTo) return;
    addDiscount({ ...disc, name: disc.name.trim() });
    setKind(null);
    setDisc({ name: '', discountPercent: 90, validFrom: '', validTo: '' });
  };

  return (
    <>
      <Card
        title="优惠券发放"
        extra={
          <div className="flex gap-2">
            <button className="btn-ghost" onClick={() => setKind('FULL_REDUCTION')}>新增满减券</button>
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
              render: (r) => r.type === 'FULL_REDUCTION'
                ? <span className="chip bg-amber-50 text-amber-700">满减券</span>
                : <span className="chip bg-violet-50 text-violet-700">折扣券</span>,
            },
            { key: 'name', title: '名称', render: (r) => <span className="font-medium text-slate-800">{r.name}</span> },
            {
              key: 'rule', title: '规则',
              render: (r) => r.type === 'FULL_REDUCTION'
                ? `满 ¥${r.threshold} 减 ¥${r.amount}`
                : `打 ${(r.discountPercent / 10).toFixed(1)} 折`,
            },
            {
              key: 'valid', title: '有效期',
              render: (r) => <span className="text-slate-500">{r.validFrom} → {r.validTo}</span>,
            },
            { key: 'createdAt', title: '创建时间', className: 'text-slate-500' },
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
    </>
  );
}
