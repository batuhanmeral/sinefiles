interface Props {
  count?: number;
}

export function PosterSkeleton({ count = 1 }: Props) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="aspect-[2/3] animate-pulse rounded-lg bg-gradient-to-br from-surface-raised to-surface-muted ring-1 ring-white/5"
        />
      ))}
    </>
  );
}
