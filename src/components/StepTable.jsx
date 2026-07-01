import { T } from "../config/theme";
import { fmt } from "../utils/formatters";

export function StepTable({
  step,
  load,
  targetLoad,
  pressure,
  onPressureChange,
  value = [],
  onChange,
  color,
}) {
  const readings = Array.isArray(value) ? value : Array(10).fill("");

  const updateReading = (index, nextValue) => {
    const next = [...readings];
    next[index] = nextValue;
    onChange(next);
  };

  const nums = readings
    .filter((v) => v !== "" && v !== null && v !== undefined)
    .map((v) => Number(String(v).replace(",", ".")))
    .filter((v) => Number.isFinite(v));

  const lastThree = nums.slice(-3);

  const isStable =
    lastThree.length === 3 &&
    Math.max(...lastThree) - Math.min(...lastThree) <= 0.02;

  const overLimit = Number(pressure) > 700;

  return (
    <div
      className={`step-table ${step.unload ? "is-unload" : ""}`}
      style={{ borderColor: step.unload ? T.accentOrange : T.border }}
    >
      <div className="step-head">
        <div>
          <b style={{ color }}>
            Carico gradino: {fmt(load, 2)} kN
          </b>

          <span>{step.label}</span>

          <small className="target-load">
            riferimento teorico {fmt(targetLoad, 2)} kN
          </small>
        </div>

        <div className="step-status">
          <mark className={isStable ? "ok" : "pending"}>
            {isStable ? "STABILE" : "DA VERIFICARE"}
          </mark>
        </div>
      </div>

      <div className="pressure-row">
        <label>Pressione calcolata [bar]</label>

        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={pressure || ""}
          readOnly
          aria-label="Pressione calcolata in bar"
          placeholder="bar"
          style={{
            color: overLimit ? "#dc2626" : undefined,
            fontWeight: overLimit ? 800 : undefined,
            borderColor: overLimit ? "#dc2626" : undefined,
          }}
        />

        {overLimit && (
          <small
            style={{
              color: "#dc2626",
              fontWeight: 700,
              marginTop: 6,
              display: "block",
            }}
          >
            ⚠ ATTENZIONE: la pressione richiesta supera 700 bar.
            Il martinetto selezionato non è idoneo a questo carico.
          </small>
        )}
      </div>

      <div className="step-grid ten-readings">
        {readings.map((reading, index) => (
          <div key={index}>
            <small>{index + 1}</small>

            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              value={reading || ""}
              onChange={(e) => updateReading(index, e.target.value)}
              placeholder="0,00"
              style={{
                color: reading ? undefined : "#6b7280",
                fontWeight: 800,
                opacity: 1,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}