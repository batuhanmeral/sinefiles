import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { reviewsApi } from '@/api/reviews.api';
import { useAuthStore } from '@/features/auth/authStore';
import type { ReviewSort } from '@/types/review';
import { ReviewForm } from './ReviewForm';
import { ReviewItem } from './ReviewItem';

interface Props {
  contentId: string;
}

export function ReviewsSection({ contentId }: Props) {
  const me = useAuthStore((s) => s.user);
  const [sort, setSort] = useState<ReviewSort>('newest');

  const { data: list, isLoading } = useQuery({
    queryKey: ['reviews', contentId, sort],
    queryFn: () => reviewsApi.listForContent(contentId, sort, 1, 20),
  });

  const { data: mine } = useQuery({
    queryKey: ['reviews', contentId, 'me'],
    queryFn: () => reviewsApi.myForContent(contentId),
    enabled: Boolean(me),
  });

  return (
    <section className="space-y-5">
      <div className="section-title flex items-center justify-between">
        <h2>İncelemeler</h2>
        <div className="flex items-center gap-2 text-xs">
          <label className="text-ink-muted">Sırala:</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as ReviewSort)}
            className="rounded-lg border border-white/10 bg-surface-raised px-2 py-1 text-ink focus:border-accent focus:outline-none"
          >
            <option value="newest">Yeni</option>
            <option value="popular">Popüler</option>
          </select>
        </div>
      </div>

      {me ? (
        <ReviewForm contentId={contentId} existing={mine ?? null} />
      ) : (
        <div className="card text-center text-sm text-ink-muted">
          İnceleme yazmak için{' '}
          <Link to="/login" className="text-accent hover:underline">
            giriş yap
          </Link>
          .
        </div>
      )}

      {isLoading ? (
        <div className="card text-center text-sm text-ink-muted">Yükleniyor…</div>
      ) : !list || list.items.length === 0 ? (
        <div className="card text-center text-sm text-ink-muted">
          Henüz inceleme yok. İlk yazan sen ol!
        </div>
      ) : (
        <div className="space-y-3">
          {list.items.map((r) => (
            <ReviewItem key={r.id} review={r} contentId={contentId} />
          ))}
        </div>
      )}
    </section>
  );
}
