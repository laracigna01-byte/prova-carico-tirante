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

  const lastThree = values
    .slice(7, 10)
    .map((v) => toNumber(v, null))
    .filter((v) => v !== null);

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

export function buildRows({ readings, pressures, loadSteps, testLoad, calibrationCoeff }) {
  const Nc = toNumber(testLoad, 0);
  const coeff = toNumber(calibrationCoeff, null);

  return loadSteps.map((step, index) => {
    const values = normalizeReadings(readings?.[step.key]);
    const readingData = calcValidReading(values);
    const targetLoad = round(Nc * step.factor, 2);
    const pressure = toNumber(pressures?.[step.key], null);
    const measuredLoad = coeff !== null && pressure !== null ? round(pressure * coeff, 2) : null;
    const load = measuredLoad ?? targetLoad;

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

export function calcTirante({ readings, pressures, loadSteps, testLoad, calibrationCoeff }) {
  const rows = buildRows({ readings, pressures, loadSteps, testLoad, calibrationCoeff });
  const max = rows.find((r) => r.key === "p100") || null;
  const unload = rows.find((r) => r.isResidual) || rows.filter((r) => r.unload).at(-1) || null;

  const measuredCount = rows.filter((r) => r.reading !== null).length;
  const maxDisplacement = max?.displacement ?? null;
  const residual = unload?.displacement ?? null;

  const toChartPoint = (r) => ({
    x: r.displacement,
    y: r.load,
    pressure: r.pressure,
    targetLoad: r.targetLoad,
    name: r.label,
    phase: r.phase,
    unload: r.unload,
  });

  const chartLoad = rows
    .filter((r) => !r.unload && r.displacement !== null && Number.isFinite(Number(r.load)))
    .map(toChartPoint);

  const chartUnload = rows
    .filter((r) => r.unload && r.displacement !== null && Number.isFinite(Number(r.load)))
    .map(toChartPoint);

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
      "Pressione [bar] inserita dal tecnico. Carico applicato [kN] = pressione [bar] x coefficiente di taratura [kN/bar]. Se manca la pressione viene mostrato solo il carico teorico del gradino = Nc x percentuale.",
  };
}

export function validateTest({ data, result, photo }) {
  const errors = [];

  if (!data.anchorId) errors.push("Identificativo tirante mancante");
  if (!data.testLoad) errors.push("Carico di collaudo Nc mancante");
  if (!data.exerciseLoad) errors.push("Carico di esercizio Ne mancante");
  if (!data.calibrationCoeff) errors.push("Coeff. di taratura martinetto kN/bar mancante");

  const rowsWithReadings = result.rows.filter((r) => r.measuredCount > 0);
  const rowsWithoutPressure = rowsWithReadings.filter((r) => r.pressure === null);
  if (rowsWithoutPressure.length) errors.push("Inserire la pressione letta [bar] per i gradini compilati");
  if (result.measuredCount === 0) errors.push("Inserire almeno una lettura del comparatore");
  if (!photo) errors.push("Foto della prova mancante");
  if (!data.tecnico) errors.push("Tecnico esecutore mancante");

  return errors;
}