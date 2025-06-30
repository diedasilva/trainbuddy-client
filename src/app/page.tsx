"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackgroundPattern } from "@/components/ui/background-pattern";
import {
  Calendar,
  Clock,
  MapPin,
  Activity,
  HeartPulse,
  Trophy,
  Users,
  ArrowRight,
  CalendarDays,
  Zap,
} from "lucide-react";
import React, { useMemo } from "react";
import { useNextThreeEvents } from "@/hooks/events";
import { useUpcomingMediaEvents } from "@/hooks/mediaEvents";
import { useStatistics } from "@/hooks/statistics";
import { TableData } from "@/lib/mockDb";

export default function HomePage() {
  const {
    events: communityEvents,
    loading: communityEventsLoading,
    error: communityEventsError,
  } = useNextThreeEvents();

  const {
    mediaEvents,
    loading: mediaEventsLoading,
    error: mediaEventsError,
  } = useUpcomingMediaEvents();

  const { stats, loading: statsLoading, error: statsError } = useStatistics();

  const isLoading =
    communityEventsLoading || mediaEventsLoading || statsLoading;
  const pageError = communityEventsError || mediaEventsError || statsError;

  console.log("HomePage events state:", {
    events: communityEvents,
    loading: communityEventsLoading,
    error: communityEventsError,
  });

  // Événements de la communauté à venir
  const upcomingCommunityEvents = useMemo(() => {
    if (!communityEvents) return [];

    return communityEvents.map((event: TableData) => {
      const dateObj = new Date(event.start as string);
      const formattedDate = dateObj.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      const formattedTime = dateObj.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        id: String(event.id),
        title: String(event.title),
        formattedDate,
        formattedTime,
        location: String(event.location),
        type: String(event.type),
        participants: Number(event.participants) || 0,
        difficulty: "N/A",
      };
    });
  }, [communityEvents]);

  // Événements Média à venir
  const upcomingMediaEvents = useMemo(() => {
    if (!mediaEvents) return [];

    return mediaEvents.map((event: TableData) => {
      const a = event.startDate as string;
      const date = new Date(a).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
      const time = new Date(a).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        id: String(event.id),
        title: String(event.title),
        date: date,
        time: time,
        location: String(event.location),
        type: String(event.type),
        participants: Number(event.attendees) || 0,
        difficulty: "N/A",
      };
    });
  }, [mediaEvents]);

  // Statistiques utilisateur
  const userStats = useMemo(() => {
    if (!stats || !stats.global) return [];

    const globalStats = stats.global as Record<string, number>;

    return [
      {
        label: "Séances",
        value: String(globalStats.totalSessions ?? 0),
        icon: CalendarDays,
        color: "text-slate-600",
      },
      {
        label: "Activités",
        value: String(globalStats.totalActivities ?? 0),
        icon: Activity,
        color: "text-slate-600",
      },
      {
        label: "Groupes",
        value: String(globalStats.totalGroups ?? 0),
        icon: Users,
        color: "text-slate-600",
      },
      {
        label: "Compétitions",
        value: String(globalStats.totalCompetitions ?? 0),
        icon: Trophy,
        color: "text-slate-600",
      },
    ];
  }, [stats]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-32 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-4 text-lg text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg text-red-600">Erreur: {pageError}</p>
          <Button onClick={() => window.location.reload()}>Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section avec gradient et animation */}
      <section className="relative overflow-hidden px-4 py-20 text-center md:px-8">
        <div className="relative z-10">
          <div className="mb-6">
            <Badge className="mb-4 rounded-sm border-0 bg-primary text-primary-foreground">
              <Zap className="mr-1 size-3" />
              Nouveau : Défis communautaires
            </Badge>
          </div>

          <h1 className="mb-6 text-5xl font-bold text-foreground md:text-6xl">
            Qu&apos;est-ce qui vous motive aujourd&apos;hui&nbsp;?
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-muted-foreground">
            Rejoignez une communauté passionnée et transformez vos objectifs
            fitness en réalité. Choisissez votre parcours : santé, défis,
            communauté...
          </p>

          <div className="mb-12 flex flex-wrap justify-center gap-4">
            <Link href="/health-programs">
              <Button
                size="lg"
                className="rounded-full bg-primary px-8 py-3 text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/90 hover:shadow-xl"
              >
                <HeartPulse className="mr-2 size-5" />
                Programmes Santé
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/competitions">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-primary px-8 py-3 text-primary shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/5 hover:shadow-xl"
              >
                <Trophy className="mr-2 size-5" />
                Compétitions & Défis
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/community">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-2 border-slate-400 px-8 py-3 text-slate-600 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-slate-50 hover:shadow-xl"
              >
                <Users className="mr-2 size-5" />
                Communauté
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistiques utilisateur */}
      <section className="px-4 py-8 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {userStats.map((stat) => (
              <Card
                key={stat.label}
                className="border border-border bg-card/80 p-6 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-secondary">
                  <stat.icon className={`size-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Événements de la communauté à venir */}
      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-foreground">
                Prochaines activités de la communauté
              </h2>
              <p className="text-muted-foreground">
                Ne manquez pas ces opportunités de vous dépasser
              </p>
            </div>
            <Link href="/calendar">
              <Button
                variant="outline"
                className="rounded-full border-2 border-primary px-6 text-primary hover:bg-primary/5"
              >
                <Calendar className="mr-2 size-4" />
                Voir le calendrier
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingCommunityEvents.map((event) => (
              <Card
                key={event.id}
                className="group overflow-hidden border border-border bg-card/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative">
                  <div className="absolute right-4 top-4 z-10">
                    <Badge
                      className={`${
                        event.type === "group"
                          ? "bg-primary"
                          : event.type === "activity"
                            ? "bg-secondary"
                            : "bg-accent"
                      } rounded-sm border-0 text-primary-foreground`}
                    >
                      {event.type === "group"
                        ? "Groupe"
                        : event.type === "activity"
                          ? "Activité"
                          : "Compétition"}
                    </Badge>
                  </div>

                  <div className="flex h-32 items-center justify-center bg-gradient-to-br from-secondary to-muted">
                    <div className="text-4xl opacity-20">
                      {event.type === "group"
                        ? "👥"
                        : event.type === "activity"
                          ? "🏃"
                          : "🏆"}
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="mb-3 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                    {event.title}
                  </h3>

                  <div className="mb-4 space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-3 size-4 text-slate-500" />
                      {event.formattedDate}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-3 size-4 text-slate-500" />
                      {event.formattedTime}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-3 size-4 text-slate-500" />
                      {event.location}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="mr-2 size-4 text-slate-500" />
                        {event.participants} participants
                      </div>
                      <Badge variant="secondary" className="rounded-sm text-xs">
                        {event.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <Button className="w-full transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    Voir les détails
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Événements Média à venir */}
      <section className="bg-muted/40 px-4 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-foreground">
                Événements et conférences à ne pas manquer
              </h2>
              <p className="text-muted-foreground">
                Restez à la pointe de l&apos;innovation et du savoir
              </p>
            </div>
            <Link href="/media-events">
              <Button
                variant="outline"
                className="rounded-full border-2 border-primary px-6 text-primary hover:bg-primary/5"
              >
                <Calendar className="mr-2 size-4" />
                Voir tous les événements
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingMediaEvents.map((event) => (
              <Card
                key={event.id}
                className="group overflow-hidden border border-border bg-card/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative">
                  <div className="absolute right-4 top-4 z-10">
                    <Badge className="rounded-sm border-0 bg-accent capitalize text-primary-foreground">
                      {event.type}
                    </Badge>
                  </div>

                  <div className="flex h-32 items-center justify-center bg-gradient-to-br from-secondary to-muted">
                    <div className="text-4xl opacity-20">
                      {event.type === "conference"
                        ? "🎤"
                        : event.type === "webinar"
                          ? "💻"
                          : event.type === "podcast"
                            ? "🎧"
                            : "✨"}
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="mb-3 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                    {event.title}
                  </h3>

                  <div className="mb-4 space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-3 size-4 text-slate-500" />
                        {event.date}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-3 size-4 text-slate-500" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-3 size-4 text-slate-500" />
                      {event.location}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="mr-2 size-4 text-slate-500" />
                        {event.participants} participants
                      </div>
                    </div>
                  </div>

                  <Button className="w-full transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    Voir les détails
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
