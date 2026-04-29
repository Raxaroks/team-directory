import type { InputHTMLAttributes, KeyboardEvent } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  ...rest
}: SearchBarProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && value !== '') {
      event.preventDefault();
      onChange('');
    }
  };

  return (
    <div className="relative">
      <Search
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
      />
      <input
        type="text"
        role="searchbox"
        aria-label="Search employees"
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`h-10 w-full rounded-xl border-0 bg-white pl-9 ${
          value ? 'pr-9' : 'pr-3'
        } text-sm text-ink-800 ring-1 ring-inset ring-ink-200 transition-shadow placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-500 ${className}`}
        {...rest}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
