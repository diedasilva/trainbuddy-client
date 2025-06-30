export async function getSessions() {
  const res = await fetch('/mocks/sessions.json');
  return res.json();
}

export async function getSessionById(id: number) {
  const res = await fetch('/mocks/sessions.json');
  const sessions = await res.json();
  return sessions.find((s: { id: number }) => s.id === id);
} 