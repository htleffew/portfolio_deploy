#!/usr/bin/env bash
# Commit-time writing linter. Checks staged prose for CORE violations using the
# same banned_terms.txt the PreToolUse style gate uses.
# Usage: writing-lint.sh [file ...]   (no args => staged files)
# Exit 0 = clean, 1 = violations.
#
# Rules (revised 2026-06 from a ground-truth voice study of the author's own
# academic + Medium writing; see writing-standards/voice-analysis/00-SYNTHESIS.md):
#   - No em-dashes or en-dashes anywhere. Use commas, semicolons, parentheticals.
#   - Banned vocabulary is the ornamental/hype cluster only (banned_terms.txt).
#   - Do not OPEN a sentence with And, But, or a bare This. Connective openers
#     the author genuinely uses (However, Further, Additionally, Though, Despite,
#     Conversely) are allowed.
#   - Antithesis / "not X but Y" is an allowed, characteristic move (no longer
#     flagged); only hollow contentless contrast should be avoided, by judgment.
#   - Colons in prose may only introduce a true bulleted/numbered list. This is
#     enforced by the separate prose checker, not here, to avoid false positives
#     at commit time.
set -uo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
terms_file=""
for c in "${WRITING_STANDARD_DIR:-}/tools/banned_terms.txt" \
         "$here/banned_terms.txt" \
         "$here/../banned_terms.txt"; do
  [ -n "$c" ] && [ -f "$c" ] && { terms_file="$c"; break; }
done
mapfile -t BANNED < <(grep -vE '^[[:space:]]*(#|$)' "$terms_file" 2>/dev/null)

FILES=("$@")
if [ ${#FILES[@]} -eq 0 ]; then
  while IFS= read -r f; do FILES+=("$f"); done \
    < <(git diff --cached --name-only --diff-filter=ACMR -- '*.md' '*.mdx' '*.markdown' '*.tex' '*.rst' 2>/dev/null)
fi

violations=0
for file in "${FILES[@]}"; do
  [ -f "$file" ] || continue
  case "$file" in
    *node_modules/*|*/dist/*|*/build/*|*/.next/*|*tests/fixtures/*) continue ;;
    *writing-standards/*|*/.claude/writing/*|*_voice_audit/*|*portfolio-design-system/VOICE*) continue ;;
  esac
  if grep -qF -e "writing-standard:ignore" -e "retained as source material" "$file" 2>/dev/null; then
    continue
  fi
  if grep -qP '[\x{2014}\x{2013}]' "$file" 2>/dev/null; then
    echo "WRITING: em/en dash in $file (use commas, semicolons, or parentheticals)"; violations=$((violations+1))
  fi
  for term in "${BANNED[@]}"; do
    if grep -inwE "$term" "$file" >/dev/null 2>&1; then
      echo "WRITING: banned term '$term' in $file"; violations=$((violations+1))
    fi
  done
  if grep -qE "^[[:space:]]*([-*>#]+[[:space:]]*)?(And|But|This)\\b" "$file" 2>/dev/null; then
    echo "WRITING: banned sentence opener (And/But/bare-This) in $file"; violations=$((violations+1))
  fi
done

if [ "$violations" -gt 0 ]; then
  echo ""
  echo "$violations writing-standard violation(s). Fix before committing (or rerun with --no-verify only with a stated reason)."
  exit 1
fi
exit 0
