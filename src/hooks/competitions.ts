"use client";

import { useState, useEffect } from 'react';
import { mockApi, type ApiResponse, type QueryOptions } from '../lib/api/mockApi';
import type { TableData } from '../lib/mockDb';

export interface UseCompetitionsOptions extends QueryOptions {
  category?: string;
  status?: string;
  limit?: number;
}

export interface UseCompetitionsReturn {
  competitions: TableData[];
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

export function useCompetitions(options: UseCompetitionsOptions = {}): UseCompetitionsReturn {
  const [competitions, setCompetitions] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | undefined>();

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      setError(null);

      const criteria: Record<string, unknown> = {};
      if (options.category) criteria.category = options.category;
      if (options.status) criteria.status = options.status;

      const queryOptions: QueryOptions = {
        page: options.page,
        limit: options.limit,
        sort: options.sort,
        search: options.search
      };

      const response: ApiResponse<TableData[]> = await mockApi.getCompetitions(queryOptions);

      if (response.success) {
        setCompetitions(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.message || 'Erreur lors du chargement des compétitions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, [options.category, options.status, options.page, options.limit, options.sort, options.search]);

  return {
    competitions,
    loading,
    error,
    refetch: fetchCompetitions,
    pagination
  };
}

export function useCompetitionById(id: number) {
  const [competition, setCompetition] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompetition = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: ApiResponse<TableData> = await mockApi.getCompetitionById(id);

        if (response.success) {
          setCompetition(response.data);
        } else {
          setError(response.message || 'Compétition non trouvée');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompetition();
    }
  }, [id]);

  return { competition, loading, error };
}

export function useActiveCompetitions() {
  const [competitions, setCompetitions] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActiveCompetitions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: ApiResponse<TableData[]> = await mockApi.getActiveCompetitions();

        if (response.success) {
          setCompetitions(response.data);
        } else {
          setError(response.message || 'Erreur lors du chargement des compétitions actives');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveCompetitions();
  }, []);

  return { competitions, loading, error };
}

export function useUpcomingCompetitions() {
  const [competitions, setCompetitions] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingCompetitions = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: ApiResponse<TableData[]> = await mockApi.getUpcomingCompetitions();

        if (response.success) {
          setCompetitions(response.data);
        } else {
          setError(response.message || 'Erreur lors du chargement des compétitions à venir');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingCompetitions();
  }, []);

  return { competitions, loading, error };
} 