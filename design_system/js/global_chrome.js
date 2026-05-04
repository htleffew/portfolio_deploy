/**
 * Global Chrome Injector
 * Dynamically injects the global navigation, footer, and search modal.
 */

(function initGlobalChrome() {
    // 1. Determine relative depth to root (portfolio_deploy/)
    const pathDepth = window.location.pathname.split('/').length - 2; // Rough heuristic
    // A better heuristic is to check if we are in a subdirectory by looking for index.html or known root files.
    // However, if we assume any page in a subdirectory is exactly 1 level deep (e.g. ADOS/clinical-validation.html),
    // and root pages are 0 levels deep.
    // Let's use a simpler heuristic based on document URI relative to 'portfolio_deploy'
    
    // Safer relative path detection:
    const isRoot = window.location.pathname.endsWith('index.html') && !window.location.pathname.includes('/') || 
                   window.location.pathname.split('/').pop() === 'index.html' && window.location.pathname.split('/').slice(-2)[0] !== 'ADOS' && window.location.pathname.split('/').slice(-2)[0] !== 'AI_Equity_Framework' ||
                   !window.location.pathname.includes('/') ||
                   window.location.pathname.endsWith('projects-repository.html');
                   
    // Let's use a reliable way: count slashes after the domain. But locally file:/// paths are tricky.
    // Alternative: We can just use a relative script tag src to determine path prefix.
    const scripts = document.getElementsByTagName('script');
    let pathPrefix = './';
    for (let i = 0; i < scripts.length; i++) {
        const src = scripts[i].getAttribute('src');
        if (src && src.includes('global_chrome.js')) {
            pathPrefix = src.replace('design_system/js/global_chrome.js', '');
            break;
        }
    }
    
    // Fallback if empty
    if (!pathPrefix) pathPrefix = './';

    // 2. Inject CSS
    const cssId = 'global-chrome-css';
    if (!document.getElementById(cssId)) {
        const head  = document.getElementsByTagName('head')[0];
        const link  = document.createElement('link');
        link.id   = cssId;
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = pathPrefix + 'design_system/css/global_chrome.css';
        link.media = 'all';
        head.appendChild(link);
    }

    // 2.5 Inject Film Grain Overlay
    if (!document.getElementById('grain')) {
        const grain = document.createElement('div');
        grain.id = 'grain';
        grain.setAttribute('aria-hidden', 'true');
        document.body.insertBefore(grain, document.body.firstChild);
    }

    // 2.8 Custom Cursor logic removed per user request

    // 3. Construct and Inject Top Navigation
    if (!document.getElementById('topnav')) {
        const header = document.createElement('header');
        header.id = 'topnav';
        
        // Wait, some pages might have a body data-mode="paper" which needs .is-paper class. 
        // For simplicity, we just inject the dark header, and let existing scroll observer (if any) handle .is-paper
        
        header.innerHTML = `
            <a href="${pathPrefix}index.html" class="brand">Dr. Heather Leffew</a>
            <div class="nav-links">
                <button id="trigger-search">Search</button>
                <a href="${pathPrefix}about.html">About</a>
                <a href="${pathPrefix}projects-repository.html">Research Library</a>
                <a href="${pathPrefix}resume.pdf" target="_blank" class="nav-btn">Resume -></a>
            </div>
        `;
        document.body.insertBefore(header, document.body.firstChild);
    }

    // 4. Construct and Inject Footer
    if (!document.querySelector('footer.site-foot')) {
        const footer = document.createElement('footer');
        footer.className = 'site-foot';
        footer.innerHTML = `
            <div class="lf">Dr. Heather Leffew &copy; 2026</div>
            <div style="display:flex;gap:24px;" class="rt">
                <a href="${pathPrefix}projects-repository.html">Research Library</a>
                <a href="https://linkedin.com/in/heathertleffew" target="_blank">LinkedIn</a>
            </div>
        `;
        document.body.appendChild(footer);
    }

    // 5. Construct and Inject Search Modal
    if (!document.getElementById('search-overlay')) {
        const searchOverlay = document.createElement('div');
        searchOverlay.id = 'search-overlay';
        searchOverlay.innerHTML = `
            <button id="search-close">Close [X]</button>
            <div id="search-input-container">
                <input type="text" id="search-input" placeholder="Search architecture, case studies, frameworks..." autocomplete="off">
            </div>
            <div id="search-results"></div>
        `;
        document.body.appendChild(searchOverlay);

        // Search Logic
        const searchTrigger = document.getElementById('trigger-search');
        const searchClose = document.getElementById('search-close');
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        
        let projectsData = [];
        let isDataLoaded = false;

        const openSearch = async () => {
            searchOverlay.classList.add('is-active');
            searchInput.focus();
            
            // Lazy load the projects index
            if (!isDataLoaded) {
                try {
                    const res = await fetch(pathPrefix + 'projects_index.json');
                    if (res.ok) {
                        projectsData = await res.json();
                        isDataLoaded = true;
                    }
                } catch(e) {
                    console.error("Failed to load search index", e);
                }
            }
        };

        const closeSearch = () => {
            searchOverlay.classList.remove('is-active');
            searchInput.value = '';
            searchResults.innerHTML = '';
        };

        const renderResults = (results) => {
            searchResults.innerHTML = '';
            if (results.length === 0 && searchInput.value.trim() !== '') {
                searchResults.innerHTML = `<div style="color:var(--tungsten); font-family:var(--mono); text-align:center; margin-top:40px;">No results found for "${searchInput.value}"</div>`;
                return;
            }
            
            results.forEach(p => {
                const a = document.createElement('a');
                a.href = pathPrefix + p.url;
                a.className = 'search-result-item';
                a.innerHTML = `
                    <div class="search-result-cat">${p.cat || 'Research'}</div>
                    <div class="search-result-title">${p.title}</div>
                    <div class="search-result-desc">${p.desc.substring(0, 140)}...</div>
                `;
                searchResults.appendChild(a);
            });
        };

        const handleSearch = (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query === '') {
                searchResults.innerHTML = '';
                return;
            }
            
            const results = projectsData.filter(p => {
                const titleMatch = (p.title || '').toLowerCase().includes(query);
                const descMatch = (p.desc || '').toLowerCase().includes(query);
                const catMatch = (p.cat || '').toLowerCase().includes(query);
                const tagsMatch = p.tags ? p.tags.some(t => t.toLowerCase().includes(query)) : false;
                return titleMatch || descMatch || catMatch || tagsMatch;
            });
            
            renderResults(results);
        };

        if (searchTrigger) searchTrigger.addEventListener('click', openSearch);
        searchClose.addEventListener('click', closeSearch);
        searchInput.addEventListener('input', handleSearch);
        
        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('is-active')) {
                closeSearch();
            }
        });
    }

    // 6. Populate Related Works and Next Publication
    const recGrid = document.getElementById('recommendation-grid');
    const nextChapLink = document.getElementById('next-chap-link');
    const nextChapTitle = document.getElementById('next-chap-title');

    if (recGrid || nextChapLink) {
        fetch(pathPrefix + 'projects_index.json')
            .then(res => res.json())
            .then(data => {
                // Determine current project id from URL
                const currentPath = window.location.pathname;
                const otherProjects = data.filter(p => !currentPath.includes(p.url.split('/').pop()));
                
                if (recGrid) {
                    recGrid.innerHTML = '';
                    // Pick 3 random or top projects
                    const shuffled = otherProjects.sort(() => 0.5 - Math.random());
                    const selected = shuffled.slice(0, 3);
                    
                    selected.forEach(p => {
                        recGrid.innerHTML += `
                            <a class="r-card" href="${pathPrefix}${p.url}">
                                <div class="eb">${p.cat || 'Research'}</div>
                                <div class="ti">${p.title}</div>
                                <div class="ds">${p.desc.substring(0, 80)}...</div>
                            </a>
                        `;
                    });
                }

                if (nextChapLink && nextChapTitle) {
                    // Just pick the first from the other projects (or could be next in index)
                    const nextP = otherProjects[0] || data[0];
                    if (nextP) {
                        nextChapLink.href = pathPrefix + nextP.url;
                        nextChapTitle.innerText = nextP.title;
                        const eb = nextChapLink.querySelector('.eb');
                        if (eb) eb.innerText = 'Next Publication / ' + (nextP.cat || 'Research');
                    }
                }
            })
            .catch(err => console.error("Failed to load related works", err));
    }

    // 7. Custom Magnetic Cursor removed per user request

    // 8. 3D Tilt Parallax for Cards Globally
    if (window.innerWidth > 768) {
        const attachTilt = () => {
            document.querySelectorAll('.p-card, .r-card, .edu-card, .bio-card, .db-row, .figure .frame').forEach(card => {
                if(card.dataset.tiltBound) return;
                card.dataset.tiltBound = "1";
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -3; 
                    const rotateY = ((x - centerX) / centerX) * 3;
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
                    card.style.transition = 'transform 0.1s ease-out';
                });
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
                    card.style.transition = 'transform 0.6s ease-out';
                });
            });
        };
        attachTilt();
        setInterval(attachTilt, 1000);
    }

    // 9. Generative UI Audio Feedback
    let audioCtx;
    const playClick = () => {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.02, audioCtx.currentTime); // subtle
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
    };
    document.addEventListener('click', (e) => {
        if (e.target.closest('button, a, .p-card, .bio-expand-btn, .r-card, .db-row')) playClick();
    });

    // 10. View Transitions API Navigation Intercept
    // Dynamically assign 'portal-card' view-transition-name to the clicked card before navigating
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.p-card, .r-card, .db-row');
        if (!card) return;
        
        // If it's a link, we assign the transition name to it right before the browser navigates
        const href = card.getAttribute('href') || (card.tagName === 'A' ? card.href : null);
        if (href && !href.startsWith('#') && !href.startsWith('mailto:')) {
            card.classList.add('is-transitioning-portal');
            // The browser natively handles the cross-document transition via the CSS @view-transition rule
        }
    });

})();
