"use client";

// pages/activites.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActivityDetailsModal } from "@/components/activities/ActivityDetailsModal";
import { 
  Users, 
  Calendar, 
  Search, 
  Clock, 
  MapPin, 
  Star,
  ArrowRight,
  Activity as ActivityIcon,
  Heart,
  Zap,
  Target,
  Shield,
  Music,
  Sun
} from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { useActivities } from "@/hooks/activities";
import { useCategories } from "@/hooks/categories";
import { useStatistics } from "@/hooks/statistics";
import type { Activity, TableData } from "@/lib/mockDb";

// Mapping des icônes
const iconMap = {
  ActivityIcon,
  Heart,
  Target,
  Zap,
  Users,
  Shield,
  Music,
  Sun
};

export default function ActivitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Stabiliser les options pour éviter les re-rendus infinis
  const activitiesOptions = useMemo(() => ({
    search: searchTerm ? {
      query: searchTerm,
      fields: ['title', 'description', 'category']
    } : undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    sort: { field: 'popularity', order: 'desc' as const }
  }), [searchTerm, selectedCategory]);

  // Utiliser le nouveau hook optimisé avec recherche et filtres
  const { activities, loading, error } = useActivities(activitiesOptions);

  // Charger les catégories depuis la BDD mockée
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  // Charger les stats globales depuis la BDD mockée
  const { stats: statsData, loading: statsLoading, error: statsError } = useStatistics();

  // État de chargement global
  const isLoading = loading || categoriesLoading || statsLoading;
  const hasError = error || categoriesError || statsError;

  // Statistiques globales dynamiques
  const stats = useMemo(() => {
    const global = statsData && typeof statsData === 'object' && 'global' in statsData 
      ? (statsData as Record<string, unknown>).global as Record<string, unknown> 
      : {};
    
    return [
      { label: "Activités disponibles", value: String(global.totalActivities ?? activities.length), icon: ActivityIcon },
      { label: "Participants actifs", value: String(global.totalUsers ?? "-"), icon: Users },
      { label: "Groupes créés", value: String(global.totalGroups ?? "-"), icon: Heart },
      { label: "Sessions ce mois", value: String(global.totalSessions ?? "-"), icon: Calendar }
    ];
  }, [statsData, activities.length]);

  // Callbacks optimisés
  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // Fonction helper pour afficher les erreurs
  const getErrorMessage = useCallback(() => {
    if (error) return String(error);
    if (categoriesError) return String(categoriesError);
    if (statsError) return String(statsError);
    return "Une erreur inconnue s'est produite";
  }, [error, categoriesError, statsError]);

  // Fonction pour ouvrir la modal avec les détails d'une activité
  const handleOpenActivityDetails = useCallback((activity: TableData) => {
    setSelectedActivity(activity as unknown as Activity);
    setIsModalOpen(true);
  }, []);

  // Fonction pour fermer la modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  }, []);

  // Filtrer les activités
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // Filtre par recherche textuelle
      const matchesSearch = searchTerm === "" || 
        String(activity.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(activity.description).toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtre par catégorie
      const matchesCategory = selectedCategory === "all" || 
        String(activity.category) === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [activities, searchTerm, selectedCategory]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto size-32 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="mt-4 text-lg text-muted-foreground">Chargement des activités...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg text-red-600">Erreur: {getErrorMessage()}</p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden px-4 py-16 text-center md:px-8">
      <div className="relative z-10">
        <Badge className="mb-4 rounded-sm border-0 bg-primary text-primary-foreground">
          <ActivityIcon className="mr-1 size-3" />
          Activités disponibles
        </Badge>
        
        <h1 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
          Trouvez votre activité parfaite
        </h1>
        
        <p className="mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
          Choisissez parmi nos activités variées pour vous divertir, rester en forme et rencontrer de nouvelles personnes.
        </p>
      </div>

      {/* Statistiques */}
      <section className="px-4 py-8 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="border border-border bg-card/80 p-6 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-secondary">
                  <stat.icon className="size-6 text-slate-600" />
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Filtres et recherche */}
      <section className="px-4 py-8 md:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Barre de recherche en haut */}
          <div className="mb-6">
            <div className="relative mx-auto max-w-2xl">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher une activité..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-lg border border-border bg-card py-3 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          
          {/* Filtres par catégorie centrés */}
          <div className="flex justify-center">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => {
                const iconName = String(category.icon);
                const IconComponent = iconMap[iconName as keyof typeof iconMap] || ActivityIcon;
                return (
                  <Button
                    key={String(category.slug)}
                    variant={selectedCategory === String(category.slug) ? "default" : "outline"}
                    onClick={() => handleCategoryChange(String(category.slug))}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <IconComponent className="size-4" />
                    {String(category.name)}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Grille des activités */}
      <section className="px-4 py-8 md:px-8">
        <div className="mx-auto max-w-6xl">
          {filteredActivities.length === 0 ? (
            <div className="py-12 text-center">
              <ActivityIcon className="mx-auto mb-4 size-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                Aucune activité trouvée
              </h3>
              <p className="text-muted-foreground">
                Essayez de modifier vos critères de recherche ou de catégorie.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredActivities.map((activity) => (
                <Card key={String(activity.id)} className="group overflow-hidden border border-border bg-card/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  {/* Header avec image et badges */}
                  <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-secondary to-muted">
                    <div className="text-6xl opacity-20">
                      {String(activity.category) === 'outdoor' ? '🌳' : 
                       String(activity.category) === 'indoor' ? '🏢' : 
                       String(activity.category) === 'water' ? '🌊' : '🏆'}
                    </div>
                    
                    {/* Badges */}
                    <div className="absolute left-4 top-4">
                      <Badge variant="secondary" className="rounded-sm text-xs">
                        {String(activity.difficulty)}
                      </Badge>
                    </div>
                    
                    <div className="absolute right-4 top-4 flex items-center gap-1">
                      <Star className="size-3 fill-current text-yellow-500" />
                      <span className="text-xs font-medium text-foreground">
                        {(activity.popularity as number) || 0}
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Titre et description */}
                    <h3 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                      {String(activity.title)}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-muted-foreground">
                      {String(activity.description)}
                    </p>

                    {/* Métadonnées */}
                    <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="size-4" />
                        <span>{String(activity.duration)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="size-4" />
                        <span>{String(activity.location)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="size-4" />
                        <span>{String(activity.participants)} participants</span>
                      </div>
                    </div>

                    {/* Groupes associés */}
                    {activity.groups && Array.isArray(activity.groups) && activity.groups.length > 0 && (
                      <div className="mb-4">
                        <h4 className="mb-2 text-sm font-semibold text-foreground">Groupes disponibles:</h4>
                        <div className="space-y-2">
                          {activity.groups.slice(0, 2).map((group) => (
                            <div key={String(group.id)} className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">{String(group.name)}</span>
                              <Badge variant="outline" className="text-xs">
                                {String(group.members)} membres
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bouton d'action */}
                    <Button className="w-full transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground" onClick={() => handleOpenActivityDetails(activity)}>
                      Voir les détails
                      <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal des détails d'activité */}
      <ActivityDetailsModal
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
