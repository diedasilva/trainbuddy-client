"use client";
import React, { useState } from "react";
import { Event } from "@/utils/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// DataPicker dependencies
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover_SheetEventCard";
import { format } from "date-fns";
import { CalendarIcon, Save } from "lucide-react";
import { TimePicker } from "@/components/common/timepicker/time-picker";
import { fr } from "date-fns/locale";

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
  // Utiliser les dates de l'événement parent s'il existe, sinon utiliser l'événement enfant
  const actualEvent = parentEvent || eventData;
  
  const [start, setStart] = useState<Date>(new Date(actualEvent.start));
  const [end, setEnd] = useState<Date>(new Date(actualEvent.end));
  const [allDay, setAllDay] = useState<boolean>(actualEvent.allDay || false);
  const [formData, setFormData] = useState({
    title: actualEvent.title,
    description: actualEvent.description || ""
  });

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setStart(date);
      // Si la date de fin est antérieure à la nouvelle date de début, la mettre à jour
      if (end < date) {
        setEnd(date);
      }
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date && date >= start) {
      setEnd(date);
    }
  };

  const handleSave = () => {
    // Préparer les données à mettre à jour
    const updatedEvent = {
      ...actualEvent,
      title: formData.title,
      description: formData.description,
      start: start.toISOString(),
      end: end.toISOString(),
      allDay: allDay
    };

    console.log("Event updated:", updatedEvent);
    // Ici vous pouvez appeler votre fonction de mise à jour
  };

  // Déterminer si on doit afficher la date de fin
  const showEndDate = !allDay || start.toDateString() !== end.toDateString();

  return (
    <Sheet>
      <SheetTrigger asChild className="cursor-pointer">
        {trigger}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <div id="popover-container"></div>
        <SheetHeader>
          <SheetTitle>Modifier l&apos;événement</SheetTitle>
          <SheetDescription>
            Modifiez les détails de votre événement
          </SheetDescription>
        </SheetHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Titre
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="col-span-3"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="allDay"
              checked={allDay}
              onCheckedChange={(checked) => setAllDay(checked as boolean)}
            />
            <Label htmlFor="allDay" className="text-sm font-medium">
              Toute la journée
            </Label>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              {showEndDate ? "Date de début" : "Date"}
            </Label>
            <div className="col-span-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !start && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {start ? (
                      allDay ? (
                        format(start, "PPP", { locale: fr })
                      ) : (
                        format(start, "PPP HH:mm", { locale: fr })
                      )
                    ) : (
                      <span>Sélectionner une date</span>
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
                    onSelect={handleStartDateChange}
                    locale={fr}
                    initialFocus
                  />
                  {!allDay && (
                    <div className="border-t border-border p-3">
                      <TimePicker setDate={handleStartDateChange} date={start} />
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Afficher la date de fin seulement si l'événement s'étend sur plusieurs jours ou n'est pas allDay */}
          {showEndDate && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                {!allDay ? "Date de fin" : "Date de fin"}
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !end && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {end ? (
                        allDay ? (
                          format(end, "PPP", { locale: fr })
                        ) : (
                          format(end, "PPP HH:mm", { locale: fr })
                        )
                      ) : (
                        <span>Sélectionner une date</span>
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
                      onSelect={handleEndDateChange}
                      locale={fr}
                      initialFocus
                    />
                    {!allDay && (
                      <div className="border-t border-border p-3">
                        <TimePicker setDate={handleEndDateChange} date={end} />
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </div>
        
        <SheetFooter className="flex gap-2">
          <Button onClick={handleSave} className="gap-2">
            <Save className="size-4" />
            Sauvegarder
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
