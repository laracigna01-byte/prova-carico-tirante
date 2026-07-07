import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { InfoPanel } from "./components/InfoPanel";
import { StepTable } from "./components/StepTable";
import { Results } from "./components/Results";
import { SectionHeader } from "./components/Inputs";
import { SignaturePad } from "./components/SignaturePad";
import { Archive } from "./components/Archive";
import { LOAD_STEPS, initialReadings, initialPressures, DEFAULT_PROJECT } from "./config/testConfig";
import { T } from "./config/theme";
import { calcTirante, validateTest } from "./utils/calculations";
import { exportReport } from "./pdf/exportReport";
import { exportCsv } from "./utils/exportCsv";
import { fmt } from "./utils/formatters";
import { listTests, nextReportId, saveTest, writeTests, loadServerTests, syncServerTests } from "./utils/storage";
import { LoginGate } from "./security/LoginGate";
export default function App() {
  const [data, setData] = useState(DEFAULT_PROJECT);
  const [readings, setReadings] = useState(initialReadings);
  const [pressures, setPressures] = useState(initialPressures);
  const [photo, setPhoto] = useState(null);
  const [archive, setArchive] = useState(listTests());
  const chartRef = useRef(null);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    document.body.classList.remove("theme-dark", "theme-light");
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    (async () => {
      const serverArchive = await loadServerTests();
      if (serverArchive.length) setArchive(serverArchive);
    })();
  }, []);

  useEffect(() => {
    writeTests(archive);
    syncServerTests(archive);
  }, [archive]);

  const result = useMemo(
  () =>
    calcTirante({
      readings,
      pressures,
      loadSteps: LOAD_STEPS,
      testLoad: data.testLoad,
      calibrationCoeff: data.calibrationCoeff,
      jackCapacityTon: data.jackCapacityTon,
    }),
  [
    readings,
    pressures,
    data.testLoad,
    data.calibrationCoeff,
    data.jackCapacityTon,
  ]
);
  const errors = useMemo(() => validateTest({ data, result, photo }), [data, result, photo]);

  const setReading = (key, value) => setReadings((prev) => ({ ...prev, [key]: value }));
  const setPressure = (key, value) => setPressures((prev) => ({ ...prev, [key]: value }));

  function newTest() {
    if (!window.confirm("Creare una nuova prova? I dati non salvati verranno persi.")) return;
    setData({ ...DEFAULT_PROJECT, reportId: nextReportId() });
    setReadings(initialReadings());
    setPressures(initialPressures());
    setPhoto(null);
  }

  function saveCurrent() {
    const id = data.reportId || nextReportId();
    const nextData = { ...data, reportId: id };
    setData(nextData);
    const record = { id, savedAt: new Date().toISOString(), data: nextData, readings, pressures, photo };
    setArchive(saveTest(record));
    window.alert(`Prova ${id} salvata in archivio.`);
  }

  function openRecord(record) {
  const restoredData = {
    ...DEFAULT_PROJECT,
    ...(record.data || {}),
  };

  const restoredReadings = {
    ...initialReadings(),
    ...(record.readings || {}),
  };

  const restoredPressures = {
    ...initialPressures(),
    ...(record.pressures || {}),
  };

  setData(restoredData);
  setReadings(restoredReadings);
  setPressures(restoredPressures);
  setPhoto(record.photo || null);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function duplicateRecord(record) {
  const newId = nextReportId();

  const duplicatedData = {
    ...DEFAULT_PROJECT,
    ...(record.data || {}),
    reportId: newId,
    anchorId: `${record.data?.anchorId || "T"}-COPIA`,
  };

  const duplicatedReadings = {
    ...initialReadings(),
    ...(record.readings || {}),
  };

  const duplicatedPressures = {
    ...initialPressures(),
    ...(record.pressures || {}),
  };

  const duplicatedRecord = {
    id: newId,
    savedAt: new Date().toISOString(),
    data: duplicatedData,
    readings: duplicatedReadings,
    pressures: duplicatedPressures,
    photo: record.photo || null,
  };

  setArchive(saveTest(duplicatedRecord));
  openRecord(duplicatedRecord);

  window.alert(`Prova duplicata come ${newId}.`);
}
  function exportCurrent() {
    exportReport({ data, result, photo });
  }

  function exportRecord(record) {
  const recResult = calcTirante({
    readings: record.readings,
    pressures: record.pressures,
    loadSteps: LOAD_STEPS,
    testLoad: record.data.testLoad,
    calibrationCoeff: record.data.calibrationCoeff,
    jackCapacityTon: record.data.jackCapacityTon,
  });

  exportReport({
    data: record.data,
    result: recResult,
    photo: record.photo,
    chartNode: null,
  });
}

    return (
  <LoginGate 
      appName="Sistema Gestione Prove DISMAT"
      moduleName="Prova di carico su tirante"
      >
    <main className="app-shell">
      <Header
        theme={theme}
        setTheme={setTheme}
      
      />

      <InfoPanel data={data} setData={setData} photo={photo} setPhoto={setPhoto} />

      <section className="summary-strip">
        <div><span>Ne esercizio</span><b>{fmt(Number(data.exerciseLoad || 0), 2)} kN</b></div>
        <div><span>Nc collaudo</span><b>{fmt(Number(data.testLoad || 0), 2)} kN</b></div>
        <div><span>Lunghezza</span><b>{data.length || "-"} m</b></div>
        <div><span>Manometro</span><b>700 bar</b></div>
        <div><span>Foto prova</span><b>{photo ? "Presente" : "Mancante"}</b></div>
      </section>

      {errors.length > 0 && <div className="warning-box"><b>Controlli prima del PDF:</b> {errors.join(" - ")}</div>}

      <section className="workbench">
        <div className="left-col">
          <SectionHeader label="Tabella prova - un comparatore" step="1" color={T.accentBlue} />
          <p className="hint">
        Per ogni gradino inserisci solo le letture del comparatore. La pressione in bar viene calcolata automaticamente con la proporzione: <b>portata del martinetto : 700 bar = carico del gradino : x</b>.
          </p>
          <div className="steps one-col">
            {result.rows.map((row, index) => (
              <StepTable
                key={row.key}
                step={row}
                load={row.load}
                targetLoad={row.targetLoad}
                pressure={row.pressure}
                onPressureChange={(value) => setPressure(row.key, value)}
                value={readings[row.key]}
                onChange={(value) => setReading(row.key, value)}
                color={row.unload ? T.accentOrange : index < 3 ? T.cycle1 : T.cycle2}
              />
            ))}
          </div>
        </div>
        <aside className="right-col">
          <SectionHeader label="Grafico, esito, firma e report" step="2" color={T.accent} />
          <Results result={result} data={data} setData={setData} chartRef={chartRef} />
          <SectionHeader label="Firma tecnico" step="3" color={T.accentYellow} />
          <SignaturePad value={data.signature} onChange={(signature) => setData((prev) => ({ ...prev, signature }))} />
          <div className="actions">
            <button onClick={exportCurrent}>Genera PDF</button>
            <button className="ghost" onClick={saveCurrent}>Salva in archivio</button>
            <button className="ghost" onClick={() => exportCsv({ data, result })}>CSV Excel</button>
            <button className="ghost danger" onClick={newTest}>Nuova prova</button>
          </div>
        </aside>
      </section>

      <Archive items={archive} setItems={setArchive} onOpen={openRecord} onDuplicate={duplicateRecord} onExport={exportRecord} />
    </main>
  </LoginGate>
  );
}
