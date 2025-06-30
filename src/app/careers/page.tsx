"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Chart from "@/components/chart/Chart";
import { 
  Briefcase, 
  GraduationCap, 
  TrendingUp, 
  Users,
  MapPin,
  Clock,
  Star,
  Award,
  Activity,
  Building,
  BookOpen,
  CheckCircle,
  Calendar,
  DollarSign
} from "lucide-react";
import { useState, useEffect } from "react";

// Définition du type pour les offres d'emploi
interface JobOffer {
  id: number;
  title: string;
  description: string;
  category: string;
  type: string;
  location: string;
  salary: string;
  experience: string;
  education: string;
  company: string;
  postedDate: string;
  imageUrl?: string;
  requirements: string[];
  benefits: string[];
  responsibilities: string[];
}

// Définition du type pour les modules de formation
interface TrainingModule {
  id: number;
  title: string;
  duration: string;
  description: string;
}

// Définition du type pour les formations
interface Training {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  price: number;
  rating: number;
  participants: number;
  coach: string;
  imageUrl?: string;
  features?: string[];
  modules: TrainingModule[];
}

interface JobMarketDatum {
  name: string;
  offres: number;
  candidats: number;
  placements: number;
}

interface SectorDistributionDatum {
  name: string;
  value: number;
  color: string;
}

export default function CareersPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [stats, setStats] = useState([
    { label: "Offres actives", value: "-", icon: Briefcase, trend: "" },
    { label: "Candidats", value: "-", icon: Users, trend: "" },
    { label: "Formations disponibles", value: "-", icon: GraduationCap, trend: "" },
    { label: "Taux de placement", value: "-", icon: Award, trend: "" }
  ]);
  const [jobMarketData, setJobMarketData] = useState<JobMarketDatum[]>([]);
  const [sectorDistributionData, setSectorDistributionData] = useState<SectorDistributionDatum[]>([]);

  // Remplacement des données statiques par le mock
  useEffect(() => {
    setLoading(true);
    fetch("/mocks/careers.json")
      .then((res) => res.json())
      .then((data) => {
        setJobOffers(data);
        setLoading(false);
      });
    fetch("/mocks/healthPrograms.json")
      .then((res) => res.json())
      .then((data) => {
        setTrainings(data);
      });
    // Charger les stats depuis le mock statistics.json
    fetch("/mocks/statistics.json")
      .then((res) => res.json())
      .then((data) => {
        setStats([
          { label: "Offres actives", value: data.global.totalCareers?.toString() ?? "-", icon: Briefcase, trend: "+23%" },
          { label: "Candidats", value: data.users?.byRole?.CLIENT?.toString() ?? "-", icon: Users, trend: "+18%" },
          { label: "Formations disponibles", value: data.global.totalHealthPrograms?.toString() ?? "-", icon: GraduationCap, trend: "+12%" },
          { label: "Taux de placement", value: "94%", icon: Award, trend: "+5%" }
        ]);
      });
    fetch("/mocks/jobMarketData.json")
      .then(res => res.json())
      .then(setJobMarketData);
    fetch("/mocks/sectorDistributionData.json")
      .then(res => res.json())
      .then(setSectorDistributionData);
  }, []);

  return (
    <>
    {/* Hero Section */}
    <section className="relative overflow-hidden px-4 py-20 text-center md:px-8">
      <div className="relative z-10">
        <div className="mb-6">
          <Badge className="mb-4 rounded-sm border-0 bg-primary text-primary-foreground">
            <Briefcase className="mr-1 size-3" />
            Opportunités de carrière
          </Badge>
        </div>
        
        <h1 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
          Carrières & Pro
        </h1>
        
        <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-muted-foreground">
          Découvrez les meilleures opportunités professionnelles dans le sport, 
          des formations certifiantes et des témoignages de professionnels du secteur.
        </p>
      </div>
    </section>

    {/* Statistiques */}
    <section className="px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border border-border bg-card/90 p-6 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary/10">
                <stat.icon className="size-7 text-primary" />
              </div>
              <div className="mb-1 text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="mb-2 text-sm text-muted-foreground">{stat.label}</div>
              <div className="flex items-center justify-center text-xs text-primary">
                <TrendingUp className="mr-1 size-3" />
                {stat.trend}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Tabs Navigation */}
    <section className="px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-card/90 backdrop-blur-sm">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Activity className="size-4" />
              Vue d&apos;ensemble
            </TabsTrigger>
            <TabsTrigger 
              value="jobs" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Briefcase className="size-4" />
              Offres d&apos;emploi
            </TabsTrigger>
            <TabsTrigger 
              value="trainings" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <GraduationCap className="size-4" />
              Formations
            </TabsTrigger>
            <TabsTrigger 
              value="testimonials" 
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="size-4" />
              Témoignages
            </TabsTrigger>
          </TabsList>

          {/* Vue d'ensemble avec Charts */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <Card className="border border-border bg-card/90 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Marché de l&apos;emploi sportif</h3>
                <Chart 
                  type="line" 
                  data={jobMarketData.map(d => ({ ...d }))} 
                  dataKey="offres" 
                  title="Évolution des offres d'emploi"
                />
              </Card>
              
              <Card className="border border-border bg-card/90 p-6 shadow-lg backdrop-blur-sm">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Répartition par secteur</h3>
                <Chart 
                  type="pie" 
                  data={sectorDistributionData.map(d => ({ ...d }))} 
                  dataKey="value" 
                  title="Secteurs d'activité"
                />
              </Card>
            </div>

            {/* Offres en vedette */}
            <div>
              <h3 className="mb-6 text-2xl font-bold text-foreground">Offres en vedette</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {loading ? (
                  <div>Chargement...</div>
                ) : (
                  jobOffers.slice(0, 2).map((job) => (
                    <Card key={job.id} className="group border border-border bg-card/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      <CardContent className="p-6">
                        <div className="mb-4 flex items-start justify-between">
                          <div>
                            <h4 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                              {job.title}
                            </h4>
                            <Badge variant="secondary" className="mb-2 rounded-sm">
                              {job.category}
                            </Badge>
                            <Badge className="ml-2 rounded-sm bg-primary/10 text-primary">
                              {job.type}
                            </Badge>
                          </div>
                        </div>
                        <p className="mb-4 text-muted-foreground">{job.description}</p>
                        <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Building className="mr-2 size-4 text-blue-500" />
                            {job.company}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="mr-2 size-4 text-red-500" />
                            {job.location}
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="mr-2 size-4 text-green-500" />
                            {job.salary}
                          </div>
                          <div className="flex items-center">
                            <Clock className="mr-2 size-4 text-orange-500" />
                            {job.experience}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="mr-1 size-3" />
                            {job.postedDate ? new Date(job.postedDate).toLocaleDateString("fr-FR") : ""}
                          </div>
                          <Button variant="outline" size="sm">
                            Postuler
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* Offres d'emploi */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <div>Chargement...</div>
              ) : (
                jobOffers.map((job) => (
                  <Card key={job.id} className="group border border-border bg-card/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h4 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                            {job.title}
                          </h4>
                          <Badge variant="secondary" className="mb-2 rounded-sm">
                            {job.category}
                          </Badge>
                          <Badge className="ml-2 rounded-sm bg-primary/10 text-primary">
                            {job.type}
                          </Badge>
                        </div>
                      </div>
                      <p className="mb-4 text-muted-foreground">{job.description}</p>
                      <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Building className="mr-2 size-4 text-blue-500" />
                          {job.company}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="mr-2 size-4 text-red-500" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="mr-2 size-4 text-green-500" />
                          {job.salary}
                        </div>
                        <div className="flex items-center">
                          <Clock className="mr-2 size-4 text-orange-500" />
                          {job.experience}
                        </div>
                      </div>
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">Exigences</span>
                        </div>
                        {job.requirements && job.requirements.slice(0, 2).map((req, index) => (
                          <div key={index} className="flex items-center rounded-lg bg-primary/5 p-2">
                            <CheckCircle className="mr-2 size-4 text-primary" />
                            <span className="text-sm text-foreground">{req}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="mr-1 size-3" />
                          {job.postedDate ? new Date(job.postedDate).toLocaleDateString("fr-FR") : ""}
                        </div>
                        <Button variant="outline" size="sm">
                          Postuler
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Formations */}
          <TabsContent value="trainings" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <div>Chargement...</div>
              ) : (
                trainings.map((training) => (
                  <Card key={training.id} className="group border border-border bg-card/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h4 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                            {training.title}
                          </h4>
                          <Badge variant="secondary" className="mb-2 rounded-sm">
                            {training.category}
                          </Badge>
                          <Badge className="ml-2 rounded-sm bg-blue-100 text-blue-800">
                            {training.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <p className="mb-4 text-muted-foreground">{training.description}</p>
                      <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Clock className="mr-2 size-4 text-blue-500" />
                          {training.duration}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="mr-2 size-4 text-green-500" />
                          {training.price}€
                        </div>
                        <div className="flex items-center">
                          <Users className="mr-2 size-4 text-purple-500" />
                          {training.participants} participants
                        </div>
                        <div className="flex items-center">
                          <Star className="mr-2 size-4 text-yellow-500" />
                          {training.rating}/5
                        </div>
                      </div>
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">Modules</span>
                        </div>
                        {training.modules && training.modules.slice(0, 2).map((module, index) => (
                          <div key={index} className="flex items-center rounded-lg bg-primary/5 p-2">
                            <BookOpen className="mr-2 size-4 text-primary" />
                            <span className="text-sm text-foreground">{module.title}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {training.coach}
                        </div>
                        <Button variant="outline" size="sm">
                          Découvrir
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Témoignages */}
          <TabsContent value="testimonials" className="space-y-6">
            <div className="text-center text-muted-foreground">Aucun témoignage mocké disponible.</div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
    </>
  );
}
