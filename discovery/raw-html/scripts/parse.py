"""Parse the raw HTML pages and extract structured content + image manifest."""
import json
import os
import re
import sys
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote

from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parent.parent  # discovery/raw-html
BASE = "https://www.hotel-kiefersfelden.de"

URL_LIST = (ROOT / "url-list.txt").read_text(encoding="utf-8").splitlines()


def slugify_url(url: str) -> str:
    p = urlparse(url)
    path = unquote(p.path).strip("/")
    if not path:
        return "_root"
    # Match the shell-side slug: ä→ae, ö→oe, ü→ue, then / -> __
    path = path.replace("ä", "ae").replace("ö", "oe").replace("ü", "ue")
    path = path.replace("Ä", "Ae").replace("Ö", "Oe").replace("Ü", "Ue").replace("ß", "ss")
    return path.replace("/", "__")


def lang_of(url: str) -> str:
    p = urlparse(url).path
    if (
        "/home-english" in p
        or p.startswith("/english")
        or "/english/" in p
    ):
        return "en"
    if p in ("/impressum/", "/datenschutz/"):
        return "shared"
    return "de"


def clean_text(node) -> str:
    text = node.get_text("\n", strip=True)
    # collapse multi blank lines
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text


def extract_meta(s: BeautifulSoup) -> dict:
    out = {}
    title = s.find("title")
    out["title"] = title.get_text(strip=True) if title else None
    md = s.find("meta", attrs={"name": "description"})
    out["meta_description"] = md.get("content") if md else None
    og = {}
    for m in s.find_all("meta"):
        prop = m.get("property") or m.get("name") or ""
        if prop.startswith("og:") or prop.startswith("twitter:"):
            og[prop] = m.get("content")
    out["og"] = og
    canon = s.find("link", rel="canonical")
    out["canonical"] = canon.get("href") if canon else None
    out["lang"] = (s.html.get("lang") if s.html else None)
    return out


def extract_headings(s: BeautifulSoup):
    out = []
    for h in s.find_all(["h1", "h2", "h3"]):
        # ignore obviously empty
        t = h.get_text(" ", strip=True)
        if t:
            out.append({"level": int(h.name[1]), "text": t})
    return out


def extract_main_text(s: BeautifulSoup, base_url: str) -> tuple[str, list[dict], list[dict]]:
    # Build a "main content" by collecting text-bearing modules. Jimdo modules
    # share class prefix `cc-m-`. We grab `cc-m-text` for text and headings,
    # plus `cc-m-textwithimage`, `cc-m-imagesubtitle`, `cc-m-emotionheader`.
    main = s.find(id="cc-content") or s.find(id="cc-inner") or s.body or s

    interesting = main.select(
        ".cc-m-text, .cc-m-textwithimage, .cc-m-imagesubtitle, .cc-m-emotionheader, .cc-m-callToAction, .cc-m-htmlCode, .cc-m-header"
    )
    if not interesting:
        interesting = [main]

    chunks = []
    for el in interesting:
        # remove script/style/nav
        for x in el.select("script, style, nav, header, footer"):
            x.decompose()
        t = el.get_text("\n", strip=True)
        if t:
            chunks.append(t)
    text = "\n\n".join(chunks)
    text = re.sub(r"\n{3,}", "\n\n", text)

    # Images: from main + from background slideshow JSON in jimdoData
    images = []
    seen = set()
    for img in main.find_all("img"):
        src = img.get("src") or img.get("data-src") or ""
        if src.startswith("//"):
            src = "https:" + src
        elif src.startswith("/"):
            src = urljoin(base_url, src)
        if not src or src in seen:
            continue
        # data: uris skip
        if src.startswith("data:"):
            continue
        seen.add(src)
        images.append(
            {
                "src": src,
                "alt": img.get("alt") or "",
                "width": img.get("width"),
                "height": img.get("height"),
            }
        )

    # background slideshow images stored in inline jimdoData JSON
    bg_match = re.search(r'"bgConfig":\s*(\{.*?"images":\s*\[.*?\].*?\})', s.decode(), re.S)
    bg_images = []
    if bg_match:
        try:
            cfg = json.loads(bg_match.group(1))
            for im in cfg.get("images", []):
                u = im.get("url")
                if u and u not in seen:
                    seen.add(u)
                    bg_images.append({"src": u, "alt": im.get("altText") or "", "kind": "background"})
        except Exception:
            pass
    images.extend(bg_images)

    # Links
    links = []
    seen_l = set()
    for a in main.find_all("a", href=True):
        href = a["href"]
        if href.startswith("javascript:") or href.startswith("#"):
            continue
        if href.startswith("/"):
            href = urljoin(base_url, href)
        if href.startswith("mailto:") or href.startswith("tel:"):
            kind = "contact"
        else:
            host = urlparse(href).netloc
            if not host:
                continue
            kind = "internal" if host.endswith("hotel-kiefersfelden.de") else "external"
        key = (href, kind)
        if key in seen_l:
            continue
        seen_l.add(key)
        links.append({"href": href, "text": a.get_text(" ", strip=True)[:100], "kind": kind})

    return text, images, links


def main():
    pages = []
    all_images = {}
    for url in URL_LIST:
        slug = slugify_url(url)
        path = ROOT / f"{slug}.html"
        if not path.exists():
            print("MISSING", path, file=sys.stderr)
            continue
        html = path.read_text(encoding="utf-8", errors="replace")
        s = BeautifulSoup(html, "lxml")
        meta = extract_meta(s)
        headings = extract_headings(s)
        text, images, links = extract_main_text(s, url)
        page = {
            "url": url,
            "slug": slug,
            "lang": lang_of(url),
            "meta": meta,
            "headings": headings,
            "text": text,
            "images": images,
            "links": links,
        }
        pages.append(page)
        # accumulate images
        for img in images:
            src = img["src"]
            if src not in all_images:
                all_images[src] = {"src": src, "pages": [], "alts": []}
            all_images[src]["pages"].append(url)
            if img.get("alt"):
                all_images[src]["alts"].append(img["alt"])
            if img.get("kind"):
                all_images[src]["kind"] = img["kind"]

    out_path = ROOT / "parsed-pages.json"
    out_path.write_text(json.dumps(pages, ensure_ascii=False, indent=2), encoding="utf-8")
    img_path = ROOT / "parsed-images.json"
    img_path.write_text(json.dumps(list(all_images.values()), ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {out_path} ({len(pages)} pages)")
    print(f"Wrote {img_path} ({len(all_images)} unique images)")


if __name__ == "__main__":
    main()
