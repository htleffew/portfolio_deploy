"""
Build a paper PDF from its markdown source.

Workflow:
  1. Run md_to_latex on the input .md to produce a .tex alongside it.
  2. Vendor obelus-preprint.cls into the paper directory for pdflatex.
  3. Run pdflatex twice (cross-references).
  4. Remove the vendored .cls and aux files. Leave: .md, .tex, .pdf.

Usage:
  python build_paper.py path/to/leffew_2026_paper.md
  python build_paper.py path/to/leffew_2026_paper.md --keep-aux
  python build_paper.py path/to/leffew_2026_paper.md --pdflatex C:/path/to/pdflatex.exe

If --pdflatex is omitted, the script searches PATH and the default MiKTeX
install location.
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
CLS_SOURCE = HERE / "obelus-preprint.cls"
MD_TO_LATEX = HERE / "md_to_latex.py"

DEFAULT_PDFLATEX_CANDIDATES = [
    "pdflatex",
    r"C:/Users/drhea/AppData/Local/Programs/MiKTeX/miktex/bin/x64/pdflatex.exe",
    r"C:/Program Files/MiKTeX/miktex/bin/x64/pdflatex.exe",
]

AUX_EXTS = (".aux", ".log", ".out", ".toc", ".bbl", ".blg", ".synctex.gz")


def find_pdflatex(explicit: str | None) -> str:
    if explicit:
        if not Path(explicit).exists():
            sys.exit(f"pdflatex not found at {explicit}")
        return explicit
    for candidate in DEFAULT_PDFLATEX_CANDIDATES:
        if shutil.which(candidate) or Path(candidate).exists():
            return candidate
    sys.exit(
        "pdflatex not found. Pass --pdflatex /path/to/pdflatex or install MiKTeX."
    )


def run_md_to_latex(md_path: Path, tex_path: Path) -> None:
    subprocess.run(
        [sys.executable, str(MD_TO_LATEX), str(md_path), str(tex_path)],
        check=True,
    )


def run_pdflatex(pdflatex: str, tex_path: Path) -> None:
    subprocess.run(
        [pdflatex, "-interaction=nonstopmode", tex_path.name],
        cwd=str(tex_path.parent),
        check=True,
    )


def clean_aux(paper_dir: Path, stem: str) -> None:
    for ext in AUX_EXTS:
        f = paper_dir / f"{stem}{ext}"
        if f.exists():
            f.unlink()


def build(md_path: Path, pdflatex: str, keep_aux: bool) -> Path:
    paper_dir = md_path.parent
    stem = md_path.stem
    tex_path = paper_dir / f"{stem}.tex"
    pdf_path = paper_dir / f"{stem}.pdf"
    vendored_cls = paper_dir / CLS_SOURCE.name

    run_md_to_latex(md_path, tex_path)
    shutil.copy2(CLS_SOURCE, vendored_cls)
    try:
        run_pdflatex(pdflatex, tex_path)
        run_pdflatex(pdflatex, tex_path)  # second pass for refs
    finally:
        if vendored_cls.exists():
            vendored_cls.unlink()
        if not keep_aux:
            clean_aux(paper_dir, stem)

    if not pdf_path.exists():
        sys.exit(f"pdflatex completed but {pdf_path} not produced")
    return pdf_path


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("md_path", help="Path to the paper's .md source")
    ap.add_argument("--pdflatex", default=None, help="Explicit pdflatex executable")
    ap.add_argument("--keep-aux", action="store_true", help="Keep .aux/.log/.out files")
    args = ap.parse_args()

    md_path = Path(args.md_path).resolve()
    if not md_path.exists():
        sys.exit(f"Not found: {md_path}")
    if md_path.suffix != ".md":
        sys.exit(f"Expected a .md file, got {md_path.suffix}")

    pdflatex = find_pdflatex(args.pdflatex)
    pdf_path = build(md_path, pdflatex, args.keep_aux)
    size_kb = pdf_path.stat().st_size // 1024
    print(f"Built {pdf_path} ({size_kb} KB)")


if __name__ == "__main__":
    main()
