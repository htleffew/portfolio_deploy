# Citations & Academic Rigor
> **Target Standard**: Full APA Formatting for both inline citations and reference blocks.

The portfolio is an academic and institutional-grade resource. Intellectual honesty and rigorous attribution are mandatory.

## 1. The Active Research Requirement
When drafting or refactoring a case study, you must actively verify and generate correct citations.
- If a methodology, statistical theorem, architectural concept, or psychological heuristic is mentioned (e.g., "Positive-Unlabeled Learning", "XGBoost", "Cohen's d"), you must search the internet to find the correct, canonical academic paper or origin source.
- **Zero Hallucination:** Never hallucinate a citation. If you cannot find the canonical source, state the concept without a citation rather than faking one.

## 2. Inline/In-Text Citations
All claims regarding external research, algorithms, or theories must be cited inline using APA formatting.
- **Format:** `(Author, Year)` or `(Author et al., Year)`.
- **Example:** "By moving the evaluation unit away from the isolated attribute and onto the link between the entity and the attribute, the architecture mathematically preserves epistemic doubt (Elkan & Noto, 2008)."

## 3. The References Block
Every case study that includes inline citations must conclude with a dedicated `References` section in the HTML file, positioned directly before the `</main>` closing tag.

### HTML Structure
```html
<section class="band band--paper" data-spine="References" data-section="References">
    <div class="eyebrow">XX / Bibliography</div>
    <h2>References</h2>
    <div class="report-prose">
        <ul style="list-style-type:none; padding:0; margin-top:24px; font-family:var(--body); font-size:16px;">
            <li style="margin-bottom:16px; padding-left:36px; text-indent:-36px;">
                Elkan, C., & Noto, K. (2008). Learning classifiers from only positive and unlabeled data. In <em>Proceedings of the 14th ACM SIGKDD international conference on Knowledge discovery and data mining</em> (pp. 213-220).
            </li>
        </ul>
    </div>
</section>
```
- Entries must be alphabetized.
- Entries must use a hanging indent (`padding-left:36px; text-indent:-36px;`).
- Journal/Conference titles should be italicized.
