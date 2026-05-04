interface Props {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

function colorFor(value: number): string {
  if (value <= 2) return 'text-rating-low';
  if (value < 4) return 'text-rating-mid';
  return 'text-rating-high';
}

const SIZE: Record<NonNullable<Props['size']>, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export function RatingStars({ value, max = 5, size = 'md', showValue = false }: Props) {
  const color = colorFor(value);
  const dim = size;

  return (
    <div className="flex items-center gap-1.5" aria-label={`${value}/${max}`}>
      <div className={`flex ${color}`}>
        {Array.from({ length: max }).map((_, i) => {
          const fillRatio = Math.max(0, Math.min(1, value - i));
          return (
            <span key={i} className={`relative inline-block ${SIZE[dim]}`}>
              <Star className={`${SIZE[dim]} text-surface-ring`} />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillRatio * 100}%` }}
              >
                <Star className={`${SIZE[dim]} ${color}`} />
              </span>
            </span>
          );
        })}
      </div>
      {showValue && <span className={`text-xs font-semibold ${color}`}>{value.toFixed(1)}</span>}
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
