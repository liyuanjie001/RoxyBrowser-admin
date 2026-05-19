import { create } from 'zustand';
import { pinyinInitials } from '@/utils/pinyin';

export interface Promoter {
  id: string;
  name: string;
  bdCode: string;
  /** 推广人唯一邀请码，6 位小写字母+数字，同一推广人下所有推广链接共用 */
  inviteCode: string;
}

export type UtmCategory = 'source' | 'medium' | 'campaign' | 'content' | 'term';

export interface UtmOption {
  key: string;
  label: string;
}

export type UtmDict = Record<UtmCategory, UtmOption[]>;

interface State {
  promoters: Promoter[];
  utm: UtmDict;
  /** 仅传姓名；推广码由 bd_<拼音首字母><两位序号> 自动生成 */
  addPromoter: (p: { name: string }) => void;
  /** 仅允许改姓名，bdCode 终生不变 */
  updatePromoter: (id: string, patch: { name: string }) => void;
  removePromoter: (id: string) => void;
  addUtm: (cat: UtmCategory, opt: UtmOption) => void;
  updateUtm: (cat: UtmCategory, key: string, patch: Partial<UtmOption>) => void;
  removeUtm: (cat: UtmCategory, key: string) => void;
}

let pidCounter = 100;

function genBdCode(name: string, existing: Promoter[]): string {
  const initials = pinyinInitials(name) || 'x';
  for (let i = 1; i < 100; i++) {
    const candidate = `bd_${initials}${String(i).padStart(2, '0')}`;
    if (!existing.some((p) => p.bdCode === candidate)) return candidate;
  }
  return `bd_${initials}${Date.now().toString(36)}`;
}

const INVITE_CHARS = 'abcdefghijkmnpqrstuvwxyz23456789';
function genInviteCode(existing: Promoter[]): string {
  for (let attempt = 0; attempt < 50; attempt++) {
    let s = '';
    for (let i = 0; i < 6; i++) s += INVITE_CHARS[Math.floor(Math.random() * INVITE_CHARS.length)];
    if (!existing.some((p) => p.inviteCode === s)) return s;
  }
  return Date.now().toString(36).slice(-6);
}

const initialPromoters: Promoter[] = (() => {
  const list: Promoter[] = [];
  // 用确定性邀请码对齐已有 mock 链接里的 inviteId
  const seeds: { name: string; inviteCode: string }[] = [
    { name: '李思雨', inviteCode: 'k7mp2x' },
    { name: '赵小峰', inviteCode: 'b8tk4d' },
    { name: '陈国栋', inviteCode: 'd9hy5n' },
  ];
  for (const { name, inviteCode } of seeds) {
    pidCounter++;
    list.push({ id: `pm-${pidCounter - 100}`, name, bdCode: genBdCode(name, list), inviteCode });
  }
  return list;
})();

const initialUtm: UtmDict = {
  source: [
    { key: 'normal', label: 'normal（默认 / 普通链接）' },
    { key: 'tiktok', label: 'tiktok（TikTok）' },
    { key: 'telegram', label: 'telegram（Telegram）' },
    { key: 'wechat', label: 'wechat（微信群 / 私域）' },
    { key: 'agent', label: 'agent（代理）' },
    { key: 'kol', label: 'kol（达人合作）' },
    { key: 'official_site', label: 'official_site（官网）' },
    { key: 'xiaohongshu', label: 'xiaohongshu（小红书）' },
  ],
  medium: [
    { key: 'none', label: 'none（默认 / 不指定）' },
    { key: 'video', label: 'video（短视频）' },
    { key: 'post', label: 'post（图文帖子）' },
    { key: 'group', label: 'group（社群群发）' },
    { key: 'private_msg', label: 'private_msg（私聊转发）' },
    { key: 'banner', label: 'banner（广告横幅）' },
    { key: 'email', label: 'email（邮件推送）' },
  ],
  campaign: [
    { key: 'none', label: 'none（默认 / 不指定）' },
    { key: '2026_q2_invite', label: '2026_q2_invite（Q2 邀请活动）' },
    { key: '2026_may_kol', label: '2026_may_kol（5 月 KOL 合作）' },
  ],
  content: [
    { key: 'none', label: 'none（默认 / 不指定）' },
    { key: 'banner_a', label: 'banner_a（横幅 A）' },
    { key: 'banner_b', label: 'banner_b（横幅 B）' },
    { key: 'video_15s', label: 'video_15s（15 秒短视频）' },
  ],
  term: [
    { key: 'none', label: 'none（默认 / 不指定）' },
    { key: 'browser', label: 'browser（关键词：浏览器）' },
    { key: 'anti_detect', label: 'anti_detect（关键词：指纹浏览器）' },
  ],
};

export const useMarketingStore = create<State>()((set) => ({
  promoters: initialPromoters,
  utm: initialUtm,
  addPromoter: ({ name }) =>
    set((s) => {
      const trimmed = name.trim();
      if (!trimmed) return s;
      pidCounter++;
      const bdCode = genBdCode(trimmed, s.promoters);
      const inviteCode = genInviteCode(s.promoters);
      return { promoters: [...s.promoters, { id: `pm-${pidCounter}`, name: trimmed, bdCode, inviteCode }] };
    }),
  updatePromoter: (id, { name }) =>
    set((s) => ({ promoters: s.promoters.map((x) => (x.id === id ? { ...x, name: name.trim() || x.name } : x)) })),
  removePromoter: (id) => set((s) => ({ promoters: s.promoters.filter((x) => x.id !== id) })),
  addUtm: (cat, opt) =>
    set((s) => {
      if (s.utm[cat].some((x) => x.key === opt.key)) return s;
      return { utm: { ...s.utm, [cat]: [...s.utm[cat], opt] } };
    }),
  updateUtm: (cat, key, patch) =>
    set((s) => ({
      utm: { ...s.utm, [cat]: s.utm[cat].map((x) => (x.key === key ? { ...x, ...patch } : x)) },
    })),
  removeUtm: (cat, key) =>
    set((s) => ({ utm: { ...s.utm, [cat]: s.utm[cat].filter((x) => x.key !== key) } })),
}));
