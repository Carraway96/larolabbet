"""Render a PDF as optimized WebP pages for Lärolabbet.

Usage:
  python scripts/prepare_pdf_assets.py input.pdf public/content/my-area/slides --prefix slide
"""

from argparse import ArgumentParser
from pathlib import Path

import pymupdf
from PIL import Image


def main():
    parser = ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--prefix", default="page")
    parser.add_argument("--scale", type=float, default=1.6)
    parser.add_argument("--quality", type=int, default=86)
    args = parser.parse_args()

    args.output.mkdir(parents=True, exist_ok=True)
    document = pymupdf.open(args.pdf)
    for index, page in enumerate(document):
        pixmap = page.get_pixmap(matrix=pymupdf.Matrix(args.scale, args.scale), alpha=False)
        image = Image.frombytes("RGB", (pixmap.width, pixmap.height), pixmap.samples)
        target = args.output / f"{args.prefix}-{index + 1:02d}.webp"
        image.save(target, "WEBP", quality=args.quality, method=6)
        print(target)


if __name__ == "__main__":
    main()
