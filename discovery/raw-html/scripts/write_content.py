"""Write per-page markdown content files and sitemap.md."""
import json
import re
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent.parent  # discovery/
RAW = ROOT / "raw-html"
CONTENT = ROOT / "content"
(CONTENT / "de").mkdir(parents=True, exist_ok=True)
(CONTENT / "en").mkdir(parents=True, exist_ok=True)
(CONTENT / "shared").mkdir(parents=True, exist_ok=True)

pages = json.load(open(RAW / "parsed-pages.json", encoding="utf-8"))

# Friendly slug per page (relative file path)
def page_slug(url: str) -> str:
    p = urlparse(url).path.strip("/")
    if not p:
        return "startseite"
    # take last path segment
    parts = [seg for seg in p.split("/") if seg]
    return parts[-1] or "startseite"

# Build a lookup for sitemap
sitemap_entries = []

for page in pages:
    url = page["url"]
    lang = page["lang"]
    meta = page["meta"]
    headings = page["headings"]
    text = page["text"]
    images = page["images"]
    links = page["links"]
    slug = page_slug(url)

    # purpose heuristic from URL
    path = urlparse(url).path
    purpose_map = [
        ("/zimmer", "Zimmerübersicht & Kategorien"),
        ("/rooms-rates", "Zimmerübersicht & Preise (EN)"),
        ("/hotel-preise", "Zimmerpreise im Detail"),
        ("/gut-essen/speisenkarte", "Speisenkarte (Standard)"),
        ("/gut-essen/tageskarte", "Tageskarte / wechselnde Spezialitäten"),
        ("/gut-essen", "Restaurant / Küche"),
        ("/eat-well/menu", "Menu (EN)"),
        ("/eat-well", "Restaurant (EN)"),
        ("/sommer/bergwandern", "Sommer: Bergwandern"),
        ("/summer/horse-drawn-carriages", "Summer: Carriages & Hiking"),
        ("/sommer", "Sommer-Angebote / Aktivitäten"),
        ("/summer", "Summer offers (EN)"),
        ("/winter", "Winter-Angebote / Aktivitäten"),
        ("/busse-vereine", "Busse & Vereine / Gruppenreisen"),
        ("/coaches-clubs", "Coaches & Clubs (EN)"),
        ("/anfahrt", "Anfahrt / Lage"),
        ("/getting-here", "Getting Here (EN)"),
        ("/das-wetter-bei-uns", "Bergwetter / Wetter Widget"),
        ("/weather-kiefersfelden", "Weather (EN)"),
        ("/kontakt", "Kontakt"),
        ("/contact", "Contact (EN)"),
        ("/feriernhaus", "Ferienhaus (Self-Catering)"),
        ("/fotos", "Bildergalerie"),
        ("/photos-links", "Photos & Links (EN)"),
        ("/tagungs-hotel", "Tagungshotel / Seminarräume"),
        ("/home-english/hotel", "Hotel info page (EN)"),
        ("/home-english/tagging-hotel-1", "EN duplicate of zimmer? (Slug-Tippfehler 'tagging' statt 'tagung')"),
        ("/home-english", "Englische Startseite"),
        ("/impressum", "Impressum (Legal)"),
        ("/datenschutz", "Datenschutzerklärung"),
    ]
    purpose = "Startseite (DE)" if path == "/" else None
    if purpose is None:
        for k, p in purpose_map:
            if k in path:
                purpose = p
                break
    if purpose is None:
        purpose = "Unbekannt"

    sitemap_entries.append(
        {
            "url": url,
            "title": meta.get("title") or "(kein Titel)",
            "lang": lang,
            "purpose": purpose,
            "slug": slug,
        }
    )

    # Build the page markdown
    md = []
    md.append(f"# {meta.get('title') or slug}")
    md.append("")
    md.append(f"- **URL:** {url}")
    md.append(f"- **Sprache:** {lang}")
    md.append(f"- **Zweck (vermutet):** {purpose}")
    md.append(f"- **Canonical:** {meta.get('canonical') or '-'}")
    md.append(f"- **Meta-Description:** {meta.get('meta_description') or '-'}")
    og = meta.get("og") or {}
    if og:
        md.append("- **OG/Twitter Tags:**")
        for k, v in og.items():
            if v:
                md.append(f"  - `{k}`: {v}")
    md.append("")
    md.append("## Überschriften-Hierarchie")
    md.append("")
    if headings:
        for h in headings:
            indent = "  " * (h["level"] - 1)
            md.append(f"{indent}- H{h['level']}: {h['text']}")
    else:
        md.append("- _keine Überschriften gefunden_")
    md.append("")
    md.append("## Volltext (sauber)")
    md.append("")
    md.append(text or "_kein Textinhalt_")
    md.append("")
    md.append("## Bilder")
    md.append("")
    if images:
        for img in images:
            alt = img.get("alt") or "(ohne Alt-Text)"
            md.append(f"- `{img['src']}` — alt: {alt}")
    else:
        md.append("- _keine Bilder gefunden_")
    md.append("")
    md.append("## Interne Links")
    md.append("")
    internal = [l for l in links if l["kind"] == "internal"]
    if internal:
        for l in internal:
            md.append(f"- [{l['text'] or l['href']}]({l['href']})")
    else:
        md.append("- _keine_")
    md.append("")
    md.append("## Externe Links")
    md.append("")
    external = [l for l in links if l["kind"] == "external"]
    if external:
        for l in external:
            md.append(f"- [{l['text'] or l['href']}]({l['href']})")
    else:
        md.append("- _keine_")
    md.append("")
    md.append("## Kontakt-Links (mailto/tel)")
    md.append("")
    contact = [l for l in links if l["kind"] == "contact"]
    if contact:
        for l in contact:
            md.append(f"- {l['href']}  — {l['text']}")
    else:
        md.append("- _keine_")
    md.append("")

    out_path = CONTENT / lang / f"{slug}.md"
    # avoid name clashes (e.g. multiple pages with slug 'startseite')
    if out_path.exists():
        # add a discriminator from path
        disc = re.sub(r"[^a-z0-9]+", "-", path.lower()).strip("-") or "x"
        out_path = CONTENT / lang / f"{slug}__{disc}.md"
    out_path.write_text("\n".join(md), encoding="utf-8")

# Write sitemap.md (tree-shaped)
def build_tree(entries):
    # Group by lang then by URL path segments
    tree = {}
    for e in entries:
        path = urlparse(e["url"]).path.strip("/") or "(root)"
        parts = path.split("/")
        node = tree.setdefault(e["lang"], {})
        for i, part in enumerate(parts):
            node = node.setdefault(part, {"_children": {}, "_entry": None})
            if i == len(parts) - 1:
                node["_entry"] = e
            node = node["_children"]
    return tree


def render_tree(node, depth=0, lines=None):
    if lines is None:
        lines = []
    for key in sorted(node.keys()):
        v = node[key]
        entry = v.get("_entry") if isinstance(v, dict) else None
        children = v.get("_children") if isinstance(v, dict) else None
        prefix = "  " * depth + "- "
        if entry:
            lines.append(
                f"{prefix}**{key}/** — [{entry['title']}]({entry['url']})  \n"
                f"{'  ' * (depth+1)}_Zweck: {entry['purpose']}_"
            )
        else:
            lines.append(f"{prefix}**{key}/**")
        if children:
            render_tree(children, depth + 1, lines)
    return lines


tree = build_tree(sitemap_entries)

sm = []
sm.append("# Sitemap — hotel-kiefersfelden.de")
sm.append("")
sm.append(f"Quelle: `https://www.hotel-kiefersfelden.de/sitemap.xml` (33 URLs deklariert; davon 32 erreichbar; 1 Duplikat-Sitemap-Tag).")
sm.append(f"Stand: 2026-04-27. Sprache der Bestandssite: Deutsch (Primär) + Englisch (Sekundär).")
sm.append("")
sm.append("## Übersicht (Anzahl Seiten)")
sm.append("")
counts = {}
for e in sitemap_entries:
    counts[e["lang"]] = counts.get(e["lang"], 0) + 1
for lang in ("de", "en", "shared"):
    sm.append(f"- **{lang.upper()}**: {counts.get(lang, 0)} Seiten")
sm.append("")
sm.append("## Baum-Struktur")
sm.append("")
for lang in ("de", "en", "shared"):
    if lang not in tree:
        continue
    sm.append(f"### Sprache: {lang.upper()}")
    sm.append("")
    sm.extend(render_tree(tree[lang]))
    sm.append("")

# Doppelte / redundante Seiten
sm.append("## Doppelte oder redundante Seiten — Beobachtungen")
sm.append("")
sm.append("Die URL-Struktur ist historisch gewachsen (Jimdo-Site, mit mehreren Reorganisationen). Auffällig:")
sm.append("")
sm.append("- **Drei verschiedene DE-URL-Stämme** in Verwendung: `/start/`, `/start-deutsch/`, `/deutsch/`. Beispiele:")
sm.append("  - `/start/zimmer/` (Zimmerübersicht)")
sm.append("  - `/start-deutsch/sommer/`, `/start-deutsch/winter/`, `/start-deutsch/anfahrt/`, `/start-deutsch/kontakt/` etc.")
sm.append("  - `/deutsch/hotel-preise/`, `/deutsch/tagungs-hotel/`, `/deutsch/fotos/das-wetter-bei-uns/`")
sm.append("  - **Empfehlung:** im Redesign konsolidiert auf flache, sprechende DE-Slugs unter `/` (DE als Root) bzw. `/en/` (EN-Subpfad). z.B. `/zimmer/`, `/restaurant/`, `/sommer/`, `/winter/`, `/anfahrt/`.")
sm.append("")
sm.append("- **Zwei EN-URL-Stämme:** `/home-english/` und `/english/`. Beispiele:")
sm.append("  - `/home-english/`, `/home-english/hotel/`, `/home-english/rooms-rates/`")
sm.append("  - `/english/eat-well/`, `/english/summer/`, `/english/winter/`, `/english/contact/` …")
sm.append("  - **Empfehlung:** alles unter `/en/...` mit identischer Struktur zur DE-Variante (1:1-Mapping → erleichtert Sanity-Translations).")
sm.append("")
sm.append("- **Tippfehler im Slug:** `/start-deutsch/feriernhaus/` (richtig: *Ferienhaus*).")
sm.append("- **Tippfehler im EN-Slug:** `/home-english/tagging-hotel-1/` — sehr wahrscheinlich gemeint: *tagung-hotel* (Tagungshotel). Inhalt prüfen — vermutlich Dublette zu `/deutsch/tagungs-hotel/`.")
sm.append("")
sm.append("- **Inkonsistente Speisekarten-Slugs:** DE nutzt *Speisenkarte* (mit n) → eher untypisch, korrekt wäre *Speisekarte*.")
sm.append("")
sm.append("- **EN-Variante mehrerer DE-Seiten fehlt:** Es gibt keinen englischen Pendant für `/start-deutsch/feriernhaus/` (Ferienhaus), `/start-deutsch/sommer/bergwandern/` hat zwar ein EN-Pendant, aber `/start-deutsch/gut-essen/tageskarte-spezialit%C3%A4ten/` hat keine EN-Tageskarten-Seite, und `/deutsch/tagungs-hotel/` hat keine englische Tagungs-Seite.")
sm.append("")
sm.append("## Zusammenfassung")
sm.append("")
sm.append("| Sprache | Seiten | Pflicht-Seiten erfüllt? |")
sm.append("|---|---|---|")
sm.append(f"| DE | {counts.get('de',0)} | ja, alle Pflicht-Seiten vorhanden (Startseite, Zimmer, Restaurant, Speisekarte, Sommer, Winter, Anfahrt, Wetter, Kontakt, Impressum, Datenschutz) |")
sm.append(f"| EN | {counts.get('en',0)} | weitgehend ja; *Tageskarte* (englisch), *Ferienhaus* (englisch), *Tagungshotel* (englisch) fehlen |")
sm.append(f"| Geteilt | {counts.get('shared',0)} | Impressum + Datenschutz (nur DE-Inhalt, von beiden Sprachen aus verlinkt) |")

(ROOT / "sitemap.md").write_text("\n".join(sm), encoding="utf-8")
print(f"Wrote {len(sitemap_entries)} content pages and sitemap.md")
