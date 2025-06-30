"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import FullCalendar from "@/components/calendar/FullCalendar"
import { Event } from "@/utils/types"
import { 
  Calendar, 
  Plus, 
  Filter, 
  Search, 
  Users, 
  Clock, 
  TrendingUp,
  CalendarIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/calendar/popover_SheetEventCard"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { TimePicker } from "@/components/common/timepicker/time-picker"

interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  start: string;
  end: string;
  allDay: boolean;
  location?: string;
  createdBy: string;
  color: string;
}

interface Session {
  id: number;
  title: string;
  location: string;
  type: string;
  scheduledAt: string;
  createdBy: number;
  groupId: number | null;
  coachId: number | null;
  status: string;
  details: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

interface Chart {
  id: number;
  title: string;
  description: string;
  userId: number | null;
  groupId: number | null;
  config: {
    type: string;
    xAxis: string;
    yAxis: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function CalendarPage() {
  const [activeTab, setActiveTab] = useState("calendar")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showSearchDialog, setShowSearchDialog] = useState(false)
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [sessions, setSessions] = useState<Session[]>([])
  const [charts, setCharts] = useState<Chart[]>([])
  const [filters, setFilters] = useState({
    eventType: "",
    dateRange: "",
    location: "",
    createdBy: ""
  })
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    type: "workout",
    location: "",
    allDay: false,
    start: new Date(),
    end: new Date(Date.now() + 60 * 60 * 1000) // +1 heure par défaut
  })

  // Charger les données depuis les fichiers JSON
  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsRes, sessionsRes, chartsRes] = await Promise.all([
          fetch("/mocks/events.json"),
          fetch("/mocks/sessions.json"),
          fetch("/mocks/charts.json")
        ]);
        
        const eventsData = await eventsRes.json();
        const sessionsData = await sessionsRes.json();
        const chartsData = await chartsRes.json();
        
        setEvents(eventsData);
        setSessions(sessionsData);
        setCharts(chartsData);
        setLoading(false);
      } catch (err) {
        console.error("Erreur de chargement des données:", err);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Calculer les statistiques d'activité basées sur les sessions
  const activityStats = {
    workoutSessions: sessions.filter(s => s.type === 'workout' || s.type === 'musculation').length,
    trainingSessions: sessions.filter(s => s.type === 'tennis' || s.type === 'boxe').length,
    cardioSessions: sessions.filter(s => s.type === 'cardio' || s.type === 'natation').length,
    yogaSessions: sessions.filter(s => s.type === 'yoga' || s.type === 'pilates').length
  };

  // Calculer les objectifs mensuels (simulation)
  const monthlyGoals = {
    workout: { current: activityStats.workoutSessions, target: 20 },
    training: { current: activityStats.trainingSessions, target: 15 },
    cardio: { current: activityStats.cardioSessions, target: 10 },
    yoga: { current: activityStats.yogaSessions, target: 12 }
  };

  // Fonction d'invitation
  const handleSendInvite = () => {
    if (inviteEmail) {
      // Simuler l'envoi d'invitation
      alert(`Invitation envoyée à ${inviteEmail}`);
      setInviteEmail("");
      setShowInviteDialog(false);
    }
  };

  // Fonction pour créer un nouvel événement
  const handleCreateEvent = useCallback(() => {
    if (eventForm.title.trim()) {
      // Construire les dates de début et fin
      let startDateTime: string;
      let endDateTime: string;

      if (eventForm.allDay) {
        // Pour les événements toute la journée, utiliser seulement la date
        startDateTime = eventForm.start.toISOString().split('T')[0];
        endDateTime = eventForm.end.toISOString().split('T')[0];
      } else {
        // Pour les événements normaux, combiner date et heure
        startDateTime = eventForm.start.toISOString();
        endDateTime = eventForm.end.toISOString();
      }

      const newEvent: CalendarEvent = {
        id: Date.now(), // ID unique basé sur le timestamp
        title: eventForm.title,
        description: eventForm.description,
        start: startDateTime,
        end: endDateTime,
        allDay: eventForm.allDay,
        location: eventForm.location || undefined,
        createdBy: "Utilisateur actuel",
        color: "#3B82F6" // Couleur par défaut
      };

      // Ajouter le nouvel événement à la liste
      setEvents(prevEvents => [...prevEvents, newEvent]);
      
      // Réinitialiser le formulaire
      setEventForm({ 
        title: "", 
        description: "", 
        type: "workout", 
        location: "", 
        allDay: false, 
        start: new Date(), 
        end: new Date(Date.now() + 60 * 60 * 1000) 
      });
      setShowCreateDialog(false);
      
      // Feedback utilisateur
      alert(`Événement "${newEvent.title}" créé avec succès !`);
    } else {
      alert("Veuillez saisir un titre pour l'événement.");
    }
  }, []);

  // Fonction pour ouvrir le modal de recherche
  const handleSearchEvents = () => {
    setShowSearchDialog(true);
  };

  // Fonction pour ouvrir le modal d'invitation
  const handleInviteFriends = () => {
    setShowInviteDialog(true);
  };

  // Fonction de recherche dans les événements
  const searchResults = searchQuery 
    ? events.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        event.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Appliquer les filtres aux événements
  const filteredEvents = events.filter(event => {
    if (filters.eventType && !event.title.toLowerCase().includes(filters.eventType.toLowerCase())) {
      return false;
    }
    if (filters.location && event.location && !event.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.createdBy && !event.createdBy.toLowerCase().includes(filters.createdBy.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Convertir les événements filtrés au format attendu par FullCalendar
  const calendarEvents: Event[] = filteredEvents.map(event => ({
    id: event.id.toString(),
    title: event.title,
    description: event.description,
    start: event.start,
    end: event.end,
    allDay: event.allDay,
    color: event.color,
    createdBy: event.createdBy
  }));

  // Filtrer les événements à venir avec les filtres appliqués
  const upcomingEvents = filteredEvents
    .filter(event => {
      const eventDate = new Date(event.start);
      console.log(eventDate);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
      
      // Inclure les événements du jour actuel et des 30 prochains jours
      return eventDate >= today && eventDate <= thirtyDaysFromNow;
    })
    .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
    .slice(0, 6); // Limiter à 6 événements

  // Filtrer les événements en cours
  const ongoingEvents = filteredEvents
    .filter(event => {
      const eventStartDate = new Date(event.start);
      const eventEndDate = new Date(event.end);
      const now = new Date();
      
      if (event.allDay) {
        // Pour les événements allDay, vérifier si on est dans la période
        const eventStartDay = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth(), eventStartDate.getDate());
        const eventEndDay = new Date(eventEndDate.getFullYear(), eventEndDate.getMonth(), eventEndDate.getDate());
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return eventStartDay <= today && eventEndDay >= today;
      } else {
        // Pour les événements avec heure, vérifier si on est dans la période
        return eventStartDate <= now && eventEndDate >= now;
      }
    })
    .sort((a, b) => new Date(a.end).getTime() - new Date(b.end).getTime());

  // Calculer les types d'événements basés sur les vrais événements
  const eventTypes = [
    { name: "Cardio", count: events.filter(e => e.title.toLowerCase().includes('cardio')).length, color: "bg-blue-100 text-blue-800" },
    { name: "Yoga", count: events.filter(e => e.title.toLowerCase().includes('yoga')).length, color: "bg-purple-100 text-purple-800" },
    { name: "Musculation", count: events.filter(e => e.title.toLowerCase().includes('musculation')).length, color: "bg-green-100 text-green-800" },
    { name: "Pilates", count: events.filter(e => e.title.toLowerCase().includes('pilates')).length, color: "bg-pink-100 text-pink-800" },
    { name: "Natation", count: events.filter(e => e.title.toLowerCase().includes('natation')).length, color: "bg-cyan-100 text-cyan-800" },
    { name: "Boxe", count: events.filter(e => e.title.toLowerCase().includes('boxe')).length, color: "bg-red-100 text-red-800" }
  ].filter(type => type.count > 0).sort((a, b) => b.count - a.count);

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Planning</h1>
          <p className="text-slate-600">Gérez votre planning fitness et vos événements</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="size-4" />
            {showFilters ? "Masquer" : "Afficher"} les filtres
          </Button>
          <Button className="gap-2" onClick={() => setShowCreateDialog(true)}>
            <Plus className="size-4" />
            Créer un événement
          </Button>
        </div>
      </div>

      {/* Filtres en temps réel */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="size-5" />
              Filtres
            </CardTitle>
            <CardDescription>Filtrez vos événements en temps réel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="filterEventType">Type d&apos;événement</Label>
                <Input
                  id="filterEventType"
                  placeholder="Ex: Cardio, Yoga, Musculation"
                  value={filters.eventType}
                  onChange={(e) => setFilters(prev => ({ ...prev, eventType: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filterLocation">Lieu</Label>
                <Input
                  id="filterLocation"
                  placeholder="Ex: Studio A, Salle de sport"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="filterCreatedBy">Créé par</Label>
                <Input
                  id="filterCreatedBy"
                  placeholder="Nom du créateur"
                  value={filters.createdBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, createdBy: e.target.value }))}
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <div className="text-sm text-slate-600">
                {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} trouvé{filteredEvents.length > 1 ? 's' : ''}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setFilters({ eventType: "", dateRange: "", location: "", createdBy: "" });
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de création d'événement */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <div id="popover-container"></div>
          <DialogHeader>
            <DialogTitle>Créer un nouvel événement</DialogTitle>
            <DialogDescription>
              Ajoutez un nouvel événement à votre calendrier
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Titre
              </Label>
              <Input
                id="title"
                placeholder="Nom de l&apos;événement"
                value={eventForm.title}
                onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Description de l&apos;événement"
                value={eventForm.description}
                onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                className="col-span-3"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Lieu
              </Label>
              <Input
                id="location"
                placeholder="Lieu de l&apos;événement"
                value={eventForm.location}
                onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                className="col-span-3"
              />
            </div>
            
            {/* Date et heure de début */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                {!eventForm.allDay ? "Début" : "Date"}
              </Label>
              <div className="col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !eventForm.start && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 size-4" />
                      {eventForm.start ? (
                        eventForm.allDay ? (
                          format(eventForm.start, "PPP", { locale: fr })
                        ) : (
                          format(eventForm.start, "PPP HH:mm", { locale: fr })
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
                    <CalendarComponent
                      mode="single"
                      selected={eventForm.start}
                      onSelect={(date) => {
                        if (date) {
                          setEventForm(prev => ({ ...prev, start: date }));
                          // Si la date de fin est antérieure à la nouvelle date de début, la mettre à jour
                          if (eventForm.end < date) {
                            setEventForm(prev => ({ ...prev, end: date }));
                          }
                        }
                      }}
                      locale={fr}
                      initialFocus
                    />
                    {!eventForm.allDay && (
                      <div className="border-t border-border p-3">
                        <TimePicker 
                          setDate={(date) => {
                            if (date) {
                              setEventForm(prev => ({ ...prev, start: date }));
                            }
                          }} 
                          date={eventForm.start} 
                        />
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {/* Date et heure de fin */}
            {!eventForm.allDay && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Fin</Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !eventForm.end && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {eventForm.end ? (
                          format(eventForm.end, "PPP HH:mm", { locale: fr })
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
                      <CalendarComponent
                        mode="single"
                        selected={eventForm.end}
                        onSelect={(date) => {
                          if (date && date >= eventForm.start) {
                            setEventForm(prev => ({ ...prev, end: date }));
                          }
                        }}
                        locale={fr}
                        initialFocus
                      />
                      <div className="border-t border-border p-3">
                        <TimePicker 
                          setDate={(date) => {
                            if (date) {
                              setEventForm(prev => ({ ...prev, end: date }));
                            }
                          }} 
                          date={eventForm.end} 
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allDay"
                checked={eventForm.allDay}
                onCheckedChange={(checked) => setEventForm(prev => ({ ...prev, allDay: checked as boolean }))}
              />
              <Label htmlFor="allDay" className="text-sm font-medium">
                Toute la journée
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateEvent}>
              Créer l&apos;événement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger 
            value="calendar" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Calendar className="mr-2 size-4" />
            Vue calendrier
          </TabsTrigger>
          <TabsTrigger 
            value="upcoming" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Clock className="mr-2 size-4" />
            Événements à venir
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <TrendingUp className="mr-2 size-4" />
            Analyses
          </TabsTrigger>
        </TabsList>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardContent>
              <FullCalendar filteredEvents={calendarEvents} loading={loading} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upcoming Events Tab */}
        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Upcoming Events List */}
            <Card>
              <CardHeader>
                <CardTitle>Événements à venir</CardTitle>
                <CardDescription>Vos prochaines activités programmées</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex animate-pulse items-center justify-between rounded-lg border border-slate-200 p-4">
                        <div className="flex items-center space-x-4">
                          <div className="size-12 rounded-full bg-slate-200"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 w-3/4 rounded bg-slate-200"></div>
                            <div className="h-3 w-1/2 rounded bg-slate-200"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50">
                        <div className="flex items-center space-x-4">
                          <div className="flex size-12 items-center justify-center rounded-full bg-slate-100">
                            <Calendar className="size-6 text-slate-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900">{event.title}</h3>
                            <div className="mt-1 flex items-center space-x-4 text-sm text-slate-600">
                              <span>{new Date(event.start).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{event.allDay ? "Toute la journée" : new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {event.location && (
                                <>
                                  <span>•</span>
                                  <span>{event.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            className="mb-2"
                            style={{ backgroundColor: event.color + '20', color: event.color }}
                          >
                            {event.title.split(' ')[0]}
                          </Badge>
                          <div className="text-sm text-slate-600">
                            {event.createdBy}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Calendar className="mx-auto mb-4 size-12 text-slate-400" />
                    <h3 className="mb-2 text-lg font-semibold text-slate-900">
                      Aucun événement à venir
                    </h3>
                    <p className="text-slate-600">
                      Aucun événement n&apos;est prévu dans les 30 prochains jours.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Event Types Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Types d&apos;événements</CardTitle>
                <CardDescription>Répartition de vos activités programmées</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex animate-pulse items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-6 w-16 rounded bg-slate-200"></div>
                          <div className="h-4 w-24 rounded bg-slate-200"></div>
                        </div>
                        <div className="text-right">
                          <div className="h-4 w-8 rounded bg-slate-200"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {eventTypes.map((type) => (
                      <div key={type.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge className={type.color}>
                            {type.name}
                          </Badge>
                          <span className="text-sm text-slate-600">séances {type.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-slate-900">{type.count}</div>
                          <div className="text-sm text-slate-600">événements</div>
                        </div>
                      </div>
                    ))}
                    {eventTypes.length === 0 && (
                      <div className="py-4 text-center text-slate-500">
                        Aucun type d&apos;événement trouvé
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Ongoing Events Section */}
          {ongoingEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="size-3 animate-pulse rounded-full bg-green-500"></div>
                  Événements en cours
                </CardTitle>
                <CardDescription>Événements actuellement en cours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ongoingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 transition-colors hover:bg-green-100">
                      <div className="flex items-center space-x-4">
                        <div className="flex size-12 items-center justify-center rounded-full bg-green-100">
                          <div className="size-3 animate-pulse rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{event.title}</h3>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-slate-600">
                            <span>Début: {new Date(event.start).toLocaleDateString()}</span>
                            {!event.allDay && (
                              <span>{new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            )}
                            <span>•</span>
                            <span className="font-medium text-green-600">
                              Fin: {new Date(event.end).toLocaleDateString()}
                              {!event.allDay && (
                                <span> {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              )}
                            </span>
                            {event.location && (
                              <>
                                <span>•</span>
                                <span>{event.location}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          className="mb-2 bg-green-100 text-green-800"
                          style={{ backgroundColor: event.color + '20', color: event.color }}
                        >
                          {event.title.split(' ')[0]}
                        </Badge>
                        <div className="text-sm text-slate-600">
                          {event.createdBy}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Monthly Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Vue d&apos;ensemble mensuelle</CardTitle>
                <CardDescription>Vos habitudes d&apos;activité ce mois-ci</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="h-4 w-24 rounded bg-slate-200"></div>
                          <div className="h-4 w-16 rounded bg-slate-200"></div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Séances d&apos;entraînement</span>
                      <span className="text-sm text-slate-600">{monthlyGoals.workout.current} / {monthlyGoals.workout.target}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200">
                      <div 
                        className="h-2 rounded-full bg-slate-900" 
                        style={{ width: `${Math.min((monthlyGoals.workout.current / monthlyGoals.workout.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Séances d&apos;entraînement</span>
                      <span className="text-sm text-slate-600">{monthlyGoals.training.current} / {monthlyGoals.training.target}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200">
                      <div 
                        className="h-2 rounded-full bg-slate-900" 
                        style={{ width: `${Math.min((monthlyGoals.training.current / monthlyGoals.training.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Séances cardio</span>
                      <span className="text-sm text-slate-600">{monthlyGoals.cardio.current} / {monthlyGoals.cardio.target}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200">
                      <div 
                        className="h-2 rounded-full bg-slate-900" 
                        style={{ width: `${Math.min((monthlyGoals.cardio.current / monthlyGoals.cardio.target) * 100, 100)}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Séances yoga</span>
                      <span className="text-sm text-slate-600">{monthlyGoals.yoga.current} / {monthlyGoals.yoga.target}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200">
                      <div 
                        className="h-2 rounded-full bg-slate-900" 
                        style={{ width: `${Math.min((monthlyGoals.yoga.current / monthlyGoals.yoga.target) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Charts Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Graphiques disponibles</CardTitle>
                <CardDescription>Vos analyses et insights</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="mb-2 h-4 w-3/4 rounded bg-slate-200"></div>
                        <div className="h-3 w-1/2 rounded bg-slate-200"></div>
                      </div>
                    ))}
                  </div>
                ) : charts.length > 0 ? (
                  <div className="space-y-4">
                    {charts.map((chart) => (
                      <div key={chart.id} className="rounded-lg border border-slate-200 p-3 transition-colors hover:bg-slate-50">
                        <h4 className="font-medium text-slate-900">{chart.title}</h4>
                        <p className="mt-1 text-sm text-slate-600">{chart.description || `Type de graphique: ${chart.config.type}`}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {chart.config.type}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {new Date(chart.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-slate-500">
                    Aucun graphique disponible
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
              <CardDescription>Opérations courantes du calendrier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Dialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="h-auto flex-col gap-2 p-4"
                      onClick={handleSearchEvents}
                    >
                      <Search className="size-5" />
                      <span className="text-sm">Rechercher des événements</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Rechercher des événements</DialogTitle>
                      <DialogDescription>
                        Trouvez rapidement vos événements
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="searchQuery">Recherche</Label>
                        <Input
                          id="searchQuery"
                          placeholder="Rechercher par titre, description, lieu ou créateur..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      {searchQuery && (
                        <div className="space-y-2">
                          <Label>Résultats ({searchResults.length})</Label>
                          <div className="max-h-64 space-y-2 overflow-y-auto">
                            {searchResults.length > 0 ? (
                              searchResults.map((event) => (
                                <div key={event.id} className="rounded-lg border p-3 hover:bg-slate-50">
                                  <h4 className="font-medium">{event.title}</h4>
                                  <p className="text-sm text-slate-600">{event.description}</p>
                                  <div className="mt-1 flex items-center gap-4 text-xs text-slate-500">
                                    <span>{new Date(event.start).toLocaleDateString()}</span>
                                    {event.location && <span>• {event.location}</span>}
                                    <span>• {event.createdBy}</span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="py-4 text-center text-slate-500">
                                Aucun événement trouvé
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setSearchQuery("")}>
                        Effacer
                      </Button>
                      <Button onClick={() => setShowSearchDialog(false)}>
                        Fermer
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="h-auto flex-col gap-2 p-4"
                      onClick={handleInviteFriends}
                    >
                      <Users className="size-5" />
                      <span className="text-sm">Inviter des amis</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Inviter des amis</DialogTitle>
                      <DialogDescription>
                        Partagez votre calendrier avec vos amis
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="inviteEmail">Email</Label>
                        <Input
                          id="inviteEmail"
                          type="email"
                          placeholder="email@exemple.com"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Permissions</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="viewEvents" defaultChecked />
                            <Label htmlFor="viewEvents" className="text-sm">
                              Voir les événements
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="editEvents" />
                            <Label htmlFor="editEvents" className="text-sm">
                              Modifier les événements
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="createEvents" />
                            <Label htmlFor="createEvents" className="text-sm">
                              Créer des événements
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleSendInvite} disabled={!inviteEmail}>
                        Envoyer l&apos;invitation
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
