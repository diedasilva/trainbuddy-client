import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiGet, apiPost } from '@/lib/api';
import type { Group, GroupMember } from '@/types/types';

export const useGroups = () =>
  useQuery<Group[]>(['groups'], () => apiGet<Group[]>('/groups'));

export const useCreateGroup = () => {
  const qc = useQueryClient();
  return useMutation(
    (data: Partial<Group>) => apiPost<Group>('/groups', data),
    { onSuccess: () => qc.invalidateQueries(['groups']) }
  );
};

export const useGroupMembers = (groupId: number) =>
  useQuery<GroupMember[]>(['groupMembers', groupId], () => apiGet<GroupMember[]>(`/groups/${groupId}/members`));

export const useAddGroupMember = (groupId: number) => {
  const qc = useQueryClient();
  return useMutation(
    (data: Partial<GroupMember>) => apiPost<GroupMember>(`/groups/${groupId}/members`, data),
    { onSuccess: () => qc.invalidateQueries(['groupMembers', groupId]) }
  );
};