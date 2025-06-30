export async function getSessionExercises() {
  const res = await fetch('/mocks/sessionExercises.json');
  return res.json();
}

export async function getSessionExercisesBySessionId(sessionId: number) {
  const res = await fetch('/mocks/sessionExercises.json');
  const sessionExercises = await res.json();
  return sessionExercises.filter((se: { sessionId: number }) => se.sessionId === sessionId);
} 