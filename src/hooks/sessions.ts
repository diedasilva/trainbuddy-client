import { useEffect, useState } from 'react';
import type { Session, SessionMember } from '@/types/types';
import { getSessions } from '@/lib/api/sessionsApi';
import { getSessionMembersBySessionId } from '@/lib/api/sessionMembersApi';

export function useSessions(params?: { userId?: number; groupId?: number; type?: string }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getSessions()
      .then((data) => {
        let filtered = data;
        if (params?.userId) filtered = filtered.filter((s: Session) => s.createdBy === params.userId);
        if (params?.groupId) filtered = filtered.filter((s: Session) => s.groupId === params.groupId);
        if (params?.type) filtered = filtered.filter((s: Session) => s.type === params.type);
        setSessions(filtered);
        setError(null);
      })
      .catch(() => {
        setError('Failed to load sessions');
        setSessions([]);
      })
      .finally(() => setLoading(false));
  }, [params]);

  return { sessions, loading, error };
}

export function useSessionMembers(sessionId: number) {
  const [members, setMembers] = useState<SessionMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getSessionMembersBySessionId(sessionId)
      .then((data) => {
        setMembers(data);
        setError(null);
      })
      .catch(() => {
        setError('Failed to load session members');
        setMembers([]);
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  return { members, loading, error };
}