const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const deployDir = __dirname;
const layoutPath = path.join(deployDir, 'design_system', 'ssg-layout.html');

if (!fs.existsSync(layoutPath)) {
    console.error("[BUILD FATAL ERROR] Cannot find ssg-layout.html");
    process.exit(1);
}

const layoutTemplate = fs.readFileSync(layoutPath, 'utf8');

console.log("[BUILD] Starting Markdown SSG compilation...");

// 1. Discover Content
const subdirs = fs.readdirSync(deployDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.') && dirent.name !== 'design_system' && dirent.name !== 'node_modules')
    .map(dirent => dirent.name);

subdirs.forEach(dir => {
    const dirPath = path.join(deployDir, dir);
    const files = fs.readdirSync(dirPath);
    
    // Look for markdown file
    const mdFile = files.find(f => f.endsWith('.md') && !f.toLowerCase().includes('readme'));
    
    if (mdFile) {
        console.log(`[BUILD] Compiling ${dir}/${mdFile}...`);
        const mdPath = path.join(dirPath, mdFile);
        const mdContent = fs.readFileSync(mdPath, 'utf8');
        
        // 2. Parse Frontmatter and Markdown
        const parsed = matter(mdContent);
        const data = parsed.data;
        const markdownBody = parsed.content;
        
        // 3. Process Sections (split by H2)
        // We use a regex to split the text. 
        // Note: this assumes standard ## formatting at the start of a line.
        const sectionsRaw = markdownBody.split(/\n(?=## )/g);
        
        let htmlContent = '';
        let sectionCount = 1;
        
        sectionsRaw.forEach((sectionRaw, index) => {
            const trimmed = sectionRaw.trim();
            if (!trimmed) return;
            
            // Determine band color
            const isReference = trimmed.toLowerCase().startsWith('## references') || trimmed.toLowerCase().startsWith('## bibliography');
            let bandClass = isReference ? 'band--paper' : (sectionCount % 2 === 0 ? 'band--dark' : 'band--paper');
            
            // Extract H2 for spine/section naming
            let sectionTitle = `Section ${sectionCount}`;
            const titleMatch = trimmed.match(/^##\s+(.*)/m);
            if (titleMatch) {
                sectionTitle = titleMatch[1].trim();
            } else if (index === 0 && !trimmed.startsWith('##')) {
                sectionTitle = "Introduction";
            }
            
            // Parse Markdown to HTML
            // We use standard marked to compile the text inside the section
            let sectionHtml = marked.parse(trimmed);
            
            // Add custom reveal/dropcap classes heuristically
            // Replace the first <p> with a dropcap if it's the first section
            if (index === 0 || sectionCount === 1) {
                sectionHtml = sectionHtml.replace('<p>', '<p class="has-dropcap reveal col-with-sidenotes">');
            }
            sectionHtml = sectionHtml.replace(/<p>/g, '<p class="reveal">');
            sectionHtml = sectionHtml.replace(/<h2>/g, `<div class="eyebrow reveal">0${sectionCount} / ${sectionTitle}</div>\n<h2 class="reveal is-chapter">`);
            
            htmlContent += `
<!-- SECTION ${sectionCount}: ${sectionTitle} -->
<section class="band ${bandClass}" data-spine="${sectionTitle.substring(0, 20)}" data-section="${sectionTitle}">
  <div class="col-wide markdown-body">
    ${sectionHtml}
  </div>
</section>
`;
            if (!isReference) sectionCount++;
        });
        
        // 4. Inject into Layout
        let finalHtml = layoutTemplate;
        
        // Replace layout vars (defaulting if frontmatter is missing)
        finalHtml = finalHtml.replace(/{{TITLE}}/g, data.title || dir);
        finalHtml = finalHtml.replace(/{{CATEGORY}}/g, data.category || "Research");
        finalHtml = finalHtml.replace(/{{SHORT_TITLE}}/g, data.short_title || dir);
        finalHtml = finalHtml.replace(/{{FORMAT}}/g, data.format || "CASE STUDY");
        finalHtml = finalHtml.replace(/{{SUBCATEGORY}}/g, data.subcategory || "Analysis");
        finalHtml = finalHtml.replace(/{{HEADLINE}}/g, data.headline || data.title || dir);
        finalHtml = finalHtml.replace(/{{ABSTRACT}}/g, data.abstract || data.description || "");
        finalHtml = finalHtml.replace(/{{SUBJECT}}/g, data.subject || "N/A");
        finalHtml = finalHtml.replace(/{{ARCHITECTURE}}/g, data.architecture || "N/A");
        finalHtml = finalHtml.replace(/{{OUTPUT}}/g, data.output || "N/A");
        
        // Inject content
        finalHtml = finalHtml.replace('{{CONTENT}}', htmlContent);
        
        // Inject scripts (if any scripts are defined in frontmatter or raw HTML)
        const scripts = data.scripts || "";
        finalHtml = finalHtml.replace('{{SCRIPTS}}', scripts);
        
        // Determine relative path depth to root for CSS/JS
        const relativePrefix = "../"; // Assuming 1 level deep (Folder_Name/file.html)
        finalHtml = finalHtml.replace(/\.\.\/portfolio_deploy\//g, relativePrefix);
        
        // 5. Write HTML File
        const outFileName = mdFile.replace('.md', '.html');
        const outPath = path.join(dirPath, outFileName);
        fs.writeFileSync(outPath, finalHtml);
        
        console.log(`[BUILD] Wrote ${outPath}`);
    }
});

console.log("[BUILD] SSG compilation complete.");
