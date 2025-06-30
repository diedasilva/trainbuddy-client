export async function getUsers() {
  const res = await fetch('/mocks/users.json');
  return res.json();
}

export async function getUserById(id: number) {
  const res = await fetch('/mocks/users.json');
  const users = await res.json();
  return users.find((u: { id: number }) => u.id === id);
} 