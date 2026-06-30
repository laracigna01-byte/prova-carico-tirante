export const LOAD_STEPS = [
  { key: "p10", label: "10%", percent: 10, factor: 0.10, phase: "carico" },
  { key: "p20", label: "20%", percent: 20, factor: 0.20, phase: "carico" },
  { key: "p40", label: "40%", percent: 40, factor: 0.40, phase: "carico" },
  { key: "p60", label: "60%", percent: 60, factor: 0.60, phase: "carico" },
  { key: "p80", label: "80%", percent: 80, factor: 0.80, phase: "carico" },
  { key: "p100", label: "100%", percent: 100, factor: 1.00, phase: "carico", isMax: true },
  { key: "u80", label: "Scarico 80%", percent: 80, factor: 0.80, phase: "scarico", unload: true },
  { key: "u60", label: "Scarico 60%", percent: 60, factor: 0.60, phase: "scarico", unload: true },
  { key: "u40", label: "Scarico 40%", percent: 40, factor: 0.40, phase: "scarico", unload: true },
  { key: "u20", label: "Scarico 20%", percent: 20, factor: 0.20, phase: "scarico", unload: true },
  { key: "u10", label: "Scarico 10%", percent: 10, factor: 0.10, phase: "scarico", unload: true },
  { key: "u0", label: "Scarico 0%", percent: 0, factor: 0, phase: "scarico", unload: true, isResidual: true }
];

export const NORME = {
  uni: "UNI 11211-4:2018",
  dm: "D.M. 17/01/2018 (NTC 2018) - Circ. C.S.LL.PP. n. 7/2019",
  dichiarazione:
    "La prova di carico sul tirante è stata eseguita in conformità alla UNI 11211-4:2018, al D.M. 17/01/2018 (NTC 2018), alla Circolare C.S.LL.PP. n. 7/2019 e alle prescrizioni progettuali fornite dal progettista incaricato."
};

export const DEFAULT_PROJECT = {
  reportId: "",
  dataProva: new Date().toLocaleDateString("it-IT"),
  dataInizio: new Date().toISOString().slice(0, 10),
  oraInizio: "",
  dataFine: new Date().toISOString().slice(0, 10),
  oraFine: "",
  cantiere: "S.S 26 della Valle d'Aosta",
  localita: "Valle d'Aosta",
  committente: "Anas S.p.A Area Gestione Valle d'Aosta",
  oggetto: "Affidamento prove di laboratorio in supporto alla Direzione dei Lavori per i lavori urgenti di sistemazione del pianp variabile, delle opere di sostegno delle protezioni marginali e delle opere di difesa passiva danneggiate a seguito dell'evento di caduta massi verificatosi in data 25/12/2022 che ha interessato in tratti saltuari la SS n. 26 tra il km 134+200 ed il km ed il m 135+900. ",
  direzioneLavori: " Ing. Antonino Ruggiero",
  impresa: "R.T.I Preve Costruzioni S.r.l. - IVIES S.p.A. ",
  tecnico: "Giuseppe Li Calzi",
  presenti: "",
  anchorId: "T-01",
  length: "",
  exerciseLoad: "",
  testFactor: 1.20,
  testLoad: "",
  jackId: "30",
  manometerId: "700",
  comparatorId: "",
  calibrationCoeff: "",
  note: "",
  photoCaption: "Foto della prova di carico sul tirante",
  outcome: "Positivo",
  outcomeNotes: "",
  signature: ""
};

export const initialReadings = () => Object.fromEntries(LOAD_STEPS.map((s) => [s.key, ""]));
export const initialPressures = () => Object.fromEntries(LOAD_STEPS.map((s) => [s.key, ""]));
