/**
 * Represents a single user data entry (name + score).
 */
export interface UserData {
  name: string;
  score: number;
}

/**
 * Represents a chart definition with title, type, data, and optional min/max.
 */
export interface ChartItem {
  title: string;
  type: "bar" | "line" | "pie";
  data: string;
  min?: number;
  max?: number;
}

/**
 * Represents a fitness group.
 */
export interface Group {
  id: string;
  name: string;
  status: string;
  admin?: string;
  workoutCount: number;
  lastActivity: string;
  data: UserData[];
  charts: ChartItem[];
}
