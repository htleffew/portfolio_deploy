/**
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
        color: 0x4d8cff, // Sapphire glow
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
    const baseColor = new THREE.Color(0x0f52ba); // Deep Sapphire
    const highlightColor = new THREE.Color(0x4d8cff); // Light Sapphire

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
