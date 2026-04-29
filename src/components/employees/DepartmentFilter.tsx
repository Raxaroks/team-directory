import { DEPARTMENTS, type Department } from '../../types/employee';

export type DepartmentFilterValue = Department | 'All';

interface DepartmentFilterProps {
  value: DepartmentFilterValue;
  onChange: (value: DepartmentFilterValue) => void;
}

const OPTIONS: DepartmentFilterValue[] = ['All', ...DEPARTMENTS];

export function DepartmentFilter({ value, onChange }: DepartmentFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter by department"
      className="flex flex-wrap gap-1.5"
    >
      {OPTIONS.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? 'bg-ink-900 text-white shadow-sm'
                : 'bg-surface text-ink-600 ring-1 ring-inset ring-ink-200 hover:bg-ink-100 hover:text-ink-900'
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
