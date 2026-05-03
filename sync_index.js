const fs = require('fs');
const path = require('path');

const masterPath = path.join(__dirname, 'master_index.json');
const indexPath = path.join(__dirname, 'projects_index.json');

try {
  // Read the master source of truth
  const data = fs.readFileSync(masterPath, 'utf8');
  const projects = JSON.parse(data);
  
  // Filter out projects that do not have their corresponding HTML file present
  const liveProjects = projects.filter(project => {
    if (!project.url) return false;
    
    // Resolve the URL to an absolute path within the current directory
    const localPath = path.join(__dirname, project.url);
    
    // Verify physical existence
    return fs.existsSync(localPath);
  });
  
  // Write out the live, pruned index for the frontend to consume
  fs.writeFileSync(indexPath, JSON.stringify(liveProjects, null, 4));
  console.log(`[SYNC COMPLETE] ${liveProjects.length} out of ${projects.length} master projects are currently live.`);
} catch (error) {
  console.error("[SYNC FATAL ERROR] Failed to synchronize the index.", error);
  process.exit(1);
}
