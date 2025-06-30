export async function getCharts() {
  const res = await fetch('/mocks/charts.json');
  return res.json();
}

export async function getChartById(id: number) {
  const res = await fetch('/mocks/charts.json');
  const charts = await res.json();
  return charts.find((c: { id: number }) => c.id === id);
} 