import { useEffect, type ReactNode } from 'react';
import { Button } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Block Escape and backdrop dismiss while a mutation is in flight — matches
  // Radix/Headless UI behavior and avoids the half-deleted-state confusion.
  useEffect(() => {
    if (!open || isPending) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, isPending, onCancel]);

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isPending) return;
    if (event.target === event.currentTarget) onCancel();
  };

  if (!open) return null;

  return (
    <div
      role="presentation"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 px-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-lg ring-1 ring-inset ring-ink-200/70"
      >
        <h2
          id="confirm-dialog-title"
          className="font-display text-lg font-semibold text-ink-900"
        >
          {title}
        </h2>
        <div className="mt-2 text-sm text-ink-700">{description}</div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button
            autoFocus
            variant="secondary"
            size="md"
            onClick={onCancel}
            disabled={isPending}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? 'Working…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
