import React from "react";
import { Event } from "@/utils/types";
import SheetEventCard from "./SheetEventCard";

type EventCardProps = {
  event: Event;
  view: "day" | "week" | "month";
  type?: "simple";
};

export default function EventCard({ event, view, type }: EventCardProps) {
  // Init dates
  const start = new Date(event.start);
  const end = new Date(event.end);

  // Top and height
  const top =
    view === "day"
      ? (start.getHours() + start.getMinutes() / 60) * 100
      : (start.getMinutes() / 60) * 100;
  const height = ((end.getTime() - start.getTime()) / 3600000) * 100;

  // Check if event is all day
  const isAllDay = event.allDay === true;

  // Width and left
  const width = isAllDay ? 20 : event.groupSize ? 100 / event.groupSize : 100;
  const left = isAllDay
    ? 0
    : event.groupIndex != null
      ? event.groupIndex * width
      : 0;

  //
  const verticalTextStyle =
    (event.groupSize ?? 1) > 1 && view === "week"
      ? {
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          whiteSpace: "nowrap",
        }
      : null;

  const colors = [
    "bg-cyan-700",
    "bg-teal-500",
    "bg-emerald-400",
    "bg-red-400",
    "bg-amber-400",
  ];

  const backgroundColor =
    colors[event.groupIndex != null ? event.groupIndex % colors.length : 0];

  if (type === "simple") {
    const triggerDiv =
      view === "day" ? (
        <span
          className={`mx-1 rounded p-1 text-xs text-white ${backgroundColor}`}
        >
          {event.title}
        </span>
      ) : (
        <div
          className={`my-1 rounded p-1 text-xs text-white ${backgroundColor}`}
        >
          {event.title}
        </div>
      );
    return <SheetEventCard eventData={event} trigger={triggerDiv} />;
  }
  const triggerDiv = (
    <div
      className={`absolute rounded p-1 text-xs text-white ${backgroundColor}`}
      style={
        {
          top: isAllDay ? "0%" : `${top}%`,
          height: isAllDay ? "auto" : `${height}%`,
          left: `${left}%`,
          width: `${width}%`,
          zIndex: isAllDay ? 10 : 1,
          ...(verticalTextStyle || {}),
        } as React.CSSProperties
      }
    >
      {event.title} : <br />
      {start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} to{" "}
      {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </div>
  );

  return <SheetEventCard eventData={event} trigger={triggerDiv} />;
}
