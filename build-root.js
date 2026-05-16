const fs = require('fs');
const path = require('path');

const DEPLOY_DIR = __dirname;
const PROJECTS_INDEX = path.join(DEPLOY_DIR, 'projects_index.json');
const INDEX_TEMPLATE = path.join(DEPLOY_DIR, 'index.template.html');
const LIBRARY_TEMPLATE = path.join(DEPLOY_DIR, 'projects-repository.template.html');

const INDEX_OUTPUT = path.join(DEPLOY_DIR, 'index.html');
const LIBRARY_OUTPUT = path.join(DEPLOY_DIR, 'projects-repository.html');

function buildRootPages() {
  console.log('Building static root pages (SSG)...');

  if (!fs.existsSync(PROJECTS_INDEX)) {
    console.error(`ERROR: Could not find ${PROJECTS_INDEX}`);
    process.exit(1);
  }

  const projectsData = JSON.parse(fs.readFileSync(PROJECTS_INDEX, 'utf8'));
  
  // 1. Build Carousel HTML (Top 10 projects, deterministic)
  // Sort by date if available, otherwise just use order from index
  const featured = projectsData.slice(0, 10);
  let carouselHtml = '';
  
  featured.forEach(proj => {
    const url = proj.url || "#";
    const cat = proj.cat || 'RESEARCH';
    const title = proj.title;
    let desc = proj.desc || '';
    if(desc.length > 115) desc = desc.substring(0, 112) + '...';
    
    carouselHtml += `
        <a href="${url}" class="p-card">
          <div class="p-content">
            <div class="p-eyebrow">${cat}</div>
            <h3 class="p-title">${title}</h3>
            <p class="p-desc">${desc}</p>
            <span class="p-link">Read Case Study -></span>
          </div>
        </a>`;
  });

  // 2. Build Library Sidebar Accordion
  const categories = {};
  projectsData.forEach(p => {
    const c = p.cat || 'Uncategorized';
    if (!categories[c]) categories[c] = [];
    categories[c].push(p);
  });

  const orderedKeys = Object.keys(categories).sort();
  let sidebarHtml = '';

  orderedKeys.forEach((catKey, i) => {
    const count = categories[catKey].length;
    sidebarHtml += `
      <div class="db-acc-item">
        <button class="db-acc-trigger" aria-expanded="true">
          ${catKey} <span class="db-count">${count}</span>
        </button>
        <div class="db-acc-content" style="display:block;">
          <ul>
            ${categories[catKey].map(p => `<li><a href="#" class="db-filter-link" data-cat="${catKey}" data-title="${p.title}">${p.title}</a></li>`).join('')}
          </ul>
        </div>
      </div>`;
  });

  // 3. Build Library Table Rows
  let tableHtml = '';
  projectsData.forEach((p, i) => {
    let rawTags = p.tags || '';
    let tagsArr = [];
    if (typeof rawTags === 'string') {
      tagsArr = rawTags.split(',').map(t => t.trim()).filter(Boolean);
    } else if (Array.isArray(rawTags)) {
      tagsArr = rawTags;
    }
    const tagsHtml = tagsArr.map(t => `<span class="db-tag" data-tag="${t}">${t}</span>`).join('');
    const dateStr = p.date || '';

    // Data attributes are used by library_dashboard.js for filtering
    tableHtml += `
      <div class="db-row gs-reveal" data-cat="${p.cat || 'Uncategorized'}" data-title="${p.title.toLowerCase()}" data-tags="${tagsArr.join(',').toLowerCase()}">
        <div class="db-row-meta">
          <div class="db-row-cat">${p.cat || 'RESEARCH'}</div>
          ${dateStr ? `<div class="db-row-date">${dateStr}</div>` : ''}
        </div>
        <div class="db-row-main">
          <a href="${p.url}" class="db-row-title">${p.title}</a>
          <div class="db-row-desc">${p.desc || ''}</div>
          <div class="db-row-tags">${tagsHtml}</div>
        </div>
      </div>`;
  });

  // 4. Inject into index.template.html
  if (fs.existsSync(INDEX_TEMPLATE)) {
    let indexContent = fs.readFileSync(INDEX_TEMPLATE, 'utf8');
    indexContent = indexContent.replace(/\{\{CAROUSEL_INJECT\}\}/g, carouselHtml);
    fs.writeFileSync(INDEX_OUTPUT, indexContent, 'utf8');
    console.log(`✓ Generated ${INDEX_OUTPUT}`);
  } else {
    console.error(`ERROR: Could not find ${INDEX_TEMPLATE}`);
  }

  // 5. Inject into projects-repository.template.html
  if (fs.existsSync(LIBRARY_TEMPLATE)) {
    let libraryContent = fs.readFileSync(LIBRARY_TEMPLATE, 'utf8');
    libraryContent = libraryContent.replace(/\{\{SIDEBAR_CATEGORIES_INJECT\}\}/g, sidebarHtml);
    libraryContent = libraryContent.replace(/\{\{LIBRARY_TABLE_INJECT\}\}/g, tableHtml);
    fs.writeFileSync(LIBRARY_OUTPUT, libraryContent, 'utf8');
    console.log(`✓ Generated ${LIBRARY_OUTPUT}`);
  } else {
    console.error(`ERROR: Could not find ${LIBRARY_TEMPLATE}`);
  }

  console.log('SSG root pages build complete.');
}

buildRootPages();
