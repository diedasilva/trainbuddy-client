"use client";

import React from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

export default function CreateGroupPage() {
  const handleCreateGroup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const groupData = {
      name: formData.get("name"),
      description: formData.get("description"),
      status: formData.get("status"),
    };
    console.log(groupData);
    // API call to create group
  };

  // Something responsive and good looking
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Create a Group</h1>
      <form onSubmit={handleCreateGroup} className="flex flex-col gap-4">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" type="text" required />
        <Label htmlFor="description">Description</Label>
        <Input id="description" name="description" type="text" required />
        <Label htmlFor="status">Status</Label>
        <select id="status" name="status" required>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
        <Button type="submit">Create Group</Button>
      </form>
    </div>
  );
}
