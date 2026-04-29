import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    'bg-ink-900 text-white hover:bg-ink-800 active:bg-ink-900 shadow-sm hover:shadow focus-visible:ring-accent-500',
  secondary:
    'bg-white text-ink-800 ring-1 ring-inset ring-ink-200 hover:bg-ink-50 active:bg-ink-100 focus-visible:ring-accent-500',
  ghost:
    'bg-transparent text-ink-700 hover:bg-ink-100 active:bg-ink-200 focus-visible:ring-accent-500',
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
