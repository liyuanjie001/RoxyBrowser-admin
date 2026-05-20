import { useMemo, useState } from 'react';
import { usePromotionStore, buildPromotionUrl } from '@/store/promotionStore';
import { useAuthStore } from '@/store/authStore';
import { useMarketingStore } from '@/store/marketingStore';
import type { UtmCategory } from '@/store/marketingStore';
import { Card } from '@/components/Card';
import { InlineRemarkField } from '@/components/InlineRemarkField';
import { Table } from '@/components/Table';
import { Modal } from '@/components/Modal';
import { PromoterManager } from './PromoterManager';
import { UtmDictManager } from './UtmDictManager';

interface LinkForm {
  name: string;
  ownerName: string;
  remark: string;
  inviteCode: string;
  linkedUsername: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  bdCode: string;
}

const emptyForm: LinkForm = {
  name: '',
  ownerName: '',
  remark: '',
  inviteCode: '',
  linkedUsername: '',
  utmSource: 'normal',
  utmMedium: 'none',
  utmCampaign: 'none',
  utmContent: 'none',
  utmTerm: 'none',
  bdCode: '',
};

const UTM_DEFAULT: Record<UtmCategory, string> = {
  source: 'normal',
  medium: 'none',
  campaign: 'none',
  content: 'none',
  term: 'none',
};

function previewUrl(form: LinkForm, inviteId: string): string {
  return buildPromotionUrl({
    inviteId,
    utmSource: form.utmSource,
    utmMedium: form.utmMedium,
    utmCampaign: form.utmCampaign,
    utmContent: form.utmContent,
    utmTerm: form.utmTerm,
    bdCode: form.bdCode,
  });
}

function UtmSelect({
  cat,
  value,
  onChange,
}: {
  cat: UtmCategory;
  value: string;
  onChange: (v: string) => void;
}) {
  const options = useMarketingStore((s) => s.utm[cat]);
  const defaultValue = UTM_DEFAULT[cat];
  const isPreset = options.some((o) => o.key === value);
  const selectValue = isPreset ? value : defaultValue;

  return (
    <select
      className="input font-mono"
      value={selectValue}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o.key} value={o.key}>
          {o.label}
        </option>
      ))}
      {!isPreset && value && value !== defaultValue && (
        <option value={value}>{value}（历史值，已下架）</option>
      )}
    </select>
  );
}

function LinkFormFields({
  form,
  onChange,
  previewLabel,
  previewUrl,
  onCopy,
}: {
  form: LinkForm;
  onChange: (f: LinkForm) => void;
  previewLabel: string;
  previewUrl: string;
  onCopy: (text: string) => void;
}) {
  const promoters = useMarketingStore((s) => s.promoters);
  const set = (patch: Partial<LinkForm>) => onChange({ ...form, ...patch });

  const matchedPromoter = promoters.find((p) => p.name === form.ownerName);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">链接名称</label>
          <input
            className="input"
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="如：春季官网活动"
          />
        </div>
        <div>
          <label className="label">推广人(BD)</label>
          <select
            className="input"
            value={matchedPromoter?.id ?? ''}
            onChange={(e) => {
              const p = promoters.find((x) => x.id === e.target.value);
              if (p) set({ ownerName: p.name, bdCode: p.bdCode, inviteCode: p.inviteCode });
            }}
          >
            {!matchedPromoter && <option value="" disabled>请选择推广人(BD)</option>}
            {promoters.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}（{p.bdCode}）
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">邀请码</label>
        <input
          className="input font-mono"
          value={form.inviteCode}
          onChange={(e) => set({ inviteCode: e.target.value.trim() })}
          placeholder="选择推广人(BD)后自动带出，可手动修改"
        />
        <p className="mt-1 text-xs text-slate-400">
          可自定义邀请码；选择推广人(BD)后默认填充其邀请码，建议保持唯一。
        </p>
      </div>

      <div>
        <label className="label">关联用户</label>
        <input
          className="input"
          value={form.linkedUsername}
          onChange={(e) => set({ linkedUsername: e.target.value })}
          placeholder="关联用户的帐号"
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-3">
        <p className="mb-2 text-xs font-medium text-slate-600">UTM 渠道参数（不填走默认，向下兼容旧版链接）</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">utm_source（渠道来源）</label>
            <UtmSelect cat="source" value={form.utmSource} onChange={(v) => set({ utmSource: v.toLowerCase() })} />
          </div>
          <div>
            <label className="label">utm_medium（推广媒介）</label>
            <UtmSelect cat="medium" value={form.utmMedium} onChange={(v) => set({ utmMedium: v.toLowerCase() })} />
          </div>
          <div>
            <label className="label">utm_campaign（活动批次）</label>
            <UtmSelect cat="campaign" value={form.utmCampaign} onChange={(v) => set({ utmCampaign: v.toLowerCase() })} />
          </div>
          <div>
            <label className="label">utm_content（素材区分）</label>
            <UtmSelect cat="content" value={form.utmContent} onChange={(v) => set({ utmContent: v.toLowerCase() })} />
          </div>
          <div className="col-span-2">
            <label className="label">utm_term（关键词 / 竞价词）</label>
            <UtmSelect cat="term" value={form.utmTerm} onChange={(v) => set({ utmTerm: v.toLowerCase() })} />
          </div>
        </div>
      </div>

      <div>
        <label className="label">{previewLabel}</label>
        <div className="flex items-start gap-2">
          <code className="flex-1 break-all rounded-md border border-slate-200 bg-white px-3 py-2 font-mono text-xs text-slate-700">
            {previewUrl}
          </code>
          <button type="button" className="btn-ghost shrink-0" onClick={() => onCopy(previewUrl)}>
            复制
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          落地页 /invite 与官网首页一致；旧版 ?code=xxx 链接后端自动映射，邀请关系与返利数据完全保留。
        </p>
      </div>

      <div>
        <label className="label">备注</label>
        <input
          className="input"
          value={form.remark}
          onChange={(e) => set({ remark: e.target.value })}
          placeholder="备注说明"
        />
      </div>
    </div>
  );
}

function LinksTab() {
  const { currentUser } = useAuthStore();
  const { links, addLink, updateLink } = usePromotionStore();
  const promoters = useMarketingStore((s) => s.promoters);

  const [createOpen, setCreateOpen] = useState(false);

  const [form, setForm] = useState<LinkForm>(emptyForm);

  const previewInviteId = useMemo(() => 'preview', []);
  const createPreview = useMemo(
    () => previewUrl(form, form.inviteCode.trim() || previewInviteId),
    [form, previewInviteId],
  );

  const openCreate = () => {
    const me = promoters.find((p) => p.name === currentUser.realName);
    setForm({
      ...emptyForm,
      ownerName: currentUser.realName,
      bdCode: me?.bdCode ?? '',
      inviteCode: me?.inviteCode ?? '',
    });
    setCreateOpen(true);
  };

  const submitCreate = () => {
    if (!form.name.trim()) return;
    addLink({
      name: form.name.trim(),
      ownerName: form.ownerName.trim() || currentUser.realName,
      ownerId: currentUser.id,
      operatorName: currentUser.realName,
      linkedUsername: form.linkedUsername.trim() || undefined,
      inviteId: form.inviteCode.trim() || undefined,
      utmSource: form.utmSource,
      utmMedium: form.utmMedium,
      utmCampaign: form.utmCampaign.trim() || 'none',
      utmContent: form.utmContent.trim() || 'none',
      utmTerm: form.utmTerm.trim() || 'none',
      bdCode: form.bdCode.trim() || undefined,
      remark: form.remark.trim() || undefined,
    });
    setCreateOpen(false);
  };

  const saveRemark = (id: string, value: string) => {
    updateLink(id, { remark: value.trim() || undefined });
  };

  const copyText = (text: string) => {
    navigator.clipboard?.writeText(text);
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
            {
              key: 'inviteId',
              title: '邀请码',
              render: (r) => <span className="font-mono text-xs text-slate-700">{r.inviteId}</span>,
            },
            {
              key: 'url',
              title: '推广链接',
              render: (r) => <span className="font-mono text-xs text-slate-500">{r.url}</span>,
            },
            { key: 'ownerName', title: '推广人(BD)' },
            {
              key: 'linkedUsername',
              title: '关联用户的帐号',
              render: (r) => (
                <span className="text-slate-700">{r.linkedUsername || <span className="text-slate-300">-</span>}</span>
              ),
            },
            {
              key: 'operatorName',
              title: '操作人',
              render: (r) => <span className="text-slate-600">{r.operatorName}</span>,
            },
            {
              key: 'remark',
              title: '备注',
              render: (r) => (
                <InlineRemarkField key={r.id} value={r.remark ?? ''} onSave={(v) => saveRemark(r.id, v)} />
              ),
            },
            { key: 'createdAt', title: '创建时间', className: 'text-slate-500' },
          ]}
        />
      </Card>

      <Modal
        open={createOpen}
        title="生成推广链接"
        size="xl"
        onClose={() => setCreateOpen(false)}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setCreateOpen(false)}>取消</button>
            <button className="btn-primary" onClick={submitCreate}>确认生成</button>
          </>
        }
      >
        <LinkFormFields
          form={form}
          onChange={setForm}
          previewLabel="链接预览（可自定义邀请码）"
          previewUrl={createPreview}
          onCopy={copyText}
        />
      </Modal>
    </>
  );
}

type TabKey = 'links' | 'promoters' | 'utm';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'links', label: '推广链接管理' },
  { key: 'promoters', label: '推广人(BD)管理' },
  { key: 'utm', label: 'UTM 参数管理' },
];

export function PromotionLinkManager() {
  const [active, setActive] = useState<TabKey>('links');

  return (
    <div className="space-y-4">
      <div className="inline-flex gap-1 rounded-lg bg-slate-100 p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              active === t.key ? 'bg-white text-brand-700 shadow-soft' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active === 'links' && <LinksTab />}
      {active === 'promoters' && <PromoterManager />}
      {active === 'utm' && <UtmDictManager />}
    </div>
  );
}
