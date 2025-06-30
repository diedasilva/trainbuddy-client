export async function getGroups() {
  const res = await fetch('/mocks/groups.json');
  return res.json();
}

export async function getGroupById(id: number) {
  const res = await fetch('/mocks/groups.json');
  const groups = await res.json();
  return groups.find((g: { id: number }) => g.id === id);
} 