"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit } from "lucide-react";

import { Group } from "./types";
import EditGroupDialog from "./edit-group-dialog";

interface GroupsListProps {
  userGroups: Group[];
  isAdmin: boolean;
  onSaveChanges: (updated: Group) => void;
  onDeleteGroup: (groupId: string) => void;
}

/**
 * Displays the list of groups as cards. If isAdmin is true, shows an edit button.
 */
export default function GroupsList({
  userGroups,
  isAdmin,
  onSaveChanges,
  onDeleteGroup,
}: GroupsListProps) {
  // Track which group is being edited
  const [groupBeingEdited, setGroupBeingEdited] = useState<Group | null>(null);

  return (
    <>
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-4">
        {userGroups.map((group) => (
          <Card key={group.id} className="p-4 relative">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{group.name}</h2>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setGroupBeingEdited(group)}
                >
                  <Edit />
                </Button>
              )}
            </div>
            <p>Status: {group.status}</p>
            <p>Workouts: {group.workoutCount}</p>
            <p>Admin: {group.admin}</p>
            <p>Last Activity: {group.lastActivity}</p>
            <Button variant="default" className="mt-2">
              <Link href={`/groups/${group.id}`}>View Details</Link>
            </Button>
          </Card>
        ))}
      </div>

      {/* Edit dialog (opens if groupBeingEdited != null) */}
      {isAdmin && groupBeingEdited && (
        <EditGroupDialog
          group={groupBeingEdited}
          onSaveChanges={onSaveChanges}
          onDeleteGroup={onDeleteGroup}
          onClose={() => setGroupBeingEdited(null)}
        />
      )}
    </>
  );
}
