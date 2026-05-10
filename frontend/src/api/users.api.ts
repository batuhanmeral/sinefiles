import { apiClient } from './client';
import type { AuthUser, Language } from '@/types/auth';

export interface UpdateMeInput {
  displayName?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  language?: Language;
  email?: string;
  username?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
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

  changePassword: async (input: ChangePasswordInput): Promise<void> => {
    await apiClient.post('/users/me/password', input);
  },

  deleteMe: async (): Promise<void> => {
    await apiClient.delete('/users/me');
  },
};
