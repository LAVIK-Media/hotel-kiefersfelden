# Technisches Audit — hotel-kiefersfelden.de

**Stand:** 2026-04-27
**Methode:** Statischer Crawl + Header-Inspektion + Quelltext-Analyse aller 32 deklarierten Seiten. Kein Lighthouse / kein WebPageTest in dieser Phase (gehört in eine spätere Performance-Baseline).

---

## 1. Tech-Stack der Bestandssite

| Schicht | Technologie | Belege |
|---|---|---|
| **CMS** | **Jimdo Creator** (Legacy-Version, nicht „Jimdo Dolphin") | `<meta name="generator" content="Jimdo Creator"/>`, `assets.jimstatic.com`, `image.jimcdn.com`, Module mit `cc-m-…`-Klassen, `j-m-…`-Body-Klassen |
| **Frontend-Renderer** | Server-rendered HTML, jQuery `jimdoGen002`, eigenes Modul-Loader-System (`window.regModule`) | `web.js.1ca63f83…js`, `web.css.b42ef3c5…css` |
| **CDN / Static Assets** | Jimdo eigene Subdomains (`u.jimcdn.com`, `assets.jimstatic.com`), Bilder über `image.jimcdn.com` mit URL-basierter Bild-Transformation (Resize + Format) | DNS-Prefetch-Hints im `<head>` |
| **Edge / Reverse Proxy** | **Cloudflare** | Header `Server: cloudflare`, `cf-cache-status`, `__cf_bm`-Cookie, Email-Obfuscation `/cdn-cgi/l/email-protection` |
| **Hosting-Modell** | Mandant innerhalb Jimdo SaaS — eigene Infra-Kontrolle nicht möglich | `x-jimdo-wid: sd8b7c00141af0d4c` |
| **Inhaltliches Daten-Modell** | Keine strukturierte API; Inhalte sind in Jimdo-Modulen flach hinterlegt (Text-Modul, ImageSubtitle-Modul, GoogleMaps-Modul, HtmlCode-Modul, …) | Source-View jeder Seite |
| **Buchungs-IBE** | **DIRS21 v4** (`v4.ibe.dirs21.de/channels/hotel-kiefersfeldende`) — externe Lösung, geöffnet im neuen Tab | `<a href="…" target="_blank">` auf Startseite + auf Zimmer-Seite |
| **Wetter** | **kachelmannwetter.com** Standard-Widget via `<iframe>` (zwei Stationen: 2773300 und 2891175) | `deutsch/fotos/das-wetter-bei-uns` |
| **Karten** | **Google Maps Embed iFrame** mit eingebettetem API-Key | `start-deutsch/anfahrt`, `english/getting-here` |
| **Bewertungen** | **HolidayCheck-Auszeichnungen 2024 / 2025 / 2026** als drei statische **Bild-Badges**, klickbar als Lightbox (kein Live-Widget, keine Punkte/Sterne, keine echte Verlinkung zu HolidayCheck-Profil) | Startseite, Footer-Bereich aller Seiten |
| **Email-Schutz** | Cloudflare-Email-Obfuscation (XOR-codierter Mailto-Link, JS dekodiert auf Client) | `[email protected]`-Platzhalter im HTML, decodiert zu `info@hotel-kiefersfelden.de` |

---

## 2. Performance-Indikatoren (grobe Einschätzung — ohne Lab-Daten)

> ⚠️ **Belastbare Lab-Werte bitte vor dem Redesign separat erheben** (Lighthouse mobile + WebPageTest). Die folgenden Punkte sind reine Source-Code-Heuristiken.

**Negativ:**

- **Cache-Header für HTML:** `Cache-Control: no-cache, no-store, must-revalidate` — jeder HTML-Request geht voll an den Origin (Cloudflare-Cache wird bewusst umgangen, `cf-cache-status: DYNAMIC`). Bei einem Hotel mit ~80 Betten und Sommer-/Winter-Spitzen ist das verschmerzbar; bei einer modernen Statisch-gebauten Seite (Next.js + Vercel ISR) klar besser lösbar.
- **HTML-Größe:** 67 KB – 152 KB pro Seite (durchschnittlich ~91 KB), enthält große inline JSON-Konfigurationsblöcke (`jimdoData`, `bgConfig`) inkl. mehrerer Slideshow-Bild-URLs pro Seite.
- **Drei größere JS-Bundles** synchron oder mit `async` geladen: `web.js`, `at.js`, `cookieControl.js`, `ckies.js`. Dazu `jQuery`-Style API.
- **Bilder:** Hintergrund-Slideshow auf Startseite mit **2000×1500-px-JPGs** (`og:image:width=2000`). Eine OG-Bilddatei ist 933 KB groß (`if3193c2e0__image.jpg`), eine andere 1,2 MB (`i97492eaf4__image.jpg`). Auf Mobile keine WebP/AVIF; Jimdo liefert über `srcset` nur JPG-Resizes. Lazy-Loading uneinheitlich.
- **Eine einzige Speisekarte-Seite enthält 28 Bilder** (12× 905×1280 px Menü-Scans + Navigations-Thumbnails + Hintergrund-Slideshow).
- Die **Tageskarte als PDF** (200 KB) muss vor Anzeige heruntergeladen werden — Mobile schlecht.

**Positiv:**

- HTTP/3 (`alt-svc: h3=":443"`) ist über Cloudflare aktiv.
- HSTS gesetzt (`max-age=604800` — 7 Tage; eher kurz, könnte erhöht werden).
- Kein Render-Blocking Webfont-Chaos — Jimdo lädt `fonts.jimstatic.com` mit `dns-prefetch preconnect`.
- HTML-Pfad ist server-rendered → SEO-Crawler bekommen alle Inhalte ohne JS.

**Geschätzte Performance heute (Mobile):** mittelmäßig. Erwartung Lighthouse Performance Score 50–70, LCP knapp über 3 s — limitiert durch Hintergrund-Slideshow und große JPGs.

---

## 3. Mobile-Optimierung

- `<meta name="viewport" content="width=device-width, initial-scale=1"/>` ✅
- Body-Klasse signalisiert „responsives Jimdo-Template" (`isTemplateResponsive: true`).
- Navigation klappt vermutlich auf einem Mobile-Toggle zusammen (`#jtpl-navigation__checkbox`-Pattern).
- **Aber:** Die Speisekarte-Bilder (905×1280 px DIN-A4) sind auf einem 360-px-Mobile-Viewport unleserlich; Pinch-Zoom ist die einzige Lösung.
- Tageskarte-PDF auf Mobile öffnet einen externen PDF-Viewer.

**Bewertung:** **teilweise mobile-optimiert**. Layout reagiert, aber Inhaltsformate (PDF, A4-Scans) sind nicht mobil-tauglich.

---

## 4. SEO-Basics

| Punkt | Status | Anmerkungen |
|---|---|---|
| `<title>` pro Seite | ✅ vorhanden | Format: „<H1-ähnlich> - Hotel zur Post Kiefersfelden" |
| `meta description` | ✅ vorhanden | Aber **identisch auf vielen Seiten** (z.B. Datenschutz, Impressum nutzen den Hotel-Generic-Text). Manche Seiten (Speisenkarte, Menu) recyceln dieselbe Beschreibung in DE und EN — auf der englischen Seite steht die deutsche Description. |
| OpenGraph / Twitter Card | ✅ vorhanden | `og:locale: de_DE` auf **allen** Seiten — auch auf den englischen → **falsch**. |
| Canonical | ✅ überall gesetzt | korrekt absolut, https |
| `<h1>` pro Seite | ⚠️ teils | Manche Seiten (z.B. Tageskarte, Datenschutz) haben **keinen H1**, nur H2/H3. Andere Seiten (Speisenkarte) starten mit H2. |
| `lang`-Attribut | ⚠️ | `<html lang="de-DE">` auf **allen** Seiten — auch auf englischen Pages → **falsch** für Suchmaschinen und Screenreader. |
| `hreflang`-Tags | ❌ fehlen komplett | Keine Verbindung zwischen DE- und EN-Pendants über `<link rel="alternate" hreflang>`. |
| Robots-Meta | ✅ `index, follow, archive` |
| Sitemap.xml | ✅ unter `/sitemap.xml` (32 URLs gelistet) |
| Robots.txt | ✅ vorhanden, sinnvoll konfiguriert (`Crawl-Delay: 5`, blockt MJ12bot/Ahrefs) |
| Strukturierte Daten (Schema.org) | ❌ **nicht vorhanden** | Kein `Hotel`-, `LodgingBusiness`-, `Restaurant`-, `Menu`-Schema. Großes ungenutztes SEO-Potenzial — gerade bei Restaurant-/Hotel-Suche relevant. |
| Bild-Alt-Texte | ⚠️ inkonsistent | Viele Bilder ohne Alt-Text (besonders Hintergründe, Menü-Scans, Tagesangebots-Banner). Alt-Texte tendieren zu Keyword-Stuffing („Hotel zur Post Kiefersfelden, Zimmer"). |
| `og:image` | ✅ vorhanden, 2000×1500 | Aber `og:url` zeigt auf `http://` (nicht https) — minor. |
| Interne Linkstruktur | ⚠️ schwach | Footer/Hauptnav verlinkt auf alle ~30 Seiten (Mega-Menü-Style); inhaltliche Cross-Links fehlen weitgehend. |

**Bewertung:** Solide Grundlagen (Sitemap, Canonical, Meta), aber im Detail klassische Mängel (`hreflang` fehlt, falsche `lang`-Attribute auf EN, kein Schema.org, viele identische Meta-Beschreibungen). Erwartung: bei Branded Search („Hotel Kiefersfelden") rankt die Site, generische Suchen (z.B. „Restaurant Kiefersfelden Wild") erreichen sie nicht.

---

## 5. DSGVO-Auffälligkeiten

> ⚠️ **Mehrere kritische Befunde.** Eine rechtliche Prüfung durch den Mandanten / dessen Datenschutzbeauftragten ist vor dem Live-Gang der neuen Site dringend zu empfehlen. Diese Befunde sind kein Rechtsrat, sondern technische Beobachtung.

### 5.1 Datenschutzerklärung — leer im sichtbaren Hauptmenü

- Die offizielle Datenschutz-Seite (`/datenschutz/`, im Hauptmenü „DATENSCHUTZ") zeigt nur den Platzhalter:
  > „Die Inhalte der Datenschutzerklärung werden derzeit geprüft. Nach Vollständigkeit der Inhalte werden diese veröffentlicht. Bitte haben Sie einige Tage Geduld."
- Die tatsächliche, vollständige Datenschutzerklärung liegt versteckt unter `/j/privacy` (Jimdo-Standard-Generator) — verlinkt nur durch einen kleinen „Hier Link: DATENSCHUTZERKLÄRUNG" mitten auf der `/datenschutz/`-Seite, **nicht im Footer/Menü**.
- **Risiko:** Pflicht-Information nach Art. 13 DSGVO ist nicht ohne Weiteres auffindbar. Abmahnfähig.

### 5.2 Tracking ohne valide Einwilligung

- **Google Analytics 4** (`G-1DG7YNN4PS`) wird auf **jeder** Seite via `gtag` initialisiert.
- Kein eindeutiger Consent-Banner im DOM beim Erst-Aufruf. Jimdo liefert ein eigenes `cookieControl.js`-Skript, das aber per `window.CookieControlSet.setToNormal()` direkt initialisiert wird — dies setzt vor Einwilligung den Cookie-Mode auf „Normal" und lässt damit Tracking-Cookies typischerweise zu.
- **Risiko:** Verstoß gegen § 25 TDDDG (vormals TTDSG) und Art. 6 DSGVO. Nach Schrems-II/EuGH ist eine echte Opt-In-Lösung für GA verpflichtend. Aktuell wahrscheinlich keine.

### 5.3 Eingebettete Drittanbieter ohne Klick-zum-Laden („two-click-solution")

| Anbieter | Wo | Daten an Drittland | Aktuelle Implementierung |
|---|---|---|---|
| **Google Maps** | `/anfahrt/`, `/getting-here/` | USA | `<iframe src="…/embed/v1/place?…&q=…">` lädt **direkt** beim Seitenaufruf. Eingebetteter API-Key sichtbar im HTML (`AIzaSyASzqnCrYBWXhFtdlXXBg_KCLxQTa1I5Y4`). |
| **Kachelmannwetter** | `/das-wetter-bei-uns/`, `/weather-kiefersfelden/` | DE/EU | 2× `<iframe src="kachelmannwetter.com/widget/standard/…">` direkt. |
| **YouTube** | `/impressum/` (1 Vorkommen) | USA | Vorhanden — Detail nicht geprüft. |

- Keine Variante mit Vorab-Zustimmung („Klicken zum Laden"), wie sie z.B. Borlabs Cookie oder Real Cookie Banner abdecken würden.
- **Risiko:** IP-Adressen werden bei Erstbesuch ungefragt an Google (US) und Kachelmann (EU) übertragen. Bei Kachelmann unkritisch (DE-Hosting), bei Google rechtlich seit Schrems-II strittig.

### 5.4 API-Key-Leak

- Google-Maps-iframe enthält den Browser-API-Key im Klartext im HTML. Falls dieser ohne HTTP-Referrer-Restriktion in der Google Cloud Console konfiguriert ist, kann ihn jeder kopieren und für eigene Maps-Aufrufe nutzen — Kostenrisiko für den Hotelier.
- **Empfehlung:** Beim Migrations-Schritt auf Next.js Maps via Google Maps **JavaScript API** mit referrer-restricted Key oder via @vis.gl/react-google-maps mit serverseitigem Proxy.

### 5.5 Cloudflare Email-Obfuscation

- Email-Adresse (`info@hotel-kiefersfelden.de`) wird via Cloudflare's `cdn-cgi/l/email-protection` XOR-codiert. Das ist eine Anti-Spam-Maßnahme — aber:
  - Der `cdn-cgi`-Endpunkt setzt Cookies (`__cf_bm`).
  - In der Datenschutzerklärung (`/j/privacy`) ist Cloudflare **nicht** als Auftragsverarbeiter genannt (unsere Suche findet 0 Treffer).
- **Risiko:** Kleinerer DSGVO-Mangel, aber leicht zu beheben (Cloudflare-AVV abschließen, Hinweis ergänzen).

---

## 6. Eingebettete Drittanbieter — Vollständige Liste

(Ergebnisse des Source-Code-Scans über alle 32 Seiten.)

| Anbieter | Vorkommen (Seiten) | Einbindungs-Art |
|---|---|---|
| **Jimdo / jimcdn / jimstatic** | 32/32 | CMS / Asset-Host |
| **Cloudflare** (Edge + Email-Obfuscation) | 32/32 | DNS/Edge — `Server: cloudflare`, `cdn-cgi/l/email-protection` |
| **Google Analytics 4** (`G-1DG7YNN4PS`) | 32/32 | gtag-Snippet im `<head>` |
| **HolidayCheck** (Wort + Logo-Bilder) | 32/32 | Statische Bilder (drei Auszeichnungs-Badges 2024–2026), Lightbox-Click — **keine** API/kein Widget. |
| **DIRS21 IBE** | 32/32 (UI-Element auf jeder Seite, „BUCHUNG"-Button) | Externer Link `target="_blank"` auf `v4.ibe.dirs21.de/channels/hotel-kiefersfeldende` |
| **Google Maps** (Embed) | 2/32 (`/anfahrt/`, `/getting-here/`) | iFrame mit API-Key |
| **Kachelmannwetter** | 2/32 (`/das-wetter-bei-uns/`, `/weather-kiefersfelden/`) | iFrame Widget (Stations 2773300 + 2891175) |
| **YouTube** | 1/32 (Impressum) | Detail-Inspektion nicht durchgeführt |
| **Deutsche Bahn (reiseauskunft.bahn.de)** | 1/32 (Startseite) | Externer Link |

**Keine Hinweise** auf: Facebook-Pixel, Instagram-Embeds, reCAPTCHA-V2/V3 auf der Bestandsseite (reCAPTCHA wird in Jimdos zentraler Datenschutzerklärung erwähnt, aber kein Formular auf der öffentlichen Site ruft `grecaptcha` auf — vermutlich nur fürs Editor-Backend relevant), TrustYou, BookingButler, eviivo, oder weitere Bewertungs-Widgets.

---

## 7. Buchungssystem (kritisch für Migration)

**Aktuell:** **DIRS21** (zhotel/protel-Konkurrent, rumänisch-deutscher Anbieter, weit verbreitet bei kleineren bis mittleren Hotels in DACH).

- URL: `https://v4.ibe.dirs21.de/channels/hotel-kiefersfeldende`
- Einbindung **als externer Link** (Button „BUCHUNG", `target="_blank"`). **Kein iframe**, keine Datenübergabe.
- DIRS21 ist in der Jimdo-Standard-Datenschutzerklärung erwähnt.

**Implikation für Next.js-Migration:**

- ✅ **Einfach.** Kein technischer Lift, keine PMS-Integration nötig — der bestehende DIRS21-Channel-Link bleibt.
- Falls der Mandant tieferes UX möchte (Verfügbarkeits-Widget direkt auf der Startseite), kennt DIRS21 dafür ein **iBE-V4-Widget** (eigenes Skript-Snippet) und alternativ die **DIRS21 API** für Custom-Frontends. Eine Integration ist möglich, **aber kein Muss**.
- **Empfehlung für die neue Site:** Mit dem aktuellen Modell starten (Button → DIRS21 in neuem Tab); Widget später nachschieben falls Conversion-Daten das rechtfertigen. Vermeidet Scope-Creep in Phase 1.
- **Klärung mit Kunde:** Welcher Channel-Manager wird verwendet? (Booking.com, Expedia, HRS, Airbnb für Ferienhaus etc.) Kommt das alles über DIRS21? Wer pflegt Verfügbarkeiten/Preise?

---

## 8. Inhaltsmanagement-Bewegungen (Indikatoren für Wartungsfrequenz)

Aus den Versions-Timestamps der Bilder lassen sich Pflege-Schübe ablesen (Unix-Sekunden in den URL-Pfaden):

- **Ältester aktiver Inhalt:** Hintergrund-Slideshow von 2016 (`version/1477730751` = Okt 2016) — wird heute noch ausgeliefert.
- **Letzte größere Bilder-Erneuerung:** ~Dez 2021 (`version/1638978…`). Viele Navigations-Thumbnails stammen aus dieser Zeit.
- **Aktueller Pflege-Stand:** April 2026 (`version/1772…` und `version/1777105812` für Tageskarte-PDF). Tageskarte wird **regelmäßig manuell aktualisiert** — Familie Pfeiffer hat einen funktionierenden Workflow mit dem Jimdo-Editor.
- **HolidayCheck-Badge 2026:** Hochgeladen `version/1775039631` (~März 2026). Die Familie aktualisiert solche Auszeichnungen sehr zeitnah.

**Take-away:** Es gibt einen aktiven, manuellen Pflege-Prozess; die zukünftige Sanity-Lösung **muss mindestens so einfach** sein wie der heutige Jimdo-Editor, sonst wird sie nicht akzeptiert.

---

## 9. Zusammenfassung & Migrations-Empfehlungen

| Bereich | Bestand | Risiko | Empfehlung Redesign |
|---|---|---|---|
| CMS | Jimdo Creator (proprietär, eingeschränkt) | Skalierung, Performance, Designkontrolle | Sanity (headless) + Next.js — wie geplant |
| Edge | Cloudflare | gering | Cloudflare beibehalten oder Vercel-Edge nutzen |
| Buchung | DIRS21-Link | gering | Beibehalten — Button im Header + auf Zimmer-Seite |
| Wetter-Widget | Kachelmann iFrame | mittel (Drittanbieter ohne Consent) | Kachelmann via Klick-zum-Laden ODER eigene Wetter-API + 12h-Cache |
| Karte | Google Maps Embed mit Key-Leak | mittel | OpenStreetMap (Leaflet) ODER Google Maps via JS-API mit referrer-restricted Key + Klick-zum-Laden |
| Tracking | GA4 ohne Consent | **hoch (DSGVO)** | Echtes Opt-in (Real Cookie Banner / Cookiebot) ODER Plausible/Umami serverseitig |
| Speisekarte | Bild-Scans + PDF | hoch (UX, SEO, A11y) | Strukturiertes Sanity-Schema (Kategorien + Items + Allergene + Tageskarte-Toggle) |
| Bewertungen | Statische HC-Badges | gering | Sanity-Modell für Auszeichnungen + Link auf HolidayCheck-Profil; optional HolidayCheck Connect API |
| HTML-Cache | `no-cache` | mittel (Performance) | Next.js ISR + `s-maxage`-Header über Vercel |
| `hreflang` | fehlt | mittel (SEO) | Next.js i18n-Routing → automatische `hreflang`-Tags |
| Datenschutzerklärung | Platzhalter im Hauptmenü | **hoch** | Echte DSGVO-konforme Erklärung im Footer + Cookie-Banner |
| Schema.org | nicht vorhanden | mittel (SEO) | `@type: LodgingBusiness` + `Restaurant` + `Menu` einbauen |

---

## 10. Offene Fragen an den Kunden

1. Gibt es einen Channel-Manager (Booking.com, HRS, Expedia, Airbnb für Ferienhaus)? Wer pflegt Preise & Verfügbarkeiten?
2. Soll das **DIRS21-IBE-Widget** direkt auf der Startseite eingebettet werden (Verfügbarkeits-Suche inkl. Datepicker), oder reicht der heutige Button-zum-neuen-Tab?
3. **HolidayCheck-Profil-URL** — derzeit nicht verlinkt; nur Auszeichnungs-Bilder. Möchte der Kunde Live-Bewertungen (HolidayCheck Connect, Customer Alliance, TrustYou) anzeigen oder genügen die Badges?
4. **DSGVO/Tracking-Strategie:** Welches Consent-Tool wird gewünscht? Gibt es Bestands-Verträge mit Cookiebot, Borlabs, Usercentrics?
5. **Wetter-Anbieter:** Soll Kachelmann beibehalten werden (Vertrag/Lizenz?) oder auf eine eigene API (DWD, Open-Meteo) gewechselt werden?
6. **Eigene Metzgerei** — separate Marke, eigene Seite, eigener Shop? (Wird in Meta-Description erwähnt, hat aber keine eigene Inhaltsseite.)
7. **Veranstaltungs-Bedarf:** Schlachtfestwoche, Spargelzeit etc. — sollen das Events im CMS werden mit Datum + Speisen-Anhang?
8. **Domain-Wechsel oder gleichbleibend?** `hotel-kiefersfelden.de` weiterhin? Falls ja: 301-Redirect-Mapping vorbereiten (alte → neue Slugs).
