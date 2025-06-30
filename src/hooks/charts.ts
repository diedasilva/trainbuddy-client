import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiGet, apiPost } from '@/lib/api';
import type { Chart } from '@/types/types';
import { useEffect, useState } from 'react';
import { getCharts } from '@/lib/api/chartsApi';

export function useCharts(params?: { userId?: number; groupId?: number }) {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getCharts()
      .then((data) => {
        let filtered = data;
        if (params?.userId) filtered = filtered.filter((c: Chart) => c.userId === params.userId);
        if (params?.groupId) filtered = filtered.filter((c: Chart) => c.groupId === params.groupId);
        setCharts(filtered);
        setError(null);
      })
      .catch(() => {
        setError('Failed to load charts');
        setCharts([]);
      })
      .finally(() => setLoading(false));
  }, [params]);

  return { charts, loading, error };
}

export const useCreateChart = () => {
  const qc = useQueryClient();
  return useMutation(
    (data: Partial<Chart>) => apiPost<Chart>('/charts', data),
    { onSuccess: () => qc.invalidateQueries(['charts']) }
  );
};
