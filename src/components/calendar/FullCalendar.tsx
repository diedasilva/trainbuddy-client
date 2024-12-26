import React, { useState, useEffect, useMemo } from "react";
import DayView from "./DayView";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import { Event } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { preprocessEvents, groupOverlappingEvents} from "@/utils/eventUtils";

export default function FullCalendar() {
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<"day" | "week" | "month">("week");

  // Charger les événements
  useEffect(() => {
    fetch("/events.json")
      .then((res) => res.json())
      .then((data) => {
        const processedEvents = preprocessEvents(data);
        setEvents(processedEvents);
      })
      .catch((err) => console.error("Erreur de chargement :", err));
  }, []);

  // Pré-calcul des chevauchements avec useMemo
  const enrichedEvents = useMemo(
    () => groupOverlappingEvents(events),
    [events]
  );
  console.log("Événements enrichis :", enrichedEvents);

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
    <div className="flex size-full justify-center">
      <div className="w-4/5 rounded-lg">
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
        {renderView()}
      </div>
    </div>
  );
}
