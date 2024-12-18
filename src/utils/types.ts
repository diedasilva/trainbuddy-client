export type Event = {
  id: number;
  title: string;
  start: string; // Date ISO
  end: string;
  allDay?: boolean;
  groupIndex?: number; // Ajouté pour gérer les chevauchements
  groupSize?: number;
};
