"use client";

import React, { useState, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Group } from "./types";

interface EditGroupDialogProps {
  group: Group;
  onSaveChanges: (updated: Group) => void;
  onDeleteGroup: (groupId: string) => void;
  onClose: () => void;
}

/**
 * Dialog for editing a group's info (name, status, admin).
 */
export default function EditGroupDialog({
  group,
  onSaveChanges,
  onDeleteGroup,
  onClose,
}: EditGroupDialogProps) {
  const [editGroupName, setEditGroupName] = useState(group.name);
  const [editGroupStatus, setEditGroupStatus] = useState(group.status);
  const [editGroupAdmin, setEditGroupAdmin] = useState(group.admin || "");

  /**
   * Handles the submission of the group edit form.
   */
  function handleEditGroupSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const updatedGroup: Group = {
      ...group,
      name: editGroupName,
      status: editGroupStatus,
      admin: editGroupAdmin,
    };
    onSaveChanges(updatedGroup);
    onClose();
  }

  /**
   * Deletes the current group by ID and closes the dialog.
   */
  function handleDeleteGroup() {
    onDeleteGroup(group.id);
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Group</DialogTitle>
          <DialogDescription>Modify the group below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleEditGroupSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Group Name</label>
            <input
              type="text"
              required
              value={editGroupName}
              onChange={(e) => setEditGroupName(e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <select
              value={editGroupStatus}
              onChange={(e) => setEditGroupStatus(e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 p-2"
            >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Transfer admin to</label>
            <select
              value={editGroupAdmin}
              onChange={(e) => setEditGroupAdmin(e.target.value)}
              className="mt-1 block w-full rounded border border-gray-300 p-2"
            >
              <option value="">-- Select a member --</option>
              {group.data.map((member) => (
                <option key={member.name} value={member.name}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter className="flex justify-end space-x-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Group</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this group? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteGroup}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
