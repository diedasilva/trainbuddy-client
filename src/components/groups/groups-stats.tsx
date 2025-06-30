"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  Activity, 
  Target, 
  Calendar,
  Award,
  BarChart3,
  Clock,
  Star,
  Zap,
  Heart,
  Trophy
} from "lucide-react";

import { GroupStats } from "./types";
import { useGroups } from "@/hooks/useGroups";

interface GroupsStatsProps {
  showCharts?: boolean;
  showGrowth?: boolean;
  showCategories?: boolean;
  className?: string;
}

export default function GroupsStats({
  showCharts = true,
  showGrowth = true,
  showCategories = true,
  className = ""
}: GroupsStatsProps) {
  const { groups } = useGroups();

  // Calculate comprehensive stats from groups data
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
      { name: "Cycling", count: groups.filter(g => g.category === "Cycling").length },
      { name: "Swimming", count: groups.filter(g => g.category === "Swimming").length },
      { name: "CrossFit", count: groups.filter(g => g.category === "CrossFit").length }
    ].filter(cat => cat.count > 0).sort((a, b) => b.count - a.count).slice(0, 6),
    monthlyGrowth: [
      { month: "Jan", members: 120 },
      { month: "Fév", members: 145 },
      { month: "Mar", members: 180 },
      { month: "Avr", members: 220 },
      { month: "Mai", members: 280 },
      { month: "Juin", members: 320 }
    ]
  };

  // Additional calculated stats
  const totalWorkouts = groups.reduce((sum, group) => sum + group.workoutCount, 0);
  const totalCalories = groups.reduce((sum, group) => sum + group.stats.totalCalories, 0);
  const averageRating = groups.length > 0 
    ? Math.round(groups.reduce((sum, group) => sum + group.stats.averageRating, 0) / groups.length * 10) / 10
    : 0;
  
  const recentGroups = groups.filter(group => {
    const createdDate = new Date(group.createdAt);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return createdDate > oneMonthAgo;
  }).length;

  const getGrowthColor = (rate: number) => {
    if (rate > 10) return "text-green-600";
    if (rate > 5) return "text-yellow-600";
    return "text-red-600";
  };

  const getEngagementColor = (rate: number) => {
    if (rate >= 80) return "text-green-600";
    if (rate >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-yellow-600";
    if (rating >= 4.0) return "text-blue-600";
    return "text-slate-600";
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-blue-100 p-3">
                <Users className="size-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600">Groupes totaux</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalGroups}</p>
                <div className="mt-1 flex items-center">
                  <TrendingUp className="mr-1 size-4 text-green-600" />
                  <span className="text-sm text-green-600">+{stats.growthRate}% ce mois</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-green-100 p-3">
                <Activity className="size-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600">Membres actifs</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalMembers.toLocaleString()}</p>
                <div className="mt-1 flex items-center">
                  <Zap className="mr-1 size-4 text-blue-600" />
                  <span className="text-sm text-blue-600">{stats.activeGroups} groupes actifs</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-purple-100 p-3">
                <Target className="size-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600">Engagement</p>
                <p className={`text-3xl font-bold ${getEngagementColor(stats.averageEngagement)}`}>
                  {stats.averageEngagement}%
                </p>
                <div className="mt-1 flex items-center">
                  <Heart className="mr-1 size-4 text-purple-600" />
                  <span className="text-sm text-purple-600">Taux de participation</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-orange-100 p-3">
                <Star className="size-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-600">Note moyenne</p>
                <p className={`text-3xl font-bold ${getRatingColor(averageRating)}`}>
                  {averageRating}
                </p>
                <div className="mt-1 flex items-center">
                  <Trophy className="mr-1 size-4 text-orange-600" />
                  <span className="text-sm text-orange-600">Satisfaction</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Séances totales</p>
                <p className="text-2xl font-bold text-slate-900">{totalWorkouts.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-blue-100 p-2">
                <Calendar className="size-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Calories brûlées</p>
                <p className="text-2xl font-bold text-slate-900">{totalCalories.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-red-100 p-2">
                <Zap className="size-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Nouveaux groupes</p>
                <p className="text-2xl font-bold text-slate-900">{recentGroups}</p>
              </div>
              <div className="rounded-lg bg-green-100 p-2">
                <Award className="size-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories Breakdown */}
      {showCategories && stats.topCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5" />
              Répartition par catégorie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {stats.topCategories.map((category, index) => (
                <div key={category.name} className="text-center">
                  <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200">
                    <span className="text-lg font-bold text-slate-700">{category.count}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700">{category.name}</p>
                  <p className="text-xs text-slate-500">
                    {Math.round((category.count / stats.totalGroups) * 100)}%
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Growth Chart */}
      {showGrowth && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="size-5" />
              Croissance mensuelle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-32 items-end justify-between space-x-2">
              {stats.monthlyGrowth.map((data, index) => {
                const maxValue = Math.max(...stats.monthlyGrowth.map(d => d.members));
                const height = (data.members / maxValue) * 100;
                const isLatest = index === stats.monthlyGrowth.length - 1;
                
                return (
                  <div key={data.month} className="flex flex-1 flex-col items-center">
                    <div 
                      className={`w-full rounded-t transition-all duration-300 ${
                        isLatest ? 'bg-blue-500' : 'bg-slate-200'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                    <span className="mt-2 text-xs text-slate-600">{data.month}</span>
                    <span className="text-xs font-medium text-slate-700">{data.members}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">
          <Users className="mr-1 size-3" />
          {stats.totalGroups} groupes
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">
          <Activity className="mr-1 size-3" />
          {stats.activeGroups} actifs
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">
          <TrendingUp className="mr-1 size-3" />
          +{stats.growthRate}% croissance
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-slate-100">
          <Clock className="mr-1 size-3" />
          {recentGroups} nouveaux
        </Badge>
      </div>
    </div>
  );
}
