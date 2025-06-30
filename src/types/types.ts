export interface User {
  id: number;
  username: string;
  email: string;
  isCoach: boolean;
  role: "CLIENT" | "COACH" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  privacy: "PUBLIC" | "PRIVATE";
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

export interface GroupMember {
  groupId: number;
  userId: number;
  role: "ADMIN" | "COACH" | "MEMBER";
  joinedAt: string;
}

export interface Session {
  id: number;
  title?: string;
  location?: string;
  type: string;
  scheduledAt: string;
  createdBy: number;
  groupId?: number;
  coachId?: number;
  status: "PLANNED" | "COMPLETED" | "CANCELED";
  details: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SessionMember {
  sessionId: number;
  userId: number;
  status: "INVITED" | "JOINED" | "LEFT";
  joinedAt: string;
}

export interface Exercise {
  id: number;
  name: string;
  activityType: string;
  defaultConf: Record<string, unknown>;
  createdAt: string;
}

export interface SessionExercise {
  sessionId: number;
  exerciseId: number;
  seq: number;
  config: Record<string, unknown>;
}

export interface Chart {
  id: number;
  title: string;
  description?: string;
  userId?: number;
  groupId?: number;
  config: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// Interface pour les événements avec ID en string
export interface Event {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  allDay?: boolean;
  location?: string;
  createdBy: string;
  color?: string;
}
