# URME — Aluniș–Colți túravezető (Buzăui-hegység)

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · **Magyar**

**Verzió:** 1.2.0 · **Utolsó frissítés:** 2026-10-19

A felület nyelvei: **Română, English, Français, Italiano, Español, Português (PT), Deutsch, Magyar**

Offline útmutató egyetlen HTML-fájlban egy körtúrához, amely az Aluniș Retreat-től indul: erdő, gyógynövények, borostyán, kövületek és az aluniși sziklaegyüttes. Tájékoztató jellegű és nem hivatalos.

**Online alkalmazás:** https://chiuta.github.io/URME/

![Képernyőkép](screenshot.png)

## Mi ez

Az URME („Egy nap a hegy rétegeiben”) olvasnivaló útmutató, nem navigációs alkalmazás. Egy körülbelül 11 km-es (becslés, GPS-szel nem mért) és 5–6 órás kört ír le tematikus megállókkal: az erdő és lakói, gyógynövények, a colți borostyán, kövületek és domborzat, az aluniși Sziklatemplom, valamint egy rész az éjszakai égboltról. Az oldal biztonsági kerettel kezdődik, és a „Practic” (Gyakorlati tudnivalók) résszel zárul (összefoglaló, a szervező által közzétett elérhetőségek, források).

## Funkciók

A kódban ellenőrizve:
- Látható „Siguranță în munte” (Biztonság a hegyekben) keret: időjárás, felszerelés, 112, a jelzés/ösvényállapot garanciájának hiánya, a térkép és a GPS korlátai.
- A kör saját sematikus SVG-térképe (külső térképcsempék nélkül), jelmagyarázattal; keskeny képernyőn oldalirányban görgethető.
- Összecsukható szakasz: „In English — safety and essentials for visitors” (a biztonsági keret alatt, `lang="en"`): a „Siguranță în munte” keret, az alapadatok (távolság, időtartam, nehézség, évszak) és a „Ce iei cu tine” (Mit vigyél magaddal) lista hű fordítása, új információ nélkül; az oldal többi része román marad.
- Felszerelési lista jelölőnégyzetekkel és számlálóval („9-ből X kész”); a jelölések mostantól megmaradnak a böngészőben (lásd „Újdonságok”). A „Copiază ce îmi mai trebuie” (Másold, amire még szükségem van) gomb csak a be nem jelölt elemeket másolja a vágólapra.
- Napi tervező („Pornire” szakasz): egy dátumhoz és indulási időponthoz helyben kiszámítja a napkeltét, a napnyugtát és a polgári szürkületet (Colți környéke, kb. 45,38° É, 26,40° K, a Wikipédia szerint, 2026. október 11-én elérve), romániai idő szerint (a nyári/téli időszámítás váltásával), a legkésőbbi ajánlott indulást (6 óra útvonal + 1 óra tartalék), valamint a napnyugtától való távolságot az útmutató 5–6 órás becsléséhez; figyelmeztet, ha a visszaérkezés napnyugta után lenne. Egyszerűsített csillagászati algoritmus, 2026. október 11-én egy nyilvános Buzău-számológéppel összevetve ellenőrizve (néhány perces eltérések, a helyszínnel magyarázhatók); a domborzatot nem veszi figyelembe.
- Navigáció szakaszonként, az aktuális szakasz kiemelésével; nappal/éjszaka kapcsoló (megnyitáskor a rendszerbeállítást követi); nyomtatási stílus.
- Összecsukható szakaszok (a bánya története, „Alte urme din jur” (További nyomok a környéken), „De ce se numește URME” (Miért hívják URME-nek)).

## Újdonságok (1.1.0)

- **Égboltkép** („Noaptea” (Az éjszaka) szakasz): kiválasztod a dátumot és az időt (romániai idő, a nyári/téli időszámítás váltásával), és az alkalmazás megrajzolja a Colți–Aluniș környék feletti égboltot (kb. 45,38° É, 26,40° K): csillagok 5-ös fényrendig (1627 a Hipparcos-katalógusból), a csillagképek alakzatai és román nevei, a Nap, a Hold (a fázis megrajzolásával) és a Merkúrtól a Szaturnuszig terjedő bolygók. A térkép alatt táblázat jelenik meg az égitestek magasságával és azimutjával, a Hold fázisával, kelésével és nyugvásával, valamint egy „sötét égbolt” jelzéssel (a Nap −18° alatt és a Hold a horizont alatt). A számítás helyben történik, az `fff-kit` efemerisziadataival (mért hibák: a Nap, a Hold és a bolygók esetében 3″ alatt a JPL DE421/423-hoz képest; lásd `fff-kit/docs/ephem.md`).
  - **Korlátok:** nem rajzolja meg a Tejutat, a felhőket, a fényszennyezést és a domborzatot (a hegy megemeli a valódi horizontot); hiányoznak az 5-ös fényrendnél halványabb csillagok, valamint az Uránusz és a Neptunusz (szabad szemmel nem láthatók). A térkép tervezéshez való, nem biztonsági célra.
- **A felszerelési lista megmarad** a látogatások között (`localStorage`, kulcs: `urme.gear`), akárcsak az égboltkép „Figuri” (Alakzatok) és „Nume” (Nevek) jelölései (`urme.sky`). Az „Transparență” (Átláthatóság) ablakból `.fff.json` biztonsági mentést készíthetsz (nyomd meg a verziót a láblécben).
- **Kinyomtatott terepi lap** („Pornire” szakasz, „Tipărește fișa de teren” (Terepi lap nyomtatása) gomb): egy oldal a biztonsággal, a 112-vel, a tervező fényidőpontjaival, a felszerelési listával a te jelöléseiddel, és egy QR-kóddal (helyben előállítva) a közzétett útmutatóra. JavaScript vagy a QR-modul nélkül a lap hiányzik / kód nélkül jelenik meg.
- **Átláthatóság** (a verzió megnyomásával a láblécben): hálózat (0 külső kérés), tárolt kulcsok, fájl SHA-256 értékkel.

A felület 8 nyelvű (RO, EN, FR, IT, ES, PT, DE, HU); az útmutató hosszú szövege románul marad, a romántól eltérő fordítások pedig gépiek, és anyanyelvi beszélők nem ellenőrizték őket.

## Az „fff-kit” készlet

Az `index.html`-be illesztett modulok: `core`, `label`, `bundle`, `qr`, `ephem`, `ephem-stars` (összesen kb. 455 kB az útmutatón felül). Nélkülük az útmutató teljes mértékben működőképes marad (tesztelve): az égboltkép nem jelenik meg. A csillagkatalógus adatai és licencei: `fff-kit/THIRD-PARTY.md` (Hipparcos/ESA, d3-celestial BSD-3-Clause, hipparcos-catalog MIT). Az `app.json` leírja a hálózatot, az engedélyeket és az SHA-256 értéket.

## Tesztek

`node tests/fff-r8.test.mjs` (Playwright, letiltott hálózat; 69 ellenőrzés): a telihold 2026. október 26-án és az újhold 2027. augusztus 2-án, a Nap a tervező napnyugtájakor (független NOAA-algoritmus) négy dátumon, a Sarkcsillag magassága ≈ szélességi fok, a nyári/téli időzóna, a jelölések tartóssága, `.fff.json` csomag, a lap és a nyomtatási mód (egyoldalas PDF), axe-core 0 szabálysértés (világos és sötét téma, 360 px, párbeszédablak), a készlet nélkül.

## Használati útmutató

1. Olvasd el a „Siguranță în munte” keretet, mielőtt megtervezed a túrát.
2. Nézd át a „Pornire” részt (mit vigyél, szabályok, évszakok), és jelöld be a felszerelési listát.
3. A megállók sorrendjéhez nézd meg a „Hartă” (Térkép) részt; ne használd navigációra.
4. Olvasd el az állomásokat (Plante, Chihlimbar, Fosile, Aluniș, Noaptea) tetszőleges sorrendben a navigációs sávból.
5. A „Practic” részben megtalálod az összefoglalót és a szervező által közzétett elérhetőségeket (ellenőrizd őket közvetlenül).
6. Kinyomtathatod az oldalt; a nappal/éjszaka kapcsoló a jobb felső sarokban van.

## Adatvédelem és hálózat

- **Tárolás:** kizárólag `localStorage`, helyben a böngészőben: `urme.gear` (a felszerelési lista jelölései) és `urme.sky` (az égboltkép két beállítása). Nem használ `sessionStorage`-ot, IndexedDB-t vagy sütiket; az adatokat az „Transparență” ablakból törölheted.
- **Hálózat:** semmilyen hálózati kérést nem indít (nincs `fetch`, külső szkript, betűtípus, kép vagy térkép). Az oldal CSP-je blokkolja a külső kapcsolatokat. Az egyetlen külső hivatkozás a `tabara.asfan.online`, amely csak akkor nyílik meg, ha rákattintasz.
- **Engedélyek:** semmilyen engedélyt nem kér (nem használ helymeghatározást, kamerát vagy mikrofont). Az alkalmazás nem követi a helyzetedet.
- Nincs fiók, telemetria vagy forgalomelemzés.

## Korlátok és figyelmeztetések

- Tájékoztató jellegű, **nem hivatalos** útmutató; nem garantálja, hogy az ösvény jelzett, nyitott vagy járható, és nem helyettesíti a topográfiai térképet, a helyi vezetőt vagy a Salvamontot (hegyimentők). Vészhelyzetben: **112**.
- Sematikus térkép; a távolságok, időtartamok és magasságok (~500–650 m) tájékoztató jellegűek, és a szerző nem mérte meg őket GPS-szel.
- A gyógynövények a népi hagyomány alapján, oktatási céllal szerepelnek; **nem orvosi tanácsok**. Ne fogyassz olyan növényt vagy gombát, amelyet nem tudsz biztosan azonosítani; bármilyen terápiás felhasználás előtt kérj véleményt orvostól vagy gyógyszerésztől.
- A Colți és Aluniș közötti terület védett természeti területet foglal magában; ennek belsejében tilos a borostyán vagy a kövületek kinyerése.
- Egyes történeti adatok (a templom évszámai, méretek, a borostyánbánya, az 1578-as adomány) a hagyományból vagy helyi forrásokból származnak, és a források között eltérnek; a szövegben nem ellenőrzöttként vannak jelölve.
- A szervező (Centrul de Artă Aluniș) elérhetőségei, nyitva tartása és díjai az általa közzétettek, és elavultak lehetnek. Az útmutatót nem a szervező készítette.
- Az ASFAN-tábor szakasza a szervezők nézőpontját tükrözi; az azonosítatlan légi és űrjelenségeknek nincs megerősített tudományos magyarázatuk.

## Helyi / offline futtatás

Töltsd le az `index.html` fájlt, és nyisd meg egy böngészőben; internet nélkül is működik.

## Előzmények / Changelog

### 2026. október 14. (v1.1.0)
- Új: égboltkép helyi efemeriszekkel, mentett felszerelési lista, kinyomtatott terepi lap QR-kóddal, „Transparență” ablak (fff-kit: core, label, bundle, qr, ephem, ephem-stars); `tests/fff-r8.test.mjs`. CSP: a szkript hash-e újraszámolva, egyéb változtatás nélkül.

### 2026. október 12. (v1.0.0)
- 1.0.0 — 2026-10-12: a verzió és az utolsó frissítés dátuma megjelenik az alkalmazásban

### 2026. október 11. (harmadik bejegyzés)
- Angol összefoglaló (biztonság, alapadatok, felszerelés) a románul nem olvasó látogatóknak; axe 0 szabálysértés megnyitott szakasszal, világos és sötét témában, 1280 és 360 px-en.

### 2026. október 11. (második bejegyzés)
- Napi tervező (napkelte/napnyugta/polgári szürkület, legkésőbbi indulás, napnyugtától való távolság) és „Copiază ce îmi mai trebuie” gomb a felszerelési listához.
- Javítva a tartalék szöveg: „0 din 7 pregătite” (0/7 kész) (a lista 9 elemből áll).

### 2026. október 11.
- A szervező (Centrul de Artă Aluniș) nyitva tartása és díja most az alkalmazásban azt a megjegyzést viseli, hogy 2026. október 11-én nem lehetett újra ellenőrizni őket, és hogy a megjelölt szezon (október 1-ig) véget ért.
- Ellenőrzés: axe 0 szabálysértés, nincs vízszintes túlcsordulás 360 px-en.

## Licenc

MIT — lásd a `LICENSE` fájlt.

## Szerző

Alexio — Alexandru-Ionuț Chiuță, elérhetőség: alexio@trom.tf

## English summary

URME is a single-file, offline Romanian-language hiking guide for a ~11 km circular route near Aluniș and Colți (Buzău Mountains, Romania): forest, medicinal plants, amber, fossils and the rock-cut church of Aluniș. It is informational and unofficial, has a prominent safety notice, uses a schematic SVG map (not for navigation), no GPS and makes no network requests; since 1.1.0 it stores only the equipment checklist ticks and two sky-map preferences in localStorage. It includes a local daylight planner (sunrise/sunset for the Colți area) and a copy-missing-gear button. Licensed under MIT.

New in 1.1.0: an offline sky chart for the Colți–Aluniș area (stars to magnitude 5, constellation figures, Sun, Moon with phase, planets Mercury–Saturn; local ephemerides), a persistent equipment checklist, a one-page printable field sheet with a QR code to the published guide, and the "Transparency" dialog. Romanian-only UI; not a navigation tool.
