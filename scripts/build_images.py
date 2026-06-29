#!/usr/bin/env python3
"""
Generate WebP siblings for every JPG/JPEG in /public.

Why this script exists
----------------------
The /public folder holds raw product photos (most 80–340KB, one 608KB).
Browsers that support WebP can render the same shot at ~50% smaller,
which is the single biggest win available for this site.

Run this any time you drop a new photo into /public. It is idempotent:
it re-encodes over the existing .webp files, and skips anything that's
already up-to-date (same mtime as the source).

Usage:
    python3 scripts/build_images.py [--max-width=800] [--quality=78]

Defaults target an 800px long edge — more than enough for a 3-col
grid of 384px-wide cards with 2x retina headroom. Increase only if
you add a true hero shot that needs full-resolution on the gallery.

The script also dedupes byte-identical files (e.g. fuchka.jpg and
fuchka 2.jpg were the same image under two names; it keeps the
shorter name and removes the rest after generating the WebPs).
"""
import argparse
import glob
import os
import re
import sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.normpath(os.path.join(HERE, "..", "public"))


def webp_path(jpg_path: str) -> str:
    """pizza-1.jpg -> pizza-1.webp (handles spaces in names)."""
    base, _ = os.path.splitext(jpg_path)
    return base + ".webp"


def needs_rebuild(jpg_path: str, webp_file: str, max_width: int) -> bool:
    """Skip if the WebP is already fresh — same mtime as the JPG."""
    if not os.path.exists(webp_file):
        return True
    if os.path.getmtime(webp_file) < os.path.getmtime(jpg_path):
        return True
    # Cheap way to detect a stale target size: stamp it in the
    # image's PNG-style tEXt chunk via Pillow's "WebP" metadata.
    # If absent or mismatched, rebuild.
    with Image.open(webp_file) as img:
        marker = img.info.get("max_width")
        if marker is None or int(marker) != max_width:
            return True
    return False


def encode_webp(jpg_path: str, webp_file: str, max_width: int, quality: int) -> tuple[int, int]:
    with Image.open(jpg_path) as img:
        if img.mode != "RGB":
            img = img.convert("RGB")
        # Downscale wide axis to max_width preserving aspect ratio.
        w, h = img.size
        if w > max_width:
            new_h = round(h * (max_width / w))
            img = img.resize((max_width, new_h), Image.LANCZOS)
        # Stamp the target width as PNG tEXt (WebP inherits PngInfo).
        from PIL.PngImagePlugin import PngInfo
        meta = PngInfo()
        meta.add_text("max_width", str(max_width))
        img.save(webp_file, "WEBP", quality=quality, method=6, pnginfo=meta)
    return os.path.getsize(jpg_path), os.path.getsize(webp_file)


def deduplicate(directory: str, extensions=(".jpg", ".jpeg")) -> int:
    """
    Find groups of files where all members have identical content and
    keep only the shortest-named one. Returns the count of files removed.

    Runs BEFORE the WebP pass so duplicate WebPs don't get generated.
    """
    by_hash: dict[str, list[str]] = {}
    for ext in extensions:
        for path in sorted(glob.glob(os.path.join(directory, f"*{ext}"))):
            # Hash the file in 64KB chunks — fingerprint only.
            with open(path, "rb") as fh:
                head = fh.read(65536)
            import hashlib
            digest = hashlib.sha1(head).hexdigest()
            by_hash.setdefault(digest, []).append(os.path.basename(path))

    removed = 0
    for digest, names in by_hash.items():
        if len(names) <= 1:
            continue
        # Keep the shortest name (no spaces, lowercase, no suffix).
        keep = sorted(names, key=lambda n: (len(n), n.lower()))[0]
        for name in names:
            if name == keep:
                continue
            full = os.path.join(directory, name)
            try:
                os.remove(full)
                removed += 1
                print(f"  dedup: removed {name} (kept {keep})")
            except OSError as exc:
                print(f"  dedup: could not remove {name}: {exc}")
    return removed


def main() -> int:
    p = argparse.ArgumentParser(description="Build WebP siblings for /public photos.")
    p.add_argument("--max-width", type=int, default=800, help="Cap the long edge (default 800px).")
    p.add_argument("--quality", type=int, default=78, help="WebP quality, 1-100 (default 78).")
    p.add_argument("--no-dedup", action="store_true", help="Skip the byte-identical dedup pass.")
    args = p.parse_args()

    os.chdir(PUBLIC_DIR)
    print(f"Public dir: {PUBLIC_DIR}")
    print(f"Targets: max_width={args.max_width}px, quality={args.quality}")
    print()

    if not args.no_dedup:
        print("Pass 1: dedup byte-identical files...")
        n = deduplicate(PUBLIC_DIR)
        print(f"  {n} duplicate file(s) removed.\n")

    print("Pass 2: encode WebPs...")
    sources = sorted(
        fn for fn in glob.glob("*.jpg") + glob.glob("*.jpeg")
        if not fn.startswith(".")  # skip hidden
    )
    total_jpg = 0
    total_webp = 0
    for jpg in sources:
        target = webp_path(jpg)
        if not needs_rebuild(jpg, target, args.max_width):
            print(f"  · {jpg:<28} up-to-date")
            total_jpg += os.path.getsize(jpg)
            total_webp += os.path.getsize(target)
            continue
        try:
            j_size, w_size = encode_webp(jpg, target, args.max_width, args.quality)
            savings = (1 - w_size / j_size) * 100 if j_size else 0
            print(f"  ✓ {jpg:<28} {j_size/1024:>7.1f}KB -> {w_size/1024:>7.1f}KB ({savings:>5.1f}% smaller)")
            total_jpg += j_size
            total_webp += w_size
        except Exception as exc:
            print(f"  ✗ {jpg}: {exc}", file=sys.stderr)
            return 1

    if total_jpg:
        overall = (1 - total_webp / total_jpg) * 100
        print()
        print(f"Total JPG payload:   {total_jpg/1024:>8.1f} KB")
        print(f"Total WebP payload:  {total_webp/1024:>8.1f} KB")
        print(f"Savings with WebP:   {overall:>8.1f}%")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
