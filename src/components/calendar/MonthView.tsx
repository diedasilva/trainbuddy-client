import React from "react";
import { Event } from "@/utils/types";

type MonthViewProps = {
  events: Event[];
};

export default function MonthView({ events }: MonthViewProps) {
  const today = new Date();
  //const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const daysInMonth = Array.from({ length: endOfMonth.getDate() }, (_, i) => new Date(today.getFullYear(), today.getMonth(), i + 1));

  return (
    <div className="grid grid-cols-7 gap-1">
      {daysInMonth.map((day) => (
        <div key={day.toDateString()} className="relative min-h-24 border p-2">
          <div className="font-bold">{day.getDate()}</div>
          {events
            .filter((event) => new Date(event.start).toDateString() === day.toDateString())
            .map((event) => (
              <div key={event.id} className="mt-1 rounded bg-blue-500 p-1 text-xs text-white">
                {event.title}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
