import { useState } from 'react';
import { usePromotionStore } from '@/store/promotionStore';
import { useAuthStore } from '@/store/authStore';
import type { PromotionLink } from '@/types';
import { Card } from '@/components/Card';
import { InlineRemarkField } from '@/components/InlineRemarkField';
import { Table } from '@/components/Table';
import { Modal } from '@/components/Modal';

interface LinkForm {
  name: string;
  code: string;
  ownerName: string;
  remark: string;
  createdAt: string;
}

const emptyForm: LinkForm = { name: '', code: '', ownerName: '', remark: '', createdAt: '' };

export function PromotionLinkManager() {
  const { currentUser } = useAuthStore();
  const { links, addLink, updateLink } = usePromotionStore();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<PromotionLink | null>(null);

  const [form, setForm] = useState<LinkForm>(emptyForm);
  const [editForm, setEditForm] = useState<LinkForm>(emptyForm);

  const openCreate = () => {
    setForm({ ...emptyForm, ownerName: currentUser.realName });
    setCreateOpen(true);
  };

  const submitCreate = () => {
    if (!form.name.trim()) return;
    addLink({
      name: form.name.trim(),
      code: form.code.trim() || undefined,
      ownerName: form.ownerName.trim() || currentUser.realName,
      ownerId: currentUser.id,
      remark: form.remark.trim() || undefined,
      createdAt: form.createdAt || undefined,
    });
    setCreateOpen(false);
  };

  const openEdit = (link: PromotionLink) => {
    setEditing(link);
    setEditForm({
      name: link.name,
      code: link.code,
      ownerName: link.ownerName,
      remark: link.remark ?? '',
      createdAt: link.createdAt,
    });
  };

  const submitEdit = () => {
    if (!editing) return;
    updateLink(editing.id, {
      name: editForm.name.trim(),
      code: editForm.code.trim(),
      ownerName: editForm.ownerName.trim(),
      createdAt: editForm.createdAt,
    });
    setEditing(null);
  };

  const saveRemark = (id: string, value: string) => {
    updateLink(id, { remark: value.trim() || undefined });
  };

  return (
    <>
      <Card
        title="推广链接管理"
        extra={
          <button className="btn-primary" onClick={openCreate}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            生成推广链接
          </button>
        }
      >
        <Table
          rowKey={(r) => r.id}
          data={links}
          columns={[
            { key: 'name', title: '链接名称', render: (r) => <span className="font-medium text-slate-800">{r.name}</span> },
            { key: 'code', title: '推广链接', render: (r) => <span className="font-mono text-xs text-slate-500">{r.url}</span> },
            { key: 'ownerName', title: '推广人' },
            {
              key: 'remark',
              title: '备注',
              render: (r) => (
                <InlineRemarkField
                  key={r.id}
                  value={r.remark ?? ''}
                  onSave={(v) => saveRemark(r.id, v)}
                />
              ),
            },
            { key: 'createdAt', title: '创建时间', className: 'text-slate-500' },
            {
              key: 'action',
              title: '操作',
              render: (r) => (
                <button className="btn-ghost !py-1" onClick={() => openEdit(r)}>
                  修改
                </button>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        open={createOpen}
        title="生成推广链接"
        onClose={() => setCreateOpen(false)}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setCreateOpen(false)}>取消</button>
            <button className="btn-primary" onClick={submitCreate}>确认生成</button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="label">链接名称</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="如：春季官网活动" />
          </div>
          <div>
            <label className="label">推广链接</label>
            <input className="input" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="留空则自动生成" />
          </div>
          <div>
            <label className="label">推广人</label>
            <input className="input" value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} />
          </div>
          <div>
            <label className="label">备注</label>
            <input className="input" value={form.remark} onChange={(e) => setForm({ ...form, remark: e.target.value })} placeholder="备注说明" />
          </div>
          <div>
            <label className="label">创建时间</label>
            <input type="datetime-local" className="input" value={form.createdAt} onChange={(e) => setForm({ ...form, createdAt: e.target.value })} />
            <p className="mt-1 text-xs text-slate-400">留空则使用当前时间</p>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!editing}
        title="修改推广链接"
        onClose={() => setEditing(null)}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setEditing(null)}>取消</button>
            <button className="btn-primary" onClick={submitEdit}>保存修改</button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="label">链接名称</label>
            <input className="input" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
          </div>
          <div>
            <label className="label">推广链接</label>
            <input className="input" value={editForm.code} onChange={(e) => setEditForm({ ...editForm, code: e.target.value })} />
          </div>
          <div>
            <label className="label">推广人</label>
            <input className="input" value={editForm.ownerName} onChange={(e) => setEditForm({ ...editForm, ownerName: e.target.value })} />
          </div>
          <div>
            <label className="label">创建时间</label>
            <input className="input" value={editForm.createdAt} onChange={(e) => setEditForm({ ...editForm, createdAt: e.target.value })} />
          </div>
        </div>
      </Modal>
    </>
  );
}
