import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEmployee } from '../services/employeeService';
import { employeeKeys } from './useEmployees';
import type { Employee } from '../types/employee';

type CreateInput = Omit<Employee, 'id' | 'startDate'> & { startDate?: string };

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation<Employee, Error, CreateInput>({
    mutationFn: createEmployee,
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      queryClient.setQueryData(employeeKeys.detail(created.id), created);
    },
  });
}
