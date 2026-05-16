const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const matter = require('gray-matter');

const deployDir = __dirname;
const masterPath = path.join(deployDir, 'master_index.json');
const indexPath = path.join(deployDir, 'projects_index.json');

console.log("[DEPLOY] Starting unified deployment pipeline...");

// 1. Read Master Index
let masterData = [];
if (fs.existsSync(masterPath)) {
    try {
        masterData = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
    } catch (e) {
        console.error("[DEPLOY FATAL ERROR] Could not parse master_index.json");
        process.exit(1);
    }
}

const existingUrls = new Set(masterData.map(p => p.url).filter(Boolean));
let newProjectsAdded = [];

// 2. Discover Content
const subdirs = fs.readdirSync(deployDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
    .map(dirent => dirent.name);

subdirs.forEach(dir => {
    const dirPath = path.join(deployDir, dir);
    const files = fs.readdirSync(dirPath);
    
    // Look for primary Markdown file to extract metadata, but keep URL pointing to the HTML output
    const mdFile = files.find(f => f.endsWith('.md') && !f.toLowerCase().includes('readme'));
    const htmlFile = files.find(f => f.endsWith('.html') && !f.toLowerCase().includes('readme'));
    
    if (mdFile && htmlFile) {
        const relativeUrl = `${dir}/${htmlFile}`;
        
        if (!existingUrls.has(relativeUrl)) {
            console.log(`[DEPLOY] Found new project: ${relativeUrl}`);
            
            // 3. Extract Metadata from Markdown Frontmatter
            const mdContent = fs.readFileSync(path.join(dirPath, mdFile), 'utf8');
            const parsed = matter(mdContent);
            const data = parsed.data;
            
            const title = data.title || dir;
            const desc = data.description || data.abstract || "Interactive mathematical telemetry simulator and architectural case study.";
            const subtype = data.format || data.subcategory || dir.toUpperCase();
            
            let tags = data.tags || ["Data Science"];
            if (!Array.isArray(tags)) {
                tags = [tags];
            }
            if (data.category && !tags.includes(data.category)) {
                tags.push(data.category);
            }
            
            const time = data.time || "5 min read";
            const visual = data.visual || ""; 

            const newProject = {
                id: dir,
                title: title,
                desc: desc,
                cat: data.category || "Research & Architecture",
                subtype: subtype,
                tags: tags,
                url: relativeUrl,
                time: time,
                visual: visual
            };
            
            masterData.push(newProject);
            existingUrls.add(relativeUrl);
            newProjectsAdded.push(dir);
        }
    }
});

// 4. Save Master Index
if (newProjectsAdded.length > 0) {
    fs.writeFileSync(masterPath, JSON.stringify(masterData, null, 4));
    console.log(`[DEPLOY] Added ${newProjectsAdded.length} new projects to master_index.json`);
}

// 5. Synchronize Live Index
const liveProjects = masterData.filter(project => {
    if (!project.url) return false;
    const localPath = path.join(deployDir, project.url);
    return fs.existsSync(localPath);
});

fs.writeFileSync(indexPath, JSON.stringify(liveProjects, null, 4));
console.log(`[DEPLOY] Synchronized index. ${liveProjects.length} out of ${masterData.length} master projects are live.`);

// 6. Git Push Automation
try {
    console.log("[DEPLOY] Staging changes...");
    execSync('git add .', { stdio: 'inherit' });
    
    const commitMessage = newProjectsAdded.length > 0 
        ? `Auto-deploy updates: Added ${newProjectsAdded.join(', ')}`
        : "Auto-deploy updates: Index sync";
        
    console.log(`[DEPLOY] Committing: "${commitMessage}"`);
    try {
        execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    } catch (e) {
        // git commit throws if there are no changes to commit.
        console.log("[DEPLOY] No changes to commit.");
        process.exit(0);
    }
    
    console.log("[DEPLOY] Pushing to remote...");
    execSync('git push', { stdio: 'inherit' });
    
    console.log("[DEPLOY] Deployment pipeline completed successfully!");
} catch (error) {
    console.error("[DEPLOY FATAL ERROR] Git deployment failed.", error.message);
    process.exit(1);
}
