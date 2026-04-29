import { useMemo } from 'react';

// TODO: support image URL prop
interface AvatarProps {
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps['size']>, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-24 w-24 text-2xl',
};

const PALETTE = [
  'bg-accent-100 text-accent-700',
  'bg-amber-100 text-amber-800',
  'bg-emerald-100 text-emerald-800',
  'bg-rose-100 text-rose-800',
  'bg-sky-100 text-sky-800',
  'bg-violet-100 text-violet-800',
];

function pickPalette(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}

/**
 * Compute initials from a first and last name.
 *
 * USER CONTRIBUTION SLOT — see notes in CLAUDE.md / README under "Known TODOs".
 *
 * Trade-offs to consider:
 *   - One letter (e.g. just first-name initial) — minimal but ambiguous when
 *     two people share a first letter.
 *   - Two letters (first + last initial) — common SaaS convention, reads well
 *     in small avatars but loses meaning for single-name users.
 *   - Strip diacritics? "Sofia Ramírez" → "SR" or "SR̃"? Most apps strip them
 *     for legibility against colored backgrounds.
 *   - Fallback when a name is empty (e.g. only firstName provided)?
 *
 * Replace the placeholder return with your chosen algorithm.
 */
function computeInitials(firstName: string, lastName: string): string {
  // TODO(user): implement initials algorithm — see comment block above.
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function Avatar({ firstName, lastName, size = 'md' }: AvatarProps) {
  const initials = useMemo(
    () => computeInitials(firstName, lastName),
    [firstName, lastName],
  );
  const palette = useMemo(
    () => pickPalette(`${firstName} ${lastName}`),
    [firstName, lastName],
  );

  return (
    <div
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${SIZE_CLASSES[size]} ${palette}`}
      aria-label={`${firstName} ${lastName}`}
    >
      {initials}
    </div>
  );
}
