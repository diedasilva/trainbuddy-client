import React from "react";
import EventCard from "./EventCard";
import { Event } from "@/utils/types";

type WeekViewProps = {
  events: Event[];
};

export default function WeekView({ events }: WeekViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);
  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - day.getDay() + i + 1); // Lundi au Dimanche
    return day;
  });

  return (
    <div className="relative box-border grid grid-cols-8 border-l border-t">
      {/* En-tête */}
      <div></div>
      {days.map((day, index) => (
        <div key={index} className="box-border border-b p-2 text-center font-bold">
            {day.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric" })}
            {/* Affichage des événements qui dure toute la journée */}
            <div className="relative mt-1">
                {events
                    .filter(
                    (event) =>
                        new Date(event.start).toDateString() === day.toDateString() && event.allDay
                    )
                    .map((event) => (
                        <div key={event.id} className="mt-1 rounded bg-blue-500 p-1 text-xs text-white">
                          {event.title}
                        </div>
                    ))}
            </div>
        </div>
      ))}

      {/* Grille */}
      {hours.map((hour, hourIndex) => (
        <React.Fragment key={hour}>
          <div className="relative h-16 border-r text-right">
            <div className="absolute right-0 top-0 translate-y-[-50%] p-2 text-right">
                {hour}
            </div>
          </div>
          {days.map((day, dayIndex) => (
            <div key={`${hourIndex}-${dayIndex}`} className="relative box-border h-16 border-b border-r">
              {/* Placement des événements */}
              {events
                .filter((event) => new Date(event.start).toDateString() === day.toDateString() && new Date(event.start).getHours() === hourIndex && !event.allDay)
                .map((event) => (
                  <EventCard key={event.id} event={event} view="week"/>
                ))}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
