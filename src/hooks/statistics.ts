import { useState, useEffect } from 'react';

export function useStatistics() {
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/mocks/statistics.json');
        if (!response.ok) {
          throw new Error('Failed to fetch statistics.json');
        }
        const statsData = await response.json();
        
        setStats(statsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return { stats, loading, error };
} 