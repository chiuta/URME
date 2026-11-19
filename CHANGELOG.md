# Jurnal de modificări — URME

Format: [SemVer](https://semver.org/lang/ro/) MAJOR.MINOR.PATCH.

## 2.4.3 — 2026-11-20

- Metadate: numele aplicației din `app.json` și din `fff-info` era un fragment de cod (un `<title>` dintr-un șablon al scriptului, luat în locul titlului paginii); acum este titlul real (constatat la scanarea tuturor fișierelor app.json din depozite, 19 noiembrie 2026; kit fff 1.8.1 corectează citirea titlului)
- fff-kit 1.8.1: când `localStorage`/`sessionStorage` aruncă sau lipsesc (cookie-uri și date de site blocate, WebView fără stocare, `<iframe sandbox>`), kitul pune în loc o stocare în memorie, iar pagina pornește în loc să se oprească; datele nu se păstrează după închiderea paginii
- fff-kit 1.8.1: ghidajul care mărește controalele mici la 44 px măsoară acum și lățimea corpului paginii și a părintelui, deci un rând de butoane nu mai poate ieși din ecran (grupul rămâne neatins când mărirea l-ar depăși)

## 2.4.2 — 2026-11-17

- Compatibilitate cu browsere mai vechi (Chrome/Edge 55+, Firefox 52+, Safari 10.1+/iOS 10.3+): kitul 1.8.0 aduce stratul de compatibilitate (rezerve pentru API-urile care lipsesc în motoarele vechi), iar sintaxa JavaScript mai nouă decât ES2017 a fost înlocuită cu forme echivalente acolo unde exista; expresiile regulate noi și `import()` trec prin rezerve. Fără modificări de funcționalitate intenționate. Verificat cu parser ES2017 și într-un motor vechi simulat, nu pe dispozitive reale.

## 2.4.1 — 2026-11-15

- Nou: butoane de distribuire pe rețele sociale (vertical, pe marginea din stânga; fără scripturi externe, doar linkuri deschise la clic); bara de zoom cu lupă și „potrivire ecran” revine pe marginea din dreapta, centrată pe verticală; corectat afișarea suprapusă la zoom mare (panourile cu înălțimi în vh/vw nu mai ies din ecran).

## 2.4.0 — 2026-11-15

- Nou: accesibilitate pe toate ecranele — butonul „Aa” (mărimea textului, contrast ridicat, fără animații, text lizibil, linkuri subliniate, citire cu voce), săgeata „Înapoi sus” și „Sari la conținut”; fereastra se potrivește mereu ecranului; zoom-ul cu lupă și „potrivire ecran” stau acum pe marginea din stânga (fff-kit 1.6.0).

## 2.3.9 — 2026-11-15

- Nou: texturi fractale hiper-detaliate (fff-texturi 1.1.2) — fundalul și suprafețele mari (carduri, panouri, antete, butoane; filele și dialogurile ascunse la încărcare, când se deschid) primesc un material generat local (WebGL2, fără rețea și fără imagini), care se repetă fără cusătură; culorile aplicației rămân ale ei. Se oprește din dialogul „Transparență” sau cu `?notex=1`.

## 2.3.4 — 2026-11-08

Note oneste noi în «Practic», în 8 limbi: data verificării informațiilor (27 oct. 2026 pentru linkuri/Salvamont; program muzeu nereverificat) și lipsa datelor verificate despre variante scurte/accesibile.

## 2.3.1 — 2026-11-03

Etapa 4: jurnal de teren geolocalizat comun (plicul geo/journal, export GeoJSON/GPX), cu atlas în Arhiva fără frontiere

## 2.3.0 — 2026-11-02 (reîmprospătare kit)

- Nou (kit): **Sincronizare între dispozitive** (`FFF.sync`) — în dialogul «Transparență» (clic pe versiune → Copie de siguranță): conectezi două dispozitive direct (WebRTC, cod/QR, fără server și fără cont) și își schimbă datele aplicației; cea mai recentă valoare câștigă, secretele (chei API, parole) nu se trimit, ștergerile nu se propagă. Aplicarea trece prin importul kitului (confirmare, chei permise, rollback).
- Nou (kit): **Istoric local — «mașina timpului»** (`FFF.history`) — instantanee automate ale datelor (IndexedDB, fără secrete), diferență față de starea curentă și restaurare reversibilă; «Șterge datele aplicației» șterge și istoricul.
- Module adăugate: `qr`, `p2p`, `sync`, `history` (+~140 KB). Versiunea aplicației nu se schimbă.

## 2.3.0 — 2026-11-01

- Corectat: adaptorul «Trimite la…» nu mai aruncă eroare când kitul FFF lipsește (gardian pe fiecare bloc; găsit de testul «fără kit» din CI).

Nou: «Trimite la…» (fff-kit, modulul FFF.bridge) — după orice export de fișier (GPX, ICS, CSV, Markdown) apare butonul «Trimite la…» către aplicațiile compatibile, iar importul de fișiere al aplicației primește plicuri .fff.json trimise de ele, cu confirmare înainte de import. Fără rețea, fără telemetrie.

## 2.2.0 — 2026-10-27 (anterior: 2.1.0)

Traseu parcurs în GPX (opțional):
- Casetă „Înregistrează și traseul parcurs (doar în memorie)", oprită implicit; punctele (max. 3000, precizie ≤ 100 m, ≥ 8 m între ele) nu se salvează în localStorage; „Exportă GPX" adaugă `<trk>` cu timp UTC. Fără înregistrare, GPX-ul e neschimbat.
- Testat cu poziții GPS simulate (`tests/track-v22.test.mjs`, 19 verificări), nu pe teren. Texte noi în 8 limbi (fr/it/es/pt/de/hu: traducere automată).
- Hartă oficială Colți–Aluniș: tot nelegată; singura fișă găsită (muntii-nostri.ro) e alt traseu și cu statut neconfirmat.

---

## 2.1.0 — 2026-10-27 (anterior: v2.0.0)

Stare: stabil · Offline: complet

Aplicat după mini-recenzia din 2026-10-27.

### Adăugat / modificat
- **Export GPX** în „Ghid pe teren” (buton nou „Exportă GPX”), construit **numai din datele aplicației: punctele marcate de utilizator** (poziție GPS la cerere): `<wpt>` pentru fiecare punct cu poziție (nume = eticheta ta sau titlul fișei; descriere = fișa, raza, precizia GPS, „vizitat”) + o rută `<rte>` în ordinea marcării; puncte fără poziție omise; fără coordonate predefinite; nu este o urmă `<trk>` și nu garantează un traseu sigur. Fișier GPX 1.1 bine format (parser XML al browserului + `xmllint`), elementele în ordinea schemei; XML scăpat corect; generat local.
- **Hărți și surse oficiale** (secțiunea „Practic”, 8 limbi): 5 linkuri, **verificate pe web la 27 oct. 2026** (pagini deschise și citite): Geoparcul UNESCO Ținutul Buzăului — Hărți și cărți; Consiliul Județean Buzău — Vestigiile rupestre (Aluniș); Salvamont România — harta serviciilor, repartiția teritorială, aplicația Salvamont. Se deschid doar la apăsare (`target=_blank`, `rel="noopener noreferrer"`), CSP neschimbat (0 cereri).
- **Notă de siguranță** (cu dată): lista pe județe din „Repartiție teritorială” nu includea un serviciu Salvamont pentru Buzău (consultat la 27 oct. 2026; presa locală, ian. 2024, spune că nu e înființat): nu presupune o echipă locală, sună 112.
- README (8 limbi): secțiunile „Export GPX din punctele tale” și „Hărți și surse oficiale”; precizarea despre linkurile externe în „Confidențialitate”; „Stare: stabil · Offline: complet”.
- Teste: `tests/gpx-v21.test.mjs` (31 de verificări); versiune 2.1.0.

### Neimplementat
- **Hartă oficială de trasee marcate** pentru zona Colți–Aluniș: **nu am găsit una** care să poată fi legată (paginile oficiale verificate nu conțin o hartă a traseului Colți–Aluniș; pagina „Hărți și cărți” listează un ghid PDF al așezărilor rupestre cu hărți ale unor trasee marcate, dar PDF-ul nu a putut fi citit automat, deci nu am confirmat dacă acoperă Colți–Aluniș și îl menționez doar prin pagină). Pagina https://buzau-county.map2web.eu/ (hartă online a județului, menționată de pagina Consiliului Județean) nu a putut fi deschisă din mediul de lucru, deci nu a fost inclusă. Nu s-au inventat URL-uri.
- GPX: nu exportă o urmă `<trk>` (aplicația nu înregistrează traseul parcurs; ar însemna GPS continuu și date de locație stocate).
- Nu am verificat existența unui serviciu Salvamont/Salvaspeo pentru Buzău dincolo de pagina „Repartiție teritorială” și un articol de presă (Puterea.ro, ian. 2024); formularea din aplicație este prudentă și datată.

## 2.0.0
- Versiunea anterioară (vezi istoricul din README).
