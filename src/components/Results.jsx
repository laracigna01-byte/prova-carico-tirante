import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { T } from "../config/theme";
import { ResultCard } from "./Inputs";
import { fmt } from "../utils/formatters";

function Tip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return <div className="tip"><b>{p.name}</b><br />Pressione {fmt(p.pressure, 2)} bar<br />Spostamento {fmt(p.y, 3)} mm<br />Carico {fmt(p.x, 2)} kN</div>;
}

export function LoadDisplacementChart({ result }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 10, right: 18, bottom: 24, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
        <XAxis type="number" dataKey="x" name="Carico" unit=" kN" domain={[0, "dataMax + 10"]} stroke={T.textMuted} label={{ value: "Carico [kN]", position: "insideBottom", offset: -12 }} />
        <YAxis type="number" dataKey="y" name="Spostamento" unit=" mm" domain={["auto", "auto"]} stroke={T.textMuted} label={{ value: "Spostamento assoluto [mm]", angle: -90, position: "insideLeft" }} />
        <Tooltip content={<Tip />} />
        <Legend />
        <Scatter name="Carico" data={result.chartLoad} line={{ stroke: T.cycle1, strokeWidth: 2 }} fill={T.cycle1} />
        <Scatter name="Scarico" data={result.chartUnload || []} line={{ stroke: T.accentOrange, strokeWidth: 2 }} fill={T.accentOrange} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export function Results({ result, chartRef }) {
  return (
    <div>
      <div className="cards">
        <ResultCard label="Gradini compilati" value={result.measuredCount} unit={`/${result.rows.length}`} color={T.accentBlue} sub="carico e scarico" />
        <ResultCard label="Spostamento a 100%" value={fmt(result.maxDisplacement, 3)} unit="mm" color={T.cycle1} sub="relativo alla prima lettura" />
        <ResultCard label="Residuo allo scarico" value={fmt(result.residual, 3)} unit="mm" color={T.accentOrange} sub="relativo alla prima lettura" />
        <ResultCard label="Manometro" value="700" unit="bar" color={T.accentYellow} sub="fondo scala proporzione" />
      </div>

      <div className="chart-box" ref={chartRef}>
        <div className="chart-title"><b>Grafico carico / spostamento</b><span>Asse X = carico [kN], asse Y = spostamento relativo [mm]</span></div>
        {result.chartAll?.length ? <div className="chart"><LoadDisplacementChart result={result} /></div> : <div className="empty">Inserisci le letture per generare il grafico.</div>}
      </div>

      <div className="table-box">
        <div className="table-title">Tabella percentuali e letture</div>
        <div className="scroll">
          <table>
            <thead><tr><th>Fase</th><th>%</th><th>Pressione bar</th><th>Carico calcolato kN</th><th>Carico teorico rif. kN</th><th>Spostamento mm</th></tr></thead>
            <tbody>{result.rows.map((r) => <tr key={r.key} className={r.unload ? "unload" : ""}><td>{r.stepNo}</td><td>{r.label}</td><td>{fmt(r.pressure, 2)}</td><td>{fmt(r.load, 2)}</td><td>{fmt(r.targetLoad, 2)}</td><td>{fmt(r.displacement, 3)}</td></tr>)}</tbody>
          </table>
        </div>
      </div>

      <div className="note"><b>Nota tecnica:</b> la pressione in bar viene calcolata automaticamente con proporzione: carico massimo prova : 700 bar = carico gradino : x. I gradini e le letture del comparatore restano invariati. Lo scarico è gestito con gradini dedicati e curva separata.</div>
    </div>
  );
}
