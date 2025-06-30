export async function getMediaEvents() {
  const res = await fetch('/mocks/mediaEvents.json');
  return res.json();
}

export async function getMediaEventById(id: number) {
  const res = await fetch('/mocks/mediaEvents.json');
  const events = await res.json();
  return events.find((e: { id: number }) => e.id === id);
}

export async function getMediaEventsByType(type: string) {
  const res = await fetch('/mocks/mediaEvents.json');
  const events = await res.json();
  return events.filter((e: { type: string }) => e.type === type);
}

export async function getMediaEventsByCategory(category: string) {
  const res = await fetch('/mocks/mediaEvents.json');
  const events = await res.json();
  return events.filter((e: { category: string }) => e.category === category);
}

export async function getMediaEventsByStatus(status: string) {
  const res = await fetch('/mocks/mediaEvents.json');
  const events = await res.json();
  return events.filter((e: { status: string }) => e.status === status);
} 