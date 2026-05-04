import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function SearchBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [value, setValue] = useState(params.get('q') ?? '');

  useEffect(() => {
    setValue(params.get('q') ?? '');
  }, [params]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    navigate(`/discover?q=${encodeURIComponent(q)}`);
  };

  return (
    <form role="search" onSubmit={onSubmit} className="relative flex-1 max-w-md">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
        />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={t('nav.searchPlaceholder')}
        aria-label={t('nav.searchPlaceholder')}
        className="glass w-full rounded-full border-0 py-2 pl-10 pr-12 text-sm text-ink
                   placeholder:text-ink-muted focus:ring-2 focus:ring-accent/60"
      />
      <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-surface-ring/50 bg-surface-muted px-1.5 py-0.5 text-[10px] font-medium text-ink-muted sm:block">
        ⏎
      </kbd>
    </form>
  );
}
