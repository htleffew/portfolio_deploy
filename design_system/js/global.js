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
    // 0. Scroll restoration is handled by Lenis + GSAP preloader sequence.
    //    Do NOT force scrollTo(0,0) here — it fights with the cinematic
    //    loading timeline and causes visible page jumps.

    // 1. Determine relative depth to root (portfolio_deploy/)
    const pathDepth = window.location.pathname.split('/').length - 2; // Rough heuristic
    // A better heuristic is to check if we are in a subdirectory by looking for index.html or known root files.
    // However, if we assume any page in a subdirectory is exactly 1 level deep (e.g. ADOS/clinical-validation.html),
    // and root pages are 0 levels deep.
    // Let's use a simpler heuristic based on document URI relative to 'portfolio_deploy'
    
    const isRoot = window.location.pathname.endsWith('index.html') && !window.location.pathname.includes('/') || 
                   window.location.pathname.split('/').pop() === 'index.html' && window.location.pathname.split('/').slice(-2)[0] !== 'ADOS' ||
                   !window.location.pathname.includes('/') ||
                   window.location.pathname.endsWith('projects-repository.html');
                     // Determine the path prefix relative to this script
    let pathPrefix = './';
    const gsScript = document.querySelector('script[src*="global.js"]');
    if (gsScript) {
        const src = gsScript.getAttribute('src');
        const dsIndex = src.indexOf('design_system/js/global.js');
        if (dsIndex !== -1) {
            pathPrefix = src.substring(0, dsIndex);
        }
    }
    if (!pathPrefix) pathPrefix = './';

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

    // 10. SPA Router with WebGL Shader Transitions
    document.addEventListener('click', async (e) => {
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http') || link.target === '_blank') return;
        
        // Prevent default navigation to trigger WebGL transition
        e.preventDefault();

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
            // Move everything EXCEPT scripts/styles/canvases/grain into currentScene
            const children = Array.from(document.body.childNodes);
            children.forEach(child => {
                if (child.tagName === 'SCRIPT' || child.tagName === 'CANVAS' || child.id === 'grain' || child.id === 'glCanvas' || child.id === 'search-overlay') return;
                currentScene.appendChild(child);
            });
            document.body.appendChild(currentScene);
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
                if (child.tagName === 'SCRIPT' || child.tagName === 'CANVAS' || child.id === 'grain' || child.id === 'glCanvas') return;
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

            tl.eventCallback('onComplete', () => {
                // Swap DOM
                if (currentScene.parentNode) {
                    currentScene.parentNode.removeChild(currentScene);
                }
                nextScene.id = 'scene-current';
                nextScene.style.position = '';
                nextScene.style.opacity = '1';
                nextScene.style.zIndex = '';
                nextScene.style.pointerEvents = '';
                
                // Update URL
                window.history.pushState({}, '', href);
                window.scrollTo(0, 0);

                // Run orchestration manually
                if (typeof initCinematicEngine !== 'undefined') initCinematicEngine();
                // We don't re-run mountOrchestration as it's an IIFE, but we can trigger DOMContentLoaded
                const event = new Event('DOMContentLoaded');
                document.dispatchEvent(event);
            });

            tl.play();

        } catch (err) {
            console.error("SPA Fetch Error:", err);
            window.location.href = href;
        }
    });

})();





// ==========================================
// GLOBAL CINEMATIC REVEAL ORCHESTRATION
// Self-bootstrapping: dynamically loads GSAP + companions if absent.
// Pages need ZERO additional script tags beyond global.js.
// ==========================================
(function mountOrchestration() {
    if (window.disableGlobalOrchestration) return;

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

    const runOrchestration = () => {
        // Guard against the timing race: if GSAP loaded dynamically and
        // window.load already fired, addEventListener('load') will never
        // trigger. Run the timeline immediately in that case.
        const doTimeline = () => {

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

            if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

            if (typeof Lenis !== 'undefined') {
                const lenis = new Lenis({ duration: 1.4, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
                gsap.ticker.add(time => lenis.raf(time * 1000));
                gsap.ticker.lagSmoothing(0);
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
            if (preloader && preLeft && preRight && preLine) {
                tl.to(preLine,  { height: '28vh', duration: 1.1, ease: 'power2.inOut' })
                  .to(preLine,  { opacity: 0, height: '50vh', duration: 0.6, ease: 'power2.in' }, '+=0.15')
                  .to(preLeft,  { xPercent: -100, duration: 1.1, ease: 'power3.inOut' }, '-=0.25')
                  .to(preRight, { xPercent:  100, duration: 1.1, ease: 'power3.inOut' }, '<')
                  .set(preloader, { display: 'none' });
            } else if (preloader) {
                tl.to(preloader, { opacity: 0, duration: 1.2, ease: 'power2.inOut',
                                   onComplete: () => { preloader.style.display = 'none'; } });
            }

            tl.to('#glCanvas', { opacity: 1, duration: 3.5, ease: 'power2.inOut' }, '-=0.6');

            let split;
            const heroTitle = document.querySelector('.hero h1');
            if (heroTitle && typeof SplitType !== 'undefined') {
                heroTitle.style.opacity = 1;
                split = new SplitType(heroTitle, { types: 'words, chars' });
            }

            // All targets below are optional — null-guarded so missing elements
            // on any page never stall or warn in the GSAP timeline.
            tl.to('#topnav', { y: 0, duration: 1.4, ease: 'power3.out' }, '-=2.8');
            // .ambient SVG removed from design system — no tween needed.
            const metaSpans = gsap.utils.toArray('.meta-row span');
            if (metaSpans.length) tl.to(metaSpans, { opacity: 1, x: 0, duration: 1.0, stagger: 0.2, ease: 'power2.out' }, '-=2.2');
            if (split) {
                tl.from(split.chars, { opacity: 0, y: 20, rotateX: -90, stagger: 0.04, duration: 1.5, ease: 'back.out(1.5)' }, '-=1.6');
            }
            const heroRule = document.querySelector('.hero-rule');
            if (heroRule) tl.to(heroRule,   { width: 64, opacity: 1, duration: 1.3, ease: 'power3.inOut' }, '-=1.0');

            // ── Article pages use .front h1 (not .hero h1) ──────────────────
            // The bare `h1 { opacity: 0 }` CSS rule hides all h1s site-wide.
            // For article pages, reveal .front h1 with a simpler fade+lift.
            const frontTitle = document.querySelector('.front h1');
            if (frontTitle && !heroTitle) {
                // No .hero on this page — it's an article page.
                tl.fromTo(frontTitle,
                    { opacity: 0, y: 28 },
                    { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' },
                    '-=2.0'
                );
            } else if (frontTitle && heroTitle) {
                // Both exist (edge case) — reveal the front title too.
                tl.to(frontTitle, { opacity: 1, duration: 1.0, ease: 'power2.out' }, '-=0.5');
            }

            // ── .abstract reveal ─────────────────────────────────────────────
            // Works for both .hero .abstract (index) and .front .abstract (articles).
            const abstractEl = document.querySelector('.abstract');
            if (abstractEl) tl.to(abstractEl, { opacity: 1, y: 0, duration: 1.3, ease: 'power2.out' }, '-=0.9');
            const scrollCue = document.querySelector('.scroll-cue');
            if (scrollCue) tl.to(scrollCue,  { opacity: 1, duration: 1.2, ease: 'power2.out' }, '-=0.3');


            function initScrollTriggers() {
                gsap.to('.scroll-cue', {
                    opacity: 0, y: -10, duration: 0.6, ease: 'power2.in',
                    scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=120', scrub: true }
                });
                gsap.utils.toArray('.band').forEach(band => {
                    const tlBand = gsap.timeline({
                        scrollTrigger: { trigger: band, start: 'top 75%', toggleActions: 'play none none none' }
                    });
                    const eyebrow = band.querySelector('.section-eyebrow');
                    const heading = band.querySelector('.section-heading');
                    if (eyebrow) tlBand.fromTo(eyebrow, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out' });
                    if (heading) tlBand.fromTo(heading, { opacity: 0, y: 25  }, { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' }, '-=0.6');
                    const reveals = band.querySelectorAll('.type-block, .swatch-grid, .tagrow, .p-card, .r-card, .demo-box, .dashboard-layout');
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
            }
        }; // end doTimeline

        if (document.readyState === 'complete') {
            doTimeline(); // window already loaded — run now
        } else {
            window.addEventListener('load', doTimeline);
        }
    }; // end runOrchestration

    loadSeq(gsapDeps, runOrchestration);
})(); // end mountOrchestration IIFE
