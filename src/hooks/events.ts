import { useState, useEffect } from 'react';
import type { TableData } from '../lib/mockDb';

export function useNextThreeEvents() {
  const [events, setEvents] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/mocks/events.json');
        if (!response.ok) {
          throw new Error('Failed to fetch events.json');
        }
        const allEvents: TableData[] = await response.json();

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const nextThree = allEvents
          .map(event => ({
            ...event,
            startDate: new Date(event.start as string)
          }))
          // on ne garde que ceux à venir (>= aujourd’hui)
          .filter(evt => evt.startDate >= today)
          // tri chronologique croissant
          .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
          // on prend juste les 3 premiers
          .slice(0, 3)
          // on remet dans le format original si besoin
          .map(({ startDate, ...rest }) => rest as TableData);

        setEvents(nextThree);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, loading, error };
}
