# Système de Mocks Optimisé - TrainBuddy

## Vue d'ensemble

Ce système de mocks simule une vraie base de données avec des relations, des index et des requêtes optimisées. Il est conçu pour être performant et facilement remplaçable par une vraie API Spring Java.

## Architecture

### 1. Base de données mockée (`src/lib/mockDb.ts`)

- **Index automatiques** : Création d'index sur les champs fréquemment utilisés
- **Cache intelligent** : Mise en cache des requêtes avec timeout configurable
- **Relations** : Support des relations entre entités (one-to-many, many-to-many)
- **Pagination** : Support natif de la pagination
- **Recherche textuelle** : Recherche optimisée sur plusieurs champs
- **Agrégation** : Support des opérations d'agrégation (comme MongoDB)

### 2. API mockée (`src/lib/api/mockApi.ts`)

- **Méthodes génériques** : `findAll`, `findById`, `count`, `aggregate`
- **Méthodes spécifiques** : Pour chaque entité (activités, compétitions, etc.)
- **Options de requête** : Pagination, tri, recherche, relations
- **Gestion d'erreurs** : Réponses standardisées avec codes d'erreur

### 3. Hooks React optimisés (`src/hooks/`)

- **Hooks spécialisés** : Un hook par entité avec options de requête
- **Gestion d'état** : Loading, error, data avec refetch
- **Pagination** : Support natif de la pagination
- **Recherche** : Intégration avec la recherche textuelle

## Configuration

### Activer les mocks

```bash
# Dans .env.local
NEXT_PUBLIC_USE_MOCKS=true
```

### Configuration de la base de données mockée

```typescript
import { MockDatabase } from './lib/mockDb';

const mockDb = new MockDatabase({
  useIndexes: true,        // Activer les index pour les performances
  enableCaching: true,     // Activer le cache
  cacheTimeout: 5000       // Timeout du cache en ms
});
```

## Utilisation

### 1. Dans les hooks React

```typescript
import { useActivities } from '@/hooks/activities';

function MyComponent() {
  const { activities, loading, error, pagination } = useActivities({
    category: 'outdoor',
    search: {
      query: 'running',
      fields: ['title', 'description']
    },
    page: 1,
    limit: 10,
    sort: { field: 'popularity', order: 'desc' }
  });

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      {activities.map(activity => (
        <div key={activity.id}>{activity.title}</div>
      ))}
    </div>
  );
}
```

### 2. Utilisation directe de l'API

```typescript
import { mockApi } from '@/lib/api/mockApi';

// Récupérer toutes les activités
const response = await mockApi.getActivities();

// Rechercher des activités
const searchResponse = await mockApi.getActivities({
  search: {
    query: 'fitness',
    fields: ['title', 'description']
  }
});

// Récupérer avec relations
const activitiesWithGroups = await mockApi.getActivities({
  relations: ['groups', 'sessions']
});

// Statistiques du dashboard
const stats = await mockApi.getDashboardStats();
```

### 3. Requêtes avancées

```typescript
// Agrégation
const pipeline = [
  { $match: { category: 'outdoor' } },
  { $group: { _id: '$difficulty', count: { $sum: 1 } } }
];
const result = await mockApi.aggregate('activities', pipeline);

// Recherche globale
const globalSearch = await mockApi.globalSearch('fitness');

// Statistiques de groupe
const groupStats = await mockApi.getGroupStats(123);
```

## Performance

### Optimisations automatiques

1. **Index** : Création automatique d'index sur les champs fréquents
2. **Cache** : Mise en cache des requêtes avec timeout
3. **Relations lazy** : Chargement des relations à la demande
4. **Pagination** : Chargement par pages pour éviter les gros datasets

### Métriques

```typescript
// Obtenir les statistiques de performance
const stats = mockApi.getStats();
console.log(stats);
// {
//   tableCounts: { users: 50, groups: 25, activities: 100 },
//   indexCount: 15,
//   cacheSize: 42
// }
```

## Migration vers l'API Spring Java

### 1. Désactiver les mocks

```bash
# Dans .env.local
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

### 2. Adapter les endpoints

Les hooks et composants continueront de fonctionner car ils utilisent la même interface. Il suffit de :

1. Remplacer les appels `mockApi` par les vrais endpoints
2. Adapter les réponses pour correspondre au format attendu
3. Gérer l'authentification et les erreurs

### 3. Exemple de migration

```typescript
// Avant (mocks)
const response = await mockApi.getActivities();

// Après (API Spring)
const response = await fetch('/api/activities', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## Structure des données

### Entités principales

- **Users** : Utilisateurs avec rôles (CLIENT, COACH, ADMIN)
- **Groups** : Groupes d'activités avec membres et sessions
- **Sessions** : Sessions d'entraînement liées aux groupes
- **Events** : Événements du calendrier (IDs en string)
- **Activities** : Types d'activités disponibles
- **Competitions** : Compétitions et tournois
- **HealthPrograms** : Programmes de santé et bien-être
- **Careers** : Offres d'emploi et carrières
- **MediaEvents** : Événements média et conférences

### Relations

- Users ↔ Groups (many-to-many via members)
- Groups ↔ Sessions (one-to-many)
- Users ↔ Sessions (one-to-many via createdBy)
- Activities ↔ Groups (many-to-many)

## Avantages

1. **Performance** : Index et cache pour des requêtes rapides
2. **Flexibilité** : Support de requêtes complexes
3. **Facilité de migration** : Interface cohérente avec l'API réelle
4. **Développement rapide** : Pas besoin d'API backend pour le développement
5. **Tests** : Données de test cohérentes et contrôlables

## Maintenance

### Nettoyer le cache

```typescript
mockApi.clearCache();
```

### Ajouter de nouvelles entités

1. Ajouter les données dans `public/mocks/`
2. Créer les types dans `src/lib/mockDb.ts`
3. Ajouter les méthodes dans `src/lib/api/mockApi.ts`
4. Créer le hook dans `src/hooks/`

### Monitoring

```typescript
// Vérifier les performances
const stats = mockApi.getStats();
console.log('Cache size:', stats.cacheSize);
console.log('Index count:', stats.indexCount);
``` 