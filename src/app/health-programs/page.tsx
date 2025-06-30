"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BackgroundPattern } from "@/components/ui/background-pattern";
import { 
  HeartPulse, 
  Search, 
  TrendingUp, 
  Clock, 
  Star,
  Users,
  Award,
  BookOpen,
  CheckCircle,
  Play,
  DollarSign,
  Activity,
  Heart,
  Target,
  Zap,
  Shield,
  Music,
  Sun,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { HealthProgramDetailsModal } from "@/components/health-programs/HealthProgramDetailsModal";

// Types explicites
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
interface Program {
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
  modules?: { id: number; title: string; duration: string; description: string }[];
  href?: string;
  nextSession?: string;
}
interface Stat {
  label: string;
  value: string | number;
  icon: string;
}

const iconMap = {
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Activity,
  Heart,
  Target,
  Zap,
  Shield,
  Music,
  Sun,
};

export default function HealthProgramsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [stats, setStats] = useState<Stat[]>([
    { label: "Programmes disponibles", value: "-", icon: "BookOpen" },
    { label: "Participants actifs", value: "-", icon: "Users" },
    { label: "Coaches certifiés", value: "-", icon: "Award" },
    { label: "Taux de réussite", value: "-", icon: "TrendingUp" }
  ]);
  const [loading, setLoading] = useState(true);
  
  // États pour la modal
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const catRes = await fetch("/mocks/categories.json");
      setCategories(await catRes.json());
      const progRes = await fetch("/mocks/healthPrograms.json");
      setPrograms(await progRes.json());
      const statsRes = await fetch("/mocks/statistics.json");
      const data = await statsRes.json();
      setStats([
        { label: "Programmes disponibles", value: data.global.totalHealthPrograms?.toString() ?? "-", icon: "BookOpen" },
        { label: "Participants actifs", value: "1,420", icon: "Users" },
        { label: "Coaches certifiés", value: "12", icon: "Award" },
        { label: "Taux de réussite", value: "94%", icon: "TrendingUp" }
      ]);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredPrograms = programs.filter((program: Program) => {
    // On suppose que les données sont corrigées côté mock pour que program.category === category.slug
    // Si ce n'est pas le cas, on peut faire une correspondance temporaire ici :
    const categorySlugs = categories.map((cat) => cat.slug);
    const programCategory = categorySlugs.includes(program.category) ? program.category : "all";
    const matchesCategory = selectedCategory === "all" || programCategory === selectedCategory;
    const matchesSearch = program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         program.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Callbacks optimisés
  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSelectedCategory("all");
    setSearchTerm("");
  }, []);

  // Fonctions pour la modal
  const handleOpenModal = useCallback((program: Program) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProgram(null);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-16 animate-spin rounded-full border-b-2 border-emerald-500" />
      </div>
    );
  }

  return (
    <>
      {/* Hero Section avec style différent */}
      <section className="relative overflow-hidden px-4 py-20 text-center md:px-8">
        <div className="relative z-10">
          <div className="mb-6">
            <Badge className="mb-4 rounded-sm border-0 bg-primary text-primary-foreground">
              <HeartPulse className="mr-1 size-3" />
              Programmes de santé
            </Badge>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
            Transformez votre santé
          </h1>
          
          <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Découvrez nos programmes de santé personnalisés conçus par des experts pour vous accompagner 
            dans votre transformation physique et mentale.
          </p>
        </div>
      </section>

      {/* Statistiques avec style différent */}
      <section className="px-4 py-8 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat: Stat) => {
              const Icon = iconMap[stat.icon as keyof typeof iconMap];
              return (
                <Card key={stat.label} className="border border-border bg-card/90 p-6 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100">
                    {Icon && <Icon className="size-7 text-emerald-600" />}
                  </div>
                  <div className="mb-1 text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              );
            })}
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
                placeholder="Rechercher un programme..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="h-12 w-full rounded-xl border-2 border-border bg-card py-3 pl-12 pr-4 text-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          
          {/* Filtres par catégorie centrés */}
          <div className="flex justify-center">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {categories.map((category: Category) => {
                const Icon = iconMap[category.icon as keyof typeof iconMap];
                return (
                  <Button
                    key={category.slug}
                    variant={selectedCategory === category.slug ? "default" : "outline"}
                    onClick={() => handleCategoryChange(category.slug)}
                    className="flex items-center gap-2"
                  >
                    {Icon && <Icon className="mr-1 size-4" />}
                    {category.slug === "all" ? "Toutes" : category.name}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Grille des programmes avec style différent */}
      <section className="px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredPrograms.map((program) => (
              <Card key={program.id} className="group overflow-hidden border border-border bg-card/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                {/* Header avec style différent */}
                <div className="relative flex h-56 items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
                  <div className="text-7xl opacity-10">
                    {program.category === 'cardio' ? '❤️' : 
                     program.category === 'strength' ? '💪' : 
                     program.category === 'flexibility' ? '🧘' :
                     program.category === 'mindfulness' ? '🧠' :
                     program.category === 'nutrition' ? '🥗' : '🏆'}
                  </div>
                  
                  {/* Badges avec style différent */}
                  <div className="absolute left-4 top-4 flex gap-2">
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="secondary" className="rounded-sm">
                        {program.category}
                      </Badge>
                      <Badge className="ml-2 rounded-sm bg-blue-100 text-blue-800">
                        {program.difficulty}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="absolute right-4 top-4 flex items-center gap-1">
                    <Star className="size-4 fill-current text-yellow-500" />
                    <span className="text-sm font-medium text-foreground">{program.rating}</span>
                  </div>

                  {/* Coach info */}
                  <div className="absolute inset-x-4 bottom-4">
                    <div className="flex items-center justify-between rounded-lg bg-white/80 p-3 backdrop-blur-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Coach</p>
                        <p className="text-sm font-medium text-foreground">{program.coach}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Prochaine session</p>
                        <p className="text-sm font-medium text-foreground">
                          {new Date(program.nextSession || new Date()).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Titre et description */}
                  <h3 className="mb-3 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                    {program.title}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-muted-foreground">
                    {program.description}
                  </p>

                  {/* Informations rapides avec style différent */}
                  <div className="mb-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="mr-2 size-4 text-blue-500" />
                      {program.duration}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="mr-2 size-4 text-green-500" />
                      {program.price}€
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-2 size-4 text-purple-500" />
                      {program.participants} participants
                    </div>
                    <div className="flex items-center">
                      <Star className="mr-2 size-4 text-yellow-500" />
                      {program.rating}/5
                    </div>
                  </div>

                  {/* Features avec style différent */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Caractéristiques</span>
                    </div>
                    
                    {program.features?.map((feature, index) => (
                      <div key={index} className="flex items-center rounded-lg bg-emerald-50/50 p-2">
                        <CheckCircle className="mr-2 size-4 text-emerald-500" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Boutons d'action avec style différent */}
                  <div className="flex space-x-3">
                    <Button 
                      className="flex-1 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => handleOpenModal(program)}
                    >
                      <BookOpen className="mr-2 size-4" />
                      Découvrir
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
          {filteredPrograms.length === 0 && (
            <div className="py-16 text-center">
              <HeartPulse className="mx-auto mb-6 size-20 text-muted-foreground" />
              <h3 className="mb-3 text-2xl font-bold text-foreground">Aucun programme trouvé</h3>
              <p className="mb-6 text-muted-foreground">Essayez de modifier vos filtres ou votre recherche.</p>
              <div className="flex justify-center space-x-4">
                <Button onClick={handleResetFilters}>
                  Voir tous les programmes
                </Button>
                <Link href="/activities">
                  <Button variant="outline">
                    Explorer les activités
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modal de détails du programme */}
      <HealthProgramDetailsModal
        program={selectedProgram}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}