export async function getActivities() {
  const res = await fetch('/mocks/activities.json');
  return res.json();
}

export async function getActivityById(id: number) {
  const res = await fetch('/mocks/activities.json');
  const activities = await res.json();
  return activities.find((a: { id: number }) => a.id === id);
}

export async function getActivitiesByCategory(category: string) {
  const res = await fetch('/mocks/activities.json');
  const activities = await res.json();
  return activities.filter((a: { category: string }) => a.category === category);
} 