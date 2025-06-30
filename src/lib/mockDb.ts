// Système de base de données mockée optimisé
// Simule une vraie BDD avec des relations, index et requêtes optimisées

export interface MockDbConfig {
  useIndexes: boolean;
  enableCaching: boolean;
  cacheTimeout: number;
}

export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
}

export interface TableData {
  [key: string]: unknown;
}

export interface IndexMap {
  [key: string]: number[];
}

export class MockDatabase {
  private data: Map<string, TableData[]> = new Map();
  private indexes: Map<string, Map<string, number[]>> = new Map();
  private cache: Map<string, CacheEntry> = new Map();
  private config: MockDbConfig;
  public statistics: Record<string, unknown> = {};
  private initialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;

  constructor(config: MockDbConfig = {
    useIndexes: true,
    enableCaching: true,
    cacheTimeout: 5000 // 5 secondes
  }) {
    this.config = config;
    this.initializationPromise = this.initializeData();
  }

  private async initializeData(): Promise<void> {
    if (this.initialized) return;
    
    try {
      // Initialiser les données depuis les fichiers JSON
      await this.loadTableData();
      
      // Créer les index si activé
      if (this.config.useIndexes) {
        this.createIndexes();
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la base de données:', error);
      throw error;
    }
  }

  // Méthode publique pour attendre l'initialisation
  async ensureInitialized(): Promise<void> {
    if (this.initializationPromise) {
      await this.initializationPromise;
    }
  }

  private async loadTableData() {
    try {
      // Charger les données des tables
      const [users, groups, sessions, events, activities, competitions, healthPrograms, careers, mediaEvents, categories, statistics] = await Promise.all([
        this.loadJsonFile('/mocks/users.json'),
        this.loadJsonFile('/mocks/groups.json'),
        this.loadJsonFile('/mocks/sessions.json'),
        this.loadJsonFile('/mocks/events.json'),
        this.loadJsonFile('/mocks/activities.json'),
        this.loadJsonFile('/mocks/competitions.json'),
        this.loadJsonFile('/mocks/healthPrograms.json'),
        this.loadJsonFile('/mocks/careers.json'),
        this.loadJsonFile('/mocks/mediaEvents.json'),
        this.loadJsonFile('/mocks/categories.json'),
        this.loadJsonFile('/mocks/statistics.json')
      ]);

      this.data.set('users', users);
      this.data.set('groups', groups);
      this.data.set('sessions', sessions);
      this.data.set('events', events);
      this.data.set('activities', activities);
      this.data.set('competitions', competitions);
      this.data.set('healthPrograms', healthPrograms);
      this.data.set('careers', careers);
      this.data.set('mediaEvents', mediaEvents);
      this.data.set('categories', categories);
      this.statistics = statistics as unknown as Record<string, unknown>;
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      throw error;
    }
  }

  private async loadJsonFile(path: string): Promise<TableData[]> {
    try {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Failed to load ${path}`);
      return await response.json();
    } catch (error) {
      console.error(`Erreur lors du chargement de ${path}:`, error);
      return [];
    }
  }

  private createIndexes() {
    // Index pour users
    this.createIndex('users', 'role');
    this.createIndex('users', 'isCoach');

    // Index pour groups
    this.createIndex('groups', 'category');
    this.createIndex('groups', 'status');
    this.createIndex('groups', 'createdBy');

    // Index pour sessions
    this.createIndex('sessions', 'type');
    this.createIndex('sessions', 'status');
    this.createIndex('sessions', 'groupId');
    this.createIndex('sessions', 'createdBy');

    // Index pour events
    this.createIndex('events', 'createdBy');

    // Index pour activities
    this.createIndex('activities', 'category');
    this.createIndex('activities', 'difficulty');

    // Index pour competitions
    this.createIndex('competitions', 'category');
    this.createIndex('competitions', 'status');

    // Index pour healthPrograms
    this.createIndex('healthPrograms', 'category');
    this.createIndex('healthPrograms', 'difficulty');

    // Index pour careers
    this.createIndex('careers', 'category');
    this.createIndex('careers', 'type');
    this.createIndex('careers', 'location');

    // Index pour mediaEvents
    this.createIndex('mediaEvents', 'type');
    this.createIndex('mediaEvents', 'category');
    this.createIndex('mediaEvents', 'status');
  }

  private createIndex(tableName: string, field: string) {
    const tableData = this.data.get(tableName);
    if (!tableData) return;

    const index = new Map<string, number[]>();
    
    tableData.forEach((row, idx) => {
      const value = row[field];
      if (value !== undefined) {
        const key = String(value);
        if (!index.has(key)) {
          index.set(key, []);
        }
        index.get(key)!.push(idx);
      }
    });

    this.indexes.set(`${tableName}_${field}`, index);
  }

  // Méthodes de requête optimisées
  async find(tableName: string, criteria: Record<string, unknown> = {}): Promise<TableData[]> {
    // S'assurer que la base de données est initialisée
    await this.ensureInitialized();
    
    const cacheKey = `${tableName}_find_${JSON.stringify(criteria)}`;
    
    // Vérifier le cache
    if (this.config.enableCaching) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.config.cacheTimeout) {
        return cached.data as TableData[];
      }
    }

    const tableData = this.data.get(tableName);
    if (!tableData) return [];

    let result = tableData;

    // Utiliser les index pour optimiser les requêtes
    for (const [field, value] of Object.entries(criteria)) {
      const indexKey = `${tableName}_${field}`;
      const index = this.indexes.get(indexKey);

      if (index && this.config.useIndexes) {
        // Utiliser l'index pour une recherche rapide
        const indices = index.get(String(value));
        if (indices) {
          result = indices.map(idx => tableData[idx]);
        } else {
          result = [];
        }
      } else {
        // Recherche linéaire si pas d'index
        result = result.filter(row => row[field] === value);
      }
    }

    // Mettre en cache le résultat
    if (this.config.enableCaching) {
      this.cache.set(cacheKey, {
        data: result,
        timestamp: Date.now()
      });
    }

    return result;
  }

  async findById(tableName: string, id: number | string): Promise<TableData | null> {
    // S'assurer que la base de données est initialisée
    await this.ensureInitialized();
    
    const tableData = this.data.get(tableName);
    if (!tableData) return null;

    return tableData.find(row => row.id === id) || null;
  }

  async findWithRelations(tableName: string, criteria: Record<string, unknown> = {}, relations: string[] = []): Promise<TableData[]> {
    // S'assurer que la base de données est initialisée
    await this.ensureInitialized();
    
    const results = await this.find(tableName, criteria);
    
    // Charger les relations si demandées
    for (const relation of relations) {
      await this.loadRelations(results, relation);
    }
    
    return results;
  }

  async loadRelations(data: TableData[], relation: string) {
    for (const item of data) {
      switch (relation) {
        case 'user':
          if (item.createdBy) {
            item.user = await this.findById('users', item.createdBy as number);
          }
          break;
        case 'group':
          if (item.groupId) {
            item.group = await this.findById('groups', item.groupId as number);
          }
          break;
        case 'sessions':
          if (item.id) {
            item.sessions = await this.find('sessions', { groupId: item.id });
          }
          break;
        case 'members':
          if (item.id) {
            // Simuler la relation many-to-many
            const memberIds = (item.members as TableData[])?.map((m: TableData) => m.id) || [];
            item.members = await this.find('users', { id: { $in: memberIds } });
          }
          break;
      }
    }
  }

  // Méthodes d'agrégation
  async count(tableName: string, criteria: Record<string, unknown> = {}): Promise<number> {
    // S'assurer que la base de données est initialisée
    await this.ensureInitialized();
    
    const results = await this.find(tableName, criteria);
    return results.length;
  }

  async aggregate(tableName: string, pipeline: Record<string, unknown>[]): Promise<TableData[]> {
    // S'assurer que la base de données est initialisée
    await this.ensureInitialized();
    
    const tableData = this.data.get(tableName);
    if (!tableData) return [];

    let result = [...tableData];

    for (const stage of pipeline) {
      if (stage.$match) {
        const criteria = stage.$match as Record<string, unknown>;
        result = result.filter(row => {
          for (const [field, value] of Object.entries(criteria)) {
            if (row[field] !== value) return false;
          }
          return true;
        });
      } else if (stage.$group) {
        const groupConfig = stage.$group as Record<string, unknown>;
        const groupBy = groupConfig._id as string;
        const groupMap = new Map();

        for (const row of result) {
          const key = row[groupBy];
          if (!groupMap.has(key)) {
            groupMap.set(key, []);
          }
          groupMap.get(key).push(row);
        }

        result = Array.from(groupMap.entries()).map(([key, group]) => ({
          _id: key,
          count: (group as TableData[]).length,
          items: group
        }));
      } else if (stage.$sort) {
        const sortConfig = stage.$sort as Record<string, 1 | -1>;
        result.sort((a, b) => {
          for (const [field, order] of Object.entries(sortConfig)) {
            const aVal = a[field];
            const bVal = b[field];
            if (typeof aVal === 'string' && typeof bVal === 'string') {
              if (aVal < bVal) return order === 1 ? -1 : 1;
              if (aVal > bVal) return order === 1 ? 1 : -1;
            } else if (typeof aVal === 'number' && typeof bVal === 'number') {
              if (aVal < bVal) return order === 1 ? -1 : 1;
              if (aVal > bVal) return order === 1 ? 1 : -1;
            }
          }
          return 0;
        });
      } else if (stage.$limit) {
        const limit = stage.$limit as number;
        result = result.slice(0, limit);
      }
    }

    return result;
  }

  // Méthodes de pagination
  async paginate(tableName: string, page: number = 1, limit: number = 10, criteria: Record<string, unknown> = {}): Promise<{
    data: TableData[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // S'assurer que la base de données est initialisée
    await this.ensureInitialized();
    
    const allResults = await this.find(tableName, criteria);
    const total = allResults.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = allResults.slice(startIndex, endIndex);

    return {
      data,
      total,
      page,
      limit,
      totalPages
    };
  }

  // Méthodes de recherche textuelle
  async search(tableName: string, query: string, fields: string[]): Promise<TableData[]> {
    // S'assurer que la base de données est initialisée
    await this.ensureInitialized();
    
    const tableData = this.data.get(tableName);
    if (!tableData) return [];

    const searchTerm = query.toLowerCase();

    return tableData.filter(row => {
      return fields.some(field => {
        const value = row[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm);
        }
        return false;
      });
    });
  }

  // Nettoyage du cache
  clearCache(): void {
    this.cache.clear();
  }

  // Statistiques de performance
  getStats(): {
    tableCounts: Record<string, number>;
    indexCount: number;
    cacheSize: number;
  } {
    const tableCounts: Record<string, number> = {};
    for (const [tableName, data] of this.data.entries()) {
      tableCounts[tableName] = data.length;
    }

    return {
      tableCounts,
      indexCount: this.indexes.size,
      cacheSize: this.cache.size
    };
  }
}

// Instance singleton de la base de données
export const mockDb = new MockDatabase();

// Export des types pour TypeScript
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
  description: string;
  status: string;
  category: string;
  admin: string;
  moderators: string[];
  members: TableData[];
  workoutCount: number;
  totalMembers: number;
  activeMembers: number;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
  coverUrl?: string;
  stats: Record<string, unknown>;
}

export interface Session {
  id: number;
  title: string;
  location: string;
  type: string;
  scheduledAt: string;
  createdBy: number;
  groupId: number | null;
  coachId: number | null;
  status: string;
  details: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

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

export interface Activity {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  location: string;
  popularity: number;
  participants: number;
  href: string;
  imageUrl: string;
  groups: Array<{
    id: number;
    name: string;
    members: number;
    nextSession: string;
    level: string;
  }>;
}

export interface Competition {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  startDate: string;
  endDate: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  entryFee: number;
  prizePool: number;
  status: string;
  organizer: string;
  imageUrl: string;
  rules: string[];
  categories: Array<{
    id: number;
    name: string;
    ageRange: string;
    participants: number;
  }>;
}

export interface HealthProgram {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  price: number;
  rating: number;
  participants: number;
  coach: string;
  imageUrl: string;
  features: string[];
  modules: Array<{
    id: number;
    title: string;
    duration: string;
    description: string;
  }>;
}

export interface Career {
  id: number;
  title: string;
  description: string;
  category: string;
  type: string;
  location: string;
  salary: string;
  experience: string;
  education: string;
  company: string;
  postedDate: string;
  imageUrl: string;
  requirements: string[];
  benefits: string[];
  responsibilities: string[];
}

export interface MediaEvent {
  id: number;
  title: string;
  description: string;
  type: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  organizer: string;
  imageUrl: string;
  speakers: Array<{
    id: number;
    name: string;
    title: string;
    topic: string;
  }>;
  attendees: number;
  maxAttendees: number;
  price: number;
  status: string;
  tags: string[];
} 