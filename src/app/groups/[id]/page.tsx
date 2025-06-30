"use client";

import React, { useState, useEffect } from "react";
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
  ArrowLeft,
  Users, 
  Calendar, 
  Activity, 
  Star,
  Share2,
  Edit3,
  Crown,
  Shield,
  UserPlus,
  UserMinus,
  TrendingUp,
  Target,
  Clock,
  Globe,
  Lock
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { useGroups } from "@/hooks/groups";
import { mockApi } from "@/lib/api/mockApi";
import type { TableData } from "@/lib/mockDb";

export default function GroupDetailPage() {
  const params = useParams();
  const { getPermissions, getMembershipStatus } = useGroups();
  
  const [group, setGroup] = useState<TableData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  const groupId = parseInt(params.id as string, 10);

  useEffect(() => {
    const loadGroup = async () => {
      if (groupId && !isNaN(groupId)) {
        try {
          const response = await mockApi.getGroupById(groupId);
          if (response.success) {
            setGroup(response.data);
          } else {
            console.error('Erreur lors du chargement du groupe:', response.message);
          }
        } catch (error) {
          console.error('Erreur lors du chargement du groupe:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadGroup();
  }, [groupId]);

  const handleJoinGroup = async () => {
    if (group) {
      console.log('Rejoindre le groupe:', group.id);
      // Simulation - dans une vraie app, on appellerait l'API
      alert('Fonctionnalité de rejoindre un groupe à implémenter');
    }
  };

  const handleLeaveGroup = async () => {
    if (group) {
      console.log('Quitter le groupe:', group.id);
      // Simulation - dans une vraie app, on appellerait l'API
      alert('Fonctionnalité de quitter un groupe à implémenter');
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "public":
        return <Globe className="size-4" />;
      case "private":
        return <Lock className="size-4" />;
      case "invite-only":
        return <Shield className="size-4" />;
      default:
        return <Globe className="size-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="size-10 animate-pulse rounded bg-slate-200"></div>
            <div className="space-y-2">
              <div className="h-8 w-64 animate-pulse rounded bg-slate-200"></div>
              <div className="h-4 w-96 animate-pulse rounded bg-slate-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Users className="mx-auto mb-4 size-16 text-slate-400" />
          <h1 className="mb-2 text-2xl font-bold text-slate-900">Groupe non trouvé</h1>
          <p className="mb-6 text-slate-600">
            Le groupe que vous recherchez n&apos;existe pas ou a été supprimé.
          </p>
          <Link href="/groups">
            <Button>
              <ArrowLeft className="mr-2 size-4" />
              Retour aux groupes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const membershipStatus = getMembershipStatus(Number(group.id));
  const permissions = getPermissions(Number(group.id));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link href="/groups">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="size-4" />
            Retour
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Avatar className="size-16">
              <AvatarImage src={String(group.avatarUrl || '')} alt={String(group.name)} />
              <AvatarFallback className="bg-slate-200 text-xl font-semibold text-slate-700">
                {String(group.name).split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">{String(group.name)}</h1>
              <div className="mt-2 flex items-center space-x-2">
                <Badge className={getStatusColor(String(group.status))}>
                  {getStatusIcon(String(group.status))}
                  <span className="ml-1">{String(group.status)}</span>
                </Badge>
                {permissions.canEdit && (
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                    <Crown className="mr-1 size-3" />
                    Admin
                  </Badge>
                )}
                {permissions.canModerate && !permissions.canEdit && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    <Shield className="mr-1 size-3" />
                    Modérateur
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {permissions.canEdit && (
            <Link href={`/groups/${group.id}/edit`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit3 className="size-4" />
                Modifier
              </Button>
            </Link>
          )}
          
          {membershipStatus === "member" ? (
            <Button
              variant="outline"
              onClick={handleLeaveGroup}
              className="gap-2"
            >
              <UserMinus className="size-4" />
              Quitter
            </Button>
          ) : (
            <Button
              onClick={handleJoinGroup}
              className="gap-2"
            >
              <UserPlus className="size-4" />
              Rejoindre
            </Button>
          )}
          
          <Button variant="ghost" size="sm" className="gap-2">
            <Share2 className="size-4" />
            Partager
          </Button>
        </div>
      </div>

      {/* Description */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <p className="leading-relaxed text-slate-600">
            {String(group.description)}
          </p>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-blue-100 p-3">
                <Users className="size-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Membres</p>
                <p className="text-2xl font-bold text-slate-900">{String(group.totalMembers || 0)}</p>
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
                <p className="text-sm font-medium text-slate-600">Actifs</p>
                <p className="text-2xl font-bold text-slate-900">{String(group.activeMembers || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-purple-100 p-3">
                <Calendar className="size-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Sessions</p>
                <p className="text-2xl font-bold text-slate-900">{String(group.workoutCount || 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="rounded-xl bg-orange-100 p-3">
                <Star className="size-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-600">Note</p>
                <p className="text-2xl font-bold text-slate-900">4.8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="members">Membres</TabsTrigger>
          <TabsTrigger value="activities">Activités</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations du groupe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-600">Catégorie</span>
                  <Badge variant="outline">{String(group.category)}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Créé le</span>
                  <span>{String(group.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Dernière activité</span>
                  <span>{String(group.lastActivity)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Statistiques récentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="size-4 text-green-600" />
                    <span className="text-sm text-slate-600">Croissance</span>
                  </div>
                  <span className="font-semibold text-green-600">+12%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="size-4 text-blue-600" />
                    <span className="text-sm text-slate-600">Objectifs atteints</span>
                  </div>
                  <span className="font-semibold">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="size-4 text-orange-600" />
                    <span className="text-sm text-slate-600">Temps moyen</span>
                  </div>
                  <span className="font-semibold">45 min</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Membres du groupe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Liste des membres à implémenter avec l&apos;API Spring Java.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activités récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Activités récentes à implémenter avec l&apos;API Spring Java.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du groupe</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Paramètres à implémenter avec l&apos;API Spring Java.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
