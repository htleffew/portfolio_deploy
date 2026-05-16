# publishing/

Canonical toolkit for building preprint PDFs and arxiv submission bundles
from markdown sources. Used by paper repos under `repos/claude-*-analysis`
and any future Obelus Institute preprint.

## What's here

| File | Purpose |
|------|---------|
| `obelus-preprint.cls` | LaTeX document class for the preprint format (Times-like serif body, sans-serif heads, 1-inch margins, author-year citations, optional `referee`/`lineno`/`twocolumn`/`numbib` options). Standalone — uses only standard LaTeX packages. |
| `md_to_latex.py` | Markdown → LaTeX converter. Handles the subset used in the papers: headers, bold/italic, inline code, tables, lists, links, inline math, block quotes, horizontal rules, and the title block. |
| `build_paper.py` | End-to-end builder: takes a paper's `.md`, produces the `.tex` and `.pdf` in the same directory. Vendors the class in for the compile and cleans up aux files afterward. |
| `build_arxiv_bundle.py` | Packages a paper's `.tex` + class + any `.bib` + `figures/` into a `tar.gz` ready for arxiv or PsyArXiv upload. |

## Usage

Build a paper PDF:

```
python portfolio_deploy/publishing/build_paper.py \
  repos/claude-sleep-analysis/paper/leffew_2026_care-without-consent.md
```

This writes `leffew_2026_care-without-consent.tex` and
`leffew_2026_care-without-consent.pdf` next to the `.md`.

Bundle for arxiv submission:

```
python portfolio_deploy/publishing/build_arxiv_bundle.py \
  repos/claude-sleep-analysis/paper/leffew_2026_care-without-consent.tex \
  --out submissions/
```

This writes `submissions/leffew_2026_care-without-consent-arxiv.tar.gz`
containing the `.tex`, `obelus-preprint.cls`, any `.bib` file in the same
directory, and the contents of an adjacent `figures/` folder if present.

## Conventions

- Paper filenames: `leffew_YYYY_short-title.{md,tex,pdf}`. The author prefix
  matters when the PDF is downloaded from the portfolio site as a hosted
  attachment, and the year keeps citations stable across reruns.
- Paper repos hold `.md` (source of truth), `.tex` (generated), `.pdf`
  (compiled). The `.cls` is not vendored into paper repos; it lives here
  and is copied in only during the build.
- The Markdown converter assumes a leading title block in the form:

  ```
  # Title

  **Optional subtitle**

  Author Name
  Affiliation
  email

  *Draft preprint date*

  ---

  ## First section ...
  ```

## Dependencies

- Python 3.10+
- A LaTeX distribution providing `pdflatex` (MiKTeX on Windows, TeX Live
  elsewhere). `build_paper.py` auto-discovers MiKTeX at the default
  install location; pass `--pdflatex /path/to/pdflatex` to override.

## Extending the class

Edits to typography, spacing, citation style, or new options go in
`obelus-preprint.cls`. After editing, rebuild any active paper to confirm
the change compiles. There are no vendored copies elsewhere to sync.
