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

                    // Starfield layers
                    vec3 color = vec3(0.01, 0.01, 0.015); // Deep space background
                    
                    float t = u_time * 0.02;
                    for(float i=0.0; i<3.0; i++) {
                        vec2 q = uv * (1.0 + i*0.5) + t * (i+1.0)*0.1;
                        vec2 id = floor(q * 10.0);
                        vec2 f = fract(q * 10.0) - 0.5;
                        
                        float h = hash(id + i);
                        if(h > 0.95) { // Star density
                            float r = length(f);
                            // Glow attenuation
                            float glow = 0.01 / (r * r + 0.01);
                            // Twinkle
                            glow *= 0.5 + 0.5 * sin(u_time * (h * 5.0) + h * 10.0);
                            vec3 starColor = mix(vec3(0.3, 0.5, 1.0), vec3(1.0, 0.9, 0.8), hash(id*2.0));
                            color += starColor * glow * 0.5;
                        }
                    }

                    // Ambient vignette
                    float dist = length(uv);
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
    
    // Parallax tracking camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.z = 100;
    
    // Physics states
    const particleCount = 80; // Keep it optimal
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
            x: (Math.random() - 0.5) * 0.25,
            y: (Math.random() - 0.5) * 0.25,
            z: (Math.random() - 0.5) * 0.25
        });
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('targetPosition', new THREE.BufferAttribute(targetPositions, 3));

    // Particle Material
    const pMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.5,
        transparent: true,
        opacity: 0.6,
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
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    
    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(linesMesh);

    // Force visibility to bypass any GSAP opacity issues
    container.style.opacity = '1';

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

    const baseColor = new THREE.Color(0x1a3a6b);
    const highlightColor = new THREE.Color(0x4d8cff);

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

            // Mouse Repulsion
            const dxm = x - mouseWorldX;
            const dym = y - mouseWorldY;
            const distMouseSq = dxm*dxm + dym*dym;
            
            if (distMouseSq < 1500) {
                const repulseForce = (1500 - distMouseSq) / 1500;
                const angle = Math.atan2(dym, dxm);
                velocities[i].x += Math.cos(angle) * repulseForce * 0.02;
                velocities[i].y += Math.sin(angle) * repulseForce * 0.02;
            }

            // Restore velocities slowly back to original range so they don't accelerate infinitely
            const currentSpeedSq = velocities[i].x*velocities[i].x + velocities[i].y*velocities[i].y + velocities[i].z*velocities[i].z;
            if(currentSpeedSq > 0.0625) { // max speed ~0.25
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

                const connectDistance = morphFactor > 0.5 ? 6000 : 4000; // Large enough to guarantee multiple connections (distance ~63-77)

                if (distSq < connectDistance) {
                    if (lineIdx < maxLines) {
                        linePositions[lineIdx*6] = finalX; linePositions[lineIdx*6+1] = finalY; linePositions[lineIdx*6+2] = finalZ;
                        linePositions[lineIdx*6+3] = posAttr.getX(j); linePositions[lineIdx*6+4] = posAttr.getY(j); linePositions[lineIdx*6+5] = posAttr.getZ(j);

                        const alpha = 1.0 - (distSq / connectDistance);
                        // Increase base opacity modifier to 2.5 to make lines very bright and distinct
                        const intensity = alpha * (1.0 + morphFactor) * 2.5;
                        const c = baseColor.clone().lerp(highlightColor, alpha);

                        lineColors[lineIdx*6] = c.r * intensity; lineColors[lineIdx*6+1] = c.g * intensity; lineColors[lineIdx*6+2] = c.b * intensity;
                        lineColors[lineIdx*6+3] = c.r * intensity; lineColors[lineIdx*6+4] = c.g * intensity; lineColors[lineIdx*6+5] = c.b * intensity;

                        lineIdx++;
                    }
                }
            }

            // Connect to mouse pointer
            if (distMouseSq < 3000 && lineIdx < maxLines) {
                linePositions[lineIdx*6] = finalX; linePositions[lineIdx*6+1] = finalY; linePositions[lineIdx*6+2] = finalZ;
                linePositions[lineIdx*6+3] = mouseWorldX; linePositions[lineIdx*6+4] = mouseWorldY; linePositions[lineIdx*6+5] = 0;

                const alpha = 1.0 - (distMouseSq / 3000);
                const intensity = alpha * 3.0; // Very bright mouse connections
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
