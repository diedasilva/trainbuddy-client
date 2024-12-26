export type Event = {
  id: string;
  start: string; // Date ISO
  end: string;
  allDay?: boolean;
  groupIndex?: number; // Ajouté pour gérer les chevauchements
  groupSize?: number;
  description?: string;
  title?: string;
  children?: ChildEvent[];
};

export type ChildEvent = {
  id: string;
  start: string; // Date ISO
  end: string;   // Date ISO
  allDay: boolean;
  parentId?: string; // Référence au parent
  groupIndex?: number; // Index dans un groupe
  groupSize?: number;  // Taille du groupe
};
