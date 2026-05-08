/**
 * Cinematic WebGL Engine (Spatial Narrative)
 * Unified Single Canvas for high-performance Starfield + Particle Network.
 * Prevents GPU bottlenecking and backdrop-filter conflict.
 */

const initCinematicEngine = () => {
    if (typeof THREE === 'undefined') return;

    const container = document.getElementById('glCanvas');
    if (!container) return;

    // Use WebGL renderer attached to the canvas
    const renderer = new THREE.WebGLRenderer({ canvas: container, alpha: true, antialias: false });
    // Cap pixel ratio to save GPU cycles while maintaining sharpness
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2500);
    camera.position.z = 120;
    
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
    
    // ==========================================
    // 1. STARFIELD (Background Layer)
    // ==========================================
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1200; // Efficient count
    const starPos = new Float32Array(starCount * 3);
    for(let i=0; i<starCount; i++) {
        starPos[i*3] = (Math.random() - 0.5) * 2000;
        starPos[i*3+1] = (Math.random() - 0.5) * 2000;
        starPos[i*3+2] = (Math.random() - 0.5) * 2000 - 400; // Push back
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMaterial = new THREE.PointsMaterial({ 
        color: 0x4D8CFF, 
        size: 1.8, 
        transparent: true, 
        opacity: 0.45, 
        sizeAttenuation: true 
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // ==========================================
    // 2. PARTICLE NETWORK (Midground Layer)
    // ==========================================
    const particleCount = 45; // Sparse, elegant
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const targetPositions = new Float32Array(particleCount * 3); 
    const floatingPositions = new Float32Array(particleCount * 3); 
    const velocities = [];

    // Initialize Random Cloud & Target Neural Topology
    for (let i = 0; i < particleCount; i++) {
        const rx = (Math.random() - 0.5) * 200;
        const ry = (Math.random() - 0.5) * 200;
        const rz = (Math.random() - 0.5) * 160;
        
        positions[i*3] = rx;
        positions[i*3+1] = ry;
        positions[i*3+2] = rz;
        
        floatingPositions[i*3] = rx;
        floatingPositions[i*3+1] = ry;
        floatingPositions[i*3+2] = rz;
        
        const layer = Math.floor(Math.random() * 4);
        targetPositions[i*3] = (layer - 1.5) * 50; 
        targetPositions[i*3+1] = (Math.random() - 0.5) * 90; 
        targetPositions[i*3+2] = (Math.random() - 0.5) * 30; 
        
        velocities.push({
            x: (Math.random() - 0.5) * 0.04,
            y: (Math.random() - 0.5) * 0.04,
            z: (Math.random() - 0.5) * 0.04
        });
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Circular alpha map for particles
    const circleCanvas = document.createElement('canvas');
    circleCanvas.width = 32; circleCanvas.height = 32;
    const ctx = circleCanvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(16, 16, 14, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    const texture = new THREE.CanvasTexture(circleCanvas);

    const pMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 3.0,
        map: texture,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particles, pMaterial);
    scene.add(particleSystem);

    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x4D8CFF,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });
    
    // Interactive Parallax Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - width / 2) * 0.05;
        mouseY = (e.clientY - height / 2) * 0.05;
    });

    // Handle scroll for parallax without triggering GSAP layout thrash
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY * 0.05;
    }, { passive: true });

    let linesMesh;

    // Main Render Loop
    const renderSpace = () => {
        // Smooth camera follow
        targetX = mouseX * 0.6;
        targetY = mouseY * 0.6;
        camera.position.x += (targetX - camera.position.x) * 0.02;
        camera.position.y += (-targetY - scrollY - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        // Starfield slow drift
        starField.rotation.y += 0.0003;
        starField.rotation.x += 0.0001;

        // Particle system morph and connect
        const positions = particleSystem.geometry.attributes.position.array;
        let linePositions = [];
        
        for (let i = 0; i < particleCount; i++) {
            floatingPositions[i*3] += velocities[i].x;
            floatingPositions[i*3+1] += velocities[i].y;
            floatingPositions[i*3+2] += velocities[i].z;
            
            // Soft boundary bounce
            if (Math.abs(floatingPositions[i*3]) > 140) velocities[i].x *= -1;
            if (Math.abs(floatingPositions[i*3+1]) > 140) velocities[i].y *= -1;
            if (Math.abs(floatingPositions[i*3+2]) > 140) velocities[i].z *= -1;
            
            // Sine wave morph between random cloud and neural topology
            const morphFactor = Math.sin(Date.now() * 0.0004) * 0.5 + 0.5;
            
            positions[i*3] = floatingPositions[i*3] * (1 - morphFactor) + targetPositions[i*3] * morphFactor;
            positions[i*3+1] = floatingPositions[i*3+1] * (1 - morphFactor) + targetPositions[i*3+1] * morphFactor;
            positions[i*3+2] = floatingPositions[i*3+2] * (1 - morphFactor) + targetPositions[i*3+2] * morphFactor;

            // Connect nearby nodes
            for(let j = i+1; j < particleCount; j++) {
                const dx = positions[i*3] - positions[j*3];
                const dy = positions[i*3+1] - positions[j*3+1];
                const dz = positions[i*3+2] - positions[j*3+2];
                const distSq = dx*dx + dy*dy + dz*dz;
                
                // Draw line if close enough
                if(distSq < 1800) {
                    linePositions.push(
                        positions[i*3], positions[i*3+1], positions[i*3+2],
                        positions[j*3], positions[j*3+1], positions[j*3+2]
                    );
                }
            }
        }
        
        particleSystem.geometry.attributes.position.needsUpdate = true;
        
        // Rebuild lines mesh
        if (linesMesh) {
            scene.remove(linesMesh);
            linesMesh.geometry.dispose();
        }
        
        if (linePositions.length > 0) {
            const lineGeom = new THREE.BufferGeometry();
            lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            linesMesh = new THREE.LineSegments(lineGeom, lineMaterial);
            scene.add(linesMesh);
        }

        renderer.render(scene, camera);
        requestAnimationFrame(renderSpace);
    };
    
    // Initial fade in for the canvas
    gsap.to(container, { opacity: 1, duration: 2.5, ease: 'power2.inOut', delay: 0.5 });
    
    requestAnimationFrame(renderSpace);
};

// Ensure loading happens safely
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCinematicEngine);
} else {
    initCinematicEngine();
}