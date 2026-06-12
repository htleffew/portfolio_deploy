// Static Library Dashboard Engine
// Filters and sorts pre-rendered HTML DOM elements (SSG) for 100% SEO compliance.

// Run-now-or-on-ready: binding only on DOMContentLoaded made the dashboard
// silently dead whenever this script executed after the DOM was already
// parsed (e.g. dynamic injection). Idempotent guard included.
function initLibraryDashboard() {
    if (window._libraryDashboardInitialized) return;
    window._libraryDashboardInitialized = true;
    const searchInput = document.getElementById('searchInput');
    const sortDropdown = document.getElementById('sortDropdown');
    const tableWrap = document.getElementById('tableWrap');
    const noRes = document.getElementById('noResults');
    const rows = Array.from(document.querySelectorAll('.db-row'));
    
    let currentCategoryFilter = "All";
    let searchQuery = "";
    let currentSort = "relevance";

    function renderDashboard() {
        let visibleCount = 0;
        const qLower = searchQuery.toLowerCase();

        // 1. Filter rows
        const visibleRows = [];
        rows.forEach(row => {
            const cat = row.getAttribute('data-cat') || '';
            const title = row.getAttribute('data-title') || '';
            const tags = row.getAttribute('data-tags') || '';

            const matchCat = (currentCategoryFilter === "All" || cat === currentCategoryFilter);
            const matchText = (title.includes(qLower) || tags.includes(qLower) || cat.toLowerCase().includes(qLower));

            if (matchCat && matchText) {
                visibleRows.push(row);
                row.style.display = 'flex'; // Assuming flex layout for rows
                // Reset GSAP styles to make them visible immediately after filtering
                row.style.opacity = '1';
                row.style.transform = 'none';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        // 2. Sort visible rows
        if (currentSort === 'alpha') {
            visibleRows.sort((a, b) => {
                const titleA = a.getAttribute('data-title') || '';
                const titleB = b.getAttribute('data-title') || '';
                return titleA.localeCompare(titleB);
            });
        } else if (currentSort === 'relevance' && searchQuery.trim() !== "") {
            visibleRows.sort((a, b) => {
                const titleA = (a.getAttribute('data-title') || '').includes(qLower) ? 1 : 0;
                const titleB = (b.getAttribute('data-title') || '').includes(qLower) ? 1 : 0;
                return titleB - titleA; // Higher score comes first
            });
        }

        // 3. Re-append in sorted order
        visibleRows.forEach(row => tableWrap.appendChild(row));

        // 4. Update No Results state
        if (noRes) {
            noRes.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        // (ScrollTrigger.refresh() removed: no row-level triggers exist anymore,
        // and refreshing on every keystroke forced needless full-page layout.)
    }

    function setCategoryFilter(cat) {
        currentCategoryFilter = cat;
        // Update URL
        const url = new URL(window.location);
        if (cat === "All") url.searchParams.delete("filter");
        else url.searchParams.set("filter", cat);
        window.history.replaceState({}, '', url);
        renderDashboard();
    }

    // Bind Search
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderDashboard();
        });
    }

    // Bind Sort
    if (sortDropdown) {
        sortDropdown.addEventListener('change', (e) => {
            currentSort = e.target.value;
            renderDashboard();
        });
    }

    // Bind Sidebar Accordions & Links
    document.querySelectorAll('.sb-header').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            const btn = e.currentTarget;
            const content = btn.nextElementSibling;
            
            // Extract category name by removing the span count
            const clone = btn.cloneNode(true);
            const span = clone.querySelector('span');
            if(span) clone.removeChild(span);
            const catName = clone.textContent.trim();
            
            setCategoryFilter(catName);

            // Toggle drawer using CSS transition max-height
            const isClosed = content.style.maxHeight === '0px' || (content.style.maxHeight === '' && window.getComputedStyle(content).maxHeight === '0px');
            if (isClosed) {
                content.style.maxHeight = '1000px';
                btn.setAttribute('aria-expanded', 'true');
            } else {
                content.style.maxHeight = '0px';
                btn.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Check URL for initial filter
    const params = new URLSearchParams(window.location.search);
    const urlFilter = params.get('filter');
    if (urlFilter) {
        setCategoryFilter(urlFilter);
    }

    // Per-row GSAP reveal removed 2026-06-12. It hid every publication row
    // (opacity 0) and re-revealed each one on its own ScrollTrigger plus a
    // compounding i*0.05s delay, while institutional.js's preloader curtain
    // and hero cascade ran on a different clock (window load) — the visible
    // result was stuttering, misordered row pop-in. An index should render
    // its rows immediately; the page-level hero reveal provides the entrance.
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLibraryDashboard);
} else {
    initLibraryDashboard();
}
