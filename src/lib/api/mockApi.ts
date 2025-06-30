// API mockée optimisée utilisant la base de données mockée
import { mockDb, type TableData } from '../mockDb';

export interface ApiResponse<T = TableData> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  relations?: string[];
  search?: {
    query: string;
    fields: string[];
  };
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
}

class MockApi {
  // Méthodes génériques pour toutes les tables
  async findAll<T = TableData>(
    tableName: string, 
    criteria: Record<string, unknown> = {}, 
    options: QueryOptions = {}
  ): Promise<ApiResponse<T[]>> {
    try {
      let results: T[];

      // Recherche textuelle si spécifiée
      if (options.search) {
        results = await mockDb.search(tableName, options.search.query, options.search.fields) as T[];
      } else {
        // Requête normale avec relations
        results = await mockDb.findWithRelations(
          tableName, 
          criteria, 
          options.relations || []
        ) as T[];
      }

      // Tri si spécifié
      if (options.sort) {
        results.sort((a, b) => {
          const aVal = (a as TableData)[options.sort!.field];
          const bVal = (b as TableData)[options.sort!.field];
          
          if (options.sort!.order === 'asc') {
            if (typeof aVal === 'string' && typeof bVal === 'string') {
              return aVal.localeCompare(bVal);
            }
            return (aVal as number) > (bVal as number) ? 1 : -1;
          } else {
            if (typeof aVal === 'string' && typeof bVal === 'string') {
              return bVal.localeCompare(aVal);
            }
            return (aVal as number) < (bVal as number) ? 1 : -1;
          }
        });
      }

      // Pagination
      if (options.page && options.limit) {
        const paginated = await mockDb.paginate(
          tableName, 
          options.page, 
          options.limit, 
          criteria
        );
        
        return {
          data: paginated.data as T[],
          success: true,
          pagination: {
            page: paginated.page,
            limit: paginated.limit,
            total: paginated.total,
            totalPages: paginated.totalPages
          }
        };
      }

      return {
        data: results,
        success: true
      };
    } catch (error) {
      return {
        data: [] as T[],
        success: false,
        message: `Erreur lors de la récupération des ${tableName}: ${error}`
      };
    }
  }

  async findById<T = TableData>(
    tableName: string, 
    id: number | string, 
    relations: string[] = []
  ): Promise<ApiResponse<T>> {
    try {
      const result = await mockDb.findById(tableName, id);
      
      if (!result) {
        return {
          data: null as T,
          success: false,
          message: `${tableName} avec l'ID ${id} non trouvé`
        };
      }

      // Charger les relations si demandées
      if (relations.length > 0) {
        await mockDb.loadRelations([result], relations[0]);
      }

      return {
        data: result as T,
        success: true
      };
    } catch (error) {
      return {
        data: null as T,
        success: false,
        message: `Erreur lors de la récupération du ${tableName}: ${error}`
      };
    }
  }

  async count(tableName: string, criteria: Record<string, unknown> = {}): Promise<ApiResponse<number>> {
    try {
      const count = await mockDb.count(tableName, criteria);
      return {
        data: count,
        success: true
      };
    } catch (error) {
      return {
        data: 0,
        success: false,
        message: `Erreur lors du comptage des ${tableName}: ${error}`
      };
    }
  }

  async aggregate(
    tableName: string, 
    pipeline: Record<string, unknown>[]
  ): Promise<ApiResponse<TableData[]>> {
    try {
      const results = await mockDb.aggregate(tableName, pipeline);
      return {
        data: results,
        success: true
      };
    } catch (error) {
      return {
        data: [],
        success: false,
        message: `Erreur lors de l'agrégation des ${tableName}: ${error}`
      };
    }
  }

  // Méthodes spécifiques pour les utilisateurs
  async getUsers(options: QueryOptions = {}): Promise<ApiResponse<TableData[]>> {
    return this.findAll('users', {}, options);
  }

  async getUserById(id: number, relations: string[] = []): Promise<ApiResponse<TableData>> {
    return this.findById('users', id, relations);
  }

  async getCoaches(): Promise<ApiResponse<TableData[]>> {
    return this.findAll('users', { isCoach: true, role: 'COACH' });
  }

  // Méthodes spécifiques pour les groupes
  async getGroups(options: QueryOptions = {}): Promise<ApiResponse<TableData[]>> {
    return this.findAll('groups', {}, { ...options, relations: ['members', 'sessions'] });
  }

  async getGroupById(id: number, relations: string[] = ['members', 'sessions']): Promise<ApiResponse<TableData>> {
    return this.findById('groups', id, relations);
  }

  async getGroupsByCategory(category: string): Promise<ApiResponse<TableData[]>> {
    return this.findAll('groups', { category });
  }

  async getActiveGroups(): Promise<ApiResponse<TableData[]>> {
    return this.findAll('groups', { status: 'active' });
  }

  // Méthodes spécifiques pour les sessions
  async getSessions(options: QueryOptions = {}): Promise<ApiResponse<TableData[]>> {
    return this.findAll('sessions', {}, { ...options, relations: ['user', 'group'] });
  }

  async getSessionById(id: number, relations: string[] = ['user', 'group']): Promise<ApiResponse<TableData>> {
    return this.findById('sessions', id, relations);
  }

  async getSessionsByGroup(groupId: number): Promise<ApiResponse<TableData[]>> {
    return this.findAll('sessions', { groupId }, { relations: ['user'] });
  }

  async getUpcomingSessions(): Promise<ApiResponse<TableData[]>> {
    const now = new Date().toISOString();
    return this.findAll('sessions', { 
      scheduledAt: { $gte: now },
      status: 'scheduled'
    }, { 
      relations: ['user', 'group'],
      sort: { field: 'scheduledAt', order: 'asc' }
    });
  }

  // Méthodes spécifiques pour les événements
  async getEvents(options: QueryOptions = {}): Promise<ApiResponse<TableData[]>> {
    return this.findAll('events', {}, options);
  }

  async getEventById(id: string): Promise<ApiResponse<TableData>> {
    return this.findById('events', id);
  }

  async getEventsByDateRange(startDate: string, endDate: string): Promise<ApiResponse<TableData[]>> {
    return this.findAll('events', {
      start: { $gte: startDate },
      end: { $lte: endDate }
    });
  }

  // Méthodes spécifiques pour les activités
  async getActivities(options: QueryOptions = {}): Promise<ApiResponse<TableData[]>> {
    return this.findAll('activities', {}, options);
  }

  async getActivityById(id: number): Promise<ApiResponse<TableData>> {
    return this.findById('activities', id);
  }

  async getActivitiesByCategory(category: string): Promise<ApiResponse<TableData[]>> {
    return this.findAll('activities', { category });
  }

  async getPopularActivities(limit: number = 10): Promise<ApiResponse<TableData[]>> {
    return this.findAll('activities', {}, {
      sort: { field: 'popularity', order: 'desc' },
      limit
    });
  }

  // Méthodes spécifiques pour les compétitions
  async getCompetitions(options: QueryOptions = {}): Promise<ApiResponse<TableData[]>> {
    return this.findAll('competitions', {}, options);
  }

  async getCompetitionById(id: number): Promise<ApiResponse<TableData>> {
    return this.findById('competitions', id);
  }

  async getActiveCompetitions(): Promise<ApiResponse<TableData[]>> {
    const now = new Date().toISOString();
    return this.findAll('competitions', {
      status: 'active',
      startDate: { $lte: now },
      endDate: { $gte: now }
    });
  }

  async getUpcomingCompetitions(): Promise<ApiResponse<TableData[]>> {
    const now = new Date().toISOString();
    return this.findAll('competitions', {
      status: 'upcoming',
      startDate: { $gte: now }
    }, {
      sort: { field: 'startDate', order: 'asc' }
    });
  }

  // Méthodes spécifiques pour les programmes de santé
  async getHealthPrograms(options: QueryOptions = {}): Promise<ApiResponse<TableData[]>> {
    return this.findAll('healthPrograms', {}, options);
  }

  async getHealthProgramById(id: number): Promise<ApiResponse<TableData>> {
    return this.findById('healthPrograms', id);
  }

  async getHealthProgramsByCategory(category: string): Promise<ApiResponse<TableData[]>> {
    return this.findAll('healthPrograms', { category });
  }

  async getTopRatedHealthPrograms(limit: number = 10): Promise<ApiResponse<TableData[]>> {
    return this.findAll('healthPrograms', {}, {
      sort: { field: 'rating', order: 'desc' },
      limit
    });
  }

  // Méthodes spécifiques pour les carrières
  async getCareers(options: QueryOptions = {}): Promise<ApiResponse<TableData[]>> {
    return this.findAll('careers', {}, options);
  }

  async getCareerById(id: number): Promise<ApiResponse<TableData>> {
    return this.findById('careers', id);
  }

  async getCareersByCategory(category: string): Promise<ApiResponse<TableData[]>> {
    return this.findAll('careers', { category });
  }

  async getCareersByLocation(location: string): Promise<ApiResponse<TableData[]>> {
    return this.findAll('careers', { location });
  }

  async searchCareers(query: string): Promise<ApiResponse<TableData[]>> {
    return this.findAll('careers', {}, {
      search: {
        query,
        fields: ['title', 'description', 'company', 'requirements']
      }
    });
  }

  // Méthodes spécifiques pour les événements média
  async getMediaEvents(options: QueryOptions = {}): Promise<ApiResponse<TableData[]>> {
    return this.findAll('mediaEvents', {}, options);
  }

  async getMediaEventById(id: number): Promise<ApiResponse<TableData>> {
    return this.findById('mediaEvents', id);
  }

  async getUpcomingMediaEvents(): Promise<ApiResponse<TableData[]>> {
    const response = await this.findAll('mediaEvents');
    if (!response.success) {
      return response;
    }

    const now = new Date();
    // Filtre les événements qui commencent après maintenant
    const upcoming = response.data.filter((event: TableData) => new Date(event.startDate as string) > now);
    
    // Trie par date de début croissante et retourne les 3 prochains
    const sortedUpcoming = upcoming.sort((a: TableData, b: TableData) => new Date(a.startDate as string).getTime() - new Date(b.startDate as string).getTime());

    return {
      data: sortedUpcoming.slice(0, 3), // Limite à 3
      success: true
    };
  }

  async getMediaEventsByType(type: string): Promise<ApiResponse<TableData[]>> {
    return this.findAll('mediaEvents', { type });
  }

  // Méthodes de statistiques et d'analytics
  async getDashboardStats(): Promise<ApiResponse<Record<string, number>>> {
    try {
      const [usersCount, groupsCount, sessionsCount, activitiesCount] = await Promise.all([
        mockDb.count('users'),
        mockDb.count('groups'),
        mockDb.count('sessions'),
        mockDb.count('activities')
      ]);

      const activeGroupsCount = await mockDb.count('groups', { status: 'active' });
      const upcomingSessionsCount = await mockDb.count('sessions', { 
        status: 'scheduled',
        scheduledAt: { $gte: new Date().toISOString() }
      });

      return {
        data: {
          totalUsers: usersCount,
          totalGroups: groupsCount,
          totalSessions: sessionsCount,
          totalActivities: activitiesCount,
          activeGroups: activeGroupsCount,
          upcomingSessions: upcomingSessionsCount
        },
        success: true
      };
    } catch (error) {
      return {
        data: {},
        success: false,
        message: `Erreur lors de la récupération des statistiques: ${error}`
      };
    }
  }

  async getGroupStats(groupId: number): Promise<ApiResponse<Record<string, unknown>>> {
    try {
      const [group, sessions, members] = await Promise.all([
        mockDb.findById('groups', groupId),
        mockDb.find('sessions', { groupId }),
        mockDb.find('users', { id: { $in: [] } }) // Simuler les membres du groupe
      ]);

      if (!group) {
        return {
          data: {},
          success: false,
          message: 'Groupe non trouvé'
        };
      }

      const upcomingSessions = sessions.filter((s: TableData) => 
        new Date(s.scheduledAt as string) > new Date()
      );

      return {
        data: {
          group,
          totalSessions: sessions.length,
          upcomingSessions: upcomingSessions.length,
          totalMembers: members.length,
          lastActivity: group.lastActivity
        },
        success: true
      };
    } catch (error) {
      return {
        data: {},
        success: false,
        message: `Erreur lors de la récupération des statistiques du groupe: ${error}`
      };
    }
  }

  // Méthodes de recherche globale
  async globalSearch(query: string): Promise<ApiResponse<{
    users: TableData[];
    groups: TableData[];
    activities: TableData[];
    competitions: TableData[];
  }>> {
    try {
      const [users, groups, activities, competitions] = await Promise.all([
        mockDb.search('users', query, ['username', 'email']),
        mockDb.search('groups', query, ['name', 'description']),
        mockDb.search('activities', query, ['title', 'description']),
        mockDb.search('competitions', query, ['title', 'description'])
      ]);

      return {
        data: {
          users,
          groups,
          activities,
          competitions
        },
        success: true
      };
    } catch (error) {
      return {
        data: {
          users: [],
          groups: [],
          activities: [],
          competitions: []
        },
        success: false,
        message: `Erreur lors de la recherche globale: ${error}`
      };
    }
  }

  // Méthodes de cache
  clearCache(): void {
    mockDb.clearCache();
  }

  getStats(): Record<string, unknown> {
    return mockDb.getStats();
  }

  // Méthode pour vérifier la participation d'un utilisateur à une activité
  async checkUserParticipation(activityId: number, userId: number): Promise<ApiResponse<{ isParticipating: boolean }>> {
    try {
      // Simule la recherche dans la table des participations
      // On peut utiliser sessionMembers ou créer une table activityParticipants
      const participations = await mockDb.find("sessionMembers", { 
        activityId, 
        userId,
        status: "active"
      });
      
      return {
        data: { isParticipating: participations.length > 0 },
        success: true
      };
    } catch (error) {
      return {
        data: { isParticipating: false },
        success: false,
        message: `Erreur lors de la vérification de la participation: ${error}`
      };
    }
  }
}

// Instance singleton de l'API mockée
export const mockApi = new MockApi(); 