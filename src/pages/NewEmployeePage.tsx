import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';

import { TopBar } from '../components/layout/TopBar';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useCreateEmployee } from '../hooks/useCreateEmployee';
import {
  DEPARTMENTS,
  STATUSES,
  type Department,
  type EmploymentStatus,
} from '../types/employee';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: Department;
  status: EmploymentStatus;
  location: string;
  bio: string;
}

const INITIAL_FORM: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  department: 'Engineering',
  status: 'active',
  location: '',
  bio: '',
};

export type FormErrors = Partial<Record<keyof FormState, string>>;

/**
 * Validate the new-employee form.
 *
 * USER CONTRIBUTION SLOT — see notes in CLAUDE.md / README under "Known TODOs".
 *
 * Trade-offs to consider:
 *   - Required fields: firstName, lastName, email, role, location are required
 *     per the spec. Should you trim() before checking emptiness?
 *   - Email format: how strict should the regex be? Browsers already block
 *     totally invalid input via type="email", but bad-but-parseable strings
 *     like "a@b" still pass. Pick a stance.
 *   - Length limits: should role/location have a max length? What about bio?
 *   - When does this run — on submit only, or also on blur per field? The
 *     surrounding submit handler currently runs it on submit; blur-time
 *     validation would require additional plumbing.
 *
 * Return an object with one error message per invalid field, or an empty
 * object if everything passes. The form will display the messages inline.
 */
export function validateEmployeeForm(form: FormState): FormErrors {
  // TODO(user): implement validation — see comment block above.
  const errors: FormErrors = {};
  if (!form.firstName.trim()) errors.firstName = 'Required';
  if (!form.lastName.trim()) errors.lastName = 'Required';
  if (!form.email.trim()) errors.email = 'Required';
  return errors;
}

const departmentOptions = DEPARTMENTS.map((d) => ({ value: d, label: d }));
const statusOptions: ReadonlyArray<{ value: EmploymentStatus; label: string }> = [
  { value: 'active', label: 'Active' },
  { value: 'on_leave', label: 'On leave' },
  { value: 'contractor', label: 'Contractor' },
];
// Sanity check at module load — guarantees status options stay in sync.
void STATUSES;

export default function NewEmployeePage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending, isError, error } = useCreateEmployee();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const errorMessage = useMemo(() => {
    if (!isError) return null;
    return error instanceof Error ? error.message : 'Something went wrong.';
  }, [isError, error]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateEmployeeForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    const created = await mutateAsync({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      role: form.role.trim(),
      department: form.department,
      status: form.status,
      location: form.location.trim(),
      bio: form.bio.trim() || undefined,
    });
    navigate(`/employees/${created.id}`);
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
        <div className="mx-auto max-w-2xl">
          {errorMessage && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2 rounded-xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-inset ring-rose-200"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{errorMessage}</p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-5 rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-inset ring-ink-200/70"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="First name"
                required
                value={form.firstName}
                onChange={(e) => set('firstName', e.target.value)}
                error={errors.firstName}
                autoComplete="given-name"
              />
              <Input
                label="Last name"
                required
                value={form.lastName}
                onChange={(e) => set('lastName', e.target.value)}
                error={errors.lastName}
                autoComplete="family-name"
              />
            </div>

            <Input
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              error={errors.email}
              autoComplete="email"
              placeholder="name@acme.io"
            />

            <Input
              label="Role / Job title"
              required
              value={form.role}
              onChange={(e) => set('role', e.target.value)}
              error={errors.role}
              placeholder="Senior Frontend Engineer"
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="Department"
                required
                value={form.department}
                onChange={(e) => set('department', e.target.value as Department)}
                options={departmentOptions}
                error={errors.department}
              />
              <Select
                label="Status"
                required
                value={form.status}
                onChange={(e) => set('status', e.target.value as EmploymentStatus)}
                options={statusOptions}
                error={errors.status}
              />
            </div>

            <Input
              label="Location"
              required
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              error={errors.location}
              placeholder="Remote – City, Country"
            />

            <Textarea
              label="Bio"
              hint="Optional. One or two sentences."
              value={form.bio}
              onChange={(e) => set('bio', e.target.value)}
              error={errors.bio}
            />

            <div className="flex items-center justify-end gap-2 border-t border-ink-200/70 pt-5">
              <Link to="/">
                <Button variant="secondary" size="md" type="button">
                  Cancel
                </Button>
              </Link>
              <Button variant="primary" size="md" type="submit" disabled={isPending}>
                {isPending ? 'Creating…' : 'Create employee'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
