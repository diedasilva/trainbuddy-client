"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Trophy, 
  Search, 
  TrendingUp, 
  Target, 
  Users,
  Award,
  CheckCircle,
  Play,
  Medal,
  Flame,
  BarChart3} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { CompetitionDetailsModal } from "@/components/competitions/CompetitionDetailsModal";

export default function CompetitionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // États pour la modal
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  interface Competition {
    id: number;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    startDate: string;
    endDate: string;
    location: string;
    maxParticipants: number;
    currentParticipants: number;
    entryFee: number;
    prizePool: number;
    status: string;
    organizer: string;
    imageUrl?: string;
    rules?: string[];
    categories?: string[];
    href?: string;
    myTeam?: {
      name: string;
      rank: number;
      score: number;
    };
    topTeams?: { name: string; score: number; members: number }[];
    duration?: string;
    prize?: string;
    participants?: number;
    teams?: number;
    features?: string[];
  }
  interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
    description: string;
    color: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  const [categories, setCategories] = useState<Category[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [stats, setStats] = useState([
    { label: "Compétitions actives", value: "-", icon: Trophy },
    { label: "Participants total", value: "-", icon: Users },
    { label: "Équipes engagées", value: "-", icon: Award },
    { label: "Prix distribués", value: "-", icon: Medal }
  ]);

  useEffect(() => {
    fetch("/mocks/categories.json")
      .then(res => res.json())
      .then(setCategories);
    fetch("/mocks/competitions.json")
      .then(res => res.json())
      .then(setCompetitions);
    fetch("/mocks/statistics.json")
      .then(res => res.json())
      .then(data => {
        setStats([
          { label: "Compétitions actives", value: data.global.totalCompetitions?.toString() ?? "-", icon: Trophy },
          { label: "Participants total", value: "1,022", icon: Users },
          { label: "Équipes engagées", value: "162", icon: Award },
          { label: "Prix distribués", value: "4,300€", icon: Medal }
        ]);
      });
  }, []);

  const sportToCategorySlug: Record<string, string> = {
    tennis: "indoor",
    running: "outdoor",
    swimming: "water",
    "beach-volley": "outdoor",
    cycling: "outdoor",
    // Ajoute d'autres sports ici si besoin
  };

  const filteredCompetitions = competitions.filter(competition => {
    const matchesCategory =
      selectedCategory === "all" ||
      sportToCategorySlug[competition.category] === selectedCategory;
    const matchesSearch =
      competition.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      competition.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategoryChange = useCallback((categorySlug: string) => {
    setSelectedCategory(categorySlug);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedCategory("all");
    setSearchTerm("");
  }, []);

  // Fonctions pour la modal
  const handleOpenModal = useCallback((competition: Competition) => {
    setSelectedCompetition(competition);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCompetition(null);
  }, []);

  // Icon mapping for category icons
  const iconMap = {
    Trophy,
    Search,
    TrendingUp,
    Target,
    Users,
    Award,
    CheckCircle,
    Play,
    Medal,
    Flame,
    BarChart3
  };

  return (
    <>
    {/* Hero Section avec style différent */}
    <section className="relative overflow-hidden px-4 py-20 text-center md:px-8">
      <div className="relative z-10">
        <div className="mb-6">
          <Badge className="mb-4 rounded-sm border-0 bg-primary text-primary-foreground">
            <Trophy className="mr-1 size-3" />
            Compétitions actives
          </Badge>
        </div>
        
        <h1 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
          Compétitions & Défis
        </h1>
        
        <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-muted-foreground">
          Relevez des défis passionnants, mesurez-vous aux meilleurs et remportez des récompenses 
          exceptionnelles avec votre équipe.
        </p>
      </div>
    </section>

    {/* Statistiques avec style différent */}
    <section className="px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border border-border bg-card/90 p-6 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100">
                <stat.icon className="size-7 text-amber-600" />
              </div>
              <div className="mb-1 text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Filtres et recherche avec style différent */}
    <section className="px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Barre de recherche en haut */}
        <div className="mb-6">
          <div className="relative mx-auto max-w-2xl">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une compétition..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-xl border-2 border-border bg-card py-3 pl-12 pr-4 text-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        
        {/* Filtres par catégorie centrés */}
        <div className="flex justify-center">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((category) => {
              const CatIcon = iconMap[category.icon as keyof typeof iconMap];
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? "default" : "outline"}
                  onClick={() => handleCategoryChange(category.slug)}
                  className="flex items-center gap-2 whitespace-nowrap rounded-xl px-6 py-3"
                >
                  {CatIcon && <CatIcon className="size-4" />}
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </section>

    {/* Grille des compétitions avec style différent */}
    <section className="px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredCompetitions.map((competition) => (
            <Card key={competition.id} className="group overflow-hidden border border-border bg-card/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl">
              {/* Header avec style différent */}
              <div className="relative flex h-56 items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="text-7xl opacity-10">
                  {competition.category === 'endurance' ? '🏃' : 
                   competition.category === 'speed' ? '⚡' : 
                   competition.category === 'strength' ? '💪' :
                   competition.category === 'team' ? '👥' :
                   competition.category === 'individual' ? '👤' : '🏆'}
                </div>
                
                {/* Badges avec style différent */}
                <div className="absolute left-4 top-4 flex gap-2">
                  <Badge variant="secondary" className="bg-amber-100 text-xs text-amber-800">
                    {competition.difficulty}
                  </Badge>
                  <Badge className="bg-primary text-xs text-primary-foreground">
                    {competition.duration}
                  </Badge>
                </div>
                
                <div className="absolute right-4 top-4 flex items-center gap-1">
                  <Flame className="size-4 text-orange-500" />
                  <span className="text-sm font-medium text-foreground">{competition.status}</span>
                </div>

                {/* Prix info */}
                <div className="absolute inset-x-4 bottom-4">
                  <div className="flex items-center justify-between rounded-lg bg-white/80 p-3 backdrop-blur-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Prix à gagner</p>
                      <p className="text-sm font-medium text-foreground">{competition.prize}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Fin</p>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(competition.endDate).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Titre et description */}
                <h3 className="mb-3 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                  {competition.title}
                </h3>
                <p className="mb-4 line-clamp-2 text-muted-foreground">
                  {competition.description}
                </p>

                {/* Informations rapides avec style différent */}
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 size-4 text-amber-500" />
                    {competition.participants} participants
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Award className="mr-2 size-4 text-orange-500" />
                    {competition.teams} équipes
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Target className="mr-2 size-4 text-red-500" />
                    {competition.duration}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <TrendingUp className="mr-2 size-4 text-amber-500" />
                    {competition.status}
                  </div>
                </div>

                {/* Features avec style différent */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Caractéristiques</span>
                  </div>
                  
                  {competition.features?.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center rounded-lg bg-amber-50/50 p-2">
                      <CheckCircle className="mr-2 size-4 text-amber-500" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Top 3 équipes avec style différent */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Top 3 Équipes</span>
                  </div>
                  
                  {competition.topTeams?.map((team, index) => (
                    <div key={team.name} className="flex items-center justify-between rounded-lg bg-gradient-to-r from-amber-50/30 to-orange-50/30 p-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                        </span>
                        <span className="text-sm font-medium text-foreground">{team.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <BarChart3 className="size-3" />
                        <span>{team.score}</span>
                        <Users className="size-3" />
                        <span>{team.members}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mon équipe si elle participe */}
                {competition.myTeam && (
                  <div className="mb-4 rounded-lg bg-gradient-to-r from-blue-50/50 to-cyan-50/50 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Votre équipe</p>
                        <p className="text-sm font-medium text-foreground">{competition.myTeam.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Rang #{competition.myTeam.rank}</p>
                        <p className="text-sm font-medium text-foreground">{competition.myTeam.score} pts</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Boutons d'action avec style différent */}
                <div className="flex space-x-3">
                  <Button 
                    className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => handleOpenModal(competition)}
                  >
                    <Trophy className="mr-2 size-4" />
                    Voir détails
                  </Button>
                  <Button variant="outline" className="rounded-xl transition-colors group-hover:border-primary group-hover:text-primary">
                    <Play className="size-4 transition-transform group-hover:scale-110" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Message si aucun résultat */}
        {filteredCompetitions.length === 0 && (
          <div className="py-16 text-center">
            <Trophy className="mx-auto mb-6 size-20 text-muted-foreground" />
            <h3 className="mb-3 text-2xl font-bold text-foreground">Aucune compétition trouvée</h3>
            <p className="mb-6 text-muted-foreground">Essayez de modifier vos filtres ou votre recherche.</p>
            <div className="flex justify-center space-x-4">
              <Button onClick={handleResetFilters}>
                Voir toutes les compétitions
              </Button>
              <Link href="/community">
                <Button variant="outline">
                  Explorer la communauté
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>

    {/* Modal de détails de la compétition */}
    <CompetitionDetailsModal
      competition={selectedCompetition}
      isOpen={isModalOpen}
      onClose={handleCloseModal}
    />
    </>
  );
}
