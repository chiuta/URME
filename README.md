# URME — ghid de drumeție Aluniș–Colți (Munții Buzăului)

Ghid offline, într-un singur fișier HTML, pentru o drumeție circulară care pornește de la Aluniș Retreat: pădure, plante de leac, chihlimbar, fosile și Ansamblul Rupestru Aluniș. Informativ și neoficial.

**Live:** https://chiuta.github.io/URME/

**Ultima actualizare:** 11 octombrie 2026

![Captura de ecran](screenshot.png)

## Ce este

URME („O zi în straturile muntelui") este un ghid de citit, nu o aplicație de navigație. Descrie o buclă de aproximativ 11 km (estimare, nemăsurată cu GPS) și 5–6 ore, cu popasuri tematice: pădurea și viețuitoarele ei, plante de leac, chihlimbarul de la Colți, fosile și relief, Biserica din Piatră de la Aluniș și o secțiune despre cerul nopții. Pagina începe cu un chenar de siguranță și se termină cu o secțiune „Practic" (recapitulare, contacte publicate de organizator, surse).

## Funcții

Verificate în cod:
- Chenar vizibil „Siguranță în munte": vreme, echipament, 112, lipsa garanțiilor privind marcajul/starea traseului, limitele hărții și ale GPS-ului.
- Hartă schematică SVG proprie a buclei (fără plăci de hartă externe), cu legendă; pe ecran îngust se derulează lateral.
- Secțiune pliabilă „In English — safety and essentials for visitors” (sub chenarul de siguranță, `lang="en"`): traducerea fidelă a chenarului „Siguranță în munte”, a datelor de bază (distanță, durată, dificultate, sezon) și a listei „Ce iei cu tine”, fără informații noi; restul paginii rămâne în română.
- Listă de echipament cu bife și contor („X din 9 pregătite"); bifele nu se salvează. Butonul „Copiază ce îmi mai trebuie" copiază în clipboard doar elementele nebifate.
- Planificator de zi (secțiunea „Pornire"): pentru o dată și o oră de plecare calculează local răsăritul, apusul și amurgul civil (zona Colți, aprox. 45,38° N, 26,40° E, după Wikipedia, consultat la 11 octombrie 2026), în ora României (cu trecerea la ora de vară/iarnă), cea mai târzie plecare recomandată (6 h de traseu + 1 h rezervă) și marja față de apus pentru estimarea de 5–6 h din ghid; avertizează dacă revenirea ar fi după apus. Algoritm astronomic simplificat, verificat la 11 octombrie 2026 față de un calculator public pentru Buzău (diferențe de câteva minute, explicabile prin locație); nu ține cont de relief.
- Navigare pe secțiuni cu evidențierea secțiunii curente; comutator zi/noapte (urmărește setarea sistemului la deschidere); stil de tipărire.
- Secțiuni pliabile (istoria minei, „Alte urme din jur", „De ce se numește URME").

## Manual de utilizare

1. Citește chenarul „Siguranță în munte" înainte de a plănui drumeția.
2. Parcurge „Pornire" (ce iei cu tine, reguli, anotimpuri) și bifează lista de echipament.
3. Consultă „Hartă" pentru ordinea popasurilor; nu o folosi pentru navigație.
4. Citește etapele (Plante, Chihlimbar, Fosile, Aluniș, Noaptea) în ordinea dorită, din bara de navigare.
5. În „Practic" găsești recapitularea și datele de contact publicate de organizator (verifică-le direct).
6. Poți tipări pagina; comutatorul zi/noapte e în colțul din dreapta sus.

## Confidențialitate și rețea

- **Stocare:** nu folosește `localStorage`, `sessionStorage`, IndexedDB sau cookie-uri. Nimic nu se salvează.
- **Rețea:** nu face nicio cerere de rețea (fără `fetch`, scripturi, fonturi, imagini sau hărți externe). Politica CSP din pagină blochează conexiunile externe. Singurul link extern este `tabara.asfan.online`, care se deschide doar dacă apeși pe el.
- **Permisiuni:** nu cere nicio permisiune (nu folosește geolocalizare, cameră sau microfon). Aplicația nu îți urmărește poziția.
- Nu există cont, telemetrie sau analiză de trafic.

## Limite și avertismente

- Ghid informativ, **neoficial**; nu garantează că poteca este marcată, deschisă sau practicabilă și nu înlocuiește harta topografică, ghidul local sau Salvamontul. În caz de urgență: **112**.
- Hartă schematică; distanțele, duratele și altitudinile (~500–650 m) sunt orientative și nu au fost măsurate cu GPS de către autor.
- Plantele de leac sunt prezentate din tradiția populară, cu rol educativ; **nu sunt sfat medical**. Nu consuma plante sau ciuperci pe care nu le poți identifica sigur; la orice utilizare terapeutică cere părerea unui medic sau farmacist.
- Zona dintre Colți și Aluniș include o arie naturală protejată; în interiorul ei extragerea chihlimbarului sau a fosilelor este interzisă.
- Unele date istorice (anii bisericii, dimensiuni, mina de chihlimbar, donația din 1578) provin din tradiție sau surse locale și diferă între surse; sunt marcate ca neverificate în text.
- Datele de contact, programul și tarifele organizatorului (Centrul de Artă Aluniș) sunt cele publicate de acesta și pot fi învechite. Ghidul nu este realizat de organizator.
- Secțiunea despre tabăra ASFAN reflectă perspectiva organizatorilor; fenomenele aerospațiale neidentificate nu au o explicație științifică confirmată.

## Rulare locală / offline

Descarcă `index.html` și deschide-l în browser; funcționează fără internet.

## Istoric / Changelog

### 11 octombrie 2026 (a treia intrare)
- Rezumat în engleză (siguranță, date de bază, echipament) pentru vizitatori care nu citesc românește; axe 0 violări cu secțiunea deschisă, în temă luminoasă și întunecată, la 1280 și 360 px.

### 11 octombrie 2026 (a doua intrare)
- Planificator de zi (răsărit/apus/amurg civil, cea mai târzie plecare, marja față de apus) și buton „Copiază ce îmi mai trebuie" pentru lista de echipament.
- Corectat textul de rezervă „0 din 7 pregătite" (lista are 9 elemente).

### 11 octombrie 2026
- Programul și tariful organizatorului (Centrul de Artă Aluniș) au acum, în aplicație, mențiunea că nu au putut fi reverificate la 11 octombrie 2026 și că sezonul indicat (până la 1 octombrie) s-a încheiat.
- Verificare: axe 0 violări, fără depășire orizontală la 360 px.

## Licență

Licența nu este încă declarată.

## Autor

Alexio — Alexandru-Ionuț Chiuță, contact: alexio@trom.tf

## English summary

URME is a single-file, offline Romanian-language hiking guide for a ~11 km circular route near Aluniș and Colți (Buzău Mountains, Romania): forest, medicinal plants, amber, fossils and the rock-cut church of Aluniș. It is informational and unofficial, has a prominent safety notice, uses a schematic SVG map (not for navigation), no GPS, no storage and makes no network requests. It includes a local daylight planner (sunrise/sunset for the Colți area) and a copy-missing-gear button. License not yet declared.
