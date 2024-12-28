import React from "react";
import { ChildEvent, Event } from "@/utils/types";
import SheetEventCard from "./SheetEventCard";


interface EventCardProps {
  event: Event | ChildEvent;
  view: "day" | "week" | "month";
  parentEvent?: Event; // Ajoutez cette prop
}

export default function EventCard({ event, view, parentEvent }: EventCardProps) {
  // Gestion des couleurs
  const colors = [
    "bg-cyan-700",
    "bg-teal-500",
    "bg-emerald-400",
    "bg-red-400",
    "bg-amber-400",
  ];

  const backgroundColor =
    colors[event.groupIndex != null ? event.groupIndex % colors.length : 0];

  // Calcul des styles pour positionner l'événement
  const calculateStyles = (evt: Event) => {
    const start = new Date(evt.start);
    const end = new Date(evt.end);
    const top =
      view === "day"
        ? (start.getHours() + start.getMinutes() / 60) * 100
        : (start.getMinutes() / 60) * 100;
    const height = ((end.getTime() - start.getTime()) / 3600000) * 8;
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
      height: `${height}vh`,
      left: `${left}%`,
      width: `${width}%`,
      zIndex: isAllDay ? 10 : 1,
      ...(verticalTextStyle || {}),
    };
  };

  const styles = calculateStyles(event);

  const renderEventTrigger = (evt: Event) => {
    if(parentEvent){
      evt.title = parentEvent.title;
    }

    if (evt.allDay || view ==="month") {
      const triggerDiv =
        view === "day" ? (
          <span
            className={`mx-1 rounded p-1 text-xs text-white ${backgroundColor}`}
          >
            {evt.title}
          </span>
        ) : (
          <div
            className={`my-1 rounded p-1 text-xs text-white ${backgroundColor}`}
          >
            {evt.title}
          </div>
        );
      return <SheetEventCard key={evt.id} eventData={evt} trigger={triggerDiv} parentEvent={parentEvent} />;
    }

    const triggerDiv = (
      <div
        className={`absolute rounded p-1 text-xs text-white ${backgroundColor}`}
        style={styles as React.CSSProperties}
      >
        {evt.title} : <br />
        {new Date(evt.start).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
        {" "}to {new Date(evt.end).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    );
    return <SheetEventCard key={evt.id} eventData={evt} trigger={triggerDiv} parentEvent={parentEvent} />;
  };
  
  return renderEventTrigger(event);
}
