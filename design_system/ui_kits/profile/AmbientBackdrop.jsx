// AmbientBackdrop.jsx — Three.js icosahedron + cursor halo. Optional.
const AmbientBackdrop = () => {
  React.useEffect(() => {
    if (!window.THREE) return;
    const canvas = document.getElementById('glCanvas');
    if (!canvas) return;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const resize = () => renderer.setSize(window.innerWidth, window.innerHeight);
    resize(); window.addEventListener('resize', resize);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 16);
    const geo = new THREE.IcosahedronGeometry(12, 2);
    const mat = new THREE.MeshBasicMaterial({ color: 0x4D8CFF, wireframe: true, transparent: true, opacity: 0.04 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(10, 0, -15);
    scene.add(mesh);
    let raf;
    const animate = () => {
      mesh.rotation.y += 0.0005;
      mesh.rotation.x += 0.0002;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    // Cursor halo
    const halo = document.getElementById('cursorHalo');
    let mx = 0, my = 0, hx = 0, hy = 0;
    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    document.addEventListener('mousemove', onMove);
    let raf2;
    const tick = () => {
      hx += (mx - hx) * 0.08; hy += (my - hy) * 0.08;
      if (halo) { halo.style.left = (hx - 100) + 'px'; halo.style.top = (hy - 100) + 'px'; }
      raf2 = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); cancelAnimationFrame(raf2); document.removeEventListener('mousemove', onMove); };
  }, []);
  return (
    <React.Fragment>
      <canvas id="glCanvas" style={{position:'fixed',inset:0,zIndex:-30,pointerEvents:'none',background:'var(--obsidian)'}}/>
      <div id="cursorHalo" style={{position:'fixed',width:200,height:200,borderRadius:'50%',mixBlendMode:'screen',background:'radial-gradient(circle,rgba(255,255,255,0.06) 0%,rgba(77,140,255,0.03) 40%,transparent 70%)',pointerEvents:'none',zIndex:5}}/>
    </React.Fragment>
  );
};
window.AmbientBackdrop = AmbientBackdrop;
