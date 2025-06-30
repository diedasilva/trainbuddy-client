export async function getExercises() {
  const res = await fetch('/mocks/exercises.json');
  return res.json();
}

export async function getExerciseById(id: number) {
  const res = await fetch('/mocks/exercises.json');
  const exercises = await res.json();
  return exercises.find((e: { id: number }) => e.id === id);
} 