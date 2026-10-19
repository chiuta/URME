# URME — Aluniș–Colți hiking guide (Buzău Mountains)

**English** · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

**Version:** 1.2.0 · **Last updated:** 2026-10-19

Interface languages: **Română, English, Français, Italiano, Español, Português (PT), Deutsch, Magyar**

An offline guide, in a single HTML file, for a circular hike starting from Aluniș Retreat: forest, medicinal plants, amber, fossils and the Aluniș Rock-Cut Complex. Informational and unofficial.

**Live app:** https://chiuta.github.io/URME/

![Screenshot](screenshot.png)

## What it is

URME ("A day in the layers of the mountain") is a guide to read, not a navigation app. It describes a loop of about 11 km (an estimate, not measured with GPS) and 5–6 hours, with thematic stops: the forest and its creatures, medicinal plants, the amber of Colți, fossils and relief, the Rock Church of Aluniș and a section on the night sky. The page begins with a safety box and ends with a "Practic" (Practical) section (recap, contacts published by the organizer, sources).

## Features

Checked in the code:
- Visible "Siguranță în munte" (Mountain safety) box: weather, equipment, 112, no guarantees about trail marking/condition, the limits of the map and of GPS.
- Own schematic SVG map of the loop (no external map tiles), with a legend; on a narrow screen it scrolls sideways.
- Collapsible section "In English — safety and essentials for visitors" (below the safety box, `lang="en"`): a faithful translation of the "Siguranță în munte" box, of the basic data (distance, duration, difficulty, season) and of the "Ce iei cu tine" (What to bring) list, without new information; the rest of the page stays in Romanian.
- Equipment list with check marks and a counter ("X of 9 ready"); the check marks are now kept in the browser (see "New features"). The "Copiază ce îmi mai trebuie" (Copy what I still need) button copies only the unchecked items to the clipboard.
- Day planner (the "Pornire" section): for a date and a departure time it computes locally the sunrise, sunset and civil dusk (Colți area, approx. 45.38° N, 26.40° E, according to Wikipedia, accessed on 11 October 2026), in Romanian time (with the summer/winter time change), the latest recommended departure (6 h of trail + 1 h reserve) and the margin before sunset for the guide's 5–6 h estimate; it warns if the return would be after sunset. A simplified astronomical algorithm, checked on 11 October 2026 against a public calculator for Buzău (differences of a few minutes, explainable by location); it does not take relief into account.
- Navigation by sections with the current section highlighted; day/night toggle (follows the system setting on opening); print style.
- Collapsible sections (history of the mine, "Alte urme din jur" (Other traces nearby), "De ce se numește URME" (Why it is called URME)).

## New features (1.1.0)

- **Sky chart** (the "Noaptea" (Night) section): you choose the date and time (Romanian time, with the summer/winter time change) and the app draws the sky above the Colți–Aluniș area (approx. 45.38° N, 26.40° E): stars down to magnitude 5 (1627 from the Hipparcos catalog), the constellation figures and Romanian names, the Sun, the Moon (with the phase drawn) and the planets Mercury–Saturn. Below the chart a table appears with the altitude and azimuth of the bodies, the Moon's phase, its rising and setting and a "dark sky" indication (Sun below −18° and Moon below the horizon). The computation is done locally, with the ephemerides from `fff-kit` (measured errors: under 3″ for the Sun, Moon and planets against JPL DE421/423; see `fff-kit/docs/ephem.md`).
  - **Limits:** it does not draw the Milky Way, clouds, light pollution or relief (the mountain raises the real horizon); stars fainter than magnitude 5 and the planets Uranus and Neptune (not visible to the naked eye) are missing. The chart is for planning, not for safety.
- **The equipment list is kept** between visits (`localStorage`, key `urme.gear`), as are the "Figuri" (Figures) and "Nume" (Names) check marks of the sky chart (`urme.sky`). You can make a `.fff.json` backup from the "Transparență" (Transparency) window (press the version in the footer).
- **Printed field sheet** (the "Pornire" section, button "Tipărește fișa de teren" (Print the field sheet)): a page with safety, 112, the daylight hours from the planner, the equipment list with your check marks and a QR code (generated locally) to the published guide. Without JavaScript or without the QR module, the sheet is missing / appears without the code.
- **Transparency** (by pressing the version in the footer): network (0 external requests), stored keys, file with SHA-256.

The interface has 8 languages (RO, EN, FR, IT, ES, PT, DE, HU); the long guide text remains in Romanian, and the translations other than Romanian are automatic and not verified by native speakers.

## The "fff-kit" kit

Modules pasted into `index.html`: `core`, `label`, `bundle`, `qr`, `ephem`, `ephem-stars` (about 455 kB in total on top of the guide). Without them the guide remains fully functional (tested): the sky chart does not appear. Data and licenses of the star catalog: `fff-kit/THIRD-PARTY.md` (Hipparcos/ESA, d3-celestial BSD-3-Clause, hipparcos-catalog MIT). `app.json` describes the network, the permissions and the SHA-256.

## Tests

`node tests/fff-r8.test.mjs` (Playwright, network blocked; 69 checks): the full Moon on 26 October 2026 and the new Moon on 2 August 2027, the Sun at sunset in the planner (independent NOAA algorithm) on four dates, Polaris at an altitude ≈ latitude, the summer/winter time zone, persistence of the check marks, `.fff.json` bundle, the sheet and print mode (one-page PDF), axe-core 0 violations (light and dark theme, 360 px, dialog), without the kit.

## User guide

1. Read the "Siguranță în munte" box before planning the hike.
2. Go through "Pornire" (what to bring, rules, seasons) and tick the equipment list.
3. Consult "Hartă" (Map) for the order of the stops; do not use it for navigation.
4. Read the stages (Plante, Chihlimbar, Fosile, Aluniș, Noaptea) in the order you wish, from the navigation bar.
5. In "Practic" you find the recap and the contact details published by the organizer (check them directly).
6. You can print the page; the day/night toggle is in the top right corner.

## Privacy and network

- **Storage:** only `localStorage`, local to the browser: `urme.gear` (the equipment list check marks) and `urme.sky` (two sky chart preferences). It does not use `sessionStorage`, IndexedDB or cookies; you can delete the data from "Transparență".
- **Network:** it makes no network requests (no `fetch`, scripts, fonts, images or external maps). The CSP in the page blocks external connections. The only external link is `tabara.asfan.online`, which opens only if you click it.
- **Permissions:** it requests no permissions (it does not use geolocation, camera or microphone). The app does not track your position.
- There is no account, telemetry or traffic analytics.

## Limits and warnings

- An informational, **unofficial** guide; it does not guarantee that the trail is marked, open or passable and does not replace the topographic map, the local guide or the mountain rescue service (Salvamont). In an emergency: **112**.
- A schematic map; the distances, durations and altitudes (~500–650 m) are indicative and were not measured with GPS by the author.
- Medicinal plants are presented from folk tradition, for educational purposes; **they are not medical advice**. Do not consume plants or mushrooms that you cannot identify with certainty; for any therapeutic use, ask a doctor or pharmacist.
- The area between Colți and Aluniș includes a protected natural area; inside it, extracting amber or fossils is forbidden.
- Some historical data (the years of the church, dimensions, the amber mine, the donation of 1578) come from tradition or local sources and differ between sources; they are marked as unverified in the text.
- The organizer's (Centrul de Artă Aluniș) contact details, schedule and fees are those published by the organizer and may be outdated. The guide is not made by the organizer.
- The section about the ASFAN camp reflects the organizers' perspective; unidentified aerospace phenomena have no confirmed scientific explanation.

## Running locally / offline

Download `index.html` and open it in a browser; it works without internet.

## History / Changelog

### 14 October 2026 (v1.1.0)
- New: sky chart with local ephemerides, saved equipment list, printed field sheet with QR, the "Transparență" window (fff-kit: core, label, bundle, qr, ephem, ephem-stars); `tests/fff-r8.test.mjs`. CSP: the script hash recomputed, no other changes.

### 12 October 2026 (v1.0.0)
- 1.0.0 — 2026-10-12: the version and the date of the last update are shown in the app

### 11 October 2026 (third entry)
- English summary (safety, basic data, equipment) for visitors who do not read Romanian; axe 0 violations with the section open, in light and dark theme, at 1280 and 360 px.

### 11 October 2026 (second entry)
- Day planner (sunrise/sunset/civil dusk, latest departure, margin before sunset) and a "Copiază ce îmi mai trebuie" button for the equipment list.
- Fixed the fallback text "0 din 7 pregătite" (0 of 7 ready) (the list has 9 items).

### 11 October 2026
- The organizer's (Centrul de Artă Aluniș) schedule and fee now carry, in the app, a notice that they could not be rechecked on 11 October 2026 and that the indicated season (until 1 October) has ended.
- Verification: axe 0 violations, no horizontal overflow at 360 px.

## License

MIT — see the `LICENSE` file.

## Author

Alexio — Alexandru-Ionuț Chiuță, contact: alexio@trom.tf

## English summary

URME is a single-file, offline Romanian-language hiking guide for a ~11 km circular route near Aluniș and Colți (Buzău Mountains, Romania): forest, medicinal plants, amber, fossils and the rock-cut church of Aluniș. It is informational and unofficial, has a prominent safety notice, uses a schematic SVG map (not for navigation), no GPS and makes no network requests; since 1.1.0 it stores only the equipment checklist ticks and two sky-map preferences in localStorage. It includes a local daylight planner (sunrise/sunset for the Colți area) and a copy-missing-gear button. Licensed under MIT.

New in 1.1.0: an offline sky chart for the Colți–Aluniș area (stars to magnitude 5, constellation figures, Sun, Moon with phase, planets Mercury–Saturn; local ephemerides), a persistent equipment checklist, a one-page printable field sheet with a QR code to the published guide, and the "Transparency" dialog. Romanian-only UI; not a navigation tool.
