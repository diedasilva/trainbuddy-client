/**
 * Represents a single user data entry (name + score).
 */
export interface UserData {
  id: number;
  name: string;
  score: number;
  avatar?: string;
  role: 'admin' | 'moderator' | 'member';
  joinDate: string;
  lastActive: string;
}

/**
 * Represents a chart definition with title, type, data, and optional min/max.
 */
export interface ChartItem {
  id: number;
  title: string;
  type: "bar" | "line" | "pie";
  data: string;
  min?: number;
  max?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a group event or activity.
 */
export interface GroupEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'workout' | 'meeting' | 'competition' | 'social';
  participants: number;
  maxParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

/**
 * Represents a group achievement or milestone.
 */
export interface GroupAchievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  criteria: string;
  membersEarned: number;
}

/**
 * Represents a group resource (file, link, etc.).
 */
export interface GroupResource {
  id: number;
  title: string;
  description: string;
  type: 'file' | 'link' | 'video' | 'document';
  url: string;
  size?: string;
  uploadedBy: string;
  uploadedAt: string;
  downloads: number;
}

/**
 * Represents a fitness group with comprehensive data.
 */
export interface Group {
  id: number;
  name: string;
  description: string;
  status: 'public' | 'private' | 'invite-only';
  category: string;
  admin: string;
  moderators: string[];
  members: UserData[];
  workoutCount: number;
  totalMembers: number;
  activeMembers: number;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
  coverUrl?: string;
  data: UserData[];
  charts: ChartItem[];
  events: GroupEvent[];
  achievements: GroupAchievement[];
  resources: GroupResource[];
  settings: {
    allowMemberInvites: boolean;
    requireApproval: boolean;
    maxMembers: number;
    autoArchive: boolean;
  };
  stats: {
    totalWorkouts: number;
    totalCalories: number;
    averageRating: number;
    completionRate: number;
  };
}

/**
 * Represents group creation/editing form data.
 */
export interface GroupFormData {
  name: string;
  description: string;
  status: 'public' | 'private' | 'invite-only';
  category: string;
  allowMemberInvites: boolean;
  requireApproval: boolean;
  maxMembers: number;
  autoArchive: boolean;
}

/**
 * Represents group search and filter options.
 */
export interface GroupFilters {
  search: string;
  category: string;
  status: string;
  sortBy: 'name' | 'members' | 'activity' | 'created';
  sortOrder: 'asc' | 'desc';
}

/**
 * Represents group statistics for analytics.
 */
export interface GroupStats {
  totalGroups: number;
  totalMembers: number;
  activeGroups: number;
  averageEngagement: number;
  growthRate: number;
  topCategories: Array<{ name: string; count: number }>;
  monthlyGrowth: Array<{ month: string; members: number }>;
}

/**
 * Represents API response for groups.
 */
export interface GroupsApiResponse {
  success: boolean;
  data: Group[] | Group | GroupStats;
  message?: string;
  error?: string;
}

/**
 * Represents group membership status.
 */
export type MembershipStatus = 'member' | 'pending' | 'invited' | 'none';

/**
 * Represents group permissions for a user.
 */
export interface GroupPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canInvite: boolean;
  canModerate: boolean;
  canViewAnalytics: boolean;
  canManageEvents: boolean;
  canUploadResources: boolean;
}
