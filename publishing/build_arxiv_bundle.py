"""
Bundle a paper's LaTeX sources into a tar.gz for arxiv / PsyArXiv upload.

The bundle contains the paper's .tex, the obelus-preprint.cls, any .bib
file in the same directory, and anything inside an adjacent figures/ folder.
The output filename matches the paper stem.

Usage:
  python build_arxiv_bundle.py path/to/leffew_2026_paper.tex
  python build_arxiv_bundle.py path/to/leffew_2026_paper.tex --out submissions/
"""

from __future__ import annotations

import argparse
import sys
import tarfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
CLS_SOURCE = HERE / "obelus-preprint.cls"


def build_bundle(tex_path: Path, out_dir: Path) -> Path:
    paper_dir = tex_path.parent
    stem = tex_path.stem
    bundle_path = out_dir / f"{stem}-arxiv.tar.gz"
    out_dir.mkdir(parents=True, exist_ok=True)

    members: list[tuple[Path, str]] = [
        (tex_path, tex_path.name),
        (CLS_SOURCE, CLS_SOURCE.name),
    ]

    for bib in paper_dir.glob("*.bib"):
        members.append((bib, bib.name))

    figures_dir = paper_dir / "figures"
    if figures_dir.is_dir():
        for fig in figures_dir.rglob("*"):
            if fig.is_file():
                members.append((fig, f"figures/{fig.relative_to(figures_dir)}"))

    with tarfile.open(bundle_path, "w:gz") as tar:
        for src, arcname in members:
            tar.add(src, arcname=arcname)

    return bundle_path


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("tex_path", help="Path to the paper's .tex source")
    ap.add_argument("--out", default=".", help="Output directory for the tarball")
    args = ap.parse_args()

    tex_path = Path(args.tex_path).resolve()
    if not tex_path.exists():
        sys.exit(f"Not found: {tex_path}")
    if tex_path.suffix != ".tex":
        sys.exit(f"Expected a .tex file, got {tex_path.suffix}")
    if not CLS_SOURCE.exists():
        sys.exit(f"Missing canonical class: {CLS_SOURCE}")

    out_dir = Path(args.out).resolve()
    bundle_path = build_bundle(tex_path, out_dir)
    size_kb = bundle_path.stat().st_size // 1024
    print(f"Built {bundle_path} ({size_kb} KB)")


if __name__ == "__main__":
    main()
