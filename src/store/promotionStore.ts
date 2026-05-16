import { create } from 'zustand';
import type { PromotionLink, RegisteredUser } from '@/types';
import { mockPromotionLinks, mockRegisteredUsers } from '@/mock/data';

let idCounter = 100;

interface PromotionState {
  links: PromotionLink[];
  registeredUsers: RegisteredUser[];
  addLink: (payload: { name: string; code?: string; ownerName: string; ownerId: string; remark?: string; createdAt?: string }) => void;
  updateLink: (id: string, patch: Partial<Pick<PromotionLink, 'name' | 'code' | 'ownerName' | 'remark' | 'createdAt'>>) => void;
}

export const usePromotionStore = create<PromotionState>()((set) => ({
  links: mockPromotionLinks,
  registeredUsers: mockRegisteredUsers,
  addLink: ({ name, code, ownerName, ownerId, remark, createdAt }) =>
    set((s) => {
      const autoCode = `REF-${++idCounter}`;
      const finalCode = (code?.trim()) || autoCode;
      const newLink: PromotionLink = {
        id: `pl-${idCounter}`,
        ownerId,
        ownerName,
        name,
        code: finalCode,
        url: `https://roxybrowser.com/?ref=${finalCode}`,
        channel: 'OTHER',
        remark,
        createdAt: createdAt || new Date().toLocaleString('zh-CN', { hour12: false }),
        visits: 0,
        registrations: 0,
        payments: 0,
        revenue: 0,
      };
      return { links: [newLink, ...s.links] };
    }),
  updateLink: (id, patch) =>
    set((s) => ({
      links: s.links.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    })),
}));
