const KEY = "tiranti_archive_v1";
const COUNTER = "tiranti_counter_v1";
const API_BASE = import.meta.env.VITE_API_BASE || "/api";
const SERVER_API = `${API_BASE}/archive.php`;

export function nextReportId() {
  const year = new Date().getFullYear();
  const raw = localStorage.getItem(COUNTER);
  const state = raw ? JSON.parse(raw) : { year, n: 0 };
  const n = state.year === year ? state.n + 1 : 1;
  localStorage.setItem(COUNTER, JSON.stringify({ year, n }));
  return `TIR-${year}-${String(n).padStart(3, "0")}`;
}

export function listTests() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function saveTest(record) {
  const list = listTests();
  const idx = list.findIndex((x) => x.id === record.id);
  const next = idx >= 0 ? list.map((x) => x.id === record.id ? record : x) : [record, ...list];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function writeTests(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
  return list;
}

export async function loadServerTests() {
  try {
    const res = await fetch(SERVER_API, { cache: "no-store" });
    if (!res.ok) throw new Error("Server load failed");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return listTests();
  }
}

export async function syncServerTests(list) {
  try {
    const res = await fetch(SERVER_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archive: list }),
    });
    if (!res.ok) throw new Error("Server save failed");
    return list;
  } catch {
    return list;
  }
}

export function deleteTest(id) {
  const next = listTests().filter((x) => x.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
