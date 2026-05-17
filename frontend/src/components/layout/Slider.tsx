import { useEffect, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  ariaLabel?: string;
}

// Yatay kaydırılabilir bir konteyner; sağ/sol oklarla içeriği görünür alanın
// %85'i kadar kaydırır. Ok düğmeleri sınırlara ulaşıldığında pasifleşir.
export function Slider({ children, ariaLabel }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateButtons();
    el.addEventListener('scroll', updateButtons, { passive: true });
    const ro = new ResizeObserver(updateButtons);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateButtons);
      ro.disconnect();
    };
  }, []);

  const scrollBy = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85;
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => scrollBy('left')}
        disabled={!canPrev}
        aria-label="Önceki"
        className="absolute -left-3 top-1/2 z-10 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-surface/80 text-ink ring-1 ring-white/10 backdrop-blur transition-opacity hover:bg-surface disabled:pointer-events-none disabled:opacity-0"
      >
        ←
      </button>
      <button
        type="button"
        onClick={() => scrollBy('right')}
        disabled={!canNext}
        aria-label="Sonraki"
        className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-surface/80 text-ink ring-1 ring-white/10 backdrop-blur transition-opacity hover:bg-surface disabled:pointer-events-none disabled:opacity-0"
      >
        →
      </button>

      <div
        ref={scrollRef}
        aria-label={ariaLabel}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {children}
      </div>
    </div>
  );
}
