import { useState, useEffect } from 'react';
import { mockApi } from '@/lib/api/mockApi';
import type { TableData } from '@/lib/mockDb';

export function useCategories() {
  const [categories, setCategories] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await mockApi.findAll('categories');
        if (res.success) {
          setCategories(res.data);
        } else {
          setError(res.message || 'Erreur lors du chargement des catégories');
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur lors du chargement des catégories');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, loading, error };
} 