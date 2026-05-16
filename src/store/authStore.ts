import { create } from 'zustand';
import type { User } from '@/auth/permissions';
import { mockUsers } from '@/mock/data';

interface AuthState {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
}

export const useAuthStore = create<AuthState>()((set) => ({
  currentUser: mockUsers[0],
  users: mockUsers,
  setCurrentUser: (user) => set({ currentUser: user }),
}));
