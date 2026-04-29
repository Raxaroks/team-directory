import type { HTMLAttributes, ReactNode } from 'react';

type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'muted';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  children: ReactNode;
}

const TONE_CLASSES: Record<Tone, string> = {
  neutral: 'bg-ink-100 text-ink-700 ring-ink-200',
  accent: 'bg-accent-50 text-accent-700 ring-accent-100',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  warning: 'bg-amber-50 text-amber-800 ring-amber-200',
  muted: 'bg-ink-100/60 text-ink-500 ring-ink-200/60',
};

export function Badge({ tone = 'neutral', className = '', children, ...rest }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${TONE_CLASSES[tone]} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}
