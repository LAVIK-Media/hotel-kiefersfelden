"""Download all unique images and build manifest.json.

Output:
  discovery/assets/images/<filename>          (content images)
  discovery/assets/logos/<filename>           (Jimdo PDF/logo icons)
  discovery/assets/icons/<filename>           (icon sprites)
  discovery/assets/images/manifest.json
"""
import json
import os
import re
import time
import urllib.request
from pathlib import Path
from urllib.parse import urlparse, unquote

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent.parent  # discovery/
RAW = ROOT / "raw-html"
ASSETS = ROOT / "assets"
IMG_DIR = ASSETS / "images"
LOGO_DIR = ASSETS / "logos"
ICON_DIR = ASSETS / "icons"
for d in (IMG_DIR, LOGO_DIR, ICON_DIR):
    d.mkdir(parents=True, exist_ok=True)

unique = json.load(open(RAW / "unique-images.json", encoding="utf-8"))
others = json.load(open(RAW / "non-jimcdn-images.json", encoding="utf-8"))

UA = "Mozilla/5.0 (Discovery-Bot; jakob@lavik-media.com)"

def safe_name(name: str) -> str:
    name = unquote(name)
    name = re.sub(r"[^A-Za-z0-9._-]+", "-", name).strip("-")
    return name or "image.jpg"


def download(url: str, dest: Path) -> int:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
    dest.write_bytes(data)
    return len(data)


def quality_label(w: int, h: int, size_bytes: int) -> str:
    if w == 0 or h == 0:
        return "unknown"
    px = w * h
    if px < 200 * 150:
        return "thumbnail"
    if px < 800 * 600:
        return "web-komprimiert"
    if px < 1600 * 1200:
        return "mittel"
    return "gut"


def kind_to_purpose(kind: str, pages: list[str]) -> str:
    if kind == "backgroundarea":
        return "Hero/Hintergrund-Slideshow"
    paths = [urlparse(p).path for p in pages]
    purposes = []
    if any("/zimmer" in p or "/rooms" in p for p in paths):
        purposes.append("Zimmerfoto")
    if any("/gut-essen" in p or "/eat-well" in p for p in paths):
        purposes.append("Speise/Restaurant")
    if any("/sommer" in p or "/summer" in p for p in paths):
        purposes.append("Sommer-Aktivität")
    if any("/winter" in p for p in paths):
        purposes.append("Winter-Aktivität")
    if any("/feriernhaus" in p for p in paths):
        purposes.append("Ferienhaus")
    if any("/anfahrt" in p or "/getting-here" in p for p in paths):
        purposes.append("Anfahrt/Karte")
    if any("/kontakt" in p or "/contact" in p for p in paths):
        purposes.append("Kontakt")
    if any("/fotos" in p or "/photos" in p for p in paths):
        purposes.append("Galerie")
    if any("/busse-vereine" in p or "/coaches-clubs" in p for p in paths):
        purposes.append("Busse/Gruppen")
    if any("/tagungs" in p for p in paths):
        purposes.append("Tagung/Seminar")
    if any("/impressum" in p or "/datenschutz" in p for p in paths):
        purposes.append("Impressum/Datenschutz")
    if any(p.endswith("/") and p.count("/") == 1 for p in paths) and len(paths) >= 5:
        purposes.append("Navigation/Thumbnail")
    return ", ".join(purposes) if purposes else "Inhalt"


manifest = []
errors = []
n = len(unique)
print(f"Downloading {n} unique images...")
for i, u in enumerate(unique, 1):
    src = u["source_url"]
    iid = u["id"]
    fname_orig = u["filename"]
    # Build local filename: <id>__<filename>
    base = safe_name(fname_orig)
    if base.lower() in ("image.jpg", "image.png", "image.jpeg", "image.gif", "image.webp"):
        # Use first non-empty alt, else id
        alt = next((a for a in u["alts"] if a.strip()), "")
        if alt:
            base = safe_name(alt) + Path(base).suffix
    local = f"{iid[:10]}__{base}"
    dest = IMG_DIR / local
    if dest.exists() and dest.stat().st_size > 0:
        size = dest.stat().st_size
    else:
        try:
            size = download(src, dest)
        except Exception as e:
            errors.append({"id": iid, "src": src, "error": str(e)})
            print(f"  [{i}/{n}] ERR {iid}: {e}")
            time.sleep(1.0)
            continue
        time.sleep(1.0)  # polite delay
    # measure dimensions
    try:
        with Image.open(dest) as im:
            w, h = im.size
            fmt = im.format
    except Exception as e:
        w = h = 0
        fmt = None

    entry = {
        "filename": local,
        "original_url": src,
        "image_id": iid,
        "version": u["version"],
        "kind": u["kind"],
        "pages": u["pages"],
        "alts": u["alts"],
        "purpose": kind_to_purpose(u["kind"], u["pages"]),
        "width": w,
        "height": h,
        "format": fmt,
        "filesize_bytes": size,
        "quality": quality_label(w, h, size),
        "max_seen_render_width": u["max_width"],
        "is_stockphoto": False,  # heuristic: not detectable from URL alone
        "has_watermark": False,  # to be checked manually
        "notes": "",
    }
    manifest.append(entry)
    if i % 25 == 0:
        print(f"  [{i}/{n}] ok ({size} bytes, {w}x{h})  {local}")

# Handle non-jimcdn images (icons, third-party)
for o in others:
    src = o["src"]
    name = safe_name(Path(urlparse(src).path).name)
    if "kachelmannwetter" in src:
        dest = LOGO_DIR / f"kachelmannwetter__{name}"
        purpose = "Wetter-Widget Logo (Drittanbieter Kachelmannwetter)"
    elif "/cc/icons/" in src or "/icons/" in src:
        dest = ICON_DIR / name
        purpose = "Jimdo Icon (PDF/Download Indikator)"
    else:
        dest = ICON_DIR / name
        purpose = "Drittanbieter Icon"
    try:
        if not dest.exists() or dest.stat().st_size == 0:
            size = download(src, dest)
        else:
            size = dest.stat().st_size
    except Exception as e:
        errors.append({"src": src, "error": str(e)})
        continue
    try:
        with Image.open(dest) as im:
            w, h = im.size
            fmt = im.format
    except Exception:
        w = h = 0
        fmt = None
    manifest.append(
        {
            "filename": dest.relative_to(ASSETS).as_posix(),
            "original_url": src,
            "kind": "third-party",
            "pages": o.get("pages", []),
            "alts": o.get("alts", []),
            "purpose": purpose,
            "width": w,
            "height": h,
            "format": fmt,
            "filesize_bytes": size,
            "quality": quality_label(w, h, size),
            "is_stockphoto": False,
            "has_watermark": False,
            "notes": "Externe Ressource — DSGVO/Lizenz prüfen.",
        }
    )

(IMG_DIR / "manifest.json").write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
)
(RAW / "download-errors.json").write_text(
    json.dumps(errors, ensure_ascii=False, indent=2), encoding="utf-8"
)
total_bytes = sum(m.get("filesize_bytes", 0) for m in manifest)
print()
print(f"Done. {len(manifest)} entries, {total_bytes/1e6:.1f} MB total. {len(errors)} errors.")
