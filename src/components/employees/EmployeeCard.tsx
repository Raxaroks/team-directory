import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { StatusBadge } from './StatusBadge';
import type { Employee } from '../../types/employee';

interface EmployeeCardProps {
  employee: Employee;
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  return (
    <Link
      to={`/employees/${employee.id}`}
      className="group flex flex-col gap-4 rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-inset ring-ink-200/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-ink-300 focus-visible:-translate-y-0.5 focus-visible:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
    >
      <div className="flex items-start justify-between gap-3">
        <Avatar firstName={employee.firstName} lastName={employee.lastName} size="lg" />
        <StatusBadge status={employee.status} />
      </div>

      <div className="min-w-0">
        <h3 className="truncate font-display text-base font-semibold text-ink-900 group-hover:text-accent-700">
          {employee.firstName} {employee.lastName}
        </h3>
        <p className="truncate text-sm text-ink-600">{employee.role}</p>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-ink-500">
        <Badge tone="muted">{employee.department}</Badge>
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{employee.location}</span>
        </span>
      </div>
    </Link>
  );
}
