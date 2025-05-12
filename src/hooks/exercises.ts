import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiGet, apiPost } from '@/lib/api';
import type { Exercise, SessionExercise } from '@/types/types';

export const useExercises = (activityType: string) =>
  useQuery<Exercise[]>(['exercises', activityType], () => apiGet<Exercise[]>('/exercises', { activityType }));

export const useSessionExercises = (sessionId: number) =>
  useQuery<SessionExercise[]>(['sessionExercises', sessionId], () => apiGet<SessionExercise[]>(`/sessions/${sessionId}/exercises`));

export const useAddSessionExercise = (sessionId: number) => {
  const qc = useQueryClient();
  return useMutation(
    (data: Partial<SessionExercise>) => apiPost<SessionExercise>(`/sessions/${sessionId}/exercises`, data),
    { onSuccess: () => qc.invalidateQueries(['sessionExercises', sessionId]) }
  );
};
