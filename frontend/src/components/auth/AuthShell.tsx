import type { PropsWithChildren, ReactNode } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  footer?: ReactNode;
}

export function AuthShell({ title, subtitle, footer, children }: PropsWithChildren<Props>) {
  return (
    <div className="relative mx-auto flex min-h-[calc(100vh-200px)] max-w-md flex-col justify-center">
      <div className="absolute inset-x-0 -top-10 h-72 bg-gradient-to-br from-accent/15 via-accent-cyan/10 to-transparent blur-3xl" />
      <div className="card relative animate-lift-in p-8 ring-white/10">
        <div className="mb-8"></div>
        <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
        <div className="mt-6">{children}</div>
        {footer && <div className="mt-6 text-center text-sm text-ink-muted">{footer}</div>}
      </div>
    </div>
  );
}
