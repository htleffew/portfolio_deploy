/* ============================================================
   cinematic_engine_v3.js — Three.js Cinematic WebGL Engine
   Renders the deep-space starfield and interactive node network
   behind every page. Self-bootstrapping: injects #glCanvas if
   absent, dynamically loads three.min.js if needed, then runs
   initCinematicEngine() on DOMContentLoaded.
   Extracted 2026-06-05 from global.js.
   ============================================================ */
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
