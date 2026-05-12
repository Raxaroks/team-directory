import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEmployee } from '../services/employeeService';
import { employeeKeys } from './useEmployees';
import type { Employee } from '../types/employee';

interface UpdateInput {
  id: string;
  patch: Partial<Omit<Employee, 'id'>>;
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation<Employee | null, Error, UpdateInput>({
    mutationFn: ({ id, patch }) => updateEmployee(id, patch),
    onSuccess: (updated) => {
      if (updated) {
        queryClient.invalidateQueries({ queryKey: employeeKeys.all });
        queryClient.setQueryData(employeeKeys.detail(updated.id), updated);
      }
    },
  });
}
