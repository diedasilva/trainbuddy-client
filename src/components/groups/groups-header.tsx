"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Plus, 
  Users, 
  TrendingUp, 
  Calendar,
  Activity,
  Target,
  Award,
  BarChart3,
  Settings,
  Grid3X3,
  List
} from "lucide-react";
import Link from "next/link";

import { GroupStats } from "./types";
import { useGroups } from "@/hooks/useGroups";

interface GroupsHeaderProps {
  title?: string;
  description?: string;
  showStats?: boolean;
  showTabs?: boolean;
  showSearch?: boolean;
  showCreateButton?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: any) => void;
}

export default function GroupsHeader({
  title = "Groupes",
  description = "Rejoignez des communautés d'entraînement et connectez-vous avec d'autres passionnés de fitness",
  showStats = true,
  showTabs = true,
  showSearch = true,
  showCreateButton = true,
  activeTab = "all",
  onTabChange,
  onSearch,
  onFilterChange
}: GroupsHeaderProps) {
  const { groups, loading } = useGroups();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Calculate stats from groups data
  const stats: GroupStats = {
    totalGroups: groups.length,
    totalMembers: groups.reduce((sum, group) => sum + group.totalMembers, 0),
    activeGroups: groups.filter(group => group.activeMembers > 0).length,
    averageEngagement: groups.length > 0 
      ? Math.round(groups.reduce((sum, group) => sum + group.stats.completionRate, 0) / groups.length)
      : 0,
    growthRate: 12.5, // Mock data
    topCategories: [
      { name: "Running", count: groups.filter(g => g.category === "Running").length },
      { name: "Strength", count: groups.filter(g => g.category === "Strength").length },
      { name: "Yoga", count: groups.filter(g => g.category === "Yoga").length },
      { name: "Cycling", count: groups.filter(g => g.category === "Cycling").length }
    ].filter(cat => cat.count > 0).sort((a, b) => b.count - a.count).slice(0, 4),
    monthlyGrowth: [
      { month: "Jan", members: 120 },
      { month: "Fév", members: 145 },
      { month: "Mar", members: 180 },
      { month: "Avr", members: 220 },
      { month: "Mai", members: 280 },
      { month: "Juin", members: 320 }
    ]
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleTabChange = (tab: string) => {
    onTabChange?.(tab);
  };

  const handleViewModeChange = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  const getTabCount = (tab: string) => {
    switch (tab) {
      case "all":
        return stats.totalGroups;
      case "my-groups":
        return groups.filter(g => g.members.some(m => m.name === "Current User")).length;
      case "trending":
        return groups.filter(g => g.activeMembers > 10).length;
      case "recent":
        return groups.filter(g => {
          const createdDate = new Date(g.createdAt);
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          return createdDate > oneWeekAgo;
        }).length;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          <p className="max-w-2xl text-slate-600">{description}</p>
        </div>
        
        <div className="flex items-center gap-3">
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

          {/* Create Group Button */}
          {showCreateButton && (
            <Link href="/groups/create">
              <Button className="gap-2">
                <Plus className="size-4" />
                Créer un groupe
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      {showStats && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Users className="size-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Groupes totaux</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalGroups}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-green-100 p-2">
                  <TrendingUp className="size-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Membres actifs</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.totalMembers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-purple-100 p-2">
                  <Activity className="size-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Groupes actifs</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.activeGroups}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-orange-100 p-2">
                  <Target className="size-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Engagement moyen</p>
                  <p className="text-2xl font-bold text-slate-900">{stats.averageEngagement}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      {showSearch && (
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex max-w-md flex-1 gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 size-4 text-slate-400" />
              <Input
                placeholder="Rechercher des groupes..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="size-4" />
              Filtres
            </Button>
          </div>
        </div>
      )}

      {/* Tabs */}
      {showTabs && (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="flex items-center gap-2">
              Tous les groupes
              <Badge variant="secondary" className="ml-1">
                {getTabCount("all")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="my-groups" className="flex items-center gap-2">
              Mes groupes
              <Badge variant="secondary" className="ml-1">
                {getTabCount("my-groups")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              Tendances
              <Badge variant="secondary" className="ml-1">
                {getTabCount("trending")}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2">
              Récents
              <Badge variant="secondary" className="ml-1">
                {getTabCount("recent")}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      )}

      {/* Top Categories */}
      {stats.topCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-slate-700">Catégories populaires:</span>
          {stats.topCategories.map((category) => (
            <Badge key={category.name} variant="outline" className="cursor-pointer hover:bg-slate-100">
              {category.name} ({category.count})
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
