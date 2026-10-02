# ATS resume build

Builds `site/public/resume_ats/Heather_Leffew_Resume_ATS.{pdf,docx}` from `resume.txt` (text of the styled resume) and `skills.txt` (Skills section of `site/public/resume.pdf`).

```sh
pip install python-docx
python3 tools/resume_ats/build.py      # writes resume_ats.html + .docx here
chromium --headless --no-sandbox --no-pdf-header-footer \
  --print-to-pdf=tools/resume_ats/Heather_Leffew_Resume_ATS.pdf file://$PWD/tools/resume_ats/resume_ats.html
pdffonts tools/resume_ats/Heather_Leffew_Resume_ATS.pdf   # must show no "Type 3"
pdftotext tools/resume_ats/Heather_Leffew_Resume_ATS.pdf - | less   # check reading order
```

Parse-safety rules (styling is otherwise free):
- Static font files only (Lora, Playfair Display from @fontsource, in `fonts/`). Variable fonts and any weight/style without its own file make Chromium emit Type 3 fonts, which ATS parsers misread.
- Contact info and each job's `Title | Company | Dates` on one text line; no tab- or space-aligned columns.
- Bullets are a literal `•` character, not CSS list markers.
- Hyphenated words are kept unbroken (`white-space:nowrap`); extractors drop a hyphen at a line break.
- DOCX uses Georgia (installed everywhere); fonts don't affect DOCX parsing.
