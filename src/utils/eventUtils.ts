import { Event, ChildEvent } from "@/utils/types";

/**
 * Fonction pour traiter les événements
 * Cette fonction va découper les événements qui s'étalent sur plusieurs jours en plusieurs événements
 * ! Les dates sont au format ISO donc -1H par rapport à la France !
 * 
 * @param events 
 * @returns 
 */
export const preprocessEvents = (events: Event[]): Event[] => {
  const processedEvents: Event[] = [];

  events.forEach((event) => {
    const start = new Date(event.start);
    const end = new Date(event.end);

    // Vérifier si l'événement s'étale sur plusieurs jours
    if (start.getDay() !== end.getDay()) {
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const children: ChildEvent[] = [];

      for (let i = 0; i < days; i++) {
        const currentDayStart = new Date(start);
        currentDayStart.setDate(start.getDate() + i);
        currentDayStart.setHours(0, 0, 0, 0);

        if (i === 0 && !event.allDay) currentDayStart.setTime(start.getTime());

        const currentDayEnd = new Date(currentDayStart);
        currentDayEnd.setHours(23, 59, 59);

        if (i === days - 1 && !event.allDay) currentDayEnd.setTime(end.getTime());

        const isAllDay = event.allDay || (
          currentDayStart.getHours() === 0 &&
          currentDayStart.getMinutes() === 0 &&
          currentDayStart.getSeconds() === 0 &&
          currentDayEnd.getHours() === 23 &&
          currentDayEnd.getMinutes() === 59 &&
          currentDayEnd.getSeconds() === 59
        );

        // Générer un enfant
        const childEvent: ChildEvent = {
          id: `${event.id}_${i}`,// ID unique
          start: currentDayStart.toISOString(),
          end: currentDayEnd.toISOString(),
          allDay: isAllDay,
          parentId: event.id,
        };

        children.push(childEvent);
      }

      // Ajouter les enfants au parent
      processedEvents.push({
        ...event,
        children,
      });
    } else {
      // Ajouter directement les événements d'une seule journée
      processedEvents.push(event);
    }
  });

  return processedEvents;
};

/**
 * Fonction pour regrouper les événements qui se chevauchent
 * @param events 
 * @returns 
 */
export const groupOverlappingEvents = (events: Event[]): Event[] => {
  // Etape 0 : On dupplique events pour ne pas le modifier l'original
  const eventsCopy = [...events];
  // Etape 0_1 : On sort les évenements enfant des parents et on supprime les parents si ils ont des enfants
  for (let i = eventsCopy.length - 1; i >= 0; i--) {
    const event = eventsCopy[i];
    if (event.children) {
      // Ajouter les enfants à la liste
      event.children.forEach((child) => {
        eventsCopy.push(child);
      });
      // Supprimer l'événement parent
      eventsCopy.splice(i, 1);
    }
  }
  console.log("Événements copiés 1:", eventsCopy);

  // Étape 1 : Trier les événements par date de début (event parent sans enfants + event enfants)
  const sortedEvents = eventsCopy.sort((a, b) => {
    return new Date(a.start).getTime() - new Date(b.start).getTime();
  });

  console.log("Événements triés 2:", sortedEvents);
  // Étape 2 : Regrouper les événements qui se chevauchent
  // Il n'y a plus d'enfants dans cette liste d'events du coup on gère tout le monde 
  const groups: Event[][] = [];

  sortedEvents.forEach((event) => {
    if (event.allDay) return;
    let addedToGroup = false;

    for (const group of groups) {
      // Vérifier si cet événement chevauche avec le dernier événement du groupe
      const lastEventInGroup = group[group.length - 1];
      if (isOverlapping(lastEventInGroup, event)) {
        group.push(event);
        addedToGroup = true;
        break;
      }
    }

    if (!addedToGroup) {
      // Créer un nouveau groupe si aucun chevauchement n'est trouvé
      groups.push([event]);
    }
  });

  console.log("Groupes d'événements 3:", groups);

  // Étape 3 : Enrichir uniquement les événements qui se chevauchent
  const enrichedEvents: Event[] = [];

  groups.forEach((group) => {
    // Parcourir chaque groupe et enrichir les événements
    group.forEach((event) => {
      enrichedEvents.push({
        ...event,
        groupIndex: group.indexOf(event),
        groupSize: group.length,
      });
    });
  });
  
  // Etape 4 : On trie les événements enrichis par ID
  const sortedById = enrichedEvents.sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: "base" })
  );
  
  console.log("Événements enrichis triés par ID 4:", sortedById);

  // Étape 5 : Attribuer les variables groupIndex et groupSize aux événements originaux et leurs enfants
  const finalEvents = events.map((originalEvent) => {
    // Vérifier si l'événement original est un parent
    if (originalEvent.children && originalEvent.children.length > 0) {
      // Enrichir les enfants
      const enrichedChildren = originalEvent.children.map((child) => {
        const enrichedChild = sortedById.find((e) => e.id === child.id);
        return enrichedChild
          ? {
              ...child,
              groupIndex: enrichedChild.groupIndex,
              groupSize: enrichedChild.groupSize,
            }
          : child; // Si pas enrichi, garder tel quel
      });

      // Retourner l'événement parent avec les enfants enrichis
      return {
        ...originalEvent,
        children: enrichedChildren,
      };
    }

    // Si l'événement est un parent sans enfants, enrichir directement
    const enrichedEvent = sortedById.find((e) => e.id === originalEvent.id);
    return enrichedEvent
      ? {
          ...originalEvent,
          groupIndex: enrichedEvent.groupIndex,
          groupSize: enrichedEvent.groupSize,
        }
      : originalEvent; // Si pas enrichi, garder tel quel
  });

  console.log("Événements finaux enrichis avec enfants 5:", finalEvents);


  return finalEvents;
};

const isOverlapping = (event1: Event, event2: Event): boolean => {
  const start1 = new Date(event1.start).getTime();
  const end1 = new Date(event1.end).getTime();
  const start2 = new Date(event2.start).getTime();
  const end2 = new Date(event2.end).getTime();

  return start1 < end2 && start2 < end1;
}