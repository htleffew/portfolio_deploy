/* === cinematic_engine_v3.js === */
﻿/**
 * Cinematic WebGL Engine (Spatial Narrative)
 * 1. Raw GLSL Deep Space Starfield
 * 2. Three.js Particle Network with Morphing & ShaderMaterial Filaments
 */

const initCinematicEngine = () => {
    // ==========================================
    // 1. RAW GLSL DEEP SPACE STARFIELD
    // ==========================================
    const canvas = document.getElementById('deep-space');
    if (canvas) {
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            // Resize handler
            const resize = () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                gl.viewport(0, 0, canvas.width, canvas.height);
            };
            window.addEventListener('resize', resize);
            resize();

            // Shaders
            const vsSource = `
                attribute vec2 position;
                void main() {
                    gl_Position = vec4(position, 0.0, 1.0);
                }
            `;
            const fsSource = `
                precision mediump float;
                uniform vec2 u_resolution;
                uniform float u_time;

                // Simple pseudo-random
                float hash(vec2 p) {
                    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
                }

                void main() {
                    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                    uv = uv * 2.0 - 1.0;
                    uv.x *= u_resolution.x / u_resolution.y;

                    // Slow organic rotation of the entire field
                    float rotTime = u_time * 0.02;
                    float s = sin(rotTime), c = cos(rotTime);
                    mat2 rot = mat2(c, -s, s, c);
                    uv *= rot;

                    // Starfield layers
                    vec3 color = vec3(0.01, 0.01, 0.015); // Deep space background
                    
                    float t = u_time * 0.05; // Base drift speed
                    for(float i=0.0; i<3.0; i++) {
                        // Each layer scales differently and drifts in different directions
                        vec2 q = uv * (1.0 + i*0.8);
                        q.y += t * (0.2 + i*0.1); // Continuous upward drift
                        q.x -= t * (0.1 + i*0.05); // Slight lateral drift
                        
                        vec2 id = floor(q * 10.0);
                        vec2 f = fract(q * 10.0) - 0.5;
                        
                        float h = hash(id + i);
                        if(h > 0.95) { // Star density
                            float r = length(f);
                            float glow = 0.01 / (r * r + 0.01);
                            
                            // Complex overlapping twinkle (no hard blinks)
                            float twinkle1 = sin(u_time * 1.5 + h * 100.0);
                            float twinkle2 = cos(u_time * 0.8 + h * 50.0);
                            float pulse = 0.6 + 0.4 * (twinkle1 * twinkle2);
                            
                            glow *= pulse;
                            
                            vec3 starColor = mix(vec3(0.1, 0.3, 0.8), vec3(0.6, 0.8, 1.0), hash(id*2.0));
                            color += starColor * glow * (0.4 + i*0.2); // Depth dimming
                        }
                    }

                    // Ambient vignette
                    float dist = length(gl_FragCoord.xy / u_resolution.xy * 2.0 - 1.0);
                    color *= 1.0 - smoothstep(0.5, 2.0, dist);

                    gl_FragColor = vec4(color, 1.0);
                }
            `;

            // Compile shader helper
            const compileShader = (type, source) => {
                const s = gl.createShader(type);
                gl.shaderSource(s, source);
                gl.compileShader(s);
                return s;
            };

            const program = gl.createProgram();
            gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vsSource));
            gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fsSource));
            gl.linkProgram(program);
            gl.useProgram(program);

            // Fullscreen quad
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                -1,-1,  1,-1, -1,1,
                 1,-1,  1,1,  -1,1
            ]), gl.STATIC_DRAW);

            const posLoc = gl.getAttribLocation(program, "position");
            gl.enableVertexAttribArray(posLoc);
            gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

            const resLoc = gl.getUniformLocation(program, "u_resolution");
            const timeLoc = gl.getUniformLocation(program, "u_time");

            const renderSpace = (time) => {
                gl.uniform2f(resLoc, canvas.width, canvas.height);
                gl.uniform1f(timeLoc, time * 0.001);
                gl.drawArrays(gl.TRIANGLES, 0, 6);
                requestAnimationFrame(renderSpace);
            };
            requestAnimationFrame(renderSpace);
        }
    }

    // ==========================================
    // 2. THREE.JS PARTICLE NETWORK
    // ==========================================
    if (typeof THREE === 'undefined') return;

    const container = document.getElementById('glCanvas');
    if (!container) return;

    // Use WebGL renderer attached to the canvas
    const renderer = new THREE.WebGLRenderer({ canvas: container, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Resize handler
    let width = window.innerWidth;
    let height = window.innerHeight;
    // Parallax tracking camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.z = 100;
    
    const resizeThree = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resizeThree);
    resizeThree();
    
    const scene = new THREE.Scene();
    
    // Physics states (Ultra-sparse, elegant)
    const particleCount = 35; // Reduced from 80 for extreme sparsity
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3); // For neural morphing
    const floatingPositions = new Float32Array(particleCount * 3); // True un-lerped positions
    const velocities = [];

    // Initialize Random Cloud & Target Neural Topology
    for (let i = 0; i < particleCount; i++) {
        // Random Cloud
        const rx = (Math.random() - 0.5) * 160;
        const ry = (Math.random() - 0.5) * 160;
        const rz = (Math.random() - 0.5) * 160;
        
        positions[i*3] = rx;
        positions[i*3+1] = ry;
        positions[i*3+2] = rz;
        
        floatingPositions[i*3] = rx;
        floatingPositions[i*3+1] = ry;
        floatingPositions[i*3+2] = rz;
        
        // Neural Node Targets (Simulated structure)
        const layer = Math.floor(Math.random() * 4); // 4 layers
        targetPositions[i*3] = (layer - 1.5) * 40; // X spread by layer
        targetPositions[i*3+1] = (Math.random() - 0.5) * 80; // Y spread
        targetPositions[i*3+2] = (Math.random() - 0.5) * 20; // Z spread
        
        velocities.push({
            x: (Math.random() - 0.5) * 0.02, // Extremely slow drift
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        });
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('targetPosition', new THREE.BufferAttribute(targetPositions, 3));

    // Generate circular alpha map for particles
    const circleCanvas = document.createElement('canvas');
    circleCanvas.width = 32;
    circleCanvas.height = 32;
    const ctx = circleCanvas.getContext('2d');
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    const circleTexture = new THREE.CanvasTexture(circleCanvas);

    // Particle Material - Deep integration with starfield
    const pMaterial = new THREE.PointsMaterial({
        color: 0x4d8cff, // Phthalo Lift glow
        size: 4.5,
        map: circleTexture,
        transparent: true,
        opacity: 0.35, // Very soft
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    const particleSystem = new THREE.Points(particles, pMaterial);
    
    // Add scroll parallax class for native CSS timelines (Phase 1)
    container.classList.add('particle-network-layer');
    scene.add(particleSystem);

    // Dynamic Connections (Neon Filaments via ShaderMaterial)
    // We will use standard LineBasicMaterial with opacity for performance, as real ShaderMaterial lines 
    // require heavy thick-line geometric expansion to look good, which hits performance. 
    // But we will use AdditiveBlending to simulate neon.
    const maxLines = 2500;
    const linesGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);
    
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    linesGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    
    const linesMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.25, // Extremely faint base opacity
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(linesMesh);

    // Force visibility to bypass any GSAP opacity issues
    container.style.opacity = '1';
    container.style.display = 'block';

    console.log("Cinematic engine initialized, rendering Three.js particles:", particleCount);

    // Interactivity
    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / width) * 2 - 1;
        mouseY = -(e.clientY / height) * 2 + 1;
    });

    // Morph State driven by Scroll (simulated globally here, real ScrollTrigger hooks in GSAP later)
    let morphFactor = 0;
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.create({
            trigger: "#executive-bio",
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
            onUpdate: (self) => { morphFactor = self.progress; }
        });
    }

    // Refined Palette (Tied to deep-space background)
    const baseColor = new THREE.Color(0x0f52ba); // Deep Phthalo Lift
    const highlightColor = new THREE.Color(0x4d8cff); // Light Phthalo Lift

    const animate = () => {
        requestAnimationFrame(animate);

        // Camera Parallax based on mouse (Spatial awareness)
        camera.position.x += (mouseX * 15 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 15 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        const posAttr = particles.attributes.position;
        const targetAttr = particles.attributes.targetPosition;
        let lineIdx = 0;

        // Interactive Mouse World coords
        const mouseWorldX = mouseX * 80;
        const mouseWorldY = mouseY * 80;

        for (let i = 0; i < particleCount; i++) {
            let x = floatingPositions[i*3];
            let y = floatingPositions[i*3+1];
            let z = floatingPositions[i*3+2];

            x += velocities[i].x;
            y += velocities[i].y;
            z += velocities[i].z;

            // Mouse Repulsion (Extremely gentle nudge, not chaotic)
            const dxm = x - mouseWorldX;
            const dym = y - mouseWorldY;
            const distMouseSq = dxm*dxm + dym*dym;
            
            if (distMouseSq < 2000) {
                const repulseForce = (2000 - distMouseSq) / 2000;
                const angle = Math.atan2(dym, dxm);
                velocities[i].x += Math.cos(angle) * repulseForce * 0.002;
                velocities[i].y += Math.sin(angle) * repulseForce * 0.002;
            }

            // Restore velocities slowly back to original range
            const currentSpeedSq = velocities[i].x*velocities[i].x + velocities[i].y*velocities[i].y + velocities[i].z*velocities[i].z;
            if(currentSpeedSq > 0.001) { // max speed extremely low
                velocities[i].x *= 0.98;
                velocities[i].y *= 0.98;
                velocities[i].z *= 0.98;
            }

            // Bounds wrapping (wall bounce instead of warp so lines don't streak across screen)
            if (x > 80 || x < -80) { velocities[i].x *= -1; x = Math.max(-80, Math.min(80, x)); }
            if (y > 80 || y < -80) { velocities[i].y *= -1; y = Math.max(-80, Math.min(80, y)); }
            if (z > 80 || z < -80) { velocities[i].z *= -1; z = Math.max(-80, Math.min(80, z)); }

            floatingPositions[i*3] = x;
            floatingPositions[i*3+1] = y;
            floatingPositions[i*3+2] = z;

            // Neural Morphing Lerp
            const tx = targetAttr.getX(i);
            const ty = targetAttr.getY(i);
            const tz = targetAttr.getZ(i);

            // Mix floating position with target position based on morphFactor
            const finalX = x + (tx - x) * morphFactor;
            const finalY = y + (ty - y) * morphFactor;
            const finalZ = z + (tz - z) * morphFactor;

            posAttr.setXYZ(i, finalX, finalY, finalZ);

            // Connect nearby nodes
            for (let j = i + 1; j < particleCount; j++) {
                const dx = finalX - posAttr.getX(j);
                const dy = finalY - posAttr.getY(j);
                const dz = finalZ - posAttr.getZ(j);
                const distSq = dx*dx + dy*dy + dz*dz;

                const connectDistance = morphFactor > 0.5 ? 4000 : 3500; // Sparse, elegant constellation

                if (distSq < connectDistance) {
                    if (lineIdx < maxLines) {
                        linePositions[lineIdx*6] = finalX; linePositions[lineIdx*6+1] = finalY; linePositions[lineIdx*6+2] = finalZ;
                        linePositions[lineIdx*6+3] = posAttr.getX(j); linePositions[lineIdx*6+4] = posAttr.getY(j); linePositions[lineIdx*6+5] = posAttr.getZ(j);

                        const alpha = Math.pow(1.0 - (distSq / connectDistance), 2.0); // Non-linear falloff for elegant depth
                        
                        // Increase brightness if the connection is near the mouse
                        const midX = (finalX + posAttr.getX(j)) * 0.5;
                        const midY = (finalY + posAttr.getY(j)) * 0.5;
                        const dMouseSq = (midX - mouseWorldX)*(midX - mouseWorldX) + (midY - mouseWorldY)*(midY - mouseWorldY);
                        
                        let mouseGlow = 0;
                        if (dMouseSq < 3000) {
                            mouseGlow = Math.pow(1.0 - (dMouseSq / 3000), 2.0) * 0.8; // Gentle highlight, not blinding
                        }

                        const intensity = (alpha * 0.6) + mouseGlow; // Faint base, soft highlight
                        const c = baseColor.clone().lerp(highlightColor, Math.min(1.0, alpha + mouseGlow));

                        lineColors[lineIdx*6] = c.r * intensity; lineColors[lineIdx*6+1] = c.g * intensity; lineColors[lineIdx*6+2] = c.b * intensity;
                        lineColors[lineIdx*6+3] = c.r * intensity; lineColors[lineIdx*6+4] = c.g * intensity; lineColors[lineIdx*6+5] = c.b * intensity;

                        lineIdx++;
                    }
                }
            }

            // Connect to mouse pointer - reduced density, highly elegant
            if (distMouseSq < 1500 && lineIdx < maxLines) {
                linePositions[lineIdx*6] = finalX; linePositions[lineIdx*6+1] = finalY; linePositions[lineIdx*6+2] = finalZ;
                linePositions[lineIdx*6+3] = mouseWorldX; linePositions[lineIdx*6+4] = mouseWorldY; linePositions[lineIdx*6+5] = 0;

                const alpha = 1.0 - (distMouseSq / 1500);
                const intensity = alpha * 0.7; // Very soft glow
                lineColors[lineIdx*6] = highlightColor.r * intensity; lineColors[lineIdx*6+1] = highlightColor.g * intensity; lineColors[lineIdx*6+2] = highlightColor.b * intensity;
                lineColors[lineIdx*6+3] = highlightColor.r * intensity; lineColors[lineIdx*6+4] = highlightColor.g * intensity; lineColors[lineIdx*6+5] = highlightColor.b * intensity;
                
                lineIdx++;
            }
        }

        posAttr.needsUpdate = true;
        linesGeometry.setDrawRange(0, lineIdx * 2);
        linesGeometry.attributes.position.needsUpdate = true;
        linesGeometry.attributes.color.needsUpdate = true;

        // Overall rotation for ambient feel
        particleSystem.rotation.y += 0.001;
        linesMesh.rotation.y += 0.001;

        renderer.render(scene, camera);
    };

    animate();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCinematicEngine);
} else {
    initCinematicEngine();
}


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
                   window.location.pathname.split('/').pop() === 'index.html' && window.location.pathname.split('/').slice(-2)[0] !== 'ADOS' && window.location.pathname.split('/').slice(-2)[0] !== 'AI_Equity_Framework' ||
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




// ==========================================
// GLOBAL CINEMATIC REVEAL ORCHESTRATION
// ==========================================
window.addEventListener('load', () => {
    if (window.disableGlobalOrchestration) return;
    if (typeof gsap !== 'undefined') {
        const tl = gsap.timeline({
            onComplete: () => {
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                    initScrollTriggers();
                }
            }
        });

        const preloader = document.getElementById('preloader');
        const preLeft = document.getElementById('preloader-left');
        const preRight = document.getElementById('preloader-right');
        const preLine = document.getElementById('preloader-line');
        if (preloader && preLeft && preRight && preLine) {
            tl.to(preLine, { height: '28vh', duration: 1.1, ease: 'power2.inOut' })
              .to(preLine, { opacity: 0, height: '50vh', duration: 0.6, ease: 'power2.in' }, '+=0.15')
              .to(preLeft, { xPercent: -100, duration: 1.1, ease: 'power3.inOut' }, '-=0.25')
              .to(preRight, { xPercent: 100, duration: 1.1, ease: 'power3.inOut' }, '<')
              .set(preloader, { display: 'none' });
        } else if (preloader) {
            tl.to(preloader, { opacity: 0, duration: 1.2, ease: 'power2.inOut', onComplete: () => { preloader.style.display = 'none'; } });
        }

        // Fade in the spatial void (managed by cinematic_engine_v3)
        tl.to(['#deep-space', '#glCanvas'], { opacity: 1, duration: 3.5, ease: 'power2.inOut' }, "-=0.6");

        let split;
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle && typeof SplitType !== 'undefined') {
            heroTitle.style.opacity = 1;
            split = new SplitType(heroTitle, { types: 'words, chars' });
        }

        tl.to('#topnav', { y: 0, duration: 1.4, ease: 'power3.out' }, "-=2.8");
        tl.to('.ambient', { opacity: 0.35, scale: 1, rotation: 0, duration: 3.0, ease: 'power2.out' }, "-=2.8");
        tl.to('.meta-row span', { opacity: 1, x: 0, duration: 1.0, stagger: 0.2, ease: 'power2.out' }, "-=2.2");
        if (split) {
            tl.from(split.chars, { opacity: 0, y: 20, rotateX: -90, stagger: 0.04, duration: 1.5, ease: 'back.out(1.5)' }, "-=1.6");
        }
        tl.to('.hero-rule', { width: 64, opacity: 1, duration: 1.3, ease: 'power3.inOut' }, "-=1.0");
        tl.to('.abstract', { opacity: 1, y: 0, duration: 1.3, ease: 'power2.out' }, "-=0.9");
        tl.to('.scroll-cue', { opacity: 1, duration: 1.2, ease: 'power2.out' }, "-=0.3");

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
                if (heading) tlBand.fromTo(heading, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' }, '-=0.6');
                
                const reveals = band.querySelectorAll('.type-block, .swatch-grid, .tagrow, .p-card, .r-card, .demo-box, .dashboard-layout');
                if (reveals.length) {
                    tlBand.fromTo(reveals, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.5, stagger: 0.15, ease: 'expo.out' }, '-=0.8');
                }
            });

            // Independent reveals for long-form case study paragraphs
            gsap.utils.toArray('.reveal, .ds-prose').forEach(el => {
                gsap.fromTo(el, { opacity: 0, y: 40 }, {
                    opacity: 1, y: 0, duration: 1.2, ease: 'expo.out',
                    scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
                });
            });
        }
    } else {
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.style.display = 'none';
        document.querySelectorAll('.meta-row span, h1, .hero-rule, .abstract, .ambient, #glCanvas, #deep-space, .scroll-cue, .band .section-eyebrow, .band .section-heading, .type-block, .swatch-grid, .tagrow, .p-card, .r-card, .demo-box, .dashboard-layout').forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });
    }
});
