"""Deduplicate Jimdo image URLs by image identity.

Jimdo URLs look like:
  https://image.jimcdn.com/app/cms/image/transf/<spec>/path/<site>/<kind>/<id>/version/<v>/<file>.jpg

The same source image is served at many transform sizes (dimension=152x10000, =500x10000, etc.)
We dedupe by the (kind, id, version) tuple, then pick the LARGEST variant we have seen
(or fall back to "transf/none" for the original).
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

imgs = json.load(open(ROOT / "parsed-images.json", encoding="utf-8"))

ID_RE = re.compile(
    r"image\.jimcdn\.com/app/cms/image/transf/([^/]+)/path/([^/]+)/(image|backgroundarea|background)/(i[0-9a-f]+)/version/(\d+)/([^?#]+)"
)

groups = {}
others = []
for entry in imgs:
    src = entry["src"]
    m = ID_RE.search(src)
    if not m:
        others.append(entry)
        continue
    transf, site, kind, iid, ver, fname = m.groups()
    key = (site, kind, iid, ver)
    g = groups.setdefault(
        key,
        {
            "site": site,
            "kind": kind,
            "id": iid,
            "version": ver,
            "filename": fname,
            "variants": [],
            "pages": set(),
            "alts": set(),
            "max_width": 0,
        },
    )
    # extract max width from transform spec, e.g. dimension=2000x1500:format=jpg
    width = 0
    wm = re.search(r"dimension=(\d+)x", transf)
    if wm:
        width = int(wm.group(1))
    g["variants"].append({"src": src, "transform": transf, "width": width})
    g["max_width"] = max(g["max_width"], width)
    for p in entry.get("pages", []):
        g["pages"].add(p)
    for a in entry.get("alts", []) or []:
        g["alts"].add(a)
    if entry.get("kind") == "background":
        g["kind"] = "backgroundarea"

unique = []
for key, g in groups.items():
    g["pages"] = sorted(g["pages"])
    g["alts"] = sorted(g["alts"])
    # build canonical original-source URL via transf/none
    g["source_url"] = (
        f"https://image.jimcdn.com/app/cms/image/transf/none/"
        f"path/{g['site']}/{g['kind']}/{g['id']}/version/{g['version']}/{g['filename']}"
    )
    unique.append(g)

# Sort by kind then id for stable ordering
unique.sort(key=lambda x: (x["kind"], x["id"]))

print(f"Original entries: {len(imgs)}")
print(f"Unique source images: {len(unique)}")
print(f"  content image:   {sum(1 for u in unique if u['kind'] == 'image')}")
print(f"  backgroundarea:  {sum(1 for u in unique if u['kind'] == 'backgroundarea')}")
print(f"Other (non-jimcdn): {len(others)}")
for o in others:
    print("  ", o["src"])

(ROOT / "unique-images.json").write_text(
    json.dumps(unique, ensure_ascii=False, indent=2), encoding="utf-8"
)
(ROOT / "non-jimcdn-images.json").write_text(
    json.dumps(others, ensure_ascii=False, indent=2), encoding="utf-8"
)
