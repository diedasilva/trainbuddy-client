import React from "react";
import EventCard from "./EventCard";
import { Event } from "@/utils/types";

type DayViewProps = {
  events: Event[];
};

export default function DayView({ events }: DayViewProps) {
  const hours = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );

  const currentDate = events.length ? new Date(events[0].start) : new Date();

  return (
    <div className="grid-row-2 relative grid border-l">
      {/* En-tête et first row*/}
      <div className="col-span-1 row-span-1 border-b p-2">
        <div className="p-2 text-center font-bold">
          {currentDate.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </div>
        {events
          .filter((event) => event.allDay && new Date(event.start).toDateString() === currentDate.toDateString())
          .map((event) => { 
                //If they are many event of all day we can display them in a row
                return(
                    <span key={event.id} className="mx-1 rounded bg-blue-300 p-1 text-white">
                        {event.title}
                    </span>
                )
            })
        }
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
              .filter((events) => !events.allDay && new Date(events.start).toDateString() === currentDate.toDateString())
              .map((event) => (
                <EventCard key={event.id} event={event} view="day" />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
