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
  details: Record<string, any>;
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
  defaultConf: Record<string, any>;
  createdAt: string;
}

export interface SessionExercise {
  sessionId: number;
  exerciseId: number;
  seq: number;
  config: Record<string, any>;
}

export interface Chart {
  id: number;
  title: string;
  description?: string;
  userId?: number;
  groupId?: number;
  config: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
