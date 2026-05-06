import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEmployee } from '../services/employeeService';
import { employeeKeys } from './useEmployees';

export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: deleteEmployee,
    onSuccess: (_result, id) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      queryClient.removeQueries({ queryKey: employeeKeys.detail(id) });
    },
  });
}
