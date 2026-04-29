# Sanity-Studio — Hotel zur Post Kiefersfelden

> Hier pflegen Sie alle Inhalte Ihrer Website: Zimmer, Speisekarten,
> Angebote, Bilder, Kontaktdaten. Das Studio ist Ihre digitale „Pinnwand".
> Was Sie hier ändern, erscheint kurze Zeit später automatisch auf der
> Website — Sie müssen nichts „veröffentlichen" oder „freigeben" lassen.

---

## Inhaltsverzeichnis

1. [Wie komme ich ins Studio?](#1-wie-komme-ich-ins-studio)
2. [Die wichtigste Aufgabe: Speisekarte für morgen anlegen](#2-die-wichtigste-aufgabe-speisekarte-für-morgen-anlegen)
3. [Bilder hochladen — was Sie wissen sollten](#3-bilder-hochladen--was-sie-wissen-sollten)
4. [Was finde ich wo? Studio-Übersicht](#4-was-finde-ich-wo-studio-übersicht)
5. [Häufige Aufgaben (Cheat-Sheet)](#5-häufige-aufgaben-cheat-sheet)
6. [Hilfe & Kontakt](#6-hilfe--kontakt)
7. [(Für Technik) Lokale Entwicklung](#7-für-technik-lokale-entwicklung)

---

## 1. Wie komme ich ins Studio?

**Sie brauchen keine Software zu installieren.** Das Studio läuft im Browser.

1. Öffnen Sie Ihren Browser (Chrome, Edge, Safari, Firefox).
2. Gehen Sie zu:
   ```
   https://hotel-zur-post.sanity.studio
   ```
   *(Genaue URL teilen wir Ihnen nach dem Deploy mit.)*
3. Beim ersten Mal: **„Mit Google anmelden"** klicken und Ihre E-Mail-Adresse
   wählen, die wir bei Sanity als Editor:in hinterlegt haben.
4. Lesezeichen setzen (`Strg + D` / `Cmd + D`), damit Sie das Studio
   immer schnell finden.

> **Tipp für unterwegs:** Das Studio funktioniert auch auf Tablet und
> Smartphone. Tageskarte mal eben vom Handy aus aktualisieren? Geht.

📷 _\[Screenshot-Platzhalter: Login-Seite\]_

---

## 2. Die wichtigste Aufgabe: Speisekarte für morgen anlegen

So legen Sie eine **Tageskarte** an. Dauert ca. 5 Minuten, sobald Sie
es ein paar Mal gemacht haben.

### 2.1 Wie das Frontend automatisch wählt

Sie müssen nichts „aktivieren" oder „freischalten". Die Website wählt
automatisch die richtige Karte aus, nach dieser Reihenfolge:

1. **Tageskarte** mit dem höchsten Datum, das nicht in der Zukunft liegt.
2. Falls keine Tageskarte gilt: **Wochenkarte** mit gültigem Zeitraum.
3. Falls keine Wochenkarte gilt: **Saisonkarte** (Spargel, Wild, …).
4. Sonst: die **Standardkarte**.

Das heißt: Wenn Sie heute Abend die Tageskarte für morgen anlegen,
erscheint sie morgen früh um Mitternacht automatisch online.

### 2.2 Schritt für Schritt

**Schritt 1 — Speisekarte-Bereich öffnen**
Linke Seitenleiste → 🍽️ **Speisekarte** → **Tageskarten**.

📷 _\[Screenshot-Platzhalter: linke Seitenleiste mit hervorgehobenem Speisekarte-Eintrag\]_

**Schritt 2 — Neue Karte anlegen**
Oben rechts auf den blauen Button **„Neu erstellen"** klicken.

**Schritt 3 — Kopfdaten ausfüllen**

| Feld | Was eintragen |
|---|---|
| **Karten-Typ** | „Tageskarte" |
| **Titel (DE)** | z.B. „Mittagskarte 28.04." |
| **Titel (EN)** | z.B. „Lunch Menu 28 April" *(wenn englische Karte gewünscht)* |
| **Datum** | das Datum, an dem die Karte gilt |
| **Einleitungs-Hinweis** | optional, z.B. „Heute frisch: Steckerlfisch vom Grill" |

📷 _\[Screenshot-Platzhalter: Kopfdaten-Reiter\]_

**Schritt 4 — Sektionen anlegen**

In den Reiter **„Karten-Inhalt"** wechseln. Pro Sektion (Vorspeisen,
Hauptgang, Dessert, …) klicken Sie auf **„Sektion hinzufügen"**:

1. **Sektionsname** — z.B. „Vorspeisen" / „Starters".
2. **Einträge hinzufügen** — pro Gericht eine Zeile:
   - Bei wiederkehrenden Klassikern (Wiener Schnitzel, Kaiserschmarrn):
     **„Wiederverwendbares Gericht"** wählen → aus der Liste auswählen.
   - Bei Tages-Spezialitäten: **„Eintrag (einmalig)"** → direkt eintippen.

📷 _\[Screenshot-Platzhalter: Sektion mit zwei Einträgen, Allergen-Auswahl geöffnet\]_

**Schritt 5 — Bei jedem Eintrag bitte:**

- ✓ **Name** und **Preis** (Pflicht)
- ✓ **Allergene** auswählen (Mehrfachauswahl, Codes 1–14 nach LMIV)
- ✓ wenn passend: **Vegetarisch** / **Vegan** / **Empfehlung des Hauses** ★
- optional: **Beschreibung**, **Bild**

> ⚖️ **Wichtig:** Allergene sind in Deutschland gesetzlich Pflicht (LMIV).
> Bitte gewissenhaft auswählen. Im Zweifel mit Küchenchef abstimmen.

**Schritt 6 — Veröffentlichen**

Im Reiter **„Sichtbarkeit"**:
- Häkchen bei **„Veröffentlicht?"** setzen.
- Dann unten rechts auf den grünen Button **„Veröffentlichen"** klicken.

✅ Fertig. Die Karte ist online — entweder sofort (wenn Datum heute ist)
oder automatisch ab dem eingestellten Datum.

### 2.3 Karte für morgen vorbereiten — Tipp

Sie können die Karte ruhig schon abends erstellen. Solange das Häkchen
bei „Veröffentlicht?" gesetzt ist und das Datum auf morgen steht,
übernimmt die Website den Wechsel pünktlich.

### 2.4 Karte mit Vorlage als Wochenkarte

Wenn Sie die Karte z.B. eine ganze Woche gleich lassen wollen:
- **Karten-Typ** auf **„Wochenkarte"** umstellen.
- **„Gültig ab"** und **„Gültig bis"** eintragen.

---

## 3. Bilder hochladen — was Sie wissen sollten

### 3.1 Empfohlene Mindestauflösung

| Verwendung | Mindestbreite | Empfehlung |
|---|---|---|
| Hero-Bild (Startseite, Zimmer-Header) | 1.600 px | 2.400 px |
| Galerie-Bild | 1.200 px | 1.600 px |
| Bild auf Speisekarte | 800 px | 1.200 px |
| Logo (mit transparentem Hintergrund) | 400 px | SVG oder 800 px PNG |
| Favicon (Browser-Tab-Icon) | 256×256 px | 512×512 px |

**Faustregel:** Lieber zu groß als zu klein. Sanity verkleinert automatisch
für jede Bildschirmgröße — aber vergrößern kann es nicht.

### 3.2 Was Sie pro Bild eintragen sollten

- **Hotspot setzen:** Klicken Sie das Bild an → den Punkt auf das wichtigste
  Motiv ziehen (z.B. Gesicht, Gericht). So wird das Bild auch auf dem Handy
  immer richtig zugeschnitten.
- **Alt-Text (Pflicht):** Was zeigt das Bild? Beispiel: „Doppelzimmer mit
  Blick auf den Wendelstein". Das ist wichtig für sehbehinderte Gäste
  (Vorlese-Programme) und für Google.

📷 _\[Screenshot-Platzhalter: Hotspot-Editor mit Punkt auf dem Hauptmotiv\]_

### 3.3 Wo Bilder gespeichert werden

Alle Bilder landen in der **„Asset-Bibliothek"** und können später erneut
verwendet werden — Sie müssen ein Bild also nur einmal hochladen.

> **Bitte beachten:**
> - Keine Stock-Fotos ohne Lizenz hochladen.
> - Wenn Sie Bilder von Gästen oder Mitarbeiter:innen verwenden,
>   bitte vorher Einverständnis einholen.
> - Format: JPG (Fotos) oder PNG (Logos, Grafiken). Beide funktionieren,
>   keine Sorge.

---

## 4. Was finde ich wo? Studio-Übersicht

In der linken Seitenleiste finden Sie diese Bereiche:

| Symbol | Bereich | Wofür? |
|---|---|---|
| 🍽️ | **Speisekarte** | Tageskarten, Wochenkarten, Standardkarte, wiederverwendbare Gerichte |
| 🛏️ | **Zimmer & Ferienhaus** | alle Zimmertypen mit Preisen und Bildern |
| 🏷️ | **Ausstattung** | Liste der Ausstattungs-Merkmale (WLAN, TV, Föhn …), die in den Zimmern verwendet werden |
| 🎁 | **Angebote / Pauschalen** | Sommer-/Winter-Pakete, Kutschenfahrt-Erlebnis etc. |
| 🥾 | **Aktivitäten / Region** | Wandern, Skifahren, Sehenswürdigkeiten in der Umgebung |
| 📄 | **Seiten** | Impressum, Datenschutz, AGB und sonstige Inhaltsseiten |
| 💬 | **Gästestimmen** | manuell gepflegte Zitate (Ergänzung zum HolidayCheck-Widget) |
| ❓ | **FAQ** | Häufige Fragen, nach Kategorie sortiert |
| ⚙️ | **Site-Einstellungen** | Adresse, Telefon, Logo, Buchungs-Link, Öffnungszeiten Restaurant |
| 🧭 | **Navigation** | Menüpunkte für Header und Footer (Reihenfolge per Drag & Drop) |

📷 _\[Screenshot-Platzhalter: linke Seitenleiste mit allen Bereichen\]_

---

## 5. Häufige Aufgaben (Cheat-Sheet)

### Telefonnummer / Adresse / E-Mail ändern
⚙️ Site-Einstellungen → Reiter **„Kontakt"** → Felder bearbeiten → veröffentlichen.
Die neue Nummer erscheint automatisch im Footer und auf der Kontaktseite.

### Öffnungszeiten Restaurant aktualisieren
⚙️ Site-Einstellungen → Reiter **„Öffnungszeiten"** → pro Wochentag
Öffnungs-/Schließzeit ändern oder „Geschlossen" anhaken.

### Zimmerpreise ändern
🛏️ Zimmer & Ferienhaus → gewünschtes Zimmer öffnen → Reiter **„Preise"** →
Saisonpreis bearbeiten oder neuen hinzufügen → veröffentlichen.

### Neues Pauschal-Angebot anlegen
🎁 Angebote → **„Neu erstellen"** → Saison wählen → Leistungen als Liste
eintragen → Hauptbild hochladen → bei „Veröffentlicht?" Häkchen setzen.

### Reihenfolge im Hauptmenü ändern
🧭 Navigation → Header (Hauptmenü) → Menüpunkte per **Drag & Drop**
(Symbol ☰ links neben dem Eintrag) sortieren → veröffentlichen.

### Bestehendes Bild durch ein neues ersetzen
Beim jeweiligen Bild auf das Bild klicken → **„Bild ersetzen"** → neues
hochladen. Hotspot und Alt-Text bleiben — bitte trotzdem prüfen.

### Eine Tageskarte aus Versehen veröffentlicht?
Karte öffnen → Häkchen bei **„Veröffentlicht?"** entfernen → erneut auf
**„Veröffentlichen"** klicken. Karte verschwindet wieder.

---

## 6. Hilfe & Kontakt

- **Tippfehler oder Frage zur Bedienung:** kontaktieren Sie das Lavik-Media-Team.
- **Inhalt geändert, erscheint aber nicht online:** kann bis zu **60 Sekunden**
  dauern, bis die Website neu lädt. Falls länger: Ctrl + F5 (Browser-Cache).
- **Bild lässt sich nicht hochladen:** Datei-Format prüfen (JPG/PNG) und
  Dateigröße (max. 20 MB pro Bild).
- **Studio-URL vergessen?**
  ```
  https://hotel-zur-post.sanity.studio
  ```

---

## 7. (Für Technik) Lokale Entwicklung

> Dieser Abschnitt ist für Entwickler:innen. Inhaberfamilie kann ihn überspringen.

### Voraussetzungen

- Node.js ≥ 20
- pnpm (oder npm/yarn — pnpm bevorzugt)
- Schreibender API-Token (für Seed-Script)

### Setup

```bash
cd sanity
pnpm install

# .env aus Vorlage kopieren und Werte einsetzen
cp .env.example .env

# Studio lokal starten (http://localhost:3333)
pnpm dev

# Studio auf sanity.io deployen
pnpm deploy

# Initial-Daten einseeden (idempotent)
pnpm seed              # mutiert das Dataset
pnpm seed:dry          # nur Probelauf
```

### Erste Inbetriebnahme — Reihenfolge

1. **Sanity-Projekt erstellen:** `npx sanity@latest init` →
   Projekt-Name „Hotel zur Post", Dataset „production".
2. Projekt-ID aus `sanity.io/manage` in `.env` eintragen.
3. **Schreibenden Token erzeugen:** sanity.io/manage → Project → API → Tokens →
   Name „seed", Permissions „Editor" → in `.env` als `SANITY_API_WRITE_TOKEN`.
4. `pnpm seed:dry` ausführen — sollte keine Fehler werfen.
5. `pnpm seed` ausführen — schreibt Initial-Daten.
6. `pnpm deploy` — Studio ist unter `https://<hostname>.sanity.studio` live.
7. **Editor:innen einladen:** sanity.io/manage → Project → Members.

### Verzeichnisstruktur

```
sanity/
├─ sanity.config.ts          # Studio-Konfiguration (Plugins, Desk-Structure)
├─ sanity.cli.ts             # CLI-Konfiguration (für sanity build/deploy)
├─ schemas/
│  ├─ index.ts               # Schema-Sammlung
│  ├─ documents/             # Document-Typen (siteSettings, room, menu, …)
│  └─ objects/               # Object-Typen (seasonalPrice, menuSection, …)
├─ lib/
│  ├─ deskStructure.ts       # Custom-Sortierung der Seitenleiste
│  ├─ i18n.ts                # Sprach-Konfiguration (DE/EN)
│  ├─ allergens.ts           # LMIV-Codes 1–14 + Zusatzstoffe a–n
│  ├─ client.ts              # Sanity-Client für Frontend & Seed
│  └─ queries.ts             # GROQ-Queries (z.B. ACTIVE_MENU_QUERY)
└─ seed/
   └─ seed.ts                # Initial-Daten-Import
```

### Wichtige Konventionen

- **i18n:** Alle Text-Felder sind `internationalizedArrayString` /
  `internationalizedArrayText`. DE ist Pflicht, EN optional.
- **Slugs:** pro Sprache eigener Slug (`localizedSlug` mit `de`/`en`-Reitern).
  DE-Slug ist Pflicht.
- **Singletons:** `siteSettings` (ID: `siteSettings`) und drei `navigation`-
  Dokumente (IDs: `nav-header`, `nav-footer`, `nav-footer-legal`). Diese IDs
  sind in `lib/deskStructure.ts` hartcodiert — bei Umbenennung dort anpassen.
- **Validierung:** Jedes Schema hat sinnvolle Required-/Min-/Max-Regeln.
  Pflichtfeld-Verstöße verhindern das Veröffentlichen.
- **Aktive Speisekarte:** Logik in `lib/queries.ts → ACTIVE_MENU_QUERY`.
  Frontend reicht `$today` als Parameter mit.

### Open Questions / TODO Phase 3

- [ ] Live-Vorschau-Plugin (`@sanity/preview-url-secret`) einrichten,
      sobald Frontend-Domain steht.
- [ ] HolidayCheck-Score automatisch via Cron (Vercel Edge Function) ziehen.
- [ ] OCR-Migration der bestehenden Speisekarten-JPGs in `menuItem`-Dokumente.
- [ ] Kunden-spezifische Felder ergänzen, sobald die offenen Discovery-Fragen
      (siehe `discovery/SUMMARY.md` § 5) beantwortet sind: Sterne-Klassifizierung,
      tatsächliche Pauschalen, Hund-Konditionen, Restaurant-Ruhetag etc.

---

**Ende der Anleitung.** Bei Rückfragen → Lavik-Media-Team kontaktieren.
