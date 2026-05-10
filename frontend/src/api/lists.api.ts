import { apiClient } from './client';

export interface PopularList {
  id: string;
  title: string;
  description: string | null;
  type: 'WATCHED' | 'WATCHLIST' | 'FAVORITES' | 'CUSTOM';
  coverImage: string | null;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  likeCount: number;
  itemCount: number;
  previewPosters: string[];
}

export const listsApi = {
  popular: async (limit = 10): Promise<PopularList[]> => {
    const { data } = await apiClient.get<PopularList[]>('/lists/popular', {
      params: { limit },
    });
    return data;
  },
};
