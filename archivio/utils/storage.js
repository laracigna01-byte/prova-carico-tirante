const KEY = "tiranti_archive_v1";
const COUNTER = "tiranti_counter_v1";
const BACKUP_VERSION = 1;

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeArchive(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
  return list;
}

function normalizeRecord(record) {
  const id = record?.id || record?.data?.reportId || nextReportId();
  return {
    ...record,
    id,
    savedAt: record?.savedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    data: { ...(record?.data || {}), reportId: id },
    readings: record?.readings || {},
    photo: record?.photo || null,
  };
}

export function nextReportId() {
  const year = new Date().getFullYear();
  const state = readJson(COUNTER, { year, n: 0 });
  const n = state.year === year ? Number(state.n || 0) + 1 : 1;
  localStorage.setItem(COUNTER, JSON.stringify({ year, n }));
  return `TIR-${year}-${String(n).padStart(3, "0")}`;
}

export function listTests() {
  const list = readJson(KEY, []);
  return Array.isArray(list)
    ? list.sort((a, b) => String(b.savedAt || "").localeCompare(String(a.savedAt || "")))
    : [];
}

export function saveTest(record) {
  const nextRecord = normalizeRecord(record);
  const list = listTests();
  const idx = list.findIndex((x) => x.id === nextRecord.id);
  const next = idx >= 0 ? list.map((x) => (x.id === nextRecord.id ? nextRecord : x)) : [nextRecord, ...list];
  return writeArchive(next);
}

export function deleteTest(id) {
  const next = listTests().filter((x) => x.id !== id);
  return writeArchive(next);
}

export function replaceArchive(records = []) {
  const normalized = records.map(normalizeRecord);
  return writeArchive(normalized);
}

export function mergeArchive(records = []) {
  const map = new Map(listTests().map((record) => [record.id, record]));
  records.map(normalizeRecord).forEach((record) => map.set(record.id, record));
  return writeArchive([...map.values()].sort((a, b) => String(b.savedAt || "").localeCompare(String(a.savedAt || ""))));
}

export function buildArchiveBackup(records = listTests()) {
  return {
    app: "prova-carico-su-tirante",
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    records,
  };
}

export function parseArchiveBackup(payload) {
  const parsed = typeof payload === "string" ? JSON.parse(payload) : payload;
  const records = Array.isArray(parsed) ? parsed : parsed?.records;
  if (!Array.isArray(records)) throw new Error("File archivio non valido");
  return records;
}
