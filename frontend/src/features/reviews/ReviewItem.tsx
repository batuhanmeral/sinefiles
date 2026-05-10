import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '@/api/reviews.api';
import { useAuthStore } from '@/features/auth/authStore';
import { RatingStars } from '@/components/content/RatingStars';
import type { Review } from '@/types/review';
import { CommentThread } from './CommentThread';

interface Props {
  review: Review;
  contentId: string;
}

export function ReviewItem({ review, contentId }: Props) {
  const qc = useQueryClient();
  const me = useAuthStore((s) => s.user);
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const like = useMutation({
    mutationFn: () => reviewsApi.toggleLike(review.id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews', contentId] });
    },
  });

  const initial = (review.user.displayName || review.user.username).charAt(0).toUpperCase();
  const date = new Date(review.createdAt).toLocaleDateString();
  const hidden = review.containsSpoiler && !showSpoiler;

  return (
    <article className="card space-y-3">
      <header className="flex items-center gap-3">
        {review.user.avatarUrl ? (
          <img
            src={review.user.avatarUrl}
            alt=""
            className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10"
          />
        ) : (
          <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-accent to-accent-cyan font-semibold text-surface">
            {initial}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">
            {review.user.displayName || review.user.username}
          </p>
          <p className="truncate text-xs text-ink-muted">
            @{review.user.username} · {date}
          </p>
        </div>
        <RatingStars value={review.rating} size="sm" showValue />
      </header>

      {review.body && (
        <div className="text-sm leading-relaxed text-ink/90">
          {hidden ? (
            <button
              type="button"
              onClick={() => setShowSpoiler(true)}
              className="text-rating-mid hover:underline"
            >
              ⚠ Spoiler içeriyor — göstermek için tıkla
            </button>
          ) : (
            <p className="whitespace-pre-wrap break-words">{review.body}</p>
          )}
        </div>
      )}

      <footer className="flex items-center gap-4 text-xs text-ink-muted">
        <button
          type="button"
          disabled={!me || like.isPending}
          onClick={() => like.mutate()}
          className={`flex items-center gap-1 transition-colors ${
            review.likedByMe ? 'text-rating-low' : 'hover:text-ink'
          } disabled:opacity-50`}
          aria-label="Beğen"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 5.65-7 10-7 10z" />
          </svg>
          {review.likeCount}
        </button>
        <button
          type="button"
          onClick={() => setShowComments((s) => !s)}
          className="flex items-center gap-1 hover:text-ink"
        >
          💬 {review.commentCount}
        </button>
        {review.isFlagged && (
          <span className="rounded-full bg-rating-low/20 px-2 py-0.5 text-rating-low">
            işaretlendi
          </span>
        )}
      </footer>

      {showComments && <CommentThread reviewId={review.id} />}
    </article>
  );
}
