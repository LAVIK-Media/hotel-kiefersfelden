"""Copy menu-page images to /discovery/menu/ and write a README."""
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent  # discovery/
MENU = ROOT / "menu"
MENU.mkdir(parents=True, exist_ok=True)
IMG = ROOT / "assets" / "images"

manifest = json.load(open(IMG / "manifest.json", encoding="utf-8"))

speisenkarte_de = "https://www.hotel-kiefersfelden.de/start-deutsch/gut-essen/speisenkarte/"
menu_en = "https://www.hotel-kiefersfelden.de/english/eat-well/menu/"
tageskarte = "https://www.hotel-kiefersfelden.de/start-deutsch/gut-essen/tageskarte-spezialit%C3%A4ten/"

(MENU / "speisenkarte_de").mkdir(exist_ok=True)
(MENU / "menu_en").mkdir(exist_ok=True)
(MENU / "tageskarte_spezialitaeten").mkdir(exist_ok=True)

inventory = []

def is_a4_portrait_menu_image(m):
    w, h = m.get("width") or 0, m.get("height") or 0
    if w == 0 or h == 0:
        return False
    ratio = h / w
    # A4 portrait = 1.414, allow 1.3 - 1.5 (covers 1240x1754 and 905x1280=1.414)
    return 1.3 < ratio < 1.55 and w >= 600

for m in manifest:
    pages = m.get("pages") or []
    if not is_a4_portrait_menu_image(m):
        continue
    src_path = IMG / m["filename"] if "/" not in m["filename"] else IMG / Path(m["filename"]).name
    if not src_path.exists():
        continue
    if speisenkarte_de in pages:
        target = MENU / "speisenkarte_de" / src_path.name
        shutil.copy2(src_path, target)
        inventory.append({"target": target.relative_to(MENU).as_posix(), "page": "speisenkarte_de", **m})
    if menu_en in pages:
        target = MENU / "menu_en" / src_path.name
        shutil.copy2(src_path, target)
        inventory.append({"target": target.relative_to(MENU).as_posix(), "page": "menu_en", **m})
    if tageskarte in pages:
        target = MENU / "tageskarte_spezialitaeten" / src_path.name
        shutil.copy2(src_path, target)
        inventory.append({"target": target.relative_to(MENU).as_posix(), "page": "tageskarte_spezialitaeten", **m})

(MENU / "inventory.json").write_text(json.dumps(inventory, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Copied {len(inventory)} menu-page images.")
