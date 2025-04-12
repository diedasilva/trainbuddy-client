"use client";

import React, { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface GroupsHeaderProps {
  onCreateGroup: (
    name: string,
    status: string,
    coachName: string,
    imCoach: boolean
  ) => void;
  onJoinGroup: (inviteCode: string) => void;
}

/**
 * Renders the header section with "Create Group" and "Join Group" modals.
 */
export default function GroupsHeader({
  onCreateGroup,
  onJoinGroup,
}: GroupsHeaderProps) {
  // Dialog states for "Create Group"
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupStatus, setNewGroupStatus] = useState("Public");
  const [coachName, setCoachName] = useState("");
  const [imCoach, setImCoach] = useState(false);

  // Dialog states for "Join Group"
  const [openJoinDialog, setOpenJoinDialog] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  /**
   * Handles form submit for creating a group.
   */
  function handleCreateGroupSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onCreateGroup(newGroupName, newGroupStatus, coachName, imCoach);
    setOpenCreateDialog(false);

    // Reset form
    setNewGroupName("");
    setNewGroupStatus("Public");
    setCoachName("");
    setImCoach(false);
  }

  /**
   * Handles form submit for joining a group.
   */
  function handleJoinGroupSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onJoinGroup(inviteCode);
    setOpenJoinDialog(false);
    setInviteCode("");
  }

  return (
    <div className="mb-4 flex items-center justify-between">
      <h1 className="text-3xl font-bold">My Groups</h1>
      <div className="flex space-x-2">
        {/* CREATE GROUP BUTTON + DIALOG */}
        <Button onClick={() => setOpenCreateDialog(true)}>Create Group</Button>
        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Group</DialogTitle>
              <DialogDescription>
                Fill in the information to create a new group.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateGroupSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Group Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter group name"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="mt-1 block w-full rounded border border-gray-300 p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Status</label>
                <select
                  value={newGroupStatus}
                  onChange={(e) => setNewGroupStatus(e.target.value)}
                  className="mt-1 block w-full rounded border border-gray-300 p-2"
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Coach</label>
                {!imCoach && (
                  <input
                    type="text"
                    required
                    placeholder="Coach name"
                    value={coachName}
                    onChange={(e) => setCoachName(e.target.value)}
                    className="mt-1 block w-full rounded border border-gray-300 p-2"
                  />
                )}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="imCoach"
                    checked={imCoach}
                    onCheckedChange={(val) => setImCoach(Boolean(val))}
                  />
                  <label htmlFor="imCoach" className="text-sm font-medium">
                    I am the coach
                  </label>
                </div>
              </div>
              <DialogFooter className="flex justify-end">
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* JOIN GROUP BUTTON + DIALOG */}
        <Button onClick={() => setOpenJoinDialog(true)}>Join Group</Button>
        <Dialog open={openJoinDialog} onOpenChange={setOpenJoinDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Join Group</DialogTitle>
              <DialogDescription>
                Enter the invite code to join an existing group.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleJoinGroupSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">
                  Invitation Code
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter code"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="mt-1 block w-full rounded border border-gray-300 p-2"
                />
              </div>
              <DialogFooter className="flex justify-end">
                <Button type="submit">Join</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
