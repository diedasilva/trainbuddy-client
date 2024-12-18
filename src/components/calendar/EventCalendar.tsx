import { useEffect } from "react";

type Event = {
  id: number;
  title: string;
  start: string; // Date ISO pour FullCalendar
  end: string;
  allDay: boolean;
  groupIndex?: number;
  groupSize?: number;
};

type EventCalendarProps = {
  event: Event;
  view: "month" | "week" | "day";
};


export default function EventCalendar({ event, view }: EventCalendarProps) {
  useEffect(() => {
    // Calculer l'ID de la cellule correspondant à l'événement
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    console.log("Event start:", eventStart.toLocaleTimeString());
    const formattedStart = `${eventStart.getFullYear()}-${(eventStart.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${eventStart
      .getDate()
      .toString()
      .padStart(2, "0")}_${eventStart.getHours().toString().padStart(2, "0")}:00`;

    // Retrouver la cellule dans la grille
    const cell = document.getElementById(formattedStart);
    console.log("Cellule trouvée no timeout:", formattedStart, cell);


    if (cell) {
        // Récupérer la hauteur de la cellule en pixels
        const cellHeight = cell.getBoundingClientRect().height;
        
        // Calcul de la durée
        const duration = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60); // Durée en minutes

        // Calcul du décalage vertical (top)
        const startMinutes = eventStart.getMinutes();
        const top = (startMinutes / 60) * 100; // Proportion des minutes dans une heure (en %)

        // Calcul de la hauteur (height)
        const height = (duration / 60) * cellHeight; // Proportion de la durée par rapport à une heure (en pixels)

        const width = event.groupSize && event.groupSize > 1 ? 100 / event.groupSize : 100;
        const left = (event.groupSize ?? 1) > 1 ? (event.groupIndex ?? 0) * width : 0;
        console.log("Top :", top, "Height :", height);

        // Création de l'élément événement
        const eventElement = document.createElement("div");
        eventElement.textContent = event.title;
        eventElement.className =
        "absolute rounded bg-blue-500 text-white p-1 text-sm";
        eventElement.style.position = "absolute";
        eventElement.style.top = `${top}%`;
        eventElement.style.height = `${height}px`;
        eventElement.style.left = `${left}%`;
        eventElement.style.width = `${width}%`;
        eventElement.style.zIndex = "1";

        // Ajouter l'événement dans la cellule
        cell.appendChild(eventElement);
    }
  }, [event]);

  return null; // Le rendu se fait dynamiquement dans le DOM
}
