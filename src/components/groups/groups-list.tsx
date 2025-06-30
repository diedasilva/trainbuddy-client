"use client";

import React, { useState, memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { 
  Search, 
  Plus, 
  Users, 
  Calendar, 
  Activity, 
  Edit3, 
  Trash2, 
  Eye, 
  Crown,
  UserPlus,
  UserMinus,
  TrendingUp,
  MoreHorizontal,
  MapPin,
  Shield
} from "lucide-react";

import { Group } from "./types";
import { useGroups } from "@/hooks/useGroups";
import EditGroupDialog from "./edit-group-dialog";

interface GroupsListProps {
  showCreateButton?: boolean;
  showFilters?: boolean;
  maxGroups?: number;
  category?: string;
  status?: string;
  viewMode?: "grid" | "list";
  onGroupClick?: (group: Group) => void;
}

export default memo(function GroupsList({
  showCreateButton = true,
  showFilters = true,
  maxGroups,
  category,
  status,
  viewMode = "grid",
  onGroupClick
}: GroupsListProps) {
  const {
    groups,
    loading,
    error,
    filters,
    setFilters,
    deleteGroup,
    joinGroup,
    leaveGroup,
    getMembershipStatus,
    getPermissions
  } = useGroups();

  const [groupBeingEdited, setGroupBeingEdited] = useState<Group | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter groups based on props
  const filteredGroups = groups
    .filter(group => !category || group.category === category)
    .filter(group => !status || group.status === status)
    .filter(group => !searchTerm || 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, maxGroups);

  const handleJoinGroup = async (groupId: number) => {
    const success = await joinGroup(groupId);
    if (success) {
      // Show success message or update UI
    }
  };

  const handleLeaveGroup = async (groupId: number) => {
    const success = await leaveGroup(groupId);
    if (success) {
      // Show success message or update UI
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    const success = await deleteGroup(groupId);
    if (success) {
      // Show success message or update UI
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
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'moderator': return <Shield className="w-4 h-4 text-blue-600" />;
      default: return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </div>
      </Card>
    );
  }

  if (viewMode === "grid") {
  return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredGroups.map((group) => (
          <Card key={String(group.id)} className="group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                    <AvatarImage src={String(group.avatarUrl || '')} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {String(group.name).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
                      {String(group.name)}
                    </h3>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getStatusColor(String(group.status))}`}
                    >
                      {String(group.status)}
                        </Badge>
                      </div>
                    </div>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                {String(group.description)}
              </p>

              {/* Stats */}
              <div className="flex items-center justify-between mb-4 text-sm text-slate-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{String(group.totalMembers || 0)} membres</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{String(group.workoutCount || 0)} sessions</span>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="mb-4">
                <Badge variant="outline" className="text-xs">
                  {String(group.category)}
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onGroupClick?.(group)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Voir
                </Button>
                <Button variant="outline" size="sm">
                  <UserPlus className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-4">
      {filteredGroups.map((group) => (
        <Card key={String(group.id)} className="group hover:shadow-md transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={String(group.avatarUrl || '')} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {String(group.name).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
                      {String(group.name)}
                    </h3>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getStatusColor(String(group.status))}`}
                    >
                      {String(group.status)}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-slate-600 line-clamp-1">
                    {String(group.description)}
                  </p>
                  
                  <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{String(group.totalMembers || 0)} membres</span>
                  </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{String(group.workoutCount || 0)} sessions</span>
                  </div>
                    <Badge variant="outline" className="text-xs">
                      {String(group.category)}
                    </Badge>
                  </div>
                </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                  onClick={() => onGroupClick?.(group)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                        Voir
                      </Button>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
      ))}
    </div>
  );
});
