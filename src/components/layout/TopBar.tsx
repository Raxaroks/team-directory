import type { ReactNode } from 'react';

interface TopBarProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}

export function TopBar({ title, subtitle, actions }: TopBarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-ink-200/70 bg-surface/70 px-6 backdrop-blur">
      <div className="min-w-0">
        <h1 className="truncate font-display text-xl font-semibold text-ink-900">{title}</h1>
        {subtitle && <p className="truncate text-sm text-ink-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
