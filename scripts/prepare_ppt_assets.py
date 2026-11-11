"""Export PowerPoint web slides, retaining original GIFs and their stacking order.

Requires Windows, installed PowerPoint, Pillow and numpy. The source is read-only.
Usage: python scripts/prepare_ppt_assets.py input.pptx public/content/my-area/slides
"""

import json
import posixpath
import subprocess
import tempfile
import xml.etree.ElementTree as ET
from argparse import ArgumentParser
from pathlib import Path
from zipfile import ZipFile

import numpy as np
from PIL import Image

NS = {"p": "http://schemas.openxmlformats.org/presentationml/2006/main",
      "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
      "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}

# Render the layers on either side of the GIF separately. Two foreground renders
# allow recovering transparency, including antialiased text and shape edges.
EXPORT_SCRIPT = r'''
param($Source, $Output, $Manifest)
$ErrorActionPreference = 'Stop'
$items = Get-Content -LiteralPath $Manifest -Raw | ConvertFrom-Json
$app = New-Object -ComObject PowerPoint.Application
$deck = $null
try {
    $deck = $app.Presentations.Open($Source, -1, 0, 0)
    foreach ($item in $items) {
        $slide = $deck.Slides.Item([int]$item.number)
        $prefix = Join-Path $Output ('slide-{0:d2}' -f [int]$item.number)
        $slide.Export("$prefix.png", 'PNG', 1600, 900)
        if ($null -eq $item.animation) { continue }
        $gifPosition = 0
        for ($i = 1; $i -le $slide.Shapes.Count; $i++) {
            if ($slide.Shapes.Item($i).Id -eq $item.animation.shapeId) { $gifPosition = $i }
        }
        if ($gifPosition -eq 0) { throw 'GIF shape not found' }
        $visibility = @{}
        for ($i = 1; $i -le $slide.Shapes.Count; $i++) {
            $visibility[$i] = $slide.Shapes.Item($i).Visible
            if ($i -ge $gifPosition) { $slide.Shapes.Item($i).Visible = 0 }
        }
        $slide.Export("$prefix-background.png", 'PNG', 1600, 900)
        for ($i = 1; $i -le $slide.Shapes.Count; $i++) {
            $slide.Shapes.Item($i).Visible = $(if ($i -gt $gifPosition) { $visibility[$i] } else { 0 })
        }
        $slide.DisplayMasterShapes = 0
        $slide.FollowMasterBackground = 0
        $slide.Background.Fill.Solid()
        $slide.Background.Fill.ForeColor.RGB = 0
        $slide.Export("$prefix-black.png", 'PNG', 1600, 900)
        $slide.Background.Fill.ForeColor.RGB = 16777215
        $slide.Export("$prefix-white.png", 'PNG', 1600, 900)
    }
} finally {
    if ($null -ne $deck) { $deck.Close() }
    $app.Quit()
}
'''


def main():
    parser = ArgumentParser(description=__doc__)
    parser.add_argument("pptx", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--manifest", type=Path, help="Optional source-data manifest destination")
    args = parser.parse_args()
    output = args.output.resolve()
    output.mkdir(parents=True, exist_ok=True)
    items = []
    with ZipFile(args.pptx) as archive:
        presentation = ET.fromstring(archive.read("ppt/presentation.xml"))
        size = presentation.find("p:sldSz", NS)
        width, height = int(size.get("cx")), int(size.get("cy"))
        relationships = ET.fromstring(archive.read("ppt/_rels/presentation.xml.rels"))
        targets = {r.get("Id"): r.get("Target") for r in relationships}
        for number, slide_id in enumerate(presentation.find("p:sldIdLst", NS), 1):
            slide_path = posixpath.normpath(posixpath.join("ppt", targets[slide_id.get(f'{{{NS["r"]}}}id')]))
            root = ET.fromstring(archive.read(slide_path))
            rel_path = posixpath.join(posixpath.dirname(slide_path), "_rels", posixpath.basename(slide_path) + ".rels")
            rels = {r.get("Id"): r.get("Target") for r in ET.fromstring(archive.read(rel_path))}
            item = {"number": number}
            for picture in root.findall(".//p:pic", NS):
                blip = picture.find(".//a:blip", NS)
                target = rels.get(blip.get(f'{{{NS["r"]}}}embed'), "") if blip is not None else ""
                if not target.lower().endswith(".gif"):
                    continue
                if "animation" in item:
                    raise ValueError("Multiple GIFs on one slide require separate layer exports")
                transform = picture.find("p:spPr/a:xfrm", NS)
                if transform is None or transform.get("rot") or transform.get("flipH") or transform.get("flipV"):
                    raise ValueError("Grouped, flipped or rotated GIF requires a matching transform")
                crop = picture.find("p:blipFill/a:srcRect", NS)
                crop_values = {side: int(crop.get(side, 0)) / 100000 if crop is not None else 0 for side in ["l", "t", "r", "b"]}
                offset, extent = transform.find("a:off", NS), transform.find("a:ext", NS)
                gif_name = f"slide-{number:02d}.gif"
                data = archive.read(posixpath.normpath(posixpath.join(posixpath.dirname(slide_path), target)))
                (output / gif_name).write_bytes(data)
                item["animation"] = {
                    "shapeId": int(picture.find("p:nvPicPr/p:cNvPr", NS).get("id")),
                    "src": gif_name,
                    "crop": crop_values,
                    "left": 100 * int(offset.get("x")) / width,
                    "top": 100 * int(offset.get("y")) / height,
                    "width": 100 * int(extent.get("cx")) / width,
                    "height": 100 * int(extent.get("cy")) / height,
                }
            items.append(item)

    with tempfile.TemporaryDirectory(prefix="larolabbet-ppt-") as temp:
        temp = Path(temp)
        (temp / "manifest.json").write_text(json.dumps(items), encoding="utf-8")
        (temp / "export.ps1").write_text(EXPORT_SCRIPT, encoding="utf-8-sig")
        subprocess.run(["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(temp / "export.ps1"),
                        "-Source", str(args.pptx.resolve()), "-Output", str(temp), "-Manifest", str(temp / "manifest.json")], check=True)
        slides = []
        for item in items:
            prefix = f'slide-{item["number"]:02d}'
            Image.open(temp / f"{prefix}.png").convert("RGB").save(output / f"{prefix}.webp", quality=88, method=6)
            slide = {"image": f"{prefix}.webp"}
            if "animation" in item:
                Image.open(temp / f"{prefix}-background.png").convert("RGB").save(output / f"{prefix}-background.webp", quality=88, method=6)
                black = np.asarray(Image.open(temp / f"{prefix}-black.png").convert("RGB"), dtype=float)
                white = np.asarray(Image.open(temp / f"{prefix}-white.png").convert("RGB"), dtype=float)
                alpha = np.clip(1 - np.mean(white - black, axis=2) / 255, 0, 1)
                rgb = np.clip(black / np.maximum(alpha[:, :, None], 1 / 255), 0, 255)
                rgba = np.dstack((rgb, alpha * 255)).round().astype("uint8")
                Image.fromarray(rgba).save(output / f"{prefix}-foreground.png", optimize=True)
                slide.update(background=f"{prefix}-background.webp", foreground=f"{prefix}-foreground.png",
                             animation={k: v for k, v in item["animation"].items() if k != "shapeId"})
            slides.append(slide)
        (args.manifest or output / "slides.json").write_text(json.dumps(slides, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Exported {len(slides)} slides, {sum('animation' in s for s in slides)} with original GIFs")


if __name__ == "__main__":
    main()
