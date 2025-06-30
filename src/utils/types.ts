import { Event as BaseEvent } from "@/types/types";

export type Event = BaseEvent & {
  groupIndex?: number; // Ajouté pour gérer les chevauchements
  groupSize?: number;
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
