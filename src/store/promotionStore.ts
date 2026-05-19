import { create } from 'zustand';
import type { PromotionLink, RegisteredUser } from '@/types';
import { mockPromotionLinks, mockRegisteredUsers } from '@/mock/data';
import { useMarketingStore } from './marketingStore';

let idCounter = 100;

const INVITE_BASE = 'https://roxybrowser.cn/invite';

function genInviteId(): string {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
}

export function buildPromotionUrl(input: {
  inviteId: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  bdCode?: string;
}): string {
  const base = `${INVITE_BASE}/${input.inviteId}`;
  const params: string[] = [];
  const src = input.utmSource?.trim() || 'normal';
  const med = input.utmMedium?.trim() || 'none';
  const camp = input.utmCampaign?.trim() || 'none';
  const cont = input.utmContent?.trim() || 'none';
  const term = input.utmTerm?.trim() || 'none';
  if (src !== 'normal') params.push(`utm_source=${encodeURIComponent(src)}`);
  if (med !== 'none') params.push(`utm_medium=${encodeURIComponent(med)}`);
  if (camp !== 'none') params.push(`utm_campaign=${encodeURIComponent(camp)}`);
  if (cont !== 'none') params.push(`utm_content=${encodeURIComponent(cont)}`);
  if (term !== 'none') params.push(`utm_term=${encodeURIComponent(term)}`);
  if (input.bdCode?.trim()) params.push(`bd_code=${encodeURIComponent(input.bdCode.trim())}`);
  return params.length ? `${base}?${params.join('&')}` : base;
}

interface CreatePayload {
  name: string;
  code?: string;
  ownerName: string;
  ownerId: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  bdCode?: string;
  remark?: string;
  createdAt?: string;
}

type UpdatePatch = Partial<
  Pick<
    PromotionLink,
    | 'name'
    | 'code'
    | 'ownerName'
    | 'remark'
    | 'createdAt'
    | 'utmSource'
    | 'utmMedium'
    | 'utmCampaign'
    | 'utmContent'
    | 'utmTerm'
    | 'bdCode'
  >
>;

interface PromotionState {
  links: PromotionLink[];
  registeredUsers: RegisteredUser[];
  addLink: (payload: CreatePayload) => void;
  updateLink: (id: string, patch: UpdatePatch) => void;
}

export const usePromotionStore = create<PromotionState>()((set) => ({
  links: mockPromotionLinks,
  registeredUsers: mockRegisteredUsers,
  addLink: ({ name, code, ownerName, ownerId, utmSource, utmMedium, utmCampaign, utmContent, utmTerm, bdCode, remark, createdAt }) =>
    set((s) => {
      idCounter++;
      const promoter = useMarketingStore.getState().promoters.find((p) => p.name === ownerName);
      const inviteId = promoter?.inviteCode ?? genInviteId();
      const finalCode = code?.trim() || `REF-${idCounter}`;
      const newLink: PromotionLink = {
        id: `pl-${idCounter}`,
        ownerId,
        ownerName,
        ownerUsername: ownerName,
        name,
        code: finalCode,
        inviteId,
        url: buildPromotionUrl({ inviteId, utmSource, utmMedium, utmCampaign, utmContent, utmTerm, bdCode }),
        channel: 'OTHER',
        utmSource: utmSource?.trim() || 'normal',
        utmMedium: utmMedium?.trim() || 'none',
        utmCampaign: utmCampaign?.trim() || 'none',
        utmContent: utmContent?.trim() || undefined,
        utmTerm: utmTerm?.trim() || undefined,
        bdCode: bdCode?.trim() || undefined,
        remark,
        createdAt: createdAt || new Date().toLocaleString('zh-CN', { hour12: false }),
        visits: 0,
        registrations: 0,
        payments: 0,
        revenue: 0,
        identity: '新用户',
        ownedUserCount: 0,
        subscriberCount: null,
        totalRecharge: 0,
        recharge30d: 0,
        withdrawable: 0,
        withdrawn: 0,
        linkType: 'Link C',
        rebateNonAgent: 15,
        rebateAgent: 10,
        userDiscount: 5,
        modified: false,
      };
      return { links: [newLink, ...s.links] };
    }),
  updateLink: (id, patch) =>
    set((s) => ({
      links: s.links.map((l) => {
        if (l.id !== id) return l;
        const merged = { ...l, ...patch };
        const utmChanged =
          patch.utmSource !== undefined ||
          patch.utmMedium !== undefined ||
          patch.utmCampaign !== undefined ||
          patch.utmContent !== undefined ||
          patch.utmTerm !== undefined ||
          patch.bdCode !== undefined;
        if (utmChanged) {
          merged.url = buildPromotionUrl({
            inviteId: merged.inviteId,
            utmSource: merged.utmSource,
            utmMedium: merged.utmMedium,
            utmCampaign: merged.utmCampaign,
            utmContent: merged.utmContent,
            utmTerm: merged.utmTerm,
            bdCode: merged.bdCode,
          });
        }
        return merged;
      }),
    })),
}));
