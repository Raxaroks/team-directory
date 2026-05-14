import { DEPARTMENTS, type Department } from '../../types/employee';

export type DepartmentFilterValue = Department | 'All';

interface DepartmentFilterProps {
  value: DepartmentFilterValue;
  onChange: (value: DepartmentFilterValue) => void;
  counts?: Record<DepartmentFilterValue, number>;
}

const OPTIONS: DepartmentFilterValue[] = ['All', ...DEPARTMENTS];

export function DepartmentFilter({ value, onChange, counts }: DepartmentFilterProps) {
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
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? 'bg-ink-900 text-white shadow-sm'
                : 'bg-surface text-ink-600 ring-1 ring-inset ring-ink-200 hover:bg-ink-100 hover:text-ink-900'
            }`}
          >
            {option}
            {counts != null && (
              <span
                className={`rounded-full px-1.5 py-px text-[10px] font-semibold leading-none ${
                  active ? 'bg-white/20 text-white' : 'bg-ink-200 text-ink-600'
                }`}
              >
                {counts[option]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
