import React from "react";
import { Event } from "@/utils/types";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface SheetEventCardProps {
  eventData: Event;
  trigger: React.ReactNode;
}

export default function SheetEventCard({
  eventData,
  trigger,
}: SheetEventCardProps) {
  if (!eventData) return null; // Évite de rendre la Sheet sans données

  const start = new Date(eventData.start);
  const end = new Date(eventData.end);

  return (
    <Sheet>
      {/* Gère l'état ouvert */}
      <SheetTrigger asChild className="cursor-pointer">
        {trigger}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit event</SheetTitle>
          <SheetDescription>{eventData.title}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="col-span-1">Start:</label>
            <input
              id="start"
              defaultValue={start.toLocaleString()}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="col-span-1">End:</label>
            <input
              id="end"
              value={end.toLocaleString()}
              className="col-span-3"
              readOnly
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="col-span-1">AllDay:</label>
            <span className="col-span-3">
              {eventData.allDay ? "Yes" : "No"}
            </span>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/*
            <div>
              Start: {start.toLocaleString()} <br />
              End: {end.toLocaleString()} <br />
              All Day: {eventData.allDay ? "Yes" : "No"}
            </div>
*/
