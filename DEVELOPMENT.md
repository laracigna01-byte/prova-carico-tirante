\# Guida sviluppo applicazioni DISMAT



\## Applicazioni



Le tre applicazioni DISMAT sono:



\- Prova di carico su pali

\- Prova di carico su tiranti

\- Prova di carico su piastra



Le tre app devono evolvere insieme e mantenere una struttura simile.



\---



\## Regola principale



Quando una funzionalità viene migliorata in una app, valutare sempre se riportarla anche sulle altre due.



Esempi:



\- archivio prove

\- PDF

\- firma

\- salvataggio dati

\- grafico

\- esportazione CSV/Excel

\- compatibilità PWA/mobile



\---



\## Archivio prove



L'archivio deve usare sempre:



\- IndexedDB come archivio principale

\- localStorage come snapshot/fallback

\- migrazione automatica dai vecchi archivi



API comune:



```js

listTests()

saveTest()

deleteTest()

writeTests()

loadServerTests()

syncServerTests()

nextReportId()

Ogni archivio deve avere:



Apri

Duplica

PDF

Elimina

ricerca

conferma prima dell'eliminazione

Flusso Git corretto



Prima di lavorare:



pwd

git remote -v

git status



Prima di fare commit:



npm run build



Commit standard:



git add .

git commit -m "Descrizione modifica"

git push origin main



Se il push viene rifiutato:



git pull --rebase origin main

git push origin main

PDF



Ogni PDF deve contenere:



dati generali della prova

tabella letture

grafico

foto

firma

esito

riferimenti normativi



Obiettivo: PDF A4 leggibile e professionale.



PWA e mobile



Le app devono funzionare bene su:



PC

smartphone

app aggiunta alla schermata Home

Safari iPhone

Chrome Android



Non rimuovere:



manifest.webmanifest

service-worker.js

logica IndexedDB

App pali



Caratteristiche principali:



18 gradini

3 comparatori

9 letture per comparatore

stabilità sulle prime 3 letture

grafico carico/cedimento

PDF su una pagina A4

archivio IndexedDB

App tiranti



Caratteristiche principali:



un comparatore

pressione automatica/calcolata

grafico carico/spostamento

firma

foto

archivio IndexedDB

duplicazione prove salvata in archivio

App piastra



Caratteristiche principali:



prova secondo CNR 146/92

primo ciclo e secondo ciclo

calcolo Md e Md'

rapporto Md/Md'

firma elettronica

foto

tema chiaro/scuro

archivio IndexedDB

Regola finale



Non modificare tante cose insieme.



Procedura consigliata:



una modifica

test locale

npm run build

commit

push



Salva e chiudi.



Poi fai:



```powershell

git add DEVELOPMENT.md

git commit -m "Aggiunge guida sviluppo applicazioni DISMAT"

git push origin main

