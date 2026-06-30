import { fmt, safeText } from "./formatters";
import { NORME } from "../config/testConfig";

function csvCell(value) {
  const text = safeText(value, "").replace(/\r?\n/g, " ");
  return `"${text.replace(/"/g, '""')}"`;
}

export function exportCsv({ data, result }) {
  const rows = [
    ["PROVA DI CARICO SU TIRANTE"],
    ["Norma", NORME.uni, "D.M.", NORME.dm],
    ["Rapporto", data.reportId, "Tirante", data.anchorId],
    ["Data inizio", data.dataInizio, "Ora inizio", data.oraInizio, "Data fine", data.dataFine, "Ora fine", data.oraFine],
    ["Committente", data.committente, "Cantiere", data.cantiere, "Localita", data.localita],
    ["Ne kN", data.exerciseLoad, "Nc kN", data.testLoad, "Lunghezza m", data.length, "Coeff. taratura kN/bar", data.calibrationCoeff],
    [],
    ["Fase", "Percentuale", "Pressione bar", "Carico calcolato kN", "Carico teorico riferimento kN", "Spostamento mm"],
    ...result.rows.map((r) => [r.stepNo, r.label, fmt(r.pressure, 2), fmt(r.load, 2), fmt(r.targetLoad, 2), fmt(r.reading, 3)]),
    [],
    ["Esito", data.outcome],
    ["Osservazioni", data.outcomeNotes],
    ["Note tecniche", data.note]
  ];
  const csv = rows.map((row) => row.map(csvCell).join(";")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Prova_carico_su_tirante_${data.anchorId || data.reportId || "report"}.csv`.replace(/[^a-z0-9_.-]/gi, "_");
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
