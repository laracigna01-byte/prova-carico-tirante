import { useState } from "react";
import { TextInput, NumberInput, SectionHeader, TextArea } from "./Inputs";
import { PhotoUploader } from "./PhotoUploader";
import { T } from "../config/theme";
import { NORME } from "../config/testConfig";

export function InfoPanel({ data, setData, photo, setPhoto }) {
  const [open, setOpen] = useState(true);
  const upd = (key) => (value) => setData((prev) => ({ ...prev, [key]: value }));
  return (
    <div className="panel">
      <button className="panel-toggle" type="button" onClick={() => setOpen(!open)}>
        {open ? "Nascondi dati prova" : "Mostra dati prova"}
        <span>{data.reportId ? `Rapporto ${data.reportId}` : "UNI 11211-4:2018 - Prova di carico su tirante"}</span>
      </button>
      {open && (
        <div className="panel-body">
          <SectionHeader label="Dati generali" step="A" color={T.accentBlue} />
          <div className="norm-box"><b>Riferimenti normativi</b><span>{NORME.uni} - {NORME.dm}</span></div>
          <div className="grid small">
            <TextInput label="Data inizio" type="date" value={data.dataInizio} onChange={upd("dataInizio")} />
            <TextInput label="Ora inizio" type="time" value={data.oraInizio} onChange={upd("oraInizio")} />
            <TextInput label="Data fine" type="date" value={data.dataFine} onChange={upd("dataFine")} />
            <TextInput label="Ora fine" type="time" value={data.oraFine} onChange={upd("oraFine")} />
          </div>
          <div className="grid">
            <TextInput label="Committente" value={data.committente} onChange={upd("committente")} />
            <TextInput label="Cantiere" value={data.cantiere} onChange={upd("cantiere")} />
            <TextInput label="Localita" value={data.localita} onChange={upd("localita")} />
            <TextInput label="Direzione lavori" value={data.direzioneLavori} onChange={upd("direzioneLavori")} />
            <TextInput label="Impresa" value={data.impresa} onChange={upd("impresa")} />
            <TextInput label="Tecnico esecutore" value={data.tecnico} onChange={upd("tecnico")} />
          </div>
          <TextArea label="Oggetto" value={data.oggetto} onChange={upd("oggetto")} placeholder="Descrizione dell'oggetto della prova" />

          <SectionHeader label="Dati tirante" step="B" color={T.accentOrange} />
          <div className="grid small">
            <TextInput label="Identificativo tirante" value={data.anchorId} onChange={upd("anchorId")} placeholder="T-01" />
            <NumberInput label="Lunghezza (m)" value={data.length} onChange={upd("length")} placeholder="m" />
           <NumberInput
  label="Carico di esercizio Ne (kN)"
  value={data.exerciseLoad}
  onChange={(value) =>
    setData((prev) => {
      const ne = Number(value || 0);
      const coeff = Number(prev.testFactor || 1);
      return {
        ...prev,
        exerciseLoad: value,
        testLoad: ne * coeff,
      };
    })
  }
/>

<NumberInput
  label="Coefficiente prova"
  value={data.testFactor || 1}
  onChange={(value) =>
    setData((prev) => {
      const ne = Number(prev.exerciseLoad || 0);
      const coeff = Number(value || 1);
      return {
        ...prev,
        testFactor: value,
        testLoad: ne * coeff,
      };
    })
  }
/>

<NumberInput
  label="Carico di collaudo Nc (kN)"
  value={data.testLoad}
  readOnly
/>
          </div>

          <SectionHeader label="Strumentazione" step="C" color={T.accent} />
          <div className="grid small">
            <TextInput label="Martinetto" value={data.jackId} onChange={upd("jackId")} />
            <TextInput label="Manometro / cella" value={data.manometerId} onChange={upd("manometerId")} />
            <TextInput label="Comparatore" value={data.comparatorId} onChange={upd("comparatorId")} />
            <NumberInput label="Coeff. taratura (kN/bar)" value={data.calibrationCoeff || ""} onChange={upd("calibrationCoeff")} placeholder="da certificato ACCREDIA" />
            <TextInput label="Presenti" value={data.presenti} onChange={upd("presenti")} />
          </div>

          <SectionHeader label="Note e foto" step="D" color={T.accentYellow} />
          <TextArea label="Note tecniche" value={data.note} onChange={upd("note")} placeholder="Annotazioni su condizioni di prova, attrezzatura, anomalie, dati del progettista..." />
          <PhotoUploader photo={photo} setPhoto={setPhoto} caption={data.photoCaption} setCaption={upd("photoCaption")} />
        </div>
      )}
    </div>
  );
}
