const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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
    
    // Look for primary HTML file (usually name-matching or first HTML)
    const htmlFile = files.find(f => f.endsWith('.html'));
    
    if (htmlFile) {
        const relativeUrl = `${dir}/${htmlFile}`;
        
        if (!existingUrls.has(relativeUrl)) {
            console.log(`[DEPLOY] Found new project: ${relativeUrl}`);
            
            // 3. Extract Metadata
            const htmlContent = fs.readFileSync(path.join(dirPath, htmlFile), 'utf8');
            
            // Extract Title
            const titleMatch = htmlContent.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
            const title = titleMatch ? titleMatch[1].trim().replace(/<[^>]+>/g, '') : dir;
            
            // Extract Description
            const descMatch = htmlContent.match(/<p[^>]*class="abstract"[^>]*>([\s\S]*?)<\/p>/i);
            const desc = descMatch ? descMatch[1].trim().replace(/\s+/g, ' ').replace(/<[^>]+>/g, '') : "Interactive mathematical telemetry simulator and architectural case study.";
            
            // Extract Meta Row
            let subtype = dir.toUpperCase();
            let tags = ["Data Science"];
            let time = "5 min read";
            
            const metaMatch = htmlContent.match(/<div class="meta-row">[\s\S]*?<span class="bracket">.*?<\/span>[\s\S]*?<span class="sep">\/<\/span>[\s\S]*?<span>(.*?)<\/span>[\s\S]*?<span class="sep">\/<\/span>[\s\S]*?<span>(.*?)<\/span>[\s\S]*?<span class="sep">\/<\/span>[\s\S]*?<span>(.*?)<\/span>/i);
            
            if (metaMatch) {
                const rawTag = metaMatch[1].replace(/&amp;/g, '&').trim();
                tags.push(rawTag);
                subtype = metaMatch[2].trim().toUpperCase();
                time = metaMatch[3].trim();
            }
            
            // Extract Visual (empty by default, unless specific pattern is desired, 
            // but normally it's populated via manual edit in master if complex SVGs are needed)
            const visual = ""; 

            const newProject = {
                id: dir,
                title: title,
                desc: desc,
                cat: "Research & Architecture",
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
