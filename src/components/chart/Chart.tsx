"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
} from "recharts";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Edit } from "lucide-react";

type ChartType = "bar" | "line" | "pie";

interface ChartProps {
  type: ChartType;
  data: { [key: string]: any }[];
  dataKey: string;
  title?: string;
  onDelete?: () => void;
  onEdit?: () => void;
  min?: number;
  max?: number;
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

/**
 * Composant Chart
 * - Affiche le graphique dans une Card.
 * - En cliquant sur le graphique, le même graphique s'ouvre en grand dans un Dialog.
 * - Les boutons pour l'édition et la suppression restent inchangés.
 */
export default function Chart({
  type,
  data,
  dataKey,
  title,
  onDelete,
  onEdit,
  min,
  max,
}: ChartProps) {
  // État pour contrôler l'ouverture du dialog d'agrandissement
  const [openDialog, setOpenDialog] = useState(false);

  // Fonction qui retourne le graphique en variant la taille (selon l'argument enlarged)
  const renderChart = (enlarged: boolean = false) => {
    //const containerHeight = enlarged ? 500 : 300;
    const pieRadius = enlarged ? 120 : 80;
    switch (type) {
      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              domain={[
                min !== undefined ? min : "dataMin",
                max !== undefined ? max : "dataMax",
              ]}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill="#020617" />
          </BarChart>
        );
      case "line":
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              domain={[
                min !== undefined ? min : "dataMin",
                max !== undefined ? max : "dataMax",
              ]}
            />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke="#020617" />
          </LineChart>
        );
      case "pie":
        return (
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={pieRadius}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-4 shadow-lg">
      <div className="m-2 flex items-center justify-between">
        {title && <CardTitle>{title}</CardTitle>}
        <div className="flex space-x-2">
          {onEdit && (
            <Button variant="outline" onClick={onEdit} className="size-9">
              <Edit />
            </Button>
          )}
          {onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="size-9">
                  <X />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this chart? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      <CardContent>
        {/* Enveloppe le graphique dans un div cliquable qui ouvre le dialog */}
        <div onClick={() => setOpenDialog(true)} style={{ cursor: "pointer" }}>
          <ResponsiveContainer width="100%" height={300}>
            {renderChart(false) || <div>No chart available</div>}
          </ResponsiveContainer>
        </div>
      </CardContent>

      {/* Dialog d'agrandissement */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        {/* DialogTrigger ici n'a pas besoin de contenu visible puisqu'on contrôle l'état manuellement */}
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{title || "Graphique en grand"}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={600} minWidth={300}>
              {renderChart(true) || <div>No chart available</div>}
            </ResponsiveContainer>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
