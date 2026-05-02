# Hotel zur Post – Frontend (Next.js)

Editorial-orientiertes Frontend für **hotel-kiefersfelden.de**.
Tech: Next.js 16 App Router · TypeScript strict · Tailwind v4 · next-intl · next-sanity · **Cloudflare Workers** (@opennextjs/cloudflare).

> Begleitende Discovery-Daten: `../discovery/`
> CMS-Schemas: `../sanity/`

---

## Schnellstart (lokal)

```bash
cd web
pnpm install
cp .env.example .env.local        # Werte einsetzen, siehe unten
pnpm dev                          # http://localhost:3000
```

Die Seite läuft bereits **ohne** Sanity-Verbindung — `lib/data.ts` liefert
realitätsnahe Mock-Daten aus dem Phase-2-Seed. Sobald
`NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local` gesetzt ist, schaltet
`lib/content.ts` automatisch auf das Live-Dataset um.

## Environment-Variablen

| Variable | Pflicht | Zweck |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID`   | optional | Aktiviert Live-Sanity-Daten. Leer → Mock-Mode. |
| `NEXT_PUBLIC_SANITY_DATASET`      | optional | Standard `production`. |
| `NEXT_PUBLIC_SANITY_API_VERSION`  | optional | Standard `2024-10-01`. |
| `SANITY_REVALIDATE_SECRET`        | für Prod  | Shared Secret zwischen Sanity-Webhook und `/api/revalidate`. |
| `NEXT_PUBLIC_SITE_URL`            | für Prod  | Basis-URL für Sitemap, OG, Schema.org. |

## Architektur

```
web/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx                Root: Fonts, globale Styles
│  │  ├─ globals.css               Tailwind v4 + Design-Tokens als @theme
│  │  ├─ sitemap.ts · robots.ts    SEO
│  │  ├─ api/revalidate/           Sanity-Webhook (ISR)
│  │  └─ [locale]/                 i18n-Segment (de | en)
│  │     ├─ layout.tsx             NextIntlProvider, Header, Footer, JSON-LD
│  │     ├─ page.tsx               Startseite (editorial flow)
│  │     ├─ hotel/                 „Das Haus"
│  │     ├─ zimmer/ + [slug]/      Zimmer-Übersicht + Detail
│  │     ├─ restaurant/            Restaurant + Speisekarte heute
│  │     ├─ speisekarte/           Vollständige Karte (druckbar)
│  │     ├─ sommer/ · winter/      Saison-Aktivitäten
│  │     ├─ anfahrt/               Karte + Wetter
│  │     ├─ kontakt/               Formular (clientseitig, Server-Action TODO)
│  │     ├─ impressum · datenschutz · agb
│  │     └─ not-found.tsx
│  │
│  ├─ components/
│  │  ├─ layout/                   Header, Footer, MobileNav, BookingBar, CookieNotice, LocaleSwitch
│  │  ├─ ui/                       Hero, SectionIntro, RoomCard, OfferCard, MenuToday, ImageGallery
│  │  ├─ widgets/                  MapEmbed (click-to-load), WeatherWidget (Open-Meteo), HolidayCheckBadge
│  │  └─ primitives/               Container, Button
│  │
│  ├─ i18n/                        next-intl Routing (de Default, en /en)
│  ├─ lib/
│  │  ├─ types.ts                  Domain-Typen (locale-resolved)
│  │  ├─ data.ts                   Mock-Daten (Phase-2-Seed-Spiegel)
│  │  ├─ content.ts                Unified Reader (Sanity ⟶ Mock)
│  │  ├─ sanity.ts                 Client (nur initialisiert, wenn Project-ID gesetzt)
│  │  ├─ seo.ts                    JSON-LD Hotel/Restaurant/Menu
│  │  └─ cn.ts
│  └─ middleware.ts                next-intl URL-Routing
│
├─ messages/
│  ├─ de.json · en.json
│
├─ public/images/
│  ├─ hero/ · rooms/ · region/ · hotel/ · logos/
│
├─ next.config.mjs · postcss.config.mjs · tsconfig.json · package.json
```

## Design-System (kurzfassung)

Alle Werte als CSS Custom Properties in `src/app/globals.css` (`@theme`-Block).
Bei Branding-Anpassungen reicht eine Datei.

| Token | Wert | Zweck |
|---|---|---|
| `--color-paper` | `#faf7f0` | Body-Hintergrund |
| `--color-paper-soft` | `#f5f1e7` | Sekundär-Sektion |
| `--color-ink` | `#1f1d1a` | Haupttext, Überschriften |
| `--color-loden` | `#2f4538` | Akzent (Buttons, Links, Hover) |
| `--color-hay` | `#c9b68e` | Sekundär-Wärme (Eyebrows auf Hero) |
| `--font-serif` | `Fraunces` | Headlines, Lead-Text |
| `--font-sans` | `Inter` | Fließtext |

Beide Fonts werden via `next/font/google` lokal gebündelt — **kein
Google-Fonts-CDN-Aufruf zur Laufzeit**, DSGVO-konform.

## Datenstrategie: Mock ↔ Sanity

`lib/content.ts` ist der **einzige** Daten-Einstiegspunkt für Pages und
Components. Im Mock-Mode werden Inhalte aus `lib/data.ts` geliefert,
die strukturell identisch zu den späteren GROQ-Resultaten sind.

Migration auf Live-Sanity (Phase 3.5):
1. `pnpm seed` im `sanity/`-Repo ausführen.
2. `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local` setzen.
3. `lib/content.ts` ersetzt jeden TODO-Stub durch eine GROQ-Query.

## Performance-Vorgaben (Soll: Lighthouse 95+)

- Server Components als Default. Client Components nur für `MobileNav`,
  `LocaleSwitch`, `MapEmbed` und `CookieNotice`.
- Bilder: `next/image` mit AVIF/WebP, sinnvolle `sizes`.
- Fonts: lokal gebündelt mit `display: swap`.
- Bewegung: Tailwind-Klassen, keine zusätzliche JS-Bibliothek im Critical Path.

## DSGVO-Maßnahmen (live-fähig)

- Keine Tracking-Cookies, kein Google Analytics.
- Google Maps: `MapEmbed` lädt das iframe erst nach Klick.
- Wetter: `WeatherWidget` ruft Open-Meteo serverseitig ab; Client erhält
  bereits gerendertes HTML.
- HolidayCheck: nur statische Badges + ausgehender Link (kein iframe-Tracker).
- Buchungs-IBE (DIRS21): öffnet sich in neuem Tab — keine eingebetteten
  Tracker.
- Cookie-Hinweis: rein informativer Banner (kein Consent-Tool, weil
  keine non-essential Cookies geladen werden).

## Buchungs-Integration

Aktuell: Outbound-Link zur DIRS21-IBE
(`https://v4.ibe.dirs21.de/channels/hotel-kiefersfeldende`).
Phase 3.5 (optional): iframe-Embed mit Click-to-Load,
oder DIRS21-API-Anbindung für Inline-Verfügbarkeitsanzeige.

## Bilder

Aktueller Stand: 24 kuratierte Bilder aus `discovery/assets/images/`,
abgelegt unter `public/images/`. Hochwertig genug für Live-Gang, aber
**ein professionelles Hero-Shooting wäre der größte einzelne Hebel**
für die Designwirkung. Empfehlungen markiert in
`app/[locale]/page.tsx` und `app/[locale]/restaurant/page.tsx` als
`PHOTO TODO`.

Sobald Sanity live ist: Seed lädt diese Bilder automatisch ins Sanity-
Asset-CDN, das Frontend zieht sie von dort (`cdn.sanity.io` ist als
`remotePattern` in `next.config.mjs` schon erlaubt).

## Deploy auf Cloudflare (Workers / Git)

Die Produktions-Artefakte erzeugst du mit **OpenNext** (nicht mit `next start` allein):

```bash
cd web
npm ci
npm run cf:build
npx wrangler deploy
```

**GitHub ↔ Cloudflare:** Repository verbinden, **Root-Verzeichnis** `web`,
**Build-Befehl** z. B. `npm ci && npm run cf:build`, danach **`wrangler deploy`**
wie in der [Workers CI/CD](https://developers.cloudflare.com/workers/ci-cd/)-Konfiguration
deines Projekts. Die Worker-Konfiguration liegt in `wrangler.jsonc`; Ausgabe: `.open-next/`.

Production-Variablen im Dashboard setzen (mindestens `NEXT_PUBLIC_SITE_URL`;
optional Sanity + `SANITY_REVALIDATE_SECRET` wie unten beim Webhook).

Sanity-Webhook-Konfiguration (im Studio unter API → Webhooks):

| Feld | Wert |
|---|---|
| Name | `frontend-revalidate` |
| URL | `https://<your-domain>/api/revalidate` |
| Dataset | `production` |
| Trigger | Create + Update + Delete |
| Filter | `_type in ["menu","room","offer","activity","page","siteSettings","navigation"]` |
| Headers | `x-sanity-secret: <SANITY_REVALIDATE_SECRET>` |
| HTTP-Methode | POST |

## Quality-Gates

```bash
npm run typecheck
npm run lint
npm run build        # Nur Next.js; für Cloudflare: npm run cf:build
```

## Phase-3-Folgearbeiten (TODO)

- [ ] Server-Action für Kontakt-Formular + Cloudflare Turnstile.
- [ ] Real-Sanity-GROQ-Queries in `lib/content.ts`.
- [ ] Dynamische OG-Bilder (`opengraph-image.tsx`) pro Hauptseite.
- [ ] Live-Vorschau (Sanity Visual Editing).
- [ ] Print-Stylesheet für `/speisekarte`.
- [ ] /agb auf Stand bringen, Datenschutz mit Datenschutzbeauftragtem prüfen.
