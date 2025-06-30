"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Plus, 
  Users, 
  Target,
  Award,
  Grid3X3,
  List,
  Search,
  Filter,
  Crown,
  Shield,
  Activity
} from "lucide-react";
import Link from "next/link";
import { useGroups } from "@/hooks/groups";
import GroupsList from "@/components/groups/groups-list-new";
import GroupsStats from "@/components/groups/groups-stats";
import { GroupDetailsModal } from "@/components/groups/GroupDetailsModal";
import type { TableData } from "@/lib/mockDb";

export default function GroupsPage() {
  const { groups, loading, getPermissions, getMembershipStatus } = useGroups();
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // États pour la modal
  const [selectedGroup, setSelectedGroup] = useState<TableData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter groups based on different criteria
  const popularCategories = useMemo(() => [
    { name: "Running", count: groups.filter(g => String(g.category) === "Running").length, icon: "🏃" },
    { name: "Strength", count: groups.filter(g => String(g.category) === "Strength").length, icon: "💪" },
    { name: "Yoga", count: groups.filter(g => String(g.category) === "Yoga").length, icon: "🧘" },
    { name: "Cycling", count: groups.filter(g => String(g.category) === "Cycling").length, icon: "🚴" },
    { name: "Swimming", count: groups.filter(g => String(g.category) === "Swimming").length, icon: "🏊" },
    { name: "CrossFit", count: groups.filter(g => String(g.category) === "CrossFit").length, icon: "🔥" }
  ].filter(cat => cat.count > 0).sort((a, b) => b.count - a.count).slice(0, 6), [groups]);

  // Filter groups based on user's role
  const myGroups = useMemo(() => groups.filter(group => {
    const permissions = getPermissions(Number(group.id));
    return permissions.canEdit || permissions.canDelete || permissions.canModerate;
  }), [groups, getPermissions]);

  const adminGroups = useMemo(() => groups.filter(group => {
    const permissions = getPermissions(Number(group.id));
    return permissions.canEdit && permissions.canDelete;
  }), [groups, getPermissions]);

  const moderatedGroups = useMemo(() => groups.filter(group => {
    const permissions = getPermissions(Number(group.id));
    return permissions.canModerate && !permissions.canEdit;
  }), [groups, getPermissions]);

  const memberGroups = useMemo(() => groups.filter(group => {
    const membershipStatus = getMembershipStatus(Number(group.id));
    return membershipStatus === "member";
  }), [groups, getMembershipStatus]);

  const handleSearch = useCallback((value: string) => {
    console.log('Search query:', value); // Debug
    setSearchQuery(value);
  }, []);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const handleViewModeChange = useCallback((mode: "grid" | "list") => {
    console.log('View mode changed to:', mode); // Debug
    setViewMode(mode);
  }, []);

  const handleGroupClick = useCallback((group: TableData) => {
    console.log('Group clicked:', group); // Debug
    setSelectedGroup(group);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedGroup(null);
  }, []);

  const getTabCount = (tab: string) => {
    switch (tab) {
      case "discover":
        return groups.length;
      case "my-groups":
        return myGroups.length;
      case "my-memberships":
        return memberGroups.length;
      default:
        return 0;
  }
  };

  // Filtrage des groupes
  const filteredGroups = useMemo(() => {
    console.log('Filtering groups with query:', searchQuery); // Debug
    console.log('Total groups:', groups.length); // Debug
    
    return groups.filter(group => 
      searchQuery === "" || 
      String(group.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(group.description).toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [groups, searchQuery]);

  console.log('Filtered groups:', filteredGroups.length); // Debug

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 w-64 animate-pulse rounded bg-slate-200"></div>
              <div className="h-4 w-96 animate-pulse rounded bg-slate-200"></div>
            </div>
            <div className="h-10 w-32 animate-pulse rounded bg-slate-200"></div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="size-12 rounded-xl bg-slate-200"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-slate-200"></div>
                      <div className="h-6 w-1/2 rounded bg-slate-200"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Groupes</h1>
            <p className="max-w-2xl text-slate-600">
              Découvrez des communautés d&apos;entraînement et gérez vos groupes
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Create Group Button */}
            <Link href="/groups/create">
              <Button className="gap-2">
                <Plus className="size-4" />
                Créer un groupe
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <GroupsStats 
            showCharts={false}
            showGrowth={true}
            showCategories={true}
          />
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          {/* Barre de recherche en haut */}
          <div className="mb-6">
            <div className="relative mx-auto max-w-2xl">
              <Search className="absolute left-3 top-3 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher des groupes..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full rounded-md border border-slate-300 py-2 pl-10 pr-4 text-sm"
              />
            </div>
          </div>
          
          {/* Filtres et contrôles centrés */}
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="size-4" />
              Filtres
            </Button>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-slate-200 p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange("grid")}
                className="size-8 p-0"
              >
                <Grid3X3 className="size-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleViewModeChange("list")}
                className="size-8 p-0"
              >
                <List className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discover" className="flex items-center gap-2">
              Découvrir
              <Badge variant="secondary" className="ml-1">
                {getTabCount("discover")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="my-groups" className="flex items-center gap-2">
              Mes groupes
              <Badge variant="secondary" className="ml-1">
                {getTabCount("my-groups")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="my-memberships" className="flex items-center gap-2">
              Mes adhésions
              <Badge variant="secondary" className="ml-1">
                {getTabCount("my-memberships")}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* Onglet Découvrir */}
          <TabsContent value="discover" className="space-y-6">
            {/* Sous-onglets pour la découverte */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">Tous les groupes</TabsTrigger>
                <TabsTrigger value="trending">Tendances</TabsTrigger>
                <TabsTrigger value="recent">Récents</TabsTrigger>
                <TabsTrigger value="categories">Catégories</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                <GroupsList 
                  groups={filteredGroups}
                  viewMode={viewMode}
                  showCreateButton={false}
                  showFilters={false}
                  onGroupClick={handleGroupClick}
                />
              </TabsContent>

              <TabsContent value="trending" className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-slate-900">Groupes tendance</h2>
                  <GroupsList 
                    groups={filteredGroups}
                    viewMode={viewMode}
                    showCreateButton={false}
                    showFilters={false}
                    onGroupClick={handleGroupClick}
                  />
                </div>
              </TabsContent>

              <TabsContent value="recent" className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-slate-900">Groupes récents</h2>
                  <GroupsList
                    groups={filteredGroups}
                    viewMode={viewMode}
                    showCreateButton={false}
                    showFilters={false}
                    onGroupClick={handleGroupClick}
                  />
                </div>
              </TabsContent>

              <TabsContent value="categories" className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-slate-900">Explorer par catégorie</h2>
                  
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                    {popularCategories.map((category) => (
                      <Link key={category.name} href={`/groups?category=${category.name}`}>
                        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg">
                          <CardContent className="p-6 text-center">
                            <div className="mb-3 text-4xl">{category.icon}</div>
                            <h3 className="font-semibold text-slate-900 transition-colors group-hover:text-primary">
                              {category.name}
                            </h3>
                            <p className="mt-1 text-sm text-slate-600">
                              {category.count} groupe{category.count > 1 ? 's' : ''}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Onglet Mes groupes */}
          <TabsContent value="my-groups" className="space-y-6">
            {myGroups.length > 0 ? (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="rounded-xl bg-yellow-100 p-3">
                          <Crown className="size-6 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Groupes administrés</p>
                          <p className="text-2xl font-bold text-slate-900">{adminGroups.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="rounded-xl bg-blue-100 p-3">
                          <Shield className="size-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Groupes modérés</p>
                          <p className="text-2xl font-bold text-slate-900">{moderatedGroups.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3">
                        <div className="rounded-xl bg-green-100 p-3">
                          <Activity className="size-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-600">Total</p>
                          <p className="text-2xl font-bold text-slate-900">{myGroups.length}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <GroupsList 
                  groups={myGroups}
                  viewMode={viewMode}
                  showCreateButton={false}
                  showFilters={false}
                  onGroupClick={handleGroupClick}
                />
              </>
            ) : (
              <div className="py-12 text-center">
                <Users className="mx-auto mb-4 size-16 text-slate-400" />
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  Aucun groupe à gérer
                </h3>
                <p className="mb-6 text-slate-600">
                  Vous n&apos;avez pas encore de groupes à gérer. Créez votre premier groupe !
                </p>
                <Link href="/groups/create">
                  <Button className="gap-2">
                    <Plus className="size-4" />
                    Créer un groupe
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          {/* Onglet Mes adhésions */}
          <TabsContent value="my-memberships" className="space-y-6">
            {memberGroups.length > 0 ? (
              <GroupsList 
                groups={memberGroups}
                viewMode={viewMode}
                showCreateButton={false}
                showFilters={false}
                onGroupClick={handleGroupClick}
              />
            ) : (
              <div className="py-12 text-center">
                <Users className="mx-auto mb-4 size-16 text-slate-400" />
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  Aucune adhésion
                </h3>
                <p className="mb-6 text-slate-600">
                  Vous n&apos;avez pas encore rejoint de groupes. Découvrez des communautés !
                </p>
                <Button 
                  onClick={() => setActiveTab("discover")}
                  className="gap-2"
                >
                  Découvrir des groupes
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Community Highlights */}
        <div className="mt-12 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Points forts de la communauté</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card className="from-primary/2 via-primary/1 to-primary/2 group relative overflow-hidden border-0 bg-gradient-to-br shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="bg-primary/8 rounded-xl p-3 backdrop-blur-sm">
                    <Users className="size-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-slate-900">Communauté active</h3>
                </div>
                <p className="text-sm text-slate-700">
                  Rejoignez des milliers de passionnés de fitness et partagez vos objectifs.
                </p>
                <div className="bg-primary/2 absolute -right-4 -top-4 size-16 rounded-full blur-xl"></div>
              </CardContent>
            </Card>

            <Card className="from-primary/2 via-primary/1 to-primary/2 group relative overflow-hidden border-0 bg-gradient-to-br shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="bg-primary/8 rounded-xl p-3 backdrop-blur-sm">
                    <Target className="size-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-slate-900">Objectifs partagés</h3>
                </div>
                <p className="text-sm text-slate-700">
                  Atteignez vos objectifs fitness avec le soutien de votre communauté.
                </p>
                <div className="bg-primary/2 absolute -right-4 -top-4 size-16 rounded-full blur-xl"></div>
              </CardContent>
            </Card>

            <Card className="from-primary/2 via-primary/1 to-primary/2 group relative overflow-hidden border-0 bg-gradient-to-br shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center space-x-3">
                  <div className="bg-primary/8 rounded-xl p-3 backdrop-blur-sm">
                    <Award className="size-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-slate-900">Récompenses</h3>
                </div>
                <p className="text-sm text-slate-700">
                  Gagnez des badges et des récompenses en atteignant vos objectifs.
                </p>
                <div className="bg-primary/2 absolute -right-4 -top-4 size-16 rounded-full blur-xl"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de détails du groupe */}
      <GroupDetailsModal
        group={selectedGroup}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}
