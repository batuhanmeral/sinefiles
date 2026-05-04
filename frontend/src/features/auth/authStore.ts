import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse, AuthUser } from '@/types/auth';
import * as authApi from '@/api/auth.api';
import { usersApi, type UpdateMeInput } from '@/api/users.api';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  initialize: () => Promise<void>;
  login: (identifier: string, password: string) => Promise<void>;
  register: (input: {
    email: string;
    username: string;
    password: string;
    displayName?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (input: UpdateMeInput) => Promise<void>;
  setSession: (data: AuthResponse) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,

      setSession: (data) =>
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        }),

      clear: () => set({ user: null, accessToken: null, refreshToken: null }),

      initialize: async () => {
        const token = get().accessToken;
        if (!token) return;
        try {
          const user = await usersApi.me();
          set({ user });
        } catch {
          get().clear();
        }
      },

      login: async (identifier, password) => {
        set({ isLoading: true });
        try {
          const data = await authApi.login(identifier, password);
          get().setSession(data);
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (input) => {
        set({ isLoading: true });
        try {
          const data = await authApi.register(input);
          get().setSession(data);
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        const token = get().refreshToken;
        if (token) {
          await authApi.logout(token).catch(() => undefined);
        }
        get().clear();
      },

      updateProfile: async (input) => {
        const updated = await usersApi.updateMe(input);
        set({ user: updated });
      },
    }),
    {
      name: 'sf-auth',
      partialize: (s) => ({
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        user: s.user,
      }),
    },
  ),
);
