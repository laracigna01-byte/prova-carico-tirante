# Manuale tecnico di sviluppo – Applicazioni DISMAT

**Versione documento:** 1.0.0
**Autore:** Lara Maria Cigna 
**Aiuto sviluppo:** OpenAI ChatGPT

**Ultimo aggiornamento:** Luglio 2026

**Stato:** In evoluzione

**Applicazioni documentate:**

- Prova di carico su pali
- Prova di carico su tirante
- Prova di carico su piastra
---

# Indice

1. Scopo del progetto
2. Filosofia di sviluppo
3. Architettura comune
4. Struttura del progetto
5. Componenti condivisi
6. Gestione archivio prove
7. Generazione PDF
8. Progressive Web App (PWA)
9. Git, Build e Deploy
10. Convenzioni di sviluppo
11. Applicazione Prova di Carico su Pali
12. Applicazione Prova di Carico su Tiranti
13. Applicazione Prova di Carico su Piastra
14. Roadmap
15. Decisioni progettuali

---

# 1. Scopo del progetto

Le applicazioni DISMAT sono state sviluppate per consentire la gestione completa delle prove di carico geotecniche direttamente in cantiere.

Le tre applicazioni sono:

- Prova di carico su pali
- Prova di carico su tiranti
- Prova di carico su piastra

Sono applicazioni web sviluppate in React e distribuite come Progressive Web App (PWA).

Obiettivi principali:

- utilizzo da PC e smartphone
- funzionamento offline
- compilazione rapida durante la prova
- generazione immediata del verbale PDF
- archiviazione locale delle prove
- interfaccia semplice per il tecnico di cantiere

Le tre applicazioni devono mantenere una struttura software il più possibile uniforme.

---

# 2. Filosofia di sviluppo

Ogni modifica deve rispettare alcuni principi fondamentali.

## Uniformità

Quando una funzionalità viene migliorata in una applicazione occorre sempre valutare se debba essere riportata anche nelle altre.

Ad esempio:

- archivio
- PDF
- grafici
- firma
- tema
- esportazione CSV
- ricerca
- salvataggio dati

L'obiettivo è evitare che le tre applicazioni evolvano in modo diverso.

---

## Piccole modifiche

Preferire modifiche piccole e facilmente verificabili.

Procedura consigliata:

1. implementazione
2. test locale
3. build
4. commit
5. push
6. deploy

---

# 3. Architettura comune

Tutte le applicazioni seguono la stessa architettura logica.

```
Utente

↓

Interfaccia React

↓

Componenti

↓

Calcoli

↓

Archivio

↓

PDF
```

La logica di calcolo deve essere separata dalla logica dell'interfaccia.

---

# 4. Struttura del progetto

```
src/

components/
config/
pdf/
utils/
assets/
```

## components

Contiene tutti i componenti React.

Ad esempio:

- Header
- InfoPanel
- StepTable
- Results
- Archive
- SignaturePad

---

## config

Costanti di configurazione.

Esempi:

- gradini prova
- colori
- impostazioni iniziali

---

## utils

Funzioni di utilità.

Ad esempio:

- calcoli
- archivio
- formatter
- esportazione CSV

---

## pdf

Generazione del verbale PDF.

---

## assets

Loghi e immagini statiche.

---

# 5. Componenti condivisi

Le tre applicazioni devono mantenere gli stessi componenti principali.

Header

Gestisce titolo e tema.

InfoPanel

Contiene tutti i dati generali della prova.

StepTable

Gestisce l'inserimento delle letture.

Results

Mostra risultati, grafico ed esito.

SignaturePad

Firma elettronica del tecnico.

Archive

Archivio prove.

---

# 6. Gestione archivio prove

L'archivio utilizza la stessa logica nelle tre applicazioni.

## Memoria principale

IndexedDB

## Backup

localStorage

Il localStorage viene mantenuto esclusivamente come:

- snapshot
- migrazione
- fallback

---

API comuni

```
listTests()

saveTest()

deleteTest()

writeTests()

loadServerTests()

syncServerTests()

nextReportId()
```

---

Ogni archivio deve permettere:

- Apri
- Duplica
- PDF
- Elimina
- Ricerca
- Ordinamento cronologico
- Conferma eliminazione

---

# 7. Generazione PDF

Ogni PDF deve contenere:

- dati della prova
- tabella risultati
- grafico
- foto
- firma
- esito
- riferimenti normativi

Obiettivo:

un solo foglio A4 professionale.

---

# 8. Progressive Web App

Le applicazioni devono funzionare come PWA.

Devono essere mantenuti:

- manifest.webmanifest
- service-worker.js

L'app deve funzionare correttamente:

- desktop
- smartphone
- Android
- iPhone
- modalità offline

---

# 9. Git, Build e Deploy

Prima di lavorare:

```powershell
pwd
git remote -v
git status
```

Prima del commit:

```powershell
npm run build
```

Procedura standard:

```powershell
git add .

git commit -m "Descrizione"

git push origin main
```

Se compare:

```
non-fast-forward
```

utilizzare:

```powershell
git pull --rebase origin main

git push origin main
```

---

# 10. Convenzioni di sviluppo

ID prove:

```
PAL-AAAA-001

TIR-AAAA-001

PIA-AAAA-001
```

I commit devono descrivere chiaramente la modifica.

Esempi:

```
Aggiunge archivio IndexedDB

Migliora PDF

Corregge duplicazione archivio
```

---

# 11. Prova di carico su Pali

Caratteristiche principali:

- 18 gradini
- 3 comparatori
- 9 letture per comparatore
- verifica stabilità sulle prime 3 letture
- grafico carico/cedimento
- foto
- firma
- PDF A4
- archivio IndexedDB

---

# 12. Prova di carico su Tiranti

Caratteristiche principali:

- un comparatore
- pressione automatica
- grafico carico/spostamento
- foto
- firma
- PDF A4
- archivio IndexedDB

---

# 13. Prova di carico su Piastra

Normativa principale:

CNR 146/92

Funzionalità:

- primo ciclo
- secondo ciclo
- Md
- Md'
- rapporto Md/Md'
- foto
- firma
- PDF A4
- archivio IndexedDB

---

# 14. Roadmap

## Completato

- Archivio IndexedDB
- Ricerca archivio
- Duplica
- PDF
- Firma elettronica
- Tema chiaro/scuro
- Compatibilità PWA

---

## Futuro

- Backup cloud
- Esportazione ZIP archivio
- Dashboard statistiche
- Sincronizzazione tra dispositivi
- Ricerca avanzata
- Gestione utenti

---

# 15. Decisioni progettuali

## Perché React

Per mantenere componenti riutilizzabili e separare interfaccia e logica.

## Perché Vite

Build molto veloce e ottima esperienza di sviluppo.

## Perché IndexedDB

Permette di archiviare grandi quantità di dati (comprese fotografie) e funziona offline.

## Perché PWA

Consente l'utilizzo direttamente in cantiere senza installare applicazioni native.

## Perché tre applicazioni separate

Le tre prove seguono normative differenti e hanno flussi operativi diversi, ma condividono la stessa architettura software.

---

# Regola finale

Le tre applicazioni devono evolvere insieme.

Ogni nuova funzionalità sviluppata per una di esse deve essere valutata per essere riportata anche sulle altre, mantenendo il codice il più possibile uniforme, leggibile e facilmente manutenibile.
---

# Storico documento

## Versione 1.0.0 – Luglio 2026

- Creazione del manuale tecnico.
- Definizione dell'architettura comune.
- Documentazione archivio IndexedDB.
- Workflow Git.
- Regole di sviluppo.
- Descrizione delle tre applicazioni.

---

Il presente documento deve essere aggiornato ogni volta che viene introdotta una modifica strutturale comune alle applicazioni DISMAT.