import { useEffect, useState } from 'react';
import type { Exercise, SessionExercise } from '@/types/types';
import { getExercises } from '@/lib/api/exercisesApi';
import { getSessionExercisesBySessionId } from '@/lib/api/sessionExercisesApi';

export function useExercises(activityType?: string) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getExercises()
      .then((data) => {
        let filtered = data;
        if (activityType) filtered = filtered.filter((e: Exercise) => e.activityType === activityType);
        setExercises(filtered);
        setError(null);
      })
      .catch(() => {
        setError('Failed to load exercises');
        setExercises([]);
      })
      .finally(() => setLoading(false));
  }, [activityType]);

  return { exercises, loading, error };
}

export function useSessionExercises(sessionId: number) {
  const [sessionExercises, setSessionExercises] = useState<SessionExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getSessionExercisesBySessionId(sessionId)
      .then((data) => {
        setSessionExercises(data);
        setError(null);
      })
      .catch(() => {
        setError('Failed to load session exercises');
        setSessionExercises([]);
      })
      .finally(() => setLoading(false));
  }, [sessionId]);

  return { sessionExercises, loading, error };
}
