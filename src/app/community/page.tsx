"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Chart from "@/components/chart/Chart";
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  TrendingUp, 
  Award,
  MapPin,
  Clock,
  Activity,
  Crown,
  CheckCircle,
  Shield
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

// Types explicites
interface Stat {
  label: string;
  value: number | string;
  icon: string;
  trend: string;
}
interface Forum {
  title: string;
  description: string;
  members: number;
  topics: number;
  lastActivity: string;
  category: string;
  trending: boolean;
}
interface Event {
  title: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  maxParticipants: number;
  category: string;
  type: string;
}
interface Group {
  id: string | number;
  name: string;
  status: string;
  admin: string;
  members: number;
  lastActivity: string;
  category: string;
  description: string;
  achievements: string[];
  joinRequests: number;
}
interface ChartData {
  name: string;
  members?: number;
  events?: number;
  groups?: number;
  value?: number;
  color?: string;
  [key: string]: unknown;
}

const iconMap = {
  Users,
  MessageCircle,
  Calendar,
  Award,
};

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [stats, setStats] = useState<Stat[]>([]);
  const [communityGrowthData, setCommunityGrowthData] = useState<ChartData[]>([]);
  const [activityDistributionData, setActivityDistributionData] = useState<ChartData[]>([]);
  const [topForums, setTopForums] = useState<Forum[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [featuredGroups, setFeaturedGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Fetch stats
      const statsRes = await fetch("/mocks/statistics.json");
      const statsJson = await statsRes.json();
      setStats([
        { label: "Membres actifs", value: statsJson.global.totalUsers, icon: "Users", trend: "+12%" },
        { label: "Forums actifs", value: statsJson.global.totalForums, icon: "MessageCircle", trend: "+5%" },
        { label: "Événements ce mois", value: statsJson.global.upcomingSessions, icon: "Calendar", trend: "+8%" },
        { label: "Groupes créés", value: statsJson.global.totalGroups, icon: "Award", trend: "+15%" }
      ]);
      // Fetch charts
      const chartsRes = await fetch("/mocks/communityCharts.json");
      const chartsJson = await chartsRes.json();
      setCommunityGrowthData((chartsJson.find((c: { id: string }) => c.id === "growth") as { data: ChartData[] }).data as ChartData[]);
      setActivityDistributionData((chartsJson.find((c: { id: string }) => c.id === "activityDistribution") as { data: ChartData[] }).data as ChartData[]);
      // Fetch forums
      const forumsRes = await fetch("/mocks/forums.json");
      setTopForums(await forumsRes.json());
      // Fetch events
      const eventsRes = await fetch("/mocks/events.json");
      const eventsJson = await eventsRes.json();
      setUpcomingEvents((eventsJson as Event[]).filter((e: Event) => e.participants && e.maxParticipants && e.type));
      // Fetch groups
      const groupsRes = await fetch("/mocks/groups.json");
      const groupsJson = await groupsRes.json();
      setFeaturedGroups((groupsJson as Group[]).filter((g: Group) => g.achievements && g.joinRequests));
      setLoading(false);
    }
    fetchData();
  }, []);

  // Callbacks optimisés
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleJoinForum = (forumTitle: string) => {
    console.log(`Rejoindre le forum: ${forumTitle}`);
  };

  const handleJoinEvent = (eventTitle: string) => {
    console.log(`S'inscrire à l'événement: ${eventTitle}`);
  };

  const handleJoinGroup = (groupId: string) => {
    console.log("Joining group:", groupId);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-16 animate-spin rounded-full border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden px-4 py-20 text-center md:px-8">
      <div className="relative z-10">
        <div className="mb-6">
          <Badge className="mb-4 rounded-sm border-0 bg-primary text-primary-foreground">
            <Users className="mr-1 size-3" />
            Communauté active
          </Badge>
        </div>
        
        <h1 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
          Communauté TrainBuddy
        </h1>
        
        <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-muted-foreground">
          Rejoignez une communauté passionnée de sport, partagez vos expériences et 
          participez à des événements exclusifs avec des sportifs de tous niveaux.
        </p>
      </div>
    </section>

    {/* Statistiques */}
    <section className="px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat: Stat) => {
            const Icon = iconMap[stat.icon as keyof typeof iconMap];
            return (
              <Card key={stat.label} className="border border-border bg-card/90 p-6 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100">
                  {Icon && <Icon className="size-7 text-blue-600" />}
                </div>
                <div className="mb-1 text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="mb-2 text-sm text-muted-foreground">{stat.label}</div>
                <div className="flex items-center justify-center text-xs text-green-600">
                  <TrendingUp className="mr-1 size-3" />
                  {stat.trend}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>

    {/* Tabs Navigation */}
    <section className="px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-card/90 backdrop-blur-sm">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Activity className="size-4" />
              Vue d&apos;ensemble
            </TabsTrigger>
            <TabsTrigger 
              value="forums" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <MessageCircle className="size-4" />
              Forums
            </TabsTrigger>
            <TabsTrigger 
              value="events" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Calendar className="size-4" />
              Événements
            </TabsTrigger>
            <TabsTrigger 
              value="groups" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="size-4" />
              Groupes
            </TabsTrigger>
      </TabsList>

          {/* Vue d&apos;ensemble avec Charts */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <Card className="border border-border bg-card/90 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Croissance de la communauté</h3>
                <Chart 
                  type="line" 
                  data={communityGrowthData as unknown as Record<string, unknown>[]}
                  dataKey="members" 
                  title="Évolution des membres"
                />
              </Card>
              
              <Card className="border border-border bg-card/90 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Répartition des activités</h3>
                <Chart 
                  type="pie" 
                  data={activityDistributionData as unknown as Record<string, unknown>[]}
                  dataKey="value" 
                  title="Types d&apos;activités"
                />
              </Card>
            </div>

            {/* Forums populaires */}
            <div>
              <h3 className="mb-6 text-2xl font-bold text-foreground">Forums populaires</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {topForums.slice(0, 4).map((forum) => (
                  <Card key={forum.title} className="group border border-border bg-card/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h4 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                            {forum.title}
                          </h4>
                          <Badge variant="secondary" className="mb-2 rounded-sm">
                            {forum.category}
                          </Badge>
                          {forum.trending && (
                            <Badge className="ml-2 rounded-sm bg-orange-100 text-orange-800">
                              <TrendingUp className="mr-1 size-3" />
                              Tendance
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="mb-4 text-muted-foreground">{forum.description}</p>
                      
                      <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Users className="mr-2 size-4 text-blue-500" />
                          {forum.members} membres
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="mr-2 size-4 text-green-500" />
                          {forum.topics} sujets
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 size-3" />
                          {forum.lastActivity}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleJoinForum(forum.title)}>
                          Rejoindre
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Forums */}
          <TabsContent value="forums" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {topForums.map((forum) => (
                <Card key={forum.title} className="group border border-border bg-card/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h4 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                          {forum.title}
                        </h4>
                        <Badge variant="secondary" className="mb-2 rounded-sm">
                          {forum.category}
                        </Badge>
                        {forum.trending && (
                          <Badge className="ml-2 rounded-sm bg-orange-100 text-orange-800">
                            <TrendingUp className="mr-1 size-3" />
                            Tendance
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="mb-4 text-muted-foreground">{forum.description}</p>
                    
                    <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="mr-2 size-4 text-blue-500" />
                        {forum.members} membres
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="mr-2 size-4 text-green-500" />
                        {forum.topics} sujets
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 size-3" />
                        {forum.lastActivity}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleJoinForum(forum.title)}>
                        Rejoindre
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Événements */}
          <TabsContent value="events" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <Card key={event.title} className="group border border-border bg-card/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h4 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                          {event.title}
                        </h4>
                        <Badge variant="secondary" className="mb-2">
                          {event.category}
                        </Badge>
                        <Badge className="ml-2 bg-green-100 text-green-800">
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-4 space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="mr-2 size-4 text-blue-500" />
                        {event.date} à {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-2 size-4 text-red-500" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-2 size-4 text-green-500" />
                        {event.participants}/{event.maxParticipants} participants
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="mr-4 h-2 w-full rounded-full bg-gray-200">
                        <div 
                          className="h-2 rounded-full bg-green-500" 
                          style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                        ></div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleJoinEvent(event.title)}>
                        S&apos;inscrire
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Groupes */}
          <TabsContent value="groups" className="space-y-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">Groupes populaires</h3>
                <p className="text-muted-foreground">Rejoignez des communautés actives</p>
              </div>
              <Link href="/groups/manage">
                <Button variant="outline" className="gap-2">
                  <Shield className="size-4" />
                  Gérer mes groupes
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredGroups.map((group) => (
                <Card key={group.id} className="group border border-border bg-card/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h4 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                          {group.name}
                        </h4>
                        <Badge variant="secondary" className="mb-2">
                          {group.category}
                        </Badge>
                        <Badge className="ml-2 bg-green-100 text-green-800">
                          {group.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="mb-4 text-muted-foreground">{group.description}</p>
                    
                    <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Users className="mr-2 size-4 text-blue-500" />
                        {group.members} membres
                      </div>
                      <div className="flex items-center">
                        <Crown className="mr-2 size-4 text-yellow-500" />
                        {group.admin}
                      </div>
                    </div>
                    
                    <div className="mb-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">Réalisations</span>
                      </div>
                      {group.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center rounded-lg bg-blue-50/50 p-2">
                          <CheckCircle className="mr-2 size-4 text-blue-500" />
                          <span className="text-sm text-foreground">{achievement}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="mr-1 size-3" />
                        {group.lastActivity}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleJoinGroup(String(group.id))}>
                          Rejoindre
                        </Button>
                        <Link href={`/groups/${group.id}`}>
                          <Button variant="ghost" size="sm">
                            Voir détails
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}