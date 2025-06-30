import { useState, useEffect } from 'react';
import { mockApi, type ApiResponse, type QueryOptions } from '../lib/api/mockApi';
import type { TableData } from '../lib/mockDb';

export interface UseCareersOptions extends QueryOptions {
  category?: string;
  type?: string;
  location?: string;
  limit?: number;
}

export interface UseCareersReturn {
  careers: TableData[];
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

export function useCareers(options: UseCareersOptions = {}): UseCareersReturn {
  const [careers, setCareers] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | undefined>();

  const fetchCareers = async () => {
    try {
      setLoading(true);
      setError(null);

      const criteria: Record<string, unknown> = {};
      if (options.category) criteria.category = options.category;
      if (options.type) criteria.type = options.type;
      if (options.location) criteria.location = options.location;

      const queryOptions: QueryOptions = {
        page: options.page,
        limit: options.limit,
        sort: options.sort,
        search: options.search
      };

      const response: ApiResponse<TableData[]> = await mockApi.getCareers(queryOptions);

      if (response.success) {
        setCareers(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.message || 'Erreur lors du chargement des carrières');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, [options.category, options.type, options.location, options.page, options.limit, options.sort, options.search]);

  return {
    careers,
    loading,
    error,
    refetch: fetchCareers,
    pagination
  };
}

export function useCareerById(id: number) {
  const [career, setCareer] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: ApiResponse<TableData> = await mockApi.getCareerById(id);

        if (response.success) {
          setCareer(response.data);
        } else {
          setError(response.message || 'Carrière non trouvée');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCareer();
    }
  }, [id]);

  return { career, loading, error };
}

export function useCareersByCategory(category: string) {
  const [careers, setCareers] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCareersByCategory = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: ApiResponse<TableData[]> = await mockApi.getCareersByCategory(category);

        if (response.success) {
          setCareers(response.data);
        } else {
          setError(response.message || 'Erreur lors du chargement des carrières par catégorie');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchCareersByCategory();
    }
  }, [category]);

  return { careers, loading, error };
}

export function useCareersByLocation(location: string) {
  const [careers, setCareers] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCareersByLocation = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: ApiResponse<TableData[]> = await mockApi.getCareersByLocation(location);

        if (response.success) {
          setCareers(response.data);
        } else {
          setError(response.message || 'Erreur lors du chargement des carrières par localisation');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    if (location) {
      fetchCareersByLocation();
    }
  }, [location]);

  return { careers, loading, error };
}

export function useSearchCareers(query: string) {
  const [careers, setCareers] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchCareers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: ApiResponse<TableData[]> = await mockApi.searchCareers(query);

        if (response.success) {
          setCareers(response.data);
        } else {
          setError(response.message || 'Erreur lors de la recherche de carrières');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    if (query.trim()) {
      searchCareers();
    } else {
      setCareers([]);
      setLoading(false);
    }
  }, [query]);

  return { careers, loading, error };
} 