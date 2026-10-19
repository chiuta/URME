# URME — guida escursionistica Aluniș–Colți (Monti Buzău)

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · **Italiano** · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

**Versione:** 1.2.0 · **Ultimo aggiornamento:** 2026-10-19

Lingue dell'interfaccia: **Română, English, Français, Italiano, Español, Português (PT), Deutsch, Magyar**

Guida offline, in un unico file HTML, per un'escursione ad anello con partenza da Aluniș Retreat: foresta, piante medicinali, ambra, fossili e il complesso rupestre di Aluniș. Informativa e non ufficiale.

**App online:** https://chiuta.github.io/URME/

![Schermata](screenshot.png)

## Che cos'è

URME («Un giorno negli strati della montagna») è una guida da leggere, non un'app di navigazione. Descrive un anello di circa 11 km (stima, non misurata con GPS) e di 5–6 ore, con soste tematiche: la foresta e i suoi abitanti, le piante medicinali, l'ambra di Colți, i fossili e il rilievo, la Chiesa nella Roccia di Aluniș e una sezione sul cielo notturno. La pagina inizia con un riquadro di sicurezza e termina con una sezione «Practic» (Pratico) (riepilogo, contatti pubblicati dall'organizzatore, fonti).

## Funzioni

Verificate nel codice:
- Riquadro visibile «Siguranță în munte» (Sicurezza in montagna): meteo, attrezzatura, 112, assenza di garanzie sulla segnaletica/sullo stato del sentiero, limiti della mappa e del GPS.
- Mappa schematica SVG propria dell'anello (senza tessere di mappa esterne), con legenda; su schermo stretto scorre lateralmente.
- Sezione comprimibile «In English — safety and essentials for visitors» (sotto il riquadro di sicurezza, `lang="en"`): traduzione fedele del riquadro «Siguranță în munte», dei dati di base (distanza, durata, difficoltà, stagione) e dell'elenco «Ce iei cu tine» (Cosa porti con te), senza informazioni nuove; il resto della pagina resta in rumeno.
- Elenco dell'attrezzatura con spunte e contatore («X su 9 pronti»); le spunte vengono ora conservate nel browser (vedi «Novità»). Il pulsante «Copiază ce îmi mai trebuie» (Copia ciò che mi serve ancora) copia negli appunti solo gli elementi non spuntati.
- Pianificatore della giornata (sezione «Pornire»): per una data e un'ora di partenza calcola localmente l'alba, il tramonto e il crepuscolo civile (zona di Colți, circa 45,38° N, 26,40° E, secondo Wikipedia, consultata l'11 ottobre 2026), nell'ora della Romania (con il passaggio all'ora legale/solare), la partenza più tardiva consigliata (6 h di percorso + 1 h di riserva) e il margine rispetto al tramonto per la stima di 5–6 h della guida; avverte se il ritorno avvenisse dopo il tramonto. Algoritmo astronomico semplificato, verificato l'11 ottobre 2026 rispetto a un calcolatore pubblico per Buzău (differenze di pochi minuti, spiegabili con la posizione); non tiene conto del rilievo.
- Navigazione per sezioni con evidenziazione della sezione corrente; interruttore giorno/notte (segue l'impostazione del sistema all'apertura); stile di stampa.
- Sezioni comprimibili (storia della miniera, «Alte urme din jur» (Altre tracce nei dintorni), «De ce se numește URME» (Perché si chiama URME)).

## Novità (1.1.0)

- **Mappa del cielo** (sezione «Noaptea» (La notte)): scegli la data e l'ora (ora della Romania, con il passaggio all'ora legale/solare) e l'app disegna il cielo sopra la zona Colți–Aluniș (circa 45,38° N, 26,40° E): stelle fino alla magnitudine 5 (1627 dal catalogo Hipparcos), le figure e i nomi rumeni delle costellazioni, il Sole, la Luna (con la fase disegnata) e i pianeti da Mercurio a Saturno. Sotto la mappa compare una tabella con altezza e azimut dei corpi, la fase della Luna, il suo sorgere e tramontare e un'indicazione «cielo buio» (Sole sotto −18° e Luna sotto l'orizzonte). Il calcolo avviene in locale, con le effemeridi di `fff-kit` (errori misurati: meno di 3″ per Sole, Luna e pianeti rispetto a JPL DE421/423; vedi `fff-kit/docs/ephem.md`).
  - **Limiti:** non disegna la Via Lattea, le nuvole, l'inquinamento luminoso né il rilievo (la montagna alza l'orizzonte reale); mancano le stelle più deboli della magnitudine 5 e i pianeti Urano e Nettuno (non visibili a occhio nudo). La mappa serve per la pianificazione, non per la sicurezza.
- **L'elenco dell'attrezzatura viene conservato** tra una visita e l'altra (`localStorage`, chiave `urme.gear`), così come le spunte «Figuri» (Figure) e «Nume» (Nomi) della mappa del cielo (`urme.sky`). Puoi fare una copia di riserva `.fff.json` dalla finestra «Transparență» (Trasparenza) (premi la versione nel piè di pagina).
- **Scheda da campo stampata** (sezione «Pornire», pulsante «Tipărește fișa de teren» (Stampa la scheda da campo)): una pagina con sicurezza, 112, le ore di luce dal pianificatore, l'elenco dell'attrezzatura con le tue spunte e un codice QR (generato in locale) verso la guida pubblicata. Senza JavaScript o senza il modulo QR, la scheda manca / compare senza codice.
- **Trasparenza** (premendo la versione nel piè di pagina): rete (0 richieste esterne), chiavi salvate, file con SHA-256.

L'interfaccia ha 8 lingue (RO, EN, FR, IT, ES, PT, DE, HU); il testo lungo della guida resta in rumeno, e le traduzioni diverse dal rumeno sono automatiche e non verificate da madrelingua.

## Il kit «fff-kit»

Moduli incorporati in `index.html`: `core`, `label`, `bundle`, `qr`, `ephem`, `ephem-stars` (in totale circa 455 kB in più rispetto alla guida). Senza di essi la guida resta pienamente funzionante (testato): la mappa del cielo non compare. Dati e licenze del catalogo stellare: `fff-kit/THIRD-PARTY.md` (Hipparcos/ESA, d3-celestial BSD-3-Clause, hipparcos-catalog MIT). `app.json` descrive la rete, i permessi e lo SHA-256.

## Test

`node tests/fff-r8.test.mjs` (Playwright, rete bloccata; 69 verifiche): Luna piena il 26 ottobre 2026 e Luna nuova il 2 agosto 2027, il Sole al tramonto nel pianificatore (algoritmo NOAA indipendente) in quattro date, Polaris a un'altezza ≈ latitudine, il fuso orario estate/inverno, la persistenza delle spunte, il pacchetto `.fff.json`, la scheda e la modalità di stampa (PDF di una pagina), axe-core 0 violazioni (tema chiaro e scuro, 360 px, finestra di dialogo), senza il kit.

## Guida all'uso

1. Leggi il riquadro «Siguranță în munte» prima di pianificare l'escursione.
2. Scorri «Pornire» (cosa porti con te, regole, stagioni) e spunta l'elenco dell'attrezzatura.
3. Consulta «Hartă» (Mappa) per l'ordine delle soste; non usarla per la navigazione.
4. Leggi le tappe (Plante, Chihlimbar, Fosile, Aluniș, Noaptea) nell'ordine che preferisci, dalla barra di navigazione.
5. In «Practic» trovi il riepilogo e i recapiti pubblicati dall'organizzatore (verificali direttamente).
6. Puoi stampare la pagina; l'interruttore giorno/notte si trova nell'angolo in alto a destra.

## Privacy e rete

- **Archiviazione:** solo `localStorage`, in locale nel browser: `urme.gear` (le spunte dell'elenco dell'attrezzatura) e `urme.sky` (due preferenze della mappa del cielo). Non usa `sessionStorage`, IndexedDB né cookie; puoi cancellare i dati da «Transparență».
- **Rete:** non effettua alcuna richiesta di rete (niente `fetch`, script, font, immagini o mappe esterne). La CSP nella pagina blocca le connessioni esterne. L'unico link esterno è `tabara.asfan.online`, che si apre solo se ci clicchi.
- **Permessi:** non richiede alcun permesso (non usa geolocalizzazione, fotocamera o microfono). L'app non traccia la tua posizione.
- Non ci sono account, telemetria o analisi del traffico.

## Limiti e avvertenze

- Guida informativa, **non ufficiale**; non garantisce che il sentiero sia segnalato, aperto o percorribile e non sostituisce la carta topografica, la guida locale o il Salvamont (soccorso alpino). In caso di emergenza: **112**.
- Mappa schematica; le distanze, le durate e le altitudini (~500–650 m) sono indicative e non sono state misurate con GPS dall'autore.
- Le piante medicinali sono presentate secondo la tradizione popolare, a scopo educativo; **non costituiscono un consiglio medico**. Non consumare piante o funghi che non sai identificare con certezza; per qualsiasi uso terapeutico chiedi il parere di un medico o di un farmacista.
- La zona tra Colți e Aluniș comprende un'area naturale protetta; al suo interno l'estrazione di ambra o fossili è vietata.
- Alcuni dati storici (gli anni della chiesa, le dimensioni, la miniera d'ambra, la donazione del 1578) provengono dalla tradizione o da fonti locali e differiscono tra le fonti; nel testo sono contrassegnati come non verificati.
- I recapiti, l'orario e le tariffe dell'organizzatore (Centrul de Artă Aluniș) sono quelli da lui pubblicati e possono essere superati. La guida non è realizzata dall'organizzatore.
- La sezione sul campo ASFAN riflette la prospettiva degli organizzatori; i fenomeni aerospaziali non identificati non hanno una spiegazione scientifica confermata.

## Esecuzione in locale / offline

Scarica `index.html` e aprilo in un browser; funziona senza internet.

## Cronologia / Changelog

### 14 ottobre 2026 (v1.1.0)
- Novità: mappa del cielo con effemeridi locali, elenco dell'attrezzatura salvato, scheda da campo stampata con QR, finestra «Transparență» (fff-kit: core, label, bundle, qr, ephem, ephem-stars); `tests/fff-r8.test.mjs`. CSP: hash dello script ricalcolato, senza altre modifiche.

### 12 ottobre 2026 (v1.0.0)
- 1.0.0 — 2026-10-12: la versione e la data dell'ultimo aggiornamento sono mostrate nell'app

### 11 ottobre 2026 (terza voce)
- Riassunto in inglese (sicurezza, dati di base, attrezzatura) per i visitatori che non leggono il rumeno; axe 0 violazioni con la sezione aperta, in tema chiaro e scuro, a 1280 e 360 px.

### 11 ottobre 2026 (seconda voce)
- Pianificatore della giornata (alba/tramonto/crepuscolo civile, partenza più tardiva, margine rispetto al tramonto) e pulsante «Copiază ce îmi mai trebuie» per l'elenco dell'attrezzatura.
- Corretto il testo di riserva «0 din 7 pregătite» (0 su 7 pronti) (l'elenco ha 9 elementi).

### 11 ottobre 2026
- L'orario e la tariffa dell'organizzatore (Centrul de Artă Aluniș) riportano ora, nell'app, l'avviso che non è stato possibile riverificarli l'11 ottobre 2026 e che la stagione indicata (fino al 1° ottobre) è terminata.
- Verifica: axe 0 violazioni, nessun overflow orizzontale a 360 px.

## Licenza

MIT — vedi il file `LICENSE`.

## Autore

Alexio — Alexandru-Ionuț Chiuță, contatto: alexio@trom.tf

## English summary

URME is a single-file, offline Romanian-language hiking guide for a ~11 km circular route near Aluniș and Colți (Buzău Mountains, Romania): forest, medicinal plants, amber, fossils and the rock-cut church of Aluniș. It is informational and unofficial, has a prominent safety notice, uses a schematic SVG map (not for navigation), no GPS and makes no network requests; since 1.1.0 it stores only the equipment checklist ticks and two sky-map preferences in localStorage. It includes a local daylight planner (sunrise/sunset for the Colți area) and a copy-missing-gear button. Licensed under MIT.

New in 1.1.0: an offline sky chart for the Colți–Aluniș area (stars to magnitude 5, constellation figures, Sun, Moon with phase, planets Mercury–Saturn; local ephemerides), a persistent equipment checklist, a one-page printable field sheet with a QR code to the published guide, and the "Transparency" dialog. Romanian-only UI; not a navigation tool.
