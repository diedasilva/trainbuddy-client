import React from "react";
import { Event } from "@/utils/types";

type EventCardProps = {
  event: Event;
  view: "day" | "week" | "month";
};

export default function EventCard({ event, view }: EventCardProps) {
    const start = new Date(event.start);
    const end = new Date(event.end);

    const top =
    view === "day"
        ? (start.getHours() + start.getMinutes() / 60) * 100
        : (start.getMinutes() / 60) * 100;
    const height = ((end.getTime() - start.getTime()) / 3600000) * 100;

    const isAllDay = event.allDay === true;

    // Largeur et position horizontale
    const width = isAllDay ? 20 : event.groupSize ? 100 / event.groupSize : 100;
    const left = isAllDay
    ? 0
    : event.groupIndex != null
        ? event.groupIndex * width
        : 0;
    // Styles conditionnels pour le texte vertical
    const verticalTextStyle =
        (event.groupSize ?? 1) > 1 && view === "week"
            ? {
                writingMode: "vertical-rl",
                textOrientation: "mixed",
                whiteSpace: "nowrap",
            }
            : null;

        
    const colors = [
        "bg-blue-500",
        "bg-red-500",
        "bg-yellow-500",
        "bg-purple-500",
        "bg-pink-500",
    ];

    const backgroundColor =
    colors[event.groupIndex != null ? event.groupIndex % colors.length : 0];

    console.log(event);
    console.log(top, height, left, width);
    return (
    <div
        className={`absolute rounded p-1 text-xs text-white ${backgroundColor}`}
        style={{
        top: isAllDay ? "0%" : `${top}%`,
        height: isAllDay ? "auto" : `${height}%`,
        left: `${left}%`,
        width: `${width}%`,
        zIndex: isAllDay ? 10 : 1,
        ...(verticalTextStyle || {}),
        } as React.CSSProperties}
    >
        {event.title} : <br/>
        {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} to {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}


    </div>
    );
}
