import React, { memo } from "react";
import { ChildEvent, Event } from "@/utils/types";
import SheetEventCard from "./SheetEventCard";

interface EventCardProps {
  event: Event | ChildEvent;
  view: "day" | "week" | "month";
  parentEvent?: Event; // Ajoutez cette prop
}

export default memo(function EventCard({
  event,
  view,
  parentEvent,
}: EventCardProps) {
  // Calcul des styles pour positionner l'événement
  const calculateStyles = (evt: Event) => {
    if (parentEvent) {
      evt.title = parentEvent.title;
      evt.color = parentEvent.color;
    }

    const start = new Date(evt.start);
    const end = new Date(evt.end);
    
    // Calcul de la position top basé sur l'heure de début
    const top = view === "day"
      ? (start.getHours() + start.getMinutes() / 60) * (100 / 24) // 24 heures = 100%
      : (start.getMinutes() / 60) * 100; // Vue semaine: minutes dans l'heure
    
    // Calcul de la hauteur basé sur la durée
    const durationInHours = (end.getTime() - start.getTime()) / 3600000;
    const height = view === "day"
      ? durationInHours * (100 / 24) // 24 heures = 100%
      : durationInHours * 8; // Vue semaine: hauteur en vh comme avant
    
    const isAllDay = evt.allDay === true;
    const width = isAllDay ? 20 : evt.groupSize ? 100 / evt.groupSize : 100;
    const left = isAllDay
      ? 0
      : evt.groupIndex != null
        ? evt.groupIndex * width
        : 0;
    const verticalTextStyle =
      (evt.groupSize ?? 1) > 1 && view === "week"
        ? {
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            whiteSpace: "nowrap",
          }
        : null;

    return {
      top: `${top}%`,
      height: view === "day" ? `${height}%` : `${height}vh`, // % pour day, vh pour week
      left: `${left}%`,
      width: `${width}%`,
      zIndex: isAllDay ? 10 : 1,
      backgroundColor: evt.color,
      ...(verticalTextStyle || {}),
    };
  };

  const styles = calculateStyles(event);

  const renderEventTrigger = (evt: Event) => {
    if (parentEvent) {
      evt.title = parentEvent.title;
      evt.color = parentEvent.color; //#475569
    }

    if (evt.allDay || view === "month") {
      const triggerDiv =
        view === "day" ? (
          <span
            className={`mx-1 rounded p-1 text-xs text-white`}
            style={{ backgroundColor: evt.color }}
          >
            {evt.title}
          </span>
        ) : (
          <div
            className={`my-1 rounded p-1 text-xs text-white`}
            style={{ backgroundColor: evt.color }}
          >
            {evt.title}
          </div>
        );
      return (
        <SheetEventCard
          key={evt.id}
          eventData={evt}
          trigger={triggerDiv}
          parentEvent={parentEvent}
        />
      );
    }
    const actualStart = parentEvent?.start ?? evt.start;
    const actualEnd = parentEvent?.end ?? evt.end;
    
    const triggerDiv = (
      <div
        className={`absolute rounded p-1 text-xs text-white`}
        style={styles as React.CSSProperties}
      >
        {evt.title} : <br />
        {new Date(actualStart).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}
        to{" "}
        {new Date(actualEnd).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    );
    return (
      <SheetEventCard
        key={evt.id}
        eventData={evt}
        trigger={triggerDiv}
        parentEvent={parentEvent}
      />
    );
  };

  return renderEventTrigger(event);
});
