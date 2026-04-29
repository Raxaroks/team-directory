import type { InputHTMLAttributes } from 'react';
import { useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Input({
  label,
  error,
  hint,
  id,
  className = '',
  required,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-ink-700">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={`h-10 rounded-xl border-0 bg-white px-3 text-sm text-ink-800 ring-1 ring-inset transition-shadow placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-500 ${
          error ? 'ring-rose-300 focus:ring-rose-500' : 'ring-ink-200'
        } ${className}`}
        {...rest}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-rose-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export function Textarea({
  label,
  error,
  hint,
  id,
  className = '',
  required,
  ...rest
}: TextareaProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-ink-700">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      <textarea
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        rows={3}
        className={`min-h-[88px] rounded-xl border-0 bg-white px-3 py-2 text-sm text-ink-800 ring-1 ring-inset transition-shadow placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-accent-500 ${
          error ? 'ring-rose-300 focus:ring-rose-500' : 'ring-ink-200'
        } ${className}`}
        {...rest}
      />
      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-rose-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="text-xs text-ink-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
