import React, { useState, useEffect, useMemo } from "react";
import DayView from "./DayView";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import { Event } from "@/utils/types";
import { Button } from "../ui/button";

export default function FullCalendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<"day" | "week" | "month">("week");

  // Charger les événements
  useEffect(() => {
    fetch("/events.json")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Erreur de chargement :", err));
  }, []);

  // Fonction pour détecter les chevauchements
  const groupOverlappingEvents = (events: Event[]): Event[] => {
    
    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    const groups: Event[][] = [];
    const enrichedEvents: Event[] = [];

    sortedEvents.forEach((event) => {

      // Exclure les événements "all day"
      if (event.allDay) {
        enrichedEvents.push({ ...event, groupIndex: 0, groupSize: 1 }); // Garde les événements "all day" sans chevauchement
        return; // Passe à l'itération suivante
      }

      let addedToGroup = false;

      for (const group of groups) {
        if (group.some((e) => isOverlapping(e, event))) {
          group.push(event);
          addedToGroup = true;
          break;
        }
      }

      if (!addedToGroup) {
        groups.push([event]);
      }
    });

    // Enrichir chaque événement avec groupIndex et groupSize
    groups.forEach((group) => {
      const groupSize = group.length;
      group.forEach((event, indexInGroup) => {
        enrichedEvents.push({
          ...event,
          groupIndex: indexInGroup,
          groupSize: groupSize,
        });
      });
    });

    return enrichedEvents;
  };

  // Fonction de détection de chevauchements
  const isOverlapping = (event1: Event, event2: Event): boolean => {
    const start1 = new Date(event1.start).getTime();
    const end1 = new Date(event1.end).getTime();
    const start2 = new Date(event2.start).getTime();
    const end2 = new Date(event2.end).getTime();

    return start1 < end2 && start2 < end1;
  };

  // Pré-calcul des chevauchements avec useMemo
  const enrichedEvents = useMemo(
    () => groupOverlappingEvents(events),
    [events]
  );

  // Sélection de la vue
  const renderView = () => {
    switch (view) {
      case "day":
        return <DayView events={enrichedEvents} />;
      case "week":
        return <WeekView events={enrichedEvents} />;
      case "month":
        return <MonthView events={enrichedEvents} />;
      default:
        return <WeekView events={enrichedEvents} />;
    }
  };

  return (
    <div className="flex size-full items-center justify-center">
      <div className="w-4/5 rounded-lg shadow-md">
        {/* Barre de navigation */}
        <div className="sticky top-0 z-10 mb-4 flex items-center justify-between bg-white p-4 shadow-sm">
          <h2 className="text-xl font-bold">Calendrier</h2>
          <div className="flex space-x-2">
            <Button onClick={() => setView("day")}>Journée</Button>
            <Button onClick={() => setView("week")}>Semaine</Button>
            <Button onClick={() => setView("month")}>Mois</Button>
          </div>
        </div>
        {/* Affichage de la vue */}
        <div>{renderView()}</div>
      </div>
    </div>
  );
}
