"use client";
import React, { useState } from "react";
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

// DataPicker dependencies
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover_SheetEventCard";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { TimePicker } from "@/components/common/timepicker/time-picker";
import { fr } from "date-fns/locale";
import { Input } from "../ui/input";

interface SheetEventCardProps {
  eventData: Event;
  trigger: React.ReactNode;
  parentEvent?: Event;
}

export default function SheetEventCard({
  eventData,
  trigger,
  parentEvent,
}: SheetEventCardProps) {

  const [start, setStart] = useState(() => {
    if (parentEvent) {
      return new Date(parentEvent.start);
    }
    return eventData.start ? new Date(eventData.start) : new Date();
  });

  const [end, setEnd] = useState(() => {
    if (parentEvent) {
      return new Date(parentEvent.end);
    }
    return eventData.end ? new Date(eventData.end) : new Date();
  });
  
  if (!eventData) return null; // Évite de rendre la Sheet sans données
  
  const allDay = parentEvent?.allDay || eventData.allDay;
  //console.log("parentEvent",parentEvent);
  //console.log(start, end);

  const handleSave = () => {
    // Préparer les données à mettre à jour
    const updatedEvent = {
      ...eventData,
      start: start.toISOString(),
      end: end.toISOString(),
    };

    // Si c'est un enfant, mettez à jour le parent
    if (parentEvent) {
      const updatedParent = {
        ...parentEvent,
        start: start.toISOString(),
        end: end.toISOString(),
      };

      // Appeler la fonction de mise à jour avec le parent
      //updateEvent(updatedParent);
    } else {
      // Sinon, mettez à jour directement l'événement
      //updateEvent(updatedEvent);
    }
  };

  return (
    <Sheet>
      {/* Gère l'état ouvert */}
      <SheetTrigger asChild className="cursor-pointer">
        {trigger}
      </SheetTrigger>
      <SheetContent>
        <div id="popover-container"></div>
        <SheetHeader>
          <SheetTitle>Edit event</SheetTitle>
          <SheetDescription>{eventData.title}</SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="col-span-1">Start:</label>
            <div className="my-1 grid items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !start && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {start ? (
                      allDay && !parentEvent ? (
                        format(start, "PPP", { locale: fr })
                      ) : (
                        format(start, "PPP HH':'mm", { locale: fr })
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="z-[1050] w-auto p-0"
                  align="start"
                  containerId="popover-container"
                >
                  <Calendar
                    mode="single"
                    selected={start}
                    onSelect={setStart}
                    locale={fr}
                    initialFocus
                  />
                  {/* TimePicker only if allDay = false*/}
                  {!allDay && !parentEvent && (
                    <div className="border-t border-border p-3">
                      <TimePicker setDate={setStart} date={start} />
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="col-span-1">End:</label>
            <div className="my-1 grid items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "justify-start text-left font-normal",
                      !end && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon />
                    {end ? (
                      allDay && !parentEvent ? (
                        format(end, "PPP", { locale: fr })
                      ) : (
                        format(end, "PPP HH':'mm", { locale: fr })
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="z-[1050] w-auto p-0"
                  align="start"
                  containerId="popover-container"
                >
                  <Calendar
                    mode="single"
                    selected={end}
                    onSelect={setEnd}
                    locale={fr}
                    initialFocus
                  />
                  {/* TimePicker only if allDay = false*/}
                  {!allDay && !parentEvent && (
                    <div className="border-t border-border p-3">
                      <TimePicker setDate={setEnd} date={end} />
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {
            !parentEvent && (
              <div className="grid grid-cols-4 items-center gap-4">
              <label className="col-span-1">AllDay:</label>
              <span className="col-span-3">
                {eventData.allDay ? "Yes" : "No"}
              </span>
            </div>
            )
          }
        </div>
        <Input type="email" id="email" placeholder="Description" value={eventData.description} />
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" className="m-4">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
