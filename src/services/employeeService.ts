import { db } from '../db/db';
import type { Employee } from '../types/employee';

const randomDelay = () => 400 + Math.random() * 400;

const delay = <T>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), randomDelay()));

const generateId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `emp_${crypto.randomUUID()}`;
  }
  return `emp_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const today = (): string => new Date().toISOString().slice(0, 10);

export function getEmployees(): Promise<Employee[]> {
  return delay(db.getAll());
}

export function getEmployeeById(id: string): Promise<Employee | null> {
  return delay(db.getById(id));
}

export function createEmployee(
  data: Omit<Employee, 'id' | 'startDate'> & { startDate?: string },
): Promise<Employee> {
  const employee: Employee = {
    ...data,
    id: generateId(),
    startDate: data.startDate ?? today(),
  };
  return delay(db.insert(employee));
}

// TODO: implement updateEmployee
// export function updateEmployee(id: string, patch: Partial<Omit<Employee, 'id'>>): Promise<Employee | null> {
//   return delay(db.update(id, patch));
// }

// TODO: implement deleteEmployee
// export function deleteEmployee(id: string): Promise<boolean> {
//   return delay(db.remove(id));
// }
