# Übergabe — Hotel zur Post Kiefersfelden

> Diese Anleitung richtet sich an die Inhaberfamilie und an wen auch immer
> die Inhalte später pflegt. Sie erklärt **was wo passiert**, **wie der
> Pflege-Alltag aussieht** und **welche Kosten anfallen**.

---

## Was haben Sie hier?

Eine zweisprachige (DE/EN) Hotel-Website mit modernem, ruhigem Editorial-
Design. Inhalte werden im **Sanity-Studio** gepflegt — einer Web-App, die
in jedem Browser funktioniert (auch auf Tablet und Handy).

| Komponente | Wo? | Wozu? |
|---|---|---|
| **Sanity-Studio** | `https://hotel-zur-post.sanity.studio` | Inhalte pflegen (Speisekarte, Zimmer, …) |
| **Website** | `https://www.hotel-kiefersfelden.de` | Was Ihre Gäste sehen |
| **Vercel-Hosting** | `https://vercel.com` | Bringt die Website ins Internet |
| **Sanity-Konto** | `https://sanity.io/manage` | Verwaltung des Inhalts-Speichers |

Wenn Sie etwas im Studio ändern, erscheint die Änderung **innerhalb von
1–2 Minuten** automatisch auf der Website. Sie müssen nichts „freigeben"
oder „veröffentlichen" lassen.

---

## Pflege-Alltag

Die drei häufigsten Aufgaben:

### 1. Tageskarte für morgen anlegen (≈ 5 Minuten)
Vollständige Schritt-für-Schritt-Anleitung in: `../sanity/README.md`,
Abschnitt 2 („Die wichtigste Aufgabe").

### 2. Bestehendes Bild ersetzen
- Sanity-Studio → das jeweilige Element (z.B. Zimmer „Doppelzimmer")
- Bild anklicken → „Bild ersetzen" → neues Foto hochladen
- **Bitte den Alt-Text aktualisieren**, falls das neue Foto etwas
  anderes zeigt.

### 3. Telefonnummer / Adresse / E-Mail ändern
- Sanity-Studio → ⚙️ **Site-Einstellungen** → Reiter „Kontakt"
- Werte ändern → veröffentlichen
- Die neue Nummer erscheint automatisch im Footer, auf Kontakt- und
  Anfahrtsseite und in den Suchmaschinen-Strukturdaten.

---

## Was Sie selbst pflegen können

✅ Speisekarten (täglich, wöchentlich, saisonal, Hauskarte)
✅ Zimmer-Beschreibungen, -Bilder, -Preise
✅ Pauschal-Angebote (Sommer, Winter)
✅ Aktivitäten / Region (Wandern, Hocheck, …)
✅ FAQ-Einträge
✅ Adresse, Öffnungszeiten, Buchungs-Link
✅ Header- und Footer-Reihenfolge
✅ Impressum, Datenschutz, AGB

## Was Sie zu uns geben sollten

⚠ Datenschutzerklärung (rechtliche Prüfung – Anwalt oder Datenschutz­beauftragter)
⚠ Reale Stornofristen (für AGB)
⚠ Tatsächliche Frühstücks- und Restaurant-Öffnungszeiten

## Was wir (Lavik Media) für Sie tun

🛠 Hosting (Vercel) — Code-Updates, Sicherheits-Patches
🛠 Sanity-Schema-Anpassungen (neue Felder, neue Sprachen)
🛠 Performance-Monitoring
🛠 SEO-Audits (halbjährlich)
🛠 Bei größeren Marketing-Aktionen: neue Seiten oder Sektionen

---

## Hosting & Kosten

Folgende Tools sind nötig. Wir nutzen jeweils das einfachste verfügbare
Modell — Sie können später skalieren, falls der Verkehr stark wächst.

| Service | Plan | Kosten / Monat | Was bedeutet das? |
|---|---|---|---|
| **Vercel** (Web-Hosting) | Hobby | **kostenfrei** | Reicht für ~100 GB Datenvolumen / Monat. Bei einem Hotel dieser Größe deutlich ausreichend. |
| **Sanity** (CMS) | Free Plan | **kostenfrei** | Bis 3 Editor:innen + 10 GB Asset-Speicher + 1.000 Dokumente. Reicht für Sie locker. |
| **Domain** `hotel-kiefersfelden.de` | bei Ihrem aktuellen Registrar | unverändert | Beibehalten. Wir richten nur DNS-Einträge ein. |
| **E-Mail** `info@hotel-kiefersfelden.de` | bei Ihrem aktuellen Provider | unverändert | Bleibt unangetastet. |
| **Open-Meteo** (Wetter) | öffentlich | **kostenfrei** | DSGVO-freundlich, keine Anmeldung. |

**Realistische Größenordnung:** **0 – 25 €/Monat** Eigenkosten,
abhängig vom Domain-Provider. Erst wenn Sanity > 3 Editor:innen
braucht oder Vercel mehr als 100 GB Traffic durchschiebt, fallen
zusätzliche Kosten an (Sanity-„Growth": 99 $/Monat,
Vercel-„Pro": 20 $/Monat). Beide Schwellen sind für Ihren Betrieb
unwahrscheinlich.

## Wartung

| Aufgabe | Wer | Frequenz |
|---|---|---|
| Inhalte pflegen | Familie Pfeiffer | täglich (Tageskarte) bis monatlich |
| Code-Updates (Next.js, Sanity, Tailwind) | Lavik Media | quartalsweise |
| Sicherheits-Patches | Lavik Media | bei Veröffentlichung |
| Daten-Backup (Sanity) | Sanity automatisch | täglich, 30 Tage Aufbewahrung |
| Performance-Audit | Lavik Media | halbjährlich |

---

## Notfall

| Was ist passiert? | Wer hilft? | Wie? |
|---|---|---|
| Website nicht erreichbar | Vercel-Status prüfen: `https://vercel-status.com`, sonst Mail an Lavik Media. |
| Studio-Login funktioniert nicht | sanity.io/manage → Mitgliederliste prüfen, ggf. Mail an Lavik Media. |
| Tippfehler / falscher Preis online | Sanity-Studio → korrigieren → veröffentlichen. Live in 1–2 Minuten. |
| Bild aus Versehen gelöscht | Asset-Bibliothek behält Bilder 30 Tage; Wiederherstellung über Lavik Media möglich. |

## Sicherheit

- Studio-Login per Google-Konto (kein Passwort, kein Phishing-Risiko).
- Jeder Account, der ausgeschieden ist, wird von Lavik Media aus dem
  Sanity-Projekt entfernt.
- HTTPS überall (Vercel-Standard).
- Keine Tracking-Cookies, keine Drittanbieter-Skripte zur Laufzeit.

---

## Kontakt

**Lavik Media**
Jakob — `jakob@lavik-media.com`

Bei größeren Änderungen oder Auffälligkeiten ein kurzes Mail genügt.
Tippfehler im Sanity-Studio dürfen Sie selbst korrigieren — keine Sorge,
ältere Versionen werden automatisch aufbewahrt.
