import { useTranslation } from 'react-i18next';
import type { Genre, TmdbType } from '@/types/content';

export interface DiscoverFilterValues {
  type: TmdbType;
  year?: number;
  genre?: number;
  minRating?: number;
  sortBy:
    | 'popularity.desc'
    | 'vote_average.desc'
    | 'vote_count.desc'
    | 'release_date.desc'
    | 'primary_release_date.desc';
}

interface Props {
  values: DiscoverFilterValues;
  onChange: (next: DiscoverFilterValues) => void;
  genres: Genre[];
}

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 60 }, (_, i) => currentYear - i);

export function FilterPanel({ values, onChange, genres }: Props) {
  const { t } = useTranslation();
  const set = <K extends keyof DiscoverFilterValues>(k: K, v: DiscoverFilterValues[K]) =>
    onChange({ ...values, [k]: v });

  return (
    <aside className="card sticky top-20 space-y-5 self-start">
      <div>
        <h3 className="text-base font-semibold text-ink">{t('discover.filters.title')}</h3>
        <p className="mt-1 text-xs text-ink-muted">{t('discover.filters.subtitle')}</p>
      </div>

      <Field label={t('discover.filters.type')}>
        <div className="grid grid-cols-2 gap-1 rounded-lg bg-surface p-1 ring-1 ring-white/5">
          {(['movie', 'tv'] as const).map((tt) => (
            <button
              key={tt}
              type="button"
              onClick={() => set('type', tt)}
              className={
                'rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ' +
                (values.type === tt ? 'bg-accent text-surface' : 'text-ink-muted hover:text-ink')
              }
            >
              {tt === 'movie' ? t('discover.filters.movies') : t('discover.filters.shows')}
            </button>
          ))}
        </div>
      </Field>

      <Field label={t('discover.filters.sortBy')}>
        <select
          className="input"
          value={values.sortBy}
          onChange={(e) => set('sortBy', e.target.value as DiscoverFilterValues['sortBy'])}
        >
          <option value="popularity.desc">{t('discover.filters.sortPopularity')}</option>
          <option value="vote_average.desc">{t('discover.filters.sortRating')}</option>
          <option value="vote_count.desc">{t('discover.filters.sortMostRated')}</option>
          <option
            value={values.type === 'movie' ? 'primary_release_date.desc' : 'release_date.desc'}
          >
            {t('discover.filters.sortRecent')}
          </option>
        </select>
      </Field>

      <Field label={t('discover.filters.year')}>
        <select
          className="input"
          value={values.year ?? ''}
          onChange={(e) => set('year', e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">{t('discover.filters.any')}</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t('discover.filters.genre')}>
        <select
          className="input"
          value={values.genre ?? ''}
          onChange={(e) => set('genre', e.target.value ? Number(e.target.value) : undefined)}
        >
          <option value="">{t('discover.filters.any')}</option>
          {genres.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label={`${t('discover.filters.minRating')} ${values.minRating ?? '–'}`}>
        <input
          type="range"
          min="0"
          max="9"
          step="1"
          value={values.minRating ?? 0}
          onChange={(e) =>
            set('minRating', Number(e.target.value) === 0 ? undefined : Number(e.target.value))
          }
          className="w-full accent-accent"
        />
      </Field>

      <button
        type="button"
        onClick={() => onChange({ type: values.type, sortBy: 'popularity.desc' })}
        className="btn-ghost w-full"
      >
        {t('discover.filters.reset')}
      </button>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}
