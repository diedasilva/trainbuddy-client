import { useEffect, useState } from 'react';
import type { User } from '@/types/types';
import { getUsers } from '@/lib/api/usersApi';
import type { TableData } from '../lib/mockDb';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getUsers()
      .then((data) => {
        setUsers(data);
        setError(null);
      })
      .catch(() => {
        setError('Failed to load users');
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { users, loading, error };
}

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation(
    (data: Partial<User>) => apiPost<User>('/users', data),
    { onSuccess: () => qc.invalidateQueries(['users']) }
  );
};

// Pour l'instant, on récupère un utilisateur statique (le premier)
const MOCK_USER_ID = 1;

export function useUser(userId: number = MOCK_USER_ID) {
  const [user, setUser] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/mocks/users.json');
        if (!response.ok) {
          throw new Error('Failed to fetch users.json');
        }
        const allUsers: TableData[] = await response.json();
        
        const currentUser = allUsers.find(u => u.id === userId);

        if (currentUser) {
          setUser(currentUser);
        } else {
          throw new Error(`User with id ${userId} not found.`);
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
}