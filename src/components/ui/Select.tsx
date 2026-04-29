import type { SelectHTMLAttributes } from 'react';
import { useId } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: ReadonlyArray<{ value: string; label: string }>;
}

export function Select({
  label,
  error,
  options,
  id,
  className = '',
  required,
  ...rest
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="text-sm font-medium text-ink-700">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={!!error}
          className={`h-10 w-full appearance-none rounded-xl border-0 bg-white px-3 pr-9 text-sm text-ink-800 ring-1 ring-inset transition-shadow focus:outline-none focus:ring-2 focus:ring-accent-500 ${
            error ? 'ring-rose-300 focus:ring-rose-500' : 'ring-ink-200'
          } ${className}`}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
        />
      </div>
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  );
}
