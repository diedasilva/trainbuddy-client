export async function getSessionMembers() {
  const res = await fetch('/mocks/sessionMembers.json');
  return res.json();
}

export async function getSessionMembersBySessionId(sessionId: number) {
  const res = await fetch('/mocks/sessionMembers.json');
  const sessionMembers = await res.json();
  return sessionMembers.filter((sm: { sessionId: number }) => sm.sessionId === sessionId);
}

export async function getUserSessionMemberships(userId: number) {
  const res = await fetch('/mocks/sessionMembers.json');
  const sessionMembers = await res.json();
  return sessionMembers.filter((sm: { userId: number }) => sm.userId === userId);
} 