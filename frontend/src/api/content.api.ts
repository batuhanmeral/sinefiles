import { apiClient } from './client';
import type { ContentDetail, ContentPage, Genre, Lang, TmdbScope, TmdbType } from '@/types/content';

function langFromI18n(i18nLang: string | undefined): Lang {
  return i18nLang?.startsWith('en') ? 'en-US' : 'tr-TR';
}

export interface DiscoverFilters {
  type?: TmdbType;
  page?: number;
  language?: Lang;
  year?: number;
  genre?: number;
  minRating?: number;
  sortBy?:
    | 'popularity.desc'
    | 'vote_average.desc'
    | 'vote_count.desc'
    | 'release_date.desc'
    | 'primary_release_date.desc';
}

export const contentApi = {
  search: async (q: string, type: TmdbScope, language: Lang, page = 1) => {
    const { data } = await apiClient.get<ContentPage>('/content/search', {
      params: { q, type, language, page },
    });
    return data;
  },

  trending: async (type: 'movie' | 'tv' | 'all', window: 'day' | 'week', language: Lang) => {
    const { data } = await apiClient.get<ContentPage>('/content/trending', {
      params: { type, window, language },
    });
    return data;
  },

  popular: async (type: TmdbType, language: Lang, page = 1) => {
    const { data } = await apiClient.get<ContentPage>('/content/popular', {
      params: { type, language, page },
    });
    return data;
  },

  upcoming: async (language: Lang, page = 1) => {
    const { data } = await apiClient.get<ContentPage>('/content/upcoming', {
      params: { language, page },
    });
    return data;
  },

  discover: async (filters: DiscoverFilters) => {
    const { data } = await apiClient.get<ContentPage>('/content/discover', {
      params: { type: 'movie', page: 1, language: 'tr-TR', sortBy: 'popularity.desc', ...filters },
    });
    return data;
  },

  detail: async (type: TmdbType, tmdbId: number, language: Lang) => {
    const { data } = await apiClient.get<ContentDetail>(`/content/${type}/${tmdbId}`, {
      params: { language },
    });
    return data;
  },

  genres: async (type: TmdbType, language: Lang) => {
    const { data } = await apiClient.get<Genre[]>('/content/genres', {
      params: { type, language },
    });
    return data;
  },
};

export { langFromI18n };
