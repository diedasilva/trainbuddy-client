export async function getHealthPrograms() {
  const res = await fetch('/mocks/healthPrograms.json');
  return res.json();
}

export async function getHealthProgramById(id: number) {
  const res = await fetch('/mocks/healthPrograms.json');
  const programs = await res.json();
  return programs.find((p: { id: number }) => p.id === id);
}

export async function getHealthProgramsByCategory(category: string) {
  const res = await fetch('/mocks/healthPrograms.json');
  const programs = await res.json();
  return programs.filter((p: { category: string }) => p.category === category);
}

export async function getHealthProgramsByDifficulty(difficulty: string) {
  const res = await fetch('/mocks/healthPrograms.json');
  const programs = await res.json();
  return programs.filter((p: { difficulty: string }) => p.difficulty === difficulty);
} 