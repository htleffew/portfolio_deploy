#!/usr/bin/env python3
"""PreToolUse style gate for Heather Leffew's writing standard.

Blocks Write/Edit of externally facing prose that violates the CORE rules in
writing-standards (em/en dashes, banned vocabulary, negative parallelism, canned
sentence openers, canned significance markers).

Registered under a Write|Edit matcher. Reads the Claude Code hook payload from
stdin and emits a PreToolUse permission decision as JSON on stdout.

Banned vocabulary is loaded from banned_terms.txt, resolved in this order:
  1. $WRITING_STANDARD_DIR/tools/banned_terms.txt
  2. <project>/.claude/writing/tools/banned_terms.txt   (vendored copy)
  3. the file sitting next to this script
This keeps the hook and the commit linter reading the same token list.
"""
from __future__ import annotations

import json
import os
import re
import sys
from pathlib import Path

PROSE_SUFFIXES = {".md", ".mdx", ".markdown", ".tex", ".txt", ".rst"}
# HTML is prose only under content/article trees, never for app/component HTML.
PROSE_HTML_HINTS = ("articles/", "content/", "case-study", "/posts/", "/essays/")
SKIP_HINTS = ("node_modules/", ".git/", "/dist/", "/build/", "/.next/",
              "tests/fixtures/", "/__tests__/", ".claude/state/", ".claude/hooks/",
              # the standard itself and its vendored copies list banned terms as rules
              "writing-standards/", ".claude/writing/",
              # legacy source files retained for examples (see ROLLOUT.md)
              "_voice_audit/", "portfolio-design-system/voice")
# A file may opt out by containing this marker, or the superseded-source banner.
IGNORE_MARKERS = ("writing-standard:ignore", "SUPERSEDED — retained as source material")

DASH_RE = re.compile(r"[—–]")
OPENER_RE = re.compile(
    r"(?m)^\s*(?:[-*>#]+\s*)?(And|But|This)\b",
)
SIGNIFICANCE_RE = re.compile(
    r"\bthis (?:demonstrates|proves|shows)\b|\bthis is significant because\b"
    r"|\bit is worth noting that\b|\bclearly\b",
    re.IGNORECASE,
)


def load_banned_terms(project_dir: Path) -> list[str]:
    candidates = []
    env = os.environ.get("WRITING_STANDARD_DIR")
    if env:
        candidates.append(Path(env) / "tools" / "banned_terms.txt")
    candidates.append(project_dir / ".claude" / "writing" / "tools" / "banned_terms.txt")
    candidates.append(Path(__file__).resolve().parent / "banned_terms.txt")
    for c in candidates:
        try:
            if c.is_file():
                terms = []
                for line in c.read_text(encoding="utf-8").splitlines():
                    line = line.strip()
                    if line and not line.startswith("#"):
                        terms.append(line)
                if terms:
                    return terms
        except OSError:
            continue
    return []


def is_prose(rel: str) -> bool:
    low = rel.replace("\\", "/").lower()
    if any(h in low for h in SKIP_HINTS):
        return False
    suffix = Path(low).suffix
    if suffix in PROSE_SUFFIXES:
        return True
    if suffix in (".html", ".htm") and any(h in low for h in PROSE_HTML_HINTS):
        return True
    return False


def extract(payload: dict) -> tuple[str, str]:
    ti = payload.get("tool_input") or {}
    path = ti.get("file_path") or ti.get("path") or ""
    # Write -> content; Edit -> new_string; MultiEdit -> joined new strings.
    text = ti.get("content")
    if text is None:
        text = ti.get("new_string")
    if text is None and isinstance(ti.get("edits"), list):
        text = "\n".join(str(e.get("new_string", "")) for e in ti["edits"])
    return path, (text or "")


def find_violations(text: str, banned: list[str]) -> list[str]:
    out = []
    if DASH_RE.search(text):
        out.append("em-dash or en-dash (use commas, semicolons, parentheticals)")
    hits = sorted({m.group(0).lower() for t in banned
                   for m in re.finditer(r"\b" + re.escape(t) + r"\b", text, re.IGNORECASE)})
    if hits:
        out.append("banned vocabulary: " + ", ".join(hits))
    if OPENER_RE.search(text):
        out.append("sentence opener And/But/bare-This (However/Further/Though are fine)")
    if SIGNIFICANCE_RE.search(text):
        out.append("canned significance marker (clearly / this demonstrates / it is worth noting)")
    return out


def deny(reason: str) -> None:
    print(json.dumps({"hookSpecificOutput": {
        "hookEventName": "PreToolUse",
        "permissionDecision": "deny",
        "permissionDecisionReason": reason,
    }}))


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return 0  # not a hook payload; do not block
    project_dir = Path(payload.get("cwd") or os.environ.get("CLAUDE_PROJECT_DIR") or ".")
    path, text = extract(payload)
    if not path or not text or not is_prose(path):
        return 0
    if any(m in text for m in IGNORE_MARKERS):
        return 0
    banned = load_banned_terms(project_dir)
    violations = find_violations(text, banned)
    if violations:
        deny(
            "Writing standard (CORE) violations in "
            + os.path.basename(path) + ":\n- " + "\n- ".join(violations)
            + "\nFix these, then retry. Standard: writing-standards/CORE.md "
            "(+ the profile for this surface)."
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
