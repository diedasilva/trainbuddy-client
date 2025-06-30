import { useState, useEffect } from 'react';
import { mockApi, type ApiResponse, type QueryOptions } from '../lib/api/mockApi';
import type { TableData } from '../lib/mockDb';

export interface UseHealthProgramsOptions extends QueryOptions {
  category?: string;
  difficulty?: string;
  limit?: number;
}

export interface UseHealthProgramsReturn {
  healthPrograms: TableData[];
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

export function useHealthPrograms(options: UseHealthProgramsOptions = {}): UseHealthProgramsReturn {
  const [healthPrograms, setHealthPrograms] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | undefined>();

  const fetchHealthPrograms = async () => {
    try {
      setLoading(true);
      setError(null);

      const criteria: Record<string, unknown> = {};
      if (options.category) criteria.category = options.category;
      if (options.difficulty) criteria.difficulty = options.difficulty;

      const queryOptions: QueryOptions = {
        page: options.page,
        limit: options.limit,
        sort: options.sort,
        search: options.search
      };

      const response: ApiResponse<TableData[]> = await mockApi.getHealthPrograms(queryOptions);

      if (response.success) {
        setHealthPrograms(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.message || 'Erreur lors du chargement des programmes de santé');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthPrograms();
  }, [options.category, options.difficulty, options.page, options.limit, options.sort, options.search]);

  return {
    healthPrograms,
    loading,
    error,
    refetch: fetchHealthPrograms,
    pagination
  };
}

export function useHealthProgramById(id: number) {
  const [healthProgram, setHealthProgram] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthProgram = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: ApiResponse<TableData> = await mockApi.getHealthProgramById(id);

        if (response.success) {
          setHealthProgram(response.data);
        } else {
          setError(response.message || 'Programme de santé non trouvé');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHealthProgram();
    }
  }, [id]);

  return { healthProgram, loading, error };
}

export function useTopRatedHealthPrograms(limit: number = 10) {
  const [healthPrograms, setHealthPrograms] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopRatedHealthPrograms = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: ApiResponse<TableData[]> = await mockApi.getTopRatedHealthPrograms(limit);

        if (response.success) {
          setHealthPrograms(response.data);
        } else {
          setError(response.message || 'Erreur lors du chargement des programmes de santé les mieux notés');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedHealthPrograms();
  }, [limit]);

  return { healthPrograms, loading, error };
}

export function useHealthProgramsByCategory(category: string) {
  const [healthPrograms, setHealthPrograms] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealthProgramsByCategory = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: ApiResponse<TableData[]> = await mockApi.getHealthProgramsByCategory(category);

        if (response.success) {
          setHealthPrograms(response.data);
        } else {
          setError(response.message || 'Erreur lors du chargement des programmes de santé par catégorie');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchHealthProgramsByCategory();
    }
  }, [category]);

  return { healthPrograms, loading, error };
} 