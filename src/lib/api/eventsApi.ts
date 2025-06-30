export async function getEvents() {
  const res = await fetch('/mocks/events.json');
  return res.json();
}

export async function getEventById(id: string) {
  const res = await fetch('/mocks/events.json');
  const events = await res.json();
  return events.find((e: { id: string }) => e.id === id);
} 