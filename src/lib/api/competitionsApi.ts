export async function getCompetitions() {
  const res = await fetch('/mocks/competitions.json');
  return res.json();
}

export async function getCompetitionById(id: number) {
  const res = await fetch('/mocks/competitions.json');
  const competitions = await res.json();
  return competitions.find((c: { id: number }) => c.id === id);
}

export async function getCompetitionsByCategory(category: string) {
  const res = await fetch('/mocks/competitions.json');
  const competitions = await res.json();
  return competitions.filter((c: { category: string }) => c.category === category);
}

export async function getCompetitionsByStatus(status: string) {
  const res = await fetch('/mocks/competitions.json');
  const competitions = await res.json();
  return competitions.filter((c: { status: string }) => c.status === status);
} 