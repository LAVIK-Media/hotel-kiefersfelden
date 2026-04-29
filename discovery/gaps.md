# Inhaltliche Lücken — was eine Hotel-Site typischerweise hätte, hier aber fehlt

**Stand:** 2026-04-27
**Bezug:** Pflichtenheft *„Falls Seiten fehlen, die typischerweise Hotels haben (Gutscheine, Veranstaltungen, Wellness, …)"*

Die Bestandssite hat alle vom Briefing genannten **Pflicht-Seiten** (Startseite, Zimmer, Restaurant, Sommer, Winter, Anfahrt, Wetter, Kontakt, Impressum, Datenschutz, HolidayCheck-Bewertungen). Die folgende Liste sind **typische Hotel-Site-Bausteine, die hier nicht (oder nur rudimentär) vorhanden sind**.

---

## 1. Komplett fehlend

### 1.1 Gutscheine / Geschenke
- **Nicht vorhanden.** Keine Seite, kein Hinweis im Footer. Auch kein Hinweis auf telefonische Bestellbarkeit.
- Empfehlung: Eigene Seite `/gutscheine/` mit Wert-Gutschein, Erlebnis-Gutschein (z.B. „Romantik-Wochenende inkl. Halbpension"), Bestell-Formular oder Online-Shop-Anbindung (z.B. **incert** oder **Aida**, beide DSGVO-konform).

### 1.2 Veranstaltungs-/Eventkalender
- **Nicht vorhanden.** Schlachtfestwoche, Spargelzeit, Weißwurstfrühstück, Saisonkarte werden im Fließtext erwähnt, sind aber **nicht als Termine** auffindbar.
- Empfehlung: `/veranstaltungen/` als Sanity-Document-Type `event {date, title, description, isRecurring, image}` mit Übersichtsseite + Detail-Routes.

### 1.3 Pauschalen / Angebote
- Im Kontaktformular ist ein Feld „Pauschale (Sommer / Herbst / Wintertraum)" vorhanden — die Pauschalen selbst sind **nirgends auf der Site beschrieben**. Die Felder verweisen ins Leere.
- Empfehlung: `/angebote/` mit Pauschalen-Kacheln (Inhalt, Leistungen, Preise, Mindestaufenthalt, Buchungs-CTA).

### 1.4 Wellness / Freizeit IM Hotel
- **Nicht vorhanden.** Bestandssite verweist auf das externe „Innsola"-Erlebnisbad und auf das „Hocheck"-Skigebiet. Im Hotel selbst werden **2 Bundeskegelbahnen** (auf Winter-Seite versteckt) und ein „Jagastüberl mit offenem Kamin" erwähnt.
- Klärungsbedarf: Hat das Haus Sauna/Wellness (oft in 3-Sterne-Häusern)? Falls nein → klar so kommunizieren („wir sind ein Gasthof, kein Wellness-Hotel" — Erwartungs-Management).

### 1.5 FAQ / Hausinformationen
- **Nicht vorhanden.** Typische FAQ-Themen wie Check-in/Check-out-Zeiten, Frühstückszeiten, Hund/Haustiere erlaubt?, Parken/Garage, Lade-Säulen für E-Autos, Allergiker-Küche, Vegetarisch/Vegan, WLAN-Stärke, Kinderbetten, Babybetten — sind verstreut oder fehlen ganz.
- Eine Halbinformation wird nur en passant gegeben: *„Anreise ist bis 22:00 Uhr möglich"* (Startseite).
- Empfehlung: Sanity-Schema `faq { question, answer, category }` mit Filter pro Kategorie (Anreise / Zimmer / Frühstück / Restaurant / Tiere / Familie / Geschäftsreisende).

### 1.6 Stornierungsbedingungen / AGB
- **Nicht vorhanden** auf der Bestandssite. Booking-Engine DIRS21 zeigt sie vermutlich beim Buchungsprozess, aber die Site selbst hat keine Verlinkung.
- Empfehlung: `/agb/` mit Stornofristen, Anzahlungsregelung, No-Show-Pauschale. Verlinkung Footer + Buchungs-CTA.

### 1.7 Über uns / Hotelgeschichte
- Die *„Königlich Bayerische Poststation 1820"* wird in einem Halbsatz auf der Startseite erwähnt — ohne eigene Seite.
- **Eine echte Geschichte ungenutzt** — Hotellerie-Storytelling-Goldader.
- Empfehlung: `/geschichte/` (DE) bzw. `/our-story/` (EN) mit Zeitleiste, alten Fotos (falls vorhanden), Generationen-Wechsel der Familie Pfeiffer, Anekdoten.

### 1.8 Team
- Wirtsleute Christine und Andi Pfeiffer werden namentlich genannt, aber **kein Foto, kein „über uns".**
- Küchenchef wird erwähnt („unser beliebter Küchenchef"), bleibt aber **anonym**.
- Empfehlung: `/team/` oder eine Sektion auf `/geschichte/` mit Bildern und kurzem Steckbrief — moderne Hotel-Sites zeigen Gesichter, das schafft Vertrauen.

### 1.9 Eigene Metzgerei
- Wird in der Meta-Description und auf der Restaurant-Seite erwähnt, **hat aber keine eigene Sektion**, kein Bild, keine Erklärung.
- Empfehlung: Eigene Seite oder mindestens eine prominente Sektion auf `/restaurant/`. **Starkes USP für Foodies und Regionalitäts-bewusste Gäste.**

### 1.10 Newsletter / Mailing
- Nicht vorhanden. Keine Lead-Erfassung außer Kontaktformular.
- Empfehlung: optional, abhängig vom Marketing-Budget. Sinnvoll wenn die Pauschalen-Strategie aktiv kommuniziert wird (z.B. „4× im Jahr Saisonkarte vorab erfahren").

### 1.11 Pressebereich / Auszeichnungen
- HolidayCheck-Badges 2024, 2025, 2026 werden gezeigt, aber **keine Einbettung in Kontext** („ausgezeichnet seit … Jahren mit X% Empfehlungsrate"). Keine weiteren Auszeichnungen erkennbar (Bayern Tourismus? DEHOGA-Klassifizierung? Sterne?).
- Empfehlung: `/auszeichnungen/` oder Footer-Vertrauensleiste mit allen Bewertungs-/Klassifizierungs-Logos.

### 1.12 Bewertungen / Live-Reviews
- Nur statische HC-Badges. **Keine Live-Reviews** (Trustpilot, Customer Alliance, Google-Reviews).
- Empfehlung (optional): TrustYou oder Customer Alliance für aggregierte Live-Bewertung mit Schema.org `aggregateRating`. **Großer SEO-Bonus.**

### 1.13 Karriere / Jobs
- Nicht vorhanden. Bei einem 80-Betten-Haus mit Gastronomie sind permanent Stellen offen.
- Empfehlung: einfache `/jobs/` mit aktuellen Stellen + „initiative bewerbung" (Mailto/Formular).

### 1.14 Barrierefreiheit
- 25 Zimmer „bequem über Personenlift erreichbar" — mehr Detail fehlt. Keine Aussage zu rollstuhlgerechten Zimmern, Tür-Breiten, Bad-Ausstattung.
- Empfehlung: Auch wenn das Hotel nicht voll-barrierefrei ist — **transparent benennen**, was möglich ist (Reisende mit Mobilitätseinschränkungen wissen das zu schätzen).

---

## 2. Vorhanden, aber stark unterentwickelt

| Seite / Thema | Beobachtung | Empfehlung |
|---|---|---|
| **Tagungs-Hotel** | Nur generische Aussagen, keine Raumnamen, keine Quadratmeter, keine Bestuhlungs-Varianten, keine Tages-Pauschalen | Komplett überarbeiten: Räume → m² → Bestuhlung → Tagestechnik → Tagespauschalen DDR (Day Delegate Rate) |
| **Bus/Vereine** | „Reservierung von Bussen auf Anfrage" — kein Mengenrabatt-System, keine Beispiel-Pauschalen | Definitive Gruppen-Pakete mit Preis-pro-Person ab 20/40/60 Personen + Stornofristen |
| **Ferienhaus** | Im Hauptmenü, aber **kein Bild im Hero**, keine Lage-Karte separat zum Hauptgebäude, kein Buchungs-Kalender | Eigenständige Mini-Site / eigene Detailseite mit Galerie, Lageplan, Wochen-Verfügbarkeit (Airbnb-Synch?) |
| **Bergwandern** | Eigene Seite, aber inhaltlich dünn — nur ein Touren-Hinweis | Touren-Karten (Sanity-Type `tour` mit Distanz/Höhe/Dauer/Schwierigkeit), GPX-Download |
| **Galerie** | Bild-Wand ohne Kontext, Titel der Bilder fehlen oft | Mit Kategorien strukturieren (Hotel, Zimmer, Restaurant, Außen, Region) |

---

## 3. Pflicht-Klärungen mit Kunde

1. Sterne-Klassifizierung des Hauses (DEHOGA/G-Klassifizierung)?
2. Bilder-Lizenzen — viele Bilder wirken professionell, sind sie noch im Lizenz-Umfang? Zwei Bilder mit untypisch generischer Bild-Anmutung (Touren-/Stockfotos im Sommer-Bereich) bitte prüfen.
3. Soll das **Ferienhaus** auch über DIRS21 buchbar sein, oder bleibt es Anfrage-only / Airbnb / extern?
4. Welche **Pauschalen** existieren tatsächlich (das Kontaktformular fragt nach drei, die ich nirgends finde)?
5. Gibt es eine **Allergiker-/LMIV-konforme** Speisekarten-Variante (Kennzeichnungspflicht!)?
6. Hund erlaubt? Welche Konditionen?
7. **Schließtage / Ruhetage** — hat das Restaurant Ruhetag? (Auf der Site nicht zu finden.)
8. **E-Auto-Lader** auf dem Parkplatz?
