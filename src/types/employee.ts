export type EmploymentStatus = 'active' | 'on_leave' | 'contractor';

export type Department =
  | 'Engineering'
  | 'Design'
  | 'Product'
  | 'Marketing'
  | 'Sales'
  | 'HR'
  | 'Finance';

export const DEPARTMENTS: Department[] = [
  'Engineering',
  'Design',
  'Product',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
];

export const STATUSES: EmploymentStatus[] = ['active', 'on_leave', 'contractor'];

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: Department;
  status: EmploymentStatus;
  startDate: string;
  location: string;
  bio?: string;
}
