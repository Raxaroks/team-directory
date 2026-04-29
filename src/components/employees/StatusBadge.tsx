import { Badge } from '../ui/Badge';
import type { EmploymentStatus } from '../../types/employee';

const STATUS_LABELS: Record<EmploymentStatus, string> = {
  active: 'Active',
  on_leave: 'On leave',
  contractor: 'Contractor',
};

const STATUS_TONES: Record<EmploymentStatus, 'success' | 'warning' | 'accent'> = {
  active: 'success',
  on_leave: 'warning',
  contractor: 'accent',
};

interface StatusBadgeProps {
  status: EmploymentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <Badge tone={STATUS_TONES[status]}>{STATUS_LABELS[status]}</Badge>;
}
