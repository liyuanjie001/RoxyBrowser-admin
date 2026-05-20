import { useState } from 'react';
import { useMarketingStore } from '@/store/marketingStore';
import type { Promoter } from '@/store/marketingStore';
import { useAuthStore } from '@/store/authStore';
import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import { Modal } from '@/components/Modal';

interface Form {
  name: string;
}

const empty: Form = { name: '' };

export function PromoterManager() {
  const { promoters, addPromoter, updatePromoter, removePromoter } = useMarketingStore();
  const { currentUser } = useAuthStore();
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Promoter | null>(null);
  const [form, setForm] = useState<Form>(empty);

  const openCreate = () => {
    setForm(empty);
    setCreateOpen(true);
  };

  const submitCreate = () => {
    if (!form.name.trim()) return;
    addPromoter({ name: form.name.trim(), operatorName: currentUser.realName });
    setCreateOpen(false);
  };

  const openEdit = (p: Promoter) => {
    setEditing(p);
    setForm({ name: p.name });
  };

  const submitEdit = () => {
    if (!editing) return;
    if (!form.name.trim()) return;
    updatePromoter(editing.id, { name: form.name.trim() });
    setEditing(null);
  };

  return (
    <>
      <Card
        title="推广人(BD)管理"
        extra={
          <button className="btn-primary" onClick={openCreate}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新增推广人(BD)
          </button>
        }
      >
        <Table<Promoter>
          rowKey={(r) => r.id}
          data={promoters}
          columns={[
            { key: 'name', title: '姓名', render: (r) => <span className="font-medium text-slate-800">{r.name}</span> },
            { key: 'bdCode', title: 'bd_code', render: (r) => <span className="font-mono text-slate-700">{r.bdCode}</span> },
            { key: 'operatorName', title: '操作人', render: (r) => <span className="text-slate-600">{r.operatorName}</span> },
            {
              key: 'action',
              title: '操作',
              render: (r) => (
                <div className="flex gap-2">
                  <button className="btn-ghost !py-1" onClick={() => openEdit(r)}>修改</button>
                  <button
                    className="btn-ghost !py-1 text-rose-600 hover:text-rose-700"
                    onClick={() => {
                      if (confirm(`确认删除推广人(BD)「${r.name}」？`)) removePromoter(r.id);
                    }}
                  >
                    删除
                  </button>
                </div>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        open={createOpen}
        title="新增推广人(BD)"
        onClose={() => setCreateOpen(false)}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setCreateOpen(false)}>取消</button>
            <button className="btn-primary" onClick={submitCreate}>确认新增</button>
          </>
        }
      >
        <PromoterFormFields form={form} onChange={setForm} promoter={null} />
      </Modal>

      <Modal
        open={!!editing}
        title="修改推广人(BD)"
        onClose={() => setEditing(null)}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setEditing(null)}>取消</button>
            <button className="btn-primary" onClick={submitEdit}>保存修改</button>
          </>
        }
      >
        <PromoterFormFields form={form} onChange={setForm} promoter={editing} />
      </Modal>
    </>
  );
}

function PromoterFormFields({
  form,
  onChange,
  promoter,
}: {
  form: Form;
  onChange: (f: Form) => void;
  promoter: Promoter | null;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="label">姓名</label>
        <input
          className="input"
          value={form.name}
          onChange={(e) => onChange({ ...form, name: e.target.value })}
          placeholder="如：李思雨"
        />
      </div>
      <div>
        <label className="label">推广人(BD) bd_code</label>
        <input
          className="input font-mono bg-slate-50"
          value={promoter?.bdCode ?? '保存后自动生成（bd_<拼音首字母><序号>）'}
          readOnly
        />
      </div>
    </div>
  );
}
