"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { Group, UserData, ChartItem } from "./types";
import ChartDialog from "./chart-dialog";
import Chart from "@/components/chart/Chart";

interface GroupsStatsProps {
  userGroups: Group[];
  onAddChart: (groupId: string, newChart: ChartItem) => void;
  onEditChart: (groupId: string, chartIndex: number, updatedChart: ChartItem) => void;
  onDeleteChart: (groupId: string, chartIndex: number) => void;
}

/**
 * Displays each group's stats (charts) and a button to add new charts.
 */
export default function GroupsStats({
  userGroups,
  onAddChart,
  onEditChart,
  onDeleteChart,
}: GroupsStatsProps) {
  // Track which group is selected for adding/editing a chart
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingChartIndex, setEditingChartIndex] = useState<number | null>(null);

  /**
   * Opens the "add chart" dialog for the specified group.
   */
  function openAddChartDialog(groupId: string) {
    setSelectedGroupId(groupId);
    setIsEditing(false);
    setEditingChartIndex(null);
  }

  /**
   * Opens the "edit chart" dialog for a given group and chart index.
   */
  function openEditChartDialog(groupId: string, chartIndex: number) {
    setSelectedGroupId(groupId);
    setIsEditing(true);
    setEditingChartIndex(chartIndex);
  }


  const currentGroup = selectedGroupId
    ? userGroups.find((g) => g.id === selectedGroupId)
    : null;

  const chartToEdit =
    currentGroup && editingChartIndex !== null
      ? currentGroup.charts[editingChartIndex]
      : null;

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-2xl font-semibold">My Groups Stats</h2>
      {userGroups.map((group) => (
        <div key={group.id} className="mb-8">
          <div className="mb-4 flex items-center">
            <h3 className="text-xl font-semibold">{group.name} Stats</h3>
            <Button
              variant="outline"
              className="ml-2"
              onClick={() => openAddChartDialog(group.id)}
            >
              <Plus />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            {group.charts.map((chartItem, i) => {
              let parsedData: UserData[] = [];
              try {
                parsedData = JSON.parse(chartItem.data) as UserData[];
              } catch (error) {
                console.error("Error parsing JSON data", error);
              }

              return (
                <Chart
                  key={i}
                  type={chartItem.type}
                  data={parsedData}
                  dataKey="score"
                  title={chartItem.title}
                  onDelete={() => onDeleteChart(group.id, i)}
                  onEdit={() => openEditChartDialog(group.id, i)}
                  min={chartItem.min}
                  max={chartItem.max}
                />
              );
            })}
          </div>
        </div>
      ))}

      {/* Chart dialog (both add and edit) */}
      {selectedGroupId !== null && (
        <ChartDialog
          groupId={selectedGroupId}
          isEditing={isEditing}
          editingChartIndex={editingChartIndex}
          chartToEdit={chartToEdit}
          onClose={() => setSelectedGroupId(null)}
          onAddChart={onAddChart}
          onEditChart={onEditChart}
        />
      )}
    </div>
  );
}
