import React, { useState } from "react";
import EventCard from "./EventCard";
import { Event } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

type WeekViewProps = {
  events: Event[];
};

export default function WeekView({ events }: WeekViewProps) {
  const hours = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );

  const [currentDate, setCurrentDate] = useState(new Date());

  // Fonction pour passer à la semaine précédente
  const handlePreviousWeek = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 7); // Reculer de 7 jours
      return newDate;
    });
  };

  // Fonction pour passer à la semaine suivante
  const handleNextWeek = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 7); // Avancer de 7 jours
      return newDate;
    });
  };

  // Calcul des jours de la semaine actuelle
  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(currentDate);
    day.setDate(day.getDate() - day.getDay() + i + 1); // Lundi au Dimanche
    return day;
  });

  return (
    <div className="grid-row-2 relative grid shadow-md">
      <div className="col-span-1 ml-28 flex justify-between p-2">
        <Button onClick={handlePreviousWeek} variant="default">
          <ChevronLeft /> Précédent
        </Button>
        <div className="p-2 text-center font-bold uppercase">
            {currentDate.toLocaleDateString("fr-FR", {
              month: "long",
              year: "numeric",
            })}
        </div>
        <Button onClick={handleNextWeek}>
          Suivant <ChevronRight />
        </Button>
      </div>
      <div className="relative box-border grid grid-cols-8">
        {/* En-tête avec une colonne vide pour les heures */}
        <div className="box-border"></div>
        {days.map((day, index) => (
          <div
            key={index}
            className="box-border border p-2 text-center font-bold"
          >
            {day.toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "numeric",
            })}
            {/* Affichage des événements toute la journée */}
            <div className="relative mt-1 border-t">
              {events
                .filter(
                  (event) =>
                    new Date(event.start).toDateString() ===
                      day.toDateString() && event.allDay
                )
                .map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    view="week"
                    type="simple"
                  />
                ))}
            </div>
          </div>
        ))}

        {/* Grille */}
        {hours.map((hour, hourIndex) => (
          <React.Fragment key={hour}>
            {/* Colonne des horaires */}
            <div className="relative h-16 border-r text-right">
              <div className="absolute right-0 top-0 translate-y-[-50%] p-2">
                {hour}
              </div>
            </div>
            {/* Colonnes des jours */}
            {days.map((day, dayIndex) => (
              <div
                key={`${hourIndex}-${dayIndex}`}
                className="relative box-border h-16 border-b border-r"
              >
                {/* Placement des événements */}
                {events
                  .filter(
                    (event) =>
                      new Date(event.start).toDateString() ===
                        day.toDateString() &&
                      new Date(event.start).getHours() === hourIndex &&
                      !event.allDay
                  )
                  .map((event) => (
                    <EventCard key={event.id} event={event} view="week" />
                  ))}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
