import React, { useState } from "react";
import EventCard from "./EventCard";
import { Event } from "@/utils/types";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

type DayViewProps = {
  events: Event[];
};

export default function DayView({ events }: DayViewProps) {
  const hours = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );

  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePreviousDay = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });
  };

  const handleNextDay = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });
  };

  return (
    <div className="grid-row-2 relative grid">
      {/* En-tête et navigation */}
      <div className="col-span-1 row-span-1 flex items-center justify-between border-b p-2">
        <Button onClick={handlePreviousDay} variant="default">
          <ChevronLeft /> Précédent
        </Button>
        <div className="p-2 text-center font-bold uppercase">
          {currentDate.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </div>
        <Button onClick={handleNextDay}>
          Suivant <ChevronRight />
        </Button>
      </div>
      {/* Event All-day*/}
      <div className="col-span-1 row-span-1 border-b p-2">
        {events
          .filter(
            (event) =>
              event.allDay &&
              new Date(event.start).toDateString() ===
                currentDate.toDateString()
          )
          .map((event) => {
            return (
              <EventCard
                key={event.id}
                event={event}
                view="day"
                type="simple"
              />
            );
          })}
      </div>
      {/* Colonne des heures */}
      <div className="row-span-1 grid grid-cols-[auto_1fr]">
        <div className="border-r">
          {hours.map((hour, index) => (
            <div key={index} className="relative h-[calc(110vh/24)]">
              <div className="absolute right-0 top-0 translate-y-[-50%] p-2 text-right">
                {hour}
              </div>
            </div>
          ))}
        </div>

        {/* Colonne des événements */}
        <div className="relative">
          {hours.map((_, index) => (
            <div
              key={index}
              className="relative h-[calc(110vh/24)] border-b border-r"
            ></div>
          ))}
          <div className="absolute left-0 top-0 h-[calc(110vh/24)] w-full">
            {events
              .filter(
                (events) =>
                  !events.allDay &&
                  new Date(events.start).toDateString() ===
                    currentDate.toDateString()
              )
              .map((event) => (
                <EventCard key={event.id} event={event} view="day" />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
