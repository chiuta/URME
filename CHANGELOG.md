# Jurnal de modificări — URME

Format: [SemVer](https://semver.org/lang/ro/) MAJOR.MINOR.PATCH.

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
