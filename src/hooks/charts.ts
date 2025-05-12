import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiGet, apiPost } from '@/lib/api';
import type { Chart } from '@/types/types';

export const useCharts = (params: { userId?: number; groupId?: number; }) =>
  useQuery<Chart[]>(['charts', params], () => apiGet<Chart[]>('/charts', params));

export const useCreateChart = () => {
  const qc = useQueryClient();
  return useMutation(
    (data: Partial<Chart>) => apiPost<Chart>('/charts', data),
    { onSuccess: () => qc.invalidateQueries(['charts']) }
  );
};
