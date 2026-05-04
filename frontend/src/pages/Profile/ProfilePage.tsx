import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/api/client';

interface PublicProfile {
  id: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  _count: { reviews: number; followers: number; following: number };
}

export default function ProfilePage() {
  const { username = '' } = useParams();
  const { t } = useTranslation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['profile', username],
    queryFn: async () => {
      const { data } = await apiClient.get<PublicProfile>(`/users/${username}`);
      return data;
    },
    enabled: Boolean(username),
  });

  if (isLoading) {
    return (
      <div className="card animate-pulse">
        <div className="h-24 w-24 rounded-full bg-surface-muted" />
        <div className="mt-4 h-6 w-48 rounded bg-surface-muted" />
        <div className="mt-2 h-4 w-32 rounded bg-surface-muted" />
      </div>
    );
  }

  if (isError || !data) {
    return <div className="card text-center text-ink-muted">{t('profile.notFound')}</div>;
  }

  const initial = (data.displayName ?? data.username).charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      <header className="card relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-accent/30 via-accent-cyan/20 to-transparent blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-cyan text-3xl font-bold text-surface ring-4 ring-surface">
            {data.avatarUrl ? (
              <img
                src={data.avatarUrl}
                alt=""
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              initial
            )}
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-ink">
              {data.displayName ?? data.username}
            </h1>
            <p className="text-sm text-ink-muted">@{data.username}</p>
            {data.bio && <p className="mt-2 max-w-prose text-sm text-ink">{data.bio}</p>}
          </div>
          <button
            type="button"
            disabled
            title={t('profile.followComingSoon')}
            className="btn-outline"
          >
            {t('profile.follow')}
          </button>
        </div>
        <div className="relative mt-6 grid grid-cols-3 gap-2 border-t border-white/5 pt-4 text-center">
          <Stat label={t('profile.reviews')} value={data._count.reviews} />
          <Stat label={t('profile.followers')} value={data._count.followers} />
          <Stat label={t('profile.following')} value={data._count.following} />
        </div>
      </header>

      <div className="card text-sm text-ink-muted">{t('profile.empty')}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="font-display text-xl font-bold text-ink">{value}</div>
      <div className="text-xs uppercase tracking-wider text-ink-muted">{label}</div>
    </div>
  );
}
