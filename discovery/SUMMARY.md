# Discovery — Hotel zur Post Kiefersfelden

**Stand:** 2026-04-27
**Crawl-Quelle:** `https://www.hotel-kiefersfelden.de/sitemap.xml` (32 URLs)
**Methode:** Höflicher statischer Crawl (User-Agent „Discovery-Bot", 5 s Pause zwischen HTML-Requests, 1 s Pause zwischen Bild-Requests). Sitemap und robots.txt respektiert (`Crawl-Delay: 5`).

---

## 1. Zahlen — Was haben wir gefunden?

| Kategorie | Anzahl |
|---|---|
| Crawlbare Seiten | **32** (16 DE, 14 EN, 2 sprach-neutral) |
| Markdown-Content-Files erstellt | 32 (`/discovery/content/<lang>/<slug>.md`) |
| Eindeutige Bild-Quellen heruntergeladen | **698** Dateien (695 Jimdo + 3 Drittanbieter) |
| Bild-Volumen gesamt | **98,9 MB** |
| Bild-Qualitätsverteilung | gut: 61, mittel: 220, web-komprimiert: 406, thumbnail: 10, unbekannt: 1 |
| Logos / Badges separat | 4 Dateien (HolidayCheck'24/'25/'26, Kachelmann-Logo) |
| Speisekarten-Material | 12 DE-Bildscans + 12 EN-Bildscans + 1 Tageskarte-PDF (200 KB) |

---

## 2. Top 5 inhaltliche Stärken

1. **Klare regionale Verankerung & Familien-DNA.** Die Wirtsleute Christine und Andi Pfeiffer werden namentlich erwähnt, die Tagline *„Wo Bayerische Gastlichkeit zuhause ist."* ist tragfähig. Authentisches bayerisches Vokabular (Schmankerl, Schänke, Stelldichein) ohne Kitsch-Karikatur.
2. **Echte USPs vorhanden.** Eigene Metzgerei, Wild aus heimischer Jagd, Königlich Bayerische Poststation seit 1820, Kutschenfahrt mit dem Hotelwirt selbst, direkte Lage am Bahnhof Kiefersfelden, 80 Betten mit Personenlift und Familienzimmern. Diese Stärken sind im Content vorhanden — sie sind nur **schlecht inszeniert**.
3. **Konkrete Faktenlage.** Zimmerpreise transparent angegeben (74 €/EZ ab 3 Nächte, 120 €/DZ bei 1–2 Nächten, 25 € Halbpensions-Zuschlag, MwSt. + Kurtaxe inklusive). Keine Versteckspiele.
4. **Aktuelle Pflege erkennbar.** Tageskarte-PDF wird datiert ausgetauscht (aktuell `25.04.2026`), HolidayCheck-Badge 2026 bereits eingepflegt. Die Familie hat einen funktionierenden Update-Workflow — den dürfen wir mit Sanity nicht verschlechtern.
5. **Externe Anker funktionieren.** DIRS21 als Buchungs-IBE, Kachelmannwetter für Bergwetter, Google Maps für Anfahrt, Bahn-Reiseauskunft als Anreise-Hilfe — die richtigen Werkzeuge sind angebunden, nur die Einbindung ist heute roh.

---

## 3. Top 5 Schwächen / Lücken

1. **Datenschutz-Compliance ist akut riskant.**
   - Die offizielle Datenschutz-Seite (`/datenschutz/`) zeigt nur einen Platzhalter.
   - Google Analytics 4 läuft ohne valide Opt-in-Einwilligung (`CookieControlSet.setToNormal()` aktiviert Tracking direkt).
   - Google Maps + Kachelmann iframes laden ohne Klick-zum-Laden, Google-Maps-API-Key ist im HTML im Klartext.
   - **Akut-Maßnahme empfohlen vor weiteren Entscheidungen.** (Details in [tech-audit.md](tech-audit.md#5-dsgvo-auffälligkeiten))
2. **URL-Chaos.** Drei DE-Pfad-Stämme (`/start/`, `/start-deutsch/`, `/deutsch/`) und zwei EN-Stämme (`/home-english/`, `/english/`) historisch gewachsen — plus Tippfehler in Slugs (`/feriernhaus/`, `/tagging-hotel-1/`, `/speisenkarte/`). Im Redesign **flache, sauber gepflegte Slugs** + Redirect-Mapping nötig.
3. **Speisekarte als Bild-Scans + PDF.** Weder durchsuchbar noch barrierefrei noch mobile-tauglich noch SEO-relevant noch i18n-fähig. Pflege heute: PDF rendern → 12 Einzelbilder hochladen → sortieren. Die zentrale Anforderung *„Speisekarte tagesaktuell pflegbar"* ist heute formal erfüllt, faktisch aber teuer.
4. **Englische Inhalte sind erkennbar maschinen-übersetzt.** „TAGGING HOTEL", „DAY CARD", „slaughterhouse week", `<html lang="de-DE">` auch auf englischen Seiten, kein `hreflang`. Native-Lektorat fehlt.
5. **Eingebettete Werte werden nicht zentral inszeniert.** Eigene Metzgerei, Hotel-Geschichte ab 1820, Familie Pfeiffer als Gesicht — alles im Fließtext versteckt, nirgends Hero-relevant. Das ist die größte Marketing-Chance des Redesigns.

---

## 4. Empfohlene neue Informationsarchitektur (IA-Vorschlag)

> Sprachen-Routing: DE als Default an `/`, EN unter `/en/…`. Identische Struktur 1:1 → einfache Sanity-Translations & saubere `hreflang`-Tags.
>
> **Hinweis:** Dies ist ein Vorschlag, keine finale IA. Vor der Sanity-Schema-Modellierung mit Kunde klären (siehe offene Fragen unten).

```
/  (Startseite — Hero "Bayerische Gastlichkeit. Seit 1820.")
│
├─ /hotel/                             Hotel-Übersicht (Geschichte, Familie, Haus)
│   ├─ /hotel/zimmer/                  Zimmerkategorien + Preise
│   ├─ /hotel/ferienhaus/              Ferienhaus
│   └─ /hotel/auszeichnungen/          HolidayCheck '24/'25/'26 + weitere
│
├─ /restaurant/                        Restaurant-Übersicht
│   ├─ /restaurant/speisekarte/        Strukturierte Speisekarte (Sanity)
│   ├─ /restaurant/tageskarte/         Tageskarte (Sanity, mit validFrom/validTo)
│   ├─ /restaurant/biergarten/         Biergarten als eigenes Profil
│   └─ /restaurant/metzgerei/          Eigene Metzgerei — USP-Storytelling
│
├─ /erleben/                           Sammelseite
│   ├─ /erleben/sommer/                Sommer-Aktivitäten
│   ├─ /erleben/winter/                Winter-Aktivitäten
│   ├─ /erleben/wandern/               Touren (mit GPX, Schwierigkeit)
│   ├─ /erleben/kutschenfahrt/         Andis Kutschenfahrt — eigene USP-Seite
│   └─ /erleben/region-kaiserreich/    Region-Tipps
│
├─ /angebote/                          Pauschalen (Sommer / Herbst / Wintertraum)
├─ /veranstaltungen/                   Eventkalender (Schlachtfestwoche, Spargelzeit)
├─ /tagungen/                          Tagungs-/Seminar-Räume + DDR
├─ /gruppen/                           Busse / Vereine / Reisegruppen-Pakete
├─ /gutscheine/                        Gutschein-Shop / Anfrage
├─ /faq/                               Hausinformationen / häufige Fragen
│
├─ /anfahrt/                           Anfahrt (Auto, Bahn, Flughafen)
├─ /wetter/                            Bergwetter (Kachelmann, mit Klick-zum-Laden)
├─ /kontakt/                           Kontakt (Telefon prominent, Formular schlank)
│
├─ /agb/                               AGB / Stornobedingungen
├─ /impressum/
└─ /datenschutz/                       Echte DSGVO-konforme Erklärung

/en/…                                  identische Struktur, native lektoriert
```

**Zentrale Designentscheidungen:**

- Speisekarte und Tageskarte werden **strukturierte Sanity-Daten** (siehe [menu/README.md](menu/README.md)) — kein PDF/Bild-Workflow mehr.
- Booking-CTA als **persistentes Sticky-Element** im Header (Button → DIRS21 in neuem Tab; iframe-Widget Phase 2).
- **HolidayCheck-Badges** als Vertrauens-Trustleiste im Footer + eigene Auszeichnungs-Seite (drei Jahre = Multi-Jahr-Auszeichnung visuell stärken).
- **Kutschenfahrt** als eigene URL `/erleben/kutschenfahrt/` — das ist ein einzigartiges, stark differenzierendes Detail.
- **Eigene Metzgerei** als eigene URL `/restaurant/metzgerei/` — Storytelling-Goldader.

---

## 5. Risiken & offene Fragen an den Kunden

### Compliance / Recht (vor Redesign zu klären)

1. Aktuelle Datenschutzerklärung ist Platzhalter — bitte den realen Stand mit Datenschutzbeauftragtem klären.
2. Bilder-Lizenzen prüfen: einige Bilder auf Sommer-Aktivitäts-/Tageskarten-Seiten könnten Stock-Material sein.
3. Cloudflare ist als Auftragsverarbeiter in der Jimdo-Datenschutzerklärung **nicht** genannt — Bestand prüfen.
4. Allergiker-Kennzeichnung (LMIV) für die digitale Speisekarte — wer pflegt das?

### Business / Strategie

5. Channel-Manager: Geht alles über DIRS21? Wer pflegt Verfügbarkeiten/Preise?
6. **Ferienhaus** — über DIRS21 buchbar oder nur Anfrage / Airbnb extern?
7. **Pauschalen** Sommer/Herbst/Wintertraum: Welche Inhalte tatsächlich? (Aktuell nur als Form-Felder vorhanden, Beschreibung fehlt.)
8. Preise: Sind die heute kommunizierten Preise (74 € / 112 € / 145 €) **noch aktuell** oder veraltet?
9. **HolidayCheck-Profil-URL** — sollen die Badges auf das echte Profil verlinken?
10. **Wetter-Anbieter:** Kachelmann-Lizenz aktiv? Alternative DWD/Open-Meteo akzeptabel?

### Inhaltlich

11. Schließtage/Ruhetage des Restaurants?
12. Hund/Haustiere? Mit Aufpreis, mit Ausnahmen?
13. E-Auto-Ladesäulen?
14. Sterne-Klassifizierung (DEHOGA)?
15. Mitarbeiter:innen-Namen für Team-Sektion?
16. Hotelgeschichte (Familienbiographie ab 1820 — gibt es alte Fotos / Dokumente)?
17. Weitere Auszeichnungen jenseits HolidayCheck (Bayern Tourismus, Gastrokritiker, Slow Food etc.)?
18. **Kutschenfahrt-Saison & Buchungsmodus** — wann findet sie statt, wie reservieren?

### Technik / Migration

19. Domain bleibt `hotel-kiefersfelden.de`?
20. Wer übernimmt das **301-Redirect-Mapping** (alte Slugs → neue) — Vercel-Edge oder Cloudflare?
21. Wer **migriert die Speisekarte** initial in strukturierte Sanity-Daten? (Einmalige OCR + manuelle Korrektur, ~2–3 Tage Aufwand.)
22. Welche **Editor:innen** in der Familie / im Team werden Sanity bedienen? Schulungs-Bedarf?
23. Hosting: Vercel-Projekt vom Kunden oder von uns? DNS-Hoheit?

---

## 6. Was wo liegt (Verzeichnis-Index)

```
discovery/
├─ SUMMARY.md                Diese Datei
├─ sitemap.md                Baum-förmige Sitemap mit Zweck-Annotation
├─ tech-audit.md             Tech-Stack, Performance, SEO, DSGVO, IBE-Migration
├─ voice-analysis.md         Sprache, Tonalität, Begriffs-Glossar, Vorschläge
├─ gaps.md                   Inhaltliche Lücken (Gutscheine, Events, FAQ, …)
│
├─ content/
│   ├─ de/  (16 .md Dateien)   pro Seite: H-Hierarchie, Volltext, Bilder, Links
│   ├─ en/  (14 .md Dateien)
│   └─ shared/  (Impressum, Datenschutz)
│
├─ assets/
│   ├─ images/                698 Original-Bilder + manifest.json (mit Zweck/Qualität/Größe)
│   ├─ logos/                 HolidayCheck-Badges 2024–2026 + Kachelmann-Logo
│   └─ icons/                 Jimdo-Icons (PDF-Symbol etc.)
│
├─ menu/
│   ├─ README.md              Speisekarte-Bestand, Empfehlung Sanity-Schema
│   ├─ speisenkarte_de/       12 Bildscans der DE-Speisekarte
│   ├─ menu_en/               12 Bildscans der EN-Speisekarte
│   ├─ tageskarte_spezialitaeten/Tageskarte-2026-04-25.pdf
│   └─ inventory.json
│
└─ raw-html/                  32 Roh-HTML-Dateien + parser-Scripts (zur Reproduzierbarkeit)
    ├─ scripts/parse.py
    ├─ scripts/dedupe_images.py
    ├─ scripts/download_images.py
    ├─ scripts/write_content.py
    ├─ scripts/extract_menu.py
    ├─ url-list.txt
    ├─ parsed-pages.json
    ├─ parsed-images.json
    ├─ unique-images.json
    └─ download-errors.json
```

---

## 7. Phase-Status

✅ **Discovery abgeschlossen** — Schritte 1–7 des Briefings sind erfüllt.

Nächste Schritte (auf Kunden-Go):

- Kunde reviewt diese Discovery, beantwortet die offenen Fragen oben.
- Aus Antworten + IA-Vorschlag → finales **Sanity-Schema-Design** + **Sitemap-Mapping** (alt → neu).
- Erst danach: Implementations-Phase (Next.js-Setup, Theme, erstes Sanity-Schema deployment).

**Wir warten auf das Go.**
