import { useState, type FormEvent } from 'react';
import { AlertCircle } from 'lucide-react';

import { Button } from '../ui/Button';
import { Input, Textarea } from '../ui/Input';
import { Select } from '../ui/Select';
import {
  DEPARTMENTS,
  STATUSES,
  type Department,
  type EmploymentStatus,
} from '../../types/employee';

export interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: Department;
  status: EmploymentStatus;
  location: string;
  bio: string;
}

export type FormErrors = Partial<Record<keyof FormState, string>>;

export interface EmployeeFormProps {
  initialData?: Partial<FormState>;
  onSubmit: (data: FormState) => Promise<void> | void;
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
  error?: string | null;
}

const DEFAULT_INITIAL_FORM: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  department: 'Engineering',
  status: 'active',
  location: '',
  bio: '',
};

export function validateEmployeeForm(form: FormState): FormErrors {
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
// Sanity check status options stay in sync
void STATUSES;

export function EmployeeForm({
  initialData,
  onSubmit,
  onCancel,
  isPending,
  submitLabel,
  error,
}: EmployeeFormProps) {
  const [form, setForm] = useState<FormState>({
    ...DEFAULT_INITIAL_FORM,
    ...initialData,
  });
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateEmployeeForm(form);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    await onSubmit(form);
  };

  return (
    <div className="mx-auto max-w-2xl">
      {error && (
        <div
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-xl bg-rose-50 p-4 text-sm text-rose-700 ring-1 ring-inset ring-rose-200"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
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
          <Button variant="secondary" size="md" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" disabled={isPending}>
            {isPending ? 'Saving…' : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
