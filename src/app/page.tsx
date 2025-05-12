"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, isAfter, parseISO } from "date-fns";
import {fr} from "date-fns/locale/fr";

// Typescript interfaces
interface UserScore {
  name: string;
  score: number;
}

interface Group {
  id: string;
  name: string;
  status: "Public" | "Private";
  admin: string;
  workoutCount: number;
  lastActivity: string;
  data: UserScore[];
}

interface EventItem {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
}

// Sample groups data
const groups: Group[] = [
  {
    id: "1",
    name: "Fitness Squad",
    status: "Private",
    admin: "Alice",
    workoutCount: 12,
    lastActivity: "2024-12-25",
    data: [
      { name: "Alice", score: 60 },
      { name: "Bob", score: 95 },
      { name: "Charlie", score: 70 },
    ],
  },
  {
    id: "2",
    name: "Yoga Lovers",
    status: "Public",
    admin: "Denise",
    workoutCount: 8,
    lastActivity: "2024-12-22",
    data: [
      { name: "Denise", score: 80 },
      { name: "Ethan", score: 75 },
      { name: "Flora", score: 90 },
    ],
  },
  {
    id: "3",
    name: "Pilates Crew",
    status: "Public",
    admin: "Gina",
    workoutCount: 8,
    lastActivity: "2024-12-22",
    data: [
      { name: "Gina", score: 65 },
      { name: "Henry", score: 100 },
      { name: "Iris", score: 80 },
    ],
  },
];

export default function HomePage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [showAllEvents, setShowAllEvents] = useState(false);

  useEffect(() => {
    fetch("/events.json")
      .then((res) => res.json())
      .then((data: EventItem[]) => setEvents(data))
      .catch((err: Error) => console.error("Erreur de chargement :", err));
  }, []);

  const now = new Date();
  const upcomingEvents = events.filter((event) => isAfter(parseISO(event.start), now));
  const displayedEvents = showAllEvents ? upcomingEvents : upcomingEvents.slice(0, 3);

  return (
    <main className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Groupes publics */}
      <section>
        <h2 className="text-xl font-bold mb-4">Groupes publics</h2>
        <div className="grid grid-cols-2 gap-4">
          {groups.filter((g) => g.status === "Public").map((group) => (
            <div
              key={group.id}
              className="p-4 rounded-lg shadow bg-gray-100 cursor-pointer hover:bg-gray-200"
              onClick={() => router.push(`/groups/${group.id}`)}
            >
              <h3 className="font-semibold text-lg">{group.name}</h3>
              <p className="text-sm text-gray-600">
                Admin : {group.admin} – {group.workoutCount} séances
              </p>
              <p className="text-xs text-gray-500">
                Dernière activité : {group.lastActivity}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Événements */}
      <section>
        <h2 className="text-xl font-bold mb-4">Événements</h2>
        <div className="space-y-4">
          {displayedEvents.map((event) => {
            const startDate = parseISO(event.start);
            const endDate = parseISO(event.end);
            const startLabel = format(startDate, "d MMM", { locale: fr });
            const endLabel = format(endDate, "d MMM", { locale: fr });
            const startTime = format(startDate, "HH:mm", { locale: fr });
            const endTime = format(endDate, "HH:mm", { locale: fr });

            return (
              <div key={event.id} className="flex items-center gap-4 border p-4 rounded-lg">
                {/* Date affichée */}
                <div className="text-center">
                  <p className="font-bold text-xl">{startLabel.split(" ")[0]}</p>
                  <p className="text-sm text-gray-600">{startLabel.split(" ")[1]}</p>
                </div>
                {/* Détails de l'événement */}
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-gray-500">
                    Du {startLabel}{!event.allDay && ` à ${startTime}`}<br/>
                    Au {endLabel}{!event.allDay && ` à ${endTime}`}
                  </p>
                </div>
              </div>
            );
          })}
          {upcomingEvents.length > 4 && (
            <div className="text-center">
              <button
                onClick={() => setShowAllEvents(!showAllEvents)}
                className="text-blue-600 hover:underline mt-2"
              >
                {showAllEvents ? "Afficher moins" : "Afficher plus ↓"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Actualités */}
      <section className="col-span-1 lg:col-span-2">
        <h2 className="text-xl font-bold mb-4">Actualités</h2>
        <ul className="space-y-3">
          {[
            { time: "il y a 2 h", likes: 15, comments: 3 },
            { time: "il y a 5 h", likes: 8, comments: 2 },
            { time: "hier", likes: 12, comments: 4 },
          ].map((news, i) => (
            <li key={i} className="p-4 border rounded-lg flex justify-between items-center">
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <div className="text-sm text-gray-500 space-x-2">
                <span>{news.time}</span>
                <span>👍 {news.likes}</span>
                <span>💬 {news.comments}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Sports en tendances */}
      <section className="col-span-1 lg:col-span-2">
        <h2 className="text-xl font-bold mb-4">Sports en tendances</h2>
        <div className="flex gap-6">
          {[
            { name: "Football", icon: "⚽" },
            { name: "Tennis", icon: "🎾" },
            { name: "Cyclisme", icon: "🚴" },
            { name: "Natation", icon: "🏊" },
          ].map((sport, i) => (
            <div key={i} className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
              <span className="text-3xl">{sport.icon}</span>
              <span className="text-sm mt-2">{sport.name}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
