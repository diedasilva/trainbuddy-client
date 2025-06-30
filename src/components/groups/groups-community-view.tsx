"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  Activity, 
  Star,
  MessageSquare,
  Heart,
  Share2,
  MoreHorizontal,
  Eye,
  UserPlus,
  Award,
  Target,
  Zap,
  Clock,
  UserMinus
} from "lucide-react";
import Link from "next/link";

import { Group } from "./types";
import { useGroups } from "@/hooks/useGroups";
import GroupsList from "./groups-list";
import GroupsStats from "./groups-stats";

interface GroupsCommunityViewProps {
  showStats?: boolean;
  showTrending?: boolean;
  showRecent?: boolean;
  maxGroups?: number;
}

export default function GroupsCommunityView({
  showStats = true,
  showTrending = true,
  showRecent = true,
  maxGroups = 6
}: GroupsCommunityViewProps) {
  const { groups, loading, getMembershipStatus, joinGroup, leaveGroup } = useGroups();
  const [activeTab, setActiveTab] = useState("overview");

  // Filter groups based on different criteria
  const trendingGroups = groups
    .filter(group => group.activeMembers > 10)
    .sort((a, b) => b.activeMembers - a.activeMembers)
    .slice(0, maxGroups);

  const recentGroups = groups
    .filter(group => {
      const createdDate = new Date(group.createdAt);
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return createdDate > oneWeekAgo;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, maxGroups);

  const popularCategories = [
    { name: "Running", count: groups.filter(g => g.category === "Running").length, icon: "🏃" },
    { name: "Strength", count: groups.filter(g => g.category === "Strength").length, icon: "💪" },
    { name: "Yoga", count: groups.filter(g => g.category === "Yoga").length, icon: "🧘" },
    { name: "Cycling", count: groups.filter(g => g.category === "Cycling").length, icon: "🚴" },
    { name: "Swimming", count: groups.filter(g => g.category === "Swimming").length, icon: "🏊" },
    { name: "CrossFit", count: groups.filter(g => g.category === "CrossFit").length, icon: "🔥" }
  ].filter(cat => cat.count > 0).sort((a, b) => b.count - a.count).slice(0, 6);

  const handleJoinGroup = async (groupId: number) => {
    const success = await joinGroup(groupId);
    if (success) {
      // Show success message
    }
  };

  const handleLeaveGroup = async (groupId: number) => {
    const success = await leaveGroup(groupId);
    if (success) {
      // Show success message
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "public":
        return "bg-green-100 text-green-800";
      case "private":
        return "bg-red-100 text-red-800";
      case "invite-only":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Running":
        return "bg-blue-100 text-blue-800";
      case "Strength":
        return "bg-red-100 text-red-800";
      case "Yoga":
        return "bg-purple-100 text-purple-800";
      case "Cycling":
        return "bg-orange-100 text-orange-800";
      case "Swimming":
        return "bg-cyan-100 text-cyan-800";
      case "CrossFit":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
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
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      {showStats && (
        <GroupsStats 
          showCharts={false}
          showGrowth={true}
          showCategories={true}
        />
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="trending">Tendances</TabsTrigger>
          <TabsTrigger value="recent">Récents</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Featured Groups */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Groupes en vedette</h2>
              <Link href="/groups">
                <Button variant="outline" size="sm">
                  Voir tous les groupes
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {groups.slice(0, 6).map((group) => {
                const membershipStatus = getMembershipStatus(group.id);
                
                return (
                  <Card key={group.id} className="group transition-all duration-300 hover:shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="size-12">
                            <AvatarImage src={group.avatarUrl} alt={group.name} />
                            <AvatarFallback className="bg-slate-200 font-semibold text-slate-700">
                              {group.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="truncate text-lg font-semibold transition-colors group-hover:text-primary">
                              {group.name}
                            </CardTitle>
                            <div className="mt-1 flex items-center space-x-2">
                              <Badge className={getStatusColor(group.status)}>
                                {group.status}
                              </Badge>
                              <Badge variant="outline" className={getCategoryColor(group.category)}>
                                {group.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <p className="line-clamp-2 text-sm text-slate-600">
                        {group.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Users className="size-4 text-slate-500" />
                          <span>{group.totalMembers} membres</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Activity className="size-4 text-slate-500" />
                          <span>{group.workoutCount} séances</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="size-4 text-slate-500" />
                          <span>{group.activeMembers} actifs</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="size-4 text-slate-500" />
                          <span>{group.stats.averageRating}/5</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                          <Calendar className="size-3" />
                          <span>{group.lastActivity}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {membershipStatus === "member" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLeaveGroup(group.id)}
                              className="gap-1"
                            >
                              <UserMinus className="size-3" />
                              Quitter
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleJoinGroup(group.id)}
                              className="gap-1"
                            >
                              <UserPlus className="size-3" />
                              Rejoindre
                            </Button>
                          )}
                          
                          <Link href={`/groups/${group.id}`}>
                            <Button variant="ghost" size="sm" className="gap-1">
                              <Eye className="size-3" />
                              Voir
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          {showTrending && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Groupes tendance</h2>
              <GroupsList 
                showCreateButton={false}
                showFilters={false}
                maxGroups={maxGroups}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          {showRecent && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Groupes récents</h2>
              <GroupsList 
                showCreateButton={false}
                showFilters={false}
                maxGroups={maxGroups}
              />
            </div>
          )}
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

      {/* Community Highlights */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900">Points forts de la communauté</h2>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center space-x-3">
                <div className="rounded-lg bg-blue-500 p-2">
                  <Users className="size-5 text-white" />
                </div>
                <h3 className="font-semibold text-blue-900">Communauté active</h3>
              </div>
              <p className="text-sm text-blue-800">
                Rejoignez des milliers de passionnés de fitness et partagez vos objectifs.
              </p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center space-x-3">
                <div className="rounded-lg bg-green-500 p-2">
                  <Target className="size-5 text-white" />
                </div>
                <h3 className="font-semibold text-green-900">Objectifs partagés</h3>
              </div>
              <p className="text-sm text-green-800">
                Atteignez vos objectifs fitness avec le soutien de votre communauté.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center space-x-3">
                <div className="rounded-lg bg-purple-500 p-2">
                  <Award className="size-5 text-white" />
                </div>
                <h3 className="font-semibold text-purple-900">Récompenses</h3>
              </div>
              <p className="text-sm text-purple-800">
                Gagnez des badges et des récompenses en atteignant vos objectifs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 