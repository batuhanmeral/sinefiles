const IMAGE_BASE =
  (import.meta.env.VITE_TMDB_IMAGE_BASE as string | undefined) ?? 'https://image.tmdb.org/t/p';

export type PosterSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';
export type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original';
export type ProfileSize = 'w45' | 'w185' | 'h632' | 'original';

export function poster(path: string | null, size: PosterSize = 'w342'): string | null {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}

export function backdrop(path: string | null, size: BackdropSize = 'w1280'): string | null {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}

export function profile(path: string | null, size: ProfileSize = 'w185'): string | null {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
}

export function youtubeEmbed(key: string): string {
  return `https://www.youtube.com/embed/${key}`;
}

export function youtubeThumb(key: string): string {
  return `https://img.youtube.com/vi/${key}/hqdefault.jpg`;
}
