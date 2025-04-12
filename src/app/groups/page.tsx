"use client";

import React, { useState } from "react";

// On importe nos composants séparés :
import GroupsHeader from "@/components/groups/groups-header";
import GroupsList from "@/components/groups/groups-list";
import GroupsStats from "@/components/groups/groups-stats";

// On importe nos interfaces/typage :
import { Group, ChartItem } from "@/components/groups/types";

export default function GroupsPage() {
  // Liste initiale des groupes
  const [userGroups, setUserGroups] = useState<Group[]>([
    {
      id: "1",
      name: "Fitness Squad",
      status: "Private",
      admin: "Alice",
      workoutCount: 12,
      lastActivity: "2024-12-25",
      data: [
        { name: "Alice", score: 60 },
        { name: "Bob", score: 95 },
        { name: "Charlie", score: 70 },
      ],
      charts: [],
    },
    {
      id: "2",
      name: "Yoga Lovers",
      status: "Public",
      admin: "Denise",
      workoutCount: 8,
      lastActivity: "2024-12-22",
      data: [
        { name: "Denise", score: 80 },
        { name: "Ethan", score: 75 },
        { name: "Flora", score: 90 },
      ],
      charts: [],
    },
    {
      id: "3",
      name: "Pilates Crew",
      status: "Public",
      admin: "Gina",
      workoutCount: 8,
      lastActivity: "2024-12-22",
      data: [
        { name: "Gina", score: 65 },
        { name: "Henry", score: 100 },
        { name: "Iris", score: 80 },
      ],
      charts: [],
    },
  ]);

  // isAdmin est conservé pour simuler l'admin
  const [isAdmin] = useState(true);

  /**
   * Creates a new group based on form data and adds it to userGroups.
   */
  function handleCreateGroup(
    newGroupName: string,
    newGroupStatus: string,
    coachName: string,
    imCoach: boolean
  ) {
    const newGroup: Group = {
      id: Date.now().toString(),
      name: newGroupName,
      status: newGroupStatus,
      admin: imCoach ? "You" : coachName,
      workoutCount: 0,
      lastActivity: new Date().toISOString().split("T")[0],
      data: [],
      charts: [],
    };
    setUserGroups([...userGroups, newGroup]);
  }

  /**
   * Joins a group with an invitation code (just logs for now).
   */
  function handleJoinGroup(inviteCode: string) {
    console.log("Rejoindre le groupe via code:", inviteCode);
  }

  /**
   * Saves the edited group (changes name, status, admin).
   */
  function handleSaveGroupChanges(updated: Group) {
    setUserGroups((prev) =>
      prev.map((g) => (g.id === updated.id ? updated : g))
    );
  }

  /**
   * Deletes a group by ID.
   */
  function handleDeleteGroup(groupId: string) {
    setUserGroups((prev) => prev.filter((g) => g.id !== groupId));
  }

  /**
   * Adds a new chart to a group.
   */
  function handleAddChartToGroup(groupId: string, newChart: ChartItem) {
    setUserGroups((prev) =>
      prev.map((group) =>
        group.id === groupId
          ? { ...group, charts: [...group.charts, newChart] }
          : group
      )
    );
  }

  /**
   * Updates an existing chart in a group.
   */
  function handleUpdateChart(
    groupId: string,
    chartIndex: number,
    updatedChart: ChartItem
  ) {
    setUserGroups((prev) =>
      prev.map((group) => {
        if (group.id !== groupId) return group;
        const updatedCharts = [...group.charts];
        updatedCharts[chartIndex] = updatedChart;
        return { ...group, charts: updatedCharts };
      })
    );
  }

  /**
   * Deletes a chart by index from a group.
   */
  function handleDeleteChart(groupId: string, chartIndex: number) {
    setUserGroups((prev) =>
      prev.map((group) => {
        if (group.id !== groupId) return group;
        return {
          ...group,
          charts: group.charts.filter((_, i) => i !== chartIndex),
        };
      })
    );
  }

  return (
    <div className="p-8">
      {/* Header: Create + Join dialogs */}
      <GroupsHeader onCreateGroup={handleCreateGroup} onJoinGroup={handleJoinGroup} />

      {/* List of groups (cards) + Admin can edit */}
      <GroupsList
        userGroups={userGroups}
        isAdmin={isAdmin}
        onSaveChanges={handleSaveGroupChanges}
        onDeleteGroup={handleDeleteGroup}
      />

      {/* Stats section: charts, plus add/edit chart */}
      <GroupsStats
        userGroups={userGroups}
        onAddChart={handleAddChartToGroup}
        onEditChart={handleUpdateChart}
        onDeleteChart={handleDeleteChart}
      />
    </div>
  );
}
