export const LOAD_STEPS = [
  { key: "p10", label: "10%", percent: 10, factor: 0.10, phase: "carico" },
  { key: "p20", label: "20%", percent: 20, factor: 0.20, phase: "carico" },
  { key: "p40", label: "40%", percent: 40, factor: 0.40, phase: "carico" },
  { key: "p60", label: "60%", percent: 60, factor: 0.60, phase: "carico" },
  { key: "p80", label: "80%", percent: 80, factor: 0.80, phase: "carico" },
  { key: "p100", label: "100% - 5 min", percent: 100, factor: 1, phase: "carico", isMax: true },
  { key: "p100b", label: "100% - 10 min", percent: 100, factor: 1, phase: "carico" },
  { key: "p100c", label: "100% - 15 min", percent: 100, factor: 1, phase: "carico" },
  { key: "u70", label: "Scarico 70%", percent: 70, factor: 0.70, phase: "scarico", unload: true },
  { key: "u40", label: "Scarico 40%", percent: 40, factor: 0.40, phase: "scarico", unload: true },
  { key: "u10", label: "Scarico 10%", percent: 10, factor: 0.10, phase: "scarico", unload: true, isResidual: true }
];

export const NORME = {
  uni: "UNI 11211-4:2018",
  dm: "D.M. 17/01/2018 (NTC 2018) - Circ. C.S.LL.PP. n. 7/2019",
  dichiarazione:
    "La prova di carico sul tirante è stata eseguita in conformità alla UNI 11211-4:2018, al D.M. 17/01/2018 (NTC 2018), alla Circolare C.S.LL.PP. n. 7/2019 e alle prescrizioni progettuali fornite dal progettista incaricato."
};

export const DEFAULT_PROJECT = {
  reportId: "",
  dataProva: "",
  dataInizio: "",
  oraInizio: "",
  dataFine: "",
  oraFine: "",
  cantiere: "",
  localita: "",
  committente: "",
  oggetto: "",
  direzioneLavori: "",
  impresa: "",
  tecnico: "",
  presenti: "",
  anchorId: "",
  length: "",
  exerciseLoad: "120",
  testFactor: 1.20,
  testLoad: 144,
  jackId: "30",
  jackCapacityTon: 30,
  manometerId: "700",
  comparatorId: "",
  calibrationCoeff: "",
  note: "",
  photoCaption: "Foto della prova di carico sul tirante",
  signature: ""
};

export const initialReadings = () => Object.fromEntries(LOAD_STEPS.map((s) => [s.key, ""]));
export const initialPressures = () => Object.fromEntries(LOAD_STEPS.map((s) => [s.key, ""]));
