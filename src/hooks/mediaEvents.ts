import { useState, useEffect } from 'react';
import { mockApi, type ApiResponse, type QueryOptions } from '../lib/api/mockApi';
import type { TableData } from '../lib/mockDb';

export interface UseMediaEventsOptions extends QueryOptions {
  type?: string;
  category?: string;
  status?: string;
  limit?: number;
}

export interface UseMediaEventsReturn {
  mediaEvents: TableData[];
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

export function useMediaEvents(options: UseMediaEventsOptions = {}): UseMediaEventsReturn {
  const [mediaEvents, setMediaEvents] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | undefined>();

  const fetchMediaEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const criteria: Record<string, unknown> = {};
      if (options.type) criteria.type = options.type;
      if (options.category) criteria.category = options.category;
      if (options.status) criteria.status = options.status;

      const queryOptions: QueryOptions = {
        page: options.page,
        limit: options.limit,
        sort: options.sort,
        search: options.search
      };

      const response: ApiResponse<TableData[]> = await mockApi.getMediaEvents(queryOptions);

      if (response.success) {
        setMediaEvents(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.message || 'Erreur lors du chargement des événements média');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMediaEvents();
  }, [options.type, options.category, options.status, options.page, options.limit, options.sort, options.search]);

  return {
    mediaEvents,
    loading,
    error,
    refetch: fetchMediaEvents,
    pagination
  };
}

export function useMediaEventById(id: number) {
  const [mediaEvent, setMediaEvent] = useState<TableData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMediaEvent = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: ApiResponse<TableData> = await mockApi.getMediaEventById(id);

        if (response.success) {
          setMediaEvent(response.data);
        } else {
          setError(response.message || 'Événement média non trouvé');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMediaEvent();
    }
  }, [id]);

  return { mediaEvent, loading, error };
}

export function useUpcomingMediaEvents() {
  const [mediaEvents, setMediaEvents] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingMediaEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        // Contournement : Fetch direct du fichier JSON
        const response = await fetch('/mocks/mediaEvents.json');
        if (!response.ok) {
          throw new Error('Failed to fetch mediaEvents.json');
        }
        const allMediaEvents: TableData[] = await response.json();

        const now = new Date();
        const upcoming = allMediaEvents
          .filter(event => new Date(event.startDate as string) > now)
          .sort((a, b) => new Date(a.startDate as string).getTime() - new Date(b.startDate as string).getTime());

        setMediaEvents(upcoming.slice(0, 3));

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMediaEvents();
  }, []);

  return { mediaEvents, loading, error };
}

export function useMediaEventsByType(type: string) {
  const [mediaEvents, setMediaEvents] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMediaEventsByType = async () => {
      try {
        setLoading(true);
        setError(null);

        const response: ApiResponse<TableData[]> = await mockApi.getMediaEventsByType(type);

        if (response.success) {
          setMediaEvents(response.data);
        } else {
          setError(response.message || 'Erreur lors du chargement des événements média par type');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    if (type) {
      fetchMediaEventsByType();
    }
  }, [type]);

  return { mediaEvents, loading, error };
} 