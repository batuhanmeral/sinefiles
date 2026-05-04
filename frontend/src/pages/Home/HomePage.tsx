import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ContentCard } from '@/components/content/ContentCard';
import { PosterSkeleton } from '@/components/content/PosterSkeleton';
import { ReviewCard } from '@/components/review/ReviewCard';
import { contentApi, langFromI18n } from '@/api/content.api';
import { backdrop, poster } from '@/lib/tmdb';
import { RatingStars } from '@/components/content/RatingStars';
import { recentReviews } from './mockData';
import type { ContentItem } from '@/types/content';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const language = langFromI18n(i18n.resolvedLanguage);

  const trending = useQuery({
    queryKey: ['trending', 'all', 'week', language],
    queryFn: () => contentApi.trending('all', 'week', language),
    staleTime: 60 * 60 * 1000,
  });

  const popularMovies = useQuery({
    queryKey: ['popular', 'movie', language],
    queryFn: () => contentApi.popular('movie', language, 1),
    staleTime: 60 * 60 * 1000,
  });

  const upcoming = useQuery({
    queryKey: ['upcoming', language],
    queryFn: () => contentApi.upcoming(language, 1),
    staleTime: 60 * 60 * 1000,
  });

  const [featuredIndex, setFeaturedIndex] = useState(0);

  const featuredItems = trending.data?.results.slice(0, 5) ?? [];
  const featured = featuredItems[featuredIndex];
  const popularItems = popularMovies.data?.results.slice(0, 6) ?? [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingItems = (upcoming.data?.results ?? [])
    .filter((m) => m.releaseDate && new Date(m.releaseDate) > today)
    .slice(0, 4);

  return (
    <div className="space-y-12">
      {featuredItems.length > 0 && featured ? (
        <FeaturedHero
          item={featured}
          onNext={() => setFeaturedIndex((i) => (i + 1) % featuredItems.length)}
          onPrev={() => setFeaturedIndex((i) => (i === 0 ? featuredItems.length - 1 : i - 1))}
        />
      ) : (
        <HeroSkeleton />
      )}

      <section>
        <div className="section-title">
          <h2>{t('home.sections.popular')}</h2>
          <Link to="/discover">{t('home.sections.seeAll')} →</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {popularMovies.isLoading && <PosterSkeleton count={6} />}
          {popularItems.map((m) => (
            <ContentCard key={`${m.type}-${m.id}`} item={m} />
          ))}
        </div>
      </section>

      <section>
        <div className="section-title">
          <h2>{t('home.sections.recentReviews')}</h2>
          <Link to="/feed">{t('home.sections.seeAll')} →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recentReviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </section>

      <section>
        <div className="section-title">
          <h2>{t('home.sections.upcoming')}</h2>
          <Link to="/discover">{t('home.sections.seeAll')} →</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {upcoming.isLoading && <PosterSkeleton count={4} />}
          {upcomingItems.map((m) => (
            <ContentCard key={`${m.type}-${m.id}`} item={m} />
          ))}
        </div>
      </section>
    </div>
  );
}

function FeaturedHero({
  item,
  onNext,
  onPrev,
}: {
  item: ContentItem;
  onNext: () => void;
  onPrev: () => void;
}) {
  const { t } = useTranslation();
  const backdropUrl = backdrop(item.backdropPath, 'w1280');
  const posterUrl = poster(item.posterPath, 'w500');
  const year = item.releaseDate ? new Date(item.releaseDate).getFullYear() : null;
  const fiveStar = item.voteAverage ? +(item.voteAverage / 2).toFixed(1) : 0;

  return (
    <section
      className="relative overflow-hidden rounded-2xl ring-1 ring-white/5"
      aria-labelledby="hero-title"
    >
      {backdropUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backdropUrl})` }}
          aria-hidden="true"
        />
      )}
      <div
        className="absolute inset-0 bg-gradient-to-r from-surface via-surface/85 to-surface/30"
        aria-hidden="true"
      />
      <div className="absolute inset-0 backdrop-blur-2xl" aria-hidden="true" />

      <button
        onClick={onPrev}
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-surface/50 text-white backdrop-blur transition-colors hover:bg-surface/80 sm:left-4"
        aria-label="Önceki"
      >
        ←
      </button>
      <button
        onClick={onNext}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-surface/50 text-white backdrop-blur transition-colors hover:bg-surface/80 sm:right-4"
        aria-label="Sonraki"
      >
        →
      </button>

      <div className="relative grid gap-8 px-14 py-6 sm:px-20 sm:py-10 md:grid-cols-[220px,1fr] md:items-center">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={item.title}
            className="aspect-[2/3] w-full max-w-[220px] rounded-xl shadow-card ring-1 ring-white/10"
          />
        ) : (
          <div className="aspect-[2/3] w-full max-w-[220px] rounded-xl bg-surface-muted" />
        )}

        <div className="text-balance">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {t('home.hero.eyebrow')}
          </p>
          <h1
            id="hero-title"
            className="font-display text-4xl font-extrabold leading-tight text-ink sm:text-5xl"
          >
            {item.title}
          </h1>
          {item.overview && (
            <p className="mt-2 max-w-prose text-sm text-ink-muted line-clamp-3 sm:text-base">
              {item.overview}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
            {year && (
              <span className="rounded-full bg-surface-raised px-2.5 py-0.5 text-xs font-semibold text-ink">
                {year}
              </span>
            )}
            <RatingStars value={fiveStar} showValue />
            <span>
              {item.voteCount.toLocaleString()} {t('home.hero.reviews')}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to={`/${item.type}/${item.id}`} className="btn-primary">
              {t('home.hero.review')}
            </Link>
            <Link to={`/${item.type}/${item.id}`} className="btn-outline">
              {t('home.hero.watchlist')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroSkeleton() {
  return (
    <div className="grid animate-pulse gap-8 rounded-2xl bg-surface-raised p-6 ring-1 ring-white/5 sm:p-10 md:grid-cols-[220px,1fr]">
      <div className="aspect-[2/3] w-full max-w-[220px] rounded-xl bg-surface-muted" />
      <div className="space-y-3">
        <div className="h-10 w-2/3 rounded bg-surface-muted" />
        <div className="h-4 w-full rounded bg-surface-muted" />
        <div className="h-4 w-5/6 rounded bg-surface-muted" />
      </div>
    </div>
  );
}
