import { create } from 'zustand';
import { pinyinInitials } from '@/utils/pinyin';

export interface Promoter {
  id: string;
  name: string;
  bdCode: string;
  /** 推广人(BD)唯一邀请码，6 位小写字母+数字，同一推广人(BD)下所有推广链接共用 */
  inviteCode: string;
  operatorName: string;
}

export type UtmCategory = 'source' | 'medium' | 'campaign' | 'content' | 'term';

export interface UtmOption {
  key: string;
  label: string;
  operatorName: string;
}

export type UtmDict = Record<UtmCategory, UtmOption[]>;

interface State {
  promoters: Promoter[];
  utm: UtmDict;
  /** 仅传姓名 + 操作人；推广码由 bd_<拼音首字母><两位序号> 自动生成 */
  addPromoter: (p: { name: string; operatorName: string }) => void;
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
  const seeds: { name: string; inviteCode: string; operatorName: string }[] = [
    { name: '李思雨', inviteCode: 'k7mp2x', operatorName: '陈国栋' },
    { name: '赵小峰', inviteCode: 'b8tk4d', operatorName: '陈国栋' },
    { name: '陈国栋', inviteCode: 'd9hy5n', operatorName: '陈国栋' },
  ];
  for (const { name, inviteCode, operatorName } of seeds) {
    pidCounter++;
    list.push({ id: `pm-${pidCounter - 100}`, name, bdCode: genBdCode(name, list), inviteCode, operatorName });
  }
  return list;
})();

const initialUtm: UtmDict = {
  source: [
    { key: 'normal', label: 'normal（默认 / 普通链接）', operatorName: '系统' },
    { key: 'tiktok', label: 'tiktok（TikTok）', operatorName: '陈国栋' },
    { key: 'telegram', label: 'telegram（Telegram）', operatorName: '陈国栋' },
    { key: 'wechat', label: 'wechat（微信群 / 私域）', operatorName: '陈国栋' },
    { key: 'agent', label: 'agent（代理）', operatorName: '李思雨' },
    { key: 'kol', label: 'kol（达人合作）', operatorName: '李思雨' },
    { key: 'official_site', label: 'official_site（官网）', operatorName: '陈国栋' },
    { key: 'xiaohongshu', label: 'xiaohongshu（小红书）', operatorName: '李思雨' },
  ],
  medium: [
    { key: 'none', label: 'none（默认 / 不指定）', operatorName: '系统' },
    { key: 'video', label: 'video（短视频）', operatorName: '李思雨' },
    { key: 'post', label: 'post（图文帖子）', operatorName: '李思雨' },
    { key: 'group', label: 'group（社群群发）', operatorName: '赵小峰' },
    { key: 'private_msg', label: 'private_msg（私聊转发）', operatorName: '赵小峰' },
    { key: 'banner', label: 'banner（广告横幅）', operatorName: '陈国栋' },
    { key: 'email', label: 'email（邮件推送）', operatorName: '陈国栋' },
  ],
  campaign: [
    { key: 'none', label: 'none（默认 / 不指定）', operatorName: '系统' },
    { key: '2026_q2_invite', label: '2026_q2_invite（Q2 邀请活动）', operatorName: '陈国栋' },
    { key: '2026_may_kol', label: '2026_may_kol（5 月 KOL 合作）', operatorName: '李思雨' },
  ],
  content: [
    { key: 'none', label: 'none（默认 / 不指定）', operatorName: '系统' },
    { key: 'banner_a', label: 'banner_a（横幅 A）', operatorName: '陈国栋' },
    { key: 'banner_b', label: 'banner_b（横幅 B）', operatorName: '陈国栋' },
    { key: 'video_15s', label: 'video_15s（15 秒短视频）', operatorName: '李思雨' },
  ],
  term: [
    { key: 'none', label: 'none（默认 / 不指定）', operatorName: '系统' },
    { key: 'browser', label: 'browser（关键词：浏览器）', operatorName: '陈国栋' },
    { key: 'anti_detect', label: 'anti_detect（关键词：指纹浏览器）', operatorName: '陈国栋' },
  ],
};

export const useMarketingStore = create<State>()((set) => ({
  promoters: initialPromoters,
  utm: initialUtm,
  addPromoter: ({ name, operatorName }) =>
    set((s) => {
      const trimmed = name.trim();
      if (!trimmed) return s;
      pidCounter++;
      const bdCode = genBdCode(trimmed, s.promoters);
      const inviteCode = genInviteCode(s.promoters);
      return { promoters: [...s.promoters, { id: `pm-${pidCounter}`, name: trimmed, bdCode, inviteCode, operatorName }] };
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
