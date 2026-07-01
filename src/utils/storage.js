const KEY = "tiranti_archive_v1";
const COUNTER = "tiranti_counter_v1";
const API_BASE = import.meta.env.VITE_API_BASE || "/api";
const SERVER_API = `${API_BASE}/archive.php`;

function lightenRecord(record) {
  return {
    ...record,
    photo: null,
    photoCaption: record?.photoCaption || "",
  };
}

function lightenList(list) {
  return list.map(lightenRecord);
}

export function nextReportId() {
  const year = new Date().getFullYear();
  const raw = localStorage.getItem(COUNTER);
  const state = raw ? JSON.parse(raw) : { year, n: 0 };
  const n = state.year === year ? state.n + 1 : 1;
  localStorage.setItem(COUNTER, JSON.stringify({ year, n }));
  return `TIR-${year}-${String(n).padStart(3, "0")}`;
}

export function listTests() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveTest(record) {
  const cleanRecord = lightenRecord(record);
  const list = listTests();
  const idx = list.findIndex((x) => x.id === cleanRecord.id);
  const next =
    idx >= 0
      ? list.map((x) => (x.id === cleanRecord.id ? cleanRecord : x))
      : [cleanRecord, ...list];

  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function writeTests(list) {
  const cleanList = lightenList(list);
  localStorage.setItem(KEY, JSON.stringify(cleanList));
  return cleanList;
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
  const cleanList = lightenList(list);

  try {
    const res = await fetch(SERVER_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archive: cleanList }),
    });
    if (!res.ok) throw new Error("Server save failed");
    return cleanList;
  } catch {
    return cleanList;
  }
}

export function deleteTest(id) {
  const next = listTests().filter((x) => x.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}