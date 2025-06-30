"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Calendar, 
  MoreHorizontal,
  UserPlus,
  Eye
} from "lucide-react";
import type { TableData } from "@/lib/mockDb";

interface GroupsListProps {
  groups?: TableData[];
  viewMode?: "grid" | "list";
  showCreateButton?: boolean;
  showFilters?: boolean;
  onGroupClick?: (group: TableData) => void;
}

export default function GroupsList({ 
  groups = [], 
  viewMode = "grid",
  onGroupClick
}: GroupsListProps) {
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group: TableData) => (
          <Card key={String(group.id)} className="group transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-6">
              {/* Header */}
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="size-12">
                    <AvatarImage src={String(group.avatarUrl || '')} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {String(group.name).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-slate-900 transition-colors group-hover:text-primary">
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
                <Button variant="ghost" size="sm" className="opacity-0 transition-opacity group-hover:opacity-100">
                  <MoreHorizontal className="size-4" />
                </Button>
              </div>

              {/* Description */}
              <p className="mb-4 line-clamp-2 text-sm text-slate-600">
                {String(group.description)}
              </p>

              {/* Stats */}
              <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Users className="size-4" />
                    <span>{String(group.totalMembers || 0)} membres</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="size-4" />
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
                  <Eye className="mr-2 size-4" />
                  Voir
                </Button>
                <Button variant="outline" size="sm">
                  <UserPlus className="size-4" />
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
      {groups.map((group: TableData) => (
        <Card key={String(group.id)} className="group transition-all duration-300 hover:shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="size-10">
                  <AvatarImage src={String(group.avatarUrl || '')} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {String(group.name).charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="mb-1 flex items-center space-x-2">
                    <h3 className="font-semibold text-slate-900 transition-colors group-hover:text-primary">
                      {String(group.name)}
                    </h3>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getStatusColor(String(group.status))}`}
                    >
                      {String(group.status)}
                    </Badge>
                  </div>
                  
                  <p className="line-clamp-1 text-sm text-slate-600">
                    {String(group.description)}
                  </p>
                  
                  <div className="mt-2 flex items-center space-x-4 text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Users className="size-3" />
                      <span>{String(group.totalMembers || 0)} membres</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="size-3" />
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
                  <Eye className="mr-2 size-4" />
                  Voir
                </Button>
                <Button variant="ghost" size="sm" className="opacity-0 transition-opacity group-hover:opacity-100">
                  <MoreHorizontal className="size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 