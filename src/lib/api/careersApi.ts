export async function getCareers() {
  const res = await fetch('/mocks/careers.json');
  return res.json();
}

export async function getCareerById(id: number) {
  const res = await fetch('/mocks/careers.json');
  const careers = await res.json();
  return careers.find((c: { id: number }) => c.id === id);
}

export async function getCareersByCategory(category: string) {
  const res = await fetch('/mocks/careers.json');
  const careers = await res.json();
  return careers.filter((c: { category: string }) => c.category === category);
}

export async function getCareersByType(type: string) {
  const res = await fetch('/mocks/careers.json');
  const careers = await res.json();
  return careers.filter((c: { type: string }) => c.type === type);
}

export async function getCareersByLocation(location: string) {
  const res = await fetch('/mocks/careers.json');
  const careers = await res.json();
  return careers.filter((c: { location: string }) => c.location.includes(location));
} 