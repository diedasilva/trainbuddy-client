import { useState, useEffect } from 'react';
import { mockApi } from '@/lib/api/mockApi';
import type { TableData } from '@/lib/mockDb';

export interface GroupPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canModerate: boolean;
  canInvite: boolean;
}

export interface MembershipStatus {
  status: 'member' | 'admin' | 'moderator' | 'pending' | 'none';
  joinedAt?: string;
}

export function useGroups() {
  const [groups, setGroups] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const response = await mockApi.getGroups();
        if (response.success) {
          setGroups(response.data);
        } else {
          setError(response.message || 'Erreur lors du chargement des groupes');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  // Simuler les permissions basées sur l'ID du groupe
  const getPermissions = (groupId: number): GroupPermissions => {
    // Simulation : les groupes avec ID pair sont administrés par l'utilisateur
    const isAdmin = groupId % 2 === 0;
    const isModerator = groupId % 3 === 0 && !isAdmin;
    
    return {
      canEdit: isAdmin,
      canDelete: isAdmin,
      canModerate: isAdmin || isModerator,
      canInvite: isAdmin || isModerator
    };
  };

  // Simuler le statut d'adhésion
  const getMembershipStatus = (groupId: number): MembershipStatus['status'] => {
    // Simulation : adhésion pour les groupes avec ID impair
    if (groupId % 2 === 1) return 'member';
    if (groupId % 3 === 0) return 'admin';
    if (groupId % 5 === 0) return 'moderator';
    return 'none';
  };

  return {
    groups,
    loading,
    error,
    getPermissions,
    getMembershipStatus
  };
} 