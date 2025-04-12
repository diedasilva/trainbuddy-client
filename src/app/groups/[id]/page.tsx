import React from "react";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Bar, BarChart} from "@/components/ui/chart";
import { Table } from "lucide-react";

interface Params {
  id: string;
}

interface GroupDetailsPageProps {
  params: Params;
}

/**
 * La page de détails d'un groupe.
 * On va détailler tout les paramètres du groupe.
 * Nom, description, status, membres, admin, nextWorkout, workoutHistory, groupStats, groupProgress, leaderboard, etc..
 * @param param0 
 * @returns 
 */
export default function GroupDetailsPage({ params } : GroupDetailsPageProps) {
  // Api call to get group details
  const group = {
    id: params.id,
    name: "Fitness Squad",
    description: "A group for fitness enthusiasts.",
    status: "Private",
    nextWorkout: { date: "2024-12-29", type: "Strength Training", duration: "1 hour" },
    members: [
      { id: "1", name: "John Doe", isAdmin: true, presenceRate: 90 },
      { id: "2", name: "Jane Smith", isAdmin: false, presenceRate: 70 },
    ],
    leaderboard: [
      { name: "John Doe", points: 120 },
      { name: "Jane Smith", points: 100 },
    ],
  };

  // Pas de table
  return (
    <div className="p-8">
      <h1 className="mb-4 text-3xl font-bold">{group.name}</h1>
      <p>{group.description}</p>
      <p>Status: {group.status}</p>
      <p>Next Workout: {group.nextWorkout.date} - {group.nextWorkout.type} - {group.nextWorkout.duration}</p>
      <h2 className="mt-8 text-xl font-semibold">Members</h2>
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {group.members.map((member) => (
          <Card key={member.id} className="p-4">
            <h2 className="text-xl font-semibold">{member.name}</h2>
            <p>Admin: {member.isAdmin ? "Yes" : "No"}</p>
            <p>Presence Rate: {member.presenceRate}%</p>
          </Card>
        ))}
      </div>
      <h2 className="mt-8 text-xl font-semibold">Leaderboard</h2>
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {group.leaderboard.map((member) => (
          <Card key={member.name} className="p-4">
            <h2 className="text-xl font-semibold">{member.name}</h2>
            <p>Points: {member.points}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
