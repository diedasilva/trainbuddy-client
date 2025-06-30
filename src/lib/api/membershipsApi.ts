export async function getGroupMembers() {
  const res = await fetch('/mocks/groupMembers.json');
  return res.json();
}

export async function getGroupMembersByGroupId(groupId: number) {
  const res = await fetch('/mocks/groupMembers.json');
  const memberships = await res.json();
  return memberships.filter((m: { groupId: number }) => m.groupId === groupId);
}

export async function getUserMemberships(userId: number) {
  const res = await fetch('/mocks/groupMembers.json');
  const memberships = await res.json();
  return memberships.filter((m: { userId: number }) => m.userId === userId);
} 