/* === cinematic_engine_v3.js === */
﻿/**
 * Cinematic WebGL Engine (Spatial Narrative)
 * 1. Raw GLSL Deep Space Starfield
 * 2. Three.js Particle Network with Morphing & ShaderMaterial Filaments
 */

const initCinematicEngine = () => {
    if (window._cinematicEngineInitialized) return;
    window._cinematicEngineInitialized = true;

    const canvas = document.getElementById('glCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // ── Design System Palette (mirrors global.css tokens exactly) ──────────
    const colPhthalo     = new THREE.Color(0x0F3A6B); // --phthalo
    const colPhthalolift = new THREE.Color(0x3866A0); // --phthalo-lift
    const colTungsten    = new THREE.Color(0xA1A1A6); // --tungsten
    const colFlare       = new THREE.Color(0xFFFFFF); // --flare

    // ── Renderer ────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0); // transparent bg — body #030303 shows through

    // ── Scene & Camera ───────────────────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 1, 2000);
    camera.position.z = 160;

    let W = 0, H = 0;
    const onResize = () => {
        W = window.innerWidth; H = window.innerHeight;
        renderer.setSize(W, H);
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);
    onResize();

    // ── Soft circle texture for round particles ──────────────────────────────
    const makeCircleTex = () => {
        const c = document.createElement('canvas');
        c.width = c.height = 64;
        const g = c.getContext('2d');
        const r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        r.addColorStop(0,   'rgba(255,255,255,1)');
        r.addColorStop(0.4, 'rgba(255,255,255,0.6)');
        r.addColorStop(1,   'rgba(255,255,255,0)');
        g.fillStyle = r;
        g.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(c);
    };
    const circleTex = makeCircleTex();

    // ── LAYER 1: Background Starfield ────────────────────────────────────────
    // 300 tiny static points across a large volume — pure atmosphere.
    // No connections, barely move, purely colour and depth.
    const STAR_N  = 300;
    const starPos = new Float32Array(STAR_N * 3);
    const starCol = new Float32Array(STAR_N * 3);
    for (let i = 0; i < STAR_N; i++) {
        starPos[i*3]   = (Math.random() - 0.5) * 600;
        starPos[i*3+1] = (Math.random() - 0.5) * 600;
        starPos[i*3+2] = (Math.random() - 0.5) * 300;
        // 35% flare white, 65% phthalo-lift → flare gradient for blue-white stars
        const isWhite = Math.random() < 0.35;
        const base    = isWhite
            ? colFlare.clone()
            : colPhthalolift.clone().lerp(colFlare, Math.random() * 0.6); // blue-to-white
        // Luminosity: 0.40–0.85 — much brighter, additive blend needs this to show through bands
        const lum = 0.40 + Math.random() * 0.45;
        starCol[i*3]   = base.r * lum;
        starCol[i*3+1] = base.g * lum;
        starCol[i*3+2] = base.b * lum;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color',    new THREE.BufferAttribute(starCol, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({
        size: 2.0, vertexColors: true, transparent: true, opacity: 1,
        blending: THREE.AdditiveBlending, depthWrite: false, map: circleTex
    })));

    // ── LAYER 2: Interactive Network Nodes ────────────────────────────────────
    // 60 larger, brighter points that drift, repel from mouse, and connect
    // with luminous filaments — the "neural network" over the starfield.
    const NODE_N  = 60;
    const nodePos = new Float32Array(NODE_N * 3);  // live positions (updated each frame)
    const nodeCol = new Float32Array(NODE_N * 3);
    const nodeVel = new Float32Array(NODE_N * 3);  // per-node drift velocity

    for (let i = 0; i < NODE_N; i++) {
        nodePos[i*3]   = (Math.random() - 0.5) * 240;
        nodePos[i*3+1] = (Math.random() - 0.5) * 240;
        nodePos[i*3+2] = (Math.random() - 0.5) * 80;
        nodeVel[i*3]   = (Math.random() - 0.5) * 0.04;
        nodeVel[i*3+1] = (Math.random() - 0.5) * 0.04;
        nodeVel[i*3+2] = (Math.random() - 0.5) * 0.01;
        // Phthalo-lift → flare: bright blue-white nodes, clearly visible
        const c   = colPhthalolift.clone().lerp(colFlare, Math.random() * 0.55);
        const lum = 0.80 + Math.random() * 0.20; // 0.80–1.0 full brightness
        nodeCol[i*3]   = c.r * lum;
        nodeCol[i*3+1] = c.g * lum;
        nodeCol[i*3+2] = c.b * lum;
    }
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3).setUsage(THREE.DynamicDrawUsage));
    nodeGeo.setAttribute('color',    new THREE.BufferAttribute(nodeCol, 3));
    const nodeMesh = new THREE.Points(nodeGeo, new THREE.PointsMaterial({
        size: 5.5, vertexColors: true, transparent: true, opacity: 0.95,
        blending: THREE.AdditiveBlending, depthWrite: false, map: circleTex
    }));
    scene.add(nodeMesh);

    // ── LAYER 3: Connection Filaments ─────────────────────────────────────────
    const MAX_SEG = 700;
    const segPos  = new Float32Array(MAX_SEG * 6);
    const segCol  = new Float32Array(MAX_SEG * 6);
    const segGeo  = new THREE.BufferGeometry();
    segGeo.setAttribute('position', new THREE.BufferAttribute(segPos, 3).setUsage(THREE.DynamicDrawUsage));
    segGeo.setAttribute('color',    new THREE.BufferAttribute(segCol, 3).setUsage(THREE.DynamicDrawUsage));
    scene.add(new THREE.LineSegments(segGeo, new THREE.LineBasicMaterial({
        vertexColors: true, transparent: true, opacity: 0.45,
        blending: THREE.AdditiveBlending, depthWrite: false
    })));

    // ── Mouse State ───────────────────────────────────────────────────────────
    let mX = 0, mY = 0;
    window.addEventListener('mousemove', e => {
        mX = (e.clientX / W) * 2 - 1;
        mY = -(e.clientY / H) * 2 + 1;
    });

    // ── Animation Loop ────────────────────────────────────────────────────────
    const CONNECT_D2  = 58 * 58;   // connection distance threshold (world units²)
    const MOUSE_D2    = 70 * 70;   // mouse repulsion radius²
    const nAttr       = nodeGeo.attributes.position;
    const baseC       = colPhthalo.clone();
    const highC       = colPhthalolift.clone();

    const animate = () => {
        requestAnimationFrame(animate);

        // Camera parallax follows mouse — gentle, cinematic
        camera.position.x += (mX * 22 - camera.position.x) * 0.035;
        camera.position.y += (mY * 22 - camera.position.y) * 0.035;
        camera.lookAt(0, 0, 0);

        // Mouse world-space position (project to z=0 plane at camera z 160)
        const mWX = mX * 110, mWY = mY * 110;

        let si = 0; // segment index

        for (let i = 0; i < NODE_N; i++) {
            let x = nAttr.getX(i), y = nAttr.getY(i), z = nAttr.getZ(i);

            // Drift
            x += nodeVel[i*3]; y += nodeVel[i*3+1]; z += nodeVel[i*3+2];

            // Mouse repulsion
            const dmx = x - mWX, dmy = y - mWY;
            const dm2 = dmx*dmx + dmy*dmy;
            if (dm2 < MOUSE_D2) {
                const f = (MOUSE_D2 - dm2) / MOUSE_D2 * 0.0035;
                const a = Math.atan2(dmy, dmx);
                nodeVel[i*3]   += Math.cos(a) * f;
                nodeVel[i*3+1] += Math.sin(a) * f;
            }

            // Velocity damping
            nodeVel[i*3]   *= 0.979;
            nodeVel[i*3+1] *= 0.979;
            nodeVel[i*3+2] *= 0.992;

            // Soft boundary reflection
            if (x >  120 || x < -120) { nodeVel[i*3]   *= -1; x = Math.max(-120, Math.min(120, x)); }
            if (y >  120 || y < -120) { nodeVel[i*3+1] *= -1; y = Math.max(-120, Math.min(120, y)); }
            if (z >   40 || z <  -40) { nodeVel[i*3+2] *= -1; z = Math.max( -40, Math.min( 40, z)); }

            nAttr.setXYZ(i, x, y, z);

            // Build connection segments to j > i (avoid duplicates)
            for (let j = i + 1; j < NODE_N; j++) {
                if (si >= MAX_SEG) break;
                const jx = nAttr.getX(j), jy = nAttr.getY(j), jz = nAttr.getZ(j);
                const dx = x - jx, dy = y - jy, dz = z - jz;
                const d2 = dx*dx + dy*dy + dz*dz;
                if (d2 > CONNECT_D2) continue;

                const t = 1.0 - d2 / CONNECT_D2;          // 0→1 proximity factor
                // Mid-point distance from mouse → glow boost
                const midX = (x+jx)*0.5, midY = (y+jy)*0.5;
                const md2  = (midX-mWX)*(midX-mWX) + (midY-mWY)*(midY-mWY);
                const glow = md2 < MOUSE_D2 ? (1.0 - md2/MOUSE_D2) * 0.65 : 0;

                const c   = baseC.clone().lerp(highC, Math.min(1.0, t + glow));
                const lum = Math.pow(t, 1.8) * 0.55 + glow;

                segPos[si*6]   = x;  segPos[si*6+1] = y;  segPos[si*6+2] = z;
                segPos[si*6+3] = jx; segPos[si*6+4] = jy; segPos[si*6+5] = jz;
                segCol[si*6]   = c.r*lum; segCol[si*6+1] = c.g*lum; segCol[si*6+2] = c.b*lum;
                segCol[si*6+3] = c.r*lum; segCol[si*6+4] = c.g*lum; segCol[si*6+5] = c.b*lum;
                si++;
            }

            // Mouse-to-node filaments (only when very close)
            if (si < MAX_SEG && dm2 < MOUSE_D2 * 0.45) {
                const alpha = 1.0 - dm2 / (MOUSE_D2 * 0.45);
                const lum   = alpha * 0.75;
                segPos[si*6]   = x;    segPos[si*6+1] = y;    segPos[si*6+2] = z;
                segPos[si*6+3] = mWX;  segPos[si*6+4] = mWY;  segPos[si*6+5] = 0;
                segCol[si*6]   = highC.r*lum; segCol[si*6+1] = highC.g*lum; segCol[si*6+2] = highC.b*lum;
                segCol[si*6+3] = highC.r*lum; segCol[si*6+4] = highC.g*lum; segCol[si*6+5] = highC.b*lum;
                si++;
            }
        }

        nAttr.needsUpdate = true;
        segGeo.setDrawRange(0, si * 2);
        segGeo.attributes.position.needsUpdate = true;
        segGeo.attributes.color.needsUpdate    = true;

        // Imperceptibly slow global rotation for ambient depth
        nodeMesh.rotation.y += 0.00025;
        renderer.render(scene, camera);
    };

    animate();
};

// --- Self-bootstrapping cinematic launcher ---------------------------------
// Injects #glCanvas if absent, loads Three.js (only dep needed), then fires
// initCinematicEngine. Pages need zero manual script or canvas declarations.
(function launchCinematicEngine() {
    if (!document.getElementById('glCanvas')) {
        const gc = document.createElement('canvas');
        gc.id = 'glCanvas';
        document.body.insertBefore(gc, document.body.firstChild);
    }

    if (typeof THREE !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCinematicEngine);
        } else {
            initCinematicEngine();
        }
        return;
    }

    // Only Three.js core — postprocessing chain is no longer used.
    const loadSeq3 = (urls, cb) => {
        if (!urls.length) { cb(); return; }
        const s = document.createElement('script');
        s.src = urls[0];
        s.onload  = () => loadSeq3(urls.slice(1), cb);
        s.onerror = () => loadSeq3(urls.slice(1), cb);
        document.head.appendChild(s);
    };

    const readyThenInit = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initCinematicEngine);
        } else {
            initCinematicEngine();
        }
    };

    loadSeq3(['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'], readyThenInit);
})();


/* === global_chrome.js === */
/**
 * Global Chrome Injector
 * Dynamically injects the global navigation, footer, and search modal.
 */

(function initGlobalChrome() {
    // Force scroll to top on every load or refresh
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Override addEventListener to execute DOMContentLoaded and load callbacks immediately if readyState is complete/interactive
    if (!window._addEventListenerOverridden) {
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            if (this === document && type === 'DOMContentLoaded') {
                if (document.readyState === 'complete' || document.readyState === 'interactive') {
                    setTimeout(() => {
                        try {
                            if (typeof listener === 'function') {
                                listener.call(this, new Event('DOMContentLoaded'));
                            } else if (listener && typeof listener.handleEvent === 'function') {
                                listener.handleEvent(new Event('DOMContentLoaded'));
                            }
                        } catch (e) {
                            console.error("Error in deferred DOMContentLoaded listener:", e);
                        }
                    }, 0);
                    return;
                }
            }
            if (this === window && type === 'load') {
                if (document.readyState === 'complete') {
                    setTimeout(() => {
                        try {
                            if (typeof listener === 'function') {
                                listener.call(this, new Event('load'));
                            } else if (listener && typeof listener.handleEvent === 'function') {
                                listener.handleEvent(new Event('load'));
                            }
                        } catch (e) {
                            console.error("Error in deferred load listener:", e);
                        }
                    }, 0);
                    return;
                }
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
        window._addEventListenerOverridden = true;
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
    if (window.innerWidth > 768) {
        const attachTilt = () => {
            document.querySelectorAll('.p-card, .r-card, .edu-card, .bio-card').forEach(card => {
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
        const tiltObserver = new MutationObserver(attachTilt);
        tiltObserver.observe(document.body, { childList: true, subtree: true });
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





// ==========================================
// GLOBAL CINEMATIC REVEAL ORCHESTRATION
// Self-bootstrapping: dynamically loads GSAP + companions if absent.
// Pages need ZERO additional script tags beyond global.js.
// ==========================================
(function mountOrchestration() {
    const gsapDeps = [
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
        'https://cdn.jsdelivr.net/gh/studio-freight/lenis@1.0.29/bundled/lenis.min.js',
        'https://unpkg.com/split-type',
        'https://cdn.jsdelivr.net/npm/@hyperframes/shader-transitions@0.4.45/dist/index.global.js'
    ];

    const alreadyLoaded = (url) => {
        if (url.includes('gsap.min')      && typeof gsap !== 'undefined')          return true;
        if (url.includes('ScrollTrigger') && typeof ScrollTrigger !== 'undefined') return true;
        if (url.includes('lenis')         && typeof Lenis !== 'undefined')         return true;
        if (url.includes('split-type')    && typeof SplitType !== 'undefined')     return true;
        if (url.includes('shader-transitions') && typeof HyperShader !== 'undefined') return true;
        return false;
    };

    const loadSeq = (urls, cb) => {
        if (!urls.length) { cb(); return; }
        if (alreadyLoaded(urls[0])) { loadSeq(urls.slice(1), cb); return; }
        const s = document.createElement('script');
        s.src = urls[0];
        s.onload  = () => loadSeq(urls.slice(1), cb);
        s.onerror = () => loadSeq(urls.slice(1), cb);
        document.head.appendChild(s);
    };

    window.ensureDependenciesLoaded = (cb) => {
        loadSeq(gsapDeps, cb);
    };

    window.initGlobalLenis = () => {
        window.ensureDependenciesLoaded(() => {
            if (window.activeLenis) {
                if (typeof window.activeLenis.destroy === 'function') {
                    window.activeLenis.destroy();
                }
                window.activeLenis = null;
            }
            
            if (typeof Lenis !== 'undefined') {
                const lenis = new Lenis({
                    duration: 1.4,
                    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                    smoothWheel: true
                });
                window.activeLenis = lenis;
                
                if (typeof gsap !== 'undefined') {
                    if (!window._gsapTickerAdded) {
                        gsap.ticker.add((time) => {
                            if (window.activeLenis && typeof window.activeLenis.raf === 'function') {
                                window.activeLenis.raf(time * 1000);
                            }
                        });
                        gsap.ticker.lagSmoothing(0);
                        window._gsapTickerAdded = true;
                    }
                } else {
                    const raf = (time) => {
                        if (window.activeLenis === lenis) {
                            lenis.raf(time);
                            requestAnimationFrame(raf);
                        }
                    };
                    requestAnimationFrame(raf);
                }
            }
        });
    };

    window.initScrollProgress = () => {
        if (window._scrollProgressInitialized) {
            if (typeof window.recalculateScrollProgress === 'function') {
                window.recalculateScrollProgress();
            }
            return;
        }
        window._scrollProgressInitialized = true;

        let cachedScrollHeight = document.documentElement.scrollHeight - window.innerHeight;

        window.recalculateScrollProgress = () => {
            setTimeout(() => {
                cachedScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const p = cachedScrollHeight > 0 ? (window.scrollY / cachedScrollHeight) * 100 : 0;
                const progEl = document.getElementById('progress');
                if (progEl) progEl.style.setProperty('--p', p + '%');
            }, 100);
        };

        window.addEventListener('resize', () => {
            cachedScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        });
        window.addEventListener('scroll', () => {
            const p = cachedScrollHeight > 0 ? (window.scrollY / cachedScrollHeight) * 100 : 0;
            const progEl = document.getElementById('progress');
            if (progEl) progEl.style.setProperty('--p', p + '%');
        }, { passive: true });

        window.recalculateScrollProgress();
    };

    window.initNavMode = () => {
        if (window.navModeObserver) {
            window.navModeObserver.disconnect();
        }

        try {
            const nav = document.getElementById('topnav');
            if (!nav) return;
            const bands = document.querySelectorAll('[data-mode], .band--paper, .band--dark');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const isPaper = entry.target.classList.contains('band--paper') || entry.target.dataset.mode === 'paper';
                        nav.classList.toggle('is-paper', isPaper);
                    }
                });
            }, { rootMargin: "-15% 0px -84% 0px" });
            
            bands.forEach(b => observer.observe(b));
            window.navModeObserver = observer;
            
            // Initial paint check
            const center = window.innerHeight * 0.15;
            bands.forEach(b => {
                const r = b.getBoundingClientRect();
                if (r.top <= center && r.bottom > center) {
                    const isPaper = b.classList.contains('band--paper') || b.dataset.mode === 'paper';
                    nav.classList.toggle('is-paper', isPaper);
                }
            });
        } catch(e) {
            console.warn("initNavMode error:", e);
        }
    };

    window.initPageAnimations = () => {
        window.ensureDependenciesLoaded(() => {
            if (typeof gsap === 'undefined') {
                const pre = document.getElementById('preloader');
                if (pre) pre.style.display = 'none';
                document.querySelectorAll(
                    '.meta-row span, h1, .hero-rule, .abstract, #glCanvas, ' +
                    '.scroll-cue, .band .section-eyebrow, .band .section-heading, .type-block, ' +
                    '.swatch-grid, .tagrow, .p-card, .r-card, .demo-box, .dashboard-layout, .reveal, .ds-prose'
                ).forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
                return;
            }

            if (typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
                ScrollTrigger.refresh();
            }

            const tl = gsap.timeline({
                onComplete: () => {
                    if (typeof ScrollTrigger !== 'undefined') {
                        ScrollTrigger.refresh();
                        initScrollTriggers();
                    }
                }
            });

            const preloader = document.getElementById('preloader');
            const preLeft   = document.getElementById('preloader-left');
            const preRight  = document.getElementById('preloader-right');
            const preLine   = document.getElementById('preloader-line');
            if (preloader && preloader.style.display !== 'none') {
                tl.to(preLine,  { height: '28vh', duration: 0.55, ease: 'power2.inOut' })
                  .to(preLine,  { opacity: 0, height: '50vh', duration: 0.3, ease: 'power2.in' }, '+=0.075')
                  .to(preLeft,  { xPercent: -100, duration: 0.55, ease: 'power3.inOut' }, '-=0.125')
                  .to(preRight, { xPercent:  100, duration: 0.55, ease: 'power3.inOut' }, '<')
                  .set(preloader, { display: 'none' });
            }

            tl.to('#glCanvas', { opacity: 1, duration: 1.5, ease: 'power2.inOut' }, '-=0.3');

            let split;
            const heroTitle = document.querySelector('.hero h1');
            if (heroTitle && typeof SplitType !== 'undefined') {
                heroTitle.style.opacity = 1;
                split = new SplitType(heroTitle, { types: 'words, chars' });
            }

            tl.to('#topnav', { y: 0, duration: 1.4, ease: 'power3.out' }, '-=2.8');

            const metaSpans = gsap.utils.toArray('.meta-row span');
            if (metaSpans.length) tl.to(metaSpans, { opacity: 1, x: 0, duration: 1.0, stagger: 0.2, ease: 'power2.out' }, '-=2.2');
            if (split) {
                tl.from(split.chars, { opacity: 0, y: 20, rotateX: -90, stagger: 0.04, duration: 1.5, ease: 'back.out(1.5)' }, '-=1.6');
            }
            const heroRule = document.querySelector('.hero-rule');
            if (heroRule) tl.to(heroRule,   { width: 64, opacity: 1, duration: 1.3, ease: 'power3.inOut' }, '-=1.0');

            const frontTitle = document.querySelector('.front h1');
            if (frontTitle && !heroTitle) {
                tl.fromTo(frontTitle,
                    { opacity: 0, y: 28 },
                    { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' },
                    '-=2.0'
                );
            } else if (frontTitle && heroTitle) {
                tl.to(frontTitle, { opacity: 1, duration: 1.0, ease: 'power2.out' }, '-=0.5');
            }

            const abstractEl = document.querySelector('.abstract');
            if (abstractEl) tl.to(abstractEl, { opacity: 1, y: 0, duration: 1.3, ease: 'power2.out' }, '-=0.9');
            const scrollCue = document.querySelector('.scroll-cue');
            if (scrollCue) tl.to(scrollCue,  { opacity: 1, duration: 1.2, ease: 'power2.out' }, '-=0.3');


            function initScrollTriggers() {
                gsap.to('.scroll-cue', {
                    opacity: 0, y: -10, duration: 0.6, ease: 'power2.in',
                    scrollTrigger: { trigger: '.hero, .front', start: 'top top', end: '+=120', scrub: true }
                });
                gsap.utils.toArray('.band').forEach(band => {
                    const tlBand = gsap.timeline({
                        scrollTrigger: { trigger: band, start: 'top 75%', toggleActions: 'play none none none' }
                    });
                    const eyebrow = band.querySelector('.section-eyebrow');
                    const heading = band.querySelector('.section-heading');
                    if (eyebrow) tlBand.fromTo(eyebrow, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out' });
                    if (heading) tlBand.fromTo(heading, { opacity: 0, y: 25  }, { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' }, '-=0.6');
                    const reveals = band.querySelectorAll('.type-block, .swatch-grid, .tagrow, .p-card, .r-card, .demo-box, .dashboard-layout, .reveal, .ds-prose, .bio-card, .project-carousel, .view-all-link, .edu-card, .headshot-frame');
                    if (reveals.length) {
                        tlBand.fromTo(reveals, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.5, stagger: 0.15, ease: 'expo.out' }, '-=0.8');
                    }
                });
                gsap.utils.toArray('.reveal, .ds-prose').forEach(el => {
                    gsap.fromTo(el, { opacity: 0, y: 40 }, {
                        opacity: 1, y: 0, duration: 1.2, ease: 'expo.out',
                        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
                    });
                });
                
                // Centralized parallax scroll effect
                gsap.utils.toArray('.band').forEach(band => {
                  const inner = band.querySelector('.col-wide') || band.querySelector('.bio-wrap') || band.querySelector('.dashboard-layout');
                  if (inner) {
                    gsap.fromTo(inner, { yPercent: 2 }, {
                      yPercent: -2, ease: 'none',
                      scrollTrigger: { trigger: band, start: 'top bottom', end: 'bottom top', scrub: true }
                    });
                  }
                });
            }
        });
    };

    // Self-bootstrapping call for normal pages
    if (!window.disableGlobalOrchestration) {
        if (document.readyState === 'complete') {
            window.initGlobalLenis();
            window.initScrollProgress();
            window.initNavMode();
            window.initPageAnimations();
        } else {
            window.addEventListener('load', () => {
                window.initGlobalLenis();
                window.initScrollProgress();
                window.initNavMode();
                window.initPageAnimations();
            });
        }
    }
})();
