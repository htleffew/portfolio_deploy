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
- Contact info on one text line. Jobs stack `Title` over `Company | Dates`; never push dates to the right margin with tabs or spaces.
- Links (contact, research titles) are real `<a href>` / DOCX hyperlinks; URLs live in `CONTACT` and `RESEARCH_LINKS` in build.py.
- Bullets are a literal `•` character, not CSS list markers.
- Hyphenated words are kept unbroken (`white-space:nowrap`); extractors drop a hyphen at a line break.
- DOCX uses Georgia (installed everywhere); fonts don't affect DOCX parsing.
