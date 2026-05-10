import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '@/api/reviews.api';
import { RatingStarsInput } from '@/components/content/RatingStarsInput';
import type { Review } from '@/types/review';

interface Props {
  contentId: string;
  existing: Review | null;
}

export function ReviewForm({ contentId, existing }: Props) {
  const qc = useQueryClient();
  const [rating, setRating] = useState<number>(existing?.rating ?? 0);
  const [body, setBody] = useState<string>(existing?.body ?? '');
  const [spoiler, setSpoiler] = useState<boolean>(existing?.containsSpoiler ?? false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRating(existing?.rating ?? 0);
    setBody(existing?.body ?? '');
    setSpoiler(existing?.containsSpoiler ?? false);
  }, [existing?.id]);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['reviews', contentId] });
    qc.invalidateQueries({ queryKey: ['reviews', contentId, 'me'] });
    qc.invalidateQueries({ queryKey: ['content'] });
  };

  const create = useMutation({
    mutationFn: () =>
      reviewsApi.create({ contentId, rating, body: body || undefined, containsSpoiler: spoiler }),
    onSuccess: () => {
      setError(null);
      invalidate();
    },
    onError: (err: any) => setError(err?.response?.data?.error?.message ?? 'Kaydedilemedi'),
  });

  const update = useMutation({
    mutationFn: () =>
      reviewsApi.update(existing!.id, { rating, body: body || null, containsSpoiler: spoiler }),
    onSuccess: () => {
      setError(null);
      invalidate();
    },
    onError: (err: any) => setError(err?.response?.data?.error?.message ?? 'Güncellenemedi'),
  });

  const remove = useMutation({
    mutationFn: () => reviewsApi.remove(existing!.id),
    onSuccess: () => {
      setRating(0);
      setBody('');
      setSpoiler(false);
      invalidate();
    },
  });

  const isPending = create.isPending || update.isPending || remove.isPending;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 0.5) {
      setError('Lütfen bir puan seçin');
      return;
    }
    if (existing) update.mutate();
    else create.mutate();
  };

  return (
    <form onSubmit={onSubmit} className="card space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-ink">
          {existing ? 'İncelemeni güncelle' : 'İnceleme yaz'}
        </h3>
        <RatingStarsInput value={rating} onChange={setRating} size="md" disabled={isPending} />
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        maxLength={5000}
        placeholder="Bu içerik hakkında ne düşünüyorsun?"
        className="w-full resize-y rounded-lg border border-white/10 bg-surface-raised px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
        disabled={isPending}
      />

      <label className="flex items-center gap-2 text-sm text-ink-muted">
        <input
          type="checkbox"
          checked={spoiler}
          onChange={(e) => setSpoiler(e.target.checked)}
          disabled={isPending}
          className="h-4 w-4 accent-accent"
        />
        Spoiler içeriyor
      </label>

      {error && <p className="text-sm text-rating-low">{error}</p>}

      <div className="flex flex-wrap items-center justify-end gap-2">
        {existing && (
          <button
            type="button"
            onClick={() => {
              if (confirm('İncelemeni silmek istediğine emin misin?')) remove.mutate();
            }}
            className="btn-ghost text-rating-low"
            disabled={isPending}
          >
            Sil
          </button>
        )}
        <button type="submit" className="btn-outline" disabled={isPending}>
          {isPending ? 'Kaydediliyor…' : existing ? 'Güncelle' : 'Yayınla'}
        </button>
      </div>
    </form>
  );
}
