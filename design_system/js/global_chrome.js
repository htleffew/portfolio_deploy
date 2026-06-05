/* ============================================================
   global_chrome.js — App Shell Injector + SPA Router
   Injects topnav, footer, search overlay, film grain on every
   page. Owns the WebGL shader transition SPA router. Provides
   scoped onReady / onLoad helpers and the 3D tilt parallax via
   event delegation. Self-bootstraps on script execution.
   Extracted 2026-06-05 from global.js.
   ============================================================ */
/* === global_chrome.js === */
/**
 * Global Chrome Injector
 * Dynamically injects the global navigation, footer, and search modal.
 */

(function initGlobalChrome() {
    // Force scroll to top on every load or refresh
    const resetScrollToTop = () => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
        if (window.activeLenis && typeof window.activeLenis.scrollTo === 'function') {
            window.activeLenis.scrollTo(0, { immediate: true });
        }
    };
    resetScrollToTop();
    window.resetScrollToTop = resetScrollToTop;

    // Scoped helpers that handle the "listener registered after the event already
    // fired" case without monkey-patching EventTarget.prototype.addEventListener.
    //
    // The previous implementation globally rewrote addEventListener so that any
    // DOMContentLoaded or load handler registered on document/window after
    // readyState reached 'interactive'/'complete' was invoked via setTimeout(0)
    // with a synthetic event. That changed the semantics of addEventListener for
    // every consumer on the page (third-party scripts, page-specific widgets,
    // future code), which is risky and surprising. We replace the override with
    // two named helpers used internally by this file. External code that needs
    // the same behavior should call these directly rather than relying on a
    // hidden global side effect.
    if (!window._onReadyHelper) {
        const invokeWith = (listener, eventName, target) => {
            try {
                const evt = new Event(eventName);
                if (typeof listener === 'function')                listener.call(target, evt);
                else if (listener && typeof listener.handleEvent === 'function') listener.handleEvent(evt);
            } catch (e) {
                console.error('Error in deferred ' + eventName + ' listener:', e);
            }
        };
        // Fires once DOM is parsed; runs immediately if already ready.
        window.onReady = (listener) => {
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                setTimeout(() => invokeWith(listener, 'DOMContentLoaded', document), 0);
            } else {
                document.addEventListener('DOMContentLoaded', listener);
            }
        };
        // Fires once page is fully loaded (images, fonts); runs immediately if already loaded.
        window.onLoad = (listener) => {
            if (document.readyState === 'complete') {
                setTimeout(() => invokeWith(listener, 'load', window), 0);
            } else {
                window.addEventListener('load', listener);
            }
        };
        window._onReadyHelper = true;
    }

    // Calculate rootPathname robustly on initial load
    let rootPathname = '/';
    const gsScript = document.querySelector('script[src*="global.js"]');
    if (gsScript) {
        const src = gsScript.getAttribute('src');
        const tempAnchor = document.createElement('a');
        tempAnchor.href = src;
        const scriptAbsPath = tempAnchor.pathname;
        const dsIndex = scriptAbsPath.indexOf('design_system/js/global.js');
        if (dsIndex !== -1) {
            rootPathname = scriptAbsPath.substring(0, dsIndex);
        }
    }
    window.rootPathname = rootPathname;

    const getPathPrefixForUrl = (url) => {
        const tempAnchor = document.createElement('a');
        tempAnchor.href = url;
        const targetPathname = tempAnchor.pathname;
        if (targetPathname.startsWith(window.rootPathname)) {
            const relativePart = targetPathname.substring(window.rootPathname.length);
            const parts = relativePart.split('/');
            const depth = parts.length - 1;
            if (depth > 0) {
                return '../'.repeat(depth);
            }
        }
        return './';
    };

    const updateChromeHrefs = (prefix) => {
        const topnav = document.getElementById('topnav');
        if (topnav) {
            const brandLink = topnav.querySelector('.brand');
            if (brandLink) brandLink.setAttribute('href', prefix + 'index.html');
            
            const navLinks = topnav.querySelectorAll('.nav-links a');
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href) {
                    if (href.includes('about.html')) link.setAttribute('href', prefix + 'about.html');
                    else if (href.includes('projects-repository.html')) link.setAttribute('href', prefix + 'projects-repository.html');
                    else if (href.includes('resume.pdf')) link.setAttribute('href', prefix + 'resume.pdf');
                }
            });
        }
        
        const footer = document.querySelector('footer.site-foot');
        if (footer) {
            const footerLinks = footer.querySelectorAll('a');
            footerLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.includes('projects-repository.html')) {
                    link.setAttribute('href', prefix + 'projects-repository.html');
                }
            });
        }
        window.currentPathPrefix = prefix;
    };

    const executeScriptsQueue = async (scripts) => {
        for (const script of scripts) {
            const src = script.getAttribute('src');
            if (src) {
                const isGlobalOrLibrary = [
                    'global.js', 'global_chrome.js', 'three.min.js', 'three.js',
                    'gsap.min.js', 'gsap.js', 'ScrollTrigger.min.js', 'lenis.min.js',
                    'split-type', 'shader-transitions', 'simplex-noise'
                ].some(lib => src.includes(lib));
                if (isGlobalOrLibrary) {
                    continue;
                }
            }
            
            await new Promise((resolve) => {
                const newScript = document.createElement('script');
                Array.from(script.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });
                
                if (script.textContent.trim()) {
                    newScript.textContent = `(function(){\n${script.textContent}\n})();`;
                    document.body.appendChild(newScript);
                    newScript.parentNode?.removeChild(newScript);
                    resolve();
                } else if (src) {
                    newScript.onload = () => {
                        newScript.parentNode?.removeChild(newScript);
                        resolve();
                    };
                    newScript.onerror = () => {
                        newScript.parentNode?.removeChild(newScript);
                        resolve();
                    };
                    document.body.appendChild(newScript);
                } else {
                    resolve();
                }
            });
        }
    };

    // Determine the path prefix relative to this script
    const initialPrefix = getPathPrefixForUrl(window.location.href);
    let pathPrefix = initialPrefix;
    window.currentPathPrefix = initialPrefix;

    // 2.5 Inject Film Grain Overlay
    if (!document.getElementById('grain')) {
        const grain = document.createElement('div');
        grain.id = 'grain';
        grain.setAttribute('aria-hidden', 'true');
        document.body.insertBefore(grain, document.body.firstChild);
    }

    // 2.6 Canvases and atmosphere are owned exclusively by launchCinematicEngine().
    //     Do NOT inject them here — double-injection triggers competing WebGL
    //     render loops that corrupt uniform state and produce a black screen.

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
                    const res = await fetch(window.currentPathPrefix + 'projects_index.json');
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
                a.href = window.currentPathPrefix + p.url;
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
    window.populateRelatedWorks = () => {
        const recGrid = document.getElementById('recommendation-grid');
        const nextChapLink = document.getElementById('next-chap-link');
        const nextChapTitle = document.getElementById('next-chap-title');

        if (!recGrid && !nextChapLink) return;

        const currentPrefix = window.currentPathPrefix || pathPrefix;
        fetch(currentPrefix + 'projects_index.json')
            .then(res => res.json())
            .then(data => {
                // Identify current project by matching its url against the current path.
                const currentPath = window.location.pathname;
                let currentIdx = -1;
                let bestMatchLen = -1;
                data.forEach((p, i) => {
                    if (p.url && currentPath.indexOf(p.url) !== -1 && p.url.length > bestMatchLen) {
                        currentIdx = i;
                        bestMatchLen = p.url.length;
                    }
                });
                const current = currentIdx >= 0 ? data[currentIdx] : null;
                const otherProjects = data.filter((p, i) => i !== currentIdx);

                if (recGrid) {
                    recGrid.innerHTML = '';
                    const scored = otherProjects.map((p, i) => {
                        let score = 0;
                        if (current && Array.isArray(current.tags) && Array.isArray(p.tags)) {
                            const myTags = new Set(current.tags);
                            p.tags.forEach(t => { if (myTags.has(t)) score += 1; });
                        }
                        if (current && current.cat && p.cat && current.cat === p.cat) {
                            score += 0.5;
                        }
                        return { p, score, i };
                    });
                    scored.sort((a, b) => b.score - a.score || a.i - b.i);
                    const selected = scored.slice(0, 3).map(s => s.p);

                    selected.forEach(p => {
                        recGrid.innerHTML += `
                            <a class="r-card" href="${currentPrefix}${p.url}">
                                <div class="eb">${p.cat || 'Research'}</div>
                                <div class="ti">${p.title}</div>
                                <div class="ds">${(p.desc || '').substring(0, 80)}...</div>
                            </a>
                        `;
                    });
                }

                if (nextChapLink && nextChapTitle) {
                    let nextP = null;
                    if (currentIdx >= 0 && data.length > 1) {
                        nextP = data[(currentIdx + 1) % data.length];
                    } else {
                        nextP = otherProjects[0] || data[0];
                    }
                    if (nextP) {
                        nextChapLink.href = currentPrefix + nextP.url;
                        nextChapTitle.innerText = nextP.title;
                        const eb = nextChapLink.querySelector('.eb');
                        if (eb) eb.innerText = 'Next Publication / ' + (nextP.cat || 'Research');
                    }
                }
            })
            .catch(err => console.error("Failed to load related works", err));
    };
    window.populateRelatedWorks();

    // 7. Custom Magnetic Cursor removed per user request

    // 8. 3D Tilt Parallax for Cards Globally
    //    Implemented via event delegation rather than per-card listeners plus a
    //    body-wide MutationObserver: the previous version re-ran
    //    querySelectorAll('.p-card, .r-card, .edu-card, .bio-card') on every DOM
    //    mutation under document.body, which fired constantly during SPA scene
    //    swaps and reveal animations and compounded with the Three.js render
    //    loop into measurable scroll stutter.
    if (window.innerWidth > 768) {
        const TILT_SELECTOR = '.p-card, .r-card, .edu-card, .bio-card';
        document.body.addEventListener('mousemove', (e) => {
            const card = e.target && e.target.closest ? e.target.closest(TILT_SELECTOR) : null;
            if (!card) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * -3;
            const rotateY = ((x - rect.width  / 2) / (rect.width  / 2)) *  3;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
            card.style.transition = 'transform 0.1s ease-out';
        }, { passive: true });
        document.body.addEventListener('mouseout', (e) => {
            const card = e.target && e.target.closest ? e.target.closest(TILT_SELECTOR) : null;
            if (!card) return;
            // Only reset when the pointer is actually leaving the card (not moving between children).
            if (card.contains(e.relatedTarget)) return;
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.transition = 'transform 0.6s ease-out';
        }, { passive: true });
    }

    // 9. Generative UI Audio Feedback
    let audioCtx;
    const playClick = () => {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime); // higher, gentler frequency
        gain.gain.setValueAtTime(0.015, audioCtx.currentTime); // very subtle tap
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04); // shorter envelope
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.04);
    };
    document.addEventListener('click', (e) => {
        if (e.target.closest('button, a, .p-card, .bio-expand-btn, .r-card, .db-row')) playClick();
    });

    // 10. SPA Router with WebGL Shader Transitions
    let lastPathname = window.location.pathname;

    const transitionTo = async (href, pushState = true) => {
        // Check for Tweaker config
        const tweakerConfig = window.__TWEAKER_CONFIG || {};
        const shaderName = tweakerConfig.transitions?.shader || 'cinematic-zoom';
        const duration = tweakerConfig.transitions?.duration || 1.2;

        if (typeof HyperShader === 'undefined' || typeof gsap === 'undefined') {
             // Fallback
             window.location.href = href;
             return;
        }

        // Prepare DOM for WebGL capture: group current content
        let currentScene = document.getElementById('scene-current');
        if (!currentScene) {
            currentScene = document.createElement('div');
            currentScene.id = 'scene-current';
            currentScene.className = 'scene';
            // Move everything EXCEPT scripts/styles/canvases/grain/topnav/footer/search-overlay/progress into currentScene
            const children = Array.from(document.body.childNodes);
            children.forEach(child => {
                if (child.tagName === 'SCRIPT' || child.tagName === 'CANVAS' || child.id === 'grain' || child.id === 'glCanvas' || child.id === 'search-overlay' || child.id === 'topnav' || (child.classList && child.classList.contains('site-foot')) || child.tagName === 'FOOTER' || child.id === 'progress') return;
                currentScene.appendChild(child);
            });
            document.body.appendChild(currentScene);
        }

        // Clean up any existing next-scene to prevent duplicate overlap bugs
        const existingNext = document.getElementById('scene-next');
        if (existingNext) {
            existingNext.parentNode?.removeChild(existingNext);
        }

        const nextScene = document.createElement('div');
        nextScene.id = 'scene-next';
        nextScene.className = 'scene';
        nextScene.style.position = 'absolute';
        nextScene.style.top = '0';
        nextScene.style.left = '0';
        nextScene.style.width = '100%';
        nextScene.style.minHeight = '100vh';
        nextScene.style.opacity = '0';
        nextScene.style.zIndex = '50';
        nextScene.style.pointerEvents = 'none';
        document.body.appendChild(nextScene);

        try {
            // Fetch next page
            const res = await fetch(href);
            const html = await res.text();
            
            // Parse HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract body content
            const nextChildren = Array.from(doc.body.childNodes);
            nextChildren.forEach(child => {
                if (child.tagName === 'SCRIPT' || child.tagName === 'CANVAS' || child.id === 'grain' || child.id === 'glCanvas' || child.id === 'search-overlay' || child.id === 'topnav' || (child.classList && child.classList.contains('site-foot')) || child.tagName === 'FOOTER' || child.id === 'progress') return;
                nextScene.appendChild(document.importNode(child, true));
            });

            // Initialize HyperShader transition
            const tl = HyperShader.init({
                bgColor: '#030303',
                scenes: ['scene-current', 'scene-next'],
                transitions: [{
                    time: 0,
                    shader: shaderName,
                    duration: duration,
                    ease: 'power2.inOut'
                }]
            });

            tl.eventCallback('onComplete', async () => {
                // Kill active ScrollTriggers
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.getAll().forEach(t => t.kill());
                }
                
                // Destroy active Lenis
                if (window.activeLenis && typeof window.activeLenis.destroy === 'function') {
                    window.activeLenis.destroy();
                    window.activeLenis = null;
                }

                // Swap DOM
                if (currentScene.parentNode) {
                    currentScene.parentNode.removeChild(currentScene);
                }
                nextScene.id = 'scene-current';
                nextScene.style.position = '';
                nextScene.style.opacity = '1';
                nextScene.style.zIndex = '';
                nextScene.style.pointerEvents = '';

                // Hide preloader on SPA transition
                const nextPreloader = nextScene.querySelector('#preloader');
                if (nextPreloader) {
                    nextPreloader.style.display = 'none';
                }
                
                // Update URL & document title
                if (pushState) {
                    window.history.pushState({}, '', href);
                }
                document.title = doc.title;
                window.scrollTo(0, 0);
                lastPathname = window.location.pathname;

                // Update depth pathing on chrome elements
                const newPrefix = getPathPrefixForUrl(href);
                updateChromeHrefs(newPrefix);

                // Copy Page-Specific Styles from doc.head
                // Clean up previous dynamic styles first
                document.querySelectorAll('[data-spa-injected]').forEach(el => el.remove());

                // Find style/link tags in doc.head and append them to document.head
                const headStyles = Array.from(doc.head.querySelectorAll('style, link[rel="stylesheet"]'));
                headStyles.forEach(style => {
                    const hrefAttr = style.getAttribute('href');
                    if (hrefAttr && hrefAttr.includes('global.css')) {
                        return;
                    }
                    const newStyle = document.importNode(style, true);
                    newStyle.setAttribute('data-spa-injected', 'true');
                    document.head.appendChild(newStyle);
                });

                // Repopulate related works for the new page
                if (typeof window.populateRelatedWorks === 'function') {
                    window.populateRelatedWorks();
                }

                // Reset global orchestration default to allow target page's scripts to override it
                window.disableGlobalOrchestration = false;

                // Extract and execute page-specific scripts sequentially
                const scripts = Array.from(doc.body.querySelectorAll('script'));
                await executeScriptsQueue(scripts);

                // Re-run cinematic engine if needed
                if (typeof initCinematicEngine !== 'undefined') initCinematicEngine();

                // Re-trigger global orchestration if not disabled by target scripts
                if (!window.disableGlobalOrchestration) {
                    if (typeof window.initGlobalLenis === 'function') {
                        window.initGlobalLenis();
                    }
                    if (typeof window.initScrollProgress === 'function') {
                        window.initScrollProgress();
                    }
                    if (typeof window.initNavMode === 'function') {
                        window.initNavMode();
                    }
                    if (typeof window.initPageAnimations === 'function') {
                        window.initPageAnimations();
                    }
                }
            });

            tl.play();

        } catch (err) {
            console.error("SPA Fetch Error:", err);
            window.location.href = href;
        }
    };

    document.addEventListener('click', async (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http') || link.target === '_blank') return;
        
        // Prevent default navigation to trigger WebGL transition
        e.preventDefault();
        transitionTo(href, true);
    });

    window.addEventListener('popstate', () => {
        if (window.location.pathname === lastPathname) {
            return;
        }
        transitionTo(window.location.href, false);
    });

})();
