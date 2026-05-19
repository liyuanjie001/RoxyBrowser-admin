import { useState } from 'react';
import { useMarketingStore } from '@/store/marketingStore';
import type { UtmCategory, UtmOption } from '@/store/marketingStore';
import { Card } from '@/components/Card';
import { Table } from '@/components/Table';
import { Modal } from '@/components/Modal';

const CATEGORIES: { key: UtmCategory; title: string; desc: string }[] = [
  { key: 'source', title: 'utm_source 渠道来源', desc: '如 tiktok、wechat、official_site' },
  { key: 'medium', title: 'utm_medium 推广媒介', desc: '如 video、post、banner' },
  { key: 'campaign', title: 'utm_campaign 活动批次', desc: '如 2026_q2_invite' },
  { key: 'content', title: 'utm_content 素材区分', desc: '同一活动内的素材 A/B' },
  { key: 'term', title: 'utm_term 关键词/竞价词', desc: '搜索/SEM 投放的关键词' },
];

interface Form {
  key: string;
  label: string;
}
const empty: Form = { key: '', label: '' };

export function UtmDictManager() {
  const [active, setActive] = useState<UtmCategory>('source');
  const { utm, addUtm, updateUtm, removeUtm } = useMarketingStore();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<UtmOption | null>(null);
  const [form, setForm] = useState<Form>(empty);

  const activeMeta = CATEGORIES.find((c) => c.key === active)!;
  const list = utm[active];

  const openCreate = () => {
    setForm(empty);
    setCreateOpen(true);
  };

  const submitCreate = () => {
    const key = form.key.trim().toLowerCase();
    const label = form.label.trim();
    if (!key || !label) return;
    if (list.some((x) => x.key === key)) {
      alert(`key「${key}」已存在`);
      return;
    }
    addUtm(active, { key, label });
    setCreateOpen(false);
  };

  const openEdit = (o: UtmOption) => {
    setEditing(o);
    setForm({ key: o.key, label: o.label });
  };

  const submitEdit = () => {
    if (!editing) return;
    const label = form.label.trim();
    if (!label) return;
    updateUtm(active, editing.key, { label });
    setEditing(null);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setActive(c.key)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active === c.key ? 'bg-white text-brand-700 shadow-soft' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>

        <Card
          title={activeMeta.title}
          extra={
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">{activeMeta.desc}</span>
              <button className="btn-primary" onClick={openCreate}>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                新增 {active}
              </button>
            </div>
          }
        >
          <Table<UtmOption>
            rowKey={(r) => r.key}
            data={list}
            columns={[
              { key: 'key', title: 'key', render: (r) => <span className="font-mono text-slate-700">{r.key}</span> },
              { key: 'label', title: '显示名称', render: (r) => <span className="text-slate-700">{r.label}</span> },
              {
                key: 'action',
                title: '操作',
                render: (r) => (
                  <div className="flex gap-2">
                    <button className="btn-ghost !py-1" onClick={() => openEdit(r)}>修改</button>
                    <button
                      className="btn-ghost !py-1 text-rose-600 hover:text-rose-700"
                      onClick={() => {
                        if (confirm(`确认删除选项「${r.key}」？`)) removeUtm(active, r.key);
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
      </div>

      <Modal
        open={createOpen}
        title={`新增 ${active} 选项`}
        onClose={() => setCreateOpen(false)}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setCreateOpen(false)}>取消</button>
            <button className="btn-primary" onClick={submitCreate}>确认新增</button>
          </>
        }
      >
        <UtmFormFields form={form} onChange={setForm} keyEditable />
      </Modal>

      <Modal
        open={!!editing}
        title={`修改 ${active} 选项`}
        onClose={() => setEditing(null)}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setEditing(null)}>取消</button>
            <button className="btn-primary" onClick={submitEdit}>保存修改</button>
          </>
        }
      >
        <UtmFormFields form={form} onChange={setForm} keyEditable={false} />
      </Modal>
    </>
  );
}

function UtmFormFields({
  form,
  onChange,
  keyEditable,
}: {
  form: Form;
  onChange: (f: Form) => void;
  keyEditable: boolean;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="label">key（拼到链接里的值）</label>
        <input
          className="input font-mono"
          value={form.key}
          onChange={(e) => onChange({ ...form, key: e.target.value.toLowerCase() })}
          placeholder="如：tiktok、banner_a"
          disabled={!keyEditable}
        />
        {!keyEditable && <p className="mt-1 text-xs text-slate-400">key 创建后不可修改，避免历史链接错位</p>}
      </div>
      <div>
        <label className="label">显示名称</label>
        <input
          className="input"
          value={form.label}
          onChange={(e) => onChange({ ...form, label: e.target.value })}
          placeholder="下拉菜单里展示的文字"
        />
      </div>
    </div>
  );
}
