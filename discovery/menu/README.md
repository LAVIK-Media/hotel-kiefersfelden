# Speisekarte / Menu — Bestandsaufnahme

**Stand:** 2026-04-27
**Quelle:** Bestandssite hotel-kiefersfelden.de (Jimdo Creator)

## Übersicht der vorgefundenen Menü-Dokumente

| Bereich | Format | Anzahl Dateien | Quelle (URL) |
|---|---|---|---|
| Speisenkarte (DE) | JPG-Scans, 905×1280 px (DIN A4-Verhältnis) | 12 Seiten | `/start-deutsch/gut-essen/speisenkarte/` |
| Menu (EN) | JPG-Scans, 1240×1754 px (DIN A4-Verhältnis) | 12 Seiten | `/english/eat-well/menu/` |
| Tageskarte & Spezialitäten | PDF | 1 Datei (`Tageskarte 25.04.2026.pdf`, 200 KB) | `/start-deutsch/gut-essen/tageskarte-spezialit%C3%A4ten/` (Download-Link) |

**Format heute:** Beide Speisekarten-Versionen (DE/EN) liegen als **gerasterte Bild-Scans** auf der Site (jede Menüseite ist ein einzelnes JPG, in einer Galerie-Komponente untereinander angeordnet). Die Tageskarte ist als **PDF zum Download** angeboten — Dateiname enthält das Datum (`Tageskarte 25.04.2026.pdf`), der Versionierungsparameter `t=1777105812` deutet auf manuelle Aktualisierung Ende April 2026 hin.

## Implikationen für das Redesign

1. **Maschinell unzugänglich:** Bild-Scans sind weder durchsuchbar noch barrierefrei (Screenreader, Allergene/Kennzeichnung gem. LMIV scheitern an Bild-Format), nicht responsive auf Mobile, nicht übersetzbar via i18n.
2. **Keine strukturierten Daten:** Keine Schema.org-`Menu`-Auszeichnung möglich. Google Rich Results für Restaurant-Menüs entfallen.
3. **Pflege-Aufwand heute:** Speisekarte-Änderungen erfordern:
   - PDF/Word neu generieren → in einzelne Bilder rendern → 12 Bilder einzeln im Jimdo-CMS hochladen → Reihenfolge sortieren.
   - Doppelte Pflege DE/EN.
4. **Tageskarte:** Ein einziges PDF, einmal pro Tag/Woche neu hochzuladen. Aktuell offenbar händisch von der Familie Pfeiffer gepflegt.

## Empfohlene Sanity-Datenmodellierung (Vorschlag — nicht Teil dieser Phase)

Für die zentrale Anforderung *„Speisekarte tagesaktuell pflegbar"* schlage ich folgende Sanity-Schemata vor:

```
menuCategory {
  title (lokalisiert DE/EN)
  order
  type: 'speisekarte' | 'tageskarte' | 'getraenke' | 'spezial'
  validFrom, validTo (für Tageskarte / Saisonkarten)
}

menuItem {
  name (lokalisiert)
  description (lokalisiert)
  price
  category -> menuCategory
  allergens [LMIV-Codes 1–14, A–N]
  tags ['vegetarisch', 'vegan', 'wild', 'regional', ...]
  isOnTageskarte (boolean, schnell ein/auszuschalten)
  validFrom, validTo
  image (optional)
}

dailySpecial {
  date
  description
  items -> menuItem[]
  pdfFallback (optional, falls die Familie weiter PDFs hochladen will)
}
```

**Migration:** Die 12 DE-Bildseiten + 12 EN-Bildseiten müssen einmalig manuell oder via OCR (Tesseract/Azure Document Intelligence) in strukturierte `menuItem`-Einträge übertragen werden. Das ist eine **einmalige Initialdaten-Aufgabe**, kein Tooling-Problem.

## Inhaltliche Beobachtungen zu den vorhandenen Speisekarten

- Die aktuelle Speisekarte enthält laut Meta-Description "Wildspezialitäten aus heimischer Jagd, Hirsch- und Hirschkalbsbraten, Brotzeiten mit Würstel aus eigener Metzgerei" — die **eigene Metzgerei** ist ein starkes Differenzierungsmerkmal, das in der neuen Site prominenter inszeniert werden sollte.
- Die Tageskarte (PDF) trägt im Dateinamen das Datum `25.04.2026`, was darauf hindeutet, dass sie durchaus regelmäßig aktualisiert wird — gut, aber heute nur als PDF, nicht als HTML.
- "Schlachtfestwoche" als saisonale Aktion erwähnt → für das CMS-Modell als Event-Typ einplanen.

## Files in diesem Ordner

- `speisenkarte_de/` — 12 JPG-Seiten der deutschen Speisekarte
- `menu_en/` — 12 JPG-Seiten der englischen Speisekarte
- `tageskarte_spezialitaeten/Tageskarte-2026-04-25.pdf` — aktuelle Tageskarte als PDF
- `inventory.json` — programmatische Bestandsaufnahme aller kopierten Bilder
