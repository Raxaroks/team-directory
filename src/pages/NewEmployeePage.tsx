import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { TopBar } from '../components/layout/TopBar';
import { EmployeeForm, type FormState } from '../components/employees/EmployeeForm';
import { useCreateEmployee } from '../hooks/useCreateEmployee';

export default function NewEmployeePage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending, isError, error } = useCreateEmployee();

  const errorMessage = useMemo(() => {
    if (!isError) return null;
    return error instanceof Error ? error.message : 'Something went wrong.';
  }, [isError, error]);

  const handleSubmit = async (data: FormState) => {
    const created = await mutateAsync({
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      role: data.role.trim(),
      department: data.department,
      status: data.status,
      location: data.location.trim(),
      bio: data.bio.trim() || undefined,
    });
    navigate(`/employees/${created.id}`);
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <>
      <TopBar
        title="Add Employee"
        subtitle="Create a new directory entry."
        actions={
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Cancel
          </Link>
        }
      />

      <div className="flex-1 overflow-y-auto px-6 py-8">
        <EmployeeForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isPending={isPending}
          submitLabel="Create employee"
          error={errorMessage}
        />
      </div>
    </>
  );
}
