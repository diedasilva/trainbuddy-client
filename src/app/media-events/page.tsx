"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Chart from "@/components/chart/Chart";
import { BackgroundPattern } from "@/components/ui/background-pattern";
import {
  Tv,
  Play,
  BookOpen,
  TrendingUp,
  Clock,
  Eye,
  Heart,
  Star,
  Activity,
  Video,
  Newspaper,
  Users,
} from "lucide-react";
import { useState, useEffect } from "react";

// Define types for each data set

type Stat = { label: string; value: number; icon: string; trend: string };
type ChartData = {
  name: string;
  live?: number;
  replay?: number;
  articles?: number;
  value?: number;
  color?: string;
};
type LiveContent = {
  title: string;
  status: string;
  viewers: number;
  duration: string;
  category: string;
  channel: string;
  description: string;
  tags: string[];
};
type Article = {
  title: string;
  author: string;
  readTime: string;
  views: number;
  likes: number;
  category: string;
  published: string;
  excerpt: string;
  tags: string[];
};
type TvProgram = {
  date: string;
  time: string;
  event: string;
  channel: string;
  duration: string;
  category: string;
  priority: string;
};

// Mapping des icônes
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Eye,
  TrendingUp,
  Users,
  Tv,
  Play,
  BookOpen,
  Clock,
  Heart,
  Star,
  Activity,
  Video,
  Newspaper,
};

export default function MediaEventsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<Stat[]>([]);
  const [viewershipData, setViewershipData] = useState<ChartData[]>([]);
  const [contentDistributionData, setContentDistributionData] = useState<
    ChartData[]
  >([]);
  const [liveContent, setLiveContent] = useState<LiveContent[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [tvSchedule, setTvSchedule] = useState<TvProgram[]>([]);

  useEffect(() => {
    async function fetchData() {
      // Fetch stats
      const statsRes = await fetch("/mocks/mediaEventsStats.json");
      setStats(await statsRes.json());
      // Fetch charts
      const chartsRes = await fetch("/mocks/mediaEventsCharts.json");
      const chartsJson = await chartsRes.json();
      setViewershipData(
        chartsJson.find((c: { id: string }) => c.id === "viewership").data
      );
      setContentDistributionData(
        chartsJson.find((c: { id: string }) => c.id === "contentDistribution")
          .data
      );
      // Fetch live content
      const liveRes = await fetch("/mocks/mediaEvents.json");
      setLiveContent(await liveRes.json());
      // Fetch articles
      const articlesRes = await fetch("/mocks/mediaArticles.json");
      setArticles(await articlesRes.json());
      // Fetch TV schedule
      const tvRes = await fetch("/mocks/mediaTvSchedule.json");
      setTvSchedule(await tvRes.json());
    }
    fetchData();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 text-center md:px-8">
        <div className="relative z-10">
          <div className="mb-6">
            <Badge className="mb-4 rounded-sm border-0 bg-primary text-primary-foreground">
              <Tv className="mr-1 size-3" />
              Médias & Événements
            </Badge>
          </div>

          <h1 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
            Médias & Événements
          </h1>

          <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Découvrez nos contenus exclusifs, live-streams, articles et planning
            TV pour ne rien manquer de l&apos;actualité sportive.
          </p>
        </div>
      </section>

      {/* Statistiques */}
      <section className="px-4 py-8 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat: Stat) => {
              const IconComponent = iconMap[stat.icon] || Activity;
              return (
                <Card
                  key={stat.label}
                  className="border border-border bg-card/90 p-6 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-100 to-pink-100">
                    <IconComponent className="size-7 text-red-600" />
                  </div>
                  <div className="mb-1 text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="mb-2 text-sm text-muted-foreground">
                    {stat.label}
                  </div>
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
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <TabsList className="grid w-full grid-cols-4 bg-card/90 backdrop-blur-sm">
              <TabsTrigger
                value="overview"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Activity className="size-4" />
                Vue d&apos;ensemble
              </TabsTrigger>
              <TabsTrigger
                value="live"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Video className="size-4" />
                Live & Rediffusions
              </TabsTrigger>
              <TabsTrigger
                value="articles"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Newspaper className="size-4" />
                Articles
              </TabsTrigger>
              <TabsTrigger
                value="tv"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Tv className="size-4" />
                Calendrier TV
              </TabsTrigger>
            </TabsList>

            {/* Vue d'ensemble avec Charts */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <Card className="border border-border bg-card/90 p-6 shadow-lg backdrop-blur-sm">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">
                    Audience hebdomadaire
                  </h3>
                  <Chart
                    type="line"
                    data={viewershipData.map((d: ChartData) => ({
                      ...d,
                      name: d.name.split(" ")[0],
                    }))}
                    dataKey="live"
                    title="Évolution de l'audience"
                  />
                </Card>

                <Card className="border border-border bg-card/90 p-6 shadow-lg backdrop-blur-sm">
                  <h3 className="mb-4 text-lg font-semibold text-foreground">
                    Répartition du contenu
                  </h3>
                  <Chart
                    type="pie"
                    data={contentDistributionData.map((d: ChartData) => ({
                      ...d,
                      name: d.name?.split(" ")[0],
                    }))}
                    dataKey="value"
                    title="Types de contenu"
                  />
                </Card>
              </div>

              {/* Contenu en vedette */}
              <div>
                <h3 className="mb-6 text-2xl font-bold text-foreground">
                  Contenu en vedette
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {liveContent.slice(0, 2).map((content: LiveContent) => (
                    <Card
                      key={content.title}
                      className="group border border-border bg-card/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                      <CardContent className="p-6">
                        <div className="mb-4 flex items-start justify-between">
                          <div>
                            <h4 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                              {content.title}
                            </h4>
                            <Badge
                              variant="secondary"
                              className="mb-2 rounded-sm"
                            >
                              {content.category}
                            </Badge>
                            <Badge className="ml-2 rounded-sm bg-red-100 text-red-800">
                              {content.status}
                            </Badge>
                          </div>
                        </div>

                        <p className="mb-4 text-muted-foreground">
                          {content.description}
                        </p>

                        <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Eye className="mr-2 size-4 text-red-500" />
                            {(content.viewers || 0).toLocaleString()}{" "}
                            spectateurs
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-2 size-4 text-blue-500" />
                            {content.duration}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            {content.channel}
                          </div>
                          <Button variant="outline" size="sm">
                            <Play className="mr-2 size-4" />
                            Regarder
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Live & Rediffusions */}
            <TabsContent value="live" className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {liveContent.map((content: LiveContent) => (
                  <Card
                    key={content.title}
                    className="group border border-border bg-card/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h4 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                            {content.title}
                          </h4>
                          <Badge
                            variant="secondary"
                            className="mb-2 rounded-sm"
                          >
                            {content.category}
                          </Badge>
                          <Badge className="ml-2 rounded-sm bg-red-100 text-red-800">
                            {content.status}
                          </Badge>
                        </div>
                      </div>

                      <p className="mb-4 text-muted-foreground">
                        {content.description}
                      </p>

                      <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Eye className="mr-2 size-4 text-red-500" />
                          {(content.viewers || 0).toLocaleString()} spectateurs
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 size-4 text-blue-500" />
                          {content.duration}
                        </div>
                      </div>

                      <div className="mb-4 flex flex-wrap gap-2">
                        {content.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {content.channel}
                        </div>
                        <Button variant="outline" size="sm">
                          <Play className="mr-2 size-4" />
                          Regarder
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Articles */}
            <TabsContent value="articles" className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article: Article) => (
                  <Card
                    key={article.title}
                    className="group border border-border bg-card/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h4 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                            {article.title}
                          </h4>
                          <Badge variant="secondary" className="mb-2">
                            {article.category}
                          </Badge>
                        </div>
                      </div>

                      <p className="mb-4 text-muted-foreground">
                        {article.excerpt}
                      </p>

                      <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Eye className="mr-2 size-4 text-blue-500" />
                          {article.views.toLocaleString()} vues
                        </div>
                        <div className="flex items-center">
                          <Heart className="mr-2 size-4 text-red-500" />
                          {article.likes} likes
                        </div>
                      </div>

                      <div className="mb-4 flex flex-wrap gap-2">
                        {article.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 size-3" />
                          {article.published}
                        </div>
                        <Button variant="outline" size="sm">
                          <BookOpen className="mr-2 size-4" />
                          Lire
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Calendrier TV */}
            <TabsContent value="tv" className="space-y-6">
              <Card className="border border-border bg-card/90 shadow-lg backdrop-blur-sm">
                <CardContent className="p-6">
                  <h3 className="mb-6 text-xl font-bold text-foreground">
                    Programme TV Sport
                  </h3>
                  <div className="space-y-4">
                    {tvSchedule.map((program: TvProgram) => (
                      <div
                        key={`${program.date}-${program.event}`}
                        className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-sm font-medium text-foreground">
                              {program.date}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {program.time}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">
                              {program.event}
                            </h4>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <span>{program.channel}</span>
                              <span>•</span>
                              <span>{program.duration}</span>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                {program.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {program.priority === "high" && (
                            <Badge className="bg-red-100 text-red-800">
                              <Star className="mr-1 size-3" />
                              Priorité
                            </Badge>
                          )}
                          <Button variant="outline" size="sm">
                            <Tv className="mr-2 size-4" />
                            Programmer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
}
