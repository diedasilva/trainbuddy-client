import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiGet, apiPost } from '@/lib/api';
import type { User } from '@/types/types';

export const useUsers = () =>
  useQuery<User[]>(['users'], () => apiGet<User[]>('/users'));

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation(
    (data: Partial<User>) => apiPost<User>('/users', data),
    { onSuccess: () => qc.invalidateQueries(['users']) }
  );
};