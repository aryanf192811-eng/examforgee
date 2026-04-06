import { create } from 'zustand';
import type { User } from '../firebase';

interface AuthStore {
  user: User | null;
  role: 'student' | 'admin' | 'free' | 'pro' | null;
  idToken: string | null;
  isLoading: boolean;
  setUser: (user: User | null, role: AuthStore['role'], token: string | null) => void;
  setToken: (token: string | null) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  role: null,
  idToken: null,
  isLoading: true,
  setUser: (user, role, token) => set({ user, role, idToken: token, isLoading: false }),
  setToken: (token) => set({ idToken: token }),
  clearUser: () => set({ user: null, role: null, idToken: null, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));
