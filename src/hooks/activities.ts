"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { mockApi, type ApiResponse, type QueryOptions } from '../lib/api/mockApi';
import type { TableData } from '../lib/mockDb';

export interface UseActivitiesOptions extends QueryOptions {
  category?: string;
  difficulty?: string;
  limit?: number;
}

export interface UseActivitiesReturn {
  activities: TableData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useActivities(options: UseActivitiesOptions = {}): UseActivitiesReturn {
  const [activities, setActivities] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | undefined>();

  // Stabiliser les options pour éviter les re-rendus infinis
  const stableOptions = useMemo(() => ({
    category: options.category,
    difficulty: options.difficulty,
    page: options.page,
    limit: options.limit,
    sort: options.sort,
    search: options.search
  }), [
    options.category,
    options.difficulty,
    options.page,
    options.limit,
    JSON.stringify(options.sort),
    JSON.stringify(options.search)
  ]);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const criteria: Record<string, unknown> = {};
      if (stableOptions.category) criteria.category = stableOptions.category;
      if (stableOptions.difficulty) criteria.difficulty = stableOptions.difficulty;

      const queryOptions: QueryOptions = {
        page: stableOptions.page,
        limit: stableOptions.limit,
        sort: stableOptions.sort,
        search: stableOptions.search
      };

      const response: ApiResponse<TableData[]> = await mockApi.getActivities(queryOptions);

      if (response.success) {
        setActivities(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.message || 'Erreur lors du chargement des activités');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, [stableOptions]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities,
    pagination
  };
}

export function useActivityById(id: number) {
  const [activity, setActivity] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: ApiResponse<TableData> = await mockApi.getActivityById(id);

        if (response.success) {
          setActivity(response.data);
        } else {
          setError(response.message || 'Activité non trouvée');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchActivity();
    }
  }, [id]);

  return { activity, loading, error };
}

export function usePopularActivities(limit: number = 10) {
  const [activities, setActivities] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularActivities = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: ApiResponse<TableData[]> = await mockApi.getPopularActivities(limit);

        if (response.success) {
          setActivities(response.data);
        } else {
          setError(response.message || 'Erreur lors du chargement des activités populaires');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularActivities();
  }, [limit]);

  return { activities, loading, error };
}

export function useActivitiesByCategory(category: string) {
  const [activities, setActivities] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivitiesByCategory = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: ApiResponse<TableData[]> = await mockApi.getActivitiesByCategory(category);

        if (response.success) {
          setActivities(response.data);
        } else {
          setError(response.message || 'Erreur lors du chargement des activités par catégorie');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchActivitiesByCategory();
    }
  }, [category]);

  return { activities, loading, error };
} 