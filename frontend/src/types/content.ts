export type TmdbType = 'movie' | 'tv';
export type TmdbScope = TmdbType | 'multi';
export type Lang = 'tr-TR' | 'en-US';

export interface ContentItem {
  id: number;
  type: TmdbType;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string | null;
  voteAverage: number;
  voteCount: number;
  popularity: number;
  genreIds: number[];
}

export interface ContentPage {
  page: number;
  totalPages: number;
  totalResults: number;
  results: ContentItem[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

export interface VideoMeta {
  key: string;
  site: string;
  type: string;
  name: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ContentDetail extends ContentItem {
  runtime: number | null;
  tagline: string | null;
  genres: Genre[];
  cast: CastMember[];
  videos: VideoMeta[];
  contentId: string;
  communityRating: number | null;
  communityReviewCount: number;
  lastAirDate?: string | null;
  status?: string;
  inProduction?: boolean;
}
