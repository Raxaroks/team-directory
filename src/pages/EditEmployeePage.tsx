import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { TopBar } from '../components/layout/TopBar';
import { EmployeeForm, type FormState } from '../components/employees/EmployeeForm';
import { useEmployee } from '../hooks/useEmployees';
import { useUpdateEmployee } from '../hooks/useUpdateEmployee';
import { Skeleton } from '../components/ui/Skeleton';

export default function EditEmployeePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: employee, isLoading, isError } = useEmployee(id);
  const { mutateAsync, isPending, isError: isUpdateError, error: updateError } = useUpdateEmployee();

  const errorMessage = useMemo(() => {
    if (isError) return 'Failed to load employee.';
    if (!isUpdateError) return null;
    return updateError instanceof Error ? updateError.message : 'Something went wrong.';
  }, [isError, isUpdateError, updateError]);

  const handleSubmit = async (data: FormState) => {
    if (!id) return;
    await mutateAsync({
      id,
      patch: {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        role: data.role.trim(),
        department: data.department,
        status: data.status,
        location: data.location.trim(),
        bio: data.bio.trim() || undefined,
      },
    });
    navigate(`/employees/${id}`);
  };

  const handleCancel = () => {
    navigate(`/employees/${id}`);
  };

  return (
    <>
      <TopBar
        title="Edit Employee"
        subtitle={employee ? `Editing ${employee.firstName} ${employee.lastName}` : 'Update directory entry.'}
        actions={
          <Link
            to={`/employees/${id}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </Link>
        }
      />

      <div className="flex-1 overflow-y-auto px-6 py-8">
        {isLoading ? (
          <div className="mx-auto max-w-2xl space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : isError || !employee ? (
          <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-ink-200 bg-surface/40 px-6 py-12 text-center">
             <h3 className="font-display text-lg font-semibold text-ink-800">
              Employee not found
            </h3>
            <p className="mt-1 text-sm text-ink-500">
              We couldn't find the employee you're trying to edit.
            </p>
          </div>
        ) : (
          <EmployeeForm
            initialData={employee}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isPending={isPending}
            submitLabel="Save changes"
            error={errorMessage}
          />
        )}
      </div>
    </>
  );
}
