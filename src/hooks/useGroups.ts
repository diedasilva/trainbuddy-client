"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Group, GroupFormData, GroupFilters, MembershipStatus, GroupPermissions, UserData } from '@/components/groups/types';
import { getGroups, getGroupById } from '@/lib/api/groupsApi';
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
  const router = useRouter();
  const [groups, setGroups] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userMemberships, setUserMemberships] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState<GroupFilters>({
    search: "",
    category: "",
    status: "",
    sortBy: "activity",
    sortOrder: "desc"
  });

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

  // Load groups
  const loadGroups = useCallback(async () => {
    try {
      setLoading(true);
      const groupsData = await getGroups();
      
      // Transform the API data to match the Group interface
      const transformedGroups: Group[] = groupsData.map((group: {
        id: number;
        name: string;
        description: string;
        status: string;
        category: string;
        admin: string;
        moderators?: string[];
        members?: UserData[];
        workoutCount?: number;
        totalMembers?: number;
        activeMembers?: number;
        lastActivity?: string;
        createdAt: string;
        updatedAt: string;
        avatarUrl?: string;
        coverUrl?: string;
        stats?: Record<string, unknown>;
      }) => ({
        id: group.id,
        name: group.name,
        description: group.description,
        status: group.status,
        category: group.category,
        admin: group.admin,
        moderators: group.moderators || [],
        members: group.members || [],
        workoutCount: group.workoutCount || 0,
        totalMembers: group.totalMembers || 0,
        activeMembers: group.activeMembers || 0,
        lastActivity: group.lastActivity || "Just now",
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        avatarUrl: group.avatarUrl || "/images/groups/default.jpg",
        coverUrl: group.coverUrl || "/images/groups/default-cover.jpg",
        data: [],
        charts: [],
        events: [],
        achievements: [],
        resources: [],
        settings: {
          allowMemberInvites: true,
          requireApproval: false,
          maxMembers: 100,
          autoArchive: false
        },
        stats: group.stats || {
          totalWorkouts: 0,
          totalCalories: 0,
          averageRating: 0,
          completionRate: 0
        }
      }));
      
      setGroups(transformedGroups);
      
      // Initialize user memberships from existing groups
      const initialMemberships = new Set<number>();
      transformedGroups.forEach(group => {
        if (group.members.some(member => member.name === "Current User")) {
          initialMemberships.add(group.id);
        }
      });
      setUserMemberships(initialMemberships);
      
      setError(null);
    } catch (err) {
      setError("Failed to load groups");
      console.error("Error loading groups:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get group by ID
  const getGroup = useCallback(async (id: number): Promise<Group | null> => {
    try {
      setLoading(true);
      const groupData = await getGroupById(id);
      
      if (!groupData) return null;
      
      // Transform the API data to match the Group interface
      const transformedGroup: Group = {
        id: groupData.id,
        name: groupData.name,
        description: groupData.description,
        status: groupData.status,
        category: groupData.category,
        admin: groupData.admin,
        moderators: groupData.moderators || [],
        members: groupData.members || [],
        workoutCount: groupData.workoutCount || 0,
        totalMembers: groupData.totalMembers || 0,
        activeMembers: groupData.activeMembers || 0,
        lastActivity: groupData.lastActivity || "Just now",
        createdAt: groupData.createdAt,
        updatedAt: groupData.updatedAt,
        avatarUrl: groupData.avatarUrl || "/images/groups/default.jpg",
        coverUrl: groupData.coverUrl || "/images/groups/default-cover.jpg",
        data: [],
        charts: [],
        events: [],
        achievements: [],
        resources: [],
        settings: {
          allowMemberInvites: true,
          requireApproval: false,
          maxMembers: 100,
          autoArchive: false
        },
        stats: groupData.stats || {
          totalWorkouts: 0,
          totalCalories: 0,
          averageRating: 0,
          completionRate: 0
        }
      };
      
      return transformedGroup;
    } catch (err) {
      setError("Failed to load group");
      console.error("Error loading group:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create group
  const createGroup = useCallback(async (groupData: GroupFormData): Promise<Group | null> => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newGroup: Group = {
        id: Date.now(),
        name: groupData.name,
        description: groupData.description,
        status: groupData.status,
        category: groupData.category,
        admin: "Current User", // Replace with actual user
        moderators: [],
        members: [],
        workoutCount: 0,
        totalMembers: 0,
        activeMembers: 0,
        lastActivity: "Just now",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: [],
        charts: [],
        events: [],
        achievements: [],
        resources: [],
        settings: {
          allowMemberInvites: groupData.allowMemberInvites,
          requireApproval: groupData.requireApproval,
          maxMembers: groupData.maxMembers,
          autoArchive: groupData.autoArchive
        },
        stats: {
          totalWorkouts: 0,
          totalCalories: 0,
          averageRating: 0,
          completionRate: 0
        }
      };

      setGroups(prev => [...prev, newGroup]);
      router.push(`/groups/${newGroup.id}`);
      return newGroup;
    } catch (err) {
      setError("Failed to create group");
      console.error("Error creating group:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Update group
  const updateGroup = useCallback(async (id: number, groupData: Partial<GroupFormData>): Promise<Group | null> => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setGroups(prev => prev.map(group => 
        group.id === id 
          ? { ...group, ...groupData, updatedAt: new Date().toISOString() }
          : group
      ));
      
      return groups.find(g => g.id === id) || null;
    } catch (err) {
      setError("Failed to update group");
      console.error("Error updating group:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [groups]);

  // Delete group
  const deleteGroup = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGroups(prev => prev.filter(group => group.id !== id));
      router.push("/groups");
      return true;
    } catch (err) {
      setError("Failed to delete group");
      console.error("Error deleting group:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Join group
  const joinGroup = useCallback(async (groupId: number): Promise<boolean> => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setGroups(prev => prev.map(group => {
        if (group.id === groupId) {
          const newMember: UserData = {
            id: 999, // Mock user ID
            name: "Current User",
            score: 0,
            role: "member",
            joinDate: new Date().toISOString(),
            lastActive: new Date().toISOString()
          };
          return {
            ...group,
            members: [...group.members, newMember],
            totalMembers: group.totalMembers + 1,
            activeMembers: group.activeMembers + 1
          };
        }
        return group;
      }));
      
      setUserMemberships(prev => new Set([...prev, groupId]));
      return true;
    } catch (err) {
      setError("Failed to join group");
      console.error("Error joining group:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Leave group
  const leaveGroup = useCallback(async (groupId: number): Promise<boolean> => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGroups(prev => prev.map(group => 
        group.id === groupId 
          ? { 
              ...group, 
              totalMembers: Math.max(0, group.totalMembers - 1),
              activeMembers: Math.max(0, group.activeMembers - 1),
              lastActivity: "Just now",
              members: group.members.filter(member => member.name !== "Current User")
            }
          : group
      ));
      
      // Update user memberships
      setUserMemberships(prev => {
        const newSet = new Set(prev);
        newSet.delete(groupId);
        return newSet;
      });
      
      return true;
    } catch (err) {
      setError("Failed to leave group");
      console.error("Error leaving group:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user's membership status
  const getMembershipStatus = useCallback((groupId: number): MembershipStatus => {
    return userMemberships.has(groupId) ? "member" : "none";
  }, [userMemberships]);

  // Get user's permissions for a group
  const getPermissions = useCallback((groupId: number): GroupPermissions => {
    // Simulation : les groupes avec ID pair sont administrés par l'utilisateur
    const isAdmin = groupId % 2 === 0;
    const isModerator = groupId % 3 === 0 && !isAdmin;
    
    return {
      canEdit: isAdmin,
      canDelete: isAdmin,
      canModerate: isAdmin || isModerator,
      canInvite: isAdmin || isModerator
    };
  }, []);

  // Filter groups based on current filters
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         group.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = !filters.category || group.category === filters.category;
    const matchesStatus = !filters.status || group.status === filters.status;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort filtered groups
  const sortedGroups = [...filteredGroups].sort((a, b) => {
    let aValue: string | number | Date, bValue: string | number | Date;
    
    switch (filters.sortBy) {
      case "name":
        aValue = a.name;
        bValue = b.name;
        break;
      case "members":
        aValue = a.totalMembers;
        bValue = b.totalMembers;
        break;
      case "activity":
        aValue = new Date(a.lastActivity);
        bValue = new Date(b.lastActivity);
        break;
      case "created":
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      default:
        aValue = a.name;
        bValue = b.name;
    }

    if (filters.sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Load groups on mount
  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  return {
    groups: sortedGroups,
    loading,
    error,
    filters,
    setFilters,
    loadGroups,
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    joinGroup,
    leaveGroup,
    getMembershipStatus,
    getPermissions,
    clearError: () => setError(null)
  };
} 