#!/usr/bin/env python3
"""
Processes the raw uploaded coffee-shop images into web-optimized,
center-cropped JPEG/PNG thumbnails, then emits a single JS module
(src/assets/images.js) exporting each as a base64 data URI.

Why base64-inline instead of static /public files:
- Zero extra HTTP requests for a small image set like this.
- The whole gallery ships as part of the JS bundle — simplest possible
  "drop this repo anywhere" deploy story for a v1 concept site.
- Trade-off (documented in README): larger JS bundle size. Fine at this
  image count; revisit with next/image-style lazy loading if the catalog grows.
"""
import base64
import io
import os
from PIL import Image

SRC_DIR = "/mnt/user-data/uploads"
OUT_JS = "/home/claude/coffee-luxe/src/assets/images.js"

# (filename, export_name, target_w, target_h, format, quality)
JOBS = [
    # Hero / cinematic splash shots
    ("1782601030661_image.png", "heroSplashLarge", 1200, 1200, "JPEG", 78),
    ("1782601062708_image.png", "heroSplashSmall", 700, 700, "JPEG", 80),
    # Ambient mood shots
    ("1782601162653_image.png", "moodSteamWood", 1000, 700, "JPEG", 78),
    ("1782601183936_image.png", "moodLatteArt", 1000, 700, "JPEG", 78),
    ("1782601232518_image.png", "moodDarkCloth", 1000, 600, "JPEG", 78),
    ("1782601258105_image.png", "moodPour", 900, 650, "JPEG", 78),
    ("1782601311977_image.png", "moodStreetSunset", 1100, 620, "JPEG", 78),
    ("1782601341651_image.png", "moodSpices", 1000, 600, "JPEG", 78),
    # Menu items
    ("1782601789082_image.png", "menuVanillaShake", 700, 700, "JPEG", 80),
    ("1782601811484_image.png", "menuHotChocolate", 700, 700, "JPEG", 80),
    ("1782601823499_image.png", "menuBrowicFrappe", 700, 700, "JPEG", 80),
    ("1782601840177_image.png", "menuEspressoFrappe", 700, 700, "JPEG", 80),
    ("1782601853123_image.png", "menuOreoFrappe", 700, 700, "JPEG", 80),
    ("1782601867362_image.png", "menuCaramelFrappe", 700, 700, "JPEG", 80),
]


def center_crop_resize(img: Image.Image, target_w: int, target_h: int) -> Image.Image:
    """Crop to target aspect ratio from center, then resize down."""
    if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
        # Composite onto cream-white (#FAF6F0) instead of naively dropping
        # alpha — several source PNGs (coffee splash cutouts) have real
        # transparency, and a blind .convert("RGB") leaves black/garbage
        # pixels where alpha was 0.
        background = Image.new("RGB", img.size, (250, 246, 240))
        rgba = img.convert("RGBA")
        background.paste(rgba, mask=rgba.split()[-1])
        img = background
    else:
        img = img.convert("RGB")
    src_w, src_h = img.size
    target_ratio = target_w / target_h
    src_ratio = src_w / src_h

    if src_ratio > target_ratio:
        # source is wider than target -> crop width
        new_w = int(src_h * target_ratio)
        offset = (src_w - new_w) // 2
        img = img.crop((offset, 0, offset + new_w, src_h))
    else:
        # source is taller than target -> crop height
        new_h = int(src_w / target_ratio)
        offset = (src_h - new_h) // 2
        img = img.crop((0, offset, src_w, offset + new_h))

    return img.resize((target_w, target_h), Image.LANCZOS)


def to_base64(img: Image.Image, fmt: str, quality: int) -> str:
    buf = io.BytesIO()
    save_kwargs = {"quality": quality, "optimize": True} if fmt == "JPEG" else {"optimize": True}
    img.save(buf, format=fmt, **save_kwargs)
    encoded = base64.b64encode(buf.getvalue()).decode("ascii")
    mime = "image/jpeg" if fmt == "JPEG" else "image/png"
    return f"data:{mime};base64,{encoded}"


def main():
    lines = [
        "// AUTO-GENERATED — do not hand-edit.",
        "// Source images processed by scripts/build_images.py",
        "// Each export is a self-contained base64 data URI (no external requests).",
        "",
    ]
    total_bytes = 0

    for filename, export_name, w, h, fmt, quality in JOBS:
        path = os.path.join(SRC_DIR, filename)
        img = Image.open(path)
        processed = center_crop_resize(img, w, h)
        data_uri = to_base64(processed, fmt, quality)
        total_bytes += len(data_uri)
        lines.append(f"export const {export_name} =")
        lines.append(f'  "{data_uri}";')
        lines.append("")
        print(f"✓ {export_name:<20} {w}x{h}  {len(data_uri)/1024:.1f}KB  <- {filename}")

    os.makedirs(os.path.dirname(OUT_JS), exist_ok=True)
    with open(OUT_JS, "w") as f:
        f.write("\n".join(lines))

    print(f"\nTotal embedded image payload: {total_bytes/1024:.1f} KB")
    print(f"Written to {OUT_JS}")


if __name__ == "__main__":
    main()
