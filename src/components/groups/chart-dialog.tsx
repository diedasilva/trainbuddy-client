"use client";

import React, { useState, FormEvent, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ChartItem } from "./types";

interface ChartDialogProps {
  groupId: string;
  isEditing: boolean;
  editingChartIndex: number | null;
  chartToEdit?: ChartItem | null;  
  onClose: () => void;
  onAddChart: (groupId: string, newChart: ChartItem) => void;
  onEditChart: (
    groupId: string,
    chartIndex: number,
    updatedChart: ChartItem
  ) => void;
}

/**
 * A dialog for adding or editing a chart (bar/line/pie).
 */
export default function ChartDialog({
  groupId,
  isEditing,
  editingChartIndex,
  chartToEdit,
  onClose,
  onAddChart,
  onEditChart,
}: ChartDialogProps) {
  // States for chart fields
  const [chartTitle, setChartTitle] = useState("");
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar");
  const [chartRows, setChartRows] = useState<{ name: string; score: number }[]>([
    { name: "", score: 0 },
  ]);
  const [chartMin, setChartMin] = useState("");
  const [chartMax, setChartMax] = useState("");
  const [formError, setFormError] = useState("");

  /**
   * Splits an array into chunks to render data rows in columns if needed.
   */
  function chunkArray<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  /**
   * If we're editing, load the existing chart data into our local state.
   * If we're adding, reset everything.
   */
  useEffect(() => {
    if (isEditing && chartToEdit) {
      setChartTitle(chartToEdit.title);
      setChartType(chartToEdit.type);

      // Convert chartToEdit.data from JSON to our rows
      try {
        const rows = JSON.parse(chartToEdit.data) as { name: string; score: number }[];
        setChartRows(rows);
      } catch (error) {
        setChartRows([]);
        console.error("Failed to parse existing chart data", error);
      }

      setChartMin(chartToEdit.min !== undefined ? String(chartToEdit.min) : "");
      setChartMax(chartToEdit.max !== undefined ? String(chartToEdit.max) : "");
      setFormError("");
    } else {
      // Adding a new chart
      setChartTitle("");
      setChartType("bar");
      setChartRows([{ name: "", score: 0 }]);
      setChartMin("");
      setChartMax("");
      setFormError("");
    }
  }, [isEditing, chartToEdit]);

  /**
   * Validates chart data to ensure scores fit within optional min/max.
   */
  function validateChartData(): boolean {
    const minVal = chartMin !== "" ? parseFloat(chartMin) : undefined;
    const maxVal = chartMax !== "" ? parseFloat(chartMax) : undefined;

    for (const row of chartRows) {
      if (minVal !== undefined && row.score < minVal) {
        setFormError(
          `The score of "${row.name}" : ${row.score} is below the min (${minVal}).`
        );
        return false;
      }
      if (maxVal !== undefined && row.score > maxVal) {
        setFormError(
          `The score of "${row.name}" : ${row.score} exceeds the max (${maxVal}).`
        );
        return false;
      }
    }

    setFormError("");
    return true;
  }

  /**
   * Submits the form, creating or updating the chart.
   */
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateChartData()) return;

    const newChart: ChartItem = {
      title: chartTitle,
      type: chartType,
      data: JSON.stringify(chartRows),
      min: chartMin !== "" ? parseFloat(chartMin) : undefined,
      max: chartMax !== "" ? parseFloat(chartMax) : undefined,
    };

    if (!isEditing) {
      onAddChart(groupId, newChart);
    } else if (editingChartIndex !== null) {
      onEditChart(groupId, editingChartIndex, newChart);
    }
    onClose();
  }

  /**
   * Adds an empty row.
   */
  function handleAddRow() {
    setChartRows((prev) => [...prev, { name: "", score: 0 }]);
  }

  /**
   * Removes a row by index.
   */
  function handleRemoveRow(index: number) {
    setChartRows((prev) => prev.filter((_, i) => i !== index));
  }

  /**
   * Updates a row's name or score.
   */
  function handleChangeRow(index: number, field: "name" | "score", value: string) {
    setChartRows((prev) => {
      const updated = [...prev];
      if (field === "score") {
        updated[index].score = parseInt(value, 10) || 0;
      } else {
        updated[index].name = value;
      }
      return updated;
    });
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[99vh] max-w-[90vw] overflow-x-auto">
        <div className="relative">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit this Chart" : "Add a new Chart"}
            </DialogTitle>
            <DialogDescription>Configure your chart below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="w-1/2">
              <label className="mb-1 block font-medium">Chart Title</label>
              <input
                className="w-full rounded border border-gray-300 p-2"
                type="text"
                value={chartTitle}
                onChange={(e) => setChartTitle(e.target.value)}
                required
              />
            </div>

            <div className="w-1/2">
              <label className="mb-1 block font-medium">Chart Type</label>
              <select
                className="w-full rounded border border-gray-300 p-2"
                value={chartType}
                onChange={(e) =>
                  setChartType(e.target.value as "bar" | "line" | "pie")
                }
              >
                <option value="bar">Bar</option>
                <option value="line">Line</option>
                <option value="pie">Pie</option>
              </select>
            </div>

            {/* Show Min/Max only if not Pie */}
            {chartType !== "pie" && (
              <div className="grid w-1/2 grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block font-medium">Min Y-Axis</label>
                  <input
                    className="rounded border border-gray-300 p-2"
                    type="number"
                    placeholder="Minimum"
                    value={chartMin}
                    onChange={(e) => setChartMin(e.target.value)}
                  />
                </div>
                <div>
                  <label className="mb-1 block font-medium">Max Y-Axis</label>
                  <input
                    className="rounded border border-gray-300 p-2"
                    type="number"
                    placeholder="Maximum"
                    value={chartMax}
                    onChange={(e) => setChartMax(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-2 block font-medium">Data Entries</label>
              <div className="grid grid-cols-4 gap-8">
                {chunkArray(chartRows, 10).map((rowsChunk, colIndex) => (
                  <div key={colIndex} className="space-y-2">
                    {rowsChunk.map((row, i) => {
                      const globalIndex = colIndex * 10 + i;
                      return (
                        <div
                          key={globalIndex}
                          className="flex items-center space-x-2"
                        >
                          <input
                            className="max-w-32 rounded border border-gray-300 p-2"
                            type="text"
                            placeholder="Name"
                            value={row.name}
                            onChange={(e) =>
                              handleChangeRow(globalIndex, "name", e.target.value)
                            }
                          />
                          <input
                            className="max-w-24 rounded border border-gray-300 p-2"
                            type="number"
                            placeholder="Score"
                            value={row.score}
                            onChange={(e) =>
                              handleChangeRow(globalIndex, "score", e.target.value)
                            }
                          />
                          {globalIndex > 0 && (
                            <X
                              onClick={() => handleRemoveRow(globalIndex)}
                              className="size-4 cursor-pointer"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {formError && <p className="text-sm text-red-500">{formError}</p>}

            <DialogFooter className="sticky bottom-0 justify-between p-2">
              <Button type="button" variant="outline" onClick={handleAddRow}>
                Add Row
              </Button>
              <Button type="submit" variant="default">
                {isEditing ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
