import React, { useState, useEffect, useMemo } from "react";
import DayView from "./DayView";
import WeekView from "./WeekView";
import MonthView from "./MonthView";
import { Event } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { preprocessEvents, groupOverlappingEvents} from "@/utils/eventUtils";

interface FullCalendarProps {
  filteredEvents?: Event[];
  loading?: boolean;
}

export default function FullCalendar({ filteredEvents, loading = false }: FullCalendarProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<"day" | "week" | "month">("week");

  // Charger les événements si aucun n'est fourni en props
  useEffect(() => {
    if (!filteredEvents) {
    fetch("/mocks/events.json")
      .then((res) => res.json())
      .then((data) => {
        const processedEvents = preprocessEvents(data);
        // Transformer l'id en string
        processedEvents.forEach((event) => {
          event.id = event.id.toString();
          if (event.children) {
            event.children.forEach((child) => {
              child.id = child.id.toString();
            });
          }
        });
        setEvents(processedEvents);
      })
      .catch((err) => console.error("Erreur de chargement :", err));
    }
  }, [filteredEvents]);

  // Utiliser les événements filtrés si fournis, sinon utiliser les événements locaux
  const eventsToUse = filteredEvents || events;

  // Pré-calcul des chevauchements avec useMemo
  const enrichedEvents = useMemo(() => {
    // Si on a des événements filtrés, on doit les traiter avec preprocessEvents
    // car ils viennent directement du JSON sans traitement
    const processedEvents = filteredEvents 
      ? preprocessEvents(filteredEvents)
      : eventsToUse;
    
    return groupOverlappingEvents(processedEvents);
  }, [eventsToUse, filteredEvents]);
  console.log("Événements enrichis :", enrichedEvents);

  // Sélection de la vue
  const renderView = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      );
    }

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
          <div>
            <h2 className="text-xl font-bold">Calendrier</h2>
          </div>
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
