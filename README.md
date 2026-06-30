# Prova di carico su tirante

Applicazione React + Vite per la compilazione di rapporti di prova di carico su tirante.

## Funzioni principali

- Dati generali della prova e del cantiere.
- Identificativo tirante, lunghezza, carico di esercizio Ne e carico di collaudo Nc.
- Riferimenti normativi: UNI 11211-4:2018 e D.M. 386 del 03/12/2025.
- Tabella dei livelli di carico: 10%, 20%, 40%, 60%, 80%, 100% e scarico.
- Calcolo automatico dei carichi a partire dal carico di collaudo Nc.
- Un solo comparatore: inserimento dello spostamento in mm per ogni fase.
- Grafico carico/spostamento.
- Box note tecniche.
- Caricamento di una sola foto della prova, con didascalia.
- Esito prova: positivo, positivo con osservazioni, negativo.
- Firma del tecnico con mouse, touch o penna.
- Generazione PDF su due pagine, con logo/intestazione DISMAT, dicitura "PROVA SU MINUTA", tabella, foto e grafico affiancati, esito e firma.
- Esportazione CSV apribile in Excel.
- Archivio prove locale con apertura, duplicazione, PDF ed eliminazione.

## Apertura in VS Code

1. Estrai lo zip.
2. Apri VS Code.
3. Seleziona **File > Apri cartella**.
4. Apri la cartella `prova-carico-tirante`.

## Avvio

```bash
npm install
npm run dev
```

Poi apri l'indirizzo mostrato dal terminale, di solito:

```text
http://localhost:5173
```

## Build di produzione

```bash
npm run build
npm run preview
```

## Struttura moduli

```text
src/
  components/      Componenti UI: anagrafica, foto, firma, archivio, grafici
  config/          Configurazioni normative, step di carico, tema
  pdf/             Generazione PDF
  utils/           Calcoli, formattazione, immagini, archivio, CSV
public/            Logo, favicon e asset statici
```

## Note tecniche

I carichi di prova sono calcolati con:

```text
Carico fase = Nc x percentuale fase
```

dove `Nc` e il carico di collaudo inserito dall'utente sulla base dei dati forniti dal progettista.

La app non calcola area acciaio, inclinazione, quota, rapporto Em/Mt o allungamento teorico, perche questi dati sono stati esclusi dal capitolato operativo richiesto.


## Uso da cellulare con Vercel

Questa app e' pronta per essere pubblicata come web app statica su Vercel. Non serve tenere acceso il PC: dopo il deploy l'app funziona da link HTTPS su cellulare, tablet e desktop.

### Deploy rapido

1. Crea un repository GitHub e carica questa cartella.
2. Vai su Vercel e scegli **Add New Project**.
3. Importa il repository.
4. Vercel rileva automaticamente Vite. Usa queste impostazioni:
   - Framework preset: **Vite**
   - Build command: **npm run build**
   - Output directory: **dist**
5. Premi **Deploy**.

Il file `vercel.json` e' gia' incluso e configura build, cartella di output e rewrite verso `index.html`.

### Uso su smartphone

Apri il link Vercel dal telefono. Su iPhone puoi usare **Condividi > Aggiungi alla schermata Home**; su Android puoi usare **Installa app** o **Aggiungi a schermata Home**.

### Nota importante sull'archivio

L'archivio prove e le firme sono salvati localmente nel browser del dispositivo. Questo evita server e database, ma significa che i dati salvati su un telefono non compaiono automaticamente su un altro telefono. Per condivisione multi-dispositivo servira' in futuro un database cloud, ad esempio Supabase, Firebase o Vercel Postgres.

## Versione corretta per Vercel

Questa versione usa versioni bloccate e compatibili:

- Vite 6.4.3
- @vitejs/plugin-react 4.3.4

Comandi da usare in VS Code:

```bash
npm install
npm run dev
```

Per verificare il deploy:

```bash
npm run build
```

Su Vercel:

- Framework Preset: Vite
- Install Command: npm install --legacy-peer-deps --no-audit --no-fund
- Build Command: npm run build
- Output Directory: dist

Non usare `npm audit fix --force`, perche puo aggiornare Vite a una versione non compatibile con il progetto.
