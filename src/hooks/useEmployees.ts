import { useQuery } from '@tanstack/react-query';
import { getEmployeeById, getEmployees } from '../services/employeeService';
import type { Employee } from '../types/employee';

export const employeeKeys = {
  all: ['employees'] as const,
  detail: (id: string) => ['employees', id] as const,
};

export function useEmployees() {
  return useQuery<Employee[]>({
    queryKey: employeeKeys.all,
    queryFn: getEmployees,
  });
}

export function useEmployee(id: string | undefined) {
  return useQuery<Employee | null>({
    queryKey: id ? employeeKeys.detail(id) : ['employees', 'undefined'],
    queryFn: () => getEmployeeById(id!),
    enabled: !!id,
  });
}
