import { toNumber, round } from "./formatters";

function normalizeReadings(value) {
  if (Array.isArray(value)) {
    return Array.from({ length: 10 }, (_, i) => value[i] ?? "");
  }

  if (value === null || value === undefined || value === "") {
    return Array(10).fill("");
  }

  return [value, ...Array(9).fill("")];
}

function calcValidReading(values) {
  const nums = values
    .map((v) => toNumber(v, null))
    .filter((v) => v !== null);

  const lastThree = nums.slice(-3);

  const stable =
    lastThree.length === 3 &&
    Math.max(...lastThree) - Math.min(...lastThree) <= 0.02;

  const validReading = stable
    ? round(lastThree.reduce((sum, v) => sum + v, 0) / 3, 3)
    : nums.length
      ? round(nums[nums.length - 1], 3)
      : null;

  return {
    values,
    validReading,
    stable,
    measuredCount: nums.length,
  };
}

export function buildRows({
  readings,
  pressures,
  loadSteps,
  testLoad,
  calibrationCoeff,
  jackCapacityTon,
}) {
  const Nc = toNumber(testLoad, 0);
  const coeff = toNumber(calibrationCoeff, null);

  // Conversione tonnellate -> kN
  const jackCapacity = toNumber(jackCapacityTon, 0) * 9.80665;

  return loadSteps.map((step, index) => {
    const values = normalizeReadings(readings?.[step.key]);
    const readingData = calcValidReading(values);

    const targetLoad = round(Nc * step.factor, 2);

    // NUOVA FORMULA
    const pressure =
      jackCapacity > 0
        ? round((targetLoad * 700) / jackCapacity, 2)
        : null;

    const measuredLoad = targetLoad;
    const load = targetLoad;

    return {
      ...step,
      stepNo: index + 1,
      targetLoad,
      pressure,
      calibrationCoeff: coeff,
      measuredLoad,
      load,
      readings: values,
      reading: readingData.validReading,
      displacement: readingData.validReading,
      stable: readingData.stable,
      measuredCount: readingData.measuredCount,
    };
  });
}

export function calcTirante({
  readings,
  pressures,
  loadSteps,
  testLoad,
  calibrationCoeff,
  jackCapacityTon,
}) {
  const rows = buildRows({
    readings,
    pressures,
    loadSteps,
    testLoad,
    calibrationCoeff,
    jackCapacityTon,
  });

  // Spostamento relativo alla prima lettura (riferimento minuta Excel).
  const initial = rows.find((r) => r.reading !== null)?.reading ?? null;
  rows.forEach((r) => {
    r.displacement = initial !== null && r.reading !== null
      ? round(r.reading - initial, 3)
      : null;
  });
  const max = rows.find((r) => r.key === "p100") || null;
  const unload =
    rows.find((r) => r.isResidual) ||
    rows.filter((r) => r.unload).at(-1) ||
    null;

  const measuredCount = rows.filter((r) => r.reading !== null).length;
  const maxDisplacement = rows.filter((r) => r.factor === 1 && !r.unload && r.displacement !== null).at(-1)?.displacement ?? null;
  const residual = unload?.displacement ?? null;

  const toChartPoint = (r) => ({
    x: r.load,
    y: r.displacement,
    pressure: r.pressure,
    targetLoad: r.targetLoad,
    name: r.label,
    phase: r.phase,
    unload: r.unload,
  });

  const chartLoadPoints = rows
    .filter(
      (r) =>
        !r.unload &&
        r.displacement !== null &&
        Number.isFinite(Number(r.load))
    )
    .map(toChartPoint);

  const chartLoad = chartLoadPoints;

  const chartUnloadPoints = rows
    .filter(
      (r) =>
        r.unload &&
        r.displacement !== null &&
        Number.isFinite(Number(r.load))
    )
    .map(toChartPoint);

  const lastFullLoad = [...rows].reverse().find((r) => !r.unload && r.factor === 1 && r.displacement !== null);
  const chartUnload = lastFullLoad ? [toChartPoint(lastFullLoad), ...chartUnloadPoints] : chartUnloadPoints;

  const chartAll = [...chartLoad, ...chartUnload];

  return {
    rows,
    max,
    unload,
    measuredCount,
    maxDisplacement,
    residual,
    chartLoad,
    chartUnload,
    chartAll,
    formula:
      "Pressione [bar] calcolata automaticamente con proporzione: portata del martinetto : 700 bar = carico del gradino : x.",
  };
}

export function validateTest({ data, result, photo }) {
  const errors = [];

  if (!data.anchorId) errors.push("Identificativo tirante mancante");
  if (!data.testLoad) errors.push("Carico di collaudo Nc mancante");
  if (!data.exerciseLoad) errors.push("Carico di esercizio Ne mancante");
  if (!data.testLoad || Number(data.testLoad) <= 0)
    errors.push("Carico massimo della prova mancante");
  if (result.measuredCount === 0)
    errors.push("Inserire almeno una lettura del comparatore");
  if (!photo) errors.push("Foto della prova mancante");
  if (!data.tecnico) errors.push("Tecnico esecutore mancante");

  return errors;
}