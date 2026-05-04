import { apiClient } from './client';
import type { AuthUser, Language } from '@/types/auth';

export interface UpdateMeInput {
  displayName?: string;
  bio?: string;
  language?: Language;
  avatarUrl?: string;
}

export const usersApi = {
  me: async (): Promise<AuthUser> => {
    const { data } = await apiClient.get<AuthUser>('/users/me');
    return data;
  },

  updateMe: async (input: UpdateMeInput): Promise<AuthUser> => {
    const { data } = await apiClient.patch<AuthUser>('/users/me', input);
    return data;
  },
};
