import React, { useState } from "react";
import { Event } from "@/utils/types";
import EventCard from "./EventCard";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

type MonthViewProps = {
  events: Event[];
};

export default function MonthView({ events }: MonthViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePreviousMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // Recup the last day of the month
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const daysInMonth = Array.from(
    { length: endOfMonth.getDate() },
    (_, i) => new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1)
  );

  return (
    <div className="grid-row-2 relative grid shadow-md">
      <div className="col-span-1 row-span-1 flex justify-between border-b p-2">
        <Button onClick={handlePreviousMonth} variant="default">
          <ChevronLeft /> Précédent
        </Button>
        <div className="p-2 text-center font-bold uppercase">
          {currentDate.toLocaleDateString("fr-FR", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <Button onClick={handleNextMonth}>
          Suivant <ChevronRight />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {daysInMonth.map((day) => (
          <div
            key={day.toDateString()}
            className="relative min-h-24 border p-2"
          >
            <div className="font-bold">{day.getDate()}</div>
            {events
              .filter(
                (event) =>
                  new Date(event.start).toDateString() === day.toDateString()
              )
              .map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  view="month"
                  type="simple"
                />
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
