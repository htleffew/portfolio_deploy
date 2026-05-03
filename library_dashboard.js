// Library Dashboard Engine
// Handles state, filtering, sorting, and UI rendering for the Institutional Portfolio Dashboard

let projects = [];
let currentFilter = "All"; // Can be a Category or a Tag
let searchQuery = "";
let currentSort = "relevance";

const tableWrap = document.getElementById('tableWrap');
const noRes = document.getElementById('noResults');
const sInput = document.getElementById('searchInput');
const tagContainer = document.getElementById('tagContainer');
const sidebarAccordion = document.getElementById('sidebar-accordion');
const sortDropdown = document.getElementById('sortDropdown');

// Core Render Function
function renderDashboard() {
    // 1. Filter
    const qLower = searchQuery.toLowerCase();
    let filtered = projects.filter(p => {
        const matchTag = currentFilter === "All" || p.cat === currentFilter || (p.tags && p.tags.includes(currentFilter));
        const tagText = p.tags ? p.tags.join(" ").toLowerCase() : "";
        const matchText = p.title.toLowerCase().includes(qLower) || p.desc.toLowerCase().includes(qLower) || tagText.includes(qLower);
        return matchTag && matchText;
    });

    // 2. Sort
    if (currentSort === 'alpha') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (currentSort === 'relevance' && searchQuery.trim() !== "") {
        // Simple relevance: title match gets highest score
        filtered.sort((a, b) => {
            const aTitle = a.title.toLowerCase().includes(qLower) ? 1 : 0;
            const bTitle = b.title.toLowerCase().includes(qLower) ? 1 : 0;
            return bTitle - aTitle;
        });
    }

    // 3. Render
    tableWrap.innerHTML = '';
    let count = 0;

    filtered.forEach(p => {
        count++;
        const row = document.createElement('a');
        row.href = p.url;
        row.className = 'db-row';
        row.style.opacity = '0';
        row.style.transform = 'translateY(10px)';

        // Default geometric placeholder if no visual
        let thumbContent = '';
        if (p.visual && p.visual.trim() !== '') {
            thumbContent = p.visual;
        } else {
            // Generate a sleek default SVG based on category
            const hue = p.cat === 'Spokeo' ? '220' : (p.cat === 'TikTok USDS' ? '0' : '200');
            thumbContent = `<svg viewBox="0 0 100 100" style="width:100%; height:100%;"><rect width="100%" height="100%" fill="hsl(${hue}, 20%, 10%)" /><circle cx="50" cy="50" r="20" fill="none" stroke="hsl(${hue}, 40%, 50%)" stroke-width="2" opacity="0.5" /><line x1="0" y1="50" x2="100" y2="50" stroke="hsl(${hue}, 40%, 50%)" stroke-width="1" opacity="0.3"/></svg>`;
        }

        const tagMarkup = p.tags ? p.tags.slice(0, 3).map(t => `<span class="db-tag">${t}</span>`).join('') : '';

        row.innerHTML = `
            <div class="db-thumb">
                <div class="thumb-inner">${thumbContent}</div>
            </div>
            <div class="db-info">
                <div class="db-cat">${p.cat} <span style="opacity:0.4; margin:0 8px;">/</span> ${p.subtype}</div>
                <div class="db-title">${p.title}</div>
                <div class="db-desc">${p.desc}</div>
                <div class="db-tags-wrap">${tagMarkup}</div>
            </div>
            <div class="db-action">
                <div class="ar">&rarr;</div>
            </div>
        `;
        tableWrap.appendChild(row);
        gsap.to(row, { opacity: 1, y: 0, duration: 0.5, delay: count * 0.03, ease: 'power2.out' });
    });

    noRes.style.display = count === 0 ? 'block' : 'none';
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
}

function handleFilterChange(filterVal) {
    currentFilter = filterVal;
    
    // Update active states on sidebar
    document.querySelectorAll('.sb-item').forEach(el => el.classList.remove('active'));
    const sbMatch = document.querySelector(`.sb-item[data-filter="${filterVal}"]`);
    if(sbMatch) sbMatch.classList.add('active');

    // Update active states on chips
    document.querySelectorAll('.tag').forEach(el => el.classList.remove('active'));
    const chipMatch = document.querySelector(`.tag[data-filter="${filterVal}"]`);
    if(chipMatch) chipMatch.classList.add('active');

    renderDashboard();
    
    // Update URL
    const url = new URL(window.location);
    if (filterVal === "All") url.searchParams.delete("filter");
    else url.searchParams.set("filter", filterVal);
    window.history.pushState({}, '', url);
}

function buildUI() {
    // Determine Categories and Tags
    const categories = {};
    const tagCounts = {};

    projects.forEach(p => {
        // Group by category for sidebar
        if (!categories[p.cat]) categories[p.cat] = [];
        categories[p.cat].push(p);

        // Count tags for hot buttons
        if (p.tags) {
            p.tags.forEach(t => {
                if (t === p.cat || t === p.subtype) return; // Skip redundant tags
                tagCounts[t] = (tagCounts[t] || 0) + 1;
            });
        }
    });

    // 1. Build Sidebar Accordion
    sidebarAccordion.innerHTML = `
        <div class="sb-group">
            <div class="sb-item active" data-filter="All">All Research <span>${projects.length}</span></div>
        </div>
    `;

    Object.keys(categories).sort().forEach(cat => {
        const catGroup = document.createElement('div');
        catGroup.className = 'sb-group';
        
        let itemsHtml = categories[cat].map(p => `
            <a href="${p.url}" class="sb-link">${p.title}</a>
        `).join('');

        catGroup.innerHTML = `
            <div class="sb-header" data-filter="${cat}">${cat} <span>${categories[cat].length}</span></div>
            <div class="sb-drawer">
                ${itemsHtml}
            </div>
        `;
        sidebarAccordion.appendChild(catGroup);
    });

    // Sidebar Interactions
    sidebarAccordion.addEventListener('click', (e) => {
        const header = e.target.closest('.sb-header');
        if (header) {
            const drawer = header.nextElementSibling;
            const isOpen = drawer.style.maxHeight;
            // Close all
            document.querySelectorAll('.sb-drawer').forEach(d => d.style.maxHeight = null);
            document.querySelectorAll('.sb-header').forEach(h => h.classList.remove('open'));
            
            if (!isOpen) {
                drawer.style.maxHeight = drawer.scrollHeight + "px";
                header.classList.add('open');
            }
            handleFilterChange(header.getAttribute('data-filter'));
        }

        const item = e.target.closest('.sb-item');
        if (item) {
            handleFilterChange(item.getAttribute('data-filter'));
        }
    });

    // 2. Build Hot Buttons (Top 6 Tags)
    const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]).slice(0, 6);
    tagContainer.innerHTML = '';
    sortedTags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'tag';
        btn.setAttribute('data-filter', tag);
        btn.textContent = tag;
        btn.addEventListener('click', () => handleFilterChange(tag));
        tagContainer.appendChild(btn);
    });

    // 3. Bind Inputs
    sInput.addEventListener('keyup', (e) => {
        searchQuery = e.target.value;
        renderDashboard();
    });

    sortDropdown.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderDashboard();
    });

    // Initial Load
    const params = new URLSearchParams(window.location.search);
    const urlFilter = params.get('filter');
    if (urlFilter) handleFilterChange(urlFilter);
    else renderDashboard();
}

async function initLibrary() {
    try {
        const response = await fetch('projects_index.json');
        projects = await response.json();
        buildUI();
    } catch(e) {
        console.error("Failed to load library data.", e);
    }
}

document.addEventListener('DOMContentLoaded', initLibrary);
