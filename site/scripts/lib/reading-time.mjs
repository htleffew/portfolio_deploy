// Shared read-time calculation. One implementation serves both consumers so the
// article header and the library index can never disagree:
//   - src/plugins/remark-reading-time.mjs sets frontmatter.time at render time;
//   - scripts/gen-index.mjs writes the same value into projects_index.json.
// Read time is the reader-facing word count of the MDX source divided by
// WORDS_PER_MINUTE, rounded, with a one-minute floor.
export const WORDS_PER_MINUTE = 230;

// Reduce raw MDX source to the words a reader actually reads: drop frontmatter,
// fenced code, import/export lines, script/style/svg blocks, JSX and HTML tags,
// link and image targets, and HTML entities.
export function readableText(mdxSource) {
  return String(mdxSource)
    .replace(/^---[\s\S]*?\n---\s*\n/, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^\s*(?:import|export)\s.*$/gm, ' ')
    .replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\]\([^)]*\)/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ');
}

export function countWords(mdxSource) {
  return readableText(mdxSource)
    .split(/\s+/)
    .filter((token) => /[A-Za-z0-9]/.test(token)).length;
}

export function readTime(mdxSource) {
  const minutes = Math.max(1, Math.round(countWords(mdxSource) / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}
