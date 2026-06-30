import { useMemo, useRef, useState } from "react";
import { deleteTest, buildArchiveBackup, mergeArchive, parseArchiveBackup, replaceArchive } from "../utils/storage";
import { fmt, safeText } from "../utils/formatters";

function toDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" });
}

function recordText(item) {
  return [
    item.id,
    item.data?.dataProva,
    item.data?.anchorId,
    item.data?.committente,
    item.data?.cantiere,
    item.data?.localita,
    item.data?.tecnico,
    item.data?.outcome,
  ].filter(Boolean).join(" ").toLowerCase();
}

function csvCell(value) {
  const text = safeText(value, "").replace(/\r?\n/g, " ");
  return `"${text.replace(/"/g, '""')}"`;
}

function downloadFile({ content, filename, type }) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function exportArchiveJson(items) {
  downloadFile({
    content: JSON.stringify(buildArchiveBackup(items), null, 2),
    filename: `archivio_prove_tiranti_${new Date().toISOString().slice(0, 10)}.json`,
    type: "application/json;charset=utf-8",
  });
}

function exportArchiveCsv(items) {
  const rows = [
    ["ID", "Data prova", "Salvataggio", "Tirante", "Committente", "Cantiere", "Localita", "Ne kN", "Nc kN", "Lunghezza m", "Esito", "Tecnico", "Note"],
    ...items.map((item) => [
      item.id,
      item.data?.dataProva,
      toDate(item.savedAt),
      item.data?.anchorId,
      item.data?.committente,
      item.data?.cantiere,
      item.data?.localita,
      item.data?.exerciseLoad,
      item.data?.testLoad,
      item.data?.length,
      item.data?.outcome,
      item.data?.tecnico,
      item.data?.outcomeNotes || item.data?.note,
    ]),
  ];
  downloadFile({
    content: `\uFEFF${rows.map((row) => row.map(csvCell).join(";")).join("\n")}`,
    filename: `riepilogo_archivio_prove_${new Date().toISOString().slice(0, 10)}.csv`,
    type: "text/csv;charset=utf-8",
  });
}

export function Archive({ items, setItems, onOpen, onDuplicate, onExport }) {
  const [query, setQuery] = useState("");
  const [outcome, setOutcome] = useState("tutti");
  const fileRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesText = !q || recordText(item).includes(q);
      const matchesOutcome = outcome === "tutti" || String(item.data?.outcome || "").toLowerCase() === outcome;
      return matchesText && matchesOutcome;
    });
  }, [items, query, outcome]);

  const stats = useMemo(() => ({
    total: items.length,
    positivi: items.filter((item) => String(item.data?.outcome || "").toLowerCase() === "positivo").length,
    negativi: items.filter((item) => String(item.data?.outcome || "").toLowerCase() === "negativo").length,
    filtrati: filtered.length,
  }), [items, filtered.length]);

  const handleDelete = (id) => {
    if (!window.confirm(`Eliminare definitivamente la prova ${id} dall'archivio locale?`)) return;
    setItems(deleteTest(id));
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const text = await file.text();
      const records = parseArchiveBackup(text);
      const mode = window.confirm("Premi OK per UNIRE il backup all'archivio attuale. Premi Annulla per SOSTITUIRE tutto l'archivio attuale.") ? "merge" : "replace";
      const next = mode === "merge" ? mergeArchive(records) : replaceArchive(records);
      setItems(next);
      window.alert(`Archivio importato: ${records.length} prove.`);
    } catch (error) {
      window.alert(error?.message || "Impossibile importare il file archivio.");
    }
  };

  return (
    <div className="archive panel">
      <div className="panel-body">
        <div className="section-header"><div>F</div><span>Archivio prove</span><i /></div>

        <div className="archive-toolbar">
          <div className="archive-search">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cerca per tirante, committente, cantiere, tecnico..." />
            <select value={outcome} onChange={(event) => setOutcome(event.target.value)}>
              <option value="tutti">Tutti gli esiti</option>
              <option value="positivo">Solo positivi</option>
              <option value="negativo">Solo negativi</option>
            </select>
          </div>
          <div className="archive-tools">
            <button className="ghost" onClick={() => exportArchiveCsv(filtered)} disabled={!filtered.length}>Riepilogo CSV</button>
            <button className="ghost" onClick={() => exportArchiveJson(items)} disabled={!items.length}>Backup archivio</button>
            <button className="ghost" onClick={() => fileRef.current?.click()}>Importa backup</button>
            <input ref={fileRef} className="off" type="file" accept="application/json,.json" onChange={handleImport} />
          </div>
        </div>

        <div className="archive-kpis">
          <div><span>Totale prove</span><b>{stats.total}</b></div>
          <div><span>Positive</span><b>{stats.positivi}</b></div>
          <div><span>Negative</span><b>{stats.negativi}</b></div>
          <div><span>In tabella</span><b>{stats.filtrati}</b></div>
        </div>

        {items.length === 0 ? <p className="hint">Nessuna prova salvata. Usa "Salva in archivio" dopo aver compilato la scheda.</p> : filtered.length === 0 ? <p className="hint">Nessuna prova corrisponde ai filtri impostati.</p> : (
          <div className="scroll">
            <table>
              <thead><tr><th>ID</th><th>Salvataggio</th><th>Data prova</th><th>Tirante</th><th>Committente / Cantiere</th><th>Nc</th><th>Esito</th><th>Azioni</th></tr></thead>
              <tbody>{filtered.map((item) => (
                <tr key={item.id}>
                  <td><b>{item.id}</b></td>
                  <td>{toDate(item.savedAt)}</td>
                  <td>{item.data?.dataProva || "—"}</td>
                  <td>{item.data?.anchorId || "—"}</td>
                  <td><b>{item.data?.committente || "—"}</b><br /><small>{item.data?.cantiere || item.data?.localita || "—"}</small></td>
                  <td>{fmt(item.data?.testLoad, 2)} kN</td>
                  <td><mark className={String(item.data?.outcome || "").toLowerCase() === "positivo" ? "ok" : "pending"}>{item.data?.outcome || "—"}</mark></td>
                  <td className="row-actions"><button onClick={() => onOpen(item)}>Apri</button><button onClick={() => onDuplicate(item)}>Duplica</button><button onClick={() => onExport(item)}>PDF</button><button className="danger" onClick={() => handleDelete(item.id)}>Elimina</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
        <p className="hint archive-note">L'archivio viene salvato nel browser del dispositivo. Usa "Backup archivio" per copiarlo su PC, Drive o chiavetta e "Importa backup" per ripristinarlo su un altro dispositivo.</p>
      </div>
    </div>
  );
}
