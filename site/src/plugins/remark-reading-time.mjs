// Remark plugin: sets each article's frontmatter.time from its word count, so the
// "Read Time" shown in the article header always matches the text. The count
// comes from the shared helper that scripts/gen-index.mjs also uses for
// projects_index.json.
import { readTime } from '../../scripts/lib/reading-time.mjs';

export function remarkReadingTime() {
  return function (_tree, file) {
    const astro = (file.data.astro ??= {});
    const frontmatter = (astro.frontmatter ??= {});
    frontmatter.time = readTime(String(file.value));
  };
}
