import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Mail, MapPin } from 'lucide-react';

import { TopBar } from '../components/layout/TopBar';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Skeleton } from '../components/ui/Skeleton';
import { StatusBadge } from '../components/employees/StatusBadge';
import { useEmployee } from '../hooks/useEmployees';
import { useDeleteEmployee } from '../hooks/useDeleteEmployee';

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

function formatStartDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : dateFormatter.format(d);
}

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: employee, isLoading, isError } = useEmployee(id);
  const { mutateAsync: deleteEmployee, isPending: isDeleting } = useDeleteEmployee();

  const [isConfirmOpen, setConfirmOpen] = useState(false);

  const handleConfirmDelete = async () => {
    if (!employee) return;
    await deleteEmployee(employee.id);
    navigate('/');
  };

  return (
    <>
      <TopBar
        title="Profile"
        actions={
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Directory
          </Link>
        }
      />

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-3xl">
          {isLoading ? (
            <DetailSkeleton />
          ) : isError || !employee ? (
            <NotFoundCard />
          ) : (
            <article className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-inset ring-ink-200/70">
              <div className="flex items-start gap-6 border-b border-ink-200/70 px-8 py-8">
                <Avatar
                  firstName={employee.firstName}
                  lastName={employee.lastName}
                  size="xl"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-2xl font-semibold text-ink-900">
                      {employee.firstName} {employee.lastName}
                    </h2>
                    <StatusBadge status={employee.status} />
                  </div>
                  <p className="mt-1 text-base text-ink-600">{employee.role}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge tone="accent">{employee.department}</Badge>
                  </div>
                </div>

                <Link to={`/employees/${employee.id}/edit`}>
                  <Button variant="secondary" size="sm">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmOpen(true)}
                >
                  Delete
                </Button>
              </div>

              <dl className="grid grid-cols-1 gap-x-8 gap-y-5 px-8 py-6 sm:grid-cols-2">
                <DetailRow icon={<Mail className="h-4 w-4" />} label="Email">
                  <a
                    href={`mailto:${employee.email}`}
                    className="text-accent-700 hover:underline"
                  >
                    {employee.email}
                  </a>
                </DetailRow>
                <DetailRow icon={<MapPin className="h-4 w-4" />} label="Location">
                  {employee.location}
                </DetailRow>
                <DetailRow icon={<Calendar className="h-4 w-4" />} label="Start date">
                  {formatStartDate(employee.startDate)}
                </DetailRow>
              </dl>

              {employee.bio && (
                <div className="border-t border-ink-200/70 px-8 py-6">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                    About
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">
                    {employee.bio}
                  </p>
                </div>
              )}
            </article>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={isConfirmOpen}
        title="Remove employee"
        description={
          employee ? (
            <>
              Are you sure you want to remove{' '}
              <span className="font-semibold text-ink-900">
                {employee.firstName} {employee.lastName}
              </span>{' '}
              from the directory? This action cannot be undone.
            </>
          ) : null
        }
        confirmLabel="Delete"
        isPending={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-sm text-ink-800">{children}</dd>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-inset ring-ink-200/70">
      <div className="flex items-start gap-6 border-b border-ink-200/70 px-8 py-8">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6 px-8 py-6">
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
      </div>
    </div>
  );
}

function NotFoundCard() {
  return (
    <div className="rounded-2xl border border-dashed border-ink-200 bg-surface/40 px-6 py-12 text-center">
      <h3 className="font-display text-lg font-semibold text-ink-800">
        Employee not found
      </h3>
      <p className="mt-1 text-sm text-ink-500">
        This person may have been removed from the directory.
      </p>
      <Link
        to="/"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent-700 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Directory
      </Link>
    </div>
  );
}
