import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, UsersRound } from 'lucide-react';

import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { EmployeeCard } from '../components/employees/EmployeeCard';
import { EmployeeGrid } from '../components/employees/EmployeeGrid';
import {
  DepartmentFilter,
  type DepartmentFilterValue,
} from '../components/employees/DepartmentFilter';
import { useEmployees } from '../hooks/useEmployees';

// TODO: implement employee search
// import { SearchBar } from '../components/employees/SearchBar';

// TODO: implement list view with EmployeeRow component
// import { EmployeeRow } from '../components/employees/EmployeeRow';
// const [view, setView] = useState<'grid' | 'list'>('grid');

export default function EmployeesPage() {
  const { data, isLoading, isError } = useEmployees();
  const [department, setDepartment] = useState<DepartmentFilterValue>('All');

  const filtered = useMemo(() => {
    if (!data) return [];
    if (department === 'All') return data;
    return data.filter((e) => e.department === department);
  }, [data, department]);

  return (
    <>
      <TopBar
        title={
          <span className="inline-flex items-center gap-2.5">
            Team Directory
            {data && (
              <Badge tone="muted">
                {data.length} {data.length === 1 ? 'person' : 'people'}
              </Badge>
            )}
          </span>
        }
        subtitle="Everyone at Acme, in one place."
        actions={
          <Link to="/employees/new">
            <Button variant="primary" size="md">
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          </Link>
        }
      />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mb-6">
          <DepartmentFilter value={department} onChange={setDepartment} />
        </div>

        {isError ? (
          <ErrorState />
        ) : isLoading ? (
          <SkeletonGrid />
        ) : filtered.length === 0 ? (
          <EmptyState department={department} />
        ) : (
          <EmployeeGrid>
            {filtered.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} />
            ))}
          </EmployeeGrid>
        )}
      </div>
    </>
  );
}

function SkeletonGrid() {
  return (
    <EmployeeGrid>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-4 rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-inset ring-ink-200/70"
        >
          <div className="flex items-start justify-between">
            <Skeleton className="h-14 w-14 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
          <div className="mt-2 flex gap-2">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </EmployeeGrid>
  );
}

function EmptyState({ department }: { department: DepartmentFilterValue }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-surface/40 px-6 py-16 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-ink-100 text-ink-400">
        <UsersRound className="h-5 w-5" />
      </div>
      <h3 className="font-display text-lg font-semibold text-ink-800">
        No employees found
      </h3>
      <p className="mt-1 max-w-sm text-sm text-ink-500">
        {department === 'All'
          ? 'There are no employees in the directory yet. Add the first one to get started.'
          : `No employees found in ${department}. Try a different department.`}
      </p>
      {department === 'All' && (
        <Link to="/employees/new" className="mt-4">
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </Link>
      )}
    </div>
  );
}

function ErrorState() {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
      Couldn't load the directory. Try refreshing the page.
    </div>
  );
}
