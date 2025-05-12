"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
// import { useSession } from "next-auth/react"; // Désactivé pour l'instant car pas d'auth NextAuth
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Share,
  MapPin,
  CalendarDays,
  Bell,
  FileText,
  Info,
} from "lucide-react";
import Chart from "@/components/chart/Chart";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface GroupDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function GroupDetailsPage({ params }: GroupDetailsPageProps) {
  // const { data: session } = useSession();
  // const currentUserId = session?.user?.id;
  // TODO: remplacer currentUserId par ton propre hook d'authentification
  const currentUserId = "";
  const { id } = React.use(params);
  const router = useRouter();

  const [group, setGroup] = useState<any>(null);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    fetch(`/api/groups/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setGroup(data);
        // Vérifie si l'utilisateur est membre
        setIsMember(data.members.some((m: any) => m.id === currentUserId));
      })
      .catch(() => {
        // Données factices en fallback
        const dummy = {
          id,
          name: "Fitness Squad",
          description: "A group for fitness enthusiasts",
          status: "Private",
          coverUrl: "/images/cover.jpg",
          avatarUrl: "/images/avatar.jpg",
          nextWorkout: {
            date: "Dec 29, 2024",
            type: "Strength",
            duration: "1h",
          },
          workoutHistory: [
            { date: "Dec 20", type: "HIIT", duration: "45min" },
            { date: "Dec 22", type: "Yoga", duration: "1h" },
          ],
          groupStats: [
            { name: "Total Sessions", value: 24 },
            { name: "Avg Duration (min)", value: 55 },
          ],
          groupProgress: [
            { name: "Week 1", numberWorkouts: 5 },
            { name: "Week 2", numberWorkouts: 6 },
            { name: "Week 3", numberWorkouts: 7 },
            { name: "Week 4", numberWorkouts: 8 },
          ],
          attendanceTrend: [
            { name: "Jan", value: 80 },
            { name: "Feb", value: 75 },
            { name: "Mar", value: 85 },
            { name: "Apr", value: 90 },
          ],
          upcomingEvents: [
            {
              id: "e1",
              imageUrl: "/images/cover.jpg",
              title: "Marathon",
              date: "May 20, 2025",
              location: "Park",
            },
            {
              id: "e2",
              imageUrl: "/images/cover.jpg",
              title: "Yoga Retreat",
              date: "June 15, 2025",
              location: "Beach",
            },
            {
              id: "e3",
              imageUrl: "/images/cover.jpg",
              title: "Pilates Workshop",
              date: "July 10, 2025",
              location: "Studio",
            },
          ],
          resources: [
            { id: "r1", title: "Workout Plan.pdf", url: "/files/plan.pdf" },
            { id: "r2", title: "Nutrition Guide.pdf", url: "/files/guide.pdf" },
            {
              id: "r3",
              title: "Stretching Routine.pdf",
              url: "/files/stretch.pdf",
            },
          ],
          members: [
            { id: currentUserId, name: "You", isAdmin: false },
            { id: "m1", name: "Alice", isAdmin: true },
            { id: "m2", name: "Bob", isAdmin: false },
            { id: "m3", name: "Charlie", isAdmin: false },
          ],
        };
        setGroup(dummy);
        setIsMember(true);
      });
  }, [id, currentUserId]);

  if (!group) return <div className="p-8">Loading...</div>;

  // Définition des onglets publics et privés
  const publicTabs = ["about", "stats", "members"];
  const privateTabs = ["attendance", "events", "resources"];
  const tabs = isMember ? [...publicTabs, ...privateTabs] : publicTabs;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-3xl font-bold">{group.name}</h1>
        <Button variant="outline">
          <Share />
        </Button>
      </div>

      {/* Cover + Avatar */}
      {group.coverUrl && (
        <div className="relative h-56 overflow-hidden rounded-xl shadow-md">
          <Image
            src={group.coverUrl}
            alt="Cover"
            fill
            className="object-cover"
          />
          {group.avatarUrl && (
            <div className="absolute bottom-2 left-4">
              <Image
                src={group.avatarUrl}
                alt="Avatar"
                width={96}
                height={96}
                className="rounded-full border-2 border-white shadow-lg"
              />
            </div>
          )}
        </div>
      )}

      {/* Statut & Description */}
      <div className="flex items-center space-x-4">
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            group.status === "Public"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {group.status}
        </span>
        <Button size="sm" variant="ghost">
          <Bell /> Notifications
        </Button>
      </div>
      <p className="text-gray-600">{group.description}</p>

      {/* Tabs */}
      <Tabs defaultValue={tabs[0]}>
        <TabsList className="mb-4 grid grid-cols-3 rounded-lg bg-gray-50 sm:grid-cols-6">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="py-2 text-center capitalize hover:bg-gray-100"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* À propos */}
        <TabsContent value="about">
          <Card className="flex flex-col space-y-4 p-6 shadow-lg transition-shadow duration-200 hover:shadow-xl">
            <div className="flex items-center space-x-3">
              <Info className="text-2xl text-indigo-500" />
              <h2 className="text-2xl font-semibold">À propos du groupe</h2>
            </div>
            <p className="leading-relaxed text-gray-700">{group.description}</p>
          </Card>
        </TabsContent>

        {/* Stats publiques */}
        <TabsContent value="stats" className="space-y-2">
          <Chart
            type="bar"
            data={group.groupStats}
            min={0}
            dataKey="value"
            title="Group Stats"
          />
          <Chart
            type="line"
            data={group.groupProgress}
            dataKey="numberWorkouts"
            title="Progress Over Time"
          />
        </TabsContent>

        {/* Membres */}
        <TabsContent value="members">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {group.members.map((m: any) => (
              <Card
                key={m.id}
                className="flex flex-col items-center p-4 transition-shadow hover:shadow-lg"
              >
                <Avatar className="mb-4 size-24">
                  {m.avatarUrl ? (
                    <AvatarImage src={m.avatarUrl} alt={m.name} />
                  ) : (
                    <AvatarFallback>{m.name.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <p className="text-lg font-semibold">{m.name}</p>
                {m.isAdmin && (
                  <span className="mt-1 text-sm text-blue-600">Admin</span>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Attendance privée */}
        {isMember && (
          <TabsContent value="attendance">
            <Chart
              type="line"
              data={group.attendanceTrend}
              dataKey="value"
              max={100}
              min={0}
              title="Attendance"
            />
          </TabsContent>
        )}

        {/* Événements privés */}
        {tabs.includes("events") && (
          <TabsContent value="events">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.upcomingEvents.map((e) => (
                <Card
                  key={e.id}
                  className="flex flex-col overflow-hidden shadow-lg transition-shadow duration-200 hover:shadow-xl"
                >
                  {/* Illustration */}
                  <div className="relative h-32 bg-gray-100">
                    {e.imageUrl ? (
                      <Image
                        src={e.imageUrl}
                        alt={e.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <CalendarDays className="text-gray-300" size={48} />
                      </div>
                    )}
                  </div>

                  {/* Contenu */}
                  <CardContent className="my-2 flex-1">
                    <CardTitle className="mb-2 text-lg font-semibold">
                      {e.title}
                    </CardTitle>
                    <div className="mb-1 flex items-center text-sm text-gray-600">
                      <CalendarDays className="mr-2" size={16} />
                      <time dateTime={e.date}>{e.date}</time>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="mr-2" size={16} />
                      {e.location}
                    </div>
                  </CardContent>

                  {/* Action */}
                  <div className="border-t border-gray-100 p-4 text-right">
                    {isMember ? (
                      <Button variant="outline" size="sm">
                        Je participe
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" disabled>
                        Réservé aux membres
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}

        {/* Ressources privées */}
        {tabs.includes("resources") && (
          <TabsContent value="resources">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.resources.map((r: any) => (
                <Card
                  key={r.id}
                  className="flex flex-col justify-between p-4 transition-shadow duration-200 hover:shadow-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="text-indigo-500" size={24} />
                    <div>
                      <h4 className="text-lg font-semibold">{r.title}</h4>
                      {r.size && (
                        <p className="text-sm text-gray-500">{r.size}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      as="a"
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Télécharger
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
