import { useState } from 'react';

interface Props {
  value: number;
  onChange: (value: number) => void;
  size?: 'md' | 'lg';
  disabled?: boolean;
}

const SIZE = {
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
} as const;

// 0.5 adımlı (0.5–5) yıldızlı puan girdisi
export function RatingStarsInput({ value, onChange, size = 'md', disabled = false }: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, star: number) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const half = e.clientX - rect.left < rect.width / 2;
    onChange(star - (half ? 0.5 : 0));
  };

  const handleHover = (e: React.MouseEvent<HTMLButtonElement>, star: number) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const half = e.clientX - rect.left < rect.width / 2;
    setHover(star - (half ? 0.5 : 0));
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex" onMouseLeave={() => setHover(null)}>
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = Math.max(0, Math.min(1, display - (star - 1)));
          return (
            <button
              key={star}
              type="button"
              disabled={disabled}
              onClick={(e) => handleClick(e, star)}
              onMouseMove={(e) => handleHover(e, star)}
              className={`relative inline-block ${SIZE[size]} ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
              aria-label={`${star} yıldız`}
            >
              <Star className={`${SIZE[size]} text-surface-ring`} />
              <span
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ width: `${fill * 100}%` }}
              >
                <Star className={`${SIZE[size]} text-rating-high`} />
              </span>
            </button>
          );
        })}
      </div>
      <span className="text-sm font-semibold text-ink-muted">
        {display > 0 ? display.toFixed(1) : '—'}
      </span>
    </div>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.5l2.95 6.34 6.93.73-5.21 4.7 1.5 6.84L12 17.77 5.83 21.1l1.5-6.84L2.12 9.57l6.93-.73L12 2.5z" />
    </svg>
  );
}
