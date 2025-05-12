import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiGet, apiPost } from '@/lib/api';
import type { Session, SessionMember } from '@/types/types';

export const useSessions = (params: { userId?: number; groupId?: number; type?: string; }) =>
  useQuery<Session[]>(['sessions', params], () => apiGet<Session[]>('/sessions', params), { keepPreviousData: true });

export const useCreateSession = () => {
  const qc = useQueryClient();
  return useMutation(
    (data: Partial<Session>) => apiPost<Session>('/sessions', data),
    { onSuccess: () => qc.invalidateQueries(['sessions']) }
  );
};

export const useSessionMembers = (sessionId: number) =>
  useQuery<SessionMember[]>(['sessionMembers', sessionId], () => apiGet<SessionMember[]>(`/sessions/${sessionId}/members`));

export const useAddSessionMember = (sessionId: number) => {
  const qc = useQueryClient();
  return useMutation(
    (data: Partial<SessionMember>) => apiPost<SessionMember>(`/sessions/${sessionId}/members`, data),
    { onSuccess: () => qc.invalidateQueries(['sessionMembers', sessionId]) }
  );
};